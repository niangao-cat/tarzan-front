/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： COS芯片作业记录
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import {
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ExcelExport from '@/components/ExcelExport';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';

import ListTable from './ListTable';
import FilterForm from './FilterForm';

const commonModelPrompt = 'tarzan.hwms.cosChipOperationRecord';

@connect(({ cosChipOperationRecord, loading }) => ({
  cosChipOperationRecord,
  tenantId: getCurrentOrganizationId(),
  fetchListLoading: loading.effects['cosChipOperationRecord/queryDataList'],
}))
export default class CosChipOperationRecord extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cosChipOperationRecord/init',
    });
  }


  @Bind
  handleSearch(page = {}) {
    const { dispatch } = this.props;
    const values = this.handleGetFormValue();
    if (values) {
      dispatch({
        type: 'cosChipOperationRecord/queryDataList',
        payload: {
          ...values,
          page,
        },
      });
    }
  }

  // 导出
  @Bind()
  handleGetFormValue() {
    let queryParams = false;
    if (this.formDom) {
      this.formDom.validateFields((err, value) => {
        if (!err) {
          const { materialLotCode, hotSinkCode, workNum, labCode, wafer, creationDateFrom, creationDateTo } = value;
          queryParams = filterNullValueObject({
            ...value,
            materialLotCode: !materialLotCode ? '' : materialLotCode.toString(),
            hotSinkCode: !hotSinkCode ? '' : hotSinkCode.toString(),
            workNum: !workNum ? '' : workNum.toString(),
            labCode: !labCode ? '' : labCode.toString(),
            wafer: !wafer ? '' : wafer.toString(),
            creationDateFrom: !creationDateFrom ? '' : moment(creationDateFrom).format(DEFAULT_DATETIME_FORMAT),
            creationDateTo: !creationDateTo ? '' : moment(creationDateTo).format(DEFAULT_DATETIME_FORMAT),
          });
        }
      });
    }
    return queryParams;
  }


  // 渲染 界面布局
  render() {
    // 获取默认数据
    const {
      tenantId,
      fetchListLoading,
      cosChipOperationRecord: {
        headList = [],
        headPagination = {},
        loadJobTypeMap = [],
        statusMap = [],
        cosTypeMap = [],
      },
    } = this.props;
    const filterProps = {
      loadJobTypeMap,
      statusMap,
      cosTypeMap,
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
    };
    return (
      <div>
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('COS芯片作业记录')}>
          <ExcelExport
            exportAsync
            requestUrl={`/mes-report/v1/${getCurrentOrganizationId()}/hme-load-jobs/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
            fileName="COS芯片作业记录.xlsx"
          />
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...listTableProps} />
          <ModalContainer ref={registerContainer} />
        </Content>
      </div>
    );
  }
}
