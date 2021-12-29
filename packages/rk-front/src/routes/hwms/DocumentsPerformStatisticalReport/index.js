/**
 * @Author:lly
 * @email: liyuan.liu@hand-china.com
 * @description： 单据执行统计报表
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import moment from 'moment';

import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import ExcelExport from '@/components/ExcelExport';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';

import TableList from './TableList';
import FilterForm from './FilterForm';

const commonModelPrompt = 'tarzan.hwms.documentsPerformStatisticalReport';

@connect(({ documentsPerformStatisticalReport, loading }) => ({
  documentsPerformStatisticalReport,
  fetchListLoading: loading.effects['documentsPerformStatisticalReport/queryDataList'],
}))
export default class DocumentsPerformStatisticalReport extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    // 加载下拉框
    await dispatch({
      type: 'documentsPerformStatisticalReport/batchLovData',
    });
    await dispatch({
      type: 'documentsPerformStatisticalReport/querySiteList',
      payload: {},
    });
    await dispatch({
      type: 'documentsPerformStatisticalReport/getSiteList',
      payload: {},
    });
  }

  @Bind()
  handleSearch(page = {}) {
    const { dispatch } = this.props;
    const value = this.handleGetFormValue();
    if(value) {
      dispatch({
        type: 'documentsPerformStatisticalReport/queryDataList',
        payload: {
          ...value,
          page,
        },
      });
    }
  }


  // 导出==
  @Bind()
  handleGetFormValue() {
    const {
      documentsPerformStatisticalReport: {
        docTypeMap = [],
      },
    } = this.props;
    let queryParams = false;
    if(this.formDom) {
      this.formDom.validateFields((err, value) => {
        if(!err) {
          const { creationDateFrom, creationDateTo, instructionDocType } = value;
          queryParams = filterNullValueObject({
            ...value,
            instructionDocType: instructionDocType || docTypeMap.map((e) => e.value).toString(),
            creationDateFrom: creationDateFrom
              ? moment(creationDateFrom).format(DEFAULT_DATETIME_FORMAT)
              : null,
            creationDateTo: creationDateTo
              ? moment(creationDateTo).format(DEFAULT_DATETIME_FORMAT)
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
      documentsPerformStatisticalReport: {
        headList = [],
        headPagination = {},
        docTypeMap = [],
        siteMap = [],
        getSite = {},
      },
    } = this.props;
    const filterFormProps = {
      docTypeMap,
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
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('单据执行统计报表')}>
          <ExcelExport
            exportAsync
            requestUrl={`/mes/v1/${getCurrentOrganizationId()}/wms-instruction-execute/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
            fileName="单据执行统计报表.xlsx"
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
