/**
 * ShiftTable - 表格
 * @date: 2019-12-6
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
  fetchLoading: loading.effects['working/fetchcalendarOrgList'],
}))
export default class OrganizationTable extends React.Component {
  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagination) {
    const { dispatch } = this.props;
    dispatch({
      type: 'working/fetchCalendarOrgList',
      payload: {
        page: pagination,
      },
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      working: { calendarOrgList = [], calendarOrgPagination = {} },
      fetchLoading,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.organizationCode`).d('组织编码'),
        dataIndex: 'organizationCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.organizationTypeDesc`).d('组织类型'),
        dataIndex: 'organizationTypeDesc',
        width: 160,
      },
      {
        title: intl.get(`${modelPrompt}.organizationDesc`).d('组织描述'),
        dataIndex: 'organizationDesc',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.calendarCode`).d('所属日历'),
        dataIndex: 'calendarCode',
        width: 100,
        align: 'center',
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
    ];
    return (
      <React.Fragment>
        <Table
          loading={fetchLoading}
          rowKey="calendarShiftId"
          dataSource={calendarOrgList}
          columns={columns}
          pagination={calendarOrgPagination || {}}
          onChange={this.handleTableChange}
          bordered
        />
      </React.Fragment>
    );
  }
}
