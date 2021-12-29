/*
 * @Description: 更新条码
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-09-22 15:39:44
 * @LastEditTime: 2020-10-11 14:52:37
 */

import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Icon, Button } from 'hzero-ui';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import { Bind } from 'lodash-decorators';
import { isFunction } from 'lodash';
import EditTable from 'components/EditTable';
@Form.create({ fieldNameProp: null })
export default class UpdateCodeDrawer extends Component {

  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
    };
  }

  @Bind()
  onEnterDown(e) {
    const { form, updateMaterialVersion } = this.props;
    if (e.keyCode === 13) {
      updateMaterialVersion(form.getFieldValue('materialVersion'));
    }
  }

  // 条码回车
  @Bind()
  onEnterDownCode(e) {
    const { form, onEnterDownCode } = this.props;
    if (e.keyCode === 13) {
      onEnterDownCode(form.getFieldValue('materialLotCode'));
      form.resetFields(['materialLotCode']);
    }
  }

  // 供应商批次回车
  @Bind()
  onEnterDownSupplierLot(e) {
    const { onSearch } = this.props;
    if (e.keyCode === 13) {
      onSearch();
    }
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const {
      expandDrawer,
      updateBarCode,
      dataSource,
      pagination,
      onSearch,
      fetchMaterialLotCodeLoading,
      updateMaterialLotCodeLoading,
      updateMaterialLotCode,
      form,
      selectedRowKeys,
      handleSelect,
    } = this.props;
    const { getFieldDecorator } = form;
    // 获取表单的字段属性
    const columns = [
      {
        title: '条码',
        dataIndex: 'materialLotCode',
        width: 120,
      },
      {
        title: '数量',
        dataIndex: 'primaryUomQty',
        width: 90,
      },
      {
        title: '供应商批次',
        dataIndex: 'supplierLot',
        width: 100,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) && !val ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`supplierLot`, {
                initialValue: val,
              })(
                <Input disabled={val} />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '批次',
        dataIndex: 'lot',
        width: 100,
      },
      {
        title: '版本',
        dataIndex: `materialVersion`,
        width: 120,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialVersion`, {
                initialValue: val,
              })(
                <Input />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
    ];
    // 获取表单的字段属性
    return (
      <Modal
        destroyOnClose
        width={1000}
        onCancel={() => updateBarCode(false)}
        onOk={() => updateMaterialLotCode()}
        visible={expandDrawer}
        footer={null}
        confirmLoading={updateMaterialLotCodeLoading}
        title="更新条码"
      >
        <Form className={SEARCH_FORM_CLASSNAME}>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col span={12}>
              <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 10 }} label='条码'>
                {getFieldDecorator('materialLotCode', {
                })(
                  <Input suffix={<Icon type="enter" />} onKeyDown={this.onEnterDownCode} />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 10 }} label='物料版本'>
                {getFieldDecorator('materialVersion', {
                })(
                  <Input suffix={<Icon type="enter" />} onKeyDown={this.onEnterDown} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col span={12}>
              <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 10 }} label='供应商批次'>
                {getFieldDecorator('supplierLot', {
                })(
                  <Input suffix={<Icon type="enter" />} onKeyDown={this.onEnterDownSupplierLot} />
                )}
              </Form.Item>
            </Col>
            <Col span={12} style={{ textAlign: 'end' }}>
              <Form.Item>
                <Button icon='save' onClick={() => updateMaterialLotCode()} type="primary">
                  保存
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <EditTable
          rowKey="materialLotId"
          loading={fetchMaterialLotCodeLoading}
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          onChange={page => onSearch(page)}
          bordered
          rowSelection={{
            selectedRowKeys,
            onChange: handleSelect,
          }}
        />
      </Modal>
    );
  }
}
