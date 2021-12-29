/*
 * @Description: 检验员检验情况
 * @Version: 0.0.1
 * @Autor: 张晨 <chen.zhang03@hand-china.com>
 * @Date: 2021-05-17 18:10:19
 */

import React, { PureComponent } from 'react';
import Chart from '@/utils/chart';
import echarts from 'echarts';

export default class InspectorInspectionCharts extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      data = {},
    } = this.props;
    const option = {
      title: {
        text: data.title,
        textStyle: {
          color: '#fff',
          fontSize: 12,
        },
        left: 'center',
      },
      animation: false,
      legend: {
        show: false,
      },
      color: ['#04e6fb'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          lineStyle: {
            color: {
              type: 'shadow',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(0, 255, 233,0)',
                },
                {
                  offset: 0.5,
                  color: 'rgba(255, 255, 255,1)',
                },
                {
                  offset: 1,
                  color: 'rgba(0, 255, 233,0)',
                },
              ],
              global: false,
            },
          },
          type: 'shadow',
        },
      },
      grid: {
        top: '15%',
        bottom: '15%',
      },
      xAxis: {
        type: 'category',
        axisLine: {
          show: true,
        },
        splitArea: {
          color: '#f00',
          lineStyle: {
            color: '#f00',
          },
        },
        axisLabel: {
          color: '#BCDCF0',
          textStyle: {
            fontSize: 10,
          },
          formatter (value) {
            if(value && value.length > 4) {
              return `${value.slice(0, 4)}..`;
            }
            return value;
          },
        },
        splitLine: {
          show: false,
        },
        data: data.ncList,
        // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      },
      yAxis: {
        type: 'value',
        min: 0,
        splitLine: {
          show: true,
          lineStyle: {
            // color: 'rgba(255,255,255,0.1)',
            color: '#ffffffd3',
          },
        },
        axisLine: {
          show: true,
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#d1e6eb',
            fontSize: 10,
          },
        },
        axisTick: {
          show: false,
        },
      },
      series: [
        {
          name: '不良数量',
          type: 'bar',
          emphasis: {
            focus: 'series',
          },
          label: {
            show: true,
            textStyle: {
              color: '#043b80',
              fontSize: 10,
            },
          },
          itemStyle: {
            barBorderRadius: [5, 5, 0, 0],
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                {offset: 0, color: '#50aff8'},
                {offset: 1, color: '#6be6f8'},
              ]
            ),
          },
          data: data.ncNumberList,
          // data: [120, 132, 101, 134, 90, 230, 210],
          barWidth: 18, // 柱图宽度
        },
      ],
    };
    return (
      <Chart
        option={option}
      />
    );
  }
}
