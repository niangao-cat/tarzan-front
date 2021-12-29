/**
 * 呆滞物料报表——导入
 *@date：2019/10/24
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
import { isEmpty } from 'lodash';
import notification from 'utils/notification';

import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ dullMaterialReport, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  dullMaterialReport,
  loading: {
    fetchLoading: loading.effects['dullMaterialReport/queryImportList'],
    submitLoading: loading.effects['dullMaterialReport/saveData'],
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
class Import extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [], // 选中的头数据
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // 工厂下拉框
    dispatch({
      type: 'dullMaterialReport/querySiteList',
    });
    dispatch({
      type: 'dullMaterialReport/updateState',
      payload: {
        importList: [],
        impPagination: {},
      },
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
      type: 'dullMaterialReport/queryImportList',
      payload: {
        ...filterValues,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   *  保存
   */
  @Bind()
  handleSave() {
    const { selectedRows } = this.state;
    const {
      dispatch,
      dullMaterialReport: { impPagination },
    } = this.props;
    dispatch({
      type: 'dullMaterialReport/saveData',
      payload: [...selectedRows],
    }).then(res => {
      if (res.success) {
        notification.success();
        this.setState({ selectedRowKeys: [], selectedRows: [] });
        this.handleSearch(impPagination);
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
  handleSelectRow(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows });
  }

  render() {
    const { selectedRowKeys } = this.state;
    const {
      dullMaterialReport: { importList = [], impPagination = {}, siteMap = [] },
      loading: { fetchLoading, submitLoading },
      tenantId,
    } = this.props;
    const filterProps = {
      tenantId,
      siteMap,
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
    };
    const listHeadProps = {
      selectedRowKeys,
      pagination: impPagination,
      loading: fetchLoading,
      dataSource: importList,
      onSearch: this.handleSearch,
      onSelectRow: this.handleSelectRow,
    };
    return (
      <React.Fragment>
        <Header
          title={intl.get('hwms.dullMaterialReport.view.message.importTitle').d('呆滞物料导入')}
          backPath="/hwms/dull-material-report/query"
        >
          <Button
            type="primary"
            disabled={isEmpty(selectedRowKeys)}
            loading={submitLoading}
            onClick={this.handleSave}
          >
            {intl.get('hzero.common.button.save').d('保存')}
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

export default Import;
