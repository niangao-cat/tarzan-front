
import React, { PureComponent } from 'react';
// import { Bind } from 'lodash-decorators';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
// import { PureComponent } from 'react';

export default class ReceivingMaterial extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // categories: [], // 天数
    };
  }



  render() {
    const { badinspectList = [] } = this.props;
    const dayData = [];
    const weekData = [];
    const monthData = [];
    const baddayData = [];
    const badweekData = [];
    const badmonthData = [];
    badinspectList.forEach(item => {
      dayData.push(item.dayNum - item.dayNgNum);
    });
    badinspectList.forEach(item => {
      weekData.push(item.weekendNum - item.weekendNgNum);
    });
    badinspectList.forEach(item => {
      monthData.push(item.mouthNum - item.mouthNgNum);
    });
    badinspectList.forEach(item => {
      baddayData.push(item.dayNgNum);
    });
    badinspectList.forEach(item => {
      badweekData.push(item.weekendNgNum);
    });
    badinspectList.forEach(item => {
      badmonthData.push(item.mouthNgNum);
    });
    const dateList = badinspectList.map(e => e.qcByName);
    const options = {
      title: {
        text: ' ',
        style: {
          fontSize: '12px',
        },
      },
      chart: {
        type: 'column',
        style: {
          width: '100%',
          height: '100%',
        },
        animation: false,
        height: '280px',
        backgroundColor: 'transparent',
      },
      series: [
        {
          name: '日检验数',
          type: 'column',
          allowPointSelect: false,
          data: dayData,
          stack: 'day',
          color: '#00FFFF',
        },
        {
          name: '日检验不良数',
          type: 'column',
          allowPointSelect: false,
          data: baddayData,
          stack: 'day',
          color: '#FF0000',
        },
        {
          name: '周检验数',
          type: 'column',
          allowPointSelect: false,
          data: weekData,
          stack: 'week',
          color: '#00FFFF',
        },
        {
          name: '周检验不良数',
          type: 'column',
          allowPointSelect: false,
          data: badweekData,
          stack: 'week',
          color: '#FF0000',
        },
        {
          name: '月检验数',
          type: 'column',
          allowPointSelect: false,
          data: monthData,
          stack: 'month',
          color: '#00FFFF',
        },
        {
          name: '月检验不良数',
          type: 'column',
          allowPointSelect: false,
          data: badmonthData,
          stack: 'month',
          color: '#FF0000',
        },
      ],
      credits: {
        enabled: false,
      },
      tooltip: {
        enabled: true,
      },
      xAxis: {
        categories: dateList,
        crosshair: true,
      },
      yAxis: {
        title: null,
        tickAmount: 4,
        tickPositions: [0, 2, 4, 6, 8, 10], // 指定竖轴坐标点的值
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
          dataLabels: {
            enabled: true, // 设置显示对应y的值
          },
          stacking: 'normal',
        },
      },
    };
    return <HighchartsReact highcharts={Highcharts} options={options} />;
  }
}
