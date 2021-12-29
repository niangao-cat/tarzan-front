/*
 * businessType -企业维护
 * date: 2020-01-03
 * author : 黄文钊 <wenzhao.huang@hand-china.com>
 * version : 0.0.1
 * copyright Copyright (c) 2020, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button } from 'hzero-ui';
import formatterCollections from 'utils/intl/formatterCollections';
// import {isUndefined} from 'lodash';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
// import notification from 'utils/notification';
import { addItemToPagination } from 'utils/utils';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 *企业维护
 * @extends {Component} - React.Component
 * @reactProps {Object} businessType - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ businessType, loading }) => ({
  businessType,
  fetchbusinessTypeLoading: loading.effects['businessType/fetchBusinessTypeList'],
}))
@formatterCollections({ code: 'tarzan.hmes.businessType' })
@Form.create({ fieldNameProp: null })
export default class businessType extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'businessType/fetchBusinessTypeList',
    });
  }

  onRefs = ref => {
    this.child = ref;
  };

  /**
   * 获取filterForm
   */
  filterRef = (ref = {}) => {
    this.filterForm = (ref.props || {}).form;
  };

  /**
   * 调用 filterForm 的查询
   */
  onSearch = (pagination = {}) => {
    this.child.fetchQueryList(pagination);
  };

  /**
   * 新建消息
   */
  @Bind()
  handleCreatebusinessType() {
    const {
      dispatch,
      businessType: { businessTypeList = [], businessTypePagination = {} },
    } = this.props;
    if (
      businessTypeList.length === 0 ||
      (businessTypeList.length > 0 && businessTypeList[0]._status !== 'create')
    ) {
      dispatch({
        type: 'businessType/updateState',
        payload: {
          businessTypeList: [
            {
              relationId: '',
              enableFlag: 'Y',
              businessType: '',
              businessTypeDesc: '',
              instructionType: '',
              instructionTypeDesc: '',
              _status: 'create',
            },
            ...businessTypeList,
          ],
          businessTypePagination: addItemToPagination(
            businessTypeList.length,
            businessTypePagination
          ),
        },
      });
    }
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const ListProps = {
      businessType: this.props.businessType,
    };
    return (
      <React.Fragment>
        <Header
          title={intl.get('tarzan.hmes.businessType.title.list').d('业务类型与移动类型关系维护')}
        >
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              this.handleCreatebusinessType();
            }}
          >
            {intl.get('tarzan.hmes.businessType.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <FilterForm onRef={this.filterRef} onRefs={this.onRefs} />
          <ListTable ListProps={ListProps} onSearch={this.onSearch} />
          {/* <ListTable filterForm={this.filterForm} /> */}
        </Content>
      </React.Fragment>
    );
  }
}
