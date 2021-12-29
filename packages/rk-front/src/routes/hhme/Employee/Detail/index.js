/**
 * Detail - 员工定义/员工信息明细
 * @date: 2018-7-30
 * @author: WH <heng.wei@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { Component, Fragment } from 'react';
import { Form, Spin, Tabs, Button } from 'hzero-ui';
import { connect } from 'dva';
import { includes, isEmpty, isUndefined } from 'lodash';
import { Bind } from 'lodash-decorators';
import { Content, Header } from 'components/Page';
import notification from 'utils/notification';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, addItemToPagination, getEditTableData, delItemToPagination } from 'utils/utils';

import DataForm from './DataForm';
import QualityList from './QualityList';


@connect(({ employee, loading }) => ({
  employee,
  positionLoading: loading.effects['employee/fetchPosition'],
  userLoading: loading.effects['employee/fetchUser'],
  saveLoading: loading.effects['employee/saveData'],
  deleteUserLoading: loading.effects['employee/deleteUser'],
  searchDetailLoading: loading.effects['employee/fetchDetail'],
  searchUserLoading: loading.effects['employee/searchUser'],
  searchPositionLoading: loading.effects['employee/searchPosition'],
  updateUserLoading: loading.effects['employee/updateUser'],
  fetchQualityListLoading: loading.effects['employee/fetchQualityList'],
  onDeleteQualityLoading: loading.effects['employee/onDeleteQuality'],
  tenantId: getCurrentOrganizationId(),
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({ code: ['hpfm.employee', 'entity.employee', 'entity.user'] })
export default class Detail extends Component {
  /**
   * state初始化
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      selectedPositionKeys: [], // 选中已分配岗位标识
      selectedUserKeys: [], // 选中已分配用户标识
      availableUserKeys: [], // 选中可分配用户标识
      selectedQualityKeys: [], // 选中资质数据
      selectedQuality: [],
      positionVisible: false,
      userVisible: false,
    };
  }

  /**
   * componentDidMount
   * render调用后获取展示数据
   */
  componentDidMount() {
    const { dispatch, tenantId, match } = this.props;
    // todo 是否需要优化, 查询值集
    dispatch({
      type: 'employee/fetchEnum',
    });
    dispatch({
      type: 'employee/fetchDetail',
      payload: {
        tenantId,
        customizeUnitCode: 'HPFM.EMPLOYEE_DETAIL.HEADER',
        employeeId: match.params.employeeId,
      },
    });
    dispatch({
      type: 'employee/fetchPosition',
      payload: {
        tenantId,
        customizeUnitCode: 'HPFM.EMPLOYEE_DETAIL.POST_LINE',
        employeeId: match.params.employeeId,
      },
    });
    dispatch({
      type: 'employee/fetchUser',
      payload: {
        tenantId,
        customizeUnitCode: 'HPFM.EMPLOYEE_DETAIL.USER_LINE',
        employeeId: match.params.employeeId,
      },
    });
    // 查询资质
    this.fetchQualityList();
  }

  /**
   * 根据节点路径，在树形结构树中的替换对应节点
   * @param {Array} collections 树形结构树
   * @param {Array} cursorList 节点路径
   * @param {Array} data - 节点信息
   * @returns {Array} 新的树形结构
   */
  findAndSetNodeProps(collections, cursorList = [], data) {
    let newCursorList = cursorList;
    const cursor = newCursorList[0];

    return collections.map(n => {
      let m = n;
      if (m.typeWithId === cursor) {
        if (newCursorList[1]) {
          newCursorList = newCursorList.filter(o => newCursorList.indexOf(o) !== 0);
          m.children = m.children ? this.findAndSetNodeProps(m.children, newCursorList, data) : [];
        } else {
          m = data;
        }
      }
      return m;
    });
  }

  // 保存人员资质
  @Bind()
  handleSave() {
    const { employeeId } = this.props.match.params;
    const {
      dispatch,
      match,
      tenantId,
      employee: { qualityList = [] },
    } = this.props;
    const params = getEditTableData(qualityList, ['employeeAssignId']);
    const arr = [];
    params.forEach(item => {
      arr.push({
        ...item,
        tenantId,
        employeeId,
        materialId: item.materialId ? item.materialId : '',
        dateFrom: item.dateFrom && item.dateFrom.format('YYYY-MM-DD'),
        dateTo: item.dateTo && item.dateTo.format('YYYY-MM-DD'),
      });
    });
    if (Array.isArray(params) && params.length > 0) {
      dispatch({
        type: 'employee/saveQuality',
        payload: {
          arr,
          tenantId,
        },
      }).then(res => {
        if (res) {
          notification.success();
          dispatch({
            type: 'employee/fetchQualityList',
            payload: {
              tenantId,
              employeeId: match.params.employeeId,
            },
          });
        }
      });
    }
  }


  /**
   * 关闭岗位层次结构Model
   */
  @Bind()
  handlePositionModalCancel() {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/updateState',
      payload: {
        positions: [],
        expandedRowKeys: [],
      },
    });
    this.setState({ positionVisible: false });
  }

  /**
   * 岗位信息变更保存
   */
  @Bind()
  handlePositionModalOk() {
    const { dispatch, tenantId, match, employee } = this.props;
    const { employeeId } = match.params;
    const { positions = [], positionList = [] } = employee;
    // 获取所有assignFlag为1的岗位实体
    const newPositions = [];

    function findPosition(collections, emp, tenant) {
      collections.map(item => {
        if (item.type === 'P' && item.assignFlag === 1) {
          newPositions.push({
            employeeId: emp,
            tenantId: tenant,
            positionId: item.id,
            primaryPositionFlag: 0,
            unitId: item.unitId,
            enabledFlag: 1,
          });
        }
        if (item.children) {
          findPosition(item.children, emp, tenant);
        }
        return newPositions;
      });
      return newPositions;
    }

    findPosition(positions, employeeId, tenantId);
    let newPositionList = [];
    if (isEmpty(newPositions)) {
      newPositionList = [...newPositions];
    } else {
      // 主岗ID
      const primaryPositionId = (positionList.find(item => item.primaryPositionFlag === 1) || {})
        .positionId;
      // 如果主岗ID不存在时，更新主岗信息，默认第一个岗位为主岗
      if (isUndefined(primaryPositionId)) {
        newPositionList = newPositions.map((item, index) =>
          index === 0 ? { ...item, primaryPositionFlag: 1 } : item
        );
      } else {
        newPositionList = newPositions.map(item =>
          item.positionId === primaryPositionId ? { ...item, primaryPositionFlag: 1 } : item
        );
      }
    }
    dispatch({
      type: 'employee/updatePosition',
      payload: {
        tenantId,
        employeeId,
        positionList: newPositionList,
      },
    }).then(res => {
      if (res) {
        notification.success();
        dispatch({
          type: 'employee/fetchPosition',
          payload: {
            tenantId,
            customizeUnitCode: 'HPFM.EMPLOYEE_DETAIL.POST_LINE',
            employeeId: match.params.employeeId,
            positions: [],
            expandedRowKeys: [],
          },
        });
        this.setState({ positionVisible: false });
      }
    });
  }

  /**
   * 更新岗位层次结构
   * @param {Object} record - 岗位信息
   */
  @Bind()
  handleChangeTree(record) {
    const {
      dispatch,
      employee: { positions, pathMap },
    } = this.props;
    const newTree = this.findAndSetNodeProps(positions, pathMap[record.typeWithId], record);
    dispatch({
      type: 'employee/updateState',
      payload: {
        positions: newTree,
      },
    });
  }

  /**
   * 岗位Tree查询
   * @param {object} fields - 查询参数
   */
  @Bind()
  handlePositionModalSearch(fields = {}) {
    const { dispatch, tenantId, match } = this.props;
    dispatch({
      type: 'employee/searchPosition',
      payload: {
        tenantId,
        employeeId: match.params.employeeId,
        ...fields,
      },
    });
  }

  /**
   * 展开全部
   */
  @Bind()
  handleExpand() {
    const {
      dispatch,
      employee: { pathMap = {} },
    } = this.props;
    dispatch({
      type: 'employee/updateState',
      payload: {
        expandedRowKeys: Object.keys(pathMap),
      },
    });
  }

  /**
   * 收起全部
   */
  @Bind()
  handleShrink() {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/updateState',
      payload: { expandedRowKeys: [] },
    });
  }

  /**
   * 点击展开图标，展开行
   *  @param {Boolean} isExpand 展开标记
   *  @param {Object} record 岗位信息
   */
  @Bind()
  handleExpandSubLine(isExpand, record = {}) {
    const {
      dispatch,
      employee: { expandedRowKeys = [] },
    } = this.props;
    // isExpand ? 展开 : 收起
    const rowKeys = isExpand
      ? [...expandedRowKeys, record.typeWithId]
      : expandedRowKeys.filter(item => item !== record.typeWithId);
    dispatch({
      type: 'employee/updateState',
      payload: {
        expandedRowKeys: [...rowKeys],
      },
    });
  }

  /**
   * 维护主岗信息
   * @param {object} record - 岗位信息
   * @param {boolean} flag - 主岗标记
   */
  @Bind()
  handleEditPrimaryFlag(record = {}, flag) {
    const {
      dispatch,
      employee: { positionList = [] },
    } = this.props;
    let newPositionList = [];
    if (flag) {
      // 将岗位设定为主岗
      newPositionList = positionList.map(i =>
        i.positionId === record.positionId
          ? { ...i, primaryPositionFlag: 1 }
          : { ...i, primaryPositionFlag: 0 }
      );
    } else {
      // 取消岗位的主岗标记
      newPositionList = positionList.map(i =>
        i.positionId === record.positionId ? { ...i, primaryPositionFlag: 0 } : { ...i }
      );
    }
    dispatch({
      type: 'employee/updateState',
      payload: {
        positionList: newPositionList,
      },
    });
  }

  /**
   * 添加用户
   */
  @Bind()
  handleAddUser() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'employee/searchUser',
      payload: { tenantId },
    });
    this.setState({ userVisible: true });
  }

  /**
   * 已分配用户行选择操作
   * @param {array<string>} selectedRowKeys - 用户唯一标识列表
   */
  @Bind()
  handleSelectUser(selectedRowKeys) {
    this.setState({ selectedUserKeys: selectedRowKeys });
  }

  /**
   * 移除已分配的用户
   */
  @Bind()
  handleDeleteUser() {
    const { selectedUserKeys } = this.state;
    if (selectedUserKeys.length !== 0) {
      const {
        dispatch,
        tenantId,
        match,
        employee: { userList = [] },
      } = this.props;
      dispatch({
        type: 'employee/deleteUser',
        payload: {
          tenantId,
          data: userList.filter(item => includes(selectedUserKeys, item.employeeUserId)),
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.setState({ selectedUserKeys: [] });
          dispatch({
            type: 'employee/fetchUser',
            payload: {
              tenantId,
              customizeUnitCode: 'HPFM.EMPLOYEE_DETAIL.USER_LINE',
              employeeId: match.params.employeeId,
            },
          });
        }
      });
    }
  }

  /**
   * 取消按钮-分配用户Modal
   */
  @Bind()
  handleUserModalCancel() {
    this.setState({ userVisible: false, availableUserKeys: [] });
  }

  /**
   * 确认按钮-用户分配Modal
   * @prop {List<Object>} userList - 用户信息类表
   */
  @Bind()
  handleUserModalOk() {
    const { availableUserKeys } = this.state;
    if (availableUserKeys.length !== 0) {
      const {
        dispatch,
        tenantId,
        match,
        employee: { users },
      } = this.props;
      const userData = users.content
        .filter(i => includes(availableUserKeys, i.id))
        .map(item => ({
          ...item,
          tenantId,
          userId: item.id,
          employeeId: match.params.employeeId,
        }));
      dispatch({
        type: 'employee/updateUser',
        payload: {
          tenantId,
          data: userData,
        },
      }).then(res => {
        if (res) {
          notification.success();
          dispatch({
            type: 'employee/fetchUser',
            payload: {
              tenantId,
              customizeUnitCode: 'HPFM.EMPLOYEE_DETAIL.USER_LINE',
              employeeId: match.params.employeeId,
            },
          });
          this.setState({ userVisible: false, availableUserKeys: [] });
        }
      });
    }
  }

  /**
   * 可添加用户行选择
   * @param {array<string>} selectedRowKeys - 用户标识列表
   */
  @Bind()
  handleUserModalChange(selectedRowKeys) {
    this.setState({ availableUserKeys: selectedRowKeys });
  }

  /**
   * 数据查询-分配用户Modal
   * @param {object} fields - 查询参数
   */
  @Bind()
  handleUserModalSearch(fields = {}) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'employee/searchUser',
      payload: {
        tenantId,
        ...fields,
      },
    });
  }

  // 新增人员资质
  @Bind()
  onAdQuality() {
    const {
      dispatch,
      employee: { qualityList = [], qualityPagination = {} },
    } = this.props;
    dispatch({
      type: 'employee/updateState',
      payload: {
        qualityList: [
          {
            employeeAssignId: new Date().getTime(),
            _status: 'create', // 新建标记位
          },
          ...qualityList,
        ],
        qualityPagination: addItemToPagination(qualityList.length, qualityPagination),
      },
    });
  }

  // 删除资质
  @Bind()
  onDeleteQuality() {
    const { dispatch, tenantId } = this.props;
    const { employeeId } = this.props.match.params;
    const { selectedQuality } = this.state;
    const arr = [];
    selectedQuality.forEach(item => {
      arr.push({
        employeeAssignId: item.employeeAssignId,
        employeeId,
        tenantId,
      });
    });
    dispatch({
      type: 'employee/onDeleteQuality',
      payload: {
        arr,
        tenantId,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.setState({ selectedQualityKeys: [], selectedQuality: [] });
        this.fetchQualityList();
      }
    });
  }

  // 获取已分配的人员资质列表
  @Bind()
  fetchQualityList(fields = {}) {
    const { dispatch, tenantId } = this.props;
    const { employeeId } = this.props.match.params;
    dispatch({
      type: 'employee/fetchQualityList',
      payload: {
        tenantId,
        employeeId,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  // 选中已保存的数据
  @Bind()
  handleQualitySelect(selectedQualityKeys, selectedQuality) {
    this.setState({ selectedQualityKeys, selectedQuality });
  }

  /**
   * 编辑
   * 行数据切换编辑状态
   * @param {Object} record 操作对象
   * @param {Boolean} flag  编辑/取消标记
   */
  @Bind()
  handleEditLine(record = {}, flag) {
    const {
      dispatch,
      employee: { qualityList = [] },
    } = this.props;
    const newList = qualityList.map(item =>
      item.employeeAssignId === record.employeeAssignId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'employee/updateState',
      payload: {
        qualityList: newList,
      },
    });
  }

  // 取消编辑对象属性
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      employee: { qualityList = [], qualityPagination = {} },
    } = this.props;
    const newList = qualityList.filter(
      item => item.employeeAssignId !== record.employeeAssignId
    );
    dispatch({
      type: 'employee/updateState',
      payload: {
        qualityList: newList,
        pagination: delItemToPagination(qualityList.length, qualityPagination),
      },
    });
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { employeeId } = this.props.match.params;
    const {
      form,
      employee,
      saveLoading = false,
      searchDetailLoading = false,
      fetchQualityListLoading = false,
      onDeleteQualityLoading = false,
    } = this.props;
    const {
      employeeInfo = {},
      qualityList = [],
      qualityPagination = {},
      lov: { employeeStatus = [], proficiency = [] },
    } = employee;
    // 员工信息明细Props
    const detailProps = {
      form,
      employeeInfo,
      employeeStatus,
    };
    // 人员资质
    const qualityListProps = {
      dataSource: qualityList,
      employeeId,
      selectedQualityKeys: this.state.selectedQualityKeys,
      proficiency,
      loading: fetchQualityListLoading,
      delLoading: onDeleteQualityLoading,
      pagination: qualityPagination,
      onChange: this.handleQualitySelect,
      onDeleteQuality: this.onDeleteQuality,
      onAdQuality: this.onAdQuality,
      handleEditLine: this.handleEditLine,
      handleCleanLine: this.handleCleanLine,
      onSearch: this.fetchQualityList,
    };
    // const { FlexFieldsButton } = flexFieldsMiddleware;
    return (
      <Fragment>
        <Header
          title='员工制造属性维护明细'
          backPath="/hhme/hr/staff/list"
        >
          <Button
            icon="save"
            type="primary"
            onClick={this.handleSave}
            loading={saveLoading}
            disabled={searchDetailLoading}
          >
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
        </Header>
        <Content>
          <Spin spinning={searchDetailLoading}>
            <DataForm {...detailProps} />
          </Spin>
          <Tabs defaultActiveKey="1" animated={false}>
            <Tabs.TabPane
              tab='人员资质'
              key="1"
            >
              <QualityList {...qualityListProps} />
            </Tabs.TabPane>
          </Tabs>
        </Content>
      </Fragment>
    );
  }
}
