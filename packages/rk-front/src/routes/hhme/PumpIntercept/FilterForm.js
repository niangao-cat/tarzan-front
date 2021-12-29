import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Form, Button, Col, Row, Select, Input, DatePicker } from 'hzero-ui';
import moment from 'moment';


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

  const formRef = useRef();

  useImperativeHandle(ref, () => ({
    formFields: props.form.getFieldsValue(),
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

  const { form: { getFieldDecorator, getFieldValue }, tenantId, dimensionList, statusList } = props;

  return (
    <Form className={SEARCH_FORM_CLASSNAME} ref={formRef}>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col span={18}>
          <Row>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='拦截单号'
              >
                {getFieldDecorator('interceptNum')(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='拦截维度'
              >
                {getFieldDecorator('dimension')(
                  <Select allowClear style={{ width: '100%' }}>
                    {dimensionList.map(e => (
                      <Option value={e.value} key={e.value}>{e.meaning}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='拦截状态'
              >
                {getFieldDecorator('status')(
                  <Select allowClear style={{ width: '100%' }}>
                    {statusList.map(e => (
                      <Option value={e.value} key={e.value}>{e.meaning}</Option>
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
                label='拦截工序'
              >
                {getFieldDecorator('workcellId')(
                  <Lov
                    code="HME.FINAL_PROCESS"
                    queryParams={{ tenantId }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='拦截时间从'
              >
                {getFieldDecorator('interceptDateFrom')(
                  <DatePicker
                    placeholder=""
                    style={{ width: '100%' }}
                    // showTime
                    format={getDateTimeFormat()}
                    disabledDate={currentDate =>
                      getFieldValue('interceptDateTo') &&
                      moment(getFieldValue('interceptDateTo')).isBefore(currentDate, 'second')
                    }
                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='拦截时间至'
              >
                {getFieldDecorator('interceptDateTo')(
                  <DatePicker
                    placeholder=""
                    style={{ width: '100%' }}
                    // showTime
                    format={getDateTimeFormat()}
                    disabledDate={currentDate =>
                      getFieldValue('interceptDateFrom') &&
                      moment(getFieldValue('interceptDateFrom')).isAfter(currentDate, 'second')
                    }
                    showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='拦截对象'
              >
                {getFieldDecorator('interceptObject')(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='例外放行SN'
              >
                {getFieldDecorator('materialLotCode')(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='拦截人'
              >
                {getFieldDecorator('interceptBy')(
                  <Lov code="HIAM.USER.ORG" />
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
