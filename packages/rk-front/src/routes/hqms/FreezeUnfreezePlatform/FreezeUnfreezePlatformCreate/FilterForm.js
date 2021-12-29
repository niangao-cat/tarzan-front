/*
 * @Description: 查询
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-22 15:49:57
 * @LastEditTime: 2021-02-26 16:32:33
 */
import React, { useImperativeHandle, useState, useRef, forwardRef } from 'react';
import { Form, Button, Input, Row, Col, Select, DatePicker } from 'hzero-ui';
import { uniq, compact } from 'lodash';
import Lov from 'components/Lov';
import MultipleLov from '@/components/MultipleLov';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import moment from 'moment';
import intl from 'utils/intl';
import { getSiteId } from '../../../../utils/utils';

/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

const FilterForm = (props, ref) => {

  const [waferList, setWaferList] = useState([]);
  const [virtualNumList, setVirtualNumList] = useState([]);
  const [hotSinkNumList, setHotSinkNumList] = useState([]);
  const [purchasedSnList, setPurchasedSnList] = useState([]);

  const formRef = useRef();

  useImperativeHandle(ref, () => ({
    formFields: props.form.getFieldsValue(),
  }));

  // 重置
  const handleFormReset = async () => {
    form.resetFields();
    const { handleTableReset } = props;
    handleTableReset();
  };

  // const handleSearch = () => {
  //   const { handleFetchSn, form } = props;
  //   if (handleFetchSn) {
  //     form.validateFields((err, values) => {
  //       if (!err) {
  //         handleFetchSn(values);
  //       }
  //     });
  //   }
  // };

  const handleClickCreate = () => {
    const { handleCreate, form, snList } = props;
    if (handleCreate) {
      form.validateFields((err, values) => {
        if (!err) {
          handleCreate(values, snList);
        }
      });
    }
  };

  const handleChangeFreezeType = () => {
    const { form } = props;
    form.resetFields();
  };

  const handleListOnSearch = (value, typeList, type) => {
    const flag = value ? value.every(e => typeList.includes(e)) : false;
    if (value && value.length > 0 && (!flag || (value.length - typeList.length) === 1)) {
      // excel copy的情况
      const list = value[value.length === 0 ? 0 : value.length - 1].split(/[ ]+/);
      const uniplist = uniq(typeList.concat(compact(list)));
      switch (type) {
        case 'wafer':
          setWaferList(uniplist);
          form.setFieldsValue({ wafer: uniplist });
          break;
        case 'virtualNum':
          setVirtualNumList(uniplist);
          form.setFieldsValue({ virtualNum: uniplist });
          break;
        case 'hotSinkNum':
          setHotSinkNumList(uniplist);
          form.setFieldsValue({ hotSinkNum: uniplist });
          break;
        case 'purchasedSn':
          setPurchasedSnList(uniplist);
          form.setFieldsValue({ purchasedSn: uniplist});
          break;
        default:
          break;
      }
    }
  };

  const {
    form,
    tenantId,
    freezeType,
    cosType,
    createInfo,
    defaultSite,
    handleCreateLoading,
    snList,
  } = props;
  const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
  return (
    <Form className={SEARCH_FORM_CLASSNAME} ref={formRef}>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='冻结单号'>
            {getFieldDecorator('freezeDocNum', {
              initialValue: createInfo.freezeDocNum,
            })(
              <Input disabled />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='冻结类型'>
            {getFieldDecorator('freezeType', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '冻结类型',
                  }),
                },
              ],
            })(
              <Select
                style={{ width: '100%' }}
                allowClear
                onChange={handleChangeFreezeType}
                disabled={snList.length !== 0}
              >
                {freezeType.map(item => {
                  return (
                    <Select.Option value={item.value} key={item.value}>
                      {item.meaning}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工厂'>
            {getFieldDecorator('siteId', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '工厂',
                  }),
                },
              ],
              initialValue: defaultSite.siteId,
            })(
              <Lov
                code="MT.SITE"
                queryParams={{ tenantId }}
                textValue={defaultSite.siteCode}
              />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
          <FormItem>
            <Button style={{ marginLeft: 8 }} onClick={() => handleFormReset()}>
              重置
            </Button>
            {/* <Button
              type="primary"
              onClick={handleSearch}
            >
              查询
            </Button> */}
            <Button
              type="primary"
              icon='plus'
              onClick={handleClickCreate}
              disabled={createInfo.freezeDocNum}
              loading={handleCreateLoading}
            >
              创建
            </Button>
          </FormItem>
        </Col>
      </Row>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='物料'>
            {getFieldDecorator('materialId', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '物料',
                  }),
                },
              ],
            })(
              getFieldValue('freezeType') === 'COS_CHIP_INVENTORY' ? (
                <MultipleLov
                  code="MT.MATERIAL"
                  queryParams={{ tenantId }}
                  disabled={snList.length !== 0}
                />
              ) : (
                <Lov
                  code="MT.MATERIAL"
                  queryParams={{ tenantId }}
                  disabled={snList.length !== 0}
                />
              )
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='物料版本'>
            {getFieldDecorator('materialVersion')(
              <Input disabled={['M_INVENTORY', 'COS_CHIP_INVENTORY', 'COS_M_INVENTORY'].includes(getFieldValue('freezeType'))} />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='生产版本'>
            {getFieldDecorator('productionVersion')(
              <Lov
                code="HME.MATERIAL_VERSION"
                disabled={['P_INVENTORY', 'COS_P_INVENTORY', 'COS_CHIP_INVENTORY', 'COS_M_INVENTORY'].includes(getFieldValue('freezeType'))}
                queryParams={{
                  tenantId,
                  siteId: getSiteId(),
                  materialId: getFieldValue('materialId'),
                }}
              />
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='仓库'>
            {getFieldDecorator('warehouseId')(
              <Lov
                code="MT.WARE.HOUSE"
                queryParams={{ tenantId }}
                disabled={['M_INVENTORY', 'COS_CHIP_INVENTORY', 'COS_M_INVENTORY'].includes(getFieldValue('freezeType'))}
              />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='货位'>
            {getFieldDecorator('locatorId')(
              <Lov
                disabled={['M_INVENTORY', 'COS_CHIP_INVENTORY', 'COS_M_INVENTORY'].includes(getFieldValue('freezeType'))}
                code="MT.MTL_LOCATOR"
                queryParams={{
                  tenantId,
                  parentLocatorId: getFieldValue('warehouseId'),
                }}
              />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='供应商'>
            {getFieldDecorator('supplierId')(
              <Lov
                code="MT.SUPPLIER"
                disabled={['M_INVENTORY', 'COS_CHIP_INVENTORY', 'COS_M_INVENTORY'].includes(getFieldValue('freezeType'))}
                queryParams={{ tenantId }}
              />
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='库存批次'>
            {getFieldDecorator('inventoryLot')(
              <Input disabled={['M_INVENTORY', 'COS_CHIP_INVENTORY', 'COS_M_INVENTORY'].includes(getFieldValue('freezeType'))} />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='供应商批次'>
            {getFieldDecorator('supplierLot')(
              <Input disabled={['M_INVENTORY', 'COS_CHIP_INVENTORY', 'COS_M_INVENTORY'].includes(getFieldValue('freezeType'))} />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='实验代码'>
            {getFieldDecorator('testCode')(
              <Input disabled={['P_INVENTORY', 'COS_P_INVENTORY'].includes(getFieldValue('freezeType'))} />
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工单'>
            {getFieldDecorator('workOrderId')(
              <Lov
                code="MT.WORK_ORDER_NUM"
                queryParams={{ tenantId }}
                disabled={['P_INVENTORY', 'COS_P_INVENTORY'].includes(getFieldValue('freezeType'))}
              />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='设备'>
            {getFieldDecorator('equipmentId')(
              <Lov
                queryParams={{
                  tenantId,
                }}
                allowClear
                code="HME.EQUIPMENT"
                disabled={['P_INVENTORY', 'COS_P_INVENTORY'].includes(getFieldValue('freezeType'))}
              />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='生产线'>
            {getFieldDecorator('prodLineId')(
              <Lov
                code="MT.PRODLINE"
                queryParams={{ tenantId }}
                onChange={() => {
                  setFieldsValue({
                    workcellId: null,
                    processId: null,
                    stationId: null,
                  });
                }}
                disabled={['P_INVENTORY', 'COS_P_INVENTORY'].includes(getFieldValue('freezeType'))}
              />
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工段'>
            {getFieldDecorator('workcellId')(
              <Lov
                code="HME.FINAL_LINE"
                allowClear
                queryParams={{
                  prodLineId: getFieldValue('prodLineId'),
                  tenantId,
                  typeFlag: 'LINE',
                }}
                onChange={() => {
                  setFieldsValue({
                    processId: null,
                    stationId: null,
                  });
                }}
                disabled={['P_INVENTORY', 'COS_P_INVENTORY'].includes(getFieldValue('freezeType'))}
              />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工序'>
            {getFieldDecorator('processId')(
              <Lov
                code="HME.FINAL_PROCESS"
                allowClear
                queryParams={{
                  prodLineId: getFieldValue('prodLineId'),
                  lineWorkcellId: getFieldValue('workcellId'),
                  typeFlag: 'PROCESS',
                  tenantId,
                }}
                disabled={['P_INVENTORY', 'COS_P_INVENTORY'].includes(getFieldValue('freezeType'))}
              />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工位'>
            {getFieldDecorator('stationId')(
              <Lov
                code="HME.FINAL_WORKCELL"
                queryParams={{
                  tenantId,
                  processId: getFieldValue('processId'),
                  lineWorkcellId: getFieldValue('workcellId'),
                  prodLineId: getFieldValue('prodLineId'),
                }}
                disabled={['P_INVENTORY', 'COS_P_INVENTORY'].includes(getFieldValue('freezeType'))}
              />
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='操作人'>
            {getFieldDecorator('operatedBy')(
              <Lov
                code="HME.USER"
                queryParams={{ tenantId }}
                disabled={['P_INVENTORY', 'COS_P_INVENTORY'].includes(getFieldValue('freezeType'))}
              />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='COS类型'>
            {getFieldDecorator('cosType')(
              <Select
                disabled={['M_INVENTORY', 'P_INVENTORY', 'COS_P_INVENTORY'].includes(getFieldValue('freezeType'))}
                style={{ width: '100%' }}
                allowClear
              >
                {cosType.map(item => {
                  return (
                    <Select.Option value={item.value} key={item.value}>
                      {item.meaning}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item
            {...SEARCH_FORM_ITEM_LAYOUT}
            label='WAFER'
          >
            {getFieldDecorator('wafer')(
              <Select
                disabled={['M_INVENTORY', 'P_INVENTORY', 'COS_P_INVENTORY'].includes(getFieldValue('freezeType'))}
                mode="tags"
                style={{ width: '100%' }}
                onChange={
                  val => {
                    if (val.length === 0) {
                      setWaferList([]);
                    }
                  }
                }
                onBlur={val => handleListOnSearch(val, waferList, 'wafer')}
                allowClear
                dropdownMatchSelectWidth={false}
                maxTagCount={2}
              >
                {waferList.map(e => (
                  <Select.Option key={e} value={e}>
                    {e}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item
            {...SEARCH_FORM_ITEM_LAYOUT}
            label='虚拟号'
          >
            {getFieldDecorator('virtualNum')(
              <Select
                disabled={['M_INVENTORY', 'P_INVENTORY', 'COS_P_INVENTORY', 'COS_CHIP_INVENTORY'].includes(getFieldValue('freezeType'))}
                mode="tags"
                style={{ width: '100%' }}
                onChange={
                  val => {
                    if (val.length === 0) {
                      setVirtualNumList([]);
                    }
                  }
                }
                onBlur={val => handleListOnSearch(val, virtualNumList, 'virtualNum')}
                allowClear
                dropdownMatchSelectWidth={false}
                maxTagCount={2}
              >
                {virtualNumList.map(e => (
                  <Select.Option key={e} value={e}>
                    {e}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='金锡比'>
            {getFieldDecorator('ausnRatio')(
              <Input disabled={['M_INVENTORY', 'P_INVENTORY', 'COS_P_INVENTORY', 'COS_CHIP_INVENTORY'].includes(getFieldValue('freezeType'))} />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='筛选规则'>
            {getFieldDecorator('cosRuleId')(
              <Lov
                disabled={['M_INVENTORY', 'P_INVENTORY', 'COS_P_INVENTORY', 'COS_CHIP_INVENTORY'].includes(getFieldValue('freezeType'))}
                code="HME.COS_RULE"
                queryParams={{ tenantId }}
              />
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='班次'>
            {getFieldDecorator('shiftId')(
              <Lov
                code="HME.WKC_SHIFT"
                queryParams={{
                  tenantId,
                  stationId: getFieldValue('workcellId'),
                }}
                disabled={['P_INVENTORY', 'COS_P_INVENTORY'].includes(getFieldValue('freezeType'))}
              />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='生产时间从'>
            {getFieldDecorator('productionDateFrom')(
              <DatePicker
                style={{ width: '100%' }}
                showTime
                placeholder={null}
                format='YYYY-MM-DD HH:mm:ss'
                disabledDate={currentDate =>
                  getFieldValue('productionDateTo') &&
                  moment(getFieldValue('productionDateTo')).isBefore(currentDate, 'day')
                }
                disabled={['P_INVENTORY', 'COS_P_INVENTORY'].includes(getFieldValue('freezeType'))}
              />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='生产时间至'>
            {getFieldDecorator('productionDateTo')(
              <DatePicker
                style={{ width: '100%' }}
                showTime
                placeholder={null}
                format='YYYY-MM-DD HH:mm:ss'
                disabledDate={currentDate =>
                  getFieldValue('productionDateFrom') &&
                  moment(getFieldValue('productionDateFrom')).isAfter(currentDate, 'day')
                }
                disabled={['P_INVENTORY', 'COS_P_INVENTORY'].includes(getFieldValue('freezeType'))}
              />
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item
            {...SEARCH_FORM_ITEM_LAYOUT}
            label='热沉编码'
          >
            {getFieldDecorator('hotSinkNum')(
              <Select
                disabled={['M_INVENTORY', 'P_INVENTORY', 'COS_P_INVENTORY', 'COS_CHIP_INVENTORY'].includes(getFieldValue('freezeType'))}
                mode="tags"
                style={{ width: '100%' }}
                onChange={
                  val => {
                    if (val.length === 0) {
                      setHotSinkNumList([]);
                    }
                  }
                }
                onBlur={val => handleListOnSearch(val, hotSinkNumList, 'hotSinkNum')}
                allowClear
                dropdownMatchSelectWidth={false}
                maxTagCount={2}
              >
                {hotSinkNumList.map(e => (
                  <Select.Option key={e} value={e}>
                    {e}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item
            {...SEARCH_FORM_ITEM_LAYOUT}
            label='采购件序列号'
          >
            {getFieldDecorator('purchasedSn')(
              <Select
                disabled={['M_INVENTORY', 'COS_P_INVENTORY', 'COS_CHIP_INVENTORY', 'COS_M_INVENTORY'].includes(getFieldValue('freezeType'))}
                mode="tags"
                style={{ width: '100%' }}
                onChange={
                  val => {
                    if (val.length === 0) {
                      setVirtualNumList([]);
                    }
                  }
                }
                onBlur={val => handleListOnSearch(val, purchasedSnList, 'purchasedSn')}
                allowClear
                dropdownMatchSelectWidth={false}
                maxTagCount={2}
              >
                {purchasedSnList.map(e => (
                  <Select.Option key={e} value={e}>
                    {e}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default Form.create({ fieldNameProp: null })(forwardRef(FilterForm));
