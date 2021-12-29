/*
 * @Description: 非标产品报表
 * @version: 0.1.0
 * @Author: xinyu.wang02@hand-china.com
 * @Date: 2020-04-01 09:34:27
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2021-01-11 09:36:31
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Bind } from 'lodash-decorators';
import { Form, Table } from 'hzero-ui';
import { tableScrollWidth } from 'utils/utils';
import { TablePermission } from 'components/Permission';
// import styles from '../index.less';

@Form.create({ fieldNameProp: null })
export default class HeadTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  @Bind()
  onRow(record) {
    const { onRow } = this.props;
    onRow(record);
  }

  @Bind()
  onCell() {
    return {
      style: {
        overflow: 'hidden',
        maxWidth: 180,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      onClick: e => {
        const { target } = e;
        if (target.style.whiteSpace === 'normal') {
          target.style.whiteSpace = 'nowrap';
        } else {
          target.style.whiteSpace = 'normal';
        }
      },
    };
  }

  render() {
    const { dataSource, onSearch, pagination, loading, path } = this.props;
    const columns = [
      {
        title: '车间',
        dataIndex: 'workshopName',
        width: 150,
        align: 'center',
      },
      {
        title: '产线',
        dataIndex: 'prodLineName',
        width: 150,
        align: 'center',
      },
      {
        title: '销售订单号',
        dataIndex: 'soNum',
        width: 150,
        align: 'center',
      },
      {
        title: '工单号',
        dataIndex: 'workOrderNum',
        width: 120,
        align: 'center',
      },
      {
        title: '客户编码',
        dataIndex: 'customerCode',
        width: 120,
        align: 'center',
        permissionList: [
          {
            code: `${path}.table.customerCode`,
            type: 'table',
            meaning: '客户编码',
          },
        ],
      },
      {
        title: '客户名称',
        dataIndex: 'customerName',
        width: 120,
        align: 'center',
        permissionList: [
          {
            code: `${path}.table.customerName`,
            type: 'table',
            meaning: '客户名称',
          },
        ],
      },
      {
        title: '工单状态',
        dataIndex: 'woStatusMeaning',
        width: 120,
        align: 'center',
      },
      {
        title: '产品料号',
        dataIndex: 'materialCode',
        width: 150,
        align: 'center',
      },
      {
        title: '产品描述',
        dataIndex: 'materialName',
        width: 150,
        align: 'center',
        onCell: this.onCell,
      },
      {
        title: '生产订单创建时间',
        dataIndex: 'creationDate',
        width: 160,
        align: 'center',
      },
      {
        title: '生产订单下达时间',
        dataIndex: 'releaseDate',
        width: 160,
        align: 'center',
      },
      {
        title: '工单数量',
        dataIndex: 'woQty',
        width: 100,
        align: 'center',
      },
      {
        title: '待上线',
        dataIndex: 'waitQty',
        width: 80,
        align: 'center',
        render: (val, record) => {
          return (<a onClick={() => this.props.onMakeNumDetail(record, "makeNum")}>{val}</a>);
        },
      },
      {
        title: '在线数量',
        dataIndex: 'wipQty',
        width: 100,
        align: 'center',
        render: (val, record) => {
          return (<a onClick={() => this.props.onDefectsNumbDetail(record)}>{val}</a>);
        },
      },
      {
        title: '完工（末道）',
        dataIndex: 'completedQty',
        width: 120,
        align: 'center',
        render: (val, record) => {
          return (<a onClick={() => this.props.onRepairNumDetail(record)}>{val}</a>);
        },
      },
      {
        title: '待入库',
        dataIndex: 'notStock',
        width: 100,
        align: 'center',
      },
      {
        title: '已入库',
        dataIndex: 'inStock',
        width: 80,
        align: 'center',
      },
      {
        title: '工单备注',
        dataIndex: 'remark',
        width: 150,
        align: 'center',
        onCell: this.onCell,
      },
    ];
    return (
      <TablePermission>
        <Table
          dataSource={dataSource}
          columns={columns}
          scroll={{ x: tableScrollWidth(columns) }}
          // className={styles['report-liine-table']}
          bordered
          // onRow={record => {
          //   return {
          //     onClick: () => this.onRow(record), // 点击行
          //   };
          // }}
          pagination={pagination}
          onChange={page => onSearch(page)}
          loading={loading}
        />
      </TablePermission>
    );
  }
}
