import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { Form, Button, Col, Row } from 'hzero-ui';

import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';
import MultipleLov from '@/components/MultipleLov';



const FilterForm = (props, ref) => {

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

  const { form: { getFieldDecorator }, tenantId } = props;

  return (
    <Form className={SEARCH_FORM_CLASSNAME} ref={formRef}>
      <Row>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item
            {...SEARCH_FORM_ITEM_LAYOUT}
            label='cos类型'
          >
            {getFieldDecorator('cosType')(
              <MultipleLov code="HME.COS_TYPE" queryParams={{ tenantId }} />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
          <Form.Item>
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
