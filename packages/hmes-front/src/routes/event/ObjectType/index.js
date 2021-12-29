/**
 * objectType - 对象类型维护
 * @date: 2019-8-7
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Button } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { addItemToPagination } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

/**
 * 事件类型维护
 * @extends {Component} - React.Component
 * @reactProps {Object} eventTypeList - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ objectType, loading }) => ({
  objectType,
  fetchLoading: loading.effects['objectType/fetchObjectTypeList'],
}))
@formatterCollections({
  code: ['tarzan.event.objectType'], // code 为 [服务].[功能]的字符串数组
})
export default class ObjectType extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'objectType/fetchObjectTypeList',
    });
    dispatch({
      type: 'objectType/fetchColumnType',
    });
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
   * 新建对象类型
   */
  @Bind()
  handleCreateObjectType() {
    const {
      dispatch,
      objectType: { objectTypeList = [], objectTypePagination = {} },
    } = this.props;
    if (
      objectTypeList.length === 0 ||
      (objectTypeList.length > 0 && objectTypeList[0]._status !== 'create')
    ) {
      dispatch({
        type: 'objectType/updateState',
        payload: {
          objectTypeList: [
            {
              objectTypeId: '',
              objectTypeCode: '',
              enableFlag: 'Y',
              _status: 'create',
            },
            ...objectTypeList,
          ],
          objectTypePagination: addItemToPagination(objectTypeList.length, objectTypePagination),
        },
      });
    }
  }

  /**
   * 删除对象类型
   */
  @Bind()
  deleteObjectType() {
    const {
      dispatch,
      objectType: { selectedRowKeys = [] },
    } = this.props;
    dispatch({
      type: 'objectType/deleteObjectType',
      payload: selectedRowKeys,
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.event.objectType.view.title.objectType').d('对象类型维护')}>
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              this.handleCreateObjectType();
            }}
          >
            {intl.get('tarzan.event.objectType.button.create').d('新建')}
          </Button>
          <Button
            icon="delete"
            disabled={this.props.objectType.selectedRowKeys.length === 0}
            onClick={() => {
              this.deleteObjectType();
            }}
          >
            {intl.get('hzero.common.button.delete').d('删除')}
          </Button>
        </Header>
        <Content>
          <FilterForm />
          <ListTable onRef={this.handleBindRef} />
        </Content>
      </React.Fragment>
    );
  }
}
