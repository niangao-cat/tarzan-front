/**
 * assemblyList - 装配清单维护
 * @date: 2019-7-22
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Table, Badge } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import cacheComponent from 'components/CacheComponent';
import { Header, Content } from 'components/Page';

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import FilterForm from './FilterForm';

/**
 * 使用 Form.Item 组件
 */
const modelPrompt = 'tarzan.product.bom.model.bom';

/**
 * 装配清单维护
 * @extends {Component} - React.Component
 * @reactProps {Object} [location={}] - 当前路由信息
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} assemblyList - 数据源
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(({ assemblyList, loading }) => ({
  assemblyList,
  currentTenantId: getCurrentOrganizationId(),
  fetchBomLoading: loading.effects['assemblyList/fetchQueryBomList'],
}))
@formatterCollections({ code: 'tarzan.product.bom' })
@Form.create({ fieldNameProp: null })
@cacheComponent({ cacheKey: '/product/assembly-list' })
export default class AssemblyList extends React.Component {
  componentDidMount() {
    const {
      dispatch,
      assemblyList: { queryFormFieldsValue = {}, queryFormPagination = {} },
    } = this.props;
    dispatch({
      type: 'assemblyList/fetchQueryBomList',
      payload: {
        ...queryFormFieldsValue,
        page: queryFormPagination,
      },
    });
  }

  /**
   * 页面跳转到装配清单明细维护页面
   * @param {object} record 行数据
   */
  @Bind()
  showAssemblyDist(record = {}) {
    const { history } = this.props;
    history.push(`/product/assembly-list/dist/${record.bomId}`);
  }

  /**
   *新建装配清单页面
   * @param {object} record 行数据
   */
  @Bind()
  createAssembly() {
    const { history } = this.props;
    history.push(`/product/assembly-list/dist/create`);
  }

  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagenation) {
    this.formRef.fetchQueryList(pagenation);
  }

  @Bind()
  formRefBind(ref) {
    this.formRef = ref;
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      assemblyList: { bomList = [], bomPagination = {} },
      fetchBomLoading,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.bomName`).d('编码'),
        width: 140,
        dataIndex: 'bomName',
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.showAssemblyDist(record);
              }}
            >
              {val}
            </a>
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('描述'),
        dataIndex: 'description',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.revision`).d('版本'),
        dataIndex: 'revision',
        width: 80,
      },
      {
        title: intl.get(`${modelPrompt}.bomType`).d('类型'),
        dataIndex: 'bomTypeDesc',
        width: 80,
      },
      {
        title: intl.get(`${modelPrompt}.bomStatus`).d('状态'),
        dataIndex: 'bomStatusDesc',
        width: 80,
      },
      {
        title: intl.get(`${modelPrompt}.currentFlag`).d('当前版本'),
        dataIndex: 'currentFlag',
        width: 80,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.currentFlag === 'Y' ? 'success' : 'error'}
            text={
              record.currentFlag === 'Y'
                ? intl.get(`${modelPrompt}.yes`).d('是')
                : intl.get(`${modelPrompt}.no`).d('否')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.dateFrom`).d('生效时间'),
        dataIndex: 'dateFrom',
        width: 200,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.dateTo`).d('失效时间'),
        dataIndex: 'dateTo',
        width: 200,
        align: 'center',
      },
    ];

    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.product.bom.title.bom').d('装配清单维护')}>
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              this.createAssembly();
            }}
          >
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <FilterForm onRef={this.formRefBind} />
          <Table
            loading={fetchBomLoading}
            rowKey="bomId"
            dataSource={bomList}
            columns={columns}
            pagination={bomPagination || {}}
            onChange={this.handleTableChange}
            bordered
          />
        </Content>
      </React.Fragment>
    );
  }
}
