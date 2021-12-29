import React, { Component, Fragment } from 'react';
import { Row, Col, Spin, Modal, Button } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import { isEmpty, isArray, isNull, isUndefined } from 'lodash';
import uuid from 'uuid/v4';

import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import webSocketManager from 'utils/webSoket';
import {
  filterNullValueObject,
  getEditTableData,
  getCurrentUserId,
} from 'utils/utils';

import { openTab } from 'utils/menuTab';
import queryString from 'querystring';
import SerialItem from '../Component/SerialItem'; // 序列号物料
import BatchItem from '../Component/BatchItem'; // 批次物料
import AgingItem from '../Component/AgingItem';// 时效物料
import StationEquipment from '../Component/StationEquipment'; // 设备工位
import DataInfo from '../Component/DataInfo'; // 数据采集项
import ContainerInfo from '../Component/ContainerInfo'; // 容器相关信息
import SelfCheckInfo from '../Component/SelfCheckInfo'; // 自检数据采集项
import EnterModal from '../Component/EnterModal'; // 工位输入弹框
import PreInstalledInfo from './PreInstalledInfo'; // 预装物料 基本信息框
import MaterialModal from '../Component/MaterialModal'; // 计划外投料弹框
import DataRecordModal from '../Component/DataRecordModal'; // 补充数据采集弹框
import styles from '../Component/index.less';

const jobTypes = {
  lotOperationPlatform: 'BATCH_PROCESS',
  operationPlatform: 'SINGLE_PROCESS',
  firstProcessPlatform: 'SINGLE_PROCESS',
  preInstalledPlatform: 'PREPARE_PROCESS',
};


