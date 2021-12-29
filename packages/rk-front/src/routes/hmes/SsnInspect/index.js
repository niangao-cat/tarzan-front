/*
 * @Description: 标准件检验标准维护
 * @Version: 0.0.1
 * @Autor: li.zhang13@hand-china.com
 * @Date: 2021-02-01 10:45:11
 */

import React, { Component } from 'react';
import { Button } from 'hzero-ui';
// import { Fields, Button as ButtonPermission } from 'components/Permission';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import { openTab } from 'utils/menuTab';
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
import queryString from 'querystring';
import FilterForm from './FilterForm';
import ListTableHead from './ListTableHead';
import ListTableLine from './ListTableLine';
import CreateDrawer from './Drawer/CreateDrawer';
import ListTableDetail from './ListTableDetail';
import ListHistoryTable from './Drawer/ListHistoryTable';

@connect(({ ssnInspect, loading }) => ({
  ssnInspect,
  tenantId: getCurrentOrganizationId(),
  fetchHeadLoading: loading.effects['ssnInspect/fetchHeadData'],
  fetchLineLoading: loading.effects['ssnInspect/fetchLineData'],
  fetchDetailLoading: loading.effects['ssnInspect/fetchDetailData'],
  saveHeadDataLoading: loading.effects['ssnInspect/saveHeadData'],
  saveLineDataLoading: loading.effects['ssnInspect/saveLineData'],
  saveDetailDataLoading: loading.effects['ssnInspect/saveDetailData'],
  deleteHeadDataLoading: loading.effects['ssnInspect/deleteHeadData'],
  deleteLineDataLoading: loading.effects['ssnInspect/deleteLineData'],
  deleteDetailDataLoading: loading.effects['ssnInspect/deleteDetailData'],
  getHeaderHistoryDataLoading: loading.effects['ssnInspect/getHeaderHistoryData'],
  getLineHistoryDataLoading: loading.effects['ssnInspect/getLineHistoryData'],
}))
export default class SsnInspect extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selectedHeadKeys: [],
      selectedHeads: [],
      selectedLine: {},
      drawerEditor: false, // 有效性是否可编辑
      lineEditor: false,
      detailEditor: false,
      historyVisible: false,
      objectType: '',
      selectedLineData: [],
    };
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    this.fetchHeadData();
    dispatch({
      type: 'ssnInspect/init',
      payload: {
        tenantId,
      },
    });
  }

  // 保存头数据或修改头数据
  @Bind()
  saveHeadData(val) {
    const {
      dispatch,
      ssnInspect: {
        detail = {},
      },
      tenantId,
    } = this.props;
    let type = '';
    if (detail.ssnInspectHeaderId) {
      type = 'ssnInspect/updateHeadData';
    } else {
      type = 'ssnInspect/saveHeadData';
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
      type: 'ssnInspect/fetchHeadData',
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
              type: 'ssnInspect/updateState',
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
      type: 'ssnInspect/deleteHeadData',
      payload: {
        ssnInspectHeaderId: selectedHeads[0].ssnInspectHeaderId,
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
      type: 'ssnInspect/fetchLineData',
      payload: {
        ssnInspectHeaderId: selectedHeads[0].ssnInspectHeaderId,
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
      type: 'ssnInspect/updateState',
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
      ssnInspect: { lineData = [], lineDataPagination = {} },
    } = this.props;
    const { selectedHeads } = this.state;
    if (selectedHeads.length === 0) {
      notification.error({ message: '请勾选数据！' });
    } else {
      dispatch({
        type: 'ssnInspect/updateState',
        payload: {
          lineData: [
            {
              ssnInspectLineId: new Date().getTime(),
              _status: 'create',
              coupleFlag: 'N',
              judgeFlag: 'N',
              cosCoupleFlag: 'N',
            },
            ...lineData,
          ],
          lineDataPagination: addItemToPagination(lineData.length, lineDataPagination),
        },
      });
    }
  }

  // 保存行数据或行明细数据
  @Bind()
  saveLineData() {
    const {
      dispatch,
      tenantId,
      ssnInspect: { lineData = [], lineDataPagination = {}, detailData = [] },
    } = this.props;
    const params = getEditTableData(lineData, ['ssnInspectLineId']);
    const params1 = getEditTableData(detailData, ['ssnInspectDetailId']);
    const arrNew = []; // 新增数组
    const arrUpd = []; // 修改数组
    if(params.length>0){
      params.forEach(item => {
        if (item._status === 'create') {
          arrNew.push({
            ssnInspectHeaderId: this.state.selectedHeads[0].ssnInspectHeaderId,
            ...item,
            tenantId,
          });
        }
        if (item._status === 'update') {
          arrUpd.push({
            ssnInspectHeaderId: this.state.selectedHeads[0].ssnInspectHeaderId,
            ...item,
            tenantId,
          });
        }
      });
      if (Array.isArray(params) && params.length > 0) {
        if (arrUpd.length > 0) {
          dispatch({
            type: 'ssnInspect/updateLineData',
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
            type: 'ssnInspect/saveLineData',
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
    };
    if(params1.length>0){
      params1.forEach(item => {
        if (item._status === 'create') {
          arrNew.push({
            ssnInspectLineId: this.state.selectedLine.ssnInspectLineId,
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
      if (Array.isArray(params1) && params1.length > 0) {
        if (arrUpd.length > 0) {
          dispatch({
            type: 'ssnInspect/updateDetailData',
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
            type: 'ssnInspect/saveDetailData',
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
    };
  }

  // 行数据删除
  @Bind()
  deleteData(record, index) {
    const {
      dispatch,
      ssnInspect: { lineData = [], lineDataPagination = {} },
    } = this.props;
    if (!record._status) {
      dispatch({
        type: 'ssnInspect/deleteLineData',
        payload: {
          ssnInspectLineId: record.ssnInspectLineId,
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
        type: 'ssnInspect/updateState',
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
      ssnInspect: { lineData = [] },
    } = this.props;
    const newList = lineData.map(item =>
      item.ssnInspectLineId === record.ssnInspectLineId ? { ...item, _status: flag ? 'update' : ''} : item
    );
    dispatch({
      type: 'ssnInspect/updateState',
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
      type: 'ssnInspect/fetchDetailData',
      payload: {
        ssnInspectLineId: fields.ssnInspectLineId,
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
      ssnInspect: { detailData = [] },
    } = this.props;
    const newList = detailData.map(item =>
      item.ssnInspectDetailId === record.ssnInspectDetailId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'ssnInspect/updateState',
      payload: {
        detailData: [...newList],
      },
    });
  }

    // 行明细新增数据
    @Bind()
    handleCreatedetail() {
      this.setState({ detailEditor: false });
      const {
        dispatch,
        ssnInspect: { detailData = [], detailDataPagination = {} },
      } = this.props;
      const { selectedHeads, selectedLine} = this.state;
      if (selectedHeads.length === 0) {
        notification.error({ message: '请勾选头数据！' });
      } else if(!selectedLine.ssnInspectLineId){
        notification.error({ message: '请选择行数据！' });
      }else{
        dispatch({
          type: 'ssnInspect/updateState',
          payload: {
            detailData: [
              {
                ssnInspectDetailId: new Date().getTime(),
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
      ssnInspect: { detailData = [], detailDataPagination = {} },
    } = this.props;
    if (!record._status) {
      dispatch({
        type: 'ssnInspect/deleteDetailData',
        payload: {
          ssnInspectDetailId: record.ssnInspectDetailId,
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
        type: 'ssnInspect/updateState',
        payload: {
          detailData,
          detailDataPagination: delItemToPagination(1, detailDataPagination),
        },
      });
    }
  }

  // 导入
  @Bind()
  handleBatchImport() {
    openTab({
      key: '/hmes/ssn-inspect/data-import/HME.SSN_INSPECT',
      title: intl.get('hmes.ssn-inspect.view.message.import').d('标准件检验标准导入'),
      search: queryString.stringify({
        action: intl.get('hmes.ssn-inspect.view.message.import').d('标准件检验标准导入'),
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

  // 头历史记录
  @Bind()
  handleSearchHeaderHistoryModal(page={}) {
    // 判断是否选择数据， 没有则报错
    if(this.state.selectedHeads.length===0){
      return notification.error({message: '请先选中数据'});
    }

    const { dispatch } = this.props;
    this.setState({historyVisible: true});
    this.setState({objectType: 'HEADER'});
    dispatch({
      type: 'ssnInspect/getHeaderHistoryData',
      payload: {
        ssnInspectHeaderId: this.state.selectedHeads[0].ssnInspectHeaderId,
        page,
      },
    });
  }

  @Bind()
  getSelectedLine(record) {
    this.setState({selectedLineData: record});
  }

  // 行历史记录
  @Bind()
  handleSearchLineHistoryModal(page={}) {
    // 判断是否选择数据， 没有则报错
    if(isEmpty(this.state.selectedLineData)){
      return notification.error({message: '请先选中数据'});
    }

    const { dispatch } = this.props;
    this.setState({historyVisible: true});
    this.setState({objectType: 'LINE'});

    dispatch({
      type: 'ssnInspect/getLineHistoryData',
      payload: {
        ssnInspectLineId: this.state.selectedLineData.ssnInspectLineId,
        page,
      },
    });
  }

  /**
   *  渲染页面
   * @returns {*}
   */
  render() {
    const { visible, selectedHeadKeys, drawerEditor, lineEditor, detailEditor, selectedLine, historyVisible, objectType} = this.state;
    const {
      ssnInspect: {
        headData = [],
        headDataPagination = {},
        lineData = [],
        lineDataPagination = {},
        detailData = [],
        detailDataPagination = [],
        detail = {},
        workWayMap = [],
        headerHistoryData = [],
        headerHistoryDataPagination = {},
        lineHistoryData = [],
        lineHistoryDataPagination = {},
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
      getHeaderHistoryDataLoading,
      getLineHistoryDataLoading,
    } = this.props;
    const filterProps = {
      tenantId,
      workWayMap,
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
      getSelectedLine: this.getSelectedLine,
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
      handleCreatedetail: this.handleCreatedetail, // 新增数据
      deleteDetailData: this.deleteDetailData, // 删除数据
      handleCleanDetail: this.deleteDetailData, // 清除
      handleEditDetail: this.handleEditDetail, // 取消&编辑
    };
    const createProps = {
      visible,
      detail,
      tenantId,
      workWayMap,
      drawerEditor,
      saveHeadDataLoading,
      onOk: this.saveHeadData,
      onCancel: this.handleAddHeadData,
    };
    const historyModalProps = {
      objectType,
      loading: getHeaderHistoryDataLoading || getLineHistoryDataLoading,
      dataSources: { headerHistoryData, lineHistoryData },
      paginations: { headerHistoryDataPagination, lineHistoryDataPagination },
      visible: historyVisible,
      onCancel: this.hideOrOpenHistoryModal,
      onSearch: this.handleSearchHistoryModal,
    };
    return (
      <React.Fragment>
        <Header title="标准件检验标准维护">
          {/* <Popconfirm
            title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
            onConfirm={() => this.deleteHeadData()}
          >
            <Button type="primary" loading={deleteHeadDataLoading} icon="delete">
              {intl.get('hzero.common.button.delete').d('删除')}
            </Button>
          </Popconfirm> */}
          <Button type="primary" loading={saveLineDataLoading} icon="save" onClick={() => this.saveLineData({}, true)}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
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
            requestUrl={`/mes/v1/${getCurrentOrganizationId()}/hme-ssn-inspect-headers/ssn-inspect-export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue()}
          />
          <Button
            type="primary"
            onClick={() => this.handleSearchHeaderHistoryModal()}
          >
            {intl.get('hzero.common.button.history').d('标准件历史记录')}
          </Button>
          <Button
            type="primary"
            onClick={() => this.handleSearchLineHistoryModal()}
          >
            {intl.get('hzero.common.button.history').d('检查项历史记录')}
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTableHead {...headListProps} />
          <ListTableLine {...lineListProps} />
          <ListTableDetail {...detailListProps} />
          {this.state.visible && <CreateDrawer {...createProps} />}
          <ListHistoryTable {...historyModalProps} />
        </Content>
      </React.Fragment>
    );
  }
}
