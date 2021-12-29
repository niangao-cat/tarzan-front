/*
 * @Description: 自制件返修统计报表
 * @Version: 0.0.1
 * @Author: xin.t@raycuslaser.com
 * @Date: 2021-07-6
 */
import React, { useImperativeHandle, useRef, forwardRef, useState } from 'react';
import { Form, Button, Row, Col, Select, Input, DatePicker} from 'hzero-ui';
import { uniq } from 'lodash';
import moment from 'moment';
import { getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';

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
  const [repairSnNumList, setRepairSnNumList] = useState([]);
  const [materialCodeList, setMaterialCodeList] = useState([]);

  const formRef = useRef();

  useImperativeHandle(ref, () => ({
    formFields: props.form.getFieldsValue(),
  }));

  // 重置
  const handleFormReset = async () => {
    form.resetFields();
    setRepairSnNumList([]);
    setMaterialCodeList([]);
  };

  // 展开
  const toggleForm = () => {
    setExpandForm(!expandForm);
  };

  const onSearch = () => {
    const { handleFetchList, form } = props;
    form.validateFields((err) => {
      if (!err) {
        handleFetchList();
      }
    });
  };

  const handleListOnSearch = (value, typeList, type) => {
    const { form } = props;
    const flag = value ? value.every(e => typeList.includes(e)) : false;
    if (value && value.length > 0 && (!flag || typeList.length === 0)) {
      const newList = value[value.length === 0 ? 0 : value.length - 1].split(/[ ]+/);
      const uniqueList = uniq(typeList.concat(newList));
      switch (type) {
        case 'repairSnNumList':
          setRepairSnNumList(uniqueList);
          break;
        case 'materialCodeList':
          setMaterialCodeList(uniqueList);
          break;
        default:
          break;
      }
      form.setFieldsValue({ [type]: uniqueList });
    } else if(value && value.length > 0 && value.length === typeList.length) {
      form.setFieldsValue({ [type]: value });
    }
  };


  const {
    form,
    workShopList = [],
    // siteList,
    // siteInfo,
    // tenantId,
    wordOrderStatusList,
    materialLotCodeStatusList,
    flagList,
  } = props;
  const { getFieldDecorator, getFieldValue } = form;
  return (
    <Form className={SEARCH_FORM_CLASSNAME} ref={formRef}>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='事业部'>
            {getFieldDecorator('areaId')(
              <Select
                style={{ width: '100%' }}
                allowClear
              >
                {workShopList.map(item => (
                  <Select.Option value={item.areaId} key={item.areaId}>
                    {item.description}
                  </Select.Option>
                  )
                )}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='返修SN'>
            {getFieldDecorator('repairSnNum', {})(
              <Select
                mode="tags"
                style={{ width: '100%' }}
                onBlur={val => handleListOnSearch(val, repairSnNumList, 'repairSnNumList')}
                onChange={
                  val => {
                    if (val.length === 0) {
                      setRepairSnNumList([]);
                    }
                  }
                }
                allowClear
                dropdownMatchSelectWidth={false}
                maxTagCount={2}
              >
                {repairSnNumList.map(e => (
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
            {getFieldDecorator('materialCode', {})(
              <Select
                mode="tags"
                style={{ width: '100%' }}
                onBlur={val => handleListOnSearch(val, materialCodeList, 'materialCodeList')}
                onChange={
                  val => {
                    if (val.length === 0) {
                      setMaterialCodeList([]);
                    }
                  }
                }
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
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='申请人工号'>
              {getFieldDecorator('createdBy')(
                <Lov
                  code="HME.USER"
                  queryParams={{ tenantId: getCurrentOrganizationId() }}
                  lovOptions={{ displayField: 'loginName', valueField: 'id'}}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='条码有效性'>
              {getFieldDecorator('enabledFlag')(
                <Select
                  style={{ width: '100%' }}
                  allowClear
                >
                  {flagList.map(item => {
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
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='在制标识'>
              {getFieldDecorator('mfFlag')(
                <Select
                  style={{ width: '100%' }}
                  allowClear
                >
                  {flagList.map(item => {
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
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='条码状态'>
              {getFieldDecorator('materialLotCodeStatus')(
                <Select
                  style={{ width: '100%' }}
                  allowClear
                  mode="multiple"
                >
                  {materialLotCodeStatusList.map(item => {
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
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工单号'>
              {getFieldDecorator('workOrderNum')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工单状态'>
              {getFieldDecorator('workOrderStatus')(
                <Select
                  style={{ width: '100%' }}
                  allowClear
                  mode="multiple"
                >
                  {wordOrderStatusList.map(item => {
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
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='是否创建SN'>
              {getFieldDecorator('createSnFlag')(
                <Select
                  style={{ width: '100%' }}
                  allowClear
                >
                  {flagList.map(item => {
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
              label='工单创建时间从'
            >
              {getFieldDecorator('actualStartDateFrom')(
                <DatePicker
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('actualStartDateTo') &&
                    moment(getFieldValue('actualStartDateTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='工单创建时间至'
            >
              {getFieldDecorator('actualStartDateTo')(
                <DatePicker
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}

                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('actualStartDateFrom') &&
                    moment(getFieldValue('actualStartDateFrom')).isAfter(currentDate, 'second')
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
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='工单结束时间起'
            >
              {getFieldDecorator('actualEndDateFrom')(
                <DatePicker
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('actualEndDateTo') &&
                    moment(getFieldValue('actualEndDateTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='工单结束时间至'
            >
              {getFieldDecorator('actualEndDateTo')(
                <DatePicker
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}

                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('actualEndDateFrom') &&
                    moment(getFieldValue('actualEndDateFrom')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      )}
    </Form>
  );
};

export default Form.create({ fieldNameProp: null })(forwardRef(FilterForm));
