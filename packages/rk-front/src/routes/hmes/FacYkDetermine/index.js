/*
 * @Description: FAC-Y宽判定标准维护
 * @Version: 0.0.1
 * @Autor: li.zhang13@hand-china.com
 * @Date: 2021-02-04 10:45:11
 */

import React, { Component } from 'react';
import { Button, Popconfirm } from 'hzero-ui';
// import { Fields, Button as ButtonPermission } from 'components/Permission';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import { openTab } from 'utils/menuTab';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import notification from 'utils/notification';
import {
  // delItemToPagination,
  getCurrentOrganizationId,
  // addItemToPagination,
  filterNullValueObject,
  // getEditTableData,
} from 'utils/utils';
import { isEmpty } from 'lodash';
import queryString from 'querystring';
import FilterForm from './FilterForm';
import ListTableHead from './ListTableHead';
import CreateDrawer from './Drawer/CreateDrawer';
import ListHistoryTable from './Drawer/ListHistoryTable';

@connect(({ facYk, loading }) => ({
  facYk,
  tenantId: getCurrentOrganizationId(),
  fetchHeadLoading: loading.effects['facYk/fetchHeadData'],
  saveHeadDataLoading: loading.effects['facYk/saveHeadData'],
  deleteHeadDataLoading: loading.effects['facYk/deleteHeadData'],
  getHistoryDataLoading: loading.effects['facYk/getHistoryData'],
}))
export default class FacYk extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selectedHeadKeys: [],
      selectedHeads: [],
      drawerEditor: false, // 有效性是否可编辑
      historyVisible: false,
    };
  }

  componentDidMount() {
    this.fetchHeadData();
  }

  // 保存头数据或修改头数据
  @Bind()
  saveHeadData(val) {
    const {
      dispatch,
      facYk: {
        detail = {},
      },
      tenantId,
    } = this.props;
    let type = '';
    if (detail.facYkId) {
      type = 'facYk/updateHeadData';
    } else {
      type = 'facYk/saveHeadData';
    }
    dispatch({
      type,
      payload: {
        ...detail,
        ...val,
        tenantId,
      },
    }).then(res => {
      if (res) {
        this.setState({ visible: false });
        notification.success();
        this.fetchHeadData();
      }
    });
  }

  // 获取头数据
  @Bind()
  fetchHeadData(fields = {}) {
    const { dispatch } = this.props;
    const fieldsValue = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'facYk/fetchHeadData',
      payload: {
        ...fieldsValue,
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(res => {
      if (res) {
        this.setState(
          { selectedHeadKeys: [], selectedHeads: [] },
          () => {
            dispatch({
              type: 'facYk/updateState',
              payload: {
                lineData: [],
                lineDataPagination: {},
              },
            });
          }
        );
      }
    });
  }

  // 头数据删除
  @Bind()
  deleteHeadData() {
    const { dispatch } = this.props;
    const { selectedHeads = [] } = this.state;
    dispatch({
      type: 'facYk/deleteHeadData',
      payload: {
        facYkId: selectedHeads[0].facYkId,
        // tenantId,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.fetchHeadData();
      }
    });
  }

  // 选中头
  @Bind()
  onSelectHead(selectedRowKeys, selectedRows) {
    this.setState(
      { selectedHeadKeys: selectedRowKeys, selectedHeads: selectedRows },
    );
  }

  /**
   * 传递表单对象(传递子组件对象form，给父组件用)
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  // 打开抽屉&关闭抽屉
  @Bind()
  handleAddHeadData(record = {}, flag) {
    const {
      dispatch,
    } = this.props;
    this.setState({ visible: flag });
    dispatch({
      type: 'facYk/updateState',
      payload: {
        detail: record,
      },
    });
  }

  // 导入
  @Bind()
  handleBatchImport() {
    openTab({
      key: '/hmes/fac-yk/data-import/HME.FAC_YK',
      title: intl.get('hmes.FAC-Y.view.message.import').d('FAC-Y宽判定标准导入'),
      search: queryString.stringify({
        action: intl.get('hmes.FAC-Y.view.message.import').d('FAC-Y宽判定标准导入'),
      }),
    });
  }

  // 导出
  @Bind()
  handleGetFormValue() {
    const filterValue = this.form === undefined ? {} : this.form.getFieldsValue();
    return filterNullValueObject({ ...filterValue });
  }

  // 历史记录模态框控制
  @Bind()
  hideOrOpenHistoryModal() {
    this.setState({ historyVisible: false });
  }

  // 历史记录
  @Bind()
  handleSearchHistoryModal(page={}) {
    // 判断是否选择数据， 没有则报错
    if(this.state.selectedHeads.length===0){
      return notification.error({message: '请先选中数据'});
    }

    const { dispatch } = this.props;
    this.setState({historyVisible: true});
    dispatch({
      type: 'facYk/getHistoryData',
      payload: {
        facYkId: this.state.selectedHeads[0].facYkId,
        page,
      },
    });
  }

  /**
   *  渲染页面
   * @returns {*}
   */
  render() {
    const { visible, selectedHeadKeys, drawerEditor, historyVisible } = this.state;
    const {
      facYk: {
        headData = [],
        historyData = [],
        headDataPagination = {},
        historyDataPagination = {},
        detail = {},
      },
      tenantId,
      fetchHeadLoading,
      saveHeadDataLoading,
      deleteHeadDataLoading,
      getHistoryDataLoading,
    } = this.props;
    const filterProps = {
      tenantId,
      onRef: this.handleBindRef,
      onSearch: this.fetchHeadData,
    };
    const headListProps = {
      dataSource: headData,
      pagination: headDataPagination,
      selectedHeadKeys,
      loading: fetchHeadLoading,
      onSelectRow: this.handleSelectRow,
      onSearch: this.fetchHeadData,
      handleUpdateData: this.handleAddData,
      onSelectHead: this.onSelectHead,
      handleAddHeadData: this.handleAddHeadData,
      handleUpdateHeadData: this.handleAddHeadData,
    };
    const createProps = {
      visible,
      detail,
      tenantId,
      drawerEditor,
      saveHeadDataLoading,
      onOk: this.saveHeadData,
      onCancel: this.handleAddHeadData,
    };
    const historyModalProps = {
      loading: getHistoryDataLoading,
      dataSource: historyData,
      pagination: historyDataPagination,
      visible: historyVisible,
      onCancel: this.hideOrOpenHistoryModal,
      onSearch: this.handleSearchHistoryModal,
    };

    return (
      <React.Fragment>
        <Header title="FAC-Y宽判定标准维护">
          <Popconfirm
            title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
            onConfirm={() => this.deleteHeadData()}
          >
            <Button type="primary" loading={deleteHeadDataLoading} icon="delete">
              {intl.get('hzero.common.button.delete').d('删除')}
            </Button>
          </Popconfirm>
          <Button type="primary" icon="plus" onClick={() => this.handleAddHeadData({}, true)}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button
            onClick={this.handleBatchImport}
            icon="to-top"
          >
            导入
          </Button>
          <ExcelExport
            exportAsync
            requestUrl={`/mes/v1/${getCurrentOrganizationId()}/hme-fac-yks/fac-yk-export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue()}
          />
          <Button
            type="primary"
            onClick={() => this.handleSearchHistoryModal()}
          >
            {intl.get('hzero.common.button.history').d('历史记录')}
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTableHead {...headListProps} />
          {this.state.visible && <CreateDrawer {...createProps} />}
          <ListHistoryTable {...historyModalProps} />
        </Content>
      </React.Fragment>
    );
  }
}
