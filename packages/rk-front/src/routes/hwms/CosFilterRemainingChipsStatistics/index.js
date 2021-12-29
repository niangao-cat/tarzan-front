/**
 * @Author:lly
 * @email: liyuan.liu@hand-china.com
 * @description： COS筛选剩余芯片统计报表
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import { isEmpty } from 'lodash';

import {
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import ExcelExport from '@/components/ExcelExport';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';

import TableList from './TableList';
import FilterForm from './FilterForm';

const tenantId = getCurrentOrganizationId();
const commonModelPrompt = 'tarzan.hwms.cosFilterRemainingChipsStatistics';

@connect(({ cosFilterRemainingChipsStatistics, loading }) => ({
  cosFilterRemainingChipsStatistics,
  fetchListLoading: loading.effects['cosFilterRemainingChipsStatistics/queryDataList'],
}))
export default class cosFilterRemainingChipsStatistics extends Component {
  constructor(props) {
    super(props);
    this.initData();
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cosFilterRemainingChipsStatistics/batchLovData',
    });
  }

  @Bind()
  initData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cosFilterRemainingChipsStatistics/updateState',
      payload: {
        headList: [],
        headPagination: {},
      },
    });
  }

  @Bind()
  handleSearch(page = {}) {
    const { dispatch } = this.props;
    const value = this.handleGetFormValue();
    if(value) {
      dispatch({
        type: 'cosFilterRemainingChipsStatistics/queryDataList',
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
          const { materialLotCode, preparationDateFrom, preparationDateTo, preSelectionLot } = value;
          queryParams = filterNullValueObject({
            ...value,
            materialLotCode: materialLotCode && materialLotCode.toString(),
            preSelectionLot: preSelectionLot && preSelectionLot.toString(),
            preparationDateFrom: isEmpty(preparationDateFrom) ? null
              : moment(preparationDateFrom).format(DEFAULT_DATETIME_FORMAT),
            preparationDateTo: isEmpty(preparationDateTo) ? null
            : moment(preparationDateTo).format(DEFAULT_DATETIME_FORMAT),
          });
        }
      });
    }
    return queryParams;
  }

  render() {
    const {
      fetchListLoading,
      cosFilterRemainingChipsStatistics: {
        headList = [],
        headPagination = {},
        cosTypeMap = [],
      },
    } = this.props;
    const filterFormProps = {
      tenantId,
      cosTypeMap,
      onSearch: this.handleSearch,
      onRef: node => {
        this.formDom = node.props.form;
      },
    };
    return (
      <div>
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('COS筛选剩余芯片统计报表')}>
          <ExcelExport
            exportAsync
            requestUrl={`/mes-report/v1/${getCurrentOrganizationId()}/hme-preparation-surplus-chip/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
            fileName="COS筛选剩余芯片统计报表.xlsx"
          />
        </Header>
        <Content>
          <FilterForm {...filterFormProps} />
          <TableList
            dataSource={headList}
            pagination={headPagination}
            onSearch={this.handleSearch}
            loading={fetchListLoading}
          />
          <ModalContainer ref={registerContainer} />
        </Content>
      </div>
    );
  }
}
