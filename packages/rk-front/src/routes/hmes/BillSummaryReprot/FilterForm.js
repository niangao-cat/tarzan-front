/*
 * @Description: 查询
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-23 10:57:29
 * @LastEditTime: 2021-03-04 19:27:10
 */
import React, { useImperativeHandle, useRef, forwardRef, useState } from 'react';
import { Form, Button, Row, Col, Select, DatePicker } from 'hzero-ui';
import Lov from 'components/Lov';
import { uniq, compact, isEmpty, isUndefined } from 'lodash';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import notification from 'utils/notification';
import moment from 'moment';
/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

const FilterForm = (props, ref) => {

  const [expandForm, setExpandForm] = useState(false);
  const [instructionDocNumList, setInstructionDocNumList] = useState([]);
  const [fromWarehouseCodeList, setFromWarehouseCodeList] = useState([]);
  const [fromLocatorCodeList, setFromLocatorCodeList] = useState([]);
  const [toWarehouseCodeList, setToWarehouseCodeList] = useState([]);
  const [toLocatorCodeList, setToLocatorCodeList] = useState([]);
  const [materialCodeList, setMaterialCodeList] = useState([]);

  const formRef = useRef();

  useImperativeHandle(ref, () => ({
    formFields: props.form.getFieldsValue(),
  }));

  // 重置
  const handleFormReset = async () => {
    form.resetFields();
    setInstructionDocNumList([]);
    setFromWarehouseCodeList([]);
    setFromLocatorCodeList([]);
    setToWarehouseCodeList([]);
    setToLocatorCodeList([]);
    setMaterialCodeList([]);
  };

  // 展开
  const toggleForm = () => {
    setExpandForm(!expandForm);
  };

  const onSearch = () => {
    const { handleFetchList, form } = props;
    form.validateFields((err, value) => {
      if (!err) {
        let count = 0;
        for (const key in value) {
          if (!isEmpty(value[key]) || typeof value[key] === 'number' && !isEmptys(value[key])) {
            count += 1;
          }
        }
        if ((isUndefined(value.instructionDocNumList) || value.instructionDocNumList && value.instructionDocNumList.length === 0) && count < 2) {
          return notification.error({ message: '查询条件不能少于两个!' });
        }
        // 如果验证成功,则执行onSearch
        handleFetchList();
      }
    });
  };

  const isEmptys = (v) => {
    // eslint-disable-next-line default-case
    switch (typeof v) {
      case 'number':
        if (v === 0 || isNaN(v)) return true;
        break;
    }
  };

  const handleOnSearch = (value, typeList, type) => {
    const { form } = props;
    const flag = value ? value.every(e => typeList.includes(e)) : false;
    if (value && value.length > 0 && (!flag || typeList.length === 0)) {
      const newList = [].concat(...value.map(e => e.split(/[ ]+/)));
      const uniplist = uniq(typeList.concat(compact(newList)));
      switch (type) {
        case 'instructionDocNumList':
          setInstructionDocNumList(uniplist);
          form.setFieldsValue({ [type]: uniplist });
          break;
        case 'fromWarehouseCodeList':
          setFromWarehouseCodeList(uniplist);
          form.setFieldsValue({ [type]: uniplist });
          break;
        case 'fromLocatorCodeList':
          setFromLocatorCodeList(uniplist);
          form.setFieldsValue({ [type]: uniplist });
          break;
        case 'toWarehouseCodeList':
          setToWarehouseCodeList(uniplist);
          form.setFieldsValue({ [type]: uniplist });
          break;
        case 'toLocatorCodeList':
          setToLocatorCodeList(uniplist);
          form.setFieldsValue({ [type]: uniplist });
          break;
        case 'materialCodeList':
          setMaterialCodeList(uniplist);
          form.setFieldsValue({ [type]: uniplist });
          break;
        default:
          break;
      }
    } else if(value && value.length > 0 && value.length === typeList.length) {
      form.setFieldsValue({ [type]: value });
    }
  };


  const {
    form,
    docType = [],
    docStatus = [],
    tenantId,
  } = props;
  const { getFieldDecorator, getFieldValue } = form;
  return (
    <Form className={SEARCH_FORM_CLASSNAME} ref={formRef}>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='单据类型'>
            {getFieldDecorator('instructionDocType')(
              <Select
                style={{ width: '100%' }}
                allowClear
              >
                {docType.map(item => {
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
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='单据号'>
            {getFieldDecorator('instructionDocNumList', {
            })(
              <Select
                mode="tags"
                style={{ width: '100%' }}
                onBlur={val => {
                  handleOnSearch(val, instructionDocNumList, 'instructionDocNumList');
                }}
                onChange={
                  val => {
                    if (val.length === 0) {
                      setInstructionDocNumList([]);
                    // } else {
                    //   handleOnSearch(val, instructionDocNumList, 'instructionDocNumList');
                    }
                  }
                }
                allowClear
                dropdownMatchSelectWidth={false}
                maxTagCount={2}
              >
                {instructionDocNumList.map(e => (
                  <Select.Option key={e} value={e}>
                    {e}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='发料仓库编码'>
            {getFieldDecorator('fromWarehouseCodeList', {
            })(
              <Select
                mode="tags"
                style={{ width: '100%' }}
                onBlur={val => {
                  handleOnSearch(val, fromWarehouseCodeList, 'fromWarehouseCodeList');
                }}
                onChange={
                  val => {
                    if (val.length === 0) {
                      setFromWarehouseCodeList([]);
                    }
                  }
                }
                allowClear
                dropdownMatchSelectWidth={false}
                maxTagCount={2}
              >
                {fromWarehouseCodeList.map(e => (
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
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='发料货位编码'>
              {getFieldDecorator('fromLocatorCodeList', {
              })(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => {
                    handleOnSearch(val, fromLocatorCodeList, 'fromLocatorCodeList');
                  }}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        setFromLocatorCodeList([]);
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {fromLocatorCodeList.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='收料仓库编码'>
              {getFieldDecorator('toWarehouseCodeList', {
              })(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => {
                    handleOnSearch(val, toWarehouseCodeList, 'toWarehouseCodeList');
                  }}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        setToWarehouseCodeList([]);
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {toWarehouseCodeList.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='收料货位编码'>
              {getFieldDecorator('toLocatorCodeList', {
              })(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => {
                    handleOnSearch(val, toLocatorCodeList, 'toLocatorCodeList');
                  }}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        setToLocatorCodeList([]);
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {toLocatorCodeList.map(e => (
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
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='成本中心'>
              {getFieldDecorator('costCenterId')(
                <Lov code="WMS.COST_CENTER" queryParams={{ tenantId }} allowClear />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='物料编码'>
              {getFieldDecorator('materialCodeList', {
              })(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => {
                    handleOnSearch(val, materialCodeList, 'materialCodeList');
                  }}
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
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='制单人'>
              {getFieldDecorator('userId')(
                <Lov code="HIAM.USER.ORG" allowClear />
              )}
            </Form.Item>
          </Col>
        </Row>
      )}
      {expandForm && (
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='单据状态'>
              {getFieldDecorator('instructionDocStatus')(
                <Select
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
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='物料组'>
              {getFieldDecorator('itemGroupId')(
                <Lov code="WMS.ITEM_GROUP" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='制单时间起'>
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
        </Row>
      )}
      {expandForm && (
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='制单时间至'>
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
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='执行时间起'>
              {getFieldDecorator('lastUpdateDateFrom')(
                <DatePicker
                  placeholder=""
                  style={{ width: '100%' }}
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('lastUpdateDateTo') &&
                    moment(getFieldValue('lastUpdateDateTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='执行时间至'>
              {getFieldDecorator('lastUpdateDateTo')(
                <DatePicker
                  placeholder=""
                  style={{ width: '100%' }}
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('lastUpdateDateFrom') &&
                    moment(getFieldValue('lastUpdateDateFrom')).isAfter(currentDate, 'second')
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
