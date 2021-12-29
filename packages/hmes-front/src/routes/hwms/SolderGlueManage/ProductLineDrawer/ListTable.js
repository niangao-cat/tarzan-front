import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
// import { tableScrollWidth } from 'utils/utils';

class ListTable extends Component {
  /**
   * render
   * @returns React.element
   */
  render() {
    const modelPromt = 'hwms.solderGlueManage.model.solderGlueManage';
    const { loading, dataSource, pagination, onSearch } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPromt}.prodLine`).d('产线'),
        dataIndex: 'prodLineName',
        width: 120,
      },
      {
        title: intl.get(`${modelPromt}.SolderReturnOutTimeCounts`).d('锡膏归还超时次数'),
        dataIndex: 'solderReturnOuttimeCounts',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get(`${modelPromt}.SolderNoReturnEmptyBottleCounts`).d('锡膏空瓶未归还次数'),
        dataIndex: 'solderReturnEmptyBottleCounts',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get(`${modelPromt}.GuleReturnOutTimeCounts`).d('红胶归还超时次数'),
        dataIndex: 'glueReturnOuttimeCounts',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get(`${modelPromt}.GuleNoReturnEmptyBottleCounts`).d('红胶空瓶未归还次数'),
        dataIndex: 'glueReturnEmptyBottleCounts',
        width: 150,
        align: 'center',
      },
    ];
    return (
      <Table
        bordered
        rowKey=""
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        // scroll={{ x: tableScrollWidth(columns) }}
        onChange={page => onSearch(page)}
      />
    );
  }
}

export default ListTable;
