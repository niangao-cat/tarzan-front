/**
 * ShiftTable - 表格
 * @date: 2019-12-5
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Table, Badge } from 'hzero-ui';
// import {isUndefined} from 'lodash';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.calendar.working.model.working';

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 表格
 * @extends {Component} - React.Component
 * @reactProps {Object} working - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ working, loading }) => ({
  working,
  fetchLoading: loading.effects['working/fetchCalendarShiftList'],
}))
export default class ShiftTable extends React.Component {
  state = {
    selectedRowKeys: '',
  };

  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagination) {
    const { dispatch, calendarId, shiftDate } = this.props;
    dispatch({
      type: 'working/fetchCalendarShiftList',
      payload: {
        calendarId,
        shiftDate,
        page: pagination,
      },
    });
  }

  // 选中行事件
  @Bind
  onChange(selectedRowKeys, selectedRows) {
    this.setState({
      selectedRowKeys,
    });
    this.props.dispatch({
      type: 'working/updateState',
      payload: {
        shiftFormList: selectedRows[0],
        calendarShiftIdList: selectedRowKeys,
      },
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      working: { calendarShiftList = [], calendarShiftPagination = {} },
      fetchLoading,
      showShiftDrawer,
    } = this.props;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onChange,
    };
    const columns = [
      {
        title: intl.get(`${modelPrompt}.calendarCode`).d('日历编码'),
        dataIndex: 'calendarCode',
        width: 100,
        render: (val, record) => {
          return <a onClick={() => showShiftDrawer(record)}>{val}</a>;
        },
      },
      {
        title: intl.get(`${modelPrompt}.shiftCode`).d('班次编码'),
        dataIndex: 'shiftCode',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.shiftDate`).d('班次日期'),
        dataIndex: 'shiftDate',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.dayOfWeek`).d('星期'),
        dataIndex: 'dayOfWeek',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.weekOfYear`).d('周次'),
        dataIndex: 'weekOfYear',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.sequence`).d('顺序'),
        dataIndex: 'sequence',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 100,
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
        title: intl.get(`${modelPrompt}.shiftStartTime`).d('开始时间'),
        dataIndex: 'shiftStartTime',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.shiftEndTime`).d('结束时间'),
        dataIndex: 'shiftEndTime',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.restTime`).d('休息时间'),
        dataIndex: 'restTime',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.utilizationRate`).d('开动率'),
        dataIndex: 'utilizationRate',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.borrowingAbility`).d('借用能力'),
        dataIndex: 'borrowingAbility',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.capacityUnit`).d('能力单位'),
        dataIndex: 'capacityUnit',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.standardCapacity`).d('标准产量'),
        dataIndex: 'standardCapacity',
        width: 100,
      },
    ];
    return (
      <React.Fragment>
        <Table
          loading={fetchLoading}
          rowSelection={rowSelection}
          rowKey="calendarShiftId"
          dataSource={calendarShiftList}
          columns={columns}
          pagination={calendarShiftPagination || {}}
          onChange={this.handleTableChange}
          bordered
        />
      </React.Fragment>
    );
  }
}
