/**
 * 条码查询
 *@date：2019/9/12
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Button } from 'hzero-ui';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { isEmpty, isUndefined } from 'lodash';
import moment from 'moment';
import { Bind } from 'lodash-decorators';
import queryString from 'querystring';

import intl from 'utils/intl';
import { openTab } from 'utils/menuTab';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import ExcelExport from 'components/ExcelExport';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';

import FilterForm from './FilterForm';
import ListTable from './ListTable';
import CreateBarcodeDrawer from './CreateBarcodeDrawer';
import PrintModal from './PrintModel';
import RDNumModal from './RDNumModal';
import OperationLabCode from './OperationLabCode';

@connect(({ barcodeQuery, loading }) => ({
  barcodeQuery,
  tenantId: getCurrentOrganizationId(),
  loading: {
    fetchLoading: loading.effects['barcodeQuery/queryBarcodeList'],
    saveLoading: loading.effects['barcodeQuery/createBarcodeData'],
    printLoading: loading.effects['barcodeQuery/printingBarcode'],
  },
}))
@formatterCollections({ code: 'hwms.barcodeQuery' })
class BarcodeQuery extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      paginationSize: {},
      showCreateDrawer: false,
      printModalFlag: false,
      defaultItem: {
        enableFlag: 'N',
        qualityStatus: 'OK',
        status: 'NEW',
        createQty: 1,
      },
      rdVisible: false,
    };
  }

  state = {
    initOperationLabCodeData: {},
    operationLabCodeVisible: false,
  };

  componentDidMount() {
    window.localStorage.removeItem('selectedBarRows');
    const {
      // barcodeQuery: { pagination = {} },
      // location: { state: { _back } = {} },
      tenantId,
      dispatch,
    } = this.props;
    // 校验是否从详情页返回
    // const page = _back === -1 ? pagination : {};
    // 查询创建原因
    dispatch({
      type: 'barcodeQuery/queryCreateReason',
    });
    // 批量查询独立值集
    dispatch({
      type: 'barcodeQuery/batchLovData',
      payload: {
        tenantId,
      },
    });
    // 获取工厂
    // this.handleSearch(page);
    dispatch({
      type: 'barcodeQuery/getSite',
    });
    dispatch({
      type: 'barcodeQuery/fetchSiteList',
    });
  }

  /**
   *  查询列表
   * @param {object} 查询参数
   */
  @Bind()
  handleSearch(fields = {}) {
    this.setState({paginationSize: fields, selectedRowKeys: [], selectedRows: []});
    const { dispatch, tenantId } = this.props;
    const fieldsValue = (this.form && this.form.getFieldsValue()) || {};
    const { createDateFrom, createDateTo } = fieldsValue;
    const value = filterNullValueObject({
      ...fieldsValue,
      createDateFrom: isUndefined(createDateFrom)
        ? null
        : moment(createDateFrom).format(DEFAULT_DATETIME_FORMAT),
      createDateTo: isUndefined(createDateTo)
        ? null
        : moment(createDateTo).format(DEFAULT_DATETIME_FORMAT),
    });
    const { siteId, enableFlag, ...newValue} = value;
    if(isEmpty(newValue)) {
      return notification.warning({ description: '请输入查询条件' });
    }
    dispatch({
      type: 'barcodeQuery/queryBarcodeList',
      payload: {
        tenantId,
        ...value,
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(res => {
      if (res) {
        if (isEmpty(fields)) {
          // 模糊查询
          this.setState({ selectedRowKeys: [], selectedRows: [] });
        }
      }
    });
  }

  /**
   *  点击创建条码
   */
  @Bind()
  handleAddBarcode() {
    const { defaultItem } = this.state;
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'barcodeQuery/updateState',
      payload: {
        detail: { tenantId, ...defaultItem },
      },
    });
    this.handleModalVisible(true);
  }

  /**
   *  跳转到条码历史页
   */
  @Bind()
  handleBarcodeHistory() {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;
    window.localStorage.setItem('selectedBarRows', JSON.stringify(selectedRows));
    dispatch({
      type: 'barcodeQuery/updateState',
      payload: {
        historyList: [],
        hisPagination: {},
      },
    });
    dispatch(
      routerRedux.push({
        pathname: `/hwms/barcode/history-list`,
      })
    );
  }

  // 控制打印模版的弹出和关闭
  @Bind()
  handlePrintingModal(flag) {
    this.setState({ printModalFlag: flag });
  }

  /**
   * 条码打印
   */
  @Bind()
  handlePrinting(val) {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;
    let type;
    let payload;
    const arr = [];
    if (val==='1') {
      selectedRows.forEach(e=>{
        arr.push({
          ...e,
          productDate: e.productDate&&moment(e.productDate).format('YYYY-MM-DD'),
        });
      });
    }
    switch (val) {
      case '1':
        type='barcodeQuery/printingBarcodeCos';
        payload={
          codeList: arr,
          type: '1',
        };
        break;
      case '2':
        type='barcodeQuery/printingBarcode';
        payload=selectedRows.map(e => e.materialLotId);
        break;
      default:
        break;
    }
    dispatch({
      type,
      payload,
    }).then(res => {
      if (res.failed) {
        notification.error({ message: res.exception });
      } else {
        const file = new Blob(
          [res],
          { type: 'application/pdf' }
        );
        const fileURL = URL.createObjectURL(file);
        const newwindow = window.open(fileURL, 'newwindow');
        if (newwindow) {
          newwindow.print();
        } else {
          notification.error({ message: '当前窗口已被浏览器拦截，请手动设置浏览器！' });
        }
      }
    });
  }

  /**
   * 数据行选择操作
   */
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows });
  }

  @Bind()
  handleGetFormValue() {
    const filterValue = this.form === undefined ? {} : this.form.getFieldsValue();
    const { createDateFrom, createDateTo } = filterValue;
    return filterNullValueObject({
      ...filterValue,
      createDateFrom: isEmpty(createDateFrom)
          ? null
          : moment(createDateFrom).format(DEFAULT_DATETIME_FORMAT),
      createDateTo: isEmpty(createDateTo)
        ? null
        : moment(createDateTo).format(DEFAULT_DATETIME_FORMAT),
      page: this.state.paginationSize.current === undefined ? 0 : Number(this.state.paginationSize.current) - 1,
      size: this.state.paginationSize.pageSize,
    });
  }

  // 历史查询
  @Bind()
  handleGetFormHistoryValue() {
    const { selectedRows } = this.state;
    const materialLotIds = selectedRows.map(item => {
      return item.materialLotId;
    });
    return filterNullValueObject({ materialLotIds });
  }

  /**
   *  是否显示条码新建modal
   */
  @Bind()
  handleModalVisible(flag) {
    this.setState({ showCreateDrawer: flag });
  }

  /**
   *  保存数据
   */
  @Bind()
  saveData(params) {
    const { dispatch, tenantId, barcodeQuery: { detail = {} } } = this.props;
    dispatch({
      type: 'barcodeQuery/createBarcodeData',
      payload: {
        tenantId,
        ...params,
        materialLotId: detail.materialLotId,
      },
    }).then(res => {
      if (res) {
        this.handleModalVisible(false);
        notification.success();
      } else {
        notification.error({ message: res.message });
      }
    });
  }

  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  // 更新物料版本
  @Bind()
  updateMaterialVersion(record) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'barcodeQuery/updateState',
      payload: {
        detail: { tenantId, ...record },
      },
    });
    this.handleModalVisible(true);
  }

  @Bind()
  handleToImport() {
    openTab({
      key: '/hwms/barcode/import/HME.MATERIAL_LOT_TWO',
      search: queryString.stringify({
        key: '/hwms/barcode/import/HME.MATERIAL_LOT_TWO',
        title: 'SAP物料转MES',
        action: 'hzero.common.title.batchImport',
        auto: true,
      }),
    });
  }

  @Bind()
  handleOpenRDNumModal() {
    this.setState({ rdVisible: true });
  }

  @Bind()
  handleCloseRKNumModal() {
    this.setState({ rdVisible: false });
  }

  @Bind()
  handleCreateRDNum(params) {
    const { dispatch, tenantId, barcodeQuery: { detail = {} } } = this.props;
    dispatch({
      type: 'barcodeQuery/createRDNum',
      payload: {
        tenantId,
        ...params,
        materialLotId: detail.materialLotId,
      },
    }).then(res => {
      if (res) {
        this.handleModalVisible(false);
        notification.success();
        this.handleSearch();
      }
    });
  }

  @Bind()
  exImportExcel() {
    openTab({
      key: `/hwms/barcode/import/HME.MES_TRANSFORM`,
      title: intl.get('hwms.machineBasic.view.message.import').d('数据导入'),
      search: queryString.stringify({
        action: intl.get('hwms.machineBasic.view.message.import').d('数据导入'),
      }),
    });
  }

  @Bind()
  exImportSubExcel() {
    openTab({
      key: `/hwms/barcode/import/HME.MATERIAL_LOT_THREE`,
      title: intl.get('hwms.machineBasic.view.message.import').d('子母环导入'),
      search: queryString.stringify({
        action: intl.get('hwms.machineBasic.view.message.import').d('子母环导入'),
      }),
    });
  }

  @Bind()
  barImportSubExcel() {
    openTab({
      key: `/hwms/barcode/import/HME.SN_LABCODE`,
      title: intl.get('hwms.machineBasic.view.message.import').d('SN实验代码导入'),
      search: queryString.stringify({
        action: intl.get('hwms.machineBasic.view.message.import').d('SN实验代码导入'),
      }),
    });
  }

  /**
   *  跳转到实验代码页
   */
  @Bind()
  handleLabCode() {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;
    window.localStorage.setItem('selectedBarRows', JSON.stringify(selectedRows));
    dispatch({
      type: 'barcodeQuery/updateState',
      payload: {
        labCodeList: [],
        labCodePagination: {},
      },
    });
    dispatch(
      routerRedux.push({
        pathname: `/hwms/barcode/labCode`,
      })
    );
  }

  // 打开对象类型抽屉
  @Bind
  handleOperationLabCodeDrawerShow() {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    dispatch({
      type: 'barcodeQuery/fetchOperationLabCodeList',
      payload: {
        materialLotId: selectedRows[selectedRows.length-1].materialLotId,
      },
    });
    this.setState({ operationLabCodeVisible: true, initOperationLabCodeData: selectedRows[selectedRows.length-1] });
  }

  // 关闭对象类型抽屉
  @Bind
  handleOperationLabCodeDrawerCancel() {
    this.setState({ operationLabCodeVisible: false, initOperationLabCodeData: {} });
  }




  /**
   *  渲染页面
   * @returns {*}
   */
  render() {
    const { selectedRowKeys, showCreateDrawer, operationLabCodeVisible, initOperationLabCodeData, printModalFlag, rdVisible } = this.state;
    const {
      loading: { fetchLoading, saveLoading, printLoading },
      barcodeQuery: {
        pagination = {},
        dataList = [],
        detail = {},
        statusMap = [],
        enableMap = [],
        qualityStatusMap = [],
        performanceLevel = [],
        reasonMap = [],
        getSite = {},
        siteList = [],
      },
      tenantId,
    } = this.props;
    const filterProps = {
      tenantId,
      statusMap,
      enableMap,
      qualityStatusMap,
      siteInfo: getSite,
      siteList,
      onRef: this.handleBindRef,
      onSearch: this.handleSearch,
    };
    const listProps = {
      pagination,
      selectedRowKeys,
      loading: fetchLoading,
      dataSource: dataList,
      onSelectRow: this.handleSelectRow,
      onSearch: this.handleSearch,
      updateMaterialVersion: this.updateMaterialVersion,
    };
    const detailProps = {
      detail,
      tenantId,
      showCreateDrawer,
      statusMap,
      qualityStatusMap,
      performanceLevel,
      reasonMap,
      saveLoading,
      getSite,
      onCancel: this.handleModalVisible,
      onOk: this.saveData,
    };
    const printModalProps = {
      visible: printModalFlag,
      closeModal: this.handlePrintingModal,
      handlePrinting: this.handlePrinting,
    };
    const rdNumModalProps = {
      detail,
      tenantId,
      showCreateDrawer: rdVisible,
      statusMap,
      qualityStatusMap,
      performanceLevel,
      reasonMap,
      saveLoading,
      getSite,
      onCancel: this.handleCloseRKNumModal,
      onOk: this.handleCreateRDNum,
    };
    // 对象类型抽屉参数
    const operationLabCoderProps = {
      visible: operationLabCodeVisible,
      onCancel: this.handleOperationLabCodeDrawerCancel,
      onOk: this.handleOperationLabCodeDrawerCancel,
      initData: initOperationLabCodeData,
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`hwms.barcodeQuery.view.message.barcodeTitle`).d('条码查询')}>
          <Button type="primary" icon="plus" onClick={this.handleAddBarcode}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button type="primary" onClick={() => this.exImportExcel()}>
            {intl.get(`tarzan.acquisition.collection.button.create`).d('MES转编码')}
          </Button>
          <Button disabled={isEmpty(selectedRowKeys)} onClick={this.handleBarcodeHistory}>
            {intl.get('hwms.barcodeQuery.view.message.barcodeHistory').d('条码历史')}
          </Button>
          <Button type="primary" onClick={() => this.exImportSubExcel()}>
            {intl.get(`tarzan.acquisition.collection.button.create`).d('子母环导入')}
          </Button>
          <Button
            icon="printer"
            loading={printLoading}
            disabled={isEmpty(selectedRowKeys)}
            onClick={() => this.handlePrintingModal(true)}
          >
            {intl.get('hwms.barcodeQuery.view.message.print').d('打印')}
          </Button>
          {this.state.selectedRows.length <= 100 && (
            <ExcelExport
              exportAsync
              requestUrl={`/mes/v1/${getCurrentOrganizationId()}/pc-material-lot/barCodeQueryHis-export`} // 路径
              otherButtonProps={{ type: 'primary' }}
              queryParams={this.handleGetFormHistoryValue()} // 查询条件
              buttonText='条码历史导出'
              // defaultConfig={{
              //   singleSheet: 100000, // 单sheet最大数量
              //   }}
            />
          )}

          <ExcelExport
            exportAsync
            requestUrl={`/mes/v1/${getCurrentOrganizationId()}/pc-material-lot/barCodeQuery-export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue()} // 查询条件
            // defaultConfig={{
            //   singleSheet: 100000, // 单sheet最大数量
            //   }}
          />
          <Button type="default" onClick={this.handleToImport}>
            SAP物料转MES
          </Button>
          <Button type="default" onClick={this.handleOpenRDNumModal}>
            研发序列号生成
          </Button>
          <Button disabled={isEmpty(selectedRowKeys)} onClick={this.handleLabCode}>
            实验代码
          </Button>
          <Button type="primary" onClick={() => this.barImportSubExcel()}>
            {intl.get(`tarzan.acquisition.collection.button.create`).d('SN实验代码导入')}
          </Button>
          <Button disabled={isEmpty(selectedRowKeys)} onClick={this.handleOperationLabCodeDrawerShow}>
            工艺实验代码
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} onRef={this.handleBindRef} />
          <ListTable {...listProps} />
          <CreateBarcodeDrawer {...detailProps} />
          <RDNumModal {...rdNumModalProps} />
          {printModalFlag && <PrintModal {...printModalProps} />}
          <OperationLabCode {...operationLabCoderProps} />
          <ModalContainer ref={registerContainer} />
        </Content>
      </React.Fragment>
    );
  }
}

export default BarcodeQuery;
