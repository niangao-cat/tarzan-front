import React from 'react';
// 不是按需加载的话文件太大
// import echarts from 'echarts'
// 导入折线图
import 'echarts/lib/chart/line'; // 折线图是line,饼图改为pie,柱形图改为bar
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';

export default class FoldLineEharts extends React.Component{
  componentWillMount(){

  }

  getOption =()=> {
   const { dataSource = {}, flag } = this.props;
   const { chartList = [] } = dataSource;
   let lineList = [];
   const lineName = chartList.length===0?[]: (flag==='Y'? chartList.map(item=>item.processName):chartList.map(item=>item.areaName));
   for(let i=0; i<chartList.length; i++){
    lineList = [...lineList, {
      name: flag==='Y'? chartList[i].processName:chartList[i].areaName,
      type: 'line',
      data: chartList[i].valueList,
      itemStyle: { normal: {label: {show: true}}},
  }];
   }

   const option = {
    legend: {
      data: lineName,
    },
    xAxis: {
        type: 'category',
        data: dataSource.timeList,
        boundaryGap: false,
        axisLabel: {
          rotate: 80,
          },
    },
    yAxis: {
        type: 'value',
    },

    series: lineList,
};
   return option;
  }

  render(){
    return(
      <div>
        <ReactEcharts option={this.getOption()} notMerge theme="Imooc" />
      </div>
    );
  }
}