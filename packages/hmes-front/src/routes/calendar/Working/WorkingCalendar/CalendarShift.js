import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Calendar, Icon } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import styles from './index.less';
import ShiftDrawer from './ShifitDrawer';

/**
 * 日历班次
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ working }) => ({
  working,
}))
export default class CalendarShift extends PureComponent {
  state = {
    date: moment(new Date()),
    shiftDrawerVisible: false,
    shiftDate: moment(new Date()),
  };

  @Bind()
  onSearch(date) {
    const { dispatch, calendarId } = this.props;
    dispatch({
      type: 'working/fetchShiftList',
      payload: {
        calendarId,
        calendarDate: moment(date).format('YYYY-MM'),
      },
    });
  }

  // 查看具体某一天的班次信息
  @Bind
  viewCalendarShift(value) {
    this.setState({
      shiftDrawerVisible: true,
      shiftDate: moment(value._d).format('YYYY-MM-DD'),
    });
  }

  // 关闭某一天的班次信息抽屉
  @Bind
  onCancelCalendarShift() {
    this.setState({
      shiftDrawerVisible: false,
    });
  }

  @Bind()
  onPanelChange(value) {
    this.setState({
      date: value,
    });
    this.onSearch(value);
  }

  // 下一个月切换
  @Bind()
  nextMonth() {
    this.setState({
      date: moment(this.state.date).subtract(-1, 'months'),
    });
    this.onSearch(moment(this.state.date).subtract(-1, 'months'));
  }

  // 上一个月切换
  @Bind()
  preMonth() {
    this.setState({
      date: moment(this.state.date).subtract(1, 'months'),
    });
    this.onSearch(moment(this.state.date).subtract(1, 'months'));
  }

  @Bind()
  getListData(shiftList, value) {
    let listData;
    shiftList.map(item => {
      if (moment(value._d).format('YYYY-MM-DD') === item.shiftDate) {
        listData = item.calendarShiftList;
      }
      return null;
    });
    return listData || [];
  }

  @Bind()
  dateCellRender(shiftList, value) {
    const listData = this.getListData(shiftList, value);
    return (
      <ul className={styles.ulWrapper}>
        {listData.map(item => (
          <li key={item.shiftCode} className={styles.listItem}>
            <div className={styles.listCode}>{item.shiftCode}</div>
            <div className={styles.listPeriod}>
              {`${item.shiftTimePeriod
                .replace(/\[|]/g, '')
                .substring(0, 5)}-${item.shiftTimePeriod.replace(/\[|]/g, '').substring(8, 14)}`}
            </div>
          </li>
        ))}
      </ul>
    );
  }

  @Bind()
  renderDate(list) {
    list.map(item => {
      return (
        <li key={item.shiftCode} className={styles.listItem}>
          <div className={styles.listCode}>{item.shiftCode}</div>
          <div className={styles.listPeriod}>{item.shiftTimePeriod}</div>
        </li>
      );
    });
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      working: { shiftList = [] },
      calendarId,
    } = this.props;
    const { shiftDrawerVisible, shiftDate } = this.state;
    const shiftDrawerProps = {
      visible: shiftDrawerVisible,
      onCancel: this.onCancelCalendarShift,
      onOk: this.onCancelCalendarShift,
      calendarId,
      shiftDate,
    };
    return (
      <div className={styles.customCalendar}>
        <div className={styles.customIcon}>
          <Icon type="left" onClick={this.preMonth} />
          <Icon type="right" onClick={this.nextMonth} />
        </div>
        <Calendar
          onPanelChange={this.onPanelChange}
          value={this.state.date}
          dateCellRender={this.dateCellRender.bind(this, shiftList)}
          onSelect={calendarId === 'create' ? '' : this.viewCalendarShift}
        />
        {shiftDrawerVisible && <ShiftDrawer {...shiftDrawerProps} />}
      </div>
    );
  }
}
