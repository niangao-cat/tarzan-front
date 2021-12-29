/*
 * @Description: 送货单抽屉
 * @Version: 0.0.1
 * @Autor: ywj
 * @Date: 2020-10-12 23:46:46
 * @LastEditTime: 2020-11-05 13:57:49
 */

import React, { Component } from 'react';
import { Modal, Form, InputNumber, Switch } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId } from 'utils/utils';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import EditTable from 'components/EditTable';
import FilterForm from './FilterForm';
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
    };
  }

  componentDidMount() { }

  @Bind()
  handleOK() {
    const { form, onOk } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        onOk(fieldsValue);
      }
    });
  }

  @Bind()
  skip() { }

  // 打印
  @Bind()
  handlePrintData() { }

  // 完成
  @Bind()
  handleCompleteData(fieldsValue = {}) {
    const { dispatch, headData, lineData, list, num } = this.props;
    dispatch({
      type: 'purchaseOrder/updateState',
      payload: {
        deliveryCompleteLoading: true,
      },
    });
    const lineDTOList = [];
    for (let i = 0; i < list.length; i++) {
      const obj = {};
      obj.exchangeFlag = list[i].exchangeFlag;
      obj.exchangeQty = list[i].exchangeQty;
      obj.instructionStatus = 'RELEASED';
      obj.materialVersion = list[i].materialVersion;
      obj.toLocatorId = lineData[0].toLocatorId;
      obj.materialId = list[i].materialId;
      obj.uaiFlag = list[i].uaiFlag;
      obj.quantity = list[i].quantity2;
      obj.uomId = list[i].uomId;
      obj.toLocatorId = list[i].toLocatorId;
      if (list[i].exchangeFlag === 'N') {
        obj.exchangeQty = 0;
      }
      obj.orderIdDTOS = list[i].idDtoS;
      lineDTOList[i] = obj;
    }

    const createDTO = {
      instructionDocNum: num,
      siteId: headData.siteId,
      customerId: headData.customerId,
      customerSiteId: headData.customerSiteId,
      supplierId: headData.supplierId,
      supplierCode: headData.supplierCode,
      supplierSiteId: headData.supplierSiteId,
      address: headData.address,
      instructionDocType: 'DELIVERY_DOC',
      instructionDocStatus: headData.deliveryStatus,
      demandTime: fieldsValue.receviceDate == null
        ? null
        : moment(fieldsValue.receviceDate).format(DEFAULT_DATETIME_FORMAT),
      mark: 'MES',
      remark: fieldsValue.remark === undefined ? '' : fieldsValue.remark,
      lineDTOList,
    };
    dispatch({
      type: 'purchaseOrder/fetchCreateOrder',
      payload: {
        ...createDTO,
      },
    }).then(res => {
      if (res) {
        this.setState({
          skipFlag: true,
        });
      }
    });
  }

  @Bind()
  handleOk() {
    const { skip, onCancel, onCancel2 } = this.props;
    this.setState({
      skipFlag: false,
    });
    onCancel();
    onCancel2();
    skip();
    // 打开次界面
    // const win = window.open(`/hwms/delivernode/query`, '_self');
    // win.focus();
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
      expandCreateDrawer,
      onCancel,
      headData,
      list,
      num,
      updateListState,
      updateUaiFlagState,
      purchaseOrder: {
        deliveryCompleteLoading,
      },
    } = this.props;
    const { skipFlag } = this.state;

    const columns = [
      {
        title: '行号',
        dataIndex: 'instructionLineNum',
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
        title: '单位',
        width: 150,
        dataIndex: 'primaryUomCode',
      },
      {
        title: '采购订单行号',
        width: 150,
        dataIndex: 'instructionNum',
      },
      {
        title: '制单数量',
        dataIndex: `quantity2`,
        width: 80,
        render: (value, record) => (
          <Form.Item>
            {record.$form.getFieldDecorator('quantity2', {
              initialValue: value,
            })(<InputNumber disabled style={{ width: '100%' }} />)}
          </Form.Item>
        ),
      },
      {
        title: '料废调换数量',
        dataIndex: 'exchangeQty',
        render: (value, record, index) => (
          <Form.Item>
            {record.$form.getFieldDecorator('exchangeQty', {
              initialValue: value,
            })(
              <InputNumber
                onChange={val => updateListState(val, record, index)}
                formatter={val => `${val}`}
                parser={val => this.limitDecimals(val, 2)}
                // precision={0}
                min={0}
                // max={
                //   record.quantity3 - record.coverQty > 0 ? record.quantity3 - record.coverQty : 0
                // }
                style={{ width: '100%' }}
              />
            )}
          </Form.Item>
        ),
      },
      {
        title: '料废调换标识',
        width: 150,
        dataIndex: 'exchangeFlag',
      },
      {
        title: '特采标识',
        width: 150,
        dataIndex: 'uaiFlag',
        render: (_, record, index) => (
          <Switch onChange={val => updateUaiFlagState(val, record, index)} />
        ),
      },
    ];

    const fiterProps = {
      num,
      headData,
      completeLoading: deliveryCompleteLoading,
      handlePrintData: this.handlePrintData,
      handleCompleteData: this.handleCompleteData,
    };
    const skipProps = {
      skipFlag,
      handleCancel: this.handleCancel,
      handleOk: this.handleOk,
    };

    return (
      <Modal
        destroyOnClose
        width={1500}
        visible={expandCreateDrawer}
        onCancel={onCancel}
        footer={null}
      >
        <br />
        <br />
        <FilterForm {...fiterProps} />
        <EditTable dataSource={list} columns={columns} pagination={false} bordered />
        <br />
        <br />
        {skipFlag && <Skip {...skipProps} />}
      </Modal>
    );
  }
}
