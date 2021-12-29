/**
 * codingObject - 编码对象维护
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

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 编码对象维护
 * @extends {Component} - React.Component
 * @reactProps {Object} codingObject - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ codingObject, loading }) => ({
  codingObject,
  fetchLoading: loading.effects['codingObject/fetchCodingObjectList'],
}))
@formatterCollections({
  code: 'tarzan.hmes.codingObject',
})
export default class CodingObject extends React.Component {
  listTable;

  state = {
    search: {},
  };

  componentDidMount() {
    this.refresh();
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'codingObject/fetchCodingObjectList',
    // });
  }

  @Bind()
  refresh = (pagination = {}) => {
    const { dispatch } = this.props;
    const { search } = this.state;
    dispatch({
      type: 'codingObject/fetchCodingObjectList',
      payload: {
        ...search,
        page: pagination,
      },
    });
  };

  @Bind()
  onSearch = (fieldsValue = {}) => {
    this.setState(
      {
        search: fieldsValue,
      },
      () => {
        this.refresh();
      }
    );
  };

  @Bind()
  onResetSearch = () => {
    this.setState({
      search: {},
    });
  };

  /**
   *
   * @param {object} ref - listTable子组件对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.listTable = ref;
  }

  // 新增
  @Bind
  handleCreate() {
    this.listTable.handleCodingObjectDrawerShow();
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.hmes.codingObject.title.list').d('编码对象维护')}>
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              this.handleCreate();
            }}
          >
            {intl.get('tarzan.hmes.codingObject.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <FilterForm onSearch={this.onSearch} onResetSearch={this.onResetSearch} />
          <ListTable
            onRef={this.handleBindRef}
            refresh={this.refresh}
            handleTableChange={this.refresh}
          />
        </Content>
      </React.Fragment>
    );
  }
}
