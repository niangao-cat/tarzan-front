/*
 * @Description: 物料条码查询
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-26 13:50:17
 * @LastEditTime: 2020-08-26 15:54:15
 */

import React, { Component } from 'react';
import { Modal, Form, Table} from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { closeTab } from 'utils/menuTab';

@Form.create({ fieldNameProp: null })
export default class MaterialBarCodeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }



  // 输入工位并回车
  @Bind()
  enterSite() {
    const { enterSite, form } = this.props;
    if (enterSite) {
      form.validateFields((err, values) => {
        if (!err) {
          // 如果验证成功,则执行enterSite
          enterSite(values);
        }
      });
    }
  }

  // 关闭输入框
  @Bind()
  handleCloseTab() {
    closeTab(`/hhme/incoming-material-entry`);
  }

  render() {
    const columns = [
      {
        title: '物料条码',
        dataIndex: 'materialLotCode',
        width: 70,
      },
      {
        title: '组件编码',
        dataIndex: 'materialCode',
        width: 70,
      },
      {
        title: '类型编码',
        dataIndex: 'cosType',
        width: 70,
      },
      {
        title: '已入数量',
        dataIndex: 'primaryUonQty',
        width: 70,
      },
      {
        title: '来料批次',
        dataIndex: 'jobBatch',
        width: 70,
      },
    ];
    const {
      dataSource,
      onSearch,
      visible,
      fetchMaterialBarCode,
    } = this.props;
    return (
      <Modal
        destroyOnClose
        width={800}
        title={intl.get('hmes.operationPlatform.view.message.title').d('条码')}
        visible={visible}
        onCancel={() => fetchMaterialBarCode(false, {})}
        onOk={() => fetchMaterialBarCode(false, {})}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Table
          bordered
          rowKey="letterId"
          columns={columns}
          pagination={false}
          // loading={fetchLoading}
          dataSource={dataSource}
          scroll={{ y: 350 }}
          // pagination={pagination}
          onChange={page => onSearch(page)}
        // onRow={record => {
        //   return {
        //     onClick: () => handleEditLine(record, true), // 点击行
        //   };
        // }}
        />
      </Modal>
    );
  }
}
