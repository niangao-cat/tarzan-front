import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Form, Button, Col, Row, Select, DatePicker, Input } from 'hzero-ui';
import { uniq } from 'lodash';
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
import Lov from 'components/Lov';

const FilterForm = (props, ref) => {
  const [expandForm, setExpandForm] = useState(false);
  const [serialNumber, setSerialNumber] = useState([]);
  const [productCode, setProductCode] = useState([]);
  const [sapQuotationNo, setSapQuotationNo] = useState([]);

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

  const { form: { getFieldDecorator, getFieldValue }, snStatusList, quotationStatusList, returnTypeList, tenantId } = props;

  return (
    <Form className={SEARCH_FORM_CLASSNAME} ref={formRef}>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col span={18}>
          <Row>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='序列号'
              >
                {getFieldDecorator('serialNumber')(
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    onBlur={val => handleOnSearch(val, serialNumber, setSerialNumber, 'serialNumber')}
                    onChange={
                      val => {
                        if (val.length === 0) {
                          setSerialNumber([]);
                        }
                      }
                    }
                    allowClear
                    dropdownMatchSelectWidth={false}
                    maxTagCount={2}
                  >
                    {serialNumber.map(e => (
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
                label='产品编码'
              >
                {getFieldDecorator('productCode')(
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    onBlur={val => handleOnSearch(val, productCode, setProductCode, 'productCode')}
                    onChange={
                      val => {
                        if (val.length === 0) {
                          setProductCode([]);
                        }
                      }
                    }
                    allowClear
                    dropdownMatchSelectWidth={false}
                    maxTagCount={2}
                  >
                    {productCode.map(e => (
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
                label='SN当前状态'
              >
                {getFieldDecorator('snStatus')(
                  <Select style={{ width: '100%' }} allowClear>
                    {snStatusList.map(e => (
                      <Select.Option key={e.value} value={e.value}>
                        {e.meaning}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ display: expandForm ? 'block' : 'none' }}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='报价单状态'
              >
                {getFieldDecorator('quotationStatus')(
                  <Select style={{ width: '100%' }} allowClear>
                    {quotationStatusList.map(e => (
                      <Select.Option key={e.value} value={e.value}>
                        {e.meaning}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='送达方'
              >
                {getFieldDecorator('servedBy')(
                  <Lov code="MT.CUSTOMER" queryParams={tenantId} />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='报价单号'
              >
                {getFieldDecorator('sapQuotationNo')(
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    onBlur={val => handleOnSearch(val, sapQuotationNo, setSapQuotationNo, 'sapQuotationNo')}
                    onChange={
                      val => {
                        if (val.length === 0) {
                          setSapQuotationNo([]);
                        }
                      }
                    }
                    allowClear
                    dropdownMatchSelectWidth={false}
                    maxTagCount={2}
                  >
                    {sapQuotationNo.map(e => (
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
                label='提交人'
              >
                {getFieldDecorator('submitterName')(
                  <Lov code="GENARAL.USER" queryParams={tenantId} />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='更新人'
              >
                {getFieldDecorator('updaterName')(
                  <Lov code="GENARAL.USER" queryParams={tenantId} />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='创建人'
              >
                {getFieldDecorator('creatorName')(
                  <Lov code="GENARAL.USER" queryParams={tenantId} />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='售达方'
              >
                {getFieldDecorator('sellerTo')(
                  <Lov code="MT.CUSTOMER" queryParams={tenantId} />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='SN当前状态'
              >
                {getFieldDecorator('returnType')(
                  <Select style={{ width: '100%' }} allowClear>
                    {returnTypeList.map(e => (
                      <Select.Option key={e.value} value={e.value}>
                        {e.meaning}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='型号'
              >
                {getFieldDecorator('model')(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='更新时间从'
              >
                {getFieldDecorator('updateTimeFrom')(
                  <DatePicker
                    placeholder=""
                    style={{ width: '100%' }}
                    showTime
                    format={getDateTimeFormat()}
                    disabledDate={currentDate =>
                      getFieldValue('updateTimeTo') &&
                      moment(getFieldValue('updateTimeTo')).isBefore(currentDate, 'second')
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='更新时间至'
              >
                {getFieldDecorator('updateTimeTo')(
                  <DatePicker
                    placeholder=""
                    style={{ width: '100%' }}
                    showTime
                    format={getDateTimeFormat()}
                    disabledDate={currentDate =>
                      getFieldValue('updateTimeFrom') &&
                      moment(getFieldValue('updateTimeFrom')).isAfter(currentDate, 'second')
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='创建时间从'
              >
                {getFieldDecorator('creationDateFrom')(
                  <DatePicker
                    placeholder=""
                    style={{ width: '100%' }}
                    showTime
                    format={getDateTimeFormat()}
                    disabledDate={currentDate =>
                      getFieldValue('creationDateTo') &&
                      moment(getFieldValue('creationDateTo')).isBefore(currentDate, 'second')
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='创建时间至'
              >
                {getFieldDecorator('creationDateTo')(
                  <DatePicker
                    placeholder=""
                    style={{ width: '100%' }}
                    showTime
                    format={getDateTimeFormat()}
                    disabledDate={currentDate =>
                      getFieldValue('creationDateFrom') &&
                      moment(getFieldValue('creationDateFrom')).isAfter(currentDate, 'second')
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='提交时间从'
              >
                {getFieldDecorator('submissionTimeFrom')(
                  <DatePicker
                    placeholder=""
                    style={{ width: '100%' }}
                    showTime
                    format={getDateTimeFormat()}
                    disabledDate={currentDate =>
                      getFieldValue('submissionTimeTo') &&
                      moment(getFieldValue('submissionTimeTo')).isBefore(currentDate, 'second')
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='提交时间至'
              >
                {getFieldDecorator('submissionTimeTo')(
                  <DatePicker
                    placeholder=""
                    style={{ width: '100%' }}
                    showTime
                    format={getDateTimeFormat()}
                    disabledDate={currentDate =>
                      getFieldValue('submissionTimeFrom') &&
                      moment(getFieldValue('submissionTimeFrom')).isAfter(currentDate, 'second')
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
