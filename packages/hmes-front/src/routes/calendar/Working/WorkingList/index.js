/**
 * workingList - 工作日历
 * @date: 2019-12-3
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Badge, Table } from 'hzero-ui';
// import {isUndefined} from 'lodash';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
// import { changeTableRowEditState, getEditRecord, updateTableRowData } from '@/utils/utils';
// import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import { openTab } from 'utils/menuTab';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import FilterForm from './FilterForm';
import styles from './index.less';

/**
 * 使用 Form.Item 组件
 */
const modelPrompt = 'tarzan.calendar.working.model.working';
/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 工作日历
 * @extends {Component} - React.Component
 * @reactProps {Object} [location={}] - 当前路由信息
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} workingList - 数据源
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(({ working, loading }) => ({
  working,
  currentTenantId: getCurrentOrganizationId(),
  loading: loading.effects['working/fetchWorkingList'],
}))
@formatterCollections({ code: 'tarzan.calendar.working' })
@Form.create({ fieldNameProp: null })
export default class WorkingList extends React.Component {
  componentDidMount() {
    const {
      dispatch,
      working: { workingPagination = {} },
    } = this.props;
    dispatch({
      type: 'working/fetchWorkingList',
      payload: {
        page: {
          ...workingPagination,
        },
      },
    });
    dispatch({
      type: 'working/fetchWorkingTypeList',
      payload: {
        module: 'CALENDAR',
        typeGroup: 'CALENDAR_TYPE',
      },
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'working/updateState',
      payload: {
        displayList: {},
      },
    });
  }

  /**
   * 页面跳转到日历班次维护页面
   * @param {object} record 行数据
   */
  @Bind()
  showWorkingDist(record = {}) {
    const { history } = this.props;
    history.push(`/hmes/calendar/working/calendar-shift/${record.calendarId}`);
  }

  /**
   * 页面跳转到组织所属日历页面
   */
  @Bind()
  showCalendarOrganization() {
    openTab({
      title: intl.get('tarzan.calendar.working.button.organization').d('组织所属日历'),
      key: '/hmes/calendar/organization',
      path: '/hmes/calendar/organization',
      closable: true,
    });
  }

  /**
   * 页面跳转到班次列表页面
   */
  @Bind()
  showShiftList() {
    const { history, dispatch } = this.props;
    dispatch({
      type: 'working/updateState',
      payload: {
        initWorkShiftData: this.state.selectedRows,
      },
    });
    history.push(`/hmes/calendar/working/shift-list`);
  }

  /**
   * 新建工作日历
   */
  @Bind()
  handleCreateWorking() {
    const { history, dispatch } = this.props;
    dispatch({
      type: 'working/updateState',
      payload: {
        shiftList: [],
      },
    });
    history.push(`/hmes/calendar/working/calendar-shift/create`);
  }

  // 保存工作日历
  @Bind
  handleSaveWorking(record, index) {
    const {
      dispatch,
      working: { workingList = [] },
    } = this.props;
    record.$form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'working/saveWorking',
          payload: {
            ...fieldsValue,
            enableFlag: fieldsValue.enableFlag ? 'Y' : 'N',
            calendarId: record.calendarId === '' ? null : record.calendarId,
          },
        }).then(res => {
          if (res && res.success) {
            workingList[index].calendarId = res.rows.calendarId;
            workingList[index]._status = '';
            workingList[index].calendarCode = fieldsValue.calendarCode;
            workingList[index].calendarType = fieldsValue.calendarType;
            workingList[index].calendarTypeDesc = res.rows.calendarTypeDesc;
            workingList[index].description = fieldsValue.description;
            workingList[index].enableFlag = res.rows.enableFlag;
            dispatch({
              type: 'working/updateState',
              payload: {
                workingList,
              },
            });
            notification.success();
          } else {
            notification.error({
              message: res.message,
            });
          }
        });
      }
    });
  }

  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagination) {
    this.queryForm.fetchQueryList(pagination);
  }

  /**
   *
   * @param {object} ref - FilterForm子组件对象
   */
  @Bind()
  handleBindQueryRef(ref = {}) {
    this.queryForm = ref;
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      working: { workingList = [], workingPagination = {}, calendarTypeList = [] },
      loading,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.calendarCode`).d('日历编码'),
        width: 150,
        dataIndex: 'calendarCode',
        render: (val, record) => <a onClick={() => this.showWorkingDist(record)}>{val}</a>,
      },
      {
        title: intl.get(`${modelPrompt}.calendarType`).d('日历类型'),
        dataIndex: 'calendarType',
        width: 200,
        align: 'center',
        render: val => (
          <>
            {calendarTypeList instanceof Array && calendarTypeList.length !== 0
              ? (calendarTypeList.filter(item => item.typeCode === val)[0] || {}).description
              : ''}
          </>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('日历描述'),
        dataIndex: 'description',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 120,
        align: 'center',
        render: (_, record) => (
          <Badge
            status={record.enableFlag === 'Y' ? 'success' : 'error'}
            text={
              record.enableFlag === 'Y'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },
    ];

    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.calendar.working.title.list').d('工作日历')}>
          <Button
            type="primary"
            onClick={() => {
              this.handleCreateWorking();
            }}
            icon="plus"
          >
            {intl.get('tarzan.calendar.working.button.create').d('新建')}
          </Button>
          {/* <Button htmlType="submit" className={styles.primaryBtn} onClick={this.showShiftList}>
            {intl.get('tarzan.calendar.working.button.shiftList').d('班次列表')}
          </Button> */}
          <Button
            htmlType="submit"
            className={styles.primaryBtn}
            onClick={this.showCalendarOrganization}
          >
            {intl.get('tarzan.calendar.working.button.organization').d('组织所属日历')}
          </Button>
        </Header>
        <Content>
          <FilterForm onRef={this.handleBindQueryRef} />
          <Table
            loading={loading}
            rowKey="calendarId"
            dataSource={workingList}
            columns={columns}
            pagination={workingPagination || {}}
            onChange={this.handleTableChange}
            bordered
          />
        </Content>
      </React.Fragment>
    );
  }
}
