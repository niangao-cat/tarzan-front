import React, { PureComponent } from 'react';
import Chart from '@/utils/chart';

export default class SunriseLibraryTaskSummary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      dataSource = [],
    } = this.props;
    const colorList = ['#81BEF7', '#BDBDBD', '#F5DA81'];
    const newDataSource = dataSource && dataSource.length > 0 && dataSource.map((item, index) => {
      return {
        value: item.counts,
        name: item.statusListMeaning,
        label: {
          formatter: '{d}%',
          color: 'white',
        },
        itemStyle: {
          color: colorList[index],
        },
      };
    });
    const option = {
      title: {
        text: '日出库任务汇总',
        top: 10,
        left: 'center',
        textStyle: {
          color: '#000000',
          fontSize: 12,
        },
      },

      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },

      legend: {
        orient: 'vertical',
        bottom: '3%',
        right: '2%',
        textStyle: {
          color: '#000000',
        },
      },

      series: [
        {
          name: '日出库任务',
          type: 'pie',
          radius: ['0%', '55%'],
          center: ['50%', '50%'],
          data: newDataSource,
          // data: [
          //   {
          //     value: 1048,
          //     name: '排队',
          //     label: {
          //       formatter: '{d}%',
          //       color: 'white',
          //     },
          //     itemStyle: {
          //       color: '#81BEF7',
          //     },
          //   },
          //   {
          //     value: 735,
          //     name: '完成',
          //     label: {
          //       formatter: '{d}%',
          //       color: 'white',
          //     },
          //     itemStyle: {
          //       color: '#BDBDBD',
          //     },
          //   },
          //   {
          //     value: 580,
          //     name: '取消',
          //     label: {
          //       formatter: '{d}%',
          //       color: 'white',
          //     },
          //     itemStyle: {
          //       color: '#F5DA81',
          //     },
          //   },
          // ],
          itemStyle: {
            normal: {
              label: {
                show: false,
              },
              labelLine: {
                show: false,
              },
            },
          },
          // labelLine: {
          //   show: false,
          // },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
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
