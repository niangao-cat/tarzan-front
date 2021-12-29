/**
 * 备料单查询
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
import DetailDrawer from './Detail/DetailDrawer';

@connect(({ woPlatform, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  woPlatform,
  loading: {
    fetchHeadLoading: loading.effects['woPlatform/queryDocHeadList'],
    fetchLineLoading: loading.effects['woPlatform/queryDocLineList'],
  },
}))
@formatterCollections({
  code: ['hwms.requisitionAndReturn', 'hwms.woPlatform', 'hwms.barcodeQuery'],
})
class MaterialTab extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      selectedLine: {}, // 当前选中的行
      selectedRowKeys: [],
      selectedRows: [],
      showVisible: false, // 是否显示行明细modal
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
      type: 'woPlatform/queryDocHeadList',
      payload: {
        ...filterValues,
        planedStartTimeFrom: isUndefined(filterValues.planedStartTimeFrom)
          ? null
          : moment(filterValues.planedStartTimeFrom).format(DEFAULT_DATETIME_FORMAT),
        planedStartTimeTo: isUndefined(filterValues.planedStartTimeTo)
          ? null
          : moment(filterValues.planedStartTimeTo).format(DEFAULT_DATETIME_FORMAT),
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(res => {
      if (res) {
        if (isEmpty(fields)) {
          // 模糊查询
          this.setState({ selectedRowKeys: [], selectedRows: [] });
          dispatch({
            type: 'woPlatform/updateState',
            payload: {
              docLineList: [],
              docLinePagination: {},
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
    const { selectedRows } = this.state;
    const { instructionDocId } = selectedRows[0];
    dispatch({
      type: 'woPlatform/queryDocLineList',
      payload: {
        instructionDocId,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   *  点击行触发行明细查询
   * @param record
   */
  @Bind()
  handleClickLine(record) {
    this.setState({ selectedLine: record }, () => {
      this.handleModalVisible();
    });
  }

  /**
   *  抽屉
   *  是否显示行明细modal
   */
  @Bind()
  handleModalVisible() {
    const { showVisible } = this.state;
    this.setState({ showVisible: !showVisible });
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
    this.setState({ selectedRowKeys, selectedRows }, () => {
      this.handleLineSearch();
    });
  }

  render() {
    const { selectedRowKeys, showVisible, selectedLine } = this.state;
    const {
      woPlatform: {
        docList = [],
        docPagination = {},
        docLineList = [],
        docLinePagination = {},
        docStatusMap = [],
        siteMap = [],
      },
      loading: { fetchHeadLoading, fetchLineLoading },
      tenantId,
    } = this.props;
    const filterProps = {
      tenantId,
      docStatusMap,
      siteMap,
      onSearch: this.handleHeadSearch,
      onRef: this.handleBindRef,
    };
    const listHeadProps = {
      selectedRowKeys,
      pagination: docPagination,
      loading: fetchHeadLoading,
      dataSource: docList,
      onSearch: this.handleHeadSearch,
      onSelectRow: this.handleSelectHeadRow,
    };
    const listRowProps = {
      pagination: docLinePagination,
      loading: fetchLineLoading,
      dataSource: docLineList,
      onSearch: this.handleLineSearch,
      onSearchLine: this.handleClickLine,
    };
    const detailProps = {
      tenantId,
      showVisible,
      selectedLine,
      onCancel: this.handleModalVisible,
    };
    return (
      <React.Fragment>
        <FilterForm {...filterProps} />
        <ListTableHead {...listHeadProps} />
        <Card
          key="code-rule-liner"
          title={intl.get('hwms.woPlatform.view.message.woLine').d('备料单需求')}
          bordered={false}
          className={DETAIL_CARD_TABLE_CLASSNAME}
        />
        <ListTableLine {...listRowProps} />
        {showVisible && <DetailDrawer {...detailProps} />}
      </React.Fragment>
    );
  }
}

export default MaterialTab;
