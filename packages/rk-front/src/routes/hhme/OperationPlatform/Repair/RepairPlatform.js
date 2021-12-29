import React, { Component, Fragment } from 'react';
import { Row, Col, Spin, Modal, Button, Dropdown, Icon, Menu } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import { isEmpty, isArray, isNull, isUndefined } from 'lodash';

import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import {
  filterNullValueObject,
} from 'utils/utils';

import { openTab } from 'utils/menuTab';
import queryString from 'querystring';
import BaseInfo from '../Component/BaseInfo'; // 工序作业平台 / 批量工序作业平台 基本信息框
import StationEquipment from '../Component/StationEquipment'; // 设备工位
import DataInfo from '../Component/DataInfo'; // 数据采集项
import ContainerInfo from '../Component/ContainerInfo'; // 容器相关信息
import SelfCheckInfo from '../Component/SelfCheckInfo'; // 自检数据采集项
import EnterModal from '../Component/EnterModal'; // 工位输入弹框
import DataRecordModal from '../Component/DataRecordModal'; // 补充数据采集弹框
// import DataRecordEditModal from './DataRecordEditModal'; // 补充数据采集弹框s
import OutSiteConfirmModal from '../Component/OutSiteConfirmModal';
import BomModal from '../Component/BomModal';
import LocationInfoModal from '../Component/LocationInfoModal';
import BackMaterialInfoModal from '../Component/BackMaterialInfoModal';
import MaterialInfo from '../Component/MaterialInfo';
import ESopModal from '../Component/ESopModal';
import SnDataModal from '../Component/SnDataModal';
import ComponentDataModal from '../Component/ComponentDataModal';
import PumpListModal from '../Component/PumpListModal';
import styles from '../Component/index.less';

const jobTypes = {
  lotOperationPlatform: 'BATCH_PROCESS',
  singleOperationPlatform: 'SINGLE_PROCESS',
  firstProcessPlatform: 'SINGLE_PROCESS',
  preInstalledPlatform: 'PREPARE_PROCESS',
  repairPlatform: 'SINGLE_PROCESS', // 返修作业平台
};


export default class OperationPlatform extends Component {
  constructor(props) {
    super(props);
    this.modelName = props.modelName || '';
    // singleOperationPlatform  工序作业平台
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
      outSiteConfirmModalVisible: false,
      snDataVisible: false, // 当前sn数据弹框
      componentDataVisible: false, // 组件sn数据弹框
      pumpListModalVisible: false,
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
    dispatch({
      type: `${this.modelName}/init`,
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
    const { dispatch } = this.props;
    let payload = {
      baseInfo: {},
      selectedRecord: {},
      snNum: null,
      isContainerOut: true, // 是否显示容器
      materialList: [], // 物料
      dataRecordList: [],
      // addDataRecordList: [],
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
    } : payload;
    dispatch({
      type: `${this.modelName}/updateState`,
      payload,
    });
    clearInterval(this.timeItemTimer);
    if (!isInit) {
      clearInterval(this.timer);
    }
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
      [this.modelName]: { siteInfo: { siteId } },
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
        const snNumInput = document.getElementsByClassName('operation-platform-sn-num');
        snNumInput[0].select();
        this.handleFetchWorkCellMaterialList(res.workcellId);
        this.setState({ jumpData: res });
        this.handleFetchEquipment(workcellCode);

      }
    });
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

  @Bind()
  handleFetchWorkCellMaterialList(workcellId) {
    const {
      dispatch,
      [this.modelName]: { siteInfo: { siteId } },
    } = this.props;
    clearInterval(this.timeItemTimer);
    dispatch({
      type: `${this.modelName}/fetchWorkCellMaterialList`,
      payload: {
        workcellId,
        siteId,
        jobType: jobTypes[this.modelName],
        // siteId: 40226.1,
      },
    });
  }

