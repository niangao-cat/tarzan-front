/*
 * @Description: 员工制造属性维护
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-16 18:46:59
 * @LastEditTime: 2020-07-21 17:45:52
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { Button } from 'hzero-ui';
import queryString from 'querystring';
import { openTab } from 'utils/menuTab';
import { isEmpty, isUndefined } from 'lodash';
import { Content, Header } from 'components/Page';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import {
  filterNullValueObject,
  getCurrentOrganizationId,
} from 'utils/utils';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

// @withFlexFields(flexModelCode)

@connect(({ employee, loading }) => ({
  employee,
  loading: loading.effects['employee/fetchEmployeeData'],
  saveLoading: loading.effects['employee/saveEmployee'],
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({ code: ['hpfm.employee', 'entity.employee'] })
export default class List extends Component {
  /**
   * state初始化
   * @param {object} props - 组件Props
   */
  constructor(props) {
    super(props);
    this.state = {
      // flexFieldsConfig: [],
    };
  }

  /**
   * componentDidMount 生命周期函数
   * render后请求页面数据
   */
  componentDidMount() {
    const {
      location: { state: { _back } = {} },
      employee: { pagination = {} },
    } = this.props;
    // 校验是否从详情页返回
    const page = _back === -1 ? pagination : {};
    this.fetchEnum();
    this.handleSearchEmployee(page);
    // getFlexFieldsConfig(ruleCode).then(flexFieldsConfig => {
    //   this.setState({
    //     flexFieldsConfig,
    //   });
    // });
  }

  @Bind()
  fetchEnum() {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/fetchEnum',
    });
  }

  /**
   * 查询
   * @param {Object} fields 查询参数
   */
  @Bind()
  handleSearchEmployee(fields = {}) {
    const { dispatch, tenantId } = this.props;
    const fieldValues = isUndefined(this.form)
      ? {}
      : filterNullValueObject(this.form.getFieldsValue());

    dispatch({
      type: 'employee/fetchEmployeeData',
      payload: {
        tenantId,
        page: isEmpty(fields) ? {} : fields,
        customizeUnitCode: 'HPFM.EMPLOYEE_DEFINITION.LINE.GRID',
        ...fieldValues, // 表单查询值
      },
    });
  }



  /**
   * 获取员工明细，跳转明细页面
   * @param {number} employeeId - 员工Id
   * @param {number} employeeNum - 员工编码
   */
  @Bind()
  handleEditEmployee(employeeId, employeeNum) {
    const { dispatch } = this.props;
    // 清除明细缓存
    dispatch({
      type: 'employee/updateState',
      payload: {
        positionList: [],
        userList: [],
      },
    });
    dispatch(
      routerRedux.push({
        pathname: `/hhme/hr/staff/detail/${employeeId}/${employeeNum}`,
      })
    );
  }

  /**
   * 设置form对象
   * @param {object} ref - FilterForm子组件引用
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  @Bind()
  ImportEmployeeQuality() {
    openTab({
      key: `/hhme/hr/staff/import/HME.EMPLOYEE_ASSIGN`,
      title: intl.get('hhme.view.message.import').d('人员资质关系导入'),
      search: queryString.stringify({
        action: intl.get('hhme.view.message.import').d('人员资质关系导入'),
      }),
    });
  }

  getSaveBtnDisabled() {
    const {
      employee: { list = [] },
    } = this.props;
    return !list.some(record => record._status === 'create');
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      loading,
      match,
      employee: {
        list = [],
        pagination = {},
        lov: { employeeStatus = [] },
      },
    } = this.props;

    const filterProps = {
      onSearch: this.handleSearchEmployee,
      onRef: this.handleBindRef,
    };
    const listProps = {
      pagination,
      loading,
      match,
      dataSource: list,
      onEdit: this.handleEditEmployee,
      onSearch: this.handleSearchEmployee,
      employeeStatus,
      onRef: node => {
        this.list = node;
      },
    };

    return (
      <Fragment>
        <Header title='员工制造属性维护'>
          <Button type="primary" onClick={() => this.ImportEmployeeQuality()}>
            {intl.get(`tarzan.acquisition.collection.button.create`).d('人员资质关系导入')}
          </Button>
        </Header>
        <Content>
          <div>
            <FilterForm {...filterProps} />
          </div>
          <ListTable {...listProps} />
        </Content>
      </Fragment>
    );
  }
}
