/**
 * 计划外投料
 * @date: 2020/07/15 19:25:36
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { Modal, Table, Row, Col, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

// import { tableScrollWidth } from 'utils/utils';

import styles from '../../Component/index.less';

export default class SnModal extends Component {

  @Bind()
  handleClickSelectedRows(record) {
    return {
      onClick: () => {
        const { onFetchBaseInfo, onInitData } = this.props;
        if(onInitData) {
          onInitData(false);
        }
        onFetchBaseInfo(record);
      },
    };
  }

  @Bind()
  handleClickRow(record) {
    const { baseInfo } = this.props;
    if (baseInfo.snNum === record.snNum) {
      return styles['data-click'];
    } else {
      return '';
    }
  }

  @Bind()
  handleCloseModal() {
    const { onCloseModal } = this.props;
    if(onCloseModal) {
      onCloseModal();
    }
  }

  @Bind()
  handleScanSn(e) {
    const snNum = e.target.value;
    const { onScanAndSelectSn } = this.props;
    if(onScanAndSelectSn) {
      onScanAndSelectSn(snNum);
    }
  }

  render() {
    const { dataSource = [], visible, rowSelection } = this.props;
    const columns = [
      {
        title: '条码',
        width: 40,
        dataIndex: 'snNum',
        align: 'center',
      },
      {
        title: '工单号',
        width: 40,
        dataIndex: 'workOrderNum',
        align: 'center',
      },
      // {
      //   title: '序列号',
      //   width: 20,
      //   dataIndex: 'material',
      //   align: 'center',
      //   render: (val, record) => (
      //     `${record.usedMaterial}/${record.sumMaterial}`
      //   ),
      // },
      // {
      //   title: '数据',
      //   width: 20,
      //   dataIndex: 'dataRecord',
      //   align: 'center',
      //   render: (val, record) => (
      //     `${record.usedDataRecord}/${record.sumDataRecord}`
      //   ),
      // },
      // {
      //   title: '自检',
      //   width: 20,
      //   dataIndex: 'selfCheck',
      //   align: 'center',
      //   render: (val, record) => (
      //     `${record.usedSelfCheck}/${record.sumSelfCheck}`
      //   ),
      // },
      // {
      //   title: '计时',
      //   width: 30,
      //   dataIndex: 'timing',
      //   align: 'center',
      // },
      {
        title: '进站时间',
        width: 50,
        dataIndex: 'siteInDate',
        align: 'center',
      },
      {
        title: '投料器具',
        width: 50,
        dataIndex: 'sourceContainerCode',
        align: 'center',
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={800}
        title="sn列表"
        visible={visible}
        onCancel={this.handleCloseModal}
        footer={null}
      >
        <Row>
          <Col span={8}>
            <Input style={{ width: '100%', marginBottom: '10px' }} className="operationPlatform_sn-modal-input" onPressEnter={this.handleScanSn} />
          </Col>
        </Row>
        <div className={styles['head-table']}>
          <Table
            bordered
            loading={false}
            rowKey="jobId"
            dataSource={dataSource}
            rowSelection={rowSelection}
            columns={columns}
            pagination={false}
            onRow={this.handleClickSelectedRows}
            rowClassName={this.handleClickRow}
            scroll={{ y: 500 }}
          />
        </div>
      </Modal>
    );
  }
}
