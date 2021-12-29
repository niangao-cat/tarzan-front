/**
 * @Author:lly
 * @email: liyuan.liu@hand-china.com
 * @description： 单据执行统计报表
 */

import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
// import { tableScrollWidth } from 'utils/utils';

class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const commonModelPrompt = 'tarzan.hwms.documentsPerformStatisticalReport';
    const { loading, dataSource, pagination, onSearch } = this.props;
    // 设置显示数据
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.sequence`).d('序号'),
        dataIndex: 'sequence',
        width: '80',
        align: 'center',
        render: (value, record, index) => index + 1,
      },
      {
        title: intl.get(`${commonModelPrompt}.siteCode`).d('工厂'),
        dataIndex: 'siteCode',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.instructionDocNum`).d('单据号'),
        dataIndex: 'instructionDocNum',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.instructionDocTypeMeaning`).d('单据类型'),
        dataIndex: 'instructionDocTypeMeaning',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.instructionDocStatusMeaning`).d('单据状态'),
        dataIndex: 'instructionDocStatusMeaning',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.instructionLineNum`).d('单据行号'),
        dataIndex: 'instructionLineNum',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料'),
        dataIndex: 'materialCode',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.itemGroupCode`).d('物料组'),
        dataIndex: 'itemGroupCode',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.itemGroupDescription`).d('物料组描述'),
        dataIndex: 'itemGroupDescription',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.uomCode`).d('单位'),
        dataIndex: 'uomCode',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.quantity`).d('制单数量'),
        dataIndex: 'quantity',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.actualQty`).d('执行数量'),
        dataIndex: 'actualQty',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.fromLocatorCode`).d('来源仓库'),
        dataIndex: 'fromLocatorCode',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.toLocatorCode`).d('目标仓库'),
        dataIndex: 'toLocatorCode',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.person`).d('SAP创建人'),
        dataIndex: 'person',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.creationDate`).d('制单时间'),
        dataIndex: 'creationDate',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.createdBy`).d('制单人'),
        dataIndex: 'createdBy',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdateDate`).d('最后更新时间'),
        dataIndex: 'lastUpdateDate',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('最后更新人'),
        dataIndex: 'lastUpdatedBy',
        width: '100',
        align: 'center',
      },
    ];
    return (
      <Table
        bordered
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default TableList;
