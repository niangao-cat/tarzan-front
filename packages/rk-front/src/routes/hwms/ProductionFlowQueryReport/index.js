/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 生产流转查询报表
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Form, notification } from 'hzero-ui';
import moment from 'moment';
import { isArray, isEmpty } from 'lodash';
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
import intl from 'utils/intl';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import { Header, Content } from 'components/Page';
import ExcelExport from '@/components/ExcelExport';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';

import { ReportHost } from '@/utils/config';
import TableList from './TableList';
import BadInfoDrawer from './BadInfoDrawer';
import FilterForm from './FilterForm';

const commonModelPrompt = 'tarzan.hwms.productionFlowQueryReport';

@connect(({ productionFlowQueryReport, loading }) => ({
  productionFlowQueryReport,
  fetchListLoading: loading.effects['productionFlowQueryReport/queryDataList'],
  fetchNcListLoading: loading.effects['productionFlowQueryReport/fetchNcList'],
  tenantId: getCurrentOrganizationId(),
}))
@Form.create({ fieldNameProp: null })
export default class ProductionFlowQueryReport extends Component {
  state = {
    visible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'productionFlowQueryReport/init',
    });
    dispatch({
      type: 'productionFlowQueryReport/fetchDefaultSite',
    });
    dispatch({
      type: 'productionFlowQueryReport/fetchStatusSelectList',
      payload: {
        module: 'ORDER',
        statusGroup: 'WO_STATUS',
        type: 'workOrderStatusOptions',
      },
    });
  }

  @Bind()
  drawerVisible(flag) {
    this.setState({ visible: flag });
  }

  @Bind()
  handleSearch(page = {}) {
    const { dispatch } = this.props;
    const values = this.handleGetFormValue();
    if (values) {
      dispatch({
        type: 'productionFlowQueryReport/queryDataList',
        payload: {
          page,
          ...values,
        },
      });
    }
  }

  @Bind()
  handleGetFormValue() {
    let queryParams = false;
    if (this.formDom) {
      this.formDom.validateFields((err, value) => {
        if (!err) {
          const { shiftDate, workStartFrom, workStartTo, workEndFrom, workEndTo, materialLotCodeList, productionCodeList, workOrderNumList, reworkSnList, workOrderStatusList, ...otherValue } = value;
          if (isEmpty(materialLotCodeList) && isEmpty(reworkSnList) && isEmpty(filterNullValueObject(otherValue))) {
            notification.warning({
              description: '当【产品序列号】和【返修SN】未输入时，【加工开始时间从】和【加工开始时间至】必输，且再加任意一个输入条件',
            });
          } else {
            queryParams = filterNullValueObject({
              ...otherValue,
              shiftDate: isEmpty(shiftDate)
                ? ''
                : moment(shiftDate).format(DEFAULT_DATE_FORMAT),
              workStartFrom: isEmpty(workStartFrom)
                ? ''
                : moment(workStartFrom).format(DEFAULT_DATETIME_FORMAT),
              workStartTo: isEmpty(workStartTo)
                ? ''
                : moment(workStartTo).format(DEFAULT_DATETIME_FORMAT),
              workEndFrom: isEmpty(workEndFrom)
                ? ''
                : moment(workEndFrom).format(DEFAULT_DATETIME_FORMAT),
              workEndTo: isEmpty(workEndTo)
                ? ''
                : moment(workEndTo).format(DEFAULT_DATETIME_FORMAT),
              materialLotCode: isArray(materialLotCodeList) ? materialLotCodeList.join(',') : null,
              productionCode: isArray(productionCodeList) ? productionCodeList.join(',') : null,
              workOrderNum: isArray(workOrderNumList) ? workOrderNumList.join(',') : null,
              reworkMaterialLot: isArray(reworkSnList) ? reworkSnList.join(',') : null,
              workOrderStatus: isArray(workOrderStatusList) ? workOrderStatusList.join(',') : null,
            });
          }
        }
      });
    }
    return queryParams;
  }


  /**
   * @description: 查找不良信息
   * @param {type} params
   */
  @Bind()
  fetchBadInfo(record) {
    this.setState({ visible: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'productionFlowQueryReport/fetchNcList',
      payload: {
        ...record,
      },
    });
  }

  render() {
    const {
      fetchListLoading,
      fetchNcListLoading,
      tenantId,
      productionFlowQueryReport: {
        headList = [],
        headPagination = {},
        cosTypeMap = [],
        ncList = [],
        siteInfo = {},
        workOrderStatusOptions = [],
      },
    } = this.props;

    const filterFormProps = {
      cosTypeMap,
      workOrderStatusOptions,
      siteInfo,
      tenantId,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.handleSearch,
    };

    const listTableProps = {
      dataSource: headList,
      pagination: headPagination,
      loading: fetchListLoading,
      onSearch: this.handleSearch,
      handleClickSelectedRows: this.fetchBadInfo,
    };
    return (
      <div>
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('生产流转查询报表')}>
          <ExcelExport
            exportAsync
            requestUrl={`${ReportHost}/v1/${tenantId}/hme-production-flow/export`} // 路径
            exportAsyncUrl={`${ReportHost}/v1/${tenantId}/hme-production-flow/async-export`}
            createTaskUrl={`${ReportHost}/v1/${tenantId}/hme-production-flow/create-task`}
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
            fileName="生产流传查询报表.xlsx"
            method="POST"
          />
        </Header>
        <Content>
          <FilterForm {...filterFormProps} />
          <TableList {...listTableProps} />
          <ModalContainer ref={registerContainer} />
        </Content>
        {this.state.visible && (
          <BadInfoDrawer
            visible={this.state.visible}
            onCancel={this.drawerVisible}
            loading={fetchNcListLoading}
            dataSource={ncList}
          />
        )}
      </div>
    );
  }
}
