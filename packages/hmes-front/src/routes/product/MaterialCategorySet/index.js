/**
 * materialCategorySet - 物料类别集维护
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
import formatterCollections from 'utils/intl/formatterCollections';
// import notification from 'utils/notification';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 物料类别集维护
 * @extends {Component} - React.Component
 * @reactProps {Object} materialCategorySet - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ materialCategorySet, loading }) => ({
  materialCategorySet,
  fetchLoading: loading.effects['materialCategorySet/fetchMaterialCategorySetList'],
}))
@formatterCollections({ code: 'tarzan.product.maSet' })
export default class MaterialCategorySet extends React.Component {
  listTable;

  queryForm;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'materialCategorySet/fetchMaterialCategorySetList',
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

  // 新增
  @Bind
  handleCreate() {
    this.listTable.handleMaterialCategorySetDrawerShow();
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.product.maSet.title.list').d('物料类别集维护')}>
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              this.handleCreate();
            }}
          >
            {intl.get('tarzan.product.maSet.button.create').d('新建')}
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
