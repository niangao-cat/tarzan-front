/*
 * @Description: 班组工作台
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-09 17:56:29
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-11-03 12:34:42
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Table } from 'hzero-ui';
import {
  tableScrollWidth,
} from 'utils/utils';
import { Bind } from 'lodash-decorators';
import styles from '../index.less';

@connect(({ incomingMaterialEntry }) => ({
  incomingMaterialEntry,
}))
export default class LeftTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: {},
    };
  }

  HandoverMatterForm;

  componentDidMount() {

  }

  @Bind()
  handleClickSelectedRows(record) {
    const { fetchMaterialContainer } = this.props;
    return {
      onClick: () => {
        this.setState({ selectedRows: record });
        fetchMaterialContainer(record);
      },
    };
  }

  @Bind()
  handleClickRow(record) {
    const { selectedRows = {} } = this.state;
    if (selectedRows.operationRecordId === record.operationRecordId) {
      return styles['incoming-data-click'];
    } else {
      return '';
    }
  }

  render() {
    const {
      dataSource,
      onSearch,
      loading,
      fetchMaterialBarCode,
      openMainMaterial,
      handleCreateWOVisible,
      pagination,
    } = this.props;
    const columns = [
      {
        title: '工单号',
        dataIndex: 'workOrderNum',
        width: 110,
        render: (val, record) => (
          <a className="action-link" onClick={() => fetchMaterialBarCode(true, record)}>
            {val}
          </a>
        ),
      },
      {
        title: 'COS编码',
        dataIndex: 'materialCode',
        width: 100,
      },
      {
        title: 'COS描述',
        dataIndex: 'materialName',
        width: 100,
      },
      {
        title: '工单芯片数',
        dataIndex: 'cosNum',
        width: 90,
      },
      {
        title: '剩余芯片数',
        dataIndex: 'surplusCosNum',
        width: 90,
      },
      {
        title: 'COS类型',
        dataIndex: 'cosType',
        width: 90,
      },
      {
        title: 'Wafer号',
        dataIndex: 'wafer',
        width: 160,
      },
      {
        title: 'SAP批次',
        dataIndex: 'sapLot',
        width: 140,
      },
      {
        title: '平均波长 Avg λ（nm）',
        dataIndex: 'averageWavelength',
        width: 120,
      },
      {
        title: 'LOTNO',
        dataIndex: 'lotNo',
        width: 80,
      },
      {
        title: 'BAR条数',
        dataIndex: 'barNum',
        width: 60,
      },
      {
        title: '录入批次',
        dataIndex: 'jobBatch',
        width: 100,
      },
      {
        title: '创建人',
        dataIndex: 'realName',
        width: 90,
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'creationDate',
        width: 100,
      },
      {
        title: '操作',
        dataIndex: 'operator',
        width: 120,
        align: 'center',
        fixed: 'right',
        render: (val, record) => (
          <span className="action-link">
            <a onClick={() => openMainMaterial(record, true)}>
              组件物料
            </a>
            <a onClick={() => handleCreateWOVisible(true, 'EDIT', record)}>
              编辑
            </a>
          </span>
        ),
      },
    ];
    return (
      <Table
        bordered
        rowKey="letterId"
        columns={columns}
        loading={loading}
        pagination={pagination}
        dataSource={dataSource}
        scroll={{ x: tableScrollWidth(columns), y: 195 }}
        onChange={page => onSearch(page)}
        onRow={this.handleClickSelectedRows}
        rowClassName={record => this.handleClickRow(record)}
      />
    );
  }
}
