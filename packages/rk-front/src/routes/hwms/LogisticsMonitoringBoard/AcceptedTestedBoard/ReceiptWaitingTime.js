/*
 * @Description: 全年收货量与待检时间长趋势图
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-21 10:06:32
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-05-06 16:16:03
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default class ReceiptWaitingTime extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { trendList = {} } = this.props;
    const { receivedQuantutyDTOList = [], inspectionTimeDTOList = [] } = trendList;
    const inspectionTime = [];
    const monthList = [];
    // 待检时长
    inspectionTimeDTOList.forEach(item => {
      inspectionTime.push(item.inspectionTime);
      monthList.push(item.inspectionFinishDate);
    });
    const actualReceiveQty = [];
    // 收获量
    receivedQuantutyDTOList.forEach(item => {
      actualReceiveQty.push(item.actualReceiveQty);
    });
    const options = {
      chart: {
        zoomType: 'xy',
        style: {
          width: '100%',
          height: '100%',
        },
        // animation: false,
        height: '70%',
        backgroundColor: 'transparent',
      },
      title: {
        text: '全年收货量与待检时间长趋势图',
        style: {
          fontSize: '12px',
          color: '#fff',
        },
      },
      xAxis: [
        {
          // categories: [
          //   '1月',
          //   '2月',
          //   '3月',
          //   '4月',
          //   '5月',
          //   '6月',
          //   '7月',
          //   '8月',
          //   '9月',
          //   '10月',
          //   '11月',
          //   '12月',
          // ],
          categories: monthList,
          crosshair: true,
          // 设置标签的样式；
          labels: {
            style: {
              color: '#fff',
            },
          },
        },
      ],
      yAxis: [
        {
          // Primary yAxis
          title: {
            text: '收货量',
            style: {
              color: Highcharts.getOptions().colors[0],
            },
          },
          tickAmount: 6,
          // tickPositions: [0, 2000, 4000, 6000, 8000, 10000], // 指定竖轴坐标点的值
          // 设置标签的样式；
          labels: {
            style: {
              color: '#fff',
            },
          },
        },
        {
          // Secondary yAxis
          title: {
            text: '待检时长',
            style: {
              color: '#00FFFF',
            },
          },
          tickAmount: 6,
          // tickPositions: [65, 70, 75, 80, 85, 90], // 指定竖轴坐标点的值
          // 设置标签的样式；
          labels: {
            style: {
              color: '#fff',
            },
          },
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
        itemStyle: {
          color: '#FFF',
          fontWeight: 'bold',
        },
        x: 5,
        verticalAlign: 'top',
        y: -10,
        floating: true,
        // backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#203864',
        backgroundColor: 'rgba(0,0,0,0)',
      },
      series: [
        {
          name: '收货量',
          type: 'column',
          yAxis: 1, // 双坐标
          data: actualReceiveQty,
          // color: '#FE642E',
        },
        {
          name: '待检时长',
          type: 'spline',
          data: inspectionTime,
          color: '#00FFFF',
        },
      ],
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
          dataLabels: {
            enabled: false, // 设置显示对应y的值
            color: '#fff',
          },
        },
        line: {
          pointPadding: 0.2,
          borderWidth: 0,
          dataLabels: {
            // 开启数据标签
            enabled: false,
            color: '#fff',
          },
        },
      },
    };
    return <HighchartsReact highcharts={Highcharts} options={options} />;
  }
}
