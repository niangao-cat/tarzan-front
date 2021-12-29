/*
 * @Description: 实际投产/实际完工
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-12-15 16:20:00
 * @LastEditTime: 2021-01-13 09:54:23
 */

import React, { PureComponent } from 'react';
import { Modal, Form, Row, Col } from 'hzero-ui';
import EditTable from 'components/EditTable';
import {
  SEARCH_FORM_ROW_LAYOUT,
  FORM_COL_3_LAYOUT,
} from 'utils/constants';
import { Bind } from 'lodash-decorators';

const formLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

@Form.create({ fieldNameProp: null })
export default class AeliveryFinishDrawer extends PureComponent {
  form;

  constructor(props) {
    super(props);
    this.state = {};
  }

  @Bind()
  onSearch(page) {
    const { type, fetchFinish, fetchAelivery } = this.props;
    if (type === 'FINISH') {
      fetchFinish(page);
    }
    if (type === 'AELIVERY') {
      fetchAelivery(page);
    }
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const {
      expandDrawer,
      onCancel,
      dataSource,
      pagination,
      loading,
      type,
      record,
      prodLine,
    } = this.props;
    const columns = [
      {
        title: '工单号',
        dataIndex: 'workOrderNum',
        width: 150,
      },
      {
        title: '物料编码',
        width: 100,
        dataIndex: 'materialCode',
      },
      {
        title: 'EO编码',
        width: 100,
        dataIndex: 'eoNum',
      },
      {
        title: 'SN',
        width: 100,
        dataIndex: 'eoIdentification',
      },
      {
        title: 'EO创建时间',
        width: 130,
        dataIndex: 'eoCreationDate',
      },
      {
        title: 'EO状态',
        width: 90,
        dataIndex: 'eoStatusDescription',
      },
    ];
    // 实际投产
    const columnsIn = [
      {
        title: '投产时间',
        dataIndex: 'siteInDate',
        width: 150,
      },
      {
        title: '投产人',
        width: 100,
        dataIndex: 'snCreatedByName',
      },
    ];
    // 实际完工
    const columnsFinsh = [
      {
        title: '交付时间',
        dataIndex: 'siteInDate',
        width: 150,
      },
      {
        title: '交付人',
        width: 100,
        dataIndex: 'snCreatedByName',
      },
    ];
    return (
      <Modal
        title={type === 'FINISH' ? '实际交付' : '实际投产'}
        confirmLoading={false}
        width={1200}
        visible={expandDrawer}
        onCancel={() => onCancel('', false, {})}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        footer={null}
      >
        <Form>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...formLayout}
                label='工段编码'
              >
                {prodLine}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...formLayout}
                label='投产日期'
              >
                {record.dataTime}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...formLayout}
                label='班次'
              >
                {record.shiftCode}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <EditTable
          loading={loading}
          rowKey="instructionId"
          dataSource={dataSource}
          columns={columns.concat(type === 'FINISH' ? columnsFinsh : columnsIn)}
          pagination={pagination}
          onChange={page => this.onSearch(page)}
          footer={null}
          bordered
        />
      </Modal>
    );
  }
}
