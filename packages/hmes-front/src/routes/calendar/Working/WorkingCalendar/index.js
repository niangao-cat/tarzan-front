/**
 * WorkingDist - 日历班次
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
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import DisplayForm from './DisplayForm';
import CalendarShift from './CalendarShift';
import CopyModal from './CopyModal';
import OrganizationDrawer from '../WorkingCalendar/OrganizationDrawer';
import InitDrawer from '../WorkingCalendar/InitDrawer';

/**
 * 日历班次
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
export default class WorkingDist extends React.Component {
  form;

  state = {
    buttonFlag: true,
    editFlag: true,
    copyModalVisible: false,
    organizationDrawerVisible: false,
    initDrawerVisible: false,
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    const calendarId = match.params.id;
    if (calendarId === 'create') {
      return;
    }
    dispatch({
      type: 'working/fetchDetailList',
      payload: {
        calendarId,
      },
    });
    dispatch({
      type: 'working/fetchShiftList',
      payload: {
        calendarId,
      },
    });
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { match, dispatch } = this.props;
    const calendarId = match.params.id;
    if (calendarId !== nextProps.match.params.id) {
      if (calendarId === 'create') {
        return;
      }
      dispatch({
        type: 'working/fetchDetailList',
        payload: {
          calendarId: nextProps.match.params.id,
        },
      });
      dispatch({
        type: 'working/fetchShiftList',
        payload: {
          calendarId: nextProps.match.params.id,
        },
      });
    }
  }

  // 保存/编辑
  @Bind()
  toggleEdit() {
    const { match } = this.props;
    const calendarId = match.params.id;
    const { buttonFlag } = this.state;
    if (calendarId === 'create') {
      this.handleSaveWorking();
    } else {
      this.setState({ buttonFlag: !buttonFlag });
      if (buttonFlag) {
        this.handleEdit();
      } else {
        this.handleSaveWorking();
      }
    }
  }

  // 点击编辑
  @Bind
  handleEdit() {
    this.setState({
      editFlag: false,
    });
  }

  @Bind
  onRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  // 复制班次
  @Bind
  copyShift() {
    this.setState({
      copyModalVisible: true,
    });
  }

  // 复制班次弹窗关闭
  @Bind
  onCopyShiftCancel() {
    this.setState({
      copyModalVisible: false,
    });
  }

  // 分配组织
  distributionOrganization = () => {
    this.setState({
      organizationDrawerVisible: true,
    });
  };

  // 关闭分配组织
  handleDrawerCancel = () => {
    this.setState({
      organizationDrawerVisible: false,
    });
  };

  // 日历初始化
  initCalendar = () => {
    this.setState({
      initDrawerVisible: true,
    });
  };

  // 关闭日历初始化
  handleInitDrawerCancel = () => {
    this.setState({
      initDrawerVisible: false,
    });
  };

  // 保存工作日历
  handleSaveWorking = () => {
    const { dispatch, history, match } = this.props;
    const calendarId = match.params.id;
    this.form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'working/saveWorking',
          payload: {
            ...fieldsValue,
            calendarId: calendarId === 'create' ? null : calendarId,
          },
        }).then(res => {
          if (res && res.success) {
            this.setState({
              editFlag: true,
            });
            history.push(`/hmes/calendar/working/calendar-shift/${res.rows.calendarId}`);
            notification.success();
            dispatch({
              type: 'working/updateState',
              payload: {
                displayList: res.rows,
              },
            });
          } else {
            notification.error({
              message: res.message,
            });
          }
        });
      }
    });
  };

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { match } = this.props;
    const basePath = match.path.substring(0, match.path.indexOf('/calendar-shift'));
    const calendarId = match.params.id;
    const {
      editFlag,
      copyModalVisible,
      buttonFlag,
      organizationDrawerVisible,
      initDrawerVisible,
    } = this.state;
    const initProps = {
      calendarId,
      editFlag,
    };
    const copyModalProps = {
      visible: copyModalVisible,
      onCancel: this.onCopyShiftCancel,
      onOk: this.onCopyShiftCancel,
      calendarId,
    };
    const organizationDrawerProps = {
      visible: organizationDrawerVisible,
      onCancel: this.handleDrawerCancel,
      onOk: this.handleDrawerCancel,
    };
    const initDrawerProps = {
      visible: initDrawerVisible,
      onCancel: this.handleInitDrawerCancel,
      onOk: this.handleInitDrawerCancel,
      calendarId,
    };
    return (
      <>
        <Header
          title={intl.get('tarzan.calendar.working.title.calendarShift').d('日历班次')}
          backPath={`${basePath}/list`}
        >
          {calendarId === 'create' ? (
            <Button type="primary" icon="save" onClick={this.toggleEdit}>
              {intl.get('tarzan.org.workcell.button.save').d('保存')}
            </Button>
          ) : buttonFlag ? (
            <Button type="primary" icon="edit" onClick={this.toggleEdit}>
              {intl.get('tarzan.org.workcell.button.edit').d('编辑')}
            </Button>
          ) : (
            <Button type="primary" icon="save" onClick={this.toggleEdit}>
              {intl.get('tarzan.org.workcell.button.save').d('保存')}
            </Button>
          )}
          <Button
            htmlType="submit"
            onClick={this.copyShift}
            disabled={calendarId === 'create' || !editFlag}
            icon="copy"
          >
            {intl.get('tarzan.calendar.working.button.organization').d('复制班次')}
          </Button>
          <Button
            htmlType="submit"
            disabled={calendarId === 'create' || !editFlag}
            onClick={this.distributionOrganization}
          >
            {intl.get('tarzan.calendar.working.button.distributionOrganization').d('分配组织')}
          </Button>
          <Button
            htmlType="submit"
            disabled={calendarId === 'create' || !editFlag}
            onClick={this.initCalendar}
          >
            {intl.get('tarzan.calendar.working.button.init').d('日历初始化')}
          </Button>
        </Header>
        <Content>
          <DisplayForm onRef={this.onRef} {...initProps} />
          <CalendarShift {...initProps} />
          {copyModalVisible && <CopyModal {...copyModalProps} />}
          {organizationDrawerVisible && <OrganizationDrawer {...organizationDrawerProps} />}
          {initDrawerVisible && <InitDrawer {...initDrawerProps} />}
        </Content>
      </>
    );
  }
}
