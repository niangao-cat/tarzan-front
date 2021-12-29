/*
 * @Description: 饼状图
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-10-20 15:12:51
 * @LastEditTime: 2020-11-20 09:14:29
 */
import React, { PureComponent } from 'react';
import Chart from '@/utils/chart';
import echarts from 'echarts/lib/echarts';


export default class PieCharts extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // 设置时间
  componentDidMount() {
  }


  render() {
    const { completedQty, dispatchQty, title } = this.props;
    const option = {
      title: {
        text: `${title} ${dispatchQty === 0 ? 100 : Math.round(completedQty / dispatchQty * 10000) / 100.00}%`,
        left: '45%',
        top: '40%',
        textAlign: 'center',
        textStyle: {
          fontSize: '16',
          fontWeight: '500',
          color: '#909dff',
          textAlign: 'center',
        },
      },
      series: [
        {
          type: 'pie',
          radius: ['80%', '100%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '30',
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: dispatchQty === 0 ? 100 : Math.round(completedQty / dispatchQty * 10000) / 100.00,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#5a8bfa',
                    },
                    {
                      offset: 1,
                      color: '#831bdb',
                    },
                  ]),
                  shadowColor: 'rgba(175,143,230,.5)',
                  shadowBlur: 10,
                },
              },
              label: {
                show: false,
              },
              labelLine: {
                normal: {
                  smooth: true,
                  lineStyle: {
                    width: 0,
                  },
                },
              },
              hoverAnimation: false,
            },
            {
              label: {
                show: false,
              },
              labelLine: {
                normal: {
                  smooth: true,
                  lineStyle: {
                    width: 0,
                  },
                },
              },
              value: dispatchQty === 0 ? 0 : 100 - ((Math.round(completedQty / dispatchQty * 10000) / 100.00) > 100 ? 100 : Math.round(completedQty / dispatchQty * 10000) / 100.00),
              hoverAnimation: true,
              itemStyle: {
                color: 'rgba(79,76,192, 0.3)',
              },
            },
          ],
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
