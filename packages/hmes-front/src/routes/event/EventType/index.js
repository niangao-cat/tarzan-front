/**
 * eventType - 事件类型维护
 * @date: 2019-7-30
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Button } from 'hzero-ui';
// import {isUndefined} from 'lodash';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
// import notification from 'utils/notification';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 事件类型维护
 * @extends {Component} - React.Component
 * @reactProps {Object} eventTypeList - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ eventType, loading }) => ({
  eventType,
  fetchLoading: loading.effects['eventType/fetchEventTypeList'],
}))
@formatterCollections({ code: 'tarzan.event.type' })
export default class EventType extends React.Component {
  listTable;

  queryForm;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'eventType/fetchEventTypeList',
    });
    dispatch({
      type: 'eventType/fetchOnhandChangeTypeList',
      payload: {
        module: 'EVENT',
        typeGroup: 'EVENT_ONHAND_CHANGE_TYPE',
      },
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
   * @param {object} ref - FilterForm子组件对象
   */
  @Bind()
  handleBindQueryRef(ref = {}) {
    this.queryForm = ref;
  }

  /**
   *
   * @param {object} ref - listTable子组件对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.listTable = ref;
  }

  // 新增
  @Bind
  handleCreate() {
    this.listTable.handleEventTypeDrawerShow();
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.event.type.title.list').d('事件类型维护')}>
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              this.handleCreate();
            }}
          >
            {intl.get('tarzan.event.type.button.create').d('新建')}
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
