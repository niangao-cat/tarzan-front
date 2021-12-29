/*
 * @Description: IQC检验看板
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-24 11:38:23
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-10-30 16:29:14
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Content } from 'components/Page';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Divider, Spin, Button } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import { exitFullscreen, fullScreenEnabled, launchFullscreen } from './util';
import BoardCard from './BoardCard';
import styles from './index.less';
import ReceivingMaterial from './ReceivingMaterial';
import InspectorsData from './InspectorsData';
import ReceiptWaitingTime from './ReceiptWaitingTime';
import Tag from './Tag';
import DeliveryScheduleNissanLineTable from './DeliveryScheduleNissanLineTable';
import IQCinspectionMission from './IQCinspectionMission';

@connect(({ iqcTestedBoard, loading }) => ({
  iqcTestedBoard,
  fetchBoarCardLoading: loading.effects['iqcTestedBoard/fetchBoarCard'],
  fetchDayInspectLoading: loading.effects['iqcTestedBoard/fetchDayInspect'],
}))
export default class AcceptedPuted extends Component {
  constructor(props) {
    super(props);
    this.fetchBoarCard();
    this.fetchDayInspect();
    this.state = {
      isFullFlag: false,
      date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      badinspectListRolling: [],
    };
  }

  filterForm;

  componentDidMount() {
    document.addEventListener('fullscreenchange', () => {
      this.setState({ isFullFlag: document.fullscreenElement });
    });
    this.timeInterval = setInterval(() => this.time(), 1000);
    this.tickInterval = setInterval(() => this.fetchBoarCard(), 60000);
    this.tablerInterval = setInterval(() => this.fetchDayInspect(), 30000);
    this.rollingInterval = setInterval(() => this.rolling(), 5000);
    this.fetchMaterial();
    this.fetchTrend();
    this.fetchLocator();
    this.fetchbadInspect();
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
    clearInterval(this.tickInterval);
    clearInterval(this.tablerInterval);
    clearInterval(this.rollingInterval);
  }

  /**
   * 获取时间
   */
  time() {
    const timeStr = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    this.setState({
      date: timeStr,
    });
  }

  rolling() {
    const { badinspectListRolling } = this.state;
    if (badinspectListRolling.length > 11) {
      this.handleBadinspectListRolling(badinspectListRolling);
    }
  }

  handleBadinspectListRolling(array) {
    const newArr = JSON.parse(JSON.stringify(array));
    newArr.push(newArr.shift());
    this.setState({badinspectListRolling: newArr});
  }

  // 任务区域数据查询
  @Bind()
  fetchBoarCard() {
    const { dispatch, iqcTestedBoard: { currentPage } } = this.props;
    dispatch({
      type: 'iqcTestedBoard/fetchBoarCard',
      payload: {
        page: currentPage,
        size: 29,
      },
    });
  }

  // 30天物料上架图
  @Bind()
  fetchMaterial() {
    const { dispatch } = this.props;
    // 批量查询独立值集
    dispatch({
      type: 'iqcTestedBoard/fetchMaterial',
    });
  }

  // 趋势图数据查询
  @Bind()
  fetchTrend() {
    const { dispatch } = this.props;
    // 批量查询独立值集
    dispatch({
      type: 'iqcTestedBoard/fetchTrend',
    });
  }

  // 到货仓库数据查询
  @Bind()
  fetchLocator() {
    const { dispatch } = this.props;
    dispatch({
      type: 'iqcTestedBoard/fetchLocator',
    });
  }


  // 不良检验数据查询
  @Bind()
  fetchbadInspect() {
    const { dispatch } = this.props;
    dispatch({
      type: 'iqcTestedBoard/fetchbadInspect',
    }).then((res) => {
      if(res) {
        this.setState( { badinspectListRolling: res} );
      }
    });
  }



  // 任务区域数据查询
  @Bind()
  fetchDayInspect() {
    const { dispatch, iqcTestedBoard: { dayInspectCurrentPage } } = this.props;
    dispatch({
      type: 'iqcTestedBoard/fetchDayInspect',
      payload: {
        page: dayInspectCurrentPage,
        size: 5,
      },
    });
  }


  /**
   * 循环展示看板
   * 返回默认一个次返回是23个，奇数个，
   * 有可能出现偶数的情况，偶数算法不一样，后期维护要注意
   * @param {*} array 返回的数组
   */
  @Bind()
  renderButton(array) {
    if (array.length % 2 === 0) {
      return this.renderEvenNumber(array);
    } else {
      return this.renderOddNumber(array);
    }
  }

  // 返回数组是基数的
  @Bind
  renderOddNumber(array) {
    const cols = [];
    let margin;
    const totalLine = Math.ceil(array.length / 6);
    for (let i = 0; i <= array.length - 1;) {
      const line = Math.ceil(i / 7 + 1); // 计算第几行
      const element = [];
      for (let j = 0; j < 6 && i <= array.length - 1; j++, i++) {
        margin = j === 6;
        element.push(
          <Col span={4} style={{ marginRight: margin ? '0px' : '0px' }}>
            <BoardCard boardCardList={array[i]} />
          </Col>
        );
      }
      const whiteBoardCard = 5 - (array.length - (totalLine - 1) * 6); // 计算应填充的空白看板
      if (totalLine === line) {
        for (let index = 0; index < whiteBoardCard; index++) {
          element.push(<Col span={4} style={{ marginRight: '0px' }} />);
        }
        element.push(
          <Col span={4} style={{ marginRight: '0px' }}>
            <Tag />
          </Col>
        );
      }
      cols.push(<Row style={{ marginTop: '2px' }}>{element}</Row>);
    }
    return cols;
  }

  // 返回数组个数是偶数的
  @Bind
  renderEvenNumber(array) {
    const cols = [];
    let margin;
    const totalLine = Math.ceil(array.length / 6) + 1;
    for (let i = 0; i <= array.length;) {
      const line = Math.ceil(i / 7 + 1); // 计算第几行
      const element = [];
      // 如果是最后一行不需要填充BoardCard了，只需要填充空白的就行，为保证外层循环能成功跳出需要i++s
      if (totalLine === line) {
        i++;
      } else {
        for (let j = 0; j < 6 && i <= array.length; j++, i++) {
          margin = j === 6;
          element.push(
            <Col span={4} style={{ marginRight: margin ? '0px' : '0px' }}>
              <BoardCard boardCardList={array[i]} />
            </Col>
          );
        }
      }
      const whiteBoardCard = 5 - (array.length - (totalLine) * 6); // 计算应填充的空白看板
      if (totalLine === line) {
        for (let index = 0; index < whiteBoardCard; index++) {
          element.push(<Col span={4} style={{ marginRight: '0px' }} />);
        }
        element.push(
          <Col span={4} style={{ marginRight: '0px' }}>
            <Tag />
          </Col>
        );
      }
      cols.push(<Row style={{ marginTop: '2px' }}>{element}</Row>);
    }
    return cols;
  }


  /**
   * 全屏
   */
  @Bind
  @Bind()
  screenFull() {
    if (fullScreenEnabled !== undefined && !fullScreenEnabled) {
      notification.warning({
        message: '暂不支持全屏',
      });
      return;
    }
    const chartDom = document.getElementById('IQC-monitoring-board');
    this.setState(
      {
        isFullFlag: !this.state.isFullFlag,
      },
      () => {
        if (this.state.isFullFlag) {
          launchFullscreen(chartDom);
        } else {
          exitFullscreen();
        }
      }
    );
  }


  render() {
    const {
      fetchBoarCardLoading,
      fetchDayInspectLoading,
      iqcTestedBoard: {
        boarCardList = [],
        materialList = [],
        trendList = [],
        inspectList = [],
        badinspectList = [],
        deliveryScheduleNissanLineData = [],
        number = 0,
        totalPages = 0,
        totalElements = 0,
        numberOfElements = 0,
      },
    } = this.props;
    const { date, isFullFlag, badinspectListRolling } = this.state;
    return (
      <div className="Father-thebox-iqc" id="IQC-monitoring-board">
        <div className="Title-thebox">
          <div className="Title-thetime">{date}</div>
          <div className="Title-theboard">IQC检验看板</div>
          <div style={{ marginLeft: '28%' }}>
            <Button onClick={this.screenFull} icon={isFullFlag ? 'shrink' : 'arrows-alt'}>
              {isFullFlag ? '取消全屏' : '全屏'}
            </Button>
          </div>
        </div>
        <div className="content-thebox-iqc">
          <div id="contenttheBoxA">
            <div
              height="100%"
              id="acceptedPuted"
              className={styles.iqctestedboard}
            >
              <div className="content-thebox-A-title">IQC检验看板</div>
              <Content style={{ padding: '0px', height: '100%' }}>
                <Spin spinning={fetchBoarCardLoading || false}>
                  <Row style={{ marginTop: '5px', height: '625px' }}>
                    {this.renderButton(boarCardList)}
                  </Row>
                  <Divider style={{ borderColor: 'rgb(46, 96, 153)' }}>
                    <span style={{ color: '#fff'}}>
                      {number + 1}/{totalPages} {numberOfElements}/{totalElements}
                    </span>
                  </Divider>
                  <Row style={{ marginTop: '5px', height: '275px' }}>
                    <Col span={10} className={styles['iqc-test-board-receivingMaterial']}>
                      <ReceivingMaterial materialList={materialList} />
                    </Col>
                    <Col span={10} className={styles['iqc-test-board-receiptWaitingTime']}>
                      <ReceiptWaitingTime trendList={trendList} />
                    </Col>
                  </Row>
                </Spin>
              </Content>
            </div>
          </div>
          <div id="contenthetBoxB">
            <div
              height="100%"
              style={{ background: '#203864' }}
            >
              <div className="content-thebox-B-title">IQC检验任务执行统计</div>
              <Divider />
              <Row style={{ marginTop: '0px', height: '251px' }}>
                <Col className={styles['iqc-test-receiving']}>
                  <IQCinspectionMission
                    dataSource={inspectList}
                    badinspectList={badinspectListRolling}
                  />
                </Col>
              </Row>
              <Divider />
              <Row style={{ marginTop: '2px', height: '251px' }}>
                <Col className={styles['iqc-test-receiving']}>
                  <InspectorsData badinspectList={badinspectList} />
                </Col>
              </Row>
              <Divider />
              <Spin spinning={fetchDayInspectLoading || false}>
                <Row style={{ marginTop: '2px', height: '312px' }}>
                  <div className="content-thebox-C-title">日检验不良信息</div>
                  <Col span={24} className={styles['iqc-test-receiving']}>
                    <DeliveryScheduleNissanLineTable dataSource={deliveryScheduleNissanLineData} />
                  </Col>
                </Row>
              </Spin>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
