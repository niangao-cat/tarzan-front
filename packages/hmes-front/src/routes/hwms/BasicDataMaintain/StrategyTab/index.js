/**
 * 组件配送策略维护
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
import MaintainDrawer from './MaintainDrawer';

@connect(({ basicDataMaintain, loading }) => ({
  basicDataMaintain,
  tenantId: getCurrentOrganizationId(),
  loading: {
    fetchLoading: loading.effects['basicDataMaintain/queryStrategyList'],
    saveLoading:
      loading.effects['basicDataMaintain/saveStrategyData'] ||
      loading.effects['basicDataMaintain/saveData'],
  },
}))
@formatterCollections({ code: 'hwms.basicDataMaintain' })
class StrategyTab extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      showMaintainModal: false, // 是否显示合并规则维护modal
      editFlag: false, // 是否为编辑状态
    };
  }

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
      type: 'basicDataMaintain/queryStrategyList',
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
    this.setState({ editFlag: true });
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
        showStrDrawer: flag,
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
    if (!isEmpty(detail.strategyId)) {
      temp = {
        strategyId: detail.strategyId,
        objectVersionNumber: detail.objectVersionNumber,
      };
    }
    dispatch({
      type: 'basicDataMaintain/saveStrategyData',
      payload: {
        tenantId,
        ...temp,
        ...params,
      },
    }).then(res => {
      if (res.success) {
        this.handleModalVisible(false);
        this.setState({ editFlag: false });
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
   * 点击合并规则维护
   * @param record
   */
  @Bind()
  handleRule(record = {}) {
    const { dispatch } = this.props;
    dispatch({
      type: 'basicDataMaintain/queryProdLineList',
      payload: {
        strategyId: record.strategyId,
      },
    });
    dispatch({
      type: 'basicDataMaintain/updateState',
      payload: {
        detail: { ...record },
      },
    });
    const { showMaintainModal } = this.state;
    this.setState({ showMaintainModal: !showMaintainModal });
  }

  /**
   * 保存合并规则
   * @param params
   */
  @Bind()
  handleRuleSave(params) {
    const {
      dispatch,
      tenantId,
      basicDataMaintain: { detail },
    } = this.props;
    dispatch({
      type: 'basicDataMaintain/saveData',
      payload: {
        tenantId,
        strategyId: detail.strategyId,
        ...params,
        prodLineIdList: isEmpty(params.prodLineIdList) ? [] : params.prodLineIdList.split(','),
        prodLineCodeList: isEmpty(params.prodLineCodeList)
          ? []
          : params.prodLineCodeList.split(','),
      },
    }).then(res => {
      if (res.success) {
        const { showMaintainModal } = this.state;
        this.setState({ showMaintainModal: !showMaintainModal });
        notification.success();
        this.handleSearch();
      } else {
        notification.error({ message: res.message });
      }
    });
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
    const { showMaintainModal, editFlag } = this.state;
    const {
      strPagination = {},
      strList = [],
      detail = {},
      showStrDrawer = false,
      siteMap,
      enableFlagMap,
      deliveryMethodMap,
      prodLineIdList,
      prodLineCodeList,
    } = basicDataMaintain;
    const filterProps = {
      tenantId,
      siteMap,
      enableFlagMap,
      onRef: this.handleBindRef,
      onSearch: this.handleSearch,
    };
    const listProps = {
      pagination: strPagination,
      loading: fetchLoading,
      dataSource: strList,
      onSearch: this.handleSearch,
      onEdit: this.handleEdit,
      onConsolidationRule: this.handleRule,
    };
    const detailProps = {
      detail,
      tenantId,
      editFlag,
      visible: showStrDrawer,
      saveLoading,
      siteMap,
      deliveryMethodMap,
      onCancel: this.handleModalVisible,
      onOk: this.saveData,
    };
    const maintainProps = {
      detail,
      tenantId,
      visible: showMaintainModal,
      saveLoading,
      siteMap,
      prodLineIdList,
      prodLineCodeList,
      onCancel: this.handleRule,
      onOk: this.handleRuleSave,
    };
    return (
      <React.Fragment>
        <FilterForm {...filterProps} />
        <ListTable {...listProps} />
        {showStrDrawer && <DetailDrawer {...detailProps} />}
        {showMaintainModal && <MaintainDrawer {...maintainProps} />}
      </React.Fragment>
    );
  }
}

export default StrategyTab;
