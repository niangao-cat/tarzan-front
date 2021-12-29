/**
 * 库存调拨审核设置
 *@date：2019/10/18
 *@version：0.0.1
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

@connect(({ allocationAuditSettings, loading }) => ({
  allocationAuditSettings,
  tenantId: getCurrentOrganizationId(),
  loading: {
    fetchLoading: loading.effects['allocationAuditSettings/queryList'],
    saveLoading: loading.effects['allocationAuditSettings/saveData'],
  },
}))
@formatterCollections({ code: 'hwms.allocationAuditSettings' })
class allocationAuditSettings extends Component {
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

    // 查询默认值
    const {dispatch} = this.props;
    dispatch({
      type: 'allocationAuditSettings/init',
    });
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
      type: 'allocationAuditSettings/queryList',
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
      type: 'allocationAuditSettings/updateState',
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
   *  点击创建
   */
  @Bind()
  handleEdit(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'allocationAuditSettings/updateState',
      payload: {
        detail: {
          ...record,
        },
      },
    });
    this.handleModalVisible();
  }


    /**
   * 编辑对象属性
   */
  @Bind()
  handleDelete(record) {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'allocationAuditSettings/deleteData',
      payload: { allocateSettingId: record.allocateSettingId, tenantId: getCurrentOrganizationId() },
    }).then(res=>{
      if(res){
        this.handleSearch();
      }
    });
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
      allocationAuditSettings: { detail },
    } = this.props;
    dispatch({
      type: 'allocationAuditSettings/saveData',
      payload: {
        tenantId,
        ...detail,
        ...params,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleModalVisible();
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
      allocationAuditSettings: {
        pagination = {}, dataList = [], detail = {}, approveSettingMap = [],
      },
      tenantId,
    } = this.props;
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
      handleDelete: this.handleDelete,
    };
    const detailProps = {
      detail,
      tenantId,
      approveSettingMap,
      showCreateDrawer,
      saveLoading,
      onCancel: this.handleModalVisible,
      onOk: this.saveData,
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`hwms.allocationAuditSettings.view.message.title`).d('库存调拨审核设置')}>
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

export default allocationAuditSettings;
