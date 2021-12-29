/**
 * ListTable - 表格
 * @date: 2019-8-6
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Table } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import EventDetailsDrawer from './EventDetailsDrawer';
import ParentEventDrawer from './ParentEventDrawer';

const modelPrompt = 'tarzan.event.eventQuery.model.eventQuery';

/**
 * 表格
 * @extends {Component} - React.Component
 * @reactProps {Object} eventQuery - 数据源
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
export default class ListTable extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      eventDetailsDrawerVisible: false, // 对象详细信息Drawer
      parentEventDrawerVisible: false, // 父事件主键Drawer
    };
  }

  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagination) {
    const { onSearch } = this.props;
    onSearch(pagination);
  }

  // 关闭编辑抽屉
  @Bind()
  handleDrawerCancel() {
    const { dispatch } = this.props;
    this.setState({ eventDetailsDrawerVisible: false, parentEventDrawerVisible: false });
    dispatch({
      type: 'eventQuery/updateState',
      payload: {
        parentDrawerInfo: [],
      },
    });
  }

  /**
   * 查看对象父事件抽屉信息
   */
  @Bind()
  showFatherEventDetails(val) {
    this.props.dispatch({
      type: 'eventQuery/fetchParentEventDetails',
      payload: {
        parentEventId: val,
      },
    });
    this.setState({
      parentEventDrawerVisible: true,
    });
  }

  /**
   * 查看事件对象详细信息
   */
  @Bind()
  handleEventDetailsDrawerShow(record) {
    this.props
      .dispatch({
        type: 'eventQuery/fetchEventDetails',
        payload: {
          eventId: record.kid,
        },
      })
      .then(res => {
        if (res && res.success) {
          if (res.rows.length > 0) {
            this.setState({ eventDetailsDrawerVisible: true });
          } else {
            notification.error({ message: '暂无对象详细信息' });
          }
        } else {
          notification.error({ message: res.message });
        }
      });
  }

  // 表格展开或关闭
  @Bind()
  onExpandTable(expanded, record) {
    const {
      dispatch,
      eventQuery: { expendedKeyList = [] },
    } = this.props;
    const keyList = expendedKeyList;
    let rowKey = record.eventFlag ? 'event' : 'request';
    rowKey = `${rowKey}_${record.kid}`;
    if (expanded) {
      keyList.push(rowKey);
    } else {
      this.arrayRemoveItem(keyList, rowKey);
    }
    dispatch({
      type: 'eventQuery/updateState',
      payload: {
        expendedKeyList: keyList,
      },
    });
  }

  // 数组的删除
  arrayRemoveItem(arr, delVal) {
    if (arr instanceof Array) {
      const index = arr.indexOf(delVal);
      if (index > -1) {
        arr.splice(index, 1);
      }
    }
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      eventQuery: {
        eventList = [],
        eventPagination = {},
        parentDrawerInfo = [],
        eventDetailDrawerInfo = [],
        expendedKeyList = [],
      },
      fetchLoading,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.rowStyle`).d('行类型'),
        width: 160,
        dataIndex: 'rowStyle',
        align: 'left',
        render: (_, record) => (
          <span>
            {record.eventFlag
              ? intl.get(`${modelPrompt}.event`).d('事件')
              : intl.get(`${modelPrompt}.eventQuery`).d('事件请求')}
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.kid`).d('事件/请求主键'),
        width: 120,
        dataIndex: 'kid',
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.typeCode`).d('事件/请求类型编码'),
        dataIndex: 'typeCode',
        width: 200,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.typeDesc`).d('事件/请求类型描述'),
        dataIndex: 'typeDesc',
        width: 140,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.operationTime`).d('事件时间'),
        dataIndex: 'operationTime',
        width: 160,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.operationTime`).d('事件时间'),
        dataIndex: 'operationTime',
        width: 160,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.materialLotCode`).d('条码'),
        dataIndex: 'materialLotCode',
        width: 130,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
        width: 130,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('物料名称'),
        dataIndex: 'materialName',
        width: 130,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.primaryUomQty`).d('数量'),
        dataIndex: 'primaryUomQty',
        width: 80,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.operationBy`).d('操作人'),
        dataIndex: 'operationUserName',
        width: 100,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.workcellCode`).d('工作单元'),
        dataIndex: 'workcellCode',
        width: 100,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.locatorCode`).d('库位'),
        dataIndex: 'locatorCode',
        width: 100,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.shiftDate`).d('班次日期'),
        dataIndex: 'shiftDate',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.shiftCode`).d('班次编码'),
        dataIndex: 'shiftCode',
        width: 120,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.parentEventId`).d('父事件主键'),
        dataIndex: 'parentEventId',
        width: 110,
        align: 'center',
        render: val => (
          <span className="action-link">
            <a onClick={() => this.showFatherEventDetails(val)}>{val}</a>
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.eventDetails`).d('对象详细信息'),
        dataIndex: 'itemDetails',
        width: 110,
        align: 'center',
        render: (_, record) =>
          record.eventFlag ? (
            <span className="action-link">
              <a onClick={() => this.handleEventDetailsDrawerShow(record)}>
                {intl.get(`${modelPrompt}.lookOver`).d('查看')}
              </a>
            </span>
          ) : null,
      },
    ];

    // 抽屉参数
    const parentEventDrawerProps = {
      visible: this.state.parentEventDrawerVisible,
      onCancel: this.handleDrawerCancel,
      initData: parentDrawerInfo,
    };

    // 抽屉参数
    const eventDetailsDrawerProps = {
      visible: this.state.eventDetailsDrawerVisible,
      onCancel: this.handleDrawerCancel,
      initData: eventDetailDrawerInfo,
    };
    return (
      <Fragment>
        <Table
          loading={fetchLoading}
          dataSource={eventList}
          columns={columns}
          pagination={eventPagination || {}}
          onChange={this.handleTableChange}
          scroll={{ x: 1600 }}
          expandedRowKeys={expendedKeyList}
          onExpand={this.onExpandTable}
          rowKey={record => {
            let type = record.eventFlag ? 'event' : 'request';
            type = `${type}_${record.kid}`;
            return type;
          }}
          bordered
        />
        <ParentEventDrawer {...parentEventDrawerProps} />
        <EventDetailsDrawer {...eventDetailsDrawerProps} />
      </Fragment>
    );
  }
}
