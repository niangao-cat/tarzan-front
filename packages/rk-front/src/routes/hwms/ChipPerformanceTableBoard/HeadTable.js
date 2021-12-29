/**
 * @author:ywj
 * @email:wenjie.yang01@hand-china.com
 * @description: 报表
 */
// 引入依赖
import React from 'react';
import { Table } from 'hzero-ui';

// 默认输出
export default class HeadListTable extends React.Component {
  // 直接渲染
  render() {
    // 护球上文参数
    const {
      loading,
      dataSource,
      pagination,
      onSearch,
    } = this.props;

    // 列展示

    const columns = [
      {
        title: '工单号',
        dataIndex: 'workOrderNum',
        width: 110,
      },
      {
        title: '产品编码',
        dataIndex: 'materialCode',
        width: 90,
      },
      {
        title: '产品描述',
        dataIndex: 'materialName',
        width: 120,
      },
      {
        title: '是否在制',
        dataIndex: 'mfFlagMeaning',
        width: 90,
      },
      {
        title: '测试设备',
        dataIndex: 'testEquipment',
        width: 90,
      },
      {
        title: '贴片设备',
        dataIndex: 'patchEquipment',
        width: 150,
      },
      {
        title: 'WAFER',
        dataIndex: 'wafer',
        width: 80,
      },
      {
        title: 'COS类型',
        dataIndex: 'cosType',
        width: 100,
      },
      {
        title: '条码',
        dataIndex: 'materialLotCode',
        width: 180,
      },
      {
        title: '位置',
        dataIndex: 'rowCloumn',
        width: 80,
      },
      {
        title: '状态',
        dataIndex: 'preStatusMeaning',
        width: 90,
      },
      {
        title: '热沉编码',
        dataIndex: 'hotSinkCode',
        width: 90,
      },
      {
        title: '实验代码',
        dataIndex: 'labCode',
        width: 90,
      },
      {
        title: '测试模式',
        dataIndex: 'a09',
        width: 90,
      },
      {
        title: '阈值电流',
        dataIndex: 'a010',
        width: 90,
      },
      {
        title: '阈值电压',
        dataIndex: 'a011',
        width: 90,
      },
      {
        title: '测试电流',
        dataIndex: 'current',
        width: 90,
      },
      {
        title: '电压',
        dataIndex: 'a06',
        width: 80,
      },
      {
        title: '功率',
        dataIndex: 'a02',
        width: 80,
      },
      {
        title: '中心波长',
        dataIndex: 'a04',
        width: 90,
      },
      {
        title: 'SE',
        dataIndex: 'a012',
        width: 80,
      },
      {
        title: '线宽',
        dataIndex: 'a013',
        width: 80,
      },
      {
        title: 'WPE',
        dataIndex: 'a014',
        width: 80,
      },
      {
        title: '波长差',
        dataIndex: 'a05',
        width: 80,
      },
      {
        title: '透镜功率',
        dataIndex: 'a22',
        width: 90,
      },
      {
        title: 'PBS功率',
        dataIndex: 'a23',
        width: 80,
      },
      {
        title: '偏振度数',
        dataIndex: 'a15',
        width: 90,
      },
      {
        title: 'X半宽高',
        dataIndex: 'a16',
        width: 80,
      },
      {
        title: 'X86能量宽',
        dataIndex: 'a18',
        width: 100,
      },
      {
        title: 'X95能量宽',
        dataIndex: 'a20',
        width: 100,
      },
      {
        title: 'Y半宽高',
        dataIndex: 'a17',
        width: 80,
      },
      {
        title: 'Y86能量宽',
        dataIndex: 'a19',
        width: 100,
      },
      {
        title: 'Y95能量宽',
        dataIndex: 'a21',
        width: 100,
      },
      {
        title: '功率等级',
        dataIndex: 'a01',
        width: 90,
      },
      {
        title: '波长等级',
        dataIndex: 'a03',
        width: 90,
      },
      {
        title: '电压等级',
        dataIndex: 'a27',
        width: 90,
      },
      {
        title: '发散角等级',
        dataIndex: 'divergenceGrade',
        width: 100,
      },
      {
        title: '偏振度等级',
        dataIndex: 'polarizationGrade',
        width: 100,
      },
      {
        title: '不良描述',
        dataIndex: 'description',
        width: 90,
      },
      {
        title: '备注',
        dataIndex: 'a26',
        width: 80,
      },
      {
        title: '不良代码',
        dataIndex: 'ncCode',
        width: 90,
      },
      {
        title: '是否不良',
        dataIndex: 'ncFlagMeaning',
        width: 90,
      },
      {
        title: '热沉条码',
        dataIndex: 'heatSinkMaterialLot',
        width: 180,
      },
      {
        title: '热沉物料编码',
        dataIndex: 'heatSinkMaterialCode',
        width: 120,
      },
      {
        title: '热沉供应商批次',
        dataIndex: 'heatSinkSupplierLot',
        width: 120,
      },
      {
        title: '热沉焊料金锡比',
        dataIndex: 'solderAusnRation',
        width: 120,
      },
      {
        title: '金线条码',
        dataIndex: 'goldWireMaterialLot',
        width: 90,
      },
      {
        title: '金线物料编码',
        dataIndex: 'goldWireMaterialCode',
        width: 100,
      },
      {
        title: '金线供应商批次',
        dataIndex: 'goldWireSupplierLot',
        width: 120,
      },
      {
        title: '测试操作人',
        dataIndex: 'realName',
        width: 110,
      },
      {
        title: '测试时间',
        dataIndex: 'creationDate',
        width: 180,
      },
      {
        title: '工位编码',
        dataIndex: 'workcellCode',
        width: 100,
      },
      {
        title: '工位描述',
        dataIndex: 'workcellName',
        width: 110,
      },
      {
        title: '工序描述',
        dataIndex: 'processName',
        width: 110,
      },
      {
        title: '工段描述',
        dataIndex: 'lineWorkcellName',
        width: 110,
      },
      {
        title: '生产线描述',
        dataIndex: 'prodLineName',
        width: 110,
      },
      {
        title: '仓库',
        dataIndex: 'warehouseCode',
        width: 80,
      },
      {
        title: '货位',
        dataIndex: 'locatorCode',
        width: 80,
      },
      {
        title: '是否冻结',
        dataIndex: 'freezeFlagMeaning',
        width: 90,
      },
    ];

    return (
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        rowKey="loadSequence"
        onChange={page => onSearch(page)}
        loading={loading}
      />
    );
  }
}
