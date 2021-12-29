/*
 * @Description: 行组件明细
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-09 11:45:54
 */

import React, { Component } from 'react';
import { Modal, Form, Input, Col, Row, Button } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId } from 'utils/utils';
import EditTable from 'components/EditTable';
import intl from 'utils/intl';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';

@connect(({ purchaseOrder, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  purchaseOrder,
  loading: {
    detailLoading: loading.effects['purchaseReturn/queryLineDetailList'],
  },
}))
@Form.create({ fieldNameProp: null })
export default class LineDetailDrawer extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    // 获取明显信息
    const { dispatch, instructionId } = this.props;
    dispatch({
      type: "purchaseOrder/fetchDetailData",
      payload: {
        instructionId,
      },
    });
  }

  @Bind()
  handleOK() {
    const { form, onOk } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        onOk(fieldsValue);
      }
    });
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const columns = [
      {
        title: '行号',
        dataIndex: 'lineNum',
        width: 100,
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 100,
      },
      {
        title: '物料描述',
        dataIndex: 'materialName',
        width: 100,
      },
      {
        title: '物料版本',
        dataIndex: 'materialVersion',
        width: 100,
      },
      {
        title: '制单数量',
        dataIndex: `quantity`,
        width: 100,
      },
      {
        title: 'BOM用量',
        dataIndex: `bomUsuage`,
        width: 100,
      },
      {
        title: '已制单数量',
        dataIndex: `quantityOrdered`,
        width: 100,
      },
      {
        title: '单位',
        dataIndex: 'uomCode',
        width: 100,
      },
    ];
    const { onCancel, lineDetailfFlag, form, purchaseOrder: { lineData= {}, detailList= []} } = this.props;
    const { getFieldDecorator } = form;
    const modelPromt = 'tarzan.hmes.purchaseOrder';
    return (
      <Modal
        destroyOnClose
        width={850}
        title="组件明细"
        visible={lineDetailfFlag}
        onCancel={onCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        onOk={this.handleOK}
        footer={[
          <Button key="back" onClick={()=>onCancel()}>
            关闭
          </Button>,
        ]}
      >
        <Form className={SEARCH_FORM_CLASSNAME}>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                label={intl.get(`${modelPromt}.plantCode`).d('订单编号')}
                {...SEARCH_FORM_ITEM_LAYOUT}
              >
                {getFieldDecorator('instructionDocNum', {
                  initialValue: lineData.instructionDocNum,
                })(<Input disabled trim />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPromt}.materialCode`).d('物料编码')}
              >
                {getFieldDecorator('materialCode', {
                   initialValue: lineData.materialCode,
                })(<Input disabled trim />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="制单数量">
                {getFieldDecorator('quantity', {
                  initialValue: lineData.quantity,
                })(<Input disabled trim />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                label={intl.get(`${modelPromt}.lineNum`).d('订单行号')}
                {...SEARCH_FORM_ITEM_LAYOUT}
              >
                {getFieldDecorator('lineNum', {
                  initialValue: lineData.lineNum,
                })(<Input disabled trim />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPromt}.materialName`).d('物料描述')}
              >
                {getFieldDecorator('materialName', {
                  initialValue: lineData.materialName,
                })(<Input disabled trim />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="单位">
                {getFieldDecorator('uomCode', {
                  initialValue: lineData.uomCode,
                })(<Input disabled trim />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <EditTable
          // loading={loading}
          dataSource={detailList}
          columns={columns}
          pagination={false}
          // scroll={{ x: 1600 }}
          // rowKey="id"
          bordered
        />
      </Modal>
    );
  }
}
