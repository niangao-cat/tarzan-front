/*
 * @Description: 工单列表
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-03-25 10:45:51
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-10-22 10:43:23
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Bind } from 'lodash-decorators';
import { Form, Table } from 'hzero-ui';
import { tableScrollWidth } from 'utils/utils';
import styles from '../index.less';

@Form.create({ fieldNameProp: null })
export default class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedRowKeys: [],
      selectedRows: {},
    };
  }

  @Bind()
  handleChangeExpandedRowKeys(isExpand, record) {
    const { expandedRowKeys } = this.state;
    const rowKeys = isExpand
      ? [...expandedRowKeys, record.workOrderId]
      : expandedRowKeys.filter(item => item !== record.workOrderId);
    this.setState({
      expandedRowKeys: rowKeys,
    });
  }

  @Bind()
  handleOpenDrawer(record, flag) {
    this.props.onOpenDrawer(record, flag);
  }

  // 按钮事件
  @Bind()
  snCreate(record) {
    this.props.snCreate(record);
  }

  @Bind()
  handleClickSelectedRows(record) {
    const { handleComponentMeaterial } = this.props;
    this.setState({ selectedRows: record }, ()=>{
      handleComponentMeaterial(record);
    });
  }

  @Bind()
  handleClickRow(record) {
    const { selectedRows } = this.state;
    if (selectedRows.workOrderId === record.workOrderId) {
      return styles['tickt-data-click'];
    } else {
      return '';
    }
  }

  render() {
    const { expandedRowKeys } = this.state;
    const { onSelectRow, selectedRowKeys, dataSource, pagination, loading, onChange, jumpPage, gotoWorkShop } = this.props;
    const columns = [
      // {
      //   title: <Icon type="plus-square-o" className={styles['table-columns-icon']} />,
      //   dataIndex: '',
      //   width: 60,
      //   align: 'center',
      // },
      {
        title: '制造部',
        dataIndex: 'departmentName',
        width: 60,
        align: 'center',
      },
      // {
      //   title: '车间',
      //   dataIndex: 'workshop',
      //   width: 60,
      //   align: 'center',
      // },
      {
        title: '订单编号',
        dataIndex: 'makeOrderNum',
        width: 100,
        align: 'center',
      },
      {
        title: '工单编号',
        dataIndex: 'workOrderNum',
        width: 100,
        align: 'center',
        render: (val, record) => (
          <a className="action-link" onClick={() => jumpPage(record, 'WO')}>
            {val}
          </a>
        ),
      },
      {
        title: 'BOM编码',
        dataIndex: 'bomName',
        width: 80,
        align: 'center',
        render: (val, record) => (
          <a className="action-link" onClick={() => jumpPage(record, 'BOM')}>
            {val}
          </a>
        ),
      },
      {
        title: '工艺路线编码',
        dataIndex: 'routerName',
        width: 100,
        align: 'center',
        render: (val, record) => (
          <a className="action-link" onClick={() => jumpPage(record, 'RN')}>
            {val}
          </a>
        ),
      },
      {
        title: '工单版本',
        dataIndex: 'productionVersion',
        width: 60,
        align: 'center',
      },
      {
        title: '工单类型',
        dataIndex: 'workOrderTypeDesc',
        width: 70,
        align: 'center',
      },
      {
        title: '生产线',
        dataIndex: 'productionLineName',
        width: 70,
        align: 'center',
      },
      {
        title: '工单状态',
        dataIndex: 'orderStatusDesc',
        width: 90,
        align: 'center',
      },
      {
        title: '工单数量',
        dataIndex: 'qty',
        width: 60,
        align: 'center',
      },
      {
        title: '完成数量',
        dataIndex: 'completedQty',
        width: 60,
        align: 'center',
      },
      {
        title: '下达数量',
        dataIndex: 'releasedQty',
        width: 60,
        align: 'center',
        render: (val, record) => (
          <a className="action-link" onClick={() => gotoWorkShop(record, 'WO')}>
            {val}
          </a>
        ),
      },
      {
        title: '产品编码',
        dataIndex: 'materialCode',
        width: 70,
        align: 'center',
      },
      {
        title: '产品描述',
        dataIndex: 'materialName',
        width: 90,
        align: 'center',
      },
      {
        title: '产品类型',
        dataIndex: 'materialCategory',
        width: 90,
        align: 'center',
      },
      {
        title: '交付时间',
        dataIndex: 'deliveryDate',
        width: 90,
        align: 'center',
      },
      {
        title: '工作令号',
        dataIndex: 'workCommandNum',
        width: 90,
        align: 'center',
      },
      {
        title: '上级备注',
        dataIndex: 'remark',
        width: 90,
        align: 'center',
      },
      {
        title: '工单备注',
        dataIndex: 'woRemark',
        width: 90,
        align: 'center',
      },
      {
        title: '计划开始时间',
        dataIndex: 'planStartTime',
        width: 110,
        align: 'center',
      },
      {
        title: '计划完成时间',
        dataIndex: 'planEndTime',
        width: 110,
        align: 'center',
      },
      {
        title: '工单下达时间',
        dataIndex: 'publishDate',
        width: 100,
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'creationDate',
        width: 100,
        align: 'center',
      },
      {
        title: '修改人',
        dataIndex: 'lastUpdatedByName',
        width: 80,
        align: 'center',
      },
      {
        title: '修改时间',
        dataIndex: 'lastUpdateDate',
        width: 90,
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'operations',
        fixed: 'right',
        align: 'center',
        width: 150,
        render: (_value, record) => (
          <span className="action-link">
            <a onClick={() => this.snCreate(record)}>SN创建</a>
            <a onClick={() => this.handleOpenDrawer(record, true)}>编辑</a>
            <a onClick={() => this.handleClickSelectedRows(record)}>明细</a>
          </span>
        ),
      },
    ];
    return (
      <Table
        onExpand={this.handleChangeExpandedRowKeys}
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: tableScrollWidth(columns) }}
        rowKey="workOrderId"
        bordered
        pagination={pagination}
        loading={loading}
        expandedRowKeys={expandedRowKeys}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectRow,
        }}
        onChange={page => onChange(page)}
        rowClassName={this.handleClickRow}
      />
    );
  }
}
