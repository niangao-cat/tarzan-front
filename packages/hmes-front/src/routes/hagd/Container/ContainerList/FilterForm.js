/**
 * FilterForm - 搜索框
 * date: 2019-12-4
 * @author: xubiting <biting.xu@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Select } from 'hzero-ui';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import intl from 'utils/intl';
import { connect } from 'dva';

const modelPrompt = 'tarzan.hagd.containerType.model';

const ENABLETEXT = {
  Y: intl.get(`${modelPrompt}.start`).d('启用'),
  N: intl.get(`${modelPrompt}.stop`).d('禁用'),
};

@connect(({ containerType }) => ({ containerType }))
@Form.create({ fieldNameProp: null })
export default class FilterForm extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  state = {
    expandForm: false,
  };

  fetchQueryList = () => {
    const { onSearch = c => c, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        onSearch(values);
      }
    });
  };

  handleFormReset = () => {
    const { handleFormReset = c => c, form } = this.props;
    form.resetFields();
    handleFormReset();
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({ expandForm: !expandForm });
  };

  render() {
    const {
      form,
      containerType: { packingLevel = [] },
    } = this.props;
    const { getFieldDecorator } = form;
    const { expandForm } = this.state;

    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.containerTypeCode`).d('容器类型编码')}
            >
              {getFieldDecorator('containerTypeCode')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.containerTypeDescription`).d('容器类型描述')}
            >
              {getFieldDecorator('containerTypeDescription')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.enableFlag`).d('启用状态')}
            >
              {getFieldDecorator('enableFlag')(
                <Select style={{ width: '100%' }} allowClear>
                  {['Y', 'N'].map(item => {
                    return (
                      <Select.Option value={item} key={item}>
                        {ENABLETEXT[item]}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={this.toggleForm}>
                {expandForm
                  ? `${intl.get(`${modelPrompt}.stopSearch`).d('收起查询')}`
                  : `${intl.get(`${modelPrompt}.expandSearch`).d('更多查询')}`}
              </Button>
              <Button onClick={this.handleFormReset}>
                {intl.get(`${modelPrompt}.reset`).d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.fetchQueryList}>
                {intl.get(`${modelPrompt}.search`).d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.packingLevel`).d('包装等级')}
            >
              {getFieldDecorator('packingLevel')(
                <Select style={{ width: '100%' }} allowClear>
                  {packingLevel.map(item => {
                    return (
                      <Select.Option value={item.typeCode} key={item.typeCode}>
                        {item.description}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
