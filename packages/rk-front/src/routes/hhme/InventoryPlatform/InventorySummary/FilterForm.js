import React, { Component } from 'react';
import { Form, Button, Row, Col, Input, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { isFunction } from 'lodash';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  FORM_COL_4_LAYOUT,
} from 'utils/constants';
import { getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';

@Form.create({ fieldNameProp: null })
class FilterForm extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {};
  }

  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
  }

  /**
   * 表单校验
   */
  @Bind()
  handleSearch() {
    const { onSearch, form } = this.props;
    if (onSearch) {
      form.validateFields((err, values) => {
        if (!err) {
          // 如果验证成功,则执行onSearch
          onSearch(values);
        }
      });
    }
  }

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

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, tenantId } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { expandForm } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='物料编码'
            >
              {getFieldDecorator('materialId')(
                <Lov code="QMS.MATERIAL" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='物料描述'
            >
              {getFieldDecorator('materialName')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label='产线编码' {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('prodLineId')(
                <Lov
                  code="Z.PRODLINE"
                  allowClear
                  queryParams={{
                    tenantId: getCurrentOrganizationId(),
                    workShopId: getFieldValue('workShopId'),
                  }}
                />
              )}
            </Form.Item>
          </Col>

          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={this.toggleForm}>
                {expandForm ? '收起' : '更多'}
              </Button>
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
        {expandForm && (
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="工序编码">
                {getFieldDecorator('workcellId')(
                  <Lov
                    code="HME.WORKCELL"
                    allowClear
                    queryParams={{
                      tenantId: getCurrentOrganizationId(),
                      typeFlag: 'PROCESS',
                      lineId: getFieldValue('lineId'),
                    }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="初盘是否一致">
                {getFieldDecorator('firstcountConsistentFlag')(
                  <Select allowClear>
                    <Select.Option value="Y" key="Y">
                      是
                    </Select.Option>
                    <Select.Option value="N" key="N">
                      否
                    </Select.Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="复盘是否一致">
                {getFieldDecorator('recountConsistentFlag')(
                  <Select allowClear>
                    <Select.Option value="Y" key="Y">
                      是
                    </Select.Option>
                    <Select.Option value="N" key="N">
                      否
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

export default FilterForm;
