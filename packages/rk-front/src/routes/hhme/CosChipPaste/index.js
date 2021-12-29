/*
 * @Description: cos芯片贴合
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-12 09:31:25
 * @LastEditTime: 2020-08-29 10:38:44
 */

import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Row, Col, Spin, Card, Button, Input, Modal } from 'hzero-ui';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './index.less';
import FilterForm from './FilterForm';
import TableList from './Component/TableList';
import StationEquipment from './Component/StationEquipment';
import PositionTable from './Component/PositionTable';
import EnterSite from '@/components/EnterSite';
import notification from 'utils/notification';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId } from 'utils/utils';
import gwPath from '@/assets/gw.png';

@connect(({ cosChipPaste, loading }) => ({
  cosChipPaste,
  tenantId: getCurrentOrganizationId(),
  getSiteListLoading: loading.effects['cosChipPaste/getSiteList'],
  fetchEquipmentListLoading: loading.effects['cosChipPaste/getEquipmentList'],
  deleteEqLoading: loading.effects['cosChipPaste/deleteEq'],
  changeEqLoading: loading.effects['cosChipPaste/changeEq'],
  bindingEqLoading: loading.effects['cosChipPaste/bindingEq'],
  bindingEqConfirmLoading: loading.effects['cosChipPaste/bindingEqConfirm'],
  changeEqConfirmLoading: loading.effects['cosChipPaste/changeEqConfirm'],
}))
export default class CosChipPaste extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinning: false,
      enterSiteVisible: true,
      enterSiteLoading: false,
      materialLotId: '-1',
      selectLine: {},
      beforeCode: '',
    };
  }

  HandoverMatterForm;

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'cosChipPaste/getSiteList',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: `cosChipPaste/fetchDefaultSite`,
    });
  }

  @Bind()
  enterSite(val) {
    this.setState({ enterSiteLoading: true });
    const {
      dispatch,
      cosChipPaste: { defaultSite = {} },
    } = this.props;
    dispatch({
      type: 'cosChipPaste/enterSite',
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
          this.scaneMaterialCode('');
        }
      }
    });
  }

  @Bind()
  handleClickRow(record) {
    const { materialLotId } = this.state;
    if (materialLotId === record.jobId) {
      return styles['data-click'];
    } else {
      return '';
    }
  }

  // 行点击触发事件
  @Bind()
  onClickRow(record = {}, vals) {
    const {
      dispatch,
      cosChipPaste: { containerlist = [] },
    } = this.props;
    this.setState({ spinning: true, materialLotId: record.jobId, selectLine: record });
    //  行信息调用
    dispatch({
      type: 'cosChipPaste/queryLineData',
      payload: {
        ...record,
      },
    }).then(() => {
      // 移到下一个标签
      const className = document.getElementsByClassName('code-input');
      if ((vals&&vals.index)&&Number(vals.index) + 1 < className.length) {
        className[Number(vals.index) + 1].focus();
      }
      this.setState({ spinning: false });
    });
    dispatch({
      type: 'cosChipPaste/updateState',
      payload: {
        containerlist,
      },
    });
  }

  // 获取设备列表
  @Bind()
  getEquipmentList(val) {
    const {
      dispatch,
      cosChipPaste: { defaultSite = {} },
    } = this.props;
    dispatch({
      type: 'cosChipPaste/getEquipmentList',
      payload: {
        workcellCode: val.workcellCode,
        siteId: defaultSite.siteId,
      },
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
      cosChipPaste: { workcellInfo = {} },
    } = this.props;
    if (vals&&vals.materialLotCode) {
      this.setState({ spinning: true });
      // 进行数据校验
      dispatch({
        type: 'cosChipPaste/checkMaterialCode',
        payload: {
          tenantId,
          materialLotCode: vals.materialLotCode,
          workcellId: workcellInfo.workcellId,
          prodLineId: workcellInfo.prodLineId,
        },
      }).then(resVefity => {
        this.setState({ spinning: false });
        if (resVefity && resVefity.verifyFlag === 1) {
          dispatch({
            type: 'cosChipPaste/scaneMaterialCode',
            payload: {
              tenantId,
              barcode: vals.materialLotCode,
              operationId: workcellInfo.operationId,
              workcellId: workcellInfo.workcellId,
              wkcShiftId: workcellInfo.wkcShiftId,
            },
          }).then(res => {
            if (res) {
              // 查询行信息
              if (vals !== '' && vals !== null && vals !== undefined) {
                this.onClickRow(res[0]);
              }
            }
            this.setState({ spinning: false });
          });
        } else if (resVefity && resVefity.verifyFlag === 0) {
          this.setState({ spinning: false });
          Modal.confirm({
            title: resVefity ? resVefity.warnMessage : '',
            onOk: () => {
              this.setState({ spinning: true });
              dispatch({
                type: 'cosChipPaste/scaneMaterialCode',
                payload: {
                  tenantId,
                  barcode: vals.materialLotCode,
                  operationId: workcellInfo.operationId,
                  workcellId: workcellInfo.workcellId,
                  wkcShiftId: workcellInfo.wkcShiftId,
                },
              }).then(res => {
                if (res) {
                  // 查询行信息
                  if (vals !== '' && vals !== null && vals !== undefined) {
                    this.onClickRow(res[0]);
                  }
                }
                this.setState({ spinning: false });
              });
            },
          });
        }
      });
    } else {
      this.setState({ spinning: true });
      dispatch({
        type: 'cosChipPaste/scaneMaterialCode',
        payload: {
          tenantId,
          barcode: vals.materialLotCode,
          operationId: workcellInfo.operationId,
          workcellId: workcellInfo.workcellId,
          wkcShiftId: workcellInfo.wkcShiftId,
        },
      }).then(res => {
        if (res) {
          // 查询行信息
          if (vals !== '' && vals !== null && vals !== undefined) {
            this.onClickRow(res[0]);
          }
        }
        this.setState({ spinning: false });
      });
    }
  }

  /**
   * @description: 扫描条码
   * @param {type} params
   */
  @Bind()
  saveData() {
    if (
      this.state.selectLine.jobId === undefined ||
      this.state.selectLine.jobId === '' ||
      this.state.selectLine.jobId === null
    ) {
      return notification.error({ message: '请先选中要出站的信息' });
    }
    const {
      dispatch,
      cosChipPaste: { workcellInfo = {} },
    } = this.props;
    this.setState({ spinning: true });
    dispatch({
      type: 'cosChipPaste/saveData',
      payload: {
        eoJobSnId: this.state.selectLine.jobId,
        ...workcellInfo,
      },
    }).then(res => {
      if (res) {
        notification.success({ message: '出站成功' });
        this.scaneMaterialCode({});
      }
      this.setState({ spinning: false });
    });
  }

  @Bind()
  saveLineData(vals) {
    const { dispatch } = this.props;
    this.setState({ spinning: true });
    dispatch({
      type: 'cosChipPaste/saveLineData',
      payload: {
        ...vals,
        hotSinkCode: this.state.beforeCode + vals.hotSinkCode,
      },
    }).then(res => {
      if (res) {
        notification.success({ message: '操作成功' });
        // 查询明细信息
        this.onClickRow(this.state.selectLine, vals);
      }
      this.setState({ spinning: false });
    });
  }

  @Bind()
  changeBeforeCode(e) {
    this.setState({ beforeCode: e.target.value });
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
      type: `cosChipPaste/changeEq`,
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
    const {
      dispatch,
      cosChipPaste: { workcellInfo },
    } = this.props;
    dispatch({
      type: `cosChipPaste/deleteEq`,
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
      type: `cosChipPaste/bindingEq`,
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
      type: `cosChipPaste/fetchEqInfo`,
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
    const {
      dispatch,
      cosChipPaste: { siteId },
    } = this.props;
    return dispatch({
      type: `cosChipPaste/changeEqConfirm`,
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
    const {
      dispatch,
      cosChipPaste: { siteId },
    } = this.props;
    return dispatch({
      type: `cosChipPaste/bindingEqConfirm`,
      payload: {
        ...info,
        siteId,
      },
    });
  }

  @Bind()
  handleFetchEquipment(workcellCode) {
    const {
      dispatch,
      cosChipPaste: { siteId },
    } = this.props;
    dispatch({
      type: `cosChipPaste/getEquipmentList`,
      payload: {
        workcellCode,
        siteId,
      },
    });
  }

  render() {
    const {
      cosChipPaste: {
        equipmentList = [],
        workcellInfo = {},
        equipmentInfo = {},
        containerlist = [],
        lineList = [],
        siteId = '',
        errorEquipmentCodes= "",
        exceptionEquipmentCodes= "",
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
    const col = lineList;
    const enterSiteProps = {
      visible: enterSiteVisible,
      loading: getSiteListLoading || enterSiteLoading,
      closePath: '/hhme/cos-chip-paste',
      enterSite: this.enterSite,
    };
    const filterForm = {
      scaneMaterialCode: this.scaneMaterialCode,
      workcellInfo,
      errorEquipmentCodes,
      exceptionEquipmentCodes,
    };
    const tableProps = {
      dataSource: containerlist,
      handleClickRow: this.handleClickRow,
      rowClick: this.onClickRow,
    };
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
        <Header title="COS芯片号录入" />
        <Content style={{ padding: '0px', backgroundColor: 'transparent' }}>
          <Spin spinning={this.state.spinning}>
            <Row gutter={16}>
              <Col span={18} className={styles['cos-inspection-platform-table']}>
                <FilterForm {...filterForm} />
                <Row gutter={8}>
                  <Col>
                    <TableList {...tableProps} />
                  </Col>
                </Row>
              </Col>
              <Col span={6}>
                <Card className={styles['cos-inspection-platform-site-card']}>
                  <div style={{ float: 'left' }}>
                    <img src={gwPath} alt="" />
                  </div>
                  <div style={{ float: 'left', padding: '2px' }}>
                    当前工位：{workcellInfo.workcellName}
                  </div>
                </Card>
                <Card title="工位设备" className={styles['cos-inspection-platform-equipment-card']}>
                  <Scrollbars style={{ height: '240px' }}>
                    <StationEquipment {...stationEquipmentProps} />
                  </Scrollbars>
                </Card>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: '8px' }}>
              <Col span={20} className={styles['cos-chip-paste-position']}>
                <span style={{ marginLeft: '20px' }}>
                  前缀号
                  <Input
                    onChange={this.changeBeforeCode}
                    style={{ width: '150px', marginLeft: '20px' }}
                  />
                </span>
                <Row style={{ marginTop: '6px' }}>
                  <Col span={23}>
                    <Scrollbars style={{ height: '290px' }}>
                      <div style={{ width: '1600px' }}>
                        {col.map(item => (
                          <div style={{ width: '160px', float: 'left', marginRight: '8px' }}>
                            <PositionTable item={item} saveLineData={this.saveLineData} />
                          </div>
                        ))}
                      </div>
                    </Scrollbars>
                  </Col>
                  <Col span={1} style={{ height: '290px', textAlign: 'end' }}>
                    <div style={{ marginTop: '220px' }}>
                      <Button onClick={this.saveData} type="primary">
                        保存
                      </Button>
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <Button>取消</Button>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col span={4}>
                <Card className={styles['incoming-material-entry-link-card']}>
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
          {enterSiteVisible && <EnterSite {...enterSiteProps} />}
        </Content>
      </Fragment>
    );
  }
}
