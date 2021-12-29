/**
 * @Description: 采购订单查询
 * @author: ywj
 * @date 2020/3/17 15:57
 * @version 1.0
 */

// 引入依赖
import React from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { isEmpty } from 'lodash';
import { DETAIL_CARD_TABLE_CLASSNAME, DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { Card, Button } from 'hzero-ui';
import moment from 'moment';
import { Button as ButtonPermission } from 'components/Permission';
import notification from 'utils/notification';
// import forEach from 'lodash/forEach';
import Filter from './FilterForm';
import HeadTable from './HeadListTable';
import LineTable from './LineListTable';
import DeliveryNoteDrawer from './Drawer/DeliveryNoteDrawer';
import ExpandDrawer from './expandDrawer/ExpandDrawer';
import LineDetailDrawer from './Drawer/LineDetailDrawer';
import OutsourcingOrderDrawer from './expandDrawer/OutsourcingOrderDrawerNew';

const modelPrompt = 'tarzan.hmes.purchaseOrder';

/**
 * @Description: 连接model层
 * @author: ywj
 * @date 2020/3/17 16:26
 * @version 1.0
 */
@connect(({ purchaseOrder, loading }) => ({
  purchaseOrder,
  fetchLoading: loading.effects['purchaseOrder/fetchPurchaseOrderHeadList'],
  fetchLineLoading: loading.effects['purchaseOrder/fetchPurchaseOrderLineList'],
  fetchOutsourceInvoiceQueryLoading: loading.effects['purchaseOrder/fetchOutsourceInvoiceQuery'],
}))
@formatterCollections({
  code: 'tarzan.hmes.purchaseOrder',
})
export default class PurchaseOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedHeadKeys: [],
      selectedHead: [],
      selectedLine: [],
      addData: [], // 代添加的数据
      search: {}, // 查询条件
      pagination: {}, // 分页数据
      showDrawer: false,
      expandDrawer: false, // 弹出创建层
      selectedDeleteRows: [], // 删除选中的数据
      selectedDeleteRows2: [],
      lineDetailfFlag: false, // 行组件明细抽屉
      instructionId: -99, // 查询明显信息
      outsourcingOrder: false,
    };
  }

  // 加载时调用的方法
  componentDidMount() {
    this.fetchPurchaseOrderHeadList();
    const { dispatch } = this.props;
    // 初始化下拉框数据
    dispatch({
      type: 'purchaseOrder/init',
      payload: {},
    });
  }

  // 分发查询头信息
  @Bind()
  fetchPurchaseOrderHeadList = () => {
    const { dispatch } = this.props;
    const { search, pagination } = this.state;
    this.setState({ selectedLine: [] });
    dispatch({
      type: 'purchaseOrder/fetchPurchaseOrderHeadList',
      payload: {
        ...search,
        page: pagination,
      },
    }).then(() => {
      this.setState({ selectedHeadKeys: [], selectedHead: [], selectedLine: [] });
    });
  };

  // 条件查询
  @Bind()
  onSearch(fields = {}) {
    this.setState({ selectedLine: [] });
    // 日期转化
    this.setState(
      {
        search: {
          ...fields,
          demandTimeFrom: fields.demandTimeFrom == null
            ? ""
            : moment(fields.demandTimeFrom).format(DEFAULT_DATETIME_FORMAT),
          demandTimeTo: fields.demandTimeTo == null
            ? ""
            : moment(fields.demandTimeTo).format(DEFAULT_DATETIME_FORMAT),
        },
        pagination: {},
      },
      () => {
        this.fetchPurchaseOrderHeadList();
      }
    );
  }

  // 头分页变化后触发方法
  @Bind()
  handleTableHeadChange(headPagination = {}) {
    this.setState(
      {
        pagination: headPagination,
      },
      () => {
        this.fetchPurchaseOrderHeadList();
      }
    );
  }

  // 重置
  resetSearch = () => {
    this.setState({
      search: {},
      pagination: {},
    });
  };

  // 刷新
  @Bind
  refresh = (pagination = {}) => {
    const { dispatch } = this.props;
    const { search } = this.state;
    dispatch({
      type: 'purchaseOrder/fetchPurchaseOrderHeadList',
      payload: {
        ...search,
        page: pagination,
      },
    });
  };

  /**
   * 头选择操作
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
    this.setState({ selectedLine: [], selectedDeleteRows: [] });
    const { dispatch } = this.props;
    const { selectedHead } = this.state;
    dispatch({
      type: 'purchaseOrder/fetchPurchaseOrderLineList', // [model的命名空间]/[effects中对应的函数名称] 调用model
      payload: {
        page: isEmpty(fields) ? {} : fields,
        sourceInstructionId: selectedHead[0].instructionDocId,
      },
    });
  }

  // 展开创建送货单模态框
  @Bind()
  showCreateForm(flag) {
    this.setState({ showDrawer: flag });
  }

  // 关闭页面
  @Bind()
  handleOnCancel() {
    this.showCreateForm(false);
  }

  // 保存数据
  @Bind()
  handleSaveData() {
    this.showCreateForm(false);
  }

  // 更改选中状态
  @Bind
  onChangeSelected(selectedRowKeys, selectedRow) {
    // 每次添加前先触发行查询， 数据更新。
    // this.handleSearchLine();
    this.setState({
      selectedDeleteRows: selectedRowKeys,
      selectedLine: selectedRow,
    });
  }

  // 添加行信息
  @Bind
  addLineData() {
    // 每次添加前先触发行查询， 数据更新。
    //  this.handleSearchLine();
    // 获取选中的头行数据
    const { selectedHead, selectedLine, addData } = this.state;
    // 先判断选中的数据是否是下达状态
    if (
      selectedHead === [] ||
      selectedHead.length === 0 ||
      selectedHead[0].instructionDocStatus !== 'RELEASED'
    ) {
      notification.error({ message: '当前采购订单的状态不为已下达状态，无法进行送货单创建' });
    }
    // 判断是否选中数据
    if (selectedLine.length === 0) {
      return notification.error({ message: '请选中要添加的数据' });
    }
    // 判断是否已经有数据
    if (addData.length > 0) {
      // 当单据类型为外协 只允许添加1行
      if (
        addData[0].instructionDocType === "OUTSOURCING_PO"
      ) {
        return notification.error({
          message: `外协采购订单行 每次只允许添加一行，不允许多行添加 `,
        });
      }
      // 判断选中的数据供应商和接收货位是否相同
      for (let i = 0; i < selectedLine.length; i++) {
        if (
          addData[0].supplierId !== selectedHead[0].supplierId ||
          addData[0].toLocator !== selectedLine[i].toLocator
        ) {
          return notification.error({
            message: `采购订单行${selectedLine[i].instructionLineNum}的供应商&接收仓库信息与已添加采购订单行的供应商&接收仓库不一致`,
          });
        }
        // 判断选中的单据类型是否相同 不同不让添加
        if (
          addData[0].instructionDocType !== selectedHead[0].instructionDocType
        ) {
          return notification.error({
            message: `采购订单行${selectedLine[i].instructionLineNum}的单据类型与已添加采购订单行的单据类型不一致`,
          });
        }
        // 判断选中的订单类型是否相同 不同不让添加
        if (
          addData[0].poLineType !== selectedLine[i].poLineType
        ) {
          return notification.error({
            message: `采购订单行${selectedLine[i].instructionLineNum}的订单类型与已添加采购订单行的订单类型不一致`,
          });
        }
      }
      // 判断选中的数据是否已经添加，是则报错
      for (let i = 0; i < selectedLine.length; i++) {
        const newList = addData.filter(
          item => item.instructionId === selectedLine[i].instructionId
        );
        if (newList.length > 0) {
          return notification.error({
            message: `采购订单行${selectedLine[i].instructionLineNum}已经被添加，请勿重复添加`,
          });
        }
      }
      for (let i = 0; i < selectedLine.length; i++) {
        for (let j = 0; j < addData.length; j++) {
          if (selectedLine[i].materialId === addData[j].materialId && selectedLine[i].materialVersion === addData[j].materialVersion && selectedLine[i].toLocatorId !== addData[j].toLocatorId) {
            return notification.error({
              message: `物料:${selectedLine[i].materialCode}的接收仓库不一致，不允许添加!`,
            });
          }
        }
      }
    } else {
      // 当单据类型为外协 只允许添加1行
      if (
        selectedHead[0].instructionDocType === "OUTSOURCING_PO" && selectedLine.length > 1
      ) {
        return notification.error({
          message: `外协采购订单行 每次只允许添加一行，不允许多行添加 `,
        });
      }
      // 判断选中的数据接收货位是否相同
      for (let i = 1; i < selectedLine.length; i++) {
        if (selectedLine[0].toLocator !== selectedLine[i].toLocator) {
          return notification.error({
            message: `采购订单行${selectedLine[i].instructionLineNum}的供应商&接收仓库信息与已添加采购订单行的供应商&接收仓库不一致`,
          });
        }
        // 判断选中的订单类型是否相同 不同不让添加
        if (
          selectedLine[0].poLineType !== selectedLine[i].poLineType
        ) {
          return notification.error({
            message: `采购订单行${selectedLine[i].instructionLineNum}的订单类型与已添加采购订单行的订单类型不一致`,
          });
        }
      }
      for (let i = 0; i < selectedLine.length; i++) {
        for (let j = 0; j < selectedLine.length; j++) {
          if (selectedLine[i].materialId === selectedLine[j].materialId && selectedLine[i].materialVersion === selectedLine[j].materialVersion && selectedLine[i].toLocatorId !== selectedLine[j].toLocatorId) {
            return notification.error({
              message: `物料:${selectedLine[i].materialCode}的接收仓库不一致，不允许添加!`,
            });
          }
        }
      }
    }
    for (let i = 0; i < selectedLine.length - 1; i++) {
      for (let j = i + 1; j < selectedLine.length; j++) {
        if (selectedLine[i].materialCode === selectedLine[j].materialCode) {
          if (selectedLine[i].soLineNum !== selectedLine[j].soLineNum && selectedLine[i].soNum !== selectedLine[j].soNum) {
            return notification.error({ message: `${selectedLine[i].materialName}销售订单号不一致` });
          }
        }
      }
    }
    for (let i = 0; i < selectedLine.length; i++) {
      for (let j = 0; j < addData.length; j++) {
        // eslint-disable-next-line no-empty
        if (selectedLine[i].materialCode === addData[j].materialCode) {
          // 如果添加的两个物料相同，两个单号都是空的只能加一个  chang  for  wangkang
          // eslint-disable-next-line no-empty
          if (selectedLine[i].soLineNum === addData[j].soLineNum && addData[j].soNum === selectedLine[i].soNum) {

          } else {
            // 如果两个物料的单号不一样报错
            return notification.error({ message: `${selectedLine[j].materialName}销售订单号不一致` });
          }
        }
      }
    }
    // 判断订单类型为3的是否已经添加过了
    for (let i = 0; i < selectedLine.length - 1; i++) {
      if (selectedLine[i].poLineType === selectedLine[i + 1].poLineType && selectedLine[i + 1].poLineType === '3') {
        return notification.error({ message: `外协采购订单只允许添加一行！` });
      }
    }
    for (let i = 0; i < selectedLine.length; i++) {
      for (let j = 0; j < addData.length; j++) {
        if (selectedLine[i].poLineType === addData[j].poLineType && addData[j].poLineType === '3') {
          return notification.error({ message: `外协采购订单只允许添加一行！` });
        }
      }
    }
    // 进行数据存储,添加头信息部分属性
    for (let i = 0; i < selectedLine.length; i++) {
      selectedLine[i].address = selectedHead[0].address;
      selectedLine[i].siteName = selectedHead[0].siteName;
      selectedLine[i].instructionDocStatus = selectedHead[0].instructionDocStatus;
      selectedLine[i].sourceInstructionId = selectedHead[0].sourceInstructionId;
      selectedLine[i].instructionDocType = selectedHead[0].instructionDocType;
      selectedLine[i].demandTime = selectedHead[0].demandTime;
      selectedLine[i].instructionDocId = selectedHead[0].instructionDocId;
      selectedLine[
        i
      ].instructionDocNum = `${selectedHead[0].instructionDocNum}#${selectedLine[i].instructionLineNum}`;
      selectedLine[i].supplierId = selectedHead[0].supplierId;
      selectedLine[i].supplierCode = selectedHead[0].supplierCode;
      selectedLine[i].supplierName = selectedHead[0].supplierName;
      selectedLine[i].receivedQty =
        selectedLine[i].receivedQty === null ? 0 : selectedLine[i].receivedQty;
      selectedLine[i].coverNum =
        selectedLine[i].quantity - selectedLine[i].receivedQty - selectedLine[i].poQuantitySum;
      selectedLine[i].coverNum = selectedLine[i].coverNum > 0 ? selectedLine[i].coverNum : 0;
      selectedLine[i].quantity3 = selectedLine[i].quantity; // 后端传入的值
      selectedLine[i].quantity1 = 0; // 制单数量
      selectedLine[i].quantity2 = 0;
      selectedLine[i]._status = 'update';
    }
    notification.success({ message: "添加成功！！" });
    //  更改状态
    this.setState({
      addData: [...selectedLine, ...addData],
    });
  }

  // 更改选中状态
  @Bind
  onChangeDeleteSelected(selectedRowKeys, selectedRow) {
    this.setState({
      selectedDeleteRows2: selectedRowKeys,
      selectedLine: selectedRow,
    });
  }

  // 展开调用方法
  @Bind
  expandData() {
    // 获取添加的内容
    const { addData } = this.state;
    const { dispatch } = this.props;
    // 判断是否有添加数据
    if (addData.length === 0) {
      return notification.error({ message: '没有要展开的数据' });
    } else {
      const idList = addData.map(item => item.instructionId);
      //  debugger;
      dispatch({
        type: 'purchaseOrder/fetchCorverNum',
        payload: {
          instructionIdList: idList,
        },
      }).then(res => {
        if (res) {
          const purchaseOrderLineList2 = res;
          for (let i = 0; i < addData.length; i++) {
            for (let j = 0; j < purchaseOrderLineList2.length; j++) {
              if (addData[i].instructionId === purchaseOrderLineList2[j].instructionId) {
                if (purchaseOrderLineList2[j].availableOrderQuantity > 0) {
                  addData[i].coverNum = purchaseOrderLineList2[j].availableOrderQuantity;
                } else {
                  addData[i].coverNum = 0;
                }
              }
            }
          }
          // 更改展示状态
          this.setState({
            expandDrawer: true,
            addData,
          });
        }
      });
    }
  }

  // 关闭窗口调用方法
  @Bind
  expandColseData() {
    // 更改展示状态
    this.setState({
      expandDrawer: false,
      addData: [],
    });
    this.onChangeSelected([], []);
    this.handleSearchLine();
    // window.location.reload(true);
  }

  @Bind
  expandColseData2() {
    this.setState({
      expandDrawer: false,
    });
  }

  @Bind
  skip() {
    const { history } = this.props;
    history.push(`/hwms/delivernode/query`);
  }

  // 外协跳转
  @Bind
  skipOutSource() {
    const { history } = this.props;
    history.push(`/hqms/outsource-manage-platform`);
  }

  // 制单数量
  @Bind()
  updateListQty(value, record, index) {
    // const { lineData } = this.state;
    const { addData } = this.state;
    if (value !== '' && value !== undefined && value !== null) {
      addData[index].quantity2 = value;
    } else {
      addData[index].quantity2 = 0;
    }
  }

  // 删除
  @Bind
  deleteSelected() {
    const { selectedDeleteRows2, addData } = this.state;
    let newList = addData;
    for (let i = 0; i < selectedDeleteRows2.length; i++) {
      newList = newList.filter(item => item.instructionId !== selectedDeleteRows2[i]);
    }
    this.setState({
      addData: newList,
      selectedDeleteRows: [],
      selectedDeleteRows2: [],
    });
  }

  // 行组件明细
  @Bind()
  lineDetail(record, flag) {
    this.setState({ lineDetailfFlag: flag, instructionId: record.instructionId });
  }

  // 外协发货单创建
  @Bind
  outsourcingDeliveryOrderCreate() {
    const { selectedHead } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseOrder/fetchOutsourceInvoiceQuery',
      payload: {
        instructionDocId: selectedHead[0].instructionDocId,
      },
    }).then((res) => {
      if (res) {
        this.setState({ outsourcingOrder: true });
      }
    });
  }

  // 外协关闭
  @Bind()
  createOutClose() {
    this.setState({ outsourcingOrder: false });
  }

  // 渲染 界面布局
  render() {
    const {
      purchaseOrder: {
        code = {},
        purchaseOrderHeadList = [],
        purchaseOrderHeadPagination = {},
        purchaseOrderLineList = [],
        purchaseOrderLinePagination = {},
      },
      fetchLoading,
      fetchLineLoading,
      fetchOutsourceInvoiceQueryLoading,
    } = this.props;
    const {
      selectedHeadKeys,
      expandDrawer,
      addData,
      selectedDeleteRows,
      selectedDeleteRows2,
      selectedHead,
      outsourcingOrder,
    } = this.state;
    const searchFromProps = {
      onSearch: this.onSearch,
      resetSearch: this.resetSearch,
      instructionStatus: code['HIAM.RESOURCE_LEVEL'] || [],
      siteId: code['HIAM.REQUEST_METHOD'] || [],
      instructionDocType: code['WMS.PO.TYPE'] || [],
      poTypeMap: code['WMS.PO_LINE.TYPE'] || [],
    };

    const headListProps = {
      codeMap: code['HIAM.RESOURCE_LEVEL'] || [],
      pagination: purchaseOrderHeadPagination,
      selectedHeadKeys,
      loading: fetchLoading,
      dataSource: purchaseOrderHeadList,
      onSelectHead: this.handleSelectHead,
      onSearch: this.handleTableHeadChange,
    };

    // 设计选中事件
    const rowsLineSelection = {
      selectedRowKeys: selectedDeleteRows,
      onChange: this.onChangeSelected,
    };

    const lineListProps = {
      codeMap: code['HIAM.RESOURCE_LEVEL'] || [],
      pagination: purchaseOrderLinePagination,
      loading: fetchLineLoading,
      dataSource: purchaseOrderLineList,
      onSearch: this.handleSearchLine,
      lineDetail: this.lineDetail,
      rowSelection: rowsLineSelection,
      selectedHead,
    };

    const deliveryNoteProps = {
      showDrawer: this.state.showDrawer,
      onCancel: this.handleOnCancel,
      onOk: this.handleSaveData,
    };
    // 展开的数据
    const expandDataProps = {
      expandDrawer,
      onCancel: this.expandColseData,
      onCancel3: this.expandColseData2,
      skip: this.skip,
      skipOutSource: this.skipOutSource,
      supplierCode: addData,
      supplierName: addData,
      deleteSelected: this.deleteSelected,
      addData,
      codeMap: code['HIAM.RESOURCE_LEVEL'] || [],
      rowsDeleteSelection: {
        selectedRowKeys: selectedDeleteRows2,
        onChange: this.onChangeDeleteSelected,
      },
      selectedDeleteRows2,
      updateListQty: this.updateListQty,
    };
    // 外协采购订单
    const outsourcingOrderDrawer = {
      outsourcingOrder,
      onCancel: this.createOutClose,
      skip: this.skipOutSource,
      onCancel2: this.expandColseData,
    };
    return (
      <React.Fragment>
        {/* <Header title={intl.get(`${modelPrompt}.view.title`).d('采购订单查询')} /> */}
        <Header title={intl.get(`${modelPrompt}.view.title`).d('采购订单查询')}>
          <Button
            icon="create"
            disabled={selectedHeadKeys.length === 0}
            loading={fetchOutsourceInvoiceQueryLoading}
            onClick={() => this.outsourcingDeliveryOrderCreate()}
          >
            {intl.get('hzero.common.button.print').d('外协发料/发货单创建')}
          </Button>
        </Header>
        <Content>
          <Filter {...searchFromProps} />
          <HeadTable {...headListProps} />
          <Card
            key="code-rule-header"
            title={intl.get(`${modelPrompt}.view.line`).d('单据行信息')}
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
          >
            <ButtonPermission type="primary" onClick={() => this.addLineData()}>
              {intl.get('hzero.purchase.button.add').d('添加')}
            </ButtonPermission>
            <ButtonPermission onClick={() => this.expandData()} style={{ marginLeft: '5px' }}>
              {intl.get(`hzero.purchase.button.expand`).d('<<展开')}
            </ButtonPermission>
            <br />
            <br />
            <LineTable {...lineListProps} style={{ marginTop: '10px' }} />
          </Card>
          {this.state.showDrawer && <DeliveryNoteDrawer {...deliveryNoteProps} />}
          {expandDrawer && <ExpandDrawer {...expandDataProps} />}
          {this.state.lineDetailfFlag && (
            <LineDetailDrawer
              lineDetailfFlag={this.state.lineDetailfFlag}
              onCancel={() => this.lineDetail(false)}
              instructionId={this.state.instructionId}
            />
          )}
          {outsourcingOrder && <OutsourcingOrderDrawer {...outsourcingOrderDrawer} />}
        </Content>
      </React.Fragment>
    );
  }
}
