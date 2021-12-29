/**
 * 备料时间设置
 *@date：2019/10/21
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';

import FilterForm from './FilterForm';
import ListTable from './ListTable';
import DetailDrawer from './DetailDrawer';

@connect(({ basicDataMaintain, loading }) => ({
  basicDataMaintain,
  tenantId: getCurrentOrganizationId(),
  loading: {
    fetchLoading: loading.effects['basicDataMaintain/queryPreparingList'],
    saveLoading: loading.effects['basicDataMaintain/savePreparingData'],
  },
}))
@formatterCollections({ code: 'hwms.basicDataMaintain' })
class PrepareTab extends Component {
  form;

  componentDidMount() {
    this.handleSearch();
  }

  /**
   *  查询列表
   * @param {object} 查询参数
   */
  @Bind()
  handleSearch(fields = {}) {
    const { dispatch, tenantId } = this.props;
    const fieldsValue = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'basicDataMaintain/queryPreparingList',
      payload: {
        tenantId,
        ...fieldsValue,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   * 编辑
   * @param item
   */
  @Bind()
  handleEdit(item) {
    const { dispatch } = this.props;
    dispatch({
      type: 'basicDataMaintain/updateState',
      payload: {
        detail: { ...item },
      },
    });
    this.handleModalVisible(true);
  }

  /**
   *  是否显示modal
   */
  @Bind()
  handleModalVisible(flag) {
    const { dispatch } = this.props;
    dispatch({
      type: 'basicDataMaintain/updateState',
      payload: {
        showPreDrawer: flag,
      },
    });
  }

  /**
   *  保存数据
   */
  @Bind()
  saveData(params) {
    const {
      dispatch,
      tenantId,
      basicDataMaintain: { detail },
    } = this.props;
    let temp = {};
    if (!isEmpty(detail.preparingTimeId)) {
      temp = {
        preparingTimeId: detail.preparingTimeId,
        objectVersionNumber: detail.objectVersionNumber,
      };
    }
    dispatch({
      type: 'basicDataMaintain/savePreparingData',
      payload: {
        tenantId,
        ...temp,
        ...params,
      },
    }).then(res => {
      if (res.success) {
        this.handleModalVisible(false);
        notification.success();
        this.handleSearch();
      } else {
        notification.error({ message: res.message });
      }
    });
  }

  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   *  渲染页面
   * @returns {*}
   */
  render() {
    const {
      loading: { fetchLoading, saveLoading },
      basicDataMaintain,
      tenantId,
    } = this.props;
    const {
      prePagination = {},
      prepareList = [],
      detail = {},
      showPreDrawer = false,
      siteMap,
      enableFlagMap,
      preparingLeadTime,
    } = basicDataMaintain;
    const filterProps = {
      tenantId,
      siteMap,
      enableFlagMap,
      preparingLeadTime,
      onRef: this.handleBindRef,
      onSearch: this.handleSearch,
    };
    const listProps = {
      pagination: prePagination,
      loading: fetchLoading,
      dataSource: prepareList,
      onSearch: this.handleSearch,
      onEdit: this.handleEdit,
    };
    const detailProps = {
      detail,
      tenantId,
      visible: showPreDrawer,
      saveLoading,
      siteMap,
      onCancel: this.handleModalVisible,
      onOk: this.saveData,
    };
    return (
      <React.Fragment>
        <FilterForm {...filterProps} />
        <ListTable {...listProps} />
        {showPreDrawer && <DetailDrawer {...detailProps} />}
      </React.Fragment>
    );
  }
}

export default PrepareTab;
