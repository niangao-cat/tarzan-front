/*
 * @Description: 查询
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-02 09:45:02
 * @LastEditTime: 2021-02-03 10:07:17
 */
import React, { useImperativeHandle, useRef, forwardRef, useState } from 'react';
import { Form, Button, Row, Col, Select, DatePicker, Input } from 'hzero-ui';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import { uniq, compact, isEmpty } from 'lodash';
import { getDateTimeFormat } from 'utils/utils';
import moment from 'moment';
import MultipleLov from '../../../components/MultipleLov/index';
import ModalContainer, { registerContainer } from '../../../components/Modal/ModalContainer';
/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

const FilterForm = (props, ref) => {

  const [expandForm, setExpandForm] = useState(false);
  const [materialCode, setMaterialCode] = useState([]);
  const [assemblyCode, setAssemblyCode] = useState([]);
  const [workOrderNum, setWorkOrderNum] = useState([]);
  const [materialLotCode, setMaterialLotCode] = useState([]);
  const [attrValue, setAttrValue] = useState([]);

  const formRef = useRef();

  useImperativeHandle(ref, () => ({
    formFields: props.form.getFieldsValue(),
  }));

  // 重置
  const handleFormReset = async () => {
    form.resetFields();
  };

  // 展开
  const toggleForm = () => {
    setExpandForm(!expandForm);
  };

  const onSearch = () => {
    const { handleFetchList, form } = props;
    form.validateFields( { force: true }, (err) => {
      if (!err) {
        // 如果验证成功,则执行onSearch
        handleFetchList();
      }
    });
  };

  const handleListOnSearch = (value, typeList, type) => {
    const flag = value ? value.every(e => typeList.includes(e)) : false;
    if (value && value.length > 0 && (!flag || typeList.length === 0)) {
      const list = value[value.length === 0 ? 0 : value.length - 1].split(/[ ]+/);
      const uniplist = uniq(typeList.concat(compact(list)));
      switch (type) {
        case 'materialCode':
          setMaterialCode(uniplist);
          form.setFieldsValue({ [type]: uniplist });
          break;
        case 'assemblyCode':
          setAssemblyCode(uniplist);
          form.setFieldsValue({ [type]: uniplist });
          break;
        case 'workOrderNum':
          setWorkOrderNum(uniplist);
          form.setFieldsValue({ [type]: uniplist });
          break;
        case 'materialLotCode':
          setMaterialLotCode(uniplist);
          form.setFieldsValue({ [type]: uniplist });
          break;
        case 'attrValue':
          setAttrValue(uniplist);
          form.setFieldsValue({ [type]: uniplist });
          break;
        default:
          break;
      }
    } else if (value && value.length > 0 && value.length === typeList.length) {
      form.setFieldsValue({ [type]: value });
    }
  };

  // 联动清空
  const resetWithFields = (type) => {
    switch (type) {
      case 'prodLineId':
        form.resetFields([
          'lineWorkcellId',
          'processId',
          'stationId',
        ]);
        break;
      case 'lineWorkcellId':
        form.resetFields([
          'processId',
          'stationId',
        ]);
        break;
      case 'processId':
        form.resetFields([
          'stationId',
        ]);
        break;
      default:
        break;
    }
  };

  const {
    form,
    tenantId,
    ncIncidentStatus,
    ncProcessMethod,
    // defaultSite,
    siteList,
  } = props;
  const { getFieldDecorator, getFieldValue } = form;
  return (
    <Form className={SEARCH_FORM_CLASSNAME} ref={formRef}>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='站点'>
            {getFieldDecorator('siteId', {
              initialValue: !isEmpty(siteList) && siteList[0].siteId,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '站点',
                  }),
                },
              ],
            })(
              <Select
                style={{ width: '100%' }}
                allowClear
              >
                {siteList.map(item => {
                  return (
                    <Select.Option value={item.siteId} key={item.siteId}>
                      {item.siteName}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='不良发起时间起'>
            {getFieldDecorator('dateTimeFrom', {
              initialValue: moment(moment().subtract(1, 'months')
                .format('YYYY-MM-DD')),
              rules: [
                {
                  required: !(getFieldValue('incidentNumber')
                    || getFieldValue('closedDateTimeFrom') || getFieldValue('closedDateTimeTo')
                    || getFieldValue('materialLotCode') && getFieldValue('materialLotCode').length > 0
                    || getFieldValue('workOrderNum') && getFieldValue('workOrderNum').length > 0
                    || getFieldValue('attrValue') && getFieldValue('attrValue').length > 0),
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '不良发起时间起',
                  }),
                },
              ],
            })(
              <DatePicker
                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                placeholder=""
                style={{ width: '100%' }}
                format={getDateTimeFormat()}
                disabledDate={currentDate =>
                  getFieldValue('dateTimeTo') &&
                  moment(getFieldValue('dateTimeTo')).isBefore(currentDate, 'second')
                }
              />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='不良发起时间至'>
            {getFieldDecorator('dateTimeTo', {
              initialValue: moment(moment()
                .format('YYYY-MM-DD')),
              rules: [
                {
                  required: !(getFieldValue('incidentNumber')
                    || getFieldValue('closedDateTimeFrom') || getFieldValue('closedDateTimeTo')
                    || getFieldValue('materialLotCode') && getFieldValue('materialLotCode').length > 0
                    || getFieldValue('workOrderNum') && getFieldValue('workOrderNum').length > 0
                    || getFieldValue('attrValue') && getFieldValue('attrValue').length > 0),
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '不良发起时间至',
                  }),
                },
              ],
            })(
              <DatePicker
                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                placeholder=""
                style={{ width: '100%' }}
                format={getDateTimeFormat()}
                disabledDate={currentDate =>
                  getFieldValue('dateTimeFrom') &&
                  moment(getFieldValue('dateTimeFrom')).isAfter(currentDate, 'second')
                }
              />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
          <FormItem>
            <Button onClick={() => toggleForm()}>
              更多查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => handleFormReset()}>
              重置
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              onClick={onSearch}
            >
              查询
            </Button>
          </FormItem>
        </Col>
      </Row>
      {expandForm && (
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='不良条码号'>
              {getFieldDecorator('materialLotCode', {
              })(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        setMaterialLotCode([]);
                      }
                    }
                  }
                  onBlur={(val) => {
                    handleListOnSearch(val, materialLotCode, 'materialLotCode');
                  }}
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {materialLotCode.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工单号'>
              {getFieldDecorator('workOrderNum', {
              })(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        setWorkOrderNum([]);
                      }
                    }
                  }
                  onBlur={(val) => {
                    handleListOnSearch(val, workOrderNum, 'workOrderNum');
                  }}
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {workOrderNum.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='产品编码'>
              {getFieldDecorator('materialCode', {
              })(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        setMaterialCode([]);
                      }
                    }
                  }
                  onBlur={(val) => {
                    handleListOnSearch(val, materialCode, 'materialCode');
                  }}
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {materialCode.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
      )}
      {expandForm && (
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='车间'>
              {getFieldDecorator('workshopId')(
                <Lov
                  code="HME.FINAL_WORKSHOP"
                  lovOptions={{ displayField: 'areaName' }}
                  queryParams={{
                    siteId: getFieldValue('siteId'),
                    tenantId,
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='生产线'>
              {getFieldDecorator('prodLineId')(
                <Lov
                  code="HME.FINAL_PRODLINE"
                  lovOptions={{ displayField: 'prodLineName' }}
                  onChange={() => resetWithFields('prodLineId')}
                  queryParams={{
                    siteId: getFieldValue('siteId'),
                    workshopId: getFieldValue('workshopId'),
                    tenantId,
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='提交工段'>
              {getFieldDecorator('lineWorkcellId', {
              })(
                <MultipleLov
                  code="HME.FINAL_LINE"
                  lovOptions={{ displayField: 'workcellName' }}
                  onChange={() => resetWithFields('lineWorkcellId')}
                  allowClear
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'),
                    tenantId,
                  }}
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
      )}
      {expandForm && (
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='提交工序'>
              {getFieldDecorator('processId', {
              })(
                <MultipleLov
                  code="HME.FINAL_PROCESS"
                  lovOptions={{ displayField: 'workcellName' }}
                  allowClear
                  onChange={() => resetWithFields('processId')}
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'),
                    lineWorkcellId: getFieldValue('lineWorkcellId'),
                    tenantId,
                  }}
                />,
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='提交工位'>
              {getFieldDecorator('stationId', {
              })(
                <MultipleLov
                  code="HME.FINAL_WORKCELL"
                  lovOptions={{ displayField: 'workcellName' }}
                  allowClear
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'),
                    lineWorkcellId: getFieldValue('lineWorkcellId'),
                    processId: getFieldValue('processId'),
                    tenantId,
                  }}
                />,
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='责任工位'>
              {getFieldDecorator('dutyId', {
              })(
                <MultipleLov
                  code="HME.FINAL_WORKCELL"
                  allowClear
                  lovOptions={{ displayField: 'workcellName' }}
                  queryParams={{
                    tenantId,
                  }}
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
      )}
      {expandForm && (
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='不良代码组'>
              {getFieldDecorator('ncGroupId')(
                <Lov
                  code="MT.NC_GROUP"
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='不良代码'>
              {getFieldDecorator('ncCodeId', {
              })(
                <MultipleLov
                  code="MT.NC_CODE"
                  allowClear
                  queryParams={{
                    ncGroupId: getFieldValue('ncGroupId'),
                    tenantId,
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='不良单号'>
              {getFieldDecorator('incidentNumber', {
              })(
                <Input />
              )}
            </Form.Item>
          </Col>
        </Row>
      )}
      {expandForm && (
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='供应商批次'>
              {getFieldDecorator('attrValue', {
              })(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        setAttrValue([]);
                      }
                    }
                  }
                  onBlur={(val) => {
                    handleListOnSearch(val, attrValue, 'attrValue');
                  }}
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {attrValue.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='组件编码'>
              {getFieldDecorator('assemblyCode', {
              })(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        setAssemblyCode([]);
                      }
                    }
                  }
                  onBlur={(val) => {
                    handleListOnSearch(val, assemblyCode, 'assemblyCode');
                  }}
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {assemblyCode.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='单据状态'>
              {getFieldDecorator('ncIncidentStatus')(
                <Select
                  style={{ width: '100%' }}
                  allowClear
                  mode="multiple"
                >
                  {ncIncidentStatus.map(item => {
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
        </Row>
      )}
      {expandForm && (
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='处理方式'>
              {getFieldDecorator('processMethod')(
                <Select
                  style={{ width: '100%' }}
                  allowClear
                  mode="multiple"
                >
                  {ncProcessMethod.map(item => {
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
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='提交人'>
              {getFieldDecorator('realNameId')(
                <Lov code="HIAM.USER.ORG" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='处理人'>
              {getFieldDecorator('closedNameId')(
                <Lov code="HIAM.USER.ORG" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>
        </Row>
      )}
      {expandForm && (
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='是否冻结'>
              {getFieldDecorator('freezeFlag')(
                <Select
                  style={{ width: '100%' }}
                  allowClear
                >
                  <Select.Option value='Y' key='Y'>
                    是
                  </Select.Option>
                  <Select.Option value='N' key='N'>
                    否
                  </Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='不良处理时间从'>
              {getFieldDecorator('closedDateTimeFrom')(
                <DatePicker
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('closedDateTimeTo') &&
                    moment(getFieldValue('closedDateTimeTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='不良处理时间至'>
              {getFieldDecorator('closedDateTimeTo')(
                <DatePicker
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('closedDateTimeFrom') &&
                    moment(getFieldValue('closedDateTimeFrom')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      )}
      <ModalContainer ref={registerContainer} />
    </Form>
  );
};

export default Form.create({ fieldNameProp: null })(forwardRef(FilterForm));
