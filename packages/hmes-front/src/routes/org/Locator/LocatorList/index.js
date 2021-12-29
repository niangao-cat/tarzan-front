/**
 * locatorList - 库位维护
 * @date: 2019-8-16
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Table, Badge } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import cacheComponent from 'components/CacheComponent';
import { Header, Content } from 'components/Page';

import intl from 'utils/intl';
// import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import FilterForm from './FilterForm';

/**
 * 使用 Form.Item 组件
 */
const modelPrompt = 'tarzan.org.locator.model.locator';
/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 库位维护
 * @extends {Component} - React.Component
 * @reactProps {Object} [location={}] - 当前路由信息
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} locatorList - 数据源
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(({ locator, loading }) => ({
  locator,
  currentTenantId: getCurrentOrganizationId(),
  loading: loading.effects['locator/fetchLocatorList'],
}))
@formatterCollections({ code: 'tarzan.org.locator' })
@Form.create({ fieldNameProp: null })
@cacheComponent({ cacheKey: '/organization-modeling/locator/list' })
export default class LocatorList extends React.Component {
  queryForm;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'locator/fetchLocatorList',
    });
    dispatch({
      type: 'locator/fetchLocatorTypeList',
      payload: {
        module: 'MODELING',
        typeGroup: 'LOCATOR_TYPE',
      },
    });
    dispatch({
      type: 'locator/fetchLocatorCategoryList',
      payload: {
        module: 'MODELING',
        typeGroup: 'LOCATOR_CATEGORY',
      },
    });
  }

  /**
   * 页面跳转到库位明细维护页面
   * @param {object} record 行数据
   */
  @Bind()
  showLocatorDist(record = {}) {
    const { history } = this.props;
    history.push(`/organization-modeling/locator/dist/${record.locatorId}`);
  }

  /**
   *新建库位页面
   * @param {object} record 行数据
   */
  @Bind()
  createLocator() {
    const { history, dispatch } = this.props;
    dispatch({
      type: 'locator/updateState',
      payload: {
        displayList: {},
        planList: {},
        produceList: {},
        attrList: [],
      },
    });
    history.push(`/organization-modeling/locator/dist/create`);
  }

  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagination) {
    this.fetchQueryList(pagination);
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
      locator: {
        locatorList = [],
        locatorPagination = {},
        locatorCategoryList = [],
        locatorTypeList = [],
      },
      loading,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.locatorCode`).d('库位编码'),
        width: 100,
        dataIndex: 'locatorCode',
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.showLocatorDist(record);
              }}
            >
              {val}
            </a>
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.locatorName`).d('库位描述'),
        dataIndex: 'locatorName',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.locatorType`).d('库位类型'),
        dataIndex: 'locatorType',
        width: 100,
        render: val => (
          <Fragment>
            {locatorTypeList instanceof Array && locatorTypeList.length !== 0
              ? (locatorTypeList.filter(item => item.typeCode === val)[0] || {}).description
              : ''}
          </Fragment>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.locatorCategory`).d('库位类别'),
        dataIndex: 'locatorCategory',
        width: 100,
        align: 'center',
        render: val => (
          <Fragment>
            {locatorCategoryList instanceof Array && locatorCategoryList.length !== 0
              ? (locatorCategoryList.filter(item => item.typeCode === val)[0] || {}).description
              : ''}
          </Fragment>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.locatorGroupCode`).d('库位组'),
        dataIndex: 'locatorGroupCode',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.locatorLocation`).d('库位位置'),
        dataIndex: 'locatorLocation',
        width: 100,
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
        title: intl.get(`${modelPrompt}.negativeFlag`).d('是否允许负库存'),
        dataIndex: 'negativeFlag',
        width: 100,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.negativeFlag === 'Y' ? 'success' : 'error'}
            text={
              record.negativeFlag === 'Y'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },
    ];

    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.org.locator.title.list').d('库位维护')}>
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              this.createLocator();
            }}
          >
            {intl.get('tarzan.org.locator.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <FilterForm onRef={this.handleBindQueryRef} />
          <Table
            loading={loading}
            rowKey="locatorId"
            dataSource={locatorList}
            columns={columns}
            pagination={locatorPagination || {}}
            onChange={this.handleTableChange}
            bordered
          />
        </Content>
      </React.Fragment>
    );
  }
}
