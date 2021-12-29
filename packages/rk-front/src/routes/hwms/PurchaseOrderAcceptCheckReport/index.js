/**
 * @Author:lly
 * @email: liyuan.liu@hand-china.com
 * @description： 采购订单接收检验统计报表
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

const commonModelPrompt = 'tarzan.hwms.purchaseOrderAcceptCheckReport';

@connect(({ purchaseOrderAcceptCheckReport, loading }) => ({
  purchaseOrderAcceptCheckReport,
  fetchListLoading: loading.effects['purchaseOrderAcceptCheckReport/queryDataList'],
}))
export default class PurchaseOrderAcceptCheckReport extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    // 加载下拉框
    // await dispatch({
    //   type: 'purchaseOrderAcceptCheckReport/batchLovData',
    // });
    await dispatch({
      type: 'purchaseOrderAcceptCheckReport/querySiteList',
      payload: {},
    });
    await dispatch({
      type: 'purchaseOrderAcceptCheckReport/getSiteList',
      payload: {},
    });
  }

  @Bind()
  handleSearch(page = {}) {
    const { dispatch } = this.props;
    const value = this.handleGetFormValue();
    if(value) {
      dispatch({
        type: 'purchaseOrderAcceptCheckReport/queryDataList',
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
    let queryParams = false;
    if(this.formDom) {
      this.formDom.validateFields((err, value) => {
        if(!err) {
          const { actualReceivedDateFrom, actualReceivedDateTo, demandTimeFrom, demandTimeTo } = value;
          queryParams = filterNullValueObject({
            ...value,
            actualReceivedDateFrom: actualReceivedDateFrom
              ? moment(actualReceivedDateFrom).format(DEFAULT_DATETIME_FORMAT)
              : null,
            actualReceivedDateTo: actualReceivedDateTo
              ? moment(actualReceivedDateTo).format(DEFAULT_DATETIME_FORMAT)
              : null,
            demandTimeFrom: demandTimeFrom
              ? moment(demandTimeFrom).format(DEFAULT_DATETIME_FORMAT)
              : null,
            demandTimeTo: demandTimeTo
              ? moment(demandTimeTo).format(DEFAULT_DATETIME_FORMAT)
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
      purchaseOrderAcceptCheckReport: {
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
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('采购订单接收检验统计报表')}>
          <ExcelExport
            exportAsync
            requestUrl={`/mes/v1/${getCurrentOrganizationId()}/wms-purchase-order-receipt-inspection/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
            fileName="采购订单接收检验统计报表.xlsx"
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
