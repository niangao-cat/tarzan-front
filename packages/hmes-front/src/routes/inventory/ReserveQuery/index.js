/**
 * reserveQuery - 库存预留日记账
 * @date: 2019-7-31
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

@formatterCollections({
  code: ['tarzan.inventory.reserveQuery'], // code 为 [服务].[功能]的字符串数组
})
/**
 * 用户权限维护
 * @extends {Component} - React.Component
 * @reactProps {Object} reserveQuery - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ reserveQuery, loading }) => ({
  reserveQuery,
  fetchLoading: loading.effects['reserveQuery/queryBillList'],
}))
export default class ReserveQuery extends React.Component {
  listTable;

  queryForm;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'reserveQuery/queryInitInfo',
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'reserveQuery/cleanModel',
    });
  }

  /**
   * 查询数据
   * @param {object} page 页面基本信息数据
   */
  @Bind()
  fetchQueryList(pagination = {}) {
    this.queryForm.fetchQueryList(pagination);
  }

  /**
   *
   * @param {object} ref - listTable子组件对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.listTable = ref;
  }

  /**
   *
   * @param {object} ref - FilterForm子组件对象
   */
  @Bind()
  handleBindQueryRef(ref = {}) {
    this.queryForm = ref;
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    return (
      <React.Fragment>
        <Header
          title={intl
            .get('tarzan.inventory.reserveQuery.view.title.reserveQueryst')
            .d('库存预留日记账')}
        />
        <Content>
          <FilterForm onRef={this.handleBindQueryRef} />
          <ListTable onRef={this.handleBindRef} onSearch={this.fetchQueryList} />
        </Content>
      </React.Fragment>
    );
  }
}
