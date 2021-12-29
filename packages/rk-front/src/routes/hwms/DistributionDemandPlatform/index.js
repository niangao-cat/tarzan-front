import React from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Checkbox, Button } from 'hzero-ui';
import { Table } from 'choerodon-ui';
import { Header, Content } from 'components/Page';
import { Menu } from 'choerodon-ui/pro';
import { isEmpty, isUndefined, unionBy } from 'lodash';
import moment from 'moment';

import { tableScrollWidth, getCurrentOrganizationId, addItemToPagination, filterNullValueObject, getEditTableData } from 'utils/utils';
import notification from 'utils/notification';
import { Button as ButtonPermission } from 'components/Permission';
import { showAdjustModal } from './Functions';
import ReplaceMaintainDrawer from './Functions/ReplaceMaintainDrawer';
import CalendarModal from './Functions/CalendarModal';
import FilterForm from './FilterForm';
import styles from './index.less';

@connect(({ distributionDemandPlatform, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  distributionDemandPlatform,
  checkedKeys: distributionDemandPlatform.checkedKeys,
  listData: distributionDemandPlatform.listData,
  listDataLoading:
    loading.effects['distributionDemandPlatform/fetchList'] ||
    loading.effects['distributionDemandPlatform/fetchRelease'],
  saveDemandsDetailLoading: loading.effects['distributionDemandPlatform/saveDemandsDetail'],
  fetchDemandsDetailLoading: loading.effects['distributionDemandPlatform/fetchDemandsDetail'],
  handleExportLoading: loading.effects['distributionDemandPlatform/handleExport'],
  checkGenerateOrderLoading: loading.effects['distributionDemandPlatform/checkGenerateOrder'],
  createDeliveryNoteLoading: loading.effects['distributionDemandPlatform/createDeliveryNote'],
  customDatas: distributionDemandPlatform.customDatas,
  pages: distributionDemandPlatform.pages,
  currentPage: distributionDemandPlatform.currentPage,
}))
export default class PlanTVMIProcurementPlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // defaultTableHeight: document.body.offsetHeight - 48 - 36 - 38 - 28 - 20 - 24 - 10,
      visible: false,
      vmiWaringDate: 0,
      // selectedRowKeys: [],
      selectedRows: [],
      listRecord: {}, // 行数据
      shiftDate: "",
    };
    this.initData();
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'distributionDemandPlatform/batchLovData',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'distributionDemandPlatform/getSiteList',
      payload: {
        tenantId,
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'distributionDemandPlatform/updateState',
      payload: {
        selectedRows: [],
        selectAllflag: false,
      },
    });
  }

  @Bind()
  initData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'distributionDemandPlatform/updateState',
      payload: {
        listData: [],
        checkedKeys: [],
        columns: [],
        customDatas: [], // 全部分组数据
        pages: 0,
        currentPage: 1,
        list: [],
        dynamicDataSource: [],
        pagination: {},
        replaceList: [], // 替代料维护抽屉
        replaceListPagination: {},
        colData: [],
        materialInfo: {},
        materialShift: {},
      },
    });
    this.setState({
      vmiWaringDate: 0,
      selectedRows: [],
    });
  }

  /**
   * 弹框关闭触发查询回调
   */
  @Bind
  handleQueryModalQuery(queryParams = {}) {
    // this.setState({ currentQueryParams: queryParams });
    this.fetchDatas(queryParams);
  }

  /**
   * 查询接口
   */
  @Bind
  fetchDatas(fields = {}) {
    const { dispatch, distributionDemandPlatform: { selectAllflag, selectedRows = [] } } = this.props;
    const fieldsValue = (this.filterForm && filterNullValueObject(this.filterForm.getFieldsValue())) || {};
    dispatch({
      type: 'distributionDemandPlatform/updateState',
      payload: {
        selectedRows: [],
        list: [],
      },
    });
    dispatch({
      type: 'distributionDemandPlatform/fetchList',
      payload: {
        ...fieldsValue,
        selectAllflag,
        selectedRows,
        startDate: isUndefined(fieldsValue.startDate)
          ? null
          : moment(fieldsValue.startDate).format('YYYY-MM-DD 00:00:00'),
        page: isEmpty(fields) ? {
          page: 0,
          pageSize: 25,
          // pageSize: 4,
        } : {
            ...fields,
            selectAllflag,
            selectedRows,
            pageSize: fields.pageSize / 4,
          },
      },
    });
  }

  /**
   * 勾选数据
   */
  @Bind
  handleSelect(checkedKeys) {
    const { dispatch } = this.props;
    dispatch({
      type: 'vmiProcurementPlanC7n/handleSelect',
      payload: { checkedKeys },
    });
  }

  // /**
  //  * 处理全选、反选
  //  */
  // @Bind
  // handleAllChecked(value) {
  //   if (value) {
  //     const { listData } = this.props;
  //     this.handleSelect(listData.map((l) => l.itemCode));
  //   } else {
  //     this.handleSelect([]);
  //   }
  // }

  /**
   * 处理单选，选中or未选中
   */
  @Bind
  handleSingleChecked(value, oldValue) {
    const { checkedKeys = [] } = this.props;
    if (value) {
      checkedKeys.push(value);
    } else {
      const rmi = checkedKeys.findIndex((c) => c.itemCode === oldValue);
      checkedKeys.splice(rmi, 1);
    }
    this.handleSelect(checkedKeys);
  }

  /**
   * 处理行单击选中 or 取消选中
   */
  @Bind
  handleRowClick(record = {}) {
    const { checkedKeys = [] } = this.props;
    const index = checkedKeys.findIndex((c) => record.itemCode === c);
    if (index !== -1) {
      checkedKeys.splice(index, 1);
    } else {
      checkedKeys.push(record.itemCode);
    }
    this.handleSelect(checkedKeys);
  }

  @Bind
  getCurrentCheckedRecord() {
    const { checkedKeys = [], listData } = this.props;
    const datas = [];
    checkedKeys.forEach((c) => {
      listData.forEach((l) => {
        const { ...newData } = l;
        delete newData.data;
        if (newData.itemCode === c) {
          datas.push(newData);
        }
      });
    });
    return datas;
  }

  getTableWidth(columns = []) {
    const initLength = 40 + 130 + 240 + 100 + 100 + 100 + 100;
    return (
      columns.reduce((total) => {
        return total + 120;
      }, initLength) - 120
    );
  }

  menu = (r, c) => (
    <div className="haps-option-menu">
      <Menu>
        <Menu.Item key="0">
          <a
            onClick={(event) => {
              event.stopPropagation();
              this.handleShowAdjust({ record: r, column: c });
            }}
          >
            调整
          </a>
        </Menu.Item>
      </Menu>
    </div>
  );

  /**
   * 功能方法 - handleDoubleClickCell: 调整
   */
  @Bind()
  handleShowAdjust({ record, column }) {
    const { plantId } = record;
    const { itemId } = record;
    const planDate = column;
    const params = {
      plantId,
      itemId,
      planDate,
    };
    showAdjustModal(params, this.fetchDatas);
  }

  /**
   * 功能方法 - handleTBRelease: 发布
   */
  @Bind()
  handleTBRelease() {
    const makeOrderList = this.getCurrentCheckedRecord();
    this.props
      .dispatch({
        type: 'vmiProcurementPlanC7n/fetchRelease',
        payload: makeOrderList,
      })
      .then((res) => {
        if (res && !res.failed) {
          this.fetchDatas();
          notification.success({ message: '操作成功!' });
        }
      });
  }

  /**
   * 功能方法 - handleTBSyncDemandAndSupply: 同步需求/供应
   */
  @Bind()
  handleTBSyncDemandAndSupply() {
    // 同步需求/供应接口
    this.props
      .dispatch({
        type: 'vmiProcurementPlanC7n/fetchSyncDemandAndSupply',
      })
      .then((res) => {
        if (res && !res.failed) {
          notification.success({ message: '操作成功!' });
        }
      });
  }

  @Bind
  handlePageChange(newPage) {
    this.props.dispatch({
      type: 'vmiProcurementPlanC7n/handlePageChange',
      payload: { newPage },
    });
  }

  @Bind()
  handlePlanSuggest() {
    const makeOrderList = this.getCurrentCheckedRecord();
    if (makeOrderList.length) {
      const { dispatch } = this.props;
      return dispatch({
        type: 'vmiProcurementPlanC7n/doPlanSuggest',
        payload: makeOrderList,
      }).then((res) => {
        if (res && !res.failed) {
          this.fetchDatas();
          notification.success({ message: '操作成功!' });
        }
      });
    } else {
      notification.warning({ message: '请至少勾选一条数据!' });
    }
  }

  @Bind()
  getColor(index, text, record, columns) {
    const { vmiWaringDate } = this.state;
    const { qtyType, onhandQty } = record;
    if (qtyType !== '总需求' && index < Number(vmiWaringDate)) {
      if (Number(text) > onhandQty) {
        return { backgroundColor: 'red' };
      } else {
        let count = 0;
        for (let i = 0; i < Number(vmiWaringDate); i++) {
          count += Number(record[columns[0]]);
        }
        if (count > onhandQty) {
          return { backgroundColor: 'red' };
        }
      }
    }
    return {};
  }

  // 替代料维护
  @Bind()
  replaceMaintain(record, index) {
    const {
      dispatch,
      distributionDemandPlatform: { replaceList = [], replaceListPagination = {} },
    } = this.props;
    replaceList.splice(index, 1, {
      ...replaceList[index],
      onClickFlag: true,
    });
    const createList = replaceList.filter(e => ['create', 'update'].includes(e._status));
    const { materialId, materialCode, ...value } = record;
    if (createList.length <= 0) {
      dispatch({
        type: 'distributionDemandPlatform/updateState',
        payload: {
          replaceList: [
            {
              ...value,
              // materialCode,
              id: new Date().getTime(),
              _status: 'create', // 新建标记位
            },
            ...replaceList,
          ],
          replaceListPagination: addItemToPagination(replaceList.length, replaceListPagination),
        },
      });
    } else {
      notification.warning({
        description: '请先保存当前替代物料',
      });
    }
  }

  // 取消替代
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      distributionDemandPlatform: { replaceList },
    } = this.props;
    const newList = replaceList.filter(item => (item.id !== record.id && record._status === 'create') || (item.demandDetailId !== record.demandDetailId && record._status === 'update'));
    dispatch({
      type: 'distributionDemandPlatform/updateState',
      payload: { replaceList: newList },
    });
  }

  @Bind()
  handleEditLine(current, flag) {
    const { dispatch, distributionDemandPlatform: { replaceList } } = this.props;
    // const createList = replaceList.filter(e => ['create', 'update'].includes(e._status));
    const newList = replaceList.map(item =>
      item.demandDetailId === current.demandDetailId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: `distributionDemandPlatform/updateState`,
      payload: {
        replaceList: newList,
      },
    });
    // if (createList.length <= 0) {
    //   const newList = replaceList.map(item =>
    //     item.demandDetailId === current.demandDetailId ? { ...item, _status: flag ? 'update' : '' } : item
    //   );
    //   dispatch({
    //     type: `distributionDemandPlatform/updateState`,
    //     payload: {
    //       replaceList: newList,
    //     },
    //   });
    // } else {
    //   notification.warning({
    //     description: '请先保存当前替代物料',
    //   });
    // }
  }

  @Bind()
  handleChecked(event, checkList, str) {
    const { dispatch, distributionDemandPlatform: { selectedRows } } = this.props;
    if (event.target.checked) {
      dispatch({
        type: 'distributionDemandPlatform/updateState',
        payload: {
          selectedRows: [...selectedRows, ...checkList],
          // selectAllflag: !!selectAllflag,
        },
      });
    } else {
      dispatch({
        type: 'distributionDemandPlatform/updateState',
        payload: {
          selectAllflag: false,
          selectedRows: selectedRows.filter(e => `${e.keyId}${e.materialId}` !== str),
        },
      });
    }
  }

  @Bind()
  handleAllChecked(e) {
    const { dispatch, distributionDemandPlatform: { list, selectedRows } } = this.props;
    // console.log(e.target.checked)
    dispatch({
      type: 'distributionDemandPlatform/updateState',
      payload: {
        selectedRows: e.target.checked ? [...selectedRows, ...list] : [],
      },
    });
  }

  // 一键全选
  @Bind()
  handleSelectAll(flag) {
    const { dispatch, distributionDemandPlatform: { list, selectedRows } } = this.props;
    dispatch({
      type: 'distributionDemandPlatform/updateState',
      payload: {
        selectAllflag: flag,
        selectedRows: flag ? [...selectedRows, ...list] : [],
      },
    });
  }

  @Bind()
  handleOpenModal() {
    const { dispatch, distributionDemandPlatform: { selectedRows } } = this.props;
    dispatch({
      type: 'distributionDemandPlatform/checkGenerateOrder',
      payload: selectedRows,
    }).then(res => {
      if (res) {
        this.setState({ calendarModalVisible: true });
      }
    });
  }

  @Bind()
  handleCreateDeliveryNote(calendarShiftRows) {
    const { dispatch, distributionDemandPlatform: { selectedRows, backFlushFlag } } = this.props;
    dispatch({
      type: 'distributionDemandPlatform/createDeliveryNote',
      payload: {
        calendarShiftList: calendarShiftRows,
        demandList: unionBy(selectedRows, 'keyId'),
        flag: backFlushFlag,
      },
    }).then(res => {
      if (res && res.failed) {
        notification.error({
          description: res.message,
        });
      } else {
        this.handleCloseModal();
        notification.success();
        dispatch({
          type: 'distributionDemandPlatform/updateState',
          payload: {
            colDataSelectRows: [],
          },
        });
      }
    });
  }

  @Bind()
  handleCloseModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        materialInfo: {},
      },
    });
    this.setState({
      calendarModalVisible: false,
    });
  }

  @Bind()
  handleOpenReplaceModal(record, shiftDate) {
    const { dispatch } = this.props;
    this.setState({ listRecord: record, shiftDate });
    const obj = record.shiftQtyList.find(e => `${moment(e.shiftDate).format('YYYYMMDD')}${e.shiftCode}` === shiftDate);
    if (obj.distDemandId) {
      dispatch({
        type: 'distributionDemandPlatform/fetchDemandsDetail',
        payload: {
          distDemandId: obj.distDemandId,
          materialInfo: record,
          materialShift: obj,
        },
      }).then(res => {
        if (res) {
          this.setState({ visible: true });
        }
      });
    } else {
      notification.warning({
        description: '当前数据为空',
      });
    }
  }

  @Bind()
  handleCloseReplaceModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'distributionDemandPlatform/updateState',
      payload: {
        replaceList: [],
        materialShift: {},
        materialInfo: {},
      },
    });
    this.setState({ visible: false, onCancel: {}, shiftDate: '' });
  }

  @Bind()
  handleSave() {
    const { dispatch } = this.props;
    const { distributionDemandPlatform: { replaceList, materialShift, materialInfo } } = this.props;
    const dataSource = getEditTableData(replaceList);
    if (dataSource.length > 0) {
      const { demandDetailId, ...info } = dataSource[0];
      let payload = {};
      if (info._status === 'update') {
        payload = {
          ...info,
          demandDetailId,
        };
      } else {
        payload = {
          ...info,
          sourceDetailId: demandDetailId,
        };
      }
      dispatch({
        type: 'distributionDemandPlatform/saveDemandsDetail',
        payload,
      }).then(res => {
        if (res && res.failed) {
          notification.error({ description: res.message });
        } else {
          dispatch({
            type: 'distributionDemandPlatform/fetchDemandsDetail',
            payload: {
              materialShift,
              materialInfo,
              distDemandId: materialShift.distDemandId,
            },
          });
        }
      });
    }
  }

  @Bind()
  handleRenderRow(record) {
    const { distributionDemandPlatform: { list = [] } } = this.props;
    const productionList = list.map(e => `${e.keyId}${e.materialId}`);
    const first = productionList.indexOf(`${record.keyId}${record.materialId}`);
    if (first / 4 % 2 === 0) {
      return styles['distributionDemand_row-color'];
    }
  }

  // 删除替代料
  @Bind()
  handleDeleteRecord(record) {
    const { dispatch } = this.props;
    const { listRecord = {}, shiftDate = "" } = this.state;
    const obj = listRecord.shiftQtyList.find(e => `${moment(e.shiftDate).format('YYYYMMDD')}${e.shiftCode}` === shiftDate);
    dispatch({
      type: 'distributionDemandPlatform/handleDeleteRecord',
      payload: {
        ...record,
      },
    }).then(res => {
      if (res) {
        notification.success();
        dispatch({
          type: 'distributionDemandPlatform/fetchDemandsDetail',
          payload: {
            distDemandId: obj.distDemandId,
            materialInfo: listRecord,
            materialShift: obj,
          },
        });
      }
    });
  }

  @Bind
  handleExport() {
    const { distributionDemandPlatform: { defaultSite = {} } } = this.props;
    const fieldsValue = (this.filterForm && filterNullValueObject(this.filterForm.getFieldsValue())) || {};
    const { dispatch } = this.props;
    const { startDate, ...value } = fieldsValue;
    dispatch({
      type: 'distributionDemandPlatform/handleExport',
      payload: {
        ...value,
        siteId: fieldsValue.siteId || defaultSite.siteId,
      },
    }).then(res=>{
      if(res){
        const file = new Blob(
          [res],
          { type: 'application/vnd.ms-excel' }
        );
        const fileURL = URL.createObjectURL(file);
        const fileName = '配送需求报表.xls';
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = fileURL;
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      }
    });
  }

  render() {
    const { calendarModalVisible, visible } = this.state;
    const {
      listDataLoading,
      tenantId,
      saveDemandsDetailLoading,
      fetchDemandsDetailLoading,
      handleExportLoading,
      checkGenerateOrderLoading,
      createDeliveryNoteLoading,
      distributionDemandPlatform: {
        lovData = {},
        list = [],
        pagination = {},
        replaceList = [],
        replaceListPagination = {},
        colData = [],
        dateList = [],
        materialInfo = {},
        selectedRows = [],
        selectAllflag,
        backFlushFlag,
        withColData = [],
        colDataSelectRows = [],
      },
    } = this.props;
    const { wmsDistribution = [] } = lovData;
    const filterFormProps = {
      tenantId,
      wmsDistribution,
      onRef: node => {
        this.filterForm = node.props.form;
      },
      onSearch: this.fetchDatas,
    };
    const replaceMaintainDrawerProps = {
      materialInfo,
      dataSource: replaceList,
      pagination: replaceListPagination,
      replaceListPagination,
      visible,
      loading: saveDemandsDetailLoading || fetchDemandsDetailLoading,
      onCancel: this.handleCloseReplaceModal,
      replaceMaintain: this.replaceMaintain,
      handleCleanLine: this.handleCleanLine,
      handleEditLine: this.handleEditLine,
      onSave: this.handleSave,
      handleDeleteRecord: this.handleDeleteRecord,
    };
    const calendarModalProps = {
      visible: calendarModalVisible,
      dataSource: colData,
      onCloseModal: this.handleCloseModal,
      onSave: this.handleCreateDeliveryNote,
      backFlushFlag,
      withColData,
      colDataSelectRows,
      createLoading: createDeliveryNoteLoading,
    };
    const column = [
      {
        dataIndex: 'checkbox',
        fixed: 'left',
        width: 30,
        render: (val, record, index) => {
          const productionList = list.map(e => e.keyId);
          const first = productionList.indexOf(record.keyId);
          const all = list.filter(e => e.keyId === record.keyId).length;
          const obj = {
            children: (
              <div
                onClick={(event) => {
                  event.stopPropagation(); // 阻止行单击事件传播
                }}
              >
                <Checkbox
                  // value={`${record.materialId}${record.soNum}${record.soLineNum}${record.distributionBasicId}`}
                  value={selectedRows.map(e => `${e.keyId}${e.materialId}`).includes(`${record.keyId}${record.materialId}`)}
                  onChange={(event) => this.handleChecked(event, list.filter(e => `${e.keyId}${e.materialId}` === `${record.keyId}${record.materialId}`), `${record.keyId}${record.materialId}`)}
                />
              </div>
            ),
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        fixed: 'left',
        width: 50,
        render: (val, record, index) => {
          const productionList = list.map(e => `${e.keyId}${e.materialId}`);
          const first = productionList.indexOf(`${record.keyId}${record.materialId}`);
          const all = list.filter(e => `${e.keyId}${e.materialId}` === `${record.keyId}${record.materialId}`).length;
          const { pageSize, current } = pagination;
          const orderSeq = pageSize / 4 * (current - 1) + index / 4 + 1;
          const obj = {
            children: orderSeq,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 110,
        fixed: 'left',
        render: (val, record, index) => {
          const productionList = list.map(e => `${e.keyId}${e.materialId}`);
          const first = productionList.indexOf(`${record.keyId}${record.materialId}`);
          const all = list.filter(e => `${e.keyId}${e.materialId}` === `${record.keyId}${record.materialId}`).length;
          const obj = {
            children: val,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: '物料描述',
        dataIndex: 'materialName',
        width: 110,
        fixed: 'left',
        render: (val, record, index) => {
          const productionList = list.map(e => `${e.keyId}${e.materialId}`);
          const first = productionList.indexOf(`${record.keyId}${record.materialId}`);
          const all = list.filter(e => `${e.keyId}${e.materialId}` === `${record.keyId}${record.materialId}`).length;
          const obj = {
            children: val,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: '基本信息',
        dataIndex: 'baseInfoName',
        width: 100,
      },
      {
        title: '基本信息值',
        dataIndex: 'baseInfoValue',
        width: 100,
      },
      {
        title: '配送信息',
        dataIndex: 'deliveryName',
        width: 100,
      },
      {
        title: '配送信息值',
        dataIndex: 'deliveryValue',
        width: 100,
      },
      {
        title: '库存信息',
        dataIndex: 'inventoryName',
        width: 100,
      },
      {
        title: '库存信息值',
        dataIndex: 'inventoryValue',
        width: 100,
      },
      // {
      //   title: '最小包装',
      //   dataIndex: 'minimumPackage',
      //   width: 80,
      //   render: (val, record, index) => {
      //     const productionList = list.map(e => `${e.materialId}${e.soNum}${e.soLineNum}`);
      //     const first = productionList.indexOf(`${record.materialId}${record.soNum}${record.soLineNum}`);
      //     const all = list.filter(e => `${e.materialId}${e.soNum}${e.soLineNum}` === `${record.materialId}${record.soNum}${record.soLineNum}`).length;
      //     const obj = {
      //       children: val,
      //       props: {},
      //     };
      //     obj.props.rowSpan = index === first ? all : 0;
      //     return obj;
      //   },
      // },
      {
        title: '数据要求',
        dataIndex: 'dataDemandName',
        width: 110,
      },
      {
        title: '数据要求值',
        dataIndex: 'dataDemandValue',
        width: 100,
      },
      {
        title: '当前班次',
        dataIndex: 'calendarShift',
        width: 110,
      },
    ];
    const dynamicColumns = dateList.map(e => ({
      title: e,
      width: 300,
      children: [
        {
          title: `A班`,
          dataIndex: `${moment(e).format('YYYYMMDD')}A`,
          align: 'center',
          width: 100,
          render: (val, record, index) => index % 4 === 0 ? (
            <a onClick={() => this.handleOpenReplaceModal(record, `${moment(e).format('YYYYMMDD')}A`)}>{val}</a>
          ) : val,
        },
        {
          title: 'B班',
          dataIndex: `${moment(e).format('YYYYMMDD')}B`,
          align: 'center',
          width: 100,
          render: (val, record, index) => index % 4 === 0 ? (
            <a onClick={() => this.handleOpenReplaceModal(record, `${moment(e).format('YYYYMMDD')}B`)}>{val}</a>
          ) : val,
        },
        {
          title: 'C班',
          dataIndex: `${moment(e).format('YYYYMMDD')}C`,
          align: 'center',
          width: 100,
          render: (val, record, index) => index % 4 === 0 ? (
            <a onClick={() => this.handleOpenReplaceModal(record, `${moment(e).format('YYYYMMDD')}C`)}>{val}</a>
          ) : val,
        },
      ],
    }));
    const newColumns = column.concat(dynamicColumns);
    return (
      <React.Fragment>
        <Header title="配送需求平台">
          <Button
            type="primary"
            icon='export'
            onClick={() => this.handleExport()}
            loading={handleExportLoading}
          >
            导出
          </Button>
          <ButtonPermission
            className={styles['ticket-edit-ButtonRig']}
            permissionList={[
              {
                code: 'hzero.workshop.distribution-demand-platform.ps.create-doc-button',
              },
            ]}
            type="default"
            disabled={selectedRows.length === 0}
            onClick={() => this.handleOpenModal()}
            loading={checkGenerateOrderLoading}
          >
            生成配送单
          </ButtonPermission>
          {/* <Button type="default" disabled={selectedRows.length === 0} onClick={() => this.handleOpenModal()}>生成配送单</Button> */}
          {selectAllflag ? (
            <span>
              <Button
                type="primary"
                onClick={() => this.handleSelectAll(false)}
              >
                取消全选
              </Button>
            </span>
          ) : (
            <Button
              type="primary"
              onClick={() => this.handleSelectAll(true)}
              disabled={list.length === 0}
            >
              一键全选
            </Button>
            )}
          <span style={{ fontSize: '14px', marginRight: '8px' }}>选中数量为{selectedRows.length > 0 ? unionBy(selectedRows, 'keyId').length : 0}</span>
        </Header>
        <Content>
          <FilterForm {...filterFormProps} />
          <div className="haps-c7n-table">
            <Table
              columns={newColumns}
              dataSource={list}
              loading={listDataLoading}
              size="small"
              filterBar={false}
              highLightRow={false}
              pagination={{ ...pagination, pageSizeOptions: ['100', '200', '300', '400', '500', '1000'] }}
              onChange={page => this.fetchDatas(page)}
              bordered
              scroll={{ x: tableScrollWidth(newColumns), y: 470 }}
              rowClassName={this.handleRenderRow}
              onRow={(record) => {
                return {
                  onClick: () => this.handleRowClick(record),
                };
              }}
            />
          </div>
          <ReplaceMaintainDrawer {...replaceMaintainDrawerProps} />
          <CalendarModal {...calendarModalProps} />
        </Content>
      </React.Fragment>
    );
  }
}
