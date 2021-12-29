/**
 * 备料单行明细
 *@date：2019/10/29
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

@connect(({ woPlatform, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  woPlatform,
  loading: {
    detailLoading: loading.effects['woPlatform/queryDocLineDetailList'],
  },
}))
@formatterCollections({ code: ['hwms.requisitionAndReturn', 'hwms.woPlatform'] })
class DeliverDetailDrawer extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      selectedRows: props.selectedLine,
    };
  }

  componentDidMount() {
    this.handleDetailSearch();
  }

  /**
   * 备料单需求行明细查询
   * @param {object} fields - 查询参数
   */
  @Bind()
  handleDetailSearch(fields = {}) {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    const { instructionId } = selectedRows;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'woPlatform/queryDocLineDetailList',
      payload: {
        instructionId,
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
      woPlatform: { detailPagination = {}, detailList = [], mtLotStatusMap = [] },
      loading: { detailLoading },
      tenantId,
    } = this.props;
    const detailFilterProps = {
      mtLotStatusMap,
      tenantId,
      onSearch: this.handleDetailSearch,
      onRef: this.handleBindRef,
    };
    const detailListProps = {
      pagination: detailPagination,
      loading: detailLoading,
      dataSource: detailList,
      onSearch: this.handleDetailSearch,
    };
    const { showVisible, onCancel } = this.props;
    return (
      <Modal
        destroyOnClose
        width={1135}
        title={intl.get('hwms.woPlatform.view.message.lineDetail').d('备料单行明细')}
        visible={showVisible}
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
export default DeliverDetailDrawer;
