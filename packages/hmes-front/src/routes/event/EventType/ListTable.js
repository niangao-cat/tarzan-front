/**
 * ListTable - 表格
 * @date: 2019-8-6
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Table, Badge } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import notification from 'utils/notification';
import EventTypeDrawer from './EventTypeDrawer';
import ObjectTypeDrawer from './ObjectTypeDrawer';

const modelPrompt = 'tarzan.event.type.model.type';

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 表格
 * @extends {Component} - React.Component
 * @reactProps {Object} eventTypeList - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ eventType, loading }) => ({
  eventType,
  fetchLoading: loading.effects['eventType/fetchEventTypeList'],
}))
export default class ListTable extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  state = {
    initEventTypeData: {},
    eventTypeDrawerVisible: false,
    initObjectTypeData: {},
    tableDrawerVisible: false,
  };

  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagination) {
    const { onSearch } = this.props;
    onSearch(pagination);
  }

  // 打开编辑抽屉
  @Bind
  handleEventTypeDrawerShow(record = {}) {
    this.setState({ eventTypeDrawerVisible: true, initEventTypeData: record });
  }

  // 关闭编辑抽屉
  @Bind
  handleEventTypeDrawerCancel() {
    this.setState({ eventTypeDrawerVisible: false, initEventTypeData: {} });
  }

  // 编辑抽屉确认
  @Bind
  handleEventTypeDrawerOk(fieldsValue) {
    const {
      dispatch,
      onSearch,
      eventType: { eventTypePagination = {} },
    } = this.props;
    dispatch({
      type: 'eventType/saveEventType',
      payload: {
        ...fieldsValue,
      },
    }).then(res => {
      if (res && res.success) {
        this.setState({
          eventTypeDrawerVisible: false,
          initEventTypeData: {},
        });
        onSearch(eventTypePagination);
        notification.success();
      } else {
        notification.error({ message: res.message });
      }
    });
  }

  // 打开对象类型抽屉
  @Bind
  handleObjectTypeDrawerShow(record = {}) {
    const { dispatch } = this.props;
    dispatch({
      type: 'eventType/fetchObjectTypeList',
      payload: {
        eventTypeId: record.eventTypeId,
      },
    });
    this.setState({ tableDrawerVisible: true, initObjectTypeData: record });
  }

  // 关闭对象类型抽屉
  @Bind
  handleObjectTypeDrawerCancel() {
    this.setState({ tableDrawerVisible: false, initObjectTypeData: {} });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      eventType: { eventTypeList = [], eventTypePagination = {}, onhandChangeTypeList = [] },
      fetchLoading,
    } = this.props;
    const {
      eventTypeDrawerVisible,
      tableDrawerVisible,
      initEventTypeData,
      initObjectTypeData,
    } = this.state;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.eventTypeCode`).d('事件类型编码'),
        dataIndex: 'eventTypeCode',
        width: 300,
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.handleEventTypeDrawerShow(record);
              }}
            >
              {val}
            </a>
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('事件类型描述'),
        dataIndex: 'description',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 90,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.enableFlag === 'Y' ? 'success' : 'error'}
            text={
              record.enableFlag === 'Y'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.defaultEventTypeFlag`).d('系统初始事件标识'),
        dataIndex: 'defaultEventTypeFlag',
        width: 130,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.defaultEventTypeFlag === 'Y' ? 'success' : 'error'}
            text={
              record.defaultEventTypeFlag === 'Y'
                ? intl.get(`${modelPrompt}.yes`).d('是')
                : intl.get(`${modelPrompt}.no`).d('否')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.onhandChangeFlag`).d('影响库存标识'),
        dataIndex: 'onhandChangeFlag',
        width: 130,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.onhandChangeFlag === 'Y' ? 'success' : 'error'}
            text={
              record.onhandChangeFlag === 'Y'
                ? intl.get(`${modelPrompt}.yes`).d('是')
                : intl.get(`${modelPrompt}.no`).d('否')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.onhandChangeType`).d('影响库存方向'),
        dataIndex: 'onhandChangeType',
        width: 140,
        align: 'center',
        render: val => (
          <Fragment>
            {onhandChangeTypeList instanceof Array && onhandChangeTypeList.length !== 0
              ? (onhandChangeTypeList.filter(item => item.typeCode === val)[0] || {}).description
              : ''}
          </Fragment>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.operator`).d('事件影响对象类型'),
        dataIndex: 'operator',
        width: 200,
        align: 'center',
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.handleObjectTypeDrawerShow(record);
              }}
            >
              {intl.get(`${modelPrompt}.operatorRow`).d('对象类型')}
            </a>
          </span>
        ),
      },
    ];

    // 抽屉参数
    const eventTypeDrawerProps = {
      visible: eventTypeDrawerVisible,
      onCancel: this.handleEventTypeDrawerCancel,
      onOk: this.handleEventTypeDrawerOk,
      initData: initEventTypeData,
      onhandChangeTypeList,
    };
    // 对象类型抽屉参数
    const objectTypeDrawerProps = {
      visible: tableDrawerVisible,
      onCancel: this.handleObjectTypeDrawerCancel,
      onOk: this.handleObjectTypeDrawerCancel,
      initData: initObjectTypeData,
    };
    return (
      <React.Fragment>
        <Table
          loading={fetchLoading}
          rowKey="eventTypeId"
          dataSource={eventTypeList}
          columns={columns}
          pagination={eventTypePagination || {}}
          onChange={this.handleTableChange}
          bordered
        />
        <EventTypeDrawer {...eventTypeDrawerProps} />
        <ObjectTypeDrawer {...objectTypeDrawerProps} />
      </React.Fragment>
    );
  }
}
