/**
 * @author:ywj
 * @email:wenjie.yang01@hand-china.com
 * @description: 报表
 */

// 引入必要的依赖包
import React from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { Spin } from 'hzero-ui';
import moment from 'moment';
import { isArray, isEmpty } from 'lodash';

import {
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import { ReportHost } from '@/utils/config';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';
import ExcelExport from '@/components/ExcelExport';

import Filter from './FilterForm';
import HeadTable from './HeadTable';

// 链接model层
@connect(({ chipPerformanceTableBoard, loading }) => ({
  chipPerformanceTableBoard,
  tenantId: getCurrentOrganizationId(),
  fetchHeadDataLoading: loading.effects['chipPerformanceTableBoard/queryHeadData'] || loading.effects['chipPerformanceTableBoard/queryGpHeadData'],
}))
// 默认导出 视图
export default class chipPerformanceTableBoard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loadingHead: false,
    };
    this.handleInit();
  }

  @Bind()
  handleSearch(page = {}) {
    const { dispatch } = this.props;
    const value = this.handleGetFormValue();
    const searchType = this.formDom.getFieldValue('searchType');
    if (value) {
      dispatch({
        type: `chipPerformanceTableBoard/${searchType === 'gp-search' ? 'queryGpHeadData' : 'queryHeadData'}`,
        payload: {
          ...value,
          page,
        },
      });
    }
  }


  // 加载时调用的方法
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chipPerformanceTableBoard/init',
    });
    dispatch({
      type: 'chipPerformanceTableBoard/fetchSiteList',
    });
    dispatch({
      type: 'chipPerformanceTableBoard/getDefaultSite',
    });
  }

  @Bind()
  handleInit() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chipPerformanceTableBoard/updateState',
      payload: {
        headList: [],
        headPagination: {},
      },
    });
  }

  @Bind()
  handleGetFormValue() {
    let queryParams = false;
    if (this.formDom) {
      this.formDom.validateFields((err, value) => {
        if (!err) {
          const {
            startDate,
            endDate,
            workOrderNumList,
            waferList,
            materialLotCodeList,
            hotSinkCodeList,
            labCodeList,
            heatSinkMaterialLotList,
            heatSinkSupplierLotList,
            goldWireMaterialLotList,
            goldWireSupplierLotList,
            cosType,
            preStatus,
            current,
            searchType,
            ...otherValue
          } = value;
          queryParams = filterNullValueObject({
            ...otherValue,
            startDate: isEmpty(startDate) ? null : moment(startDate).format(DEFAULT_DATETIME_FORMAT),
            endDate: isEmpty(endDate) ? null : moment(endDate).format(DEFAULT_DATETIME_FORMAT),
            workOrderNum: isArray(workOrderNumList) ? workOrderNumList.join(',') : null,
            wafer: isArray(waferList) ? waferList.join(',') : null,
            materialLotCode: isArray(materialLotCodeList) ? materialLotCodeList.join(',') : null,
            hotSinkCode: isArray(hotSinkCodeList) ? hotSinkCodeList.join(',') : null,
            labCode: isArray(labCodeList) ? labCodeList.join(',') : null,
            heatSinkMaterialLot: isArray(heatSinkMaterialLotList) ? heatSinkMaterialLotList.join(',') : null,
            heatSinkSupplierLot: isArray(heatSinkSupplierLotList) ? heatSinkSupplierLotList.join(',') : null,
            goldWireMaterialLot: isArray(goldWireMaterialLotList) ? goldWireMaterialLotList.join(',') : null,
            goldWireSupplierLot: isArray(goldWireSupplierLotList) ? goldWireSupplierLotList.join(',') : null,
            cosType: isArray(cosType) ? cosType.join(',') : null,
            preStatus: isArray(preStatus) ? preStatus.join(',') : null,
            current: isArray(current) ? current.join(',') : null,
          });
        }
      });
    }
    return queryParams;
  }

  // 渲染
  render() {
    const {
      chipPerformanceTableBoard: {
        headList = [],
        headPagination = {},
        preStatusList = [],
        cosTypeList = [],
        currentList = [],
        siteList = [],
        siteInfo = {},
      },
      fetchHeadDataLoading,
      tenantId,
    } = this.props;
    // 设置查询参数
    const searchProps = {
      preStatusList,
      cosTypeList,
      currentList,
      tenantId,
      siteList,
      siteInfo,
      onSearch: this.handleSearch,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onResetFields: this.handleInit,
    };

    // 设置头表参数
    const headProps = {
      dataSource: headList,
      pagination: headPagination,
      loading: fetchHeadDataLoading,
      onSearch: this.handleSearch,
    };

    // 返回视图解析
    return (
      <div>
        <Header title={intl.get(`title`).d('COS测试明细')}>
          <ExcelExport
            exportAsync
            exportUrl={`${ReportHost}/v1/${tenantId}/hme-cos-functions/mes-report/function/export`} // 路径
            exportAsyncUrl={`${ReportHost}/v1/${tenantId}/hme-cos-functions/mes-report/function/async-export`}
            createTaskUrl={`${ReportHost}/v1/${tenantId}/hme-cos-functions/create-task`}
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
            method="POST"
            fileName="COS测试明细.xlsx"
          />
          <ExcelExport
            exportAsync
            exportUrl={`${ReportHost}/v1/${tenantId}/hme-cos-functions/mes-report/gp/function/export`} // 路径
            exportAsyncUrl={`${ReportHost}/v1/${tenantId}/hme-cos-functions/mes-report/gp/function/async-export`}
            createTaskUrl={`${ReportHost}/v1/${tenantId}/hme-cos-functions/create-task`}
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
            method="POST"
            fileName="COS测试明细.xlsx"
            buttonText="历史导出"
          />
        </Header>
        <Content>
          <Filter {...searchProps} />
          <Spin spinning={this.state.loadingHead}>
            <HeadTable {...headProps} />
          </Spin>
          <ModalContainer ref={registerContainer} />
        </Content>
      </div>
    );
  }
}
