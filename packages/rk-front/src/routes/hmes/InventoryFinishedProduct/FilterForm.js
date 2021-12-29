/*
 * @Description: 售后在制品盘点成品报表
 * @Version: 0.0.1
 * @Author: liyuan.liu@hand-china.com
 * @Date: 2021-03-31
 * @LastEditTime: 2021-03-31
 */
import React, { useImperativeHandle, useRef, forwardRef, useState } from 'react';
import { Form, Button, Row, Col, Select, Input, DatePicker } from 'hzero-ui';
import { uniq } from 'lodash';
import moment from 'moment';

import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import intl from 'utils/intl';
// import notification from 'utils/notification';
/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

const FilterForm = (props, ref) => {

  const [expandForm, setExpandForm] = useState(false);
  const [receiveSnNumList, setReceiveSnNumList] = useState([]);
  const [currentSnNumList, setCurrentSnNumList] = useState([]);
  const [materialCodeList, setMaterialCodeList] = useState([]);
  const [warehouseCodeList, setWarehouseCodeList] = useState([]);
  const [workcellCodeList, setWorkcellCodeList] = useState([]);

  const formRef = useRef();

  useImperativeHandle(ref, () => ({
    formFields: props.form.getFieldsValue(),
  }));

  // 重置
  const handleFormReset = async () => {
    form.resetFields();
    setReceiveSnNumList([]);
    setCurrentSnNumList([]);
    setMaterialCodeList([]);
    setWarehouseCodeList([]);
    setWorkcellCodeList([]);
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
        case 'receiveSnNumList':
          setReceiveSnNumList(uniqueList);
          break;
        case 'currentSnNumList':
          setCurrentSnNumList(uniqueList);
          break;
        case 'materialCodeList':
          setMaterialCodeList(uniqueList);
          break;
        case 'warehouseCodeList':
          setWarehouseCodeList(uniqueList);
          break;
        case 'workcellCodeList':
          setWorkcellCodeList(uniqueList);
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
    docStatus = [],
    siteList,
    siteInfo,
    // tenantId,
    warehouseTypeList,
    wordOrderStatusList,
    materialLotCodeStatusList,
    flagList,
  } = props;
  const { getFieldDecorator, getFieldValue } = form;
  return (
    <Form className={SEARCH_FORM_CLASSNAME} ref={formRef}>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='站点'>
            {getFieldDecorator('siteId', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '站点',
                  }),
                },
              ],
              initialValue: siteInfo.siteId,
            })(
              <Select
                style={{ width: '100%' }}
                allowClear
              >
                {siteList.map(item => {
                  return (
                    <Select.Option value={item.siteId} key={item.siteId}>
                      {item.description}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='接收SN'>
            {getFieldDecorator('receiveSnNumList', {
              initialValue: receiveSnNumList,
            })(
              <Select
                mode="tags"
                style={{ width: '100%' }}
                onBlur={val => handleListOnSearch(val, receiveSnNumList, 'receiveSnNumList')}
                onChange={
                  val => {
                    if (val.length === 0) {
                      setReceiveSnNumList([]);
                    }
                  }
                }
                allowClear
                dropdownMatchSelectWidth={false}
                maxTagCount={2}
              >
                {receiveSnNumList.map(e => (
                  <Select.Option key={e} value={e}>
                    {e}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='当前SN'>
            {getFieldDecorator('currentSnNumList', {
              initialValue: currentSnNumList,
            })(
              <Select
                mode="tags"
                style={{ width: '100%' }}
                onBlur={val => handleListOnSearch(val, currentSnNumList, 'currentSnNumList')}
                onChange={
                  val => {
                    if (val.length === 0) {
                      setCurrentSnNumList([]);
                    }
                  }
                }
                allowClear
                dropdownMatchSelectWidth={false}
                maxTagCount={2}
              >
                {currentSnNumList.map(e => (
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
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='产品编码'>
              {getFieldDecorator('materialCodeList', {
                initialValue: materialCodeList,
              })(
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
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='当前状态'>
              {getFieldDecorator('splitStatusList')(
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  allowClear
                >
                  {docStatus.map(item => {
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
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='所在仓库编码'>
              {getFieldDecorator('warehouseCodeList', {
                initialValue: warehouseCodeList,
              })(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => handleListOnSearch(val, warehouseCodeList, 'warehouseCodeList')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        setWarehouseCodeList([]);
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {warehouseCodeList.map(e => (
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
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='物料组描述'>
              {getFieldDecorator('itemGroupDescription')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='当前工位编码'>
              {getFieldDecorator('workcellCodeList', {
                initialValue: workcellCodeList,
              })(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => handleListOnSearch(val, workcellCodeList, 'workcellCodeList')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        setWorkcellCodeList([]);
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {workcellCodeList.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工单状态'>
              {getFieldDecorator('wordOrderStatus')(
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
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='所在仓库类型'>
              {getFieldDecorator('warehouseType')(
                <Select
                  style={{ width: '100%' }}
                  allowClear
                >
                  {warehouseTypeList.map(item => {
                    return (
                      <Select.Option value={item.typeCode} key={item.typeCode}>
                        {item.description}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
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
        </Row>
      )}
      {expandForm && (
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
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
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='入库单是否为空'>
              {getFieldDecorator('docNumFlag')(
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
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='拆机时间起'
            >
              {getFieldDecorator('splitTimeFrom')(
                <DatePicker
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('splitTimeTo') &&
                    moment(getFieldValue('splitTimeTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='拆机时间至'
            >
              {getFieldDecorator('splitTimeTo')(
                <DatePicker
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}

                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('splitTimeFrom') &&
                    moment(getFieldValue('splitTimeFrom')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
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
        </Row>
      )}
      {expandForm && (
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
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
