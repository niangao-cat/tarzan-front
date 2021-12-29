/*
 * @Description: 设备点检&保养项目维护
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-10 11:05:45
 */

import React, { Component } from 'react';
import { Button, Row, Popconfirm } from 'hzero-ui';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import notification from 'utils/notification';
import {
  delItemToPagination,
  getCurrentOrganizationId,
  addItemToPagination,
  filterNullValueObject,
  getEditTableData,
} from 'utils/utils';
import ExcelExport from 'components/ExcelExport';
import { isEmpty } from 'lodash';
import { openTab } from 'utils/menuTab';
import queryString from 'querystring';
import FilterForm from './FilterForm';
import ListTableHead from './ListTableHead';
import ListTableLine from './ListTableLine';
import CreateDrawer from './Drawer/CreateDrawer';

@connect(({ equipmentInspectionMaintenance, loading }) => ({
  equipmentInspectionMaintenance,
  tenantId: getCurrentOrganizationId(),
  fetchHeadLoading: loading.effects['equipmentInspectionMaintenance/fetchHeadData'],
  fetchLineLoading: loading.effects['equipmentInspectionMaintenance/fetchLineData'],
  allSyncLoading: loading.effects['equipmentInspectionMaintenance/allSync'],
  partSyncLoading: loading.effects['equipmentInspectionMaintenance/partSync'],
  saveHeadDataLoading: loading.effects['equipmentInspectionMaintenance/saveHeadData'],
  saveLineDataLoading: loading.effects['equipmentInspectionMaintenance/saveLineData'],
  deleteHeadDataLoading: loading.effects['equipmentInspectionMaintenance/deleteHeadData'],
  deleteLineDataLoading: loading.effects['equipmentInspectionMaintenance/deleteLineData'],
}))
export default class EquipmentLedgerManagement extends Component {
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
      type: 'equipmentInspectionMaintenance/getSiteList',
      payload: {},
    });
    dispatch({
      type: 'equipmentInspectionMaintenance/batchLovData',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'equipmentInspectionMaintenance/getDataType',
      payload: {
        tenantId,
        typeGroup: 'TAG_VALUE_TYPE',
        module: 'GENERAL',
      },
    });
    dispatch({
      type: 'equipmentInspectionMaintenance/getCollectionMethod',
      payload: {
        tenantId,
        typeGroup: 'TAG_COLLECTION_METHOD',
        module: 'GENERAL',
      },
    });
    this.fetchHeadData();
  }

  // 获取头数据
  @Bind()
  fetchHeadData(fields = {}) {
    const { dispatch } = this.props;
    const fieldsValue = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'equipmentInspectionMaintenance/fetchHeadData',
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
              type: 'equipmentInspectionMaintenance/updateState',
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

  // 选中头
  @Bind()
  onSelectHead(selectedRowKeys, selectedRows) {
    this.setState(
      // eslint-disable-next-line react/no-unused-state
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
    dispatch({
      type: 'equipmentInspectionMaintenance/fetchLineData',
      payload: {
        manageTagGroupId: this.state.selectedHeads[0].manageTagGroupId,
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
    if (record.manageTagGroupId) {
      this.setState({ drawerEditor: true });
    } else {
      this.setState({ drawerEditor: false });
    }
    const {
      dispatch,
      equipmentInspectionMaintenance: {
        defaultSite = {},
      },
    } = this.props;
    dispatch({
      type: 'equipmentInspectionMaintenance/updateState',
      payload: {
        detail: {
          siteName: defaultSite.siteName,
          siteId: defaultSite.siteId,
          enableFlag: 'Y',
          ...record,
        },
      },
    });
    this.handleModalVisible(flag);
  }

  // 模态框控制
  @Bind()
  handleModalVisible(val) {
    this.setState({ visible: val });
  }

  // 保存头数据
  @Bind()
  saveHeadData(val) {
    const {
      dispatch,
      equipmentInspectionMaintenance: {
        detail = {},
      },
    } = this.props;
    dispatch({
      type: 'equipmentInspectionMaintenance/saveHeadData',
      payload: {
        ...detail,
        ...val,
      },
    }).then(res => {
      if (res) {
        this.handleModalVisible(false);
        notification.success();
        this.fetchHeadData();
      }
    });
  }

  // 行新增数据
  @Bind()
  handleCreate() {
    this.setState({ lineEditor: false });
    const {
      dispatch,
      equipmentInspectionMaintenance: { lineData = [], lineDataPagination = {} },
    } = this.props;
    const { selectedHeads } = this.state;
    if (selectedHeads.length === 0) {
      notification.error({ message: '请勾选数据！' });
    } else {
      dispatch({
        type: 'equipmentInspectionMaintenance/updateState',
        payload: {
          lineData: [
            {
              manageTagId: new Date().getTime(),
              _status: 'create',
              flag: true,
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
      equipmentInspectionMaintenance: { lineData = [], lineDataPagination = {} },
    } = this.props;
    const params = getEditTableData(lineData, ['manageTagId']);
    const maxAndmin = params.filter(item => {
      return item.maximalValue < item.minimumValue;
    });
    if (maxAndmin.length > 0) {
      notification.error({ message: '最大值不可小于最小值！' });
    } else {
      const arr = [];
      params.forEach(item => {
        arr.push({
          ...this.state.selectedHeads[0],
          ...item,
          accuracy: item.accuracy && item.accuracy,
          minimumValue: item.minimumValue && item.minimumValue,
          standardValue: item.standardValue && item.standardValue,
          maximalValue: item.maximalValue && item.maximalValue,
          tenantId: getCurrentOrganizationId(),
        });
      });
      if (Array.isArray(params) && params.length > 0) {
        dispatch({
          type: 'equipmentInspectionMaintenance/saveLineData',
          payload: {
            params: arr,
          },
        }).then(res => {
          if (res) {
            notification.success();
            dispatch({
              type: 'equipmentInspectionMaintenance/fetchHeadData',
              payload: {
                page: isEmpty(lineDataPagination) ? {} : lineDataPagination,
              },
            });
            this.fetchLineData();
          }
        });
      }
    }
  }

  // 行数据删除
  @Bind()
  deleteData(record, index) {
    const {
      dispatch,
      equipmentInspectionMaintenance: { lineData = [], lineDataPagination = {} },
    } = this.props;
    if (!record.flag) {
      dispatch({
        type: 'equipmentInspectionMaintenance/deleteLineData',
        payload: {
          tagId: record.tagId,
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
        type: 'equipmentInspectionMaintenance/updateState',
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
      equipmentInspectionMaintenance: { lineData = [] },
    } = this.props;
    const newList = lineData.map(item =>
      item.manageTagId === record.manageTagId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'equipmentInspectionMaintenance/updateState',
      payload: {
        lineData: [...newList],
      },
    });
  }

  // 增量同步
  @Bind()
  partSync() {
    const {
      dispatch,
      equipmentInspectionMaintenance: {
        lineDataPagination = {},
      },
    } = this.props;
    if (this.state.selectedHeads.length > 0) {
      dispatch({
        type: 'equipmentInspectionMaintenance/partSync',
        payload: {
          manageTagGroupId: this.state.selectedHeads[0].manageTagGroupId,
        },
      }).then(res => {
        if (res) {
          notification.success();
          dispatch({
            type: 'equipmentInspectionMaintenance/fetchHeadData',
            payload: {
              page: lineDataPagination,
            },
          });
          this.fetchLineData();
        }
      });
    } else {
      notification.error({ message: '请勾选数据！' });
    }
  }

  // 全量同步
  @Bind()
  allSync() {
    const {
      dispatch,
      equipmentInspectionMaintenance: {
        lineDataPagination = {},
      },
    } = this.props;
    if (this.state.selectedHeads.length > 0) {
      dispatch({
        type: 'equipmentInspectionMaintenance/allSync',
        payload: {
          manageTagGroupId: this.state.selectedHeads[0].manageTagGroupId,
        },
      }).then(res => {
        if (res) {
          notification.success();
          dispatch({
            type: 'equipmentInspectionMaintenance/fetchHeadData',
            payload: {
              page: lineDataPagination,
            },
          });
          this.fetchLineData();
        }
      });
    } else {
      notification.error({ message: '请勾选数据！' });
    }
  }

  // 头数据删除
  @Bind()
  deleteHeadData() {
    const { dispatch } = this.props;
    const { selectedHeads = [] } = this.state;
    dispatch({
      type: 'equipmentInspectionMaintenance/deleteHeadData',
      payload: {
        manageTagGroupId: selectedHeads[0].manageTagGroupId,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.fetchHeadData();
      }
    });
  }

  // 导出
  @Bind()
  handleGetFormValue() {
    const fieldsValue = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    return filterNullValueObject({ ...fieldsValue });
  }

  // 导入
  @Bind()
  exImportExcel() {
    openTab({
      // 编码是后端给出的
      key: `/hhme/equipment-inspection-maintenance/data-import/HME.EQUIPMENT_TAG`,
      title: intl.get('hhme.machineBasic.view.message.import').d('设备点检&保养项目维护导入'),
      search: queryString.stringify({
        action: intl.get('hhme.machineBasic.view.message.import').d('设备点检&保养项目维护导入'),
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
      equipmentInspectionMaintenance: {
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
      // allSyncLoading,
      partSyncLoading,
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
        <Header title="设备点检&保养项目维护">
          <Button type="primary" loading={saveLineDataLoading} icon="save" onClick={() => this.saveLineData({}, true)}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          <Button type="primary" icon="plus" onClick={() => this.handleAddHeadData({}, true)}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Popconfirm
            title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
            onConfirm={() => this.deleteHeadData()}
          >
            <Button type="primary" loading={deleteHeadDataLoading} icon="delete">
              {intl.get('hzero.common.button.delete').d('删除')}
            </Button>
          </Popconfirm>
          <ExcelExport
            exportAsync
            requestUrl={`/mes/v1/${getCurrentOrganizationId()}/equipment-manage-tag-group/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue()}
          />
          <Button type="primary" onClick={() => this.exImportExcel()}>
            {intl.get(`tarzan.acquisition.collection.button.create`).d('设备点检&保养项目维护导入')}
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTableHead {...headListProps} />
          <Row style={{ marginTop: '10px' }}>
            <Button
              type="primary"
              style={{ margin: '0px 10px 10px 0px' }}
              onClick={() => this.partSync()}
              loading={partSyncLoading}
            >
              增量同步
            </Button>
            {/* <Button
              type="primary"
              style={{ margin: '0px 10px 10px 0px' }}
              onClick={() => this.allSync()}
              loading={allSyncLoading}
            >
              全量同步
            </Button> */}
          </Row>
          <ListTableLine {...lineListProps} />
          {this.state.visible && <CreateDrawer {...createProps} />}
        </Content>
      </React.Fragment>
    );
  }
}
