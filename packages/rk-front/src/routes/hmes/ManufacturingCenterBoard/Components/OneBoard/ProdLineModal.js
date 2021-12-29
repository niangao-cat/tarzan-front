/**
 * 计划外投料
 * @date: 2020/07/15 19:25:36
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component, Fragment } from 'react';
import { Modal, Button, Table, Row, Form, Col, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isArray, isEmpty } from 'lodash';

import { filterNullValueObject } from 'utils/utils';
import styles from './index.less';

const formItemLayout = {
  labelCol: {
    sm: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 14 },
  },
};

@Form.create({ fieldNameProp: null })
export default class ESopModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
    };
  }

  @Bind()
  queryData(page) {
    const { form: { getFieldsValue }, onSearch, pagination } = this.props;
    const fields = getFieldsValue();
    const pageForm = isEmpty(page) ? pagination : page;
    if (onSearch) {
      onSearch(pageForm, filterNullValueObject(fields));
    }
  }

  @Bind()
  formReset() {
    const { form } = this.props;
    form.resetFields();
  }

  @Bind()
  handleChangeSelectRows(selectedRowKeys) {
    this.setState({ selectedRowKeys });
  }

  @Bind()
  handleCloseModal() {
    const { onCloseModal } = this.props;
    if (onCloseModal) {
      onCloseModal();
    }
  }

  @Bind()
  handleOk() {
    const { selectedRowKeys } = this.state;
    const { onFetchProdLineInfo } = this.props;
    const prodLineIds = !isArray(selectedRowKeys) ? null : selectedRowKeys.join(',');
    if (onFetchProdLineInfo && prodLineIds) {
      onFetchProdLineInfo(prodLineIds);
    }
  }

  render() {
    const { dataSource = [], loading, pagination, form: { getFieldDecorator }, visible } = this.props;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleChangeSelectRows,
    };
    const columns = [
      {
        title: '产线编码',
        width: 50,
        dataIndex: 'prodLineCode',
      },
      {
        title: '产险Id',
        width: 50,
        dataIndex: 'prodLineId',
      },
      {
        title: '产线描述',
        width: 50,
        dataIndex: 'prodLineName',
      },
    ];
    return (
      <Fragment>
        <Modal
          width={600}
          title='请选择产线'
          visible={visible}
          onCancel={this.handleCloseModal}
          onOk={this.handleOk}
        >
          <Form>
            <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'flex-start' }} className={styles['operationPlatform_search-form']}>
              <Row style={{ flex: 'auto' }}>
                <Col span={12}>
                  <Form.Item
                    label='产险编码'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('prodLineCode')(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='产线描述'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('prodLineName')(<Input />)}
                  </Form.Item>
                </Col>
              </Row>
              <div className="lov-modal-btn-container">
                <Button onClick={() => this.formReset()} style={{ marginRight: 8 }}>
                  重置
                </Button>
                <Button type="primary" htmlType="submit" onClick={() => this.queryData()}>
                  查询
                </Button>
              </div>
            </div>
          </Form>
          <Table
            bordered
            loading={loading}
            rowKey="prodLineId"
            dataSource={dataSource}
            columns={columns}
            pagination={pagination}
            rowSelection={rowSelection}
            onChange={this.queryData}
          />
        </Modal>
      </Fragment>
    );
  }
}
