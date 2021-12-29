/**
 * 计划外投料
 * @date: 2020/07/15 19:25:36
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component, Fragment } from 'react';
import { Modal, Button, Table, Row, Form, Col, Input, Select } from 'hzero-ui';
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

const { Option } = Select;

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
    // const { onFetchLocationInfo } = this.props;
    // if(onFetchLocationInfo) {
    //   onFetchLocationInfo();
    // }
    this.setState({ visible: true });
  }

  @Bind()
  handleCloseModal() {
    this.setState({ visible: false });
  }

  @Bind()
  queryData(page = {}) {
    const { form: { getFieldsValue, getFieldValue }, onFetchLocationInfo, siteId, tenantId } = this.props;
    const fields = getFieldsValue();
    if(onFetchLocationInfo) {
      onFetchLocationInfo(page, {
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
    const { dataSource = [], loading, pagination, form: { getFieldDecorator }, locatorTypeList, workCellInfo, ...otherProps } = this.props;
    const { visible } = this.state;
    const columns = [
      {
        title: '物料编码',
        width: 50,
        dataIndex: 'materialCode',
      },
      {
        title: '物料描述',
        width: 50,
        dataIndex: 'materialName',
      },
      {
        title: '仓库编码',
        width: 50,
        dataIndex: 'warehouseCode',
      },
      {
        title: '仓库描述',
        dataIndex: 'warehouseName',
        width: 50,
      },
      {
        title: '库位编码',
        width: 60,
        dataIndex: 'locatorCode',
      },
      {
        title: '库位描述',
        width: 40,
        dataIndex: 'locatorName',
      },
      {
        title: '库存',
        width: 30,
        dataIndex: 'onhandQuantity',
      },
      {
        title: '单位',
        width: 30,
        dataIndex: 'uomName',
      },
      {
        title: '批次',
        width: 40,
        dataIndex: 'lotCode',
        align: 'center',
      },
    ];
    return (
      <Fragment>
        <Button {...otherProps} onClick={() => this.handleOpenModal()}>库存信息</Button>
        <Modal
          width={1100}
          title='库位信息'
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
                    {getFieldDecorator('materialCode')(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='库位'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('locatorId')(
                      <Lov
                        code="HME.ONHAND_LOCATOR"
                        queryParams={{ workcellId: workCellInfo.workcellId }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='批次'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('lotCode')(<Input onPressEnter={this.queryData} />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='库位类型'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('locatorTypeList', {
                      rules: [
                        {
                          required: true,
                          message: '库位类型不能为空',
                        },
                      ],
                    })(
                      <Select mode="multiple">
                        {locatorTypeList.map(e => (
                          <Option key={e.value} value={e.value}>
                            {e.meaning}
                          </Option>
                      ))}
                      </Select>
                    )}
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
