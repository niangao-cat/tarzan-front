/*
 * @Description: 抽屉
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-12 17:02:25
 * @LastEditTime: 2020-10-06 11:40:16
 */
import React, { Component } from 'react';
import { Form, Table, Modal } from 'hzero-ui';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { connect } from 'dva';

@connect(({ productTraceability }) => ({
  productTraceability,
}))
@Form.create({ fieldNameProp: null })
export default class ReverseDrawer extends Component {

  @Bind()
  handleOK() {
    const { form, onOk } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        const productDate = moment(fieldsValue.productDate).format(DEFAULT_DATETIME_FORMAT);
        const tempObj = {
          ...fieldsValue,
          productDate,
        };
        onOk(tempObj);
      }
    });
  }


  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const {
      loading,
      handleSearch,
      onCancel,
      visible,
      dataSource,
      pagination,
      onSearch,
    } = this.props;
    const columns = [
      {
        title: '物料序列号',
        dataIndex: 'materialLotCode',
      },
      {
        title: '工单编码',
        dataIndex: 'workOrderNum',
      },
      {
        title: 'EO编码',
        dataIndex: 'eoNum',
      },
      {
        title: '投料时SN',
        dataIndex: 'feedSn',
        render: (val) => (
          <a className="action-link" onClick={() => handleSearch(val)}>
            {val}
          </a>
        ),
      },
      {
        title: '当前SN',
        dataIndex: 'currentSn',
        render: (val) => (
          <a className="action-link" onClick={() => handleSearch(val)}>
            {val}
          </a>
        ),
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={800}
        title='逆向追溯'
        visible={visible}
        okText={intl.get('hzero.common.button.sure').d('确认')}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
        onCancel={() => onCancel()}
        onOk={this.handleOK}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        footer={false}
      >
        <Table
          bordered
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          loading={loading}
          onChange={page => onSearch(page)}
        />
      </Modal>
    );
  }
}
