/*
 * @Description: IQC检验审核
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-19 10:00:20
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-06-13 15:08:22
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import ExcelExport from 'components/ExcelExport';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { isEmpty } from 'lodash';
import FilterForm from './FilterForm';
import ListTable from './ListTable';


@connect(({ iqcInspectionAudit, loading }) => ({
  iqcInspectionAudit,
  tenantId: getCurrentOrganizationId(),
  fetchAuditistLoading: loading.effects['iqcInspectionAudit/fetchAuditist'],
}))
export default class MaterialInspectionPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  filterForm;

  /**
   * 获取查询表单组件this对象
   * @param {object} ref - 查询表单组件this
   */
  @Bind
  handleBindRef(ref) {
    this.filterForm = (ref.props || {}).form;
  }

  componentDidMount() {
    const { dispatch, tenantId, iqcInspectionAudit: { search = {}}} = this.props;
    // 批量查询独立值集
    dispatch({
      type: 'iqcInspectionAudit/batchLovData',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'iqcInspectionAudit/updateState',
      payload: {
        iqcLine: [],
        iqcLinePagination: {},
      },
    });

    // 判断是否已经执行过查询， 是则默认当前查询条件， 否则重新渲染
    if(search.searchFlag === ""||search.searchFlag === null||search.searchFlag === undefined){
      this.fetchAuditist();
    }else{
      dispatch({
        type: 'iqcInspectionAudit/fetchAuditist',
        payload: {
          ...search,
        },
      });
    };
  }

  // 获取iqc检验审核数据
  @Bind()
  fetchAuditist(fields = {}) {
    const { dispatch, tenantId } = this.props;
    const filterValue = this.filterForm === undefined ? {} : this.filterForm.getFieldsValue();
    dispatch({
      type: 'iqcInspectionAudit/fetchAuditist',
      payload: {
        tenantId,
        inspectionResult: 'NG',
        inspectionStatus: 'TBD',
        ...filterValue,
        createdDateFrom: (filterValue.createdDateFrom&&filterValue.createdDateFrom.format('YYYY-MM-DD HH:mm:ss'))?filterValue.createdDateFrom.format('YYYY-MM-DD HH:mm:ss'):null,
        createdDateTo: (filterValue.createdDateTo&&filterValue.createdDateTo.format('YYYY-MM-DD HH:mm:ss'))?filterValue.createdDateTo.format('YYYY-MM-DD HH:mm:ss'):null,
        page: isEmpty(fields) ? {} : fields,
      },
    });

    // 暂存更新数据
    dispatch({
      type: 'iqcInspectionAudit/updateState',
      payload: {
        search: {
          tenantId,
          inspectionResult: 'NG',
          inspectionStatus: 'TBD',
          ...filterValue,
          createdDateFrom: (filterValue.createdDateFrom&&filterValue.createdDateFrom.format('YYYY-MM-DD HH:mm:ss'))?filterValue.createdDateFrom.format('YYYY-MM-DD HH:mm:ss'):null,
          createdDateTo: (filterValue.createdDateTo&&filterValue.createdDateTo.format('YYYY-MM-DD HH:mm:ss'))?filterValue.createdDateTo.format('YYYY-MM-DD HH:mm:ss'):null,
          searchFlag: 'Y', // 查询缓存标识
          page: isEmpty(fields) ? {} : fields,
        },
      },
    });
  }

  // 查询
  @Bind()
  handleSearch() {
    this.fetchAuditist({ page: {} });
  }

  // 跳转明细页面
  @Bind()
  getAuditDetail(record) {
    const { history } = this.props;
    history.push(
      `/hqms/iqc-inspection-audit/auditDetail/${record.iqcHeaderId}/${record.objectVersionNumber}`
    );
  }

  // 重置查询
  @Bind()
  resetField(){
    const { dispatch } = this.props;
    dispatch({
      type: 'iqcInspectionAudit/updateState',
      payload: {
        search: {},
      },
    });
  }

  @Bind()
  handleGetFormValue() {
    const { tenantId } = this.props;
    const filterValue = this.filterForm === undefined ? {} : this.filterForm.getFieldsValue();
    const searchData = {
      tenantId,
      inspectionResult: 'NG',
      inspectionStatus: 'TBD',
      ...filterValue,
      createdDateFrom: (filterValue.createdDateFrom&&filterValue.createdDateFrom.format('YYYY-MM-DD HH:mm:ss'))?filterValue.createdDateFrom.format('YYYY-MM-DD HH:mm:ss'):null,
      createdDateTo: (filterValue.createdDateTo&&filterValue.createdDateTo.format('YYYY-MM-DD HH:mm:ss'))?filterValue.createdDateTo.format('YYYY-MM-DD HH:mm:ss'):null,
    };
    return filterNullValueObject(searchData);
  }

  render() {
    const {
      iqcInspectionAudit: {
        iqcDocStatus = [],
        iqcinspetionResult=[],
        docIdentification = [],
        finalDecision=[],
        iqcauditist = [],
        auditistListPagination = {},
        search= {},
      },
      fetchAuditistLoading,
    } = this.props;

    // 查询
    const filterFormProps = {
      initialData: search,
      onSearch: this.handleSearch,
      resetField: this.resetField,
      iqcDocStatus,
      docIdentification,
      iqcinspetionResult,
      finalDecision,
    };
    return (
      <Fragment>
        <Header title="IQC检验审核">
          <ExcelExport
            exportAsync
            requestUrl={`/mes/v1/${getCurrentOrganizationId()}/iqc-audit/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
          />
        </Header>
        <Content>
          <FilterForm {...filterFormProps} onRef={this.handleBindRef} />
          <ListTable
            onSearch={this.fetchAuditist}
            getAuditDetail={this.getAuditDetail}
            iqcauditist={iqcauditist}
            pagination={auditistListPagination}
            loading={fetchAuditistLoading}
          />
        </Content>
      </Fragment>
    );
  }
}
