/**
 *送货单查询
 *@date：2019/9/22
 *@author：junhui.liu <junhui.liu@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Table, Spin } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';
import { dateRender } from 'utils/renderer';

class ListTableHead extends Component {
  /**
   * render
   * @returns React.element
   */
  render() {
    const commonModelPrompt = 'hwms.deliverQuery.model.deliverQuery';
    const {
      loading,
      dataSource,
      pagination,
      selectedHeadKeys,
      onSelectHead,
      onSearch,
      headPrint,
      fetchheadPrintLoading,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.instructionDocNum`).d('送货单号'),
        width: 140,
        dataIndex: 'instructionDocNum',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.instructionDocStatus`).d('送货单状态'),
        align: 'center',
        width: 100,
        dataIndex: 'instructionDocStatus',
      },
      {
        title: intl.get(`${commonModelPrompt}.supplierCode`).d('供应商编码'),
        width: 120,
        dataIndex: 'supplierCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.supplierName`).d('供应商描述'),
        width: 120,
        dataIndex: 'supplierName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.expectedArrivalTime`).d('预计到货日期'),
        width: 120,
        dataIndex: 'expectedArrivalTime',
        render: dateRender,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.creationDate`).d('创建时间'),
        dataIndex: 'creationDate',
        width: 100,
        render: dateRender,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.realName`).d('创建人'),
        dataIndex: 'realName',
        width: 90,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.siteName`).d('接收工厂'),
        dataIndex: 'siteName',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.remark`).d('备注'),
        dataIndex: 'remark',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 120,
        align: 'center',
        render: (val, record, index) => (
          <span className="action-link">
            <a onClick={() => headPrint(record, index)}>
              {intl.get('tarzan.acquisition.transformation.button.edit').d("打印")}
            </a>
          </span>
        ),
      },
    ];
    return (
      <Spin spinning={fetchheadPrintLoading || false}>
        <Table
          bordered
          rowKey="instructionDocId"
          loading={loading}
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
          rowSelection={{
          selectedRowKeys: selectedHeadKeys,
          type: 'radio', // 单选
          onChange: onSelectHead,
          columnWidth: 50,
        }}
          scroll={{ x: tableScrollWidth(columns), y: 250 }}
          onChange={page => onSearch(page)}
        />
      </Spin>
    );
  }
}

export default ListTableHead;
