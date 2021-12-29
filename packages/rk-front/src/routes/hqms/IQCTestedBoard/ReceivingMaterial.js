/*
 * @Description: 30天检验物料量
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-07 18:13:05
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-05-07 18:29:37
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { PureComponent } from 'react';
// import { Bind } from 'lodash-decorators';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default class ReceivingMaterial extends PureComponent {
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
      seriesData.push(item.totalQty);
    });
    const dateList = materialList.map(e => e.shiftDate);
    const options = {
      title: {
        text: '30天检验物料量',
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
        animation: false,
        height: '270px',
        backgroundColor: 'transparent',
      },
      series: [
        {
          type: 'column',
          allowPointSelect: false,
          data: seriesData,
          dataLabels: {
            backgroundColor: 'transparent',
            color: '#fff',
          },
        },
      ],
      credits: {
        enabled: false,
      },
      tooltip: {
        enabled: false,
      },
      xAxis: {
        categories: dateList,
        crosshair: true,
        lineColor: '#fff',
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
