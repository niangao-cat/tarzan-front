/*
 * @Description: 贴片平台
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-06 17:42:02
 * @LastEditTime: 2020-08-07 14:03:49
 */

import React, { Component, Fragment } from 'react';
import { isEmpty } from 'lodash';
import { connect } from 'dva';
import { Row, Col, Spin, Card, Input, Modal } from 'hzero-ui';
import { Scrollbars } from 'react-custom-scrollbars';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';

import StationEquipment from './Component/StationEquipment';
import BatchMaterial from './Component/BatchMaterial';
import EnterSite from '@/components/EnterSite';
// import PasteChipArfterTable from './Component/PasteChipArfterTable';
import InvestInTable from './Component/InvestInTable';
import gwPath from '@/assets/gw.png';
import styles from './index.less';


@connect(({ goldThread, loading }) => ({
  goldThread,
  getSiteListLoading: loading.effects['goldThread/getSiteList'],
  fetchEquipmentListLoading: loading.effects['goldThread/getEquipmentList'],
  deleteEqLoading: loading.effects['goldThread/deleteEq'],
  changeEqLoading: loading.effects['goldThread/changeEq'],
  bindingEqLoading: loading.effects['goldThread/bindingEq'],
  bindingEqConfirmLoading: loading.effects['goldThread/bindingEqConfirm'],
  changeEqConfirmLoading: loading.effects['goldThread/changeEqConfirm'],
}))
export default class goldThread extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinning: false,
      enterSiteVisible: true,
      enterSiteLoading: false,
    };
  }

  HandoverMatterForm;

  componentDidMount() {
    // 获取默认站点
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'goldThread/getSiteList',
      payload: {
        tenantId,
      },
    });
    // 查询下拉框
    dispatch({
      type: 'goldThread/batchLovData',
    });

    dispatch({
      type: `goldThread/fetchDefaultSite`,
    });
  }

  @Bind()
  enterSite(val) {
    this.setState({ enterSiteLoading: true });
    const {
      dispatch,
      goldThread: {
        defaultSite = {},
      },
    } = this.props;
    dispatch({
      type: 'goldThread/enterSite',
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
          this.getEquipmentList(val);
          this.getSetOutData();
        }
      }
    });
  }

  // 获取设备列表
  @Bind()
  getSetOutData() {
    const { dispatch, goldThread: { workcellInfo = {}, defaultSite = {} } } = this.props;
    // 调用接口
    dispatch({
      type: 'goldThread/queryBox',
      payload: {
        ...workcellInfo,
        ...defaultSite,
        assembleQty: 0,
      },
    });
  }

  // 获取物料信息
  @Bind()
  getMaterialList() {
    const { dispatch, goldThread: { workcellInfo = {}, defaultSite = {} } } = this.props;
    dispatch({
      type: 'goldThread/getMaterialList',
      payload: {
        ...workcellInfo,
        ...defaultSite,
      },
    });
  }

  // 获取设备列表
  @Bind()
  getEquipmentList(val) {
    const {
      dispatch,
      goldThread: {
        defaultSite = {},
      },
    } = this.props;
    dispatch({
      type: 'goldThread/getEquipmentList',
      payload: {
        workcellCode: val.workcellCode,
        siteId: defaultSite.siteId,
      },
    });
  }

  // 扫描绑定批次
  @Bind
  handleScanMaterialCode(e) {
    // 先聚焦焦点
    const inputBarcode = document.getElementById('materialInput');
    inputBarcode.focus();
    inputBarcode.select();
    // 判断是否输入空批次 是则报错
    if (e.target.value === "" || e.target.value === null || e.target.value === undefined) {
      return notification.error({ message: "请勿扫描空批次" });
    } else {
      const materialLotCode = e.target.value;
      this.setState({ spinning: true });
      const { dispatch, goldThread: { workcellInfo = {}, defaultSite = {}, materialLot = {} } } = this.props;
      if(isEmpty(materialLot.workOrderId)){
        this.setState({ spinning: false });
        return notification.error({ message: "请先扫描芯片盒子条码" });
      }
      dispatch({
        type: 'goldThread/bindingMaterial',
        payload: {
          ...workcellInfo,
          ...defaultSite,
          wafer: materialLot.wafer,
          workOrderId: materialLot.workOrderId,
          materialLotCode,
        },
      }).then(res => {
        if (res) {
          // 判断是否需要解绑，1需要
          if (res.flag === 1) {
            Modal.confirm({
              title: '该物料已经存在，是否执行解绑操作？',
              okText: '确定',
              cancelText: '取消',
              onOk: () => {
                this.setState({ spinning: true });
                // 调用接口
                dispatch({
                  type: 'goldThread/unbindingMaterial',
                  payload: {
                    ...workcellInfo,
                    ...defaultSite,
                    workOrderId: materialLot.workOrderId,
                    materialLotCode,
                  },
                }).then(() => {
                  this.getMaterialList();
                  notification.success({ message: "解绑成功" });
                  this.setState({ spinning: false });
                });
              },
            });
            this.setState({ spinning: false });
          } else {
            this.getMaterialList();
            notification.success({ message: "绑定成功" });
          }
          this.setState({ spinning: false });
        }
        this.setState({ spinning: false });
      });
    }
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
      type: `goldThread/changeEq`,
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
    const { dispatch, goldThread: { workcellInfo } } = this.props;
    dispatch({
      type: `goldThread/deleteEq`,
      payload: data,
    }).then(res => {
      if (res) {
        notification.success();
        this.handleFetchEquipment(workcellInfo.workcellCode);
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
      type: `goldThread/bindingEq`,
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
      type: `goldThread/fetchEqInfo`,
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
    const { dispatch, goldThread: { siteId } } = this.props;
    return dispatch({
      type: `goldThread/changeEqConfirm`,
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
    const { dispatch, goldThread: { siteId } } = this.props;
    return dispatch({
      type: `goldThread/bindingEqConfirm`,
      payload: {
        ...info,
        siteId,
      },
    });
  }

  @Bind()
  handleFetchEquipment(workcellCode) {
    const { dispatch, goldThread: { siteId } } = this.props;
    dispatch({
      type: `goldThread/getEquipmentList`,
      payload: {
        workcellCode,
        siteId,
      },
    });
  }

  render() {
    const {
      goldThread: {
        equipmentList = [],
        workcellInfo = {},
        equipmentInfo = {},
        materialList = [],
        siteId = "",
      },
      getSiteListLoading,
      deleteEqLoading,
      changeEqLoading,
      bindingEqLoading,
      bindingEqConfirmLoading,
      changeEqConfirmLoading,
      fetchEquipmentListLoading,
    } = this.props;
    const { enterSiteVisible, enterSiteLoading } = this.state;
    const enterSiteProps = {
      visible: enterSiteVisible,
      loading: getSiteListLoading || enterSiteLoading,
      closePath: '/hhme/gold-thread',
      enterSite: this.enterSite,
    };
    const firstProps = {
      getSetOutData: this.getSetOutData,
    };
    // const secondProps = {
    //   selectDataKeys: this.state.selectDataKeys,
    //   selectData: this.state.selectData,
    //   setCheckedData: this.setCheckedData,
    //   getSetOutData: this.getSetOutData,
    // };
    const stationEquipmentProps = {
      siteId,
      workCellInfo: workcellInfo,
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
    return (
      <Fragment>
        <Header title="金线打线" />
        <Content style={{ padding: '0px', backgroundColor: 'transparent' }}>
          <Spin spinning={this.state.spinning}>
            <Row gutter={6}>
              <Col span={18}>
                <Card className={styles['pastechip-platform-invest-in-table']}>
                  <InvestInTable {...firstProps} />
                </Card>
              </Col>
              {/* <Col span={9}>
                <Card className={styles['pastechip-platform-paste-chip-arfter-table']}>
                  <PasteChipArfterTable {...secondProps} />
                </Card>
              </Col> */}
              <Col span={6}>
                <Card className={styles['paste-chip-platform-site']}>
                  <div style={{ float: 'left' }}><img src={gwPath} alt="" /></div>
                  <div style={{ float: 'left', padding: '2px' }}>当前工位：{workcellInfo.workcellName}</div>
                </Card>
                <Card title="工位设备" className={styles['paste-chip-platform-site-equipment']}>
                  <Scrollbars style={{ height: '160px' }}>
                    <StationEquipment {...stationEquipmentProps} />
                  </Scrollbars>
                </Card>
                <Card title={<span>批次物料<Input id="materialInput" onPressEnter={this.handleScanMaterialCode} style={{ width: '145px', marginLeft: '10px' }} /></span>} className={styles['paste-chip-platform-site-equipment']}>
                  <Scrollbars style={{ height: '160px' }}>
                    <BatchMaterial
                      itemList={materialList}
                    />
                  </Scrollbars>
                </Card>
                <Card className={styles['pastechip-platform-link-card']}>
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
            {enterSiteVisible && <EnterSite {...enterSiteProps} />}
            {/* {addBarCodeModalVisible && <AddBarCodeModal {...addBarCodeModal} />} */}
          </Spin>
        </Content>
      </Fragment>
    );
  }
}
