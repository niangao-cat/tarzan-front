/*
 * @Description: 30天上架
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-22 14:45:02
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-04-28 11:17:54
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Bind } from 'lodash-decorators';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default class ReceivingMaterial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [], // 天数
    };
  }

  componentDidMount() {
    this.initData();
  }

  // 初始化数据
  @Bind()
  initData() {
    const element = [];
    for (let index = 0; index < 30; index++) {
      element.push(index + 1);
    }
    this.setState({ categories: element });
  }

  render() {
    const { materialList = [] } = this.props;
    const seriesData = [];
    materialList.forEach(item => {
      seriesData.push(item.materialStoragedNum);
    });
    const options = {
      title: {
        text: '30天上架物料量',
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
          data: seriesData,
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
