/*
 * @Description: 分配线Lov
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-09 10:11:46
 */

import React, { PureComponent } from 'react';
import { Button, Form, Input, Modal, Table, Row, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_3_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';

@Form.create({ fieldNameProp: null })
export default class DistributionLineModal extends PureComponent {
  /**
   * 查询
   */
  @Bind()
  handleSearch(fields = {}) {
    const { onSearch, form } = this.props;
    const fieldValues = form.getFieldsValue();
    if (onSearch) {
      form.validateFields(err => {
        if (!err) {
          // 如果验证成功,则执行onSearch
          onSearch({ ...fieldValues, page: fields });
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
      visible,
      selectedRowKeys,
      onOk,
      onSelectRow,
      dataSource,
      pagination,
      loading,
    } = this.props;
    const columns = [
      {
        title: '编码',
        dataIndex: 'prodLineCode',
        width: 150,
      },
      {
        title: '描述',
        dataIndex: 'prodLineName',
      },
    ];
    return (
      <Modal
        destroyOnClose
        title='产线查询'
        visible={visible}
        onOk={onOk}
        onCancel={this.onCancel}
        okText={intl.get('hzero.common.button.save').d('保存')}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
        width={700}
      >
        <Form className={SEARCH_FORM_CLASSNAME}>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item label="编码" {...SEARCH_FORM_ITEM_LAYOUT}>
                {getFieldDecorator('prodLineCode', {})(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item label="描述" {...SEARCH_FORM_ITEM_LAYOUT}>
                {getFieldDecorator('prodLineName', {})(<Input trim />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT} className={SEARCH_COL_CLASSNAME}>
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
            </Col>
          </Row>
        </Form>
        <Table
          bordered
          rowKey="id"
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          loading={loading}
          rowSelection={{
            selectedRowKeys,
            type: 'radio',
            onChange: onSelectRow,
          }}
          onChange={page => this.handleSearch(page)}
        />
      </Modal>
    );
  }
}
