/*
 * @Description: 检验员检验情况
 * @Version: 0.0.1
 * @Autor: 张晨 <chen.zhang03@hand-china.com>
 * @Date: 2021-05-17 18:10:19
 */

import React, { PureComponent } from 'react';
import Chart from '@/utils/chart';

export default class ProductionGroupChart extends PureComponent {
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
        top: 2,
      },
      animation: false,
      legend: {
        show: true,
        bottom: 3,
        textStyle: {
          color: '#c0c9d2',
          fontSize: 10,
        },
        data: ['实际良率', '目标良率', '直通率'],
      },
      color: ['rgb(149, 212, 81)', 'rgb(255, 255, 0)', '#04e6fb'],
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
        left: '10%',
        right: '5%',
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
          lineHeight: 12,
          formatter (value) {
            let newWord;
            value.replace(/^[A-Za-z]{2,3}/, str => {
              newWord = str;
            });
            let newValue;
            if(newWord) {
              newValue = `${newWord}\n${value.slice(newWord.length, 5)}`;
            } else {
              newValue = `${value.slice(0, 2)}\n${value.slice(2, 4)}`;
            }
            return newValue;
          },
        },
        splitLine: {
          show: false,
        },
        data: data.processList,
        // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      },
      yAxis: {
        type: 'value',
        min: 0,
        splitLine: {
          show: true,
          lineStyle: {
            // color: 'rgba(255,255,255,0.1)',
            color: '#ffffff',
          },
        },
        axisLine: {
          show: true,
        },
        axisLabel: {
          show: true,
          margin: 10,
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
          name: '实际良率',
          type: 'line',
          emphasis: {
            focus: 'series',
          },
          stack: '数量',
          lineStyle: {
            color: 'green',
          },
          itemStyle: {
            color: 'green',
          },
          data: data.actualYieldList,
        },
        {
          name: '目标良率',
          type: 'line',
          emphasis: {
            focus: 'series',
          },
          lineStyle: {
            color: 'rgb(255, 255, 0)',
          },
          itemStyle: {
            color: 'rgb(255, 255, 0)',
          },
          data: data.targetYieldList,
        },
        {
          name: '直通率',
          type: 'line',
          emphasis: {
            focus: 'series',
          },
          lineStyle: {
            // color: 'rgb(0, 114, 195)',
            color: data.overFlag === 'N' ? 'red' : '#04e6fb',
          },
          itemStyle: {
            // color: 'rgb(0, 114, 195)',
            color: data.overFlag === 'N' ? 'red' : '#04e6fb',
          },
          data: data.throughRateList,
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
