/*
 * @Description: 行table
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-22 15:30:48
 * @LastEditTime: 2021-02-26 10:22:41
 */
import React, { Fragment, useState } from 'react';
import { tableScrollWidth } from 'utils/utils';
import { Table, Drawer } from 'hzero-ui';

const LineTable = (props) => {

  const {
    dataSource,
    loading,
    onFetchLine,
    selectedLineRows,
    onSelectLine,
    dataSourceBarCode,
    onClickBarCode,
    pagination,
    selectedHeadRowKeys,
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
      width: 100,
      align: 'center',
      render: (val, record) => (
        <a onClick={() => showBarCode(record.materialLotId)}>{val}</a>
      ),
    },
    {
      title: '单据冻结标识',
      dataIndex: 'freezeFlagMeaning',
      width: 110,
      align: 'center',
    },
    {
      title: '条码冻结标识',
      dataIndex: 'snFreezeFlagMeaning',
      width: 110,
      align: 'center',
    },
    {
      title: '冻结时间',
      dataIndex: 'freezeDate',
      width: 100,
      align: 'center',
    },
    {
      title: '物料',
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
      title: '数量',
      dataIndex: 'primaryUomQty',
      width: 80,
      align: 'center',
    },
    {
      title: '物料版本',
      dataIndex: 'materialVersion',
      width: 100,
      align: 'center',
    },
    {
      title: '生产版本',
      dataIndex: 'productionVersion',
      width: 100,
      align: 'center',
    },
    {
      title: '仓库',
      dataIndex: 'warehouseCode',
      width: 90,
      align: 'center',
    },
    {
      title: '货位',
      dataIndex: 'locatorCode',
      width: 90,
      align: 'center',
    },
    {
      title: '供应商',
      dataIndex: 'supplierCode',
      width: 100,
      align: 'center',
    },
    {
      title: '供应商描述',
      dataIndex: 'supplierName',
      width: 110,
      align: 'center',
    },
    {
      title: '库存批次',
      dataIndex: 'inventoryLot',
      width: 100,
      align: 'center',
    },
    {
      title: '供应商批次',
      dataIndex: 'supplierLot',
      width: 110,
      align: 'center',
    },
    {
      title: '工单',
      dataIndex: 'workOrderNum',
      width: 90,
      align: 'center',
    },
    {
      title: '实验代码',
      dataIndex: 'testCode',
      width: 100,
      align: 'center',
    },
    {
      title: '设备',
      dataIndex: 'equipmentCode',
      width: 90,
      align: 'center',
    },
    {
      title: '生产线',
      dataIndex: 'prodLineCode',
      width: 90,
      align: 'center',
    },
    {
      title: '工段',
      dataIndex: 'workcellCode',
      width: 90,
      align: 'center',
    },
    {
      title: '工序',
      dataIndex: 'processCode',
      width: 90,
      align: 'center',
    },
    {
      title: '工位',
      dataIndex: 'stationCode',
      width: 90,
      align: 'center',
    },
    {
      title: 'COS类型',
      dataIndex: 'cosTypeMeaning',
      width: 90,
      align: 'center',
    },
    {
      title: '操作人',
      dataIndex: 'operatedByName',
      width: 90,
      align: 'center',
    },
    {
      title: '生产时间',
      dataIndex: 'productionDate',
      width: 130,
      align: 'center',
    },
  ];

  const columnsBarCode = [
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
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        loading={loading}
        onChange={page => onFetchLine(selectedHeadRowKeys, page)}
        rowKey="materialLotId"
        scroll={{ x: tableScrollWidth(columns, 50) }}
        rowSelection={{
          selectedRowKeys: selectedLineRows,
          onChange: onSelectLine,
        }}
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

export default LineTable;
