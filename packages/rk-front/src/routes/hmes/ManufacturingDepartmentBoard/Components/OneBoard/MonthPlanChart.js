/*
 * @Description: 检验员检验情况
 * @Version: 0.0.1
 * @Autor: 张晨 <chen.zhang03@hand-china.com>
 * @Date: 2021-05-17 18:10:19
 */

import React, { PureComponent } from 'react';
import Chart from '@/utils/chart';

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
    // const { productionList, completedList, planCompleteList, unCompletedList } = data;
    // const newProductionList = isArray(productionList) ? cloneDeep(productionList).reverse() : [];
    // const newCompletedList = isArray(completedList) ? cloneDeep(completedList).reverse() : [];
    // const newPlanCompleteList = isArray(planCompleteList) ? cloneDeep(planCompleteList).reverse(): [];
    // const newUnCompletedList = isArray(unCompletedList) ? cloneDeep(unCompletedList).reverse() : [];
    const value1 = (data.monthRate)*100;
    const value2 = 100 - value1;
    const option = {
      tooltip: {
        show: false,
          trigger: 'item',
          formatter: "{a} : {c} ({d}%)",
      },
      title: {
          text: `${value1}%`,
          left: "center",
          top: "45%",
          textStyle: {
            color: "rgb(50,197,233)",
            fontSize: 16,
            align: "center",
          },
        },
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['50%', '40%'],
          avoidLabelOverlap: true,
           label: { // 对应效果图中的Angular显示与否以及设置样式
              show: true,
              // position: 'center',
              normal: {
                formatter(){
                return '当月达成率';
              },
                textStyle: {
                  color: '#00FFFF',
                  margin: [100, 0, 0, 0],
                },
                show: true,
                position: 'center', // 设置字angular的边距
                fontSize: 12,
              },
            },
          emphasis: {
          },
          labelLine: {
              normal: { // label线不显示
                show: false,
              },
            },
          data: [
              {
                name: 'Angular', // 数据，name对应Angular
                value: value1, // 对应显示的部分数据即80%
                itemStyle: {
                  normal: {
                    color: '#2B92FD',
                  },
                },
              },
              {
                value: value2,
                itemStyle: {
                  normal: {
                    color: '#2B5989',
                  },
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
