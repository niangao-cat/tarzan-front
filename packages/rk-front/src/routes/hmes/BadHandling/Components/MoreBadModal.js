/*
 * @Description: 更多不良类型
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-30 11:50:08
 */

import React, { PureComponent } from 'react';
import { Form, Modal, Table, Button, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';

@connect(({ badHandling, loading }) => ({
  badHandling,
  loading,
}))
@Form.create({ fieldNameProp: null })
export default class MoreBadModal extends PureComponent {

  componentDidMount() {
    const { type, dispatch, initData } = this.props;
    // 工序
    if (type === 'PROCESS') {
      dispatch({
        type: 'badHandling/fetchProcessBadType',
        payload: {
          workcellId: initData.processId,
        },
      });
    }
    // 物料
    if (type === 'MATERIAL') {
      dispatch({
        type: 'badHandling/fetchMaterialBadType',
        payload: {
          workcellId: initData.processId,
        },
      });
    }
  }

  /**
   * 查询
   */
  @Bind()
  handleSearch(fields = {}) {
    const { dispatch, type, initData, form } = this.props;
    const fieldValues = form.getFieldsValue();
    if (type === 'PROCESS') {
      dispatch({
        type: 'badHandling/fetchProcessBadType',
        payload: {
          description: fieldValues.description,
          workcellId: initData.processId,
          page: isEmpty(fields) ? {} : fields,
        },
      });
    }
    // 物料
    if (type === 'MATERIAL') {
      dispatch({
        type: 'badHandling/fetchMaterialBadType',
        payload: {
          workcellId: initData.processId,
          page: isEmpty(fields) ? {} : fields,
        },
      });
    }
  }

  /**
   * 重置
   */
  @Bind()
  handleFormReset() {
    this.props.form.resetFields();
  }

  @Bind()
  onCancel() {
    const { onCancel } = this.props;
    const { type } = this.props;
    onCancel(false, type);
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      visible,
      selectedProRowKeys,
      selectedMatRowKeys,
      type,
      dataSource = [],
      pagination,
      onOk,
      onSelectRows,
      updateUserLoading = false,
      form,
    } = this.props;
    const columns = [
      {
        title: '不良代码组',
        dataIndex: 'description',
      },
    ];
    const { getFieldDecorator } = form;
    return (
      <Modal
        destroyOnClose
        title='不良代码组'
        visible={visible}
        onOk={onOk}
        onCancel={() => this.onCancel()}
        okText={intl.get('hzero.common.button.save').d('保存')}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
        width={700}
        confirmLoading={updateUserLoading}
      >
        <Form layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item label='不良代码组'>
            {getFieldDecorator('description', {})(<Input />)}
          </Form.Item>
          <Form.Item>
            <Button data-code="reset" onClick={this.handleFormReset}>
              {intl.get('hzero.common.status.reset').d('重置')}
            </Button>
            <Button
              data-code="search"
              type="primary"
              htmlType="submit"
              onClick={() => this.handleSearch()}
              style={{ marginLeft: 8 }}
            >
              {intl.get('hzero.common.status.search').d('查询')}
            </Button>
          </Form.Item>
        </Form>
        <Table
          bordered
          rowKey="id"
          // loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          rowSelection={{
            selectedRowKeys: type === 'PROCESS' ? selectedProRowKeys : selectedMatRowKeys,
            type: 'radio',
            onChange: onSelectRows,
          }}
          onChange={page => this.handleSearch(page)}
        />
      </Modal>
    );
  }
}
