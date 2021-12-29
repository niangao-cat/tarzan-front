/*
 * @Description: 全年检验量与IQC检验时长趋势图
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-24 10:13:03
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-04-24 11:07:06
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default class ReceiptIQCTime extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const options = {
      chart: {
        zoomType: 'xy',
        style: {
          width: '100%',
          height: '100%',
        },
        animation: false,
        height: '280px',
        backgroundColor: 'transparent',
      },
      title: {
        text: '全年检验量与IQC检验时间长趋势图',
        style: {
          fontSize: '12px',
        },
      },
      xAxis: [
        {
          categories: [
            '1月',
            '2月',
            '3月',
            '4月',
            '5月',
            '6月',
            '7月',
            '8月',
            '9月',
            '10月',
            '11月',
            '12月',
          ],
          crosshair: true,
        },
      ],
      yAxis: [
        {
          // Primary yAxis
          title: {
            text: '实际产量',
            style: {
              color: Highcharts.getOptions().colors[1],
            },
          },
          tickAmount: 6,
          tickPositions: [0, 2000, 4000, 6000, 8000, 10000], // 指定竖轴坐标点的值
        },
        {
          // Secondary yAxis
          title: {
            text: '完成率',
            style: {
              color: Highcharts.getOptions().colors[0],
            },
          },
          tickAmount: 6,
          tickPositions: [65, 70, 75, 80, 85, 90], // 指定竖轴坐标点的值
          opposite: true, // 保证两面刻度不同
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
        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
      },
      series: [
        {
          name: '实际产量',
          type: 'column',
          data: [6533, 6129, 7633, 5078, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: '完成率',
          type: 'spline',
          yAxis: 1, // 双坐标
          data: [85, 89, 86, 87],
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
        line: {
          pointPadding: 0.2,
          borderWidth: 0,
          dataLabels: {
            // 开启数据标签
            enabled: true,
          },
        },
      },
    };
    return <HighchartsReact highcharts={Highcharts} options={options} />;
  }
}
