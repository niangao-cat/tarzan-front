/*
 * @Description: 检验员检验情况
 * @Version: 0.0.1
 * @Autor: 张晨 <chen.zhang03@hand-china.com>
 * @Date: 2021-05-17 18:10:19
 */

import React, { PureComponent } from 'react';
import { isEmpty } from 'lodash';
import Chart from '@/utils/chart';

export default class PoorProcess extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mount: '',
    };
  }

  render() {
    const {
      data = {},
    } = this.props;
    const arr = [];
    const arr1 = [];
    if (data.chartsValueList) {
      data.chartsValueList.map((e) => {
        return arr.push({ value: e.ncCount, name: e.description });
      });
    }
    if (data.chartsValueList) {
      data.chartsValueList.map((e) => {
        return arr1.push({ value: ((e.defectiveRate) * 100).toFixed(2) });
      });
    }
    if (isEmpty(data.chartsValueList)) {
      this.setState({
        mount: '暂无数据',
      });
    } else {
      this.setState({
        mount: data.mcount,
      });
    }
    const option = {
      grid: { top: 0, bottom: 0 },
      tooltip: {
        trigger: 'item',
        formatter: " {b}：{c} ",

        // ({d}%)   代表该模块所占圆环比例
        // formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      title: {
        text: `不良总数\n\n${this.state.mount}`,
        left: "center",
        top: "35%",
        textStyle: {
          color: "#00FFFF",
          fontSize: 9,
          align: "center",
        },
      },
      // 环形颜色
      color: ['#18B1F7', '#FF6A00', '#FFD74D', '#4DDE6D', 'rgba(24,177,247,0.8)', '#01C1B2'],
      series: [
        {
          name,
          type: 'pie',
          radius: ['42%', '50%'],
          center: ['50%', '40%'],
          labelLine: {
            normal: {
              show: true, // 控制线条显示
              length: 10,
              length2: 70,
            },

          },
          label: {
            normal: {
              position: 'outer', // 设置标签位置，默认在饼状图外 可选值：'outer' ¦ 'inner（饼状图上）
              // \n\n可让文字居于牵引线上方，很关键
              //  {b}  代表显示的内容标题
              // {c}代表数据
              // formatter: `{b}:{c}\n\n占比${5}%`,
              // formatter: '\n\n{b}:{c}/{d}%',
              formatter(val) {
                if (val.name && val.name.length > 10) {
                  return `\n\n${val.name.slice(0, 10)}...:${val.value}/${val.value}%`;
                } else {
                  return `\n\n${val.name}:${val.value}/${val.percent}%`;;
                }
              },
              textStyle: {
                fontWeight: 'normal',
                fontSize: 8,
              },
              borderWidth: 20,
              borderRadius: 4,
              padding: [0, -70],
            },
          },
          data: arr,
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
