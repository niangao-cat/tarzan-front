import React, { Component } from 'react';
import { Form, Input } from 'hzero-ui';
import intl from 'utils/intl';
import EditTable from 'components/EditTable';
import { tableScrollWidth } from 'utils/utils';

class ListTable extends Component {

  /**
   * 页面渲染
   * @returns {*}
   */
  render() {
    const {
      loading,
      dataSource,
      pagination,
      onSearch,
      onEditLine,
    } = this.props;
    const modelPrompt = 'hwms.barcodeQuery.model.barcodeQuery';
    const columns = [
      {
        title: intl.get(`${modelPrompt}.materialLotCode`).d('实物条码'),
        dataIndex: 'materialLotCode',
        width: 240,
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('是否有效'),
        dataIndex: 'enableFlagMeaning',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.statusMeaning`).d('状态'),
        dataIndex: 'statusMeaning',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.qualityStatusMeaning`).d('质量状态'),
        dataIndex: 'qualityStatusMeaning',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
        width: 160,
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.materialVersion`).d('物料版本'),
        dataIndex: 'materialVersion',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.supplierCode`).d('供应商编码'),
        dataIndex: 'supplierCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.supplierName`).d('供应商描述'),
        dataIndex: 'supplierName',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.lot`).d('批次'),
        dataIndex: 'lot',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.primaryUomQty`).d('数量'),
        dataIndex: 'primaryUomQty',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.primaryUomCode`).d('单位'),
        dataIndex: 'uomCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.siteCode`).d('工厂'),
        dataIndex: 'siteName',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.wareHouse`).d('仓库'),
        dataIndex: 'warehouseCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.locatorCode`).d('货位'),
        dataIndex: 'locatorCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.productDate`).d('生产日期'),
        dataIndex: 'productDate',
        width: 200,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.enableDate`).d('启用时间'),
        dataIndex: 'enableDate',
        width: 200,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.deadlineDate`).d('截止时间'),
        dataIndex: 'deadlineDate',
        width: 200,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.poNum`).d('采购订单号'),
        dataIndex: 'poNum',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.poLineNum`).d('采购订单行号'),
        dataIndex: 'poLineNum',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.remark`).d('备注'),
        dataIndex: 'remark',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.containerCode`).d('容器条码'),
        dataIndex: 'containerCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.labCode`).d('实验代码'),
        dataIndex: 'labCode',
        width: 120,
        render: (value, record) =>
          ['update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('labCode', {
                initialValue: value,
              })(<Input />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${modelPrompt}.labRemark`).d('实验备注'),
        dataIndex: 'labRemark',
        width: 120,
        render: (value, record) =>
          ['update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('labRemark', {
                initialValue: value,
              })(<Input />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 100,
        align: 'center',
        fixed: 'right',
        render: (val, record) =>
          record._status === 'update' ? (
            <span className="action-link">
              <a onClick={() => onEditLine(record, false)}>
                {intl.get('hzero.common.button.cancel').d('取消')}
              </a>
            </span>
          ) : (
            <span className="action-link">
              <a onClick={() => onEditLine(record, true)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
            </span>
          ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="materialLotId"
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
export default ListTable;
