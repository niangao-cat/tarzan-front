import React, { Component, Fragment } from 'react';
import { Content, Header } from 'components/Page';
import { connect } from 'dva';
import { Button, Col, Input, Row, Form, notification, Spin, Tooltip, Icon, Modal } from 'hzero-ui';
import { routerRedux } from 'dva/router';
import EditTable from 'components/EditTable';
import { Bind } from 'lodash-decorators';
import {
  getCurrentOrganizationId,
  addItemToPagination,
  delItemToPagination,
  getEditTableData,
  filterNullValueObject,
} from 'utils/utils';
import { isEmpty, unionBy } from 'lodash';
import FilterForm from './FilterForm';
import TopFormInfo from './TopFormInfo';
import ListTableRow from './ListTableRow';
import styles from './index.less';
import ExpandCreateDrawer from './ExpandCreateOneDrawer';
import UpdateCodeDrawer from './UpdateCodeDrawer';
import BadNumberBarcode from './BadNumberBarcode';

@connect(({ iqcInspectionPlatform, loading }) => ({
  iqcInspectionPlatform,
  tenantId: getCurrentOrganizationId(),
  fetchDataLoading: loading.effects['iqcInspectionPlatform/queryInspectData'],
  fetchMaterialLotCodeLoading: loading.effects['iqcInspectionPlatform/fetchMaterialLotCode'],
  updateMaterialLotCodeLoading: loading.effects['iqcInspectionPlatform/updateMaterialLotCode'],
}))
@Form.create({ fieldNameProp: null })
export default class TicketManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 获取上传界面数据
      expandFlag: false,
      badNumberBarcodeFlag: false,
      uploadCodeVisible: false,
      loading: false,
      search: {}, // 选中的数据
      selectArr: [],
      selectArrKeys: [],
      badNumberBarcodeDatas: {},
      selectedRowKeys: [],
      selectedRows: [],
    };
  }

  filterForm;

  topForm;

  componentDidMount() {
    // 获取状态和数据
    const { dispatch } = this.props;

    const { iqcNumber } = this.props.match.params;

    this.setState({ search: { iqcNumber } });
    // 加载下拉数据
    dispatch({
      type: 'iqcInspectionPlatform/init',
    });

    // 查询头行信息
    dispatch({
      type: 'iqcInspectionPlatform/queryInspectData',
      payload: {
        iqcNumber,
      },
    });
  }

  // 查询方法
  @Bind()
  onSearch(fields = {}) {
    // 设置接口调用参数
    const { dispatch } = this.props;
    this.setState({
      search: { ...fields },
    });
    // jiek调用
    dispatch({
      type: 'iqcInspectionPlatform/queryInspectData',
      payload: {
        ...fields,
      },
    }).then(() => {
      const {
        iqcInspectionPlatform: { inspectHeadData = {} },
      } = this.props;
      this.filterForm.setFieldsValue({ iqcNumber: inspectHeadData.iqcNumber });
    });
  }

  // 查询方法
  @Bind()
  onSearchByPagination(pagination = {}) {
    // 设置接口调用参数
    const {
      dispatch,
      iqcInspectionPlatform: { inspectHeadData = {} },
    } = this.props;

    //  行信息调用
    dispatch({
      type: 'iqcInspectionPlatform/queryInspectLineData',
      payload: {
        iqcHeaderId: inspectHeadData.iqcHeaderId,
        page: pagination,
      },
    });
  }

  // 行点击触发事件
  @Bind()
  onClickRow(record = {}) {
    const { dispatch } = this.props;
    //  行信息调用
    dispatch({
      type: 'iqcInspectionPlatform/updateState',
      payload: {
        inspectLineSelect: record,
      },
    });
  }

  /**
   * 获取查询表单组件this对象
   * @param {object} ref - 查询表单组件this
   */
  @Bind
  handleBindRef(ref) {
    this.filterForm = (ref.props || {}).form;
  }

  /**
   * 获取查询表单组件this对象
   * @param {object} ref - 查询表单组件this
   */
  @Bind
  handleBindTopRef(ref) {
    this.topForm = (ref.props || {}).form;
  }

  // 变幻时调用更新
  @Bind()
  changeValueOne = (value, index, record) => {
    const {
      dispatch,
      iqcInspectionPlatform: { inspectHeadData = {}, inspectLineData = [], inspectLineSelect = {} },
    } = this.props;

    // 获取选中的数据并且改掉对应的明细信息

    for (let i = 0; i < inspectLineData.length; i++) {
      if (inspectLineData[i].iqcLineId === inspectLineSelect.iqcLineId) {
        // inspectLineData[i].detailList[index].result = value.target.value;
        // 根据对应的临时主键显示对应的值
        for (let j = 0; j < inspectLineData[i].detailList.length; j++) {
          if (inspectLineData[i].detailList[j].detailId === record.detailId) {
            inspectLineData[i].detailList[j].result = value.target.value;
          }
        }

        // 判断明细的数据变化
        let changeStatusFlag = true;
        for (let j = 0; j < inspectLineData[i].detailList.length; j++) {
          if (
            inspectLineData[i].detailList[j].result === null ||
            inspectLineData[i].detailList[j].result === undefined ||
            inspectLineData[i].detailList[j].result === ''
          ) {
            changeStatusFlag = false;
          }
        }
        // 当值全部输入时 判断其 合格数
        if (changeStatusFlag) {
          // 设置合格范围
          const okRange =
            inspectLineData[i].standardRange === undefined
              ? []
              : inspectLineData[i].standardRange.split('~');
          // 设置 不合格上线
          const ngOver =
            inspectLineData[i].acSplitRe === undefined
              ? []
              : inspectLineData[i].acSplitRe.split('/');
          // 初始化不合格数/ 合格数
          let ngCount = 0;
          let okCount = 0;
          if (okRange.length > 0) {
            for (let j = 0; j < inspectLineData[i].detailList.length; j++) {
              if (
                Number(inspectLineData[i].detailList[j].result) > Number(okRange[1]) ||
                Number(inspectLineData[i].detailList[j].result) < Number(okRange[0])
              ) {
                ngCount++;
              }
              if (
                Number(inspectLineData[i].detailList[j].result) <= Number(okRange[1]) &&
                Number(inspectLineData[i].detailList[j].result) >= Number(okRange[0])
              ) {
                okCount++;
              }
            }

            // 根据不合格上限 判断对应的信息
            if (ngOver.length > 0) {
              if (Number(ngOver[0]) >= ngCount) {
                inspectLineData[i].inspectionResult = 'OK';
              } else {
                inspectLineData[i].inspectionResult = 'NG';
              }
            } else {
              inspectLineData[i].inspectionResult = 'NG';
            }
          }

          // 填写合格数/不合格数
          inspectLineData[i].ngQty = ngCount;
          inspectLineData[i].okQty = okCount;
        }

        dispatch({
          type: 'iqcInspectionPlatform/updateState',
          payload: {
            inspectLineData,
            inspectLineSelect: inspectLineData[i],
          },
        });
        break;
      }
    }

    // 最终更具变化的行信息  填写头信息
    let setHeadOkStatusFlag = true;
    for (let i = 0; i < inspectLineData.length; i++) {
      if (inspectLineData[i].inspectionResult !== 'OK') {
        setHeadOkStatusFlag = false;
      }
    }

    if (setHeadOkStatusFlag) {
      inspectHeadData.inspectionResultMeaning = 'OK';
    } else {
      inspectHeadData.inspectionResultMeaning = 'NG';
    }

    dispatch({
      type: 'iqcInspectionPlatform/updateState',
      payload: {
        inspectHeadData,
        inspectLineData,
      },
    });
  };

  changeValueTwo = (value, index, record) => {
    const {
      dispatch,
      iqcInspectionPlatform: { inspectLineData = [], inspectLineSelect = {} },
    } = this.props;

    // 获取选中的数据并且改掉对应的明细信息

    for (let i = 0; i < inspectLineData.length; i++) {
      if (inspectLineData[i].iqcLineId === inspectLineSelect.iqcLineId) {
        // inspectLineData[i].detailList[index].remark = value.target.value;
        // 根据对应的临时主键显示对应的值
        for (let j = 0; j < inspectLineData[i].detailList.length; j++) {
          if (inspectLineData[i].detailList[j].detailId === record.detailId) {
            inspectLineData[i].detailList[j].remark = value.target.value;
          }
        }
        dispatch({
          type: 'iqcInspectionPlatform/updateState',
          payload: {
            inspectLineData,
            inspectLineSelect: inspectLineData[i],
          },
        });
        break;
      }
    }

    dispatch({
      type: 'iqcInspectionPlatform/updateState',
      payload: {
        inspectLineData,
      },
    });
  };

  // 保存数据
  @Bind
  handSaveData() {
    // 加载
    this.setState({ loading: true });

    const formData = this.topForm.getFieldsValue();
    // 设置接口调用参数
    const {
      dispatch,
      iqcInspectionPlatform: { inspectHeadData = {}, inspectLineData = [] },
    } = this.props;

    // 判断 当行有数据时， 进行 随机赋值
    for (let i = 0; i < inspectLineData.length; i++) {
      inspectLineData[i].sampleSize = inspectLineData[i].sampleSizeTem;
    }

    dispatch({
      type: 'iqcInspectionPlatform/saveInspectAllData',
      payload: {
        ...inspectHeadData,
        ...formData,
        lineList: [...inspectLineData],
      },
    }).then(res => {
      // 关闭加载
      this.setState({ loading: false });
      if (!res) {
        notification.error({ message: '保存失败' });
      } else {
        // 查询头行信息
        dispatch({
          type: 'iqcInspectionPlatform/queryInspectData',
          payload: {
            ...this.state.search,
          },
        });
        notification.success({ message: '保存成功' });
      }
    });
  }

  // 提交
  @Bind
  handSubmitData() {
    const formData = this.topForm.getFieldsValue();
    // 设置接口调用参数
    const {
      dispatch,
      iqcInspectionPlatform: { inspectHeadData = {}, inspectLineData = [] },
    } = this.props;

    // 判断检验状态是否填写  没有则报错
    if (
      formData.inspectionResult === undefined ||
      formData.inspectionResult === '' ||
      formData.inspectionResult === null
    ) {
      return notification.error({ message: '单据头的检验结果为空，不允许提交' });
    }

    if (inspectLineData.length > 0) {
      if (
        inspectLineData.filter(
          item =>
            item.inspectionResult === undefined ||
            item.inspectionResult === '' ||
            item.inspectionResult === null
        ).length > 0
      ) {
        return notification.error({ message: '单据行的检验结果部分为空，不允许提交' });
      }
    }

    Modal.confirm({
      title: '执行后数据无法修改, 是否继续执行',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 加载
        this.setState({ loading: true });

        // 判断 当行有数据时， 进行 随机赋值
        for (let i = 0; i < inspectLineData.length; i++) {
          inspectLineData[i].sampleSize = inspectLineData[i].sampleSizeTem;
        }

        dispatch({
          type: 'iqcInspectionPlatform/submitInspectAllData',
          payload: {
            ...inspectHeadData,
            ...formData,
            lineList: [...inspectLineData],
            instructionId: inspectHeadData.inspectionId,
          },
        }).then(res => {
          // 查询头行信息
          dispatch({
            type: 'iqcInspectionPlatform/queryInspectData',
            payload: {
              ...this.state.search,
            },
          });
          // 关闭加载
          this.setState({ loading: false });
          if (!res) {
            notification.error({ message: '提交失败' });
          } else {
            notification.success({ message: '提交成功' });
          }
        });
      },
    });
  }

  // 关闭窗口调用方法
  @Bind
  expandColseData() {
    // 更改展示状态
    this.setState({
      expandFlag: false,
    });

    const { search } = this.state;
    // 重新查询
    this.onSearch(search);
  }

  // 打开窗口调用方法
  @Bind
  expandOpenData() {
    // 更改展示状态
    this.setState({
      expandFlag: true,
    });
  }

  // 打开窗口调用方法
  @Bind
  changeBackColor(record) {
    const {
      iqcInspectionPlatform: { inspectLineSelect = {} },
    } = this.props;
    if (record.iqcLineId === inspectLineSelect.iqcLineId) {
      return styles['data-click'];
    } else {
      return '';
    }
  }

  // 回车跳掉下一栏
  @Bind()
  handleTurnToNextInput(e, index) {
    const className = document.getElementsByClassName('code-input');
    if (index + 1 < className.length) {
      className[index + 1].focus();
    }
  }

  // 返回上一层
  @Bind()
  onBackBtnClick() {
    const {
      dispatch,
      iqcInspectionPlatform: {
        inspectHeadData = {},
        inspectLineData = [],
        inspectLineBeforeData = [],
      },
    } = this.props;
    const formData = this.topForm.getFieldsValue();
    if (
      (inspectHeadData.remark || "") === (formData.remark || "") &&
      (inspectHeadData.inspectionResult || "") === (formData.inspectionResult || "") &&
      (inspectHeadData.okQty || 0) === (formData.okQty || 0) &&
      (inspectHeadData.ngQty || 0) === (formData.ngQty || 0)
    ) {
      if (JSON.stringify(inspectLineData) === JSON.stringify(inspectLineBeforeData)) {
        dispatch(
          routerRedux.push({
            pathname: `/hwms/iqc-inspection-platform/list`,
          })
        );
      } else {
        Modal.confirm({
          title: '你有修改未保存，是否确认离开？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            dispatch(
              routerRedux.push({
                pathname: `/hwms/iqc-inspection-platform/list`,
              })
            );
          },
        });
      }
    } else {
      Modal.confirm({
        title: '你有修改未保存，是否确认离开？',
        cancelText: '取消',
        onOk: () => {
          dispatch(
            routerRedux.push({
              pathname: `/hwms/iqc-inspection-platform/list`,
            })
          );
        },
      });
    }
  }

  // 打开条码不良数页面
  @Bind
  scanningBarCodeVisible() {
    const {
      iqcInspectionPlatform: { inspectHeadData = {} },
    } = this.props;
    this.setState({
      badNumberBarcodeDatas: inspectHeadData,
      badNumberBarcodeFlag: true,
    });
    const { dispatch } = this.props;
    // 查询不良数页面信息
    dispatch({
      type: 'iqcInspectionPlatform/queryBadNumberBarcode',
      payload: {
        inspectionId: inspectHeadData.inspectionId,
      },
    });
  }

  // 条码不良数分页触发方法
  @Bind
  badNumberBarcodeChange(fields = {}) {
    const { dispatch } = this.props;
    // 根据页数查询报表明细信息
    dispatch({
      type: 'iqcInspectionPlatform/queryBadNumberBarcode',
      payload: {
        inspectionId: this.state.badNumberBarcodeDatas.inspectionId,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  // 关闭条码不良数页面
  @Bind
  badNumberBarcodeCancel() {
    this.setState({
      badNumberBarcodeFlag: false,
    });
  }

  // 条码不良数删除
  @Bind
  handleBadNumberBarcodeDelete(record, index) {
    const {
      dispatch,
      iqcInspectionPlatform: {
        badNumberBarcodeList = [],
        badNumberBarcodePagination = {},
        inspectHeadData = {},
      },
    } = this.props;
    if (record._status === 'create') {
      badNumberBarcodeList.splice(index, 1);
      dispatch({
        type: 'iqcInspectionPlatform/updateState',
        payload: {
          badNumberBarcodeList,
          badNumberBarcodePagination: delItemToPagination(1, badNumberBarcodePagination),
          inspectHeadData,
        },
      });
    } else {
      dispatch({
        type: 'iqcInspectionPlatform/deleteBadNumberBarcode',
        payload: [record],
      }).then(res => {
        if (res) {
          badNumberBarcodeList.splice(index, 1);
          notification.success({ message: '删除成功' });
          inspectHeadData.ncQty = Number(inspectHeadData.ncQty) - Number(record.ncQty);
          dispatch({
            type: 'iqcInspectionPlatform/updateState',
            payload: {
              inspectHeadData,
            },
          });
          // 查询不良数页面信息
          dispatch({
            type: 'iqcInspectionPlatform/queryBadNumberBarcode',
            payload: {
              inspectionId: this.state.badNumberBarcodeDatas.inspectionId,
            },
          });
        }
      });
    }
  }

  // 条码值改变事件
  @Bind
  changeBarcodeValue(vals, index) {
    const {
      dispatch,
      iqcInspectionPlatform: { badNumberBarcodeList = [] },
    } = this.props;
    badNumberBarcodeList[index].materialLotCode = vals.target.value;

    dispatch({
      type: 'iqcInspectionPlatform/updateState',
      payload: {
        badNumberBarcodeList,
      },
    });
  }

  // 条码回车触发事件
  @Bind
  handleBarcodeEnter(e, index) {
    const {
      dispatch,
      iqcInspectionPlatform: { badNumberBarcodeList = [] },
    } = this.props;
    badNumberBarcodeList[index].materialLotCode = e.target.value;

    dispatch({
      type: 'iqcInspectionPlatform/updateState',
      payload: {
        badNumberBarcodeList,
      },
    });
  }

  // 不良数量值改变事件
  @Bind
  changeNcQty(value, index) {
    const {
      dispatch,
      iqcInspectionPlatform: { badNumberBarcodeList = [] },
    } = this.props;
    badNumberBarcodeList[index].ncQty = value;

    dispatch({
      type: 'iqcInspectionPlatform/updateState',
      payload: {
        badNumberBarcodeList,
      },
    });
  }

  // 条码不良数保存
  @Bind
  badNumberBarcodeSave() {
    const {
      dispatch,
      iqcInspectionPlatform: { badNumberBarcodeList = [], inspectHeadData = {} },
    } = this.props;
    for (let i = 0; i < badNumberBarcodeList.length; i++) {
      if (
        badNumberBarcodeList[i].materialLotCode === undefined ||
        badNumberBarcodeList[i].materialLotCode === null ||
        badNumberBarcodeList[i].materialLotCode === ''
      ) {
        notification.error({ message: '请输入条码' });
        return;
      }
      if (
        badNumberBarcodeList[i].ncQty === undefined ||
        badNumberBarcodeList[i].ncQty === null ||
        badNumberBarcodeList[i].ncQty === ''
      ) {
        notification.error({ message: '请输入不良数量' });
        return;
      }
    }
    const params = {
      inspectionId: inspectHeadData.inspectionId,
      materialLotData: badNumberBarcodeList,
    };
    dispatch({
      type: 'iqcInspectionPlatform/saveBadNumberBarcode',
      payload: params,
    }).then(res => {
      if (res) {
        let sumNcQty = 0;
        for (let i = 0; i < badNumberBarcodeList.length; i++) {
          sumNcQty += badNumberBarcodeList[i].ncQty;
        }
        inspectHeadData.ncQty = Number(sumNcQty);
        dispatch({
          type: 'iqcInspectionPlatform/updateState',
          payload: {
            inspectHeadData,
          },
        });
        // 查询不良数页面信息
        dispatch({
          type: 'iqcInspectionPlatform/queryBadNumberBarcode',
          payload: {
            inspectionId: this.state.badNumberBarcodeDatas.inspectionId,
          },
        });
        notification.success({ message: '保存成功' });
      }
    });
  }

  // 条码不良数新增
  @Bind
  handleBadNumberBarcodeCreate() {
    const {
      dispatch,
      iqcInspectionPlatform: { badNumberBarcodeList = [], badNumberBarcodePagination = {} },
    } = this.props;
    dispatch({
      type: 'iqcInspectionPlatform/updateState',
      payload: {
        badNumberBarcodeList: [
          {
            actualDetailId: '',
            _status: 'create',
          },
          ...badNumberBarcodeList,
        ],
        badNumberBarcodePagination: addItemToPagination(
          badNumberBarcodeList.length,
          badNumberBarcodePagination
        ),
      },
    });
  }

  @Bind()
  updateBarCode(flag) {
    this.setState({ uploadCodeVisible: flag });
    if (flag) {
      this.fetchMaterialLotCode();
    } else {
      this.setState({ selectedRowKeys: [], selectArrKeys: [], selectedRows: [], selectArr: [] });
    }
  }

  // 查询物料批
  @Bind()
  fetchMaterialLotCode(fields = {}) {
    const { dispatch } = this.props;
    const { iqcHeaderId } = this.props.match.params;
    const { selectedRowKeys, selectedRows } = this.state;
    dispatch({
      type: 'iqcInspectionPlatform/updateState',
      payload: {
        materialLotCodeList: [],
        materialLotCodePagination: {},
      },
    });
    const fieldsValue = (this.updateBarCodeForm && filterNullValueObject(this.updateBarCodeForm.getFieldsValue())) || {};
    dispatch({
      type: 'iqcInspectionPlatform/fetchMaterialLotCode',
      payload: {
        iqcHeaderId,
        supplierLot: fieldsValue.supplierLot,
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(res => {
      if (res) {
        this.handleSelect(selectedRowKeys, selectedRows);
      }
    });
  }

  // 更新物料批
  @Bind()
  updateMaterialLotCode() {
    const {
      dispatch,
      iqcInspectionPlatform: { materialLotCodeList = [] },
    } = this.props;
    const { iqcHeaderId } = this.props.match.params;
    const params = getEditTableData(materialLotCodeList);
    const arr = [];
    params.forEach(ele => {
      if (ele.updateSoNum) {
        arr.push({
          materialLotCode: ele.materialLotCode,
          materialLotId: ele.materialLotId,
          materialVersion: ele.materialVersion,
          supplierLot: ele.supplierLot,
        });
      }
    });
    if (arr.length === 0) {
      return notification.error({ message: '请选择条码！' });
    }
    if (Array.isArray(params) && params.length !== 0) {
      dispatch({
        type: 'iqcInspectionPlatform/updateMaterialLotCode',
        payload: {
          iqcHeaderId,
          arr,
        },
      }).then(res => {
        if (res) {
          notification.success({ message: '保存成功' });
          this.setState({ selectedRowKeys: [], selectedRows: [], selectArrKeys: [], selectArr: [] });
          this.fetchMaterialLotCode();
        }
      });
    }
  }

  @Bind()
  handleSelect(selectedRowKey, selectedRow) {
    const { selectArrKeys, selectArr, selectedRowKeys, selectedRows } = this.state;
    this.setState({ selectedRowKeys: Array.from(new Set(selectedRowKey.concat(selectArrKeys).concat(selectedRowKeys))), selectedRows: unionBy(selectedRow.concat(selectArr).concat(selectedRows), 'materialLotId') });
    const {
      iqcInspectionPlatform: { materialLotCodeList = [] },
      dispatch,
    } = this.props;
    for (let i = 0; i < materialLotCodeList.length; i++) {
      // 总的数据
      for (let j = 0; j < selectedRows.length; j++) {
        // 选中的行数据
        if (materialLotCodeList[i].materialLotId === selectedRows[j].materialLotId) {
          materialLotCodeList.splice(i, 1, {
            ...materialLotCodeList[i],
            updateSoNum: true,
          });
          break; // 只要在选择的数据中得到匹配的立马跳出此次循环，进行下一次判断
        } else {
          // 如果总的数据在i位置没有匹配到选择的数据，那么该数据是不可以更新的
          materialLotCodeList.splice(i, 1, {
            ...materialLotCodeList[i],
            updateSoNum: false,
          });
        }
      }
    }
    dispatch({
      type: 'iqcInspectionPlatform/updateState',
      payload: {
        materialLotCodeList,
      },
    });
  }

  @Bind()
  updateMaterialVersion(materialVersion) {
    const {
      iqcInspectionPlatform: { materialLotCodeList = [] },
      dispatch,
    } = this.props;
    const listArr = [];
    materialLotCodeList.forEach(item => {
      listArr.push({
        ...item,
        materialVersion:
          item.updateSoNum && item._status === 'update' ? materialVersion : item.materialVersion,
      });
    });
    dispatch({
      type: 'iqcInspectionPlatform/updateState',
      payload: {
        materialLotCodeList: listArr,
      },
    });
  }

  // 条码框回车选中数据
  @Bind()
  onEnterDownCode(materialLotCode) {
    const {
      iqcInspectionPlatform: { materialLotCodeList = [] },
    } = this.props;
    const { selectedRowKeys = [], selectedRows = [] } = this.state;
    const arr = selectedRowKeys;
    const rows = selectedRows;
    const selectArr = materialLotCodeList.filter(ele => ele.materialLotCode === materialLotCode);
    if (selectArr.length > 0) {
      arr.push(selectArr[0].materialLotId);
      this.setState({ selectArr: rows.concat(selectArr), selectArrKeys: Array.from(new Set(arr)) });
      this.handleSelect(Array.from(new Set(arr)), rows.concat(selectArr));
    }
  }

  render() {
    // 获取头行参数
    const {
      iqcInspectionPlatform: {
        inspectHeadData = {},
        inspectLineData = [],
        paginationLine = {},
        resultMap = [],
        inspectLineSelect = {},
        badNumberBarcodeList = [],
        badNumberBarcodePagination = {},
        materialLotCodeList = [],
        materialLotCodePagination = {},
      },
      fetchDataLoading,
      fetchMaterialLotCodeLoading,
      updateMaterialLotCodeLoading,
    } = this.props;
    const {
      search,
      expandFlag,
      badNumberBarcodeFlag,
      uploadCodeVisible,
      selectedRowKeys,
    } = this.state;
    // 查询
    const filterFormProps = {
      inspectHeadData,
      inspectHead: inspectHeadData,
      parentItem: search,
      onSearch: this.onSearch,
      createHeadDataDrawer: this.createHeadDataDrawer,
    };
    // 头信息展示
    const topFormInfoProps = {
      inspectHead: inspectHeadData,
      resultMap,
      scanningBarCodeVisible: this.scanningBarCodeVisible,
    };

    // 行信息展示
    const listTableRowProps = {
      changeBackColor: this.changeBackColor,
      inspectLine: inspectLineData,
      resultMap,
      loading: fetchDataLoading,
      pagination: paginationLine,
      rowClick: this.onClickRow,
      onSearch: this.onSearchByPagination,
      onShowAttchment: this.onShowAttchment,
      uploadSuccess: this.uploadSuccess,
    };

    // 扩展界面参数
    const expandProps = {
      expandDrawer: expandFlag,
      expandColseData: this.expandColseData,
    };

    // 条码不良数界面参数
    const badNumberBarcodeProps = {
      badNumberBarcodeFlag,
      dataSource: badNumberBarcodeList,
      pagination: badNumberBarcodePagination,
      badNumberBarcodeChange: this.badNumberBarcodeChange,
      onBadNumberBarcodeCancel: this.badNumberBarcodeCancel,
      handleBadNumberBarcodeDelete: this.handleBadNumberBarcodeDelete,
      changeBarcodeValue: this.changeBarcodeValue,
      changeNcQty: this.changeNcQty,
      handleBarcodeEnter: this.handleBarcodeEnter,
      onBadNumberBarcodeSave: this.badNumberBarcodeSave,
      handleBadNumberBarcodeCreate: this.handleBadNumberBarcodeCreate,
    };

    const columns = [
      {
        title: '结果值',
        width: 70,
        dataIndex: 'result',
        align: 'center',
        render: (val, record, index) => {
          return ['create', 'update'].includes(record._status) ? (
            <Input
              defaultValue={val}
              onChange={vals => this.changeValueOne(vals, index, record)}
              style={{ width: '100%' }}
              className="code-input"
              onPressEnter={e => {
                this.handleTurnToNextInput(e, index);
              }}
            />
          ) : (
              val
            );
        },
      },
      {
        title: '备注',
        width: 70,
        dataIndex: 'remark',
        align: 'center',
        render: (val, record, index) => {
          return ['create', 'update'].includes(record._status) ? (
            <Input
              defaultValue={val}
              onChange={vals => this.changeValueTwo(vals, index, record)}
              style={{ width: '100%' }}
            />
          ) : (
              val
            );
        },
      },
    ];

    const updateCodeDrawerProps = {
      fetchMaterialLotCodeLoading,
      updateMaterialLotCodeLoading,
      selectedRowKeys,
      dataSource: materialLotCodeList,
      pagination: materialLotCodePagination,
      expandDrawer: uploadCodeVisible,
      updateBarCode: this.updateBarCode,
      onSearch: this.fetchMaterialLotCode,
      updateMaterialLotCode: this.updateMaterialLotCode,
      handleSelect: this.handleSelect,
      updateMaterialVersion: this.updateMaterialVersion,
      onEnterDownCode: this.onEnterDownCode,
      onRef: node => {
        this.updateBarCodeForm = node.props.form;
      },
    };

    return (
      <Fragment>
        <Spin spinning={this.state.loading} size="large">
          <Header
            title={
              <span>
                <Tooltip title="返回" placement="bottom" getTooltipContainer={that => that}>
                  <Icon type="arrow-left" className="back-btn" onClick={this.onBackBtnClick} />
                </Tooltip>
                &emsp;&emsp;<span>IQC检验平台</span>
              </span>
            }
          >
            <Button
              type="primary"
              onClick={this.handSubmitData}
              disabled={inspectHeadData.inspectionStatusMeaning !== '新建'}
              style={{
                backgroundColor:
                  inspectHeadData.inspectionStatusMeaning !== '新建' ? '#D3D3D3' : '',
              }}
            >
              提交
            </Button>
            <Button
              style={{
                marginRight: '10px',
                backgroundColor:
                  inspectHeadData.inspectionStatusMeaning !== '新建' ? '#D3D3D3' : '',
              }}
              onClick={this.handSaveData}
              disabled={inspectHeadData.inspectionStatusMeaning !== '新建'}
            >
              保存
            </Button>
            <Button
              type="primary"
              disabled={inspectHeadData.inspectionStatusMeaning !== '新建'}
              style={{
                marginRight: '10px',
                backgroundColor:
                  inspectHeadData.inspectionStatusMeaning !== '新建' ? '#D3D3D3' : '',
              }}
              onClick={this.expandOpenData}
            >
              新建
            </Button>
            <Button style={{ backgroundColor: '#06B809' }}>图纸</Button>
            <Button onClick={() => this.updateBarCode(true)}>条码修改</Button>
          </Header>
          <Content>
            <Row>
              <Col span={18} style={{ marginRight: '20px' }}>
                <FilterForm {...filterFormProps} onRef={this.handleBindRef} />
                <TopFormInfo {...topFormInfoProps} onRef={this.handleBindTopRef} />
              </Col>
              <Col span={5}>
                <EditTable
                  bordered
                  rowKey="detailId"
                  columns={columns}
                  scroll={{ y: 225 }}
                  pagination={{ pageSize: 5 }}
                  dataSource={inspectLineSelect.detailList}
                  style={{ height: '225px' }}
                />
              </Col>
            </Row>
            <br />
            <br />
            <ListTableRow {...listTableRowProps} />
            {expandFlag && <ExpandCreateDrawer {...expandProps} />}
            {badNumberBarcodeFlag && <BadNumberBarcode {...badNumberBarcodeProps} />}
            <UpdateCodeDrawer {...updateCodeDrawerProps} />
          </Content>
        </Spin>
      </Fragment>
    );
  }
}
