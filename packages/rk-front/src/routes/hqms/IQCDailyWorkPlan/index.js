import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty, isUndefined } from 'lodash';
import { Table, Card, Spin } from 'hzero-ui';
import moment from 'moment';

import { filterNullValueObject, tableScrollWidth, getCurrentOrganizationId } from 'utils/utils';
import {
  DEFAULT_DATETIME_FORMAT,
  DETAIL_CARD_TABLE_CLASSNAME,
} from 'utils/constants';
import ExcelExport from 'components/ExcelExport';
import { ReportHost } from '@/utils/config';

import FilterForm from './FilterForm';
import ChartsData from './ChartsData';


@connect(({ iqcDailyWorkPlan, loading }) => ({
  iqcDailyWorkPlan,
  tenantId: getCurrentOrganizationId(),
  handleSearchLoading: loading.effects['iqcDailyWorkPlan/handleSearch'],
  handleSearchChartsDataLoading: loading.effects['iqcDailyWorkPlan/handleSearchChartsData'],
}))
export default class IQCDailyWorkPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type: 'iqcDailyWorkPlan/fetchDefaultSite',
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
    const materialIdList = fieldsValue.materialIdList && fieldsValue.materialIdList.split(",").map(String);
    const supplierIdList = fieldsValue.supplierIdList && fieldsValue.supplierIdList.split(",").map(String);
    const inspectorIdList = fieldsValue.inspectorIdList && fieldsValue.inspectorIdList.split(",").map(String);
    dispatch({
      type: 'iqcDailyWorkPlan/handleSearch',
      payload: {
        ...fieldsValue,
        materialIdList,
        supplierIdList,
        inspectorIdList,
        inspectionDateFrom: isUndefined(fieldsValue.inspectionDateFrom)
          ? null
          : moment(fieldsValue.inspectionDateFrom).format(DEFAULT_DATETIME_FORMAT),
        inspectionDateTo: isUndefined(fieldsValue.inspectionDateTo)
          ? null
          : moment(fieldsValue.inspectionDateTo).format(DEFAULT_DATETIME_FORMAT),
        page: isEmpty(fields) ? {} : fields,
      },
    });
    dispatch({
      type: 'iqcDailyWorkPlan/handleSearchChartsData',
      payload: {
        ...fieldsValue,
        materialIdList,
        supplierIdList,
        inspectorIdList,
        inspectionDateFrom: isUndefined(fieldsValue.inspectionDateFrom)
          ? null
          : moment(fieldsValue.inspectionDateFrom).format(DEFAULT_DATETIME_FORMAT),
        inspectionDateTo: isUndefined(fieldsValue.inspectionDateTo)
          ? null
          : moment(fieldsValue.inspectionDateTo).format(DEFAULT_DATETIME_FORMAT),
      },
    });
  }

  @Bind()
  handleGetFormValue() {
    const fieldsValue = (this.filterForm && filterNullValueObject(this.filterForm.getFieldsValue())) || {};
    const materialIdList = fieldsValue.materialIdList && fieldsValue.materialIdList.split(",").map(String);
    const supplierIdList = fieldsValue.supplierIdList && fieldsValue.supplierIdList.split(",").map(String);
    const inspectorIdList = fieldsValue.inspectorIdList && fieldsValue.inspectorIdList.split(",").map(String);
    return filterNullValueObject({
      ...fieldsValue,
      materialIdList,
      supplierIdList,
      inspectorIdList,
      inspectionDateFrom: isUndefined(fieldsValue.inspectionDateFrom)
        ? null
        : moment(fieldsValue.inspectionDateFrom).format(DEFAULT_DATETIME_FORMAT),
      inspectionDateTo: isUndefined(fieldsValue.inspectionDateTo)
        ? null
        : moment(fieldsValue.inspectionDateTo).format(DEFAULT_DATETIME_FORMAT),
    });
  }

  render() {
    const {
      tenantId,
      iqcDailyWorkPlan: {
        list = [],
        pagination = {},
        xAxisData = [],
        okData = [],
        ngData = [],
        defaultSite = {},
      },
      handleSearchLoading,
      handleSearchChartsDataLoading,
    } = this.props;
    // 查询
    const filterFormProps = {
      onSearch: this.handleSearch,
      siteId: defaultSite.siteId,
    };
    const columns = [
      {
        title: '检验员',
        dataIndex: 'inspectorName',
        width: 120,
      },
      {
        title: '供应商',
        dataIndex: 'supplierName',
        width: 120,
      },
      {
        title: '物料',
        dataIndex: 'materialName',
        width: 120,
      },
      {
        title: '检验批次',
        dataIndex: 'totalNum',
        width: 120,
      },
      {
        title: '合格批次',
        dataIndex: 'okNum',
        width: 120,
      },
      {
        title: '不合格批次',
        dataIndex: 'ngNum',
        width: 120,
      },
      {
        title: '合格率',
        dataIndex: 'okRate',
        width: 120,
        render: val => {
          return <span>{val}%</span>;
        },
      },
      {
        title: '不合格率',
        dataIndex: 'ngRate',
        width: 120,
        render: val => {
          return <span>{val}%</span>;
        },
      },
    ];
    return (
      <Fragment>
        <Header title="IQC日常工作计划报表">
          <ExcelExport
            exportAsync
            requestUrl={`${ReportHost}/v1/${tenantId}/iqc-inspection-kanban/kanban-export`} // 路径
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
          <Card
            key="code-rule-header"
            title='图表'
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
            size="small"
          >
            <Spin spinning={handleSearchChartsDataLoading || false}>
              <ChartsData
                xAxisData={xAxisData}
                okData={okData}
                ngData={ngData}
              />
            </Spin>
          </Card>
        </Content>
      </Fragment>
    );
  }
}
