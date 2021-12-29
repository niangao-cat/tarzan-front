import React from 'react';
import {Table} from 'hzero-ui';
import {tableScrollWidth} from 'utils/utils';

export default class LineTable extends React.Component {

  render() {

    const {
      dataSource,
      pagination,
      loading,
      onChange,
      selectedKeys,
    } = this.props;

    const columns = [
      {
        title: '事业部',
        dataIndex: 'departmentCode',
        width: 130,
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 130,
      },
      {
        title: '物料名称',
        dataIndex: 'materialName',
        width: 150,
      },
      {
        title: '工序编码',
        dataIndex: 'workcellCode',
        width: 130,
      },
      {
        title: '工序名称',
        dataIndex: 'workcellName',
        width: 150,
      },
      {
        title: '限制次数',
        dataIndex: 'limitCount',
        width: 100,
      },
      {
        title: '有效性',
        dataIndex: 'enableFlagMeaning',
        width: 90,
      },
      {
        title: '维护人',
        dataIndex: 'realName',
        width: 120,
      },
      {
        title: '维护时间',
        dataIndex: 'lastUpdateDate',
        width: 140,
      },
    ];


    return (
      <Table
        bordered
        rowKey="repairLimitCountHisId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        scroll={{
          x: tableScrollWidth(columns),
        }}
        onChange={page => onChange(selectedKeys, page)}
      />
    );
  }
}
