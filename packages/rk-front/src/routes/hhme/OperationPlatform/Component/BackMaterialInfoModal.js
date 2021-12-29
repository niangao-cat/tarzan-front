/**
 * 计划外投料
 * @date: 2020/07/15 19:25:36
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component, Fragment } from 'react';
import { Modal, Table, Form, Button } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

@Form.create({ fieldNameProp: null })
export default class BackMaterialInfoModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }


  @Bind()
  handleOpenModal() {
    const {onSearch} = this.props;
    if(onSearch) {
      onSearch();
    }
    this.setState({ visible: true });
  }

  @Bind()
  handleCloseModal() {
    this.setState({ visible: false });
  }


  render() {
    const { dataSource = [], loading, pagination, onSearch } = this.props;
    const { visible } = this.state;
    const columns = [
      {
        title: '物料编码',
        width: 50,
        dataIndex: 'materialCode',
      },
      {
        title: '物料描述',
        width: 50,
        dataIndex: 'materialName',
      },
      {
        title: '需求数量',
        width: 50,
        dataIndex: 'componentQty',
      },
      {
        title: '库位编码',
        width: 60,
        dataIndex: 'locatorCode',
      },
      {
        title: '库位描述',
        width: 40,
        dataIndex: 'locatorName',
      },
      {
        title: '库存',
        width: 30,
        dataIndex: 'onhandQuantity',
      },
      {
        title: '单位',
        width: 30,
        dataIndex: 'uomName',
      },
    ];
    return (
      <Fragment>
        <Button onClick={() => this.handleOpenModal()}>反冲料信息</Button>
        <Modal
          destroyOnClose
          width={800}
          title='反冲料信息'
          visible={visible}
          onCancel={this.handleCloseModal}
          footer={null}
        >
          <Table
            bordered
            loading={loading}
            rowKey="eoId"
            dataSource={dataSource}
            columns={columns}
            pagination={pagination}
            onChange={page => onSearch(page)}
          />
        </Modal>
      </Fragment>
    );
  }
}
