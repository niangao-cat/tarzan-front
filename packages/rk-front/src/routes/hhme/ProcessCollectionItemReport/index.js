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
import Drawer from './Drawer';
import styles from './index.less';

@connect(({ processCollectionItemReport, loading }) => ({
  processCollectionItemReport,
  tenantId: getCurrentOrganizationId(),
  fetchLoading: loading.effects['processCollectionItemReport/fetchDataList'],
  exportLoading: loading.effects['processCollectionItemReport/exportExcel'],
  fetchDetailListLoading: loading.effects['processCollectionItemReport/fetchDetailList'],
}))
export default class IQCInspectionFree extends Component {
  // form;

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      jobId: null,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'processCollectionItemReport/fetchUserDefaultSite',
    });
    dispatch({
      type: 'processCollectionItemReport/init',
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
      type: 'processCollectionItemReport/updateState',
      payload: {
        dynamicColumns: [],
        dynamicDataSource: [],
      },
    });
    await dispatch({
      type: 'processCollectionItemReport/fetchDataList',
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
    const dataList = res.page.content || [];
    const proListData = dataList.length > 0 && dataList[0].proList.length;
    const columns = [];
    const dataSource = [];
    // 实验代码的动态列，
    for (let j = 0; j < proListData; j++) {
      columns.push({
        title: `${dynamicTitle[j]}`,
        width: 120,
        dataIndex: `${j}`,
        align: 'center',
      });
    }

    // console.log('columns', columns);
    // dataList.forEach(item => {
    //   item.proList.forEach(e => {
    //     columns.push({
    //       title: `${e.proName}`,
    //       width: 120,
    //       dataIndex: `${e.tagCode}`,
    //       align: 'center',
    //       proName: item.proResult,
    //     });
    //   });
    // });

    // 组件dataSource
    for (let index = 0; index < dataList.length; index++) {
      const value = {};
      for (let j = 0; j < dataList[index].proList.length; j++) {
        value[j] = dataList[index].proList[j];
      }
      // dataList[index].proList.forEach(element => {
      //   value[element.tagCode] = element.proResult;
      // });
      dataSource.push({
        ...dataList[index],
        ...value,
      });
    }
    const dynamicColumns = unionBy(columns, 'dataIndex');
    // console.log('dynamicColumns', dynamicColumns);

    dispatch({
      type: 'processCollectionItemReport/updateState',
      payload: {
        dynamicColumns,
        dynamicDataSource: dataSource,
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

  // @Bind()
  // handleGetFormValue() {
  //   const fieldsValue = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
  //   const {dispatch} = this.props;
  //   const {
  //     one = null,
  //     two = null,
  //     three = null,
  //     four = null,
  //     startTime,
  //     endTime,
  //     eoStatus,
  //     shiftDate,
  //     workOrderNumList = [],
  //     materialCodeList = [],
  //     // processCodeList = [],
  //     // workcellCodeList = [],
  //     sn = [],
  //   } = fieldsValue;
  //   dispatch({
  //     type: 'processCollectionItemReport/exportExcel',
  //     payload: {
  //       ...fieldsValue,
  //       startTime: isUndefined(startTime)
  //         ? null
  //         : moment(startTime).format(DEFAULT_DATETIME_FORMAT),
  //       endTime: isUndefined(endTime)
  //         ? null
  //         : moment(endTime).format(DEFAULT_DATETIME_FORMAT),

  //       eoStatus: isArray(eoStatus) ? eoStatus.join(',') : '',
  //       shiftDate: isUndefined(shiftDate) ? null : moment(shiftDate).startOf('day').format(DEFAULT_DATETIME_FORMAT),
  //       productMatch: `${isNull(one) ? '_' : one}${isNull(two) ? '_' : two}${isNull(three) ? '_' : three}${isNull(four) ? '_' : four}`,
  //       workOrderNum: isArray(workOrderNumList) ? workOrderNumList.join(',') : null,
  //       materialCode: isArray(materialCodeList) ? materialCodeList.join(',') : null,
  //       sn: isArray(sn) ? sn.join(',') : null,
  //     },
  //   }).then(res => {
  //     if(res){
  //       const file = new Blob(
  //         [res],
  //         { type: 'application/vnd.ms-excel' }
  //       );
  //       const fileURL = URL.createObjectURL(file);
  //       const fileName = '工序采集项报表.xlsx';
  //       const elink = document.createElement('a');
  //       elink.download = fileName;
  //       elink.style.display = 'none';
  //       elink.href = fileURL;
  //       document.body.appendChild(elink);
  //       elink.click();
  //       URL.revokeObjectURL(elink.href); // 释放URL 对象
  //       document.body.removeChild(elink);
  //     }
  //   });
  // }

  @Bind()
  handleOpenDrawer(jobId) {
    this.setState({ visible: true, jobId });
    this.handleFetchDetailList(jobId);
  }

  @Bind()
  handleCloseDrawer() {
    this.setState({ visible: false, jobId: null });
  }

  @Bind()
  handleFetchDetailList(jobId, page = {}) {
    const { dispatch } = this.props;
    dispatch({
      type: 'processCollectionItemReport/fetchDetailList',
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
      fetchDetailListLoading,
      processCollectionItemReport: {
        pagination = {},
        dynamicColumns = [],
        dynamicDataSource = [],
        qualityStatusList = [],
        eoStatusList = [],
        detailList = [],
        detailPagination = {},
        userDefaultSite = {},
        siteList = [],
      },
    } = this.props;
    const { visible, jobId } = this.state;
    const filterProps = {
      tenantId,
      qualityStatusList,
      eoStatusList,
      onRef: this.handleBindRef,
      onSearch: this.handleSearch,
      userDefaultSite,
      siteList,
    };
    const listProps = {
      loading: fetchLoading,
      dataSource: dynamicDataSource,
      dynamicColumns,
      pagination,
      onOpenDrawer: this.handleOpenDrawer,
      onSearch: this.handleSearch,
    };
    const drawerProps = {
      visible,
      jobId,
      loading: fetchDetailListLoading,
      dataSource: detailList,
      pagination: detailPagination,
      onCancel: this.handleCloseDrawer,
      onSearch: this.handleFetchDetailList,
    };
    return (
      <React.Fragment>
        <Header title="工序采集项报表">
          {/* <Button type="primary" htmlType="submit" onClick={() => this.handleGetFormValue()} loading={exportLoading}>
            导出
          </Button> */}
          <ExcelExport
            exportAsync
            exportUrl={`${ReportHost}/v1/${tenantId}/hme-process-collect/export`} // 路径
            exportAsyncUrl={`${ReportHost}/v1/${tenantId}/hme-process-collect/async-export`}
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
        <Drawer {...drawerProps} />
      </React.Fragment>
    );
  }
}
