/**
 * userRights - 用户权限维护
 * @date: 2019-7-31
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Button } from 'hzero-ui';
// import {isUndefined} from 'lodash';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
// import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 用户权限维护
 * @extends {Component} - React.Component
 * @reactProps {Object} userRights - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ userRights, loading }) => ({
  userRights,
  fetchLoading: loading.effects['userRights/fetchUserRightsList'],
}))
@formatterCollections({ code: 'tarzan.mes.userRights' })
export default class UserRights extends React.Component {
  listTable;

  queryForm;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userRights/init',
    });
    dispatch({
      type: 'userRights/fetchUserRightsList',
    });
    dispatch({
      type: 'userRights/fetchOrganizationTypeList',
      payload: {
        module: 'PERMISSION',
        typeGroup: 'USER_ORGANIZATION_TYPE',
      },
    });
  }

  /**
   * 查询数据
   * @param {object} page 页面基本信息数据
   */
  @Bind()
  fetchQueryList(pagination = {}) {
    this.queryForm.fetchQueryList(pagination);
  }

  /**
   *
   * @param {object} ref - listTable子组件对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.listTable = ref;
  }

  /**
   *
   * @param {object} ref - FilterForm子组件对象
   */
  @Bind()
  handleBindQueryRef(ref = {}) {
    this.queryForm = ref;
  }

  @Bind
  handleCreate() {
    this.listTable.handleUserRightsDrawerShow();
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.mes.userRights.title.list').d('用户权限维护')}>
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              this.handleCreate();
            }}
          >
            {intl.get('tarzan.mes.userRights.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <FilterForm onRef={this.handleBindQueryRef} />
          <ListTable onRef={this.handleBindRef} onSearch={this.fetchQueryList} />
        </Content>
      </React.Fragment>
    );
  }
}
