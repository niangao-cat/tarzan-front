/**
 * 物料对应的BIN列表
 *@date：2019/9/17
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Modal, Table, Button, Badge } from 'hzero-ui';
import intl from 'utils/intl';

class BinModal extends Component {
  render() {
    const prefix = 'hwms.materialQuery.model.materialQuery';
    const { loading, dataSource, modalVisible, onOk } = this.props;
    const columns = [
      {
        title: intl.get(`${prefix}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
      },
      {
        title: intl.get(`${prefix}.materialDescription`).d('物料描述'),
        dataIndex: 'materialName',
      },
      {
        title: intl.get(`${prefix}.binType`).d('bin类型'),
        dataIndex: 'binName',
      },
      {
        title: intl.get(`${prefix}.binValue`).d('bin值'),
        dataIndex: 'binValue',
      },
      {
        title: intl.get(`${prefix}.enableFlag`).d('有效性'),
        dataIndex: 'binEnableFlag',
        render: (val, record) => (
          <Badge
            status={record.binEnableFlag === 'Y' ? 'success' : 'error'}
            text={
              record.binEnableFlag === 'Y'
                ? intl.get(`hzero.common.view.yes`).d('是')
                : intl.get(`hzero.common.view.no`).d('否')
            }
          />
        ),
      },
    ];
    return (
      <Modal
        destroyOnClose
        closable={false}
        visible={modalVisible}
        footer={
          <Button type="primary" onClick={onOk}>
            {intl.get('hzero.common.button.close').d('关闭')}
          </Button>
        }
      >
        <Table
          bordered
          rowKey="materialBinId"
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          pagination={false}
        />
      </Modal>
    );
  }
}
export default BinModal;
