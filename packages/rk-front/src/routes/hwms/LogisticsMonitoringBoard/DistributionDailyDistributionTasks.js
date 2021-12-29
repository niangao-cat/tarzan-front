import React from 'react';
import Echarts from '@/components/Echarts';


const DistributionDailyDistributionTasks = React.memo(props => {
  const options = {
    title: {
      text: '日配送任务分布',
      left: 'center',
      top: 20,
      textStyle: {
        color: 'white',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      top: 70,
      right: 75,
      textStyle: {
        color: 'white',
      },
    },
    series: [
      {
        name: '当日配送任务',
        type: 'pie',
        radius: ['0%', '20%'],
        top: -200,
        left: -150,
        data: props.dataSource,
        // data: [
        //   {
        //     value: 1048,
        //     name: '新建',
        //     label: {
        //       formatter: '{d}%',
        //       color: 'white',
        //     },
        //     itemStyle: {
        //       color: '#F33148',
        //     },
        //   },
        //   {
        //     value: 735,
        //     name: '下达',
        //     label: {
        //       formatter: '{d}%',
        //       color: 'white',
        //     },
        //     itemStyle: {
        //       color: '#FF4D42',
        //     },
        //   },
        //   {
        //     value: 580,
        //     name: '备料中',
        //     label: {
        //       formatter: '{d}%',
        //       color: 'white',
        //     },
        //     itemStyle: {
        //       color: '#FFE699',
        //     },
        //   },
        //   {
        //     value: 484,
        //     name: '备料完成',
        //     label: {
        //       formatter: '{d}%',
        //       color: 'white',
        //     },
        //     itemStyle: {
        //       color: '#FFD966',
        //     },
        //   },
        //   {
        //     value: 300,
        //     name: '签收中',
        //     label: {
        //       formatter: '{d}%',
        //       color: 'white',
        //     },
        //     itemStyle: {
        //       color: '#C5E0B4',
        //     },
        //   },
        //   {
        //     value: 300,
        //     name: '签收完成',
        //     label: {
        //       formatter: '{d}%',
        //       color: 'white',
        //     },
        //     itemStyle: {
        //       color: '#A9D18E',
        //     },
        //   },
        //   {
        //     value: 300,
        //     name: '关闭',
        //     label: {
        //       formatter: '{d}%',
        //       color: 'white',
        //     },
        //     itemStyle: {
        //       color: '#767171',
        //     },
        //   },
        // ],
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
    <React.Fragment>
      <div>
        <Echarts option={options} />
      </div>
    </React.Fragment>
  );
});

export default DistributionDailyDistributionTasks;
