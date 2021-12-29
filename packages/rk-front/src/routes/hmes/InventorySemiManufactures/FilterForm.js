/*
 * @Description: 售后在制品盘点半成品报表
 * @Version: 0.0.1
 * @Author: liyuan.liu@hand-china.com
 * @Date: 2021-03-31
 * @LastEditTime: 2021-03-31
 */
import React, { useImperativeHandle, useRef, forwardRef, useState } from 'react';
import { Form, Button, Row, Col, Select, Input, DatePicker } from 'hzero-ui';
import { uniq, compact } from 'lodash';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import { getDateTimeFormat } from 'utils/utils';
import intl from 'utils/intl';
import moment from 'moment';
// import notification from 'utils/notification';
/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

const FilterForm = (props, ref) => {

  const [expandForm, setExpandForm] = useState(false);
  const [snNumList, setSnNumList] = useState([]);
  const [materialLotCodeList, setMaterialLotCodeList] = useState([]);
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
    setSnNumList([]);
    setMaterialLotCodeList([]);
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
      const list = value[value.length === 0 ? 0 : value.length - 1].split(/[ ]+/);
      const uniplist = uniq(typeList.concat(compact(list)));
      switch (type) {
        case 'snNum':
          setSnNumList(uniplist);
          form.setFieldsValue({ [type]: uniplist });
          break;
        case 'materialLotCode':
          setMaterialLotCodeList(uniplist);
          form.setFieldsValue({ [type]: uniplist });
          break;
        case 'materialCode':
          setMaterialCodeList(uniplist);
          form.setFieldsValue({ [type]: uniplist });
          break;
        case 'warehouseCode':
          setWarehouseCodeList(uniplist);
          form.setFieldsValue({ [type]: uniplist });
          break;
        case 'workcellCode':
          setWorkcellCodeList(uniplist);
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
    docStatus = [],
    siteList,
    siteInfo,
    enableMap = [],
    workOrderStatusMap = [],
    materialtLotStatusMap = [],
    // tenantId,
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
            {getFieldDecorator('snNum', {
              // initialValue: snNumList,
            })(
              <Select
                mode="tags"
                style={{ width: '100%' }}
                onChange={
                  val => {
                    if (val.length === 0) {
                      setSnNumList([]);
                    }
                  }
                }
                onBlur={(val) => {
                  handleListOnSearch(val, snNumList, 'snNum');
                }}
                allowClear
                dropdownMatchSelectWidth={false}
                maxTagCount={2}
              >
                {snNumList.map(e => (
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
            {getFieldDecorator('materialLotCode', {
              // initialValue: materialLotCodeList,
            })(
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
                onBlur={(val) => {
                  handleListOnSearch(val, materialLotCodeList, 'materialLotCode');
                }}
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
              {getFieldDecorator('materialCode', {
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
                  onBlur={(val) => {
                    handleListOnSearch(val, materialCodeList, 'materialCode');
                  }}
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
              {getFieldDecorator('splitStatus')(
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
              {getFieldDecorator('warehouseCode', {
                // initialValue: warehouseCodeList,
              })(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        setWarehouseCodeList([]);
                      }
                    }
                  }
                  onBlur={(val) => {
                    handleListOnSearch(val, warehouseCodeList, 'warehouseCode');
                  }}
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
              {getFieldDecorator('workcellCode', {
                initialValue: workcellCodeList,
              })(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        setWorkcellCodeList([]);
                      }
                    }
                  }
                  onBlur={(val) => {
                    handleListOnSearch(val, workcellCodeList, 'workcellCode');
                  }}
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
              {getFieldDecorator('workOrderStatus')(
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  allowClear
                >
                  {workOrderStatusMap.map(item => {
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
              {getFieldDecorator('materialtLotStatus')(
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  allowClear
                >
                  {materialtLotStatusMap.map(item => {
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
              label='是否创建SN'
            >
              {getFieldDecorator('isCreateSn', {
                // initialValue: 'Y',
              })(
                <Select allowClear>
                  {enableMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='条码有效性'
            >
              {getFieldDecorator('materialLotEnableFlag', {
                // initialValue: 'Y',
              })(
                <Select allowClear>
                  {enableMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
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
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='在制标识'
            >
              {getFieldDecorator('mfFlag', {
                // initialValue: 'Y',
              })(
                <Select allowClear>
                  {enableMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='拆机时间起'
            >
              {getFieldDecorator('splitDateFrom')(
                <DatePicker
                  placeholder=""
                  style={{ width: '100%' }}
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('splitDateTo') &&
                    moment(getFieldValue('splitDateTo')).isBefore(currentDate, 'second')
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
              {getFieldDecorator('splitDateTo')(
                <DatePicker
                  placeholder=""
                  style={{ width: '100%' }}
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('splitDateFrom') &&
                    moment(getFieldValue('splitDateFrom')).isAfter(currentDate, 'second')
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
              {getFieldDecorator('workOrderDateFrom')(
                <DatePicker
                  placeholder=""
                  style={{ width: '100%' }}
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('workOrderDateTo') &&
                    moment(getFieldValue('workOrderDateTo')).isBefore(currentDate, 'second')
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
              {getFieldDecorator('workOrderDateTo')(
                <DatePicker
                  placeholder=""
                  style={{ width: '100%' }}
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('workOrderDateFrom') &&
                    moment(getFieldValue('workOrderDateFrom')).isAfter(currentDate, 'second')
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
