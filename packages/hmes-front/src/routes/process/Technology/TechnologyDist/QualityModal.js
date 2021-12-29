import React, { PureComponent } from 'react';
import { Button, Form, Input, Modal, Table, Row, Col, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';

/**
 * 用户信息查询
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {string} title - Modal标题
 * @reactProps {boolean} visible - 可见性
 * @reactProps {Function} onOk - 确定操作
 * @reactProps {Function} onCancel - 取消操作
 * @reactProps {object[]} dataSource - 岗位信息
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
export default class UserModal extends PureComponent {
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

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      form: { getFieldDecorator },
      visible,
      selectedModalRowKeys,
      onCancel,
      onOk,
      onChange,
      updateUserLoading = false,
      qualityList,
      qualityPagination,
      fetchQualityLoading,
      qualityType = [],
    } = this.props;
    const columns = [
      {
        title: '资质类型',
        dataIndex: 'qualityTypeMeaning',
        width: 150,
      },
      {
        title: '资质编码',
        dataIndex: 'qualityCode',
      },
      {
        title: '资质名称',
        dataIndex: 'qualityName',
      },
      {
        title: '资质备注',
        dataIndex: 'remark',
      },
    ];
    return (
      <Modal
        destroyOnClose
        title='资质信息查询'
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        okText={intl.get('hzero.common.button.save').d('保存')}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
        width={700}
        confirmLoading={updateUserLoading}
      >
        <Form className={SEARCH_FORM_CLASSNAME}>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item label="资质类型" {...SEARCH_FORM_ITEM_LAYOUT}>
                {getFieldDecorator('qualityType', {})(
                  <Select allowClear style={{ width: '100%' }}>
                    {qualityType.map(item => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.meaning}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item label="资质编码" {...SEARCH_FORM_ITEM_LAYOUT}>
                {getFieldDecorator('qualityCode', {})(<Input trim />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item label="资质名称" {...SEARCH_FORM_ITEM_LAYOUT}>
                {getFieldDecorator('qualityName', {})(<Input trim />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
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
          loading={fetchQualityLoading}
          columns={columns}
          dataSource={qualityList}
          pagination={qualityPagination}
          rowSelection={{
            selectedModalRowKeys,
            onChange,
          }}
          onChange={page => this.handleSearch(page)}
        />
      </Modal>
    );
  }
}
