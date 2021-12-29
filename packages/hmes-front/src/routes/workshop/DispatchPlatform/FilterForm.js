/**
 * FilterForm - 搜索框
 * @date: 2019-12-10
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Checkbox, Row, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import styles from './index.less';

const modelPrompt = 'tarzan.workshop.dispatchPlatform.model.dispatchPlatform';
const tenantId = getCurrentOrganizationId();

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
@connect(({ dispatchPlatform }) => ({
  dispatchPlatform,
}))
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      queryDetailsVisible: false, // 更多查询的收起与展开
    };
  }

  /**
   * 查询数据
   * @param {object} page 页面基本信息数据
   */
  @Bind()
  fetchTableList(pagination = {}) {
    const {
      form,
      dispatch,
      dispatchPlatform: { defaultSiteId, selectedProLineId, selectedOperationId },
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'dispatchPlatform/fetchTableInfo',
          payload: {
            ...fieldsValue,
            defaultSiteId,
            prodLineId: selectedProLineId,
            operationId: selectedOperationId,
            page: pagination,
          },
        });
        dispatch({
          type: 'dispatchPlatform/updateState',
          payload: {
            selectedRowId: '',
            selectedRowRecord: {},
            expandedRowKeysArray: [],
          },
        });
      }
    });
  }

  /**
   * 重置form表单
   */
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
  }

  /**
   * 显示或隐藏更多查询条件
   */
  @Bind()
  handleQueryDetails() {
    this.setState({
      queryDetailsVisible: !this.state.queryDetailsVisible,
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { queryDetailsVisible } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form className={`${SEARCH_FORM_CLASSNAME} ${styles.filterForm}`}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.WOCode`).d('WO编码')}
            >
              {getFieldDecorator('workOrderId')(
                <Lov queryParams={{ tenantId }} code="MT.WORK_ORDER" />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.EOCode`).d('EO编码')}
            >
              {getFieldDecorator('eoId')(<Lov queryParams={{ tenantId }} code="MT.EO" />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.materialCode`).d('物料编码')}
            >
              {getFieldDecorator('materialId')(
                <Lov queryParams={{ tenantId }} code="MT.MATERIAL" />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <FormItem>
              <Button style={{ marginLeft: 8 }} onClick={this.handleQueryDetails}>
                {queryDetailsVisible
                  ? intl.get('tarzan.workshop.dispatchPlatform.button.retractSearch').d('收起查询')
                  : intl.get('tarzan.workshop.dispatchPlatform.button.moreSearch').d('更多查询')}
              </Button>
              <Button onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.fetchTableList}>
                {intl.get('tarzan.workshop.dispatchPlatform.button.search').d('查询')}
              </Button>
            </FormItem>
          </Col>
        </Row>
        <Row
          {...SEARCH_FORM_ROW_LAYOUT}
          style={{ display: queryDetailsVisible ? 'block' : 'none' }}
        >
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.onlyUnDispatchFlag`).d('未调度')}
            >
              {getFieldDecorator('onlyUnDispatchFlag')(
                <Checkbox checkedValue="Y" unCheckedValue="" />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.onlyDispatchFlag`).d('已调度')}
            >
              {getFieldDecorator('onlyDispatchFlag')(
                <Checkbox checkedValue="Y" unCheckedValue="" />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
