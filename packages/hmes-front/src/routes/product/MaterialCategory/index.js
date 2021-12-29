/**
 * materialCategory - 物料类别维护
 * @date: 2019-7-31
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Button } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import FilterForm from './FilterForm';
import ListTable from './ListTable';
import MaterialCategoryDrawer from './MaterialCategoryDrawer';

// const modelPrompt = 'tarzan.product.materialCategory.model.materialCategory';

/**
 * 物料类别维护
 * @extends {Component} - React.Component
 * @reactProps {Object} materialCategory - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ materialCategory, loading }) => ({
  materialCategory,
  fetchLoading: loading.effects['materialCategory/fetchMaterialCategoryList'],
}))
@formatterCollections({ code: 'tarzan.product.materialCategory' })
export default class MaterialCategory extends React.Component {
  state = {
    queryFromRecord: {},
  };

  @Bind
  materialRef(ref) {
    this.materialChild = ref;
  }

  /**
   * @param {object} ref - listTable子组件对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.listTable = ref;
  }

  @Bind()
  formRefBind(ref = {}) {
    this.formRef = ref;
  }

  @Bind()
  fetchQueryList(params) {
    this.formRef.fetchQueryList(params);
  }

  // 新增
  @Bind
  handleCreate(record) {
    this.materialChild.showDrawer(record);
  }

  @Bind()
  queryFormRecord(record) {
    this.setState({
      queryFromRecord: record,
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const queryFormProps = {
      queryFormRecord: this.queryFormRecord,
    };
    const listProps = {
      handleCreate: this.handleCreate,
      fetchQueryList: this.fetchQueryList,
    };

    // 抽屉参数
    const materialCategoryDrawerProps = {
      queryFromRecord: this.state.queryFromRecord,
      initData: {},
    };
    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.product.materialCategory.title.list').d('物料类别维护')}>
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              this.handleCreate();
            }}
          >
            {intl.get(`tarzan.product.materialCategory.button.create`).d('新建')}
          </Button>
        </Header>
        <Content>
          <FilterForm {...queryFormProps} onRef={this.formRefBind} />
          <ListTable onRef={this.handleBindRef} {...listProps} />
          <MaterialCategoryDrawer {...materialCategoryDrawerProps} onRef={this.materialRef} />
        </Content>
      </React.Fragment>
    );
  }
}
