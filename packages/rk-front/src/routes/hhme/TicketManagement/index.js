/* eslint-disable no-dupe-keys */
/*
 * @Description: 工单管理
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-03-25 10:37:57
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-10-20 10:46:25
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Modal } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import Cookies from 'universal-cookie';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { isEmpty, isUndefined } from 'lodash';
import moment from 'moment';
import FilterForm from './FilterForm';
import TableList from './Component/TableList';
import MaterialRequirements from './Component/MaterialRequirements';
import styles from './index.less';
import MoreSearchModal from './MoreSearchModal';
import EditorDrawer from './Component/EditorDrawer';
import EoCreateFormDrawer from './Component/EoCreateFormDrawer';
import DistributionLineModal from './Component/DistributionLineModal';

const cookies = new Cookies();

@connect(({ ticketManagement, loading }) => ({
  ticketManagement,
  tenantId: getCurrentOrganizationId(),
  fetchTicketList: loading.effects['ticketManagement/handleGetTicketList'],
  fetchLineLoading: loading.effects['ticketManagement/fetchLine'],
  checkTichetLoading: loading.effects['ticketManagement/checkTichet'],
  ticketReleaseLoading: loading.effects['ticketManagement/ticketRelease'],
  buttonSendLoading: loading.effects['ticketManagement/buttonSend'],
  fetchComponentMeaterialLoading: loading.effects['ticketManagement/fetchComponentMeaterial'],
}))
export default class TicketManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      editorVisible: false,
      distributionLineVisible: false,
      eoCreateFormDrawerVisible: false,
      selectedRowKeys: [],
      selectedRows: [],
      selectedProdLineRowKeys: [], // 产线
      selectedProdLineRows: [],
      record: {}, // 工单行数据
      woRecordDetail: {}, // 明细工单行数据
      cacheMoreSearch: {}, // 更多查询的缓存数据
    };
  }

  filterForm;

  moreFilterForm;

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    // 获取工单列表数据库
    // this.handleGetTicketList();
    // const { dispatch, tenantId } = this.props;
    // 批量查询独立值集
    dispatch({
      type: 'ticketManagement/batchLovData',
      payload: {
        tenantId,
      },
    });
    // 查询事业部
    dispatch({
      type: 'ticketManagement/fetchDepartment',
      payload: {
        tenantId,
      },
    }).then(res => {
      if(this.filterForm) {
        this.filterForm.setFieldsValue({
          departmentName: (res.find(e => e.defaultOrganizationFlag === 'Y') || {}).areaCode,
        });
      }
    });
  }

  @Bind()
  handleGetTicketList(fields = {}) {
    const { dispatch } = this.props;
    const filterValue = this.filterForm === undefined ? {} : this.filterForm.getFieldsValue();
    const { cacheMoreSearch } = this.state;
    dispatch({
      type: 'ticketManagement/updateState',
      payload: {
        pageMoreSearch: fields,
      },
    });
    dispatch({
      type: 'ticketManagement/handleGetTicketList',
      payload: {
        page: isEmpty(fields) ? {} : fields,
        ...filterValue,
        deliveryDateFrom: filterValue.deliveryDateFrom &&
          filterValue.deliveryDateFrom.format('YYYY-MM-DD HH:mm:ss'),
        ...cacheMoreSearch,
        deliveryDateTo: filterValue.deliveryDateTo && filterValue.deliveryDateTo.format('YYYY-MM-DD HH:mm:ss'),
        deliveryDate: cacheMoreSearch.deliveryDate && cacheMoreSearch.deliveryDate.format('YYYY-MM-DD HH:mm:ss'),
        publishDateFrom: cacheMoreSearch.publishDateFrom && cacheMoreSearch.publishDateFrom.format('YYYY-MM-DD HH:mm:ss'),
        publishDateTo: cacheMoreSearch.publishDateTo && cacheMoreSearch.publishDateTo.format('YYYY-MM-DD HH:mm:ss'),
        planStartTimeFrom: cacheMoreSearch.planStartTimeFrom && cacheMoreSearch.planStartTimeFrom.format('YYYY-MM-DD HH:mm:ss'),
        planStartTimeTo: cacheMoreSearch.planStartTimeTo && cacheMoreSearch.planStartTimeTo.format('YYYY-MM-DD HH:mm:ss'),
        creationDateFrom: cacheMoreSearch.creationDateFrom && cacheMoreSearch.creationDateFrom.format('YYYY-MM-DD HH:mm:ss'),
        creationDateTo: cacheMoreSearch.creationDateTo && cacheMoreSearch.creationDateTo.format('YYYY-MM-DD HH:mm:ss'),
        planEndTimeFrom: cacheMoreSearch.planEndTimeFrom && cacheMoreSearch.planEndTimeFrom.format('YYYY-MM-DD HH:mm:ss'),
        planEndTimeTo: cacheMoreSearch.planEndTimeTo && cacheMoreSearch.planEndTimeTo.format('YYYY-MM-DD HH:mm:ss'),
        lastUpdateDateFrom: cacheMoreSearch.lastUpdateDateFrom && cacheMoreSearch.lastUpdateDateFrom.format('YYYY-MM-DD HH:mm:ss'),
        lastUpdateDateTo: cacheMoreSearch.lastUpdateDateTo && cacheMoreSearch.lastUpdateDateTo.format('YYYY-MM-DD HH:mm:ss'),
      },
    });
  }

  // 更多查询
  @Bind()
  handleMoreSearch(val) {
    this.setState({ visible: val });
  }

  // 隐藏模态框
  @Bind()
  hideModal() {
    this.setState({ visible: false });
  }

  // 隐藏编辑框
  @Bind()
  hideEditorModal() {
    this.setState({ editorVisible: false, record: {} });
  }

  /**
   * 数据行选择操作
   */
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRows) {
    // eslint-disable-next-line react/no-unused-state
    this.setState({ selectedRowKeys, selectedRows });
  }

  // 打开编辑抽屉
  @Bind()
  handleOpenEditorDrawer(record, flag) {
    this.setState({ record, editorVisible: flag });
  }

  // 编辑抽屉保存-修改备注及交期
  @Bind()
  handleSave(fieldsValue, record) {
    const { dispatch } = this.props;
    const params = [];
    params.push(
      {
        attrName: 'wo_remark',
        attrValue: fieldsValue.woRemark,
      },
      {
        attrName: 'delivery_date',
        attrValue: fieldsValue.deliveryDate && fieldsValue.deliveryDate.format('YYYY-MM-DD HH:mm:ss'),
      }
    );
    dispatch({
      type: 'ticketManagement/updateRemarkAndDeliveryDate',
      payload: {
        orderAttrList: params,
        workOrderId: record.workOrderId,
      },
    }).then(res => {
      if (res) {
        this.setState({ editorVisible: false });
        this.handleGetTicketList();
        notification.success();
      }
    });
  }

  // 按钮事件
  @Bind()
  buttonOnClick(type) {
    const { selectedRows = [] } = this.state;
    const { dispatch } = this.props;
    let modalMessage = '';
    let typeParam = '';
    const param = this.state.selectedRows;
    const arry = [];
    param.forEach(item => {
      arry.push({
        workOrderId: item.workOrderId,
        unitQty: 1,
        trxReleasedQty: item.qty,
        eoCount: item.qty,
      });
    });
    if (selectedRows.length === 0) {
      notification.error({ message: '请勾选工单' });
    } else {
      // this.setState({ messageVisible: true, type });
      switch (type) {
        case 'STOP': {
          modalMessage = `是否确认暂停${selectedRows.length}个工单？`;
          typeParam = 'ticketManagement/buttonStop';
          break;
        }
        case 'BACK': {
          modalMessage = `是否确认撤销${selectedRows.length}个工单？`;
          typeParam = 'ticketManagement/buttonBack';
          break;
        }
        case 'CLOSE': {
          modalMessage = `是否确认关闭${selectedRows.length}个工单？`;
          typeParam = 'ticketManagement/buttonClose';
          break;
        }
        case 'RELEASE': {
          modalMessage = `是否确认下达${selectedRows.workOrderNum}个工单？`;
          typeParam = 'ticketManagement/buttonClose';
          break;
        }
        default:
          break;
      }
      Modal.confirm({
        title: modalMessage,
        okText: '确定',
        cancelText: '取消',
        onOk() {
          dispatch({
            type: typeParam,
            payload: {
              arry,
            },
          }).then(res => {
            if (res) {
              notification.success();
              this.handleGetTicketList();
            }
          });
        },
      });
    }
  }

  /**
   * 获取查询表单组件this对象
   * @param {object} ref - 查询表单组件this
   */
  @Bind
  handleBindRef(ref) {
    this.filterForm = (ref.props || {}).form;
  }

  /**
   * 获取查询表单组件this对象
   * @param {object} ref - 查询表单组件this
   */
  @Bind
  handleMoreBindRef(ref) {
    this.moreFilterForm = (ref.props || {}).form;
  }

  // 查询
  @Bind()
  handleSearch() {
    this.handleGetTicketList({ page: {} });
  }

  // 更多查询
  @Bind()
  handleMoreSearchModal() {
    const moreFilterForm =
      this.moreFilterForm === undefined ? {} : this.moreFilterForm.getFieldsValue();
    this.setState({ cacheMoreSearch: moreFilterForm }, () => { this.handleGetTicketList({ page: {} }); });
    this.handleMoreSearch(false);
  }

  // 清除缓存查询条件
  @Bind()
  clearCacheMoreSearch() {
    this.setState({ cacheMoreSearch: {} });
  }

  /**
   * @description: 校验当前工单是否可以分配产线
   * @param {type} params
   */
  @Bind()
  checkTichet() {
    const { dispatch } = this.props;
    const { selectedRows = [] } = this.state;
    const workOrderIdList = [];
    selectedRows.forEach(item => {
      workOrderIdList.push({ workOrderId: item.workOrderId });
    });
    if (selectedRows.length === 0) {
      notification.error({ message: '请勾选数据！' });
    } else {
      dispatch({
        type: 'ticketManagement/checkTichet',
        payload: {
          workOrderIdList,
        },
      }).then(res => {
        if (res) {
          this.setDistributionLineVisible(true);
          this.fetchLine({});
        }
      });
    }
  }

  @Bind()
  buttonOnClickRelease() {
    const { dispatch } = this.props;
    const { selectedRows = [] } = this.state;
    const workOrderIdList = [];
    selectedRows.forEach(item => {
      workOrderIdList.push({ workOrderId: item.workOrderId });
    });
    if (selectedRows.length === 1) {
      dispatch({
        type: 'ticketManagement/ticketRelease',
        payload: {
          operationType: "RELEASE",
          workOrderId: workOrderIdList[0].workOrderId,
        },
      }).then(res => {
        if (res.success) {
          notification.success();
          this.fetchLine({});
        } else {
          notification.error({ message: res.message });
        }
      });
    } else {
      if (selectedRows.length === 0) {
        notification.error({ message: '请勾选工单！' });
      }
      if (selectedRows.length > 1) {
        notification.error({ message: '当前只能下达一个工单！' });
      }
    }
  }

  @Bind()
  fetchLine(fields) {
    const { dispatch } = this.props;
    const { selectedRows = [] } = this.state;
    dispatch({
      type: 'ticketManagement/fetchLine',
      payload: {
        materialId: selectedRows[0].materialId,
        ...fields,
      },
    });
  }

  /**
   * @description: 控制分配产线模态框的展开收起
   * @param {Boolean} flag 是否展开的标示
   */
  @Bind()
  setDistributionLineVisible(flag) {
    this.setState({ distributionLineVisible: flag });
  }

  /**
   * @description: 分配产线选中的行数据
   * @param {Array} selectedRowKeys 选中的键
   * @param {Array} selectedRows 选中的内容
   */
  @Bind()
  onSelectRow(selectedRowKeys, selectedRows) {
    this.setState({ selectedProdLineRowKeys: selectedRowKeys, selectedProdLineRows: selectedRows });
  }

  // 保存产线数据
  @Bind()
  saveProdLine() {
    const { dispatch } = this.props;
    const { selectedProdLineRows, selectedRows } = this.state;
    const workOrderIdList = [];
    selectedRows.forEach(item => {
      workOrderIdList.push(item.workOrderId);
    });
    dispatch({
      type: 'ticketManagement/saveProdLine',
      payload: {
        prodLineId: selectedProdLineRows[0].prodLineId,
        workOrderIdList,
      },
    }).then(res => {
      if (res) {
        this.setDistributionLineVisible(false);
        this.setState({ selectedProdLineRowKeys: [], selectedRowKeys: [] });
        this.handleGetTicketList();
      }
    });
  }

  /**
   * BOM编码->装配清单维护
   * 工单编码->生产指令管理
   * 工艺路线编码->工艺路线维护
   * @description: 跳转页面
   * @param {String} type 往哪跳
   */
  @Bind()
  jumpPage(record, type) {
    const { history } = this.props;
    let path;
    switch (type) {
      case 'WO':
        path = `/hhme/ticket-management/production-order-mgt/detail/${record.workOrderId}`;
        break;
      case 'BOM':
        path = `/hhme/ticket-management/assembly-dist/detail/${record.bomId}`;
        break;
      case 'RN':
        path = `/hhme/ticket-management/routes/detail/${record.routerId}`;
        break;
      default:
        break;
    }
    history.push(path);
  }

  // 跳转执行作业管理
  @Bind()
  gotoWorkShop(record){
    cookies.set('workOrderNum', record.workOrderNum);
    cookies.set('workOrderId', record.workOrderId);
    // 打开新得页面
    const { history } = this.props;
    history.push(`/hmes/workshop/execute-operation-management`);

  }

  // sn创建
  @Bind()
  snCreate(record) {
    this.setState({
      eoCreateFormDrawerVisible: true,
      record,
    });
  }

  // sn创建保存
  @Bind()
  snCreateSave(params) {
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketManagement/buttonSend',
      payload: {
        arry: [params],
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.setState({
          eoCreateFormDrawerVisible: false,
          record: {},
        });
        this.handleGetTicketList();
      }
    });
  }

  // sn创建关闭
  @Bind()
  closeFormDrawer() {
    this.setState({
      eoCreateFormDrawerVisible: false,
      record: {},
    });
  }

  @Bind()
  handleComponentMeaterial(record) {
    this.setState({ woRecordDetail: record }, () => {
      this.fetchComponentMeaterial();
    });
  }

  @Bind()
  fetchComponentMeaterial(fields) {
    const { woRecordDetail } = this.state;
    const { dispatch } = this.props;
    const fieldsValue = (this.materialRequirementsForm && filterNullValueObject(this.materialRequirementsForm.getFieldsValue())) || {};
    dispatch({
      type: 'ticketManagement/fetchComponentMeaterial',
      payload: {
        workOrderId: woRecordDetail.workOrderId,
        startDate: isUndefined(fieldsValue.startDate)
          ? null
          : moment(fieldsValue.startDate).format('YYYY-MM-DD HH:mm:ss'),
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  render() {
    const {
      ticketManagement: {
        ticketDataList = [],
        ticketPagination = {},
        lineDataList = [],
        lineDataPagination = {},
        woStatus = [],
        woType = [],
        woShop = [],
        departmentList = [],
        componentMeaterialListPagination = {},
        componentMeaterialList = [],
        dynamicColumns = [],
      },
      fetchTicketList,
      fetchLineLoading,
      checkTichetLoading,
      ticketReleaseLoading,
      fetchComponentMeaterialLoading,
      buttonSendLoading,
      match,
      tenantId,
    } = this.props;
    const {
      selectedRowKeys,
      visible,
      editorVisible,
      distributionLineVisible,
      eoCreateFormDrawerVisible,
      selectedProdLineRowKeys,
      record,
      cacheMoreSearch,
    } = this.state;
    const listProps = {
      onSelectRow: this.handleSelectRow,
      dataSource: ticketDataList,
      pagination: ticketPagination,
      selectedRowKeys,
      onOpenDrawer: this.handleOpenEditorDrawer,
      loading: fetchTicketList,
      onChange: this.handleGetTicketList,
      jumpPage: this.jumpPage,
      snCreate: this.snCreate,
      gotoWorkShop: this.gotoWorkShop,
      handleComponentMeaterial: this.handleComponentMeaterial,
    };
    // 两周内物料需求
    const materialRequirementsProps = {
      dataSource: componentMeaterialList,
      pagination: componentMeaterialListPagination,
      loading: fetchComponentMeaterialLoading,
      dynamicColumns,
      fetchComponentMeaterial: this.fetchComponentMeaterial,
      onRef: node => {
        this.materialRequirementsForm = node.props.form;
      },
    };
    // 查询
    const filterFormProps = {
      woStatus,
      path: match.path,
      checkTichetLoading,
      departmentList,
      ticketReleaseLoading,
      tenantId,
      onSearch: this.handleSearch,
      handleMoreSearch: this.handleMoreSearch,
      buttonOnClick: this.buttonOnClick,
      onDistributionLine: this.checkTichet,
      buttonOnClickRelease: this.buttonOnClickRelease,
      clearCacheMoreSearch: this.clearCacheMoreSearch,
    };
    // 更多查询
    const moreSearchModalProps = {
      visible: this.state.visible,
      onCancel: this.hideModal,
      onMoreSearch: this.handleMoreSearchModal,
      clearCacheMoreSearch: this.clearCacheMoreSearch,
      woStatus,
      woType,
      woShop,
      departmentList,
      tenantId,
      cacheMoreSearch,
    };
    // 编辑抽屉
    const editorDrawerProps = {
      record: this.state.record,
      editorVisible: this.state.editorVisible,
      onOk: this.handleSave,
      onCancel: this.hideEditorModal,
    };
    // 分配产线
    const distributionLineProps = {
      visible: distributionLineVisible,
      selectedRowKeys: selectedProdLineRowKeys,
      loading: fetchLineLoading,
      dataSource: lineDataList,
      pagination: lineDataPagination,
      onCancel: this.setDistributionLineVisible,
      onSelectRow: this.onSelectRow,
      onSearch: this.fetchLine,
      onOk: this.saveProdLine,
    };
    const eoCreateFormProps = {
      type: 'eoCreateFormDrawerVisible',
      workOrderId: record.workOrderId,
      visible: eoCreateFormDrawerVisible,
      onCancel: this.closeFormDrawer,
      snCreateSave: this.snCreateSave,
      buttonSendLoading,
    };
    return (
      <Fragment>
        <Header title="工单管理平台" />
        <Content>
          <FilterForm {...filterFormProps} onRef={this.handleBindRef} />
          <div className={styles['ticket-table']}>
            <TableList {...listProps} />
            <MaterialRequirements {...materialRequirementsProps} />
          </div>
          {visible && <MoreSearchModal {...moreSearchModalProps} onRef={this.handleMoreBindRef} />}
          {editorVisible && <EditorDrawer {...editorDrawerProps} />}
          {distributionLineVisible && <DistributionLineModal {...distributionLineProps} />}
          {eoCreateFormDrawerVisible && <EoCreateFormDrawer {...eoCreateFormProps} />}
        </Content>
      </Fragment>
    );
  }
}
