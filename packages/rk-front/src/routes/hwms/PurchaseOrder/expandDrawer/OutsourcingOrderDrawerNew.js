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
import intl from 'utils/intl';
import notification from 'utils/notification';
import {
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
import moment from 'moment';
import Lov from 'components/Lov';
import OutsourcingForm from './OutsourcingForm';
import Skip from './Skip';
import styles from './index.less';

const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

@connect(({ purchaseReturn, purchaseOrder, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  purchaseReturn,
  purchaseOrder,
  loading: {
    detailLoading: loading.effects['purchaseReturn/queryLineDetailList'],
  },
}))
@Form.create({ fieldNameProp: null })
export default class OutsourcingOrderDrawerNew extends Component {
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
      outSourceList = [],
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
          qmsInvoiceLineReturnDTOList: outSourceList,
        },
      }).then(res => {
        if (res) {
          notification.success({ message: "创建成功！" });
          this.setState({
            skipFlag: true,
          });
        } else {
          // notification.error({ message: res.message });
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

  // 发料仓库lov联动赋值
  @Bind
  changedeliveryWarehouseLov = (value, record, index) => {
    const {
      dispatch,
      purchaseOrder: { outSourceList = [] },
    } = this.props;
    outSourceList[index].deliveryWarehouseId = record.locatorId;
    outSourceList[index].deliveryWarehouseCode = record.warehouse;
    dispatch({
      type: 'purchaseOrder/showQuantity',
      payload: [{
        index,
        materialId: outSourceList[index].materialId,
        toStorageId: record.locatorId,
      }],
    }).then(res=>{
      if(res){
        res.forEach((item=>{
          outSourceList[`${item.index}`].inventoryQuantity = item.onhandQuantity;
        }));
        dispatch({
          type: 'purchaseOrder/updateState',
          payload: {
            outSourceList,
          },
        });
      }
    });
  };

  // 若实际制单数量-库存数量<0,则用红色底色显示
  @Bind()
  handleClickRow(record) {
    if ( Number(record.actualQuantity) - Number(record.inventoryQuantity) > 0 ) {
      return styles['change-row-color'];
    } else {
      return '';
    }
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
      tenantId,
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
        width: 120,
      },
      {
        title: '实际制单数量',
        dataIndex: `actualQuantity`,
        width: 120,
      },
      {
        title: '超发库存',
        dataIndex: `overQuantity`,
        width: 120,
      },
      {
        title: '发料仓库',
        dataIndex: `deliveryWarehouseCode`,
        width: 150,
        render: (val, record, index) =>
        ['create', 'update'].includes(record._status) ?
        (
          <Form.Item>
            {record.$form.getFieldDecorator(`deliveryWarehouseId`, {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonModelPrompt}.deliveryWarehouseCode`).d('发料仓库'),
                  }),
                },
              ],
              initialValue: record.deliveryWarehouseId,
            })(
              <Lov
                code="MT.WARE.HOUSE"
                queryParams={{ tenantId }}
                textValue={val}
                onChange={(vals, records) => this.changedeliveryWarehouseLov(vals, records, index)}
              />
            )}
          </Form.Item>
        )
        : (
          val
        )
        ,
      },
      {
        title: '库存现有量',
        dataIndex: `inventoryQuantity`,
        width: 120,
      },
      {
        title: '单位',
        width: 150,
        dataIndex: 'uomCode',
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
          width={1300}
          visible={outsourcingOrder}
          onCancel={onCancel}
          footer={null}
        >
          <OutsourcingForm {...searchProps} />
          <EditTable
            dataSource={outSourceList}
            columns={columns}
            pagination={false}
            bordered
            rowClassName={this.handleClickRow}
          />
          <br />
          <br />
          {skipFlag && <Skip {...skipProps} />}
        </Modal>
      </Spin>
    );
  }
}