  @Bind()
  handleFetchMaterialList(selectedList = []) {
    const { dispatch, [this.modelName]: { siteInfo: { siteId }, baseInfo } } = this.props;
    let dtoList = isArray(selectedList) && !isEmpty(selectedList) ? selectedList : [baseInfo];
    dtoList = dtoList.map(e => {
      const { dataRecordVOList, materialVOList, timeMaterialVOList, lotMaterialVOList, ...obj } = e;
      return obj;
    });
    clearInterval(this.timeItemTimer);
    dispatch({
      type: `${this.modelName}/fetchMaterialList`,
      payload: {
        dtoList,
        siteId,
        reworkFlag: baseInfo.reworkFlag,
      },
    }).then(res => {
      if (res) {
        this.handleStartTimeItemTimer();
      }
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
      [this.modelName]: { workCellInfo, equipmentList, siteInfo: { siteId }, eoStepList, exceptionEquipmentCodes, errorEquipmentCodes },
    } = this.props;
    const fetchBaseInfo = () => {
      this.setState({ badHandingFlag: false, productTraceabilityFlag: false });
      clearInterval(this.timer);
      this.setState({ timing: `00:00:00` });
      const hmeWkcEquSwitchDTO6List = equipmentList.map(e => ({
        equipmentId: e.equipmentId,
        equipmentStatus: e.color,
      })).filter(e => e.equipmentId);
      clearInterval(this.timeItemTimer);
      dispatch({
        type: `${this.modelName}/fetchBaseInfo`,
        payload: {
          ...info,
          workcellId: workCellInfo.workcellId,
          jobContainerId: workCellInfo.jobContainerId,
          operationIdList: workCellInfo.operationIdList,
          workcellCode: workCellInfo.workcellCode,
          workcellName: workCellInfo.workcellCode,
          equipmentList: hmeWkcEquSwitchDTO6List,
          siteId,
          wkcShiftId: workCellInfo.wkcShiftId,
          eoStepList,
          jobType: jobTypes[this.modelName],
          operationId: workCellInfo.operationIdList[0],
          prodLineId: workCellInfo.prodLineId,
          processId: workCellInfo.processId,
        },
      }).then(res => {
        // 首序工序作业平台 / 工序作业平台 未出站的数据需要计时
        if (res && res.siteInDate && !res.siteOutDate) { // 进站未出站 需计时
          this.handleStartTiming(res.siteInDate);
        } else if (res && res.siteInDate && res.siteOutDate) { // 进站且出站 计算时差
          // 已出站的数据 需要计算时差
          const newTime = moment(res.siteOutDate).diff(moment(res.siteInDate), 'seconds');
          this.setState({
            timing: this.handleTiming(newTime),
          });
        }
        // 如果查询成功之后设置跳转标示为true
        if (res) {
          this.handleFetchWorkCellMaterialList(workCellInfo.workcellId);
          this.setState({ badHandingFlag: true, productTraceabilityFlag: true });
        }

        if (res.showTagModelFlag === 'Y') {
          this.handleOpenSnDataModal();
        }
      });
    };
    if (exceptionEquipmentCodes || errorEquipmentCodes) {
      Modal.confirm({
        title: `${exceptionEquipmentCodes || errorEquipmentCodes}设备需要进行点检,是否先进行点检`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.openEquipmentCheck();
        },
        onCancel: () => {
          if (exceptionEquipmentCodes) {
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
   * 根据工位加载设备类列表
   *
   * @param {*} workcellCode
   * @memberof OperationPlatform
   */
  @Bind()
  handleFetchEquipment(workcellCode) {
    const { dispatch, [this.modelName]: { siteInfo: { siteId } } } = this.props;
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
   * 出站
   *
   * @memberof OperationPlatform
   */
  @Bind()
  handleOutSite(info = {}) {
    const {
      dispatch,
      [this.modelName]: { baseInfo, snNum, siteInfo: { siteId }, workCellInfo, equipmentList, containerInfo, dataRecordList, selfCheckList },
    } = this.props;

    const checkFlag = dataRecordList.concat(selfCheckList).every(e => {
      const val = e.result;
      const flag = (!isNull(e.minimumValue) && isNull(e.maximalValue) && val >= e.minimumValue)
        || (!isNull(e.maximalValue) && val <= e.maximalValue && isNull(e.minimumValue))
        || val === 'OK'
        || (isNull(e.maximalValue) && isNull(e.minimumValue) && e.resultType !== 'DECISION_VALUE')
        || (!isNull(e.maximalValue) && !isNull(e.minimumValue) && val >= e.minimumValue && val <= e.maximalValue);
      if (e.valueAllowMissing === 'Y' && !val) {
        return true;
      } else if (val) {
        return flag;
      } else if (e.resultType === 'DECISION_VALUE' && !val) {
        return false;
      } else {
        return true;
      }
    });
    if (!checkFlag) {
      return notification.error({ message: "出站失败,当前数据采集项存在不合格项" });
    }


    let effects = '';
    let payload = {
      siteId,
      operationId: baseInfo.operationId,
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
      ...info,
      ...payload,
      wkcShiftId: workCellInfo.wkcShiftId,
    };
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
        } else if (res && !isEmpty(res.hmeTagNcVOList)) {
          this.setState({ outSiteConfirmModalVisible: true });
        } else if (res) {
          clearInterval(this.timer);
          notification.success();
          if (workCellInfo.jobContainerId) {
            this.handleFetchContainerInfo();
          }
          this.handleInitData(false);
          const snNumInput = document.getElementsByClassName('operation-platform-sn-num');
          if (snNumInput.length > 0) {
            snNumInput[0].select();
          }
        }
        return res;
      });
    };
    return new Promise((resolve) => {
      return outSiteFuc().then(res => {
        return resolve(res);
      });
    });
  }

  /**
   * 异常出站
   *
   */
  @Bind
  handleAbnormalOutSite(info = {}) {
    const {
      dispatch,
      [this.modelName]: { baseInfo, snNum, siteInfo: { siteId }, workCellInfo, equipmentList, containerInfo },
    } = this.props;

    let effects = '';
    let payload = {
      siteId,
      operationId: baseInfo.operationId,
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
      ...info,
      ...payload,
      wkcShiftId: workCellInfo.wkcShiftId,
    };
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
        } else if (res && !isEmpty(res.hmeTagNcVOList)) {
          this.setState({ outSiteConfirmModalVisible: true });
        } else if (res) {
          clearInterval(this.timer);
          notification.success();
          if (workCellInfo.jobContainerId) {
            this.handleFetchContainerInfo();
          }
          this.handleInitData(false);
          const snNumInput = document.getElementsByClassName('operation-platform-sn-num');
          if (snNumInput.length > 0) {
            snNumInput[0].select();
          }
        }
        return res;
      });
    };
    return new Promise((resolve) => {
      return outSiteFuc().then(res => {
        return resolve(res);
      });
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
      [this.modelName]: {
        [dataSourceName]: dataSource,
        baseInfo = {},
      },
    } = this.props;
    const { materialLotId, reworkFlag } = baseInfo;
    let payload = {
      jobType: jobTypes[this.modelName],
    };
    // const { _status, ...info } = record;
    payload =
    // record.isEdit && _status === 'create' ? {
    //   eqDataList: [{
    //     ...info,
    //     materialLotId,
    //     operationId: baseInfo.operationId,
    //     reworkFlag,
    //     eoId,
    //   }],
    //   list: dataSource,
    //   dataSourceName,
    // } : record._status === 'update' && record.isEdit ? {
    //   eqDataList: [{
    //     ...record, materialLotId,
    //     operationId: baseInfo.operationId,
    //     reworkFlag,
    //     eoId,
    //   }],
    //   list: dataSource,
    //   dataSourceName,
    // } :
    {
      ...record,
      materialLotId,
      operationId: baseInfo.operationId,
      reworkFlag,
      result: value,
      list: dataSource,
      dataSourceName,
    };
    // if (record.isEdit) {
    //   return dispatch({
    //     type: `${this.modelName}/addDataRecordBatch`,
    //     payload,
    //   });
    // } else {
    return dispatch({
      type: `${this.modelName}/addDataRecord`,
      payload,
    }).then(res => {
      return res;
    });
    // }
  }

