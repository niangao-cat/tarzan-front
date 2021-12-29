/**
 * 待报废报表
 *@date：2019/10/18
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Button } from 'hzero-ui';
import intl from 'utils/intl';
import { connect } from 'dva';
import { Content, Header } from 'components/Page';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { Bind } from 'lodash-decorators';
import { isEmpty, isUndefined } from 'lodash';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import notification from 'utils/notification';

import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ scrapReport, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  scrapReport,
  loading: {
    fetchHeadLoading: loading.effects['scrapReport/queryList'],
    submitLoading: loading.effects['scrapReport/submitApprove'],
  },
}))
@formatterCollections({
  code: ['hwms.scrapReport', 'hwms.requisitionAndReturn', 'hwms.barcodeQuery'],
})
class ScrapReport extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [], // 选中的头数据
    };
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    // 查询独立值集
    dispatch({
      type: 'scrapReport/init',
      payload: {
        tenantId,
      },
    });
    // 工厂下拉框
    dispatch({
      type: 'scrapReport/querySiteList',
    });
    // 工厂默认值
    dispatch({
      type: 'scrapReport/queryDefaultSite',
    }).then(res => {
      if (!isEmpty(res.rows)) {
        // 存在工厂默认值,查询仓库列表
        dispatch({
          type: 'scrapReport/queryWarehouseList',
          payload: {
            siteId: res.rows.siteId,
          },
        });
      }
    });
    // this.handleHeadSearch();
  }

  /**
   *  查询头列表
   * @param {object} 查询参数
   */
  @Bind()
  handleHeadSearch(fields = {}) {
    const { dispatch } = this.props;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'scrapReport/queryList',
      payload: {
        ...filterValues,
        enterDateStart: isUndefined(filterValues.enterDateStart)
          ? null
          : moment(filterValues.enterDateStart).format(DEFAULT_DATETIME_FORMAT),
        enterDateEnd: isUndefined(filterValues.enterDateEnd)
          ? null
          : moment(filterValues.enterDateEnd).format(DEFAULT_DATETIME_FORMAT),
        creationDateStart: isUndefined(filterValues.creationDateStart)
          ? null
          : moment(filterValues.creationDateStart).format(DEFAULT_DATETIME_FORMAT),
        creationDateEnd: isUndefined(filterValues.creationDateEnd)
          ? null
          : moment(filterValues.creationDateEnd).format(DEFAULT_DATETIME_FORMAT),
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
      scrapReport: { headPagination },
    } = this.props;
    dispatch({
      type: 'scrapReport/submitApprove',
      payload: {
        siteId: this.form.getFieldValue('siteId'),
        materialAndLotList: selectedRows,
      },
    }).then(res => {
      if (res.success) {
        notification.success();
        this.setState({ selectedRowKeys: [], selectedRows: [] });
        this.handleHeadSearch(headPagination);
      } else {
        notification.error({ message: res.message });
      }
    });
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
   * 头数据选择操作
   */
  @Bind()
  handleSelectHeadRow(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows });
  }

  render() {
    const { selectedRowKeys } = this.state;
    const {
      scrapReport: {
        headList = [],
        headPagination = {},
        statusMap = [],
        siteMap = [],
        applyMap = [],
        warehouseMap = [],
        defaultSite = {},
      },
      loading: { fetchHeadLoading, submitLoading },
      tenantId,
      dispatch,
    } = this.props;
    const filterProps = {
      tenantId,
      statusMap,
      siteMap,
      applyMap,
      warehouseMap,
      dispatch,
      defaultSite,
      onSearch: this.handleHeadSearch,
      onRef: this.handleBindRef,
    };
    const listHeadProps = {
      selectedRowKeys,
      pagination: headPagination,
      loading: fetchHeadLoading,
      dataSource: headList,
      onSearch: this.handleHeadSearch,
      onSelectRow: this.handleSelectHeadRow,
    };
    return (
      <React.Fragment>
        <Header title={intl.get('hwms.scrapReport.view.message.title').d('待报废报表')}>
          <Button
            type="primary"
            disabled={isEmpty(selectedRowKeys)}
            loading={submitLoading}
            onClick={this.handleSubmit}
          >
            {intl.get('hwms.scrapReport.view.button.submit').d('提交审批')}
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...listHeadProps} />
        </Content>
      </React.Fragment>
    );
  }
}

export default ScrapReport;
