/**
 * eventRequestType - 事件请求类型维护
 * @date: 2019-8-1
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
import { addItemToPagination } from 'utils/utils';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 事件请求类型维护
 * @extends {Component} - React.Component
 * @reactProps {Object} eventRequestType - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ eventRequestType, loading }) => ({
  eventRequestType,
  fetchLoading: loading.effects['eventRequestType/fetchEventRequestTypeList'],
}))
@formatterCollections({ code: 'tarzan.event.requestType' })
export default class EventRequestType extends React.Component {
  state = {
    search: {},
  };

  componentDidMount() {
    this.refresh();
  }

  @Bind()
  refresh = (pagination = {}) => {
    const { dispatch } = this.props;
    const { search } = this.state;
    dispatch({
      type: 'eventRequestType/fetchEventRequestTypeList',
      payload: {
        ...search,
        page: pagination,
      },
    });
  };

  @Bind()
  onSearch = (fieldsValue = {}) => {
    this.setState(
      {
        search: fieldsValue,
      },
      () => {
        this.refresh();
      }
    );
  };

  @Bind()
  onResetSearch = () => {
    this.setState({
      search: {},
    });
  };

  /**
   * 新建事件请求类型
   */
  @Bind()
  handleCreateEventRequestType() {
    const {
      dispatch,
      eventRequestType: { eventRequestTypeList = [], eventRequestTypePagination = {} },
    } = this.props;
    if (
      eventRequestTypeList.length === 0 ||
      (eventRequestTypeList.length > 0 && eventRequestTypeList[0]._status !== 'create')
    ) {
      dispatch({
        type: 'eventRequestType/updateState',
        payload: {
          eventRequestTypeList: [
            {
              requestTypeId: null,
              requestTypeCode: '',
              enableFlag: 'Y',
              _status: 'create',
            },
            ...eventRequestTypeList,
          ],
          eventRequestTypePagination: addItemToPagination(
            eventRequestTypeList.length,
            eventRequestTypePagination
          ),
        },
      });
    }
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.event.requestType.title.list').d('事件请求类型维护')}>
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              this.handleCreateEventRequestType();
            }}
          >
            {intl.get('tarzan.event.requestType.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <FilterForm onSearch={this.onSearch} onResetSearch={this.onResetSearch} />
          <ListTable handleTableChange={this.refresh} />
        </Content>
      </React.Fragment>
    );
  }
}
