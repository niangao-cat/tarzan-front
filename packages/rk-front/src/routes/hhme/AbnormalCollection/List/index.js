/**
 * 异常收集组维护 - AbnormalCollection
 * @date: 2020/05/09 10:12:38
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Button } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty } from 'lodash';

import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { Header, Content } from 'components/Page';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';

import FilterForm from './FilterForm';
import ListTable from './ListTable';

const modelPrompt = 'tarzan.hmes.abnormalCollection';

@connect(({ abnormalCollection, loading }) => ({
  abnormalCollection,
  loading: loading.effects['abnormalCollection/fetchList'],
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: 'tarzan.hmes.purchaseOrder',
})
export default class List extends Component {
  componentDidMount() {
    this.handleFetchList();
  }

  @Bind()
  handleFetchList(page = {}) {
    const { dispatch } = this.props;
    const value = this.formDom ? this.formDom.getFieldsValue() : {};
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    dispatch({
      type: 'abnormalCollection/fetchList',
      payload: {
        page: isEmpty(page) ? {} : page,
        ...filterValue,
      },
    });
  }

  @Bind()
  handleCreate() {
    const { history } = this.props;
    history.push('/hmes/abnormal-collection/detail/create');
  }

  render() {
    const {
      history,
      tenantId,
      loading,
      abnormalCollection: { list = [], pagination = {} },
    } = this.props;
    const filterProps = {
      tenantId,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.handleFetchList,
    };
    const listTableProps = {
      loading,
      history,
      pagination,
      dataSource: list,
      onSearch: this.handleFetchList,
    };
    return (
      <div>
        <Header title={intl.get(`${modelPrompt}.view.title`).d('异常收集组维护')}>
          <Button type="primary" icon="plus" onClick={() => this.handleCreate()}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...listTableProps} />
        </Content>
      </div>
    );
  }
}
