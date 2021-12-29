/**
 * siteList - 站点维护
 * @date: 2019-8-7
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Table, Badge } from 'hzero-ui';
// import {isUndefined} from 'lodash';
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
const modelPrompt = 'tarzan.org.site.model.site';
/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 站点维护
 * @extends {Component} - React.Component
 * @reactProps {Object} [location={}] - 当前路由信息
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} siteList - 数据源
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(({ site, loading }) => ({
  site,
  currentTenantId: getCurrentOrganizationId(),
  loading: loading.effects['site/fetchSiteList'],
}))
@formatterCollections({ code: 'tarzan.org.site' })
@Form.create({ fieldNameProp: null })
@cacheComponent({ cacheKey: '/organization-modeling/site/list' })
export default class SiteList extends React.Component {
  queryForm;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'site/fetchSiteList',
    });
    dispatch({
      type: 'site/fetchSiteTypeList',
      payload: {
        module: 'MODELING',
        typeGroup: 'ORGANIZATION_REL_TYPE',
      },
    });
  }

  /**
   * 页面跳转到站点明细维护页面
   * @param {object} record 行数据
   */
  @Bind()
  showSiteDist(record = {}) {
    const { history } = this.props;
    history.push(`/organization-modeling/site/dist/${record.siteId}`);
  }

  /**
   *新建站点页面
   * @param {object} record 行数据
   */
  @Bind()
  createSite() {
    const { history, dispatch } = this.props;
    dispatch({
      type: 'site/updateState',
      payload: {
        displayList: {},
        planList: {},
        produceList: {},
        attrList: [],
      },
    });
    history.push(`/organization-modeling/site/dist/create`);
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
      site: { siteList = [], sitePagination = {}, siteTypeList = [] },
      loading,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.siteCode`).d('站点编码'),
        width: 100,
        dataIndex: 'siteCode',
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.showSiteDist(record);
              }}
            >
              {val}
            </a>
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.siteName`).d('站点描述'),
        dataIndex: 'siteName',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.siteType`).d('站点类型'),
        dataIndex: 'siteType',
        width: 100,
        align: 'center',
        render: val => (
          <Fragment>
            {siteTypeList instanceof Array && siteTypeList.length !== 0
              ? (siteTypeList.filter(item => item.typeCode === val)[0] || {}).description
              : ''}
          </Fragment>
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
    ];

    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.org.site.title.list').d('站点维护')}>
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              this.createSite();
            }}
          >
            {intl.get('tarzan.org.site.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <FilterForm onRef={this.handleBindQueryRef} />
          <Table
            loading={loading}
            rowKey="siteId"
            dataSource={siteList}
            columns={columns}
            pagination={sitePagination || {}}
            onChange={this.handleTableChange}
            bordered
          />
        </Content>
      </React.Fragment>
    );
  }
}
