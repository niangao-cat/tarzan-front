/**
 * WorkingDist - 班次列表
 * @date: 2019-12-3
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Button, Form } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { isUndefined } from 'lodash';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import FilterForm from './FilterForm';
import ShiftTable from './ShiftTable';
import ShiftDrawer from './ShifitDrawer';

/**
 * 班次列表
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
export default class ShiftList extends React.Component {
  form;

  state = {
    shiftDrawerVisible: false,
    initData: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'working/fetchCalendarShiftList',
    });
    dispatch({
      type: 'working/fetchCapacityUnitList',
      payload: {
        module: 'CALENDAR',
        typeGroup: 'CAPACITY_UNIT',
      },
    });
    dispatch({
      type: 'working/fetchWeekList',
      payload: {
        module: 'CALENDAR',
        typeGroup: 'CALENDAR_WEEK',
      },
    });
  }

  onSearch() {
    const {
      dispatch,
      calendarId,
      working: { calendarShiftPagination = {} },
    } = this.props;
    dispatch({
      type: 'working/fetchCalendarShiftList',
      payload: {
        calendarId,
        page: {
          ...calendarShiftPagination,
        },
      },
    });
  }

  @Bind
  onRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  @Bind
  handleSaveAll() {
    const {
      dispatch,
      match,
      history,
      working: { displayList = {}, attrList = [], planList = {}, produceList = {} },
    } = this.props;
    const calendarId = match.params.id === 'create' ? undefined : match.params.id;
    let formValue = this.form.getFieldsValue();
    const basicTabValue = isUndefined(this.basicTab) ? {} : this.basicTab.getFieldsValue();
    const planTabValue = isUndefined(this.planTab) ? {} : this.planTab.getFieldsValue();
    const produceTabValue = isUndefined(this.produceTab) ? {} : this.produceTab.getFieldsValue();
    let planStartTime;
    if (planTabValue.planStartTime) {
      planStartTime = planTabValue.planStartTime.format(DEFAULT_DATETIME_FORMAT);
    }
    let flag = true;
    this.form.validateFields((err, fieldsValue) => {
      if (!err) {
        formValue = fieldsValue;
      } else {
        flag = false;
      }
    });
    if (flag) {
      dispatch({
        type: 'working/saveSite',
        payload: {
          working: {
            ...displayList,
            ...basicTabValue,
            ...formValue,
            enableFlag: formValue.enableFlag ? 'Y' : 'N',
            calendarId,
          },
          siteSchedule: { ...planList, ...planTabValue, planStartTime },
          siteManufacturing: { ...produceList, ...produceTabValue, calendarId },
          siteAttrs: attrList || [],
        },
      }).then(res => {
        if (res && res.success) {
          notification.success();
          history.push(`/hmes/calendaranization-modeling/working/dist/${res.rows}`);
          dispatch({
            type: 'working/fetchSiteLineList',
            payload: {
              calendarId: res.rows,
            },
          });
        } else {
          notification.error({ message: res.message });
        }
      });
    }
  }

  // 删除班次信息
  @Bind
  deleteShift() {
    const {
      dispatch,
      working: { calendarShiftIdList = [] },
    } = this.props;
    dispatch({
      type: 'working/deleteShift',
      payload: calendarShiftIdList,
    }).then(res => {
      if (res && res.success) {
        this.onSearch();
        notification.success();
      } else {
        notification.error({
          message: res.message,
        });
      }
    });
  }

  @Bind
  showShiftDrawer(record) {
    this.setState({
      shiftDrawerVisible: true,
      initData: record,
    });
  }

  @Bind
  onShiftDrawerCancel() {
    this.setState({
      shiftDrawerVisible: false,
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { match } = this.props;
    const basePath = match.path.substring(0, match.path.indexOf('/shift-list'));
    const calendarId = match.params.id;
    const { shiftDrawerVisible, initData } = this.state;
    const shiftDrawerProps = {
      visible: shiftDrawerVisible,
      onCancel: this.onShiftDrawerCancel,
      onOk: this.onShiftDrawerCancel,
      initData,
      calendarId,
    };
    const initProps = {
      calendarId,
    };
    return (
      <>
        <Header
          title={intl.get('tarzan.calendar.working.title.shiftList').d('班次列表')}
          backPath={`${basePath}/list`}
        >
          <Button type="primary" onClick={this.showShiftDrawer}>
            {intl.get('tarzan.calendar.working.button.create').d('新建')}
          </Button>
          <Button
            onClick={() => {
              this.deleteShift();
            }}
          >
            {intl.get('tarzan.calendar.working.button.delete').d('删除')}
          </Button>
        </Header>
        <Content>
          <FilterForm {...initProps} />
          <ShiftTable showShiftDrawer={this.showShiftDrawer} />
          {shiftDrawerVisible && <ShiftDrawer {...shiftDrawerProps} />}
        </Content>
      </>
    );
  }
}
