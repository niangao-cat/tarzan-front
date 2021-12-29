/*
 * @Description: 取片平台
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-06 14:55:27
 * @LastEditTime: 2020-12-23 17:14:13
 */

import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Row, Col, Spin, Card, Button, Modal } from 'hzero-ui';
import queryString from 'querystring';
import { Scrollbars } from 'react-custom-scrollbars';
import { Bind } from 'lodash-decorators';
import { isArray, isEmpty } from 'lodash';

import notification from 'utils/notification';
import {
  getCurrentOrganizationId,
} from 'utils/utils';
import { openTab } from 'utils/menuTab';

import styles from './index.less';
import BottomForm from './Component/BottomForm';
import StationEquipment from './Component/StationEquipment';
import QualifiedTable from './Component/QualifiedTable';
import EnterModal from './Component/EnterModal';
import NCTable from './Component/NCTable';
import BoxList from './Component/BoxList';
import NCListTable from './Component/NCListTable';
import AddBarCodeModal from './Component/AddBarCodeModal';
import gwPath from '@/assets/gw.png';

@connect(({ fetchingPlatform, loading }) => ({
  fetchingPlatform,
  tenantId: getCurrentOrganizationId(),
  getSiteListLoading: loading.effects['fetchingPlatform/getSiteList'],
  getEquipmentListLoading: loading.effects['fetchingPlatform/getEquipmentList'],
  createBarCodeLoading: loading.effects['fetchingPlatform/createBarCode'],
  siteOutPrintLoading: loading.effects['fetchingPlatform/siteOutPrint'],
  bindingEqLoading: loading.effects['fetchingPlatform/bindingEq'],
  bindingEqConfirmLoading: loading.effects['fetchingPlatform/bindingEqConfirm'],
  fetchEquipmentListLoading: loading.effects['fetchingPlatform/getEquipmentList'],
  deleteEqLoading: loading.effects['fetchingPlatform/deleteEq'],
  changeEqLoading: loading.effects['fetchingPlatform/changeEq'],
  changeEqConfirmLoading: loading.effects['fetchingPlatform/changeEqConfirm'],
  siteOutPrintListLoading: loading.effects['fetchingPlatform/siteOutPrintList'],
  fetchBoxListLoading: loading.effects['fetchingPlatform/fetchBoxList'],
  fetchNcListLoading: loading.effects['fetchingPlatform/fetchNcList'],
  putInConfirmLoading: loading.effects['fetchingPlatform/putInConfirm'],
  deleteBoxListLoading: loading.effects['fetchingPlatform/deleteBoxList'],
  checkInSiteLoading: loading.effects['fetchingPlatform/checkInSite'],
}))
export default class FetchingPlatform extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      spinning: false,
      enterSiteLoading: false,
      modalType: '',
      printType: '', // 打印类型
      qualifiedTableSelect: [],
      ncTableSelect: [],
      selectedRowKeysBox: [],
      selectedRowsBox: [],
    };
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'fetchingPlatform/getSiteList',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'fetchingPlatform/batchLovData',
      payload: {
        tenantId,
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'fetchingPlatform/updateState',
      payload: {
        workcellInfo: {}, // 工位信息
        defaultSite: {},
        equipmentList: [], // 设备列表
        ncList: [], // 不良列表
        containerInfo: {}, // 容器信息
        siteOutOkList: [],
        siteOutNgList: [],
        maxNumber: '',
        boxList: [],
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
      fetchingPlatform: {
        defaultSite = {},
      },
    } = this.props;
    dispatch({
      type: 'fetchingPlatform/enterSite',
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
          this.setState({ visible: false });
          this.getEquipmentList(val);
          this.queryProcessing(res);
        }
      }
    });
  }

  // 查询正在进行的数据
  @Bind()
  queryProcessing() {
    const {
      dispatch,
      tenantId,
      fetchingPlatform: {
        workcellInfo = {},
      },
    } = this.props;
    this.setState({ spinning: true });
    dispatch({
      type: 'fetchingPlatform/queryProcessing',
      payload: {
        tenantId,
        operationId: workcellInfo.operationId,
        workcellId: workcellInfo.workcellId,
      },
    }).then(res => {
      if (res) {
        const {
          fetchingPlatform: {
            siteOutOkList = [],
            siteOutNgList = [],
          },
        } = this.props;
        const qualifiedTableSelect = siteOutOkList && siteOutOkList.filter((item) => {
          return item.printFlag === 'N';
          // eslint-disable-next-line func-names
        }).map(function (v) { return v.materialLotId; });
        const ncTableSelect = siteOutNgList && siteOutNgList.filter((item) => { return item.printFlag === 'N'; }).map(
          // eslint-disable-next-line func-names
          function (v) { return v.materialLotId; });
        this.setState({ spinning: false, qualifiedTableSelect, ncTableSelect });
        if (res.workOrderId && res.addNum !== 0) {
          this.fetchBoxList();
        }
        if (res.addNum === 0) {
          dispatch({
            type: 'fetchingPlatform/updateState',
            payload: {
              boxList: [],
            },
          });
        }
      }
    });
  }

  // 获取设备列表
  @Bind()
  getEquipmentList(val) {
    const {
      dispatch,
      fetchingPlatform: {
        defaultSite = {},
      },
    } = this.props;
    dispatch({
      type: 'fetchingPlatform/getEquipmentList',
      payload: {
        workcellCode: val.workcellCode,
        siteId: defaultSite.siteId,
      },
    });
  }

  @Bind()
  handleCheckBarcode(vals) {
    const {
      dispatch,
      fetchingPlatform: { workcellInfo = {} },
    } = this.props;
    dispatch({
      type: 'fetchingPlatform/checkInSite',
      payload: {
        materialLotCode: vals.materialLotCode,
        prodLineId: workcellInfo.prodLineId,
        workcellId: workcellInfo.workcellId,
      },
    }).then(res => {
      if (res && res.verifyFlag === 1) {
        this.scaneMaterialCode(vals);
      } else if (res && res.verifyFlag === 0) {
        Modal.confirm({
          title: res.warnMessage,
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            this.scaneMaterialCode(vals);
          },
        });
      }
    });
  }

  /**
   * @description: 扫描条码
   * @param {type} params
   */
  @Bind()
  scaneMaterialCode(vals) {
    const {
      dispatch,
      tenantId,
      fetchingPlatform: { workcellInfo = {}, exceptionEquipmentCodes, errorEquipmentCodes, boxList },
    } = this.props;
    this.setState({ spinning: true });
    console.log(boxList);
    // 注释掉, by:ywj,reason:bzy要去掉此处的代码
    // dispatch({
    //   type: 'fetchingPlatform/updateState',
    //   payload: {
    //     boxList: [],
    //   },
    // });
    const inSiteFuc = () => {
      dispatch({
        type: 'fetchingPlatform/scaneMaterialCode',
        payload: {
          tenantId,
          barcode: vals.materialLotCode,
          operationId: workcellInfo.operationId,
          workcellId: workcellInfo.workcellId,
          wkcShiftId: workcellInfo.wkcShiftId,
          materialLotInfo: isArray(boxList) && !isEmpty(boxList) ? boxList[0] : null,
        },
      }).then(res => {
        if (res) {
          this.fetchBoxList();
        }
        this.setState({ spinning: false });
      });
    };
    if (exceptionEquipmentCodes || errorEquipmentCodes) {
      Modal.confirm({
        title: `${exceptionEquipmentCodes || errorEquipmentCodes}设备需要进行点检,是否先进行点检`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.openEquipmentCheck();
          this.setState({ spinning: false });
        },
        onCancel: () => {
          if (exceptionEquipmentCodes) {
            inSiteFuc();
          }
          this.setState({ spinning: false });
        },
      });
    } else {
      inSiteFuc();
    }
  }

  @Bind()
  openEquipmentCheck() {
    const { fetchingPlatform: { workcellInfo = {} } } = this.props;
    openTab({
      key: `/hhme/equipment-check`, // 打开 tab 的 key
      path: `/hhme/equipment-check`, // 打开页面的path
      title: '设备点检&保养平台',
      search: queryString.stringify({
        workcellCode: workcellInfo.workcellCode,
      }),
      closable: true,
    });
  }

  // 新增条码
  @Bind()
  addBarCode(type, flag) {
    this.setState({ modalType: type });
    this.setState({ addBarCodeModalVisible: flag });
    const { dispatch } = this.props;
    dispatch({
      type: 'fetchingPlatform/updateState',
      payload: {
        maxNumber: '',
      },
    });
  }

  // 创建条码
  @Bind()
  createBarCode(val) {
    const {
      dispatch,
      tenantId,
      fetchingPlatform: { workcellInfo = {}, containerInfo = {}, defaultSite = {} },
    } = this.props;
    this.setState({ spinning: true });
    dispatch({
      type: 'fetchingPlatform/createBarCode',
      payload: {
        tenantId,
        ...val,
        lot: val.lot || '',
        prodLineId: workcellInfo.prodLineId,
        operationId: workcellInfo.operationId,
        workcellId: workcellInfo.workcellId,
        wkcShiftId: workcellInfo.wkcShiftId,
        workOrderId: containerInfo.workOrderId,
        cosRecord: containerInfo.cosRecord,
        cosType: containerInfo.cosType,
        siteId: defaultSite.siteId,
      },
    }).then(res => {
      this.setState({ spinning: false });
      if (res) {
        this.addBarCode('', false);
        notification.success();
        this.queryProcessing();
      }
    });
  }

  // 出站打印
  @Bind()
  siteOutPrint(type) {
    const {
      dispatch,
      tenantId,
      fetchingPlatform: { workcellInfo = {}, containerInfo = {}, equipmentList = [] },
    } = this.props;
    const { siteOutOkList = [], siteOutNgList = [] } = containerInfo;
    const { qualifiedTableSelect, ncTableSelect } = this.state;
    let okNgArray = [];
    this.setState({ printType: type });
    if (type === 'OK') {
      // okNgArray = siteOutOkList && siteOutOkList.filter((item) => {
      //   return item.printFlag === 'N';
      // });
      okNgArray = siteOutOkList.filter(ele => qualifiedTableSelect.some(eles => eles === ele.materialLotId)).map(ele => ele);
    } else {
      // okNgArray = siteOutNgList && siteOutNgList.filter((item) => {
      //   return item.printFlag === 'N';
      // });
      okNgArray = siteOutNgList.filter(ele => ncTableSelect.some(eles => eles === ele.materialLotId)).map(ele => ele);
    }
    const eqStatusList = [];
    const eqList = equipmentList.filter((item) => {
      return item.equipmentId;
    });
    eqList.forEach(item => {
      eqStatusList.push({
        ...item,
        equipmentStatus: item.color,
      });
    });
    if (okNgArray.length > 0) {
      dispatch({
        type: 'fetchingPlatform/siteOutPrint',
        payload: {
          tenantId,
          equipmentList: eqStatusList,
          siteOutList: okNgArray,
          operationId: workcellInfo.operationId,
          operationRecordId: containerInfo.cosRecord,
          workcellId: workcellInfo.workcellId,
          workOrderId: containerInfo.workOrderId,
        },
      }).then(res => {
        if (res) {
          dispatch({
            type: 'fetchingPlatform/siteOutPrintList',
            payload: res,
          }).then(resPrint => {
            if (resPrint) {
              const file = new Blob(
                [resPrint],
                { type: 'application/pdf' }
              );
              const fileURL = URL.createObjectURL(file);
              const newwindow = window.open(fileURL, 'newwindow');
              if (newwindow) {
                newwindow.print();
                this.queryProcessing();
              } else {
                notification.error({ message: '当前窗口已被浏览器拦截，请手动设置浏览器！' });
              }
            }
          });
        }
      });
    } else {
      notification.warning({ message: '暂无可打印条码！' });
    }
  }

  // 点击确认按钮
  @Bind()
  siteInConfirm() {
    const {
      dispatch,
      tenantId,
      fetchingPlatform: { workcellInfo = {}, containerInfo = {}, equipmentList = [], defaultSite = {} },
    } = this.props;
    this.setState({ spinning: true });
    const eqList = equipmentList.filter((item) => {
      return item.equipmentId;
    });
    const eqStatusList = [];
    eqList.forEach(item => {
      eqStatusList.push({
        ...item,
        equipmentStatus: item.color,
      });
    });
    dispatch({
      type: 'fetchingPlatform/siteInConfirm',
      payload: {
        tenantId,
        materialLotId: containerInfo.materialLotId,
        primaryUomQty: containerInfo.primaryUomQty,
        eoJobSnId: containerInfo.eoJobSnId,
        workcellId: workcellInfo.workcellId,
        siteId: defaultSite.siteId,
        equipmentList: eqStatusList,
      },
    }).then(res => {
      this.setState({ spinning: false });
      if (res) {
        notification.success();
        this.bootomForm.resetFields();
        this.queryProcessing();
        dispatch({
          type: 'fetchingPlatform/updateState',
          payload: {
            selectInfo: {},
          },
        });
      }
    });
  }

  // 合格芯片装盒选中事件
  @Bind()
  onQualifiedTable(qualifiedTableSelect) {
    this.setState({
      qualifiedTableSelect,
    });
  }

  // 不合格芯片装盒选中事件
  @Bind()
  onNcTable(ncTableSelect) {
    this.setState({
      ncTableSelect,
    });
  }

  // 选容器类型查数量
  @Bind()
  queryMaxNumber(val) {
    const { dispatch, tenantId, fetchingPlatform: { workcellInfo = {}, containerInfo = {} } } = this.props;
    dispatch({
      type: 'fetchingPlatform/queryMaxNumber',
      payload: {
        tenantId,
        cosType: containerInfo.cosType,
        operationId: workcellInfo.operationId,
        containerType: val,
      },
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
      type: `fetchingPlatform/bindingEq`,
      payload: data,
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
    const { dispatch, fetchingPlatform: { defaultSite } } = this.props;
    return dispatch({
      type: `fetchingPlatform/bindingEqConfirm`,
      payload: {
        ...info,
        siteId: defaultSite.siteId,
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
    const { dispatch, fetchingPlatform: { defaultSite } } = this.props;
    return dispatch({
      type: `fetchingPlatform/changeEqConfirm`,
      payload: {
        ...info,
        siteId: defaultSite.siteId,
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
    const { dispatch, fetchingPlatform: { defaultSite } } = this.props;
    dispatch({
      type: `fetchingPlatform/getEquipmentList`,
      payload: {
        workcellCode,
        siteId: defaultSite.siteId,
        // siteId: 40226.1,
      },
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
    const { dispatch, fetchingPlatform: { workcellInfo } } = this.props;
    dispatch({
      type: `fetchingPlatform/deleteEq`,
      payload: data,
    }).then(res => {
      if (res) {
        notification.success();
        this.handleFetchEquipment(workcellInfo.workcellCode);
      }
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
      type: `fetchingPlatform/changeEq`,
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
      type: `fetchingPlatform/fetchEqInfo`,
      payload: {
        eqCode,
      },
    });
  }

  // 查询投入盒子列表
  fetchBoxList() {
    const {
      dispatch,
      fetchingPlatform: {
        workcellInfo = {},
        containerInfo = {},
      },
    } = this.props;
    dispatch({
      type: 'fetchingPlatform/fetchBoxList',
      payload: {
        operationId: workcellInfo.operationId,
        workcellId: workcellInfo.workcellId,
        workOrderId: containerInfo.workOrderId,
      },
    });
  }

  @Bind
  handleSelectBoxList(selectedRowKeys, selectedRows) {
    this.setState({
      selectedRowKeysBox: selectedRowKeys,
      selectedRowsBox: selectedRows,
    });
  }

  /**
   * @description: 投入确认
   */
  @Bind
  putInConfirm() {
    const { selectedRowsBox } = this.state;
    const {
      dispatch,
      fetchingPlatform: { workcellInfo = {}, equipmentList = [], defaultSite = {}, containerInfo = {} },
    } = this.props;
    const eqList = equipmentList.filter((item) => {
      return item.equipmentId;
    });
    const eqStatusList = [];
    eqList.forEach(item => {
      eqStatusList.push({
        ...item,
        equipmentStatus: item.color,
      });
    });
    dispatch({
      type: 'fetchingPlatform/putInConfirm',
      payload: {
        siteId: defaultSite.siteId,
        equipmentList: eqStatusList,
        workcellId: workcellInfo.workcellId,
        materialLotList: selectedRowsBox,
      },
    }).then(res => {
      if (res) {
        notification.success();
        if (containerInfo.workOrderId) {
          this.fetchBoxList();
        }
        this.setState({
          selectedRowKeysBox: [],
          selectedRowsBox: [],
        });
      }
    });
  }

  /**
   * @description: 查询不良类型
   */
  @Bind
  fetchNcList(record) {
    const { dispatch } = this.props;
    return dispatch({
      type: 'fetchingPlatform/fetchNcList',
      payload: {
        materialLotId: record.materialLotId,
      },
    });
  }

  @Bind
  deleteBoxList() {
    const {
      dispatch,
      fetchingPlatform: { workcellInfo = {}, defaultSite = {}, containerInfo = {} },
    } = this.props;
    const { selectedRowsBox } = this.state;
    dispatch({
      type: 'fetchingPlatform/deleteBoxList',
      payload: {
        siteId: defaultSite.siteId,
        operationId: workcellInfo.operationId,
        workcellId: workcellInfo.workcellId,
        workOrderId: containerInfo.workOrderId,
        materialLotIdList: selectedRowsBox.map(ele => ele.materialLotId),
      },
    }).then(res => {
      if (res) {
        this.setState({
          selectedRowKeysBox: [],
          selectedRowsBox: [],
        });
        notification.success();
        if (containerInfo.workOrderId) {
          dispatch({
            type: 'fetchingPlatform/updateState',
            payload: {
              boxList: [],
            },
          });
          this.fetchBoxList();
          this.queryProcessing();
        }
      }
    });
  }

  render() {
    const { visible, spinning, enterSiteLoading, addBarCodeModalVisible, modalType, printType, qualifiedTableSelect = [], ncTableSelect, selectedRowKeysBox = [] } = this.state;
    const {
      getSiteListLoading,
      fetchingPlatform: {
        containerInfo = {},
        lovData = {},
        workcellInfo = {},
        equipmentList = [],
        siteOutOkList = [],
        siteOutNgList = [],
        ncList = [],
        defaultSite = {},
        maxNumber = '',
        boxList = [],
      },
      createBarCodeLoading,
      siteOutPrintLoading,
      bindingEqLoading,
      bindingEqConfirmLoading,
      fetchEquipmentListLoading,
      deleteEqLoading,
      changeEqLoading,
      changeEqConfirmLoading,
      siteOutPrintListLoading,
      fetchBoxListLoading,
      fetchNcListLoading,
      putInConfirmLoading,
      deleteBoxListLoading,
      checkInSiteLoading,
    } = this.props;
    const { containerType = [], fetchNcCode = [] } = lovData;
    const enterModalProps = {
      visible,
      loading: getSiteListLoading || enterSiteLoading,
      enterSite: this.enterSite,
    };
    const bottomFormProps = {
      containerInfo,
      checkInSiteLoading,
      onRef: node => {
        this.bootomForm = node.props.form;
      },
      scaneMaterialCode: this.handleCheckBarcode,
      siteInConfirm: this.siteInConfirm,
    };
    const addBarCodeModal = {
      type: modalType,
      containerType,
      fetchNcCode,
      maxNumber,
      info: !isEmpty(boxList) && isArray(boxList) ? boxList[0] : {},
      visible: addBarCodeModalVisible,
      loading: createBarCodeLoading,
      createBarCode: this.createBarCode,
      addBarCode: this.addBarCode,
      queryMaxNumber: this.queryMaxNumber,
    };
    const qualifiedTableSelection = {
      selectedRowKeys: qualifiedTableSelect,
      onChange: this.onQualifiedTable,
      getCheckboxProps: record => ({
        disabled: !record.materialLotId,
      }),
    };

    const ncTableSelection = {
      selectedRowKeys: ncTableSelect,
      onChange: this.onNcTable,
      getCheckboxProps: record => ({
        disabled: !record.materialLotId,
      }),
    };
    const qualifiedTableProps = {
      dataSource: siteOutOkList,
      siteOutPrintLoading,
      siteOutPrintListLoading,
      printType,
      qualifiedTableSelection,
      containerInfo,
      qualifiedTableSelect,
      siteOutPrint: this.siteOutPrint,
      addBarCode: this.addBarCode,
    };
    const ncTableProps = {
      dataSource: siteOutNgList,
      siteOutPrintLoading,
      siteOutPrintListLoading,
      printType,
      ncTableSelection,
      containerInfo,
      ncTableSelect,
      siteOutPrint: this.siteOutPrint,
      addBarCode: this.addBarCode,
    };
    const stationEquipmentProps = {
      siteId: defaultSite.siteId,
      workCellInfo: workcellInfo,
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
    const boxListProps = {
      handleSelect: this.handleSelectBoxList,
      fetchNcList: this.fetchNcList,
      loading: fetchBoxListLoading,
      dataSource: boxList,
      selectedRowKeys: selectedRowKeysBox,
    };
    const ncListTableProps = {
      dataSource: ncList,
      loading: fetchNcListLoading,
    };
    return (
      <Fragment>
        <Header title="取片平台">
          <Button
            onClick={() => this.deleteBoxList()}
            icon='delete'
            disabled={selectedRowKeysBox.length === 0}
            loading={deleteBoxListLoading}
          >
            删除
          </Button>
          <Button
            onClick={() => this.putInConfirm()}
            type="primary"
            disabled={selectedRowKeysBox.length === 0}
            loading={putInConfirmLoading}
          >
            投入确认
          </Button>
        </Header>
        <Content style={{ padding: '0px', backgroundColor: 'transparent' }}>
          <Spin spinning={spinning}>
            <Row gutter={16}>
              <Col span={20} className={styles['fetching-platform-top-left']}>
                <Row>
                  <Col span={9}>
                    <BottomForm {...bottomFormProps} />
                  </Col>
                  <Col span={8} style={{ margin: '0px 5px' }}>
                    <BoxList {...boxListProps} />
                  </Col>
                  <Col span={6} style={{ width: '28%' }}>
                    <NCListTable {...ncListTableProps} />
                  </Col>
                </Row>
              </Col>
              <Col span={4}>
                <Card className={styles['fetching-platform-top-right-site']}>
                  <div style={{ float: 'left' }}><img src={gwPath} alt="" /></div>
                  <div style={{ float: 'left', padding: '2px' }}>当前工位：{workcellInfo.workcellName}</div>
                </Card>
                <Card title="工位设备" className={styles['fetching-platform-top-right-equipment']}>
                  <Scrollbars style={{ height: '250px' }}>
                    <StationEquipment
                      {...stationEquipmentProps}
                    />
                  </Scrollbars>
                </Card>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: '8px' }}>
              <Col span={20} className={styles['fetching-platform-bottom-left']}>
                <Row>
                  <Col span={11}>
                    <QualifiedTable {...qualifiedTableProps} />
                  </Col>
                  <Col span={11} style={{ marginLeft: '50px' }}>
                    <NCTable {...ncTableProps} />
                  </Col>
                </Row>
              </Col>
              <Col span={4}>
                <Card className={styles['incoming-material-entry-link-card']} style={{ height: '340px' }}>
                  <div className={styles['incoming-material-entry-link-button']}>
                    <div>
                      <span className={styles['incoming-material-entry-link-span']} />
                      <span>不良统计</span>
                      <span className={styles['incoming-material-entry-link-quantity']}>查看</span>
                    </div>
                    <div>
                      <span className={styles['incoming-material-entry-link-span']} />
                      <span>异常反馈</span>
                      <span className={styles['incoming-material-entry-link-quantity']}>查看</span>
                    </div>
                    <div>
                      <span className={styles['incoming-material-entry-link-span']} />
                      <span>制造履历</span>
                      <span className={styles['incoming-material-entry-link-quantity']}>查看</span>
                    </div>
                    <div>
                      <span className={styles['incoming-material-entry-link-span']} />
                      <span>E-SOP</span>
                      <span className={styles['incoming-material-entry-link-quantity']}>查看</span>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Spin>
          {visible && <EnterModal {...enterModalProps} />}
          {addBarCodeModalVisible && <AddBarCodeModal {...addBarCodeModal} />}
        </Content>
      </Fragment>
    );
  }
}
