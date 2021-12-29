import React, { useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { Form, Button, Col, Row, Select, DatePicker } from 'hzero-ui';
import moment from 'moment';
import { uniq } from 'lodash';

import intl from 'utils/intl';
import { getDateTimeFormat } from 'utils/utils';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';
import Lov from 'components/Lov';

const { Option } = Select;

const FilterForm = (props, ref) => {

  const [expandForm, setExpandForm] = useState(false);
  const [monitorDocNum, setMonitorDocNum] = useState([]);
  const [wafer, setWafer] = useState([]);


  const formRef = useRef();

  useImperativeHandle(ref, () => ({
    formFields: props.form.getFieldsValue(),
  }));


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

  const toggleForm = () => {
    setExpandForm(true);
  };

  const handleOnSearch = (value) => {
    const { form: { setFieldsValue } } = props;
    const flag = value ? value.every(e => monitorDocNum.includes(e)) : false;
    if (value && value.length > 0 && !flag) {
      const newList = [].concat(...value.map(e => e.split(/[ ]+/)));
      const uniqueList = uniq(monitorDocNum.concat(newList));
      setMonitorDocNum(uniqueList);
      setFieldsValue({ monitorDocNum: uniqueList });
    }
  };

  const handleBlurWafer = (value) => {
    const { form: { setFieldsValue } } = props;
    const flag = value ? value.every(e => wafer.includes(e)) : false;
    if (value && value.length > 0 && !flag) {
      const newList = [].concat(...value.map(e => e.split(/[ ]+/)));
      const uniqueList = uniq(wafer.concat(newList));
      setWafer(uniqueList);
      setFieldsValue({ wafer: uniqueList });
    }
  };

  const { form: { getFieldDecorator, getFieldValue }, typeList } = props;

  return (
    <Form className={SEARCH_FORM_CLASSNAME} ref={formRef}>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col span={18}>
          <Row>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='不良单据'
              >
                {getFieldDecorator('monitorDocNum')(
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    onBlur={val => handleOnSearch(val)}
                    onChange={
                      val => {
                        if (val.length === 0) {
                          setMonitorDocNum([]);
                        }
                      }
                    }
                    allowClear
                    dropdownMatchSelectWidth={false}
                    maxTagCount={2}
                  >
                    {monitorDocNum.map(e => (
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
                label='单据状态'
              >
                {getFieldDecorator('docStatus')(
                  <Select allowClear>
                    {typeList.map(e => (
                      <Option key={e.value} value={e.value}>
                        {e.meaning}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='COS类型'
              >
                {getFieldDecorator('cosType')(
                  <Lov code="HME.COS_TYPE" />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ display: expandForm ? 'block' : 'none' }}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='wafer'
              >
                {getFieldDecorator('wafer')(
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    onBlur={val => handleBlurWafer(val)}
                    onChange={
                      val => {
                        if (val.length === 0) {
                          setWafer([]);
                        }
                      }
                    }
                    allowClear
                    dropdownMatchSelectWidth={false}
                    maxTagCount={2}
                  >
                    {wafer.map(e => (
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
