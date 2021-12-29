/*
 * @Description: 送货单抽屉
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-03-18 17:50:26
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-08-28 17:16:50
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Modal, Form, Input, Col, Row, InputNumber, Popconfirm, notification } from 'hzero-ui';
import intl from 'utils/intl';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId } from 'utils/utils';
import EditTable from 'components/EditTable';
import { Button as ButtonPermission } from 'components/Permission';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import CreateDeliveryDrawer from './CreateDeliveryDrawer';
import OutsourcingOrderDrawer from './OutsourcingOrderDrawer';

const modelPromt = 'tarzan.hmes.purchaseOrder';
@connect(({ purchaseReturn, purchaseOrder, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  purchaseOrder,
  purchaseReturn,
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
      expandCreateDrawer: false, // 弹出创建层
      outsourcingOrder: false, // 外协采购订单
      list: [],
      num: '',
      // lineData:[],
    };
  }

  componentDidMount() { }

  // 展开调用方法
  @Bind
  expandData() {
    const { addData, lineData, dispatch } = this.props;
    // const lineData = this.state;
    // debugger;
    // 判断数据是否能够被创建
    if (addData.length >= 0) {
      // addData[i].quantity2
      // 校验制单数量不能为0
      // for(let i = 0; i<addData.length; i++){
      //   if(Number(addData[i].quantity2) === 0){
      //     return notification.error({ message: `采购订单号【${ addData[i].instructionDocNum }】的制单数量不能为0，请检查！`});
      //   }
      // }
      const instructionLineList = [];
      for (let i = 0; i < lineData.length; i++) {
        const instructionLine = {};
        instructionLine.instructionDocNum = lineData[i].instructionNum;
        instructionLine.instructionNum = lineData[i].num;
        instructionLine.materialId = addData[i].materialId;
        instructionLine.materialCode = lineData[i].materialCode;
        instructionLine.materialName = addData[i].materialName;
        instructionLine.materialVersion = lineData[i].materialVersion;
        instructionLine.poId = lineData[i].instructionDocId;
        instructionLine.poLineId = lineData[i].instructionId;
        instructionLine.primaryUomCode = lineData[i].primaryUomCode;
        instructionLine.quantity = addData[i].quantity2;
        instructionLine.uomId = lineData[i].uomId;
        instructionLine.toLocatorId = addData[i].toLocatorId;
        instructionLineList[i] = instructionLine;
      }
      dispatch({
        type: 'purchaseOrder/fetchGeneratePoDeliveryNum',
        payload: {
          objectCode: 'INSTRUCTION_DOC_NUM',
          objectTypeCode: 'DELIVERY_DOC',
          callObjectCodeList: {
            siteCode: 'F-Raycus-WH',
            supplierCode: addData[0].supplierCode,
          },
          instructionLineList,
        },
      }).then(res => {
        for (let i = 0; i < res.lineList.length; i++) {
          res.lineList[i].exchangeQty = '';
          res.lineList[i].uaiFlag = 'N';
          res.lineList[i].exchangeFlag = 'N';
          res.lineList[i]._status = 'update';
        }

        // 更改展示状态
        this.setState({
          expandCreateDrawer: true,
          num: res.number,
          list: res.lineList,
        });
      });
    } else {
      notification.error({ message: '无可创建的行数据！！' });
    }
  }

  // 关闭窗口调用方法
  @Bind
  expandColseData() {
    // 更改展示状态
    this.setState({
      expandCreateDrawer: false,
    });
  }

  @Bind()
  updateListState(value, record, index) {
    const { list } = this.state;
    // const { lineData } = this.props;
    // debugger;
    if (value !== '' && value !== undefined && value !== null) {
      // lineData[index].exchangeFlag = 'Y';
      // lineData[index].exchangeQty = value;
      if (value === 0) {
        list[index].exchangeFlag = 'N';
        list[index].exchangeQty = 0;
      } else {
        list[index].exchangeFlag = 'Y';
        list[index].exchangeQty = value;
      }
    } else {
      list[index].exchangeFlag = 'N';
      list[index].exchangeQty = 0;
      // lineData[index].exchangeFlag = 'N';
      // lineData[index].exchangeQty = 0;
    }
  }

  @Bind()
  updateUaiFlagState(value, record, index) {
    const { list } = this.state;
    // const { lineData } = this.props;
    if (value) {
      // lineData[index].uaiFlag = 'Y';
      list[index].uaiFlag = 'Y';
    } else {
      // lineData[index].uaiFlag = 'N';
      list[index].uaiFlag = 'N';
    }
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

  // 外协
  createOut() {

    const {dispatch, addData} = this.props;
    const data = [];
    // 校验制单数量不能为0 by: ysw
    for(let i = 0; i<addData.length; i++){
      if(Number(addData[i].quantity2) === 0){
        return notification.error({ message: `采购订单号【${ addData[i].instructionDocNum }】的制单数量不能为0，请检查！`});
      }
    }
    this.setState({ outsourcingOrder: true });
    addData.forEach(ele => {
      data.push(
        {
          instructionId: ele.instructionId,
          quantity: ele.quantity2,
        }
      );
    });

    dispatch({
      type: "purchaseOrder/fetchOutLineForBoom",
      payload: {
        qmsInvoiceDataQueryDTO1s: data,
      },
    });
  }

  // 外协
  @Bind()
  createOutClose(){
    this.setState({ outsourcingOrder: false });
  }

  limitDecimals(value, accuracy) {
    // eslint-disable-next-line no-useless-escape
    const str = `/^(-)*(\\d+)\\.(\\d{1,${accuracy}}).*$/`;
    // eslint-disable-next-line no-eval
    const reg = eval(str);
    if (typeof value === 'string') {
      return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : '';
    } else if (typeof value === 'number') {
      return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : '';
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
      expandDrawer,
      onCancel,
      onCancel3,
      skip,
      skipOutSource,
      deleteSelected,
      supplierCode,
      supplierName,
      addData,
      codeMap,
      rowsDeleteSelection,
      form,
      selectedDeleteRows2,
      updateListQty,
    } = this.props;
    const columns = [
      {
        title: '采购订单号',
        dataIndex: 'instructionDocNum',
        width: 150,
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 100,
      },
      {
        title: '物料描述',
        dataIndex: 'materialName',
        width: 150,
      },
      {
        title: '物料版本',
        dataIndex: 'materialVersion',
        width: 120,
      },
      {
        title: '可制单数量',
        dataIndex: `coverNum`,
        width: 120,
      },
      {
        title: '制单数量',
        dataIndex: `quantity2`,
        width: 150,
        render: (value, record, index) => (
          <Form.Item>
            {record.$form.getFieldDecorator('quantity2', {
              initialValue: value,
            })(
              <InputNumber
                onChange={val => updateListQty(val, record, index)}
                min={0}
                max={record.coverNum}
                style={{ width: '100%' }}
                formatter={value2 => `${value2}`}
                parser={value2 => this.limitDecimals(value2, 6)}
              />
            )}
          </Form.Item>
        ),
      },
      {
        title: '单位',
        dataIndex: `primaryUomCode`,
        width: 120,
      },
      {
        title: '接收仓库',
        width: 150,
        dataIndex: 'locatorName',
        align: 'center',
      },
      {
        title: '预计到货时间',
        width: 160,
        dataIndex: 'creationDate',
        align: 'center',
      },
    ];

    // 获取表单的字段属性
    const { getFieldDecorator } = form;
    const { list, num, expandCreateDrawer, outsourcingOrder } = this.state;
    const lineData = [];
    for (let i = 0; i < addData.length; i++) {
      lineData[i] = {
        num: addData[i].instructionLineNum,
        materialCode: addData[i].materialCode,
        materialId: addData[i].materialId,
        uomId: addData[i].uomId,
        sourceInstructionId: addData[i].sourceInstructionId,
        instructionStatus: addData[i].instructionStatus,
        materialName: addData[i].materialName,
        materialVersion: addData[i].materialVersion,
        primaryUomCode: addData[i].primaryUomCode,
        instructionNum: addData[i].instructionDocNum,
        toLocatorId: addData[i].toLocatorId,
        instructionDocNum: addData[i].instructionDocNum,
        instructionDocId: addData[i].instructionDocId,
        instructionId: addData[i].instructionId,
        coverNum: addData[i].coverNum,
        quantity1: addData[i].quantity,
        quantity3: addData[i].quantity3, // 后端传入的值
        quantity2: addData[i].quantity2, // 制单数量 第三个页面
        exchangeQty: '',
        exchangeFlag: 'N',
        uaiFlag: 'N',
        coverQty: addData[i].coverQty,
        _status: 'update',
      };
    }
    this.props.lineData = lineData;

    const arr = codeMap.filter(
      ele => ele.value === (addData.length === 0 ? '' : addData[0].instructionDocStatus)
    );

    const deliveryStatusMeanning = arr.length !== 0 ? arr[0].meaning : '';
    const headData = {
      siteName: addData.length > 0 ? addData[0].siteName : '',
      siteId: addData.length > 0 ? addData[0].siteId : '',
      deliveryStatus: addData.length > 0 ? addData[0].instructionDocStatus : '',
      deliveryStatusMeanning,
      address: addData.length > 0 ? addData[0].address : '',
      supplierId: addData.length > 0 ? addData[0].supplierId : '',
      supplierSiteId: addData.length > 0 ? addData[0].supplierSiteId : '',
      supplierCode: addData.length > 0 ? addData[0].supplierCode : '',
      supplierName: addData.length > 0 ? addData[0].supplierName : '',
      receviceDate: addData.length > 0 ? addData[0].demandTime : '',
      customerId: addData.length > 0 ? addData[0].customerId : '',
      customerSiteId: addData.length > 0 ? addData[0].customerSiteId : '',
    };
    this.props.headData = headData;

    // 创建送货
    const createDeliveryProps = {
      addData,
      headData,
      lineData,
      list,
      num,
      skip,
      expandCreateDrawer,
      onCancel2: onCancel,
      onCancel: this.expandColseData,
      updateListState: this.updateListState,
      updateUaiFlagState: this.updateUaiFlagState,
    };
    // 外协采购订单
    const outsourcingOrderDrawer = {
      outsourcingOrder,
      onCancel: this.createOutClose,
      skip: skipOutSource,
      onCancel2: onCancel,
    };
    return (
      <Modal
        confirmLoading={false}
        width={1200}
        visible={expandDrawer}
        onCancel={onCancel3}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        footer={null}
      >
        <ButtonPermission onClick={onCancel3}>
          {intl.get('hzero.purchase.button.add').d('>>收起')}
        </ButtonPermission>

        {selectedDeleteRows2.length === 0 ? (
          <ButtonPermission
            icon="delete"
            disabled={selectedDeleteRows2.length === 0}
            style={{ marginLeft: '15px' }}
          >
            {intl.get('tarzan.acquisition.transformation.button.delete').d('删除')}
          </ButtonPermission>
        ) : (
          <Popconfirm
            title={intl
                .get(`${modelPromt}.confirm.delete`, {
                  count: selectedDeleteRows2.length,
                })
                .d(`总计${selectedDeleteRows2.length}条数据，是否确认删除?`)}
            onConfirm={deleteSelected}
          >
            <ButtonPermission
              icon="delete"
              style={{ marginLeft: '15px' }}
              disabled={selectedDeleteRows2.length === 0}
            >
              {intl.get('hzero.common.button.delete').d('删除')}
            </ButtonPermission>
          </Popconfirm>
          )}

        {addData.length === 0 ? (
          <ButtonPermission
            type="primary"
            disabled={addData.length === 0}
            onClick={this.expandData}
            style={{ marginLeft: '15px' }}
          >
            {intl.get('hzero.purchase.button.add').d('送货单创建')}
          </ButtonPermission>
        ) : (
          <ButtonPermission type="primary" onClick={this.expandData} style={{ marginLeft: '15px' }}>
            {intl.get('hzero.purchase.button.add').d('送货单创建')}
          </ButtonPermission>
          )}
        {/* <Button type="primary" disabled={addData.length===0?true:addData[0].poLineType!=="3"} onClick={() => this.createOut()} style={{ marginLeft: '15px' }}>
          {intl.get('hzero.purchase.button.add').d('外协发货单创建')}
        </Button> */}

        <br />
        <br />
        <Form className={SEARCH_FORM_CLASSNAME}>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPromt}.supplierCode`).d('供应商编码')}
              >
                {getFieldDecorator('supplierCode', {
                  initialValue: supplierCode.length === 0 ? '' : supplierCode[0].supplierCode,
                })(<Input disabled trim />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPromt}.supplierName`).d('供应商描述')}
              >
                {getFieldDecorator('supplierName', {
                  initialValue: supplierName.length === 0 ? '' : supplierName[0].supplierName,
                })(<Input disabled trim />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <EditTable
          rowKey="instructionId"
          dataSource={addData}
          columns={columns}
          pagination={false}
          rowSelection={rowsDeleteSelection}
          footer={null}
          bordered
        />
        {expandCreateDrawer && <CreateDeliveryDrawer {...createDeliveryProps} />}
        {outsourcingOrder && <OutsourcingOrderDrawer {...outsourcingOrderDrawer} />}
      </Modal>
    );
  }
}
