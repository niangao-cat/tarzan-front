/**
 * 采购退货单查询
 *@date：2019/10/15
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Card } from 'hzero-ui';
import intl from 'utils/intl';
import { connect } from 'dva';
import { Content, Header } from 'components/Page';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { Bind } from 'lodash-decorators';
import { isEmpty, isUndefined } from 'lodash';
import moment from 'moment';
import { DETAIL_CARD_TABLE_CLASSNAME, DEFAULT_DATETIME_FORMAT } from 'utils/constants';

import FilterForm from './FilterForm';
import ListTableHead from './ListTableHead';
import ListTableLine from './ListTableLine';
import DetailDrawer from './Detail/DetailDrawer';

@connect(({ purchaseReturn, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  purchaseReturn,
  loading: {
    fetchHeadLoading: loading.effects['purchaseReturn/queryHeadList'],
    fetchLineLoading: loading.effects['purchaseReturn/queryLineList'],
  },
}))
@formatterCollections({ code: ['hwms.purchaseReturn', 'hwms.requisitionAndReturn'] })
class PurchaseReturn extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      showDetailModal: false, // 是否显示明细modal
      selectedRowKeys: [],
      selectedRows: [], // 选中的头数据
      selectedLineRowKeys: [],
      selectedLineRows: [], // 选中的行数据
    };
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    // 查询独立值集
    dispatch({
      type: 'purchaseReturn/init',
      payload: {
        tenantId,
      },
    });
    // 工厂下拉框
    dispatch({
      type: 'purchaseReturn/querySiteList',
    });
    this.handleHeadSearch();
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
      type: 'purchaseReturn/queryHeadList',
      payload: {
        ...filterValues,
        creationDateStart: isUndefined(filterValues.creationDateStart)
          ? null
          : moment(filterValues.creationDateStart).format(DEFAULT_DATETIME_FORMAT),
        creationDateEnd: isUndefined(filterValues.creationDateEnd)
          ? null
          : moment(filterValues.creationDateEnd).format(DEFAULT_DATETIME_FORMAT),
        demandTimeStart: isUndefined(filterValues.demandTimeStart)
          ? null
          : moment(filterValues.demandTimeStart).format(DEFAULT_DATETIME_FORMAT),
        demandTimeEnd: isUndefined(filterValues.demandTimeEnd)
          ? null
          : moment(filterValues.demandTimeEnd).format(DEFAULT_DATETIME_FORMAT),
        lastUpdateDateStart: isUndefined(filterValues.lastUpdateDateStart)
          ? null
          : moment(filterValues.lastUpdateDateStart).format(DEFAULT_DATETIME_FORMAT),
        lastUpdateDateEnd: isUndefined(filterValues.lastUpdateDateEnd)
          ? null
          : moment(filterValues.lastUpdateDateEnd).format(DEFAULT_DATETIME_FORMAT),
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(res => {
      if (res) {
        if (isEmpty(fields)) {
          // 是否为分页查询: 否—清空行表
          this.setState(
            {
              selectedLineRowKeys: [],
              selectedLineRows: [],
              selectedRowKeys: [],
              selectedRows: [],
            },
            () => {
              dispatch({
                type: 'purchaseReturn/updateState',
                payload: {
                  lineList: [],
                  linePagination: {},
                },
              });
            }
          );
        }
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
      type: 'purchaseReturn/queryLineList',
      payload: {
        instructionDocId,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   *  是否显示采购退货单明细modal
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
  handleSelectLineRow(selectedLineRowKeys, selectedLineRows) {
    this.setState({ selectedLineRowKeys, selectedLineRows }, () => {
      this.handleModalVisible();
    });
  }

  render() {
    const { showDetailModal, selectedRowKeys, selectedLineRowKeys, selectedLineRows } = this.state;
    const {
      purchaseReturn: {
        headList = [],
        headPagination = {},
        lineList = [],
        linePagination = {},
        statusMap = [],
        siteMap = [],
      },
      loading: { fetchHeadLoading, fetchLineLoading },
      tenantId,
    } = this.props;
    const detailProps = {
      tenantId,
      showDetailModal,
      selectedLineRows,
      onCancel: this.handleModalVisible,
    };
    const filterProps = {
      tenantId,
      statusMap,
      siteMap,
      onSearch: this.handleHeadSearch,
      onRef: this.handleBindRef,
    };
    const listHeadProps = {
      selectedRowKeys,
      pagination: headPagination,
      loading: fetchHeadLoading,
      dataSource: headList,
      onSearch: this.handleHeadSearch,
      onSelectRow: this.handleSelectHeadRow,
    };
    const listRowProps = {
      selectedRowKeys: selectedLineRowKeys,
      pagination: linePagination,
      loading: fetchLineLoading,
      dataSource: lineList,
      onSearch: this.handleLineSearch,
      onSelectRow: this.handleSelectLineRow,
    };
    return (
      <React.Fragment>
        <Header title={intl.get('hwms.purchaseReturn.view.message.title').d('采购退货单查询')} />
        <Content>
          <FilterForm {...filterProps} />
          <ListTableHead {...listHeadProps} />
          <Card
            key="code-rule-liner"
            title={intl.get('hwms.purchaseReturn.view.message.line').d('单据行信息')}
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
          />
          <ListTableLine {...listRowProps} />
          {showDetailModal && <DetailDrawer {...detailProps} />}
        </Content>
      </React.Fragment>
    );
  }
}

export default PurchaseReturn;
