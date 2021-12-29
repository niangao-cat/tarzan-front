/*
 * @Description: 工位加工异常查询
 * @version: 0.1.0
 * @Author: junfeng.chen@hand-china.com
 * @Date: 2021-01-13 09:01:34
 */

import React, { Component } from 'react';
import intl from 'utils/intl';
import { connect } from 'dva';
import { Content, Header } from 'components/Page';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { Bind } from 'lodash-decorators';
import { isEmpty, isUndefined } from 'lodash';
import moment from 'moment';
import ExcelExport from '@/components/ExcelExport';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import FilterForm from './FilterForm';
import ListTable from './ListTable';




@connect(({ cosWorkcellException, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  cosWorkcellException,
  loading: {
    fetchListLoading: loading.effects['cosWorkcellException/queryList'],
  },
}))
@formatterCollections({ code: 'hhme.cosWorkcellException' })
class CosWorkcellException extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      // selectedLineRowKeys: [],
      // eslint-disable-next-line react/no-unused-state
      // selectedLineRows: [], // 选中的行数据
    };
  }

  componentDidMount() {
    const {
      dispatch,
      tenantId,
      // cosWorkcellException: { Pagination = {} },
    } = this.props;
    // 查询独立值集
    dispatch({
      type: 'cosWorkcellException/init',
      payload: {
        tenantId,
      },
    });
    // this.handleHeadSearch(Pagination);
    dispatch({
      type: 'cosWorkcellException/updateState',
      payload: {
        headAndLine: {},
      },
    });
  }

  /**
   *  查询头列表
   * @param {object} 查询参数
   */
  @Bind()
  handleHeadSearch(fields = {}) {
    const { dispatch } = this.props;
    const filterValues = this.handleGetFormValue();
    if(filterValues) {
      dispatch({
        type: 'cosWorkcellException/queryList',
        payload: {
          ...filterValues,
          page: isEmpty(fields) ? {} : fields,
        },
      });
    }
  }


  /**
   * 传递表单对象
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  // 导出
  @Bind()
  handleGetFormValue() {
    let queryParams = false;
    if(this.form) {
      this.form.validateFields((err, value) => {
        if(!err) {
          const { startDate, endDate } = value;
          queryParams = filterNullValueObject({
            ...value,
            startDate: isUndefined(startDate)
              ? null
              : moment(startDate).format(DEFAULT_DATETIME_FORMAT),
            endDate: isUndefined(endDate)
              ? null
              : moment(endDate).format(DEFAULT_DATETIME_FORMAT),
          });
        }
      });
    }
    return queryParams;
  }


  render() {
    const {
      selectedRowKeys,
    } = this.state;
    const {
      cosWorkcellException: {
        List = [],
        Pagination = {},
        docTypeMap = [],
        version = [],
      },
      loading: { fetchListLoading, fetchHeadPrintLoading },
      tenantId,
    } = this.props;
    const filterProps = {
      tenantId,
      docTypeMap,
      version,
      onSearch: this.handleHeadSearch,
      onRef: this.handleBindRef,
    };
    const listProps = {
      selectedRowKeys,
      pagination: Pagination,
      loading: fetchListLoading,
      fetchHeadPrintLoading,
      dataSource: List,
      onSearch: this.handleHeadSearch,
    };
    return (
      <React.Fragment>
        <Header
          title={intl.get('hhme.cosWorkcellException.view.message.title').d('COS工位加工异常汇总信息')}
        >
          <ExcelExport
            exportAsync
            requestUrl={`/mes-report/v1/${getCurrentOrganizationId()}/hme-cos-workcell-exception/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
            fileName="COS工位加工异常汇总信息.xlsx"
          />
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable
            {...listProps}
            history={this.props.history}
          />
        </Content>
      </React.Fragment>
    );
  }
}

export default CosWorkcellException;
