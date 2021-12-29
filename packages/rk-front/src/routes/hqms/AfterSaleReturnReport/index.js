/**
 * 采购接收过账
 * @date: 2020/06/17 20:41:36
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty, isArray } from 'lodash';

import formatterCollections from 'utils/intl/formatterCollections';
import { Header, Content } from 'components/Page';
import {
  filterNullValueObject,
  getCurrentOrganizationId,
  getDateTimeFormat,
} from 'utils/utils';
import ExcelExport from 'components/ExcelExport';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';
import { ReportHost } from '@/utils/config';

import { notification } from 'hzero-ui';
import FilterForm from './FilterForm';
import ListTable from './ListTable';
import styles from './index.less';

const dateTimeFormat = getDateTimeFormat();

@connect(({ afterSaleReturnReport, loading }) => ({
  afterSaleReturnReport,
  fetchListLoading: loading.effects['afterSaleReturnReport/fetchList'],
  tenantId: getCurrentOrganizationId(),
 }))
@formatterCollections({
  code: 'tarzan.hmes.stockTakePlatform',
})
export default class AfterSaleReturnReport extends Component {

  constructor(props) {
    super(props);
    this.init();
  }


  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleReturnReport/fetchDefaultSite',
    });
    dispatch({
      type: 'afterSaleReturnReport/fetchSiteList',
    });
  }

  @Bind()
  init() {
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleReturnReport/updateState',
      payload: {
        list: [],
        pagination: {},
      },
    });
  }

   /**
    * 查询盘点单列表
    *
    * @param {*} [page={}]
    * @memberof StockTakePlatform
    */
  @Bind()
  handleFetchList(page = {}) {
    const { dispatch } = this.props;
    const value = this.formDom ? this.formDom.getFieldsValue() : {};
    const { returnCheckDateStart, returnCheckDateEnd, snNumList, refurbishSnNumList } = value;
    if(!(returnCheckDateStart && returnCheckDateEnd) && (!snNumList && !refurbishSnNumList) ) {
      notification.warning({
        description: '接收SN，翻新SN未输入时，需输入退库检测时间起、退库检测时间',
      });
    } else {
      const filterValue = this.handleGetFormValue();
      dispatch({
        type: 'afterSaleReturnReport/fetchList',
        payload: {
          page,
          ...filterValue,
        },
      });
    }
  }

  @Bind()
  handleGetFormValue() {
    let value = this.formDom ? this.formDom.getFieldsValue() : {};
    const { returnCheckDateStart, returnCheckDateEnd, materialCodeList, snNumList, refurbishSnNumList, workcellCode, returnCheckWorkcellId, ...otherValue } = value;
    value = {
      ...otherValue,
      returnCheckDateStart: isEmpty(returnCheckDateStart)
        ? null : returnCheckDateStart.format(dateTimeFormat),
      returnCheckDateEnd: isEmpty(returnCheckDateEnd)
        ? null : returnCheckDateEnd.format(dateTimeFormat),
      materialCode: isArray(materialCodeList) ? materialCodeList.join(',') : null,
      snNum: isArray(snNumList) ? snNumList.join(',') : null,
      refurbishSnNum: isArray(refurbishSnNumList) ? refurbishSnNumList.join(',') : null,
      workcellCode: isArray(workcellCode) ? workcellCode.join(',') : null,
      returnCheckWorkcellId: isArray(returnCheckWorkcellId) ? returnCheckWorkcellId.join(',') : null,
    };
    return filterNullValueObject(value);
  }

  @Bind()
  handleGetFormDisabled() {
    const value = this.formDom ? this.formDom.getFieldsValue() : {};
    const { prodLineIds, workOrderNums, assemblyMaterialIds, planStartTimeFrom, planStartTimeTo } = value;
    return !(prodLineIds || workOrderNums || assemblyMaterialIds || planStartTimeFrom || planStartTimeTo);
  }


  // 渲染 界面布局
  render() {
    const {
      fetchListLoading,
      tenantId,
      afterSaleReturnReport: {
        list = [],
        pagination = {},
        siteList = [],
        siteInfo,
      },
    } = this.props;
    const filterProps = {
      tenantId,
      dataSource: list,
      siteList,
      siteInfo,
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
      <React.Fragment>
        <Header title="售后退库查询报表">
          <ExcelExport
            exportAsync
            requestUrl={`${ReportHost}/v1/${tenantId}/service-return/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue()}
          />
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <div className={styles['head-table']}>
            <ListTable {...listProps} />
          </div>
        </Content>
        <ModalContainer ref={registerContainer} />
      </React.Fragment>
    );
  }
}
