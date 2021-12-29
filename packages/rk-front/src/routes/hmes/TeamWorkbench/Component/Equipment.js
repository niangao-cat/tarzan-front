/*
 * @Description: 设备
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-12 10:32:56
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-08-05 00:38:46
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Form } from 'hzero-ui';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import styles from '../index.less';

@Form.create({ fieldNameProp: null })
export default class Equipment extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { equipmentManage = {} } = this.props;
    const { xdataList = [], ydataList = [] } = equipmentManage;
    const options = {
      title: {
        text: null,
        style: {
          fontSize: '12px',
        },
      },
      chart: {
        type: 'bar',
        style: {
          width: '100%',
          height: '100%',
        },
        animation: false,
        height: '170px',
        backgroundColor: 'transparent',
      },
      series: [
        {
          name: '数量',
          allowPointSelect: false,
          data: ydataList,
        },
      ],
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: xdataList,
        tickPosition: 'outside',
        labels: {
          style: {
            // color: '#fff',
            fontSize: '10px',
          },
        },
      },
      yAxis: {
        title: null,
        tickAmount: 4,
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          dataLabels: {
            // 开启数据标签
            enabled: true,
          },
        },
      },
    };
    return (
      <React.Fragment>
        <div className={styles.title}>
          <div className={styles.colorDiv} />
          <span>设备管理</span>
        </div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </React.Fragment>
    );
  }
}
