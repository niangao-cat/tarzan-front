/**
 * @Author:lly
 * @email: liyuan.liu@hand-china.com
 * @description： IQC检验明细报表
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
// import { isEmpty } from 'lodash';
import moment from 'moment';

import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import ExcelExport from '@/components/ExcelExport';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';

import TableList from './TableList';
import FilterForm from './FilterForm';

const commonModelPrompt = 'tarzan.hwms.iqcCheckDetailReport';

@connect(({ iqcCheckDetailReport, loading }) => ({
  iqcCheckDetailReport,
  fetchListLoading: loading.effects['iqcCheckDetailReport/queryDataList'],
}))
export default class IqcCheckDetailReport extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    // 加载下拉框
    await dispatch({
      type: 'iqcCheckDetailReport/batchLovData',
    });
    await dispatch({
      type: 'iqcCheckDetailReport/querySiteList',
      payload: {},
    });
    await dispatch({
      type: 'iqcCheckDetailReport/getSiteList',
      payload: {},
    });
  }

  @Bind()
  handleSearch(page = {}) {
    const { dispatch } = this.props;
    const value = this.handleGetFormValue();
    if(value) {
      dispatch({
        type: 'iqcCheckDetailReport/queryDataList',
        payload: {
          ...value,
          page,
        },
      });
    }
  }


  // 导出
  @Bind()
  handleGetFormValue() {
    let queryParams = false;
    if(this.formDom) {
      this.formDom.validateFields((err, value) => {
        if(!err) {
          const { creationDateFrom, creationDateTo, inspectionFinishDateFrom, inspectionFinishDateTo } = value;
          queryParams = filterNullValueObject({
            ...value,
            creationDateFrom: creationDateFrom
              ? moment(creationDateFrom).format(DEFAULT_DATETIME_FORMAT)
              : null,
            creationDateTo: creationDateTo
              ? moment(creationDateTo).format(DEFAULT_DATETIME_FORMAT)
              : null,
            inspectionFinishDateFrom: inspectionFinishDateFrom
              ? moment(inspectionFinishDateFrom).format(DEFAULT_DATETIME_FORMAT)
              : null,
            inspectionFinishDateTo: inspectionFinishDateTo
              ? moment(inspectionFinishDateTo).format(DEFAULT_DATETIME_FORMAT)
              : null,
          });
        }
      });
    }
    return queryParams;
  }

  render() {
    const {
      fetchListLoading,
      iqcCheckDetailReport: {
        headList = [],
        headPagination = {},
        checkStatusMap = [],
        checkResultMap = [],
        checkTypeMap = [],
        auditResultMap = [],
        siteMap = [],
        getSite = {},
      },
    } = this.props;
    const filterFormProps = {
      checkStatusMap,
      checkResultMap,
      checkTypeMap,
      auditResultMap,
      siteMap,
      getSite,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.handleSearch,
    };
    const listProps = {
      dataSource: headList,
      pagination: headPagination,
      loading: fetchListLoading,
      onSearch: this.handleSearch,
    };
    return (
      <div>
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('IQC检验明细报表')}>
          <ExcelExport
            exportAsync
            requestUrl={`/mes/v1/${getCurrentOrganizationId()}/wms-iqc-inspection-details/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
            fileName="IQC检验明细报表.xlsx"
          />
        </Header>
        <Content>
          <FilterForm {...filterFormProps} />
          <TableList {...listProps} />
          <ModalContainer ref={registerContainer} />
        </Content>
      </div>
    );
  }
}
