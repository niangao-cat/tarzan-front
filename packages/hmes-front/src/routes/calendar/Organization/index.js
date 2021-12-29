/**
 * WorkingDist - 组织所属日历
 * @date: 2019-12-23
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Form, Table, Badge } from 'hzero-ui';
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

const modelPrompt = 'tarzan.calendar.organization.model.organization';

/**
 * 组织所属日历
 * @extends {Component} - React.Component
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} organization - 数据源
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(({ organization }) => ({
  organization,
}))
@formatterCollections({ code: 'tarzan.calendar.organization' })
@Form.create({ fieldNameProp: null })
export default class WorkingOrganization extends React.Component {
  queryForm;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'organization/fetchCalendarOrgList',
    });
  }

  @Bind
  onRef(ref = {}) {
    this.queryForm = ref;
  }

  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagination = {}) {
    this.queryForm.fetchQueryList(pagination);
  }

  openCalendarDetail = record => {
    const { history } = this.props;
    history.push(`/hmes/calendar/working/calendar-shift/${record.calendarId}`);
  };

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      match,
      organization: { calendarOrgList = [], calendarOrgPagination = {} },
      fetchLoading,
    } = this.props;
    const calendarId = match.params.id;
    const initProps = {
      calendarId,
      onRef: this.onRef,
    };
    const columns = [
      {
        title: intl.get(`${modelPrompt}.organizationCode`).d('组织编码'),
        dataIndex: 'organizationCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.organizationTypeDesc`).d('组织类型'),
        dataIndex: 'organizationTypeDesc',
        width: 160,
      },
      {
        title: intl.get(`${modelPrompt}.organizationDesc`).d('组织描述'),
        dataIndex: 'organizationDesc',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.calendarCode`).d('所属日历'),
        dataIndex: 'calendarCode',
        width: 100,
        render: (val, record) => <a onClick={() => this.openCalendarDetail(record)}>{val}</a>,
      },
      {
        title: intl.get(`${modelPrompt}.calendarTypeDesc`).d('日历类型'),
        dataIndex: 'calendarTypeDesc',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 100,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.enableFlag === 'Y' ? 'success' : 'error'}
            text={
              record.enableFlag === 'Y'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },
    ];
    return (
      <>
        <Header
          title={intl
            .get('tarzan.calendar.organization.title.calendarOrganization')
            .d('组织所属日历')}
        />
        <Content>
          <FilterForm {...initProps} />
          <Table
            loading={fetchLoading}
            rowKey="calendarShiftId"
            dataSource={calendarOrgList}
            columns={columns}
            pagination={calendarOrgPagination || {}}
            onChange={this.handleTableChange}
            bordered
          />
        </Content>
      </>
    );
  }
}
