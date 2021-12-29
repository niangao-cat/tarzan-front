/**
 * @author:ywj
 * @email:wenjie.yang01@hand-china.com
 * @description: 外协管理平台 视图层（筛选）
 */
import React from 'react';
import { Form, Button, Col, Row, Input, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isFunction } from 'lodash';

import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  // FORM_FIELD_CLASSNAME,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';

// 表单创建
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
    };
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
  }

  @Bind
  handleSearch = () => {
    const { onSearch } = this.props;
    if (onSearch) {
      onSearch();
    }
  };

  @Bind
  resetSearch = () => {
    const { form } = this.props;
    form.resetFields();
  };

  @Bind
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({ expandForm: !expandForm });
  };

  render() {
    const { form, typeMap = [] } = this.props;
    const { getFieldDecorator } = form;
    const { expandForm } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label={intl.get(`hotSinkCode`).d('热沉号')}>
              {getFieldDecorator('hotSinkCode')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label={intl.get(`materialCode`).d('芯片料号')}>
              {getFieldDecorator('materialCode')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label={intl.get(`materialLotCode`).d('条码号')}>
              {getFieldDecorator('materialLotCode')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={this.toggleForm}>
                {expandForm
                  ? intl.get('tarzan.org.dataItem.button.collected').d('收起查询')
                  : intl.get(`tarzan.org.dataItem.button.viewMore`).d('更多查询')}
              </Button>
              <Button onClick={this.resetSearch}>
                {intl.get(`hzero.common.button.reset`).d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.handleSearch}>
                {intl.get(`hzero.common.button.search`).d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>

        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label={intl.get(`cosType`).d('芯片类型')}>
              {getFieldDecorator('cosType')(
                <Select allowClear>
                  {typeMap.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label={intl.get(`wafer`).d('wafer')}>
              {getFieldDecorator('wafer')(<Input />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
