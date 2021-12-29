/*
 * @Description: 质量
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-10 18:29:28
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-08-05 00:41:16
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Form } from 'hzero-ui';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import styles from '../index.less';

@Form.create({ fieldNameProp: null })
export default class Quality extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { operationQuality } = this.props;
    const { xdataList = [], ydataList = [] } = operationQuality;
    const options = {
      title: {
        text: null,
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
        height: '170px',
        backgroundColor: 'transparent',
      },
      series: [
        {
          name: '数量',
          allowPointSelect: false,
          data: ydataList,
        },
      ],
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: xdataList,
        tickPosition: 'outside',
        labels: {
          style: {
            // color: '#fff',
            fontSize: '10px',
          },
        },
      },
      yAxis: {
        title: null,
        tickAmount: 4,
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        line: {
          dataLabels: {
            // 开启数据标签
            enabled: true,
          },
        },
      },
    };
    return (
      <React.Fragment>
        <div className={styles.title} style={{ marginTop: '4px' }}>
          <div className={styles.colorDiv} />
          <span>工艺质量</span>
        </div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </React.Fragment>
    );
  }
}
