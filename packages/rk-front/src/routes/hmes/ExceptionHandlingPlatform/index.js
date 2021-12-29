/*
 * @Description: 异常处理平台
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-22 19:22:49
 */

import React, { Component, Fragment } from 'react';
import { Row, Spin } from 'hzero-ui';
import { connect } from 'dva';
import qs from 'querystring';
import { isEmpty } from 'lodash';

import { Header, Content } from 'components/Page';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import { getCurrentUser, getCurrentUserId } from 'utils/utils';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';

import styles from './index.less';
import ExceptionDrawer from './Drawer/ExceptionDrawer';
import AddExceptionModal from './Drawer/AddExceptionModal';
import CardList from './Component/CardList';
import EnterModal from './Component/EnterModal';

@connect(({ exceptionHandlingPlatform, loading }) => ({
  exceptionHandlingPlatform,
  loading,
  closeExceptionLoading: loading.effects['exceptionHandlingPlatform/closeException'],
  createExceptionRecordLoading: loading.effects['exceptionHandlingPlatform/createExceptionRecord'],
  checkWorkcellLoading: loading.effects['exceptionHandlingPlatform/enterOkSite'],

}))
export default class ExceptionHandlingPlatform extends Component {
  constructor(props) {
    super(props);
    const { workcellId } = this.props.match.params;
    this.state = {
      exceptioListVisible: false,
      exceptionModal: false, // 异常提交model
      modalType: '', // 模态框类型
      // eslint-disable-next-line react/no-unused-state
      visible: false,
      spinning: false,
      exceptionLabelListDetail: {}, // 按钮的明细内容
      workcellId,
      operationTabFlag: false,
    };
  }

