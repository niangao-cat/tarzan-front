/*
 * @Description: 更新条码
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-09-22 15:39:44
 * @LastEditTime: 2020-09-22 22:59:05
 */

import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Icon } from 'hzero-ui';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import { Bind } from 'lodash-decorators';
import EditTable from 'components/EditTable';
@Form.create({ fieldNameProp: null })
export default class UpdateCodeDrawer extends Component {

  constructor(props) {
    super(props);
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
        dataIndex: `primaryUomQty`,
        width: 120,
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
        width={600}
        onCancel={() => updateBarCode(false)}
        onOk={() => updateMaterialLotCode()}
        visible={expandDrawer}
        confirmLoading={updateMaterialLotCodeLoading}
        title="检验组维护"
      >
        <Form className={SEARCH_FORM_CLASSNAME}>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col>
              <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 10 }} label='物料版本'>
                {getFieldDecorator('materialVersion', {
                })(
                  <Input suffix={<Icon type="enter" />} onKeyDown={this.onEnterDown} />
                )}
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
            selectedRowKey: selectedRowKeys,
            onChange: handleSelect,
          }}
        />
      </Modal>
    );
  }
}
