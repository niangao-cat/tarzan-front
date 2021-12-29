/*
 * @Description: 检验员检验情况
 * @Version: 0.0.1
 * @Autor: 张晨 <chen.zhang03@hand-china.com>
 * @Date: 2021-05-17 18:10:19
 */

import React, { PureComponent } from 'react';
import { cloneDeep } from 'lodash';
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
    const { productionList, completedList, planCompleteList, unCompletedList } = data;
    const newProductionList = cloneDeep(productionList).reverse();
    const newCompletedList = cloneDeep(completedList).reverse();
    const newPlanCompleteList = cloneDeep(planCompleteList).reverse();
    const newUnCompletedList = cloneDeep(unCompletedList).reverse();
    const option = {
      title: {
        show: false,
      },
      animation: false,
      legend: {
        show: true,
        bottom: 3,
        textStyle: {
          color: '#c0c9d2',
          fontSize: 10,
        },
        data: ['计划完成', '已完成'],
      },
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
        bottom: '10%',
        top: 'top',
        right: '8%',
        left: '18%',
      },
      xAxis: {
        type: 'value',
        // axisLine: {
        //   show: true,
        // },
        axisLabel: {
          show: false,
        },
        splitArea: {
          color: '#f00',
          lineStyle: {
            color: '#f00',
          },
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'category',
        min: 0,
        axisLabel: {
          margin: 40,
          textStyle: {
            color: '#d1e6eb',
            fontSize: 10,
          },
          verticalAlign: 'middle',
          align: 'center',
          formatter (value) {
            if(value && value.length > 8) {
              return `${value.slice(0, 8)}\n${value.slice(8, value.length)}`;
            }
            return value;
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        data: newProductionList,
      },
      series: [
        {
          name: '计划完成',
          type: 'bar',
          emphasis: {
            focus: 'series',
          },
          itemStyle: {
            barBorderRadius: [5, 5, 5, 5],
            color: new echarts.graphic.LinearGradient(
              1, 0, 0, 0,
              [
                {offset: 0, color: '#ffff00'},
                {offset: 1, color: '#f5c242'},
              ]
            ),
          },
          label: {
            show: true,
            textStyle: {
              color: '#fff',
              fontSize: 10,
            },
            position: 'right',
            padding: [2, 0, 0, 0],
          },
          barGap: '0%',
          data: newPlanCompleteList,
          barWidth: 14,
        },
        {
          name: '已完成',
          type: 'bar',
          stack: '已完成',
          emphasis: {
            focus: 'series',
          },
          itemStyle: {
            barBorderRadius: [5, 5, 5, 5],
            color: new echarts.graphic.LinearGradient(
              1, 0, 0, 0,
              [
                {offset: 0, color: '#66cc88'},
                {offset: 1, color: '#468c77'},
              ]
            ),
          },
          label: {
            show: true,
            textStyle: {
              color: '#fff',
              fontSize: 10,
            },
            position: 'right',
            padding: [2, 0, 0, 0],
          },
          areaStyle: {
            normal: {
              shadowColor: 'rgba(0,179,244, 0.9)',
              shadowBlur: 20,
            },
          },
          barGap: '0%',
          data: newCompletedList,
          barWidth: 14,
        },
        {
          name: '已完成',
          type: 'bar',
          stack: '已完成',
          emphasis: {
            focus: 'series',
          },
          itemStyle: {
            barBorderRadius: [5, 5, 5, 5],
            color: new echarts.graphic.LinearGradient(
              1, 0, 0, 0,
              [
                {offset: 0, color: '#e8362e'},
                {offset: 1, color: '#da4d49'},
              ]
            ),
          },
          label: {
            show: true,
            textStyle: {
              color: '#fff',
              fontSize: 10,
            },
            position: 'right',
            padding: [2, 0, 0, 0],
          },
          areaStyle: {
            normal: {
              shadowColor: 'rgba(0,179,244, 0.9)',
              shadowBlur: 20,
            },
          },
          barGap: '0%',
          data: newUnCompletedList,
          barWidth: 14,
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
