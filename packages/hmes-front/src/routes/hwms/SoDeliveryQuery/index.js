/**
 * 出货单查询
 *@date：2019/10/11
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Button, Card } from 'hzero-ui';
import intl from 'utils/intl';
import { connect } from 'dva';
import { Content, Header } from 'components/Page';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { Bind } from 'lodash-decorators';
import { isEmpty, isUndefined } from 'lodash';
import moment from 'moment';
import { DETAIL_CARD_TABLE_CLASSNAME, DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import notification from 'utils/notification';

import FilterForm from './FilterForm';
import ListTableHead from './ListTableHead';
import ListTableLine from './ListTableLine';
import DetailDrawer from './Detail/DetailDrawer';

@connect(({ soDeliveryQuery, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  soDeliveryQuery,
  loading: {
    fetchHeadLoading: loading.effects['soDeliveryQuery/queryHeadList'],
    fetchLineLoading: loading.effects['soDeliveryQuery/queryLineList'],
  },
}))
@formatterCollections({ code: 'hwms.soDeliveryQuery' })
class SoDeliveryQuery extends Component {
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
      type: 'soDeliveryQuery/init',
      payload: {
        tenantId,
      },
    });
    // 工厂下拉框
    dispatch({
      type: 'soDeliveryQuery/querySiteList',
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
      type: 'soDeliveryQuery/queryHeadList',
      payload: {
        ...filterValues,
        deliveryDateFrom: isUndefined(filterValues.deliveryDateFrom)
          ? null
          : moment(filterValues.deliveryDateFrom).format(DEFAULT_DATETIME_FORMAT),
        deliveryDateTo: isUndefined(filterValues.deliveryDateTo)
          ? null
          : moment(filterValues.deliveryDateTo).format(DEFAULT_DATETIME_FORMAT),
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(res => {
      if (res) {
        if (isEmpty(fields)) {
          // 是否为分页查询
          this.setState(
            {
              selectedLineRowKeys: [],
              selectedLineRows: [],
              selectedRowKeys: [],
              selectedRows: [],
            },
            () => {
              dispatch({
                type: 'soDeliveryQuery/updateState',
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
      type: 'soDeliveryQuery/queryLineList',
      payload: {
        sourceDocId: instructionDocId,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   *  是否显示出货单明细modal
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
    this.setState({ selectedLineRowKeys, selectedLineRows });
  }

  // 放行申请
  @Bind()
  handleApply() {}

  /**
   *  AGV 搬运
   */
  @Bind()
  handleAGVCarry(params) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'soDeliveryQuery/createData',
      payload: {
        tenantId,
        ...params,
      },
    }).then(res => {
      if (res.success) {
        this.handleModalVisible(false);
        notification.success();
        this.handleHeadSearch();
      } else {
        notification.error({ message: res.message });
      }
    });
  }

  /**
   * 打托指令
   */
  @Bind()
  handlePack() {}

  render() {
    const { showDetailModal, selectedRowKeys, selectedLineRowKeys, selectedLineRows } = this.state;
    const {
      soDeliveryQuery: {
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
        <Header title={intl.get('hwms.soDeliveryQuery.view.message.title').d('出货单查询')}>
          <Button type="primary" onClick={this.handleApply} disabled={isEmpty(selectedRowKeys)}>
            {intl.get('hwms.soDeliveryQuery.view.button.releaseApplication').d('放行申请')}
          </Button>
          <Button onClick={this.handleModalVisible} disabled={isEmpty(selectedLineRowKeys)}>
            {intl.get('hwms.soDeliveryQuery.view.button.detail').d('明细')}
          </Button>
          {/* <Button onClick={this.handlePack}>
            {intl.get('hwms.soDeliveryQuery.view.button.packInstruction').d('打托指令')}
          </Button>
          <Button onClick={this.handleAGVCarry}>
            {intl.get('hwms.soDeliveryQuery.view.button.AGVCarry').d('AGV搬运')}
          </Button> */}
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTableHead {...listHeadProps} />
          <Card
            key="code-rule-liner"
            title={intl
              .get('hwms.soDeliveryQuery.view.message.soDeliveryLineQuery')
              .d('出货单行查询')}
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

export default SoDeliveryQuery;
