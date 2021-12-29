/**
 *送货单查询
 *@date：2019/9/22
 *@author：junhui.liu <junhui.liu@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Card, Button, notification } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { Content, Header } from 'components/Page';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import intl from 'utils/intl';
import { DETAIL_CARD_TABLE_CLASSNAME, DEFAULT_DATE_FORMAT } from 'utils/constants';
import ListTableHead from './ListTableHead';
import ListTableRow from './ListTableRow';
import FilterForm from './FilterForm';
import CreateBarcodeDrawer from './Detail/DetailDrawer';
import NewBarcodeCreateDrawer from './Drawer/NewBarcodeCreateDrawer';
import LineDetail from './Detail/LineDetail';

/**
 * 将models中的state绑定到组件的props中,connect 方法传入的第一个参数是 mapStateToProps 函数，
 * mapStateToProps 函数会返回一个对象，用于建立 State 到 Props 的映射关系
 */
@connect(({ deliverQuery, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  deliverQuery,
  fetchLoading: loading.effects['deliverQuery/deliverHeadList'],
  fetchLineLoading: loading.effects['deliverQuery/deliverRowList'],
  fetchheadPrintLoading: loading.effects['deliverQuery/headPrint'],
}))
// fetchLoading和saveLoadding实现加载效果,自定义写法
class DeliverQuery extends Component {
  form;

  filterForm;

  constructor(props) {
    super(props);
    this.state = {
      selectedHeadKeys: [],
      selectedRowKeys: [],
      selectedHead: [],
      selectedRow: [],
      showCreateDrawer: false,
      rowInfo: {},
      showBrcodeCreate: false, // 条码创建抽屉显示标志
      selectedBarCodeRowKeys: [], // 条码
      // eslint-disable-next-line react/no-unused-state
      selectedBarCodeRow: [], // 条码
      createLoading: false,
      lineDetailDrawer: false,
      detailDatas: {},
    };
  }

  componentDidMount() {
    // 组件挂载初始化调用，就是页面刚进入时候需要调用的方法
    const { tenantId, dispatch } = this.props;
    // 批量查询独立值集
    dispatch({
      type: 'deliverQuery/batchLovData',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'deliverQuery/getSiteList',
      payload: {},
    }).then(() => {
      this.handleSearch();
    });
  }

