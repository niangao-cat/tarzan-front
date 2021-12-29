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
   const { dataSource } = this.props;
   const option = {
    title: {
      text: '检验量趋势',
      left: 'center',
    },
    xAxis: {
        type: 'category',
        data: dataSource.xdataList,
        boundaryGap: false,
        axisLabel: {
          rotate: 80,
          },
    },
    yAxis: {
        type: 'value',
    },
    series: [{
        type: 'line',
        data: dataSource.ydataList,
        itemStyle: { normal: {label: {show: true}}},
    }],
};
   return option;
  }

  render(){
    return(
      <div>
        <ReactEcharts option={this.getOption()} theme="Imooc" />
      </div>
    );
  }
}