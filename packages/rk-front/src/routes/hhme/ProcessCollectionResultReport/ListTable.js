import React from 'react';
import { Table } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import { tableScrollWidth } from 'utils/utils';


export default class HeadTable extends React.Component {

  @Bind()
  handleSearch(page) {
    const { onSearch } = this.props;
    if(onSearch) {
      onSearch(page);
    }
  }

  @Bind()
  handleGetBomComponentClassName(record) {
    if(record.bomSubstituteGroup || record.globalSubstituteGroup) {
      return {
        style: {
          backgroundColor: '#d5dfe9',
        },
      };
    }
  }

  @Bind()
  handleGetSumClassName(record) {
    if(record.bomSubstituteGroup || record.globalSubstituteGroup) {
      return {
        style: {
          backgroundColor: 'rgb(245, 239, 187)',
        },
      };
    }
  }

  render() {
    const { loading, pagination, dataSource } = this.props;
    const columns = [
      {
        title: 'SN',
        width: 120,
        align: 'center',
        dataIndex: 'sn',
      },
      {
        title: '物料编码',
        width: 100,
        align: 'center',
        dataIndex: 'materialCode',
      },
      {
        title: '物料名称',
        width: 100,
        align: 'center',
        dataIndex: 'materialName',
      },
      {
        title: '机型',
        width: 80,
        dataIndex: 'model',
        align: 'center',
      },
      {
        title: '工单号',
        width: 120,
        align: 'center',
        dataIndex: 'workOrderNum',
      },
      {
        title: '数据收集组编码',
        width: 120,
        align: 'center',
        dataIndex: 'tagGroupCode',
      },
      {
        title: '数据收集组描述',
        width: 120,
        align: 'center',
        dataIndex: 'tagGroupDescription',
      },
      {
        title: '数据收集项编码',
        dataIndex: 'tagCode',
        align: 'center',
        width: 150,
      },
      {
        title: '数据收集项描述',
        width: 150,
        align: 'center',
        dataIndex: 'tagDescription',
      },
      {
        title: '上限',
        width: 80,
        align: 'center',
        dataIndex: 'maximalValue',
      },
      {
        title: '下限',
        width: 80,
        align: 'center',
        dataIndex: 'minimumValue',
      },
      {
        title: '采集结果',
        dataIndex: 'result',
        align: 'center',
        width: 100,
      },
      {
        title: '采集工序编码',
        dataIndex: 'processCode',
        align: 'center',
        width: 100,
      },
      {
        title: '采集工序描述',
        dataIndex: 'processName',
        align: 'center',
        width: 100,
      },
      {
        title: '采集工位编码',
        dataIndex: 'workcellCode',
        align: 'center',
        width: 100,
      },
      {
        title: '采集工位描述',
        dataIndex: 'workcellName',
        align: 'center',
        width: 100,
      },
      {
        title: '采集人',
        dataIndex: 'realName',
        align: 'center',
        width: 100,
      },
      {
        title: '采集时间',
        dataIndex: 'gatherDate',
        align: 'center',
        width: 150,
      },
      {
        title: '进站时间',
        dataIndex: 'siteInDate',
        align: 'center',
        width: 150,
      },
      {
        title: '出站时间',
        dataIndex: 'siteOutDate',
        align: 'center',
        width: 150,
      },
    ];

    return (
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns) }}
        onChange={this.handleSearch}
        loading={loading}
        rowKey="stocktakeId"
      />
    );
  }
}
