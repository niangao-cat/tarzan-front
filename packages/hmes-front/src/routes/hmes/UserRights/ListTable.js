/**
 * ListTable - 表格
 * @date: 2019-8-6
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.2
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Table, Badge } from 'hzero-ui';
// import {isUndefined} from 'lodash';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
// import notification from 'utils/notification';
import UserRightsDrawer from './UserRightsDrawer';
import RightsAssignmenDrawer from './RightsAssignmenDrawer';

const modelPrompt = 'tarzan.mes.userRights.model.userRights';
/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 表格
 * @extends {Component} - React.Component
 * @reactProps {Object} userRights - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ userRights, loading }) => ({
  userRights,
  queryloading: loading.effects['userRights/fetchDocPrivilegeList'],
  fetchLoading: loading.effects['userRights/fetchUserRightsList'],
}))
export default class ListTable extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  state = {
    initUserRightsData: {},
    userRightsDrawerVisible: false,
    initDocPrivilegeData: {},
    tableDrawerVisible: false,
  };

  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagination) {
    const {
      onSearch,
      // userRights: { userRightsPagination = {} },
    } = this.props;
    onSearch(pagination);
  }

  // 打开编辑抽屉
  @Bind
  handleUserRightsDrawerShow(record = {}) {
    this.setState({ userRightsDrawerVisible: true, initUserRightsData: record });
  }

  // 关闭编辑抽屉
  @Bind
  handleUserRightsDrawerCancel() {
    this.setState({ userRightsDrawerVisible: false, initUserRightsData: {} });
  }

  // 编辑抽屉确认
  @Bind
  handleUserRightsDrawerOk() {
    const that = this;
    const {
      onSearch,
      userRights: { userRightsPagination = {} },
    } = this.props;
    onSearch(userRightsPagination);
    that.setState({
      userRightsDrawerVisible: false,
      initUserRightsData: {},
    });
  }

  // 打开对象类型抽屉
  @Bind
  handleDocPrivilegeDrawerShow(record = {}) {
    const { dispatch } = this.props;
    dispatch({
      type: 'userRights/fetchDocPrivilegeList',
      payload: {
        userOrganizationId: record.userOrganizationId,
      },
    });
    this.setState({ tableDrawerVisible: true, initDocPrivilegeData: record });
  }

  // 关闭对象类型抽屉
  @Bind
  handleDocPrivilegeDrawerCancel() {
    this.setState({ tableDrawerVisible: false, initDocPrivilegeData: {} });
  }


  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      userRights: { userRightsList = [], userRightsPagination = {}, organizationTypeList = [] },
      fetchLoading,
    } = this.props;
    const { userRightsDrawerVisible, initUserRightsData, tableDrawerVisible, initDocPrivilegeData } = this.state;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.userName`).d('员工账号'),
        width: 100,
        dataIndex: 'userName',
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.handleUserRightsDrawerShow(record);
              }}
            >
              {val}
            </a>
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.userDesc`).d('员工姓名'),
        width: 100,
        dataIndex: 'userDesc',
      },
      {
        title: intl.get(`${modelPrompt}.organizationType`).d('组织层级'),
        dataIndex: 'organizationType',
        width: 200,
        render: val => (
          <Fragment>
            {organizationTypeList instanceof Array && organizationTypeList.length !== 0
              ? (organizationTypeList.filter(item => item.typeCode === val)[0] || {}).description
              : ''}
          </Fragment>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.organizationCode`).d('组织对象'),
        dataIndex: 'organizationCode',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.organizationDesc`).d('组织描述'),
        dataIndex: 'organizationDesc',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.defaultOrganizationFlag`).d('默认状态'),
        dataIndex: 'defaultOrganizationFlag',
        width: 100,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.defaultOrganizationFlag === 'Y' ? 'success' : 'error'}
            text={
              record.defaultOrganizationFlag === 'Y'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 100,
        align: 'center',
        render: (val, record) => (
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
      {
        title: intl.get(`${modelPrompt}.operator`).d('权限分配'),
        dataIndex: 'operator',
        width: 200,
        align: 'center',
        render: (val, record) => (
          <span className="action-link">
            { record.organizationType === 'LOCATOR' && record.enableFlag === 'Y' && record.locatorCategory === 'AREA'
             ? (
               <a
                 onClick={() => {
                    this.handleDocPrivilegeDrawerShow(record);
                  }}
               >
                 {intl.get(`${modelPrompt}.operatorRow`).d('权限分配')}
               </a>
)
              : ''}
          </span>
        ),
      },
    ];
    // 抽屉参数
    const userRightsDrawerProps = {
      visible: userRightsDrawerVisible,
      onCancel: this.handleUserRightsDrawerCancel,
      onOk: this.handleUserRightsDrawerOk,
      initData: initUserRightsData,
      organizationTypeList,
    };
    // 对象类型抽屉参数
    const docPrivilegeDrawerProps = {
      visible: tableDrawerVisible,
      onCancel: this.handleDocPrivilegeDrawerCancel,
      onOk: this.handleDocPrivilegeDrawerCancel,
      initData: initDocPrivilegeData,
    };
    return (
      <React.Fragment>
        <Table
          loading={fetchLoading}
          rowKey="userRightsDescId"
          dataSource={userRightsList}
          columns={columns}
          pagination={userRightsPagination || {}}
          onChange={this.handleTableChange}
          bordered
        />
        <UserRightsDrawer {...userRightsDrawerProps} />
        <RightsAssignmenDrawer {...docPrivilegeDrawerProps} />
      </React.Fragment>
    );
  }
}
