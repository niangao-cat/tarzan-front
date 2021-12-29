/**
 *机台数据维护
 *@date：2019/9/22
 *@author：junhui.liu <junhui.liu@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Table, Badge } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

class ListTable extends Component {
  render() {
    const commonModelPrompt = 'hwms.machineBasic.model.machineBasic';
    const modelPrompt = 'hwms.barcodeQuery.model.barcodeQuery';
    const modelPrompt2 = 'hwms.basicDataMaintain.model.basicDataMaintain';
    const {
      loading,
      dataSource,
      pagination,
      selectedRowKeys,
      onSelectRow,
      onSearch,
      onHistory,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.site`).d('工厂'),
        width: 120,
        dataIndex: 'siteCode',
      },
      {
        title: intl.get(`${modelPrompt2}.productionLine`).d('产线'),
        width: 120,
        dataIndex: 'prodLineName',
      },
      {
        title: intl.get(`${commonModelPrompt}.machineCode`).d('机器编号'),
        width: 120,
        dataIndex: 'machineCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.machineName`).d('机器名'),
        width: 120,
        dataIndex: 'machineName',
      },
      {
        title: intl.get(`${commonModelPrompt}.machinePlatformCode`).d('机台编码'),
        width: 120,
        dataIndex: 'machinePlatformCode1',
      },
      {
        title: intl.get(`${commonModelPrompt}.machinePlatformName`).d('机台名'),
        width: 120,
        dataIndex: 'machinePlatformName',
      },
      {
        title: intl.get(`${commonModelPrompt}.machinePlatformType`).d('机台类型'),
        width: 120,
        dataIndex: 'machinePlatformTypeMeaning',
      },
      {
        title: intl.get(`${commonModelPrompt}.enableFlag`).d('有效性'),
        width: 120,
        align: 'center',
        dataIndex: 'enableFlag',
        render: (val, record) => (
          <Badge
            status={record.enableFlag === 'Y' ? 'success' : 'error'}
            text={
              record.enableFlag === 'Y'
                ? intl.get(`hzero.common.view.yes`).d('是')
                : intl.get(`hzero.common.view.no`).d('否')
            }
          />
        ),
      },
      {
        title: intl.get(`${commonModelPrompt}.correspondingMachineB`).d('对应的B机台'),
        width: 150,
        dataIndex: 'machinePlatformCode2',
      },
      {
        title: intl.get(`${modelPrompt}.createBy`).d('创建人'),
        width: 120,
        dataIndex: 'createdBy',
      },
      {
        title: intl.get(`${modelPrompt}.createDate`).d('创建时间'),
        width: 150,
        dataIndex: 'creationDate',
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.lastUpdateBy`).d('最近操作人'),
        width: 120,
        dataIndex: 'lastUpdatedBy',
      },
      {
        title: intl.get(`${modelPrompt}.lastUpdateDate`).d('最近操作时间'),
        dataIndex: 'lastUpdateDate',
        align: 'center',
      },
      {
        align: 'center',
        fixed: 'right',
        width: 100,
        render: (value, record) => {
          return (
            <span className="action-link">
              <a onClick={() => onHistory(record)}>
                {intl.get(`${commonModelPrompt}.history`).d('操作记录')}
              </a>
            </span>
          );
        },
      },
    ];
    return (
      <Table
        bordered
        rowKey="machinePlatformId"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns, 50) }}
        rowSelection={{
          selectedRowKeys,
          fixed: true,
          columnWidth: 50,
          onChange: onSelectRow,
        }}
        onChange={page => onSearch(page)}
      />
    );
  }
}

export default ListTable;
