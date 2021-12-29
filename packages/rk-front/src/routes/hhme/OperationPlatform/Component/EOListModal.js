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

import intl from 'utils/intl';
import Lov from 'components/Lov';
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
export default class LocationInfoModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }


  @Bind()
  handleOpenModal() {
    const { onFetchEOList } = this.props;
    if(onFetchEOList) {
      onFetchEOList();
    }
    this.setState({ visible: true });
  }

  @Bind()
  handleCloseModal() {
    this.setState({ visible: false });
  }

  @Bind()
  queryData(page = {}) {
    const { form: { getFieldsValue, getFieldValue }, onFetchEOList, siteId, tenantId } = this.props;
    const fields = getFieldsValue();
    if(onFetchEOList) {
      onFetchEOList(page, {
        siteId,
        tenantId,
        workOrderId: getFieldValue('workOrderId'),
        ...filterNullValueObject(fields),
      });
    }
  }

  @Bind()
  formReset() {
    const { form } = this.props;
    form.resetFields();
  }

  render() {
    const { dataSource = [], loading, pagination, form: { getFieldDecorator }, tenantId, ...otherProps } = this.props;
    const { visible } = this.state;
    const columns = [
      {
        title: '条码',
        width: 50,
        dataIndex: 'identification',
      },
      {
        title: '工单号',
        width: 50,
        dataIndex: 'workOrderNum',
      },
      {
        title: '进站时间',
        width: 50,
        dataIndex: 'siteInDate',
      },
      {
        title: '工艺路线',
        dataIndex: 'routerName',
        width: 50,
      },
      {
        title: '装配清单',
        width: 60,
        dataIndex: 'bomName',
      },
    ];
    return (
      <Fragment>
        <Button {...otherProps} onClick={() => this.handleOpenModal()}>EO列表</Button>
        <Modal
          width={1100}
          title='工位未出站EO列表'
          visible={visible}
          onCancel={this.handleCloseModal}
          footer={null}
        >
          <Form>
            <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'flex-start' }} className={styles['operationPlatform_search-form']}>
              <Row style={{ flex: 'auto' }}>
                <Col span={12}>
                  <Form.Item
                    label='条码'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('identification')(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='工单'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('workOrderNum')(
                      <Input />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='工艺路线'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('routerId')(<Lov code="MT.ROUTER" queryParams={{ tenantId }} />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='装配清单'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('bomName')(<Input />)}
                  </Form.Item>
                </Col>
              </Row>
              <div className="lov-modal-btn-container">
                <Button onClick={() => this.formReset()} style={{ marginRight: 8 }}>
                  {intl.get('hzero.common.button.reset').d('重置')}
                </Button>
                <Button type="primary" htmlType="submit" onClick={() => this.queryData()}>
                  {intl.get('hzero.common.button.search').d('查询')}
                </Button>
              </div>
            </div>
          </Form>
          <Table
            bordered
            loading={loading}
            rowKey="eoId"
            dataSource={dataSource}
            columns={columns}
            pagination={pagination}
            onChange={page => this.queryData(page)}
          />
        </Modal>
      </Fragment>
    );
  }
}
