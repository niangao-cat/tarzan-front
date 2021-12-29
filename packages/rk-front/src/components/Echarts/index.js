import React, { PureComponent } from 'react';
import echarts from 'echarts';

/* eslint-disable */
export default class ECharts extends PureComponent {
  componentDidMount() {
    this.echart = echarts.init(this.refs.echart_react);
    this.echart.setOption(this.props.option);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.echart.setOption(nextProps.option, true);
    return true;
  }

  componentWillUnmount() {
    this.echart.dispose();
  }

  render() {
    return <div ref="echart_react" style={{ height: '500px', width: '500px' }} />;
  }
}
/* eslint-enable */
