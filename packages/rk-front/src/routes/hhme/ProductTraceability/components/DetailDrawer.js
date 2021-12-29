/*
 * @Description: 明细
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-15 16:07:03
 * @LastEditTime: 2020-07-16 11:18:10
 */

import React, { Component } from 'react';
import { Form, Modal, Table } from 'hzero-ui';
import styles from '../index.less';

@Form.create({ fieldNameProp: null })
export default class BadInfoDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const { loading, visible, onCancel, dataSource = [] } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'orderSeq',
        align: 'center',
        render: (val, record, index) => index + 1,
      },
      {
        title: '检验项目',
        dataIndex: 'tagCode',
        align: 'center',
      },
      {
        title: '检验项目描述',
        dataIndex: 'tagDescription',
        align: 'center',
      },
      {
        title: '检验结果',
        dataIndex: 'result',
        align: 'center',
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={900}
        title="SN质量文件采集数据"
        visible={visible}
        onCancel={() => onCancel()}
        footer={null}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <div className={styles['productt-raceability-table']}>
          <Table
            columns={columns}
            bordered
            dataSource={dataSource}
            loading={loading}
            pagination={false}
          />
        </div>
      </Modal>
    );
  }
}