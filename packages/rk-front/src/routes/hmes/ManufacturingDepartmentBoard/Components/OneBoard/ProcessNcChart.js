/*
 * @Description: 检验员检验情况
 * @Version: 0.0.1
 * @Autor: 张晨 <chen.zhang03@hand-china.com>
 * @Date: 2021-05-17 18:10:19
 */

import React, { PureComponent } from 'react';
import { isEmpty } from 'lodash';
import Chart from '@/utils/chart';

import styles from './index.less';

export default class InspectorInspectionCharts extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mount: '',
    };
  }

  render() {
    const {
      data = [],
    } = this.props;
    const list = [];
    const map = [];
    let valuename;// top产线
    let valuenames;// 直通率产线
    if (data.chartsValueList.length !== 0) {
      valuename = data.chartsValueList[0].prodLineName;
    };
    if (data.proLineName) {
      valuenames = data.proLineName;// 直通率与top产线优先展示
      this.setState({
        mount: valuenames,
      });
    };

    if (data.chartValueList) {
      data.chartValueList.map((e) => {
        return list.push([e.productionGroupCode]);
      });
    }
    if (data.chartValueList) {
      data.chartValueList.map((e) => {
        return map.push(((e.throughRate) * 100).toFixed(0));
      });
    }
    if (data.proLineName === '' || data.proLineName === null || data.proLineName === undefined) {
      this.setState({
        mount: valuename,
      });
    }
    const option = {
      // 设置柱状图位置，x：与左侧边界距离；y：与上侧边界距离；width：柱状图宽度；height：柱状图高度
      grid: {
        top: '20%',
        left: '15%',
        bottom: '18%',
        right: '5%',
      },
      // 图表标题设置，其内容以及位置
      title: {
        text: this.state.mount,
        textStyle: {
          color: '#00ffff',
          fontSize: 12,
        },
        left: 'center',
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
      // X轴
      xAxis: [
        {
          gridIndex: 0, // 定义index
          type: 'category',
          data: list,
          axisLabel: {
            rotate: 30,
            show: true,
            textStyle: {
              color: '#2B92FD',
              fontSize: 10,
            },
            formatter(value) {
              if (value && value.length > 5) {
                return `${value.slice(0, 5)}...`;
              } else {
                return value;
              }
            },
          },
          splitLine: {
            show: false,
          },
          nameRotate: 30,
          axisLine: {
            lineStyle: {
              color: '#2B92FD',
            },
          },
        },
      ],
      yAxis: [ // y轴
        {
          gridIndex: 0,
          axisLabel: {
            textStyle: {
              fontFamily: 'PingFang-SC-Medium',
              color: 'rgba(240, 235, 235, 0.5)',
              fontSize: 10,
            },
            show: true,
            interval: 'auto',
            formatter: '{value} %',
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#2B92FD',
            },
          },
        }, // 定义y轴index
      ],
      series: [
        {
          type: 'bar',
          xAxisIndex: 0, // 使用x轴的index-0，y轴的index-0
          yAxisIndex: 0,
          show: false, // 是否进行展示
          data: map,
          barMaxWidth: 40,
          barMinWidth: 10,
          itemStyle: {
            normal: {
              color: '#2B92FD',
              label: {
                show: true,
                formatter: `{c}%`,
                position: 'top',
                textStyle: {
                  color: '#2B92FD',
                  fontSize: 10,
                },
              },
            },
          },
        },

      ],

    };
    return (
      <div style={{ height: '2.7rem' }}>
        {isEmpty(list) ? (
          <div>
            <div className={styles.directRate} style={{ marginBottom: '1rem' }}>{this.state.mount}</div>
            <div className={styles.directRate}>暂无数据</div>
          </div>
        ) : (
          <Chart
            option={option}
          />
        )}
      </div>
    );
  }
}
