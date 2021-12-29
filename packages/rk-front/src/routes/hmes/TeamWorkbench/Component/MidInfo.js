/*
 * @Description: 完工统计-产品节拍-交接注意事项
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-09 17:56:29
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-09-25 09:23:19
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Form, Table, Input, Button, Row, Col } from 'hzero-ui';
import { tableScrollWidth } from 'utils/utils';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { connect } from 'dva';
// import { Scrollbars } from 'react-custom-scrollbars';
import { isFunction, isEmpty, isUndefined } from 'lodash';
import styles from '../index.less';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import secondTitleImg from '@/assets/JXblue.png';

const { TextArea } = Input;
@connect(({ teamWorkbench }) => ({
  teamWorkbench,
}))
@Form.create({ fieldNameProp: null })
export default class MidInfo extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {};
  }

  @Bind()
  onSearch(fields={}){
    const { dispatch, fieldsValue={}, defaultSite={}, openEndShift={} } = this.props;
    dispatch({
      type: 'teamWorkbench/fetchCompletionStatistics',
      payload: {
        siteId: defaultSite.siteId,
        lineWorkcellId: fieldsValue.lineWorkcellId,
        shiftCode: fieldsValue.shiftCode,
        shiftActualEndTime: openEndShift.shiftActualEndTime,
        shiftActualStartTime: openEndShift.shiftActualStartTime,
        shiftDate: isUndefined(fieldsValue.date)
          ? null
          : moment(fieldsValue.date).format('YYYY-MM-DD'),
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  render() {
    const { form, pagination, dataSource, productBeat = {}, saveHandoverMatter, handoverMatter, openEndShift={}, handoverBut } = this.props;
    const { xdataList = [], ydataList = [] } = productBeat;
    const { getFieldDecorator } = form;
    const columns = [
      {
        title: '产品',
        dataIndex: 'materialName',
        width: 110,
        align: 'center',
        onCell: () => ({
          style: {
            whiteSpace: 'normal',
          },
        }),
        render: (val, record, index) => {
          const productionList = dataSource.map(e => e.materialName);
          const first = productionList.indexOf(record.materialName);
          const all = dataSource.filter(e => e.materialName === record.materialName).length;
          const obj = {
            children: val,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: '生产工单',
        dataIndex: 'workOrderNumber',
        width: 70,
        align: 'center',
      },
      {
        title: '派工',
        dataIndex: 'dispatchNumber',
        width: 50,
        align: 'center',
      },
      {
        title: '投产',
        dataIndex: 'shiftProduction',
        width: 50,
        align: 'center',
      },
      {
        title: '完成',
        dataIndex: 'shiftComplete',
        width: 50,
        align: 'center',
      },
      {
        title: '不良',
        dataIndex: 'ncNumber',
        width: 50,
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
        height: '300px',
        backgroundColor: 'transparent',
      },
      series: [
        {
          name: '数量',
          type: 'line',
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
            enabled: false,
          },
        },
      },
    };
    return (
      <React.Fragment>
        <Row className={styles.midCompletionStatistics}>
          <div className={styles.midTitle}>
            <img src={secondTitleImg} alt="" style={{ marginTop: '-3PX', marginRight: '5px' }} />
            <span style={{ fontSize: '14px', lineHeight: '19px', color: 'rgba(51,51,51,1)' }}>本班统计</span>
          </div>
          <div className={styles.tableMidInfo}>
            <Table
              columns={columns}
              scroll={{ x: tableScrollWidth(columns), y: 200 }}
              rowKey="workOrderId"
              bordered
              dataSource={dataSource}
              expandIconAsCell={false}
              defaultExpandAllRows
              expandIconColumnIndex={-1}
              pagination={pagination}
              onChange={page => this.onSearch(page)}
            />
          </div>
        </Row>
        <Row className={styles.midProductBeat}>
          <div className={styles.midTitle}>
            <img src={secondTitleImg} alt="" style={{ marginTop: '-3PX', marginRight: '5px' }} />
            <span style={{ fontSize: '14px', lineHeight: '19px', color: 'rgba(51,51,51,1)' }}>产品节拍</span>
          </div>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </Row>
        <Row className={styles.midHandover}>
          <div className={styles.midTitle}>
            <img src={secondTitleImg} alt="" style={{ marginTop: '-3PX', marginRight: '5px' }} />
            <span style={{ fontSize: '14px', lineHeight: '19px', color: 'rgba(51,51,51,1)' }}>交接注意事项</span>
          </div>
          <Form>
            <Row>
              <Col>
                <Form.Item>{getFieldDecorator('remark', {
                  initialValue: handoverMatter.handoverMatter,
                })(<TextArea rows={4} disabled={openEndShift.shiftActualEndTime||handoverBut} />)
                }
                </Form.Item>
              </Col>
              <Col span={24} style={{ textAlign: 'end' }}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ backgroundColor: '#008002' }}
                    onClick={() => saveHandoverMatter()}
                    disabled={openEndShift.shiftActualEndTime||handoverBut}
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
