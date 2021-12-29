/*
 * @Description: 其他工位
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-30 11:50:08
 */

import React, { PureComponent } from 'react';
import { Button, Form, Input, Modal, Table } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isFunction } from 'lodash';
import intl from 'utils/intl';

@Form.create({ fieldNameProp: null })
export default class OtherStationModal extends PureComponent {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {};
  }


  /**
   * 查询
   */
  @Bind()
  handleSearch(fields = {}) {
    const { onSearch, form } = this.props;
    if (onSearch) {
      form.validateFields(err => {
        if (!err) {
          // 如果验证成功,则执行onSearch
          onSearch(fields);
        }
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
  onCancel(){
    const {onCancel} = this.props;
    onCancel(false);
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      form: { getFieldDecorator },
      loading,
      visible,
      selectedRowKeys,
      dataSource,
      pagination,
      onOk,
      onSelectRows,
      updateUserLoading = false,
    } = this.props;
    const columns = [
      {
        title: '工位编码',
        dataIndex: 'workcellCode',
        width: 150,
      },
      {
        title: '工位名称',
        dataIndex: 'workcellName',
      },
    ];
    return (
      <Modal
        destroyOnClose
        title='其他工位'
        visible={visible}
        onOk={onOk}
        onCancel={()=>this.onCancel()}
        okText={intl.get('hzero.common.button.save').d('保存')}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
        width={700}
        confirmLoading={updateUserLoading}
      >
        <Form layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item label='工位编码'>
            {getFieldDecorator('workcellCode', {})(<Input />)}
          </Form.Item>
          <Form.Item label='工位名称'>
            {getFieldDecorator('workcellName', {})(<Input />)}
          </Form.Item>
          <Form.Item>
            <Button data-code="reset" onClick={this.handleFormReset}>
              {intl.get('hzero.common.status.reset').d('重置')}
            </Button>
            <Button
              data-code="search"
              type="primary"
              htmlType="submit"
              onClick={()=>this.handleSearch()}
              style={{ marginLeft: 8 }}
            >
              {intl.get('hzero.common.status.search').d('查询')}
            </Button>
          </Form.Item>
        </Form>
        <Table
          bordered
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          rowSelection={{
            selectedRowKeys,
            type: 'radio',
            onChange: onSelectRows,
          }}
          onChange={page => this.handleSearch(page)}
        />
      </Modal>
    );
  }
}
