/*
 * @Description: 工序采集项报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-06 17:23:00
 * @LastEditTime: 2020-08-04 08:13:41
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty, unionBy, isUndefined, isArray, isNull } from 'lodash';
import moment from 'moment';

import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { Header, Content } from 'components/Page';
import ExcelExport from '@/components/ExcelExport';
import { ReportHost } from '@/utils/config';

import FilterForm from './FilterForm';
import ListTable from './ListTable';
import styles from './index.less';

@connect(({ processCollectionItemGPReport, loading }) => ({
  processCollectionItemGPReport,
  tenantId: getCurrentOrganizationId(),
  fetchLoading: loading.effects['processCollectionItemGPReport/fetchDataList'],
  exportLoading: loading.effects['processCollectionItemGPReport/exportExcel'],
  fetchDetailListLoading: loading.effects['processCollectionItemGPReport/fetchDetailList'],
}))
export default class ProcessCollectionItemGPReport extends Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'processCollectionItemGPReport/fetchUserDefaultSite',
    });
    dispatch({
      type: 'processCollectionItemGPReport/init',
    });
  }

  // componentDidMount() {
  //   this.handleSearch();
  // }

  /**
   *  查询列表
   * @param {object} 查询参数
   */
  @Bind()
  async handleSearch(fields = {}) {
    const {
      dispatch,
    } = this.props;
    const fieldsValue = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    const {
      one = null,
      two = null,
      three = null,
      four = null,
      startTime,
      endTime,
      eoStatus,
      shiftDate,
      workOrderNumList = [],
      materialCodeList = [],
      // processCodeList = [],
      // workcellCodeList = [],
      sn = [],
    } = fieldsValue;
    await dispatch({
      type: 'processCollectionItemGPReport/updateState',
      payload: {
        dynamicColumns: [],
        dynamicDataSource: [],
      },
    });
    await dispatch({
      type: 'processCollectionItemGPReport/fetchDataList',
      payload: {
        ...fieldsValue,
        startTime: isUndefined(startTime)
          ? null
          : moment(startTime).format(DEFAULT_DATETIME_FORMAT),
        endTime: isUndefined(endTime)
          ? null
          : moment(endTime).format(DEFAULT_DATETIME_FORMAT),

        eoStatus: isArray(eoStatus) ? eoStatus.join(',') : '',
        shiftDate: isUndefined(shiftDate) ? null : moment(shiftDate).startOf('day').format(DEFAULT_DATETIME_FORMAT),
        productMatch: `${isNull(one) ? '_' : one}${isNull(two) ? '_' : two}${isNull(three) ? '_' : three}${isNull(four) ? '_' : four}`,
        workOrderNum: isArray(workOrderNumList) ? workOrderNumList.join(',') : null,
        materialCode: isArray(materialCodeList) ? materialCodeList.join(',') : null,
        sn: isArray(sn) ? sn.join(',') : null,
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(res => {
      if (res) {
        this.renderTable(res);
      }
    });
  }

  // 重构table数据
  @Bind()
  renderTable(res) {
    const { dispatch } = this.props;
    const dynamicTitle = res.dynamicTitles;
    const columns = [];
    // 实验代码的动态列，
    for (let j = 0; j < dynamicTitle.length; j++) {
      columns.push({
        title: `${dynamicTitle[j]}`,
        width: 120,
        dataIndex: `result${j + 1}`,
        align: 'center',
      });
    }
    const dynamicColumns = unionBy(columns, 'dataIndex');
    // console.log('dynamicColumns', dynamicColumns);

    dispatch({
      type: 'processCollectionItemGPReport/updateState',
      payload: {
        dynamicColumns,
      },
    });
  }

  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  @Bind()
  handleGetFormValue() {
    let queryParams = false;
    if (this.form) {
      this.form.validateFields((err, value) => {
        if (!err) {
          const {
            one = null,
            two = null,
            three = null,
            four = null,
            startTime,
            endTime,
            eoStatus,
            shiftDate,
            workOrderNumList = [],
            materialCodeList = [],
            sn = [],
          } = value;
          queryParams = filterNullValueObject({
            ...value,
            startTime: isUndefined(startTime)
              ? null
              : moment(startTime).format(DEFAULT_DATETIME_FORMAT),
            endTime: isUndefined(endTime)
              ? null
              : moment(endTime).format(DEFAULT_DATETIME_FORMAT),
            eoStatus: isArray(eoStatus) ? eoStatus.join(',') : '',
            shiftDate: isUndefined(shiftDate) ? null : moment(shiftDate).startOf('day').format(DEFAULT_DATETIME_FORMAT),
            productMatch: `${isNull(one) ? '_' : one}${isNull(two) ? '_' : two}${isNull(three) ? '_' : three}${isNull(four) ? '_' : four}`,
            workOrderNum: isArray(workOrderNumList) ? workOrderNumList.join(',') : null,
            materialCode: isArray(materialCodeList) ? materialCodeList.join(',') : null,
            sn: isArray(sn) ? sn.join(',') : null,
          });
        }
      });
    }
    return queryParams;
  }

  @Bind()
  handleFetchDetailList(jobId, page = {}) {
    const { dispatch } = this.props;
    dispatch({
      type: 'processCollectionItemGPReport/fetchDetailList',
      payload: { jobId, page },
    });
  }

  /**
   *  渲染页面
   * @returns {*}
   */
  render() {
    const {
      fetchLoading,
      tenantId,
      processCollectionItemGPReport: {
        pagination = {},
        dynamicColumns = [],
        dynamicDataSource = [],
      },
    } = this.props;
    const filterProps = {
      tenantId,
      onRef: this.handleBindRef,
      onSearch: this.handleSearch,
    };
    const listProps = {
      loading: fetchLoading,
      dataSource: dynamicDataSource,
      dynamicColumns,
      pagination,
      onOpenDrawer: this.handleOpenDrawer,
      onSearch: this.handleSearch,
    };
    return (
      <React.Fragment>
        <Header title="工序采集项报表 - GP">
          <ExcelExport
            exportAsync
            exportUrl={`${ReportHost}/v1/${tenantId}/hme-process-collect/gp/export`} // 路径
            exportAsyncUrl={`${ReportHost}/v1/${tenantId}/hme-process-collect/gp/async-export`}
            createTaskUrl={`${ReportHost}/v1/${tenantId}/hme-process-collect/create-task`}
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
            method="POST"
            fileName="工序采集项报表.xlsx"
          />
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <div className={styles['head-table']}>
            <ListTable {...listProps} />
          </div>
        </Content>
      </React.Fragment>
    );
  }
}
