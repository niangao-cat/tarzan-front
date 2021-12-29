/*
 * @Description: 查询
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-01 15:21:44
 * @LastEditTime: 2021-03-15 15:52:22
 */

import React, { forwardRef } from 'react';
import { tableScrollWidth } from 'utils/utils';
import { Table } from 'hzero-ui';

const HeadTable = (props) => {

  const {
    dataSource,
    pagination,
    loading,
    handleFetchHeadList,
    // selectedHeadRows,
    // onSelectHead,
  } = props;
  const columns = [
    {
      title: '序号',
      dataIndex: 'orderSeq',
      width: 70,
      align: 'center',
      render: (val, record, index) => index + 1,
    },
    {
      title: '产线',
      dataIndex: 'prodLineName',
      width: 100,
      align: 'center',
    },
    {
      title: '工艺',
      dataIndex: 'description',
      width: 100,
      align: 'center',
    },
    {
      title: '工序',
      dataIndex: 'processName',
      width: 100,
      align: 'center',
    },
    {
      title: '工位编码',
      dataIndex: 'workcellCode',
      width: 110,
      align: 'center',
    },
    {
      title: '工位描述',
      dataIndex: 'workcellName',
      width: 110,
      align: 'center',
    },
    {
      title: '标准件编码',
      dataIndex: 'standardSnCode',
      width: 110,
      align: 'center',
    },
    {
      title: '物料编码',
      dataIndex: 'materialCode',
      width: 110,
      align: 'center',
    },
    {
      title: '物料描述',
      dataIndex: 'materialName',
      width: 110,
      align: 'center',
    },
    {
      title: '芯片类型',
      dataIndex: 'cosType',
      width: 110,
      align: 'center',
    },
    {
      title: '工作方式',
      dataIndex: 'workWayMeaning',
      width: 110,
      align: 'center',
    },
    {
      title: '操作人',
      dataIndex: 'realName',
      width: 110,
      align: 'center',
    },
    {
      title: '创建日期',
      dataIndex: 'creationDate',
      width: 110,
      align: 'center',
    },
    {
      title: '日期',
      dataIndex: 'shiftDate',
      width: 110,
      align: 'center',
    },
    {
      title: '班次',
      dataIndex: 'shiftCode',
      width: 110,
      align: 'center',
    },
    {
      title: '标准件检验结果',
      dataIndex: 'result',
      width: 120,
      align: 'center',
    },
    {
      title: '检验项目序号',
      dataIndex: 'sequence',
      width: 110,
      align: 'center',
    },
    {
      title: '检验项编码',
      dataIndex: 'tagCode',
      width: 110,
      align: 'center',
    },
    {
      title: '检验项描述',
      dataIndex: 'tagDescription',
      width: 110,
      align: 'center',
    },
    {
      title: '最小值',
      dataIndex: 'minimumValue',
      width: 100,
      align: 'center',
    },
    {
      title: '最大值',
      dataIndex: 'maximalValue',
      width: 100,
      align: 'center',
    },
    {
      title: '检验值',
      dataIndex: 'inspectValue',
      width: 100,
      align: 'center',
    },
    {
      title: '项检验结果',
      dataIndex: 'lineResult',
      width: 100,
      align: 'center',
    },
  ];
  return (
    <Table
      bordered
      loading={loading}
      columns={columns}
      dataSource={dataSource}
      pagination={pagination}
      onChange={page => handleFetchHeadList(page)}
      // rowKey="ssnInspectResultHeaderId"
      scroll={{ x: tableScrollWidth(columns, 50) }}
      // rowSelection={{
      //   type: 'radio',
      //   selectedRowKeys: selectedHeadRows,
      //   onChange: onSelectHead,
      // }}
    />
  );
};

export default forwardRef(HeadTable);
