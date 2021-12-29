/**
 * 事务类型维护
 *@date：2019/10/18
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Button } from 'hzero-ui';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';

import FilterForm from './FilterForm';
import ListTable from './ListTable';
import CreateDrawer from './CreateDrawer';

@connect(({ transactionType, loading }) => ({
  transactionType,
  tenantId: getCurrentOrganizationId(),
  loading: {
    fetchLoading: loading.effects['transactionType/queryList'],
    saveLoading: loading.effects['transactionType/saveData'],
  },
}))
@formatterCollections({ code: 'hwms.transactionType' })
class TransactionType extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      showCreateDrawer: false,
    };
  }

  componentDidMount() {
    // 查询条码列表
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
      type: 'transactionType/queryList',
      payload: {
        tenantId,
        ...fieldsValue,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   *  点击创建
   */
  @Bind()
  handleAdd() {
    const { dispatch } = this.props;
    dispatch({
      type: 'transactionType/updateState',
      payload: {
        detail: {
          enableFlag: 'N',
          processErpFlag: 'N',
        },
      },
    });
    this.handleModalVisible();
  }

  /**
   * 编辑
   * @param item
   */
  @Bind()
  handleEdit(item) {
    const { dispatch } = this.props;
    dispatch({
      type: 'transactionType/updateState',
      payload: {
        detail: { ...item },
      },
    });
    this.handleModalVisible();
  }

  /**
   *  是否显示modal
   */
  @Bind()
  handleModalVisible() {
    const { showCreateDrawer } = this.state;
    this.setState({ showCreateDrawer: !showCreateDrawer });
  }

  /**
   *  保存数据
   */
  @Bind()
  saveData(params) {
    const {
      dispatch,
      tenantId,
      transactionType: { detail },
    } = this.props;
    dispatch({
      type: 'transactionType/saveData',
      payload: {
        tenantId,
        ...detail,
        ...params,
      },
    }).then(res => {
      if (res) {
        this.handleModalVisible();
        notification.success();
        this.handleSearch();
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
    const { showCreateDrawer } = this.state;
    const {
      loading: { fetchLoading, saveLoading },
      transactionType,
      tenantId,
    } = this.props;
    const { pagination = {}, dataList = [], detail = {} } = transactionType;
    const filterProps = {
      tenantId,
      onRef: this.handleBindRef,
      onSearch: this.handleSearch,
    };
    const listProps = {
      pagination,
      loading: fetchLoading,
      dataSource: dataList,
      onSearch: this.handleSearch,
      onEdit: this.handleEdit,
    };
    const detailProps = {
      detail,
      tenantId,
      showCreateDrawer,
      saveLoading,
      onCancel: this.handleModalVisible,
      onOk: this.saveData,
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`hwms.transactionType.view.message.title`).d('事务类型维护')}>
          <Button type="primary" icon="plus" onClick={this.handleAdd}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...listProps} />
          <CreateDrawer {...detailProps} />
        </Content>
      </React.Fragment>
    );
  }
}

export default TransactionType;
