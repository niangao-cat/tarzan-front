/*
 * @Description: table-list
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-01 17:44:36
 * @LastEditTime: 2021-02-03 10:02:47
 */
import React from 'react';
import { tableScrollWidth } from 'utils/utils';
import { Table, Badge } from 'hzero-ui';

const TableList = (props) => {

  const {
    dataSource,
    pagination,
    loading,
    handleFetchList,
  } = props;
  const columns = [
    {
      title: '提交工段',
      dataIndex: 'workcellCode',
      width: 110,
      align: 'center',
    },
    {
      title: '工段描述',
      dataIndex: 'workcellName',
      width: 110,
      align: 'center',
    },
    {
      title: '提交工序',
      dataIndex: 'procedureCode',
      width: 110,
      align: 'center',
    },
    {
      title: '工序描述',
      dataIndex: 'procedureName',
      width: 110,
      align: 'center',
    },
    {
      title: '提交工位编码',
      dataIndex: 'stationCode',
      width: 110,
      align: 'center',
    },
    {
      title: '提交工位描述',
      dataIndex: 'stationName',
      width: 110,
      align: 'center',
    },
    {
      title: '产品编码',
      dataIndex: 'materialCode',
      width: 110,
      align: 'center',
    },
    {
      title: '产品描述',
      dataIndex: 'materialName',
      width: 110,
      align: 'center',
    },
    {
      title: '工单号',
      dataIndex: 'workOrderNum',
      width: 110,
      align: 'center',
    },
    {
      title: '工单版本',
      dataIndex: 'productionVersion',
      width: 110,
      align: 'center',
    },
    {
      title: '不良单号',
      dataIndex: 'incidentNumber',
      width: 110,
      align: 'center',
    },
    {
      title: '单据状态',
      dataIndex: 'ncIncidentStatusMeaning',
      width: 110,
      align: 'center',
    },
    {
      title: '不良条码号',
      dataIndex: 'materialLotCode',
      width: 110,
      align: 'center',
    },
    {
      title: '组件编码',
      dataIndex: 'assemblyCode',
      width: 110,
      align: 'center',
    },
    {
      title: '单位',
      dataIndex: 'uomCode',
      width: 90,
      align: 'center',
    },
    {
      title: '组件物料描述',
      dataIndex: 'assemblyName',
      width: 110,
      align: 'center',
    },
    {
      title: '该条码已投数量',
      dataIndex: 'releasQty',
      width: 120,
      align: 'center',
    },

    {
      title: '不良申请数量',
      dataIndex: 'qty',
      width: 110,
      align: 'center',
    },
    {
      title: '组件条码批次',
      dataIndex: 'lot',
      width: 110,
      align: 'center',
    },
    {
      title: '供应商批次',
      dataIndex: 'attrValue',
      width: 110,
      align: 'center',
    },
    {
      title: '是否冻结',
      dataIndex: 'freezeFlag',
      width: 110,
      align: 'center',
      render: (val, record) =>
          (record.freezeFlag === 'Y' || record.freezeFlag === 'N') && (
            <Badge
              status={record.freezeFlag === 'Y' ? 'success' : 'error'}
              text={
                record.freezeFlag === 'Y'
                  ? '是'
                  : '否'
              }
            />
          ),
    },
    {
      title: '不良代码组编码',
      dataIndex: 'ncGroupCode',
      width: 120,
      align: 'center',
    },
    {
      title: '不良代码组描述',
      dataIndex: 'description',
      width: 110,
      align: 'center',
    },
    {
      title: '不良代码编码',
      dataIndex: 'ncCode',
      width: 110,
      align: 'center',
    },
    {
      title: '不良代码描述',
      dataIndex: 'ncDescription',
      width: 110,
      align: 'center',
    },
    {
      title: '处理方式',
      dataIndex: 'processMethod',
      width: 110,
      align: 'center',
      render: (val)=>{
        if (val==='1') {
          return <span>返修</span>;
        }
        if (val==='2') {
          return <span>放行</span>;
        }
        if (val==='3') {
          return <span>报废</span>;
        }
        if (val==='4') {
          return <span>降级转型</span>;
        }
        if (val==='5') {
          return <span>退库</span>;
        }
      },
    },
    {
      title: '责任工位编码',
      dataIndex: 'dutyCode',
      width: 110,
      align: 'center',
    },
    {
      title: '责任工位描述',
      dataIndex: 'dutyName',
      width: 110,
      align: 'center',
    },
    {
      title: '提交人',
      dataIndex: 'realName',
      width: 110,
      align: 'center',
    },
    {
      title: '提交时间',
      dataIndex: 'dateTime',
      width: 110,
      align: 'center',
    },
    {
      title: '提交人备注',
      dataIndex: 'comments',
      width: 110,
      align: 'center',
    },
    {
      title: '处理人',
      dataIndex: 'closedName',
      width: 110,
      align: 'center',
    },
    {
      title: '处理时间',
      dataIndex: 'closedDateTime',
      width: 110,
      align: 'center',
    },
    {
      title: '处理人备注',
      dataIndex: 'closedComments',
      width: 110,
      align: 'center',
    },
    {
      title: '车间',
      dataIndex: 'workshopName',
      width: 110,
      align: 'center',
    },
    {
      title: '生产线',
      dataIndex: 'prodLineCode',
      width: 110,
      align: 'center',
    },
    {
      title: '产线描述',
      dataIndex: 'prodLineName',
      width: 110,
      align: 'center',
    },
  ];
  return (
    <Table
      bordered
      columns={columns}
      dataSource={dataSource}
      pagination={pagination}
      rowKey="materialLotId"
      loading={loading}
      onChange={page => handleFetchList(page)}
      scroll={{ x: tableScrollWidth(columns, 50) }}
    />
  );
};

export default TableList;
