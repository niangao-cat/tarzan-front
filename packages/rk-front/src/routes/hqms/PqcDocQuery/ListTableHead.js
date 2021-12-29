/*
 * @Description: 巡检单头
 * @version: 0.1.0
 * @Author: junfeng.chen@hand-china.com
 * @Date: 2021-01-06 09:01:34
 */

import React, { Component } from 'react';
import { Table, Spin } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';


class ListTableHead extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const modelPrompt = 'hqms.pqcDocQuery.model.pqcDocQuery';
    const { loading, dataSource, pagination, selectedRowKeys, onSelectRow, onSearch, fetchHeadPrintLoading } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.departmentName`).d('事业部'),
        dataIndex: 'departmentName',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.workshopName`).d('车间'),
        dataIndex: 'workshopName',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.prodLineName`).d('生产线'),
        dataIndex: 'prodLineName',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.pqcNumber`).d('巡检单'),
        dataIndex: 'pqcNumber',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.inspectionStatus`).d('单据状态'),
        dataIndex: 'inspectionStatusMeaning',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('物料'),
        dataIndex: 'materialName',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.materialLotCode`).d('产品SN'),
        dataIndex: 'materialLotCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.workOrderNum`).d('工单'),
        dataIndex: 'workOrderNum',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.lastUpdatedByName`).d('质检员'),
        dataIndex: 'lastUpdatedByName',
        width: 80,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.inspectionResult`).d('检验结果'),
        dataIndex: 'inspectionResultMeaning',
        width: 80,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.remark`).d('备注'),
        dataIndex: 'remark',
        width: 60,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.creationDate`).d('创建时间'),
        dataIndex: 'creationDate',
        width: 140,
      },
    ];
    return (
      <Spin spinning={fetchHeadPrintLoading ||false}>
        <Table
          bordered
          // rowKey="pqcHeaderId"
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          pagination={pagination}
          scroll={{ x: tableScrollWidth(columns) }}
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
