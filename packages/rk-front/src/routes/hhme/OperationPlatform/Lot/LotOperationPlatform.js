import React, { Component, Fragment } from 'react';
import { Row, Col, Spin, Modal, Button, Form } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import { isEmpty, isArray } from 'lodash';

import { Content } from 'components/Page';
import notification from 'utils/notification';

import { openTab } from 'utils/menuTab';
import queryString from 'querystring';
import StationEquipment from '../Component/StationEquipment'; // 设备工位
import DataInfo from '../Component/DataInfo'; // 数据采集项
import ContainerInfo from '../Component/ContainerInfo'; // 容器相关信息
import SelfCheckInfo from '../Component/SelfCheckInfo'; // 自检数据采集项
import EnterModal from '../Component/EnterModal'; // 工位输入弹框
import DataRecordModal from '../Component/DataRecordModal'; // 补充数据采集弹框
import SnModal from './Component/SnModal'; // 批量工序作业平台 sn列表弹框
import HeaderTitle from './Component/HeaderTitle';
import SnInfo from './Component/SnInfo';
import SnList from './Component/SnList';
import MaterialInfo from './Component/MaterialInfo';
import PrintModal from './Component/PrintModal';
import styles from '../Component/index.less';

const jobTypes = {
  lotOperationPlatform: 'BATCH_PROCESS',
  operationPlatform: 'SINGLE_PROCESS',
  firstProcessPlatform: 'SINGLE_PROCESS',
  preInstalledPlatform: 'PREPARE_PROCESS',
};

