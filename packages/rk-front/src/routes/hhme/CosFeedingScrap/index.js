/*
 * @Description: 贴片平台
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-06 17:42:02
 * @LastEditTime: 2020-08-07 14:03:49
 */

import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Row, Col, Spin, Card, Input, Modal, Checkbox, Button } from 'hzero-ui';
import styles from './index.less';
import StationEquipment from './Component/StationEquipment';
import BatchMaterial from './Component/BatchMaterial';
import { Scrollbars } from 'react-custom-scrollbars';
import notification from 'utils/notification';
import EnterSite from '@/components/EnterSite';
import { Bind } from 'lodash-decorators';
// import PasteChipArfterTable from './Component/PasteChipArfterTable';
import InvestInTable from './Component/InvestInTable';
import gwPath from '@/assets/gw.png';

@connect(({ cosFeedingScrap, loading}) => ({
  cosFeedingScrap,
  getSiteListLoading: loading.effects['cosFeedingScrap/getSiteList'],
  fetchEquipmentListLoading: loading.effects['cosFeedingScrap/getEquipmentList'],
  deleteEqLoading: loading.effects['cosFeedingScrap/deleteEq'],
  changeEqLoading: loading.effects['cosFeedingScrap/changeEq'],
  bindingEqLoading: loading.effects['cosFeedingScrap/bindingEq'],
  bindingEqConfirmLoading: loading.effects['cosFeedingScrap/bindingEqConfirm'],
  changeEqConfirmLoading: loading.effects['cosFeedingScrap/changeEqConfirm'],
}))
export default class cosFeedingScrap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinning: false,
      enterSiteVisible: true,
      enterSiteLoading: false,
      selectData: [], // 选中的物料信息
      selectedRowData: [], // 选中的投料信息
    };
  }

  HandoverMatterForm;

  componentDidMount() {
    // 获取默认站点
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'cosFeedingScrap/getSiteList',
      payload: {
        tenantId,
      },
    });
    // 查询下拉框
    dispatch({
      type: 'cosFeedingScrap/batchLovData',
    });

    dispatch({
      type: `cosFeedingScrap/fetchDefaultSite`,
    });
  }

  @Bind()
  enterSite(val) {
    this.setState({ enterSiteLoading: true });
    const {
      dispatch,
      cosFeedingScrap: {
        defaultSite = {},
      },
    } = this.props;
    dispatch({
      type: 'cosFeedingScrap/enterSite',
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
    const { dispatch, cosFeedingScrap: { workcellInfo= {}, defaultSite= {}}} = this.props;
      // 调用接口
      dispatch({
        type: 'cosFeedingScrap/queryBox',
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
    const { dispatch, cosFeedingScrap: { workcellInfo= {}}} = this.props;
     dispatch({
       type: 'cosFeedingScrap/getMaterialList',
       payload: {
        workcellId: workcellInfo.workcellId,
       },
     });
   }

  // 获取设备列表
  @Bind()
  getEquipmentList(val) {
    const {
      dispatch,
      cosFeedingScrap: {
        defaultSite = {},
      },
    } = this.props;
    dispatch({
      type: 'cosFeedingScrap/getEquipmentList',
      payload: {
        workcellCode: val.workcellCode,
        siteId: defaultSite.siteId,
      },
    });
  }

  @Bind
  setSelectData(selectData, list){
    const {
      dispatch,
    } = this.props;
    // 设置选中数据
    this.setState({selectData});
    // 更新对应的选中信息
    // 更新物料信息
    const materialList= list;
    for(let i=0; i<materialList.length; i++){
      if(selectData.filter(item=>item.materialId===materialList[i].materialId).length>0){
        materialList[i].checked = true;
      }else{
        materialList[i].checked = false;
      }
    }
    dispatch({
      type: 'cosFeedingScrap/updateState',
      payload: {
        materialList,
      },
    });
  }

  // 设置投料信息
  @Bind
  setSelectDataRow(selectedRowData){
    // 设置选中数据
    this.setState({selectedRowData});
    // 重新查询数据
    const { dispatch, cosFeedingScrap: { workcellInfo= {}}} = this.props;
     dispatch({
       type: 'cosFeedingScrap/getMaterialList',
       payload: {
        workcellId: workcellInfo.workcellId,
        jobId: selectedRowData[0].jobId,
        qty: selectedRowData[0].primaryUomQty,
        materialLotId: selectedRowData[0].materialLotId,
       },
     });
  }

  // 清空 投料选中
  @Bind
  clearSelectedRowData(){
    this.setState({selectedRowData: []});
  }

  @Bind
  changeMaterialQty(e, index){
    // 更新物料信息
    const {
      dispatch,
      cosFeedingScrap: {
        materialList= [],
      },
    } = this.props;

    materialList[index].qty = e;

    // 同时更新选中状态的数据
    if(this.state.selectData.length>0){
      this.setState({
        selectData: this.state.selectData.map(item=>{
          return {
            ...item,
            qty: item.materialId === materialList[index].materialId?e:item.qty,
          };
        }),
      });
    }
    dispatch({
      type: 'cosFeedingScrap/updateState',
      payload: {
        materialList,
      },
    });
  }

  @Bind()
  handleAllChecked(event) {
    const {
      dispatch,
      cosFeedingScrap: {
        materialList= [],
      },
    } = this.props;

    for(let i=0; i<materialList.length; i++){
      materialList[i].checked = event.target.checked;
    }
    this.setState(
      {
        selectData: event.target.checked ? JSON.parse(JSON.stringify(materialList)) : [],
      }
    );
    dispatch({
      type: 'cosFeedingScrap/updateState',
      payload: {
        materialList,
      },
    });
  }

  // 扫描绑定批次
  @Bind
  handleScanMaterialCode(e){
    // 先聚焦焦点
    const inputBarcode = document.getElementById('materialInput');
    inputBarcode.focus();
    inputBarcode.select();
    // 判断是否输入空批次 是则报错
    if(e.target.value===""||e.target.value===null||e.target.value===undefined){
      return notification.error({message: "请勿扫描空批次"});
    }else{
      const materialLotCode = e.target.value;
     this.setState({spinning: true});
     const { dispatch, cosFeedingScrap: { workcellInfo= {}, defaultSite= {}, materialLot= {}}} = this.props;
     dispatch({
       type: 'cosFeedingScrap/bindingMaterial',
       payload: {
        ...workcellInfo,
        ...defaultSite,
        wafer: materialLot.wafer,
        workOrderId: materialLot.workOrderId,
        materialLotCode,
       },
     }).then(res=>{
       if(res){
         // 判断是否需要解绑，1需要
         if(res.flag ===1){
          Modal.confirm({
            title: '该物料已经存在，是否执行解绑操作？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              this.setState({spinning: true});
              // 调用接口
              dispatch({
                type: 'cosFeedingScrap/unbindingMaterial',
                payload: {
                  ...workcellInfo,
                  ...defaultSite,
                  workOrderId: materialLot.workOrderId,
                  materialLotCode,
                },
              }).then(()=>{
                this.getMaterialList();
                notification.success({message: "解绑成功"});
                this.setState({spinning: false});
              });
            },
          });
          this.setState({spinning: false});
         }else{
          this.getMaterialList();
          notification.success({message: "绑定成功"});
         }
         this.setState({spinning: false});
       }
       this.setState({spinning: false});
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
      type: `cosFeedingScrap/changeEq`,
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
    const { dispatch, cosFeedingScrap: { workcellInfo } } = this.props;
    dispatch({
      type: `cosFeedingScrap/deleteEq`,
      payload: data,
    }).then(res => {
      if(res) {
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
      type: `cosFeedingScrap/bindingEq`,
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
      type: `cosFeedingScrap/fetchEqInfo`,
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
    const { dispatch, cosFeedingScrap: { siteId } } = this.props;
    return dispatch({
      type: `cosFeedingScrap/changeEqConfirm`,
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
    const { dispatch, cosFeedingScrap: { siteId } } = this.props;
    return dispatch({
      type: `cosFeedingScrap/bindingEqConfirm`,
      payload: {
        ...info,
        siteId,
      },
    });
  }

  @Bind()
  handleFetchEquipment(workcellCode) {
    const { dispatch, cosFeedingScrap: { siteId } } = this.props;
    dispatch({
      type: `cosFeedingScrap/getEquipmentList`,
      payload: {
        workcellCode,
        siteId,
      },
    });
  }

  // 投料
  @Bind
  handleFeedMaterialItem(){
    // 判断选中的数据
    if(this.state.selectedRowData.length===0){
      return notification.error({message: "请先选中要投料的条码"});
    }

    // 判断投料物料
    if(this.state.selectData.length===0){
      return notification.error({message: "请先选中要投料的物料"});
    }

    this.setState({spinning: true});
    // 执行投料逻辑
    const { dispatch, cosFeedingScrap: { siteId, workcellInfo = {} } } = this.props;
    dispatch({
      type: `cosFeedingScrap/feedingBox`,
      payload: {
        jobId: this.state.selectedRowData[0].jobId,
        materialLotList: [...this.state.selectData],
        siteId,
        workOrderId: this.state.selectedRowData[0].workOrderId, // 新增传入字段
        operationId: workcellInfo.operationId,
        wkcShiftId: workcellInfo.wkcShiftId,
        workcellId: workcellInfo.workcellId,
      },
    }).then(res=>{
      this.setState({spinning: false});
      if(res){
        notification.success({message: "投料成功"});
        // 重新查询数据
        dispatch({
          type: 'cosFeedingScrap/getMaterialList',
          payload: {
          workcellId: workcellInfo.workcellId,
          jobId: this.state.selectedRowData[0].jobId,
          qty: this.state.selectedRowData[0].primaryUomQty,
          materialLotId: this.state.selectedRowData[0].materialLotId,
          },
        });
      }
    });
  }

  render() {
    const {
      cosFeedingScrap: {
        equipmentList = [],
        workcellInfo = {},
        equipmentInfo = {},
        materialList= [],
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
    const { enterSiteVisible, enterSiteLoading, selectedRowData = [] } = this.state;
    const enterSiteProps = {
      visible: enterSiteVisible,
      loading: getSiteListLoading || enterSiteLoading,
      closePath: '/hhme/cos-feeding-scrap',
      enterSite: this.enterSite,
    };
    const firstProps = {
      getSetOutData: this.getSetOutData,
      setSelectDataRow: this.setSelectDataRow,
      clearSelectedRowData: this.clearSelectedRowData,
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
        <Header title="COS投料报废" />
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
                  <Scrollbars style={{ height: '270px' }}>
                    <StationEquipment {...stationEquipmentProps} />
                  </Scrollbars>
                </Card>
                <Card
                  title={
                    <span>批次物料<Input id="materialInput" onPressEnter={this.handleScanMaterialCode} style={{ width: '145px', marginLeft: '10px' }} />
                      <Button disabled={selectedRowData.length !== 1} type="primary" style={{ marginLeft: '10px', marginRight: '8px'}} onClick={() => this.handleFeedMaterialItem()}>投料</Button>
                      <Checkbox
                        onChange={(e) => this.handleAllChecked(e)}
                        checked={materialList.length === this.state.selectData.length && materialList.length !== 0}
                      >
                全选
                      </Checkbox>
                    </span>}
                  className={styles['paste-chip-platform-site-equipment']}
                >
                  <Scrollbars style={{ height: '270px' }}>
                    <BatchMaterial
                      itemList={materialList}
                      selectData={this.state.selectData}
                      setSelectData={this.setSelectData}
                      changeMaterialQty={this.changeMaterialQty}
                    />
                  </Scrollbars>
                </Card>
                {/* <Card className={styles['pastechip-platform-link-card']}>
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
                </Card> */}
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
