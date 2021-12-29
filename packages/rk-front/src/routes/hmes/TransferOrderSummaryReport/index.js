/*
 * @Description: 调拨单汇总报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-12-23 20:28:36
 * @LastEditTime: 2020-12-24 11:19:28
 */

import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty, isUndefined } from 'lodash';
import { Table } from 'hzero-ui';
import { filterNullValueObject, tableScrollWidth, getCurrentOrganizationId } from 'utils/utils';
import moment from 'moment';
import {
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
import ExcelExport from 'components/ExcelExport';
import FilterForm from './FilterForm';


@connect(({ transferOrderSummaryReport, loading }) => ({
  transferOrderSummaryReport,
  tenantId: getCurrentOrganizationId(),
  handleSearchLoading: loading.effects['transferOrderSummaryReport/handleSearch'],
}))
export default class TransferOrderSummaryReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'transferOrderSummaryReport/batchLovData',
      tenantId,
    });
    dispatch({
      type: 'transferOrderSummaryReport/fetchDefaultSite',
    });
  }


  /**
   * 获取查询表单组件this对象
   * @param {object} ref - 查询表单组件this
   */
  @Bind
  handleBindRef(ref) {
    this.filterForm = (ref.props || {}).form;
  }


  /**
   *  查询列表
   * @param {object} 查询参数
   */
  @Bind()
  handleSearch(fields = {}) {
    const { dispatch } = this.props;
    const fieldsValue = (this.filterForm && filterNullValueObject(this.filterForm.getFieldsValue())) || {};
    dispatch({
      type: 'transferOrderSummaryReport/handleSearch',
      payload: {
        ...fieldsValue,
        creationDateFrom: isUndefined(fieldsValue.creationDateFrom)
          ? null
          : moment(fieldsValue.creationDateFrom).format(DEFAULT_DATETIME_FORMAT),
        creationDateTo: isUndefined(fieldsValue.creationDateTo)
          ? null
          : moment(fieldsValue.creationDateTo).format(DEFAULT_DATETIME_FORMAT),

        executorDateFrom: isUndefined(fieldsValue.executorDateFrom)
          ? null
          : moment(fieldsValue.executorDateFrom).format(DEFAULT_DATETIME_FORMAT),
        executorDateTo: isUndefined(fieldsValue.executorDateTo)
          ? null
          : moment(fieldsValue.executorDateTo).format(DEFAULT_DATETIME_FORMAT),
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  @Bind()
  handleGetFormValue() {
    const fieldsValue = (this.filterForm && filterNullValueObject(this.filterForm.getFieldsValue())) || {};
    return filterNullValueObject({
      ...fieldsValue,
      creationDateFrom: isUndefined(fieldsValue.creationDateFrom)
        ? null
        : moment(fieldsValue.creationDateFrom).format(DEFAULT_DATETIME_FORMAT),
      creationDateTo: isUndefined(fieldsValue.creationDateTo)
        ? null
        : moment(fieldsValue.creationDateTo).format(DEFAULT_DATETIME_FORMAT),
    });
  }

  render() {
    const {
      transferOrderSummaryReport: {
        list = [],
        pagination = {},
        instructionDocTypeLisy = [],
        docStatus = [],
        defaultSite = {},
      },
      handleSearchLoading,
      tenantId,
    } = this.props;
    // 查询
    const filterFormProps = {
      docStatus,
      defaultSite,
      instructionDocTypeLisy,
      onSearch: this.handleSearch,
      resetForm: this.onResetSearch,
      onSelectedSite: this.onSelectedSite,
      onSelectedDivision: this.onSelectedDivision,
    };
    const columns = [
      {
        title: '调拨单',
        dataIndex: 'instructionDocNum',
        width: 120,
      },
      {
        title: '调拨单状态',
        dataIndex: 'instructionDocStatusMeaning',
        width: 120,
      },
      {
        title: '工厂',
        dataIndex: 'siteCode',
        width: 120,
      },
      {
        title: '调拨单类型',
        dataIndex: 'instructionDocTypeMeaning',
        width: 120,
      },
      {
        title: '制单人',
        dataIndex: 'createdByName',
        width: 120,
      },
      {
        title: '制单时间',
        dataIndex: 'creationDate',
        width: 120,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 120,
      },
      {
        title: '行号',
        dataIndex: 'instructionLineNum',
        width: 120,
      },
      {
        title: '物料',
        dataIndex: 'materialCode',
        width: 120,
      },
      {
        title: '单位',
        dataIndex: 'uomCode',
        width: 120,
      },
      {
        title: '物料描述',
        dataIndex: 'materialName',
        width: 120,
      },
      {
        title: '物料版本',
        dataIndex: 'materialVersion',
        width: 120,
      },
      {
        title: '制单数量',
        dataIndex: 'quantity',
        width: 120,
      },
      {
        title: '待调拨数量',
        dataIndex: 'waitAllocationQty',
        width: 120,
      },
      {
        title: '已签收数量',
        dataIndex: 'actualQuantity',
        width: 120,
      },
      {
        title: '行状态',
        dataIndex: 'instructionStatusMeaning',
        width: 120,
      },
      {
        title: '来源仓库',
        dataIndex: 'fromWarehouseCode',
        width: 120,
      },
      {
        title: '来源货位',
        dataIndex: 'fromLocatorCode',
        width: 120,
      },
      {
        title: '目标仓库',
        dataIndex: 'toWarehouseCode',
        width: 120,
      },
      {
        title: '目标货位',
        dataIndex: 'toLocatorCode',
        width: 120,
      },
      {
        title: '最新执行人',
        dataIndex: 'executorUser',
        width: 120,
      },
      {
        title: '最新执行时间',
        dataIndex: 'executorDate',
        width: 120,
      },
      {
        title: '超发设置',
        dataIndex: 'excessSettingMeaning',
        width: 120,
      },
      {
        title: '超发值',
        dataIndex: 'excessValue',
        width: 120,
      },
    ];
    return (
      <Fragment>
        <Header title="调拨单汇总报表">
          {/* {list.length > 0 && ( */}
          {/*   <ExcelExport */}
          {/*     exportAsync */}
          {/*     requestUrl={`/mes/v1/${tenantId}/transfer-summary/export`} // 路径 */}
          {/*     otherButtonProps={{ type: 'primary' }} */}
          {/*     queryParams={this.handleGetFormValue()} */}
          {/*   /> */}
          {/* )} */}
          <ExcelExport
            exportAsync
            requestUrl={`/mes-report/v1/${tenantId}/transfer-summary/export`}
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue()}
          />
        </Header>
        <Content>
          <FilterForm {...filterFormProps} onRef={this.handleBindRef} />
          <Table
            dataSource={list}
            columns={columns}
            scroll={{ x: tableScrollWidth(columns) }}
            bordered
            pagination={pagination}
            onChange={page => this.handleSearch(page)}
            loading={handleSearchLoading}
          />
        </Content>
      </Fragment>
    );
  }
}
