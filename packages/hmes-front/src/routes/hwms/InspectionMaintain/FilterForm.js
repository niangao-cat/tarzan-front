import React, { PureComponent } from 'react';
import { Form, Button, Input, Row, Col } from 'hzero-ui';
import { isFunction } from 'lodash';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import {
  SEARCH_FORM_ROW_LAYOUT,
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';

/**
 *  页面搜索框
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
class FilterForm extends PureComponent {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
  }

  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    this.props.form.resetFields();
  }

  /**
   * 表单校验
   */
  @Bind()
  handleSearch() {
    const { onSearch, form } = this.props;
    if (onSearch) {
      form.validateFields(err => {
        if (!err) {
          onSearch();
        }
      });
    }
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const prefix = 'hwms.inspectionMaintain.model.inspectionMaintain';
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="more-fields-search-form">
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${prefix}.inspectionItem`).d('检查项目')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('inspectionItem', {})(<Input trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT} className="search-btn-more">
            <Form.Item>
              <Button data-code="reset" onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button
                data-code="search"
                type="primary"
                htmlType="submit"
                onClick={this.handleSearch}
              >
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
export default FilterForm;
