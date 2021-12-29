/**
 * journalQuery - 库存日记账查询
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
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import ExcelExport from 'components/ExcelExport';
import moment from 'moment';
import { isUndefined } from 'lodash';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

@formatterCollections({
  code: ['tarzan.inventory.journalQuery'], // code 为 [服务].[功能]的字符串数组
})
/**
 * 用户权限维护
 * @extends {Component} - React.Component
 * @reactProps {Object} journalQuery - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ journalQuery, loading }) => ({
  journalQuery,
  fetchLoading: loading.effects['journalQuery/queryBillList'],
}))
export default class UserRights extends React.Component {
  listTable;

  queryForm;

  filterForm;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'journalQuery/queryInitInfo',
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'journalQuery/cleanModel',
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
    this.filterForm = (ref.props || {}).form;

  }

  @Bind()
  handleGetFormValue() {
    const filterValue = this.filterForm === undefined ? {} : this.filterForm.getFieldsValue();

    return filterNullValueObject({ ...filterValue,
       startTime: isUndefined(filterValue.startTime)
      ? null
      : moment(filterValue.startTime).format(DEFAULT_DATETIME_FORMAT),
      endTime: isUndefined(filterValue.endTime)? null
      : moment(filterValue.endTime).format(DEFAULT_DATETIME_FORMAT) });
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
            .get('tarzan.inventory.journalQuery.view.title.journalQuery')
            .d('库存日记账查询')}
        >
          <ExcelExport
            exportAsync
            requestUrl={`/mes/v1/${getCurrentOrganizationId()}/wms-inv-onhand-quantity/inv-journal-excel-export`}
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue()}
            // defaultConfig={{
            //   singleSheet: 100000, // 单sheet最大数量
            //   }}
          />
          <span style={{ fontSize: '13px'}}>
          *注释：库存日记账导出功能最多不能超多3000条
          </span>
        </Header>
        <Content>
          <FilterForm onRef={this.handleBindQueryRef} />
          <ListTable onRef={this.handleBindRef} onSearch={this.fetchQueryList} />
        </Content>
      </React.Fragment>
    );
  }
}
