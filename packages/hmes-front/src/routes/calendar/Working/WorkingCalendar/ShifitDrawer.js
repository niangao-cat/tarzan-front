/**
 * ShiftDrawer 班次信息抽屉
 * @date: 2019-12-5
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Modal, Card, Button, Popconfirm, Tooltip } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import {
  DEFAULT_DATETIME_FORMAT,
  DETAIL_CARD_TABLE_CLASSNAME,
  DEFAULT_TIME_FORMAT,
  DEFAULT_DATE_FORMAT,
} from 'utils/constants';
import ShiftForm from './ShiftForm';
import styles from './index.less';

@connect(({ working }) => ({
  working,
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.calendar.working',
})
export default class ShiftDrawer extends React.PureComponent {
  shiftForm;

  state = {
    buttonFlag: true,
    newButtonFlag: true,
    editFlag: true,
    activeShift: '',
  };

  componentDidMount() {
    const { dispatch, calendarId, shiftDate } = this.props;
    dispatch({
      type: 'working/fetchCalendarShiftNoPageList',
      payload: {
        calendarId,
        shiftDate: moment(shiftDate).format('YYYY-MM-DD HH:mm:ss'),
      },
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'working/updateState',
      payload: {
        shiftFormList: {},
        calendarShiftId: '',
        calendarShiftNoPageList: '',
      },
    });
  }

  onSearch() {
    const { dispatch, calendarId, shiftDate } = this.props;
    dispatch({
      type: 'working/fetchCalendarShiftNoPageList',
      payload: {
        calendarId,
        shiftDate: moment(shiftDate).format('YYYY-MM-DD HH:mm:ss'),
      },
    });
    dispatch({
      type: 'working/fetchShiftList',
      payload: {
        calendarId,
      },
    });
  }

  /**
   *
   * @param {object} ref - FilterForm子组件对象
   */
  @Bind()
  onRef(ref = {}) {
    this.shiftForm = ref;
  }

  @Bind()
  handleOK() {
    const {
      calendarId,
      dispatch,
      shiftDate,
      working: { shiftFormList = {} },
    } = this.props;
    this.shiftForm.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'working/saveShift',
          payload: {
            ...shiftFormList,
            ...fieldsValue,
            shiftStartTime: `${moment(shiftDate).format(
              DEFAULT_DATE_FORMAT
            )} ${fieldsValue.shiftStartTime.format(DEFAULT_TIME_FORMAT)}`,
            shiftEndTime: fieldsValue.shiftEndTime.format(DEFAULT_DATETIME_FORMAT),
            shiftDate: moment(shiftDate).format(DEFAULT_DATE_FORMAT),
            calendarId,
            enableFlag: 'Y',
          },
        }).then(res => {
          if (res && res.success) {
            this.onSearch();
            notification.success();
            this.setState({
              editFlag: true,
              buttonFlag: true,
            });
          } else {
            notification.error({
              message: res.message,
            });
          }
        });
      }
    });
  }

  @Bind()
  handleSaveNew() {
    const {
      calendarId,
      dispatch,
      shiftDate,
      working: { shiftFormList = {} },
    } = this.props;
    this.shiftForm.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'working/saveShift',
          payload: {
            ...shiftFormList,
            ...fieldsValue,
            shiftStartTime: `${moment(shiftDate).format(
              DEFAULT_DATE_FORMAT
            )} ${fieldsValue.shiftStartTime.format(DEFAULT_TIME_FORMAT)}`,
            shiftEndTime: fieldsValue.shiftEndTime.format(DEFAULT_DATETIME_FORMAT),
            calendarId,
            shiftDate: moment(shiftDate).format(DEFAULT_DATE_FORMAT),
            enableFlag: 'Y',
          },
        }).then(res => {
          if (res && res.success) {
            this.setState({
              activeShift: res.rows,
            });
            this.props.dispatch({
              type: 'working/updateState',
              payload: {
                shiftFormList: {
                  shiftDate: moment(shiftDate, 'YYYY-MM-DD'),
                  ...fieldsValue,
                  calendarShiftId: res.rows,
                },
              },
            });
            this.onSearch();
            notification.success();
            this.setState({
              editFlag: true,
              newButtonFlag: true,
            });
          } else {
            notification.error({
              message: res.message,
            });
          }
        });
      }
    });
  }

  // 保存/编辑
  @Bind()
  toggleEdit() {
    const { buttonFlag } = this.state;
    // this.setState({ buttonFlag: !buttonFlag });
    if (buttonFlag) {
      this.handleEdit();
    } else {
      this.handleOK();
    }
  }

  // 点击编辑
  @Bind
  handleEdit() {
    this.setState({
      editFlag: false,
      buttonFlag: false,
    });
  }

  // 删除班次信息
  @Bind
  deleteShift() {
    const { dispatch, calendarId, shiftDate } = this.props;
    const { activeShift: calendarShiftId } = this.state;
    dispatch({
      type: 'working/deleteShift',
      payload: [calendarShiftId],
    }).then(res => {
      if (res && res.success) {
        this.shiftForm.props.form.resetFields();
        this.onSearch();
        dispatch({
          type: 'working/fetchCalendarShiftNoPageList',
          payload: {
            calendarId,
            shiftDate: moment(shiftDate).format('YYYY-MM-DD HH:mm:ss'),
          },
        });
        dispatch({
          type: 'working/fetchShiftList',
          payload: {
            calendarId,
            calendarDate: moment(shiftDate).format('YYYY-MM'),
          },
        });
        notification.success();
        dispatch({
          type: 'working/updateState',
          payload: {
            shiftFormList: {},
          },
        });
        this.setState({
          activeShift: '',
        });
      } else {
        notification.error({
          message: res.message,
        });
      }
    });
  }

  // 新建班次信息
  @Bind
  handleCreateShift() {
    const { dispatch, shiftDate } = this.props;
    this.shiftForm.props.form.resetFields();
    this.setState({
      newButtonFlag: false,
      editFlag: false,
    });
    dispatch({
      type: 'working/updateState',
      payload: {
        shiftFormList: {
          _status: 'create',
          shiftDate,
        },
      },
    });
  }

  // 选中某一个班次
  selectShift = item => {
    this.setState({
      activeShift: item.calendarShiftId,
    });
    this.shiftForm.props.form.resetFields();
    this.props.dispatch({
      type: 'working/updateState',
      payload: {
        shiftFormList: item,
      },
    });
  };

  // 渲染上方菜单
  renderNodes = list =>
    list.map((item, index) => {
      return (
        <li
          key={item.calendarShiftId}
          className={
            this.state.activeShift === '' && index === 0
              ? styles.listItemActive
              : this.state.activeShift === item.calendarShiftId
              ? styles.listItemActive
              : styles.listItem
          }
          onClick={() => this.selectShift(item)}
        >
          <div className={styles.listCode}>{item.shiftCode}</div>
          <div className={styles.listPeriod}>
            {`${item.shiftStartTime.substring(11, 19)}-${item.shiftEndTime.substring(11, 19)}`}
            {moment(item.shiftEndTime).diff(
              moment(item.shiftStartTime).format(DEFAULT_DATE_FORMAT),
              'days'
            ) > 0 && (
              <Tooltip title={item.shiftEndTime}>
                <span className={styles.listPeriodDay}>
                  +
                  {moment(item.shiftEndTime).diff(
                    moment(item.shiftStartTime).format(DEFAULT_DATE_FORMAT),
                    'days'
                  )}
                  天
                </span>
              </Tooltip>
            )}
          </div>
        </li>
      );
    });

  render() {
    const {
      visible,
      onCancel,
      loading,
      shiftDate,
      working: { shiftFormList = {}, calendarShiftNoPageList = [], displayList = {} },
    } = this.props;
    const { buttonFlag, editFlag, activeShift, newButtonFlag } = this.state;
    if (activeShift === '' && calendarShiftNoPageList.length > 0) {
      this.selectShift(calendarShiftNoPageList[0]);
    }
    const { calendarCode } = displayList;
    const { weekOfYear, dayOfWeek } = shiftFormList;
    const weekDate =
      (dayOfWeek === 1 && '一') ||
      (dayOfWeek === 2 && '二') ||
      (dayOfWeek === 3 && '三') ||
      (dayOfWeek === 4 && '四') ||
      (dayOfWeek === 5 && '五') ||
      (dayOfWeek === 6 && '六') ||
      (dayOfWeek === 7 && '天');
    const customTitle = (
      <div className={styles.customTitle}>
        <div>{intl.get('tarzan.calendar.working.title.currentShift').d('当日班次')}</div>
        <div className={styles.buttonGroup}>
          <Popconfirm
            title={intl.get('tarzan.calendar.working.title.info').d('总计1条数据,是否确认删除')}
            onConfirm={this.deleteShift}
            okText={intl.get(`tarzan.calendar.working.button.sure`).d('确认')}
            cancelText={intl.get(`tarzan.calendar.working.button.cancel`).d('取消')}
          >
            <Button icon="delete" disabled={activeShift === ''}>
              {intl.get('tarzan.calendar.working.button.delete').d('删除')}
            </Button>
          </Popconfirm>
          {newButtonFlag ? (
            <Button onClick={this.handleCreateShift} icon="plus" disabled={!buttonFlag}>
              {intl.get('tarzan.calendar.working.button.create').d('新建')}
            </Button>
          ) : (
            <Button onClick={this.handleSaveNew} type="primary" icon="save">
              {intl.get('tarzan.calendar.working.button.save').d('保存')}
            </Button>
          )}
          {buttonFlag ? (
            <Button onClick={this.handleEdit} type="primary" icon="edit" disabled={!newButtonFlag}>
              {intl.get('tarzan.calendar.working.button.edit').d('编辑')}
            </Button>
          ) : (
            <Button onClick={this.handleOK} type="primary" icon="save">
              {intl.get('tarzan.calendar.working.button.save').d('保存')}
            </Button>
          )}
        </div>
      </div>
    );
    const formProps = {
      editFlag,
      onRef: this.onRef,
      calendarShiftId: activeShift,
      shiftDate,
    };
    return (
      <Modal
        destroyOnClose
        width={720}
        title={customTitle}
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleOK}
        confirmLoading={loading}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        footer={[<Button onClick={onCancel}>返回</Button>]}
      >
        <Card
          key="code-rule-header"
          title={`${intl
            .get('tarzan.calendar.working.title.currentAllShift')
            .d('当日班次')}:  ${calendarCode || ''}  ${moment(shiftDate).format('YYYY-MM-DD')}`}
          bordered={false}
          className={DETAIL_CARD_TABLE_CLASSNAME}
          size="small"
        >
          {calendarShiftNoPageList && calendarShiftNoPageList.length > 0 && (
            <ul className={styles.customMenu}>{this.renderNodes(calendarShiftNoPageList)}</ul>
          )}
        </Card>
        <Card
          key="code-rule-header1"
          title={`${intl.get('tarzan.calendar.working.title.shiftInfo').d('班次信息')}:  ${moment(
            shiftDate
          ).format('YYYY-MM-DD')}  ${weekOfYear ? `第${weekOfYear}周` : ''}  ${
            weekDate ? `星期${weekDate}` : ''
          }`}
          bordered={false}
          className={DETAIL_CARD_TABLE_CLASSNAME}
        />
        <ShiftForm {...formProps} />
      </Modal>
    );
  }
}
