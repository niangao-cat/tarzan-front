/**
 * 现有量查询
 *@date：2020/4/19
 *@author：zzc <zhicen.zhang@hand-china.com>>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Content, Header } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isArray } from 'lodash';
import intl from 'utils/intl';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import ExcelExport from 'components/ExcelExport';
import FilterForm from './FilterForm';
import ListTable from './ListTable';
import { Host } from '@/utils/config';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';

@connect(({ onhandQuery, loading }) => ({
  onhandQuery,
  tenantId: getCurrentOrganizationId(),
  loading: {
    fetchLoading: loading.effects['onhandQuery/queryList'],
  },
}))
@formatterCollections({ code: ['hwms.onhandQuery', 'hwms.barcodeQuery'] })
class OnhandQuery extends Component {
  form;

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'onhandQuery/init',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'onhandQuery/fetchSiteList',
    });
    dispatch({
      type: 'onhandQuery/fetchDefaultSite',
    });
  }

  /**
   *  查询列表
   * @param {object} 查询参数
   */
  @Bind()
  handleSearch(fields = {}) {
    const { dispatch, tenantId } = this.props;
    let value = this.form ? this.form.getFieldsValue() : {};
    const { lotCodeList, ...newValue } = value;
    value = {
      ...newValue,
      lotCode: isArray(lotCodeList) ? lotCodeList.join(',') : null,
    };
    const filterValues = filterNullValueObject(value);
    dispatch({
      type: 'onhandQuery/queryList',
      payload: {
        tenantId,
        ...filterValues,
        ...fields,
      },
    });
  }

  /**
   * @param {object} ref - FilterForm子组件对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  @Bind()
  handleGetFormValue() {
    let value = this.form ? this.form.getFieldsValue() : {};
    const { lotCodeList, ...newValue } = value;
    value = {
      ...newValue,
      lotCode: isArray(lotCodeList) ? lotCodeList.join(',') : null,
    };
    const filterValues = filterNullValueObject(value);
    return filterValues;
  }

  /**
   *  渲染页面
   * @returns {*}
   */
  render() {
    const {
      tenantId,
      loading: { fetchLoading },
      onhandQuery: { pagination = false, dataList = [], enableMap = [], siteList = [], defaultSite = {}, onhandQuantitySum },
      dispatch,
    } = this.props;
    // const url = urlMap.map(item => item.meaning)[0];
    // const target = '_blank';
    const filterProps = {
      tenantId,
      siteList,
      enableMap,
      dispatch,
      defaultSite,
      onRef: this.handleBindRef,
      onSearch: this.handleSearch,
    };
    const listProps = {
      pagination,
      dispatch,
      loading: fetchLoading,
      dataSource: dataList,
      onSearch: this.handleSearch,
      onBINQuery: this.handleBINSearch,
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`hwms.onhandQuery.view.message.onhandTitle`).d('现有量查询')}>
          <ExcelExport
            requestUrl={`${Host}/v1/${tenantId}/wms-inv-onhand-quantity/export`}
            queryParams={this.handleGetFormValue()}
          />
          &emsp;&emsp;
          <p>库存合计：{onhandQuantitySum}</p>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...listProps} />
        </Content>
        <ModalContainer ref={registerContainer} />
      </React.Fragment>
    );
  }
}

export default OnhandQuery;
