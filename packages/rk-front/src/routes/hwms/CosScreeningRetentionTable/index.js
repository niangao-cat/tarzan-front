/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： COS筛选滞留表
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isArray } from 'lodash';
import { Form } from 'hzero-ui';
import moment from 'moment';
import {
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
import ExcelExport from '@/components/ExcelExport';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ModalContainer, { registerContainer } from '../../../components/Modal/ModalContainer';
import TableList from './TableList';
import FilterForm from './FilterForm';


const commonModelPrompt = 'tarzan.hwms.cosScreeningRetentionTable';

@connect(({ cosScreeningRetentionTable, loading }) => ({
  cosScreeningRetentionTable,
  fetchListLoading: loading.effects['cosScreeningRetentionTable/queryDataList'],
  exportLoading: loading.effects['cosScreeningRetentionTable/handleExport'],
  tenantId: getCurrentOrganizationId(),
}))
@Form.create({ fieldNameProp: null })
export default class cosScreeningRetentionTable extends Component {

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'cosScreeningRetentionTable/batchLovData',
    });
  }

  @Bind()
  handleSearch( page = {}) {
    const { dispatch } = this.props;
    const value = this.handleGetFormValue();
    if(value) {
      dispatch({
        type: 'cosScreeningRetentionTable/queryDataList',
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
          const {
            workOrderNum = [],
            wafer = [],
            materialLotCode = [],
            hotSinkCode = [],
            labCode = [],
            selectionSourceMaterialLotCode = [],
            virtualNum = [],
            identification = [],
            preSelectionLot = [],
            selectionRuleCode = [],
            hotSinkMaterialLotCode = [],
            hotSinkSupplierLot = [],
            goldMaterialLotCode = [],
            goldSupplierLot = [],
            preSelectionDateFrom,
            preSelectionDateTo,
            loadDateFrom,
            loadDateTo,
            cosType = [],
          } = value;
          queryParams = filterNullValueObject({
            ...value,
            cosType: isArray(cosType) ? cosType.join(',') : null,
            workOrderNum: isArray(workOrderNum) ? workOrderNum.join(',') : null,
            wafer: isArray(wafer) ? wafer.join(',') : null,
            materialLotCode: isArray(materialLotCode) ? materialLotCode.join(',') : null,
            hotSinkCode: isArray(hotSinkCode) ? hotSinkCode.join(',') : null,
            labCode: isArray(labCode) ? labCode.join(',') : null,
            selectionSourceMaterialLotCode: isArray(selectionSourceMaterialLotCode) ? selectionSourceMaterialLotCode.join(',') : null,
            virtualNum: isArray(virtualNum) ? virtualNum.join(',') : null,
            identification: isArray(identification) ? identification.join(',') : null,
            preSelectionLot: isArray(preSelectionLot) ? preSelectionLot.join(',') : null,
            selectionRuleCode: isArray(selectionRuleCode) ? selectionRuleCode.join(',') : null,
            hotSinkMaterialLotCode: isArray(hotSinkMaterialLotCode) ? hotSinkMaterialLotCode.join(',') : null,
            hotSinkSupplierLot: isArray(hotSinkSupplierLot) ? hotSinkSupplierLot.join(',') : null,
            goldMaterialLotCode: isArray(goldMaterialLotCode) ? goldMaterialLotCode.join(',') : null,
            goldSupplierLot: isArray(goldSupplierLot) ? goldSupplierLot.join(',') : null,
            preSelectionDateFrom: preSelectionDateFrom ? moment(preSelectionDateFrom).format(DEFAULT_DATETIME_FORMAT) : '',
            preSelectionDateTo: preSelectionDateTo ? moment(preSelectionDateTo).format(DEFAULT_DATETIME_FORMAT) : '',
            loadDateFrom: loadDateFrom ? moment(loadDateFrom).format(DEFAULT_DATETIME_FORMAT) : null,
            loadDateTo: loadDateTo ? moment(loadDateTo).format(DEFAULT_DATETIME_FORMAT) : null,
          });
        }
      });
    }
    return queryParams;
  }

  render() {
    const {
      fetchListLoading,
      tenantId,
      cosScreeningRetentionTable: {
        headList = [],
        headPagination = {},
        cosTypeMap = [],
        statusMap = [],
        enableMap = [],
      },
    } = this.props;
    const filterFormProps = {
      cosTypeMap,
      statusMap,
      enableMap,
      tenantId,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.handleSearch,
    };
    const tableProps = {
      dataSource: headList,
      pagination: headPagination,
      loading: fetchListLoading,
      onSearch: this.handleSearch,
    };
    return (
      <div>
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('COS完工芯片明细表')}>
          <ExcelExport
            exportAsync
            requestUrl={`/mes-report/v1/${getCurrentOrganizationId()}/cos-completion-detail/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
            fileName="COS完工芯片明细表.xlsx"
            method="POST"
          />
        </Header>
        <Content>
          <FilterForm {...filterFormProps} />
          <TableList {...tableProps} />
          <ModalContainer ref={registerContainer} />
        </Content>
      </div>
    );
  }
}
