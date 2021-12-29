/*
 * @Description: 成本中心领退料平台
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-22 09:01:34
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-12-10 14:01:26
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Button, Card, Modal } from 'hzero-ui';
import intl from 'utils/intl';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Content, Header } from 'components/Page';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { Bind } from 'lodash-decorators';
import { isEmpty, isUndefined, isArray } from 'lodash';
import moment from 'moment';
import { DETAIL_CARD_TABLE_CLASSNAME, DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import notification from 'utils/notification';
import FilterForm from './FilterForm';
import ListTableHead from './ListTableHead';
import ListTableLine from './ListTableLine';
import DetailDrawer from './Detail/DetailDrawer';
import { getSiteId } from '@/utils/utils';
import NewBarcodeCreateDrawer from './Drawer/NewBarcodeCreateDrawer';

@connect(({ requisitionAndReturn, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  requisitionAndReturn,
  loading: {
    fetchHeadLoading: loading.effects['requisitionAndReturn/queryHeadList'],
    fetchLineLoading: loading.effects['requisitionAndReturn/queryLineList'],
    closeLoading: loading.effects['requisitionAndReturn/closeInstruction'],
    fetchHeadPrintLoading: loading.effects['requisitionAndReturn/headPrint'],
  },
}))
@formatterCollections({ code: 'hwms.requisitionAndReturn' })
class RequisitionAndReturn extends Component {
  form;

  constructor(props) {
    super(props);
    // this.queryStorageList();
    this.state = {
      showDetailModal: false, // 是否显示明细modal
      selectedRowKeys: [],
      selectedRows: [], // 选中的头数据
      selectedLineRowKeys: [],
      selectedBarCodeRow: [],
      selectedBarCodeRowKeys: [],
      // eslint-disable-next-line react/no-unused-state
      selectedLineRows: [], // 选中的行数据
      lineRecord: {},
      showBrcodeCreate: false,
      rowInfo: {},
    };
  }

  componentDidMount() {
    const {
      dispatch,
      tenantId,
      requisitionAndReturn: { headPagination = {} },
      location: { state: { _back } = {} },
    } = this.props;
    // 校验是否从新建页返回
    const page = _back === -1 ? headPagination : {};
    // 查询独立值集
    dispatch({
      type: 'requisitionAndReturn/init',
      payload: {
        tenantId,
      },
    });
    // 工厂下拉框
    dispatch({
      type: 'requisitionAndReturn/querySiteList',
    });
    this.handleHeadSearch(page);
    dispatch({
      type: 'requisitionAndReturn/updateState',
      payload: {
        headAndLine: {},
      },
    });
  }

  /**
   *  查询头列表
   * @param {object} 查询参数
   */
  @Bind()
  handleHeadSearch(fields = {}) {
    const { dispatch } = this.props;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'requisitionAndReturn/queryHeadList',
      payload: {
        ...filterValues,
        creationDateFrom: isUndefined(filterValues.creationDateFrom)
          ? null
          : moment(filterValues.creationDateFrom).format(DEFAULT_DATETIME_FORMAT),
        creationDateTo: isUndefined(filterValues.creationDateTo)
          ? null
          : moment(filterValues.creationDateTo).format(DEFAULT_DATETIME_FORMAT),
        executionDateStart: isUndefined(filterValues.executionDateStart)
          ? null
          : moment(filterValues.executionDateStart).format(DEFAULT_DATETIME_FORMAT),
        executionDateEnd: isUndefined(filterValues.executionDateEnd)
          ? null
          : moment(filterValues.executionDateEnd).format(DEFAULT_DATETIME_FORMAT),
        instructionDocStatus: isArray(filterValues.instructionDocStatus) ? filterValues.instructionDocStatus.join(',') : null,
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(res => {
      if (res) {
        this.setState(
          {
            selectedLineRowKeys: [],
            // eslint-disable-next-line react/no-unused-state
            selectedLineRows: [],
            selectedRowKeys: [],
            selectedRows: [],
          },
          () => {
            dispatch({
              type: 'requisitionAndReturn/updateState',
              payload: {
                lineList: [],
                linePagination: {},
              },
            });
          }
        );
      }
    });
  }

  /**
   *  查询行列表
   * @param {object} 查询参数
   */
  @Bind()
  handleLineSearch(fields = {}) {
    const { selectedRows } = this.state;
    const { instructionDocId } = selectedRows[0];
    const { dispatch } = this.props;
    dispatch({
      type: 'requisitionAndReturn/queryLineList',
      payload: {
        instructionDocId,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   *  是否显示单据行明细modal
   */
  @Bind()
  handleModalVisible() {
    const { showDetailModal } = this.state;
    this.setState({ showDetailModal: !showDetailModal });
  }

  /**
   * 传递表单对象
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   * 头数据选择操作
   */
  @Bind()
  handleSelectHeadRow(selectedRowKeys, selectedRows) {
    this.setState(
      // eslint-disable-next-line react/no-unused-state
      { selectedRowKeys, selectedRows, selectedLineRows: [], selectedLineRowKeys: [] },
      () => {
        this.handleLineSearch();
      }
    );
  }

  /**
   * 行数据选择操作
   */
  @Bind()
  handleSelectLineRow(record) {
    this.setState({ lineRecord: record }, () => {
      this.handleModalVisible();
    });
  }

  // 单据取消
  @Bind()
  handleCancel() {
    const { selectedRows } = this.state;
    const { instructionDocId } = selectedRows[0];
    const {
      dispatch,
      requisitionAndReturn: { headPagination },
    } = this.props;
    dispatch({
      type: 'requisitionAndReturn/closeInstruction',
      payload: {
        instructionDocId,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleHeadSearch(headPagination);
      }
    });
  }

  /**
   *  新建
   */
  @Bind()
  handleCreate() {
    const { dispatch } = this.props;
    dispatch({
      type: 'requisitionAndReturn/updateState',
      payload: {
        list: [],
        pagination: {},
        headDetail: {},
      },
    });
    dispatch(routerRedux.push({ pathname: `/hwms/requisition-return/create` }));
  }

  // 获取仓库下拉
  @Bind()
  queryStorageList(param) {
    const { dispatch } = this.props;
    dispatch({
      type: 'requisitionAndReturn/queryStorageList',
      payload: {
        siteId: param || getSiteId(),
      },
    });
  }

  // 货位下拉表
  @Bind()
  queryLocatorList(param) {
    const { dispatch } = this.props;
    dispatch({
      type: 'requisitionAndReturn/queryLocatorList',
      payload: {
        locatorId: param,
      },
    });
  }

  // 条码打印
  @Bind()
  printBarCode(record = {}) {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    dispatch({
      type: 'requisitionAndReturn/printBarCode',
      payload: {
        instructionDocId: selectedRows[0].instructionDocId,
        ...record,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleHeadSearch();
      }
    });
  }

  // 打印条码
  @Bind()
  printBarCodeNew() {
    const { selectedBarCodeRow } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'requisitionAndReturn/printingBarcode',
      payload: selectedBarCodeRow.map(e => e.materialLotId),
    }).then(res => {
      if (res && res.success) {
        if (isArray(res.rows.url)) {
          res.rows.url.forEach(e => {
            window.open(e);
          });
        }
        // const file = new Blob(
        //   [`<html><head><meta charset="UTF-8"></head><body>${res.rows.url}</body></html>`],
        //   { type: 'text/html', charset: 'UTF-8' }
        // );
        // const fileURL = URL.createObjectURL(file);
        // const printWindow = window.open(fileURL);
        // printWindow.print();
      } else if (!res.success) {
        notification.warning({
          description: res.message,
        });
      }
    });
  }

  // 条码创建
  @Bind()
  handleBarcodeCreate(record) {
    this.setState({ rowInfo: record, showBrcodeCreate: true });
  }

  // 条码创建取消
  @Bind()
  handleBarcodeCreateModalVisible() {
    this.setState({ showBrcodeCreate: false });
  }

  // 创建条码
  @Bind()
  deliverCreateBarcodeData(fieldsValue, rowInfo) {
    const { dispatch } = this.props;
    const { siteId, siteCode } = this.state.selectedRows[0];
    // 条码数量
    const createQtyAndPrimaryUomQty = parseFloat(fieldsValue.primaryUomQty);
    // 制单数量+料废调换数量
    let quantityAndExchangeQty;
    if (rowInfo.quantity === null) {
      // 判断制单数量是否为空
      quantityAndExchangeQty = 0 + parseFloat(rowInfo.exchangeQty);
    } else if (rowInfo.exchangeQty === null) {
      // 判断料废调换数量是否为空
      quantityAndExchangeQty = parseFloat(rowInfo.quantity) + 0;
    } else if (rowInfo.quantity === null && rowInfo.exchangeQty === null) {
      quantityAndExchangeQty = 0;
    } else {
      quantityAndExchangeQty = parseFloat(rowInfo.quantity) + parseFloat(rowInfo.exchangeQty);
    }
    if (createQtyAndPrimaryUomQty > quantityAndExchangeQty) {
      notification.error({ message: '条码创建数量大于送货单行制单数量' });
    } else {
      dispatch({
        type: 'requisitionAndReturn/deliverCreateBarcodeData',
        payload: {
          ...rowInfo,
          numrangeGenerateDTOS: {
            objectCode: 'MATERIAL_LOT_CODE',
            objectTypeCode: 'MATERIAL_LOT_CODE',
            siteId,
            callObjectCodeList: {
              siteCode,
            },
          },
          siteId,
          enableflag: 'N',
          createReason: 'PURCHASE',
          ...fieldsValue,
        },
      }).then(res => {
        if (res) {
          notification.success({ message: '操作成功' });
        } else {
          // notification.error({ message: res.exception });
        }
      });
    }
  }

  // 勾选条码
  @Bind()
  handleSelectBarCodeRow(selectedRowKeys, selectedRow) {
    // eslint-disable-next-line react/no-unused-state
    this.setState({ selectedBarCodeRowKeys: selectedRowKeys, selectedBarCodeRow: selectedRow });
  }

  // 头打印
  @Bind()
  headPrint(record, index) {
    Modal.confirm({
      title: '单据打印后单据不能修改，请确认',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        const {
          dispatch,
          requisitionAndReturn: { headList = [] },
        } = this.props;
        const instructionDocIdList = [record.instructionDocId];
        dispatch({
          type: 'requisitionAndReturn/headPrint',
          payload: instructionDocIdList,
        }).then(res => {
          if (res) {
            if (res.failed) {
              notification.error({ message: res.exception });
            } else {
              headList[index].printFlagMeaning = "已打印";
              dispatch({
                type: 'requisitionAndReturn/updateState',
                payload: {
                  headList,
                },
              });
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
      },
      onCancel: () => { },
    });
  }

  render() {
    const {
      showDetailModal,
      showBrcodeCreate,
      selectedRowKeys,
      selectedLineRowKeys,
      selectedBarCodeRowKeys,
    } = this.state;
    const {
      requisitionAndReturn: {
        headList = [],
        headPagination = {},
        lineList = [],
        linePagination = {},
        barCodeList,
        barCodePagination,
        statusMap = [],
        docTypeMap = [],
        accountsType = [],
        siteMap = [],
        version = [],
        storageList = [],
        locatorList = [],
      },
      loading: { fetchHeadLoading, fetchLineLoading, closeLoading, fetchHeadPrintLoading },
      tenantId,
    } = this.props;
    const detailProps = {
      tenantId,
      showDetailModal,
      lineRecord: this.state.lineRecord,
      onCancel: this.handleModalVisible,
    };
    const filterProps = {
      tenantId,
      statusMap,
      docTypeMap,
      siteMap,
      accountsType,
      version,
      storageList,
      locatorList,
      onSearch: this.handleHeadSearch,
      onRef: this.handleBindRef,
      queryStorageList: this.queryStorageList,
      queryLocatorList: this.queryLocatorList,
    };
    const listHeadProps = {
      selectedRowKeys,
      pagination: headPagination,
      loading: fetchHeadLoading,
      fetchHeadPrintLoading,
      dataSource: headList,
      onSearch: this.handleHeadSearch,
      onSelectRow: this.handleSelectHeadRow,
      headPrint: this.headPrint,
    };
    const listRowProps = {
      selectedRowKeys: selectedLineRowKeys,
      pagination: linePagination,
      loading: fetchLineLoading,
      dataSource: lineList,
      onSearch: this.handleLineSearch,
      onSelectRow: this.handleSelectLineRow,
      printBarCode: this.printBarCode,
      barcodeCreate: this.handleBarcodeCreate,
    };
    const barcodeCreateProps = {
      rowInfo: this.state.rowInfo,
      showBrcodeCreate,
      onCancel: this.handleBarcodeCreateModalVisible,
      onOk: this.deliverCreateBarcodeData,
      onSelectRow: this.handleSelectBarCodeRow,
      selectedBarCodeRowKeys,
      printBarCode: this.printBarCodeNew,
      headRecord: this.state.selectedRows[0],
      barCodeList,
      barCodePagination,
      // createLoading: false,
    };
    return (
      <React.Fragment>
        <Header
          title={intl.get('hwms.requisitionAndReturn.view.message.title').d('成本中心/内部订单领退料')}
        >
          <Button type="primary" icon="plus" onClick={this.handleCreate}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          {/* <Button type="primary" icon="file">
            打印
          </Button> */}
          <Button
            onClick={this.handleCancel}
            disabled={isEmpty(selectedRowKeys)}
            loading={closeLoading}
          >
            {intl.get('hwms.requisitionAndReturn.view.button.cancel').d('单据取消')}
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTableHead
            {...listHeadProps}
            history={this.props.history}
          />
          <Card
            key="code-rule-liner"
            title={intl.get('hwms.requisitionAndReturn.view.message.LineQuery').d('单据行信息')}
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
          />
          <ListTableLine {...listRowProps} />
          {showDetailModal && <DetailDrawer {...detailProps} />}
          {showBrcodeCreate && <NewBarcodeCreateDrawer {...barcodeCreateProps} />}
        </Content>
      </React.Fragment>
    );
  }
}

export default RequisitionAndReturn;