  componentDidMount() {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'exceptionHandlingPlatform/getSiteList',
      payload: {},
    });
    dispatch({
      type: 'exceptionHandlingPlatform/getWocellList',
      payload: { userId: getCurrentUserId() },
    });
    const { workcellId } = this.props.match.params;
    if (workcellId === 'menu') {
      // eslint-disable-next-line react/no-unused-state
      this.setState({ visible: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    const routerParam = qs.parse(nextProps.location.search.substr(1));
    if (!isEmpty(routerParam)) {
      if (this.state.operationTabFlag !== routerParam.operationTabFlag) {
        this.enterSite({
          workcellCode: routerParam.workcellCode,
          siteId: routerParam.siteId,
        });
        this.setState({ operationTabFlag: routerParam.operationTabFlag });
      }
    }
  }

  // 组件销毁
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'exceptionHandlingPlatform/updateState',
      payload: {
        defaultSite: {},
        exceptionList: [],
        equipmentInfo: {}, // 设备信息
        exceptionRecord: {}, // 历史记录
        materialInfo: {}, // 物料信息
        exceptionStatus: '', // 异常信息状态
        workcellInfo: {},
        areaMap: [],
        workshopMap: [],
        prodLineMap: [],
      },
    });
  }

  @Bind()
  closeEnterModel() {
    this.setState({ visible: false });
    this.setState({ spinning: true });
    // 输入数字时， 判断
    const { dispatch, exceptionHandlingPlatform: { defaultSite = {} } } = this.props;
    dispatch({
      type: 'exceptionHandlingPlatform/enterNoSite',
      payload: {
        siteId: defaultSite.siteId,
      },
    }).then(() => {
      this.setState({ spinning: false });
    });
  }

  /**
   * @description: 模态框隐藏-新增异常/异常清单
   * @param {Boolean} exceptionModal 新增异常模态框
   * @param {Boolean} exceptioListVisible 异常清单
   * @param {String} type 点击的类型
   * @param {String} data 异常消息记录
   */
  @Bind()
  showModal(exceptionModal, exceptioListVisible, type) {
    const { dispatch } = this.props;
    this.setState({ exceptionModal, exceptioListVisible, modalType: type });
    if (!exceptioListVisible) {
      dispatch({
        type: 'exceptionHandlingPlatform/updateState',
        payload: {
          exceptionStatus: '',
        },
      });
    }
  }

  /**
   * @description: 异常创建
   * @param {type} type 类型（人员、设备、物料、工艺质量、环境）
   * @param {Object} exceptionLabelListDetail 异常明细，即每个按钮的内容
   */
  @Bind()
  submitException(type, exceptionLabelListDetail) {
    this.setState({ exceptionModal: true, modalType: type, exceptionLabelListDetail });
  }

  @Bind()
  submitExceptionTem(type, exceptionLabelListDetail, workcell) {
    const { dispatch } = this.props;
    dispatch({
      type: 'exceptionHandlingPlatform/updateState',
      payload: {
        workcellInfo: workcell,
      },
    });
    this.setState({ exceptionModal: true, modalType: type, exceptionLabelListDetail: { ...exceptionLabelListDetail, ...workcell } });
  }

  @Bind()
  checkWocell(value) {
    const { dispatch, exceptionHandlingPlatform: { defaultSite = {} } } = this.props;
    return dispatch({
      type: 'exceptionHandlingPlatform/enterOkSite',
      payload: {
        workcellCode: value,
        siteId: defaultSite.siteId,
      },
    });
  }

  /**
   * @description: 输入工位
   * @param {String} values 工位编码
   */
  @Bind()
  enterSite(values) {
    this.setState({ spinning: true });
    // 输入数字时， 判断
    if (values) {
      const { dispatch, exceptionHandlingPlatform: { defaultSite = {} } } = this.props;
      dispatch({
        type: 'exceptionHandlingPlatform/enterSite',
        payload: {
          siteId: defaultSite.siteId,
          ...values,
        },
      }).then(res => {
        this.setState({ spinning: false });
        if (res) {
          this.setState({ visible: false });
        }
      });
    }
  }

  /**
   * @description: 扫描设备
   * @param {Object} values form参数
   * @param {String} modalType 异常类型：物料或设备
   */
  @Bind()
  enterEquipment(values, modalType) {
    const { dispatch } = this.props;
    dispatch({
      type: modalType === 'EQUIPMENT' ? 'exceptionHandlingPlatform/enterEquipment' : 'exceptionHandlingPlatform/enterMaterial',
      payload: {
        ...values,
      },
    }).then(res => {
      if (res) {
        notification.success();
      }
    });
  }

  /**
   * @description: 创建异常记录
   * @param {Object} values form参数
   */
  @Bind()
  createExceptionRecord(values, exceptionLabelListDetail, modalType) {
    const {
      dispatch,
      exceptionHandlingPlatform: {
        equipmentInfo = {},
        defaultSite = {},
        materialInfo = {},
        exceptionList = [],
        workcellInfo = {},
      },
    } = this.props;
    const modalTypeDes = exceptionList.filter(item => item.exceptionType === modalType)[0]
      .exceptionTypeMeaning;
    const asyncProps = {
      exceptionWkcRecordId: exceptionLabelListDetail.exceptionId,
      exceptionType: modalTypeDes,
      exceptionCode: exceptionLabelListDetail.exceptionCode,
      exceptionName: exceptionLabelListDetail.exceptionName,
      exceptionRemark: values.exceptionRemark,
      workcellName: exceptionLabelListDetail.workcellName,
      initiator: getCurrentUser(),
      currentTime: moment().format(DEFAULT_DATETIME_FORMAT),
    };
    dispatch({
      type: modalType === 'EQUIPMENT' ? 'exceptionHandlingPlatform/enterEquipment' : 'exceptionHandlingPlatform/enterMaterial',
      payload: {
        ...values,
      },
    }).then(ressult => {
      if (ressult) {
        notification.success();
        dispatch({
          type: 'exceptionHandlingPlatform/createExceptionRecord',
          payload: {
            ...exceptionLabelListDetail,
            equipmentId: equipmentInfo.equipmentId,
            siteId: defaultSite.siteId,
            materialId: materialInfo.materialId,
            ...values,
            initiationType: exceptionLabelListDetail.initiationType ? exceptionLabelListDetail.initiationType : 'WKC',
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.showModal(false, false, '');
            this.setState({ spinning: true });
            if (workcellInfo.workcellId) {
              dispatch({
                type: 'exceptionHandlingPlatform/enterNoSite',
                payload: {
                  siteId: defaultSite.siteId,
                },
              }).then(() => {
                this.setState({ spinning: false });
              });
            } else {
              dispatch({
                type: 'exceptionHandlingPlatform/enterSite',
                payload: {
                  ...res,
                  siteId: defaultSite.siteId,
                },
              }).then(() => {
                this.setState({ spinning: false });
              });
            }
            dispatch({
              type: 'exceptionHandlingPlatform/updateState',
              payload: {
                enterEquipment: {},
                materialInfo: {},
              },
            });

            // 调用接口查询数据
            dispatch({
              type: 'exceptionHandlingPlatform/fetchLineList',
              payload: {
                exceptionId: exceptionLabelListDetail.exceptionId,
              },
            }).then(resReturn => {
              if (resReturn) {
                const data = resReturn;
                for (let i = 0; i < data.content.length; i++) {
                  dispatch({
                    type: 'exceptionHandlingPlatform/fetchPositionData',
                    payload: {
                      positionId: data.content[i].respondPositionId,
                    },
                  }).then(resPositionData => {
                    if (resPositionData) {
                      const dataRes = resPositionData.content;
                      for (let j = 0; j < dataRes.length; j++) {
                        dataRes[j].realName = dataRes[j].name;
                      }
                      data.content[i].approvedBy = dataRes;
                    }
                    // 判断是否是最后一条数据 是则继续
                    if (i === data.content.length - 1) {
                      asyncProps.exceptions = data.content;
                      asyncProps.initiator.mobile = asyncProps.initiator.phone;
                      asyncProps.initiator.userId = getCurrentUserId();

                      // 查询用户对应的员工信息
                      dispatch({
                        type: 'exceptionHandlingPlatform/fetchUserData',
                        payload: {
                          userId: getCurrentUserId(),
                        },
                      }).then(employeeData => {
                        if (employeeData) {
                          asyncProps.initiator.employeeCode = employeeData.employeeNum;
                          // 最终发送异步操作请求
                          dispatch({
                            type: 'exceptionHandlingPlatform/asyncSetData',
                            payload: asyncProps,
                          }).then(result => {
                            if (!result.success) {
                              notification.error({ message: result.message });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              }
            });
          }
        });
      }
    });
  }

  @Bind()
  closeException(val) {
    const { dispatch,
      exceptionHandlingPlatform: {
        defaultSite = {},
      },
    } = this.props;
    dispatch({
      type: 'exceptionHandlingPlatform/closeException',
      payload: {
        exceptionWkcRecordId: val.exceptionWkcRecordId,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.showModal(false, false, '');
        this.setState({ spinning: true });
        dispatch({
          type: 'exceptionHandlingPlatform/enterSite',
          payload: {
            ...res,
            siteId: defaultSite.siteId,
          },
        }).then(() => {
          this.setState({ spinning: false });
        });
        dispatch({
          type: 'exceptionHandlingPlatform/updateState',
          payload: {
            enterEquipment: {},
            materialInfo: {},
          },
        });
      }
    });
  }

  render() {
    const {
      exceptionHandlingPlatform: {
        exceptionList = [],
        exceptionRecord = {},
        exceptionStatus = '',
        areaMap = [],
        workshopMap = [],
        prodLineMap = [],
      },
      closeExceptionLoading,
      createExceptionRecordLoading,
      checkWorkcellLoading,
    } = this.props;
    const { exceptioListVisible, exceptionModal, modalType, spinning, exceptionLabelListDetail } = this.state;
    const enterModalProps = {
      visible: this.state.visible,
      loading: this.state.spinning,
      workcellId: this.state.workcellId,
      enterSite: this.enterSite,
      closeEnterModel: this.closeEnterModel,
    };
    const drawerProps = {
      modalType,
      exceptioListVisible,
      exceptionRecord,
      closeExceptionLoading,
      exceptionStatus,
      hideModal: this.showModal,
      closeException: this.closeException,
    };
    const addExcProps = {
      modalType,
      exceptionModal,
      exceptionLabelListDetail,
      createExceptionRecordLoading,
      hideModal: this.showModal,
      handleOk: this.createExceptionRecord,
      enterEquipment: this.enterEquipment,
    };
    return (
      <Fragment>
        <Header title="异常处理平台" />
        <Content style={{ padding: '0px', backgroundColor: 'transparent', margin: '7px 7px 16px' }}>
          <Spin spinning={spinning}>
            <Row className={styles['exception-handling-platform']}>
              {exceptionList.map(item => {
                return (
                  <CardList
                    showModal={this.showModal}
                    {...item}
                    areaMap={areaMap}
                    workshopMap={workshopMap}
                    prodLineMap={prodLineMap}
                    submitException={this.submitException}
                    checkWorkcellLoading={checkWorkcellLoading}
                    checkWocell={this.checkWocell}
                    submitExceptionTem={this.submitExceptionTem}
                  />
                );
              })}
            </Row>
          </Spin>
          {exceptioListVisible && <ExceptionDrawer {...drawerProps} />}
          {exceptionModal && <AddExceptionModal {...addExcProps} />}
          <EnterModal {...enterModalProps} />
        </Content>
      </Fragment>
    );
  }
}
