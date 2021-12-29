/**
 * 计划外投料
 * @date: 2020/07/15 19:25:36
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component, Fragment } from 'react';
import { Modal, Button, Table, Row, Form, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import Lov from 'components/Lov';
import { filterNullValueObject } from 'utils/utils';

import { isEmpty } from 'lodash';
import styles from '../index.less';

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
      visible: false,
    };
  }


  @Bind()
  handleOpenModal() {
    const { onFetchESopList } = this.props;
    if(onFetchESopList) {
      onFetchESopList();
    }
    this.setState({ visible: true });
  }

  @Bind()
  handleCloseModal() {
    this.setState({ visible: false });
  }

  @Bind()
  queryData(page) {
    const { form: { getFieldsValue, getFieldValue }, onFetchESopList, siteId, tenantId, pagination } = this.props;
    const fields = getFieldsValue();
    const pageForm = isEmpty(page) ? pagination : page;
    if(onFetchESopList) {
      onFetchESopList(pageForm, {
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

  @Bind()
  handleOpenNewWeb(val) {
    window.open(val);
  }

  render() {
    const { dataSource = [], loading, pagination, form: { getFieldDecorator }, locatorTypeList, workCellInfo, tenantId, ...otherProps } = this.props;
    const { visible } = this.state;
    const columns = [
      {
        title: '物料编码',
        width: 50,
        dataIndex: 'materialCode',
      },
      {
        title: '物料版本',
        width: 50,
        dataIndex: 'materialVersion',
      },
      {
        title: '物料类别',
        width: 50,
        dataIndex: 'itemGroupDescription',
      },
      {
        title: '工艺编码',
        dataIndex: 'operationName',
        width: 50,
      },
      {
        title: '作业指导书',
        width: 60,
        dataIndex: 'fileUrl',
        render: (val, record) => (
          <div>
            {record.attachmentCode}
            <a onClick={() => this.handleOpenNewWeb(val)} style={{ marginLeft: '12px' }}>预览/下载</a>
          </div>
        ),
      },
    ];
    return (
      <Fragment>
        <Button {...otherProps} onClick={() => this.handleOpenModal()}>E-SOP</Button>
        <Modal
          width={1100}
          title='作业指导书'
          visible={visible}
          onCancel={this.handleCloseModal}
          footer={null}
        >
          <Form>
            <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'flex-start' }} className={styles['operationPlatform_search-form']}>
              <Row style={{ flex: 'auto' }}>
                <Col span={12}>
                  <Form.Item
                    label='物料编码'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('materialId')(<Lov code="MT.MATERIAL" queryParams={{ tenantId }} />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='物料版本'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('materialVersion')(<Lov code="HME.MATERIAL_VERSION" queryParams={{ tenantId }} />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='物料类别'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('materialGroup')(<Lov code="WMS.ITEM_GROUP" queryParams={{ tenantId }} />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='工艺编码'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('operationName')(<Lov code="MT.OPERATION" queryParams={{ tenantId }} />)}
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
            onChange={this.queryData}
          />
        </Modal>
      </Fragment>
    );
  }
}
