/**
 * AreaList - 区域维护
 * @date: 2019-8-8
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Button } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import cacheComponent from 'components/CacheComponent';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

/**
 * 区域维护
 * @extends {Component} - React.Component
 * @reactProps {Object} [location={}] - 当前路由信息
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} areaList - 数据源
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(({ area, loading }) => ({
  area,
  currentTenantId: getCurrentOrganizationId(),
  loading: loading.effects['area/fetchAreaList'],
}))
@formatterCollections({ code: 'tarzan.org.area' })
@cacheComponent({ cacheKey: '/organization-modeling/area/list' })
export default class AreaList extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'area/fetchAreaList',
    });
  }

  @Bind()
  filterForm(ref = {}) {
    this.filterForm = (ref.props || {}).form;
  }

  /**
   * 页面跳转到企业明细维护页面
   * @param {object} record 行数据
   */
  @Bind()
  showAreaDist(record = {}) {
    const { history } = this.props;
    history.push(`/organization-modeling/area/dist/${record.areaId}`);
  }

  /**
   *新建企业页面
   * @param {object} record 行数据
   */
  @Bind()
  createArea() {
    const { history } = this.props;
    history.push(`/organization-modeling/area/dist/create`);
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.org.area.view.title.area').d('区域维护')}>
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              this.createArea();
            }}
          >
            {intl.get('tarzan.org.area.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <FilterForm onRef={this.filterForm} />
          <ListTable onEdit={this.showAreaDist} filterForm={this.filterForm} />
        </Content>
      </React.Fragment>
    );
  }
}
