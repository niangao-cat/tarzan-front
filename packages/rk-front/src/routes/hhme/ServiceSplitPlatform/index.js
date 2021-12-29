/**
 * 售后拆机平台 - ServiceSplitPlatform
 * @date: 2020/09/08 14:43:34
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */


import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Spin } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import formatterCollections from 'utils/intl/formatterCollections';
import { Header, Content } from 'components/Page';
import {
  getCurrentOrganizationId,
  filterNullValueObject,
} from 'utils/utils';
import notification from 'utils/notification';
import BaseInfo from './BaseInfo';
import FilterForm from './FilterForm';
import ListTable from './ListTable';
import Drawer from './Drawer';
import WorkCellModal from './WorkCellModal';
import ReturnTestDrawer from './ReturnTestDrawer';
import CancelSnDrawer from './CancelSnDrawer';
import styles from './index.less';

const tenantId = getCurrentOrganizationId();

@connect(({ serviceSplitPlatform, loading }) => ({
  serviceSplitPlatform,
  initLoading: loading.effects['serviceSplitPlatform/init'],
  scanBarcodeLoading: loading.effects['serviceSplitPlatform/scanBarcode'],
  saving: loading.effects['serviceSplitPlatform/save'],
  canceling: loading.effects['serviceSplitPlatform/cancel'],
  fetchMaterialInfoLoading: loading.effects['serviceSplitPlatform/fetchMaterialInfo'],
  fetchWorkCellInfoLoading: loading.effects['serviceSplitPlatform/fetchWorkCellInfo'],
  fetchBomLoading: loading.effects['serviceSplitPlatform/fetchBom'],
  fetchReturnTestDataLoading: loading.effects['serviceSplitPlatform/fetchReturnTestData'],
  handlePrintCodeLoading: loading.effects['serviceSplitPlatform/handlePrintCode'],
  // tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: 'tarzan.hmes.purchaseOrder',
})
export default class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      drawerVisible: false,
      returnTestVisible: false,
      cancelVisible: false,
      selectedRowKeys: [],
      selectedRow: [],
    };
    this.initData();
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'serviceSplitPlatform/init',
    });
    // 获取默认站点
    dispatch({
      type: 'serviceSplitPlatform/getSiteList',
      payload: {
        tenantId,
      },
    });
  }

  @Bind()
  initData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'serviceSplitPlatform/updateState',
      payload: {
        baseInfo: {},
        list: [],
      },
    });
  }

  @Bind()
  handleScanBarcode(snNum, page = {}) {
    const { dispatch, serviceSplitPlatform: { siteInfo, workcellInfo } } = this.props;
    dispatch({
      type: 'serviceSplitPlatform/scanBarcode',
      payload: {
        snNum,
        siteId: siteInfo.siteId,
        wkcShiftId: workcellInfo.wkcShiftId,
        workcellId: workcellInfo.workcellId,
        operationId: workcellInfo.operationId,
        page,
      },
    });
  }

  @Bind()
  handleFetchWorkCellInfo(workcellCode) {
    const { dispatch, serviceSplitPlatform: { siteInfo } } = this.props;
    dispatch({
      type: 'serviceSplitPlatform/fetchWorkCellInfo',
      payload: {
        jobType: 'SINGLE_PROCESS',
        siteId: siteInfo.siteId,
        workcellCode,
      },
    }).then(res => {
      if (res) {
        this.setState({ visible: false });
      }
    });
  }

  @Bind()
  handleOpenModal() {
    const { dispatch, serviceSplitPlatform: { baseInfo, siteInfo } } = this.props;
    dispatch({
      type: 'serviceSplitPlatform/fetchBom',
      payload: {
        materialId: baseInfo.materialId,
        siteId: siteInfo.siteId,
      },
    });
    this.setState({ drawerVisible: true });
  }

  @Bind()
  handleCloseModal() {
    this.setState({ drawerVisible: false });
  }

  @Bind()
  handleSave() {
    const { dispatch, serviceSplitPlatform: { baseInfo, workcellInfo = {}, siteInfo = {} } } = this.props;
    const { workcellId, wkcShiftId, operationId, snNum } = workcellInfo;
    const { splitRecordId, backType } = baseInfo;
    const { siteId } = siteInfo;
    this.drawerForm.validateFields((err, value) => {
      if (!err) {
        dispatch({
          type: 'serviceSplitPlatform/save',
          payload: {
            ...value,
            workcellId,
            wkcShiftId,
            operationId,
            splitRecordId,
            siteId,
            snNum,
            backType,
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.handleCloseModal();
            this.handleScanBarcode(baseInfo.snNum);
          }
        });
      }
    });
  }

  @Bind()
  handleFetchMaterialInfo(materialLotCode) {
    const { dispatch, serviceSplitPlatform: { baseInfo } } = this.props;
    const { topSplitRecordId, serviceReceiveId } = baseInfo;
    return dispatch({
      type: 'serviceSplitPlatform/fetchMaterialInfo',
      payload: {
        materialLotCode,
        topSplitRecordId,
        serviceReceiveId,
      },
    });
  }

  // 打开撤销弹框
  @Bind()
  handleOpenCancelModal() {
    this.setState({ cancelVisible: true });
  }

  // 关闭撤销抽屉
  @Bind()
  handleCloseCancelModal() {
    this.setState({ cancelVisible: false });
  }

  @Bind()
  handleCancel() {
    const { dispatch, serviceSplitPlatform: { defaultSite = {} } } = this.props;
    this.cancelForm.validateFields((err, value) => {
      if (!err) {
        dispatch({
          type: 'serviceSplitPlatform/cancel',
          payload: {
            ...value,
            siteId: defaultSite.siteId,
          },
        }).then(res => {
          if (res) {
            notification.success();
          }
        });
      }
    });
  }

  // 打开退库检测模态框
  @Bind()
  handleReturnTest(flag) {
    const fieldsValue = (this.filterForm && filterNullValueObject(this.filterForm.getFieldsValue())) || {};
    if (!fieldsValue.snNum) {
      return notification.error({ message: '当前拆机序列号为空！' });
    }
    this.setState({
      returnTestVisible: flag,
    });
    if (flag) {
      this.fetchReturnTestData();
    }
  }

  @Bind()
  fetchReturnTestData(val) {
    const { dispatch } = this.props;
    const fieldsValue = (this.filterForm && filterNullValueObject(this.filterForm.getFieldsValue())) || {};
    dispatch({
      type: 'serviceSplitPlatform/updateState',
      payload: {
        returnTestList: [],
      },
    });
    dispatch({
      type: 'serviceSplitPlatform/fetchReturnTestData',
      payload: {
        snNum: fieldsValue.snNum,
        allFlag: val || 'N',
      },
    });
  }

  @Bind()
  handleonSelectRow(selectedRowKeys, selectedRow) {
    this.setState({ selectedRowKeys, selectedRow });
  }

  @Bind
  handlePrintCode() {
    const { selectedRow } = this.state;
    // if (selectedRow.length%2!==0) {
    //   return notification.error({message: '当前打印仅支持偶数对打印！'});
    // }
    const arr = [];
    selectedRow.forEach(ele => {
      arr.push({
        eoNum: ele.snNum,
        materialCode: ele.materialCode,
        materialName: ele.materialName,
        workOrder: ele.workOrderNum,
      });
    });
    // 设置传输 参数
    const param = {
      type: 2,
      arr,
    };
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'serviceSplitPlatform/handlePrintCode',
      payload: param,
    }).then(res => {
      if (res) {
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
      }
    });
  }

  render() {
    const {
      scanBarcodeLoading,
      saving,
      initLoading,
      fetchMaterialInfoLoading,
      // tenantId,
      fetchWorkCellInfoLoading,
      fetchBomLoading,
      fetchReturnTestDataLoading,
      handlePrintCodeLoading,
      canceling,
      serviceSplitPlatform: {
        baseInfo = {},
        list = [],
        flagList = [],
        statusList = [],
        siteInfo = {},
        bomDatas = {},
        returnTestList = [],
        workcellInfo = {},
      },
    } = this.props;
    // console.log('baseInfo=', baseInfo);
    const { visible, drawerVisible, returnTestVisible, cancelVisible, selectedRowKeys } = this.state;
    const fieldsValue = (this.filterForm && filterNullValueObject(this.filterForm.getFieldsValue())) || {};
    const filterFormProps = {
      onRef: node => {
        this.filterForm = node.props.form;
      },
      onScanBarcode: this.handleScanBarcode,
    };
    const baseInfoProps = {
      baseInfo,
      workcellInfo,
    };
    const listTableProps = {
      dataSource: list,
      loading: scanBarcodeLoading,
      selectedRowKeys,
      onSelectRow: this.handleonSelectRow,
      onSearch: this.handleScanBarcode,
      snNum: fieldsValue.snNum,
    };
    const drawerProps = {
      siteInfo,
      tenantId,
      visible: drawerVisible,
      flagList,
      statusList,
      fetchMaterialInfoLoading,
      fetchBomLoading,
      loading: saving,
      bomDatas,
      onCancel: this.handleCloseModal,
      onSave: this.handleSave,
      onFetchMaterialInfo: this.handleFetchMaterialInfo,
      onRef: node => {
        this.drawerForm = node.props.form;
      },
    };
    const cancelSnDrawerProps = {
      visible: cancelVisible,
      loading: canceling,
      onCancel: this.handleCloseCancelModal,
      onSubmit: this.handleCancel,
      onRef: node => {
        this.cancelForm = node.props.form;
      },
    };
    const workCellModalProps = {
      visible,
      loading: initLoading,
      fetchWorkCellInfoLoading,
      onFetchWorkCellInfo: this.handleFetchWorkCellInfo,
    };
    const returnTestDrawerProps = {
      dataSource: returnTestList,
      onRef: node => {
        this.returnForm = node.props.form;
      },
      snNum: fieldsValue.snNum,
      loading: fetchReturnTestDataLoading,
      visible: returnTestVisible,
      onCancel: this.handleReturnTest,
      onSearch: this.fetchReturnTestData,
    };
    return (
      <Fragment>
        <Header
          title="售后拆机平台"
        >
          <Button type="default">
            完成
          </Button>
          <Button type="default" disabled={!baseInfo.workOrderId} onClick={() => this.handleOpenModal()}>
            拆机
          </Button>
          <Button
            onClick={() => this.handleReturnTest(true)}
          // disabled={ncTableSelectSelectflag.length === 0}
          >
            退库检测查询
          </Button>
          <Button
            onClick={() => this.handlePrintCode()}
            loading={handlePrintCodeLoading}
            disabled={selectedRowKeys.length === 0}
          >
            打印
          </Button>
          <Button
            type="primary"
            // disabled={!baseInfo.workOrderId}
            onClick={() => this.handleOpenCancelModal()}
          >
            登记撤销
          </Button>
        </Header>
        <Content>
          <Spin spinning={scanBarcodeLoading || fetchWorkCellInfoLoading || false}>
            <div className={styles['serviceSplitPlatform_filter-form']}>
              <FilterForm {...filterFormProps} />
            </div>
            <BaseInfo {...baseInfoProps} />
          </Spin>
          <div className={styles['serviceSplitPlatform_head-table']}>
            <ListTable {...listTableProps} />
          </div>
          <Drawer {...drawerProps} />
          <WorkCellModal {...workCellModalProps} />
          <ReturnTestDrawer {...returnTestDrawerProps} />
          <CancelSnDrawer {...cancelSnDrawerProps} />
        </Content>
      </Fragment>
    );
  }
}
