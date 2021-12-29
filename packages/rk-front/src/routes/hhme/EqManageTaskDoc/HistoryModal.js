/**
 * 计划外投料
 * @date: 2020/07/15 19:25:36
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component, Fragment } from 'react';
import { Modal, Button, Table } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

export default class HistoryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }


  @Bind()
  handleOpenModal() {
    const { onSearch } = this.props;
    if(onSearch) {
      onSearch();
    }
    this.setState({ visible: true });
  }

  @Bind()
  handleCloseModal() {
    this.setState({ visible: false });
  }

  @Bind()
  formReset() {
    const { form } = this.props;
    form.resetFields();
  }

  render() {
    const { dataSource = [], loading, pagination, onSearch, ...otherProps } = this.props;
    const { visible } = this.state;
    const columns = [
      {
        title: '历史表Id',
        width: 80,
        dataIndex: 'taskDocHisId',
      },
      {
        title: '任务单号',
        width: 140,
        dataIndex: 'docNum',
      },
      {
        title: '项目',
        width: 140,
        dataIndex: 'tagCode',
      },
      {
        title: '项目描述',
        dataIndex: 'tagDescription',
        width: 140,
      },
      {
        title: '数据类型',
        width: 100,
        dataIndex: 'valueTypeMeaning',
      },
      {
        title: '精度',
        width: 80,
        dataIndex: 'accuracy',
      },
      {
        title: '最小值',
        width: 80,
        dataIndex: 'minimumValue',
      },
      {
        title: '标准值',
        width: 80,
        dataIndex: 'standard',
      },
      {
        title: '最大值',
        width: 80,
        dataIndex: 'maximalValue',
      },
      {
        title: '单位',
        width: 80,
        dataIndex: 'uomName',
      },
      {
        title: '检验值',
        width: 80,
        dataIndex: 'checkValue',
      },
      {
        title: '结果',
        width: 80,
        dataIndex: 'result',
      },
      {
        title: '检验人',
        width: 80,
        dataIndex: 'checkByName',
      },
      {
        title: '检验时间',
        width: 180,
        dataIndex: 'checkDate',
      },
      {
        title: '检验工位',
        width: 100,
        dataIndex: 'workcellCode',
      },
      {
        title: '变更时间',
        width: 180,
        dataIndex: 'lastUpdateDate',
      },
      {
        title: '变更人',
        width: 100,
        dataIndex: 'lastUpdateByName',
      },
      {
        title: '事件id',
        width: 100,
        dataIndex: 'eventId',
      },
    ];
    return (
      <Fragment>
        <Button {...otherProps} style={{ marginRight: '12px'}} onClick={() => this.handleOpenModal()}>修改历史</Button>
        <Modal
          width={1100}
          title='修改历史'
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
            onChange={onSearch}
          />
        </Modal>
      </Fragment>
    );
  }
}
