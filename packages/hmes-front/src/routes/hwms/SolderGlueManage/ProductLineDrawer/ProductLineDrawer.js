/**
 * 产线数据查询
 *@date：2019/10/31
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Modal } from 'hzero-ui';
import intl from 'utils/intl';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';

import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ solderGlueManage, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  solderGlueManage,
  loading: {
    detailLoading: loading.effects['solderGlueManage/queryProductLineList'],
  },
}))
@formatterCollections({ code: ['hwms.solderGlueManage'] })
class ProductLineDrawer extends Component {
  form;

  componentDidMount() {
    this.handleProLineSearch();
  }

  /**
   * 产线数据查询
   * @param {object} fields - 查询参数
   */
  @Bind()
  handleProLineSearch(fields = {}) {
    const { dispatch } = this.props;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'solderGlueManage/queryProductLineList',
      payload: {
        ...filterValues,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   * 传递表单对象(传递子组件对象form，给父组件用)
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const {
      solderGlueManage: { proLinePagination = {}, proLineList = [] },
      loading: { detailLoading },
      tenantId,
    } = this.props;
    const detailFilterProps = {
      tenantId,
      onSearch: this.handleProLineSearch,
      onRef: this.handleBindRef,
    };
    const detailListProps = {
      pagination: proLinePagination,
      loading: detailLoading,
      dataSource: proLineList,
      onSearch: this.handleProLineSearch,
    };
    const { visible, onCancel } = this.props;
    return (
      <Modal
        destroyOnClose
        width={720}
        title={intl.get('hwms.solderGlueManage.view.message.lineDetail').d('产线数据查询')}
        visible={visible}
        onCancel={onCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        footer={null}
      >
        <FilterForm {...detailFilterProps} />
        <ListTable {...detailListProps} />
      </Modal>
    );
  }
}
export default ProductLineDrawer;
