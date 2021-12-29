/*
 * @Description: 查询
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-22 15:49:57
 * @LastEditTime: 2021-02-25 17:27:28
 */
import React, { useImperativeHandle, useRef, forwardRef, useState } from 'react';
import { Form, Button, Input, Row, Col, Select, DatePicker } from 'hzero-ui';
import Lov from 'components/Lov';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import moment from 'moment';
/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

const FilterForm = (props, ref) => {

  const [expandForm, setExpandForm] = useState(false);

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
    form.validateFields((err) => {
      if (!err) {
        // 如果验证成功,则执行onSearch
        handleFetchList();
      }
    });
  };

  const {
    form,
    freezeType,
    cosType,
    tenantId,
    freezeStatus,
  } = props;
  const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
  return (
    <Form className={SEARCH_FORM_CLASSNAME} ref={formRef}>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='冻结单号'>
            {getFieldDecorator('freezeDocNum')(
              <Input />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='冻结类型'>
            {getFieldDecorator('freezeType')(
              <Select
                style={{ width: '100%' }}
                allowClear
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
            {getFieldDecorator('siteId')(
              <Lov
                code="MT.SITE"
                queryParams={{ tenantId }}
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
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='物料'>
              {getFieldDecorator('materialId')(
                <Lov
                  code="MT.MATERIAL"
                  isInput
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='物料版本'>
              {getFieldDecorator('materialVersion')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='生产版本'>
              {getFieldDecorator('productionVersion')(
                <Lov />
              )}
            </Form.Item>
          </Col>
        </Row>
      )}
      {expandForm && (
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='仓库'>
              {getFieldDecorator('warehouseId')(
                <Lov
                  code="MT.WARE.HOUSE"
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='货位'>
              {getFieldDecorator('locatorId')(
                <Lov
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
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      )}
      {expandForm && (
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='库存批次'>
              {getFieldDecorator('inventoryLot')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='供应商批次'>
              {getFieldDecorator('supplierLot')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='实验代码'>
              {getFieldDecorator('testCode')(
                <Input />
              )}
            </Form.Item>
          </Col>
        </Row>
      )}
      {expandForm && (
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工单'>
              {getFieldDecorator('workOrderNum')(
                <Lov
                  code="MT.WORK_ORDER_NUM"
                  queryParams={{ tenantId }}
                  lovOptions={{ valueField: 'workOrderNum' }}
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
                      stationId: null,
                      processId: null,
                    });
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
                  onChange={() => {
                    setFieldsValue({
                      stationId: null,
                    });
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工位'>
              {getFieldDecorator('stationId')(
                <Lov
                  code="HME.FINAL_PROCESS"
                  allowClear
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'),
                    lineWorkcellId: getFieldValue('workcellId'),
                    typeFlag: 'PROCESS',
                    tenantId,
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
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='操作人'>
              {getFieldDecorator('operatedBy')(
                <Lov
                  code="HME.USER"
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='COS类型'>
              {getFieldDecorator('cosType')(
                <Select
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
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='WAFER'>
              {getFieldDecorator('wafer')(
                <Input />
              )}
            </Form.Item>
          </Col>
        </Row>
      )}
      {expandForm && (
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='虚拟号'>
              {getFieldDecorator('virtualNum')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='金锡比'>
              {getFieldDecorator('ausnRatio')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='筛选规则'>
              {getFieldDecorator('cosRuleId')(
                <Lov
                  code="HME.COS.RULE"
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      )}
      {expandForm && (
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='班次'>
              {getFieldDecorator('shiftId')(
                <Input />
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
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      )}
      {expandForm && (
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='热沉编码'>
              {getFieldDecorator('hotSinkNum')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='冻结状态'>
              {getFieldDecorator('freezeDocStatus')(
                <Select
                  style={{ width: '100%' }}
                  allowClear
                  mode="multiple"
                >
                  {freezeStatus.map(item => {
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
    </Form>
  );
};

export default Form.create({ fieldNameProp: null })(forwardRef(FilterForm));
