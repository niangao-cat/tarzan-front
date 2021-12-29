/*
 * @Description: 完工统计-产品节拍-交接注意事项
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-09 17:56:29
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-04-10 19:22:46
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Form, Table, Input, Button, Row, Col } from 'hzero-ui';
import { tableScrollWidth } from 'utils/utils';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const { TextArea } = Input;
@Form.create({ fieldNameProp: null })
export default class MidInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const columns = [
      {
        title: '产品',
        dataIndex: 'remark',
        width: 40,
        align: 'center',
      },
      {
        title: '生产工单',
        dataIndex: 'remark',
        width: 90,
        align: 'center',
      },
      {
        title: '派工数量',
        dataIndex: 'remark',
        width: 90,
        align: 'center',
      },
      {
        title: '本班投产',
        dataIndex: 'remark',
        width: 90,
        align: 'center',
      },
      {
        title: '本班完成',
        dataIndex: 'remark',
        width: 90,
        align: 'center',
      },
      {
        title: '不良数',
        dataIndex: 'remark',
        width: 90,
        align: 'center',
      },
    ];
    const options = {
      title: {
        text: null,
        style: {
          fontSize: '12px',
        },
      },
      chart: {
        type: 'line',
        style: {
          width: '100%',
          height: '100%',
        },
        animation: false,
        height: '182px',
        backgroundColor: 'transparent',
      },
      series: [
        {
          type: 'line',
          allowPointSelect: false,
          data: [398, 421, 434, 472, 477],
        },
      ],
      credits: {
        enabled: false,
      },
      tooltip: {
        enabled: false,
      },
      xAxis: {
        categories: ['08:00', '09:00', '10:00', '11:00', '12:00'],
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
        <Row>
          <div>完工统计</div>
          <Table
            columns={columns}
            scroll={{ x: tableScrollWidth(columns) }}
            rowKey="workOrderId"
            bordered
          />
        </Row>
        <Row>
          <div>产品节拍</div>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </Row>
        <Row>
          <div>交接注意事项</div>
          <Form>
            <Row>
              <Col>
                <Form.Item>{getFieldDecorator('workshop', {})(<TextArea rows={4} />)}</Form.Item>
              </Col>
              <Col span={24} style={{ textAlign: 'end' }}>
                <Form.Item>
                  <Button
                    data-code="search"
                    type="primary"
                    htmlType="submit"
                    style={{ backgroundColor: '#008002' }}
                  >
                    保存
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Row>
      </React.Fragment>
    );
  }
}
