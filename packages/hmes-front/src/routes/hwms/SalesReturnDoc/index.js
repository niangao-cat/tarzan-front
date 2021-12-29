/**
 *销售退货单
 *@date：2019/11/7
 *@author：junhui.liu <junhui.liu@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Button, Card } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { Content, Header } from 'components/Page';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import intl from 'utils/intl';
import { DETAIL_CARD_TABLE_CLASSNAME, DEFAULT_DATE_FORMAT } from 'utils/constants';
import FilterForm from './FilterForm';
import ListTableHead from './ListTableHead';
import ListTableRow from './ListTableRow';
import CreateBarcodeDrawer from './Detail/DetailDrawer';

/**
 * 将models中的state绑定到组件的props中,connect 方法传入的第一个参数是 mapStateToProps 函数，
 * mapStateToProps 函数会返回一个对象，用于建立 State 到 Props 的映射关系
 */
@connect(({ salesReturnDocQuery, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  salesReturnDocQuery,
  fetchLoading: loading.effects['salesReturnDocQuery/deliverHeadList'],
  fetchLineLoading: loading.effects['salesReturnDocQuery/deliverRowList'],
}))
// fetchLoading和saveLoadding实现加载效果,自定义写法
class SalesReturnDoc extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      selectedHeadKeys: [],
      selectedRowKeys: [],
      selectedHead: [],
      selectedRow: [],
      showCreateDrawer: false,
    };
  }

  componentDidMount() {
    // 组件挂载初始化调用，就是页面刚进入时候需要调用的方法
    const { tenantId, dispatch } = this.props;
    // 批量查询独立值集
    dispatch({
      type: 'salesReturnDocQuery/batchLovData',
      payload: {
        tenantId,
      },
    });
    // 工厂下拉框
    dispatch({
      type: 'salesReturnDocQuery/querySiteList',
    });
    this.handleSearch();
  }

  /**
   * 销售退货单查询
   * @param selectedHeadKeys
   * @param selectedHead
   */
  @Bind()
  handleSelectHead(selectedHeadKeys, selectedHead) {
    // 选中某行，然后调用handleSearchLine方法
    this.setState({ selectedHeadKeys, selectedHead }, () => {
      this.handleSearchLine();
    });
  }

  /**
   * 行查询
   * @param fields
   */
  @Bind()
  handleSearchLine(fields = {}) {
    const { dispatch } = this.props;
    const { selectedHead } = this.state;
    dispatch({
      type: 'salesReturnDocQuery/salesReturnDocRowList', // [model的命名空间]/[effects中对应的函数名称] 调用model
      payload: {
        page: isEmpty(fields) ? {} : fields,
        instructionDocId: selectedHead[0].instructionDocId,
      },
    });
  }

  @Bind()
  handleSearch(fields = {}) {
    const { dispatch } = this.props;
    // const dispatch= this.props.dispatch;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    // action对象：type 属性指明具体的行为，其它字段可以自定义
    dispatch({
      type: 'salesReturnDocQuery/salesReturnDocHeadList', // [model的命名空间]/[effects中对应的函数名称] 调用model
      payload: {
        ...filterValues,
        salesReturnDateFrom: isEmpty(filterValues.salesReturnDateFrom)
          ? undefined
          : moment(filterValues.salesReturnDateFrom).format(DEFAULT_DATE_FORMAT),
        salesReturnDateTo: isEmpty(filterValues.salesReturnDateTo)
          ? undefined
          : moment(filterValues.salesReturnDateTo).format(DEFAULT_DATE_FORMAT),
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(res => {
      if (res) {
        if (isEmpty(fields)) {
          this.setState(
            { selectedHeadKeys: [], selectedHead: [], selectedRowKeys: [], selectedRow: [] },
            () => {
              dispatch({
                type: 'salesReturnDocQuery/updateState',
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
   * 销售退货单行查询
   * @param selectedRowKeys
   * @param selectedRow
   */
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRow) {
    this.setState({ selectedRowKeys, selectedRow }); // 选中
  }

  /**
   *  是否显示明细modal
   */
  @Bind()
  handleModalVisible(flag) {
    if (flag) {
      this.setState({ showCreateDrawer: flag });
    } else {
      this.setState({
        showCreateDrawer: flag,
        selectedHeadKeys: [],
        selectedHead: [],
        selectedRowKeys: [],
        selectedRow: [],
      });
    }
  }

  /**
   * 明细方法
   */
  @Bind()
  detailFunction() {
    this.handleModalVisible(true);
    // let abb = 1;
  }

  /**
   * 传递表单对象
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  render() {
    const {
      selectedHead,
      selectedRow,
      selectedHeadKeys,
      selectedRowKeys,
      showCreateDrawer,
    } = this.state;
    // const { showCreateDrawer } = this.state;
    const {
      salesReturnDocQuery: {
        rowPagination = {},
        rowList = [],
        headPagination = {},
        detail = {},
        headList = [],
        siteMap = [],
        instructionDocMap = [],
        barCodestatusMap = [],
      },
      tenantId,
      fetchLineLoading,
      fetchLoading,
    } = this.props;
    const filterProps = {
      tenantId,
      siteMap,
      instructionDocMap,
      barCodestatusMap,
      onSearch: this.handleSearch, // 手动触发
      onRef: this.handleBindRef, // 默认触发
    };
    const listHeadProps = {
      pagination: headPagination,
      selectedHeadKeys,
      loading: fetchLoading, // fetchLoading
      dataSource: headList,
      onSelectHead: this.handleSelectHead,
      onSearch: this.handleSearch,
    };
    const listRowProps = {
      pagination: rowPagination,
      selectedRowKeys,
      loading: fetchLineLoading,
      dataSource: rowList,
      onSelectRow: this.handleSelectRow,
      onSearch: this.handleSearchLine,
    };
    const detailProps = {
      tenantId,
      detail,
      selectedHead, // 传值，传到子组件
      selectedRow,
      showCreateDrawer,
      saveLoading: false,
      onCancel: this.handleModalVisible,
      onOk: this.saveData,
    };
    return (
      <React.Fragment>
        <Header
          title={intl
            .get('hwms.salesReturnDocQuery.view.message.salesReturnDocTitle')
            .d('销售退货单')}
        >
          <Button disabled={isEmpty(selectedRow)} onClick={this.detailFunction}>
            {intl.get('hzero.common.view.button.detail').d('明细')}
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTableHead {...listHeadProps} />
          <Card
            key="code-rule-header"
            title={intl
              .get('hwms.salesReturnDocQuery.view.message.deliverLine')
              .d('销售退货单行查询')}
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
          >
            <ListTableRow {...listRowProps} />
            {showCreateDrawer && <CreateBarcodeDrawer {...detailProps} />}
          </Card>
        </Content>
      </React.Fragment>
    );
  }
}

export default SalesReturnDoc;
