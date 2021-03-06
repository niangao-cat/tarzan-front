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
  const [waferNums, setWaferNums] = useState([]);
  const [workOrderNums, setWorkOrderNums] = useState([]);
  const [returnMaterialLotCodes, setReturnMaterialLotCodes] = useState([]);
  const [targetMaterialLotCodes, setTargetMaterialLotCodes] = useState([]);
  const [supplierLots, setSupplierLots] = useState([]);

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

  const { form: { getFieldDecorator, getFieldValue }, cosTypeList, methodList, tenantId } = props;

  return (
    <Form className={SEARCH_FORM_CLASSNAME} ref={formRef}>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col span={18}>
          <Row>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='???????????????'
              >
                {getFieldDecorator('operateDateFrom')(
                  <DatePicker
                    placeholder=""
                    style={{ width: '100%' }}
                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    format={getDateTimeFormat()}
                    disabledDate={currentDate =>
                      getFieldValue('operateDateTo') &&
                      moment(getFieldValue('operateDateTo')).isBefore(currentDate, 'second')
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='???????????????'
              >
                {getFieldDecorator('operateDateTo')(
                  <DatePicker
                    placeholder=""
                    style={{ width: '100%' }}
                    showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                    format={getDateTimeFormat()}
                    disabledDate={currentDate =>
                      getFieldValue('operateDateFrom') &&
                      moment(getFieldValue('operateDateFrom')).isAfter(currentDate, 'second')
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='??????'>
                {getFieldDecorator('prodLineId')(
                  <Lov
                    code="HME.FINAL_PRODLINE"
                    queryParams={{ tenantId }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ display: expandForm ? 'block' : 'none' }}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='?????????'
              >
                {getFieldDecorator('workOrderNums')(
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    onBlur={val => handleOnSearch(val, workOrderNums, setWorkOrderNums, 'workOrderNums')}
                    onChange={
                      val => {
                        if (val.length === 0) {
                          setWorkOrderNums([]);
                        }
                      }
                    }
                    allowClear
                    dropdownMatchSelectWidth={false}
                    maxTagCount={2}
                  >
                    {workOrderNums.map(e => (
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
                label='????????????'
              >
                {getFieldDecorator('materialId')(
                  <Lov code="HME.SITE_MATERIAL" queryParams={{ tenantId }} />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='????????????'
              >
                {getFieldDecorator('returnType')(
                  <Select style={{ width: '100%' }} allowClear>
                    {methodList.map(e => (
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
                label='WAFER'
              >
                {getFieldDecorator('waferNums')(
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    onBlur={val => handleOnSearch(val, waferNums, setWaferNums, 'waferNums')}
                    onChange={
                      val => {
                        if (val.length === 0) {
                          setWaferNums([]);
                        }
                      }
                    }
                    allowClear
                    dropdownMatchSelectWidth={false}
                    maxTagCount={2}
                  >
                    {waferNums.map(e => (
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
                label='COS??????'
              >
                {getFieldDecorator('cosType')(
                  <Select style={{ width: '100%' }} allowClear>
                    {cosTypeList.map(e => (
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
                label='????????????'
              >
                {getFieldDecorator('returnMaterialLotCodes')(
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    onBlur={val => handleOnSearch(val, returnMaterialLotCodes, setReturnMaterialLotCodes, 'returnMaterialLotCodes')}
                    onChange={
                      val => {
                        if (val.length === 0) {
                          setReturnMaterialLotCodes([]);
                        }
                      }
                    }
                    allowClear
                    dropdownMatchSelectWidth={false}
                    maxTagCount={2}
                  >
                    {returnMaterialLotCodes.map(e => (
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
                label='??????????????????'
              >
                {getFieldDecorator('returnMaterialId')(
                  <Lov code="HME.SITE_MATERIAL" queryParams={tenantId} />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='????????????'
              >
                {getFieldDecorator('targetMaterialLotCodes')(
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    onBlur={val => handleOnSearch(val, targetMaterialLotCodes, setTargetMaterialLotCodes, 'targetMaterialLotCodes')}
                    onChange={
                      val => {
                        if (val.length === 0) {
                          setTargetMaterialLotCodes([]);
                        }
                      }
                    }
                    allowClear
                    dropdownMatchSelectWidth={false}
                    maxTagCount={2}
                  >
                    {targetMaterialLotCodes.map(e => (
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
                label='?????????'
              >
                {getFieldDecorator('supplierId')(
                  <Lov code="WMS.SUPPLIER" queryParams={tenantId} />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='???????????????'
              >
                {getFieldDecorator('supplierLots')(
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    onBlur={val => handleOnSearch(val, supplierLots, setSupplierLots, 'supplierLots')}
                    onChange={
                      val => {
                        if (val.length === 0) {
                          setSupplierLots([]);
                        }
                      }
                    }
                    allowClear
                    dropdownMatchSelectWidth={false}
                    maxTagCount={2}
                  >
                    {supplierLots.map(e => (
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
                label='????????????'
              >
                {getFieldDecorator('lot')(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='????????????'
              >
                {getFieldDecorator('ncCodeId')(
                  <Lov code="MT.NC_CODE" queryParams={{ tenantId }} />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='?????????'
              >
                {getFieldDecorator('createdById')(
                  <Lov code="HME.USER" queryParams={{ tenantId }} />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='????????????'
              >
                {getFieldDecorator('workcellId')(
                  <Lov code="HME.FINAL_WORKCELL" queryParams={{ tenantId }} />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col span={6} className={SEARCH_COL_CLASSNAME}>
          <Form.Item>
            <Button onClick={toggleForm}>
              {expandForm
                ? intl.get('hzero.common.button.collected').d('????????????')
                : intl.get(`hzero.common.button.viewMore`).d('????????????')}
            </Button>
            <Button onClick={resetSearch}>
              {intl.get(`hzero.common.button.reset`).d('??????')}
            </Button>
            <Button type="primary" htmlType="submit" onClick={handleSearch}>
              {intl.get(`hzero.common.button.search`).d('??????')}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};


export default Form.create({ fieldNameProp: null })(forwardRef(FilterForm));
