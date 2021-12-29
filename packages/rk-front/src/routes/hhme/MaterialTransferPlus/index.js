/*
 * @Description: 物料转移-plus版本
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-10-23 17:49:14
 * @LastEditTime: 2020-11-05 14:17:57
 */

import React, { Component, Fragment } from 'react';
import { Row, Col, Button, Modal, Spin, Form, Input, InputNumber, Icon, Checkbox } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { xorBy, intersectionBy, pullAllBy, trim } from 'lodash';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import { filterNullValueObject, getEditTableData } from 'utils/utils';
import EditTable from 'components/EditTable';
import uuid from 'uuid/v4';
import intl from 'utils/intl';
import styles from './index.less';
import MaterialsInfo from './Component/MaterialsInfo';
import BarCode from './Component/BarCode';
import TargetCardConfig from './Component/TargetCardConfig';

@connect(({ materialTransfer, loading }) => ({
  materialTransfer,
  printingBarcodeLoading: loading.effects['materialTransfer/printingBarcode'],
  onSubmitLoading: loading.effects['materialTransfer/onSubmit'],
}))
export default class MaterialTransfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      spinning: false,
      targetCardFlag: false,
      tableFlag: true,
      materialLotCode: '',
      formCardList: [],
      selectedRows: [],
      sameList: [],
    };
  }

  componentDidMount() { }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'materialTransfer/updateState',
      payload: {
        materialTransfersList: [],
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
        materialLotCode: trim(value.materialLotCode),
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
            targetMaterialLotCode: element.materialLotCode, // 用来判断与目标条码是否有相同的
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
  deleteTargetCard(index, record) {
    const {
      materialTransfer: {
        materialTransfersList = [],
      },
      dispatch,
    } = this.props;
    const { selectedRows } = this.state;
    // 删除目标卡片时把选中的数据也删除
    const selectedRowsDel = selectedRows.filter(ele => ele.targetMaterialLotUuid !== record.targetMaterialLotUuid);
    // 前四个卡片永远不会被删除，只会清除卡片上的数据，当总的数量超过5条的时候允许从第一个开始删，当到4的时候不能删除卡片了，只能清除数据
    materialTransfersList.splice(index, 1);
    this.setState({ selectedRows: selectedRowsDel });
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
      payload: val,
    }).then(res => {
      this.setState({ spinning: false });
      this.setState({ selectedRows: [] });
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
  sacnTargetCode(targetMaterialLotCode, index, e) {
    const {
      dispatch,
      materialTransfer: { materialTransfersList = [] },
    } = this.props;
    this.setState({ spinning: true });
    dispatch({
      type: 'materialTransfer/sacnTargetCode',
      payload: {
        materialLotCode: trim(targetMaterialLotCode),
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
        this.handleTurnToNextInput(e, index);
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
    if (fieldsValue.number > 200) {
      return notification.warning({ message: '当前生成不能大于200张！' });
    }
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
        _status: 'create',
        targetMaterialLotUuid: uuid(),
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
    const {
      materialTransfer: {
        materialTransfersList = [],
        barCodeList = [],
        materialsInfo = {},
      },
      dispatch,
    } = this.props;
    const { selectedRows = [] } = this.state;
    const params = getEditTableData(selectedRows);
    const sameList = intersectionBy(barCodeList, params, 'targetMaterialLotCode');
    if (sameList.length > 0) {
      return notification.error({ message: `目标条码${sameList.map(ele => ele.targetMaterialLotCode).toString()}已在来源条码中存在，不允许转移!` });
    }
    // 先判读满不满足：数据必须勾选且勾选的是没有保存过的
    if (params.length === 0) {
      return notification.error({ message: '请勾选数据！' });
    } else {
      const arrNoConfirm = params.filter(item => item.targetMaterialLotId);
      if (arrNoConfirm.length !== 0) {
        return notification.error({ message: `当前存在已保存数据${arrNoConfirm.map(ele => ele.targetMaterialLotCode).toString()}请勿重复保存` });
      }
    }
    // 找出重复值
    const arrD = [];
    const map = new Map();
    params.forEach(v => {
      if (v.targetMaterialLotCode && map.get(v.targetMaterialLotCode) && arrD.every(vD => vD.targetMaterialLotCode !== v.targetMaterialLotCode)) {
        arrD.push(v);
      } else {
        map.set(v.targetMaterialLotCode, v);
      }
    });
    if (arrD.length > 0) {
      this.setState({ sameList: arrD });
      notification.error({ message: `当前存在相同条码${arrD.map(ele => ele.targetMaterialLotCode).toString()}` });
    } else {
      this.setState({ sameList: [] });
      dispatch({
        type: 'materialTransfer/onSubmit',
        payload: {
          targetDtoList: params,
          dtoList: barCodeList,
        },
      }).then(res => {
        if (res) {
          // 把勾选的数据从总的数据里去除
          const xorByList = xorBy(materialTransfersList, selectedRows, 'targetMaterialLotUuid');
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
          const targetDtoArr = [];
          res.targetDtoList.forEach(ele => {
            targetDtoArr.push({
              ...res,
              ...ele,
              targetMaterialLotUuid: uuid(),
              _status: 'create',
            });
          });
          dispatch({
            type: 'materialTransfer/updateState',
            payload: {
              materialsInfo: {
                ...materialsInfo,
                totalQty: res.totalQty,
                totalTransferQty: res.totalTransferQty,
              },
              dtoList,
              materialTransfersList: targetDtoArr.concat(xorByList),
            },
          });
          this.setState({ selectedRows: [] });
          notification.success({ message: '操作成功！' });
        }
      });
    }
  }

  // 目标条码确定
  @Bind()
  onSubmit(record, indexval) {
    const {
      dispatch,
      materialTransfer: { barCodeList = [], materialsInfo = {}, materialTransfersList = [] },
    } = this.props;
    const { selectedRows } = this.state;
    const targetList = barCodeList.filter(ele => ele.materialLotCode === record.$form.getFieldValue('targetMaterialLotCode'));
    if (targetList.length > 0) {
      return notification.error({ message: `目标条码${record.$form.getFieldValue('targetMaterialLotCode')}已在来源条码中存在，不允许转移!` });
    }
    record.$form.validateFields((err, values) => {
      if (!err) {
        this.setState({ spinning: true });
        dispatch({
          type: 'materialTransfer/onSubmit',
          payload: {
            targetDtoList: [{ ...values }],
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
            const targetDtoArr = [];
            res.targetDtoList.forEach(ele => {
              targetDtoArr.push({
                ...res,
                ...ele,
                targetMaterialLotUuid: uuid(),
                _status: 'create',
              });
            });
            materialTransfersList.splice(indexval, 1);
            this.setState({ selectedRows: pullAllBy(selectedRows, [{ ...record }], 'targetMaterialLotUuid') });
            dispatch({
              type: 'materialTransfer/updateState',
              payload: {
                materialsInfo: {
                  ...materialsInfo,
                  totalQty: res.totalQty,
                  totalTransferQty: res.totalTransferQty,
                },
                barCodeList: dtoList,
                materialTransfersList: targetDtoArr.concat(materialTransfersList),
              },
            });
            notification.success({ message: '操作成功！' });
          }
        });
      }
    });

  }

  // 批量打印
  @Bind()
  batchPrinter() {
    const { selectedRows = [] } = this.state;
    const params = getEditTableData(selectedRows);
    // 先判读满不满足：数据必须勾选且勾选的是没有保存过的
    if (params.length === 0) {
      return notification.error({ message: '请勾选数据！' });
    } else {
      const arrNoConfirm = params.filter(item => !item.targetMaterialLotId);
      if (arrNoConfirm.length !== 0) {
        return notification.error({ message: `当前条码${arrNoConfirm.map(ele => ele.targetMaterialLotCode).toString()}尚未保存请勿打印` });
      }
    }
    this.printingBarcode(params.map(ele => ele.targetMaterialLotId));
  }

  @Bind()
  handleClickRow(record) {
    const { sameList } = this.state;
    if (record.$form) {
      for (let i = 0; i < sameList.length; i++) {
        if (sameList[i].targetMaterialLotCode === record.$form.getFieldValue('targetMaterialLotCode') && sameList[i].targetMaterialLotUuid === record.targetMaterialLotUuid) {
          return 'material-transfer-second-row-table-data-click';
        } else if (sameList[i].targetMaterialLotCode !== record.$form.getFieldValue('targetMaterialLotCode') && sameList[i].targetMaterialLotUuid === record.targetMaterialLotUuid) {
          return '';
        }
      }
    }
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

  @Bind()
  onEnterDown(e, record, index) {
    if (e.keyCode === 13) {
      this.sacnTargetCode(record.$form.getFieldValue('targetMaterialLotCode'), index, e);
    }
  }

  @Bind()
  handleChecked(event, checkList, str) {
    const { selectedRows = [] } = this.state;
    if (event.target.checked) {
      this.setState({ selectedRows: [...selectedRows, ...checkList] });
    } else {
      this.setState({ selectedRows: selectedRows.filter(e => e.targetMaterialLotUuid !== str) });
    }
  }

  // 全选可以打印的数据
  @Bind()
  selecteAllPrinter() {
    const {
      materialTransfer: { materialTransfersList = [] },
    } = this.props;
    const allPrinterList = materialTransfersList.filter(ele => ele.targetMaterialLotId);
    if (allPrinterList.length === 0) {
      notification.error({ message: '当前暂无可打印的数据！' });
    } else {
      notification.success({ message: `当前已勾选可打印数据：${allPrinterList.length} 条` });
      this.setState({ selectedRows: allPrinterList });
    }
  }

  // 全选可以保存的数据
  @Bind()
  selecteAllSave() {
    const {
      materialTransfer: { materialTransfersList = [] },
    } = this.props;
    const allSaveList = materialTransfersList.filter(ele => !ele.targetMaterialLotId);
    if (allSaveList.length === 0) {
      notification.error({ message: '当前暂无可保存的数据！' });
    } else {
      notification.success({ message: `当前已勾选可保存数据：${allSaveList.length} 条` });
      this.setState({ selectedRows: allSaveList });
    }
  }

  // 回车跳掉下一栏
  @Bind()
  handleTurnToNextInput(e, index) {
    const className = document.getElementsByClassName('target-materialLotCode-input');
    if (index + 1 < className.length) {
      className[index + 1].focus();
    }
  }


  render() {
    const {
      materialTransfer: {
        barCodeList = [],
        materialTransfersList = [],
        materialsInfo = {},
      },
      printingBarcodeLoading,
      onSubmitLoading,
    } = this.props;
    const { spinning, targetCardFlag, selectedRows, tableFlag } = this.state;
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
    const columns = [
      {
        title: (
          <span className="action-link">
            <Fragment>
              <a
                onClick={() => this.selecteAllPrinter()}
                style={{ fontSize: '16px' }}
              >
                <Icon type="printer" />
              </a>
              <a
                onClick={() => this.selecteAllSave()}
                style={{ fontSize: '16px' }}
              >
                <Icon type="save" />
              </a>
            </Fragment>
          </span>
        ),
        dataIndex: 'checkbox',
        width: 60,
        render: (val, record) => {
          return (
            <Checkbox
              value={selectedRows.map(e => e.targetMaterialLotUuid).includes(record.targetMaterialLotUuid)}
              onChange={(event) => this.handleChecked(event, materialTransfersList.filter(e => e.targetMaterialLotUuid === record.targetMaterialLotUuid), record.targetMaterialLotUuid)}
            />
          );
        },
      },
      {
        title: '目标编码',
        dataIndex: 'targetMaterialLotCode',
        width: 150,
        align: 'center',
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`targetMaterialLotCode`, {
                initialValue: val,
              })(
                <Input
                  trimAll
                  disabled={record.targetMaterialLotId}
                  onKeyDown={e => this.onEnterDown(e, record, index)}
                  className="target-materialLotCode-input"
                />)}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '物料名称',
        dataIndex: 'materialName',
        width: 150,
        align: 'center',
      },
      {
        title: 'SAP料号',
        dataIndex: 'materialCode',
        width: 150,
        align: 'center',
      },
      {
        title: 'LOT',
        dataIndex: 'lot',
        width: 80,
        align: 'center',
      },
      {
        title: '供应商',
        dataIndex: 'supplierName',
        width: 100,
        align: 'center',
      },
      {
        title: '供应商批次',
        dataIndex: 'supplierLot',
        width: 150,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`supplierLot`, {
                initialValue: val,
              })(
                <Input
                  disabled={record.targetMaterialLotId}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '单位',
        dataIndex: 'uomCode',
        width: 90,
        align: 'center',
      },
      {
        title: '目标数量',
        dataIndex: 'targetQty',
        width: 150,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`targetQty`, {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '目标数量',
                    }),
                  },
                ],
              })(
                <InputNumber
                  min={0}
                  formatter={value => `${value}`}
                  parser={value => this.limitDecimals(value, 5)}
                  style={{ width: '100%' }}
                  disabled={record.targetMaterialLotId}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '操作',
        dataIndex: 'operator',
        width: 100,
        align: 'center',
        render: (val, record, index) => (
          <span className="action-link">
            <Fragment>
              <a
                disabled={record.targetMaterialLotId}
                onClick={() => this.deleteTargetCard(index, record)}
                style={{ fontSize: '16px' }}
              >
                <Icon
                  type="delete"
                />
              </a>
              <a
                disabled={!record.targetMaterialLotId}
                onClick={() => this.printingBarcode([record.targetMaterialLotId])}
                style={{ fontSize: '16px' }}
              >
                <Icon type="printer" />
              </a>
              <a
                disabled={record.targetMaterialLotId || onSubmitLoading}
                onClick={() => this.onSubmit(record, index)}
                style={{ fontSize: '16px' }}
              >
                <Icon type="save" />
              </a>
            </Fragment>
          </span>
        ),
      },
    ];
    return (
      <Fragment>
        <Header title="物料转移">
          <Button
            onClick={() => this.batchPrinter()}
            loading={printingBarcodeLoading}
            icon='printer'
          >
            批量打印
          </Button>
          <Button
            onClick={() => this.batchDetermine()}
            icon='save'
            loading={onSubmitLoading}
          >
            批量确定
          </Button>
          <Button
            type="primary"
            onClick={() => this.createTargetCardFlag(true)}
            icon='plus'
          >
            新建
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
            <Row className={styles['material-transfer-second-row-table']}>
              <Col style={{ paddingLeft: '8px', paddingRight: '8px' }}>
                {tableFlag && (
                  <EditTable
                    bordered
                    loading={onSubmitLoading}
                    rowKey="targetMaterialLotUuid"
                    columns={columns}
                    dataSource={materialTransfersList}
                    pagination={false}
                    rowClassName={this.handleClickRow}
                  />
                )}
              </Col>
            </Row>
          </Spin>
          {targetCardFlag && <TargetCardConfig {...targetCardConfigProps} />}
        </Content>
      </Fragment>
    );
  }
}
