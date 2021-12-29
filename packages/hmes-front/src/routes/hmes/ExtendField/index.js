/**
 * extendField - 扩展字段维护
 * @date: 2019-7-30
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

// const modelPrompt = 'tarzan.hmes.extendField.model.extendField';

/**
 * 扩展字段维护
 * @extends {Component} - React.Component
 * @reactProps {Object} extendField - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ extendField, loading }) => ({
  extendField,
  fetchLoading: loading.effects['extendField/fetchExtendFieldList'],
}))
@formatterCollections({
  code: 'tarzan.hmes.extendField',
})
export default class ExtendField extends React.Component {
  listTable;

  queryForm;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'extendField/fetchExtendFieldList',
    });
    // dispatch({
    //   type: 'extendField/fetchServicePackage',
    // });
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
    this.listTable.handleExtendFieldDrawerShow();
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
   * 渲染方法
   * @returns
   */
  render() {
    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.hmes.extendField.title.list').d('扩展字段维护')}>
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              this.handleCreate();
            }}
          >
            {intl.get('tarzan.hmes.extendField.button.create').d('新建')}
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
