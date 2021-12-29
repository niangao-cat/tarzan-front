/*
 * @Description: 不良情况说明
 * @Version: 0.0.1
 * @Autor: 张晨 <chen.zhang03@hand-china.com>
 * @Date: 2021-05-17 18:10:19
 */
import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import moment from 'moment';

export default class InspectionNcTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  getRowClassName = (record, index) => {
    let className = '';
    className = index % 2 === 0 ? "oddRow" : "evenRow";
    return className;
  }

  render() {
    const columns = [
      {
        title: '序号',
        width: 30,
        render: (value, record, index) => {
          const { page } = this.props;
          return ( page * 8) + index + 1;
        },
        align: 'center',
      },
      {
        title: '产线',
        dataIndex: 'prodLineName',
        width: 60,
        align: 'center',
      },
      {
        title: '稽核时间',
        dataIndex: 'inspectionFinishDate',
        width: 80,
        align: 'center',
        render: val => moment(val).format('MM-DD hh:mm:ss'),
      },
      {
        title: '工序',
        dataIndex: 'processName',
        width: 60,
        align: 'center',
      },
      {
        title: '问题描述',
        dataIndex: 'problemDesc',
        width: 80,
        align: 'center',
      },
      {
        title: '巡检员',
        dataIndex: 'inspectionName',
        width: 40,
        align: 'center',
      },
    ];

    const { dataSource } = this.props;
    return (
      <Table
        dataSource={dataSource}
        columns={columns}
        style={{ width: '100%', padding: '10px' }}
        rowClassName={this.getRowClassName}
        pagination={false}
      />
    );
  }
}
