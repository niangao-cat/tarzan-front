/*
 * @Description: 员工出勤报表-头表
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-01 09:34:27
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-04-01 15:37:36
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Form, Table } from 'hzero-ui';
import { isArray } from 'lodash';
import { tableScrollWidth } from 'utils/utils';
import styles from '../index.less';

@Form.create({ fieldNameProp: null })
export default class HeadTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { dataSource, onSearch, pagination, loading, rowsSelection } = this.props;
    const columns = [
      {
        title: '生产线',
        dataIndex: 'prodLineName',
        width: 120,
        align: 'center',
      },
      {
        title: '工段',
        dataIndex: 'workName',
        width: 100,
        align: 'center',
      },
      {
        title: '班次日期',
        dataIndex: 'date',
        width: 150,
        align: 'center',
      },
      {
        title: '班次',
        dataIndex: 'shiftCode',
        width: 80,
        align: 'center',
      },
      {
        title: '班次开始时间',
        dataIndex: 'shiftStartDate',
        width: 150,
        align: 'center',
      },
      {
        title: '班次结束时间',
        dataIndex: 'shiftEndDate',
        width: 150,
        align: 'center',
      },
      {
        title: '实际产出',
        dataIndex: 'actualOutputNumber',
        width: 150,
        align: 'center',
      },
      {
        title: '总产量',
        dataIndex: 'countNumber',
        width: 80,
        align: 'center',
        render: (val, record) => {
          return (<a onClick={() => this.props.onMakeNumDetail(record, "summaryList")}>{val}</a>);
        },
      },
      {
        title: '不良数',
        dataIndex: 'defectsNumber',
        width: 80,
        align: 'center',
        render: (val, record) => {
          return (<a onClick={() => this.props.onDefectsNumbDetail(record, "head")}>{val}</a>);
        },
      },
      {
        title: '标准人数',
        dataIndex: 'employNumber',
        width: 100,
        align: 'center',
      },
      {
        title: '出勤数',
        dataIndex: 'attendanceNumber',
        width: 80,
        align: 'center',
      },
      {
        title: '缺勤数',
        dataIndex: 'noWorkNumber',
        width: 80,
        align: 'center',
      },
      {
        title: '标准总工时',
        dataIndex: 'countTime',
        width: 100,
        render: text => {
          return <span>{text}h</span>;
        },
        align: 'center',
      },
      {
        title: '实际总工时',
        dataIndex: 'countWorkTime',
        width: 100,
        render: text => {
          return <span>{text}h</span>;
        },
        align: 'center',
      },
      {
        title: '偏差',
        dataIndex: 'noWorkTime',
        width: 60,
        render: text => {
          return <span style={{ color: '#E86A6A' }}>-{text}h</span>;
        },
        align: 'center',
      },
      {
        title: '班组',
        dataIndex: 'unitName',
        width: 80,
        align: 'center',
      },
      {
        title: '派工数量',
        dataIndex: 'workNumber',
        width: 100,
        align: 'center',
      },
      {
        title: '生产效率',
        dataIndex: 'efficiency',
        width: 100,
        align: 'center',
      },
      {
        title: '派工完工率',
        dataIndex: 'completionRate',
        width: 100,
        align: 'center',
      },
      {
        title: '组长',
        dataIndex: 'teamLeader',
        width: 120,
        align: 'center',
        render: (val, record) =>
        {
          if(isArray(record.groupLeaderList) && record.groupLeaderList.length>0){
            return record.groupLeaderList.join(',');
          }else{
            return '';
          }
        },
      },
    ];
    return (
      <Table
        rowKey={record =>`${record.wkcShiftId}#${record.workId}`}
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: tableScrollWidth(columns) }}
        className={styles['report-line-table']}
        bordered
        rowSelection={rowsSelection}
        pagination={pagination}
        onChange={page => onSearch(page)}
        loading={loading}
      />
    );
  }
}
