/*
 * @Description: 时效管理平台
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-22 14:24:05
 */

import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Row, Col, Form, Card, Spin, Tooltip, Button, Icon, Modal } from 'hzero-ui';
import notification from 'utils/notification';
// import { Scrollbars } from 'react-custom-scrollbars';
import { isEmpty } from 'lodash';
import { openTab } from 'utils/menuTab';
import queryString from 'querystring';
import { getCurrentOrganizationId } from 'utils/utils';
import InFurnace from './Component/InFurnace';
import OutFurnace from './Component/OutFurnace';
import FurnaceCard from './Component/FurnaceCard';
import EnterModal from './Component/EnterModal';
import FurnaceTable from './Component/FurnaceTable';
import SnListModal from './Component/SnListModal';
import ESopModal from './Component/ESopModal';
import StationEquipment from './Component/StationEquipment';
import styles from './index.less';

@connect(({ timeManagement, loading }) => ({
  timeManagement,
  addInFurnaceLoading: loading.effects['timeManagement/addInFurnace'],
  addOutFurnaceLoading: loading.effects['timeManagement/addOutFurnace'],
  fetchListTimeSnLoading: loading.effects['timeManagement/fetchListTimeSn'],
  handleContinueReworkLoading: loading.effects['timeManagement/handleContinueRework'],
  handleFetchSnListLoading: loading.effects['timeManagement/handleFetchSnList'],
  fetchESopListLoading: loading.effects['timeManagement/fetchESopList'],
  fetchEquipmentListLoading: loading.effects['timeManagement/fetchEquipmentList'],
  deleteEqLoading: loading.effects['timeManagement/deleteEq'],
  changeEqLoading: loading.effects['timeManagement/changeEq'],
  bindingEqLoading: loading.effects['timeManagement/bindingEq'],
  bindingEqConfirmLoading: loading.effects['timeManagement/bindingEqConfirm'],
  changeEqConfirmLoading: loading.effects['timeManagement/changeEqConfirm'],
  tenantId: getCurrentOrganizationId(),
}))
export default class TimeManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intFurnaceLoading: false,
      outFurnaceLoading: false,
      furnaceLoading: false,
      // fuurnaceFlag: true,
      visible: true,
      enterSiteLoading: false,
      snListVisible: false,
      childKey: '',
      tableRecord: {},
    };
  }

  inForm

  outForm

  componentDidMount() {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'timeManagement/getSiteList',
      payload: {},
    });
  }

  // getTime = () => {
  //   this.timer = setInterval(() => {
  //     this.setState({ childKey: new Date() });
  //   }, 1000);
  // }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'timeManagement/updateState',
      payload: {
        deviceInfo: {}, // 设备信息
        waitInFurnace: {}, // 待入炉数据
        fuurnace: [], // 炉内数据
        waitOutFurnace: {}, // 待出炉数据
        defaultSite: {},
        siteContainerCount: 0, // 炉内容器数
        siteSnMaterialCount: 0, // 炉内产品数
        standardReqdTimeInProcess: 0, // 标准时长
      },
    });
  }

  // 循环卡片
  @Bind()
  renderCard(card) {
    const cols = [];
    const { childKey } = this.state;
    for (let i = 0; i <= card.length - 1;) {
      const element = [];
      for (let j = 0; j < 3 && i <= card.length - 1; j++, i++) {
        element.push(
          <Col span={8} style={{ padding: '0px 4px 0px 4px' }}>
            <FurnaceCard
              furnaceInfo={card[i]}
              number={i}
              standardReqdTimeInProcess={card[i].standardReqdTimeInProcess}
              scanningOutFurnaceCode={this.scanningOutFurnaceCode}
              key={childKey}
            />
          </Col>
        );
      }
      cols.push(<Row style={{ marginTop: '4px' }}>{element}</Row>);
    }
    return cols;
  }

  /**
   * @description: 输入工位
   * @param {Object} values 工位编码
   */
  @Bind()
  enterSite(values) {
    this.setState({ enterSiteLoading: true });
    const {
      dispatch,
      timeManagement: {
        defaultSite = {},
      },
    } = this.props;
    dispatch({
      type: 'timeManagement/enterSite',
      payload: {
        jobType: 'TIME_PROCESS',
        siteId: defaultSite.siteId,
        ...values,
      },
    }).then(res => {
      if (res) {
        const inputFirst = document.querySelectorAll("input")[1];
        inputFirst.focus();
        this.fetchListTimeSn();
        this.setState({ visible: false, enterSiteLoading: false });
        this.handleFetchEquipment(values.workcellCode);
      } else {
        this.setState({ enterSiteLoading: false });
      }
    });
  }

  /**
   * @description: 获取指定工位未出站时效工序作业
   * @return: Object
   */
  @Bind()
  fetchListTimeSn(fields = {}, filtersArg) {
    const {
      dispatch,
      timeManagement: {
        defaultSite = {},
        deviceInfo = {},
      },
    } = this.props;
    dispatch({
      type: 'timeManagement/updateState',
      payload: {
        fuurnace: [],
      },
    });
    dispatch({
      type: 'timeManagement/fetchListTimeSn',
      payload: {
        jobType: 'TIME_PROCESS',
        siteId: defaultSite.siteId,
        workcellId: deviceInfo.workcellId,
        workcellCode: deviceInfo.workcellCode,
        operationId: deviceInfo.operationIdList[0],
        barcode: filtersArg && filtersArg.materialLotCode[0],
        materialName: filtersArg && filtersArg.materialName[0],
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(res => {
      if (res) {
        this.setState({ visible: false });
        // this.getTime();
      }
      this.setState({ enterSiteLoading: false });
    });
  }

  @Bind()
  openEquipmentCheck() {
    const { timeManagement: { deviceInfo = {} } } = this.props;
    openTab({
      key: `/hhme/equipment-check`, // 打开 tab 的 key
      path: `/hhme/equipment-check`, // 打开页面的path
      title: '设备点检&保养平台',
      search: queryString.stringify({
        workcellCode: deviceInfo.workcellCode,
      }),
      closable: true,
    });
  }

  // 扫描入炉条码
  @Bind()
  scanningInFurnaceCode(values) {
    this.setState({ intFurnaceLoading: true });
    const {
      dispatch,
      timeManagement: {
        deviceInfo = {},
        exceptionEquipmentCodes,
        errorEquipmentCodes,
      },
    } = this.props;
    const inFurnace = () => {
      dispatch({
        type: 'timeManagement/scanningInFurnaceCode',
        payload: {
          operationId: deviceInfo.operationIdList[0],
          snNum: values.snNum,
          workcellId: deviceInfo.workcellId,
          jobType: 'TIME_PROCESS',
          inOutType: 'IN',
        },
      }).then(res => {
        this.setState({ intFurnaceLoading: false });
        if (res) {
          const arr = res.labCodeAndRemarkList?res.labCodeAndRemarkList.map(ele => ele.routerStepRemark):[];
          if (arr.length > 0) {
            const strings = res.labCodeAndRemarkList.map(ele => {
              return `${Object.values(ele)}/`;
            });
            Modal.confirm({
              title: strings,
              okText: null,
              cancelText: '取消',
            });
          }
          this.addInFurnace(values);
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
            inFurnace();
          }
        },
      });
    } else {
      inFurnace();
    }
  }

  // 入炉
  @Bind()
  addInFurnace(values) {
    this.setState({ furnaceLoading: true });
    const {
      dispatch,
      timeManagement: {
        waitInFurnace = {},
        deviceInfo = {},
        defaultSite = {},
        equipmentList,
      },
    } = this.props;
    const snLineList = [];
    waitInFurnace.lineList.forEach(item => {
      snLineList.push({
        ...item,
        snNum: item.materialLotCode,
        operationId: deviceInfo.operationIdList[0],
        workcellId: deviceInfo.workcellId,
        wkcShiftId: deviceInfo.wkcShiftId,
      });
    });
    const hmeWkcEquSwitchDTO6List = equipmentList.map(e => ({
      equipmentId: e.equipmentId,
      equipmentStatus: e.color,
    })).filter(e => e.equipmentId);
    // this.setState({ fuurnaceFlag: false });
    dispatch({
      type: 'timeManagement/addInFurnace',
      payload: {
        snType: waitInFurnace.snType,
        siteInBy: waitInFurnace.siteInBy,
        sumEoCount: waitInFurnace.sumEoCount,
        containerId: waitInFurnace.containerId,
        jobContainerId: waitInFurnace.jobContainerId,
        snLineList,
        ...values,
        workcellId: deviceInfo.workcellId,
        operationId: deviceInfo.operationIdList[0],
        siteId: defaultSite.siteId,
        operationIdList: deviceInfo.operationIdList,
        wkcShiftId: deviceInfo.wkcShiftId,
        jobType: 'TIME_PROCESS',
        equipmentList: hmeWkcEquSwitchDTO6List,
      },
    }).then(res => {
      this.setState({ furnaceLoading: false });
      // this.setState({ fuurnaceFlag: true });
      if (res) {
        notification.success();
        this.inForm.resetFields();
        const inputBarcode = document.getElementById('infurnaceCode');
        inputBarcode.focus();
        this.fetchListTimeSn();
        dispatch({
          type: 'timeManagement/updateState',
          payload: {
            waitInFurnace: {},
          },
        });
      }
    });
  }

  // 扫描出炉条码
  @Bind()
  scanningOutFurnaceCode(values, record) {
    this.child.clearIntervalChild();
    this.outForm.setFieldsValue({
      snNum: values.snNum,
      experimentCode: null,
    });
    this.setState({ outFurnaceLoading: true, tableRecord: record });
    const {
      dispatch,
      timeManagement: {
        deviceInfo = {},
      },
    } = this.props;
    dispatch({
      type: 'timeManagement/scanningOutFurnaceCode',
      payload: {
        ...deviceInfo,
        operationId: deviceInfo.operationIdList[0],
        ...values,
        inOutType: 'OUT',
        jobType: 'TIME_PROCESS',
      },
    }).then(res => {
      this.setState({ outFurnaceLoading: false });
      if (res) {
        this.child.clearIntervalChild();
        this.child.time(res);
      }
    });
  }

  // 出炉操作
  @Bind()
  addOutFurnace(values) {
    this.setState({ furnaceLoading: true });
    const {
      dispatch,
      timeManagement: {
        waitOutFurnace = {},
        deviceInfo = {},
        defaultSite = {},
        isRecordLabCodeList = [],
      },
    } = this.props;
    const nowTime = Date.parse(new Date());
    let processingTime = 0;
    if (waitOutFurnace.snType === 'MATERIAL_LOT') {
      const inTime = new Date(waitOutFurnace.lineList[0].siteInDate).getTime();
      processingTime = nowTime - inTime;
    } else {
      const inTime = new Date(waitOutFurnace.siteInDate).getTime();
      processingTime = nowTime - inTime;
    }
    const { lineList = [] } = waitOutFurnace;
    if ((processingTime / (60 * 1000)) > lineList[0].standardReqdTimeInProcess) {
      const snLineList = [];
      waitOutFurnace.lineList.forEach(item => {
        snLineList.push({
          ...item,
          snNum: item.materialLotCode,
          operationId: deviceInfo.operationIdList[0],
          workcellId: deviceInfo.workcellId,
        });
      });
      // this.setState({ fuurnaceFlag: false });
      dispatch({
        type: 'timeManagement/addOutFurnace',
        payload: {
          snType: waitOutFurnace.snType,
          siteInBy: waitOutFurnace.siteInBy,
          sumEoCount: waitOutFurnace.sumEoCount,
          containerId: waitOutFurnace.containerId,
          jobContainerId: waitOutFurnace.jobContainerId,
          snLineList,
          ...values,
          isRecordLabCode: isRecordLabCodeList.length > 0 ? 'N' : 'Y',
          workcellId: deviceInfo.workcellId,
          operationId: deviceInfo.operationIdList[0],
          siteId: defaultSite.siteId,
          jobType: 'TIME_PROCESS',
        },
      }).then(res => {
        // this.setState({ fuurnaceFlag: true });
        if (res) {
          if (res.errorCode) {
            Modal.confirm({
              title: res.errorMessage,
              okText: '确认',
              cancelText: '取消',
              onOk: () => {
                dispatch({
                  type: 'timeManagement/addOutFurnace',
                  payload: {
                    snType: waitOutFurnace.snType,
                    siteInBy: waitOutFurnace.siteInBy,
                    sumEoCount: waitOutFurnace.sumEoCount,
                    containerId: waitOutFurnace.containerId,
                    jobContainerId: waitOutFurnace.jobContainerId,
                    snLineList,
                    continueFlag: 'Y',
                    ...values,
                    workcellId: deviceInfo.workcellId,
                    operationId: deviceInfo.operationIdList[0],
                    siteId: defaultSite.siteId,
                    jobType: 'TIME_PROCESS',
                    errorCode: res.errorCode,
                    processNcDetailList: res.processNcDetailList,
                  },
                }).then(ress => {
                  this.setState({ furnaceLoading: false });
                  if (ress) {
                    notification.success();
                    this.outForm.resetFields();
                    this.fetchListTimeSn();
                    this.child.clearIntervalChild();
                    dispatch({
                      type: 'timeManagement/updateState',
                      payload: {
                        waitOutFurnace: {},
                      },
                    });
                  }
                });
              },
              onCancel: () => {
                this.setState({ furnaceLoading: false });
              },
            });
          } else {
            this.setState({ furnaceLoading: false });
            notification.success();
            this.outForm.resetFields();
            this.fetchListTimeSn();
            this.child.clearIntervalChild();
            dispatch({
              type: 'timeManagement/updateState',
              payload: {
                waitOutFurnace: {},
              },
            });
          }

        } else {
          this.setState({ furnaceLoading: false });
        }
      });
    } else {
      this.setState({ furnaceLoading: false });
      notification.error({ message: '当前加工时长未达标不可出炉！' });
    }
  }

  // 返修
  @Bind()
  handleContinueRework(values) {
    this.setState({ furnaceLoading: true });
    const {
      dispatch,
      timeManagement: {
        waitOutFurnace = {},
        deviceInfo = {},
        defaultSite = {},
      },
    } = this.props;
    const nowTime = Date.parse(new Date());
    let processingTime = 0;
    if (waitOutFurnace.snType === 'MATERIAL_LOT') {
      const inTime = new Date(waitOutFurnace.lineList[0].siteInDate).getTime();
      processingTime = nowTime - inTime;
    } else {
      const inTime = new Date(waitOutFurnace.siteInDate).getTime();
      processingTime = nowTime - inTime;
    }
    const { lineList = [] } = waitOutFurnace;
    if ((processingTime / (60 * 1000)) > lineList[0].standardReqdTimeInProcess) {
      const snLineList = [];
      waitOutFurnace.lineList.forEach(item => {
        snLineList.push({
          ...item,
          snNum: item.materialLotCode,
          operationId: deviceInfo.operationIdList[0],
          workcellId: deviceInfo.workcellId,
        });
      });
      // this.setState({ fuurnaceFlag: false });
      dispatch({
        type: 'timeManagement/handleContinueRework',
        payload: {
          snType: waitOutFurnace.snType,
          siteInBy: waitOutFurnace.siteInBy,
          sumEoCount: waitOutFurnace.sumEoCount,
          containerId: waitOutFurnace.containerId,
          jobContainerId: waitOutFurnace.jobContainerId,
          snLineList,
          ...values,
          workcellId: deviceInfo.workcellId,
          operationId: deviceInfo.operationIdList[0],
          siteId: defaultSite.siteId,
          jobType: 'TIME_PROCESS',
        },
      }).then(res => {
        // this.setState({ fuurnaceFlag: true });
        if (res) {
          this.setState({ furnaceLoading: false });
          notification.success();
          this.outForm.resetFields();
          this.fetchListTimeSn();
          this.child.clearIntervalChild();
          dispatch({
            type: 'timeManagement/updateState',
            payload: {
              waitOutFurnace: {},
            },
          });
        } else {
          this.setState({ furnaceLoading: false });
        }
      });
    } else {
      this.setState({ furnaceLoading: false });
      notification.error({ message: '当前加工时长未达标不可出炉！' });
    }
  }

  // 绑定入炉form
  @Bind()
  handleBindInRef(ref = {}) {
    this.inForm = (ref.props || {}).form;
  }

  // 绑定出炉form
  @Bind()
  handleBindOutRef(ref = {}) {
    this.outForm = (ref.props || {}).form;
  }

  onTimeRef = (ref) => {
    this.child = ref;
  }

  // 刷新炉内卡片
  @Bind()
  refreshFurnace() {
    this.setState({ childKey: new Date().getTime() });
  }

  // 跳转数据采集项
  @Bind
  handleDataCollection() {
    const { tableRecord } = this.state;
    const { dispatch } = this.props;
    const {
      timeManagement: {
        deviceInfo = {},
      },
    } = this.props;
    dispatch({
      type: 'timeManagement/updateState',
      payload: {
        dataCollection: [],
        dataCollectionPagination: {},
      },
    });
    openTab({
      key: `/hmes/time-management/data/collection`, // 打开 tab 的 key
      path: `/hmes/time-management/data/collection`, // 打开页面的path
      title: '时效工序作业平台-数据采集',
      search: queryString.stringify({
        snType: tableRecord.snType,
        code: tableRecord.materialLotCode,
        workcellId: deviceInfo.workcellId,
        operationId: deviceInfo.operationIdList[0],
      }),
      closable: true,
    });
  }

  // 打开
  @Bind()
  handleSnListFlag(flag) {
    this.setState({ snListVisible: flag }, () => {
      if (flag) {
        this.handleFetchSnList();
      }
    });
  }

  // 查询未进站返修sn列表
  @Bind()
  handleFetchSnList() {
    const {
      dispatch,
      timeManagement: {
        deviceInfo = {},
        defaultSite = {},
      },
    } = this.props;
    dispatch({
      type: 'timeManagement/handleFetchSnList',
      payload: {
        siteId: defaultSite.siteId,
        workcellId: deviceInfo.workcellId,
        operationId: deviceInfo.operationIdList[0],
        // page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  @Bind()
  openToolingManagement() {
    const { timeManagement: { deviceInfo = {} } } = this.props;
    openTab({
      key: `/hhme/tool-management`, // 打开 tab 的 key
      path: `/hhme/tool-management`, // 打开页面的path
      title: '工装管理',
      search: queryString.stringify({
        workcellId: deviceInfo.workcellId,
      }),
      closable: true,
    });
  }

  @Bind()
  handleFetchESopList(page, fields) {
    const { dispatch, timeManagement: { deviceInfo, waitInFurnace = {} } } = this.props;
    const { operationId } = deviceInfo;
    dispatch({
      type: `timeManagement/fetchESopList`,
      payload: {
        ...fields,
        page,
        operationId,
        snMaterialId: waitInFurnace.snMaterialId,
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
      type: `timeManagement/changeEq`,
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
    const { dispatch, timeManagement: { deviceInfo } } = this.props;
    dispatch({
      type: `timeManagement/deleteEq`,
      payload: data,
    }).then(res => {
      if (res) {
        notification.success();
        this.handleFetchEquipment(deviceInfo.workcellCode);
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
      type: `timeManagement/bindingEq`,
      payload: data,
    });
  }

  // @Bind()
  // handleCheckEq(data = []) {
  //   const { dispatch } = this.props;
  //   if(isArray(data) && data.length > 0) {
  //     dispatch({
  //       type: `timeManagement/checkEq`,
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
      type: `timeManagement/fetchEqInfo`,
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
    const { dispatch, timeManagement: { defaultSite: { siteId } } } = this.props;
    return dispatch({
      type: `timeManagement/changeEqConfirm`,
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
    const { dispatch, timeManagement: { defaultSite: { siteId } } } = this.props;
    return dispatch({
      type: `timeManagement/bindingEqConfirm`,
      payload: {
        ...info,
        siteId,
      },
    });
  }

  /**
 * 根据工位加载设备类列表
 *
 * @param {*} workcellCode
 * @memberof OperationPlatform
 */
  @Bind()
  handleFetchEquipment(workcellCode) {
    const { dispatch, timeManagement: { defaultSite: { siteId } } } = this.props;
    return dispatch({
      type: `timeManagement/fetchEquipmentList`,
      payload: {
        workcellCode,
        siteId,
        // siteId: 40226.1,
      },
    });
  }

  render() {
    const {
      tenantId,
      fetchESopListLoading,
      timeManagement: {
        deviceInfo = {},
        fuurnace = [],
        furnacePagination = {},
        siteContainerCount = 0,
        siteSnMaterialCount = 0,
        // standardReqdTimeInProcess = 0,
        waitInFurnace = {},
        waitOutFurnace = {},
        snListPagination = {},
        snList = [],
        esopList,
        esopPagination,
        isRecordLabCodeList = [],
        routerStepRemarkList = [],
        defaultSite,
        equipmentList,
      },
      addInFurnaceLoading,
      addOutFurnaceLoading,
      fetchListTimeSnLoading,
      handleContinueReworkLoading,
      handleFetchSnListLoading,
      deleteEqLoading,
      changeEqLoading,
      bindingEqLoading,
      bindingEqConfirmLoading,
      changeEqConfirmLoading,
      fetchEquipmentListLoading,
    } = this.props;
    const { visible, enterSiteLoading, snListVisible } = this.state;
    const enterModalProps = {
      visible,
      loading: enterSiteLoading,
      enterSite: this.enterSite,
    };
    const snListModalProps = {
      loading: handleFetchSnListLoading,
      visible: snListVisible,
      onCancel: this.handleSnListFlag,
      pagination: snListPagination,
      dataSource: snList,
    };
    const esopModalProps = {
      tenantId,
      onFetchESopList: this.handleFetchESopList,
      dataSource: esopList,
      pagination: esopPagination,
      workCellInfo: deviceInfo,
      loading: fetchESopListLoading,
    };
    const stationEquipmentProps = {
      siteId: defaultSite.siteId,
      workCellInfo: deviceInfo,
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
    return (
      <Fragment>
        <Header title="时效工序作业平台">
          {/* <Button
            type="primary"
            onClick={() => this.handleSnListFlag(true)}
          >
            未进站返修SN <Icon type="bars" />
          </Button> */}
          <Button
            type="primary"
            onClick={() => this.handleDataCollection()}
          >
            数据采集 <Icon type="right" />
          </Button>
          <Button
            type="primary"
            icon="reload"
            onClick={() => this.refreshFurnace()}
          />
          <Button
            type="default"
            style={{ marginRight: '12px' }}
            onClick={() => this.openToolingManagement()}
          >
            工装管理
          </Button>
          <ESopModal {...esopModalProps} />
        </Header>
        <Content style={{ padding: '0px', backgroundColor: 'transparent', height: '100%' }}>
          <Row style={{ height: '100%' }}>
            <Col span={5} className={styles.furnace}>
              <Spin spinning={this.state.intFurnaceLoading}>
                <div className={styles.deviceInfoTableInOut}>
                  <InFurnace
                    addInFurnace={this.addInFurnace}
                    scanningInFurnaceCode={this.scanningInFurnaceCode}
                    onRef={this.handleBindInRef}
                    waitInFurnace={waitInFurnace}
                    addInFurnaceLoading={addInFurnaceLoading}
                  />
                </div>
              </Spin>
              <StationEquipment {...stationEquipmentProps} />
            </Col>
            <Col span={14} className={styles.midfurnace}>
              <Spin spinning={this.state.furnaceLoading}>
                <Row className={styles.device}>
                  <Card size="small" title="设备">
                    <Form layout="inline" style={{ marginLeft: '10px' }}>
                      <Col span={8}>
                        <Form.Item
                          labelCol={{ span: 5 }}
                          wrapperCol={{ span: 16 }}
                          label="工序"
                          style={{ width: '100%' }}
                        >
                          <span>{deviceInfo.wkcStepName}</span>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 16 }}
                          label="设备编码"
                          style={{ width: '100%' }}
                        >
                          <Tooltip title={deviceInfo.equipmentCode}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{deviceInfo.equipmentCode}</div>
                          </Tooltip>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 16 }}
                          label="设备描述"
                          style={{ width: '100%' }}
                        >
                          <Tooltip title={deviceInfo.equipmentName}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{deviceInfo.equipmentName}</div>
                          </Tooltip>
                        </Form.Item>
                      </Col>
                    </Form>
                  </Card>
                </Row>
                <Row className={styles.deviceInfo} style={{ padding: '0px 5px' }}>
                  <Row className={styles.deviceInfoRow}>
                    <Form layout="inline">
                      <Col span={8}>
                        <Form.Item
                          labelCol={{ span: 12 }}
                          wrapperCol={{ span: 12 }}
                          label="炉内容器数"
                          style={{ width: '100%' }}
                        >
                          <span>{siteContainerCount}</span>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          labelCol={{ span: 12 }}
                          wrapperCol={{ span: 12 }}
                          label="炉内产品数"
                          style={{ width: '100%' }}
                        >
                          <span>{siteSnMaterialCount}</span>
                        </Form.Item>
                      </Col>
                    </Form>
                  </Row>
                  <div className={styles.deviceInfoTable}>
                    <FurnaceTable
                      dataSource={fuurnace}
                      pagination={furnacePagination}
                      scanningOutFurnaceCode={this.scanningOutFurnaceCode}
                      loading={fetchListTimeSnLoading}
                      onSearch={this.fetchListTimeSn}
                    />
                  </div>
                  {/* {fuurnaceFlag && <Scrollbars style={{ height: '92%' }}>{this.renderCard(fuurnace, standardReqdTimeInProcess)}</Scrollbars>} */}
                </Row>
              </Spin>
            </Col>
            <Col span={5} className={styles.furnace}>
              <Spin spinning={this.state.outFurnaceLoading}>
                <div className={styles.deviceInfoTableInOut}>
                  <OutFurnace
                    addOutFurnace={this.addOutFurnace}
                    handleContinueRework={this.handleContinueRework}
                    scanningOutFurnaceCode={this.scanningOutFurnaceCode}
                    onRef={this.handleBindOutRef}
                    waitOutFurnace={waitOutFurnace}
                    onTimeRef={this.onTimeRef}
                    addOutFurnaceLoading={addOutFurnaceLoading}
                    handleContinueReworkLoading={handleContinueReworkLoading}
                    isRecordLabCodeList={isRecordLabCodeList}
                    routerStepRemarkList={routerStepRemarkList}
                  />
                </div>
              </Spin>
            </Col>
          </Row>
          <EnterModal {...enterModalProps} />
          {snListVisible && <SnListModal {...snListModalProps} />}
        </Content>
      </Fragment>
    );
  }
}