  @Bind
  updateRemark(value, record, dataSourceName) {
    const {
      dispatch,
      [this.modelName]: { [dataSourceName]: list, baseInfo: { operationId, materialLotId, reworkFlag } },
    } = this.props;
    dispatch({
      type: `${this.modelName}/addDataRecord`,
      payload: {
        ...record,
        materialLotId,
        operationId,
        reworkFlag,
        remark: value,
        list,
        dataSourceName,
      },
    });
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
    const { dispatch, [this.modelName]: { siteInfo: { siteId } } } = this.props;
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
    const { dispatch, [this.modelName]: { siteInfo: { siteId } } } = this.props;
    return dispatch({
      type: `${this.modelName}/bindingEqConfirm`,
      payload: {
        ...info,
        siteId,
      },
    });
  }

  /**
   * @description: 跳转到不良处理平台
   * @param {type} params
   */
  @Bind()
  openBadHandTab() {
    const { jumpData, badHandingFlag } = this.state;
    const fieldsValue = (this.baseInfoform && filterNullValueObject(this.baseInfoform.getFieldsValue())) || {};
    if (!badHandingFlag) {
      return notification.warning({ description: '请扫描条码！' });
    }
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
        snNum: fieldsValue.snNum,
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

  // 打开详情页面
  @Bind()
  handleOpenDataRecordModal() {
    this.setState({ dataRecordVisible: true });
    this.handleFetchDataRecordList();
  }

  // 关闭详情页面
  @Bind()
  handleCloseDataRecordModal() {
    this.setState({ dataRecordVisible: false });
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

  @Bind()
  handleFetchIsContainer(barcode) {
    const { dispatch } = this.props;
    return dispatch({
      type: `${this.modelName}/fetchIsContainer`,
      payload: { barcode },
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
        operationId: baseInfo.operationId,
      },
    });
  }


  /**
   * 确认退料
   *
   * @memberof OperationPlatform
   */
  @Bind()
  handleReturnMaterial(payload, flag = false) {
    const { dispatch, [this.modelName]: { materialList, materialSelectedRows } } = this.props;
    const { materialType } = payload;
    const effect = flag ? 'returnMaterial' : 'scrapMaterial';
    const newPayload = flag ? {
      ...payload,
      materialList,
      materialSelectedRows,
    } : payload;
    return dispatch({
      type: `${this.modelName}/${effect}`,
      payload: newPayload,
    }).then(res => {
      if (res) {
        notification.success();
        this.handleFetchFeedingRecord(materialType);
        this.handleFetchMaterialList();
      }
    });
  }

  /**
   * 解绑其他工位的物料，绑定到当前物料
   * @param {传入参数} payload
   */
  @Bind()
  handleDeleteAndBandData(payload) {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/deleteAndBand`,
      payload,
    });
  }

  @Bind()
  handleCalculate(record) {
    const { dispatch, [this.modelName]: { baseInfo, dataRecordList } } = this.props;
    if (!isEmpty(record)) {
      dispatch({
        type: `${this.modelName}/calculate`,
        payload: {
          data: {
            ...record,
            operationId: baseInfo.operationId,
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

  /**
   * 设置选中状态
   * @param {*} flag
   */
  @Bind
  handleChecked(flag) {
    const { dispatch, [this.modelName]: { dataRecordList } } = this.props;

    // 更改状态
    for (let i = 0; i < dataRecordList.length; i++) {
      dataRecordList[i].isEdit = flag;
      dataRecordList[i].selected = false;
    }

    dispatch({
      type: `${this.modelName}/updateState`,
      payload: {
        dataRecordList,
      },
    });
  }

  /**
   *选中信息
   * @param {*} e
   * @param {*} index
   */
  @Bind
  setChecked(e, index) {
    const { dispatch, [this.modelName]: { dataRecordList } } = this.props;

    // 设置选中状态
    dataRecordList[index].selected = e.target.checked;

    // 更新对应的数据状态
    dispatch({
      type: `${this.modelName}/updateState`,
      payload: {
        dataRecordList,
      },
    });
  }

  /**
   * 删除选中数据
   */
  @Bind
  handleDeleteData() {
    const { dispatch, [this.modelName]: { dataRecordList } } = this.props;
    const dataShow = dataRecordList.filter(item => item.selected);
    dispatch({
      type: `${this.modelName}/deleteData`,
      payload: dataShow.map(item => { return item.jobRecordId; }),
    }).then(res => {
      if (res) {
        // 设置选中信息
        const dataRes = dataRecordList.filter(item => !item.selected);
        for (let i = 0; i < dataRes.length; i++) {
          dataRes[i].isEdit = false;
          dataRes[i].selected = false;
        }

        dispatch({
          type: `${this.modelName}/updateState`,
          payload: {
            dataRecordList: dataRes,
          },
        });
      }
    });
  }

  @Bind()
  handleCloseOutSiteConfirmModal() {
    this.setState({ outSiteConfirmModalVisible: false });
  }

  @Bind()
  handleConfirmOutSite() {
    this.handleOutSite({
      outSiteAction: 'COMPLETE',
      checkTagNcFlag: 'N',
    });
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
  handleFetchLocationInfo(page, fields) {
    const { dispatch, [this.modelName]: { workCellInfo } } = this.props;
    const { workcellId } = workCellInfo;
    dispatch({
      type: `${this.modelName}/fetchLocationInfo`,
      payload: {
        page,
        ...fields,
        workcellId,
      },
    });
  }

  @Bind()
  handleFetchBackMaterialInfo(page) {
    const { dispatch, [this.modelName]: { baseInfo, workCellInfo, siteInfo: { siteId } } } = this.props;
    const { eoId, operationId, eoStepId } = baseInfo;
    const { workcellId } = workCellInfo;
    dispatch({
      type: `${this.modelName}/fetchBackMaterialInfo`,
      payload: {
        page,
        siteId,
        eoId,
        operationId,
        eoStepId,
        workcellId,
      },
    });
  }


  @Bind()
  handleOpenBomModal() {
    this.setState({ bomVisible: true });
    this.handleFetchBomList();
  }

  @Bind()
  handleCloseBomModal() {
    const { dispatch } = this.props;
    this.setState({ bomVisible: false });
    dispatch({
      type: `${this.modelName}/updateState`,
      payload: {
        bomList: [],
        bomPagination: {},
      },
    });
  }

  @Bind()
  handleFetchBomList(params) {
    const { dispatch, [this.modelName]: { baseInfo } } = this.props;
    dispatch({
      type: `${this.modelName}/fetchBomList`,
      payload: {
        ...params,
        eoId: baseInfo.eoId,
      },
    });
  }

  @Bind()
  openExceptionTab() {
    const { [this.modelName]: { siteInfo: { siteId }, workCellInfo } } = this.props;
    openTab({
      key: `/hmes/exception-handling-platform/menu`, // 打开 tab 的 key
      path: `/hmes/exception-handling-platform/menu`, // 打开页面的path
      title: '异常处理平台',
      search: queryString.stringify({
        siteId,
        workcellCode: workCellInfo.workcellCode,
        operationTabFlag: true,
      }),
      closable: true,
    });
  }

  /**
   * 扫描物料条码
   *
   * @param {*} barcode
   * @memberof OperationPlatform
   */
  @Bind()
  handleScanBarcode(barcode) {
    const { dispatch, [this.modelName]: { workCellInfo, expandedRowKeys, materialSelectedRows, barCodeSelectedRows, baseInfo, materialList, siteInfo } } = this.props;
    const { siteId } = siteInfo;
    if (barcode) {
      clearInterval(this.timeItemTimer);
      dispatch({
        type: `${this.modelName}/scanBarcode`,
        payload: {
          materialLotCode: barcode,
          siteId,
          snLineList: [baseInfo],
          workcellId: workCellInfo.workcellId,
          componentList: materialList,
          expandedRowKeys,
          materialSelectedRows,
          barCodeSelectedRows,
          reworkFlag: baseInfo.reworkFlag,
        },
      }).then(res => {
        const barcodeInput = document.getElementsByClassName('operation-platform-material-barcode');
        if (barcodeInput.length > 0) {
          barcodeInput[0].focus();
          barcodeInput[0].value = '';
        }
        if (res && res.deleteFlag === 'Y') { // 删除标识， 删除条码绑定
          const message = res.component.productionType === 'SN' && baseInfo.snNum !== res.component.currBindSnNum
            ? `条码${barcode}已绑定${res.component.currBindSnNum}，是否解除绑定关系并绑定当前SN?`
            : `条码${barcode}已绑定当前工位，是否解除绑定关系?`;
          Modal.confirm({
            title: message,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              if (res.component.productionType === 'SN' && baseInfo.snNum !== res.component.currBindSnNum) {
                this.handleDeleteBarcode(res.component, barcode).then(result => {
                  if (result) {
                    this.handleScanBarcode(barcode);
                  }
                });
              } else {
                this.handleDeleteBarcode(res.component, barcode);
              }
            },
          });
        }
        this.handleStartTimeItemTimer();
      });
    }
  }


  /**
   * 取消条码与物料的绑定
   *
   * @memberof OperationPlatform
   */
  @Bind()
  handleDeleteBarcode(component, barcode) {
    const { dispatch, [this.modelName]: { materialList, barCodeSelectedRows, materialSelectedRows } } = this.props;
    clearInterval(this.timeItemTimer);
    return dispatch({
      type: `${this.modelName}/deleteBarcode`,
      payload: {
        component,
        materialList,
        barCodeSelectedRows,
        materialSelectedRows,
        barcode,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleStartTimeItemTimer();
      }
      return res;
    });
  }


  /**
   * 勾选单个物料
   *
   * @param {*} record
   * @param {*} selected
   * @memberof OperationPlatform
   */
  @Bind()
  handleSelectMaterialSelectedRows(record, selected) {
    const { dispatch, [this.modelName]: { barCodeSelectedRows, materialList, materialSelectedRows } } = this.props;
    const newBarCodeSelectedRows = selected ?
      barCodeSelectedRows.concat(record.materialLotList) :
      barCodeSelectedRows.filter(e => !(e.materialId === record.materialId));
    let newMaterialList = []; // 需更新物料的勾选条码量与勾选条码总量
    let newMaterialSelectedRows = [];
    let currentMaterial = record;
    if (selected) {
      let newSelectedSnQty = 0;
      record.materialLotList.forEach(i => {
        newSelectedSnQty += i.primaryUomQty;
      });
      currentMaterial = {
        ...currentMaterial,
        selectedSnQty: newSelectedSnQty,
        selectedSnCount: currentMaterial.materialLotList.length,
        _status: 'update',
      };
      newMaterialSelectedRows = materialSelectedRows.concat([currentMaterial]);
    } else {
      currentMaterial = {
        ...currentMaterial,
        selectedSnQty: 0,
        selectedSnCount: 0,
        _status: '',
      };
      newMaterialSelectedRows = materialSelectedRows.filter(e => !(e.materialId === record.materialId));

    }
    newMaterialList = materialList.map(e => {
      if (e.materialId === record.materialId) {
        return currentMaterial;
      }
      return e;
    });
    clearInterval(this.timeItemTimer);
    dispatch({
      type: `${this.modelName}/updateState`,
      payload: {
        materialList: newMaterialList,
        barCodeSelectedRows: newBarCodeSelectedRows,
        materialSelectedRows: newMaterialSelectedRows,
      },
    });
    this.handleStartTimeItemTimer();
  }


  /**
   * 全选所有物料
   *
   * @param {*} selected
   * @memberof OperationPlatform
   */
  @Bind()
  handleSelectAllMaterialList(selected) {
    const { dispatch, [this.modelName]: { materialList } } = this.props;
    let barCodeSelectedRows = [];
    const newMaterialList = [];
    const newMaterialSelectedRows = [];
    materialList.forEach(e => {
      if (selected) {
        barCodeSelectedRows = barCodeSelectedRows.concat(e.materialLotList);
        let newSelectedSnQty = 0;
        e.materialLotList.forEach(i => {
          newSelectedSnQty += i.primaryUomQty;
        });
        const newMaterial = {
          ...e,
          selectedSnQty: newSelectedSnQty,
          selectedSnCount: e.materialLotList.length,
          _status: 'update',
        };
        newMaterialSelectedRows.push(newMaterial);
        newMaterialList.push(newMaterial);
      } else {
        newMaterialList.push({
          ...e,
          selectedSnQty: 0,
          selectedSnCount: 0,
          _status: '',
        });
      }
    });
    clearInterval(this.timeItemTimer);
    dispatch({
      type: `${this.modelName}/updateState`,
      payload: {
        barCodeSelectedRows,
        materialList: newMaterialList,
        materialSelectedRows: newMaterialSelectedRows,
      },
    });
    this.handleStartTimeItemTimer();
  }


  /**
   * 勾选 / 取消勾选条码
   *
   * @param {*} record
   * @param {*} selected
   * @memberof OperationPlatform
   */
  @Bind()
  handleSelectBarcodeSelectedRows(record, selected) {
    const { dispatch, [this.modelName]: { barCodeSelectedRows, materialSelectedRows, materialList } } = this.props;
    let currentMaterial = materialList.find(e => e.materialId === record.materialId);
    let newMaterialList = materialList;
    let newBarCodeSelectedRows = barCodeSelectedRows;
    let newMaterialSelectedRows = materialSelectedRows;
    currentMaterial = {
      ...currentMaterial,
      selectedSnQty: selected ? currentMaterial.selectedSnQty + record.primaryUomQty
        : currentMaterial.selectedSnQty - record.primaryUomQty,
      selectedSnCount: selected ? currentMaterial.selectedSnCount + 1
        : currentMaterial.selectedSnCount - 1,
    };
    if (selected) {
      newBarCodeSelectedRows = newBarCodeSelectedRows.concat([record]);
      if (!materialSelectedRows.find(e => (e.materialId === currentMaterial.materialId))) {
        newMaterialSelectedRows = newMaterialSelectedRows.concat(currentMaterial);
      }
      currentMaterial = { ...currentMaterial, _status: 'update' };
    } else {
      newBarCodeSelectedRows = newBarCodeSelectedRows.filter(e => !(e.materialLotId === record.materialLotId));
      if (currentMaterial.materialLotList.length === 1) {
        newMaterialSelectedRows = materialSelectedRows.filter(e => !(e.materialId === record.materialId));
        currentMaterial = { ...currentMaterial, _status: '' };
      }
    }
    newMaterialList = newMaterialList.map(e => {
      if (e.materialId === record.materialId) {
        return currentMaterial;
      }
      return e;
    });
    clearInterval(this.timeItemTimer);
    dispatch({
      type: `${this.modelName}/updateState`,
      payload: {
        barCodeSelectedRows: newBarCodeSelectedRows,
        materialSelectedRows: newMaterialSelectedRows,
        materialList: newMaterialList,
      },
    });
    this.handleStartTimeItemTimer();
  }


  /**
   * 全选 / 取消全选所有的条码
   *
   * @param {*} selected
   * @param {*} selectedRows
   * @param {*} changeRows
   * @memberof OperationPlatform
   */
  @Bind()
  handleSelectAllBarcodeList(selected, selectedRows, changeRows) {
    const { dispatch, [this.modelName]: { barCodeSelectedRows, materialSelectedRows, materialList } } = this.props;
    let newBarCodeSelectedRows = barCodeSelectedRows;
    let newMaterialSelectedRows = materialSelectedRows;
    let newMaterialList = materialList;
    let currentMaterial = materialList.find(e => e.materialId === changeRows[0].materialId);
    if (selected) {
      let newSelectedSnQty = 0;
      currentMaterial.materialLotList.forEach(i => {
        newSelectedSnQty += i.primaryUomQty;
      });
      currentMaterial = {
        ...currentMaterial,
        selectedSnQty: newSelectedSnQty,
        selectedSnCount: currentMaterial.materialLotList.length,
        _status: 'update',
      };
      newMaterialSelectedRows = newMaterialSelectedRows.concat([currentMaterial]);
      newBarCodeSelectedRows = newBarCodeSelectedRows.concat(currentMaterial.materialLotList);
    } else {
      currentMaterial = {
        ...currentMaterial,
        selectedSnQty: 0,
        selectedSnCount: 0,
        _status: '',
      };
      if (currentMaterial.materialLotList.length === 1) {
        newMaterialSelectedRows = materialSelectedRows.filter(e => !(e.materialId === currentMaterial.materialId));
      }
      newBarCodeSelectedRows = newBarCodeSelectedRows.filter(e => !(e.materialId === currentMaterial.materialId));
    }
    newMaterialList = newMaterialList.map(e => {
      if (e.materialId === currentMaterial.materialId) {
        return currentMaterial;
      }
      return e;
    });
    clearInterval(this.timeItemTimer);
    dispatch({
      type: `${this.modelName}/updateState`,
      payload: {
        barCodeSelectedRows: newBarCodeSelectedRows,
        materialSelectedRows: newMaterialSelectedRows,
        materialList: newMaterialList,
      },
    });
    this.handleStartTimeItemTimer();
  }


  /**
   * 投料
   *
   * @returns
   * @memberof OperationPlatform
   */
  @Bind()
  handleFeedMaterialList() {
    const { dispatch, [this.modelName]: { materialList, barCodeSelectedRows, siteInfo, materialSelectedRows, baseInfo } } = this.props;
    const { siteId, siteCode } = siteInfo;
    if (isEmpty(baseInfo)) {
      return notification.warning({ description: '请进站以后再进行投料' });
    }
    if (isEmpty(barCodeSelectedRows)) {
      return notification.warning({ description: '当前无勾选条码，请先勾选再进行投料' });
    }
    if (isEmpty(materialSelectedRows)) {
      return notification.warning({ description: '当前无勾选物料，请先勾选再进行投料' });
    }
    if (!isEmpty(barCodeSelectedRows)) {
      const materialSelectedRowsIds = materialSelectedRows.map(e => `${e.materialId}`);
      const newMaterialSelectedRows = materialList.filter(e => materialSelectedRowsIds.includes(`${e.materialId}`));
      const componentList = [];
      newMaterialSelectedRows.forEach(e => {
        const { materialLotList = [], $form, ...params } = e;
        const newMaterialLotList = materialLotList.map(i => {
          if (!isEmpty(barCodeSelectedRows) && barCodeSelectedRows.some(j => j.materialLotId === i.materialLotId)) {
            return { ...i, isReleased: 1 };
          } else {
            return { ...i, isReleased: 0 };
          }
        });
        componentList.push({
          ...params,
          isReleased: 1,
          materialLotList: newMaterialLotList,
          // 返修可修改将投量
          willReleaseQty: $form.getFieldValue('willReleaseQty'),
        });
      });
      clearInterval(this.timeItemTimer);
      dispatch({
        type: `${this.modelName}/feedMaterialList`,
        payload: {
          componentList,
          snLine: {
            ...baseInfo,
            siteId,
            siteCode,
          },
          materialList,
          barCodeSelectedRows,
          materialSelectedRows,
          reworkFlag: baseInfo.reworkFlag,
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.handleStartTimeItemTimer();
          this.handleFetchDataRecordList();
        }
      });
    }
  }


  /**
   *  展开 / 收起 条码列表
   *
   * @param {*} expand
   * @param {*} record
   * @memberof OperationPlatform
   */
  @Bind()
  handleUpdateExpandedRowKeys(expand, record) {
    const { dispatch, [this.modelName]: { expandedRowKeys } } = this.props;
    let newExpandedRowKeys = expandedRowKeys;
    if (expand) {
      newExpandedRowKeys.push(`${record.materialId}`);
    } else {
      newExpandedRowKeys = newExpandedRowKeys.filter(e => e !== `${record.materialId}`);
    }
    dispatch({
      type: `${this.modelName}/updateState`,
      payload: {
        expandedRowKeys: newExpandedRowKeys,
      },
    });
  }

  @Bind()
  handleStartTimeItemTimer() {
    const { [this.modelName]: { materialList }, dispatch } = this.props;
    const materialTimeFlag = materialList.some(e => moment(e.deadLineDate).diff(moment(), 'seconds') > 0);
    let barCodeList = [];
    materialList.forEach(e => {
      if (isArray(e.materialLotList)) {
        barCodeList = barCodeList.concat(e.materialLotList);
      }
    });
    const barCodeTimeFlag = barCodeList.some(e => moment(e.deadLineDate).diff(moment(), 'seconds') > 0);
    if (materialList.length > 0 && (barCodeTimeFlag || materialTimeFlag)) {
      const timer = () => {
        dispatch({
          type: `${this.modelName}/timeUpdateState`,
          payload: {
            barCodeTimeFlag,
            materialTimeFlag,
          },
        });
      };
      this.timeItemTimer = setInterval(timer, 1000);
    }
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

  @Bind()
  handleFetchESopList(page, fields) {
    const { dispatch, [this.modelName]: { workCellInfo, baseInfo = {} } } = this.props;
    const { operationId } = workCellInfo;
    dispatch({
      type: `${this.modelName}/fetchESopList`,
      payload: {
        ...fields,
        page,
        operationId,
        snMaterialId: baseInfo.snMaterialId,
      },
    });
  }

  @Bind()
  handleFetchSnDataList() {
    const { dispatch, [this.modelName]: { baseInfo: { snNum }, workCellInfo: { processId } } } = this.props;
    dispatch({
      type: `${this.modelName}/fetchSnDataList`,
      payload: {
        snNum,
        processId,
      },
    });
  }

  @Bind()
  handleFetchComponentDataList() {
    const { dispatch, [this.modelName]: { workCellInfo: { processId } } } = this.props;
    const componentDataModalFields = isUndefined(this.componentDataModalForm) ? {} : this.componentDataModalForm.getFieldsValue();
    dispatch({
      type: `${this.modelName}/fetchComponentDataList`,
      payload: {
        ...componentDataModalFields,
        processId,
      },
    });
  }

  @Bind()
  handleOpenSnDataModal() {
    this.setState({ snDataVisible: true });
    this.handleFetchSnDataList();
  }

  @Bind()
  handleCloseSnDataModal() {
    this.setState({ snDataVisible: false });
  }

  @Bind()
  handleOpenComponentDataModal() {
    this.setState({ componentDataVisible: true });
    this.handleFetchComponentDataList();
  }

  @Bind()
  handleCloseComponentDataModal() {
    this.setState({ componentDataVisible: false });
  }

  @Bind()
  handleMenuClick(_ref) {
    const { key } = _ref;
    switch (key) {
      case 'snData':
        this.handleOpenSnDataModal();
        break;
      case 'componentData':
        this.handleOpenComponentDataModal();
        break;
      case 'pumpList':
        this.handleOpenPumpListModal();
        break;
      default:
        break;
    }
  }

  handleFetchPumpList() {
    const { dispatch, [this.modelName]: { baseInfo } } = this.props;
    dispatch({
      type: `${this.modelName}/fetchPumpList`,
      payload: {
        identification: baseInfo.snNum,
      },
    });
  }

  @Bind()
  handleOpenPumpListModal() {
    this.setState({ pumpListModalVisible: true });
    this.handleFetchPumpList();
  }

  @Bind()
  handleClosePumpListModal() {
    this.setState({ pumpListModalVisible: false });
  }

  @Bind()
  handlePrintPump() {
    const { dispatch, [this.modelName]: { baseInfo, workCellInfo } } = this.props;
    dispatch({
      type: `${this.modelName}/printMaterialCode`,
      payload: {
        workOrderId: baseInfo.workOrderId,
        workcellId: workCellInfo.workcellId,
        snNum: baseInfo.snNum,
        printType: '0',
      },
    }).then(result => {
      if (result) {
        const file = new Blob(
          [result],
          { type: 'application/pdf' }
        );
        const fileURL = URL.createObjectURL(file);
        const newwindow = window.open(fileURL, 'newwindow');
        if (newwindow) {
          newwindow.print();
          this.setState({ printVisible: false });
        } else {
          notification.error({ message: '当前窗口已被浏览器拦截，请手动设置浏览器！' });
        }
      }
    });
  }

  render() {
    const {
      fetchSiteIdLoading,
      fetchBaseInfoLoading,
      addContainerLoading,
      outSiteLoading,
      addDataRecordLoading,
      fetchWorkCellInfoLoading,
      fetchEquipmentListLoading,
      deleteEqLoading,
      changeEqLoading,
      changeEqConfirmLoading,
      bindingEqLoading,
      bindingEqConfirmLoading,
      tenantId,
      fetchIsInMaterialLotLoading,
      fetchIsContainerLoading,
      fetchFeedingRecordLoading,
      feedMaterialItemLoading,
      calculateLoading,
      refreshMaterialItemListLoading,
      fetchLocationInfoLoading,
      returnMaterialLoading,
      fetchBomListLoading,
      fetchBackMaterialInfoLoading,
      deleteDataLoading,
      fetchMaterialListLoading,
      scanBarcodeLoading,
      deleteBarcodeLoading,
      feedMaterialListLoading,
      fetchWorkCellMaterialListLoading,
      fetchESopListLoading,
      fetchSnDataListLoading,
      fetchComponentDataListLoading,
      fetchPumpListLoading,
      [this.modelName]: {
        workCellInfo = {},
        containerInfo = {},
        baseInfo = {},
        equipmentList = [],
        dataRecordList = [],
        selfCheckList = [],
        snList, // sn列表
        equipmentInfo = {},
        siteInfo,
        eoStepList,
        reworkNumList,
        feedingRecordList,
        hmeTagNcVOList,
        locationList,
        locationPagination,
        locatorTypeList,
        bomList,
        bomPagination,
        backMaterialList,
        backMaterialPagination,
        materialSelectedRows,
        barCodeSelectedRows,
        expandedRowKeys,
        materialList,
        esopList,
        esopPagination,
        snDataList,
        typeList,
        componentDataList,
        pumpList,
        pumpInfo,
      },
    } = this.props;
    const {
      visible,
      timing,
      dataRecordVisible,
      outSiteConfirmModalVisible,
      bomVisible,
      snDataVisible,
      componentDataVisible,
      pumpListModalVisible,
    } = this.state;
    const baseInfoProps = {
      workCellInfo,
      baseInfo,
      reworkNumList,
      timing,
      eoStepList,
      modelName: this.modelName,
      disabled: fetchBaseInfoLoading || outSiteLoading
        || addDataRecordLoading || fetchWorkCellInfoLoading
        || feedMaterialItemLoading || returnMaterialLoading
        || refreshMaterialItemListLoading || false,
      dataSource: snList,
      onFetchBaseInfo: this.handleFetchBaseInfo,
      onOutSite: this.handleOutSite,
      onAbnormalOutSite: this.handleAbnormalOutSite,
      onInitData: this.handleInitData,
      onRef: this.handleBaseInfoBindRef,
      onOpenModal: this.handleOpenSnModal,
    };
    const stationEquipmentProps = {
      siteId: siteInfo.siteId,
      workCellInfo,
      equipmentInfo,
      deleteEqLoading,
      changeEqLoading,
      bindingEqLoading,
      bindingEqConfirmLoading,
      changeEqConfirmLoading,
      loading: fetchEquipmentListLoading,
      itemList: equipmentList,
      modelName: this.modelName,
      onDelete: this.handleDeleteEq,
      onChange: this.handleChangeEq,
      onBinding: this.handleBindingEq,
      onBindingEqConfirm: this.handleBindingEqConfirm,
      onChangeEqConfirm: this.handleChangeEqConfirm,
      onFetchEqInfo: this.handleFetchEqInfo,
      onFetchEquipment: this.handleFetchEquipment,
    };
    const dataInfoProps = {
      modelName: this.modelName,
      loading: addDataRecordLoading || calculateLoading,
      deleteDataLoading,
      baseInfo,
      dataSource: dataRecordList,
      onEnterClick: this.handleAddDataRecord,
      onOpenDataRecordModal: this.handleOpenDataRecordModal,
      onCalculate: this.handleCalculate,
      onHandleChecked: this.handleChecked,
      onHandleDeleteData: this.handleDeleteData,
      onSetChecked: this.setChecked,
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
      onFetchEquipment: this.handleFetchEquipment,
    };

    // 详情页面
    const dataRecordModalProps = {
      tenantId,
      baseInfo,
      modelName: this.modelName,
      loading: addDataRecordLoading,
      dataSource: dataRecordList,
      visible: dataRecordVisible,
      onCloseModal: this.handleCloseDataRecordModal,
      onGetData: this.handleGetData,
      onEnterClick: this.handleAddDataRecord,
      updateRemark: this.updateRemark,
    };

    const outSiteConfirmModalProps = {
      visible: outSiteConfirmModalVisible,
      dataSource: hmeTagNcVOList,
      onCancel: this.handleCloseOutSiteConfirmModal,
      onConfirm: this.handleConfirmOutSite,
    };
    const bomModalProps = {
      visible: bomVisible,
      dataSource: bomList,
      pagination: bomPagination,
      loading: fetchBomListLoading,
      onSearch: this.handleFetchBomList,
      onClose: this.handleCloseBomModal,
    };
    const locationInfoModalProps = {
      onFetchLocationInfo: this.handleFetchLocationInfo,
      locatorTypeList,
      workCellInfo,
      dataSource: locationList,
      pagination: locationPagination,
      loading: fetchLocationInfoLoading,
    };
    const backMaterialInfoModalProps = {
      dataSource: backMaterialList,
      pagination: backMaterialPagination,
      loading: fetchBackMaterialInfoLoading,
      onSearch: this.handleFetchBackMaterialInfo,
    };
    const materialInfoProps = {
      baseInfo,
      returnLoading: fetchFeedingRecordLoading,
      feedingRecordList,
      returnMaterialLoading,
      materialSelectedRows,
      barCodeSelectedRows,
      expandedRowKeys,
      workCellInfo,
      dataSource: materialList,
      modelName: this.modelName,
      loading: fetchMaterialListLoading || scanBarcodeLoading || deleteBarcodeLoading || feedMaterialListLoading,
      onScanBarcode: this.handleScanBarcode,
      rowSelection: {
        selectedRowKeys: materialSelectedRows.map(e => `${e.materialId}`),
        onSelect: this.handleSelectMaterialSelectedRows,
        onSelectAll: this.handleSelectAllMaterialList,
        getCheckboxProps: ((record) => ({
          disabled: isEmpty(baseInfo) || isEmpty(record.materialLotList),
        })),
      },
      barCodeRowSelection: {
        selectedRowKeys: barCodeSelectedRows.map(e => e.materialLotId),
        onSelect: this.handleSelectBarcodeSelectedRows,
        onSelectAll: this.handleSelectAllBarcodeList,
        getCheckboxProps: (() => ({
          disabled: isEmpty(baseInfo),
        })),
      },
      onFeedMaterialList: this.handleFeedMaterialList,
      onUpdateExpandedRowKeys: this.handleUpdateExpandedRowKeys,
      onFetchFeedingRecord: this.handleFetchFeedingRecord,
      onReturnMaterial: this.handleReturnMaterial,
      onClearFeedingRecordList: this.handleClearFeedingRecordList,
    };
    const esopModalProps = {
      tenantId,
      onFetchESopList: this.handleFetchESopList,
      dataSource: esopList,
      pagination: esopPagination,
      workCellInfo,
      loading: fetchESopListLoading,
    };
    const snDataModalProps = {
      visible: snDataVisible,
      dataSource: snDataList,
      loading: fetchSnDataListLoading,
      onSearch: this.handleFetchSnDataList,
      onCancel: this.handleCloseSnDataModal,
    };
    const componentDataModalProps = {
      typeList,
      onRef: node => {
        this.componentDataModalForm = node.props.form;
      },
      visible: componentDataVisible,
      initialSnNum: baseInfo.snNum,
      dataSource: componentDataList,
      loading: fetchComponentDataListLoading,
      onSearch: this.handleFetchComponentDataList,
      onCancel: this.handleCloseComponentDataModal,
    };
    const pumpListModalProps = {
      pumpInfo,
      visible: pumpListModalVisible,
      onFetchPumpList: this.handleFetchPumpList,
      dataSource: pumpList,
      loading: fetchPumpListLoading,
      onCancel: this.handleClosePumpListModal,
    };
    return (
      <Fragment>
        <Header title="返修作业平台">
          <Button type="default" onClick={() => this.handleOpenBomModal()} disabled={!baseInfo.eoId}>
            装配清单
          </Button>
          {!isEmpty(workCellInfo) && (
            <LocationInfoModal {...locationInfoModalProps} />
          )}
          {!isEmpty(baseInfo) && (
            <BackMaterialInfoModal {...backMaterialInfoModalProps} />
          )}
          {!isEmpty(baseInfo) && (
            <Dropdown
              overlay={
                <Menu onClick={this.handleMenuClick}>
                  <Menu.Item key="snData">当前SN数据</Menu.Item>
                  <Menu.Item key="componentData">组件数据</Menu.Item>
                  <Menu.Item key="pumpList">泵浦源性能</Menu.Item>
                </Menu>
              }
            >
              <Button>
                性能展示
                <Icon type="down" />
              </Button>
            </Dropdown>
          )}
          <Button
            type="default"
            onClick={() => this.openBadHandTab()}
            style={{ marginRight: '12px' }}
          >
            不良统计
          </Button>
          <Button
            type="default"
            style={{ marginRight: '12px' }}
            onClick={() => this.openExceptionTab()}
          >
            异常反馈
          </Button>
          <Button
            type="default"
            onClick={() => this.openProductTraceability()}
            style={{ marginRight: '12px' }}
          >
            制造履历
          </Button>
          <ESopModal {...esopModalProps} />
          <Button
            type="default"
            style={{ marginRight: '12px' }}
            onClick={() => this.openToolingManagement()}
          >
            工装管理
          </Button>
          <Button
            type="default"
            style={{ marginRight: '12px' }}
            onClick={() => this.handlePrintPump()}
          >
            组合打印
          </Button>
        </Header>
        <Content style={{ paddingRight: '24px' }}>
          <Spin spinning={
            fetchBaseInfoLoading || outSiteLoading || fetchWorkCellInfoLoading
            || fetchIsInMaterialLotLoading || fetchIsContainerLoading || fetchWorkCellMaterialListLoading
            || false}
          >
            <Row gutter={48} style={{ height: 400 }}>
              <Col span={8} style={{ height: '100%', paddingLeft: '12px', paddingRight: '2px' }}>
                <BaseInfo {...baseInfoProps} />
              </Col>
              <Col span={16} style={{ height: '100%', paddingLeft: '1px', paddingRight: '2px' }}>
                <MaterialInfo {...materialInfoProps} />
              </Col>
            </Row>
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
                <StationEquipment {...stationEquipmentProps} />
              </Col>
            </Row>
          </Spin>
          <EnterModal {...enterModalProps} />
          <DataRecordModal {...dataRecordModalProps} />
          {/* <DataRecordEditModal {...dataRecordModalProps} /> */}
          <OutSiteConfirmModal {...outSiteConfirmModalProps} />
          <BomModal {...bomModalProps} />
          <SnDataModal {...snDataModalProps} />
          <ComponentDataModal {...componentDataModalProps} />
          <PumpListModal {...pumpListModalProps} />
        </Content>
      </Fragment>
    );
  }
}
