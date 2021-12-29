/**
 * @description 处置方法维护
 * @author ywj
 * @email wenjie.yang01@hand-china.com
 * @date 2020/11/25
 * @time 10:20
 * @version 0.0.1
 */
import React, { Component } from 'react';
import { Button, Popconfirm } from 'hzero-ui';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import notification from 'utils/notification';
import { isEmpty } from 'lodash';
import FilterForm from './FilterForm';
import ListTable from './ListTable';
import CreateDrawer from './CreateDrawer';

@connect(({ disposalMethodsMaintenance, loading }) => ({
  disposalMethodsMaintenance,
  tenantId: getCurrentOrganizationId(),
  fetchLoading: loading.effects['disposalMethodsMaintenance/fetchList'],
  saveDataLoading: loading.effects['disposalMethodsMaintenance/saveRecord'],
  deleteDataLoading: loading.effects['disposalMethodsMaintenance/deleteRecord'],
}))
export default class IQCInspectionFree extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      showCreateDrawer: false, // 是否显示弹框
      selectedKeys: [], // 选中的数据
    };
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;

    // 查询默认下拉框
    dispatch({
      type: 'disposalMethodsMaintenance/fetchFunctionType',
      payload: {},
    });

    dispatch({
      type: 'disposalMethodsMaintenance/getSiteList',
      payload: {
        tenantId,
      },
    });

    // 查询数据
    this.handleSearch();
  }

  /**
   *  查询列表
   * @param {object} 查询参数
   */
  @Bind()
  handleSearch(fields = {}) {
    const { dispatch } = this.props;
    const fieldsValue = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'disposalMethodsMaintenance/fetchList',
      payload: {
        ...fieldsValue,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  // 打开抽屉
  @Bind()
  handleAddData(record = {}) {

    // 暂存选中信息
    this.setState({ selectedRecord: record });

    // 打开界面
    this.handleModalVisible(true);
  }

  /**
   *  是否显示条码新建modal
   */
  @Bind()
  handleModalVisible(flag) {
    this.setState({ showCreateDrawer: flag });

    // 清空选中信息
    if (!flag) {
      this.setState({ selectedRecord: {} });
    }
  }

  /**
   * 数据行选择操作
   */
  @Bind()
  handleSelectRow(selectedRowKeys) {
    this.setState({ selectedKeys: selectedRowKeys });
  }

  /**
   *  保存数据
   */
  @Bind()
  saveData(fieldsValue) {
    const { dispatch } = this.props;
    dispatch({
      type: 'disposalMethodsMaintenance/saveRecord',
      payload: {
        ...this.state.selectedRecord,
        ...fieldsValue,
      },
    }).then(res => {
      if (res) {
        // 提示成功，关闭弹框， 并重新查询
        notification.success({ message: "保存成功" });
        this.handleModalVisible(false);
        this.handleSearch();
      }
    });
  }

  /**
   *  删除
   */
  @Bind()
  deleteData() {
    // 设置传入的参数
    // 判断是否有主键，进而进行新增还是更新
    const { dispatch } = this.props;
    dispatch({
      type: "disposalMethodsMaintenance/deleteRecord",
      payload: {
        dispositionFunctionIdList: this.state.selectedKeys,
      },
    }).then(res => {
      if (res) {
        // 提示成功， 并重新查询
        notification.success({ message: "删除成功" });
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
    const { fetchLoading, disposalMethodsMaintenance, tenantId, saveDataLoading, deleteDataLoading } = this.props;
    const {
      list = [],
      pagination = {},
      functionType = [],
      defaultSite = {},
    } = disposalMethodsMaintenance;
    const filterProps = {
      tenantId,
      functionType,
      onRef: this.handleBindRef,
      onSearch: this.handleSearch,
    };

    // 选中
    const rowsSelection = {
      selectedRowKeys: this.state.selectedKeys,
      getCheckboxProps: record => ({
        disabled: !record.dispositionFunctionId,
      }),
      onChange: this.handleSelectRow,
    };

    const listProps = {
      rowsSelection,
      loading: fetchLoading,
      dataSource: list,
      onSelectRow: this.handleSelectRow,
      onSearch: this.handleSearch,
      handleAddData: this.handleAddData,
      pagination,
    };
    const detailProps = {
      detail: this.state.selectedRecord,
      tenantId,
      showCreateDrawer,
      defaultSite,
      onCancel: this.handleModalVisible,
      onOk: this.saveData,
      functionType,
      saveDataLoading,
    };
    return (
      <React.Fragment>
        <Header title="处置方法维护">
          <Button type="primary" icon="plus" onClick={() => this.handleAddData({})}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          {this.state.selectedKeys.length === 0 ? (
            <Button
              icon="delete"
              disabled={this.state.selectedKeys.length === 0}
              style={{ marginLeft: '15px' }}
            >
              {intl.get('tarzan.acquisition.transformation.button.delete').d('删除')}
            </Button>
          ) : (
            <Popconfirm
              title={intl
                .get(`hzero.common.button.confirm.delete`, {
                  count: this.state.selectedKeys.length,
                })
                .d(`总计${this.state.selectedKeys.length}条数据，是否确认删除?`)}
              onConfirm={this.deleteData}
            >
              <Button
                icon="delete"
                style={{ marginLeft: '15px' }}
                loading={deleteDataLoading}
                disabled={this.state.selectedKeys.length === 0}
              >
                {intl.get('hzero.common.button.delete').d('删除')}
              </Button>
            </Popconfirm>
            )}
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
