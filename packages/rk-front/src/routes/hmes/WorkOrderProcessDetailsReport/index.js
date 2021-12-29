/*
 * @Description: 工单在制明细查询报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-11-17 15:29:07
 * @LastEditTime: 2021-01-28 16:32:45
 */


import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { Table } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isArray, isEmpty } from 'lodash';

import { tableScrollWidth, getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import ExcelExport from '@/components/ExcelExport';
import { ReportHost } from '@/utils/config';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';

import FilterForm from './FilterForm';

@connect(({ workOrderProcessDetailsReport, loading }) => ({
  workOrderProcessDetailsReport,
  tenantId: getCurrentOrganizationId(),
  fetchDataLoading: loading.effects['workOrderProcessDetailsReport/fetchData'],
}))
export default class WorkOrderProcessDetailsReport extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  filterForm;

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    // 默认站点
    dispatch({
      type: 'workOrderProcessDetailsReport/getSiteList',
      payload: {},
    });
    dispatch({
      type: 'workOrderProcessDetailsReport/batchLovData',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'workOrderProcessDetailsReport/fetchSiteList',
    });
  }

  @Bind
  fetchData(fields = {}) {
    const { dispatch } = this.props;
    const value = this.handleGetFormValue();
    if (value) {
      dispatch({
        type: 'workOrderProcessDetailsReport/fetchData',
        payload: {
          ...value,
          page: isEmpty(fields) ? {} : fields,
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
          const { materialCode, processList, workOrderNum, workcellList, reworkMaterialLotCode, one, two, three, four, ...otherValue } = value;
          const productTypeList = [
            one || null,
            two || null,
            three || null,
            four || null,
          ];
          queryParams = filterNullValueObject({
            ...otherValue,
            workOrderNum: workOrderNum ? workOrderNum.join(",") : null,
            materialId: materialCode ? materialCode.split(",") : null,
            processList: processList ? processList.split(',') : null,
            workcellList: !isEmpty(workcellList) ? workcellList.split(',') : null,
            reworkMaterialLotCode: isArray(reworkMaterialLotCode) ? reworkMaterialLotCode.join(',') : null,
            productTypeList: !one && !two && !three && !four ? null : productTypeList,
          });
        }
      });
    }
    return queryParams;
  }


  render() {
    const {
      tenantId,
      fetchDataLoading,
      workOrderProcessDetailsReport: {
        defaultSite = {},
        data = [],
        pagination = {},
        woStatus = [],
        qualityStatus = [],
        siteList = [],
      },
    } = this.props;
    const filterProps = {
      woStatus,
      qualityStatus,
      tenantId,
      defaultSite,
      siteList,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.fetchData,
    };
    const columns = [
      { dataIndex: 'workOrderNum', width: 130, title: '工单号' },
      { dataIndex: 'materialCode', width: 130, title: '工单物料编码' },
      { dataIndex: 'materialName', width: 130, title: '工单物料名称' },
      { dataIndex: 'productionVersion', width: 80, title: '生产版本' },
      { dataIndex: 'itemGroupCode', width: 130, title: '产品组' },
      { dataIndex: 'itemGroupDescription', width: 130, title: '产品组描述' },
      { dataIndex: 'typedesc', width: 110, title: '工单类型', align: 'center' },
      { dataIndex: 'prodLineCode', width: 130, title: '生产线编码' },
      { dataIndex: 'prodlinedesc', width: 130, title: '生产线描述' },
      { dataIndex: 'statusdesc', width: 90, title: '工单状态', align: 'center' },
      { dataIndex: 'qty', width: 90, title: '工单数量', align: 'center' },
      { dataIndex: 'releasedQty', width: 90, title: '下达数量', align: 'center' },
      { dataIndex: 'completedQty', width: 90, title: '完工数量', align: 'center' },
      { dataIndex: 'eoNum', width: 130, title: 'EO编码' },
      { dataIndex: 'identification', width: 130, title: 'SN编码' },
      { dataIndex: 'reworkMaterialLotCode', width: 130, title: '返修SN' },
      { dataIndex: 'labCode', width: 130, title: '实验代码' },
      { dataIndex: 'snMaterialCode', width: 140, title: 'SN物料编码' },
      { dataIndex: 'snMaterialName', width: 140, title: 'SN物料名称' },
      { dataIndex: 'stepName', width: 80, title: '序号', align: 'center' },
      { dataIndex: 'rsdesc', width: 130, title: '工艺步骤' },
      { dataIndex: 'processCode', width: 130, title: '当前工序编码' },
      { dataIndex: 'processName', width: 130, title: '当前工序描述' },
      { dataIndex: 'workcellCode', width: 130, title: '当前工位编码' },
      { dataIndex: 'mwdesc', width: 130, title: '当前工位描述' },
      { dataIndex: 'workingDate', width: 110, title: '加工开始时间' },
      { dataIndex: 'completedDate', width: 110, title: '加工结束时间' },
      { dataIndex: 'timeDifferenceStr', width: 160, title: '呆滞时间' },
      { dataIndex: 'timeStardand', width: 120, title: '呆滞标准' },
      { dataIndex: 'timeFlag', width: 120, title: '呆滞标记' },
      { dataIndex: 'realName', width: 90, title: '加工人员', align: 'center' },
      { dataIndex: 'qualityStatusMeaning', width: 100, title: '产品状态' },
      {
        dataIndex: 'reworkStepFlag',
        width: 90,
        title: '是否不良',
        align: 'center',
        render: (val) => {
          if (val === 'Y') {
            return '是';
          } else {
            return '否';
          }
        },
      },
      { dataIndex: 'freezeFlagMeaning', width: 100, title: '是否冻结' },
      { dataIndex: 'transformFlagMeaning', width: 100, title: '是否转型' },
      { dataIndex: 'afFlagMeaning', width: 100, title: '是否拆机' },
      { dataIndex: 'latestNcTag', width: 130, title: '最新不良代码项' },
      // {
      //   dataIndex: 'histnc', width: 130, title: '历史不良抽屉', fixed: 'right',
      // },
    ];
    return (
      <Fragment>
        <Header title="工单在制明细查询报表">
          <ExcelExport
            exportAsync
            requestUrl={`${ReportHost}/v1/${tenantId}/work-order-in-process-details-query-report/process-details-report-export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
            fileName="工单在制明细查询报表.xlsx"
          />
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <Table
            bordered
            scroll={{ x: tableScrollWidth(columns) }}
            columns={columns}
            dataSource={data}
            pagination={pagination}
            loading={fetchDataLoading}
            onChange={this.fetchData}
          />
        </Content>
        <ModalContainer ref={registerContainer} />
      </Fragment>
    );
  }
}
