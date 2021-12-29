/**
 * WorkingDist - 组织所属日历
 * @date: 2019-12-3
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Form } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
// import { isUndefined } from 'lodash';
import formatterCollections from 'utils/intl/formatterCollections';
// import notification from 'utils/notification';
// import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import FilterForm from './FilterForm';
// import styles from './index.less';
import OrganizationTable from './OrganizationTable';

/**
 * 组织所属日历
 * @extends {Component} - React.Component
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} working - 数据源
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(({ working }) => ({
  working,
}))
@formatterCollections({ code: 'tarzan.calendar.working' })
@Form.create({ fieldNameProp: null })
export default class WorkingOrganization extends React.Component {
  form;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'working/fetchCalendarOrgList',
    });
  }

  @Bind
  onRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { match } = this.props;
    const basePath = match.path.substring(0, match.path.indexOf('/calendar-organization'));
    const calendarId = match.params.id;
    const initProps = {
      calendarId,
    };
    return (
      <>
        <Header
          title={intl.get('tarzan.calendar.working.title.calendarOrganization').d('组织所属日历')}
          backPath={`${basePath}/list`}
        />
        <Content>
          <FilterForm {...initProps} />
          <OrganizationTable />
        </Content>
      </>
    );
  }
}
