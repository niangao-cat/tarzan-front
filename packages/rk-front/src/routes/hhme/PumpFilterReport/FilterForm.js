/*
 * @Description: 自制件返修统计报表
 * @Version: 0.0.1
 * @Author: xin.t@raycuslaser.com
 * @Date: 2021-07-6
 */
import React, { useImperativeHandle, useRef, forwardRef, useState } from 'react';
import { Form, Button, Row, Col, Select, Input, DatePicker } from 'hzero-ui';
import { isEmpty, uniq } from 'lodash';
import moment from 'moment';
import Lov from 'components/Lov';
import MultipleLov from '@/components/MultipleLov';

import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

const FilterForm = (props, ref) => {

  const [expandForm, setExpandForm] = useState(false);
  const [materialLotCode, setMaterialLotCode] = useState([]);
  const [workOrderNum, setWorkOrderNum] = useState([]);
  const [oldContainerCode, setOldContainerCode] = useState([]);
  const [newContainerCode, setNewContainerCode] = useState([]);
  const [ruleCode, setRuleCode] = useState([]);
  const [selectionLot, setSelectionLot] = useState([]);
  const [combMaterialLotCode, setCombMaterialLotCode] = useState([]);
  const [releaseWorkOrderNum, setReleaseWorkOrderNum] = useState([]);

  const formRef = useRef();

  useImperativeHandle(ref, () => ({
    formFields: props.form.getFieldsValue(),
  }));

  // 重置
  const handleFormReset = async () => {
    form.resetFields();
    setMaterialLotCode([]);
  };

  // 展开
  const toggleForm = () => {
    setExpandForm(!expandForm);
  };

  const handleSearch = () => {
    const { onSearch, form } = props;
    form.validateFields((err) => {
      if (!err) {
        onSearch();
      }
    });
  };

  const handleOnSearch = (value, dataSource, callback, dataListName) => {
    const { form } = props;
    const flag = value ? value.every(e => dataSource.includes(e)) : false;
    if (value && value.length > 0 && !flag) {
      const newList = [].concat(...value.map(e => e.split(/[ ]+/)));
      const uniqueList = uniq(dataSource.concat(newList));
      callback(uniqueList);
      form.setFieldsValue({ [dataListName]: uniqueList });
    }
  };



  const {
    form,
    statusList = [],
    siteInfo,
    tenantId,
  } = props;
  const { getFieldDecorator, getFieldValue, setFieldsValue, resetFields } = form;
  return (
    <Form className={SEARCH_FORM_CLASSNAME} ref={formRef}>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item
            {...SEARCH_FORM_ITEM_LAYOUT}
            label='预挑选时间从'
          >
            {getFieldDecorator('creationDateFrom')(
              <DatePicker
                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                placeholder=""
                style={{ width: '100%' }}
                format="YYYY-MM-DD HH:mm:ss"
                disabledDate={currentDate =>
                  getFieldValue('creationDateTo') &&
                  moment(getFieldValue('creationDateTo')).isBefore(currentDate, 'second')
                }
              />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item
            {...SEARCH_FORM_ITEM_LAYOUT}
            label='预挑选时间至'
          >
            {getFieldDecorator('creationDateTo')(
              <DatePicker
                showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                placeholder=""
                style={{ width: '100%' }}
                format="YYYY-MM-DD HH:mm:ss"
                disabledDate={currentDate =>
                  getFieldValue('creationDateFrom') &&
                  moment(getFieldValue('creationDateFrom')).isAfter(currentDate, 'second')
                }
              />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='泵浦源SN'>
            {getFieldDecorator('materialLotCode')(
              <Select
                mode="tags"
                style={{ width: '100%' }}
                onBlur={val => handleOnSearch(val, materialLotCode, setMaterialLotCode, 'materialLotCode')}
                onChange={
                  val => {
                    if (val.length === 0) {
                      setMaterialLotCode([]);
                    }
                  }
                }
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
              onClick={handleSearch}
            >
              查询
            </Button>
          </FormItem>
        </Col>
      </Row>
      {expandForm && (
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='筛选状态'>
              {getFieldDecorator('status')(
                <Select style={{ width: '100%' }} allowClear>
                  {statusList.map(item => (
                    <Select.Option value={item.value} key={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='仓库'>
              {getFieldDecorator('warehouseId')(
                <MultipleLov
                  code="WMS.ADJUST_WAREHOUSE"
                  queryParams={{ tenantId, siteId: siteInfo.siteId }}
                  onChange={() => {
                    resetFields('locatorId');
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='货位'>
              {getFieldDecorator('locatorId')(
                <MultipleLov
                  code="WMS.LOCATOR_BATCH"
                  queryParams={{
                    tenantId,
                    warehouseId: getFieldValue('warehouseId'),
                  }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      )}
      {expandForm && (
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工单号'>
              {getFieldDecorator('workOrderNum')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => handleOnSearch(val, workOrderNum, setWorkOrderNum, 'workOrderNum')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        setWorkOrderNum([]);
                      }
                    }
                  }
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
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='物料编码'>
              {getFieldDecorator('materialId')(
                <MultipleLov code="HME.SITE_MATERIAL" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='原容器号'>
              {getFieldDecorator('oldContainerCode')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => handleOnSearch(val, oldContainerCode, setOldContainerCode, 'oldContainerCode')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        setOldContainerCode([]);
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {oldContainerCode.map(e => (
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
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='目标容器号'>
              {getFieldDecorator('newContainerCode')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => handleOnSearch(val, newContainerCode, setNewContainerCode, 'newContainerCode')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        setNewContainerCode([]);
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {newContainerCode.map(e => (
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
              label='筛选操作人'
            >
              {getFieldDecorator('createdBy')(
                <Lov code="HME.USER" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='实验代码'
            >
              {getFieldDecorator('labCode')(<Input />)}
            </Form.Item>
          </Col>
        </Row>
      )}
      {expandForm && (
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='装箱时间从'
            >
              {getFieldDecorator('packedDateFrom')(
                <DatePicker
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('packedDateTo') &&
                    moment(getFieldValue('packedDateTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='装箱时间至'
            >
              {getFieldDecorator('packedDateTo')(
                <DatePicker
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}

                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('packedDateFrom') &&
                    moment(getFieldValue('packedDateFrom')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='装箱操作人'
            >
              {getFieldDecorator('packedBy')(
                <Lov code="HME.USER" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>
        </Row>
      )}
      {expandForm && (
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="是否冻结" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('freezeFlag')(
                <Select allowClear>
                  <Select.Option key="Y" value="Y">
                    是
                  </Select.Option>
                  <Select.Option key="N" value="N">
                    否
                  </Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='筛选产线'>
              {getFieldDecorator('prodLineId')(
                <Lov
                  code="HME.FINAL_PRODLINE"
                  queryParams={{ tenantId }}
                  onChange={() => {
                    resetFields(['workcellId']);
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label='筛选工位'
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('workcellId')(
                <Lov
                  code="HME.FINAL_WORKCELL"
                  allowClear
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'),
                    tenantId,
                    typeFlag: 'LINE',
                  }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      )}
      {expandForm && (
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='筛选规则编码'
            >
              {getFieldDecorator('ruleCode')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => handleOnSearch(val, ruleCode, setRuleCode, 'ruleCode')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        setRuleCode([]);
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {ruleCode.map(e => (
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
              label='筛选批次'
            >
              {getFieldDecorator('selectionLot')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => handleOnSearch(val, selectionLot, setSelectionLot, 'selectionLot')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        setSelectionLot([]);
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {selectionLot.map(e => (
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
              label='组合物料编码'
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('combMaterialId')(
                <MultipleLov
                  code="HME.SITE_MATERIAL"
                  queryParams={{ tenantId }}
                  onChange={(val, data) => {
                    if (!isEmpty(data)) {
                      setFieldsValue({ combMaterialCode: data.map(e => e.materialCode).join(',') });
                    } else {
                      resetFields(['combMaterialCode']);
                    }
                    resetFields(['revision']);
                  }}
                />
              )}
            </Form.Item>
            <Form.Item style={{ display: 'none' }}>
              {getFieldDecorator('combMaterialCode')(
                <span />
              )}
            </Form.Item>
          </Col>
        </Row>
      )}
      {expandForm && (
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label='BOM版本号'
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('revision')(
                <MultipleLov
                  code="HME.PUMP_SELECTION_REVISION"
                  queryParams={{ tenantId, siteId: siteInfo.siteId, materialCode: getFieldValue('combMaterialCode') }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='组合件SN'
            >
              {getFieldDecorator('combMaterialLotCode')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => handleOnSearch(val, combMaterialLotCode, setCombMaterialLotCode, 'combMaterialLotCode')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        setCombMaterialLotCode([]);
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {combMaterialLotCode.map(e => (
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
              label='投料工单'
            >
              {getFieldDecorator('releaseWorkOrderNum')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => handleOnSearch(val, releaseWorkOrderNum, setReleaseWorkOrderNum, 'releaseWorkOrderNum')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        setReleaseWorkOrderNum([]);
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {releaseWorkOrderNum.map(e => (
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
    </Form>
  );
};

export default Form.create({ fieldNameProp: null })(forwardRef(FilterForm));
