/*
 * @Description: 查询
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-03-04 10:26:58
 * @LastEditTime: 2021-03-10 09:35:57
 */

import React, { useImperativeHandle, useRef, forwardRef, useState } from 'react';
import { Form, Button, Row, Col, Select, DatePicker, Input, InputNumber } from 'hzero-ui';
import Lov from 'components/Lov';
import { uniq, compact } from 'lodash';
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
  const [workOrderNumList, setWorkOrderNumList] = useState([]);
  const [materialLotCodeList, setMaterialLotCodeList] = useState([]);
  const [containerCodeList, setContainerCodeList] = useState([]);
  const [materialCodeList, setMaterialCodeList] = useState([]);

  const formRef = useRef();

  useImperativeHandle(ref, () => ({
    formFields: props.form.getFieldsValue(),
  }));

  // 重置
  const handleFormReset = async () => {
    form.resetFields();
    setWorkOrderNumList([]);
    setMaterialCodeList([]);
    setMaterialLotCodeList([]);
    setContainerCodeList([]);
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

  const handleListOnSearch = (value, typeList, type) => {
    const flag = value ? value.every(e => typeList.includes(e)) : false;
    if (value && value.length > 0 && (!flag || typeList.length === 0)) {
      const list = value[value.length === 0 ? 0 : value.length - 1].split(/[ ]+/);
      const uniplist = uniq(typeList.concat(compact(list)));
      switch (type) {
        case 'workOrderNumList':
          setWorkOrderNumList(uniplist);
          form.setFieldsValue({ 'workOrderNumList': uniplist });
          break;
        case 'materialCodeList':
          setMaterialCodeList(uniplist);
          form.setFieldsValue({ 'materialCodeList': uniplist });
          break;
        case 'materialLotCodeList':
          setMaterialLotCodeList(uniplist);
          form.setFieldsValue({ 'materialLotCodeList': uniplist });
          break;
        case 'containerCodeList':
          setContainerCodeList(uniplist);
          form.setFieldsValue({ 'containerCodeList': uniplist });
          break;
        default:
          break;
      }
    } else if (value && value.length > 0 && value.length === typeList.length) {
      switch (type) {
        case 'workOrderNumList':
          form.setFieldsValue({ 'workOrderNumList': value });
          break;
        case 'materialCodeList':
          form.setFieldsValue({ 'materialCodeList': value });
          break;
        case 'materialLotCodeList':
          form.setFieldsValue({ 'materialLotCodeList': value });
          break;
        case 'containerCodeList':
          form.setFieldsValue({ 'containerCodeList': value });
          break;
        default:
          break;
      }
    }
  };


  const {
    form,
    tenantId,
    areaName,
    woType,
    woStatus,
    defaultSite,
    docStatus,
  } = props;
  const { getFieldDecorator, getFieldValue } = form;
  return (
    <Form className={SEARCH_FORM_CLASSNAME} ref={formRef}>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='站点'>
            {getFieldDecorator('siteCode', {
              initialValue: defaultSite.siteCode,
            })(
              <Input disabled />
            )}
          </Form.Item>
          <Form.Item style={{ display: 'none' }}>
            {getFieldDecorator('siteId', {
              initialValue: defaultSite.siteId,
            })(
              <Input disabled />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='部门'>
            {getFieldDecorator('areaName', {
            })(
              <Select
                style={{ width: '100%' }}
                allowClear
              >
                {areaName.map(ele => (
                  <Select.Option value={ele.areaCode} key={ele.areaCode}>
                    {ele.areaName}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='产线'>
            {getFieldDecorator('prodLineId', {
            })(
              <Lov
                code="HME.FINAL_PRODLINE"
                allowClear
                queryParams={{
                  departmentId: getFieldValue('areaName') && areaName.filter(e => e.areaCode === getFieldValue('areaName'))[0].areaId,
                  tenantId,
                }}
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
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工单'>
              {getFieldDecorator('workOrderNumList', {
              })(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        setWorkOrderNumList([]);
                      }
                    }
                  }
                  onBlur={val => handleListOnSearch(val, workOrderNumList, 'workOrderNumList')}
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {workOrderNumList.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工单版本'>
              {getFieldDecorator('productionVersion', {
              })(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='物料编码'>
              {getFieldDecorator('materialCodeList', {
                // initialValue: materialCodeList,
              })(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        setMaterialCodeList([]);
                      }
                    }
                  }
                  onBlur={val => handleListOnSearch(val, materialCodeList, 'materialCodeList')}
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {materialCodeList.map(e => (
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
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工单类型'>
              {getFieldDecorator('workOrderType')(
                <Select
                  style={{ width: '100%' }}
                  allowClear
                >
                  {woType.map(ele => (
                    <Select.Option value={ele.value}>{ele.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工单状态'>
              {getFieldDecorator('workOrderStatus', {
              })(
                <Select
                  style={{ width: '100%' }}
                  allowClear
                >
                  {woStatus.map(ele => (
                    <Select.Option value={ele.value}>{ele.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='入库率起'>
              {getFieldDecorator('rate')(
                <InputNumber
                  min={0}
                  formatter={value => `${value}%`}
                  parser={value => value.replace('%', '')}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      )}
      {expandForm && (
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='序列号'>
              {getFieldDecorator('materialLotCodeList', {})(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        setMaterialLotCodeList([]);
                      }
                    }
                  }
                  onBlur={val => handleListOnSearch(val, materialLotCodeList, 'materialLotCodeList')}
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {materialLotCodeList.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='入库时间起'>
              {getFieldDecorator('creationDateFrom')(
                <DatePicker
                  placeholder=""
                  style={{ width: '100%' }}
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('creationDateFromTo') &&
                    moment(getFieldValue('creationDateFromTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='入库时间至'>
              {getFieldDecorator('creationDateFromTo')(
                <DatePicker
                  placeholder=""
                  style={{ width: '100%' }}
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('creationDateFrom') &&
                    moment(getFieldValue('creationDateFrom')).isAfter(currentDate, 'second')
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
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='容器'>
              {getFieldDecorator('containerCodeList', {
                // initialValue: containerCodeList,
              })(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        setContainerCodeList([]);
                      }
                    }
                  }
                  onBlur={val => handleListOnSearch(val, containerCodeList, 'containerCodeList')}
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {containerCodeList.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='库存地点'>
              {getFieldDecorator('locatorId')(
                <Lov
                  code="WMS.ADJUST_WAREHOUSE"
                  queryParams={{ tenantId, siteId: getFieldValue('siteId') }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='作业人'>
              {getFieldDecorator('id')(
                <Lov code="HIAM.USER.ORG" allowClear />
              )}
            </Form.Item>
          </Col>
        </Row>
      )}
      {expandForm && (
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='单据号'>
              {getFieldDecorator('instructionDocNum')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='单据状态'>
              {getFieldDecorator('instructionDocStatus')(
                <Select
                  style={{ width: '100%' }}
                  allowClear
                >
                  {docStatus.map(ele => (
                    <Select.Option value={ele.value}>{ele.meaning}</Select.Option>
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
