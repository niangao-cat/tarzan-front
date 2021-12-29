import React from 'react';
// 不是按需加载的话文件太大
// import echarts from 'echarts'
// 导入折线图
import 'echarts/lib/chart/pie'; // 折线图是line,饼图改为pie,柱形图改为bar
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';
import { Bind } from 'lodash-decorators';


export default class BinEcharts extends React.Component{
  componentWillMount(){

  }

  @Bind
  getOption =()=> {
   const { dataSource } = this.props;

   const option = {

    tooltip: {
        trigger: 'item',
    },
    title: {
      text: `检验量汇总`,
      left: 'center',
    },
    legend: {
        orient: 'horizontal',
        x: 'center',
        y: 'bottom',
        data: ['合格率', '不合格率'],
    },
    color: [ 'green', 'red' ],
    series: [
        {
            name: '检验量汇总',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            label: {
              show: true,
              position: 'inner', // 标签的位置
              formatter: '{d}%',
          },
            data: [
                {value: dataSource.okNum, name: '合格率'},
                {value: dataSource.ngNum, name: '不合格率'},
            ],
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