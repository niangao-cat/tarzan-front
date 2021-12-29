/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 生产流转查询报表
 */
import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
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
    const commonModelPrompt = 'tarzan.hwms.productionFlowQueryReport';
    const { loading, dataSource, pagination, onSearch, handleClickSelectedRows} = this.props;
    // 设置显示数据
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.prodLineCode`).d('产线'),
        dataIndex: 'prodLineCode',
        width: '10',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.workshopName`).d('工段'),
        dataIndex: 'workcellLineName',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.workproName`).d('工序'),
        dataIndex: 'workcellProcessName',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.workOrderNum`).d('工单号'),
        dataIndex: 'workOrderNum',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.productionVersion`).d('工单版本'),
        dataIndex: 'productionVersion',
        width: '150',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.workOrderStatusMeaning`).d('工单状态'),
        dataIndex: 'workOrderStatusMeaning',
        width: '150',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
        width: '80',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: '80',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialLotCode`).d('SN'),
        dataIndex: 'materialLotCode',
        width: '80',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.reworkMaterialLot`).d('返修SN'),
        dataIndex: 'reworkMaterialLot',
        width: '80',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.parentWorkcellCode`).d('工艺步骤'),
        dataIndex: 'stepDescription',
        width: '80',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.tryCode`).d('实验代码'),
        dataIndex: 'labCode',
        width: '80',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.jobTypeMeaning`).d('作业平台类型'),
        dataIndex: 'jobTypeMeaning',
        width: '80',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.workcellCode`).d('工位'),
        dataIndex: 'workcellName',
        width: '80',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.siteInDate`).d('加工开始时间'),
        dataIndex: 'siteInDate',
        width: '80',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.shiftDate`).d('班次日期'),
        dataIndex: 'shiftDate',
        width: '150',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.shiftCode`).d('班次'),
        dataIndex: 'shiftCode',
        width: '150',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.createUserName`).d('进站人员'),
        dataIndex: 'createUserName',
        width: '120',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.siteOutDate`).d('加工结束时间'),
        dataIndex: 'siteOutDate',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.operatorUserName`).d('出站人员'),
        dataIndex: 'operatorUserName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.processTime`).d('加工时长(分)'),
        dataIndex: 'processTime',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.ncInfoFlag`).d('不良'),
        dataIndex: 'ncInfoFlag',
        align: 'center',
        render: (value, record) =>
          value?(
            <span className="action-link">
              <a onClick={() => handleClickSelectedRows(record)}>{value?'是':'否'}</a>
            </span>
        ):(<span>{value?'是':'否'}</span>),
      },
      {
        title: intl.get(`${commonModelPrompt}.isRework`).d('是否返修'),
        dataIndex: 'isRework',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.assetEncoding`).d('设备编码'),
        dataIndex: 'assetEncoding',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.assetName`).d('设备名称'),
        dataIndex: 'assetName',
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
