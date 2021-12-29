/*
 * @Description: 头
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-22 15:30:32
 * @LastEditTime: 2021-02-26 14:16:57
 */
import React, { forwardRef, Fragment, useState } from 'react';
import { tableScrollWidth } from 'utils/utils';
import { Drawer, Table } from 'hzero-ui';

const TableList = (props) => {

  const {
    dataSource,
    loading,
    dataSourceBarCode,
    onClickBarCode,
  } = props;

  const [visible, setVisible] = useState(false);

  // 条码明细抽屉
  const showBarCode = (val) => {
    setVisible(true);
    onClickBarCode(val);
  };

  const onClose = () => {
    setVisible(false);
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'sequenceNum',
      width: 80,
      align: 'center',
    },
    {
      title: '条码',
      dataIndex: 'materialLotCode',
      width: 120,
      render: (val, record) => (
        <a onClick={() => showBarCode(record.materialLotId)}>{val}</a>
      ),
    },
    {
      title: '冻结标识',
      dataIndex: 'snFreezeFlagMeaning',
      width: 90,
    },
    {
      title: '冻结时间',
      dataIndex: 'freezeDate',
      width: 130,
    },
    {
      title: '物料',
      dataIndex: 'materialCode',
      width: 100,
    },
    {
      title: '物料描述',
      dataIndex: 'materialName',
      width: 100,
    },
    {
      title: '物料版本',
      dataIndex: 'materialVersion',
      width: 100,
    },
    {
      title: '生产版本',
      dataIndex: 'productionVersion',
      width: 100,
    },
    {
      title: '仓库',
      dataIndex: 'warehouseCode',
      width: 100,
    },
    {
      title: '货位',
      dataIndex: 'locatorCode',
      width: 100,
    },
    {
      title: '供应商',
      dataIndex: 'supplierCode',
      width: 100,
    },
    {
      title: '供应商描述',
      dataIndex: 'supplierName',
      width: 110,
    },
    {
      title: '库存批次',
      dataIndex: 'inventoryLot',
      width: 100,
    },
    {
      title: '供应商批次',
      dataIndex: 'supplierLot',
      width: 120,
    },
    {
      title: '工单',
      dataIndex: 'workOrderNum',
      width: 100,
    },
    {
      title: '实验代码',
      dataIndex: 'testCode',
      width: 100,
    },
    {
      title: '设备',
      dataIndex: 'equipmentCode',
      width: 100,
    },
    {
      title: '生产线',
      dataIndex: 'prodLineCode',
      width: 90,
    },
    {
      title: '工段',
      dataIndex: 'workcellCode',
      width: 90,
    },
    {
      title: '工序',
      dataIndex: 'processCode',
      width: 90,
    },
    {
      title: '工位',
      dataIndex: 'stationCode',
      width: 90,
    },
    {
      title: 'COS类型',
      dataIndex: 'cosType',
      width: 90,
    },
    {
      title: '操作人',
      dataIndex: 'operatedByName',
      width: 90,
    },
    {
      title: '生产时间',
      dataIndex: 'productionDate',
      width: 130,
    },
    {
      title: '在制标识',
      dataIndex: 'mfFlagMeaning',
      width: 90,
    },
  ];

  const columnsBarCode =[
    {
      title: '序号',
      dataIndex: 'sequenceNum',
      width: 80,
      align: 'center',
    },
    {
      title: '条码',
      dataIndex: 'materialLotCode',
      width: 'auto',
      align: 'center',
    },
    {
      title: '物料编码',
      dataIndex: 'materialCode',
      width: 'auto',
      align: 'center',
    },
    {
      title: '位置',
      dataIndex: 'position',
      width: 'auto',
      align: 'center',
    },
    {
      title: 'WAFER',
      dataIndex: 'wafer',
      width: 'auto',
      align: 'center',
    },
    {
      title: '金锡比',
      dataIndex: 'ausnRatio',
      width: 90,
      align: 'center',
    },
    {
      title: '热沉编码',
      dataIndex: 'hotSinkNum',
      width: 'auto',
      align: 'center',
    },
    {
      title: '虚拟号',
      dataIndex: 'virtualNum',
      width: 'auto',
      align: 'center',
    },
    {
      title: '筛选规则',
      dataIndex: 'cosRuleCode',
      width: 'auto',
      align: 'center',
    },
    {
      title: '数量',
      dataIndex: 'cosNum',
      width: 'auto',
      align: 'center',
    },
    {
      title: '冻结标识',
      dataIndex: 'freezeFlagMeaning',
      width: 'auto',
      align: 'center',
    },
  ];

  return (
    <Fragment>
      <Table
        bordered
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        rowKey="ssnInspectResultHeaderId"
        scroll={{ x: tableScrollWidth(columns, 50) }}
      />
      <Drawer
        title='条码明细'
        placement="right"
        closable
        onClose={() => onClose()}
        visible={visible}
        width={800}
        maskClosable
      >
        <Table
          bordered
          columns={columnsBarCode}
          dataSource={dataSourceBarCode}
          pagination={false}
          loading={loading}
          onChange={page => onClickBarCode(page)}
          // scroll={{ x: tableScrollWidth(columns, 50) }}
        />
      </Drawer>
    </Fragment>
  );
};

export default forwardRef(TableList);