export default class PreOperationPlatform extends Component {
  constructor(props) {
    super(props);
    this.modelName = props.modelName || '';
    // operationPlatform  工序作业平台
    // lotOperationPlatform  批量工序作业平台
    // preInstalledPlatform  物料预装平台
    // firstProcessPlatform  首序工序作业平台
    this.state = {
      visible: true,
      materialVisible: false, // 新增物料模态框是否可见
      dataRecordVisible: false, // 数据采集详情
      snVisible: false, // sn模态框
      timing: '00:00:00',
      jumpData: {}, // 跳转各个平台暂存数据
      badHandingFlag: false, // 能否跳转不良处理平台标示：true可以跳转
      firstProcessFlag: false,
      productTraceabilityFlag: false,
      isUpdateLotItem: false,
      isUpdateTimeItem: false,
      isUpdateSerialItem: false,
      outSiteConfirmModalVisible: false,
    };
    this.handleInitData(true);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetchDefaultSite`,
    }).then(res => {
      if (res) {
        const workcellCodeInput = document.getElementsByClassName('work-cell-code-input');
        if (workcellCodeInput) {
          workcellCodeInput[0].focus();
        }
      }
    });
  }

  componentDidUpdate(prevProps) {
    const { global: { activeTabKey }, [this.modelName]: { workCellInfo } } = this.props;
    const { global: { activeTabKey: prevActiveTabKey } } = prevProps;
    // 如果从设备检验平台 返回至 工序作业平台时需刷新设备列表
    if (prevActiveTabKey === '/hhme/equipment-check' && ['/hhme/operation-platform', '/hhme/pre-installed-platform', '/hhme/first-process-platform', '/hhme/lot-operation-platform'].includes(activeTabKey)) {
      this.handleFetchEquipment(workCellInfo.workcellCode);
    }
  }


  /**
   * 卸载时清空定时器和websocket连接
   *
   * @memberof OperationPlatform
   */
  componentWillUnmount() {
    const { [this.modelName]: { equipmentList = [] } } = this.props;
    equipmentList.filter(e => e.assetEncoding).forEach(e => {
      webSocketManager.removeListener(e.equipmentCategory, this.handleEqData);
    });
    clearInterval(this.timer);
    clearInterval(this.timeItemTimer);
  }


  /**
   * 初始化数据
   *
   * @memberof OperationPlatform
   */
  @Bind()
  handleInitData(isInit = true) {
    const { dispatch, [this.modelName]: { equipmentList = [] } } = this.props;
    let payload = {
      baseInfo: {},
      selectedRecord: {},
      snNum: null,
      isContainerOut: true, // 是否显示容器
      materialVOList: [], // 序列号物料
      lotMaterialVOList: [], // 批次物料
      timeMaterialVOList: [], // 时序物料
      selectedRows: [],
      dataRecordList: [],
      addDataRecordList: [],
      containerList: [],
      selfCheckList: [],
      maxLoadQty: 0,
      currentEoStepList: [],
      materialLotList: [], // 序列号物料扫描容器条码 弹出 容器下的物料批条码弹框
      materialLotPagination: {}, // 序列号物料扫描容器条码 弹出 容器下的物料批条码 弹框的分页参数
      eoList: [], // 扫描sn后 需选择关联的eo
      eoPagination: {},
    };
    payload = isInit ? {
      ...payload,
      workCellInfo: {},
      containerInfo: {},
      equipmentInfo: {},
      equipmentList: [],
      eoStepList: [], // 当前工序下拉框值
      outOfPlanMaterialList: [], // 当前工位下绑定的计划外投料
      outOfPlanDataRecordList: [],
      snList: [],
      workOrderInfo: {},
    } : payload;
    dispatch({
      type: `${this.modelName}/updateState`,
      payload,
    });
    if (!isInit) {
      equipmentList.filter(e => e.assetEncoding).forEach(e => {
        webSocketManager.removeListener(e.equipmentCategory, this.handleEqData);
      });
    }
    clearInterval(this.timeItemTimer);
    clearInterval(this.timer);
    this.setState({ isUpdateLotItem: true, isUpdateTimeItem: true, isUpdateSerialItem: true });
  }


  /**
   * 获取工位信息
   *
   * @param {*} workcellCode 工位code
   * @param {boolean} [updateDataFlag=false] true，更新数据采集/自检， false不更新
   * @memberof OperationPlatform
   */
  @Bind()
  handleFetchWorkCellInfo(workcellCode) {
    const {
      dispatch,
      [this.modelName]: { siteId },
    } = this.props;
    clearInterval(this.timeItemTimer);
    dispatch({
      type: `${this.modelName}/fetchWorkCellInfo`,
      payload: {
        workcellCode,
        siteId,
        jobType: jobTypes[this.modelName],
        // siteId: 40226.1,
      },
    }).then(res => {
      if (res) {
        this.handleCloseEnterModal();
        this.setState({ jumpData: res, isUpdateLotItem: true, isUpdateTimeItem: true, isUpdateSerialItem: true });
      }
    });
    this.handleFetchEquipment(workcellCode);
  }

  @Bind()
  openEquipmentCheck() {
    const { [this.modelName]: { workCellInfo = {} } } = this.props;
    openTab({
      key: `/hhme/equipment-check`, // 打开 tab 的 key
      path: `/hhme/equipment-check`, // 打开页面的path
      title: '设备点检&保养平台',
      search: queryString.stringify({
        workcellCode: workCellInfo.workcellCode,
      }),
      closable: true,
    });
  }


  /**
   * 批量工序作业平台
   *  批量数据采集 / 自检后，刷新工序作业列表
   * @memberof OperationPlatform
   */
  @Bind()
  handleFetchSnList(isOutSite = false) {
    const { dispatch, [this.modelName]: { workCellInfo, siteId, selectedRows, selectedRecord } } = this.props;
    clearInterval(this.timer);
    dispatch({
      type: `${this.modelName}/fetchSnList`,
      payload: {
        workcellId: workCellInfo.workcellId,
        workcellCode: workCellInfo.workcellCode,
        siteId,
        selectedRows,
        selectedRecord,
        isOutSite, // 是否出站
      },
    }).then(res => {
      if (res) {
        // this.handleStartLotTimer(res);
        if (this.modelName !== 'preInstalledPlatform') {
          const snNumInput = document.getElementsByClassName('operation-platform-sn-num');
          snNumInput[0].select();
        }
      }
    });
  }

  @Bind()
  handleFetchMaterialList() {
    const { dispatch, [this.modelName]: { workCellInfo } } = this.props;
    dispatch({
      type: `${this.modelName}/fetchMaterialList`,
      payload: {
        workcellId: workCellInfo.workcellId,
      },
    });
  }


  /**
   * 关闭模态框
   *
   * @memberof OperationPlatform
   */
  @Bind()
  handleCloseEnterModal() {
    this.setState({ visible: false });
  }


  /**
   * 时间计算
   *
   * @param {*} time
   * @returns
   * @memberof OperationPlatform
   */
  @Bind()
  handleTiming(time) {
    if (isEmpty(time)) {
      const second = time % 60;
      const hour = Math.floor(time / (60 * 60));
      const minute = Math.floor((time - hour * 60 * 60) / 60);
      return `${hour > 9 ? hour : `0${hour}`}:${minute > 9 ? minute : `0${minute}`}:${second > 9 ? second : `0${second}`
        }`;
    } else {
      return '00:00:00';
    }
  }


  @Bind()
  handleCheckSn(info = {}) {
    const {
      dispatch,
      [this.modelName]: { workCellInfo, jobContainerId, equipmentList, siteId, eoStepList },
    } = this.props;
    this.setState({ badHandingFlag: false, productTraceabilityFlag: false });
    const hmeWkcEquSwitchDTO6List = equipmentList.map(e => ({
      equipmentId: e.equipmentId,
      equipmentStatus: e.color,
    })).filter(e => e.equipmentId);
    const payload = {
      ...info,
      workcellId: workCellInfo.workcellId,
      jobContainerId,
      operationIdList: workCellInfo.operationIdList,
      equipmentList: hmeWkcEquSwitchDTO6List,
      siteId,
      wkcShiftId: workCellInfo.wkcShiftId,
      eoStepList,
      jobType: jobTypes[this.modelName],
      prodLineId: workCellInfo.prodLineId,
    };
    dispatch({
      type: `${this.modelName}/checkSn`,
      payload,
    }).then(res => {
      // 首序工序作业平台 / 工序作业平台 未出站的数据需要计时
      if (res && res.failed) { // 进站未出站 需计时
        Modal.confirm({
          title: res.message,
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            this.handleFetchBaseInfo(info);
          },
        });
      } else {
        this.handleFetchBaseInfo(info);
      }
    });
  }


  /**
   * 进站
   *
   * @param {*} snNum
   * @param {booleen} isSelected 批量工序作业平台选中sn列表中某一行查询
   * @param {*} [record={}]
   * @memberof OperationPlatform
   */
  @Bind()
  handleFetchBaseInfo(info = {}) {
    const {
      dispatch,
      [this.modelName]: { workCellInfo, equipmentList, workOrderInfo = {}, siteId, eoStepList, exceptionEquipmentCodes, errorEquipmentCodes },
    } = this.props;
    const fetchBaseInfo = () => {
      this.setState({ badHandingFlag: false, productTraceabilityFlag: false });
      const { materialId, workOrderId } = workOrderInfo;
      const hmeWkcEquSwitchDTO6List = equipmentList.map(e => ({
        equipmentId: e.equipmentId,
        equipmentStatus: e.color,
      })).filter(e => e.equipmentId);
      let payload = {
        ...info,
        workcellId: workCellInfo.workcellId,
        jobContainerId: workCellInfo.jobContainerId,
        operationIdList: workCellInfo.operationIdList,
        equipmentList: hmeWkcEquSwitchDTO6List,
        siteId,
        wkcShiftId: workCellInfo.wkcShiftId,
        eoStepList,
        jobType: jobTypes[this.modelName],
      };
      switch (this.modelName) {
        case 'preInstalledPlatform':
          payload = {
            ...payload,
            operationId: workCellInfo.operationId,
            materialId,
            workOrderId,
            workOrderInfo,
          };
          break;
        default:
      }
      clearInterval(this.timeItemTimer);
      dispatch({
        type: `${this.modelName}/updateState`,
        payload: {
          materialVOList: [],
          lotMaterialVOList: [],
          timeMaterialVOList: [],
        },
      });
      dispatch({
        type: `${this.modelName}/fetchBaseInfo`,
        payload,
      }).then(res => {
        // 如果查询成功之后设置跳转标示为true
        if (res) {
          this.setState({ badHandingFlag: true, productTraceabilityFlag: true });
          equipmentList.filter(e => e.assetEncoding).forEach(e => {
            webSocketManager.addListener(e.equipmentCategory, this.handleEqData);
          });
          this.handleStartTimeItemTimer();
        }
        this.setState({ isUpdateLotItem: true, isUpdateTimeItem: true, isUpdateSerialItem: true });
      });
    };
    if(exceptionEquipmentCodes || errorEquipmentCodes) {
      Modal.confirm({
        title: `${exceptionEquipmentCodes || errorEquipmentCodes}设备需要进行点检,是否先进行点检`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.openEquipmentCheck();
        },
        onCancel: () => {
          if(exceptionEquipmentCodes) {
            fetchBaseInfo();
          }
        },
      });
    } else {
      fetchBaseInfo();
    }
  }


  /**
   * 单次工序作业平台，工序作业计时
   *
   * @param {*} siteInDate
   * @memberof OperationPlatform
   */
  @Bind()
  handleStartTiming(siteInDate) {
    const timer = () => {
      const newTime = moment().diff(moment(siteInDate), 'seconds');
      this.setState({
        timing: this.handleTiming(newTime),
      });
    };
    this.timer = setInterval(timer, 1000);
  }


  /**
   * 批量工序作业平台，工序作业计时
   *
   * @memberof OperationPlatform
   */
  @Bind()
  handleStartLotTimer(snList) {
    const timer = () => {
      const { dispatch } = this.props;
      const newSnList = snList.map(e => {
        const timing = moment().diff(moment(e.siteInDate), 'seconds');
        return {
          ...e,
          timing: this.handleTiming(timing),
        };
      });
      dispatch({
        type: `${this.modelName}/updateState`,
        payload: {
          snList: newSnList,
        },
      });
    };
    this.timer = setInterval(timer, 1000);
  }


  /**
   * 根据工位加载设备类列表
   *
   * @param {*} workcellCode
   * @memberof OperationPlatform
   */
  @Bind()
  handleFetchEquipment(workcellCode) {
    const { dispatch, [this.modelName]: { siteId } } = this.props;
    return dispatch({
      type: `${this.modelName}/fetchEquipmentList`,
      payload: {
        workcellCode,
        siteId,
        // siteId: 40226.1,
      },
    });
  }


  /**
   * 物料预装平台
   * 更新工单信息
   *
   * @param {*} record
   * @memberof OperationPlatform
   */
  @Bind()
  handleFetchWorkOrderInfo(record) {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/updateState`,
      payload: {
        workOrderInfo: record,
      },
    });
  }


  /**
   * 物料预装平台
   * 预装物料已完工查询
   *
   * @param {*} data
   * @memberof OperationPlatform
   */
  @Bind()
  fetchCompletedMaterialInfo(data) {
    const { dispatch, [this.modelName]: { workOrderInfo } } = this.props;
    const { workOrderId } = workOrderInfo;
    const { materialCode, materialName, materialId, materialType, materialPrepareType, componentQty } = data;
    if (data) {
      dispatch({
        type: `${this.modelName}/fetchCompletedMaterialInfo`,
        payload: {
          workOrderInfo: {
            ...workOrderInfo,
            componentQty,
            materialId,
            materialName,
            materialCode,
            materialType,
            materialPrepareType,
          },
          workOrderId,
          materialId: data.materialId,
        },
      });
    } else {
      dispatch({
        type: `${this.modelName}/updateState`,
        payload: {
          workOrderInfo: {},
        },
      });
    }
  }

  /**
   * 批次投料
   *
   * @param {*} code
   * @memberof OperationPlatform
   */
  @Bind()
  handleFeedBatchItem(code) {
    const {
      dispatch,
      [this.modelName]: { baseInfo, workCellInfo, workOrderInfo, siteId },
    } = this.props;
    const { snMaterialId, eoId, snNum, eoStepId, jobId, reworkFlag } = baseInfo;
    if (snNum) {
      let payload = {
        materialLotCode: code,
        workcellId: workCellInfo.workcellId,
        snNum,
        eoId,
        jobType: jobTypes[this.modelName],
        workOrderId: workOrderInfo.workOrderId,
        prepareQty: workOrderInfo.prepareQty,
        eoStepId,
        jobId,
        siteId,
        reworkFlag,
      };
      switch (this.modelName) {
        case 'preInstalledPlatform':
          payload = {
            ...payload,
            operationId: workCellInfo.operationId,
            snMaterialId: workOrderInfo.materialId,
          };
          break;
        default:
          payload = {
            ...payload,
            operationId: baseInfo.operationId,
            snMaterialId,
          };
      }
      dispatch({
        type: `${this.modelName}/feedBatchItem`,
        payload,
      }).then(res => {
        if (res && res[0].deleteFlag !== 'Y') {
          notification.success();
        }
        if (res && isArray(res) && res.length === 1 && res[0].deleteFlag === 'Y') {
          Modal.confirm({
            title: '条码已绑定当前工位，是否解除绑定关系',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              this.handleDeleteBatchItem({ ...res[0], jobId });
            },
          });
        }
        this.setState({ isUpdateLotItem: true });
      });
    } else {
      notification.warning({
        description: '请先进站，再进行投料',
      });
    }
  }

  /**
   * 时序投料
   *
   * @param {*} code
   * @memberof OperationPlatform
   */
  @Bind()
  handleFeedTimeItem(code) {
    const {
      dispatch,
      [this.modelName]: { workCellInfo, baseInfo, workOrderInfo, siteId },
    } = this.props;
    const { eoId, snNum, eoStepId, jobId, snMaterialId, reworkFlag } = baseInfo;
    const { workOrderId, prepareQty, materialId } = workOrderInfo;
    const { workcellId } = workCellInfo;
    let payload = {
      eoId,
      materialLotCode: code,
      workcellId,
      snNum,
      jobType: jobTypes[this.modelName],
      eoStepId,
      jobId,
      siteId,
      reworkFlag,
    };
    if (baseInfo.snNum) {
      switch (this.modelName) {
        case 'preInstalledPlatform':
          payload = {
            ...payload,
            workOrderId,
            prepareQty,
            operationId: workCellInfo.operationId,
            materialId,
          };
          break;
        default:
          payload = {
            ...payload,
            operationId: baseInfo.operationId,
            snMaterialId,
          };
      }
      clearInterval(this.timeItemTimer);
      dispatch({
        type: `${this.modelName}/feedTimeItem`,
        payload,
      }).then(res => {
        if (res && res[0].deleteFlag !== 'Y') {
          notification.success();
          this.handleStartTimeItemTimer();
        }
        if (res && isArray(res) && res.length === 1 && res[0].deleteFlag === 'Y') {
          Modal.confirm({
            title: '条码已绑定当前工位，是否解除绑定关系',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              this.handleDeleteTimeItem(res[0]);
            },
            onCancel: () => {
              this.handleStartTimeItemTimer();
            },
          });
        }
        this.setState({ isUpdateLotItem: true });
      });
    } else {
      notification.warning({
        description: '请先进站，再进行投料',
      });
    }
  }

  /**
   * 序列号物料投料
   *
   * @param {*} itemCode
   * @param {*} record
   * @memberof OperationPlatform
   */
  @Bind()
  handleFeedSerialItem(itemCode, record, index) {
    const {
      dispatch,
      [this.modelName]: { workCellInfo, baseInfo, siteId, workOrderInfo },
    } = this.props;
    const { materialLotId, ...value } = record;
    const { snMaterialId, eoId, jobId, snNum } = baseInfo;
    let payload = {
      ...value,
      materialLotCode: itemCode,
      eoId,
      jobId,
      workcellId: workCellInfo.workcellId,
      snNum,
      siteId,
      jobType: jobTypes[this.modelName],
    };
    switch (this.modelName) {
      case 'preInstalledPlatform':
        payload = {
          ...payload,
          operationId: workCellInfo.operationId,
          workOrderId: workOrderInfo.workOrderId,
          snMaterialId: workOrderInfo.materialId,
          prepareQty: workOrderInfo.prepareQty,
        };
        break;
      default:
        payload = {
          ...payload,
          snMaterialId,
          operationId: baseInfo.operationId,
        };
    }
    dispatch({
      type: `${this.modelName}/feedSerialItem`,
      payload,
    }).then(res => {
      if (res && res[0].deleteFlag !== 'Y') {
        notification.success();
        const serialMaterialInputs = document.getElementsByClassName('serial-material-input');
        if (!isUndefined(index) && index + 1 < serialMaterialInputs.length) {
          serialMaterialInputs[index + 1].focus();
          if (serialMaterialInputs[index + 1].value) {
            serialMaterialInputs[index + 1].select();
          }
        }
      }
      if (res && res[0].deleteFlag === 'Y') {
        Modal.confirm({
          title: '条码已绑定当前工位，是否解除绑定关系',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            this.handleDeleteSerialItem(payload);
          },
        });
      }
      this.setState({ isUpdateSerialItem: true });
    });
  }


  @Bind()
  handleValidateMaterialList() {
    const { [this.modelName]: { materialVOList, lotMaterialVOList, timeMaterialVOList } } = this.props;
    const isFeedSnList = materialVOList.filter(e => !e.materialLotCode && e.jobMaterialId && e.wkcMatchedFlag === 'Y');
    const isFeedLotList = lotMaterialVOList.filter(e => !e.materialLotCode && e.jobMaterialId && e.wkcMatchedFlag === 'Y');
    const isFeedTimeList = timeMaterialVOList.filter(e => !e.materialLotCode && e.jobMaterialId && e.wkcMatchedFlag === 'Y');
    let message = '';
    if (isFeedLotList.length !== 0) {
      message = '批次物料存在未投物料';
    } else if (isFeedSnList.length !== 0) {
      message = '序列号物料存在未投物料';
    } else if (isFeedTimeList.length !== 0) {
      message = '时效物料存在未投物料';
    }
    return message;
  }

  /**
   * 出栈
   *
   * @memberof OperationPlatform
   */
  @Bind()
  handleOutSite(info = {}) {
    const {
      dispatch,
      [this.modelName]: { baseInfo, snNum, siteId, workCellInfo, equipmentList, containerInfo, workOrderInfo },
    } = this.props;
    let effects = '';
    let payload = {
      siteId,
      operationId: this.modelName === 'preInstalledPlatform' ? workCellInfo.operationId : baseInfo.operationId,
      hmeEoJobContainerVO2: containerInfo,
      jobType: jobTypes[this.modelName],
    };
    const hmeWkcEquSwitchDTO6List = equipmentList.map(e => ({
      equipmentId: e.equipmentId,
      equipmentStatus: e.color,
    })).filter(e => e.equipmentId);
    effects = 'outSite';
    payload = {
      ...baseInfo,
      containerId: containerInfo.containerId,
      snNum,
      equipmentList: hmeWkcEquSwitchDTO6List,
      workOrderId: workOrderInfo.workOrderId,
      snMaterialId: workOrderInfo.materialId,
      ...info,
      ...payload,
      prepareQty: workOrderInfo.prepareQty,
    };
    const message = this.handleValidateMaterialList();
    const outSiteFuc = (outSiteInfo = {}) => {
      payload = {
        ...payload,
        ...outSiteInfo,
      };
      clearInterval(this.timeItemTimer);
      return dispatch({
        type: `${this.modelName}/${effects}`,
        payload,
      }).then(res => {
        if (res && res.errorCode && info.outSiteAction === 'COMPLETE') {
          Modal.confirm({
            title: res.errorMessage,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              outSiteFuc({ outSiteAction: 'COMPLETE', continueFlag: 'Y' });
            },
          });
        } else if (res) {
          clearInterval(this.timer);
          notification.success();
          if (workCellInfo.jobContainerId) {
            this.handleFetchContainerInfo();
          }
        }
        return res;
      });
    };
    return new Promise((resolve) => {
      if(!isEmpty(message)) {
        Modal.confirm({
          title: message,
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            return outSiteFuc().then(res => {
              return resolve(res);
            });
          },
        });
      } else {
        return resolve(outSiteFuc());
      }
    });
  }


  /**
   * 更新容器
   *
   * @param {*} code
   * @memberof OperationPlatform
   */
  @Bind()
  handleUpdateContainer(code) {
    const {
      dispatch,
      [this.modelName]: { baseInfo, workCellInfo },
    } = this.props;
    dispatch({
      type: `${this.modelName}/updateContainer`,
      payload: {
        workCellInfo,
        containerCode: code,
        workcellId: workCellInfo.workcellId,
        eoId: baseInfo.eoId,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleFetchContainerInfo();
      }
    });
  }


  /**
   * 数据采集 / 自检 数据输入
   *
   * @param {*} value
   * @param {*} record
   * @memberof OperationPlatform
   */
  @Bind()
  handleAddDataRecord(value, record, dataSourceName) {
    const {
      dispatch,
      [this.modelName]: { [dataSourceName]: dataSource, baseInfo = {}, workCellInfo },
    } = this.props;
    const { jobRecordId, _status, ...info } = record;
    const { materialLotId, reworkFlag, eoId } = baseInfo;
    let payload = {
      jobType: jobTypes[this.modelName],
    };
    payload = record.isEdit && _status === 'create' ? {
      eqDataList: [{
        ...info,
        materialLotId,
        operationId: workCellInfo.operationId,
        reworkFlag,
        eoId,
        result: value,
      }],
      list: dataSource,
      dataSourceName,
    } : record._status === 'update' && record.isEdit ? {
      eqDataList: [{
        ...record, materialLotId,
        operationId: workCellInfo.operationId,
        reworkFlag,
        eoId,
        result: value,
      }],
      list: dataSource,
      dataSourceName,
    } : {
      ...record,
      materialLotId,
      operationId: workCellInfo.operationId,
      reworkFlag,
      list: dataSource,
      dataSourceName,
      result: value,
    };
    if (record.isEdit) {
      return dispatch({
        type: `${this.modelName}/addDataRecordBatch`,
        payload,
      });
    } else {
      return dispatch({
        type: `${this.modelName}/addDataRecord`,
        payload,
      });
    }
  }


  /**
   * 获取容器信息
   *
   * @memberof OperationPlatform
   */
  @Bind()
  handleFetchContainerInfo() {
    const {
      [this.modelName]: { workCellInfo, containerInfo },
      dispatch,
    } = this.props;
    dispatch({
      type: `${this.modelName}/fetchContainerInfo`,
      payload: {
        workCellInfo,
        containerInfo,
        workcellId: workCellInfo.workcellId,
      },
    });
  }



  /**
   * 勾选工序作业以后，需筛选相同的数据采集项和自检项
   *
   * @param {*} selectedRowKeys
   * @param {*} selectedRows
   * @memberof OperationPlatform
   */
  @Bind()
  handleChangeSelectedRows(selectedRowKeys, selectedRows) {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/updateState`,
      payload: {
        selectedRows,
      },
    });
  }


  /**
   *
   * 批量工序作业平台
   *
   * 勾选以后多行sn号找相同的自检和数据采集
   *
   * @param {*} record
   * @param {*} selected
   * @param {*} selectedRows
   * @memberof OperationPlatform
   */
  @Bind()
  handleChangeDataRecordList(record, selected, selectedRows) {
    const { dispatch, [this.modelName]: { dataRecordList, selfCheckList } } = this.props;
    let dataList = [];
    if (selectedRows.length === 1) { // 勾选一列，默认自检/数据采集 项
      dataList = selectedRows[0].dataRecordVOList;
    } else if (selected && selectedRows.length > 1) { // 勾选超过一列， 比对相同的自检 / 数据采集 项
      dataList = dataRecordList.concat(selfCheckList); // 数据采集项和自检项合起来一起比对
      if (isArray(record.dataRecordVOList) && !isEmpty(record.dataRecordVOList)) {
        const selectedDataRecordTagIds = record.dataRecordVOList.map(e => e.tagId);
        dataList = dataList.filter(i => selectedDataRecordTagIds.includes(i.tagId));
      }
    } else if (!selected && selectedRows.length > 1) { // 取消勾选
      dataList = selectedRows[0].dataRecordVOList;
      selectedRows.forEach(e => {
        const dataRecordTagIds = e.dataRecordVOList.map(i => i.tagId);
        dataList = dataList.filter(i => dataRecordTagIds.includes(i.tagId));
      });
    }
    const newDataRecordList = isArray(dataList)
      ? dataList
        .filter(e => e.groupPurpose === 'DATA')
      : [];
    const newSelfCheckList = isArray(dataList)
      ? dataList.filter(e => e.groupPurpose === 'GENERAL')
      : [];
    clearInterval(this.timeItemTimer);
    dispatch({
      type: `${this.modelName}/updateState`,
      payload: {
        selectedRows,
        dataRecordList: newDataRecordList,
        addDataRecordList: newDataRecordList,
        selfCheckList: newSelfCheckList,
        materialVOList: [],
        timeMaterialVOList: [],
        lotMaterialVOList: [],
        baseInfo: {},
        selectedRecord: {},
      },
    });
  }


  /**
   * 批量工序作业平台
   * 全选
   *
   * @param {*} selected
   * @param {*} selectedRows
   * @memberof OperationPlatform
   */
  @Bind()
  handleChangeAllDataRecordList(selected, selectedRows) {
    const { dispatch } = this.props;
    let dataList = [];
    if (selected) {
      dataList = selectedRows.length > 0 && isArray(selectedRows[0].dataRecordVOList) ? selectedRows[0].dataRecordVOList : [];
      if(dataList.length > 0) {
        selectedRows.forEach(e => {
          const dataRecordTagIds = e.dataRecordVOList.map(i => i.tagId);
          dataList = dataList.filter(i => dataRecordTagIds.includes(i.tagId));
        });
      }
    }
    const newDataRecordList = isArray(dataList)
      ? dataList
        .filter(e => e.groupPurpose === 'DATA')
      : [];
    const newSelfCheckList = isArray(dataList)
      ? dataList.filter(e => e.groupPurpose === 'GENERAL')
      : [];

    clearInterval(this.timeItemTimer);
    dispatch({
      type: `${this.modelName}/updateState`,
      payload: {
        selectedRows,
        dataRecordList: newDataRecordList,
        addDataRecordList: newDataRecordList,
        selfCheckList: newSelfCheckList,
        materialVOList: [],
        timeMaterialVOList: [],
        lotMaterialVOList: [],
        baseInfo: {},
        selectedRecord: {},
      },
    });
  }


  /**
   * 更换设备信息
   *
   * @param {*} [data={}]
   * @memberof OperationPlatform
   */
  @Bind()
  handleChangeEq(data = {}) {
    const { dispatch } = this.props;
    return dispatch({
      type: `${this.modelName}/changeEq`,
      payload: data,
    });
  }


  /**
   * 设备切换，删除设备
   *
   * @param {*} [data={}]
   * @memberof OperationPlatform
   */
  @Bind()
  handleDeleteEq(data = {}) {
    const { dispatch, [this.modelName]: { workCellInfo } } = this.props;
    dispatch({
      type: `${this.modelName}/deleteEq`,
      payload: data,
    }).then(res => {
      if (res) {
        notification.success();
        this.handleFetchEquipment(workCellInfo.workcellCode);
      }
    });
  }


  /**
   * 绑定设备
   *
   * @param {*} data
   * @returns
   * @memberof OperationPlatform
   */
  @Bind()
  handleBindingEq(data) {
    const { dispatch } = this.props;
    return dispatch({
      type: `${this.modelName}/bindingEq`,
      payload: data,
    });
  }

  // @Bind()
  // handleCheckEq(data = []) {
  //   const { dispatch } = this.props;
  //   if(isArray(data) && data.length > 0) {
  //     dispatch({
  //       type: `${this.modelName}/checkEq`,
  //       payload: data,
  //     }).then(res => {
  //       if(res) {
  //         notification.success();
  //       }
  //     });
  //   } else {
  //     notification.warning({ description: '请选择一条数据进行操作' });
  //   }
  // }


  /**
   * 查询设备信息
   *
   * @param {*} eqCode
   * @memberof OperationPlatform
   */
  @Bind()
  handleFetchEqInfo(eqCode) {
    const { dispatch } = this.props;
    return dispatch({
      type: `${this.modelName}/fetchEqInfo`,
      payload: {
        eqCode,
      },
    });
  }


  /**
   * 更换设备确认
   *
   * @param {*} [info={}]
   * @returns
   * @memberof OperationPlatform
   */
  @Bind()
  handleChangeEqConfirm(info = {}) {
    const { dispatch, [this.modelName]: { siteId } } = this.props;
    return dispatch({
      type: `${this.modelName}/changeEqConfirm`,
      payload: {
        ...info,
        siteId,
      },
    });
  }


  /**
   * 绑定设备确认
   *
   * @param {*} [info={}]
   * @returns
   * @memberof OperationPlatform
   */
  @Bind()
  handleBindingEqConfirm(info = {}) {
    const { dispatch, [this.modelName]: { siteId } } = this.props;
    return dispatch({
      type: `${this.modelName}/bindingEqConfirm`,
      payload: {
        ...info,
        siteId,
      },
    });
  }

  @Bind()
  handleOpenMaterialModal() {
    this.setState({ materialVisible: true });
  }

  @Bind()
  handleCloseMaterialModal() {
    this.setState({ materialVisible: false });
  }

  @Bind()
  handleCreate(listName, idName, options = {}) {
    const { dispatch, [this.modelName]: namespace, tenantId } = this.props;
    const dataSource = namespace[listName];
    const { workCellInfo } = namespace;
    const payload = {};
    if (listName === 'addDataRecordList') {
      payload[listName] = [
        {
          [idName]: uuid(),
          _status: 'create',
          isEdit: true,
          workcellId: workCellInfo.workcellId,
          tenantId,
          ...options,
        },
        ...dataSource,
      ];
    } else {
      payload[listName] = [
        {
          [idName]: uuid(),
          _status: 'create',
          workcellId: workCellInfo.workcellId,
          tenantId,
          ...options,
        },
        ...dataSource,
      ];
    }
    dispatch({
      type: `${this.modelName}/updateState`,
      payload,
    });
  }

  /**
   * 编辑当前行
   *
   * @param {string} dataSource 数据源在model里的名称
   * @param {string} id 数据源的id名称
   * @param {object} current 当前行
   * @param {boolean} flag
   * @memberof ContractBaseInfo
   */
  @Bind()
  handleEditLine(dataSource, id, current, flag) {
    const { dispatch, [this.modelName]: namespace } = this.props;
    const list = namespace[dataSource];
    let newList = [];
    if (dataSource === 'addDataRecordList') {
      newList = list.map(e => {
        if (e[id] === current[id]) {
          return { ...e, isEdit: !!flag, _status: 'update' };
        }
        return e;
      });
    } else {
      newList = list.map(item =>
        item[id] === current[id] ? { ...item, _status: flag ? 'update' : '' } : item
      );
    }
    dispatch({
      type: `${this.modelName}/updateState`,
      payload: {
        [dataSource]: newList,
      },
    });
  }

  /**
   * 清除当前行
   *
   * @param {string} dataSource
   * @param {string} id
   * @param {object} current
   * @memberof ContractBaseInfo
   */
  @Bind()
  handleCleanLine(dataSource, id, current) {
    const { dispatch, [this.modelName]: namespace } = this.props;
    const list = namespace[dataSource];
    const newList = list.filter(item => item[id] !== current[id]);
    let payload = {};
    payload = {
      [dataSource]: newList,
    };
    dispatch({
      type: `${this.modelName}/updateState`,
      payload,
    });
  }

  @Bind()
  handleSaveMaterialList() {
    const { dispatch, [this.modelName]: { outOfPlanMaterialList } } = this.props;
    const newData = getEditTableData(outOfPlanMaterialList, ['bydMaterialId']).map(e => ({
      ...e,
      isBeyond: e.isBeyond === false ? 'N' : 'Y',
      materialType: e.lotType === 'LOT' && e.availableTime
        ? 'TIME' :
        e.lotType === 'LOT'
          ? 'LOT' : 'SN',
    }));
    dispatch({
      type: `${this.modelName}/saveMaterialList`,
      payload: newData,
    }).then(res => {
      if (res) {
        notification.success();
        this.handleFetchMaterialList();
      }
    });
  }

  /**
  * 删除操作
  *
  * @param {array} selectedRows 勾选项
  * @param {string} dataSourceName 数据源模板
  * @param {string} idName 主键id名称
  * @param {string} effects
  * @memberof ContractBaseInfo
  */
  @Bind()
  handleDelete(selectedRows, dataSourceName, idName, effects) {
    const { dispatch, [this.modelName]: namespace } = this.props;
    const selectedRowKeys = selectedRows.map(e => e[idName]);
    const dataSource = namespace[dataSourceName];
    const unSelectedArr = dataSource.filter(e => {
      return selectedRowKeys.indexOf(e[idName]) < 0;
    });
    if (selectedRowKeys.length > 0) {
      Modal.confirm({
        title: '确定删除选中数据?',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const originDelete = selectedRows.filter(e => e._status !== 'create');
          if (isEmpty(originDelete)) {
            dispatch({
              type: `${this.modelName}/updateState`,
              payload: {
                [dataSourceName]: unSelectedArr,
              },
            });
          } else {
            dispatch({
              type: `${this.modelName}/${effects}`,
              payload: originDelete,
            }).then(res => {
              if (res) {
                dispatch({
                  type: `${this.modelName}/updateState`,
                  payload: {
                    [dataSourceName]: unSelectedArr,
                  },
                });
                notification.success();
              }
            });
          }
        },
      });
    }
  }

  /**
   * @description: 跳转到不良处理平台
   * @param {type} params
   */
  @Bind()
  openBadHandTab() {
    const { jumpData } = this.state;
    let jumpSnNum;
    openTab({
      key: `/hmes/bad-handling`, // 打开 tab 的 key
      path: `/hmes/bad-handling`, // 打开页面的path
      title: '不良处理平台',
      search: queryString.stringify({
        pathType: true,
        processId: jumpData.processId,
        processName: jumpData.processName,
        prodLineId: jumpData.prodLineId,
        prodLineName: jumpData.prodLineName,
        workcellId: jumpData.workcellId,
        workcellName: jumpData.workcellName,
        snNum: jumpSnNum.snNum,
      }),
      closable: true,
    });
  }

  @Bind()
  openProductTraceability() {
    const { productTraceabilityFlag } = this.state;
    const fieldsValue = (this.baseInfoform && filterNullValueObject(this.baseInfoform.getFieldsValue())) || {};
    if (productTraceabilityFlag) {
      openTab({
        key: `/hhme/product-traceability`, // 打开 tab 的 key
        path: `/hhme/product-traceability`, // 打开页面的path
        title: '产品生产履历查询',
        search: queryString.stringify({
          traceabilityPathType: true,
          snNum: fieldsValue.snNum,
        }),
        closable: true,
      });
    } else {
      notification.warning({ description: '请扫描条码' });
    }
  }

  @Bind()
  handleBaseInfoBindRef(ref = {}) {
    this.baseInfoform = (ref.props || {}).form;
  }

  @Bind()
  handleEqData({ message }) {
    const messageJson = isEmpty(message) ? undefined : JSON.parse(message);
    const { [this.modelName]: { snNum, equipmentList, dataRecordList, baseInfo, workCellInfo }, dispatch } = this.props;
    const equipmentCodes = equipmentList.map(e => e.assetEncoding);
    const { eoId, reworkFlag, materialLotId } = baseInfo;
    if (messageJson.sn === snNum && equipmentCodes.includes(messageJson.assetEncoding)) {
      let eqDataList = dataRecordList.filter(e => {
        const { limitCond1, limitCond2 } = e;
        const limitCode1 = isNull(limitCond1) ? null
          // eslint-disable-next-line no-useless-escape
          : limitCond1.toLowerCase().replace(/\_(\w)/g, (all, letter) => {
            return letter.toUpperCase();
          });
        const limitCode2 = isNull(limitCond2) ? null
          // eslint-disable-next-line no-useless-escape
          : limitCond2.toLowerCase().replace(/\_(\w)/g, (all, letter) => {
            return letter.toUpperCase();
          });
        const cond1Value = isNull(limitCode1) ? null : `${messageJson[limitCode1]}`;
        const cond2Value = isNull(limitCode2) ? null : `${messageJson[limitCode2]}`;
        const flag = !isEmpty(e.valueField) && (cond1Value === e.cond1Value) && (cond2Value === e.cond2Value);
        return flag;
      });
      eqDataList = eqDataList.map(e => {
        const { valueField } = e;
        // eslint-disable-next-line no-useless-escape
        if (valueField) {
          // eslint-disable-next-line no-useless-escape
          const field = valueField.toLowerCase().replace(/\_(\w)/g, (all, letter) => {
            return letter.toUpperCase();
          });
          return {
            ...e,
            result: messageJson[field],
            jobType: jobTypes[this.modelName],
            materialLotId,
            operationId: this.modelName === 'preInstalledPlatform' ? workCellInfo.operationId : baseInfo.operationId,
            reworkFlag,
            eoId,
          };
        }
        return {
          ...e,
          jobType: jobTypes[this.modelName],
          materialLotId,
          operationId: this.modelName === 'preInstalledPlatform' ? workCellInfo.operationId : baseInfo.operationId,
          reworkFlag,
          eoId,
        };

      });
      if (eqDataList.length > 0) {
        dispatch({
          type: `${this.modelName}/addDataRecordBatch`,
          payload: {
            eqDataList,
            list: dataRecordList,
            dataSourceName: 'dataRecordList',
          },
        });
      }
    }
  }

  @Bind()
  handleOpenDataRecordModal() {
    this.setState({ dataRecordVisible: true });
  }

  @Bind()
  handleCloseDataRecordModal() {
    const { dispatch, [this.modelName]: { addDataRecordList } } = this.props;
    this.setState({ dataRecordVisible: false });
    const newDataRecordList = addDataRecordList.filter(e => e._status !== 'create').map(e => {
      if (e.isEdit) {
        return { ...e, isEdit: false };
      }
      return e;
    });
    dispatch({
      type: `${this.modelName}/updateState`,
      payload: {
        addDataRecordList: newDataRecordList,
      },
    });
  }


  /**
   * 获取激光功率计数据 / 毫瓦功率计
   *
   * @memberof OperationPlatform
   */
  @Bind()
  handleGetData(data) {
    const { dispatch, [this.modelName]: { equipmentList } } = this.props;
    const obj = equipmentList.find(e => e.equipmentCategory === data.equipmentCategory);
    if (data.equipmentCategory === 'EC-0003') {
      dispatch({
        type: `${this.modelName}/getOphir`,
        payload: {
          equipmentCode: obj.assetEncoding,
        },
      }).then(res => {
        this.handleAddDataRecord(res, data, 'dataRecordList');
      });
    } else if (data.equipmentCategory === 'EC-0027') {
      dispatch({
        type: `${this.modelName}/getThorlabs`,
        payload: {
          equipmentCode: obj.assetEncoding,
        },
      }).then(res => {
        this.handleAddDataRecord(res, data, 'dataRecordList');
      });
    }
  }


  /**
   * 补充数据采集
   *
   * @memberof OperationPlatform
   */
  @Bind()
  handleSaveDataRecordList() {
    const { [this.modelName]: { addDataRecordList }, dispatch } = this.props;
    const newData = addDataRecordList.filter(e => e.isEdit);
    const newDataRecordList = getEditTableData(newData, ['jobRecordId']).map(e => ({
      ...e,
      resultType: e.valueType,
    }));
    if (newDataRecordList.length > 0) {
      dispatch({
        type: `${this.modelName}/addDataRecordBatch`,
        payload: {
          eqDataList: newDataRecordList,
          list: addDataRecordList,
          dataSourceName: 'addDataRecordList',
        },
      });
    }
  }


  /**
   * sn列表模态框打开
   *
   * @memberof OperationPlatform
   */
  @Bind()
  handleOpenSnModal() {
    this.setState({ snVisible: true });
  }


  /**
   * 卸载容器
   *
   * @returns
   * @memberof OperationPlatform
   */
  @Bind()
  handleUninstallContainer() {
    const { dispatch, [this.modelName]: { workCellInfo, containerInfo } } = this.props;
    if (workCellInfo.containerCode) {
      return dispatch({
        type: `${this.modelName}/uninstallContainer`,
        payload: {
          containerInfo,
          workCellInfo,
          workcellId: workCellInfo.workcellId,
          containerCode: workCellInfo.containerCode,
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.handleFetchContainerInfo();
        }
        return res;
      });
    }
  }


  @Bind()
  handleFetchIsContainer(barcode) {
    const { dispatch } = this.props;
    return dispatch({
      type: `${this.modelName}/fetchIsContainer`,
      payload: { barcode },
    });
  }

  @Bind()
  firstProcessSerialItem(itemCode, record, index) {
    const {
      dispatch,
      [this.modelName]: { workCellInfo, baseInfo, siteId },
    } = this.props;
    const { materialLotId, ...value } = record;
    const { snMaterialId, eoId, jobId, snNum } = baseInfo;
    dispatch({
      type: `${this.modelName}/firstProcessSerialItem`,
      payload: {
        ...value,
        materialLotCode: itemCode,
        eoId,
        snMaterialId,
        jobId,
        workcellId: workCellInfo.workcellId,
        operationId: this.modelName === 'preInstalledPlatform' ? workCellInfo.operationId : baseInfo.operationId,
        snNum,
        siteId,
        jobType: jobTypes[this.modelName],
      },
    }).then(res => {
      if (res) {
        notification.success();
        const serialMaterialInputs = document.getElementsByClassName('serial-material-input');
        if (index + 1 < serialMaterialInputs.length) {
          serialMaterialInputs[index + 1].focus();
          if (serialMaterialInputs[index + 1].value) {
            serialMaterialInputs[index + 1].select();
          }
        }
      }
    });
  }

  @Bind()
  handleFetchMaterialLotList(page = {}, fields = {}) {
    const { dispatch } = this.props;
    return dispatch({
      type: `${this.modelName}/fetchMaterialLotList`,
      payload: {
        page,
        ...fields,
      },
    }).then(res => {
      return res;
    });
  }




  /**
   * 获取投料记录
   *
   * @memberof OperationPlatform
   */
  @Bind()
  handleFetchFeedingRecord(type) {
    const { dispatch, [this.modelName]: { workCellInfo, baseInfo } } = this.props;
    dispatch({
      type: `${this.modelName}/fetchFeedingRecord`,
      payload: {
        materialType: type,
        jobType: jobTypes[this.modelName],
        workcellId: workCellInfo.workcellId,
        snNum: baseInfo.snNum,
        operationId: this.modelName === 'preInstalledPlatform' ? workCellInfo.operationId : baseInfo.operationId,
      },
    });
  }


  /**
   * 确认退料
   *
   * @memberof OperationPlatform
   */
  @Bind()
  handleReturnMaterial(payload) {
    const { dispatch } = this.props;
    const { materialType } = payload;
    return dispatch({
      type: `${this.modelName}/returnMaterial`,
      payload,
    }).then(res => {
      if (res) {
        notification.success();
        dispatch({
          type: `${this.modelName}/updateState`,
          payload: {
            feedingRecordList: [],
          },
        });
        this.handleFetchItemList(materialType);
        this.handleFetchFeedingRecord(materialType);
      }
      return res;
    });
  }


  /**
   * 更新批次物料的投料标识
   *
   * @memberof OperationPlatform
   */
  @Bind()
  handleCheckBatchItem(itemList) {
    const { dispatch, [this.modelName]: { lotMaterialVOList } } = this.props;
    dispatch({
      type: `${this.modelName}/checkBatchItem`,
      payload: {
        itemList,
        lotMaterialVOList,
      },
    }).then(res => {
      if (res && res.failed) {
        notification.error({
          description: res.message,
        });
      } else {
        this.setState({ isUpdateLotItem: true });
      }
    });
  }



  /**
   *
   * 更新批次物料的投料标识
   * @param {*} itemList
   * @memberof OperationPlatform
   */
  @Bind()
  handleCheckTimeItem(itemList) {
    const { dispatch, [this.modelName]: { timeMaterialVOList } } = this.props;
    clearInterval(this.timeItemTimer);
    dispatch({
      type: `${this.modelName}/checkTimeItem`,
      payload: {
        itemList,
        timeMaterialVOList,
      },
    }).then(res => {
      if (res && res.failed) {
        notification.error({
          description: res.message,
        });
      } else {
        this.setState({ isUpdateTimeItem: true });
        this.handleStartTimeItemTimer();
      }
    });
  }

  /**
   *
   * 更新序列号物料的投料标识
   * @param {*} itemList
   * @memberof OperationPlatform
   */
  @Bind()
  handleCheckSerialItem(itemList) {
    const { dispatch, [this.modelName]: { materialVOList } } = this.props;
    dispatch({
      type: `${this.modelName}/checkSerialItem`,
      payload: {
        itemList,
        materialVOList,
      },
    }).then(res => {
      if (res && res.failed) {
        notification.error({
          description: res.message,
        });
      } else {
        this.setState({ isUpdateSerialItem: true });
      }
    });
  }

  /**
   * 删除批次物料与条码的绑定关系
   * 物料与工位有多条绑定关系的时候删除
   * 单个绑定关系删除条码
   *
   * @param {*} record
   * @memberof OperationPlatform
   */
  @Bind()
  handleDeleteSerialItem(record) {
    const { dispatch, [this.modelName]: { workCellInfo, baseInfo, workOrderInfo, siteId } } = this.props;
    const { materialId, prepareQty, workOrderId } = workOrderInfo;
    let payload = {
      ...record,
      workcellId: workCellInfo.workcellId,
      eoId: baseInfo.eoId,
      jobType: jobTypes[this.modelName],
      siteId,
    };
    switch (this.modelName) {
      case 'preInstalledPlatform':
        payload = {
          ...payload,
          operationId: workCellInfo.operationId,
          snMaterialId: materialId,
          prepareQty,
          workOrderId,
        };
        break;
      default:
        payload = {
          ...payload,
          operationId: baseInfo.operationId,
          snMaterialId: baseInfo.snMaterialId,
        };
    }
    dispatch({
      type: `${this.modelName}/updateState`,
      payload: {
        materialVOList: [],
      },
    });
    dispatch({
      type: `${this.modelName}/deleteSerialItem`,
      payload,
    }).then(res => {
      if (res) {
        notification.success();
        this.setState({ isUpdateLotItem: true });
      }
    });
  }


  /**
   * 删除批次物料与条码的绑定关系
   * 物料与工位有多条绑定关系的时候删除
   * 单个绑定关系删除条码
   *
   * @param {*} record
   * @memberof OperationPlatform
   */
  @Bind()
  handleDeleteBatchItem(record) {
    const { dispatch, [this.modelName]: { workCellInfo, baseInfo, workOrderInfo, siteId } } = this.props;
    let payload = {
      ...record,
      workcellId: workCellInfo.workcellId,
      eoId: baseInfo.eoId,
      prepareQty: workOrderInfo.prepareQty,
      workOrderId: workOrderInfo.workOrderId,
      jobType: jobTypes[this.modelName],
      siteId,
    };
    switch (this.modelName) {
      case 'preInstalledPlatform':
        payload = {
          ...payload,
          operationId: workCellInfo.operationId,
          snMaterialId: workOrderInfo.materialId,
        };
        break;
      default:
        payload = {
          ...payload,
          operationId: baseInfo.operationId,
          snMaterialId: baseInfo.snMaterialId,
        };
    }
    dispatch({
      type: `${this.modelName}/deleteBatchItem`,
      payload,
    }).then(res => {
      if (res) {
        notification.success();
        this.setState({ isUpdateLotItem: true });
      }
    });
  }


  /**
   * 删除时效物料与条码绑定关系
   *
   * @param {*} record
   * @memberof OperationPlatform
   */
  @Bind()
  handleDeleteTimeItem(record) {
    const { dispatch, [this.modelName]: { workCellInfo, baseInfo, workOrderInfo, siteId } } = this.props;
    const { eoId, snMaterialId } = baseInfo;
    const { materialId, prepareQty, workOrderId } = workOrderInfo;
    let payload = {
      ...record,
      workcellId: workCellInfo.workcellId,
      eoId,
      jobType: jobTypes[this.modelName],
      siteId,
    };
    switch (this.modelName) {
      case 'preInstalledPlatform':
        payload = {
          ...payload,
          operationId: workCellInfo.operationId,
          snMaterialId: materialId,
          prepareQty,
          workOrderId,
        };
        break;
      default:
        payload = {
          ...payload,
          operationId: baseInfo.operationId,
          snMaterialId,
        };
    }
    clearInterval(this.timeItemTimer);
    dispatch({
      type: `${this.modelName}/deleteTimeItem`,
      payload,
    }).then(res => {
      if (res) {
        notification.success();
        this.handleStartTimeItemTimer();
        this.setState({ isUpdateTimeItem: true });
      }
    });
  }

  @Bind()
  handleFeedMaterialItem(info = {}) {
    const {
      dispatch,
      [this.modelName]: {
        workOrderInfo,
        baseInfo,
        snNum,
        siteId,
        workCellInfo,
        equipmentList,
        containerInfo,
        materialVOList,
        lotMaterialVOList,
        timeMaterialVOList,
      },
    } = this.props;
    const newMaterialVOList = materialVOList.filter(e => e.isReleased === 1 && e.componentQty !== e.releaseQty);
    const newLotMaterialVOList = lotMaterialVOList.filter(e => e.isReleased === 1 && e.componentQty !== e.releaseQty);
    const newTimeMaterialVOList = timeMaterialVOList.filter(e => e.isReleased === 1 && e.componentQty !== e.releaseQty);
    let payload = {
      siteId,
      operationId: this.modelName === 'preInstalledPlatform' ? workCellInfo.operationId : baseInfo.operationId,
      hmeEoJobContainerVO2: containerInfo,
      jobType: jobTypes[this.modelName],
      checkOverReleaseFlag: 'Y', // 点击投料的时候需要校验是否超量
      ...info,
    };
    switch (info.materialType) {
      case 'SN':
        payload = {
          ...payload,
          materialVOList: newMaterialVOList,
        };
        break;
      case 'LOT':
        payload = {
          ...payload,
          lotMaterialVOList: newLotMaterialVOList,
        };
        break;
      case 'TIME':
        payload = {
          ...payload,
          timeMaterialVOList: newTimeMaterialVOList,
        };
        break;
      default:
    }
    const hmeWkcEquSwitchDTO6List = equipmentList.map(e => ({
      equipmentId: e.equipmentId,
      equipmentStatus: e.color,
    })).filter(e => e.equipmentId);
    payload = {
      ...baseInfo,
      ...payload,
      workOrderId: workOrderInfo.workOrderId,
      materialId: workOrderInfo.materialId,
      containerId: containerInfo.containerId,
      snNum,
      equipmentList: hmeWkcEquSwitchDTO6List,
      prepareQty: workOrderInfo.prepareQty,
    };
    if (info.materialType === 'TIME') {
      clearInterval(this.timeItemTimer);
    }
    const updateItemFlag = (materialType) => {
      switch(materialType) {
        case 'SN':
        this.setState({ isUpdateSerialItem: true });
        break;
      case 'LOT':
        this.setState({ isUpdateLotItem: true });
        break;
      case 'TIME':
        this.setState({ isUpdateTimeItem: true });
        break;
      default:
      }
    };
    return dispatch({
      type: `${this.modelName}/feedMaterialItem`,
      payload,
    }).then(res => {
      if (res) {
        if (!isEmpty(res) && res.overReleaseFlag === 'Y') {
          Modal.confirm({
            title: '超量投料，是否继续?',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              this.handleFeedMaterialItem({
                materialType: info.materialType,
                checkOverReleaseFlag: 'N',
              }).then(result => {
                if (result) {
                  notification.success();
                  updateItemFlag(info.materialType);
                }
              });
            },
          });
        } else {
          notification.success();
          updateItemFlag(info.materialType);
        }
      }
      return res;
    });
  }

  @Bind()
  handleUpdateLotReleaseQty(info = {}) {
    const { dispatch, [this.modelName]: { lotMaterialVOList } } = this.props;
    return dispatch({
      type: `${this.modelName}/updateLotReleaseQty`,
      payload: {
        info,
        lotMaterialVOList,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.setState({ isUpdateLotItem: true });
      }
      return res;
    });
  }

  @Bind()
  handleUpdateTimeReleaseQty(info = {}) {
    const { dispatch, [this.modelName]: { timeMaterialVOList } } = this.props;
    clearInterval(this.timeItemTimer);
    return dispatch({
      type: `${this.modelName}/updateTimeReleaseQty`,
      payload: {
        info,
        timeMaterialVOList,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.setState({ isUpdateTimeITem: true });
        this.handleStartTimeItemTimer();
      }
      return res;
    });
  }

  @Bind()
  handleChangeIsUpdateLotItem() {
    this.setState({ isUpdateLotItem: false });
  }

  @Bind()
  handleChangeIsUpdateTimeItem() {
    this.setState({ isUpdateTimeItem: false });
  }

  @Bind()
  handleChangeIsUpdateSerialItem() {
    this.setState({ isUpdateSerialItem: false });
  }

  @Bind()
  handleCalculate(record) {
    const { dispatch, [this.modelName]: { baseInfo, workCellInfo, dataRecordList } } = this.props;
    if (!isEmpty(record)) {
      dispatch({
        type: `${this.modelName}/calculate`,
        payload: {
          data: {
            ...record,
            operationId: this.modelName === 'preInstalledPlatform' ? workCellInfo.operationId : baseInfo.operationId,
          },
          dataRecordList,
        },
      }).then(res => {
        if (res) {
          notification.success();
        }
      });
    }
  }

  @Bind()
  handleStartTimeItemTimer() {
    const { [this.modelName]: { timeMaterialVOList }, dispatch } = this.props;
    if (timeMaterialVOList.length > 0) {
      const timer = () => {
        const newTimeMaterialVOList = timeMaterialVOList.map(e => {
          const timing = moment(e.deadLineDate).diff(moment(), 'seconds');
          if (e.deadLineDate && timing > 0) {
            return {
              ...e,
              timing: this.handleTiming(timing),
            };
          } else {
            return {
              ...e,
              timing: '00:00:00',
            };
          }
        });
        dispatch({
          type: `${this.modelName}/updateState`,
          payload: {
            timeMaterialVOList: newTimeMaterialVOList,
          },
        });
      };
      this.timeItemTimer = setInterval(timer, 1000);
    }
  }

  @Bind()
  handleFetchVirtualList(materialLotCodeList) {
    const { dispatch } = this.props;
    return dispatch({
      type: `${this.modelName}/fetchVirtualNumList`,
      payload: materialLotCodeList,
    }).then(res => {
      return res;
    });
  }

  @Bind()
  handleFeedBatchItemCalculation() {
    const { dispatch, [this.modelName]: { baseInfo, siteId, dataRecordList } } = this.props;
    dispatch({
      type: `${this.modelName}/feedBatchItemCalculation`,
      payload: {
        eoId: baseInfo.eoId,
        siteId,
        operationId: baseInfo.operationId,
        eoJobDataRecordVOList: dataRecordList,
        materialLotId: baseInfo.materialLotId,
        reworkFlag: baseInfo.materialLotId,
      },
    });
  }

  @Bind()
  handleFetchDataRecordList() {
    const { dispatch, [this.modelName]: { workCellInfo, baseInfo } } = this.props;
    dispatch({
      type: `${this.modelName}/fetchDataRecordList`,
      payload: {
        jobId: baseInfo.jobId,
        workcellId: workCellInfo.workcellId,
      },
    });
  }

  @Bind()
  handleFetchItemList(materialType) {
    const {
      dispatch,
      [this.modelName]: { workCellInfo, workOrderInfo = {}, siteId, baseInfo },
    } = this.props;
    this.setState({ badHandingFlag: false, productTraceabilityFlag: false });
    const { materialId, workOrderId, materialCode, prepareQty } = workOrderInfo;
    const { eoId, operationId, eoStepId, reworkFlag } = baseInfo;
    let payload = {
      jobId: baseInfo.jobId,
      workcellId: workCellInfo.workcellId,
      materialId: baseInfo.materialId,
      materialCode: baseInfo.materialCode,
      siteId,
      jobType: jobTypes[this.modelName],
      eoId,
      operationId,
      eoStepId,
      reworkFlag,
    };
    let effects = '';
    let itemPayload = {};
    switch (this.modelName) {
      case 'preInstalledPlatform':
        payload = {
          ...payload,
          operationId: workCellInfo.operationId,
          materialId,
          materialCode,
          workOrderId,
          workOrderInfo,
          prepareQty,
        };
        break;
      default:
    }
    switch (materialType) {
      case 'LOT':
        effects = 'fetchBatchItemList';
        itemPayload = {
          lotMaterialVOList: [],
        };
        break;
      case 'SN':
        effects = 'fetchSerialItemList';
        itemPayload = {
          materialVOList: [],
        };
        break;
      case 'TIME':
        effects = 'fetchTimeItemList';
        itemPayload = {
          timeMaterialVOList: [],
        };
        break;
      default:
    }
    if (materialType === 'TIME') {
      clearInterval(this.timeItemTimer);
    }
    dispatch({
      type: `${this.modelName}/updateState`,
      payload: itemPayload,
    });
    dispatch({
      type: `${this.modelName}/${effects}`,
      payload,
    }).then(res => {
      if (res && materialType === 'TIME') {
        this.handleStartTimeItemTimer();
      }
    });
  }

  @Bind()
  handleRefreshMaterialItemList() {
    const {
      dispatch,
      [this.modelName]: { baseInfo, snNum, siteId, workCellInfo, containerInfo, workOrderInfo },
    } = this.props;
    let payload = {
      ...baseInfo,
      siteId,
      operationId: this.modelName === 'preInstalledPlatform' ? workCellInfo.operationId : baseInfo.operationId,
      jobType: jobTypes[this.modelName],
      containerId: containerInfo.containerId,
    };
    if (this.modelName === 'preInstalledPlatform') {
      payload = {
        ...payload,
        ...baseInfo,
        snNum,
        siteId,
        workOrderId: workOrderInfo.workOrderId,
        snMaterialId: workOrderInfo.materialId,
        prepareQty: workOrderInfo.prepareQty,
      };
    }
    clearInterval(this.timeItemTimer);
    dispatch({
      type: `${this.modelName}/updateState`,
      payload: {
        materialVOList: [],
        lotMaterialVOList: [],
        timeMaterialVOList: [],
      },
    });
    dispatch({
      type: `${this.modelName}/refreshMaterialItemList`,
      payload,
    }).then(res => {
      if (res) {
        this.handleStartTimeItemTimer();
        this.setState({ isUpdateLotItem: true, isUpdateTimeItem: true, isUpdateSerialItem: true });
      }
    });
  }


  @Bind()
  handleClearFeedingRecordList() {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/updateState`,
      payload: {
        feedingRecordList: [],
      },
    });
  }

  @Bind()
  openToolingManagement() {
    const { [this.modelName]: { workCellInfo = {} } } = this.props;
    openTab({
      key: `/hhme/tool-management`, // 打开 tab 的 key
      path: `/hhme/tool-management`, // 打开页面的path
      title: '工装管理',
      search: queryString.stringify({
        workcellId: workCellInfo.workcellId,
      }),
      closable: true,
    });
  }

  render() {
    const {
      fetchBaseInfoLoading,
      addContainerLoading,
      outSiteLoading,
      feedSerialItemLoading,
      feedTimeItemLoading,
      feedBatchItemLoading,
      fetchSiteIdLoading,
      addDataRecordLoading,
      addDataRecordBatchLoading,
      fetchWorkCellInfoLoading,
      fetchSnListLoading,
      fetchEquipmentListLoading,
      deleteEqLoading,
      changeEqLoading,
      changeEqConfirmLoading,
      bindingEqLoading,
      bindingEqConfirmLoading,
      lotOutSiteLoading,
      tenantId,
      fetchCompletedMaterialInfoLoading,
      fetchMaterialLotListLoading,
      fetchIsInMaterialLotLoading,
      fetchIsContainerLoading,
      fetchFeedingRecordLoading,
      feedMaterialItemLoading,
      checkBatchItemLoading,
      checkTimeItemLoading,
      checkSerialItemLoading,
      deleteBatchItemLoading,
      deleteTimeItemLoading,
      deleteSerialItemLoading,
      fetchVirtualNumListLoading,
      calculateLoading,
      fetchSerialItemListLoading,
      fetchBatchItemListLoading,
      fetchTimeItemListLoading,
      refreshMaterialItemListLoading,
      returnMaterialLoading,
      clickSnListLoading,
      [this.modelName]: {
        workCellInfo = {},
        containerInfo = {},
        baseInfo = {},
        materialVOList = [],
        lotMaterialVOList = [],
        timeMaterialVOList = [],
        equipmentList = [],
        dataRecordList = [],
        addDataRecordList = [], // 弹框内的数据采集项
        selfCheckList = [],
        equipmentInfo = {},
        siteId,
        workOrderInfo,
        outOfPlanMaterialList,
        materialLotList,
        materialLotPagination,
        feedingRecordList,
        virtualNumList,
      },
    } = this.props;
    const {
      visible,
      materialVisible,
      dataRecordVisible,
      isUpdateLotItem,
      isUpdateTimeItem,
      isUpdateSerialItem,
    } = this.state;
    const serialItemProps = {
      tenantId,
      baseInfo,
      isUpdateSerialItem,
      feedingRecordList,
      outOfPlanMaterialList,
      materialLotList,
      materialLotPagination,
      fetchMaterialLotListLoading,
      returnMaterialLoading,
      modelName: this.modelName,
      loading: feedSerialItemLoading || checkSerialItemLoading || deleteSerialItemLoading || fetchSerialItemListLoading || feedMaterialItemLoading || returnMaterialLoading || refreshMaterialItemListLoading,
      returnLoading: fetchFeedingRecordLoading,
      itemList: materialVOList,
      onEnterClick: this.handleFeedSerialItem,
      onOpenModal: this.handleOpenMaterialModal,
      firstProcessSerialItem: this.firstProcessSerialItem,
      onFetchIsContainer: this.handleFetchIsContainer,
      onFetchMaterialLotList: this.handleFetchMaterialLotList,
      onFetchFeedingRecord: this.handleFetchFeedingRecord,
      onReturnMaterial: this.handleReturnMaterial,
      onCheckItem: this.handleCheckSerialItem,
      onFeedMaterialItem: this.handleFeedMaterialItem,
      onChangeIsUpdateSerialItem: this.handleChangeIsUpdateSerialItem,
      onClearFeedingRecordList: this.handleClearFeedingRecordList,
    };
    const batchItemProps = {
      baseInfo,
      workOrderInfo,
      isUpdateLotItem,
      modelName: this.modelName,
      outOfPlanMaterialList,
      feedingRecordList,
      virtualNumList,
      fetchVirtualNumListLoading,
      returnMaterialLoading,
      loading: feedBatchItemLoading || checkBatchItemLoading || fetchBatchItemListLoading || deleteBatchItemLoading || returnMaterialLoading || feedSerialItemLoading || refreshMaterialItemListLoading || feedMaterialItemLoading,
      feedMaterialItemLoading,
      itemList: lotMaterialVOList,
      returnLoading: fetchFeedingRecordLoading,
      onEnterClick: this.handleFeedBatchItem,
      onFetchFeedingRecord: this.handleFetchFeedingRecord,
      onReturnMaterial: this.handleReturnMaterial,
      onCheckItem: this.handleCheckBatchItem,
      onFeedMaterialItem: this.handleFeedMaterialItem,
      onUpdateReleaseQty: this.handleUpdateLotReleaseQty,
      onChangeIsUpdateLotItem: this.handleChangeIsUpdateLotItem,
      onFetchVirtualList: this.handleFetchVirtualList,
      onClearFeedingRecordList: this.handleClearFeedingRecordList,
    };
    const agingItemProps = {
      baseInfo,
      workOrderInfo,
      isUpdateTimeItem,
      modelName: this.modelName,
      outOfPlanMaterialList,
      feedingRecordList,
      returnMaterialLoading,
      loading: feedTimeItemLoading || checkTimeItemLoading || deleteTimeItemLoading || fetchTimeItemListLoading || returnMaterialLoading || feedSerialItemLoading || refreshMaterialItemListLoading || feedMaterialItemLoading,
      itemList: timeMaterialVOList,
      returnLoading: fetchFeedingRecordLoading,
      feedMaterialItemLoading,
      onEnterClick: this.handleFeedTimeItem,
      onFetchFeedingRecord: this.handleFetchFeedingRecord,
      onReturnMaterial: this.handleReturnMaterial,
      onCheckItem: this.handleCheckTimeItem,
      onFeedMaterialItem: this.handleFeedMaterialItem,
      onUpdateReleaseQty: this.handleUpdateTimeReleaseQty,
      onChangeIsUpdateTimeItem: this.handleChangeIsUpdateTimeItem,
      onClearFeedingRecordList: this.handleClearFeedingRecordList,
    };
    const stationEquipmentProps = {
      siteId,
      workCellInfo,
      equipmentInfo,
      deleteEqLoading,
      changeEqLoading,
      bindingEqLoading,
      bindingEqConfirmLoading,
      changeEqConfirmLoading,
      loading: fetchEquipmentListLoading,
      itemList: equipmentList,
      onDelete: this.handleDeleteEq,
      onChange: this.handleChangeEq,
      onBinding: this.handleBindingEq,
      onBindingEqConfirm: this.handleBindingEqConfirm,
      onChangeEqConfirm: this.handleChangeEqConfirm,
      onFetchEqInfo: this.handleFetchEqInfo,
      onFetchEquipment: this.handleFetchEquipment,
    };
    const dataInfoProps = {
      baseInfo,
      modelName: this.modelName,
      loading: addDataRecordLoading || addDataRecordBatchLoading || calculateLoading,
      dataSource: dataRecordList,
      onEnterClick: this.handleAddDataRecord,
      onOpenDataRecordModal: this.handleOpenDataRecordModal,
      onCalculate: this.handleCalculate,
      // onChangeResult: this.handleChangeResult,
    };
    const containerInfoProps = {
      workCellInfo,
      containerInfo,
      addContainerLoading,
      dataSource: containerInfo.materialLotList || [],
      onUpdateContainer: this.handleUpdateContainer,
      onUninstallContainer: this.handleUninstallContainer,
    };
    const selfCheckInfoProps = {
      loading: addDataRecordLoading,
      dataSource: selfCheckList,
      onEnterClick: this.handleAddDataRecord,
    };
    const enterModalProps = {
      visible,
      modelName: this.modelName,
      loading: fetchSiteIdLoading,
      onFetchWorkCellInfo: this.handleFetchWorkCellInfo,
    };
    const preInstalledInfoProps = {
      siteId,
      workCellInfo,
      workOrderInfo,
      baseInfo,
      fetchCompletedMaterialInfoLoading,
      onFetchWorkOrderInfo: this.handleFetchWorkOrderInfo,
      onCompletedMaterialInfo: this.fetchCompletedMaterialInfo,
      onFetchBaseInfo: this.handleFetchBaseInfo,
      onOutSite: this.handleOutSite,
      onFetchWorkCellInfo: this.handleFetchWorkCellInfo,
      onInitData: this.handleInitData,
    };
    const materialModalProps = {
      userId: getCurrentUserId(),
      dataSource: outOfPlanMaterialList,
      visible: materialVisible,
      onCleanLine: this.handleCleanLine,
      onEditLine: this.handleEditLine,
      onSave: this.handleSaveMaterialList,
      onDelete: this.handleDelete,
      onCreate: this.handleCreate,
      onCloseModal: this.handleCloseMaterialModal,
    };

    const dataRecordModalProps = {
      tenantId,
      baseInfo,
      modelName: this.modelName,
      loading: addDataRecordLoading || addDataRecordBatchLoading,
      dataSource: addDataRecordList,
      visible: dataRecordVisible,
      onCloseModal: this.handleCloseDataRecordModal,
      onGetData: this.handleGetData,
      onCleanLine: this.handleCleanLine,
      onEditLine: this.handleEditLine,
      onSave: this.handleSaveDataRecordList,
      onDelete: this.handleDelete,
      onCreate: this.handleCreate,
      onEnterClick: this.handleAddDataRecord,
    };

    return (
      <Fragment>
        <Header title="物料预装平台">
          <Button
            type="default"
            onClick={() => this.handleRefreshMaterialItemList()}
            disabled={!baseInfo.siteInDate}
          >
            刷新投料
          </Button>
          <Button
            type="default"
            style={{ marginRight: '12px' }}
            onClick={() => this.openToolingManagement()}
          >
            工装管理
          </Button>
        </Header>
        <Content style={{ paddingRight: '24px' }}>
          <Spin spinning={
            fetchBaseInfoLoading || outSiteLoading || fetchWorkCellInfoLoading
            || fetchSnListLoading || lotOutSiteLoading
            || fetchIsInMaterialLotLoading || fetchIsContainerLoading ||clickSnListLoading
            || false}
          >
            <div style={{height: '480px', marginBottom: '5px', marginLeft: '-24px', marginRight: '-24px' }}>
              <div style={{ paddingLeft: '12px', paddingRight: '2px', width: '35%', float: 'left', height: '100%' }}>
                <PreInstalledInfo {...preInstalledInfoProps} />
              </div>
              <div style={{ paddingLeft: '2px', paddingRight: '2px', width: '25%', float: 'left' }}>
                <SerialItem {...serialItemProps} />
              </div>
              <div style={{ paddingLeft: '2px', paddingRight: '2px', width: '25%', float: 'left' }}>
                <div className={styles['third-col']}>
                  <BatchItem {...batchItemProps} />
                  <AgingItem {...agingItemProps} />
                </div>
              </div>
              <div style={{ paddingLeft: '2px', paddingRight: '2px', width: '15%', float: 'left' }}>
                <StationEquipment {...stationEquipmentProps} />
              </div>
              <EnterModal {...enterModalProps} />
            </div>
            <Row gutter={48} className={styles['second-row']}>
              <Col span={9} style={{ paddingLeft: '12px', paddingRight: '2px' }}>
                <DataInfo {...dataInfoProps} />
              </Col>
              <Col span={5} style={{ paddingLeft: '2px', paddingRight: '2px' }}>
                <ContainerInfo {...containerInfoProps} />
              </Col>
              <Col span={7} style={{ paddingLeft: '2px', paddingRight: '2px' }}>
                <SelfCheckInfo {...selfCheckInfoProps} />
              </Col>
              <Col span={3} style={{ paddingLeft: '2px', paddingRight: '2px' }}>
                <div className={styles['related-button-content']}>
                  <div onClick={() => this.openBadHandTab()}>
                    <span className={styles['related-button-span']} />
                    <span>不良统计</span>
                    <span className={styles['related-button-quantity']}>查看</span>
                  </div>
                  <div>
                    <span className={styles['related-button-span']} />
                    <span>异常反馈</span>
                    <span className={styles['related-button-quantity']}>查看</span>
                  </div>
                  <div onClick={() => this.openProductTraceability()}>
                    <span className={styles['related-button-span']} />
                    <span>制造履历</span>
                    <span className={styles['related-button-quantity']}>查看</span>
                  </div>
                  <div>
                    <span className={styles['related-button-span']} />
                    <span>E-SOP</span>
                    <span className={styles['related-button-quantity']}>查看</span>
                  </div>
                </div>
              </Col>
            </Row>
          </Spin>
          <MaterialModal {...materialModalProps} />
          <DataRecordModal {...dataRecordModalProps} />
        </Content>
      </Fragment>
    );
  }
}
