import React from 'react';
// 不是按需加载的话文件太大
// import echarts from 'echarts'
// 导入折线图
import 'echarts/lib/chart/bar'; // 折线图是line,饼图改为pie,柱形图改为bar
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
        formatter: '{a} <br/>{b} : {c}%',
    },
    series: [
        {
            name: "综合开机率",		// 系列名称,用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
	            type: "gauge",			// 系列类型
	            radius:	"80%",			// 参数:number, string。 仪表盘半径,默认 75% ，可以是相对于容器高宽中较小的一项的一半的百分比，也可以是绝对的数值。
	            center: ["50%", "55%"],	// 仪表盘位置(圆心坐标)
	            startAngle: 225,		// 仪表盘起始角度,默认 225。圆心 正右手侧为0度，正上方为90度，正左手侧为180度。
	            endAngle: -45,			// 仪表盘结束角度,默认 -45
	            clockwise: true,		// 仪表盘刻度是否是顺时针增长,默认 true。
	            min: 0,					// 最小的数据值,默认 0 。映射到 minAngle。
	            max: 100,				// 最大的数据值,默认 100 。映射到 maxAngle。
	            splitNumber: 10,
            itemStyle: {
                height: 200,
            },

            data: [{value: 50, name: ''}],
            axisLine: {				// 仪表盘轴线(轮廓线)相关配置。
                show: true,				// 是否显示仪表盘轴线(轮廓线),默认 true。
                lineStyle: {			// 仪表盘轴线样式。
                    color: [[0.2, '#c23531'], [0.8, '#63869e'], [1, '#91c7ae']], 	// 仪表盘的轴线可以被分成不同颜色的多段。每段的  结束位置(范围是[0,1]) 和  颜色  可以通过一个数组来表示。默认取值：[[0.2, '#91c7ae'], [0.8, '#63869e'], [1, '#c23531']]
                    opacity: 1,					// 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                    width: 18,					// 轴线宽度,默认 30。
                    shadowBlur: 20,				// (发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                    shadowColor: "#fff",		// 阴影颜色。支持的格式同color。
                },
            },
            splitLine: {			// 分隔线样式。
                show: true,				// 是否显示分隔线,默认 true。
                length: 7,				// 分隔线线长。支持相对半径的百分比,默认 30。
                lineStyle: {			// 分隔线样式。
                    color: "#eee",				// 线的颜色,默认 #eee。
                    opacity: 1,					// 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                    width: 0,					// 线度,默认 2。
                    type: "solid",				// 线的类型,默认 solid。 此外还有 dashed,dotted
                    shadowBlur: 10,				// (发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                    shadowColor: "#fff",		// 阴影颜色。支持的格式同color。
                },
            },

            axisTick: {				// 刻度(线)样式。
                show: false,				// 是否显示刻度(线),默认 true。
                splitNumber: 5,			// 分隔线之间分割的刻度数,默认 5。
                length: 8,				// 刻度线长。支持相对半径的百分比,默认 8。
                lineStyle: {			// 刻度线样式。
                    color: "#eee",				// 线的颜色,默认 #eee。
                    opacity: 1,					// 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                    width: 1,					// 线度,默认 1。
                    type: "solid",				// 线的类型,默认 solid。 此外还有 dashed,dotted
                    shadowBlur: 10,				// (发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                    shadowColor: "#fff",		// 阴影颜色。支持的格式同color。
                },
            },

            axisLabel: {			// 刻度标签。
                show: true,				// 是否显示标签,默认 true。
                distance: 12,			// 标签与刻度线的距离,默认 5。
                color: "#000",			// 文字的颜色,默认 #fff。
                fontSize: 12,			// 文字的字体大小,默认 5。
                formatter: "{value}",	// 刻度标签的内容格式器，支持字符串模板和回调函数两种形式。 示例:// 使用字符串模板，模板变量为刻度默认标签 {value},如:formatter: '{value} kg'; // 使用函数模板，函数参数分别为刻度数值,如formatter: function (value) {return value + 'km/h';}
            },
            pointer: {				// 仪表盘指针。
                show: true,				// 是否显示指针,默认 true。
                length: "70%",			// 指针长度，可以是绝对数值，也可以是相对于半径的百分比,默认 80%。
                width: 5,				// 指针宽度,默认 8。
            },
            detail: {				// 仪表盘详情，用于显示数据。
                show: true,				// 是否显示详情,默认 true。
                offsetCenter: [0, "50%"], // 相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
                color: "auto",			// 文字的颜色,默认 auto。
                fontSize: 20,			// 文字的字体大小,默认 15。
                formatter: "{value}%",	// 格式化函数或者字符串
            },
        },
    ],
};
   return option;
  }

  render(){
    return(
      <div>
        <span style={{marginLeft: '3vw', marginTop: '2vw', fontSize: '1vw', fontWeight: 'bold'}}>综合开机率</span>
        <ReactEcharts option={this.getOption()} theme="Imooc" style={{height: '11vw', width: '11vw'}} />
      </div>
    );
  }
}