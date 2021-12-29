
import React, { Component } from 'react';
import { Table, Tooltip } from 'hzero-ui';
import { tableScrollWidth } from 'utils/utils';

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
    const { loading, dataSource, pagination, onSearch } = this.props;
    // 设置显示数据
    const columns = [
      {
        title: '工单号',
        dataIndex: 'workOrderNum',
        width: '10',
        align: 'center',
      },
      {
        title: '工单版本',
        dataIndex: 'productionVersion',
        width: 110,
        align: 'center',
      },
      {
        title: '版本描述',
        dataIndex: 'productionVersionDesc',
        width: 110,
        align: 'center',
      },
      {
        title: '产品编码',
        dataIndex: 'materialCode',
        width: '120',
        align: 'center',
      },
      {
        title: '产品描述',
        dataIndex: 'materialName',
        align: 'center',
      },
      {
        title: '工单芯片数',
        dataIndex: 'qty',
        width: '100',
        align: 'center',
      },
      {
        title: 'WAFER',
        dataIndex: 'waferNum',
        width: '100',
        align: 'center',
      },
      {
        title: 'COS类型',
        dataIndex: 'cosTypeMeaning',
        width: '100',
        align: 'center',
      },
      {
        title: '条码',
        dataIndex: 'materialLotCode',
        width: 180,
        align: 'center',
      },
      {
        title: 'cos数量',
        dataIndex: 'snQty',
        width: '80',
        align: 'center',
      },
      {
        title: '合格数量',
        dataIndex: 'okQty',
        width: '80',
        align: 'center',
      },
      {
        title: '不良总数',
        dataIndex: 'ngQty',
        width: '80',
        align: 'center',
      },
      {
        title: '热沉类型',
        dataIndex: 'sinkType',
        width: '80',
        align: 'center',
      },
      {
        title: '热沉条码',
        dataIndex: 'sinkCode',
        width: '80',
        align: 'center',
      },
      {
        title: '热沉物料',
        dataIndex: 'sinkMaterialCode',
        width: '80',
        align: 'center',
      },
      {
        title: '热沉供应商批次',
        dataIndex: 'sinkSupplierLot',
        width: 150,
        align: 'center',
      },
      {
        title: '金锡比',
        dataIndex: 'ausnRatio',
        width: 80,
        align: 'center',
      },
      {
        title: '金线条码',
        dataIndex: 'goldCode',
        width: '80',
        align: 'center',
      },
      {
        title: '金线物料',
        dataIndex: 'goldMaterialCode',
        width: '80',
        align: 'center',
      },
      {
        title: '金锡供应商批次',
        dataIndex: 'goldSupplierLot',
        width: 150,
        align: 'center',
      },
      {
        title: '操作人',
        dataIndex: 'realName',
        width: '80',
        align: 'center',
      },
      {
        title: '工位编码',
        dataIndex: 'workcellCode',
        width: '80',
        align: 'center',
      },
      {
        title: '工位描述',
        dataIndex: 'workcellName',
        width: '150',
        align: 'center',
      },
      {
        title: '工序描述',
        dataIndex: 'processName',
        width: 100,
        align: 'center',
      },
      {
        title: '工段描述',
        dataIndex: 'lineWorkcellName',
        width: 100,
        align: 'center',
      },
      {
        title: '生产线描述',
        dataIndex: 'prodLineName',
        width: 100,
        align: 'center',
      },
      {
        title: '时间',
        dataIndex: 'creationDate',
        width: '150',
        align: 'center',
      },
      {
        title: '设备编码',
        dataIndex: 'assetEncoding',
        width: '150',
        align: 'center',
        render: (val) => {
          let tableValue = val;
          if(val && val.split(',').length > 4) {
            tableValue = val.split(',').length.slice(0, 4).join(',');
          }
          return (
            <Tooltip placement="topLeft" title={val}>
              {tableValue}
            </Tooltip>
          );
        },
      },
      {
        title: '实验代码',
        dataIndex: 'labCode',
        width: '150',
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
        scroll={{ x: tableScrollWidth(columns) }}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default TableList;
