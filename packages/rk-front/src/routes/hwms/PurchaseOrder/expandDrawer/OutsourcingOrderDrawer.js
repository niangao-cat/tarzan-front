/*
 * @Description: 外协采购订单创建
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-07 18:10:19
 */

import React, { Component } from 'react';
import { Modal, Form, Spin } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId } from 'utils/utils';
import EditTable from 'components/EditTable';
import notification from 'utils/notification';
import {
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
import moment from 'moment';
import OutsourcingForm from './OutsourcingForm';
import Skip from './Skip';

@connect(({ purchaseReturn, purchaseOrder, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  purchaseReturn,
  purchaseOrder,
  loading: {
    detailLoading: loading.effects['purchaseReturn/queryLineDetailList'],
  },
}))
@Form.create({ fieldNameProp: null })
export default class DetailDrawer extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      skipFlag: false,
      expandForm: false,
    };
  }

  componentDidMount() {}

   // 查询方法
   @Bind
   handleCompleteData = (values) => {
     const { dispatch, purchaseOrder: {
      outSourceData= {},
    } } = this.props;
    dispatch({
      type: 'purchaseOrder/updateState',
      payload: {
        outsourcingCompleteLoading: true,
      },
    });
     this.setState({ expandForm: !this.state.expandForm});
      // 创建
      outSourceData.qmsInvoiceHeadReturnDTO.remark = values.remark;
      outSourceData.qmsInvoiceHeadReturnDTO.earilyDemandTime = values.earilyDemandTime==null
      ? null
      : moment(values.earilyDemandTime).format(DEFAULT_DATETIME_FORMAT);
      dispatch({
        type: 'purchaseOrder/createOutSource',
        payload: {
          ...outSourceData,
        },
      }).then(res => {
        if (res) {
          notification.success({ message: "创建成功！" });
          this.setState({
            skipFlag: true,
          });
        } else {
          notification.error({ message: res.message });
        }
        this.setState({ expandForm: !this.state.expandForm });
      });
   };

  @Bind()
  handleOk() {
    const { skip, onCancel, onCancel2 } = this.props;
    this.setState({
      skipFlag: false,
    });
    onCancel();
    onCancel2();
    skip();
  }

  @Bind()
  handleCancel() {
    const { onCancel, onCancel2 } = this.props;
    onCancel();
    onCancel2();
    this.setState({
      skipFlag: false,
    });
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const {
      outsourcingOrder,
      onCancel,
      purchaseOrder: {
        outSourceData= {},
        outSourceHeadData = {},
        outSourceList= [],
        outsourcingCompleteLoading,
      },
    } = this.props;

    const { skipFlag} = this.state;

    const searchProps = {
      handlePrintData: this.handlePrintData,
      handleCompleteData: this.handleCompleteData,
      outSourceData,
      outSourceHeadData,
      outSourceList,
      completeLoading: outsourcingCompleteLoading,
    };
    const columns = [
      {
        title: '行号',
        dataIndex: 'lineNum',
        width: 100,
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 150,
      },
      {
        title: '物料描述',
        dataIndex: 'materialName',
        width: 150,
      },
      {
        title: '物料版本',
        dataIndex: 'materialVersion',
        width: 150,
      },
      {
        title: '制单数量',
        dataIndex: `quantity`,
        width: 80,
      },
      {
        title: '单位',
        width: 150,
        dataIndex: 'uomCode',
      },
      {
        title: '采购订单行号',
        width: 150,
        dataIndex: 'orderLineNum',
      },
    ];

    const skipProps = {
      skipFlag,
      handleCancel: this.handleCancel,
      handleOk: this.handleOk,
    };

    return (
      <Spin spinning={this.state.expandForm}>
        <Modal
          destroyOnClose
          width={1500}
          visible={outsourcingOrder}
          onCancel={onCancel}
          footer={null}
        >
          <OutsourcingForm {...searchProps} />
          <EditTable dataSource={outSourceList} columns={columns} pagination={false} bordered />
          <br />
          <br />
          {skipFlag && <Skip {...skipProps} />}
        </Modal>
      </Spin>
    );
  }
}
