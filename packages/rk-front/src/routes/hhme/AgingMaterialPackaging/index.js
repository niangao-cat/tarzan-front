/*
 * @Description: 时效物料分装
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-09-12 10:33:30
 * @LastEditTime: 2020-10-14 22:06:57
 */

import React, { Component, Fragment } from 'react';
import { Row, Col, Button, Spin } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import { filterNullValueObject } from 'utils/utils';
import styles from './index.less';
import MaterialsInfo from './Component/MaterialsInfo';
import BarCodeAndMaterials from './Component/BarCodeAndMaterials';
import TimeCard from './Component/TimeCard';
import TargetCardConfig from './Component/TargetCardConfig';

@connect(({ agingMaterialPackaging }) => ({
  agingMaterialPackaging,
}))
export default class AgingMaterialPackaging extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinning: false,
      targetCardFlag: true,
      mtlotTimeFlag: true,
      targetCardExpendFlag: false,
    };
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'agingMaterialPackaging/batchLovData',
      payload: {
        tenantId,
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'agingMaterialPackaging/updateState',
      payload: {
        targetCard: [{}, {}, {}, {}],
        materialsInfo: {},
      },
    });
  }

  // // 提交更新
  // @Bind()
  // onSubmitUpdate() {
  //   const {
  //     dispatch,
  //     agingMaterialPackaging: {
  //       materialsInfo = {},
  //     },
  //   } = this.props;
  //   // const mtlotTimeValue = (this.mtlotTimeForm && filterNullValueObject(this.mtlotTimeForm.getFieldsValue())) || {};
  //   // if (!mtlotTimeValue.timeUom || !mtlotTimeValue.time) {
  //   //   return notification.error({ message: '请选择原始条码时长或时长类别！' });
  //   // }
  //   this.setState({ spinning: true, mtlotTimeFlag: false });
  //   dispatch({
  //     type: 'agingMaterialPackaging/rawMaterialsTime',
  //     payload: {
  //       materialLotId: materialsInfo.materialLotId,
  //       dateTimeFrom: materialsInfo.dateTimeFrom,
  //       dateTimeTo: materialsInfo.dateTimeTo,
  //     },
  //   }).then(res => {
  //     this.setState({ spinning: false, mtlotTimeFlag: true });
  //     // 设置原始条码时长成功后更新原始物料的有效期从、至
  //     if (res) {
  //       notification.success();
  //       dispatch({
  //         type: 'agingMaterialPackaging/updateState',
  //         payload: {
  //           materialsInfo: {
  //             ...materialsInfo,
  //             dateTimeFrom: res.dateTimeFrom,
  //             dateTimeTo: res.dateTimeTo,
  //           },
  //         },
  //       });
  //     }
  //   });
  //
  // }

  // 添加目标卡片
  @Bind()
  addTargetCard() {
    const {
      agingMaterialPackaging: {
        targetCard = [],
        materialsInfo = {},
      },
      dispatch,
    } = this.props;
    const objectTimeValue = (this.objectTimeForm && filterNullValueObject(this.objectTimeForm.getFieldsValue())) || {};
    const objectQtyValue = (this.objectQtyForm && filterNullValueObject(this.objectQtyForm.getFieldsValue())) || {};
    targetCard.push({
      sourceMaterialLotId: materialsInfo.materialLotId,
      materialName: materialsInfo.materialName,
      lot: materialsInfo.lot,
      materialCode: materialsInfo.materialCode,
      qty: objectQtyValue.time,
      time: objectTimeValue.time,
    });
    dispatch({
      type: 'agingMaterialPackaging/updateState',
      payload: {
        targetCard,
      },
    });
  }

  // 删除目标卡片
  @Bind()
  deleteTargetCard(index) {
    const {
      agingMaterialPackaging: {
        targetCard = [],
      },
      dispatch,
    } = this.props;
    // 前四个卡片永远不会被删除，只会清除卡片上的数据，当总的数量超过5条的时候允许从第一个开始删，当到4的时候不能删除卡片了，只能清除数据
    if (targetCard.length > 4 && index > 3) {
      targetCard.splice(index, 1);
    }
    dispatch({
      type: 'agingMaterialPackaging/updateState',
      payload: {
        targetCard,
      },
    });
  }

  // 扫描来源条码即待转移物料条码
  @Bind()
  scanSourceCode(code) {
    this.setState({ spinning: true, targetCardFlag: false });
    const {
      dispatch,
      agingMaterialPackaging: {
        targetCard = [],
      },
    } = this.props;
    dispatch({
      type: 'agingMaterialPackaging/scanSourceCode',
      payload: {
        materialLotCode: code.materialLotCode,
      },
    }).then(res => {
      this.setState({ spinning: false, targetCardFlag: true });
      this.objectTimeForm.setFieldsValue({ time: '' });
      this.objectQtyForm.setFieldsValue({ time: '' });
      this.mtlotTimeForm.setFieldsValue({ timeUom: '' });
      if (res) {
        if (!res.openEffectiveTime || !res.openEffectiveUom) {
          notification.error({ message: '开封有效期和开封有效期单位,不可为空' });
        }
        const arr = [];
        targetCard.forEach(() => {
          arr.push({
            sourceMaterialLotId: res.materialLotId,
            materialName: res.materialName,
            lot: res.lot,
            materialCode: res.materialCode,
            primaryUomCode: res.primaryUomCode,
            supplierLot: res.supplierLot,
          });
        });
        dispatch({
          type: 'agingMaterialPackaging/updateState',
          payload: {
            targetCard: arr,
          },
        });
      } else {
        dispatch({
          type: 'agingMaterialPackaging/updateState',
          payload: {
            targetCard: [{}, {}, {}, {}],
            materialsInfo: {},
          },
        });
      }
    });
  }

  // 扫描目标条码
  @Bind()
  scanTargetCode(code, index) {
    this.setState({ spinning: true });
    const {
      dispatch,
      agingMaterialPackaging: {
        targetCard = [],
      },
    } = this.props;
    dispatch({
      type: 'agingMaterialPackaging/scanTargetCode',
      payload: {
        materialLotCode: code,
      },
    }).then(res => {
      this.setState({ spinning: false });
      if (res) {
        targetCard.splice(index, 1, {
          ...res,
        });
        dispatch({
          type: 'agingMaterialPackaging/updateState',
          payload: {
            targetCard,
          },
        });
      }
    });
  }

  // 时长类别更改
  @Bind()
  handleOriginalTimeChange(val) {
    const {
      dispatch,
      agingMaterialPackaging: {
        targetCard = [],
      },
    } = this.props;
    const arr = [];
    targetCard.forEach(item => {
      if (item.targetMaterialLotId) {
        arr.push({
          ...item,
        });
      } else {
        arr.push({
          ...item,
          timeUom: val,
        });
      }
    });
    dispatch({
      type: 'agingMaterialPackaging/updateState',
      payload: {
        targetCard: arr,
      },
    });
  }

  // 分装对象时长更改
  @Bind()
  handleTimeChange(val) {
    const {
      dispatch,
      agingMaterialPackaging: {
        targetCard = [],
      },
    } = this.props;
    const arr = [];
    targetCard.forEach(item => {
      if (item.targetMaterialLotId) {
        arr.push({
          ...item,
        });
      } else {
        arr.push({
          ...item,
          minute: val,
        });
      }
    });
    dispatch({
      type: 'agingMaterialPackaging/updateState',
      payload: {
        targetCard: arr,
      },
    });
  }

  // 分装对象数量更改
  @Bind()
  handleNumChange(val) {
    const {
      dispatch,
      agingMaterialPackaging: {
        targetCard = [],
      },
    } = this.props;
    const arr = [];
    targetCard.forEach(item => {
      if (item.targetMaterialLotId) {
        arr.push({
          ...item,
        });
      } else {
        arr.push({
          ...item,
          qty: val,
        });
      }
    });
    dispatch({
      type: 'agingMaterialPackaging/updateState',
      payload: {
        targetCard: arr,
      },
    });
  }

  @Bind()
  accSubtraction(arg1, arg2) {
    let r1;
    let r2;
    try {
      r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    // eslint-disable-next-line no-restricted-properties
    return (arg1 * Math.pow(10, Math.max(r1, r2)) - arg2 * Math.pow(10, Math.max(r1, r2))) / Math.pow(10, Math.max(r1, r2));
  }


  // 目标卡片确认按钮
  @Bind()
  targetConfirm(val, index) {
    const {
      dispatch,
      agingMaterialPackaging: {
        targetCard = [],
        materialsInfo = {},
      },
    } = this.props;
    this.setState({ spinning: true });
    dispatch({
      type: 'agingMaterialPackaging/targetConfirm',
      payload: {
        ...val,
        dateTimeFrom: materialsInfo.dateTimeFrom,
        dateTimeTo: materialsInfo.dateTimeTo,
        sourceMaterialLotId: targetCard[index].sourceMaterialLotId,
      },
    }).then(res => {
      this.setState({ spinning: false });
      if (res) {
        notification.success();
        targetCard.splice(index, 1, {
          ...targetCard[index],
          ...res,
        });
        dispatch({
          type: 'agingMaterialPackaging/updateState',
          payload: {
            targetCard,
            materialsInfo: {
              ...materialsInfo,
              primaryUomQty: this.accSubtraction(materialsInfo.primaryUomQty, val.qty),
            },
          },
        });
      }
    });
  }

  // 条码打印
  @Bind()
  printingBarcode(val) {
    const { dispatch } = this.props;
    this.setState({ spinning: true });
    dispatch({
      type: 'agingMaterialPackaging/printingBarcode',
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
      agingMaterialPackaging: { targetCard = [], materialsInfo = {} },
    } = this.props;
    this.setState({ spinning: true });
    dispatch({
      type: 'agingMaterialPackaging/sacnTargetCode',
      payload: {
        materialLotCode: targetMaterialLotCode,
      },
    }).then(res => {
      this.setState({ spinning: false });
      if (res) {
        targetCard.splice(index, 1, {
          ...targetCard[index],
          supplierLot: res.supplierLot ? res.supplierLot : materialsInfo.supplierLot,
        });
        dispatch({
          type: 'agingMaterialPackaging/updateState',
          payload: {
            targetCard,
          },
        });
      }
    });
  }

  // 显示目标卡片
  @Bind()
  createTargetCardFlag(flag) {
    const {
      agingMaterialPackaging: { materialsInfo = {} },
    } = this.props;
    if (!materialsInfo.materialId) {
      return notification.error({ message: '请先扫描来源条码！' });
    }
    this.setState({ targetCardExpendFlag: flag });
  }

  // 生成目标卡片
  @Bind()
  createTargetCard() {
    const {
      agingMaterialPackaging: { materialsInfo = {}, targetCard = [] },
      dispatch,
    } = this.props;
    const fieldsValue = (this.targetCardForm && filterNullValueObject(this.targetCardForm.getFieldsValue())) || {};
    for (let i = 0; i < fieldsValue.number; i++) {
      targetCard.push({
        ...materialsInfo,
        sourceMaterialLotId: materialsInfo.materialLotId,
        qty: fieldsValue.qty,
        supplierLot: fieldsValue.supplierLot,
        timeUom: fieldsValue.timeUom,
        time: fieldsValue.time,
      });
    }
    dispatch({
      type: 'agingMaterialPackaging/updateState',
      payload: {
        targetCard,
      },
    });
    this.createTargetCardFlag(false);
  }


  render() {
    const {
      agingMaterialPackaging: {
        targetCard = [],
        materialsInfo = {},
        lovData = {},
      },
    } = this.props;
    // eslint-disable-next-line no-unused-vars
    const { mtlotTime = [], objectQty = [], objectTime = [], timeUom = [] } = lovData;
    const { spinning, targetCardFlag, mtlotTimeFlag, targetCardExpendFlag } = this.state;
    const materialsInfoProps = {
      materialsInfo,
      scanSourceCode: this.scanSourceCode,
    };
    const targetCardConfigProps = {
      supplierLot: materialsInfo.supplierLot,
      expandDrawer: targetCardExpendFlag,
      timeUom,
      createTargetCardFlag: this.createTargetCardFlag,
      createTargetCard: this.createTargetCard,
      onRef: node => {
        this.targetCardForm = node.props.form;
      },
    };
    return (
      <Fragment>
        <Header title="时效物料分装">
          {/* <Button */}
          {/*   type="primary" */}
          {/*   onClick={() => this.onSubmitUpdate()} */}
          {/*   // 原始条码有有效性就不能更改了 */}
          {/*   disabled={!materialsInfo.materialLotId || materialsInfo.dateTimeFrom && materialsInfo.dateTimeTo} */}
          {/* > */}
          {/*   提交更新 */}
          {/* </Button> */}
        </Header>
        <Content style={{ padding: '0px' }}>
          <Spin spinning={spinning}>
            <Row className={styles['aging-material-packaging-first-row']} gutter={8}>
              <Col span={6}>
                <MaterialsInfo {...materialsInfoProps} />
              </Col>
              <Col span={6}>
                {mtlotTimeFlag && (
                  <TimeCard
                    // dataSource={mtlotTime}
                    materialsInfo={materialsInfo}
                    timeUom={timeUom}
                    titleValue="目标条码时长设置"
                    code="mtlotTime"
                    handleTimeChange={this.handleOriginalTimeChange}
                    onRef={node => {
                      this.mtlotTimeForm = node.props.form;
                    }
                    }
                  />
                )}
              </Col>
              <Col span={6}>
                <TimeCard
                  dataSource={objectTime}
                  titleValue="分装对象时长设置"
                  code="objectTime"
                  handleTimeChange={this.handleTimeChange}
                  onRef={node => {
                    this.objectTimeForm = node.props.form;
                  }
                  }
                />
              </Col>
              <Col span={6}>
                <TimeCard
                  dataSource={objectQty}
                  titleValue="分装对象数量设置"
                  code="objectQty"
                  handleTimeChange={this.handleNumChange}
                  onRef={node => {
                    this.objectQtyForm = node.props.form;
                  }
                  }
                />
              </Col>
            </Row>
            <Row className={styles['aging-material-transfer-second-row']}>
              <Col style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                <div
                  span={24}
                  style={{
                    width: '100%',
                    marginTop: '4px',
                  }}
                >
                  {targetCardFlag && targetCard.map((item, index) => {
                    return (
                      <BarCodeAndMaterials
                        materialTransfersList={item}
                        onSubmit={this.onSubmit}
                        index={index}
                        deleteTargetCard={this.deleteTargetCard}
                        scanTargetCode={this.scanTargetCode}
                        printingBarcode={this.printingBarcode}
                        targetConfirm={this.targetConfirm}
                        sacnTargetCode={this.sacnTargetCode}
                        confirmFlag={!materialsInfo.materialLotId}
                        targetInfo={item}
                        timeUom={timeUom}
                        spinning={spinning}
                      />
                    );
                  })}
                  <div
                    style={{ margin: '6px 0px 0px 8px', float: 'left' }}
                    className={styles['material-transfer-second-row-button']}
                  >
                    <Button
                      style={{
                        width: '233px',
                        height: '360px',
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
          {targetCardExpendFlag && <TargetCardConfig {...targetCardConfigProps} />}
        </Content>
      </Fragment>
    );
  }
}
