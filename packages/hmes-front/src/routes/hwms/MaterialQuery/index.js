/**
 * 物料查询
 *@date：2019/9/17
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';

import FilterForm from './FilterForm';
import ListTable from './ListTable';
import BinModal from './BinModal';

@connect(({ materialQuery, requisitionAndReturn, loading }) => ({
  materialQuery,
  requisitionAndReturn,
  tenantId: getCurrentOrganizationId(),
  loading: {
    fetchMaterialLoading: loading.effects['materialQuery/queryMaterialList'],
    fetchBINLoading: loading.effects['materialQuery/queryBINList'],
  },
}))
@formatterCollections({ code: 'hwms.materialQuery' })
class MaterialQuery extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // 工厂下拉框
    dispatch({
      type: 'requisitionAndReturn/querySiteList',
    });
    this.handleSearch();
  }

  /**
   *  查询列表
   * @param {object} 查询参数
   */
  @Bind()
  handleSearch(fields = {}) {
    const { dispatch, tenantId } = this.props;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'materialQuery/queryMaterialList',
      payload: {
        tenantId,
        ...filterValues,
        ...fields,
        // page: isEmpty(fields)?{}: fields.page,
      },
    });
  }

  /**
   *  查询物料对应的BIN
   * @param record
   */
  @Bind()
  handleBINSearch(record) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'materialQuery/queryBINList',
      payload: {
        tenantId,
        materialId: record.materialId,
      },
    }).then(res => {
      if (res.success) {
        this.handleModalVisible();
      } else {
        notification.error({ message: res.message });
      }
    });
  }

  /**
   *  是否显示BIN modal
   */
  @Bind()
  handleModalVisible() {
    const { modalVisible } = this.state;
    this.setState({ modalVisible: !modalVisible });
  }

  /**
   * @param {object} ref - FilterForm子组件对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   *  渲染页面
   * @returns {*}
   */
  render() {
    const { modalVisible } = this.state;
    const {
      tenantId,
      loading: { fetchLoading, fetchBINLoading },
      materialQuery: { pagination = {}, dataList = [], binList = [] },
      requisitionAndReturn: { siteMap },
      dispatch,
    } = this.props;
    const filterProps = {
      tenantId,
      siteMap,
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
    const binModalProps = {
      loading: fetchBINLoading,
      dataSource: binList,
      modalVisible,
      onOk: this.handleModalVisible,
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`hwms.materialQuery.view.message.materialTitle`).d('物料查询')} />
        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...listProps} />
          <BinModal {...binModalProps} />
        </Content>
      </React.Fragment>
    );
  }
}

export default MaterialQuery;
