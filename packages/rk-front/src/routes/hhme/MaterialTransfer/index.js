/*
 * @Description: 物料转移
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-03-16 14:20:40
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-10-23 14:44:01
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component, Fragment } from 'react';
import { Row, Col, Button, Modal, Spin } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import { filterNullValueObject } from 'utils/utils';
import styles from './index.less';
import MaterialsInfo from './Component/MaterialsInfo';
import BarCode from './Component/BarCode';
import BarCodeAndMaterials from './Component/BarCodeAndMaterials';
import TargetCardConfig from './Component/TargetCardConfig';

@connect(({ materialTransfer }) => ({
  materialTransfer,
}))
export default class MaterialTransfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      spinning: false,
      targetCardFlag: false,
      materialLotCode: '',
      formCardList: [],
    };
  }

  componentDidMount() { }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'materialTransfer/updateState',
      payload: {
        materialTransfersList: [{}, {}, {}, {}],
        materialsInfo: {},
        barCodeList: [],
        materialTransfers: {},
      },
    });
  }



  // 扫码来源条码
  @Bind()
  sacnSourceCode(value) {
    const {
      dispatch,
      materialTransfer: { barCodeList = [], materialsInfo = {} },
    } = this.props;
    // 判断所扫的条码是否扫过，扫过的需要提示是否清除
    const sameCodeArr = barCodeList.filter(ele => ele.materialLotCode === value.materialLotCode);
    if (sameCodeArr.length > 0) {
      Modal.confirm({
        title: '物料批正在操作中，是否取消对物料批的操作?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          const newbarCodeList = barCodeList.filter(item => {
            return item.materialLotCode !== value.materialLotCode;
          });
          dispatch({
            type: 'materialTransfer/updateState',
            payload: {
              materialsInfo: {
                ...materialsInfo,
                totalTransferQty: materialsInfo.totalTransferQty - sameCodeArr[0].transferQuantity,
                totalQty: materialsInfo.totalQty - sameCodeArr[0].quantity,
              },
              barCodeList: newbarCodeList,
            },
          });
        },
        onCancel() {
        },
      });
    } else {
      this.getMateriaDataRel(value);
    }
  }

  // 删除条码
  @Bind()
  deleteBarCode(value) {
    const {
      dispatch,
      materialTransfer: { barCodeList = [], materialsInfo = {} },
    } = this.props;
    const newbarCodeList = barCodeList.filter(item => {
      return item.materialLotCode !== value.materialLotCode;
    });
    const sameCodeArr = barCodeList.filter(ele => ele.materialLotCode === value.materialLotCode);
    dispatch({
      type: 'materialTransfer/updateState',
      payload: {
        materialsInfo: {
          ...materialsInfo,
          totalTransferQty: materialsInfo.totalTransferQty - sameCodeArr[0].transferQuantity,
          totalQty: materialsInfo.totalQty - sameCodeArr[0].quantity,
        },
        barCodeList: newbarCodeList,
      },
    });
  }

  // 获取数据
  @Bind()
  getMateriaDataRel(value) {
    const {
      dispatch,
      materialTransfer: { barCodeList = [], materialTransfersList = [] },
    } = this.props;
    this.setState({ spinning: true });
    const param = [];
    if (barCodeList.length === 0) {
      param.push({
        inputTimes: 1,
        materialLotCode: value.materialLotCode,
      });
    } else {
      // param.push(...barCodeList);
      barCodeList.forEach((item, index) => {
        param.push({
          ...item,
          inputTimes: index + 1,
        });
      });
      param.push({
        inputTimes: barCodeList.length + 1,
        materialLotCode: value.materialLotCode,
      });
    }
    dispatch({
      type: 'materialTransfer/getMaterialData',
      payload: {
        param,
      },
    }).then(res => {
      this.setState({ spinning: false });
      if (res) {
        const dtoList = [];
        res.dtoList.forEach((element, index) => {
          dtoList.push({
            uomCode: res.uomCode,
            inputTimes: index + 1,
            materialLotCode: element.materialLotCode,
            materialLotId: element.materialLotId,
            quantity: element.quantity,
            transferQuantity: element.transferQuantity,
          });
        });
        const arr = [];
        materialTransfersList.forEach(item => {
          arr.push({
            ...item,
            targetMaterialLotCode: '',
            targetMaterialLotId: '',
            targetQty: '',
            uomCode: res.uomCode,
            materialName: res.materialName,
            lot: res.lot,
            materialCode: res.materialCode,
            supplierName: res.supplierName,
            effectiveDate: res.effectiveDate,
            supplierLot: res.supplierLot,
          });
        });
        dispatch({
          type: 'materialTransfer/updateState',
          payload: {
            barCodeList: dtoList,
            materialsInfo: res,
            materialTransfersList: [],
          },
        });
      }
    });
  }

  // 待转移区物料信息
  @Bind()
  getMaterialTransfers() {
    const {
      dispatch,
      materialTransfer: { barCodeList = [], materialTransfersList = [], materialsInfo = {} },
    } = this.props;
    dispatch({
      type: 'materialTransfer/getMaterialTransfers',
      payload: {
        barCodeList,
      },
    }).then(res => {
      if (res) {
        materialTransfersList.push({
          ...res,
          uomCode: materialsInfo.uomCode,
        });
        dispatch({
          type: 'materialTransfer/updateState',
          payload: {
            materialTransfersList,
          },
        });
      }
    });
  }

  // 目标条码确定
  @Bind()
  onSubmit(value, indexval) {
    const {
      dispatch,
      materialTransfer: { barCodeList = [], materialsInfo = {}, materialTransfersList = [] },
    } = this.props;
    const targetList = barCodeList.filter(ele => ele.materialLotCode === value.targetMaterialLotCode);
    if (targetList.length > 0) {
      return notification.error({ message: `目标条码${value.targetMaterialLotCode}已在来源条码中存在，不允许转移!` });
    }
    this.setState({ spinning: true });
    dispatch({
      type: 'materialTransfer/onSubmit',
      payload: {
        ...value,
        dtoList: barCodeList,
      },
    }).then(res => {
      this.setState({ spinning: false });
      if (res) {
        const dtoList = [];
        res.dtoList.forEach((element, index) => {
          dtoList.push({
            inputTimes: index + 1,
            materialLotCode: element.materialLotCode,
            materialLotId: element.materialLotId,
            quantity: element.quantity,
            transferQuantity: element.transferQuantity,
          });
        });
        materialTransfersList.splice(indexval, 1, {
          ...materialTransfersList[indexval],
          ...res,
          targetQty: value.targetQty,
        });
        dispatch({
          type: 'materialTransfer/updateState',
          payload: {
            materialsInfo: {
              ...materialsInfo,
              totalQty: res.totalQty,
              totalTransferQty: res.totalTransferQty,
            },
            barCodeList: dtoList,
            materialTransfersList,
          },
        });
        notification.success({ message: '操作成功！' });
      }
    });
  }

  @Bind()
  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  // 修改转移数量
  @Bind()
  onCodeSubmit(value, barCode, index) {
    const { dispatch, materialTransfer: { barCodeList = [] } } = this.props;
    if (barCode.quantity < value.transferQuantity) {
      dispatch({
        type: 'materialTransfer/updateState',
        payload: {
          barCodeList,
        },
      });
      notification.error({ message: '转移数量不能大于数量' });
    } else {
      this.codeSubmit(value, barCode, index);
    }
  }

  // 提交
  @Bind()
  codeSubmit(value, barCode, index) {
    const {
      dispatch,
      materialTransfer: { materialsInfo = {}, barCodeList = [] },
    } = this.props;
    barCodeList.splice(index, 1, {
      ...barCode,
      transferQuantity: value.transferQuantity,
      edit: true,
    });
    let totalTransferQty = 0;
    barCodeList.forEach(item => {
      totalTransferQty += item.transferQuantity;
    });
    dispatch({
      type: 'materialTransfer/updateState',
      payload: {
        materialsInfo: {
          ...materialsInfo,
          totalTransferQty,
        },
        barCodeList,
      },
    });
  }

  // 删除目标卡片
  @Bind()
  deleteTargetCard(index) {
    const {
      materialTransfer: {
        materialTransfersList = [],
      },
      dispatch,
    } = this.props;
    // 前四个卡片永远不会被删除，只会清除卡片上的数据，当总的数量超过5条的时候允许从第一个开始删，当到4的时候不能删除卡片了，只能清除数据
    materialTransfersList.splice(index, 1);
    dispatch({
      type: 'materialTransfer/updateState',
      payload: {
        materialTransfersList,
      },
    });
  }

  // 条码打印
  @Bind()
  printingBarcode(val) {
    const { dispatch } = this.props;
    this.setState({ spinning: true });
    dispatch({
      type: 'materialTransfer/printingBarcode',
      payload: [val.targetMaterialLotId],
    }).then(res => {
      this.setState({ spinning: false });
      if (res) {
        const file = new Blob(
          [res],
          { type: 'application/pdf' }
        );
        const fileURL = URL.createObjectURL(file);
        const newwindow = window.open(fileURL, 'newwindow');
        if (newwindow) {
          newwindow.print();
        } else {
          notification.error({ message: '当前窗口已被浏览器拦截，请手动设置浏览器！' });
        }
      }
    });
  }

  // 扫描目标条码带出供应商批次
  @Bind()
  sacnTargetCode(targetMaterialLotCode, index) {
    const {
      dispatch,
      materialTransfer: { materialTransfersList = [] },
    } = this.props;
    this.setState({ spinning: true });
    dispatch({
      type: 'materialTransfer/sacnTargetCode',
      payload: {
        materialLotCode: targetMaterialLotCode,
      },
    }).then(res => {
      this.setState({ spinning: false });
      if (res) {
        materialTransfersList.splice(index, 1, {
          ...materialTransfersList[index],
          targetMaterialLotCode,
          supplierLot: res.supplierLot ? res.supplierLot : materialTransfersList[index].supplierLot,
        });
        dispatch({
          type: 'materialTransfer/updateState',
          payload: {
            materialTransfersList,
          },
        });
      }
    });
  }

  // 显示目标卡片
  @Bind()
  createTargetCardFlag(flag) {
    const {
      materialTransfer: { materialsInfo = {} },
    } = this.props;
    if (!materialsInfo.materialId) {
      return notification.error({ message: '请先扫描来源条码！' });
    }
    this.setState({ targetCardFlag: flag });
  }

  // 生成目标卡片
  @Bind()
  createTargetCard() {
    const {
      materialTransfer: { materialsInfo = {}, materialTransfersList = [] },
      dispatch,
    } = this.props;
    const fieldsValue = (this.targetCardForm && filterNullValueObject(this.targetCardForm.getFieldsValue())) || {};
    // 判断 流水号 是否是整数  不是则报错
    let flag = false;
    if (fieldsValue.serialNumber !== null && fieldsValue.serialNumber !== "" && fieldsValue.serialNumber !== undefined) {
      const repex = /^[+]{0,1}(\d+)$/;
      if (!repex.test(fieldsValue.serialNumber)) {
        return notification.error("请输入整数流水号");
      }
      flag = true;
    }
    for (let i = 0; i < fieldsValue.number; i++) {
      materialTransfersList.push({
        ...materialsInfo,
        targetQty: fieldsValue.targetQty,
        supplierLot: fieldsValue.supplierLot,
        targetMaterialLotCode: (fieldsValue.prefix ? fieldsValue.prefix : "") + (flag ? this.upNum(fieldsValue.serialNumber, i) : ""),
      });
    }
    dispatch({
      type: 'materialTransfer/updateState',
      payload: {
        materialTransfersList,
      },
    });
    this.createTargetCardFlag(false);
  }

  // 自增流水号
  @Bind()
  upNum(data, index) {
    // 获取位数
    const dataLength = data.length;

    // 转为数字
    const dataNumber = Number(data);

    // 自增

    const dataNewNumber = dataNumber + index;

    let dataNow = `${dataNewNumber}`;
    // 根据 新增的位数，与总长度求差值，取0
    for (let i = 0; i < dataLength - `${dataNewNumber}`.length; i++) {
      dataNow = `0${dataNow}`;
    }

    return dataNow;
  }

  @Bind
  onRefCode(ref) {
    const { formCardList } = this.state;
    const arr = formCardList;
    arr.push({ ...ref });
    this.setState({ formCardList: arr });
  }

  // 批量确认
  @Bind()
  batchDetermine() {
    const { formCardList } = this.state;
    const paramList = [];
    formCardList.forEach(item=>{
      paramList.push(filterNullValueObject(item.getFieldsValue()));
    });
  }


  render() {
    const {
      dispatch,
      materialTransfer: { barCodeList = [], materialTransfersList = [], materialsInfo = {} },
    } = this.props;
    const { spinning, targetCardFlag } = this.state;
    const materialsInfoProps = {
      materialsInfo,
      sacnSourceCode: this.sacnSourceCode,
      onRef: node => {
        this.sourceForm = node.props.form;
      },
    };
    const barCodeListProps = {
      barCodeList,
      onCodeSubmit: this.onCodeSubmit,
      deleteBarCode: this.deleteBarCode,
    };
    const targetCardConfigProps = {
      supplierLot: materialsInfo.supplierLot,
      expandDrawer: targetCardFlag,
      createTargetCardFlag: this.createTargetCardFlag,
      createTargetCard: this.createTargetCard,
      onRef: node => {
        this.targetCardForm = node.props.form;
      },
    };
    return (
      <Fragment>
        <Header title="物料转移">
          <Button
            onClick={() => this.batchDetermine()}
          >
            批量确定
          </Button>
        </Header>
        <Content style={{ padding: '0px' }}>
          <Spin spinning={spinning}>
            <Row className={styles['material-transfer-first-row']}>
              <Col style={{ paddingRight: '5px' }} span={5}>
                <MaterialsInfo {...materialsInfoProps} />
              </Col>
              <Col span={19}>
                {!spinning && <BarCode {...barCodeListProps} />}
              </Col>
            </Row>
            <Row gutter={48} className={styles['material-transfer-second-row']}>
              <Col style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                <div
                  span={24}
                  style={{
                    width: '100%',
                    height: '358px',
                    marginTop: '4px',
                  }}
                >
                  <div
                    id="materialTransfer"
                  >
                    {materialTransfersList.map((item, index) => {
                      return (
                        <BarCodeAndMaterials
                          materialTransfersList={item}
                          index={index}
                          dispatch={dispatch}
                          onSubmit={this.onSubmit}
                          deleteTargetCard={this.deleteTargetCard}
                          barCodeList={barCodeList}
                          printingBarcode={this.printingBarcode}
                          sacnTargetCode={this.sacnTargetCode}
                          onRef={ref => this.onRefCode(ref)}
                          spinning={spinning}
                        />
                      );
                    })}
                  </div>
                  <div
                    style={{ margin: '6px 0px 0px 8px', float: 'left' }}
                    className={styles['material-transfer-second-row-button']}
                  >
                    <Button
                      style={{
                        width: '233px',
                        height: '326px',
                        borderColor: '#6F828F',
                      }}
                      type="dashed"
                      icon="plus"
                      onClick={() => this.createTargetCardFlag(true)}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </Spin>
          {targetCardFlag && <TargetCardConfig {...targetCardConfigProps} />}
        </Content>
      </Fragment>
    );
  }
}
