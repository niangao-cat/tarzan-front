import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty } from 'lodash';

import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';

import {
  filterNullValueObject,
  getCurrentOrganizationId,
  getDateFormat,
} from 'utils/utils';
import { ReportHost } from '@/utils/config';

import FilterForm from './FilterForm';
import ListTable from './ListTable';

const modelPrompt = 'tarzan.hmes.staffManufacturingAttributeReport';
const dateFormat = getDateFormat();


@connect(({ staffManufacturingAttributeReport, loading }) => ({
  staffManufacturingAttributeReport,
  fetchListLoading: loading.effects['staffManufacturingAttributeReport/fetchList'],
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: 'tarzan.hmes.staffManufacturingAttributeReport',
})

export default class StaffManufacturingAttributeReport extends Component {

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'staffManufacturingAttributeReport/fetchEnum',
      payload: {
        tenantId,
      },
    });
    this.handleFetchList();
  }

  @Bind
  handleExportExcel() {
    let value = this.formDom ? this.formDom.getFieldsValue() : {};
    const { dateFrom, dateTo } = value;
    value = {
      ...value,
      dateFrom: isEmpty(dateFrom) ? null : dateFrom.startOf('day').format(dateFormat),
      dateTo: isEmpty(dateTo) ? null : dateTo.endOf('day').format(dateFormat),
    };
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    return filterValue;
  }

  @Bind
  handleFetchList( page={} ) {
    const { dispatch } = this.props;
    let value = this.formDom ? this.formDom.getFieldsValue() : {};
    const { dateFrom, dateTo } = value;
    value = {
      ...value,
      dateFrom: isEmpty(dateFrom) ? null : dateFrom.startOf('day').format(dateFormat),
      dateTo: isEmpty(dateTo) ? null : dateTo.endOf('day').format(dateFormat),
    };
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    dispatch({
      type: 'staffManufacturingAttributeReport/fetchList',
      payload: {
        page: isEmpty(page) ? {} : page,
        ...filterValue,
      },
    });
  }


  render () {
    //导出路径
    const {
      tenantId,
      fetchListLoading,
      staffManufacturingAttributeReport: {
        list = [],
        pagination = {},
        qualityType = [],
        proficiency = [],
      },
    } = this.props;
    const filterProps = {
      tenantId,
      qualityType,
      proficiency,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.handleFetchList,
    };

    const listProps = {
      loading: fetchListLoading,
      pagination,
      dataSource: list,
      onSearch: this.handleFetchList,
    };

    return (
      <div>
        <Header title={intl.get(`${modelPrompt}.view.title`).d('员工制造属性报表')}>
          <ExcelExport
            exportAsync
            requestUrl={`${ReportHost}/v1/${tenantId}/hme-staff-attribute-report/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleExportExcel()}
          />
        </Header>

        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...listProps}/>
        </Content>
      </div>
    );

  }
}
