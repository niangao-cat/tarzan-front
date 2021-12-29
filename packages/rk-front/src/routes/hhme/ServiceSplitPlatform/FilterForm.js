import React from 'react';
import { Form, Col, Row, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isFunction } from 'lodash';

import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';

const modelPromt = 'tarzan.hmes.purchaseOrder';

@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {

  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {};
  }

  @Bind()
  handleScanBarcode(e) {
    const { onScanBarcode } = this.props;
    if (e.target.value) {
      onScanBarcode(e.target.value.trim());
    }
  }


  // 渲染
  render() {
    // 获取整个表单
    const { form } = this.props;

    // 获取表单的字段属性
    const { getFieldDecorator } = form;

    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...formLayout}
              label={intl.get(`${modelPromt}.exceptionType`).d('拆机序列号')}
            >
              {getFieldDecorator('snNum')(
                <Input onPressEnter={e => this.handleScanBarcode(e)} />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
