/*
 * @Description: cos芯片转移
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-18 09:40:11
 * @LastEditTime: 2021-03-09 16:55:46
 */

import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Row, Col, Spin, Card, Select, Button, Form, Input, Modal } from 'hzero-ui';
import {
  getCurrentOrganizationId,
} from 'utils/utils';
import { Scrollbars } from 'react-custom-scrollbars';
import { openTab } from 'utils/menuTab';
import queryString from 'querystring';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import styles from './index.less';
import BottomForm from './Component/BottomForm';
import BajoChipInfo from './Component/BajoChipInfo';
import StationEquipment from './Component/StationEquipment';
import ChipContainerMap from '@/components/ChipContainerMap';
import EnterModal from './Component/EnterModal';
import gwPath from '@/assets/gw.png';

@connect(({ cosChipMove, globalMes, loading }) => ({
  cosChipMove,
  globalMes,
  tenantId: getCurrentOrganizationId(),
  getSiteListLoading: loading.effects['cosChipMove/getSiteList'],
  getEquipmentListLoading: loading.effects['cosChipMove/getEquipmentList'],
  autoAssignTransferLoading: loading.effects['cosChipMove/autoAssignTransfer'],
  autoAssignTransferNcLoading: loading.effects['cosChipMove/autoAssignTransferNc'],
  moveOverLoading: loading.effects['cosChipMove/moveOver'],
}))
@Form.create({ fieldNameProp: null })
export default class CosChipMove extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinning: false,
      visible: true,
      enterSiteLoading: false,
      position: '',
      selectSource: {},
    };
  }

  HandoverMatterForm;

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'cosChipMove/batchLovData',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'cosChipMove/getSiteList',
      payload: {
        tenantId,
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cosChipMove/updateState',
      payload: {
        workcellInfo: {}, // 工位信息
        defaultSite: {},
        equipmentList: [], // 设备列表
        sourceContainer: {}, // 来源
        targetContainer: {}, // 目标
        sourceChipList: [], // 来源芯片
        targetRules: 'INIT',
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
      cosChipMove: {
        defaultSite = {},
      },
    } = this.props;
    dispatch({
      type: 'cosChipMove/enterSite',
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
          this.getEquipmentList(val.workcellCode);
          this.fetchSiteInCode(res);
        }
      }
    });
  }

  // 获取设备列表
  @Bind()
  getEquipmentList(workcellCode) {
    const {
      dispatch,
      cosChipMove: {
        defaultSite = {},
      },
    } = this.props;
    dispatch({
      type: 'cosChipMove/getEquipmentList',
      payload: {
        workcellCode,
        siteId: defaultSite.siteId,
      },
    });
  }

  // 获取未出站的数据
  @Bind()
  fetchSiteInCode() {
    const {
      dispatch,
      cosChipMove: {
        workcellInfo = {},
      },
    } = this.props;
    this.setState({ spinning: true });
    dispatch({
      type: 'cosChipMove/fetchSiteInCode',
      payload: {
        workcellId: workcellInfo.workcellId,
        operationId: workcellInfo.operationId,
      },
    }).then(() => {
      this.setState({ spinning: false });
    });
  }

  @Bind()
  clickPosition(dataSource, position) {
    this.setState({ selectSource: dataSource, position });
  }

  @Bind
  handleCheckEquipment(vals) {
    const {
      cosChipMove: {
        errorEquipmentCodes,
        exceptionEquipmentCodes,
      },
    } = this.props;
    if (errorEquipmentCodes || exceptionEquipmentCodes) {
      Modal.confirm({
        title: `${errorEquipmentCodes || exceptionEquipmentCodes}设备需要进行点检,是否先进行点检`,
        okText: '设备点检',
        cancelText: !errorEquipmentCodes && exceptionEquipmentCodes ? '继续操作' : '取消',
        onOk: () => {
          const { cosChipMove: { workcellInfo = {} } } = this.props;
          openTab({
            key: `/hhme/equipment-check`, // 打开 tab 的 key
            path: `/hhme/equipment-check`, // 打开页面的path
            title: '设备点检&保养平台',
            search: queryString.stringify({
              workcellCode: workcellInfo.workcellCode,
            }),
            closable: true,
          });
        },
        onCancel: () => {
          if (!errorEquipmentCodes && exceptionEquipmentCodes) {
            this.handleCheckMaterialCode(vals);
          }
        },
      });
    } else {
      this.handleCheckMaterialCode(vals);
    }
  }


  @Bind()
  handleCheckMaterialCode(vals) {
    const {
      dispatch,
      tenantId,
      cosChipMove: { workcellInfo = {} },
    } = this.props;
    this.setState({ spinning: true });
    dispatch({
      type: 'globalMes/handleCheckMaterialCode',
      payload: {
        tenantId,
        materialLotCode: vals.materialLotCode,
        prodLineId: workcellInfo.prodLineId,
        workcellId: workcellInfo.workcellId,
      },
    }).then(res => {
      if (res && res.verifyFlag === 0) {
        Modal.confirm({
          title: res.warnMessage,
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            this.scaneMaterialCode(vals);
          },
          onCancel: () => {
            this.setState({ spinning: false });
          },
        });
      } else {
        this.scaneMaterialCode(vals);
        this.setState({ spinning: false });
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
      cosChipMove: { workcellInfo = {} },
    } = this.props;
    this.setState({ spinning: true });
    dispatch({
      type: 'cosChipMove/scaneMaterialCode',
      payload: {
        tenantId,
        materialLotCode: vals.materialLotCode,
        operationId: workcellInfo.operationId,
        workcellId: workcellInfo.workcellId,
        wkcShiftId: workcellInfo.wkcShiftId,
      },
    }).then(res => {
      if (res) {
        this.fetchSiteInCode();
      }
      this.setState({ spinning: false });
    });
  }

  // 查询容器信息-根据容器类型
  @Bind()
  fetchContainerInfo(val) {
    const {
      dispatch,
      tenantId,
      cosChipMove: { workcellInfo = {}, sourceContainer = {} },
    } = this.props;
    this.setState({ spinning: true });
    dispatch({
      type: 'cosChipMove/fetchContainerInfo',
      payload: {
        tenantId,
        containerType: val,
        cosType: sourceContainer.cosType,
        operationId: workcellInfo.operationId,
      },
    }).then(() => {
      this.setState({ spinning: false });
    });
  }

  // 扫描目标容器code
  @Bind()
  targetScaneMaterialCode(code) {
    const {
      dispatch,
      tenantId,
      cosChipMove: { workcellInfo = {}, sourceContainer = {} },
      form,
    } = this.props;
    this.setState({ spinning: true });
    dispatch({
      type: 'cosChipMove/targetScaneMaterialCode',
      payload: {
        tenantId,
        materialLotCode: code,
        operationId: workcellInfo.operationId,
        wkcShiftId: workcellInfo.wkcShiftId,
        workcellId: workcellInfo.workcellId,
        locationColumn: sourceContainer.locationColumn,
        locationRow: sourceContainer.locationRow,
        chipNum: sourceContainer.chipNum,
        containerType: sourceContainer.containerType,
        transContainerType: form.getFieldValue('selectContainerType'),
        transCosRecordId: sourceContainer.transCosRecordId,
        transWaferNum: sourceContainer.transWaferNum,
        transCosType: sourceContainer.cosType,
        transferMaterialLotCode: sourceContainer.materialLotCode,
      },
    }).then(res => {
      this.setState({ spinning: false });
      if (res) {
        notification.success();
        this.fetchSiteInCode();
      }
    });
  }

  // 芯片转移
  @Bind()
  moveChip(dataSource, position, index, loadRow, loadColumn, formData) {
    const {
      dispatch,
      tenantId,
      form,
      cosChipMove: { workcellInfo = {}, sourceContainer = {}, defaultSite = {} },
    } = this.props;
    const { selectSource } = this.state;
    if (formData.materialLotCode && selectSource.materialLotLoadId) {
      this.setState({ spinning: true });
      const newPayload = {
        tenantId,
        materialLotLoadId: selectSource.materialLotLoadId,
        containerType: form.getFieldValue('selectContainerType'),
        operationId: workcellInfo.operationId,
        cosType: formData.cosType,
        totalChipNum: selectSource.cosNum,
        transMaterialLotId: sourceContainer.materialLotId,
        materialLotId: formData.materialLotId,
        locationRow: formData.locationRow,
        locationColumn: formData.locationColumn,
        loadRow,
        loadColumn,
        siteId: defaultSite.siteId,
        workcellId: workcellInfo.workcellId,
      };
      const handleMoveChip = (payload) => {
        return dispatch({
          type: 'cosChipMove/moveChip',
          payload,
        });
      };
      handleMoveChip(newPayload).then(res => {
        if (res.result) {
          notification.success();
          this.setState({ selectSource: {} });
          this.fetchSiteInCode();
        } else {
          Modal.confirm({
            title: '单元格芯片数不一致，是否确认转移',
            onOk: () => {
              handleMoveChip({ ...newPayload, confirmFlag: 'Y' }).then(result => {
                if (result) {
                  notification.success();
                  this.setState({ selectSource: {} });
                  this.fetchSiteInCode();
                }
              });
            },
          });
        }
        this.setState({ spinning: false });
      });
    } else {
      notification.warning({ message: '请先扫描器具条码或勾选来源盒子后再进行转入操作！' });
    }
  }

  // 自动分配
  @Bind()
  autoAssignTransfer(loadingRules) {
    const {
      dispatch,
      tenantId,
      cosChipMove: { workcellInfo = {}, sourceContainer = {}, targetContainer = {}, defaultSite = {} },
    } = this.props;
    if (!loadingRules) {
      return notification.error({ message: '请选择装载规则！' });
    }
    const { targetList = [] } = targetContainer;
    this.setState({ spinning: true });
    const materialLotCodeList = [];
    targetList.forEach(item => {
      materialLotCodeList.push(item.materialLotCode);
    });
    dispatch({
      type: 'cosChipMove/autoAssignTransfer',
      payload: {
        tenantId,
        operationId: workcellInfo.operationId,
        workcellId: workcellInfo.workcellId,
        transMaterialLotId: sourceContainer.materialLotId,
        loadingRules,
        materialLotCodeList,
        siteId: defaultSite.siteId,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.fetchSiteInCode();
      }
      this.setState({ spinning: false });
    });
  }

  // 不良自动分配
  @Bind()
  autoAssignTransferNc(loadingRules) {
    const {
      dispatch,
      tenantId,
      cosChipMove: { workcellInfo = {}, sourceContainer = {}, targetContainer = {}, defaultSite = {} },
    } = this.props;
    if (!loadingRules) {
      return notification.error({ message: '请选择装载规则！' });
    }
    const { targetList = [] } = targetContainer;
    this.setState({ spinning: true });
    const materialLotCodeList = [];
    targetList.forEach(item => {
      materialLotCodeList.push(item.materialLotCode);
    });
    dispatch({
      type: 'cosChipMove/autoAssignTransferNc',
      payload: {
        tenantId,
        operationId: workcellInfo.operationId,
        workcellId: workcellInfo.workcellId,
        transMaterialLotId: sourceContainer.materialLotId,
        materialLotCodeList,
        loadingRules,
        siteId: defaultSite.siteId,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.fetchSiteInCode();
      }
      this.setState({ spinning: false });
    });
  }

  // 新增目标容器
  @Bind()
  addTargetContainer() {
    const {
      dispatch,
      cosChipMove: { targetContainer = {} },
    } = this.props;
    const { targetList = [] } = targetContainer;
    targetList.push({
      hmeWoJobSnReturnDTO5List: [],
    });
    dispatch({
      type: 'cosChipMove/updateState',
      payload: {
        targetContainer: { ...targetContainer, targetList },
      },
    });
  }

  // 转移完成
  @Bind()
  moveOver(data, type) {
    const {
      dispatch,
      cosChipMove: {
        equipmentList = [],
        workcellInfo = {},
      },
      form,
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
    this.setState({ spinning: true });
    dispatch({
      type: 'cosChipMove/moveOver',
      payload: {
        eoJobSnId: data.eoJobSnId,
        equipmentList: eqStatusList,
      },
    }).then(res => {
      this.setState({ spinning: false });
      if (res) {
        // 如果是转移完成来源的手动清除下缓存
        if (type === 'SOURCE') {
          dispatch({
            type: 'cosChipMove/updateState',
            payload: {
              sourceContainer: {}, // 来源
            },
          });
        }
        dispatch({
          type: 'cosChipMove/fetchSiteInCode',
          payload: {
            workcellId: workcellInfo.workcellId,
            operationId: workcellInfo.operationId,
          },
        }).then(restarget => {
          // 当转移完成目标卡片数组长度为0之后需要更新下目标卡片的相关数据包括行列等信息
          if (restarget.targetList.length === 0 && type === 'TARGET') {
            this.fetchContainerInfo(form.getFieldValue('selectContainerType'));
          }
        });
        notification.success();
      }
    });
  }

  // 删除未扫描的卡片
  @Bind()
  deleteTargetCard(index) {
    const {
      dispatch,
      cosChipMove: { targetContainer = {} },
    } = this.props;
    const { targetList = [] } = targetContainer;
    targetList.splice(index, 1);
    dispatch({
      type: 'cosChipMove/updateState',
      payload: {
        targetContainer: { ...targetContainer, targetList },
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
      type: `cosChipMove/changeEq`,
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
    const { dispatch, cosChipMove: { workCellInfo } } = this.props;
    dispatch({
      type: `cosChipMove/deleteEq`,
      payload: data,
    }).then(res => {
      if (res) {
        notification.success();
        this.getEquipmentList(workCellInfo.workcellCode);
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
      type: `cosChipMove/bindingEq`,
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
      type: `cosChipMove/fetchEqInfo`,
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
      type: `cosChipMove/changeEqConfirm`,
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
      type: `cosChipMove/bindingEqConfirm`,
      payload: {
        ...info,
        siteId,
      },
    });
  }

  render() {
    const { visible, spinning, enterSiteLoading, position, selectSource } = this.state;
    const {
      cosChipMove: {
        equipmentList = [],
        workcellInfo = {},
        sourceContainer = {},
        lovData = [],
        targetContainer = {},
        loadingRules = [],
        targetRules = '',
        defaultSite = {},
      },
      form,
      getSiteListLoading,
      getEquipmentListLoading,
      autoAssignTransferLoading,
      autoAssignTransferNcLoading,
      moveOverLoading,
      deleteEqLoading,
      changeEqLoading,
      bindingEqLoading,
      bindingEqConfirmLoading,
      changeEqConfirmLoading,
      fetchEquipmentListLoading,
    } = this.props;
    const {
      locationRow = 0,
      locationColumn = 0,
      hmeWoJobSnReturnDTO5List = [],
    } = sourceContainer;
    const { getFieldDecorator } = form;
    const { row = 0, col = 0, targetList = [] } = targetContainer;
    const createBut = targetList.filter((item) => {
      return item.materialLotCode;
    });
    const enterModalProps = {
      visible,
      loading: getSiteListLoading || enterSiteLoading,
      enterSite: this.enterSite,
    };
    const bottomFormProps = {
      sourceContainer,
      loadingRules,
      autoAssignTransferLoading,
      autoAssignTransferNcLoading,
      moveOverLoading,
      scaneMaterialCode: this.handleCheckEquipment,
      autoAssignTransfer: this.autoAssignTransfer,
      autoAssignTransferNc: this.autoAssignTransferNc,
      moveOver: this.moveOver,
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
      onFetchEquipment: this.getEquipmentList,
    };
    return (
      <Fragment>
        <Header title="COS芯片转移" />
        <Content style={{ padding: '0px', backgroundColor: 'transparent' }}>
          <Spin spinning={spinning}>
            <Row gutter={16}>
              <Col span={19} className={styles['cos-chip-move-top-left']}>
                <Row>
                  <Col span={9}>
                    <BottomForm
                      {...bottomFormProps}
                    />
                  </Col>
                  <Col span={9} style={{ padding: '0px 5px' }}>
                    <ChipContainerMap
                      formFlag={false}
                      clickPosition={this.clickPosition}
                      popconfirm={false}
                      dataSource={hmeWoJobSnReturnDTO5List}
                      locationRow={locationRow}
                      locationColumn={locationColumn}
                      scrollbarsHeight='325px'
                    />
                  </Col>
                  <Col span={6} style={{ marginTop: '50px', width: '20%' }}>
                    <BajoChipInfo
                      position={position}
                      selectSource={selectSource}
                    />
                  </Col>
                </Row>
              </Col>
              <Col span={5}>
                <Card className={styles['cos-chip-move-site']}>
                  <div style={{ float: 'left' }}><img src={gwPath} alt="" /></div>
                  <div style={{ float: 'left', padding: '2px' }}>当前工位：{workcellInfo.workcellName}</div>
                </Card>
                <Card title="工位设备" className={styles['cos-chip-move-equipment']}>
                  <Spin spinning={getEquipmentListLoading}>
                    <Scrollbars style={{ height: '253px' }}>
                      <StationEquipment {...stationEquipmentProps} />
                    </Scrollbars>
                  </Spin>
                </Card>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: '8px' }}>
              <Col span={20} className={styles['cos-move-target']}>
                <Row style={{ marginTop: '8px' }} className={styles['cos-move-target-from']}>
                  <Form style={{ float: 'left' }}>
                    <Row>
                      <Col span={12}>
                        <Form.Item>
                          {getFieldDecorator('selectContainerType', {
                            initialValue: targetContainer.transContainerType,
                          })(
                            <Select
                              style={{ width: '145px' }}
                              onChange={val => this.fetchContainerInfo(val)}
                              disabled={targetList.length > 0 ? targetList[0].materialLotCode : false}
                            >
                              {lovData.map(item => {
                                return (
                                  <Select.Option value={item.containerTypeCode} key={item.containerTypeCode}>
                                    {item.containerTypeDescription}
                                  </Select.Option>
                                );
                              })}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item style={{ marginLeft: '4px' }}>
                          {getFieldDecorator('loadRuleMeaning', {
                            initialValue: targetRules === 'INIT' ? sourceContainer.loadRuleMeaning : targetRules,
                          })(
                            <Input disabled />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                  <Button
                    type="primary"
                    icon="plus"
                    style={{
                      marginLeft: '8px', marginTop: '6px',
                    }}
                    disabled={Object.keys(sourceContainer).length === 0 || (targetList.length > createBut.length)}
                    onClick={() => this.addTargetContainer()}
                  >
                    新增
                  </Button>
                </Row>
                <Scrollbars style={{ height: '46vh', marginTop: '8px' }}>
                  <div style={{ width: '1200px' }}>
                    {targetList.map(
                      (item, index) => {
                        return (
                          <ChipContainerMap
                            style={{ float: 'left', margin: '0px 8px 8px 0px' }}
                            index={index}
                            formFlag
                            popconfirm
                            clickPosition={this.moveChip}
                            dataSource={item.hmeWoJobSnReturnDTO5List}
                            formData={item}
                            locationRow={row}
                            locationColumn={col}
                            moveOver={this.moveOver}
                            targetScaneMaterialCode={this.targetScaneMaterialCode}
                            deleteTargetCard={this.deleteTargetCard}
                            scrollbarsHeight={false}
                            scrollbarsWidth={document.getElementById("chip-table-id").offsetWidth}
                          />
                        );
                      }
                    )}
                  </div>
                </Scrollbars>
              </Col>
              <Col span={4}>
                <Card className={styles['cos-move-link-card']}>
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
        </Content>
      </Fragment>
    );
  }
}
