import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Form, Button, Col, Row, Select, Input } from 'hzero-ui';
import { isEmpty } from 'lodash';

import intl from 'utils/intl';
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

  const { form: { getFieldDecorator }, tenantId, areaList, departmentInfo } = props;

  return (
    <Form className={SEARCH_FORM_CLASSNAME} ref={formRef}>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col span={18}>
          <Row>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='应用事业部'
              >
                {getFieldDecorator('businessId', {
                  initialValue: isEmpty(departmentInfo) ? null : departmentInfo.areaId,
                })(
                  <Select
                    style={{ width: '100%' }}
                    allowClear
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
                label='物料组编码'
              >
                {getFieldDecorator('itemGroupId')(
                  <Lov
                    code="WMS.ITEM_GROUP"
                    queryParams={{ tenantId }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='规则编码'
              >
                {getFieldDecorator('ruleCode')(
                  <Input />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ display: expandForm ? 'block' : 'none' }}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='是否有效'
              >
                {getFieldDecorator('enableFlag')(
                  <Select allowClear>
                    <Option key="Y" value="Y">
                      是
                    </Option>
                    <Option key="N" value="N">
                      否
                    </Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='当前工序'
              >
                {getFieldDecorator('workcellId')(
                  <Lov
                    code="HME.FINAL_PROCESS"
                    queryParams={{ tenantId }}
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
