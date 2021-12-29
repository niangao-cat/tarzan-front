/**
 * EquipmentCheck - 设备点检平台
 * @date: 2020/03/10 15:59:20
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component, Fragment } from 'react';
import { Row, Col, Spin } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import qs from 'querystring';

import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import { getCurrentUserId } from 'utils/utils';
import { decrypt } from '@/utils/utils';
import { openTab } from 'utils/menuTab';

import styles from './index.less';

import BaseInfo from './Component/BaseInfo';
import CheckPoints from './Component/CheckPoints';

const userId = getCurrentUserId();

@connect(({ equipmentCheck, loading }) => ({
  equipmentCheck,
  fetchSiteIdLoading: loading.effects['equipmentCheck/fetchDefaultSite'],
  fetchWorkCellInfoLoading: loading.effects['equipmentCheck/fetchWorkCellInfo'],
  fetchEquipmentInfoLoading: loading.effects['equipmentCheck/fetchEquipmentInfo'],
  fetchMaintenanceInfoLoading: loading.effects['equipmentCheck/fetchMaintenanceInfo'],
  fetchCheckInfoLoading: loading.effects['equipmentCheck/fetchCheckInfo'],
}))
export default class EquipmentCheck extends Component {
  constructor(props) {
    super(props);
    const routerParam = qs.parse(this.props.history.location.search.substr(1));
    this.state = {
      typeCode: null,
      routerParamState: routerParam,
      timeType: "DAY",
    };
    this.initData();
  }

  @Bind()
  initData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'equipmentCheck/updateState',
      payload: {
        baseInfo: {},
        workCellInfo: {},
        siteInfo: {},
        equipmentInfo: {},
        checkList: [],
      },
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'equipmentCheck/fetchDefaultSite',
    });
    const routerParam = qs.parse(this.props.history.location.search.substr(1));
    if (routerParam.assetEncoding) {
      this.componentWillReceivePropsSearch(this.state.routerParamState);
    }
    if(routerParam.workcellCode && !routerParam.assetEncoding) {
      dispatch({
        type: 'equipmentCheck/fetchDefaultSite',
      }).then(res => {
        if(res) {
          this.handleFetchWorkCellInfo(routerParam.workcellCode);
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { equipmentCheck: { workCellInfo } } = this.props;
    const routerParam = qs.parse(nextProps.history.location.search.substr(1));
    const { routerParamState } = this.state;
    if (routerParam.assetEncoding !== routerParamState.assetEncoding) {
      this.componentWillReceivePropsSearch(routerParam);
      this.setState({
        routerParamState: routerParam,
      });
    }
    if(routerParam.workcellCode && workCellInfo.workcellCode && workCellInfo.workcellCode !== routerParam.workcellCode) {
      this.handleFetchWorkCellInfoWillReceive(routerParam.workcellCode);
    }
  }

  @Bind()
  handleFetchWorkCellInfoWillReceive(workcellCode) {
    const { dispatch } = this.props;
    dispatch({
      type: 'equipmentCheck/updateState',
      payload: {
        workCellInfo: {
          workcellCode,
        },
      },
    });
    dispatch({
      type: 'equipmentCheck/fetchDefaultSite',
    }).then(res => {
      if(res) {
        dispatch({
          type: `equipmentCheck/fetchWorkCellInfo`, // 代替扫描工位
          payload: {
            workcellCode,
            siteId: res.siteId,
          },
        });
      }
    });
  }

  @Bind()
  componentWillReceivePropsSearch(routerParam) {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'equipmentCheck/fetchDefaultSite', // 首先去查默认站点
    }).then(siteRes => {
      if (siteRes) {
        dispatch({
          type: `equipmentCheck/fetchWorkCellInfo`, // 代替扫描工位
          payload: {
            workcellCode: routerParam.workcellCode,
            siteId: siteRes.siteId,
          },
        }).then(wcRes => {
          if (wcRes) {
            dispatch({
              type: 'equipmentCheck/fetchEquipmentInfo', // 查询设备信息
              payload: {
                assetEncoding: routerParam.assetEncoding,
              },
            }).then(eqRes => {
              if (eqRes) {
                const { equipmentCheck: { equipmentInfo, siteInfo, workCellInfo } } = this.props;
                this.setState({ typeCode: 'CHECK' });
                dispatch({
                  type: `equipmentCheck/fetchCheckInfo`, // 查询点检信息
                  payload: {
                    assetEncoding: equipmentInfo.assetEncoding,
                    topSiteId: siteInfo.siteId,
                    workcellId: workCellInfo.workcellId,
                    shiftCode: workCellInfo.shiftCode,
                    shiftDate: workCellInfo.shiftDate,
                    equipmentId: equipmentInfo.equipmentId,
                    taskDocId: equipmentInfo.taskDocId,
                    page: {
                      page: 0,
                      size: 50,
                    },
                  },
                });
              }
            });
          }
        });
      }
    });
  }

  @Bind()
  handleFetchWorkCellInfo(workcellCode) {
    const {
      dispatch,
      equipmentCheck: { siteInfo },
    } = this.props;
    return dispatch({
      type: `equipmentCheck/fetchWorkCellInfo`,
      payload: {
        workcellCode,
        siteId: siteInfo.siteId,
      },
    });
  }

  @Bind()
  handleFetchEquipmentInfo(equipmentCode) {
    const { dispatch, equipmentCheck: { siteInfo } } = this.props;
    const assetEncoding = decrypt(equipmentCode);
    return dispatch({
      type: 'equipmentCheck/fetchEquipmentInfo',
      payload: {
        assetEncoding,
      },
    }).then(res => {
      if (res && !res.equipmentFlag) { // 为任务单号
        this.handleFetchWorkCellInfo(res.workcellCode).then(result => {
          if(result) {
            const { equipmentCheck: { workCellInfo } } = this.props;
            if (res.typeFlag === 'C') {
              dispatch({
                type: `equipmentCheck/fetchCheckInfo`,
                payload: {
                  assetEncoding: res.assetEncoding,
                  topSiteId: siteInfo.siteId,
                  workcellId: workCellInfo.workcellId,
                  shiftCode: workCellInfo.shiftCode,
                  shiftDate: workCellInfo.shiftDate,
                  equipmentId: res.equipmentId,
                  taskDocId: res.taskDocId,
                  page: {
                    page: 0,
                    size: 50,
                  },
                },
              });
              this.setState({ typeCode: 'CHECK' });
            } else {
              dispatch({
                type: `equipmentCheck/fetchMaintenanceInfo`,
                payload: {
                  assetEncoding: res.assetEncoding,
                  topSiteId: siteInfo.siteId,
                  workcellId: workCellInfo.workcellId,
                  shiftCode: workCellInfo.shiftCode,
                  shiftDate: workCellInfo.shiftDate,
                  equipmentId: res.equipmentId,
                  taskDocId: res.taskDocId,
                  page: {
                    current: 0,
                    pageSize: 50,
                  },
                },
              });
              this.setState({ typeCode: 'MAINTENANCE' });
            }
          }
        });
      } else if(res) {
        this.handleFetchWorkCellInfo(res.workcellCode);
      }
      return res;
    });
  }

  @Bind()
  handleFetchCheckList(page = {}, timeType ="DAY") {
    const { dispatch, equipmentCheck: { equipmentInfo, siteInfo, workCellInfo } } = this.props;
    dispatch({
      type: `equipmentCheck/fetchCheckInfo`,
      payload: {
        assetEncoding: equipmentInfo.assetEncoding,
        topSiteId: siteInfo.siteId,
        workcellId: workCellInfo.workcellId,
        shiftCode: workCellInfo.shiftCode,
        shiftDate: workCellInfo.shiftDate,
        equipmentId: equipmentInfo.equipmentId,
        taskDocId: equipmentInfo.taskDocId,
        timeType,
        page: {
          pageSize: 50,
          ...page,
        },
      },
    });
  }

  @Bind()
  handleFetchMaintainList(page = {}, timeType ="DAY") {
    const { dispatch, equipmentCheck: { equipmentInfo, siteInfo, workCellInfo } } = this.props;
    dispatch({
      type: `equipmentCheck/fetchMaintenanceInfo`,
      payload: {
        assetEncoding: equipmentInfo.assetEncoding,
        topSiteId: siteInfo.siteId,
        workcellId: workCellInfo.workcellId,
        shiftCode: workCellInfo.shiftCode,
        shiftDate: workCellInfo.shiftDate,
        equipmentId: equipmentInfo.equipmentId,
        taskDocId: equipmentInfo.taskDocId,
        timeType,
        page: {
          pageSize: 50,
          ...page,
        },
      },
    });
  }

  @Bind()
  handleAddResult(info) {
    const { dispatch, equipmentCheck: { workCellInfo } } = this.props;
    const { typeCode } = this.state;
    dispatch({
      type: `equipmentCheck/addResult`,
      payload: {
        ...info,
        userId,
        workcellId: workCellInfo.workcellId,
      },
    }).then(() => {
      if (typeCode === 'CHECK') {
        this.handleFetchCheckList({}, this.state.timeType);
      } else if (typeCode === 'MAINTENANCE') {
        this.handleFetchMaintainList({}, this.state.timeType);
      }
      notification.success();
    });
  }

  @Bind()
  handleChangeType(val) {
    this.setState({ typeCode: val, timeType: 'DAY' });
    if (val === 'CHECK') {
      this.handleFetchCheckList({}, 'DAY');
    } else if (val === 'MAINTENANCE') {
      this.handleFetchMaintainList({}, 'DAY');
    }
  }

  @Bind()
  queryByDate(timeType){
    this.setState({timeType});
    if (this.state.typeCode=== 'CHECK') {
      this.handleFetchCheckList({}, timeType);
    } else if (this.state.typeCode === 'MAINTENANCE') {
      this.handleFetchMaintainList({}, timeType);
    }
  }

  @Bind()
  handleToExceptionTab() {
    openTab({
      key: `/hmes/exception-handling-platform/menu`, // 打开 tab 的 key
      path: `/hmes/exception-handling-platform/menu`, // 打开页面的path
      closable: true,
    });
  }

  @Bind()
  handleSaveRemark(info) {
    const { dispatch, equipmentCheck: { workCellInfo } } = this.props;
    const { typeCode } = this.state;
    dispatch({
      type: `equipmentCheck/saveRemark`,
      payload: {
        ...info,
        userId,
        workcellId: workCellInfo.workcellId,
      },
    }).then(() => {
      if (typeCode === 'CHECK') {
        this.handleFetchCheckList({}, this.state.timeType);
      } else if (typeCode === 'MAINTENANCE') {
        this.handleFetchMaintainList({}, this.state.timeType);
      }
      notification.success();
    });
  }


  render() {
    const {
      fetchWorkCellInfoLoading,
      fetchSiteIdLoading,
      fetchCheckInfoLoading,
      fetchMaintenanceInfoLoading,
      equipmentCheck: { equipmentInfo = {}, checkList = [], pagination, checkInfo = {}, colorDto ={} },
    } = this.props;
    const routerParam = qs.parse(this.props.history.location.search.substr(1));
    const { typeCode } = this.state;
    const baseInfoProps = {
      checkInfo,
      equipmentInfo,
      routerParam,
      colorDto,
      onFetchEquipmentInfo: this.handleFetchEquipmentInfo,
      onChangeType: this.handleChangeType,
      onQueryByDate: this.queryByDate,
    };
    const checkoutPointsProps = {
      checkList,
      pagination,
      typeCode,
      onEnterClick: this.handleAddResult,
      onFetchCheckList: this.handleFetchCheckList,
      onFetchMaintainList: this.handleFetchMaintainList,
      onToExceptionTab: this.handleToExceptionTab,
      onSaveRemark: this.handleSaveRemark,
    };
    return (
      <Fragment>
        <Header title='设备点检&保养平台' />
        <Content>
          <Spin spinning={fetchWorkCellInfoLoading || fetchCheckInfoLoading || fetchMaintenanceInfoLoading || fetchSiteIdLoading || false}>
            <Row gutter={48}>
              <Col
                span={6}
                className={styles['content-left']}
                style={{ paddingLeft: '12px', paddingRight: '2px' }}
              >
                <BaseInfo {...baseInfoProps} />
              </Col>
              <Col
                span={18}
                className={styles['content-right']}
                style={{ paddingLeft: '12px', paddingRight: '2px' }}
              >
                <CheckPoints {...checkoutPointsProps} />
              </Col>
            </Row>
          </Spin>
        </Content>
      </Fragment>
    );
  }
}
