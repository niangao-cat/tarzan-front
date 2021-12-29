/*
 * @Description: 班组工作台
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-09 17:56:29
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-09-22 20:20:53
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Row, Col, Table, Spin, Modal } from 'hzero-ui';
import { tableScrollWidth, filterNullValueObject } from 'utils/utils';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty } from 'lodash';
import moment from 'moment';
import notification from 'utils/notification';
import { Scrollbars } from 'react-custom-scrollbars';
import SectionAndShift from './Component/SectionAndShift';
import TeamInformation from './Component/TeamInformation';
import MidInfo from './Component/MidInfo';
import Quality from './Component/Quality';
import Equipment from './Component/Equipment';
import Safety from './Component/Safety';
import styles from './index.less';

@connect(({ teamWorkbench, loading }) => ({
  teamWorkbench,
  loading: loading.effects['teamWorkbench/handleRollback'],
}))
export default class TeamWorkbench extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startOrEnd: false,
      groupLeaderList: [],
      handoverBut: false,
    };
  }

  HandoverMatterForm;

  componentDidMount() {
    const { dispatch } = this.props;
    // 工段下拉框
    dispatch({
      type: 'teamWorkbench/fetchLineList',
      payload: {},
    });
    // 默认站点
    dispatch({
      type: 'teamWorkbench/getSiteList',
      payload: {},
    });
  }

  // 清除数据
  @Bind()
  clearData() {
    const { dispatch } = this.props;
    this.setState({ handoverBut: false });
    dispatch({
      type: 'teamWorkbench/updateState',
      payload: {
        shiftInfo: {},
        openEndShift: {},
        productBeat: {},
        completionStatistics: [],
      },
    });
  }

  /**
   * @description: 查询页面数据:可通过查询按钮点击或者选中班次直接查
   * @param {Object} values form数据
   */
  @Bind()
  fetchSectionAndShift(values) {
    const { dispatch, teamWorkbench: { shiftList = [] } } = this.props;
    const fieldsValue = (this.openEndform && filterNullValueObject(this.openEndform.getFieldsValue())) || {};
    const newArray = shiftList.filter(item => {
      return item.shiftCode === values.shiftCode;
    });
    this.setState({ startOrEnd: true });
    dispatch({
      type: 'teamWorkbench/fetchSectionAndShift',
      payload: {
        lineWorkcellId: fieldsValue.lineWorkcellId,
        ...newArray[0],
      },
    }).then(res => {
      this.setState({ startOrEnd: false });
      if (res.shiftActualStartTime) {
        this.fetchCompletionStatistics(fieldsValue, res, newArray);
        this.fetchProductBeat(fieldsValue, res);
        this.fetchOperationQuality(fieldsValue, res);
        this.fetchOtherException(fieldsValue, res, {});
        this.fetchEquipmentManage(fieldsValue, res);
        this.fetchEmployeeSecurity(fieldsValue);
      }else{
        // 不查那些信息需要清空数据
        dispatch({
          type: 'teamWorkbench/updateState',
          payload: {
            completionStatistics: [],
            completionStatisticsPagination: {},
            productBeat: {},
            operationQuality: {},
            otherException: [],
            otherExceptionPagination: {},
            equipmentManage: {},
            employeeSecurity: [],
          },
        });
      }
      if (res.shiftActualEndTime) {
        this.fetchHandoverMatter();
      }else{
        dispatch({
          type: 'teamWorkbench/updateState',
          payload: {
            handoverMatter: {},
          },
        });
      }
      this.fetchShiftInfo(fieldsValue, res);
    });
  }

  /**
   * @description: 结班撤回
   * @param {Object} values form数据
   */
  @Bind()
  handleRollback(values) {
    const { dispatch } = this.props;
    dispatch({
      type: 'teamWorkbench/handleRollback',
      payload: {
        workcellId: values.lineWorkcellId,
        shiftCode: values.shiftCode,
        shiftDate: isUndefined(values.date)? null: moment(values.date).format('YYYY-MM-DD HH:mm:ss'),
      },
    }).then(res => {
      if(res){
        notification.success({message: '结班撤回成功'});
        // 数据重新查询
        this.fetchShiftList(values.lineWorkcellId, values.date);
      }
    });
  }

  /**
   * @description: 班组信息
   * @param {Object} values FORM表单
   * @param {Object} resP 查询班次返回值，主要是实际开结班时间
   */
  @Bind()
  fetchShiftInfo(values, resP) {
    const { dispatch, teamWorkbench: { defaultSite = {} } } = this.props;
    this.setState({ startOrEnd: true });
    dispatch({
      type: 'teamWorkbench/fetchShiftInfo',
      payload: {
        siteId: defaultSite.siteId,
        lineWorkcellId: values.lineWorkcellId,
        shiftCode: values.shiftCode,
        shiftActualEndTime: resP.shiftActualEndTime,
        shiftActualStartTime: resP.shiftActualStartTime,
        wkcShiftId: resP.wkcShiftId,
        shiftDate: isUndefined(values.date)
          ? null
          : moment(values.date).format('YYYY-MM-DD'),
      },
    }).then(res => {
      const arr = [];
      if (res.groupLeaderList) {
        res.groupLeaderList.forEach(item => {
          arr.push(`${item} `);
        });
      }
      this.setState({ startOrEnd: false, groupLeaderList: arr });
    });
  }

  /**
   * @description: 完工统计
   * @param {Object} values FORM表单
   * @param {Object} newArray 班次日历，主要是为了要calendarShiftId字段
   * @param {Object} res 查询班次返回值，主要是实际开结班时间
   */
  @Bind()
  fetchCompletionStatistics(values, res, newArray) {
    const { dispatch, teamWorkbench: { defaultSite = {} } } = this.props;
    this.setState({ startOrEnd: true });
    dispatch({
      type: 'teamWorkbench/fetchCompletionStatistics',
      payload: {
        ...newArray[0],
        siteId: defaultSite.siteId,
        lineWorkcellId: values.lineWorkcellId,
        shiftCode: values.shiftCode,
        shiftActualEndTime: res.shiftActualEndTime,
        shiftActualStartTime: res.shiftActualStartTime,
        wkcShiftId: res.wkcShiftId,
        shiftDate: isUndefined(values.date)
          ? null
          : moment(values.date).format('YYYY-MM-DD'),
      },
    }).then(() => {
      this.setState({ startOrEnd: false });
    });
  }

  /**
   * @description: 查询班次
   * @param {String} value 工段
   */
  @Bind()
  fetchShiftList(value, date) {
    const {
      dispatch,
      teamWorkbench: {
        defaultSite = {},
      },
    } = this.props;
    this.setState({ startOrEnd: true });
    dispatch({
      type: 'teamWorkbench/fetchShiftList',
      payload: {
        siteId: defaultSite.siteId,
        lineWorkcellId: value,
        date: isUndefined(date)
          ? null
          : moment(date).format('YYYY-MM-DD'),
      },
    }).then(() => {
      this.setState({ startOrEnd: false });
      this.fetchLineCloseShift(value);
      this.clearData();
    });
  }

  /**
   * @description: 查询产品节拍
   * @param {Object} values FORM表单
   * @param {Object} res 查询班次返回值，主要是实际开结班时间
   */
  @Bind()
  fetchProductBeat(values, res) {
    const { dispatch, teamWorkbench: { defaultSite = {} } } = this.props;
    this.setState({ startOrEnd: true });
    dispatch({
      type: 'teamWorkbench/fetchProductBeat',
      payload: {
        siteId: defaultSite.siteId,
        lineWorkcellId: values.lineWorkcellId,
        shiftCode: values.shiftCode,
        shiftActualEndTime: res.shiftActualEndTime,
        shiftActualStartTime: res.shiftActualStartTime,
        wkcShiftId: res.wkcShiftId,
        shiftDate: isUndefined(values.date)
          ? null
          : moment(values.date).format('YYYY-MM-DD'),
      },
    }).then(() => {
      this.setState({ startOrEnd: false });
    });
  }

  /**
   * @description: 查询产品节拍
   * @param {Object} values FORM表单
   * @param {Object} res 查询班次返回值，主要是实际开结班时间
   */
  @Bind()
  fetchOperationQuality(values, res) {
    const { dispatch, teamWorkbench: { defaultSite = {} } } = this.props;
    this.setState({ startOrEnd: true });
    dispatch({
      type: 'teamWorkbench/fetchOperationQuality',
      payload: {
        siteId: defaultSite.siteId,
        lineWorkcellId: values.lineWorkcellId,
        shiftCode: values.shiftCode,
        shiftActualEndTime: res.shiftActualEndTime,
        shiftActualStartTime: res.shiftActualStartTime,
        wkcShiftId: res.wkcShiftId,
        shiftDate: isUndefined(values.date)
          ? null
          : moment(values.date).format('YYYY-MM-DD'),
      },
    }).then(() => {
      this.setState({ startOrEnd: false });
    });
  }

  // 查询异常
  @Bind()
  fetchOtherException(values, res, fields = {}) {
    const { dispatch, teamWorkbench: { defaultSite = {} } } = this.props;
    this.setState({ startOrEnd: true });
    dispatch({
      type: 'teamWorkbench/fetchOtherException',
      payload: {
        siteId: defaultSite.siteId,
        lineWorkcellId: values.lineWorkcellId,
        shiftCode: values.shiftCode,
        shiftActualEndTime: res.shiftActualEndTime,
        shiftActualStartTime: res.shiftActualStartTime,
        wkcShiftId: res.wkcShiftId,
        shiftDate: isUndefined(values.date)
          ? null
          : moment(values.date).format('YYYY-MM-DD'),
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(() => {
      this.setState({ startOrEnd: false });
    });
  }

  // 查询设备
  @Bind()
  fetchEquipmentManage(values, res) {
    const { dispatch, teamWorkbench: { defaultSite = {} } } = this.props;
    this.setState({ startOrEnd: true });
    dispatch({
      type: 'teamWorkbench/fetchEquipmentManage',
      payload: {
        siteId: defaultSite.siteId,
        lineWorkcellId: values.lineWorkcellId,
        shiftCode: values.shiftCode,
        shiftActualEndTime: res.shiftActualEndTime,
        shiftActualStartTime: res.shiftActualStartTime,
        wkcShiftId: res.wkcShiftId,
        shiftDate: isUndefined(values.date)
          ? null
          : moment(values.date).format('YYYY-MM-DD'),
      },
    }).then(() => {
      this.setState({ startOrEnd: false });
    });
  }

  // 人员安全
  @Bind()
  fetchEmployeeSecurity(values) {
    const { dispatch, teamWorkbench: { defaultSite = {} } } = this.props;
    this.setState({ startOrEnd: true });
    dispatch({
      type: 'teamWorkbench/fetchEmployeeSecurity',
      payload: {
        siteId: defaultSite.siteId,
        lineWorkcellId: values.lineWorkcellId,
      },
    }).then(() => {
      this.setState({ startOrEnd: false });
    });
  }



  /**
   * @description: 查询当前工段未结班班次
   * @param {type} lineWorkcellId 工段ID
   */
  @Bind()
  fetchLineCloseShift(lineWorkcellId) {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'teamWorkbench/fetchLineCloseShift',
      payload: {
        lineWorkcellId,
      },
    });
  }

  /**
   * @description: 开班
   */
  @Bind()
  startClass() {
    const { dispatch, teamWorkbench: { shiftList = [] } } = this.props;
    const fieldsValue = (this.openEndform && filterNullValueObject(this.openEndform.getFieldsValue())) || {};
    const newArray = shiftList.filter(item => {
      return item.shiftCode === fieldsValue.shiftCode;
    });
    this.setState({ startOrEnd: true });
    dispatch({
      type: 'teamWorkbench/startClass',
      payload: {
        ...fieldsValue,
        ...newArray[0],
      },
    }).then(res => {
      if (res) {
        this.fetchSectionAndShift(fieldsValue);
      }
      this.setState({ startOrEnd: false });
    });
  }

  /**
   * @description: 结班
   */
  @Bind()
  stopClasConfirm() {
    const { teamWorkbench: { shiftList = [] } } = this.props;
    const fieldsValue = (this.openEndform && filterNullValueObject(this.openEndform.getFieldsValue())) || {};
    const newArray = shiftList.filter(item => {
      return item.shiftCode === fieldsValue.shiftCode;
    });
    const nowTime = Date.parse(new Date());
    const shiftEndTime = new Date(newArray[0].shiftEndTime).getTime();

    Modal.confirm({
      title: '结班提醒',
      content: (
        <div>
          <div>当前系统时间：<span style={{ color: '#f5222d' }}>{moment().format('YYYY-MM-DD HH:mm:ss')}</span></div>
          <div>距标准结班时间剩余：<span style={{ color: '#f5222d' }}>{Math.floor((shiftEndTime - nowTime > 0 ? shiftEndTime - nowTime : 0) / 1000 / 60 / 60)}</span>h</div>
        </div>
      ),
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => this.stopClass(),
      onCancel() { },
    });
  }

  @Bind
  stopClass() {
    const { dispatch, teamWorkbench: { shiftList = [], openEndShift = {} } } = this.props;
    const fieldsValue = (this.openEndform && filterNullValueObject(this.openEndform.getFieldsValue())) || {};
    const newArray = shiftList.filter(item => {
      return item.shiftCode === fieldsValue.shiftCode;
    });
    this.setState({ startOrEnd: true });
    dispatch({
      type: 'teamWorkbench/stopClass',
      payload: {
        ...fieldsValue,
        ...newArray[0],
        wkcShiftId: openEndShift.wkcShiftId,
      },
    }).then(res => {
      if (res) {
        this.fetchSectionAndShift(fieldsValue);
      }
      this.setState({ startOrEnd: false });
    });
  }

  @Bind()
  handleBindOpenEndRef(ref = {}) {
    this.openEndform = (ref.props || {}).form;
  }

  @Bind()
  handleHandoverMatterRef(ref = {}) {
    this.HandoverMatterForm = (ref.props || {}).form;
  }

  // 保存交接注意事项
  @Bind()
  saveHandoverMatter() {
    const {
      dispatch,
      teamWorkbench: {
        openEndShift = {},
      },
    } = this.props;
    if (openEndShift.shiftActualStartTime) {
      const fieldsValue = (this.HandoverMatterForm && filterNullValueObject(this.HandoverMatterForm.getFieldsValue())) || {};
      dispatch({
        type: 'teamWorkbench/saveHandoverMatter',
        payload: {
          ...fieldsValue,
          wkcShiftId: openEndShift.wkcShiftId,
        },
      }).then(res => {
        if (res) {
          this.setState({ handoverBut: true });
          notification.success();
          this.fetchHandoverMatter();
        }
      });
    } else {
      notification.error({ message: '当前班次未开班！' });
    }

  }

  // 查询注意事项
  @Bind()
  fetchHandoverMatter() {
    const {
      dispatch,
      teamWorkbench: {
        openEndShift = {},
      },
    } = this.props;
    dispatch({
      type: 'teamWorkbench/fetchHandoverMatter',
      payload: {
        wkcShiftId: openEndShift.wkcShiftId,
      },
    });
  }

  // 选中未结班班次查询
  @Bind()
  resetShift(val) {
    const {
      dispatch,
      teamWorkbench: {
        defaultSite = {},
      },
    } = this.props;
    const fieldsValue = (this.openEndform && filterNullValueObject(this.openEndform.getFieldsValue())) || {};
    if (val.shiftCode) {
      this.openEndform.setFieldsValue({
        date: moment(val.shiftDate, 'YYYY-MM-DD HH:mm:ss'),
        shiftCode: val.shiftCode,
      });
      // 先更新班次列表用来做对比
      dispatch({
        type: 'teamWorkbench/fetchShiftList',
        payload: {
          siteId: defaultSite.siteId,
          lineWorkcellId: fieldsValue.lineWorkcellId,
          date: isUndefined(val.shiftDate)
            ? null
            : moment(val.shiftDate).format('YYYY-MM-DD'),
        },
      }).then(res => {
        if (res) {
          this.fetchSectionAndShift(val);
        }
      });
    }
  }

  render() {
    const columns = [
      {
        title: '异常',
        dataIndex: 'exceptionName',
        width: 60,
        align: 'center',
      },
      {
        title: '类型',
        dataIndex: 'exceptionTypeMeaning',
        width: 40,
        align: 'center',
      },
      {
        title: '触发',
        dataIndex: 'creationDate',
        width: 80,
        align: 'center',
      },
      {
        title: '响应',
        dataIndex: 'respondTime',
        width: 80,
        align: 'center',
      },
      {
        title: '关闭',
        dataIndex: 'closeTime',
        width: 80,
        align: 'center',
      },
    ];
    const {
      teamWorkbench: {
        lineList = [],
        shiftList = [],
        openEndShift = {},
        lineShift = {},
        completionStatistics = [],
        completionStatisticsPagination = {},
        shiftInfo = {},
        productBeat = {},
        handoverMatter = {},
        defaultSite = {},
        operationQuality = {},
        otherException = [],
        otherExceptionPagination = {},
        equipmentManage = {},
        employeeSecurity = [],
      },
      loading,
    } = this.props;
    const { startOrEnd, handoverBut } = this.state;
    const fieldsValue = (this.openEndform && filterNullValueObject(this.openEndform.getFieldsValue())) || {};
    return (
      <Fragment>
        <Header title="班组工作台" />
        <Content style={{ padding: '0px', backgroundColor: 'transparent' }}>
          <Spin spinning={startOrEnd}>
            <Row>
              <Col span={8} className={styles.teamWorkbenchLeft}>
                <SectionAndShift
                  onSearch={this.fetchSectionAndShift}
                  onRollback={this.handleRollback}
                  startClass={this.startClass}
                  stopClass={this.stopClasConfirm}
                  fetchShiftList={this.fetchShiftList}
                  onSelectShift={this.fetchSectionAndShift}
                  onRef={this.handleBindOpenEndRef}
                  resetShift={this.resetShift}
                  lineList={lineList}
                  shiftList={shiftList}
                  openEndShift={openEndShift}
                  lineShift={lineShift}
                  loading={loading}
                />
                <TeamInformation
                  shiftInfo={shiftInfo}
                  groupLeaderList={this.state.groupLeaderList}
                />
              </Col>
              <Col span={8} className={styles.teamWorkbenchMid}>
                <MidInfo
                  dataSource={completionStatistics}
                  pagination={completionStatisticsPagination}
                  productBeat={productBeat}
                  handoverMatter={handoverMatter}
                  openEndShift={openEndShift}
                  fieldsValue={fieldsValue}
                  defaultSite={defaultSite}
                  handoverBut={handoverBut}
                  saveHandoverMatter={this.saveHandoverMatter}
                  onRef={this.handleHandoverMatterRef}
                />
              </Col>
              <Col span={8} className={styles.teamWorkbenchRight}>
                <div className={styles.teamWorkbenchRightSafety}>
                  <Safety employeeSecurity={employeeSecurity} />
                </div>
                <div className={styles.teamWorkbenchRightQuality}>
                  <Quality
                    operationQuality={operationQuality}
                  />
                </div>
                <div className={styles.teamWorkbenchRightEquipment}>
                  <Equipment
                    equipmentManage={equipmentManage}
                  />
                </div>
                <Row className={styles.teamWorkbenchRightOtherException}>
                  <div className={styles.title}>
                    <div className={styles.colorDiv} />
                    <span>其他异常</span>
                  </div>
                  <Scrollbars style={{ height: '187px' }}>
                    <div style={{ width: '800px' }}>
                      <Table
                        columns={columns}
                        scroll={{ x: tableScrollWidth(columns), y: 145 }}
                        rowKey="workOrderId"
                        bordered
                        dataSource={otherException}
                        pagination={otherExceptionPagination}
                        onChange={page => this.fetchOtherException(fieldsValue, openEndShift, page)}
                        style={{ marginTop: '4px' }}
                      />
                    </div>
                  </Scrollbars>
                </Row>
              </Col>
            </Row>
          </Spin>
        </Content>
      </Fragment>
    );
  }
}
