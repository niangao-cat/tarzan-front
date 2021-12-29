/**
 * @Description: 库存调拨
 * @author: ywj
 * @date 2020/3/25 12:03
 * @version 1.0
 */

// 引入依赖
import React from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { isEmpty, isArray } from 'lodash';
import { DETAIL_CARD_TABLE_CLASSNAME, DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import moment from 'moment';
import { Card, Modal, Table, Button } from 'hzero-ui';
import queryString from 'querystring';
import notification from 'utils/notification';
import Filter from './FilterForm';
import HeadTable from './HeadListTable';
import LineTable from './LineListTable';
import { getSiteId } from '@/utils/utils';

// 暂定模板
const modelPormt = 'hawk.tarzan.inventory-allocation';

// 连接model
@connect(({ inventoryAllocation, loading }) => ({
  inventoryAllocation,
  fetchHeadLoading: loading.effects['inventoryAllocation/fetchHeaderList'],
  fetchLineLoading: loading.effects['inventoryAllocation/fetchLineList'],
  fetchDetailLoading: loading.effects['inventoryAllocation/fetchDetailList'],
  headStopLoading: loading.effects['inventoryAllocation/headStop'],
  headStopCancelLoading: loading.effects['inventoryAllocation/headStopCancel'],
  headAuditLoading: loading.effects['inventoryAllocation/headAudit'],
  headCancelLoading: loading.effects['inventoryAllocation/headCancel'],
  fetchHeadPrintLoading: loading.effects['inventoryAllocation/headPrint'],
}))
@formatterCollections({
  code: 'hawk.tarzan.inventory-allocation',
})
export default class InventoryAllocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedHeadKeys: [],
      selectedHead: [],
      search: {}, // 查询条件
      pagination: {}, // 分页数据
      expandDetail: false, // 展开明显界面
      lineRecord: {},
    };
  }

  // 加载时调用的方法
  componentDidMount() {
    // 加载头信息
    const search = {
      fromSiteId: getSiteId(),
      toSiteId: getSiteId(),
    };
    this.fetchHeadList(search);
    // 加载下拉框
    const { dispatch } = this.props;
    dispatch({
      type: 'inventoryAllocation/init',
    });
    dispatch({
      type: 'inventoryAllocation/querySiteList',
      payload: {},
    });
    dispatch({
      type: 'inventoryAllocation/queryLocatorList',
      payload: {},
    });
    dispatch({
      type: 'inventoryAllocation/fetchCurrentRoleMap',
      payload: {},
    });
  }

  // 查询头信息
  fetchHeadList(value) {
    const { dispatch } = this.props;
    const { search, pagination } = this.state;
    console.log('search', search);
    dispatch({
      type: 'inventoryAllocation/fetchHeaderList',
      payload: {
        ...value,
        ...search,
        page: pagination,
      },
    }).then(res => {
      if (res) {
        this.setState({ selectedHeadKeys: [], selectedHead: [] }, () => {
          dispatch({
            type: 'inventoryAllocation/updateState',
            payload: {
              lineList: [],
              linePaginationList: {},
            },
          });
        });
      }
    });
  }

  // 刷新头信息
  @Bind()
  refreshHead(pagination = {}) {
    const { dispatch } = this.props;
    const { search } = this.state;
    dispatch({
      type: 'inventoryAllocation/fetchHeaderList',
      payload: {
        ...search,
        page: pagination,
      },
    }).then(res => {
      if (res) {
        this.setState({ selectedHeadKeys: [], selectedHead: [] }, () => {
          dispatch({
            type: 'inventoryAllocation/updateState',
            payload: {
              lineList: [],
              linePaginationList: {},
            },
          });
        });
      }
    });
  }

  // 刷新行信息
  @Bind
  refreshLine(pagination = {}) {
    const { dispatch } = this.props;
    const { search } = this.state;
    dispatch({
      type: 'inventoryAllocation/fetchHeaderList',
      payload: {
        ...search,
        page: pagination,
      },
    });
  }

  // 查询绑定
  @Bind()
  onSearch(fieldValues) {
    this.setState(
      {
        search: {
          ...fieldValues,
          creationDateFrom: fieldValues.creationDateFrom
            ? moment(fieldValues.creationDateFrom).format(DEFAULT_DATETIME_FORMAT)
            : null,
          creationDateTo: fieldValues.creationDateTo
            ? moment(fieldValues.creationDateTo).format(DEFAULT_DATETIME_FORMAT)
            : null,
            instructionStatus: isArray(fieldValues.instructionStatus) ? fieldValues.instructionStatus.join(',') : null,
        },
        pagination: {},
      },
      () => {
        this.refreshHead(fieldValues);
      }
    );
  }

  // 重置
  // 重置
  resetSearch = () => {
    this.setState({
      search: {},
      pagination: {},
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

  @Bind()
  handleSearchLine(fields = {}) {
    const { dispatch } = this.props;
    const { selectedHead } = this.state;
    dispatch({
      type: 'inventoryAllocation/fetchLineList', // [model的命名空间]/[effects中对应的函数名称] 调用model
      payload: {
        page: isEmpty(fields) ? {} : fields,
        sourceInstructionId: selectedHead[0].instructionDocId,
      },
    });
  }

  // 新建单据
  @Bind()
  handleCreateHeader() {
    const { dispatch } = this.props;
    // 清空新建行信息
    dispatch({
      type: 'inventoryAllocation/updateState',
      payload: {
        lineCreateList: [],
        lineCreatePaginationList: {},
      },
    });
    const {
      match: { path },
      location: { search },
    } = this.props;
    const { access_token: accessToken } = queryString.parse(search.substring(1));
    this.props.history.push({
      pathname:
        path.indexOf('/private') === 0
          ? `/private/hwms/inventory-allocation/create`
          : `/hwms/inventory-allocation/create`,
      search: path.indexOf('/private') === 0 ? `?access_token=${accessToken}` : '',
    });
  }

  // 点击头时候改变数据‘
  @Bind()
  onRow(record) {
    const { dispatch } = this.props;
    if (record.instructionDocStatus !== "NEW") {
      return notification.error({ message: "单据的状态不为新建，不可更新" });
    }
    dispatch({
      type: 'inventoryAllocation/fetchLineUpdateList', // [model的命名空间]/[effects中对应的函数名称] 调用model
      payload: {
        sourceInstructionId: record.instructionDocId,
      },
    }).then(res => {
      const { inventoryAllocation: { inspectLineUpdate = [] }, history } = this.props;
      if (res) {
        const inspectHeadSelect = record;
        if (inspectLineUpdate.length > 0) {
          inspectHeadSelect.fromWarehouseId = inspectLineUpdate[0].fromWarehouseId;
          inspectHeadSelect.fromWarehouseCode = inspectLineUpdate[0].fromWarehouseCode;
          inspectHeadSelect.toWarehouseId = inspectLineUpdate[0].toWarehouseId;
          inspectHeadSelect.toWarehouseCode = inspectLineUpdate[0].toWarehouseCode;
        }
        // 设置要打开的选中信息
        dispatch({
          type: 'inventoryAllocation/updateState',
          payload: {
            inspectHeadSelect,
          },
        });
        dispatch({
          type: 'inventoryAllocation/selectWarehouseList',
          payload: {
            siteId: getSiteId(),
          },
        }).then(() => {
          setTimeout(() => {
            history.push(
              `/hwms/inventory-allocation/update`
            );
          }, "100");
        });
      }
    });
  }

  // 展开明细界面
  @Bind
  showDetail(record) {
    this.setState({
      expandDetail: true,
      lineRecord: record,
    }, () => this.fetchDetail());
  }

  @Bind()
  fetchDetail(fields = {}) {
    const { dispatch } = this.props;
    const { lineRecord } = this.state;
    dispatch({
      type: 'inventoryAllocation/fetchDetailList',
      payload: {
        ...lineRecord,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }


  // 关闭明细界面
  @Bind
  closeDetail() {
    this.setState({
      expandDetail: false,
    });
  }

  @Bind()
  headButClick(type) {
    const { dispatch } = this.props;
    let payload;
    let path;
    const { selectedHead = [] } = this.state;
    switch (type) {
      case 'ST': // 暂停
        payload = {
          selectedHead,
        };
        path = 'inventoryAllocation/headStop';
        break;
      case 'STCN': // 暂停取消
        payload = {
          selectedHead,
        };
        path = 'inventoryAllocation/headStopCancel';
        break;
      case 'AD': // 审核
        payload = {
          selectedHead,
        };
        path = 'inventoryAllocation/headAudit';
        break;
      case 'CN': // 取消
        payload = {
          selectedHead,
        };
        path = 'inventoryAllocation/headCancel';
        break;
      case 'CS': // 取消
        if (selectedHead.length === 0) {
          return;
        }
        payload = {
          ...selectedHead[0],
        };
        path = 'inventoryAllocation/headClose';
        break;
      default:
        break;
    }
    dispatch({
      type: path,
      payload,
    }).then(() => {
      notification.success();
      this.fetchHeadList();
      this.setState({ selectedHeadKeys: [], selectedHead: [] });
    });
  }

  // 头打印
  @Bind()
  headPrint(record, index) {
    const {
      dispatch,
      inventoryAllocation: {
        headList = [], // 头信息
      },
    } = this.props;
    const instructionDocIdList = [record.instructionDocId];
    dispatch({
      type: 'inventoryAllocation/headPrint',
      payload: instructionDocIdList,
    }).then(res => {
      if (res) {
        if (res.failed) {
          notification.error({ message: res.exception });
        } else {
          headList[index].printFlagMeaning = "已打印";
          dispatch({
            type: 'inventoryAllocation/updateState',
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
  }

  render() {
    // 获取加载的状态
    const {
      inventoryAllocation: {
        headList = [], // 头信息
        headPaginationList = {}, // 头分页
        lineList = [], // 行信息
        linePaginationList = {}, // 行分页
        siteMap = [], // 站点
        statusMap = [], // 单据状态
        roleMap = [], // 角色编码
        statusListMap = [], // 限制取消的状态值集
        currentRoleMap = [],
        typeMap = [], // 单据类型
        warehouseMap = [], // 仓库
        locatorMap = [], // 貨位
        materialVersionMap = [], // 物料版本
        uomMap = [], // 单位
        fromWarehouseMap = [],
        toWarehouseMap = [],
        fromLocatorMap = [],
        toLocatorMap = [],
        detailList = [],
        detailListPagination = {},
      },
      fetchHeadLoading,
      fetchLineLoading,
      fetchDetailLoading,
      headStopLoading,
      headStopCancelLoading,
      headAuditLoading,
      headCancelLoading,
      fetchHeadPrintLoading,
    } = this.props;
    // 获取当前的状态
    const { selectedHeadKeys, expandDetail, selectedHead } = this.state;
    // 设置查询条件所需的
    const searchFromProps = {
      siteMap: siteMap || [],
      statusMap: statusMap || [],
      typeMap: typeMap || [],
      warehouseMap: warehouseMap || [],
      locatorMap: locatorMap || [],
      fromWarehouseMap,
      toWarehouseMap,
      fromLocatorMap,
      toLocatorMap,
      materialVersionMap: materialVersionMap || [],
      onSearch: this.onSearch,
      resetSearch: this.resetSearch,
    };
    // 加入 头行元素
    const headListProps = {
      siteMap: siteMap || [],
      statusMap: statusMap || [],
      typeMap: typeMap || [],
      pagination: headPaginationList,
      selectedHeadKeys,
      loading: fetchHeadLoading,
      dataSource: headList,
      fetchHeadPrintLoading,
      onRow: this.onRow,
      onSelectHead: this.handleSelectHead,
      onSearch: this.refreshHead,
      headPrint: this.headPrint,
    };

    const lineListProps = {
      statusMap: statusMap || [],
      siteMap: siteMap || [],
      warehouseMap: warehouseMap || [],
      materialVersionMap: materialVersionMap || [],
      uomMap: uomMap || [],
      locatorMap: locatorMap || [],
      pagination: linePaginationList,
      loading: fetchLineLoading,
      dataSource: lineList,
      onSearch: this.handleSearchLine,
      onRow: this.showDetail,
    };
    const columnsDetail = [
      {
        title: intl.get(`lineNum `).d('行号'),
        width: 150,
        render: (val, record, index) => index + 1,
      },
      {
        title: intl.get(`materialLotCode`).d('物料批'),
        width: 150,
        dataIndex: 'materialLotCode',
      },
      {
        title: intl.get(`lotStatusMeaning`).d('状态'),
        dataIndex: 'lotStatusMeaning',
        width: 150,
      },
      {
        title: intl.get(`actualQty`).d('数量'),
        width: 120,
        dataIndex: 'actualQty',
      },
      {
        title: intl.get(`materialCode`).d('物料'),
        width: 150,
        dataIndex: 'materialCode',
      },
      {
        title: intl.get(`materialName`).d('物料描述'),
        width: 150,
        align: 'center',
        dataIndex: 'materialName',
      },
      {
        title: intl.get(`lot`).d('批次'),
        width: 150,
        align: 'center',
        dataIndex: 'lot',
      },
      {
        title: intl.get(`parentLocatorCode`).d('仓库'),
        width: 120,
        dataIndex: 'parentLocatorCode',
      },
      {
        title: intl.get(`locatorCode`).d('货位'),
        width: 120,
        dataIndex: 'locatorCode',
      },
      {
        title: intl.get(`enableFlagMeaning`).d('有效性'),
        width: 120,
        dataIndex: 'enableFlagMeaning',
      },
    ];
    let isInStatusMap = false;
    if (selectedHead.length > 0) {
      isInStatusMap = statusListMap.some(row => row.meaning === selectedHead[0].instructionDocStatusMeaning);
    }
    const isInRoleMap = roleMap.some(row => currentRoleMap.some(role => role.name === row.meaning));
    return (
      <div>
        <Header title={intl.get(`${modelPormt}.view.title`).d('库存调拨单主界面')}>
          <Button icon="plus" type="primary" onClick={this.handleCreateHeader}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          {/* <Button icon="file" disabled={isEmpty(selectedHeadKeys)}>
            {intl.get('hwms.barcodeQuery.view.message.print').d('打印')}
          </Button> */}
          <Button loading={headStopLoading} icon="play-circle-o" onClick={() => this.headButClick('ST')} disabled={isEmpty(selectedHeadKeys)}>
            暂挂
          </Button>
          <Button loading={headStopCancelLoading} icon="close-circle-o" onClick={() => this.headButClick('STCN')} disabled={isEmpty(selectedHeadKeys)}>
            暂挂取消
          </Button>
          <Button loading={headAuditLoading} icon="" onClick={() => this.headButClick('AD')} disabled={isEmpty(selectedHeadKeys)}>
            审核
          </Button>
          <Button loading={headCancelLoading} icon="close-circle-o" onClick={() => this.headButClick('CN')} disabled={isEmpty(selectedHeadKeys)}>
            取消
          </Button>
          {!isInRoleMap
            ? ''
            : (
              <Button icon="close-circle-o" onClick={() => this.headButClick('CS')} disabled={isEmpty(selectedHeadKeys) || isInStatusMap}>
                关闭
              </Button>
            )
          }
        </Header>
        <Content>
          <Filter {...searchFromProps} />
          <HeadTable {...headListProps} />
          <Card
            key="code-rule-header"
            title={intl.get(`${modelPormt}.view.line`).d('单据行信息')}
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
          >
            <LineTable {...lineListProps} />
            {expandDetail && (
              <Modal
                destroyOnClose
                width={800}
                title={intl.get('tarzan.acquisition.collection.title.detail').d('明细')}
                visible={expandDetail}
                onCancel={this.closeDetail}
                wrapClassName="ant-modal-sidebar-right"
                transitionName="move-right"
                footer={null}
              >
                <Table
                  bordered
                  loading={fetchDetailLoading}
                  dataSource={detailList}
                  columns={columnsDetail}
                  pagination={detailListPagination}
                  onChange={page => this.fetchDetail(page)}
                />
              </Modal>
            )}
          </Card>
        </Content>
      </div>
    );
  }
}