  /**
   * 送货单数据查询
   * @param {object} fields - 查询参数
   */
  @Bind()
  handleSearch(fields = {}) {
    const { dispatch } = this.props;
    // const dispatch= this.props.dispatch;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    // action对象：type 属性指明具体的行为，其它字段可以自定义
    dispatch({
      type: 'deliverQuery/deliverHeadList', // [model的命名空间]/[effects中对应的函数名称] 调用model
      payload: {
        ...filterValues,
        deliveryTimeStart: isEmpty(filterValues.deliveryTimeStart)
          ? undefined
          : moment(filterValues.deliveryTimeStart).format(DEFAULT_DATE_FORMAT),
        deliveryTimeEnd: isEmpty(filterValues.deliveryTimeEnd)
          ? undefined
          : moment(filterValues.deliveryTimeEnd).format(DEFAULT_DATE_FORMAT),
        expectedArrivalTimeStart: isEmpty(filterValues.expectedArrivalTimeStart)
          ? undefined
          : moment(filterValues.expectedArrivalTimeStart).format(DEFAULT_DATE_FORMAT),
        expectedArrivalTimeEnd: isEmpty(filterValues.expectedArrivalTimeEnd)
          ? undefined
          : moment(filterValues.expectedArrivalTimeEnd).format(DEFAULT_DATE_FORMAT),
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(res => {
      if (res) {
        if (isEmpty(fields)) {
          this.setState(
            { selectedHeadKeys: [], selectedHead: [], selectedRowKeys: [], selectedRow: [] },
            () => {
              dispatch({
                type: 'deliverQuery/updateState',
                payload: {
                  rowList: [],
                  rowPagination: {},
                },
              });
            }
          );
        }
      }
    });
  }

  /**
   *  创建明细
   */
  @Bind()
  handleDeliverDetail() {
    const { dispatch } = this.props;
    dispatch({
      type: 'deliverQuery/updateState',
      payload: { detail: {} },
    });
    this.handleModalVisible(true);
  }

  /**
   *  是否显示明细modal
   */
  @Bind()
  handleModalVisible(flag) {
    if (flag) {
      this.setState({ showCreateDrawer: flag });
    } else {
      this.setState({ showCreateDrawer: flag, selectedRowKeys: [], selectedRow: [] });
    }
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
   * 送货单头选择操作
   */
  @Bind()
  handleSelectHead(selectedHeadKeys, selectedHead) {
    this.setState({ selectedHeadKeys, selectedHead }, () => {
      this.handleSearchLine();
    });
  }

  /**
   * 查询行
   */
  @Bind()
  handleSearchLine(fields = {}) {
    const { dispatch } = this.props;
    const { selectedHead } = this.state;
    dispatch({
      type: 'deliverQuery/deliverRowList', // [model的命名空间]/[effects中对应的函数名称] 调用model
      payload: {
        page: isEmpty(fields) ? {} : fields,
        instructionDocId: selectedHead[0].instructionDocId,
      },
    });
  }

  /**
   * 送货单行选择操作
   */
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRow) {
    this.setState({ selectedRowKeys, selectedRow }); // 选中
    this.handleModalVisible(true);
  }

  /**
   * 控制条码创建modal显示与隐藏
   * @param {boolean}} flag 是否显示modal
   */
  @Bind()
  handleBarcodeCreateModalVisible(createFlag) {
    this.setState({ showBrcodeCreate: createFlag });
  }

  @Bind()
  handleBarcodeCreate(record) {
    this.setState({ rowInfo: record });
    this.handleBarcodeCreateModalVisible(true, false);
  }

  // 创建条码
  @Bind()
  deliverCreateBarcodeData(fieldsValue, rowInfo) {
    this.setState({ createLoading: true });
    const { dispatch } = this.props;
    const { siteId, siteCode } = this.state.selectedHead[0];
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
      this.setState({ createLoading: false });
      notification.error({ message: '条码创建数量大于送货单行制单数量' });
    } else {
      dispatch({
        type: 'deliverQuery/deliverCreateBarcodeData',
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
          this.setState({ createLoading: false });
          notification.success({ message: '操作成功' });
        } else {
          this.setState({ createLoading: false });
          notification.error({ message: res.exception });
        }
      });
    }
  }

  // 获取条码
  @Bind()
  getBarCode() {}

  // 打印条码
  @Bind()
  printBarCode() {
    const { selectedBarCodeRow } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'deliverQuery/printingBarcode',
      payload: selectedBarCodeRow.map(e => e.materialLotId),
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
      // if (res && res.success) {
      //   if(isArray(res.rows.url)) {
      //     res.rows.url.forEach(e => {
      //       window.open(e);
      //     });
      //   }
      //   // const file = new Blob(
      //   //   [`<html><head><meta charset="UTF-8"></head><body>${res.rows.url}</body></html>`],
      //   //   { type: 'text/html', charset: 'UTF-8' }
      //   // );
      //   // const fileURL = URL.createObjectURL(file);
      //   // const printWindow = window.open(fileURL);
      //   // printWindow.print();
      // } else if(!res.success) {
      //   notification.warning({
      //     description: res.message,
      //   });
      // }
    });
  }

  // 勾选条码
  @Bind()
  handleSelectBarCodeRow(selectedRowKeys, selectedRow) {
    // eslint-disable-next-line react/no-unused-state
    this.setState({ selectedBarCodeRowKeys: selectedRowKeys, selectedBarCodeRow: selectedRow });
  }

  // 取消送货单
  cancelInstruction() {
    if(isEmpty(this.state.selectedHead)){
      notification.error({ message: "请选择送货单！" });
      return;
    }
    const { dispatch } = this.props;
    const { instructionDocId } = this.state.selectedHead[0];
    if (instructionDocId) {
      dispatch({
        type: 'deliverQuery/cancelInstruction',
        payload: {
          instructionDocId,
        },
      }).then(res => {
        if (res.failed) {
          notification.error({ message: res.exception });
        } else {
          this.handleSearch();
        }
      });
    } else {
      notification.error({ message: '请勾选送货单！' });
    }
  }

  // 头打印
  @Bind()
  headPrint(record) {
    const {
      dispatch,
    } = this.props;
    const instructionDocIds = [record.instructionDocId];
    dispatch({
      type: 'deliverQuery/headPrint',
      payload: instructionDocIds,
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
          // const newwindow = window.open(res.rows.url, 'newwindow');
          // if (newwindow) {
          //   // newwindow.print();
          // } else {
          //   notification.error({ message: '当前窗口已被浏览器拦截，请手动设置浏览器！' });
          // }
        }
      }
    });
  }

  // 明细查询
  @Bind()
  detailClick(record) {
    this.setState({detailDatas: record, lineDetailDrawer: !this.state.lineDetailDrawer});
    const { dispatch } = this.props;
    // 查询产量
    dispatch({
      type: 'deliverQuery/fetchLineDetailList',
      payload: {
        instructionId: record.instructionId,
      },
    });
  }

  // 明细关闭页面
  @Bind
  onLineDetailCancel(){
    this.setState({ lineDetailDrawer: !this.state.lineDetailDrawer});
  }

  // 明细分页变化后触发方法
  @Bind
  handleTableLineDetailChange(fields = {}){
    const { dispatch } = this.props;
    // 根据页数查询报表明细信息
    dispatch({
      type: 'deliverQuery/fetchLineDetailList',
      payload: {
        instructionId: this.state.detailDatas.instructionId,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  render() {
    const {
      selectedHead,
      selectedRow,
      selectedHeadKeys,
      selectedRowKeys,
      showBrcodeCreate,
      selectedBarCodeRowKeys,
      lineDetailDrawer,
    } = this.state;
    const {
      deliverQuery: {
        headPagination = {},
        rowPagination = {},
        headList = [],
        rowList = [],
        detail = {},
        statusMap = [],
        barCodeList = [],
        barCodePagination = {},
        lineDetailList = [],
        lineDetailPagination = {},
        defaultSite = {},
      },
      fetchLoading,
      fetchLineLoading,
      fetchheadPrintLoading,
      tenantId,
    } = this.props;
    const filterProps = {
      tenantId,
      statusMap,
      defaultSite,
      onSearch: this.handleSearch, // 手动触发
      onRef: this.handleBindRef, // 默认触发
    };
    const listHeadProps = {
      pagination: headPagination,
      selectedHeadKeys,
      loading: fetchLoading,
      dataSource: headList,
      fetchheadPrintLoading,
      onSelectHead: this.handleSelectHead,
      onSearch: this.handleSearch,
      headPrint: this.headPrint,
    };
    const listRowProps = {
      pagination: rowPagination,
      selectedRowKeys,
      loading: fetchLineLoading,
      dataSource: rowList,
      onSelectRow: this.handleSelectRow,
      onSearch: this.handleSearchLine,
      barcodeCreate: this.handleBarcodeCreate,
      detailClick: this.detailClick,
    };
    const { showCreateDrawer } = this.state;
    const detailProps = {
      detail,
      selectedHead, // 传值，传到子组件
      selectedRow,
      showCreateDrawer,
      saveLoading: false,
      onCancel: this.handleModalVisible,
      onOk: this.saveData,
    };
    const barcodeCreateProps = {
      rowInfo: this.state.rowInfo,
      showBrcodeCreate,
      onCancel: this.handleBarcodeCreateModalVisible,
      detail,
      onOk: this.deliverCreateBarcodeData,
      onSelectRow: this.handleSelectBarCodeRow,
      selectedBarCodeRowKeys,
      printBarCode: this.printBarCode,
      headRecord: this.state.selectedHead[0],
      barCodeList,
      barCodePagination,
      createLoading: this.state.createLoading,
    };
    const lineDetailProps = {
      lineDetailDrawer,
      dataSource: lineDetailList,
      pagination: lineDetailPagination,
      handleTableLineDetailChange: this.handleTableLineDetailChange,
      onLineDetailCancel: this.onLineDetailCancel,
    };
    return (
      <React.Fragment>
        <Header title={intl.get('hwms.deliverQuery.view.message.deliverTitle').d('送货单查询')}>
          <Button type="primary" icon="close" onClick={() => this.cancelInstruction()}>
            取消
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTableHead {...listHeadProps} />
          <Card
            key="code-rule-header"
            title={intl.get('hwms.deliverQuery.view.message.deliverLine').d('送货单行查询')}
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
          >
            <ListTableRow {...listRowProps} />
            {showCreateDrawer && <CreateBarcodeDrawer {...detailProps} />}
            {showBrcodeCreate && <NewBarcodeCreateDrawer {...barcodeCreateProps} />}
            {lineDetailDrawer && <LineDetail {...lineDetailProps} />}
          </Card>
        </Content>
      </React.Fragment>
    );
  }
}

export default DeliverQuery;
