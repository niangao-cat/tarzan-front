/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： COS条码加工汇总表
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { getCurrentOrganizationId, filterNullValueObject, getDateTimeFormat } from 'utils/utils';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ExcelExport from '@/components/ExcelExport';
import TableList from './TableList';
import FilterForm from './FilterForm';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';


const commonModelPrompt = 'tarzan.hwms.wmsSummaryOfCosBarcodeProcessing';

@connect(({ wmsSummaryOfCosBarcodeProcessing, loading }) => ({
  wmsSummaryOfCosBarcodeProcessing,
  tenantId: getCurrentOrganizationId(),
  fetchListLoading: loading.effects['wmsSummaryOfCosBarcodeProcessing/queryDataList'],
}))
export default class wmsSummaryOfCosBarcodeProcessing extends Component {
  constructor(props) {
    super(props);
    this.handleInitData();
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'wmsSummaryOfCosBarcodeProcessing/init',
    });
  }

  @Bind()
  handleInitData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'wmsSummaryOfCosBarcodeProcessing/updateState',
      payload: {
        headList: [],
        headPagination: {},
      },
    });
  }

  @Bind
  handleFetchList(page = {}) {
    const { dispatch } = this.props;
    this.formDom.validateFields((errs) => {
      if (!errs) {
        const newValue = this.handleGetFormValue();
        dispatch({
          type: 'wmsSummaryOfCosBarcodeProcessing/queryDataList',
          payload: {
            ...newValue,
            page,
          },
        });
      }
    });
  }

  @Bind()
  handleGetFormValue() {
    const { creationDateStart, creationDateEnd, workOrderNum, materialLotCode, labCode, cosType, waferNum, ...otherInfo } = this.formDom ? this.formDom.getFieldsValue() : {};
    const newValue = filterNullValueObject({
      ...otherInfo,
      creationDateStart: isEmpty(creationDateStart)
        ? null : moment(creationDateStart).format(getDateTimeFormat()),
      creationDateEnd: isEmpty(creationDateEnd)
        ? null : moment(creationDateEnd).format(getDateTimeFormat()),
      workOrderNum: isEmpty(workOrderNum) ? null : workOrderNum.toString(),
      materialLotCode: isEmpty(materialLotCode) ? null : materialLotCode.toString(),
      labCode: isEmpty(labCode) ? null : labCode.toString(),
      cosType: isEmpty(cosType) ? null : cosType.toString(),
      waferNum: isEmpty(waferNum) ? null : waferNum.toString(),
    });
    return newValue;
  }

  render() {
    const {
      fetchListLoading,
      tenantId,
      wmsSummaryOfCosBarcodeProcessing: { headList=[], headPagination = {}, cosTypeMap = [] },
    } = this.props;
    const filterFormProps = {
      cosTypeMap,
      tenantId,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.handleFetchList,
    };
    return (
      <div>
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('COS条码加工汇总表')}>
          <ExcelExport
            exportAsync
            requestUrl={`/mes-report/v1/${tenantId}/wms-summary-of-cos-barcode-processing-repository/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
            method="POST"
            fileName="COS条码加工汇总表"
          />
        </Header>
        <Content>
          <FilterForm {...filterFormProps} />
          <TableList
            dataSource={headList}
            pagination={headPagination}
            onSearch={this.handleFetchList}
            loading={fetchListLoading}
          />
          <ModalContainer ref={registerContainer} />
        </Content>
      </div>
    );
  }
}
