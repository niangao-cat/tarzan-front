/*
 * @Description: 检验员检验情况
 * @Version: 0.0.1
 * @Autor: 张晨 <chen.zhang03@hand-china.com>
 * @Date: 2021-05-17 18:10:19
 */

import React, { PureComponent } from 'react';
import Chart from '@/utils/chart';
import { isArray } from 'lodash';

export default class InspectorInspectionCharts extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      inspectorInspectionData = {},
    } = this.props;
    const option = {
      title: {
        show: false,
      },
      legend: {
        show: true,
        bottom: 3,
        textStyle: {
          color: '#c0c9d2',
          fontSize: 14,
        },
        data: ['合格数量', '不良数量'],
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
        top: '15%',
        left: '10%',
        right: '5%',
        bottom: '18%',
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
            fontSize: 14,
          },
        },
        splitLine: {
          show: false,
        },
        data: inspectorInspectionData && inspectorInspectionData.realNames,
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
          margin: 10,
          textStyle: {
            color: '#d1e6eb',
            fontSize: 14,
          },
        },
        axisTick: {
          show: false,
        },
      },
      series: [
        {
          name: '合格数量',
          type: 'bar',
          emphasis: {
            focus: 'series',
          },
          stack: '数量',
          lineStyle: {
            normal: {
              color: '#00b3f4',
              shadowColor: 'rgba(0, 0, 0, .3)',
              shadowBlur: 0,
              shadowOffsetY: 5,
              shadowOffsetX: 5,
            },
          },
          label: {
            show: true,
            textStyle: {
              color: '#fff',
              fontSize: 14,
              // color: '#00b3f4',
            },
          },
          // 鼠标放上去还是要有颜色的
          itemStyle: {
            color: 'green',
          },
          // 设置渐变色
          areaStyle: {
          },
          data: isArray(inspectorInspectionData.standardQuantitys) ? inspectorInspectionData.standardQuantitys.map(e => (e === 0 ? '-' : e)) : [],
          // data: [120, 132, 101, 134, 90, 230, 210],
          barWidth: 40, // 柱图宽度
        },
        {
          name: '不良数量',
          type: 'bar',
          emphasis: {
            focus: 'series',
          },
          stack: '数量',
          lineStyle: {
            normal: {
              color: '#00b3f4',
              shadowColor: 'rgba(0, 0, 0, .3)',
              shadowBlur: 0,
              shadowOffsetY: 5,
              shadowOffsetX: 5,
            },
          },
          label: {
            show: true,
            textStyle: {
              color: '#fff',
              fontSize: 14,
              // color: '#00b3f4',
            },
          },
          // 鼠标放上去还是要有颜色的
          itemStyle: {
            // color: '#00b3f4',
            color: 'red',
          },
          // 设置渐变色
          areaStyle: {
            normal: {
              shadowColor: 'rgba(0,179,244, 0.9)',
              shadowBlur: 20,
            },
          },
          // data: [3, 3, 4, 5, 6, 7, 8],
          data: isArray(inspectorInspectionData.inspectionBadQuantitys) ? inspectorInspectionData.inspectionBadQuantitys.map(e => (e === 0 ? '-' : e)) : [],
          barWidth: 40, // 柱图宽度
        },
        {
          name: '总计',
          type: 'bar',
          stack: '数量',
          label: {
            normal: {
              position: 'insideBottom',
              show: true,
              textStyle: { color: '#fff', fontSize: 14 },
              formatter(v) {
                return `总计：${v.value}`;
              },
              offset: [0, -10],
            },
          },
          itemStyle: {
            normal: {
              color: 'rgba(128, 128, 128, 0)',
            },
          },
          data: inspectorInspectionData && inspectorInspectionData.inspectionQuantitys,
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
