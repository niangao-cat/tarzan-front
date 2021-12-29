/*
 * @Description: 明细界面
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-08 15:07:32
 * @LastEditTime: 2021-02-08 15:32:19
 */

import React, { Component } from 'react';
import { Modal, Form, Table} from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';

@Form.create({ fieldNameProp: null })
export default class DetailDrawer extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() { }

  @Bind()
  handleOK() {
    const { form, onOk } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        if (fieldsValue.materialCategoryId === undefined && fieldsValue.materialId === undefined) {
          notification.error({ message: '物料类别与物料至少输入一项!' });
        } else {
          onOk(fieldsValue);
        }
      }
    });
  }

  /**
   * 传递表单对象(传递子组件对象form，给父组件用)
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const {
      visible,
      onCancel,
      dataSource,
      pagination,
      loading,
      handleSearch,
    } = this.props;
    const columns = [
      {
        title: 'SN号',
        width: 100,
        dataIndex: 'materialLotCode',
      },
      {
        title: '检验组',
        width: 100,
        dataIndex: 'tagGroupDescription',
      },
      {
        title: '检验项',
        width: 100,
        dataIndex: 'tagDescription',
      },
      {
        title: '最大值',
        width: 100,
        dataIndex: 'maximalValue',
      },
      {
        title: '最小值',
        width: 100,
        dataIndex: 'minimumValue',
      },
      {
        title: '结果',
        width: 100,
        dataIndex: 'result',
      },
      {
        title: '检验员',
        width: 100,
        dataIndex: 'inspectorName',
      },
      {
        title: '检验时间',
        width: 100,
        dataIndex: 'inspectionDate',
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={1100}
        title="明细界面"
        visible={visible}
        onCancel={() => onCancel({}, false)}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        footer={null}
      >
        <Table
          dataSource={dataSource}
          columns={columns}
          bordered
          pagination={pagination}
          onChange={page => handleSearch(page)}
          loading={loading}
        />
      </Modal>
    );
  }
}
