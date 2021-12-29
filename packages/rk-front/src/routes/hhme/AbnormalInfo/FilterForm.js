import React from 'react';
import { Form, Button, Col, Row, Input, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';

const modelPromt = 'tarzan.hmes.purchaseOrder';
const { Option } = Select;

@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      expandForm: false,
    };
  }

  // 查询方法
  @Bind
  onSearch = () => {
    const { onSearch } = this.props;
    if (onSearch) {
      onSearch();
    }
  };

  // 重置查询
  @Bind()
  resetSearch = () => {
    const { form, onSearch } = this.props;
    form.resetFields();
    if (onSearch) {
      onSearch();
    }
  };

  /**
  * 表单展开收起
  */
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  }

  // 渲染
  render() {
    // 获取整个表单
    const { form, exceptionTypeList = [] } = this.props;
    // 获取表单的字段属性
    const { getFieldDecorator } = form;
    const { expandForm } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.exceptionType`).d('异常类型')}
            >
              {getFieldDecorator('exceptionType')(
                <Select>
                  {exceptionTypeList.map(e => (
                    <Option key={e.typeCode} value={e.typeCode}>
                      {e.description}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.exceptionName`).d('异常描述')}
            >
              {getFieldDecorator('exceptionName')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.exceptionCode`).d('异常编码')}
            >
              {getFieldDecorator('exceptionCode')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={this.toggleForm}>
                {intl.get(`tarzan.calendar.working.button.viewMore`).d('更多查询')}
              </Button>
              <Button onClick={() => this.resetSearch()}>
                {intl.get(`hzero.common.button.reset`).d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={() => this.onSearch()}>
                {intl.get(`hzero.common.button.search`).d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
        {expandForm && (
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='是否启用'>
                {getFieldDecorator('enableFlag', {})(
                  <Select allowClear style={{ width: '100%' }}>
                    <Select.Option key="Y" value="Y">
                      启用
                    </Select.Option>
                    <Select.Option key="N" value="N">
                      禁用
                    </Select.Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
        )}
      </Form>
    );
  }
}
