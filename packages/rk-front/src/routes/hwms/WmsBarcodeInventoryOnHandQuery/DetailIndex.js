// 明细 数据查询
import React, { Component } from 'react';
import { Modal } from 'hzero-ui';
import intl from 'utils/intl';

import EditTable from 'components/EditTable';

const commonModelPrompt = 'tarzan.hwms.wmsBarcodeInventoryOnHandQuery';

class DetailIndex extends Component {

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
      const { dataSource, pagination, loading, onSearch, detailExpand, closeDetail } = this.props;
      // 设置显示数据
    const columns = [
        {
          title: intl.get(`${commonModelPrompt}.materialLotCode`).d('条码'),
          dataIndex: 'materialLotCode',
          align: 'center',
        },
        {
          title: intl.get(`${commonModelPrompt}.materialLotStatusMeaning`).d('条码状态'),
          dataIndex: 'materialLotStatusMeaning',
          align: 'center',
        },
        {
          title: intl.get(`${commonModelPrompt}.qualityStatus`).d('质量状态'),
          dataIndex: 'qualityStatus',
          align: 'center',
        },
        {
          title: intl.get(`${commonModelPrompt}.materialCode`).d('物料编码'),
          dataIndex: 'materialCode',
          align: 'center',
        },
        {
          title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
          dataIndex: 'materialName',
          align: 'center',
        },
        {
          title: intl.get(`${commonModelPrompt}.materialVersion`).d('物料版本'),
          dataIndex: 'materialVersion',
          align: 'center',
        },
        {
          title: intl.get(`${commonModelPrompt}.warehouseCode`).d('仓库'),
          dataIndex: 'warehouseCode',
          align: 'center',
        },
        {
          title: intl.get(`${commonModelPrompt}.locatorCode`).d('货位'),
          dataIndex: 'locatorCode',
          align: 'center',
        },
        {
          title: intl.get(`${commonModelPrompt}.lot`).d('批次'),
          dataIndex: 'lot',
          align: 'left',
        },
        {
          title: intl.get(`${commonModelPrompt}.uomCode`).d('单位'),
          dataIndex: 'uomCode',
          align: 'left',
        },
        {
          title: intl.get(`${commonModelPrompt}.primaryUomQty`).d('数量'),
          dataIndex: 'primaryUomQty',
          align: 'left',
        },
        {
          title: intl.get(`${commonModelPrompt}.soNum`).d('销售订单号'),
          dataIndex: 'soNum',
          align: 'left',
        },
        {
          title: intl.get(`${commonModelPrompt}.soLineNum`).d('销售订单行号'),
          dataIndex: 'soLineNum',
          align: 'left',
        },
        {
          title: 'SAP账务标识',
          dataIndex: 'sapAccountFlagMeaning',
          align: 'left',
        },
      ];
    return (
      <Modal
        destroyOnClose
        width={1080}
        title={intl.get('hwms.deliverQuery.view.message.lineDetail').d('明细')}
        visible={detailExpand}
        onCancel={closeDetail}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        footer={null}
      >
        <EditTable
          loading={loading}
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
          onChange={page => onSearch(page)}
          footer={null}
          bordered
        />
      </Modal>
    );
  }
}
export default DetailIndex;
