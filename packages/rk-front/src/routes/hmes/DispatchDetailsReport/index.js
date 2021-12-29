/*
 * @Description: 派工明细报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-12-15 10:22:16
 * @LastEditTime: 2021-01-13 17:32:30
 */

import React, { Component } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { DEFAULT_DATETIME_FORMAT, DEFAULT_DATE_FORMAT } from 'utils/constants';
import { isEmpty, isUndefined } from 'lodash';
import { Button } from 'hzero-ui';
import moment from 'moment';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ dispatchDetailsReport, loading }) => ({
  dispatchDetailsReport,
  tenantId: getCurrentOrganizationId(),
  fetchLoading: loading.effects['dispatchDetailsReport/handleSearch'],
  handleExportLoading: loading.effects['dispatchDetailsReport/handleExport'],
}))
export default class DispatchDetailsReport extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'dispatchDetailsReport/getSiteList',
      payload: {
        tenantId,
      },
    });
  }

  /**
   *  查询列表
   * @param {object} 查询参数
   */
  @Bind()
  handleSearch(fields = {}) {
    const {
      dispatch,
      dispatchDetailsReport: { defaultSite = {} },
    } = this.props;
    const fieldsValue = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'dispatchDetailsReport/handleSearch',
      payload: {
        ...fieldsValue,
        prodLineIdList: fieldsValue.prodLineIdList && fieldsValue.prodLineIdList.split(','),
        lineWorkcellIdList: fieldsValue.lineWorkcellIdList && fieldsValue.lineWorkcellIdList.split(','),
        shiftDate: isUndefined(fieldsValue.shiftDate)
          ? null
          : moment(fieldsValue.shiftDate).format(DEFAULT_DATE_FORMAT),
        startDate: isUndefined(fieldsValue.startDate)
          ? null
          : moment(fieldsValue.startDate).format(DEFAULT_DATETIME_FORMAT),
        endDate: isUndefined(fieldsValue.endDate)
          ? null
          : moment(fieldsValue.endDate).format(DEFAULT_DATETIME_FORMAT),
        startWocellDate: isUndefined(fieldsValue.startWocellDate)
          ? null
          : moment(fieldsValue.startWocellDate).format(DEFAULT_DATETIME_FORMAT),
        endWocellDate: isUndefined(fieldsValue.endWocellDate)
          ? null
          : moment(fieldsValue.endWocellDate).format(DEFAULT_DATETIME_FORMAT),
        siteId: defaultSite.siteId,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  @Bind
  handleExport() {
    const {
      dispatch,
      tenantId,
      dispatchDetailsReport: { defaultSite = {} },
    } = this.props;
    const fieldsValue = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'dispatchDetailsReport/handleExport',
      payload: {
        ...fieldsValue,
        tenantId,
        siteId: defaultSite.siteId,
        prodLineIdList: fieldsValue.prodLineIdList && fieldsValue.prodLineIdList.split(','),
        lineWorkcellIdList: fieldsValue.lineWorkcellIdList && fieldsValue.lineWorkcellIdList.split(','),
        shiftDate: isUndefined(fieldsValue.shiftDate)
          ? null
          : moment(fieldsValue.shiftDate).format(DEFAULT_DATE_FORMAT),
        startDate: isUndefined(fieldsValue.startDate)
          ? null
          : moment(fieldsValue.startDate).format(DEFAULT_DATETIME_FORMAT),
        endDate: isUndefined(fieldsValue.endDate)
          ? null
          : moment(fieldsValue.endDate).format(DEFAULT_DATETIME_FORMAT),
        startWocellDate: isUndefined(fieldsValue.startWocellDate)
          ? null
          : moment(fieldsValue.startWocellDate).format(DEFAULT_DATETIME_FORMAT),
        endWocellDate: isUndefined(fieldsValue.endWocellDate)
          ? null
          : moment(fieldsValue.endWocellDate).format(DEFAULT_DATETIME_FORMAT),
      },
    }).then(res => {
      if (res) {
        const file = new Blob([res], { type: 'application/vnd.ms-excel' });
        const fileURL = URL.createObjectURL(file);
        const fileName = '派工明细报表.xls';
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

  /**
   *  渲染页面
   * @returns {*}
   */
  render() {
    const {
      fetchLoading,
      dispatchDetailsReport,
      tenantId,
      handleExportLoading,
    } = this.props;
    const { pagination = {}, list = [], defaultSite = {} } = dispatchDetailsReport;
    const filterProps = {
      tenantId,
      siteId: defaultSite.siteId,
      onRef: this.handleBindRef,
      onSearch: this.handleSearch,
    };
    const listProps = {
      loading: fetchLoading,
      dataSource: list,
      onSearch: this.handleSearch,
      pagination,
    };
    return (
      <React.Fragment>
        <Header title="派工明细报表">
          <Button
            type="primary"
            icon="export"
            onClick={() => this.handleExport()}
            loading={handleExportLoading}
          >
            导出
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...listProps} />
        </Content>
      </React.Fragment>
    );
  }
}
