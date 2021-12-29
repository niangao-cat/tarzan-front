/*
 * @Description: 芯片退料
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-12-11 10:41:24
 * @LastEditTime: 2020-12-17 16:21:13
 */

import React, { Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { pullAllBy } from 'lodash';
import { DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import { Card, Table, Spin, Button } from 'hzero-ui';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import notification from 'utils/notification';
import Filter from './FilterForm';
import EnterSite from '@/components/EnterSite';
import gwPath from '@/assets/gw.png';
import styles from './index.less';
import ReturnDrawer from './ReturnDrawer/ReturnDrawer';

@connect(({ cosChipMaterialReturn, loading }) => ({
  cosChipMaterialReturn,
  tenantId: getCurrentOrganizationId(),
  fetchWorkOrderLoading: loading.effects['cosChipMaterialReturn/fetchWorkOrder'],
  scaneReturnBarCodeLoading: loading.effects['cosChipMaterialReturn/scaneReturnBarCode'],
  handleReturnConfirmLoading: loading.effects['cosChipMaterialReturn/handleReturnConfirm'],
  printingBarcodeLoading: loading.effects['cosChipMaterialReturn/printingBarcode'],
}))
export default class CosChipMaterialReturn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enterSiteVisible: true,
      enterSiteLoading: false,
      selectedRows: [],
      selectedMainRowKeys: [], // 主界面选中框主键
      selectedMainRows: [], // 主界面选中框数据
      tipText: '', // 按钮选择标识
    };
  }

  @Bind()
  accSub(num1, num2) {
    let r1;
    let r2;
    try {
      r1 = num1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = num2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    // eslint-disable-next-line no-restricted-properties
    const m = Math.pow(10, Math.max(r1, r2));
    const n = (r1 >= r2) ? r1 : r2;
    return (Math.round(num1 * m - num2 * m) / m).toFixed(n);
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'cosChipMaterialReturn/getSiteList',
      payload: {
        tenantId,
      },
    });
  }

  /**
   * @description: 输入工位
   * @param {Object} values 工位编码
   */
  @Bind()
  enterSite(val) {
    this.setState({ enterSiteLoading: true });
    const {
      dispatch,
      cosChipMaterialReturn: {
        defaultSite = {},
      },
    } = this.props;
    dispatch({
      type: 'cosChipMaterialReturn/enterSite',
      payload: {
        ...val,
        siteId: defaultSite.siteId,
      },
    }).then(res => {
      this.setState({ enterSiteLoading: false });
      if (res) {
        if (res.operationIdList.length > 1) {
          notification.error({ message: `当前${res.workcellName}存在多个工艺，请重新扫描！` });
        } else {
          this.setState({ enterSiteVisible: false });
        }
      }
    });
  }

  /**
   * @description: 查询工单信息
   * @param {val} object lov工单信息
   * @return {*}
   */
  @Bind()
  fetchWorkOrder(val) {
    const { dispatch } = this.props;
    dispatch({
      type: 'cosChipMaterialReturn/fetchWorkOrder',
      payload: {
        workOrderId: val.workOrderId,
      },
    });
  }

  /**
   * @description: 芯片退料
   * @param {record} object record
   * @return {*}
   */
  @Bind()
  handleReturnMaterial() {
    // 判断是否选择了数据
    if (this.state.selectedMainRowKeys.length === 0) {
      return notification.error({ message: '未勾选物料，请勾选！' });
    }
    const {
      dispatch,
      cosChipMaterialReturn: {
        record = {},
      },
    } = this.props;

    // 判断选中的数据是否有且只有一个物料组为3101-半导体芯片的数据, 没有则报错
    if (this.state.selectedMainRows.filter(item => item.itemGroup === "3101").length === 0) {
      return notification.error({ message: '芯片退料勾选物料的物料组必须为半导体，请确认！' });
    }

    if (this.state.selectedMainRows.filter(item => item.itemGroup === "3101").length > 1) {
      return notification.error({ message: '芯片退料勾选物料的物料组为半导体存在多条数据，请确认！' });
    }

    this.setState({ returnVisible: true, tipText: 'CHIP' });

    const fieldsValue = (this.formDom && filterNullValueObject(this.formDom.getFieldsValue())) || {};
    if (record.targetMaterialLotId) {
      dispatch({
        type: 'cosChipMaterialReturn/fetchWorkOrder',
        payload: {
          workOrderId: fieldsValue.workOrderId,
        },
      });
    }

    dispatch({
      type: 'cosChipMaterialReturn/updateState',
      payload: {
        record: this.state.selectedMainRows.filter(item => item.itemGroup === "3101")[0],
      },
    });
  }

  /**
   * @description: 贴片后退料
   * @param {record} object record
   * @return {*}
   */
  @Bind()
  handleTipReturnMaterial() {

    // 判断是否选择了数据
    if (this.state.selectedMainRowKeys.length === 0) {
      return notification.error({ message: '未勾选物料，请勾选！' });
    }

    // 判断选中的数据是否有且只有一个物料组为3101-半导体芯片的数据, 没有则报错
    if (this.state.selectedMainRows.filter(item => item.itemGroup === "3101").length === 0 || this.state.selectedMainRows.filter(item => item.itemGroup === "3102").length === 0) {
      return notification.error({ message: '需勾选物料组为半导体芯片和热沉，且两种物料类型均有，请检查！' });
    }

    if (this.state.selectedMainRows.filter(item => item.itemGroup === "3101").length > 1 || this.state.selectedMainRows.filter(item => item.itemGroup === "3102").length > 1) {
      return notification.error({ message: '芯片退料勾选物料的物料组为半导体和热沉存在多条数据，请确认！' });
    }

    this.setState({ returnVisible: true, tipText: 'HOT_SINK' });

    const {
      dispatch,
      cosChipMaterialReturn: {
        record = {},
      },
    } = this.props;
    const fieldsValue = (this.formDom && filterNullValueObject(this.formDom.getFieldsValue())) || {};
    if (record.targetMaterialLotId) {
      dispatch({
        type: 'cosChipMaterialReturn/fetchWorkOrder',
        payload: {
          workOrderId: fieldsValue.workOrderId,
        },
      });
    }
    dispatch({
      type: 'cosChipMaterialReturn/updateState',
      payload: {
        record: this.state.selectedMainRows.filter(item => item.itemGroup === "3101")[0],
      },
    });
  }

  /**
   * @description: 打线后退料
   * @param {record} object record
   * @return {*}
   */
  @Bind()
  handleDoReturnMaterial() {
    // 判断是否选择了数据
    if (this.state.selectedMainRowKeys.length === 0) {
      return notification.error({ message: '未勾选物料，请勾选！' });
    }

    // 判断选中的数据是否有且只有一个物料组为3101-半导体芯片的数据, 没有则报错
    if (this.state.selectedMainRows.filter(item => item.itemGroup === "3101").length === 0 || this.state.selectedMainRows.filter(item => item.itemGroup === "3102").length === 0 || this.state.selectedMainRows.filter(item => item.itemGroup === "1011").length === 0) {
      return notification.error({ message: '需勾选物料组为半导体芯片、热沉和金线，且三种物料类型均有，请检查！' });
    }

    if (this.state.selectedMainRows.filter(item => item.itemGroup === "3101").length > 1 || this.state.selectedMainRows.filter(item => item.itemGroup === "3102").length > 1 || this.state.selectedMainRows.filter(item => item.itemGroup === "1011").length > 1) {
      return notification.error({ message: '芯片退料勾选物料的物料组为半导体、热沉和金线存在多条数据，请确认！' });
    }

    this.setState({ returnVisible: true, tipText: 'WIRE_BOND' });
    const {
      dispatch,
      cosChipMaterialReturn: {
        record = {},
      },
    } = this.props;
    const fieldsValue = (this.formDom && filterNullValueObject(this.formDom.getFieldsValue())) || {};
    if (record.targetMaterialLotId) {
      dispatch({
        type: 'cosChipMaterialReturn/fetchWorkOrder',
        payload: {
          workOrderId: fieldsValue.workOrderId,
        },
      });
    }
    dispatch({
      type: 'cosChipMaterialReturn/updateState',
      payload: {
        record: this.state.selectedMainRows.filter(item => item.itemGroup === "3101")[0],
      },
    });
  }

  /**
   * @description: 关闭
   * @param {record} object record
   * @return {*}
   */
  @Bind()
  handleCloseMaterial(val = {}, flag) {
    this.setState({ returnVisible: flag });
    const {
      dispatch,
      cosChipMaterialReturn: {
        record = {},
      },
    } = this.props;
    const fieldsValue = (this.formDom && filterNullValueObject(this.formDom.getFieldsValue())) || {};
    if (record.targetMaterialLotId) {
      dispatch({
        type: 'cosChipMaterialReturn/fetchWorkOrder',
        payload: {
          workOrderId: fieldsValue.workOrderId,
        },
      });
    }
    dispatch({
      type: 'cosChipMaterialReturn/updateState',
      payload: {
        record: val,
        detailList: [],
        returnDataSource: [],
        detailSinkList: [],
        barCodeList: [],
      },
    });

    this.setState({ selectedRows: [] });
  }

  /**
   * @description: 扫描退料条码
   * @param {val} String 扫描的条码
   * @return {*}
   */
  @Bind
  scaneReturnBarCode(val) {
    const {
      dispatch,
      cosChipMaterialReturn: {
        barCodeList = [],
        record = {},
        detailList = [],
        returnDataSource = [],
        detailSinkList = [],
      },
    } = this.props;

    let barCodeArray = barCodeList;
    let detailArray = detailList;
    let returnArray = returnDataSource;
    let detailSinkArray = detailSinkList;

    // 判断是否要清空界面数据
    if ((returnArray.length > 0 && returnArray[0].targetMaterialLot) || (detailArray.length > 0 && detailArray[0].targetMaterialLot) || (detailSinkArray.length > 0 && detailSinkArray[0].targetMaterialLot)) {

      // 清空
      barCodeArray = [];
      detailArray = [];
      detailSinkArray = [];
      returnArray = [];

      // 清空目标条码
      this.formReturnDom.setFieldsValue({ "targetMaterialLotCode": '' });

      // 清空数据
      dispatch({
        type: 'cosChipMaterialReturn/updateState',
        payload: {
          barCodeList: [],
          detailList: [],
          returnDataSource: [],
          detailSinkList: [],
        },
      });
    }

    if (barCodeArray.filter(item => item.materialLotCode === val.materialLotCode).length > 0) {
      return notification.error({ message: `当前条码${val.materialLotCode}已扫描` });
    }
    const fieldsValue = (this.formDom && filterNullValueObject(this.formDom.getFieldsValue())) || {};
    dispatch({
      type: 'cosChipMaterialReturn/scaneReturnBarCode',
      payload: {
        workOrderId: fieldsValue.workOrderId,
        materialLotCode: val.materialLotCode,
        materialId: record.materialId,
        returnType: this.state.tipText,
      },
    }).then(res => {
      if (res) {
        if (barCodeArray.length > 0 && (barCodeArray[0].supplierId !== res.supplierId || barCodeArray[0].waferNum !== res.waferNum)) {
          return notification.error({ message: `当前条码供应商或wafer与条码列表不一致！` });
        }

        // 判断选择按钮的类型进行不同的数据显示
        let list = detailArray; // 界面显示数据
        let returnList = returnArray;
        if (this.state.tipText === "CHIP") {
          list = []; // 清空数据
        }
        if (this.state.tipText === "HOT_SINK" || this.state.tipText === "WIRE_BOND") {
          const dataSink = this.state.selectedMainRows.filter(item => item.itemGroup === "3102")[0];
          // 根据返回的信息 进行数据处理, 存在物料编码，供应商， 批次存在则合并， 不存在则添加
          if (res.hotSinkList.length > 0) {
            if (detailArray.length === 0) {
              list = res.hotSinkList.map(item => { return { ...item, availableQty: dataSink.returnQty }; });
            } else {

              // 先合并存在的
              for (let i = 0; i < list.length; i++) {
                for (let j = 0; j < res.hotSinkList.length; j++) {
                  if (list[i].materialCode === res.hotSinkList[j].materialCode && list[i].supplierId === res.hotSinkList[j].supplierId && list[i].supplierLot === res.hotSinkList[j].supplierLot) {
                    list[i].returnQty = Number(list[i].returnQty) + Number(res.hotSinkList[j].returnQty);
                    list[i].availableQty = dataSink.returnQty;
                  }
                }
              }

              // 再添加不存在的
              for (let j = 0; j < res.hotSinkList.length; j++) {
                if (detailArray.filter(item => item.materialCode === res.hotSinkList[j].materialCode && item.supplierId === res.hotSinkList[j].supplierId && item.supplierLot === res.hotSinkList[j].supplierLot).length === 0) {
                  list = [...list, { ...res.hotSinkList[j], availableQty: dataSink.returnQty }];
                }
              }
            }
          }

          if (res.cosReturnList.length > 0) {
            if (returnArray.length === 0) {
              returnList = res.cosReturnList.map(item => { return { ...item, availableQty: dataSink.returnQty }; });
            } else {

              // 先合并存在的
              for (let i = 0; i < returnList.length; i++) {
                for (let j = 0; j < res.cosReturnList.length; j++) {
                  if (returnList[i].materialCode === res.cosReturnList[j].materialCode && returnList[i].supplierId === res.cosReturnList[j].supplierId && returnList[i].supplierLot === res.cosReturnList[j].supplierLot) {
                    returnList[i].returnQty = Number(returnList[i].returnQty) + Number(res.cosReturnList[j].returnQty);
                    returnList[i].availableQty = dataSink.returnQty;
                  }
                }
              }

              // 再添加不存在的
              for (let j = 0; j < res.cosReturnList.length; j++) {
                if (returnArray.filter(item => item.materialCode === res.cosReturnList[j].materialCode && item.supplierId === res.cosReturnList[j].supplierId && item.supplierLot === res.cosReturnList[j].supplierLot).length === 0) {
                  returnList = [...returnList, { ...res.cosReturnList[j], availableQty: dataSink.returnQty }];
                }
              }
            }
          }
        }
        let listSink = detailSinkArray; // 界面显示数据
        if (this.state.tipText === "WIRE_BOND") {
          const dataWire = this.state.selectedMainRows.filter(item => item.itemGroup === "1011")[0];
          // 根据返回的信息 进行数据处理, 存在物料编码，供应商， 批次存在则合并， 不存在则添加
          if (res.wireBondList.length > 0) {
            if (detailSinkArray.length === 0) {
              listSink = res.wireBondList.map(item => { return { ...item, availableQty: dataWire.returnQty }; });
            } else {

              // 先合并存在的
              for (let i = 0; i < listSink.length; i++) {
                for (let j = 0; j < res.wireBondList.length; j++) {
                  if (listSink[i].materialCode === res.wireBondList[j].materialCode && listSink[i].supplierId === res.wireBondList[j].supplierId && listSink[i].supplierLot === res.wireBondList[j].supplierLot) {
                    listSink[i].returnQty = Number(listSink[i].returnQty) + Number(res.wireBondList[j].returnQty);
                    list[i].availableQty = dataWire.returnQty;
                  }
                }
              }

              // 再添加不存在的
              for (let j = 0; j < res.wireBondList.length; j++) {
                if (detailSinkArray.filter(item => item.materialCode === res.wireBondList[j].materialCode && item.supplierId === res.wireBondList[j].supplierId && item.supplierLot === res.wireBondList[j].supplierLot).length === 0) {
                  listSink = [...listSink, { ...res.wireBondList[j], availableQty: dataWire.returnQty }];
                }
              }
            }
          }
        }
        dispatch({
          type: 'cosChipMaterialReturn/updateState',
          payload: {
            barCodeList: [
              {
                ...res,
              },
              ...barCodeArray,
            ],
            detailList: list,
            detailSinkList: listSink,
            returnDataSource: returnList,
          },
        });
      }
    });
  }

  @Bind
  scaneTargetBarCode(val) {
    const {
      dispatch,
      cosChipMaterialReturn: {
        barCodeList = [],
      },
    } = this.props;
    if (barCodeList.filter(item => item.materialLotCode === val.materialLotCode).length > 0) {
      this.formReturnDom.setFieldsValue({
        targetMaterialLotCode: null,
      });
      return notification.error({ message: `当前条码${val}已存在退料条码列表中` });
    }
    dispatch({
      type: 'cosChipMaterialReturn/scaneTargetBarCode',
      payload: {
        materialLotCode: val.materialLotCode,
      },
    }).then(res => {
      if (!res) {
        this.formReturnDom.setFieldsValue({
          targetMaterialLotCode: null,
        });
      }
    });
  }

  /**
   * @description: 删除
   * @param {*}
   * @return {*}
   */
  @Bind()
  handleDelete() {
    const {
      dispatch,
      cosChipMaterialReturn: {
        barCodeList = [],
        detailList = [],
        detailSinkList = [],
      },
    } = this.props;
    const { selectedRows } = this.state;

    // 根据选中的条码数量， 去掉显示的数据
    if (this.state.tipText === 'HOT_SINK' || this.state.tipText === 'WIRE_BOND') {

      // 将对应的数据通过物料+供应商+批次 进行 数量相减
      for (let i = 0; i < detailList.length; i++) {
        for (let j = 0; j < selectedRows.length; j++) {
          if (this.state.tipText === 'HOT_SINK' || this.state.tipText === 'WIRE_BOND') {
            for (let x = 0; x < selectedRows[j].hotSinkList.length; x++) {
              if (detailList[i].materialCode === selectedRows[j].hotSinkList[x].materialCode && detailList[i].supplierId === selectedRows[j].hotSinkList[x].supplierId && detailList[i].supplierLot === selectedRows[j].hotSinkList[x].supplierLot) {
                detailList[i].returnQty = Number(detailList[i].returnQty) - Number(selectedRows[j].hotSinkList[x].returnQty);
              }
            }
          }
        }
      }

      // 根据将对应的数据通过物料+供应商+批次 进行 数量相减
      for (let i = 0; i < detailSinkList.length; i++) {
        for (let j = 0; j < selectedRows.length; j++) {
          if (this.state.tipText === 'WIRE_BOND') {
            for (let x = 0; x < selectedRows[j].wireBondList.length; x++) {
              if (detailSinkList[i].materialCode === selectedRows[j].wireBondList[x].materialCode && detailSinkList[i].supplierId === selectedRows[j].wireBondList[x].supplierId && detailSinkList[i].supplierLot === selectedRows[j].wireBondList[x].supplierLot) {
                detailSinkList[i].returnQty = Number(detailSinkList[i].returnQty) - Number(selectedRows[j].wireBondList[x].returnQty);
              }
            }
          }
        }
      }
    }
    dispatch({
      type: 'cosChipMaterialReturn/updateState',
      payload: {
        barCodeList: pullAllBy(barCodeList, selectedRows, 'materialLotId'),
        detailList: detailList.length > 0 ? detailList.filter(item => item.returnQty > 0) : [],
        detailSinkList: detailSinkList.length > 0 ? detailSinkList.filter(item => item.returnQty > 0) : [],
      },
    });
    this.setState({ selectedRows: [] });
  }

  /**
   * 数据选择操作
   */
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRows) {
    this.setState({ selectedRows });
  }

  @Bind()
  handleSelectedRows(record, selected) {
    const { selectedRows } = this.state;
    if (selected) {
      this.setState({ selectedRows: selectedRows.concat([record]) });
    } else {
      this.setState({ selectedRows: selectedRows.filter(e => e.materialId !== record.materialId) });
    }
  }

  @Bind()
  handleAllSelectedRows(selected, dataSource) {
    const { selectedRows } = this.state;
    if (selected) {
      this.setState({ selectedRows: selectedRows.concat(dataSource) });
    } else {
      const materialIds = dataSource.map(e => e.materialId);
      this.setState({ selectedRows: selectedRows.filter(e => !materialIds.includes(e.materialId)) });
    }
  }

  /**
   * 数据选择操作
   */
  @Bind()
  handleSelectMainRow(selectedMainRowKeys, selectedMainRows) {
    this.setState({ selectedMainRowKeys, selectedMainRows });
  }

  /**
   * @description: 退料确认
   * @param {values} object 退料信息
   * @return {*}
   */
  @Bind()
  handleReturnConfirm(values) {
    const {
      dispatch,
      cosChipMaterialReturn: {
        workcellInfo = {},
        record = {},
        barCodeList = [],
        detailList = [],
        detailSinkList = [],
        returnDataSource = [],
      },
    } = this.props;
    const { selectedRows } = this.state;
    if (barCodeList.length === 0) {
      return notification.error({ message: '条码列表为空，不能进行退料！' });
    }
    // 数组列表求和
    const qtyCount = barCodeList.reduce((qtySum, currBarCodeList) => {
      return qtySum + currBarCodeList.qty;
    }, 0);
    if (Number(qtyCount) > Number(values.returnQty)) {
      return notification.error({ message: `总退料数量${qtyCount}大于可退料数量${values.returnQty}` });
    }
    const fieldsValue = (this.formDom && filterNullValueObject(this.formDom.getFieldsValue())) || {};
    const selectedMaterialId = selectedRows.map(e => e.materialId);
    dispatch({
      type: 'cosChipMaterialReturn/handleReturnConfirm',
      payload: {
        ...values,
        ...record,
        backQty: qtyCount,
        workcellId: workcellInfo.workcellId,
        workOrderId: fieldsValue.workOrderId,
        barcodeVOList: barCodeList,
        hotSinkList: detailList.map(e => ({ ...e, hotSinkFlag: selectedMaterialId.includes(e.materialId) ? 'Y' : 'N' })),
        wireBondList: detailSinkList.map(e => ({ ...e, wireBondFlag: selectedMaterialId.includes(e.materialId) ? 'Y' : 'N' })),
        cosReturnList: returnDataSource.map(e => ({ ...e, cosReturnFlag: selectedMaterialId.includes(e.materialId) ? 'Y' : 'N' })),
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.formReturnDom.resetFields();
        // 设置显示列表
        dispatch({
          type: 'cosChipMaterialReturn/updateState',
          payload: {
            barCodeList: [],
            record: { ...record, ...res, returnQty: this.accSub(values.returnQty, qtyCount) },
            detailList: res.hotSinkList.length > 0 ? res.hotSinkList : [],
            detailSinkList: res.wireBondList.length > 0 ? res.wireBondList : [],
          },
        });
      }
    });
  }

  @Bind()
  handlePrinting() {
    const {
      dispatch,
      cosChipMaterialReturn: {
        barCodeList = [],
        record = {},
        detailList = [],
        detailSinkList = [],
      },
    } = this.props;
    let atrr = [];
    if (record.targetMaterialLotId) {
      atrr = [record.targetMaterialLotId];
    }

    atrr = [...atrr, ...barCodeList.filter(item => item.targetMaterialLotId).map(item => item.targetMaterialLotId)];
    atrr = [...atrr, ...detailList.filter(item => item.targetMaterialLotId).map(item => item.targetMaterialLotId)];
    atrr = [...atrr, ...detailSinkList.filter(item => item.targetMaterialLotId).map(item => item.targetMaterialLotId)];
    dispatch({
      type: 'cosChipMaterialReturn/printingBarcode',
      payload: atrr,
    }).then(res => {
      if (res.failed) {
        notification.error({ message: res.exception });
      } else {
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

  @Bind()
  handleFormReset() {
    const {
      dispatch,
      cosChipMaterialReturn: {
        record = {},
      },
    } = this.props;
    dispatch({
      type: 'cosChipMaterialReturn/updateState',
      payload: {
        barCodeList: [],
        detailList: [],
        detailSinkList: [],
        returnDataSource: [],
        record: {
          ...record,
          targetMaterialLotCode: null,
          targetMaterialLotId: null,
        },
      },
    });
  }

  render() {
    const {
      cosChipMaterialReturn: {
        workcellInfo = {},
        returnInfo = {},
        lovData = {},
        record = {},
        barCodeList = [],
        detailList = [],
        returnDataSource = [],
        detailSinkList = [],
      },
      fetchWorkOrderLoading,
      scaneReturnBarCodeLoading,
      handleReturnConfirmLoading,
      printingBarcodeLoading,
      tenantId,
    } = this.props;
    const { enterSiteVisible, enterSiteLoading, returnVisible, selectedRows } = this.state;
    const { woType = [], woStatus = [] } = lovData;
    const filterFormProps = {
      returnInfo,
      tenantId,
      workcellInfo,
      woType,
      woStatus,
      fetchWorkOrder: this.fetchWorkOrder,
      onRef: node => {
        this.formDom = node.props.form;
      },
    };
    const enterSiteProps = {
      visible: enterSiteVisible,
      loading: enterSiteLoading || enterSiteLoading,
      closePath: '/hhme/cos-chip-material-return',
      enterSite: this.enterSite,
    };

    // 主界面选中的数据
    const rowsSelection = {
      selectedRowKeys: this.state.selectedMainRowKeys,
      onChange: this.handleSelectMainRow,
    };

    const returnDrawerProps = {
      record,
      barCodeList,
      returnDataSource,
      visible: returnVisible,
      dataSource: barCodeList,
      dataSourceList: detailList,
      dataSourceSinkList: detailSinkList,
      loading: scaneReturnBarCodeLoading,
      workcellInfo,
      handleReturnConfirmLoading,
      printingBarcodeLoading,
      tipText: this.state.tipText,
      selectedRows,
      onRef: node => {
        this.formReturnDom = node.props.form;
      },
      onCancel: this.handleCloseMaterial,
      handlePrinting: this.handlePrinting,
      handleDelete: this.handleDelete,
      scaneReturnBarCode: this.scaneReturnBarCode,
      handleReturnConfirm: this.handleReturnConfirm,
      onSelectRow: this.handleSelectedRows,
      onSelectAllRows: this.handleAllSelectedRows,
      handleFormReset: this.handleFormReset,
    };
    const columns = [
      {
        title: '序号',
        width: 70,
        dataIndex: 'instructionLineNum',
        align: 'center',
        render: (val, _record, index) => index + 1,
      },
      {
        title: '组件编码',
        width: 100,
        dataIndex: 'materialCode',
      },
      {
        title: '组件描述',
        width: 100,
        dataIndex: 'materialName',
      },
      {
        title: '单位',
        width: 80,
        dataIndex: 'uomCode',
      },
      {
        title: '单位用量',
        width: 100,
        dataIndex: 'qty',
      },
      {
        title: '需求数量',
        width: 100,
        dataIndex: 'demandQty',
      },
      {
        title: '装配数量',
        width: 100,
        dataIndex: 'assembleQty',
      },
      {
        title: '退料数量',
        width: 100,
        dataIndex: 'returnQty1',
      },
      {
        title: '可退料数量',
        width: 100,
        dataIndex: 'returnQty',
      },
    ];
    return (
      <Fragment>
        <Header title='COS芯片退料'>
          <Card className={styles['cos-chip-material-return-site-card']}>
            <div style={{ float: 'left' }}><img src={gwPath} alt="" /></div>
            <div style={{
              float: 'left', padding: '2px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '255px',
            }}
            >当前工位：{workcellInfo.workcellName}
            </div>
          </Card>
          <Button onClick={this.handleDoReturnMaterial} style={{ marginRight: '5px' }}>打线后退料</Button>
          <Button onClick={this.handleTipReturnMaterial}>贴片后退料</Button>
          <Button onClick={this.handleReturnMaterial}>芯片退料</Button>
        </Header>
        <Content>
          <Spin spinning={fetchWorkOrderLoading || false}>
            <Filter {...filterFormProps} />
            <Card
              key="code-rule-header"
              title='工单组件'
              bordered={false}
              className={DETAIL_CARD_TABLE_CLASSNAME}
            >
              <Table
                bordered
                rowKey="materialId"
                dataSource={returnInfo.bomComment}
                rowSelection={rowsSelection}
                pagination={false}
                columns={columns}
              />
            </Card>
          </Spin>
          {enterSiteVisible && <EnterSite {...enterSiteProps} />}
          {returnVisible && <ReturnDrawer {...returnDrawerProps} />}
        </Content>
      </Fragment>
    );
  }
}
