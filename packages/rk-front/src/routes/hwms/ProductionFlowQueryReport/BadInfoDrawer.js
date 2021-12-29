/*
 * @Description: 不良信息模态框
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-15 16:07:03
 * @LastEditTime: 2020-07-16 11:18:10
 */

import React, { Component } from 'react';
import { Form, Modal, Table } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import styles from './index.less';

@Form.create({ fieldNameProp: null })
export default class BadInfoDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  @Bind()
  handleOK() {
    const { form, onOk } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        onOk(fieldsValue);
      }
    });
  }


  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const { loading, visible, onCancel, dataSource = [] } = this.props;
    const columns = [
      {
        title: '发现工位',
        width: 90,
        dataIndex: 'foundWorkcellName',
        align: 'center',
      },
      {
        title: '责任工位',
        width: 90,
        dataIndex: 'responsedWorkcellName',
        align: 'center',
      },
      {
        title: '不良分类',
        width: 90,
        dataIndex: 'ncTypeMeaning',
        align: 'center',
      },
      {
        title: '不良类型',
        width: 90,
        dataIndex: 'description',
        align: 'center',
      },
      {
        title: '不良代码',
        width: 90,
        dataIndex: 'ncCode',
        align: 'center',
      },
      {
        title: '不良状态',
        width: 90,
        dataIndex: 'ncStatusMeaning',
        align: 'center',
      },
      {
        title: '不良物料条码',
        width: 110,
        dataIndex: 'materialLotCode',
        align: 'center',
      },
      {
        title: '不良物料编码',
        width: 110,
        dataIndex: 'materialName',
        align: 'center',
      },
      {
        title: '提交备注',
        width: 80,
        dataIndex: 'comments',
        align: 'center',
      },
      {
        title: '处理方式',
        width: 90,
        dataIndex: 'processMethodMeaning',
        align: 'center',
      },
      {
        title: '处理备注',
        width: 90,
        dataIndex: 'disposeOpinion',
        align: 'center',
      },
      {
        title: '记录人',
        width: 80,
        dataIndex: 'userName',
        align: 'center',
      },
      {
        title: '记录时间',
        width: 90,
        dataIndex: 'dateTime',
        align: 'center',
      },
      {
        title: '处理人',
        width: 80,
        dataIndex: 'closedUserName',
        align: 'center',
      },
      {
        title: '处理时间',
        width: 90,
        dataIndex: 'closedDateTime',
        align: 'center',
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={900}
        title="不良信息"
        visible={visible}
        onCancel={() => onCancel(false)}
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
