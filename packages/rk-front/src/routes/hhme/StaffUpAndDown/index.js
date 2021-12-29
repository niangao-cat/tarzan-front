/*
 * @Description: 员工上下岗
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-28 16:00:44
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-08-16 14:50:39
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Calendar, Spin, notification, Modal } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import classNames from 'classnames';
import { getCurrentUserId } from 'utils/utils';
import { Header, Content } from 'components/Page';
import InfoCount from './Component/InfoCount';
import UpAndDownInfo from './Component/UpAndDownInfo';
import StaffInfo from './Component/StaffInfo';
import LeaveReason from './Component/LeaveReason';
import styles from './index.less';

@connect(({ staffUpAndDown }) => ({
  staffUpAndDown,
}))
export default class ProcessInProcess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMoment: moment(), // 当前日历展示的月份
      currentDate: moment(), // 当前日期
      currentSelectDate: moment(), // 当前选择的日期
      showDate: moment(), // 展示日期
      spinning: false,
      defaultData: {}, // 默认选中信息
      option: {}, // echarts 数据
      shiftCode: "早班",
      reasonFlag: false, // 弹出确认框
    };
  }

  componentDidMount() {
    // 查询员工信息
    const { dispatch } = this.props;
    dispatch({
      type: 'staffUpAndDown/queryStaffData',
      payload: {
        userId: getCurrentUserId(),
      },
    });
  }

  // 关闭弹框
  @Bind
  closeModal(){
    this.setState({reasonFlag: false});
  }

  // 确认离岗
  @Bind
  doMatModal(values={}){
    this.setState({reasonFlag: false});
    this.setDateForStaffStart(values);
  }

  // 判断是否是要暂时离岗， 是则弹窗 不是则通过
  @Bind
  checkOpenModel(){
    if(this.state.defaultData.startName==="继续"||this.state.defaultData.startName==="开始"){
      this.setState({reasonFlag: true});
    }else{
       this.setDateForStaffStart();
    }
  }

  @Bind()
  dateRender(date) {
    const {
      staffUpAndDown: { upAndDownData = {} },
    } = this.props;
    const { currentMoment, currentSelectDate, currentDate } = this.state;
    const currentMonth = currentMoment.month();
    const currentSelectDateFormat = currentSelectDate.format('YYYY-MM-DD');
    const currentDateFormat = currentDate.format('YYYY-MM-DD');
    const dateFormat = date.format('DD');
    let className =
      currentMonth !== date.month()
        ? styles['stuffUpAndDown_disabled-date']
        : styles.stuffUpAndDown_date;
    const showClass = className;
    className =
      currentSelectDateFormat === dateFormat
        ? classNames('stuffUpAndDown_selected-date', className)
        : className;
    className =
      currentDateFormat === dateFormat
        ? classNames('stuffUpAndDown_current-date', className)
        : className;
    className =
      date.month() !== currentMonth || date.isAfter(currentDate)
        ? className
        : upAndDownData.filter(item => item.day === Number(dateFormat) && item.isWork === false)
          .length > 0
          ? classNames('stuffUpAndDown_absence-date', className)
          : classNames('stuffUpAndDown_attendance-date', className);

    // 判断显示的是否时当前时间  是 则标识蓝色
    if (date.format('YYYY-MM-DD') === currentSelectDate.format('YYYY-MM-DD')) {
      if (upAndDownData.filter(item => item.day === Number(dateFormat) && item.isWork === null).length > 0) {
        return (
          <div className={className} style={{ backgroundColor: 'rgba(217,217,217)' }}>
            {date.date()}
          </div>
        );
      } else {
        return (
          <div className={className} style={{ backgroundColor: 'rgba(255,187,0)', color: 'white' }}>
            {date.date()}
          </div>
        );
      }
    } else if (upAndDownData.filter(item => item.day === Number(dateFormat) && item.isWork === null && showClass !== styles['stuffUpAndDown_disabled-date']).length > 0) {
      return (
        <div className={className} style={{ backgroundColor: 'rgba(217,217,217)' }}>
          {date.date()}
        </div>
      );
    } else {
      return <div disabled className={className}>{date.date()}</div>;
    }
  }

  @Bind()
  handleChangeCalendar(date) {
    // 先关闭时间
    clearInterval(this.timer);
    this.setState({
      showDate: date,
      currentMoment: date,
    });

    this.setState({ spinning: true });
    // 查询员工信息
    const {
      dispatch,
      staffUpAndDown: { staffData = {} },
    } = this.props;
    dispatch({
      type: 'staffUpAndDown/queryUpAndDownData',
      payload: {
        userId: getCurrentUserId(),
        employeeId: staffData.employeeId,
        workcellId: staffData.workcellId,
        year: date.year(),
        month: date.month() + 1,
      },
    }).then(() => {
      this.setState({ spinning: false });
    });
  }

  @Bind()
  handleSelectCalendar(date) {
    const {
      dispatch,
      staffUpAndDown: { upAndDownData = {} },
    } = this.props;
    if (upAndDownData.filter(item => item.day === Number(date.format('DD')) && item.isWork === null).length > 0) {
      dispatch({
        type: 'staffUpAndDown/updateState',
        payload: {
          frequencyData: [],
        },
      });
      return false;
    }

    // 先关闭时间
    clearInterval(this.timer);

    this.setState({
      currentSelectDate: date,
      currentMoment: date,
    });

    // 获取对应的班车信息
    this.setState({ spinning: true });
    // 查询员工信息
    const {
      staffUpAndDown: { staffData = {} },
    } = this.props;

    if (
      staffData.workcellId === undefined ||
      staffData.workcellId === null ||
      staffData.workcellId === ''
    ) {
      this.setState({ spinning: false });
      return notification.error({ message: '请先选中工位！！' });
    }

    dispatch({
      type: 'staffUpAndDown/queryFrequencyData',
      payload: {
        userId: getCurrentUserId(),
        employeeId: staffData.employeeId,
        workcellId: staffData.workcellId,
        year: date.year(),
        month: date.month() + 1,
        day: date.date(),
      },
    }).then(res => {
      // 查询列表信息
      if (res.length > 0) {
        dispatch({
          type: 'staffUpAndDown/queryList',
          payload: {
            userId: getCurrentUserId(),
            employeeId: staffData.employeeId,
            workcellId: staffData.workcellId,
            date: date.format('YYYY-MM-DD'),
            shiftCode: (res.length > 0 && res.filter(item => item.shiftcode === this.state.shiftCode).length > 0) ? res.filter(item => item.shiftcode === this.state.shiftCode)[0].shiftcode : '',
          },
        }).then(() => {
          this.setState({ spinning: false, defaultData: (res.length > 0 && res.filter(item => item.shiftcode === this.state.shiftCode).length > 0) ? res.filter(item => item.shiftcode === this.state.shiftCode)[0] : {} });
          this.getOption((res.length > 0 && res.filter(item => item.shiftcode === this.state.shiftCode).length > 0) ? res.filter(item => item.shiftcode === this.state.shiftCode)[0] : {});
          // 设计计时
          this.setDurationDate(this.state.defaultData);
        });
      } else {
        this.setState({ spinning: false, defaultData: (res.length > 0 && res.filter(item => item.shiftcode === this.state.shiftCode).length > 0) ? res.filter(item => item.shiftcode === this.state.shiftCode)[0] : {} });
        this.getOption((res.length > 0 && res.filter(item => item.shiftcode === this.state.shiftCode).length > 0) ? res.filter(item => item.shiftcode === this.state.shiftCode)[0] : {});
      }
    });
  }

  @Bind
  setUpAndDownInfo(e) {
    this.getOption(e);
    this.setState({ defaultData: e, shiftCode: e.shiftcode });
    this.setState({ spinning: true });
    const {
      dispatch,
      staffUpAndDown: { staffData = {} },
    } = this.props;

    // 设置显示
    this.setDurationDate(e);

    // 查询表格数据
    const { currentSelectDate } = this.state;
    dispatch({
      type: 'staffUpAndDown/queryList',
      payload: {
        userId: getCurrentUserId(),
        employeeId: staffData.employeeId,
        workcellId: staffData.workcellId,
        date: currentSelectDate.format('YYYY-MM-DD'),
        shiftCode: e.shiftcode,
      },
    }).then(() => {
      this.setState({ spinning: false });
    });
  }

  getOption = defaultData => {
    const dataX =
      defaultData.list === undefined
        ? []
        : defaultData.list.length > 0
          ? defaultData.list.map(item => item.time)
          : [];
    const dataY =
      defaultData.list === undefined
        ? []
        : defaultData.list.length > 0
          ? defaultData.list.map(item => {
            if (item.work === false) {
              return '';
            } else {
              return '0';
            }
          })
          : [];
    const option = {
      xAxis: {
        type: 'category',
        data: dataX,
        axisTick: {
          show: false,
        },
        axisLine: {
          symbol: ['none', 'arrow'],
          symbolOffset: 10,
          symbolSize: [10, 12],
        },
        axisLabel: {
          show: true,
          textStyle: {
            fontSize: 8, // 更改坐标轴文字大小
          },
        },
      },
      yAxis: {
        type: 'value',
        show: false,
      },
      grid: {
        bottom: '70%',
        containLabel: true, // grid 区域是否包含坐标轴的刻度标签
      },
      series: [
        {
          name: '联盟广告',
          type: 'line',
          stack: '总量',
          showSymbol: true,
          symbol: 'circle', // 设定为实心点
          symbolSize: 5,
          data: dataY,
          itemStyle: {
            normal: {
              color: 'rgba(74,103,203)',
              lineStyle: {
                color: 'rgba(74,103,203)',
              },
            },
          },
        },
      ],
    };
    this.setState({ option });
  };

  @Bind()
  handleTableChange(page = {}) {
    this.setState({ spinning: true });
    const {
      dispatch,
      staffUpAndDown: { staffData = {} },
    } = this.props;

    // 查询表格数据
    const { currentSelectDate, defaultData } = this.state;
    dispatch({
      type: 'staffUpAndDown/queryList',
      payload: {
        userId: getCurrentUserId(),
        employeeId: staffData.employeeId,
        workcellId: staffData.workcellId,
        date: currentSelectDate.format('YYYY-MM-DD'),
        shiftCode: defaultData.shiftcode,
        page,
      },
    }).then(() => {
      this.setState({ spinning: false });
    });
  }

  // 卸载组件取消倒计时
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  @Bind
  setDateForStaffStart(values = {}) {
    // 查询员工信息
    const {
      dispatch,
      staffUpAndDown: { staffData = {} },
    } = this.props;

    const { currentSelectDate, defaultData } = this.state;
    if (defaultData.startSwitch === 'YES') {
      this.setState({ spinning: true });
      dispatch({
        type: 'staffUpAndDown/setDateForStaff',
        payload: {
          userId: getCurrentUserId(),
          employeeId: staffData.employeeId,
          workcellId: staffData.workcellId,
          date: `${defaultData.choiceTime} 00:00:00`,
          shiftCode: defaultData.shiftcode,
          operation:
            defaultData.startName === null
              ? 'OPEN'
              : defaultData.startName === '暂停'
                ? 'ON'
                : 'OFF',
          duration: defaultData.duration,
          relId: defaultData.relId,
          startAgen: '',
          ...values,
        },
      }).then(res => {
        if (res) {
          dispatch({
            type: 'staffUpAndDown/queryFrequencyData',
            payload: {
              userId: getCurrentUserId(),
              employeeId: staffData.employeeId,
              workcellId: staffData.workcellId,
              year: currentSelectDate.year(),
              month: currentSelectDate.month() + 1,
              day: currentSelectDate.date(),
            },
          }).then(data => {
            if (data) {
              dispatch({
                type: 'staffUpAndDown/queryList',
                payload: {
                  userId: getCurrentUserId(),
                  employeeId: staffData.employeeId,
                  workcellId: staffData.workcellId,
                  date: currentSelectDate.format('YYYY-MM-DD'),
                  shiftCode:
                    data.filter(item => item.shiftcode === defaultData.shiftcode).length > 0
                      ? data.filter(item => item.shiftcode === defaultData.shiftcode)[0].shiftcode
                      : '',
                },
              }).then(() => {
                // 先关闭时间
                clearInterval(this.timer);
                this.setState({
                  spinning: false,
                  defaultData:
                    data.filter(item => item.shiftcode === defaultData.shiftcode).length > 0
                      ? data.filter(item => item.shiftcode === defaultData.shiftcode)[0]
                      : {},
                });
                //  重新加载进度条
                this.getOption(
                  data.filter(item => item.shiftcode === defaultData.shiftcode).length > 0
                    ? data.filter(item => item.shiftcode === defaultData.shiftcode)[0]
                    : {}
                );
                // 设计计时
                this.setDurationDate(this.state.defaultData);
              });
            } else {
              // 先关闭时间
              clearInterval(this.timer);
              this.setState({
                spinning: false,
                defaultData:
                  data.filter(item => item.shiftcode === defaultData.shiftcode).length > 0
                    ? data.filter(item => item.shiftcode === defaultData.shiftcode)[0]
                    : {},
              });
              this.getOption(
                data.filter(item => item.shiftcode === defaultData.shiftcode).length > 0
                  ? data.filter(item => item.shiftcode === defaultData.shiftcode)[0]
                  : {}
              );
            }
          });
        } else {
          this.setState({ spinning: false });
        }
      });
    } else if (defaultData.startAgain) {
      Modal.confirm({
        title: '当前工位已结班，是否重新开班？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.setState({ spinning: true });
          dispatch({
            type: 'staffUpAndDown/setDateForStaff',
            payload: {
              userId: getCurrentUserId(),
              employeeId: staffData.employeeId,
              workcellId: staffData.workcellId,
              date: `${defaultData.choiceTime} 00:00:00`,
              shiftCode: defaultData.shiftcode,
              operation:
                defaultData.startName === null
                  ? 'OPEN'
                  : defaultData.startName === '暂停'
                    ? 'ON'
                    : 'OFF',
              duration: defaultData.duration,
              relId: defaultData.relId,
              startAgen: 'Y',
            },
          }).then(res => {
            if (res) {
              dispatch({
                type: 'staffUpAndDown/queryFrequencyData',
                payload: {
                  userId: getCurrentUserId(),
                  employeeId: staffData.employeeId,
                  workcellId: staffData.workcellId,
                  year: currentSelectDate.year(),
                  month: currentSelectDate.month() + 1,
                  day: currentSelectDate.date(),
                },
              }).then(data => {
                if (data) {
                  dispatch({
                    type: 'staffUpAndDown/queryList',
                    payload: {
                      userId: getCurrentUserId(),
                      employeeId: staffData.employeeId,
                      workcellId: staffData.workcellId,
                      date: currentSelectDate.format('YYYY-MM-DD'),
                      shiftCode:
                        data.filter(item => item.shiftcode === defaultData.shiftcode).length > 0
                          ? data.filter(item => item.shiftcode === defaultData.shiftcode)[0]
                            .shiftcode
                          : '',
                    },
                  }).then(() => {
                    // 先关闭时间
                    clearInterval(this.timer);
                    this.setState({
                      spinning: false,
                      defaultData:
                        data.filter(item => item.shiftcode === defaultData.shiftcode).length > 0
                          ? data.filter(item => item.shiftcode === defaultData.shiftcode)[0]
                          : {},
                    });
                    //  重新加载进度条
                    this.getOption(
                      data.filter(item => item.shiftcode === defaultData.shiftcode).length > 0
                        ? data.filter(item => item.shiftcode === defaultData.shiftcode)[0]
                        : {}
                    );
                    // 设计计时
                    this.setDurationDate(this.state.defaultData);
                  });
                } else {
                  // 先关闭时间
                  clearInterval(this.timer);
                  this.setState({
                    spinning: false,
                    defaultData:
                      data.filter(item => item.shiftcode === defaultData.shiftcode).length > 0
                        ? data.filter(item => item.shiftcode === defaultData.shiftcode)[0]
                        : {},
                  });
                  this.getOption(
                    data.filter(item => item.shiftcode === defaultData.shiftcode).length > 0
                      ? data.filter(item => item.shiftcode === defaultData.shiftcode)[0]
                      : {}
                  );
                }
              });
            } else {
              this.setState({ spinning: false });
            }
          });
        },
      });
    }
  }

  @Bind()
  setDurationDate(e) {
    // 设置动态时间点击，当开始和继续的时候
    if (e.startName === '开始' || e.startName === '继续') {
      // 拆解对应的累计时间
      const doNum = e.duration.split(':');
      let dateForDo = Number(doNum[0]) * 60 * 60 + Number(doNum[1]) * 60 + Number(doNum[2]);
      this.timer = setInterval(() => {
        dateForDo += 1;
        let hour = Math.floor(dateForDo / 3600);
        let minute = Math.floor((dateForDo / 60) % 60);
        let second = Math.floor(dateForDo % 60);
        hour = hour < 10 ? `0${hour}` : hour;
        minute = minute < 10 ? `0${minute}` : minute;
        second = second < 10 ? `0${second}` : second;
        this.setState({
          defaultData: { ...e, duration: `${hour}:${minute}:${second}` },
        });
      }, 1000);
    } else {
      clearInterval(this.timer);
    }
  }

  @Bind
  setDateForStaffClose() {
    // 查询员工信息
    const {
      dispatch,
      staffUpAndDown: { staffData = {} },
    } = this.props;

    const { currentSelectDate, defaultData } = this.state;
    if (defaultData.closeSwitch === 'YES') {
      this.setState({ spinning: true });
      dispatch({
        type: 'staffUpAndDown/setDateForStaff',
        payload: {
          userId: getCurrentUserId(),
          employeeId: staffData.employeeId,
          workcellId: staffData.workcellId,
          date: `${defaultData.choiceTime} 00:00:00`,
          shiftCode: defaultData.shiftcode,
          operation: 'CLOSE',
          duration: defaultData.duration,
          startAgen: '',
        },
      }).then(res => {
        if (res) {
          dispatch({
            type: 'staffUpAndDown/queryFrequencyData',
            payload: {
              userId: getCurrentUserId(),
              employeeId: staffData.employeeId,
              workcellId: staffData.workcellId,
              year: currentSelectDate.year(),
              month: currentSelectDate.month() + 1,
              day: currentSelectDate.date(),
            },
          }).then(data => {
            if (data) {
              dispatch({
                type: 'staffUpAndDown/queryList',
                payload: {
                  userId: getCurrentUserId(),
                  employeeId: staffData.employeeId,
                  workcellId: staffData.workcellId,
                  date: currentSelectDate.format('YYYY-MM-DD'),
                  shiftCode:
                    data.filter(item => item.shiftcode === defaultData.shiftcode).length > 0
                      ? data.filter(item => item.shiftcode === defaultData.shiftcode)[0].shiftcode
                      : '',
                },
              }).then(() => {
                // 先关闭时间
                clearInterval(this.timer);
                this.setState({
                  spinning: false,
                  defaultData:
                    data.filter(item => item.shiftcode === defaultData.shiftcode).length > 0
                      ? data.filter(item => item.shiftcode === defaultData.shiftcode)[0]
                      : {},
                });
              });
            } else {
              this.setState({
                spinning: false,
                defaultData:
                  data.filter(item => item.shiftcode === defaultData.shiftcode).length > 0
                    ? data.filter(item => item.shiftcode === defaultData.shiftcode)[0]
                    : {},
              });
            }
          });
        } else {
          this.setState({ spinning: false });
        }
      });
    }
  }

  @Bind()
  changeWorkcell(value) {
    const {
      dispatch,
      staffUpAndDown: { staffData = {} },
    } = this.props;

    staffData.workcellId = value;

    dispatch({
      type: 'staffUpAndDown/updateState',
      payload: {
        staffData,
      },
    });

    this.setState({ spinning: true });

    const { showDate } = this.state;
    const currentMonth = showDate.month();
    const currentYear = showDate.year();
    dispatch({
      type: 'staffUpAndDown/queryUpAndDownData',
      payload: {
        userId: getCurrentUserId(),
        employeeId: staffData.employeeId,
        workcellId: value,
        year: currentYear,
        month: currentMonth + 1,
      },
    }).then(() => {
      this.setState({ spinning: false });
      // 默认查询当天数据
      this.handleSelectCalendar(moment());
    });
  }

  // @Bind()
  // changeUnitId(value) {
  //   const {
  //     dispatch,
  //     staffUpAndDown: { staffData = {} },
  //   } = this.props;
  //   const { unitList = [] } = staffData;
  //   staffData.unitId = value;
  //   dispatch({
  //     type: 'staffUpAndDown/updateState',
  //     payload: {
  //       staffData,
  //     },
  //   });
  //   // 根据选中的班组ID筛选出对应的工位
  //   const newList = unitList.filter(
  //     item => item.unitId === value
  //   );
  //   const {workcellList=[]} = newList[0];
  //   // 把筛选出的工位赋值给modal中的工位列表
  //   dispatch({
  //     type: 'staffUpAndDown/updateState',
  //     payload: {
  //       workcellLists: workcellList,
  //     },
  //   });

  //   // 为确保每次重新选择班子时工位能够更新及时，此时需要清空工位下拉框，让用户重新选择
  //   this.staffInfoForm.resetFields(['workcellId']);

  //   // if (staffData.workcellId !== null && staffData.workcellId !== undefined && staffData.workcellId !== "") {
  //   //   this.setState({ spinning: true });

  //   //   const { showDate } = this.state;
  //   //   const currentMonth = showDate.month();
  //   //   const currentYear = showDate.year();
  //   //   dispatch({
  //   //     type: 'staffUpAndDown/queryUpAndDownData',
  //   //     payload: {
  //   //       userId: getCurrentUserId(),
  //   //       employeeId: staffData.employeeId,
  //   //       workcellId: staffData.workcellId,
  //   //       unitId: value,
  //   //       year: currentYear,
  //   //       month: currentMonth + 1,
  //   //     },
  //   //   }).then(() => {
  //   //     this.setState({ spinning: false });
  //   //     // 默认查询当天数据
  //   //     this.handleSelectCalendar(moment());
  //   //   });
  //   // }
  // }

  render() {
    const { currentDate, defaultData, option } = this.state;

    const {
      staffUpAndDown: {
        staffData = {},
        frequencyData = [],
        listData = [],
        pagination,
        workcellLists = [],
        reasonList = [],
      },
    } = this.props;

    const upAndDownInfo = {
      selectedDate: this.state.currentSelectDate,
      frequencyData,
      defaultData,
      setUpAndDownInfo: this.setUpAndDownInfo,
      checkOpenModel: this.checkOpenModel,
      setDateForStaffClose: this.setDateForStaffClose,
      option,
    };

    // 设置查询的员工信息
    const staffInfo = {
      staffData,
      workcellLists,
      onRef: node=>{
        this.staffInfoForm = node.props.form;
      },
      changeWorkcell: this.changeWorkcell,
    };

    const infoCount = {
      listData,
      pagination,
      handleTableChange: this.handleTableChange,
    };

    const reasonProps = {
      closeModal: this.closeModal,
      visible: this.state.reasonFlag,
      reasonList,
      doMatModal: this.doMatModal,
    };

    return (
      <Fragment>
        <Header title="员工上下岗" />
        <Spin spinning={this.state.spinning}>
          <Content>
            <Row>
              <Col span={6} className={styles.staffUpAndDown_staffInfo}>
                <StaffInfo {...staffInfo} />
              </Col>
              <Col span={18}>
                <Row>
                  <Col span={8}>
                    <div className={styles.stuffUpAndDown_calendar}>
                      <Calendar
                        fullscreen={false}
                        dateFullCellRender={this.dateRender}
                        onPanelChange={this.handleChangeCalendar}
                        onSelect={this.handleSelectCalendar}
                        defaultValue={currentDate}
                      />
                    </div>
                  </Col>
                  <Col span={16}>
                    <UpAndDownInfo {...upAndDownInfo} />
                  </Col>
                </Row>
                <Row>
                  <InfoCount {...infoCount} />
                </Row>
              </Col>
            </Row>
          </Content>
        </Spin>
        <LeaveReason {...reasonProps} />
      </Fragment>
    );
  }
}
