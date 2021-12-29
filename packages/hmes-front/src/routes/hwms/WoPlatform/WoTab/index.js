/**
 * 生产订单查询
 *@date：2019/10/29
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Card } from 'hzero-ui';
import intl from 'utils/intl';
import { connect } from 'dva';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { Bind } from 'lodash-decorators';
import { isEmpty, isUndefined } from 'lodash';
import moment from 'moment';
import { DETAIL_CARD_TABLE_CLASSNAME, DEFAULT_DATETIME_FORMAT } from 'utils/constants';

import FilterForm from './FilterForm';
import ListTableHead from './ListTableHead';
import ListTableLine from './ListTableLine';

@connect(({ woPlatform, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  woPlatform,
  loading: {
    fetchHeadLoading: loading.effects['woPlatform/queryHeadList'],
    fetchLineLoading: loading.effects['woPlatform/queryLineList'],
  },
}))
@formatterCollections({
  code: ['hwms.requisitionAndReturn', 'hwms.woPlatform', 'hwms.barcodeQuery'],
})
class WoTab extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      parentItem: {}, // 保存当前选中的头
    };
  }

  componentDidMount() {
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
      type: 'woPlatform/queryHeadList',
      payload: {
        ...filterValues,
        planedStartTime: isUndefined(filterValues.planedStartTime)
          ? null
          : moment(filterValues.planedStartTime).format(DEFAULT_DATETIME_FORMAT),
        planedStartTimeTo: isUndefined(filterValues.planedStartTimeTo)
          ? null
          : moment(filterValues.planedStartTimeTo).format(DEFAULT_DATETIME_FORMAT),
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(res => {
      if (res) {
        dispatch({
          type: 'woPlatform/updateState',
          payload: {
            filterValues,
          },
        });
        if (isEmpty(fields)) {
          // 模糊查询
          dispatch({
            type: 'woPlatform/updateState',
            payload: {
              selectedRowKeys: [],
              selectedRows: [],
              lineList: [],
              linePagination: {},
            },
          });
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
    const { dispatch } = this.props;
    const { parentItem } = this.state;
    const { bomId } = parentItem;
    dispatch({
      type: 'woPlatform/queryLineList',
      payload: {
        bomId,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   *  点击头触发行查询
   * @param record
   */
  @Bind()
  handleClickHead(record) {
    const {
      dispatch,
      woPlatform: { selectedRowKeys, selectedRows },
    } = this.props;
    dispatch({
      type: 'woPlatform/updateState',
      payload: {
        selectedRowKeys: [...selectedRowKeys, record.id],
        selectedRows: [...selectedRows, record],
      },
    });
    this.setState({ parentItem: record }, () => {
      this.handleLineSearch();
    });
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
    const { dispatch } = this.props;
    dispatch({
      type: 'woPlatform/updateState',
      payload: {
        selectedRowKeys,
        selectedRows,
      },
    });
  }

  render() {
    const {
      woPlatform: {
        headList = [],
        headPagination = {},
        lineList = [],
        linePagination = {},
        woStatusMap = [],
        demandStatusMap = [],
        siteMap = [],
        selectedRowKeys,
      },
      loading: { fetchHeadLoading, fetchLineLoading },
      tenantId,
      dispatch,
    } = this.props;
    const filterProps = {
      tenantId,
      woStatusMap,
      demandStatusMap,
      siteMap,
      dispatch,
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
      onSearchLine: this.handleClickHead,
    };
    const listRowProps = {
      pagination: linePagination,
      loading: fetchLineLoading,
      dataSource: lineList,
      onSearch: this.handleLineSearch,
      onSelectRow: this.handleSelectLineRow,
    };
    return (
      <React.Fragment>
        <FilterForm {...filterProps} />
        <ListTableHead {...listHeadProps} />
        <Card
          key="code-rule-liner"
          title={intl.get('hwms.woPlatform.view.message.LineQuery').d('生产订单需求')}
          bordered={false}
          className={DETAIL_CARD_TABLE_CLASSNAME}
        />
        <ListTableLine {...listRowProps} />
      </React.Fragment>
    );
  }
}

export default WoTab;
