/**
 * WorkCellDist - 工作单元明细编辑
 * @date: 2019-12-16
 * @author: xubitig <biting.xu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { PureComponent } from 'react';
// import { connect } from 'dva';
import { Modal, Table } from 'hzero-ui';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';

const commonModelPrompt = 'tarzan.common.components.model.components';

/**
 * 扩展属性表格抽屉展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @param {Boolean} visible - 是否关闭抽屉
 * @param {Boolean} canEdit - 是否可以编辑
 * @param {Array} - attribute List
 * @param {Function} onSave - 保存抽屉数据
 * @param {Function} onCancle - 关闭抽屉
 * @return React.element
 */
export default class AttributeDrawer extends PureComponent {

  @Bind()
  handleSearch(page) {
    const { onFetchDetail, onFetchPoList, type, record } = this.props;
    if(type === 'INSTRUCTION') {
      onFetchDetail(page, {instructionId: record.instructionId});
    } else if(type === 'PO') {
      onFetchPoList(page, {instructionId: record.instructionId});
    }
  }

  render() {
    const { visible = false, onCancel, pagination, dataSource, loading, type} = this.props;
    const columns = type === 'INSTRUCTION' ? [
      {
        title: intl.get(`${commonModelPrompt}.orderSeq`).d('序号'),
        width: 60,
        dataIndex: 'orderSeq',
        render: (text, data, index) => {
          const { pageSize, current } = pagination;
          return pageSize * (current - 1) + index + 1;
        },
      },
      {
        title: '条码',
        width: 120,
        dataIndex: 'materialLotCode',
      },
      {
        title: '状态',
        width: 100,
        dataIndex: 'materialLotStatusMeaning',
      },
      {
        title: '物料',
        width: 60,
        dataIndex: 'materialCode',
      },
      {
        title: '物料描述',
        width: 100,
        dataIndex: 'materialName',
      },
      {
        title: '数量',
        width: 100,
        dataIndex: 'primaryUomQty',
      },
      {
        title: '批次',
        width: 120,
        dataIndex: 'lot',
      },
      {
        title: '仓库',
        dataIndex: 'warehouseCode',
        width: 60,
      },
      {
        title: '货位',
        width: 90,
        dataIndex: 'materialLotLocatorCode',
      },
      {
        title: '有效性',
        width: 90,
        dataIndex: 'enableFlagMeaning',
      },
      {
        title: '实际存储货位',
        width: 100,
        dataIndex: 'actualLocatorCode',
      },
    ] : [
      {
        title: intl.get(`${commonModelPrompt}.orderSeq`).d('序号'),
        width: 60,
        dataIndex: 'orderSeq',
        render: (text, data, index) => {
          const { pageSize, current } = pagination;
          return pageSize * (current - 1) + index + 1;
        },
      },
      {
        title: '采购订单',
        width: 90,
        dataIndex: 'poNumber',
        render: (val, data) => `${val}-${data.poLineNumber}`,
      },
      {
        title: '分配数量',
        width: 90,
        dataIndex: 'distributeQty',
      },
      {
        title: '执行数量',
        width: 90,
        dataIndex: 'stockInQty',
      },
    ];

    return (
      <Modal
        destroyOnClose
        width={1000}
        title='明细'
        visible={visible}
        onCancel={onCancel}
        footer={null}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        placement="right"
        maskClosable
      >
        <Table
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
          onChange={page => this.handleSearch(page)}
          loading={loading}
          rowKey="instructionId"
        />
      </Modal>
    );
  }
}
