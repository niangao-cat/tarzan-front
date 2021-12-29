/* eslint-disable prefer-destructuring */
/*
 * @Description: 图表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-12-28 15:06:23
 * @LastEditTime: 2020-12-30 14:57:53
 */
import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

export default class ChartsData extends PureComponent {

  render() {
    const { xAxisData, okData, ngData } = this.props;
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      legend: {
        data: ['不合格批次', '合格批次'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: xAxisData,
        },
      ],
      yAxis: [
        {
          type: 'value',
          boundaryGap: [0, 0.1],
        },
      ],
      series: [
        {
          name: '不合格批次',
          barWidth: 20, // 柱图宽度
          barMaxWidth: 20,
          type: 'bar',
          stack: 'lot',
          data: ngData,
        },
        {
          name: '合格批次',
          barWidth: 20, // 柱图宽度
          barMaxWidth: 20,
          type: 'bar',
          stack: 'lot',
          color: '#3398DB',
          data: okData,
        },
      ],
      dataZoom: [
        {
          type: 'slider',
          height: 15,
          startValue: 0,
          xAxisIndex: [0],
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '100%',
          handleStyle: {
            color: '#0B3C6F',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2,
          },
        },
      ],
    };

    return (
      <ReactEcharts option={option} theme="Imooc" />
    );
  }
}
