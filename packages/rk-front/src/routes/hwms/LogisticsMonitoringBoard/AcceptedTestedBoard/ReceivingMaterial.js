/*
 * @Description: 30天收货物料量
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-21 10:06:32
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-05-06 16:04:52
 * @Copyright: Copyright (c) 2019 Hand
 */
import React, { Component } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';


const scancolors = ['#0069F2', '#00C8FF'];
// eslint-disable-next-line no-shadow
Highcharts.getOptions().colors = Highcharts.map(scancolors, function (scancolors) {
  return {
    radialGradient: { cx: 0, cy: -0.8, r: 3 },
    stops: [[0, scancolors], [1, Highcharts.Color(scancolors).brighten(1).get('rgb')]],
  };
});

export default class ReceivingMaterial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // categories: [], // 天数
    };
  }

  // componentDidMount() {
  //   this.initData();
  // }

  // // 初始化数据
  // @Bind()
  // initData() {
  //   const element = [];
  //   for (let index = 0; index < 30; index++) {
  //     element.push(index + 1);
  //   }
  //   this.setState({ categories: element });
  // }

  render() {
    const { materialList = [] } = this.props;
    const seriesData = [];
    materialList.forEach(item => {
      seriesData.push(item.actualReceiveQty);
    });
    const dateList = materialList.map(e => e.actualReceiveDate);
    const options = {
      title: {
        text: '30天收货物料量',
        style: {
          fontSize: '12px',
          color: '#fff',
        },
      },
      chart: {
        type: 'column',
        style: {
          width: '100%',
          height: '100%',
        },
        renderTo: 'scanchars',
        animation: false,
        height: '70%',
        backgroundColor: 'transparent',
      },
      series: [
        {
          type: 'column',
          allowPointSelect: false,
          data: seriesData,
          // color: linear-gradient('180deg', '#00c8ff', '#0069f2'),
        },
      ],
      credits: {
        enabled: false,
      },
      tooltip: {
        enabled: false,
      },
      xAxis: {
        // categories: this.state.categories,
        categories: dateList,
        crosshair: true,
        // 设置标签的样式；
        labels: {
          style: {
            color: '#fff',
          },
        },
      },
      yAxis: {
        title: null,
        tickAmount: 4,
        labels: {
          style: {
            color: '#fff',
          },
        },
        // tickPositions: [0, 10, 20, 30, 40, 50, 60, 70], // 指定竖轴坐标点的值
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
          // 设置数据标签
          dataLabels: {
            enabled: false, // 设置显示对应y的值
            color: '#fff',
          },
        },
      },
    };
    return <HighchartsReact highcharts={Highcharts} options={options} />;
  }
}
