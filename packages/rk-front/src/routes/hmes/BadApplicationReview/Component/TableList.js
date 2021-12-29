/*
 * @Description: 列表
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-03-30 09:33:01
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2021-03-03 15:27:43
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Form, Table } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import {
  tableScrollWidth,
} from 'utils/utils';
import styles from '../index.less';

@Form.create({ fieldNameProp: null })
export default class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: {},
    };
  }

  @Bind()
  handleClickRow(record) {
    const { selectedRows } = this.state;
    if (selectedRows.ncRecordId === record.ncRecordId) {
      return styles['bad-review-data-click'];
    } else {
      return '';
    }
  }

  @Bind()
  handleOnLine(val) {
    const { handleOnLine } = this.props;
    this.setState({ selectedRows: val });
    handleOnLine(val);
  }

  render() {
    const {
      loading,
      badApplicationList,
      selectedRowKeys,
      onSelectRows,
      onSearch,
      pagination,
      selectedRows = [],
      handleOnSelect,
    } = this.props;
    const columns = [
      {
        title: '不良单号',
        dataIndex: 'ncNumber',
        width: 100,
        render: (val, record) =>
          record.status === 'CLOSED' ? (
            <a
              className="action-link"
              onClick={() => this.handleOnLine(record)}
            >
              {val}
            </a>
          ) : (
            <a
              className="action-link"
              onClick={() => this.handleOnLine(record)}
              disabled={!(selectedRows.map(ele => ele.ncRecordId).includes(record.ncRecordId))}
            >
              {val}
            </a>
),
      },
      {
        title: '车间',
        dataIndex: 'workShopName',
        width: 100,
      },
      {
        title: '生产线',
        dataIndex: 'prodLineName',
        width: 100,
      },
      {
        title: '工段',
        dataIndex: 'lineWorkcellName',
        width: 100,
      },
      {
        title: '工序',
        dataIndex: 'processName',
        width: 100,
      },
      {
        title: '责任工位',
        dataIndex: 'workcellName',
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'statusMeaning',
        width: 60,
        align: 'center',
      },
      // {
      //   title: '工位类型',
      //   dataIndex: 'workcellType',
      //   width: 100,
      // },
      {
        title: '操作者',
        dataIndex: 'userName',
        width: 80,
        align: 'center',
      },
      {
        title: '工号',
        dataIndex: 'userCode',
        width: 80,
      },
      {
        title: '产品料号',
        dataIndex: 'materialCode',
        width: 100,
      },
      {
        title: '产品描述',
        dataIndex: 'materialName',
        width: 100,
      },
      {
        title: '材料编码',
        dataIndex: 'scrapMaterialCode',
        width: 90,
      },
      {
        title: '材料名称',
        dataIndex: 'scrapMaterialName',
        width: 90,
      },
      {
        title: '材料版本',
        dataIndex: 'materialVersion',
        width: 90,
      },
      {
        title: '申请数量',
        dataIndex: 'scrapQty',
        width: 90,
      },
      {
        title: '供应商编码',
        dataIndex: 'supplierCode',
        width: 100,
      },
      {
        title: '供应商描述',
        dataIndex: 'supplierName',
        width: 100,
      },
      {
        title: '供应商批次',
        dataIndex: 'supplierLot',
        width: 100,
      },
      {
        title: 'COS芯片位置',
        dataIndex: 'cosPosition',
        width: 110,
      },
      {
        title: 'COS芯片序列',
        dataIndex: 'chipSequence',
        width: 110,
      },
      {
        title: 'COS热沉ID',
        dataIndex: 'hotSinkCode',
        width: 110,
      },
      {
        title: '序列号',
        dataIndex: 'materialLotCode',
        width: 100,
      },
      {
        title: '工单号',
        dataIndex: 'workOrderNum',
        width: 100,
      },
      {
        title: '不良代码组',
        dataIndex: 'ncGroupDesc',
        width: 100,
      },
      {
        title: '不良代码',
        dataIndex: 'ncCodeList',
        width: 100,
        render: (val, record) => {
          const ncCodeListArr = [];
          record.ncCodeList.forEach(item => {
            ncCodeListArr.push(`${item}, `);
          });
          return ncCodeListArr;
        },
      },
      {
        title: '不良原因',
        dataIndex: 'ncReasonList',
        width: 100,
        render: (val, record) => {
          const ncReasonListArr = [];
          record.ncReasonList.forEach(item => {
            ncReasonListArr.push(`${item}, `);
          });
          return ncReasonListArr;
        },
      },
      {
        title: '不良类型',
        dataIndex: 'ncTypeMeaning',
        width: 100,
      },
      {
        title: '转型物料编码',
        dataIndex: 'transitionMaterialCode',
        width: 120,
      },
      {
        title: '转型物料描述',
        dataIndex: 'transitionMaterialName',
        width: 120,
      },
      {
        title: '放行/退库条码',
        dataIndex: 'barcode',
        width: 150,
      },
      {
        title: '返修工单',
        dataIndex: 'reworkOrder',
        width: 150,
      },
      {
        title: '发生时间',
        dataIndex: 'dateTime',
        width: 150,
      },
      {
        title: '提出工位',
        dataIndex: 'responseWorkcellName',
        width: 80,
      },
      {
        title: '责任人',
        dataIndex: 'responseUser',
        width: 70,
        align: 'center',
      },
      {
        title: '处理办法',
        dataIndex: 'disposeMethodMeaning',
        width: 80,
        align: 'center',
      },
      {
        title: '处理人',
        dataIndex: 'disposeUserName',
        width: 80,
        align: 'center',
      },
      {
        title: '处理时间',
        dataIndex: 'disposeDateTime',
        width: 150,
      },
    ];
    return (
      <Table
        dataSource={badApplicationList}
        columns={columns}
        loading={loading}
        scroll={{ x: tableScrollWidth(columns) }}
        rowKey="ncRecordId"
        bordered
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectRows,
          onSelect: handleOnSelect,
          getCheckboxProps: record => ({
            disabled: record.status !== 'OPEN',
          }),
        }}
        onChange={page => onSearch(page)}
        rowClassName={this.handleClickRow}
        // onRow={this.handleClickSelectedRows}
        pagination={pagination}
      />
    );
  }
}
