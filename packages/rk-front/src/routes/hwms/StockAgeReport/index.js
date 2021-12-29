/*
 * @Description: 库龄报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-11-18 09:40:08
 * @LastEditTime: 2020-11-19 20:47:10
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Button, Table, Tooltip, Icon } from 'hzero-ui';
import { Header, Content } from 'components/Page';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import moment from 'moment';
import ExcelExport from 'components/ExcelExport';
import { isEmpty, isUndefined } from 'lodash';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import FilterForm from './FilterForm';

@connect(({ stockAgeReport, loading }) => ({
  stockAgeReport,
  tenantId: getCurrentOrganizationId(),
  fetchStackAgeReportDataLoading: loading.effects['stockAgeReport/fetchStackAgeReportData'],
}))
export default class StockAgeReport extends Component {

  componentDidMount() {
    // 获取默认站点
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'stockAgeReport/getSiteList',
      payload: {
        tenantId,
      },
    });
  }

  @Bind
  fetchStackAgeReportData(fields = {}) {
    const { dispatch } = this.props;
    const fieldsValue = (this.formDom && filterNullValueObject(this.formDom.getFieldsValue())) || {};
    dispatch({
      type: 'stockAgeReport/fetchStackAgeReportData',
      payload: {
        ...fieldsValue,
        beyondDateFrom: isUndefined(fieldsValue.beyondDateFrom)
          ? null
          : moment(fieldsValue.beyondDateFrom).format(DEFAULT_DATE_FORMAT),
        beyondDateTo: isUndefined(fieldsValue.beyondDateTo)
          ? null
          : moment(fieldsValue.beyondDateTo).format(DEFAULT_DATE_FORMAT),
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  // 跳转库龄查询
  @Bind
  handleStockAgeQuery() {
    const { history } = this.props;
    history.push(`/hwms/stock-age-report/stock/agequery`);
  }

  @Bind()
  handleGetFormValue() {
    const fieldsValue = (this.formDom && filterNullValueObject(this.formDom.getFieldsValue())) || {};

    return filterNullValueObject({
      ...fieldsValue,
      beyondDateFrom: isUndefined(fieldsValue.beyondDateFrom)
        ? null
        : moment(fieldsValue.beyondDateFrom).format(DEFAULT_DATE_FORMAT),
      beyondDateTo: isUndefined(fieldsValue.beyondDateTo)
        ? null
        : moment(fieldsValue.beyondDateTo).format(DEFAULT_DATE_FORMAT),
    });
  }

  // 渲染 界面布局
  render() {
    const {
      fetchStackAgeReportDataLoading,
      tenantId,
      stockAgeReport: { reportData = [], reportDataPagination = {}, defaultSite = {} },
    } = this.props;
    const filterFormProps = {
      defaultSite,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.fetchStackAgeReportData,
    };
    const columns = [
      {
        title: '实物条码',
        dataIndex: 'materialLotCode',
        align: 'left',
        width: 150,
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        align: 'left',
        width: 115,
      },
      {
        title: '物料版本',
        dataIndex: 'materialVersion',
        align: 'left',
        width: 90,
      },
      {
        title: '物料描述',
        dataIndex: 'materialName',
        align: 'left',
        width: 120,
      },
      {
        title: '批次',
        dataIndex: 'lot',
        align: 'left',
        width: 90,
      },
      {
        title: '数量',
        dataIndex: 'primaryUomQty',
        align: 'center',
        width: 70,
      },
      {
        title: '单位',
        dataIndex: 'uomCode',
        align: 'center',
        width: 70,
      },
      {
        title: '生产日期',
        dataIndex: 'productDate',
        align: 'left',
        width: 150,
      },
      {
        title: '创建时间',
        dataIndex: 'creationDate',
        align: 'left',
        width: 150,
      },
      {
        title: '入库时间',
        dataIndex: 'inLocatorTime',
        align: 'left',
        width: 150,
      },
      {
        title: '接收时间',
        dataIndex: 'receiptDate',
        align: 'left',
        width: 150,
      },
      {
        title: (
          <>
            库龄
            <Tooltip
              title='库龄=当前时间-入库时间/生产日期/接收时间/创建时间'
            >
              <Icon type="question-circle-o" style={{ marginLeft: '5px' }} />
            </Tooltip>
          </>
        ),
        dataIndex: 'libraryAge',
        align: 'center',
        width: 80,
      },
      {
        title: (
          <>
            超期日期
            <Tooltip
              title='超期日期=入库时间/生产日期/接收时间/创建时间+保质期'
            >
              <Icon type="question-circle-o" style={{ marginLeft: '5px' }} />
            </Tooltip>
          </>
        ),
        dataIndex: 'beyondDate',
        align: 'left',
        width: 100,
      },
      {
        title: (
          <>
            超期天数
            <Tooltip
              title='超期天数=当前日期-超期日期'
            >
              <Icon type="question-circle-o" style={{ marginLeft: '5px' }} />
            </Tooltip>
          </>
        ),
        dataIndex: 'beyondDay',
        align: 'center',
        width: 100,
      },
      {
        title: '条码状态',
        dataIndex: 'statusMeaning',
        align: 'center',
        width: 90,
      },
      {
        title: '质量状态',
        dataIndex: 'qualityStatusMeaning',
        align: 'center',
        width: 90,
      },
      {
        title: '仓库',
        dataIndex: 'parentLocatorCode',
        align: 'center',
        width: 80,
      },
      {
        title: '货位',
        dataIndex: 'locatorCode',
        align: 'center',
        width: 80,
      },
      {
        title: '容器条码',
        dataIndex: 'containerCode',
        align: 'left',
        width: 120,
      },
    ];
    return (
      <React.Fragment>
        <Header title='库龄报表'>
          <Button
            type="primary"
            onClick={() => this.handleStockAgeQuery()}
          >
            库龄查询
          </Button>
          <ExcelExport
            exportAsync
            requestUrl={`/mes/v1/${tenantId}/wms-library-age-report/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue()}
          />
          <div style={{ color: 'red', fontWeight: 'bold' }}>
            * 注释：库龄报表导出功能最多不能超过10000条
          </div>
        </Header>
        <Content>
          <FilterForm {...filterFormProps} />
          <Table
            bordered
            dataSource={reportData}
            columns={columns}
            loading={fetchStackAgeReportDataLoading}
            pagination={reportDataPagination}
            onChange={page => this.fetchStackAgeReportData(page)}
          />
        </Content>
      </React.Fragment>
    );
  }
}
