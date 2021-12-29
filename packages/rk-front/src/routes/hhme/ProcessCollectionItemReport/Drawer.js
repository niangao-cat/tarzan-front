/**
 * UserGroupManagement 复制抽屉
 * @date: 2019-8-20
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Form, Table, Modal, Button } from 'hzero-ui';

@Form.create({ fieldNameProp: null })
export default class CopyDrawer extends React.PureComponent {

  render() {
    const { visible, onCancel, loading, pagination, dataSource, onSearch, jobId } = this.props;
    const columns = [
      {
        title: '组件物料编码',
        dataIndex: 'materialCode',
        width: 100,
      },
      {
        title: '组件物料条码',
        dataIndex: 'materialLotCode',
        width: 100,
      },
      {
        title: '组件物料批次',
        dataIndex: 'lot',
        width: 100,
      },
      {
        title: '供应商批次',
        dataIndex: 'supplierLot',
        width: 100,
      },
      {
        title: '投料数量',
        dataIndex: 'releaseQty',
        width: 100,
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={1000}
        title="明细"
        visible={visible}
        onCancel={onCancel}
        footer={(
          <Button type="default" onClick={() => onCancel()}>取消</Button>
        )}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Table
          bordered
          rowKey="materialLotId"
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          pagination={pagination}
          onChange={page => onSearch(jobId, page)}
        />
      </Modal>
    );
  }
}
