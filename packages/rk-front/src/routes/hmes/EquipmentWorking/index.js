/*
 * @Description: 设备运行情况明细表
 * @Version: 0.0.1
 * @Autor: li.zhang13@hand-china.com
 * @Date: 2020-01-14 10:25:46
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Table, Button, notification } from 'hzero-ui';
import { Header, Content } from 'components/Page';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { isUndefined } from 'lodash';
import FilterForm from './FilterForm';

@connect(({ equipmentWorking, loading }) => ({
  equipmentWorking,
  tenantId: getCurrentOrganizationId(),
  fetcheEuipmentWorkingLoading: loading.effects['equipmentWorking/fetcheEuipmentWorking'],
  exportDataLoading: loading.effects['equipmentWorking/exportData'],
}))
export default class EquipmentWorking extends Component {
  componentDidMount() {}

  @Bind
  fetcheEuipmentWorking(fields = {}) {
    const { dispatch } = this.props;
    const filterValues =
      (this.formDom && filterNullValueObject(this.formDom.getFieldsValue())) || {};
    dispatch({
      type: 'equipmentWorking/fetcheEuipmentWorking',
      payload: {
        ...filterValues,
        creationDateFrom: isUndefined(filterValues.creationDateFrom)
          ? null
          : moment(filterValues.creationDateFrom).format(DEFAULT_DATETIME_FORMAT),
        creationDateTo: isUndefined(filterValues.creationDateTo)
          ? null
          : moment(filterValues.creationDateTo).format(DEFAULT_DATETIME_FORMAT),
        executionDateStart: isUndefined(filterValues.executionDateStart)
          ? null
          : moment(filterValues.executionDateStart).format(DEFAULT_DATETIME_FORMAT),
        executionDateEnd: isUndefined(filterValues.executionDateEnd)
          ? null
          : moment(filterValues.executionDateEnd).format(DEFAULT_DATETIME_FORMAT),
        page: fields,
      },
    });
  }

  // 数据导出
  @Bind()
  exportData() {
    const filterValues =
      (this.formDom && filterNullValueObject(this.formDom.getFieldsValue())) || {};

    // 判断是否输入时间 ， 没有则报错
    if(!filterValues.creationDateFrom||!filterValues.creationDateTo){
      return notification.error({message: '请输入运行时间'});
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'equipmentWorking/exportData',
      payload: {
        ...filterNullValueObject({
          ...filterValues,
          creationDateFrom: isUndefined(filterValues.creationDateFrom)
            ? null
            : moment(filterValues.creationDateFrom).format(DEFAULT_DATETIME_FORMAT),
          creationDateTo: isUndefined(filterValues.creationDateTo)
            ? null
            : moment(filterValues.creationDateTo).format(DEFAULT_DATETIME_FORMAT),
          executionDateStart: isUndefined(filterValues.executionDateStart)
            ? null
            : moment(filterValues.executionDateStart).format(DEFAULT_DATETIME_FORMAT),
          executionDateEnd: isUndefined(filterValues.executionDateEnd)
            ? null
            : moment(filterValues.executionDateEnd).format(DEFAULT_DATETIME_FORMAT),
        }),
      },
    }).then(res => {
      if (res) {
        const file = new Blob([res], { type: 'application/vnd.ms-excel' });
        const fileURL = URL.createObjectURL(file);
        const fileName = '设备运行情况报表.xls';
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = fileURL;
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      }
    });
  }

  // 渲染 界面布局
  render() {
    const {
      fetcheEuipmentWorkingLoading,
      exportDataLoading,
      tenantId,
      equipmentWorking: {
        reportData = [],
        reportDataPagination = {},
        defaultDate = [],
        colData = [],
      },
    } = this.props;
    const filterFormProps = {
      defaultDate,
      tenantId,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.fetcheEuipmentWorking,
    };
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        render: (val, record, index) => index + 1,
        fixed: 'left',
      },
      {
        title: '资产名称',
        dataIndex: 'assetName',
        width: 100,
        fixed: 'left',
      },
      {
        title: '资产编号',
        dataIndex: 'assetEncoding',
        width: 100,
        fixed: 'left',
      },
      {
        title: '型号',
        dataIndex: 'model',
        width: 80,
        fixed: 'left',
      },
      {
        title: '序列号',
        dataIndex: 'equipmentBodyNum',
        width: 80,
        fixed: 'left',
      },
      {
        title: '使用部门',
        dataIndex: 'department',
        width: 80,
        fixed: 'left',
      },
      {
        title: '车间位置',
        dataIndex: 'areaLocation',
        width: 80,
        fixed: 'left',
      },
      {
        title: '使用人',
        dataIndex: 'user',
        width: 70,
        fixed: 'left',
      },
      ...colData.map(v => {
        return {
          title: `${v}`,
          children: [
            {
              title: '计划运行时间（h）',
              dataIndex: `${v}planDate`,
              align: 'center',
              render: val => {
                return val || 24;
              },
            },
            {
              title: '实际运行时间（h）',
              dataIndex: `${v}actualDate`,
              align: 'center',
              render: val => {
                return val || 0;
              },
            },
            {
              title: '停机时间（h）',
              dataIndex: `${v}stopDate`,
              align: 'center',
              render: val => {
                return val || 24;
              },
            },
            {
              title: '开机率（%）',
              dataIndex: `${v}boot`,
              align: 'center',
              render: val => {
                return val || 0;
              },
            },
            {
              title: '利用率（%）',
              dataIndex: `${v}utilization`,
              align: 'center',
              render: val => {
                return val || 0;
              },
            },
          ],
        };
      }),
    ];

    // console.log('reportDataPagination==', reportDataPagination);
    return (
      <React.Fragment>
        <Header title="设备运行情况报表">
          <Button loading={exportDataLoading} onClick={this.exportData}>导出</Button>
        </Header>
        <Content>
          <FilterForm {...filterFormProps} />
          <Table
            bordered
            dataSource={reportData}
            columns={columns}
            loading={fetcheEuipmentWorkingLoading}
            pagination={{ ...reportDataPagination, total: reportDataPagination.total + 1 }}
            onChange={page => this.fetcheEuipmentWorking(page)}
          />
        </Content>
      </React.Fragment>
    );
  }
}
