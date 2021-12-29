/*
 * @Description: 行数据
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-12-09 13:45:36
 * @LastEditTime: 2020-12-10 15:54:13
 */
import React from "react";
import { Table } from 'hzero-ui';
import {
  tableScrollWidth,
} from 'utils/utils';

export default class LineTableList extends React.PureComponent {

  render() {
    const { loading, dataSource, pagination, selectedLineKeys, onSelectLine, onSearch } = this.props;
    const columns = [
      {
        title: '行号',
        dataIndex: 'instructionLineNum',
        width: 60,
        align: 'center',
      },
      {
        title: '行状态',
        dataIndex: 'instructionStatusMeaning',
        width: 80,
        align: 'center',
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 100,
        align: 'center',
      },
      {
        title: '物料描述',
        dataIndex: 'materialName',
        width: 100,
        align: 'center',
      },
      {
        title: '物料版本',
        dataIndex: 'materialVersion',
        width: 100,
        align: 'center',
      },
      {
        title: '需求数',
        dataIndex: 'demandQty',
        width: 80,
        align: 'center',
      },
      {
        title: '实发数',
        dataIndex: 'actualQty',
        width: 80,
        align: 'center',
      },
      {
        title: '单位',
        dataIndex: 'uomCode',
        width: 80,
        align: 'center',
      },
      {
        title: '发货工厂',
        dataIndex: 'fromSiteCode',
        width: 100,
        align: 'center',
      },
      {
        title: '发货仓库',
        dataIndex: 'fromWarehouseCode',
        width: 100,
        align: 'center',
      },
      {
        title: '按单标识',
        dataIndex: 'soFlag',
        width: 100,
        align: 'center',
        render: (val) => {
          if(val === 'Y'){
            return <span>是</span>;
          }else{
            return <span>否</span>;
          }
        },
      },
      {
        title: '销售订单号',
        dataIndex: 'sourceOrderId',
        width: 100,
        align: 'center',
      },
      {
        title: '销售订单行号',
        dataIndex: 'sourceOrderLineId',
        width: 130,
        align: 'center',
      },
      {
        title: '销售订单发运行',
        dataIndex: 'sourceOrderLineLocationId',
        width: 140,
        align: 'center',
      },
      {
        title: '生产订单号',
        dataIndex: 'workOrderNum',
        width: 100,
        align: 'center',
      },
      {
        title: '允差下限',
        dataIndex: 'toleranceLowerLimit',
        width: 100,
        align: 'center',
      },
      {
        title: '允差上限',
        dataIndex: 'toleranceUpperLimit',
        width: 100,
        align: 'center',
      },
      {
        title: '容器个数',
        dataIndex: 'containerCount',
        width: 100,
        align: 'center',
      },
      {
        title: '客户物料编码',
        dataIndex: 'customerItemCode',
        width: 130,
        align: 'center',
      },
      {
        title: '客户物料描述',
        dataIndex: 'customerItemDesc',
        width: 130,
        align: 'center',
      },
      {
        title: '客户采购订单',
        dataIndex: 'customerPo',
        width: 100,
        align: 'center',
      },
      {
        title: '发票号',
        dataIndex: 'invoiceNum',
        width: 90,
        align: 'center',
      },
      {
        title: '海关单号',
        dataIndex: 'customsBillNum',
        width: 100,
        align: 'center',
      },
      {
        title: '箱号',
        dataIndex: 'containerNum',
        width: 90,
        align: 'center',
      },
      {
        title: '封号',
        dataIndex: 'sealNum',
        width: 90,
        align: 'center',
      },
      {
        title: '车号',
        dataIndex: 'carNum',
        width: 90,
        align: 'center',
      },
      {
        title: '车牌号',
        dataIndex: 'licenceNum',
        width: 90,
        align: 'center',
      },
      {
        title: '赠品/计价标识',
        dataIndex: 'freeValuationFlag',
        width: 130,
        align: 'center',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 90,
        align: 'center',
      },
    ];
    return (
      <Table
        bordered
        rowKey="instructionId"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        rowSelection={{
          selectedRowKeys: selectedLineKeys,
          onChange: onSelectLine,
          columnWidth: 50,
        }}
        scroll={{ x: tableScrollWidth(columns), y: 250 }}
        onChange={page => onSearch(page)}
      />
    );
  }

}