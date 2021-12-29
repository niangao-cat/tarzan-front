/**
 * @description  处置组功能维护
 * @param null
 * @author ywj
 * @email wenjie.yang01@hand-china.com
 * @date 2020/11/25
 * @time 13:52
 * @version 0.0.1
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Row, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';

const modelPrompt = 'tarzan.hhme.disposalGroupMaintenance';

/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

/**
 * 搜索框
 * @extends {Component} - React.Component
 * @reactProps {Object} workCellList - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ defectCode }) => ({
  defectCode,
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.hhme.disposalGroupMaintenance',
})
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
    };
  }


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
   * 重置form表单
   */
  @Bind()
  handleFormReset() {
    const { form, resetSearch } = this.props;
    form.resetFields();
    resetSearch();
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      form,
      // defectCode: { ncTypeList = [] },
    } = this.props;
    const { getFieldDecorator } = form;
    const tenantId = getCurrentOrganizationId();
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.siteName`).d('站点')}
            >
              {getFieldDecorator('siteId')(<Lov code="MT.SITE" queryParams={{ tenantId }} />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.dispositionGroup`).d('处置组编码')}
            >
              {getFieldDecorator('dispositionGroup')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.description`).d('处置组描述')}
            >
              {getFieldDecorator('description')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <FormItem>
              <Button onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={()=>this.handleSearch()}>
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
