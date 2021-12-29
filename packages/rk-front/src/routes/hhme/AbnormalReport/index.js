/**
 * AbnormalReport - 异常信息查看报表
 * @date: 2020/07/14 15:20:23
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */


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
  getDateTimeFormat,
} from 'utils/utils';
import { ReportHost } from '@/utils/config';
import { downloadFile } from '../../../services/api';

import FilterForm from './FilterForm';
import ListTable from './ListTable';

const modelPrompt = 'tarzan.hmes.abnormalReport';
const dateTimeFormat = getDateTimeFormat();

@connect(({ abnormalReport, loading }) => ({
  abnormalReport,
  fetchListLoading: loading.effects['abnormalReport/fetchList'],
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: 'tarzan.hmes.abnormalReport',
})
export default class AbnormalReport extends Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'abnormalReport/init',
    });
  }

  @Bind()
  handleFetchList(page = {}) {
    const { dispatch } = this.props;
    let value = this.formDom ? this.formDom.getFieldsValue() : {};
    const { startTime, endTime } = value;
    value = {
      ...value,
      startTime: isEmpty(startTime)
        ? null
        : startTime.startOf('day').format(dateTimeFormat),
      endTime: isEmpty(endTime) ? null : endTime.endOf('day').format(dateTimeFormat),
    };
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    dispatch({
      type: 'abnormalReport/fetchList',
      payload: {
        page: isEmpty(page) ? {} : page,
        ...filterValue,
      },
    });
  }

  // 下载附件
  @Bind()
  downloadLogFile(record) {
    const api = `/hfle/v1/${getCurrentOrganizationId()}/files/download`;
      downloadFile({
        requestUrl: api,
        queryParams: [
          { name: 'bucketName', value: "file-mes" },
          { name: 'url', value: record.fileUrl },
        ],
      });
  }

  @Bind()
  handleGetFormValue() {
    let value = this.formDom ? this.formDom.getFieldsValue() : {};
    const { startTime, endTime } = value;
    value = {
      ...value,
      startTime: isEmpty(startTime)
        ? null
        : startTime.startOf('day').format(dateTimeFormat),
      endTime: isEmpty(endTime) ? null : endTime.endOf('day').format(dateTimeFormat),
    };
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    return filterValue;
  }

  // 渲染 界面布局
  render() {
    const {
      fetchListLoading,
      tenantId,
      abnormalReport: {
        list = [],
        pagination = {},
        abnormalStatusList = [],
        abnormalTypeList = [],
        areaList = [],
      },
    } = this.props;
    const filterProps = {
      tenantId,
      abnormalStatusList,
      abnormalTypeList,
      areaList,
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
      downloadLogFile: this.downloadLogFile,
    };
    return (
      <div>
        <Header title={intl.get(`${modelPrompt}.view.title`).d('异常信息查看报表')}>
          <ExcelExport
            exportAsync
            requestUrl={`${ReportHost}/v1/${tenantId}/hme-common-report/exception-report-export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue()}
          />
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...listProps} />
        </Content>
      </div>
    );
  }
}
