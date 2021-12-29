/**
 * eventQuery - 事件查询
 * @date: 2019-8-7
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Button } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

/**
 * 事件查询
 * @extends {Component} - React.Component
 * @reactProps {Object} eventTypeList - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ eventQuery, loading }) => ({
  eventQuery,
  fetchLoading: loading.effects['eventQuery/fetchEventList'],
}))
@formatterCollections({
  code: ['tarzan.event.eventQuery'], // code 为 [服务].[功能]的字符串数组
})
export default class EventQuery extends React.Component {
  listTable;

  queryForm;

  componentWillUnmount() {
    this.props.dispatch({
      type: 'eventQuery/cleanModel',
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

  // 展开表格
  @Bind()
  expendedAll() {
    const {
      dispatch,
      eventQuery: { eventList = [] },
    } = this.props;
    const expendedKeyList = [];
    eventList.forEach(row => {
      let rowKey = row.eventFlag ? 'event' : 'request';
      rowKey = `${rowKey}_${row.kid}`;
      expendedKeyList.push(rowKey);
    });
    dispatch({
      type: 'eventQuery/updateState',
      payload: {
        expendedKeyList,
      },
    });
  }

  // 收起表格
  @Bind()
  unExpendedAll() {
    this.props.dispatch({
      type: 'eventQuery/updateState',
      payload: {
        expendedKeyList: [],
      },
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.event.eventQuery.view.title.eventQuery').d('事件查询')}>
          <Button
            onClick={() => {
              this.expendedAll();
            }}
          >
            {intl.get('tarzan.event.eventQuery.button.expended').d('全部展开')}
          </Button>
          <Button
            onClick={() => {
              this.unExpendedAll();
            }}
          >
            {intl.get('tarzan.event.eventQuery.button.unExpended').d('全部收起')}
          </Button>
        </Header>
        <Content>
          <FilterForm onRef={this.handleBindQueryRef} />
          <ListTable onRef={this.handleBindRef} onSearch={this.fetchQueryList} />
        </Content>
      </React.Fragment>
    );
  }
}
