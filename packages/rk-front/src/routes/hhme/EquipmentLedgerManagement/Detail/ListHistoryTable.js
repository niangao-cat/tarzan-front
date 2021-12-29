/*
 * @Description: 设备台账管理
 * @version: 0.0.1
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-06-02 10:19:17
 */

import React, { Component } from 'react';
import { Table, Modal } from 'hzero-ui';
import { tableScrollWidth } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';

@formatterCollections({ code: 'hwms.barcodeQuery' })
class ListTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * 页面渲染
   * @returns {*}
   */
  render() {
    const {
      loading,
      dataSource,
      onSearch,
      onCancel,
      visible,
      pagination,
    } = this.props;
    const columns = [
      {
        title: '设备类型',
        dataIndex: 'equipmentTypeMeaning',
        width: 100,
        align: 'center',
      },
      {
        title: '资产编码',
        dataIndex: 'assetEncoding',
        width: 100,
        align: 'center',
      },
      {
        title: '资产名称',
        dataIndex: 'assetName',
        width: 100,
        align: 'center',
      },
      {
        title: '机身序列号',
        dataIndex: 'equipmentBodyNum',
        width: 60,
        align: 'center',
      },
      {
        title: '型号',
        dataIndex: 'model',
        width: 60,
        align: 'center',
      },
      {
        title: '品牌',
        dataIndex: 'brand',
        width: 70,
        align: 'center',
      },
      {
        title: '销售商',
        dataIndex: 'supplier',
        width: 100,
        align: 'center',
      },
      {
        title: '保管部门',
        dataIndex: 'businessName',
        width: 70,
        align: 'center',
      },
      {
        title: '保管人',
        dataIndex: 'preserver',
        width: 100,
        align: 'center',
      },
      {
        title: '存放地点',
        dataIndex: 'location',
        width: 100,
        align: 'center',
      },
      {
        title: '使用频次',
        dataIndex: 'frequencyMeaning',
        width: 60,
        align: 'center',
      },
      {
        title: '单位',
        dataIndex: 'unit',
        width: 60,
        align: 'center',
      },
      {
        title: '数量',
        dataIndex: 'quantity',
        width: 60,
        align: 'center',
      },
      {
        title: '金额',
        dataIndex: 'amount',
        width: 100,
        align: 'center',
      },
      {
        title: '资产类别',
        dataIndex: 'assetClassMeaning',
        width: 100,
        align: 'center',
      },
      {
        title: '入账日期',
        dataIndex: 'postingDate',
        width: 100,
        align: 'center',
      },
      {
        title: 'SAP流水号',
        dataIndex: 'sapNum',
        width: 60,
        align: 'center',
      },
      {
        title: '配置',
        dataIndex: 'equipmentConfig',
        width: 100,
        align: 'center',
      },
      {
        title: '合同编号',
        dataIndex: 'contractNum',
        width: 60,
        align: 'center',
      },
      {
        title: '募投',
        dataIndex: 'recruitement',
        width: 100,
        align: 'center',
      },
      {
        title: '募投编号',
        dataIndex: 'recruitementNum',
        width: 100,
        align: 'center',
      },
      {
        title: 'OA验收单号',
        dataIndex: 'oaCheckNum',
        width: 100,
        align: 'center',
      },
      {
        title: '是否计量',
        dataIndex: 'measureFlagMeaning',
        width: 100,
        align: 'center',
      },
      {
        title: '质保期到',
        dataIndex: 'warrantyDate',
        width: 60,
        align: 'center',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 100,
        align: 'center',
      },
      {
        title: '点检分类',
        dataIndex: 'equipmentCategoryMeaning',
        width: 100,
        align: 'center',
      },
      {
        title: '设备状态',
        dataIndex: 'equipmentStatusMeaning',
        width: 120,
        align: 'center',
      },
      {
        title: '币种',
        dataIndex: 'currency',
        width: 120,
        align: 'center',
      },
      {
        title: '使用人',
        dataIndex: 'user',
        width: 100,
        align: 'center',
      },
      {
        title: '处置单号',
        dataIndex: 'dealNum',
        width: 100,
        align: 'center',
      },
      {
        title: '处置原因',
        dataIndex: 'dealReason',
        width: 70,
        align: 'center',
      },
      {
        title: '归属权',
        dataIndex: 'belongTo',
        width: 100,
        align: 'center',
      },
      {
        title: '应用类型',
        dataIndex: 'applyTypeMeaning',
        width: 100,
        align: 'center',
      },
      {
        title: '管理模式',
        dataIndex: 'manageModeMeaning',
        width: 100,
        align: 'center',
      },
      {
        title: '台账类别',
        dataIndex: 'ledgerCategoryMeaning',
        width: 100,
        align: 'center',
      },
      {
        title: '变更时间',
        dataIndex: 'lastUpdateDate',
        width: 100,
        align: 'center',
      },
      {
        title: '变更人',
        dataIndex: 'lastUpdatedByName',
        width: 100,
        align: 'center',
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={1500}
        title='台账修改历史'
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleOK}
        footer={null}
      >
        <Table
          bordered
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          pagination={{ ...pagination, pageSizeOptions: ['10', '50', '100', '200', '500'] }}
          scroll={{ x: tableScrollWidth(columns, 50), y: 500 }}
          onChange={page => onSearch(page)}
        />
      </Modal>
    );
  }
}
export default ListTable;
