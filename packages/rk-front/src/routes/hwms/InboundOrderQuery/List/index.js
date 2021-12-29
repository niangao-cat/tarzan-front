/**
 * 异常信息维护 - AbnormalInfo
 * @date: 2020/05/09 10:12:38
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty } from 'lodash';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { Header, Content } from 'components/Page';
import {
  filterNullValueObject,
  getCurrentOrganizationId,
} from 'utils/utils';
import moment from 'moment';

import { Button, Modal } from 'hzero-ui';
import { Button as ButtonPermission } from 'components/Permission';
import FilterForm from './FilterForm';
import HeadTable from './HeadTable';
import LineTable from './LineTable';
import DetailDrawer from '../Detail/DetailDrawer';
// import styles from './index.less';


@connect(({ inboundOrderQuery, loading }) => ({
  inboundOrderQuery,
  fetchHeadListLoading: loading.effects['inboundOrderQuery/fetchHeadList'],
  fetchLineListLoading: loading.effects['inboundOrderQuery/fetchLineList'],
  fetchLineDetailLoading: loading.effects['inboundOrderQuery/fetchLineDetail'],
  fetchHeadPrintLoading: loading.effects['inboundOrderQuery/headPrint'],
  fetchHeadCancelDocLoading: loading.effects['inboundOrderQuery/headCancelDoc'],
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: 'tarzan.hmes.purchaseOrder',
})
export default class InboundOrderQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedHeadRows: [],
      selectedLineRowKeys: [],
      selectedLineRow: [],
      visible: false,
      headRecord: {},
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'inboundOrderQuery/init',
    });
    // this.handleFetchHeadList();
    // this.handleFetchSelectList();
  }

  @Bind()
  initData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'inboundOrderQuery/updateState',
      payload: {
        headList: [],
        headPagination: {},
        lineList: [],
        linePagination: {},
      },
    });
  }

  @Bind()
  handleFetchHeadList(page = {}) {
    const { dispatch } = this.props;
    this.setState({ selectedHeadRows: [] });
    const value = this.formDom ? this.formDom.getFieldsValue() : {};
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    dispatch({
      type: 'inboundOrderQuery/fetchHeadList',
      payload: {
        page: isEmpty(page) ? {} : page,
        ...filterValue,
        creationDateFrom: isUndefined(filterValue.creationDateFrom)
          ? null
          : moment(filterValue.creationDateFrom).format('YYYY-MM-DD HH:mm:ss'),
        creationDateTo: isUndefined(filterValue.creationDateTo)
          ? null
          : moment(filterValue.creationDateTo).format('YYYY-MM-DD HH:mm:ss'),
      },
    }).then(res => {
      if (res) {
        this.headchild.setState({
          selectedRows: {},
        });
        dispatch({
          type: 'inboundOrderQuery/updateState',
          payload: {
            lineList: [],
            linePagination: false,
          },
        });
      }
    });
  }


  // 勾行数据
  @Bind()
  handleChangeSelectLineRows(selectedRowKeys, selectedRow) {
    this.setState({ selectedLineRowKeys: selectedRowKeys, selectedLineRow: selectedRow });
  }

  // 查询行数据
  @Bind()
  handleFetchLineList(fields = {}, record) {
    this.setState({ headRecord: record });
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'inboundOrderQuery/fetchLineList',
      payload: {
        ...record,
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(res => {
      if (res) {
        this.setState({ selectedLineRowKeys: [], selectedLineRow: [] });
      }
    });
  }

  // 明细查询
  @Bind()
  handleFetchDetailList(val, page = {}) {
    const {
      dispatch,
    } = this.props;
    const { selectedLineRow } = this.state;
    const instructionIdList = [];
    selectedLineRow.forEach(item => {
      instructionIdList.push(item.instructionId);
    });
    dispatch({
      type: 'inboundOrderQuery/fetchLineDetail',
      payload: {
        instructionIdList,
        ...val,
        page: isEmpty(page) ? {} : page,
      },
    });
  }

  // 关闭抽屉
  @Bind()
  onCancelDrawer(flag) {
    this.setState({ visible: flag });
    // 如果打开抽屉调这个方法
    if (flag) {
      this.handleFetchDetailList();
    }
  }

  // 头打印
  @Bind()
  headPrint() {
    const {
      dispatch,
    } = this.props;
    // const instructionDocIdList = [record.instructionDocId];
    dispatch({
      type: 'inboundOrderQuery/headPrint',
      payload: this.state.selectedHeadRows,
      // payload: instructionDocIdList,
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

  // 单据撤销
  @Bind()
  showConfirmCancel(n) {
    Modal.confirm({
      title: `是否确认撤销${n}个单据？`,
      onOk: () => {
        this.headCancelDoc();
      },
      onCancel() {},
      okText: '确认',
      cancelText: '取消',
    });
  }

  // 单据撤销
  @Bind()
  headCancelDoc() {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'inboundOrderQuery/headCancelDoc',
      payload: this.state.selectedHeadRows,
    }).then(res => {
      if (res) {
        if (res.failed) {
          notification.error({ message: res.exception });
        }
        this.handleFetchHeadList();
      }
    });
  }

  // 选中头事件
  @Bind
  onHeadChange(selectedHeadRows) {
    this.setState({
      selectedHeadRows,
    });
  }

  // 渲染 界面布局
  render() {
    const {
      fetchHeadListLoading,
      fetchLineListLoading,
      fetchLineDetailLoading,
      fetchHeadPrintLoading,
      fetchHeadCancelDocLoading,
      tenantId,
      inboundOrderQuery: {
        headList = [],
        pagination = {},
        lineList = [],
        linePagination = {},
        exceptionTypeList = [],
        statusList = [],
        barcodeStatusList = [],
        qualityStatusList = [],
        detailList = [],
        detailListPagination = {},
      },
    } = this.props;
    const { selectedLineRowKeys = [], visible, headRecord, selectedHeadRows } = this.state;
    const filterProps = {
      tenantId,
      exceptionTypeList,
      statusList,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.handleFetchHeadList,
    };

    const rowHeadSelection = {
      selectedRowKeys: selectedHeadRows,
      onChange: this.onHeadChange,
      // type: 'radio', // 单选
      // columnWidth: 0,
      // fixed: true,
      getCheckboxProps: record => ({
        disabled: !record.instructionDocId,
      }),
    };
    const headListProps = {
      tenantId,
      exceptionTypeList,
      loading: fetchHeadListLoading,
      fetchHeadPrintLoading,
      pagination,
      dataSource: headList,
      onSearch: this.handleFetchHeadList,
      onRef: node => {
        this.headchild = node;
      },
      handleFetchLineList: this.handleFetchLineList,
      headPrint: this.headPrint,
      onHeadChange: this.onHeadChange,
      rowHeadSelection,
    };
    const lineTableProps = {
      dataSource: lineList,
      pagination: linePagination,
      loading: fetchLineListLoading,
      selectedLineRowKeys,
      headRecord,
      onSearch: this.handleFetchLineList,
      handleChangeSelectLineRows: this.handleChangeSelectLineRows,
    };
    const detailDrawerProps = {
      visible,
      barcodeStatusList,
      qualityStatusList,
      detailList,
      detailListPagination,
      fetchLineDetailLoading,
      onCancel: this.onCancelDrawer,
      handleFetchDetailList: this.handleFetchDetailList,
    };
    return (
      <React.Fragment>
        <Header title='入库单查询'>
          <Button
            icon="save"
            onClick={() => this.onCancelDrawer(true)}
            // loading={fetchLineDetailLoading}
            disabled={selectedLineRowKeys.length === 0}
          >
            明细
          </Button>
          <Button
            icon="save"
            disabled={selectedHeadRows.length === 0}
            loading={fetchHeadPrintLoading}
            onClick={() => this.headPrint()}
          >
            打印
          </Button>
          <ButtonPermission
            disabled={selectedHeadRows.length === 0}
            loading={fetchHeadCancelDocLoading}
            onClick={() => this.showConfirmCancel(selectedHeadRows.length)}
            type="primary"
            permissionList={[
              {
                code: 'hwms.inbound.order.query.list.button.doc.cancel',
                type: 'button',
                meaning: '入库单查询-单据撤销',
              },
            ]}
          >
            单据撤销
          </ButtonPermission>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <HeadTable {...headListProps} />
          <LineTable {...lineTableProps} />
          <DetailDrawer {...detailDrawerProps} />
        </Content>
      </React.Fragment>
    );
  }
}
