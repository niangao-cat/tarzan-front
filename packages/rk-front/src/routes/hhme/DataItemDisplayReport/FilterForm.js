import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Form, Button, Col, Row, Select, DatePicker } from 'hzero-ui';
import { isEmpty, uniq } from 'lodash';
import moment from 'moment';

import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';
import { getDateTimeFormat } from 'utils/utils';
import MultipleLov from '@/components/MultipleLov';

const { Option } = Select;

const FilterForm = (props, ref) => {
  const [expandForm, setExpandForm] = useState(false);
  const [materialLotCode, setMaterialLotCode] = useState([]);
  const [workOrderNum, setWorkOrderNum] = useState([]);
  const [materialCode, setMaterialCode] = useState([]);

  const formRef = useRef();

  useImperativeHandle(ref, () => ({
    formFields: props.form,
  }));

  const toggleForm = () => {
    setExpandForm(!expandForm);
  };

  const handleSearch = () => {
    const { onSearch } = props;
    if (onSearch) {
      onSearch();
    }
  };

  const resetSearch = () => {
    const { form, onSearch } = props;
    form.resetFields();
    if (onSearch) {
      onSearch();
    }
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

  const { form: { getFieldDecorator, getFieldValue, resetFields }, areaList, departmentInfo, typeList, tenantId } = props;

  return (
    <Form className={SEARCH_FORM_CLASSNAME} ref={formRef}>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col span={18}>
          <Row>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='事业部'
              >
                {getFieldDecorator('businessId', {
                  initialValue: isEmpty(departmentInfo) ? null : departmentInfo.areaId,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '事业部',
                      }),
                    },
                  ],
                })(
                  <Select
                    style={{ width: '100%' }}
                    allowClear
                    onChange={() => {
                      resetFields('ruleHeaderId');
                    }}
                  >
                    {areaList.map(e => (
                      <Select.Option key={e.areaId} value={e.areaId}>
                        {e.areaName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='类型'
              >
                {getFieldDecorator('ruleType', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '类型',
                      }),
                    },
                  ],
                })(
                  <Select
                    style={{ width: '100%' }}
                    allowClear
                    onChange={() => {
                      resetFields('ruleHeaderId');
                    }}
                  >
                    {typeList.map(e => (
                      <Option key={e.value} value={e.value}>{e.meaning}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='规则选择'
              >
                {getFieldDecorator('ruleHeaderId', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '规则选择',
                      }),
                    },
                  ],
                })(
                  <MultipleLov
                    code={getFieldValue('ruleType') === 'SN_DATA' ? 'HME.TAG_CHECK_SN_HEADER' : getFieldValue('ruleType') === 'COMPONENT_DATA' ? 'HME.TAG_CHECK_COMPONENT_HEADER' : null}
                    disabled={!getFieldValue('businessId') || !getFieldValue('ruleType')}
                    queryParams={{ tenantId, businessId: getFieldValue('businessId'), type: getFieldValue('ruleType') }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ display: expandForm ? 'block' : 'none' }}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='序列号'
              >
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
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='工单'
              >
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
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='物料'
              >
                {getFieldDecorator('materialCode')(
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    onBlur={val => handleOnSearch(val, materialCode, setMaterialCode, 'materialCode')}
                    onChange={
                      val => {
                        if (val.length === 0) {
                          setMaterialCode([]);
                        }
                      }
                    }
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
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='出站时间从'
              >
                {getFieldDecorator('siteOutDateFrom')(
                  <DatePicker
                    placeholder=""
                    style={{ width: '100%' }}
                    showTime
                    format={getDateTimeFormat()}
                    disabledDate={currentDate =>
                      getFieldValue('siteOutDateTo') &&
                      moment(getFieldValue('siteOutDateTo')).isBefore(currentDate, 'second')
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='出站时间至'
              >
                {getFieldDecorator('siteOutDateTo')(
                  <DatePicker
                    placeholder=""
                    style={{ width: '100%' }}
                    showTime
                    format={getDateTimeFormat()}
                    disabledDate={currentDate =>
                      getFieldValue('siteOutDateFrom') &&
                      moment(getFieldValue('siteOutDateFrom')).isAfter(currentDate, 'second')
                    }
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col span={6} className={SEARCH_COL_CLASSNAME}>
          <Form.Item>
            <Button onClick={toggleForm}>
              {expandForm
                ? intl.get('hzero.common.button.collected').d('收起查询')
                : intl.get(`hzero.common.button.viewMore`).d('更多查询')}
            </Button>
            <Button onClick={resetSearch}>
              {intl.get(`hzero.common.button.reset`).d('重置')}
            </Button>
            <Button type="primary" htmlType="submit" onClick={handleSearch}>
              {intl.get(`hzero.common.button.search`).d('查询')}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};


export default Form.create({ fieldNameProp: null })(forwardRef(FilterForm));
