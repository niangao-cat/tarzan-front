/*
 * @Description: 数据项计算公式维护
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-09-21 09:40:49
 * @LastEditTime: 2020-09-27 17:16:48
 */

import React, { Component } from 'react';
import { Button, Popconfirm } from 'hzero-ui';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import queryString from 'querystring';
import { isEmpty } from 'lodash';

import intl from 'utils/intl';
import notification from 'utils/notification';
import {
  delItemToPagination,
  getCurrentOrganizationId,
  addItemToPagination,
  filterNullValueObject,
  getEditTableData,
} from 'utils/utils';
import { openTab } from 'utils/menuTab';
import FilterForm from './FilterForm';
import ListTableHead from './ListTableHead';
import ListTableLine from './ListTableLine';
import CreateDrawer from './Drawer/CreateDrawer';

@connect(({ dataItemFormula, loading }) => ({
  dataItemFormula,
  tenantId: getCurrentOrganizationId(),
  fetchHeadLoading: loading.effects['dataItemFormula/fetchHeadData'],
  fetchLineLoading: loading.effects['dataItemFormula/fetchLineData'],
  saveHeadDataLoading: loading.effects['dataItemFormula/saveHeadData'],
  saveLineDataLoading: loading.effects['dataItemFormula/saveLineData'],
  deleteHeadDataLoading: loading.effects['dataItemFormula/deleteHeadData'],
  deleteLineDataLoading: loading.effects['dataItemFormula/deleteLineData'],
}))
export default class DataItemFormula extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selectedHeadKeys: [],
      selectedHeads: [],
      drawerEditor: false, // 有效性是否可编辑
      lineEditor: false,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      tenantId,
    } = this.props;
    dispatch({
      type: 'dataItemFormula/batchLovData',
      payload: {
        tenantId,
      },
    });
    this.fetchHeadData();
  }

  // 保存头数据或修改头数据
  @Bind()
  saveHeadData(val) {
    const {
      dispatch,
      dataItemFormula: {
        detail = {},
      },
      tenantId,
    } = this.props;
    let type = '';
    if (detail.tagFormulaHeadId) {
      type = 'dataItemFormula/updateHeadData';
    } else {
      type = 'dataItemFormula/saveHeadData';
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
      type: 'dataItemFormula/fetchHeadData',
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
              type: 'dataItemFormula/updateState',
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
      type: 'dataItemFormula/deleteHeadData',
      payload: {
        tagFormulaHeadId: selectedHeads[0].tagFormulaHeadId,
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
      () => {
        this.fetchLineData();
      }
    );
  }

  // 获取行数据
  @Bind()
  fetchLineData(fields = {}) {
    const { dispatch } = this.props;
    const { selectedHeads } = this.state;
    dispatch({
      type: 'dataItemFormula/fetchLineData',
      payload: {
        tagFormulaHeadId: selectedHeads[0].tagFormulaHeadId,
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

  // 打开抽屉&关闭抽屉
  @Bind()
  handleAddHeadData(record = {}, flag) {
    const {
      dispatch,
    } = this.props;
    this.setState({ visible: flag });
    dispatch({
      type: 'dataItemFormula/updateState',
      payload: {
        detail: record,
      },
    });
  }

  // 行新增数据
  @Bind()
  handleCreate() {
    this.setState({ lineEditor: false });
    const {
      dispatch,
      dataItemFormula: { lineData = [], lineDataPagination = {} },
    } = this.props;
    const { selectedHeads } = this.state;
    if (selectedHeads.length === 0) {
      notification.error({ message: '请勾选数据！' });
    } else {
      dispatch({
        type: 'dataItemFormula/updateState',
        payload: {
          lineData: [
            {
              tagFormulaLineId: new Date().getTime(),
              _status: 'create',
            },
            ...lineData,
          ],
          lineDataPagination: addItemToPagination(lineData.length, lineDataPagination),
        },
      });
    }
  }

  // 保存行数据
  @Bind()
  saveLineData() {
    const {
      dispatch,
      tenantId,
      dataItemFormula: { lineData = [], lineDataPagination = {} },
    } = this.props;
    const params = getEditTableData(lineData, ['tagFormulaLineId']);
    const arrNew = []; // 新增数组
    const arrUpd = []; // 修改数组
    params.forEach(item => {
      if (item._status === 'create') {
        arrNew.push({
          tagFormulaHeadId: this.state.selectedHeads[0].tagFormulaHeadId,
          ...item,
          tenantId,
        });
      }
      if (item._status === 'update') {
        arrUpd.push({
          tagFormulaHeadId: this.state.selectedHeads[0].tagFormulaHeadId,
          ...item,
          tenantId,
        });
      }
    });
    if (Array.isArray(params) && params.length > 0) {
      if (arrUpd.length > 0) {
        dispatch({
          type: 'dataItemFormula/updateLineData',
          payload: {
            params: arrUpd,
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.fetchLineData(lineDataPagination);
          }
        });
      }
      dispatch({
        type: 'dataItemFormula/saveLineData',
        payload: {
          params: arrNew,
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.fetchLineData(lineDataPagination);
        }
      });
    }
  }

  // 行数据删除
  @Bind()
  deleteData(record, index) {
    const {
      dispatch,
      dataItemFormula: { lineData = [], lineDataPagination = {} },
    } = this.props;
    if (!record._status) {
      dispatch({
        type: 'dataItemFormula/deleteLineData',
        payload: {
          tagFormulaLineId: record.tagFormulaLineId,
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.fetchLineData();
        }
      });
    } else {
      lineData.splice(index, 1);
      dispatch({
        type: 'dataItemFormula/updateState',
        payload: {
          lineData,
          lineDataPagination: delItemToPagination(1, lineDataPagination),
        },
      });
    }
  }

  /**
   * 编辑
   * 行数据切换编辑状态
   * @param {Object} record 操作对象
   * @param {Boolean} flag  编辑/取消标记
   */
  @Bind()
  handleEditLine(record = {}, flag) {
    this.setState({ lineEditor: false });
    const {
      dispatch,
      dataItemFormula: { lineData = [] },
    } = this.props;
    const newList = lineData.map(item =>
      item.tagFormulaLineId === record.tagFormulaLineId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'dataItemFormula/updateState',
      payload: {
        lineData: [...newList],
      },
    });
  }

  @Bind()
  handleBranchImport() {
    openTab({
      key: `/hhme/data-item-formula/HME.TAG_FORMULA`,
      title: intl.get('hwms.machineBasic.view.message.import').d('数据项计算公式维护批量导入'),
      search: queryString.stringify({
        action: intl.get('hwms.machineBasic.view.message.import').d('数据项计算公式维护批量导入'),
      }),
    });
  }

  /**
   *  渲染页面
   * @returns {*}
   */
  render() {
    const { visible, selectedHeadKeys, drawerEditor, lineEditor } = this.state;
    const {
      dataItemFormula: {
        headData = [],
        headDataPagination = {},
        lineData = [],
        lineDataPagination = {},
        detail = {},
        equipemntCategqry = [],
        checkCycle = [],
        maintainCycle = [],
        maintainLeadtime = [],
        status = [],
        dataTypeList = [],
        collectionMethodList = [],
        serviceLife = [],
        equipemntManageType = [],
        equipemntManageCycle = [],
      },
      tenantId,
      fetchHeadLoading,
      fetchLineLoading,
      saveHeadDataLoading,
      saveLineDataLoading,
      deleteHeadDataLoading,
      deleteLineDataLoading,
    } = this.props;
    const filterProps = {
      status,
      tenantId,
      equipemntCategqry,
      serviceLife,
      equipemntManageType,
      onRef: this.handleBindRef,
      onSearch: this.fetchHeadData,
      handleMoreSearch: this.hideOrOpenModal,
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
    const lineListProps = {
      dataSource: lineData,
      pagination: lineDataPagination,
      onSearch: this.fetchLineData,
      canEdit: true,
      checkCycle,
      maintainCycle,
      maintainLeadtime,
      dataTypeList,
      tenantId,
      collectionMethodList,
      lineEditor,
      equipemntManageCycle,
      loading: fetchLineLoading,
      deleteLineDataLoading,
      selectedHeadKeys,
      handleCreate: this.handleCreate, // 新增数据
      deleteData: this.deleteData, // 删除数据
      handleCleanLine: this.deleteData, // 清除
      handleEditLine: this.handleEditLine, // 取消&编辑
    };
    const createProps = {
      visible,
      detail,
      equipemntCategqry,
      tenantId,
      drawerEditor,
      serviceLife,
      equipemntManageType,
      saveHeadDataLoading,
      onOk: this.saveHeadData,
      onCancel: this.handleAddHeadData,
    };
    return (
      <React.Fragment>
        <Header title="数据项计算公式维护">
          <Popconfirm
            title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
            onConfirm={() => this.deleteHeadData()}
          >
            <Button type="primary" loading={deleteHeadDataLoading} icon="delete">
              {intl.get('hzero.common.button.delete').d('删除')}
            </Button>
          </Popconfirm>
          <Button type="primary" loading={saveLineDataLoading} icon="save" onClick={() => this.saveLineData({}, true)}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          <Button type="primary" icon="plus" onClick={() => this.handleAddHeadData({}, true)}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button type="default" onClick={() => this.handleBranchImport()}>
            批量导入
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTableHead {...headListProps} />
          <ListTableLine {...lineListProps} />
          {this.state.visible && <CreateDrawer {...createProps} />}
        </Content>
      </React.Fragment>
    );
  }
}
