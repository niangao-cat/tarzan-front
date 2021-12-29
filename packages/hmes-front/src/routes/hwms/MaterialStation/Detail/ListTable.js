import React, { Component } from 'react';
import { Table, Badge } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

class ListTable extends Component {
  render() {
    const modelPrompt = 'hwms.barcodeQuery.model.barcodeQuery';
    const modelPrompt2 = 'hwms.materialStation.model.materialStation';
    const { loading, dataSource, pagination, selectedRowKeys, onSelectRow, onSearch } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt2}.stance`).d('站位'),
        width: 120,
        dataIndex: 'stanceCode',
      },
      {
        title: intl.get(`${modelPrompt2}.materialNumber`).d('料号'),
        width: 120,
        dataIndex: 'materialCode',
      },
      {
        title: intl.get(`${modelPrompt2}.materialGunType`).d('料枪类型'),
        width: 120,
        dataIndex: 'materialGunType',
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('物料规格及描述'),
        width: 150,
        dataIndex: 'materialName',
      },
      {
        title: intl.get(`${modelPrompt2}.placeNumber`).d('位号'),
        width: 120,
        dataIndex: 'placeNumber',
      },
      {
        title: intl.get(`${modelPrompt2}.consumption`).d('用量'),
        width: 120,
        dataIndex: 'consumption',
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
    ];
    return (
      <Table
        bordered
        rowKey="lineId"
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
