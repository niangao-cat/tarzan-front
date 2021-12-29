/**
 * DispatchPlatform - 调度平台
 * @date: 2019-12-3
 * @author: JRQ <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Icon, Spin, Tooltip } from 'hzero-ui';
import GaugeChart from './GaugeChart';
import styles from './index.less';

@connect(({ dispatchPlatform, loading }) => ({
  dispatchPlatform,
  chartsLoading: loading.effects['dispatchPlatform/fetchWKCChartsList'],
}))
export default class ChartTable extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    const todayDate = this.getDateCN(0);
    const tomorrowDate = this.getDateCN(1);
    this.state = {
      addNumber: 0,
      todayDate,
      tomorrowDate,
    };
  }

  componentDidMount() {
    const { addNumber } = this.state;
    const {
      dispatch,
      dispatchPlatform: { defaultSiteId, selectedProLineId, selectedOperationId },
    } = this.props;
    dispatch({
      type: 'dispatchPlatform/fetchWKCRangeList',
      payload: {
        defaultSiteId,
        prodLineId: selectedProLineId,
        operationId: selectedOperationId,
      },
    }).then(res => {
      if (res && res.success) {
        this.fetchChart(this.getDate(addNumber), this.getDate(addNumber + 1));
      }
    });
  }

  fetchChart = (today, tomorrow) => {
    const {
      dispatch,
      dispatchPlatform: { defaultSiteId, selectedProLineId, selectedOperationId, WKCRangeList },
    } = this.props;
    dispatch({
      type: 'dispatchPlatform/fetchWKCChartsList',
      payload: {
        defaultSiteId,
        prodLineId: selectedProLineId,
        operationId: selectedOperationId,
        today,
        tomorrow,
        workcellIdList: WKCRangeList.map(item => item.workcellId),
      },
    });
  };

  //  渲染图表行
  renderChartTableRows = list =>
    list.map(item => {
      return (
        <li className={styles.rows}>
          <div className={styles.title}>
            <Tooltip title={item.workcellCode}>{item.workcellCode}</Tooltip>
          </div>
          <div className={styles.charts}>
            <div className={styles.oneDayChartsList}>
              {item.todayChartsArray && this.renderCharts(item.todayChartsArray)}
            </div>
            <div className={styles.oneDayChartsList}>
              {item.todayChartsArray && this.renderCharts(item.tomorrowChartsArray)}
            </div>
          </div>
        </li>
      );
    });

  //  渲染图表
  renderCharts = array =>
    array.map(item => {
      return <GaugeChart dataSource={item} />;
    });

  //  获取日期方法
  getDateCN = num => {
    return moment()
      .add('day', num)
      .format('YYYY年MM月DD日');
  };

  //  获取日期-去掉年
  getDateCNNoYear = num => {
    return moment()
      .add('day', num)
      .format('MM月DD日');
  };

  getDate = num => {
    return moment()
      .add('day', num)
      .format('YYYY-MM-DD');
  };

  //  下一天
  addDate = () => {
    const { addNumber } = this.state;
    this.setState({
      todayDate: this.getDateCN(addNumber + 2),
      tomorrowDate: this.getDateCN(addNumber + 3),
      addNumber: addNumber + 2,
    });
    this.fetchChart(this.getDate(addNumber + 2), this.getDate(addNumber + 3));
  };

  //  上一天
  decDate = () => {
    const { addNumber } = this.state;
    this.setState({
      todayDate: this.getDateCN(addNumber - 2),
      tomorrowDate: this.getDateCN(addNumber - 1),
      addNumber: addNumber - 2,
    });
    this.fetchChart(this.getDate(addNumber - 2), this.getDate(addNumber - 1));
  };

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { todayDate, tomorrowDate } = this.state;
    const {
      dispatchPlatform: { chartTableList = [] },
      chartsLoading,
    } = this.props;
    return (
      // <GaugeChart />
      <ul className={styles.chartTable}>
        <Spin spinning={chartsLoading}>
          <li className={styles.header}>
            <div className={styles.title}>WKC</div>
            <div className={styles.datetime}>
              <Icon type="left" onClick={this.decDate} />
              <div>{todayDate}</div>
              <div className={styles.line} />
              <div>{tomorrowDate}</div>
              <Icon type="right" onClick={this.addDate} />
            </div>
          </li>
          {this.renderChartTableRows(chartTableList)}
        </Spin>
      </ul>
    );
  }
}
