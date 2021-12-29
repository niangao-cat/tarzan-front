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

export default class Line extends React.Component{
  componentWillMount(){

  }

  getOption =()=> {
   const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}',
        },
    //     grid: {
    //         height: 220,
    //         width: 200,
    //    },
       legend: {
        orient: 'horizontal',
        left: 'center',
        bottom: '0',
        data: ['运行', '故障', '待定'],
    },
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: ['60%', '82%'],
                avoidLabelOverlap: false,
                label: {
                    formatter: '{c}',
                    show: true,
                    style: {
                        color: 'white',
                    },
                    align: 'center',
                    position: 'inside',
                },
                emphasis: {
                    label: {
                        show: false,
                        fontSize: '30',
                        fontWeight: 'bold',
                    },
                },
                labelLine: {
                    show: false,
                },
                data: [
                    {value: 1, name: '运行', itemStyle: {color: 'red'}},
                    {value: 8, name: '故障', itemStyle: {color: 'orange'}},
                    {value: 15, name: '待定', itemStyle: {color: 'rgba(39,190,206)'}},
                ],
            },
        ],
    };
   return option;
  }

  render(){
    return(
      <div>
        <span style={{marginLeft: '3.5vw', marginTop: '2vw', fontSize: '1vw', fontWeight: 'bold'}}>运行状态</span>
        <ReactEcharts option={this.getOption()} theme="Imooc" style={{height: '280px', width: '200px', marginTop: '-1.5vw'}} />
      </div>
    );
  }
}