export default class LotOperationPlatform extends Component {
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
      firstProcessFlag: false,
      productTraceabilityFlag: false,
      isUpdateLotItem: false,
      isUpdateTimeItem: false,
      isUpdateSerialItem: false,
      outSiteConfirmModalVisible: false,
      printVisible: false, // 是否显示打印
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
      snNum: null,
      isContainerOut: true, // 是否显示容器
      materialVOList: [], // 序列号物料
      lotMaterialVOList: [], // 批次物料
      timeMaterialVOList: [], // 时序物料
      selectedRows: [],
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
      materialList: [],
      filterSnList: [],
      materialSelectedRows: [],
      barCodeSelectedRows: [],
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
      clearInterval(this.timeItemTimer);
    }
    if(this.snInfoForm) {
      this.snInfoForm.setFieldsValue({ labCode: undefined });
    }
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
        this.handleFetchSnList();
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
    const { dispatch, [this.modelName]: { workCellInfo, siteId, selectedRows } } = this.props;
    clearInterval(this.timer);
    return dispatch({
      type: `${this.modelName}/fetchSnList`,
      payload: {
        workcellId: workCellInfo.workcellId,
        workcellCode: workCellInfo.workcellCode,
        siteId,
        selectedRows,
        isOutSite, // 是否出站
      },
    }).then(res => {
      if (res) {
        const snNumInput = document.getElementsByClassName('operation-platform-sn-num');
        snNumInput[0].select();
      }
      return res;
    });
  }

  @Bind()
  handleFetchMaterialList(selectedList = []) {
    const { dispatch, [this.modelName]: { selectedRows, siteId } } = this.props;
    let dtoList = isArray(selectedList) && !isEmpty(selectedList) ? selectedList : selectedRows;
    dtoList = dtoList.map(e => {
      const {dataRecordVOList, materialVOList, timeMaterialVOList, lotMaterialVOList, ...obj} = e;
      return obj;
    });
    clearInterval(this.timeItemTimer);
    dispatch({
      type: `${this.modelName}/fetchMaterialList`,
      payload: {
        dtoList,
        siteId,
      },
    }).then(res => {
      if(res) {
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
      [this.modelName]: { workCellInfo, jobContainerId, equipmentList, siteId, eoStepList, snList, exceptionEquipmentCodes, errorEquipmentCodes },
    } = this.props;
    const fetchBaseInfo = () => {
      this.setState({ productTraceabilityFlag: false });
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
        snList,
      };
      dispatch({
        type: `${this.modelName}/fetchBaseInfo`,
        payload,
      }).then(res => {
        if (res) {
          if (res.isContainer) {
            this.handleFetchSnList();
          }
          const snNumInput = document.getElementsByClassName('operation-platform-sn-num');
          if(snNumInput.length > 0) {
            snNumInput[0].select();
          }
        }
        if (res) {
          this.setState({ productTraceabilityFlag: true });
          if(this.snInfoForm) {
            this.snInfoForm.setFieldsValue({ labCode: res.labCode });
          }
          if(res.routerStepRemark) {
            Modal.info({ title: res.routerStepRemark });
          }
        }
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
   * 出栈
   *
   * @memberof OperationPlatform
   */
  @Bind()
  handleOutSite(info = {}) {
    const {
      dispatch,
      [this.modelName]: { baseInfo, siteId, snList, workCellInfo, selectedRows, equipmentList, containerInfo },
    } = this.props;
    let payload = {
      siteId,
      operationId: baseInfo.operationId,
      jobType: jobTypes[this.modelName],
      wkcShiftId: workCellInfo.wkcShiftId,
    };
    const hmeWkcEquSwitchDTO6List = equipmentList.map(e => ({
      equipmentId: e.equipmentId,
      equipmentStatus: e.color,
    })).filter(e => e.equipmentId);
    const snLineList = (isEmpty(selectedRows) ? snList : selectedRows).map(e => {
      const { dataRecordVOList, ...obj } = e;
      return {
        ...obj,
        equipmentList: hmeWkcEquSwitchDTO6List,
      };
    });
    payload = {
      ...payload,
      containerId: containerInfo.containerId,
      snLineList,
      workcellId: workCellInfo.workcellId,
      ...info,
      operationId: workCellInfo.operationIdList[0],
      labCode: isEmpty(this.snInfoForm) ? null : this.snInfoForm.getFieldValue('labCode'),
      isRecordLabCode: isEmpty(baseInfo.labCode) ? 'Y' : 'N',
    };
    const outSiteFuc = (outSiteInfo = {}) => {
      payload = {
        ...payload,
        ...outSiteInfo,
      };
      return dispatch({
        type: `${this.modelName}/batchOutSite`,
        payload,
      }).then(res => {
        if (res && res.length > 0 && res[0].errorCode) {
          Modal.confirm({
            title: res[0].errorMessage,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              outSiteFuc({ ...info, continueFlag: 'Y', errorCode: res[0].errorCode, processNcDetailList: res[0].processNcDetailList});
            },
          });
        } else if (res) {
          clearInterval(this.timer);
          notification.success();
          if (workCellInfo.jobContainerId) {
            this.handleFetchContainerInfo();
          }
          this.handleFetchSnList(true);
        }
        return res;
      });
    };
    return new Promise((resolve) => {
      return resolve(outSiteFuc());
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
  handleAddDataRecord(value, record, dataSourceName, isInModal = false) {
    const {
      dispatch,
      [this.modelName]: { selectedRows, [dataSourceName]: dataSource, baseInfo = {}, workCellInfo = {}, snList },
    } = this.props;
    const { materialLotId, reworkFlag } = baseInfo;
    const payload = {
      jobType: jobTypes[this.modelName],
      ...record,
      materialLotId,
      operationId: workCellInfo.operationIdList[0],
      reworkFlag,
      result: value,
      list: dataSource,
      dataSourceName,
      jobIdList: selectedRows.map(e => e.jobId),
      batchFlag: isEmpty(selectedRows) ? 'N' : 'Y',
      snList,
      selectedRows,
    };
    if(isInModal) {
      dispatch({
        type: `${this.modelName}/updateState`,
        payload: {
          dataRecordList: [],
        },
      });
    }
    return dispatch({
      type: `${this.modelName}/addDataRecord`,
      payload,
    });
  }

  @Bind
  updateRemark(value, record, dataSourceName){
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
   * 勾选工序作业以后，需筛选相同的数据采集项和自检项
   *
   * @param {*} selectedRowKeys
   * @param {*} selectedRows
   * @memberof OperationPlatform
   */
  @Bind()
  handleChangeSelectedRows(selectedRowKeys, selectedRows) {
    const { dispatch } = this.props;
    clearInterval(this.timeItemTimer);
    dispatch({
      type: `${this.modelName}/updateState`,
      payload: {
        selectedRows,
        dataRecordList: [],
        selfCheckList: [],
        materialList: [],
        materialSelectedRows: [],
        barCodeSelectedRows: [],
        expandedRowKeys: [],
      },
    });
  }


  // /**
  //  *
  //  * 批量工序作业平台
  //  *
  //  * 勾选以后多行sn号找相同的自检和数据采集
  //  *
  //  * @param {*} record
  //  * @param {*} selected
  //  * @param {*} selectedRows
  //  * @memberof OperationPlatform
  //  */
  // @Bind()
  // handleChangeDataRecordList(record, selected, selectedRows) {
  //   const { dispatch, [this.modelName]: { dataRecordList, selfCheckList, snList, exceptionEquipmentCodes, errorEquipmentCodes } } = this.props;
  //   const changeDataRecordList = () => {
  //     let dataList = [];
  //     let newBaseInfo = {};
  //     const newRecord = snList.find(e => e.jobId === record.jobId);
  //     if (selectedRows.length === 1) { // 勾选一列，默认自检/数据采集 项
  //       dataList = newRecord.dataRecordVOList;
  //       newBaseInfo = {
  //         ...newRecord,
  //         isLabelCodeEdit: isEmpty(newRecord.labCode),
  //       };
  //     } else if (selected && selectedRows.length > 1) { // 勾选超过一列， 比对相同的自检 / 数据采集 项
  //       dataList = dataRecordList.concat(selfCheckList); // 数据采集项和自检项合起来一起比对
  //       if (isArray(newRecord.dataRecordVOList) && !isEmpty(newRecord.dataRecordVOList)) {
  //         const selectedDataRecordTagIds = snList.find(e => e.jobId === newRecord.jobId).dataRecordVOList.map(e => e.tagId);
  //         dataList = dataList.filter(i => selectedDataRecordTagIds.includes(i.tagId));
  //       }
  //       newBaseInfo = {
  //         isLabelCodeEdit: selectedRows.every(e => isEmpty(e.labCode)),
  //       };
  //     } else if (!selected && selectedRows.length > 1) { // 取消勾选
  //       const selectedJobId = selectedRows.map(e => e.jobId);
  //       const newSelectedRows = snList.filter(e => selectedJobId.includes(e.jobId));
  //       dataList = newSelectedRows[0].dataRecordVOList;
  //       newSelectedRows.forEach(e => {
  //         const dataRecordTagIds = e.dataRecordVOList.map(i => i.tagId);
  //         dataList = dataList.filter(i => dataRecordTagIds.includes(i.tagId));
  //       });
  //       newBaseInfo = {
  //         isLabelCodeEdit: selectedRows.every(e => isEmpty(e.labCode)),
  //       };
  //     }
  //     const newDataRecordList = isArray(dataList)
  //       ? dataList
  //         .filter(e => e.groupPurpose === 'DATA')
  //       : [];
  //     const newSelfCheckList = isArray(dataList)
  //       ? dataList.filter(e => e.groupPurpose === 'GENERAL')
  //       : [];
  //     clearInterval(this.timeItemTimer);
  //     dispatch({
  //       type: `${this.modelName}/updateState`,
  //       payload: {
  //         selectedRows,
  //         dataRecordList: newDataRecordList,
  //         // addDataRecordList: newDataRecordList .filter(e => e.groupPurpose === 'DATA').map(e => e.equipmentCategory || e.resultType === 'VALUE' ? { ...e, isEdit: false, _status: 'update' } : {...e, isEdit: false}),
  //         selfCheckList: newSelfCheckList,
  //         baseInfo: newBaseInfo,
  //         materialList: [],
  //         barCodeSelectedRows: [],
  //         materialSelectedRows: [],
  //       },
  //     });
  //   };
  //   if(exceptionEquipmentCodes || errorEquipmentCodes) {
  //     Modal.confirm({
  //       title: `${exceptionEquipmentCodes || errorEquipmentCodes}设备需要进行点检,是否先进行点检`,
  //       okText: '确定',
  //       cancelText: '取消',
  //       onOk: () => {
  //         this.openEquipmentCheck();
  //       },
  //       onCancel: () => {
  //         if(exceptionEquipmentCodes) {
  //           changeDataRecordList();
  //         }
  //       },
  //     });
  //   } else {
  //     changeDataRecordList();
  //   }
  // }


  // /**
  //  * 批量工序作业平台
  //  * 全选
  //  *
  //  * @param {*} selected
  //  * @param {*} selectedRows
  //  * @memberof OperationPlatform
  //  */
  // @Bind()
  // handleChangeAllDataRecordList(selected, selectedRows) {
  //   const { dispatch, [this.modelName]: { snList, exceptionEquipmentCodes, errorEquipmentCodes } } = this.props;
  //   const changeAllDataRecordList = () => {
  //     let dataList = [];
  //     const selectedJobId = selectedRows.map(e => e.jobId);
  //     const newSelectedRows = snList.filter(e => selectedJobId.includes(e.jobId));
  //     if (selected) {
  //       dataList = newSelectedRows.length > 0 && isArray(newSelectedRows[0].dataRecordVOList) ? newSelectedRows[0].dataRecordVOList : [];
  //       if(dataList.length > 0) {
  //         newSelectedRows.forEach(e => {
  //           const dataRecordTagIds = e.dataRecordVOList.map(i => i.tagId);
  //           dataList = dataList.filter(i => dataRecordTagIds.includes(i.tagId));
  //         });
  //       }
  //     }

  //     // // 因为现场延迟原因，此处使用先删除对应的数据 再次更新
  //     // dispatch({
  //     //   type: `${this.modelName}/updateState`,
  //     //   payload: {
  //     //     addDataRecordList: [],
  //     //   },
  //     // });

  //     const newDataRecordList = isArray(dataList)
  //       ? dataList
  //         .filter(e => e.groupPurpose === 'DATA').map(e => e.equipmentCategory || e.resultType === 'VALUE' ? { ...e, isEdit: false, _status: 'update' } : {...e, isEdit: false})
  //       : [];
  //     const newSelfCheckList = isArray(dataList)
  //       ? dataList.filter(e => e.groupPurpose === 'GENERAL')
  //       : [];
  //     const baseInfo = {
  //       isLabelCodeEdit: !isEmpty(selectedRows) && selectedRows.every(e => isEmpty(e.labCode)),
  //     };

  //     clearInterval(this.timeItemTimer);
  //     dispatch({
  //       type: `${this.modelName}/updateState`,
  //       payload: {
  //         selectedRows: newSelectedRows,
  //         dataRecordList: newDataRecordList,
  //         // addDataRecordList: newDataRecordList,
  //         selfCheckList: newSelfCheckList,
  //         materialVOList: [],
  //         timeMaterialVOList: [],
  //         lotMaterialVOList: [],
  //         baseInfo,
  //         materialList: [],
  //         barCodeSelectedRows: [],
  //         materialSelectedRows: [],
  //       },
  //     });
  //   };
  //   if(exceptionEquipmentCodes || errorEquipmentCodes) {
  //     Modal.confirm({
  //       title: `${exceptionEquipmentCodes || errorEquipmentCodes}设备需要进行点检,是否先进行点检`,
  //       okText: '确定',
  //       cancelText: '取消',
  //       onOk: () => {
  //         this.openEquipmentCheck();
  //       },
  //       onCancel: () => {
  //         if(exceptionEquipmentCodes) {
  //           changeAllDataRecordList();
  //         }
  //       },
  //     });
  //   } else {
  //     changeAllDataRecordList();
  //   }
  // }


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

  // @Bind()
  // handleCreate(listName, idName, options = {}) {
  //   const { dispatch, [this.modelName]: namespace, tenantId } = this.props;
  //   const dataSource = namespace[listName];
  //   const { workCellInfo } = namespace;
  //   const payload = {};
  //   if (listName === 'addDataRecordList') {
  //     payload[listName] = [
  //       {
  //         [idName]: uuid(),
  //         _status: 'create',
  //         isEdit: true,
  //         workcellId: workCellInfo.workcellId,
  //         tenantId,
  //         ...options,
  //       },
  //       ...dataSource,
  //     ];
  //   } else {
  //     payload[listName] = [
  //       {
  //         [idName]: uuid(),
  //         _status: 'create',
  //         workcellId: workCellInfo.workcellId,
  //         tenantId,
  //         ...options,
  //       },
  //       ...dataSource,
  //     ];
  //   }
  //   dispatch({
  //     type: `${this.modelName}/updateState`,
  //     payload,
  //   });
  // }

  // /**
  //  * 编辑当前行
  //  *
  //  * @param {string} dataSource 数据源在model里的名称
  //  * @param {string} id 数据源的id名称
  //  * @param {object} current 当前行
  //  * @param {boolean} flag
  //  * @memberof ContractBaseInfo
  //  */
  // @Bind()
  // handleEditLine(dataSource, id, current, flag) {
  //   const { dispatch, [this.modelName]: namespace } = this.props;
  //   const list = namespace[dataSource];
  //   let newList = [];
  //   if (dataSource === 'addDataRecordList') {
  //     newList = list.map(e => {
  //       if (e[id] === current[id]) {
  //         return { ...e, isEdit: !!flag, _status: 'update' };
  //       }
  //       return e;
  //     });
  //   } else {
  //     newList = list.map(item =>
  //       item[id] === current[id] ? { ...item, _status: flag ? 'update' : '' } : item
  //     );
  //   }
  //   dispatch({
  //     type: `${this.modelName}/updateState`,
  //     payload: {
  //       [dataSource]: newList,
  //     },
  //   });
  // }

  // /**
  //  * 清除当前行
  //  *
  //  * @param {string} dataSource
  //  * @param {string} id
  //  * @param {object} current
  //  * @memberof ContractBaseInfo
  //  */
  // @Bind()
  // handleCleanLine(dataSource, id, current) {
  //   const { dispatch, [this.modelName]: namespace } = this.props;
  //   const list = namespace[dataSource];
  //   const newList = list.filter(item => item[id] !== current[id]);
  //   let payload = {};
  //   payload = {
  //     [dataSource]: newList,
  //   };
  //   dispatch({
  //     type: `${this.modelName}/updateState`,
  //     payload,
  //   });
  // }

  // /**
  // * 删除操作
  // *
  // * @param {array} selectedRows 勾选项
  // * @param {string} dataSourceName 数据源模板
  // * @param {string} idName 主键id名称
  // * @param {string} effects
  // * @memberof ContractBaseInfo
  // */
  // @Bind()
  // handleDelete(selectedRows, dataSourceName, idName, effects) {
  //   const { dispatch, [this.modelName]: namespace } = this.props;
  //   const selectedRowKeys = selectedRows.map(e => e[idName]);
  //   const dataSource = namespace[dataSourceName];
  //   const unSelectedArr = dataSource.filter(e => {
  //     return selectedRowKeys.indexOf(e[idName]) < 0;
  //   });
  //   if (selectedRowKeys.length > 0) {
  //     Modal.confirm({
  //       title: '确定删除选中数据?',
  //       onOk: () => {
  //         const originDelete = selectedRows.filter(e => e._status !== 'create');
  //         if (isEmpty(originDelete)) {
  //           dispatch({
  //             type: `${this.modelName}/updateState`,
  //             payload: {
  //               [dataSourceName]: unSelectedArr,
  //             },
  //           });
  //         } else {
  //           dispatch({
  //             type: `${this.modelName}/${effects}`,
  //             payload: originDelete,
  //           }).then(res => {
  //             if (res) {
  //               dispatch({
  //                 type: `${this.modelName}/updateState`,
  //                 payload: {
  //                   [dataSourceName]: unSelectedArr,
  //                 },
  //               });
  //               notification.success();
  //             }
  //           });
  //         }
  //       },
  //     });
  //   }
  // }

  /**
   * @description: 跳转到不良处理平台
   * @param {type} params
   */
  @Bind()
  openBadHandTab() {
    const { jumpData } = this.state;
    const { [this.modelName]: { selectedRows } } = this.props;
    if (this.modelName === 'lotOperationPlatform' && selectedRows.length === 0) {
      return notification.warning({ description: '请选择条码！' });
    }
    let jumpSnNum;
    switch (this.modelName) {
      case 'lotOperationPlatform': // 批量
        jumpSnNum = {
          snNum: selectedRows[0].snNum,
        };
        break;
      default:
        break;
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
        snNum: jumpSnNum.snNum,
      }),
      closable: true,
    });
  }

  @Bind()
  openProductTraceability() {
    const { [this.modelName]: { selectedRows } } = this.props;
    if (this.modelName === 'lotOperationPlatform' && selectedRows.length !== 1 ) {
      return notification.warning({ description: '请勾选一条条码！' });
    }
    openTab({
      key: `/hhme/product-traceability`, // 打开 tab 的 key
      path: `/hhme/product-traceability`, // 打开页面的path
      title: '产品生产履历查询',
      search: queryString.stringify({
        traceabilityPathType: true,
        snNum: selectedRows[0].snNum,
      }),
      closable: true,
    });
  }

  // @Bind()
  // handleEqData({ message }) {
  //   const messageJson = isEmpty(message) ? undefined : JSON.parse(message);
  //   const { [this.modelName]: { snNum, equipmentList, dataRecordList, baseInfo }, dispatch } = this.props;
  //   const equipmentCodes = equipmentList.map(e => e.assetEncoding);
  //   const { eoId, reworkFlag, materialLotId } = baseInfo;
  //   if (messageJson.sn === snNum && equipmentCodes.includes(messageJson.assetEncoding)) {
  //     let eqDataList = dataRecordList.filter(e => {
  //       const { limitCond1, limitCond2 } = e;
  //       const limitCode1 = isNull(limitCond1) ? null
  //         // eslint-disable-next-line no-useless-escape
  //         : limitCond1.toLowerCase().replace(/\_(\w)/g, (all, letter) => {
  //           return letter.toUpperCase();
  //         });
  //       const limitCode2 = isNull(limitCond2) ? null
  //         // eslint-disable-next-line no-useless-escape
  //         : limitCond2.toLowerCase().replace(/\_(\w)/g, (all, letter) => {
  //           return letter.toUpperCase();
  //         });
  //       const cond1Value = isNull(limitCode1) ? null : `${messageJson[limitCode1]}`;
  //       const cond2Value = isNull(limitCode2) ? null : `${messageJson[limitCode2]}`;
  //       const flag = !isEmpty(e.valueField) && (cond1Value === e.cond1Value) && (cond2Value === e.cond2Value);
  //       return flag;
  //     });
  //     eqDataList = eqDataList.map(e => {
  //       const { valueField } = e;
  //       // eslint-disable-next-line no-useless-escape
  //       if (valueField) {
  //         // eslint-disable-next-line no-useless-escape
  //         const field = valueField.toLowerCase().replace(/\_(\w)/g, (all, letter) => {
  //           return letter.toUpperCase();
  //         });
  //         return {
  //           ...e,
  //           result: messageJson[field],
  //           jobType: jobTypes[this.modelName],
  //           materialLotId,
  //           operationId: baseInfo.operationId,
  //           reworkFlag,
  //           eoId,
  //         };
  //       }
  //       return {
  //         ...e,
  //         jobType: jobTypes[this.modelName],
  //         materialLotId,
  //         operationId: baseInfo.operationId,
  //         reworkFlag,
  //         eoId,
  //       };

  //     });
  //     if (eqDataList.length > 0) {
  //       dispatch({
  //         type: `${this.modelName}/addDataRecordBatch`,
  //         payload: {
  //           eqDataList,
  //           list: dataRecordList,
  //           dataSourceName: 'dataRecordList',
  //         },
  //       });
  //     }
  //   }
  // }

  @Bind()
  handleOpenDataRecordModal() {
    const { [this.modelName]: { selectedRows } } = this.props;
    if(!isEmpty(selectedRows)) {
      this.setState({ dataRecordVisible: true });
      this.handleFetchDataRecordList();
    } else {
      notification.warning({ description: '请勾选需要查询数据采集项的sn'});
    }
  }

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


  // /**
  //  * 补充数据采集
  //  *
  //  * @memberof OperationPlatform
  //  */
  // @Bind()
  // handleSaveDataRecordList() {
  //   const { [this.modelName]: { addDataRecordList }, dispatch } = this.props;
  //   const newData = addDataRecordList.filter(e => e.isEdit);
  //   const newDataRecordList = getEditTableData(newData, ['jobRecordId']).map(e => ({
  //     ...e,
  //     resultType: e.valueType,
  //   }));
  //   if (newDataRecordList.length > 0) {
  //     dispatch({
  //       type: `${this.modelName}/addDataRecordBatch`,
  //       payload: {
  //         eqDataList: newDataRecordList,
  //         list: addDataRecordList,
  //         dataSourceName: 'addDataRecordList',
  //       },
  //     });
  //   }
  // }


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
   * sn列表模态框关闭
   *
   * @memberof OperationPlatform
   */
  @Bind()
  handleCloseSnModal() {
    this.setState({ snVisible: false });
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
  handleCalculate(data = []) {
    const { dispatch, [this.modelName]: { dataRecordList, workCellInfo } } = this.props;
    if (!isEmpty(data)) {
      dispatch({
        type: `${this.modelName}/calculate`,
        payload: {
          data: data.map(item=>{ return {...item, operationId: workCellInfo.operationId};}),
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
    const { [this.modelName]: { materialList }, dispatch } = this.props;
    const materialTimeFlag = materialList.some(e => moment(e.deadLineDate).diff(moment(), 'seconds') > 0);
    let barCodeList = [];
    materialList.forEach(e => {
      if(isArray(e.materialLotList)) {
        barCodeList = barCodeList.concat(e.materialLotList);
      }
    });
    const barCodeTimeFlag = barCodeList.some(e => moment(e.deadLineDate).diff(moment(), 'seconds') > 0);
    if (materialList.length > 0 && (barCodeTimeFlag || materialTimeFlag)) {
      const timer = () => {
        const newMaterialList = materialList.map(e => {
          if (e.productionType === 'TIME') {
            const timing = moment(e.deadLineDate).diff(moment(), 'seconds');
            const { materialLotList } = e;
            const newMaterialLotList = isArray(materialLotList) ? materialLotList.map(i => {
              const barCodeTiming = moment(i.deadLineDate).diff(moment(), 'seconds');
              return {
                ...i,
                timing: barCodeTiming > 0 ? this.handleTiming(barCodeTiming) : '00:00:00',
              };
            }) : [];
            return {
              ...e,
              materialLotList: newMaterialLotList,
              timing: timing > 0 ? this.handleTiming(timing) : '00:00:00',
            };
          } else {
            return e;
          }
        });
        dispatch({
          type: `${this.modelName}/updateState`,
          payload: {
            materialList: newMaterialList,
          },
        });
      };
      this.timeItemTimer = setInterval(timer, 1000);
    }
  }

  @Bind()
  handleFetchDataRecordList() {
    const { dispatch, [this.modelName]: { workCellInfo, selectedRows } } = this.props;
    const jobId = selectedRows.map(e => e.jobId).join(',');
    dispatch({
      type: `${this.modelName}/fetchDataRecordList`,
      payload: {
        jobId,
        workcellId: workCellInfo.workcellId,
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
    const { dispatch, [this.modelName]: { baseInfo, workCellInfo, siteId } } = this.props;
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
  handleScanAndSelectSn(snNum) {
    const { dispatch, [this.modelName]: { snList, selectedRows } } = this.props;
    const newSelectedRows = selectedRows;
    const checkedSnNumList = snList.filter(e => e.sourceContainerCode === snNum || e.snNum === snNum);
    if(checkedSnNumList.length > 0) {
      const selectedRowsJobIds = selectedRows.map(e => e.jobId);
      checkedSnNumList.forEach(e => {
        if(!selectedRowsJobIds.includes(e.jobId)) {
          newSelectedRows.push(e);
        }
      });
      // this.handleChangeAllDataRecordList(true, newSelectedRows);
      dispatch({
        type: `${this.modelName}/updateState`,
        payload: {
          selectedRows: newSelectedRows,
        },
      });
      const snModalInputDom = document.getElementsByClassName('operationPlatform_sn-modal-input');
      if(snModalInputDom.length > 0) {
        snModalInputDom[0].select();
      }
    } else {
      notification.warning({
        description: '当前扫描SN未在当前SN列表内， 请重新扫描',
      });
    }

  }

  @Bind()
  handleClickSnList(info = {}) {
    const {
      dispatch,
    } = this.props;
    const { dataRecordVOList, ...snInfo } = info;
    this.setState({ productTraceabilityFlag: false });
    clearInterval(this.timeItemTimer);
    dispatch({
      type: `${this.modelName}/updateState`,
      payload: {
        baseInfo: snInfo,
        dataRecordList: [],
        selfCheckList: [],
        selectedRows: [snInfo],
      },
    });
    this.handleFetchMaterialList([snInfo]);
  }


  /**
   * 扫描物料条码
   *
   * @param {*} barcode
   * @memberof OperationPlatform
   */
  @Bind()
  handleScanBarcode(barcode) {
    const { dispatch, [this.modelName]: { workCellInfo, materialList, selectedRows, siteId, expandedRowKeys, materialSelectedRows, barCodeSelectedRows } } = this.props;
    if(barcode) {
      const snLineList = selectedRows.map(e => {
        const { dataRecordVOList, ...obj } = e;
        return obj;
      });
      clearInterval(this.timeItemTimer);
      dispatch({
        type: `${this.modelName}/scanBarcode`,
        payload: {
          materialLotCode: barcode,
          siteId,
          snLineList,
          workcellId: workCellInfo.workcellId,
          componentList: materialList,
          expandedRowKeys,
          materialSelectedRows,
          barCodeSelectedRows,
        },
      }).then(res => {
        const barcodeInput = document.getElementsByClassName('operation-platform-material-barcode');
          if(barcodeInput.length > 0) {
            barcodeInput[0].focus();
            barcodeInput[0].value = '';
          }
        if(res && res.deleteFlag === 'Y') { // 删除标识， 删除条码绑定
          const message = res.component.productionType === 'SN' && selectedRows.length === 1 && selectedRows[0].snNum !== res.component.currBindSnNum
            ? `条码${barcode}已绑定${res.component.currBindSnNum}，是否解除绑定关系并绑定当前SN?`
            : `条码${barcode}已绑定当前工位，是否解除绑定关系?`;
          Modal.confirm({
            title: message,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              if(res.component.productionType === 'SN' && selectedRows.length === 1 && selectedRows[0].snNum !== res.component.currBindSnNum) {
                this.handleDeleteBarcode(res.component, barcode).then(result => {
                  if(result) {
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
    const { dispatch, [this.modelName]: {materialList, barCodeSelectedRows, materialSelectedRows } } = this.props;
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
      if(res) {
        notification.success();
        this.handleStartTimeItemTimer();
      }
      return res;
    });
  }


  @Bind()
  handleSelectMaterialSelectedRows(record, selected) {
    const { dispatch, [this.modelName]: { barCodeSelectedRows, materialList, materialSelectedRows } } = this.props;
    let newBarCodeSelectedRows = barCodeSelectedRows.filter(e => !(e.materialId === record.materialId && record.lineNumber === e.lineNumber));
    let newMaterialList = materialList; // 需更新物料的勾选条码量与勾选条码总量
    let newSelectedSnQty = 0; // 当前勾选物料下的条码总量
    let newMaterialSelectedRows = materialSelectedRows; // 新的已勾选物料数组
    const componentMaterialSelectedIds = materialSelectedRows.filter(e => e.componentMaterialId === record.componentMaterialId).map(e => `${e.materialId}#${e.lineNumber}`);
    if(selected) { // 勾选当前的物料
      if(materialSelectedRows.filter(e => e.componentMaterialId === record.componentMaterialId).length > 0) {
        // 勾选的物料中存在当前需要勾选的物料的替代组中，替代组中只能勾选一个料，其它的需要取消勾选
        newMaterialSelectedRows = newMaterialSelectedRows.filter(e => e.componentMaterialId !== record.componentMaterialId);
        newBarCodeSelectedRows = newBarCodeSelectedRows.filter(e => !componentMaterialSelectedIds.includes(`${e.materialId}#${e.lineNumber}`));
        newMaterialList = materialList.map(e => {
          if(componentMaterialSelectedIds.includes(`${e.materialId}#${e.lineNumber}`)) {
            return {
              ...e,
              selectedSnQty: 0,
              selectedSnCount: 0,
            };
          }
          return e;
        });
      }
      newBarCodeSelectedRows = newBarCodeSelectedRows.concat(record.materialLotList);
      record.materialLotList.forEach(i => {
        newSelectedSnQty += i.primaryUomQty;
      });
      newMaterialSelectedRows = [...newMaterialSelectedRows, {
        ...record,
        selectedSnQty: newSelectedSnQty,
        selectedSnCount: isArray(record.materialLotList) && selected ? record.materialLotList.length : 0,
      }];
    } else {
      newMaterialSelectedRows = materialSelectedRows.filter(e => !(e.materialId === record.materialId && record.lineNumber === e.lineNumber));
    }
    newMaterialList = newMaterialList.map(e => {
      if(e.materialId === record.materialId && record.lineNumber === e.lineNumber) {
        return {
          ...e,
          selectedSnQty: newSelectedSnQty,
          selectedSnCount: isArray(record.materialLotList) && selected ? record.materialLotList.length : 0,
        };
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

  @Bind()
  handleSelectAllMaterialList(selected) {
    const { dispatch, [this.modelName]: { materialList, materialSelectedRows, selectedRows } } = this.props;
    const componentIdList = materialList.filter(e => ((selectedRows.length > 1 && !isEmpty(e.materialLotList) && e.productionType !== 'SN')|| (selectedRows.length === 1 && !isEmpty(e.materialLotList)))).map(e => e.componentMaterialId);
    const uniqComponentIdList = Array.from(new Set(componentIdList));
    const newSelected = uniqComponentIdList.length !== materialSelectedRows.length && selected;
    let barCodeSelectedRows = [];
    const newMaterialList = [];
    const componentMaterialSelectedIds = [];
    const newMaterialSelectedRows = [];
    materialList.forEach(e => {
      if(!componentMaterialSelectedIds.includes(e.componentMaterialId) &&
        ((selectedRows.length > 1 && !isEmpty(e.materialLotList) && e.productionType !== 'SN')
        || (selectedRows.length === 1 && !isEmpty(e.materialLotList))) && newSelected
      ) {
        barCodeSelectedRows = barCodeSelectedRows.concat(e.materialLotList);
        componentMaterialSelectedIds.push(e.componentMaterialId);
        let newSelectedSnQty = 0;
        e.materialLotList.forEach(i => {
          newSelectedSnQty += i.primaryUomQty;
        });
        const newMaterial = {
          ...e,
          selectedSnQty: newSelectedSnQty,
          selectedSnCount: e.materialLotList.length,
        };
        newMaterialSelectedRows.push(newMaterial);
        newMaterialList.push(newMaterial);
      } else {
        newMaterialList.push({
          ...e,
          selectedSnQty: 0,
          selectedSnCount: 0,
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

  @Bind()
  handleSelectBarcodeSelectedRows(record, selected) {
    const { dispatch, [this.modelName]: { barCodeSelectedRows, materialSelectedRows, materialList } } = this.props;
    const currentMaterial = materialList.find(e => e.lineNumber === record.lineNumber && e.materialId === record.materialId);
    const componentMaterial = materialSelectedRows.find(e => e.componentMaterialId === currentMaterial.componentMaterialId);
    let newMaterialList = materialList;
    let newBarCodeSelectedRows = barCodeSelectedRows;
    let newMaterialSelectedRows = materialSelectedRows.filter(e => !(e.lineNumber === record.lineNumber && e.materialId === record.materialId));
    const newCurrentRecord = {
      ...currentMaterial,
      selectedSnQty: selected ? currentMaterial.selectedSnQty + record.primaryUomQty : currentMaterial.selectedSnQty - record.primaryUomQty,
      selectedSnCount: selected ? currentMaterial.selectedSnCount + 1 : currentMaterial.selectedSnCount - 1,
    };
    if(selected) {
      if(componentMaterial && componentMaterial.materialId !== currentMaterial.materialId) {
        newBarCodeSelectedRows = newBarCodeSelectedRows.filter(e => !(componentMaterial.lineNumber === e.lineNumber && componentMaterial.materialId === e.materialId));
        newMaterialSelectedRows = newMaterialSelectedRows.filter(e => !(currentMaterial.componentMaterialId === e.componentMaterialId));
      }
      newBarCodeSelectedRows = newBarCodeSelectedRows.concat([record]);
      newMaterialSelectedRows = newMaterialSelectedRows.concat([newCurrentRecord]);
    } else if(!selected) {
      newBarCodeSelectedRows = newBarCodeSelectedRows.filter(e => e.jobMaterialId !== record.jobMaterialId);
      if(newBarCodeSelectedRows.some(e => record.materialId === e.materialId && record.lineNumber === e.lineNumber)) {
        newMaterialSelectedRows = newMaterialSelectedRows.concat([newCurrentRecord]);
      }
    }
    newMaterialList = newMaterialList.map(e => {
      if((selected && componentMaterial && componentMaterial.materialId !== currentMaterial.materialId) && (componentMaterial.materialId === e.materialId && componentMaterial.lineNumber === e.lineNumber)) {
        return { ...e, selectedSnQty: 0, selectedSnCount: 0 };
      } else if(record.materialId === e.materialId && record.lineNumber === e.lineNumber) {
        return newCurrentRecord;
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

  @Bind()
  handleSelectAllBarcodeList(selected, selectedRows, changeRows) {
    const { dispatch, [this.modelName]: { barCodeSelectedRows, materialSelectedRows, materialList } } = this.props;
    let newBarCodeSelectedRows = barCodeSelectedRows;
    let newMaterialSelectedRows = materialSelectedRows;
    let newMaterialList = materialList;
    const currentMaterial = materialList.find(e => e.materialId === changeRows[0].materialId && e.lineNumber === changeRows[0].lineNumber);
    const componentMaterial = materialSelectedRows.find(e => e.componentMaterialId === currentMaterial.componentMaterialId);
    let newSelectedSnQty = 0;
    if(selected) {
      if(componentMaterial && componentMaterial.materialId !== currentMaterial.materialId) {
        newMaterialSelectedRows = newMaterialSelectedRows.filter(e => !(e.lineNumber === componentMaterial.lineNumber && e.materialId === componentMaterial.materialId));
        newBarCodeSelectedRows = newBarCodeSelectedRows.filter(e => !(e.lineNumber === componentMaterial.lineNumber && e.materialId === componentMaterial.materialId));
      }
      newBarCodeSelectedRows = newBarCodeSelectedRows.concat(changeRows);
      changeRows.forEach(i => {
        newSelectedSnQty += i.primaryUomQty;
      });
      newMaterialSelectedRows = newMaterialSelectedRows.concat([{
        ...currentMaterial,
        selectedSnQty: newSelectedSnQty,
        selectedSnCount: changeRows.length,
      }]);
    } else {
      newBarCodeSelectedRows = newBarCodeSelectedRows.filter(e => !(e.materialId === currentMaterial.materialId && e.lineNumber === currentMaterial.lineNumber));
      newMaterialSelectedRows = newMaterialSelectedRows.filter(e => !(e.materialId === currentMaterial.materialId && e.lineNumber === currentMaterial.lineNumber));
    }
    newMaterialList = newMaterialList.map(e => {
      if(e.lineNumber === currentMaterial.lineNumber && e.materialId === currentMaterial.materialId) {
        return {
          ...e,
          selectedSnQty: selected ? newSelectedSnQty : 0,
          selectedSnCount: selected ? changeRows.length : 0,
        };
      } else if(selected && componentMaterial && componentMaterial.materialId !== currentMaterial.materialId && e.lineNumber === componentMaterial.lineNumber && e.materialId === componentMaterial.materialId) {
        return {
          ...e,
          selectedSnQty: 0,
          selectedSnCount: 0,
        };
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

  @Bind()
  handleCheckMaterialBox(checked, materialTypes = []) {
    const { dispatch, [this.modelName]: { materialList, selectedRows, materialSelectedRows } } = this.props;
    let barCodeSelectedRows = [];
    const newMaterialSelectedRows = [];
    const newMaterialList = [];
    const componentMaterialSelectedIds = [];
    const componentIdList = materialList.filter(e => ((materialList.length > 1 && !isEmpty(e.materialLotList) && e.productionType !== 'SN')|| (materialList.length === 1 && !isEmpty(e.materialLotList)))).map(e => e.componentMaterialId);
    const uniqComponentIdList = Array.from(new Set(componentIdList));
    const newChecked = uniqComponentIdList.length !== materialSelectedRows.length && checked;
    materialList.forEach(e => {
      if(!componentMaterialSelectedIds.includes(e.componentMaterialId) &&
        ((selectedRows.length > 1 && !isEmpty(e.materialLotList) && e.productionType !== 'SN') || (selectedRows.length === 1 && !isEmpty(e.materialLotList))) && newChecked
      ) {
        barCodeSelectedRows = barCodeSelectedRows.concat(e.materialLotList);
        componentMaterialSelectedIds.push(e.componentMaterialId);
        let newSelectedSnQty = 0;
        e.materialLotList.forEach(i => {
          newSelectedSnQty += i.primaryUomQty;
        });
        const newMaterial = {
          ...e,
          selectedSnQty: newSelectedSnQty,
          selectedSnCount: e.materialLotList.length,
        };
        newMaterialSelectedRows.push(newMaterial);
        newMaterialList.push(newMaterial);
      } else {
        newMaterialList.push(e);
      }
    });
    clearInterval(this.timeItemTimer);
    dispatch({
      type: `${this.modelName}/updateState`,
      payload: {
        barCodeSelectedRows: barCodeSelectedRows.filter(e => materialTypes.includes(e.materialType)),
        materialSelectedRows: newMaterialSelectedRows.filter(e => materialTypes.includes(e.productionType)),
        materialList: newMaterialList,
      },
    });
    this.handleStartTimeItemTimer();
  }

  @Bind()
  handleFeedMaterialList() {
    const { dispatch, [this.modelName]: { materialList, barCodeSelectedRows, siteId, materialSelectedRows, selectedRows } } = this.props;
    if(isEmpty(selectedRows) || isEmpty(materialSelectedRows) || isEmpty(barCodeSelectedRows)) {
      return notification.warning({ description: '请查询出当前勾选SN的投料信息，再点击投料'});
    }
    if(barCodeSelectedRows.some(e => moment(e.deadLineDate).diff(moment(), 'seconds') < 0 && e.materialType === 'TIME')) {
      return notification.warning({ description: '当前勾选条码中，有失效条码，请重新勾选进行投料'});
    }
    if(!isEmpty(barCodeSelectedRows)) {
      const virtualComponentList = materialList.filter(e => e.virtualComponentFlag === 'X');
      const materialSelectedRowsIds = materialSelectedRows.map(e => `${e.materialId}#${e.lineNumber}`);
      const noVirtualComponentNoSelectList = materialList.filter(e => e.virtualComponentFlag !== 'X' && !materialSelectedRowsIds.includes(`${e.materialId}#${e.lineNumber}`) );
      let componentList = [];
      let componentMaterialIds = [];
      materialSelectedRows.forEach(e => {
        const {materialLotList = [], ...params} = e;
        const newMaterialLotList = materialLotList.map(i => {
          if(!isEmpty(barCodeSelectedRows) && barCodeSelectedRows.some(j => j.jobMaterialId === i.jobMaterialId && j.materialType === i.materialType)) {
            return {...i, isReleased: 1};
          } else {
            return {...i, isReleased: 0};
          }
        });
        componentList.push({
          ...params,
          isReleased: 1,
          materialLotList: newMaterialLotList,
        });
        componentMaterialIds.push(`${e.materialId}#${e.lineNumber}`);
        const componentMaterial = e.materialId !== e.componentMaterialId ? noVirtualComponentNoSelectList.find(i => e.componentMaterialId === i.materialId) : e;
        if(componentMaterial && !componentMaterialIds.includes(`${componentMaterial.materialId}#${componentMaterial.lineNumber}`)) {
          componentList.push(componentMaterial);
          componentMaterialIds.push(`${componentMaterial.materialId}#${componentMaterial.lineNumber}`);
        }
        const restMaterialList = noVirtualComponentNoSelectList.filter(i => i.componentMaterialId === componentMaterial.materialId && !componentMaterialIds.includes(`${i.materialId}#${i.lineNumber}`));
        if(componentMaterial && !isEmpty(restMaterialList)) {
          componentList = componentList.concat(restMaterialList);
          componentMaterialIds = componentMaterialIds.concat(restMaterialList.map(i => `${i.materialId}#${i.lineNumber}`));
        }
      });
      const dtoList = selectedRows.map(e => {
        const { dataRecordVOList, ...obj} = e;
        return obj;
      });
      clearInterval(this.timeItemTimer);
      dispatch({
        type: `${this.modelName}/feedMaterialList`,
        payload: {
          componentList: componentList.concat(virtualComponentList),
          snLineListDto: {
            siteId,
            dtoList,
          },
          materialList,
          barCodeSelectedRows,
          materialSelectedRows,
        },
      }).then(res => {
        if(res) {
          notification.success();
          this.handleStartTimeItemTimer();
        }
      });
    }
  }

  @Bind()
  handFilterSnList(info) {
    const { dispatch, [this.modelName]: { snList } } = this.props;
    clearInterval(this.timeItemTimer);
    dispatch({
      type: `${this.modelName}/updateState`,
      payload: {
        filterSnList: isEmpty(info) ? snList : snList.filter(e => e.bomName === info.bomName || e.workOrderNum === info.workOrderNum),
        selectedRows: !isEmpty(info) ? snList.filter(e => e.bomName === info.bomName || e.workOrderNum === info.workOrderNum) : [],
        baseInfo: {},
        barCodeSelectedRows: [],
        materialSelectedRows: [],
        materialList: [],
      },
    });
  }

  @Bind()
  handleUpdateExpandedRowKeys(expand, record) {
    const { dispatch, [this.modelName]: { expandedRowKeys } } = this.props;
    let newExpandedRowKeys = expandedRowKeys;
    if(expand) {
      newExpandedRowKeys.push(`${record.materialId}#${record.lineNumber}`);
    } else {
      newExpandedRowKeys = newExpandedRowKeys.filter(e => e !== `${record.materialId}#${record.lineNumber}`);
    }
    dispatch({
      type: `${this.modelName}/updateState`,
      payload: {
        expandedRowKeys: newExpandedRowKeys,
      },
    });
  }

    /**
   * 获取投料记录
   *
   * @memberof OperationPlatform
   */
  @Bind()
  handleFetchFeedingRecord(materialType) {
    const { dispatch, [this.modelName]: { workCellInfo, selectedRows } } = this.props;
    dispatch({
      type: `${this.modelName}/fetchFeedingRecord`,
      payload: {
        materialType,
        jobType: jobTypes[this.modelName],
        workcellId: workCellInfo.workcellId,
        snNum: selectedRows[0].snNum,
        operationId: selectedRows[0].operationId,
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
    const { dispatch, [this.modelName]: { feedingRecordList = [] } } = this.props;
    return dispatch({
      type: `${this.modelName}/returnMaterial`,
      payload: {
        ...payload,
        feedingRecordList,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleFetchMaterialList();
      }
      return res;
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
  handleClickBom(record) {
    const { dispatch, [this.modelName]: { snList, selectedRows } } = this.props;
    const selectedRowsBomNames = Array.from(new Set(selectedRows.map(e => e.bomName)));
    let payload = {
      materialList: [],
      barCodeRowSelection: [],
      materialSelectedRows: [],
    };
    if(!isEmpty(selectedRows) && selectedRowsBomNames.length === 1 && selectedRowsBomNames[0] === record.bomName) {
      payload = {
        ...payload,
        selectedRows: [],
        dataRecordList: [],
        selfCheckList: [],
        baseInfo: {},
      };
    } else {
      const newSnList = snList.filter(e => record.bomName === e.bomName&&record.qualityStatus === e.qualityStatus);
      payload = {
        ...payload,
        selectedRows: newSnList,
        baseInfo: {
          isLabelCodeEdit: selectedRows.every(e => isEmpty(e.labCode)),
        },
      };
      // this.handleChangeAllDataRecordList(true, newSnList);
    }
    dispatch({
      type: `${this.modelName}/updateState`,
      payload,
    });
  }

  // 打印操作
  @Bind
  doPrint(){
    this.setState({ printVisible: true});
  }

   // 关闭打印
   @Bind
   closePrint(){
     this.setState({ printVisible: false});
   }

   // 打印
   @Bind
   print(printType){
    const {
      [this.modelName]: {
        selectedRows = [], // 勾选sn
      },
    } = this.props;
     // 重新筛选数据
     const hmeEoVO3List =selectedRows.map(item=>item.snNum);

       // 设置传输 参数
       const param = {
         type: printType,
         materialLotCodeList: hmeEoVO3List,
       };
       const {
         dispatch,
       } = this.props;
       dispatch({
         type: `${this.modelName}/print`,
         payload: param,
       }).then(res => {
         if (res) {
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
               this.setState({ printVisible: false});
             } else {
               notification.error({ message: '当前窗口已被浏览器拦截，请手动设置浏览器！' });
             }
           }
         }
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

  render() {
    const {
      fetchBaseInfoLoading,
      addContainerLoading,
      outSiteLoading,
      feedSerialItemLoading,
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
      fetchIsInMaterialLotLoading,
      fetchIsContainerLoading,
      feedMaterialItemLoading,
      checkSerialItemLoading,
      deleteSerialItemLoading,
      calculateLoading,
      refreshMaterialItemListLoading,
      returnMaterialLoading,
      fetchMaterialListLoading,
      scanBarcodeLoading,
      deleteBarcodeLoading,
      clickSnListLoading,
      feedMaterialListLoading,
      batchOutSiteListLoading,
      fetchLocationInfoLoading,
      fetchBackMaterialInfoLoading,
      fetchFeedingRecordLoading,
      printLoading,
      fetchESopListLoading,
      fetchDataRecordListLoading,
      [this.modelName]: {
        workCellInfo = {},
        containerInfo = {},
        baseInfo = {},
        equipmentList = [],
        dataRecordList = [],
        // addDataRecordList = [], // 弹框内的数据采集项
        selfCheckList = [],
        snList, // sn列表
        filterSnList, // 过滤bom以后的
        selectedRows = [], // 勾选sn
        equipmentInfo = {},
        siteId,
        locatorTypeList,
        materialList,
        materialSelectedRows = [],
        barCodeSelectedRows = [],
        expandedRowKeys = [],
        locationList,
        locationPagination,
        backMaterialList,
        backMaterialPagination,
        feedingRecordList = [],
        esopList = [],
        esopPagination = {},
      },
    } = this.props;
    const {
      visible,
      dataRecordVisible,
      snVisible,
      printVisible,
    } = this.state;
    const rowSelection = {
      selectedRowKeys: selectedRows.map(e => e.jobId),
      onChange: this.handleChangeSelectedRows,
      // onSelect: this.handleChangeDataRecordList,
      // onSelectAll: this.handleChangeAllDataRecordList,
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

    const dataRecordModalProps = {
      tenantId,
      baseInfo,
      modelName: this.modelName,
      loading: fetchDataRecordListLoading,
      dataSource: dataRecordList,
      visible: dataRecordVisible,
      onCloseModal: this.handleCloseDataRecordModal,
      onGetData: this.handleGetData,
      onEnterClick: this.handleAddDataRecord,
      updateRemark: this.updateRemark,
    };


    const snModal = {
      rowSelection,
      baseInfo,
      visible: snVisible,
      dataSource: filterSnList,
      onCloseModal: this.handleCloseSnModal,
      onFetchBaseInfo: this.handleClickSnList,
      onInitData: this.handleInitData,
      onScanAndSelectSn: this.handleScanAndSelectSn,
      onClickBom: this.handleClickBom,
    };
    const headerTitleProps = {
      title: '批量工序作业平台',
      baseInfo,
      tenantId,
      esopList,
      esopPagination,
      locatorTypeList,
      workCellInfo,
      locationList,
      locationPagination,
      fetchLocationInfoLoading,
      backMaterialList,
      backMaterialPagination,
      fetchBackMaterialInfoLoading,
      fetchESopListLoading,
      modelName: this.modelName,
      disabled: fetchBaseInfoLoading || outSiteLoading
        || addDataRecordLoading || fetchWorkCellInfoLoading
        || fetchSnListLoading || lotOutSiteLoading
        || feedSerialItemLoading || checkSerialItemLoading
        || deleteSerialItemLoading
        || feedMaterialItemLoading || returnMaterialLoading
        || refreshMaterialItemListLoading || false,
      onFetchBaseInfo: this.handleFetchBaseInfo,
      onOutSite: this.handleOutSite,
      onInitData: this.handleInitData,
      onOpenModal: this.handleOpenSnModal,
      openBadHandTab: this.openBadHandTab,
      openProductTraceability: this.openProductTraceability,
      onFetchLocationInfo: this.handleFetchLocationInfo,
      onFetchBackMaterialInfo: this.handleFetchBackMaterialInfo,
      openToolingManagement: this.openToolingManagement,
      onFetchESopList: this.handleFetchESopList,
    };
    const snInfoProps = {
      baseInfo,
      workCellInfo,
      locatorTypeList,
      workingCount: snList.length,
      onRef: node => {
        this.snInfoForm = node.props.form;
      },
    };
    const snListProps = {
      rowSelection,
      baseInfo,
      dataSource: filterSnList,
      loading: fetchMaterialListLoading,
      onFetchBaseInfo: this.handleClickSnList,
      onSearchSnList: this.handFilterSnList,
      onClickBom: this.handleClickBom,
    };
    const materialInfoProps = {
      baseInfo,
      returnLoading: fetchFeedingRecordLoading,
      feedingRecordList,
      returnMaterialLoading,
      materialSelectedRows,
      barCodeSelectedRows,
      expandedRowKeys,
      selectedRows,
      workCellInfo,
      dataSource: materialList,
      modelName: this.modelName,
      loading: fetchMaterialListLoading || scanBarcodeLoading || deleteBarcodeLoading || feedMaterialListLoading,
      onSearch: this.handleFetchMaterialList,
      onScanBarcode: this.handleScanBarcode,
      rowSelection: {
        selectedRowKeys: materialSelectedRows.map(e => `${e.materialId}#${e.lineNumber}`),
        onSelect: this.handleSelectMaterialSelectedRows,
        onSelectAll: this.handleSelectAllMaterialList,
        getCheckboxProps: (record => ({
          disabled: isEmpty(record.materialLotList) || (!isEmpty(selectedRows) && selectedRows.length > 1 && record.productionType === 'SN'),
        })),
      },
      barCodeRowSelection: {
        selectedRowKeys: barCodeSelectedRows.map(e => `${e.jobMaterialId}#${e.productionType}`),
        onSelect: this.handleSelectBarcodeSelectedRows,
        onSelectAll: this.handleSelectAllBarcodeList,
        getCheckboxProps: (record => ({
          disabled: (!isEmpty(selectedRows) && selectedRows.length > 1 && record.materialType === 'SN'),
        })),
      },
      onCheckMaterialBox: this.handleCheckMaterialBox,
      onFeedMaterialList: this.handleFeedMaterialList,
      onRefreshMaterialItemList: this.handleFetchMaterialList,
      onUpdateExpandedRowKeys: this.handleUpdateExpandedRowKeys,
      onFetchFeedingRecord: this.handleFetchFeedingRecord,
      onReturnMaterial: this.handleReturnMaterial,
      onClearFeedingRecordList: this.handleClearFeedingRecordList,
    };

    // 打印参数
    const printProps = {
      loading: printLoading,
      visible: printVisible,
      closeModal: this.closePrint,
      print: this.print,
      selectedBarcodeList: selectedRows,
    };
    return (
      <Fragment>
        <HeaderTitle {...headerTitleProps} />
        <Content style={{ padding: 0 }}>
          <Spin spinning={
            fetchBaseInfoLoading || outSiteLoading || fetchWorkCellInfoLoading
            || fetchSnListLoading || lotOutSiteLoading
            || fetchIsInMaterialLotLoading || fetchIsContainerLoading
            || clickSnListLoading || batchOutSiteListLoading || false}
          >
            <SnInfo {...snInfoProps} />
            <Row style={{ height: 400 }}>
              <Col span={8}>
                <Row>
                  <Col span={18}>
                    <Button
                      type="primary"
                      size="small"
                      onClick={this.handleFetchSnList}
                      style={{ marginBottom: '12px', marginRight: '8px'}}
                      loading={fetchSnListLoading}
                    >
                      刷新SN列表
                    </Button>
                    <Button
                      type="primary"
                      size="small"
                      disabled={isEmpty(selectedRows)}
                      onClick={this.handleFetchMaterialList}
                      style={{ marginBottom: '12px', marginRight: '8px'}}
                      loading={fetchMaterialListLoading}
                    >
                      查询物料
                    </Button>
                    <Button
                      type="primary"
                      size="small"
                      disabled={isEmpty(selectedRows)}
                      onClick={this.handleFetchDataRecordList}
                      style={{ marginBottom: '8px', marginRight: '8px' }}
                      loading={fetchDataRecordListLoading}
                    >
                      查询数据采集项
                    </Button>
                    <Button
                      onClick={()=>this.doPrint()}
                      type="primary"
                      size="small"
                      disabled={isEmpty(selectedRows)}
                      style={{ marginBottom: '12px' }}
                    >
                      打印
                    </Button>
                  </Col>
                  <Col span={6} className={styles['operationPlatform_selected-form']}>
                    <Form.Item label="勾选数" labelCol={{span: 12}} wrapperCol={{span: 12}}>
                      {selectedRows.length}
                    </Form.Item>
                  </Col>
                </Row>

                <SnList {...snListProps} />
              </Col>
              <Col span={16} style={{ paddingLeft: '8px' }}>
                <MaterialInfo {...materialInfoProps} />
              </Col>
            </Row>

            <Row className={styles['second-row']}>
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
                <div style={{ paddingLeft: '2px', paddingRight: '2px' }}>
                  <StationEquipment {...stationEquipmentProps} />
                </div>
              </Col>
            </Row>
          </Spin>
          <DataRecordModal {...dataRecordModalProps} />
          <EnterModal {...enterModalProps} />
          {printVisible&&<PrintModal {...printProps} />}
          {this.modelName === 'lotOperationPlatform' && (
            <SnModal {...snModal} />
          )}
        </Content>
      </Fragment>
    );
  }
}
