/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 员工产量汇总报表
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import moment from 'moment';

import {
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ExcelExport from '@/components/ExcelExport';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import notification from 'utils/notification';
import { ReportHost } from '@/utils/config';

import MakeNumDrawer from './Details/MakeNumDrawer';
import DefectsNumbDrawer from './Details/DefectsNumbDrawer';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

const commonModelPrompt = 'tarzan.hwms.employeeOutputSummaryReport';

@connect(({ employeeOutputSummaryReport, loading }) => ({
  employeeOutputSummaryReport,
  fetchListLoading: loading.effects['employeeOutputSummaryReport/queryDataList'],
  detailLoading: loading.effects['employeeOutputSummaryReport/fetchmakeNumList'] || loading.effects['employeeOutputSummaryReport/fetchdefectsNumbList'],
  tenantId: getCurrentOrganizationId(),
}))
export default class ProcessDefectReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchDetail: {},
      prodLineName: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'employeeOutputSummaryReport/fetchDefaultSite',
    });
  }

  @Bind()
  handleSearch(page = {}) {
    const { dispatch } = this.props;
    const value = this.handleGetFormValue();
    if (value) {
      dispatch({
        type: 'employeeOutputSummaryReport/queryDataList',
        payload: {
          ...value,
          page,
        },
      });
    }
  }

  // 明细数据
  @Bind()
  handleMakeNumDetail(record, type) {
    const { defectsNumbDrawer, makeNumDrawer } = this.state;
    this.setState({
      searchDetail: {
        userId: record.userId,
        processId: record.processId,
        materialId: record.materialId,
        materialVersion: record.materialVersion,
        dateFrom: record.dateFrom,
        dateTo: record.dateTo,
        type,
      },
    });
    if (type === 'NCNUM') {
      this.setState({ defectsNumbDrawer: !defectsNumbDrawer });
    } else {
      this.setState({ makeNumDrawer: !makeNumDrawer });
    }
    const { dispatch } = this.props;
    // 查询产量或在制
    dispatch({
      type: 'employeeOutputSummaryReport/fetchmakeNumList',
      payload: {
        userId: record.userId,
        processId: record.processId,
        materialId: record.materialId,
        materialVersion: record.materialVersion,
        dateFrom: record.dateFrom,
        dateTo: record.dateTo,
        type,
      },
    });
  }

  @Bind
  handleMakeNumSearch(page = {}, fields = {}) {
    const { dispatch } = this.props;
    const filterValue = filterNullValueObject(fields);
    // 根据页数查询报表明细信息
    dispatch({
      type: 'employeeOutputSummaryReport/fetchmakeNumList',
      payload: {
        ...this.state.searchDetail,
        ...filterValue,
        page,
      },
    });
  }

  @Bind
  handleDefectsNumbSearch(page = {}, fields = {}) {
    const { dispatch } = this.props;
    const filterValue = filterNullValueObject(fields);
    // 根据页数查询报表明细信息
    dispatch({
      type: 'employeeOutputSummaryReport/fetchdefectsNumbList',
      payload: {
        ...this.state.searchDetail,
        ...filterValue,
        page,
      },
    });
  }

  @Bind
  handleMakeNumCancel() {
    this.setState({ makeNumDrawer: !this.state.makeNumDrawer });
  }

  @Bind
  handleDefectsNumbCancel() {
    this.setState({ defectsNumbDrawer: !this.state.defectsNumbDrawer });
  }

  @Bind()
  handleSetProdLine(prodLineId, prodLineName) {
    this.setState({ prodLineId, prodLineName });
  }

  @Bind()
  handleGetFormValue() {
    let queryParams = false;
    if (this.formDom) {
      this.formDom.validateFields((err, value) => {
        if (!err) {
          const { dateFrom, dateTo, prodLineId, lineWorkcellId, processId, userId } = value;
          if (!prodLineId && !lineWorkcellId && !processId && !userId) {
            return notification.warning({ description: '查询条件:产线/工段/工序,员工,物料必输其一! ' });
          }
          queryParams = filterNullValueObject({
            ...value,
            dateFrom: dateFrom
              ? moment(dateFrom).format(DEFAULT_DATETIME_FORMAT)
              : null,
            dateTo: dateTo ? moment(dateTo).format(DEFAULT_DATETIME_FORMAT) : null,
          });
        }
      });
    }
    return queryParams;
  }

  // 渲染 界面布局
  render() {
    // 获取默认数据
    const {
      fetchListLoading,
      detailLoading,
      tenantId,
      employeeOutputSummaryReport: {
        headList = [],
        headPagination = {},
        siteId = '',
        makeNumList = [],
        makeNumPagination = {},
      },
    } = this.props;

    const { makeNumDrawer, defectsNumbDrawer, prodLineId, prodLineName } = this.state;

    const filterFormProps = {
      siteId,
      prodLineId,
      prodLineName,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.handleSearch,
      onSetProdLine: this.handleSetProdLine,
    };

    const listTableProps = {
      loading: fetchListLoading,
      dataSource: headList,
      pagination: headPagination,
      onSearch: this.handleSearch,
      onMakeNumDetail: this.handleMakeNumDetail,
    };

    // 产量
    const makeNumTableProps = {
      detailLoading,
      makeNumDrawer,
      dataSource: makeNumList,
      pagination: makeNumPagination,
      onMakeNumSearch: this.handleMakeNumSearch,
      onMakeNumCancel: this.handleMakeNumCancel,
    };

    // 不良数
    const defectsNumbTableProps = {
      detailLoading,
      defectsNumbDrawer,
      dataSource: makeNumList,
      pagination: makeNumPagination,
      onDefectsNumbSearch: this.handleMakeNumSearch,
      onDefectsNumbCancel: this.handleDefectsNumbCancel,
    };

    //  返回默认界面数据
    return (
      <div>
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('员工产量汇总报表')}>
          <ExcelExport
            exportAsync
            requestUrl={`${ReportHost}/v1/${tenantId}/hme-employee-export/sum/export`} // 路径
            exportAsyncUrl={`${ReportHost}/v1/${tenantId}/hme-employee-export/async-export`}
            createTaskUrl={`${ReportHost}/v1/${tenantId}/hme-employee-export/create-task`}
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
            fileName="员工产量汇总报表.xlsx"
          />
        </Header>
        <Content>
          <FilterForm {...filterFormProps} />
          <ListTable {...listTableProps} />
        </Content>
        {defectsNumbDrawer && <DefectsNumbDrawer {...defectsNumbTableProps} />}
        {makeNumDrawer && <MakeNumDrawer {...makeNumTableProps} />}
        <ModalContainer ref={registerContainer} />
      </div>
    );
  }
}
