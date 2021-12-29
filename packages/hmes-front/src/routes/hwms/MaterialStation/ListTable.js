import React, { Component } from 'react';
import { Table, Badge } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

class ListTable extends Component {
  render() {
    const commonModelPrompt = 'hwms.machineBasic.model.machineBasic';
    const modelPrompt = 'hwms.barcodeQuery.model.barcodeQuery';
    const modelPrompt2 = 'hwms.materialStation.model.materialStation';
    const {
      loading,
      dataSource,
      pagination,
      selectedRowKeys,
      onSelectRow,
      onSearch,
      onDetail,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.site`).d('工厂'),
        width: 120,
        dataIndex: 'siteCode',
      },
      {
        title: intl.get(`${modelPrompt2}.primaryMaterialNumber`).d('主件料号'),
        width: 120,
        dataIndex: 'materialCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.machineCode`).d('机器编码'),
        width: 120,
        dataIndex: 'machineCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.machinePlatformCode`).d('机台编码'),
        width: 120,
        dataIndex: 'machinePlatformCode',
      },
      {
        title: intl.get(`${modelPrompt2}.programName`).d('程序名'),
        width: 120,
        dataIndex: 'programName',
      },
      {
        title: intl.get(`${modelPrompt2}.lineBody`).d('线体'),
        width: 120,
        dataIndex: 'prodLineName',
      },
      {
        title: intl.get(`${modelPrompt2}.materialStationType`).d('料站类型'),
        width: 120,
        dataIndex: 'programTypeMeaning',
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('有效性'),
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
              <a onClick={() => onDetail(record)}>{intl.get(`${modelPrompt2}.detail`).d('明细')}</a>
            </span>
          );
        },
      },
    ];
    return (
      <Table
        bordered
        rowKey="headId"
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
