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
import { isEmpty } from 'lodash';
import ExcelExport from '@/components/ExcelExport';

import formatterCollections from 'utils/intl/formatterCollections';
import { Header, Content } from 'components/Page';
import {
  filterNullValueObject,
  getCurrentOrganizationId,
  getDateTimeFormat,
} from 'utils/utils';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';

import FilterForm from './FilterForm';
import ListTable from './ListTable';
import styles from './index.less';

const dateTimeFormat = getDateTimeFormat();

@connect(({ feedMaterialReport, loading }) => ({
  feedMaterialReport,
  fetchListLoading: loading.effects['feedMaterialReport/fetchList'],
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: 'tarzan.hmes.FeedMaterialReport',
})
export default class FeedMaterialReport extends Component {


  /**
   * 查询盘点单列表
   *
   * @param {*} [page={}]
   * @memberof StockTakePlatform
   */
  @Bind()
  handleSearch(page = {}) {
    const { dispatch } = this.props;
    const value = this.handleGetFormValue();
    if (value) {
      dispatch({
        type: 'feedMaterialReport/fetchList',
        payload: {
          page: isEmpty(page) ? {} : page,
          ...value,
        },
      });
    }
  }

  // 导出
  @Bind()
  handleGetFormValue() {
    let queryParams = false;
    if (this.formDom) {
      this.formDom.validateFields((err, value) => {
        if (!err) {
          const { createDateFrom, createDateTo, workOrderNumIdList, eoIdList, identificationList, materialLotCode, lotList } = value;
          queryParams = filterNullValueObject({
            ...value,
            workOrderNumIdList: isEmpty(workOrderNumIdList) ? null : workOrderNumIdList.split(','),
            eoIdList: isEmpty(eoIdList) ? null : eoIdList.split(','),
            identificationList: isEmpty(identificationList) ? null : identificationList,
            materialLotCode: isEmpty(materialLotCode) ? null : materialLotCode.toString(),
            lotList: isEmpty(lotList) ? null : lotList,
            createDateFrom: isEmpty(createDateFrom) ? null : createDateFrom.format(dateTimeFormat),
            createDateTo: isEmpty(createDateTo) ? null : createDateTo.format(dateTimeFormat),
          });
        }
      });
    }
    return queryParams;
  }

  // 渲染 界面布局
  render() {
    const {
      fetchListLoading,
      tenantId,
      feedMaterialReport: {
        list = [],
        pagination = {},
      },
    } = this.props;
    const filterProps = {
      tenantId,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.handleSearch,
    };
    const listProps = {
      loading: fetchListLoading,
      pagination,
      dataSource: list,
      onSearch: this.handleSearch,
    };

    return (
      <React.Fragment>
        <Header title="投料汇总报表">
          <ExcelExport
            exportAsync
            requestUrl={`/mes-report/v1/${tenantId}/hme-input_record/input-record-export`} // 路径
            createTaskUrl={`/mes-report/v1/${tenantId}/hme-input_record/create-task`}
            exportAsyncUrl={`/mes-report/v1/${tenantId}/hme-input_record/async-export`}
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
            method="POST"
            fileName="投料汇总报表.xlsx"
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
