/*
 * @Description: 30天检验物料量
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-22 14:45:02
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-04-24 11:06:36
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default class TestingMaterial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [], // 天数
    };
  }

  componentDidMount() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const d = new Date(year, month, 0);
    const element = [];
    for (let index = 0; index < d.getDate(); index++) {
      element.push(index + 1);
    }
    this.setState({ categories: element });
  }

  render() {
    const options = {
      title: {
        text: '30天检验物料量',
        style: {
          fontSize: '12px',
        },
      },
      chart: {
        type: 'column',
        style: {
          width: '100%',
          height: '100%',
        },
        animation: false,
        height: '280px',
        backgroundColor: 'transparent',
      },
      series: [
        {
          type: 'column',
          allowPointSelect: false,
          data: [
            20,
            30,
            40,
            70,
            30,
            60,
            50,
            10,
            20,
            65,
            24,
            38,
            53,
            61,
            74,
            69,
            20,
            34,
            40,
            70,
            30,
            60,
            50,
            40,
            70,
            30,
            60,
            50,
            29,
            30,
          ],
        },
      ],
      credits: {
        enabled: false,
      },
      tooltip: {
        enabled: false,
      },
      xAxis: {
        categories: this.state.categories,
        crosshair: true,
      },
      yAxis: {
        title: null,
        tickAmount: 4,
        tickPositions: [0, 10, 20, 30, 40, 50, 60, 70], // 指定竖轴坐标点的值
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
          dataLabels: {
            enabled: true, // 设置显示对应y的值
          },
        },
      },
    };
    return <HighchartsReact highcharts={Highcharts} options={options} />;
  }
}
