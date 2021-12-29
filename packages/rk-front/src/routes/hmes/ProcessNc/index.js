/*
 * @Description: 工序不良判定标准维护
 * @Version: 0.0.1
 * @Autor: li.zhang13@hand-china.com
 * @Date: 2021-01-21 09:36:44
 */

import React, { Component } from 'react';
import { Button } from 'hzero-ui';
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
import { isEmpty } from 'lodash';
import ExcelExport from 'components/ExcelExport';
import { openTab } from 'utils/menuTab';
import queryString from 'querystring';
import FilterForm from './FilterForm';
import ListTableHead from './ListTableHead';
import ListTableLine from './ListTableLine';
import CreateDrawer from './Drawer/CreateDrawer';
import ListTableDetail from './ListTableDetail';

@connect(({ processNc, loading }) => ({
  processNc,
  tenantId: getCurrentOrganizationId(),
  fetchHeadLoading: loading.effects['processNc/fetchHeadData'],
  fetchLineLoading: loading.effects['processNc/fetchLineData'],
  fetchDetailLoading: loading.effects['processNc/fetchDetailData'],
  saveHeadDataLoading: loading.effects['processNc/saveHeadData'],
  saveLineDataLoading: loading.effects['processNc/saveLineData'],
  saveDetailDataLoading: loading.effects['processNc/saveDetailData'],
  deleteHeadDataLoading: loading.effects['processNc/deleteHeadData'],
  deleteLineDataLoading: loading.effects['processNc/deleteLineData'],
  deleteDetailDataLoading: loading.effects['processNc/deleteDetailData'],
}))
export default class ProcessNc extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selectedHeadKeys: [],
      selectedHeads: [],
      selectedLine: {},
      lineEditor: false,
      detailEditor: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.fetchHeadData();
    dispatch({
      type: 'processNc/fetchStatueSelectList',
      payload: {
        module: 'GENERAL',
        statusGroup: 'TAG_GROUP_STATUS',
        type: 'statusList',
      },
    });
  }

  // 保存头数据或修改头数据
  @Bind()
  saveHeadData(val) {
    const {
      dispatch,
      processNc: {
        detail = {},
      },
      tenantId,
    } = this.props;
    let type = '';
    if (detail.headerId) {
      type = 'processNc/updateHeadData';
    } else {
      type = 'processNc/saveHeadData';
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
      type: 'processNc/fetchHeadData',
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
              type: 'processNc/updateState',
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
      type: 'processNc/deleteHeadData',
      payload: {
        headerId: selectedHeads[0].headerId,
        // tenantId,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.fetchHeadData();
        this.fetchLineData();
        this.fetchDetailData();
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
        this.fetchDetailData();
      }
    );
  }

  // 获取行数据
  @Bind()
  fetchLineData(fields = {}) {
    const { dispatch } = this.props;
    const { selectedHeads } = this.state;
    dispatch({
      type: 'processNc/fetchLineData',
      payload: {
        headerId: selectedHeads[0].headerId,
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
      type: 'processNc/updateState',
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
      processNc: { lineData = [], lineDataPagination = {} },
    } = this.props;
    const { selectedHeads } = this.state;
    if (selectedHeads.length === 0) {
      notification.error({ message: '请勾选数据！' });
    } else {
      dispatch({
        type: 'processNc/updateState',
        payload: {
          lineData: [
            {
              lineId: new Date().getTime(),
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
      processNc: { lineData = [], lineDataPagination = {} },
    } = this.props;
    const params = getEditTableData(lineData, ['lineId']);
    const arrNew = []; // 新增数组
    const arrUpd = []; // 修改数组
    params.forEach(item => {
      if (item._status === 'create') {
        arrNew.push({
          headerId: this.state.selectedHeads[0].headerId,
          ...item,
          tenantId,
        });
      }
      if (item._status === 'update') {
        arrUpd.push({
          headerId: this.state.selectedHeads[0].headerId,
          ...item,
          tenantId,
        });
      }
    });
    if (Array.isArray(params) && params.length > 0) {
      if (arrUpd.length > 0) {
        dispatch({
          type: 'processNc/updateLineData',
          payload: {
            params: arrUpd,
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.fetchLineData(lineDataPagination);
          }
        });
      }if(arrNew.length > 0){
        dispatch({
          type: 'processNc/saveLineData',
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
  }

  // 行数据删除
  @Bind()
  deleteData(record, index) {
    const {
      dispatch,
      processNc: { lineData = [], lineDataPagination = {} },
    } = this.props;
    if (!record._status) {
      dispatch({
        type: 'processNc/deleteLineData',
        payload: {
          lineId: record.lineId,
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.fetchLineData();
          this.fetchDetailData();
        }
      });
    } else {
      lineData.splice(index, 1);
      dispatch({
        type: 'processNc/updateState',
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
      processNc: { lineData = [] },
    } = this.props;
    const newList = lineData.map(item =>
      item.lineId === record.lineId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'processNc/updateState',
      payload: {
        lineData: [...newList],
      },
    });
  }


  // 获取行明细数据
  @Bind()
  fetchDetailData(fields = {}) {
    const { dispatch } = this.props;
    this.setState({selectedLine: fields});
    dispatch({
      type: 'processNc/fetchDetailData',
      payload: {
        headerId: fields.headerId,
        lineId: fields.lineId,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   * 编辑
   * 行明细数据切换编辑状态
   * @param {Object} record 操作对象
   * @param {Boolean} flag  编辑/取消标记
   */
  @Bind()
  handleEditDetail(record = {}, flag) {
    this.setState({ detailEditor: false });
    const {
      dispatch,
      processNc: { detailData = [] },
    } = this.props;
    const newList = detailData.map(item =>
      item.detailId === record.detailId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'processNc/updateState',
      payload: {
        detailData: [...newList],
      },
    });
  }

  // 行明细新增数据
  @Bind()
  handleCreatedDetail() {
    this.setState({ detailEditor: false });
    const {
      dispatch,
      processNc: { detailData = [], detailDataPagination = {} },
    } = this.props;
    const { selectedHeads } = this.state;
    if (selectedHeads.length === 0) {
      notification.error({ message: '请勾选数据！' });
    } else {
      dispatch({
        type: 'processNc/updateState',
        payload: {
          detailData: [
            {
              detailId: new Date().getTime(),
              _status: 'create',
            },
            ...detailData,
          ],
          detailDataPagination: addItemToPagination(detailData.length, detailDataPagination),
        },
      });
    }
  }

  // 行明细数据删除
  @Bind()
  deleteDetailData(record, index) {
    const {
      dispatch,
      processNc: { detailData = [], detailDataPagination = {} },
    } = this.props;
    if (!record._status) {
      dispatch({
        type: 'processNc/deleteDetailData',
        payload: {
          detailId: record.detailId,
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.fetchDetailData(record);
        }
      });
    } else {
      detailData.splice(index, 1);
      dispatch({
        type: 'processNc/updateState',
        payload: {
          detailData,
          detailDataPagination: delItemToPagination(1, detailDataPagination),
        },
      });
    }
  }

  // 保存行明细数据
  @Bind()
  saveDetailData() {
    const {
      dispatch,
      tenantId,
      processNc: { detailData = [] },
    } = this.props;
    const params = getEditTableData(detailData, ['detailId']);
    const arrNew = []; // 新增数组
    const arrUpd = []; // 修改数组
    params.forEach(item => {
      if (item._status === 'create') {
        arrNew.push({
          headerId: this.state.selectedLine.headerId,
          lineId: this.state.selectedLine.lineId,
          ...item,
          tenantId,
        });
      }
      if (item._status === 'update') {
        arrUpd.push({
          ...item,
          tenantId,
        });
      }
    });
    if (Array.isArray(params) && params.length > 0) {
      if (arrUpd.length > 0) {
        dispatch({
          type: 'processNc/updateDetailData',
          payload: {
            params: arrUpd,
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.fetchDetailData(arrUpd[0]);
          }
        });
      }if(arrNew.length > 0){
        dispatch({
          type: 'processNc/saveDetailData',
          payload: {
            params: arrNew,
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.fetchDetailData(arrNew[0]);
          }
        });
      }
    }
  }

  // 导入方法
  @Bind()
  exImportExcel() {
    openTab({
      // 编码是后端给出的
      key: `/hmes/process-nc/data-import/HME.PROCESS_NC_IMPORT`,
      // MenuTab 的国际化必须使用 hzero.common 开头(或者其他公用多语言)
      title: intl.get('hmes.process-nc.view.message.import').d('工序不良判定标准维护批量导入'),
      search: queryString.stringify({
        action: intl.get('hmes.process-nc.view.message.import').d('工序不良判定标准维护批量导入'),
      }),
    });
  }

  // 导出
  @Bind()
  handleGetFormValue() {
    const fieldsValue = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    return filterNullValueObject({ ...fieldsValue });
  }

  /**
   *  渲染页面
   * @returns {*}
   */
  render() {
    const { visible, selectedHeadKeys, lineEditor, detailEditor, selectedLine} = this.state;
    const {
      processNc: {
        headData = [],
        headDataPagination = {},
        lineData = [],
        lineDataPagination = {},
        detailData = [],
        detailDataPagination = [],
        detail = {},
        statusList = [],
      },
      tenantId,
      fetchHeadLoading,
      fetchLineLoading,
      fetchDetailLoading,
      saveHeadDataLoading,
      saveLineDataLoading,
      // deleteHeadDataLoading,
      deleteLineDataLoading,
      deleteDetailDataLoading,
    } = this.props;
    const filterProps = {
      tenantId,
      statusList,
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
    const lineListProps = {
      dataSource: lineData,
      pagination: lineDataPagination,
      onSearch: this.fetchLineData,
      canEdit: true,
      tenantId,
      lineEditor,
      loading: fetchLineLoading,
      deleteLineDataLoading,
      selectedHeadKeys,
      handleCreate: this.handleCreate, // 新增数据
      deleteData: this.deleteData, // 删除数据
      handleCleanLine: this.deleteData, // 清除
      handleEditLine: this.handleEditLine, // 取消&编辑
      handleDetailDate: this.fetchDetailData,
      handleSaveLine: this.saveLineData,
    };
    const detailListProps = {
      dataSource: detailData,
      pagination: detailDataPagination,
      onSearch: this.fetchDetailData,
      canEdit: true,
      tenantId,
      detailEditor,
      selectedLine,
      loading: fetchDetailLoading,
      deleteDetailDataLoading,
      handleCreateDetail: this.handleCreatedDetail, // 新增数据
      deleteDetailData: this.deleteDetailData, // 删除数据
      handleCleanDetail: this.deleteDetailData, // 清除
      handleEditDetail: this.handleEditDetail, // 取消&编辑
      handleSaveDetail: this.saveDetailData,
    };
    const createProps = {
      visible,
      detail,
      tenantId,
      statusList,
      saveHeadDataLoading,
      onOk: this.saveHeadData,
      onCancel: this.handleAddHeadData,
    };
    return (
      <React.Fragment>
        <Header title="工序不良判定标准维护">
          {/* <Popconfirm
            title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
            onConfirm={() => this.deleteHeadData()}
          >
            <Button type="primary" loading={deleteHeadDataLoading} icon="delete">
              {intl.get('hzero.common.button.delete').d('删除')}
            </Button>
          </Popconfirm> */}
          <Button type="primary" loading={saveLineDataLoading} icon="save">
            {/* onClick={() => this.saveLineData({}, true)} */}
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          <Button type="primary" icon="plus" onClick={() => this.handleAddHeadData({}, true)}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button type="primary" onClick={() => this.exImportExcel()}>
            {intl.get(`tarzan.button.import`).d('导入')}
          </Button>
          <ExcelExport
            exportAsync
            requestUrl={`/mes/v1/${getCurrentOrganizationId()}/hme-process-nc-headers/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue()}
          />
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTableHead {...headListProps} />
          <ListTableLine {...lineListProps} />
          <ListTableDetail {...detailListProps} />
          {this.state.visible && <CreateDrawer {...createProps} />}
        </Content>
      </React.Fragment>
    );
  }
}
