/**
 * 呆滞物料报表
 *@date：2019/10/24
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Button } from 'hzero-ui';
import intl from 'utils/intl';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Content, Header } from 'components/Page';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { Bind } from 'lodash-decorators';
import { isEmpty, isUndefined } from 'lodash';
import moment from 'moment';
import ExcelExport from 'components/ExcelExport';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import notification from 'utils/notification';

import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ dullMaterialReport, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  dullMaterialReport,
  loading: {
    fetchLoading: loading.effects['dullMaterialReport/queryList'],
    submitLoading: loading.effects['dullMaterialReport/submitApprove'],
  },
}))
@formatterCollections({
  code: [
    'hwms.scrapReport',
    'hwms.requisitionAndReturn',
    'hwms.barcodeQuery',
    'dullMaterialReport',
  ],
})
class DullMaterialReport extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [], // 选中的头数据
    };
  }

  componentDidMount() {
    const {
      dispatch,
      tenantId,
      // location: { state: { _back } = {} },
      // dullMaterialReport: {pagination},
    } = this.props;
    // 查询独立值集
    dispatch({
      type: 'dullMaterialReport/init',
      payload: {
        tenantId,
      },
    });
    // 工厂下拉框
    dispatch({
      type: 'dullMaterialReport/querySiteList',
    });
    // this.handleSearch();
  }

  /**
   *  查询列表
   * @param {object} 查询参数
   */
  @Bind()
  handleSearch(fields = {}) {
    const { dispatch } = this.props;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'dullMaterialReport/queryList',
      payload: {
        ...filterValues,
        dullDateStart: isUndefined(filterValues.dullDateStart)
          ? null
          : moment(filterValues.dullDateStart).format(DEFAULT_DATETIME_FORMAT),
        dullDateEnd: isUndefined(filterValues.dullDateEnd)
          ? null
          : moment(filterValues.dullDateEnd).format(DEFAULT_DATETIME_FORMAT),
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   *  提交审批
   */
  @Bind()
  handleSubmit() {
    const { selectedRows } = this.state;
    const {
      dispatch,
      dullMaterialReport: { pagination },
    } = this.props;
    dispatch({
      type: 'dullMaterialReport/submitApprove',
      payload: {
        siteId: this.form.getFieldValue('siteId'),
        materialAndLotList: selectedRows,
      },
    }).then(res => {
      if (res.success) {
        notification.success();
        this.setState({ selectedRowKeys: [], selectedRows: [] });
        this.handleSearch(pagination);
      } else {
        notification.error({ message: res.message });
      }
    });
  }

  /**
   * 跳转到导入页面
   */
  @Bind()
  handleImport() {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/hwms/dull-material-report/import`,
      })
    );
  }

  /**
   * 传递表单对象
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   * 数据选择操作
   */
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows });
  }

  // 导出;
  @Bind()
  handleGetFormValue() {
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    return filterNullValueObject({
      ...filterValues,
      dullDateStart: isUndefined(filterValues.dullDateStart)
        ? null
        : moment(filterValues.dullDateStart).format(DEFAULT_DATETIME_FORMAT),
      dullDateEnd: isUndefined(filterValues.dullDateEnd)
        ? null
        : moment(filterValues.dullDateEnd).format(DEFAULT_DATETIME_FORMAT),
    });
  }

  render() {
    const { selectedRowKeys } = this.state;
    const {
      dullMaterialReport: {
        dataList = [],
        pagination = {},
        siteMap = [],
        dullTypeMap = [],
        qualityStatusMap = [],
      },
      loading: { fetchLoading, submitLoading },
      tenantId,
    } = this.props;
    const filterProps = {
      tenantId,
      siteMap,
      dullTypeMap,
      qualityStatusMap,
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
    };
    const listHeadProps = {
      selectedRowKeys,
      pagination,
      loading: fetchLoading,
      dataSource: dataList,
      onSearch: this.handleSearch,
      onSelectRow: this.handleSelectRow,
    };
    return (
      <React.Fragment>
        <Header title={intl.get('hwms.dullMaterialReport.view.message.title').d('呆滞物料报表')}>
          <Button type="primary" icon="to-top" onClick={this.handleImport}>
            {intl.get('hzero.common.view.button.import').d('导入')}
          </Button>
          <Button disabled loading={submitLoading} onClick={this.handleSubmit}>
            {intl.get('hwms.scrapReport.view.button.submit').d('提交审批')}
          </Button>
          <ExcelExport
            requestUrl={`/mes/v1/${getCurrentOrganizationId()}/dull-material/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue()}
          />
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...listHeadProps} />
        </Content>
      </React.Fragment>
    );
  }
}

export default DullMaterialReport;
