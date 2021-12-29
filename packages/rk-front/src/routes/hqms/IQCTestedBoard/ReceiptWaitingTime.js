/*
 * @Description: 全年检验量与IQC检验时长趋势图
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-07 18:13:05
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-05-08 10:07:49
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { PureComponent } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default class ReceiptWaitingTime extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const { trendList = [] } = this.props;
    const testAmount = [];
    const testDuration = [];
    const monthList = [];
    // 检验量
    trendList.forEach(item => {
      testAmount.push(item.totalQty);
      testDuration.push(parseFloat(item.duration));
      monthList.push(item.shiftDate);
    });
    const options = {
      chart: {
        zoomType: 'xy',
        style: {
          width: '100%',
          height: '100%',
          color: '#fff',
        },
        animation: false,
        height: '270px',
        backgroundColor: 'transparent',
      },
      title: {
        text: '全年检验量与IQC检验时长趋势图',
        style: {
          fontSize: '12px',
          color: '#fff',
        },
      },
      xAxis: [
        {
          categories: monthList,
          crosshair: true,
          labels: {
            style: {
              color: '#fff',
            },
          },
          dataLabels: {
            backgroundColor: 'transparent',
            color: '#fff',
          },
        },
      ],
      yAxis: [
        {
          // Primary yAxis
          title: {
            text: '检验量',
            style: {
              color: Highcharts.getOptions().colors[0],
            },
          },
          tickAmount: 6,
          labels: {
            style: {
              color: '#fff',
            },
          },
          // tickPositions: [0, 2000, 4000, 6000, 8000, 10000], // 指定竖轴坐标点的值s
        },
        {
          // Secondary yAxis
          title: {
            text: '检验时长',
            style: {
              color: Highcharts.getOptions().colors[1],
            },
          },
          tickAmount: 6,
          // tickPositions: [0, 0.25, 0.5, 0.75, 1, 1.25], // 指定竖轴坐标点的值
          opposite: true, // 保证两面刻度不同
          labels: {
            style: {
              color: '#fff',
            },
          },
        },
      ],
      tooltip: {
        shared: true,
      },
      credits: {
        enabled: false,
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        x: 0,
        verticalAlign: 'top',
        y: 0,
        floating: true,
        backgroundColor: 'rgb(32, 56, 100)',
        itemStyle: { color: '#fff' },
      },
      series: [
        {
          name: '检验量',
          type: 'column',
          data: testAmount,
          dataLabels: {
            backgroundColor: 'transparent',
            color: '#fff',
          },
        },
        {
          name: '检验时长',
          type: 'spline',
          yAxis: 1, // 双坐标
          data: testDuration,
          dataLabels: {
            backgroundColor: 'transparent',
            color: '#fff',
          },
          color: '#00FFFF',
        },
      ],
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
          dataLabels: {
            enabled: true, // 设置显示对应y的值
          },
        },
        // line: {
        //   pointPadding: 0.2,
        //   borderWidth: 0,
        //   dataLabels: {
        //     enabled: true,
        //   },
        // },
      },
    };
    return <HighchartsReact highcharts={Highcharts} options={options} />;
  }
}
