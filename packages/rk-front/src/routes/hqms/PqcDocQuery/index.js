/*
 * @Description: 巡检单查询
 * @version: 0.1.0
 * @Author: junfeng.chen@hand-china.com
 * @Date: 2021-01-06 09:01:34
 */

import React, { Component } from 'react';
import {Card } from 'hzero-ui';
import intl from 'utils/intl';
import { connect } from 'dva';
import { Content, Header } from 'components/Page';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { Bind } from 'lodash-decorators';
import { isEmpty, isUndefined } from 'lodash';
import moment from 'moment';
import { DETAIL_CARD_TABLE_CLASSNAME, DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import ExcelExport from 'components/ExcelExport';
import FilterForm from './FilterForm';
import ListTableHead from './ListTableHead';
import ListTableLine from './ListTableLine';
import LineDetail from './Details/LineDetail';


@connect(({ pqcDocQuery, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  pqcDocQuery,
  loading: {
    fetchHeadLoading: loading.effects['pqcDocQuery/queryHeadList'],
    fetchLineLoading: loading.effects['pqcDocQuery/queryLineList'],
    fetchLineDetailLoading: loading.effects['pqcDocQuery/queryLineDetailList'],
  },
}))
@formatterCollections({ code: 'hqms.pqcDocQuery' })
class PqcDocQuery extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      lineDetailDrawer: false, // 是否显示明细modal
      detailDatas: {},
      selectedRowKeys: [],
      selectedRows: [], // 选中的头数据
      // selectedLineRowKeys: [],
      // eslint-disable-next-line react/no-unused-state
      // selectedLineRows: [], // 选中的行数据
    };
  }

  componentDidMount() {
    const {
      dispatch,
      tenantId,
      pqcDocQuery: { headPagination = {} },
    } = this.props;
    // 查询独立值集
    dispatch({
      type: 'pqcDocQuery/init',
      payload: {
        tenantId,
      },
    });
    this.handleHeadSearch(headPagination);
    dispatch({
      type: 'pqcDocQuery/updateState',
      payload: {
        headAndLine: {},
      },
    });
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
      type: 'pqcDocQuery/queryHeadList',
      payload: {
        ...filterValues,
        creationDateFrom: isUndefined(filterValues.creationDateFrom)
          ? null
          : moment(filterValues.creationDateFrom).format(DEFAULT_DATETIME_FORMAT),
          creationDateTo: isUndefined(filterValues.creationDateTo)
          ? null
          : moment(filterValues.creationDateTo).format(DEFAULT_DATETIME_FORMAT),
        executionDateStart: isUndefined(filterValues.executionDateStart)
          ? null
          : moment(filterValues.executionDateStart).format(DEFAULT_DATETIME_FORMAT),
        executionDateEnd: isUndefined(filterValues.executionDateEnd)
          ? null
          : moment(filterValues.executionDateEnd).format(DEFAULT_DATETIME_FORMAT),
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(res => {
      if (res) {
        this.setState(
          {
            selectedRowKeys: [],
            selectedRows: [],
          },
          () => {
            dispatch({
              type: 'pqcDocQuery/updateState',
              payload: {
                lineList: [],
                linePagination: {},
              },
            });
          }
        );
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
    const { pqcHeaderId } = selectedRows[0];
    const { dispatch } = this.props;
    dispatch({
      type: 'pqcDocQuery/queryLineList',
      payload: {
        pqcHeaderId,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

   // 行明细查询
  @Bind()
  detailClick(record) {
    this.setState({detailDatas: record, lineDetailDrawer: !this.state.lineDetailDrawer});
    const { dispatch } = this.props;
    dispatch({
      type: 'pqcDocQuery/queryLineDetailList',
      payload: {
        pqcLineId: record.pqcLineId,
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
    this.setState(
      // eslint-disable-next-line react/no-unused-state
      { selectedRowKeys, selectedRows },
      () => {
        this.handleLineSearch();
      }
    );
  }


  // 明细分页变化后触发方法
  @Bind
  handleTableLineDetailChange(page= {}){
    const { dispatch } = this.props;
    // 根据页数查询报表明细信息
    dispatch({
      type: 'pqcDocQuery/queryLineDetailList',
      payload: {
        ...this.state.detailDatas.pqcLineId,
        page,
      },
    });
  }

  // 明细关闭页面
  @Bind
  onLineDetailCancel(){
    this.setState({ lineDetailDrawer: !this.state.lineDetailDrawer});
  }

  @Bind()
  handleGetFormValue() {
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    const { creationDateFrom, creationDateTo, executionDateStart, executionDateEnd } = filterValues;
    return filterNullValueObject({
      ...filterValues,
      creationDateFrom: isUndefined(creationDateFrom)
        ? null
        : moment(creationDateFrom).format(DEFAULT_DATETIME_FORMAT),
      creationDateTo: isUndefined(creationDateTo)
        ? null
        : moment(creationDateTo).format(DEFAULT_DATETIME_FORMAT),
      executionDateStart: isUndefined(executionDateStart)
        ? null
        : moment(executionDateStart).format(DEFAULT_DATETIME_FORMAT),
      executionDateEnd: isUndefined(executionDateEnd)
        ? null
        : moment(executionDateEnd).format(DEFAULT_DATETIME_FORMAT),
    });
  }

  render() {
    const {
      lineDetailDrawer,
      selectedRowKeys,
    } = this.state;
    const {
      pqcDocQuery: {
        headList = [],
        headPagination = {},
        lineList = [],
        linePagination = {},
        lineDetailList = [],
        lineDetailPagination = {},
        docTypeMap = [],
        version = [],
        inspectionResultList = [],
      },
      loading: { fetchHeadLoading, fetchLineLoading, fetchHeadPrintLoading },
      tenantId,
    } = this.props;
    const filterProps = {
      tenantId,
      docTypeMap,
      version,
      inspectionResultList,
      onSearch: this.handleHeadSearch,
      onRef: this.handleBindRef,
    };
    const listHeadProps = {
      selectedRowKeys,
      pagination: headPagination,
      loading: fetchHeadLoading,
      fetchHeadPrintLoading,
      dataSource: headList,
      onSearch: this.handleHeadSearch,
      onSelectRow: this.handleSelectHeadRow,
    };
    const listRowProps = {
      detailClick: this.detailClick,
      pagination: linePagination,
      loading: fetchLineLoading,
      dataSource: lineList,
      onSearch: this.handleLineSearch,
      onSelectRow: this.handleSelectLineRow,
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
        <Header
          title={intl.get('hqms.pqcDocQuery.view.message.title').d('巡检单信息')}
        >
          <ExcelExport
            exportAsync
            requestUrl={`/mes/v1/${tenantId}/qms-pqc-doc-query/list-header-export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue()}
          />
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTableHead
            {...listHeadProps}
            history={this.props.history}
          />
          <Card
            key="code-rule-liner"
            title={intl.get('hqms.pqcDocQuery.view.message.LineQuery').d('巡检单行信息')}
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
          />
          <ListTableLine {...listRowProps} />
          {lineDetailDrawer && <LineDetail {...lineDetailProps} />}
        </Content>
      </React.Fragment>
    );
  }
}

export default PqcDocQuery;
