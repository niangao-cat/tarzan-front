/*
 * @Description: 头
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-10 19:32:27
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-06-08 19:20:17
 * @Copyright: Copyright (c) 2019 Hand
 */
import React, { Component } from 'react';
import { Table, Spin } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';
import { Bind } from 'lodash-decorators';

class ListTableHead extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  @Bind()
  update(record){
    const {history} = this.props;
    history.push(`/hwms/requisition-return/detail/${record.instructionDocId}`);
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const modelPrompt = 'hwms.requisitionAndReturn.model.requisitionAndReturn';
    const { loading, dataSource, pagination, selectedRowKeys, onSelectRow, onSearch, headPrint, fetchHeadPrintLoading } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.docNum`).d('单号'),
        dataIndex: 'instructionDocNum',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.plantCode`).d('工厂'),
        dataIndex: 'siteCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.docType`).d('单据类型'),
        dataIndex: 'instructionDocTypeMeaning',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.docStatus`).d('单据状态'),
        dataIndex: 'instructionDocStatusMeaning',
        width: 90,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.settleAccounts`).d('结算类型'),
        dataIndex: 'settleAccountsMeaning',
        width: 90,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.costCenter`).d('成本中心'),
        dataIndex: 'costcenterCode',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.internalOrder`).d('内部订单'),
        dataIndex: 'internalOrder',
        width: 90,
      },
      {
        title: '内部订单类型',
        dataIndex: 'internalOrderTypeMeaning',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.moveType`).d('移动类型'),
        dataIndex: 'moveType',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.applier`).d('申请人'),
        dataIndex: 'createdUserName',
        width: 80,
      },
      {
        title: intl.get(`${modelPrompt}.creationDate`).d('创建时间'),
        dataIndex: 'creationDate',
        width: 140,
      },
      {
        title: intl.get(`${modelPrompt}.printFlag`).d('打印标识'),
        dataIndex: 'printFlagMeaning',
        width: 90,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.remark`).d('备注'),
        dataIndex: 'remark',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.remark`).d('利润中心'),
        dataIndex: 'profitCenter',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.remark`).d('移动原因'),
        dataIndex: 'moveReason',
        width: 90,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 120,
        fixed: 'right',
        align: 'center',
        render: (val, record, index) => (
          <span className="action-link">
            <a disabled={!['NEW', 'RELEASED'].includes(record.instructionDocStatus)} onClick={() => this.update(record)}>更新</a>&nbsp;
            <a onClick={() => headPrint(record, index)}>
              {intl.get('tarzan.acquisition.transformation.button.edit').d("打印")}
            </a>
          </span>
        ),
      },
    ];
    return (
      <Spin spinning={fetchHeadPrintLoading ||false}>
        <Table
          bordered
          rowKey="instructionDocId"
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          pagination={pagination}
          scroll={{ x: tableScrollWidth(columns), y: 190 }}
          rowSelection={{
            type: 'radio',
            columnWidth: 50,
            selectedRowKeys,
            onChange: onSelectRow,
          }}
          onChange={page => onSearch(page)}
        />
      </Spin>
    );
  }
}
export default ListTableHead;
