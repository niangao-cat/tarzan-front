/**
 * 锡膏/红胶查询
 *@date：2019/10/31
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
import { isEmpty } from 'lodash';
import { DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';

import FilterForm from './FilterForm';
import ListTableHead from './ListTableHead';
import ListTableLine from './ListTableLine';

@connect(({ solderGlueManage, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  solderGlueManage,
  loading: {
    fetchHeadLoading: loading.effects['solderGlueManage/queryHeadList'],
    fetchLineLoading: loading.effects['solderGlueManage/queryLineList'],
  },
}))
@formatterCollections({ code: ['hwms.barcodeQuery', 'hwms.solderGlueManage'] })
class QueryTab extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
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
      type: 'solderGlueManage/queryHeadList',
      payload: {
        ...filterValues,
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(res => {
      if (res) {
        if (isEmpty(fields)) {
          // 模糊查询
          dispatch({
            type: 'solderGlueManage/updateState',
            payload: {
              lineList: [],
            },
          });
          this.setState({ selectedRowKeys: [], selectedRows: [] });
        }
      }
    });
  }

  /**
   *  查询行列表
   */
  @Bind()
  handleLineSearch() {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    const { materialLotId } = selectedRows[0];
    dispatch({
      type: 'solderGlueManage/queryLineList',
      payload: {
        materialLotId,
      },
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
    this.setState({ selectedRowKeys, selectedRows }, () => {
      this.handleLineSearch();
    });
  }

  render() {
    const { selectedRowKeys } = this.state;
    const {
      solderGlueManage: {
        headList = [],
        headPagination = {},
        lineList = [],
        objectMap = [],
        statusMap = [],
      },
      loading: { fetchHeadLoading, fetchLineLoading },
      tenantId,
    } = this.props;
    const filterProps = {
      tenantId,
      objectMap,
      statusMap,
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
      loading: fetchLineLoading,
      dataSource: lineList,
    };
    return (
      <React.Fragment>
        <FilterForm {...filterProps} />
        <ListTableHead {...listHeadProps} />
        <Card
          key="code-rule-liner"
          title={intl.get('hwms.solderGlueManage.view.message.LineQuery').d('锡膏/红胶使用明细')}
          bordered={false}
          className={DETAIL_CARD_TABLE_CLASSNAME}
        />
        <ListTableLine {...listRowProps} />
      </React.Fragment>
    );
  }
}

export default QueryTab;
