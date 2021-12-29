/*
 * @Description: 工序采集项报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-06 17:23:00
 * @LastEditTime: 2020-08-04 08:13:41
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty, isUndefined } from 'lodash';
import moment from 'moment';

import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { Header, Content } from 'components/Page';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import ExcelExport from 'components/ExcelExport';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ transferOrderDetail, loading }) => ({
  transferOrderDetail,
  tenantId: getCurrentOrganizationId(),
  fetchLoading: loading.effects['transferOrderDetail/fetchList'],
  exportLoading: loading.effects['transferOrderDetail/exportExcel'],
}))
export default class TransferOrderDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'transferOrderDetail/batchLovData',
    });
    dispatch({
      type: 'transferOrderDetail/fetchDefaultSite',
    });
  }

  /**
   *  查询列表
   * @param {object} 查询参数
   */
  @Bind()
  handleSearch(page = {}) {
    const { dispatch } = this.props;
    const fieldsValue = (this.formDom && filterNullValueObject(this.formDom.getFieldsValue())) || {};
    const { creationDateFrom, creationDateTo, executorDateFrom, executorDateTo, allocationDateFrom, allocationDateTo} = fieldsValue;
    dispatch({
      type: 'transferOrderDetail/fetchList',
      payload: {
        ...fieldsValue,
        creationDateFrom: isUndefined(creationDateFrom)
          ? null
          : moment(creationDateFrom).format(DEFAULT_DATETIME_FORMAT),
        creationDateTo: isUndefined(creationDateTo)
          ? null
          : moment(creationDateTo).format(DEFAULT_DATETIME_FORMAT),
        executorDateFrom: isUndefined(executorDateFrom)
        ? null
        : moment(executorDateFrom).format(DEFAULT_DATETIME_FORMAT),
        executorDateTo: isUndefined(executorDateTo)
        ? null
        : moment(executorDateTo).format(DEFAULT_DATETIME_FORMAT),
        allocationDateFrom: isUndefined(allocationDateFrom)
          ? null
          : moment(allocationDateFrom).format(DEFAULT_DATETIME_FORMAT),
        allocationDateTo: isUndefined(allocationDateTo)
          ? null
          : moment(allocationDateTo).format(DEFAULT_DATETIME_FORMAT),
        page: isEmpty(page) ? {} : page,
      },
    });
  }

  @Bind()
  handleGetFormValue() {
    const fieldsValue = (this.formDom && filterNullValueObject(this.formDom.getFieldsValue())) || {};
    const { creationDateFrom, creationDateTo, executorDateFrom, executorDateTo, allocationDateFrom, allocationDateTo} = fieldsValue;
    return {
      ...fieldsValue,
      creationDateFrom: isUndefined(creationDateFrom)
        ? null
        : moment(creationDateFrom).format(DEFAULT_DATETIME_FORMAT),
      creationDateTo: isUndefined(creationDateTo)
        ? null
        : moment(creationDateTo).format(DEFAULT_DATETIME_FORMAT),
      executorDateFrom: isUndefined(executorDateFrom)
      ? null
      : moment(executorDateFrom).format(DEFAULT_DATETIME_FORMAT),
      executorDateTo: isUndefined(executorDateTo)
      ? null
      : moment(executorDateTo).format(DEFAULT_DATETIME_FORMAT),
      allocationDateFrom: isUndefined(allocationDateFrom)
        ? null
        : moment(allocationDateFrom).format(DEFAULT_DATETIME_FORMAT),
      allocationDateTo: isUndefined(allocationDateTo)
        ? null
        : moment(allocationDateTo).format(DEFAULT_DATETIME_FORMAT),
  };
  }

  /**
   *  渲染页面
   * @returns {*}
   */
  render() {
    const { fetchLoading, tenantId, transferOrderDetail: {
      list,
      pagination,
      docStatus = [],
      instructionDocTypeList = [],
      defaultSite,
    } } = this.props;
    const filterFormProps = {
      tenantId,
      defaultSite,
      onSearch: this.handleSearch,
      onRef: node => {
        this.formDom = node.props.form;
      },
      docStatus,
      instructionDocTypeList,
    };
    const listProps = {
      loading: fetchLoading,
      dataSource: list,
      pagination,
      onSearch: this.handleSearch,
    };
    return (
      <Fragment>
        <Header title="调拨单详情报表">
          <ExcelExport
            exportAsync
            requestUrl={`/mes/v1/${tenantId}/transfer-summary/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue()}
          />
        </Header>
        <Content>
          <FilterForm {...filterFormProps} />
          <ListTable {...listProps} />
        </Content>
      </Fragment>
    );
  }
}
