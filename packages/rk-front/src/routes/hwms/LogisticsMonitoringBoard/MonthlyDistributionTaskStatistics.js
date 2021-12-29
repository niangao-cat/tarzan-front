import React from 'react';
import Echarts from '@/components/Echarts';
import echarts from 'echarts';

const DistributionDailyDistributionTasks = React.memo(props => {
  const nowDate = new Date();
  const tYear = nowDate.getFullYear();
  const options = {
    title: {
      text: `${tYear}年每月配送任务统计图`,
      left: 'center',
      top: 20,
      textStyle: {
        color: 'white',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999',
        },
      },
    },
    grid: {
      height: '30%',
      top: '12%',
    },
    // toolbox: {
    //   feature: {
    //     dataView: { show: true, readOnly: false },
    //     magicType: { show: true, type: ['line', 'bar'] },
    //     restore: { show: true },
    //     saveAsImage: { show: true },
    //   },
    // },
    // legend: {
    //     data: ['降水量', '平均温度']
    // },
    xAxis: [
      {
        type: 'category',
        data: [
          '1月',
          '2月',
          '3月',
          '4月',
          '5月',
          '6月',
          '7月',
          '8月',
          '9月',
          '10月',
          '11月',
          '12月',
        ],
        axisPointer: {
          type: 'shadow',
        },
        axisLabel: {
          color: '#fff',
        },
        axisLine: {
          lineStyle: {
            color: '#fff',
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '配送单数量',
        nameTextStyle: {
          color: '#fff',
        },
        min: 0,
        max: 'dataMax',
        axisLabel: {
          formatter: '{value}',
          color: '#fff',
        },
        axisLine: {
          lineStyle: {
            color: '#fff',
          },
        },
      },
    ],
    series: [
      {
        name: '配送单数量',
        type: 'bar',
        barWidth: '15',
        itemStyle: {
            // normal: { color: '#00C5CB' },
          normal: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
              offset: 0,
              color: "#00E2C4", // 0% 处的颜色
            }, {
              offset: 1,
              color: "#00C5CB", // 100% 处的颜色
            }], false),
          },
        },
        data: props.dataSource,
      },
      {
        name: '配送单数量',
        type: 'line',
        itemStyle: {
          normal: { color: '#00FFFF' },
        },
        data: props.dataSource,
      },
    ],
  };
  return (
    <React.Fragment>
      <div style={{ paddingLeft: '50px' }}>
        <Echarts option={options} />
      </div>
    </React.Fragment>
  );
});

export default DistributionDailyDistributionTasks;
