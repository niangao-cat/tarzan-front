/*
 * @Description: 已收待验看板
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-21 10:06:32
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-10-08 23:37:03
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Divider, Spin } from 'hzero-ui';
import notification from 'utils/notification';
import { Bind } from 'lodash-decorators';
// import { Scrollbars } from 'react-custom-scrollbars';
import { IEVersion, launchFullscreen, exitFullscreen, fullScreenEnabled } from './util';
import BoardCard from './BoardCard';
import styles from './index.less';
import ReceivingMaterial from './ReceivingMaterial';
import ReceiptWaitingTime from './ReceiptWaitingTime';
import Tag from './Tag';
// import handlogo from '@/assets/handlogo.png';

@connect(({ acceptedTestedBoardNew }) => ({
  acceptedTestedBoardNew,
}))
export default class AcceptedTestedBoard extends Component {
  constructor(props) {
    super(props);
    this.fetchCardData(0);
    this.fetchGetMaterial();
    this.fetchTrend();
    this.state = {
      isFullFlag: false,
      spinning: false,
    };
  }

  filterForm;

  componentWillMount() {
    // 判断浏览器是否为ie
    this.ieFlag = IEVersion();
  }

  componentDidMount() {
    document.addEventListener('fullscreenchange', () => {
      this.setState({
        isFullFlag: document.fullscreenElement,
      });
    });
    this.interval = setInterval(() => {
      this.tick();
    }, 60000);
  }

  tick() {
    const { page } = this.state;
    this.fetchCardData(page);
    this.fetchGetMaterial();
    this.fetchTrend();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // 获取卡片数据
  @Bind()
  fetchCardData(page) {
    const { dispatch } = this.props;
    this.setState({ spinning: true });
    dispatch({
      type: 'acceptedTestedBoardNew/fetchCardData',
      payload: {
        page,
        size: 11,
      },
    }).then(res => {
      this.setState({ spinning: false });
      if (res) {
        if (res.number + 1 === res.totalPages) {
          this.setState({ page: 0 });
        } else {
          this.setState({ page: res.number + 1 });
        }
      }
    });
  }

  // 30天收获物料量
  @Bind()
  fetchGetMaterial() {
    const { dispatch } = this.props;
    // 批量查询独立值集
    dispatch({
      type: 'acceptedTestedBoardNew/fetchGetMaterial',
    });
  }

  // 趋势图数据查询
  @Bind()
  fetchTrend() {
    const { dispatch } = this.props;
    // 批量查询独立值集
    dispatch({
      type: 'acceptedTestedBoardNew/fetchTrend',
    });
  }

  // 循环展示看板
  @Bind()
  renderButton(array) {
    // const cols = [];
    // let margin;
    // const totalLine = Math.ceil(array.length / 6);
    // for (let i = 0; i <= array.length - 1;) {
    //   const line = Math.ceil(i / 7 + 1); // 计算第几行
    //   const element = [];
    //   for (let j = 0; j < 6 && i <= array.length - 1; j++, i++) {
    //     margin = j === 6;
    //     element.push(
    //       <Col span={4} style={{ marginRight: margin ? '0px' : '0px' }}>
    //         <BoardCard boardCardList={array[i]} />
    //       </Col>,
    //     );
    //   }
    //   const whiteBoardCard = 5 - (array.length - (totalLine - 1) * 6); // 计算应填充的空白看板
    //   if (totalLine === line) {
    //     for (let index = 0; index < whiteBoardCard; index++) {
    //       element.push(<Col span={4} style={{ marginRight: '0px' }} />);
    //     }
    //     element.push(
    //       <Col span={4} style={{ marginRight: '0px' }}>
    //         <Tag />
    //       </Col>,
    //     );
    //   }
    //   cols.push(<Row style={{ marginTop: '2px' }}>{element}</Row>);
    // }
    // return cols;
    const cols = [];
    const newData = [];
    for (let i = 0; i < 11; i++) {
      if (array.length > i) {
        newData.push({
          ...array[i],
          whiteCardFlag: false,
        });
      } else {
        newData.push({
          whiteCardFlag: true,
        });
      }
    }
    cols.push(
      <Row style={{ marginTop: '2px' }}>
        {/* eslint-disable-next-line array-callback-return */}
        {newData.map((item, index) => {
          if (index < 6) {
            if (item.whiteCardFlag) {
              return <Col span={4} style={{ margin: '2px', width: '16%' }} />;
            } else {
              return (
                <Col span={4} style={{ margin: '2px', width: '16%' }}>
                  <BoardCard boardCardList={item} />
                </Col>
              );
            }
          }
        })}
      </Row>
    );
    cols.push(
      <Row style={{ marginTop: '2px' }}>
        {/* eslint-disable-next-line array-callback-return */}
        {newData.map((item, index) => {
          if (index >= 6 && index < 11) {
            if (item.whiteCardFlag) {
              return <Col span={4} style={{ margin: '2px', width: '16%' }} />;
            } else {
              return (
                <Col span={4} style={{ margin: '2px', width: '16%' }}>
                  <BoardCard boardCardList={item} />
                </Col>
              );
            }
          }
        })}
        <Col span={4} style={{ margin: '2px', width: '16%' }}>
          <Tag />
        </Col>
      </Row>
    );
    return cols;
  }

  @Bind()
  screenFull() {
    if (fullScreenEnabled !== undefined && !fullScreenEnabled) {
      notification.warning({
        message: '暂不支持全屏',
      });
      return;
    }
    const chartDom = document.getElementById('acceptedTestedBoard');
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
      acceptedTestedBoardNew: {
        boarCardList = [],
        materialList = [],
        trendList = {},
        number = 0,
        totalPages = 0,
        totalElements = 0,
        numberOfElements = 0,
      },
    } = this.props;
    const { spinning } = this.state;
    return (
      <Fragment>
        <div id="acceptedTestedBoard" className={styles.acceptedTestBoard}>
          <div style={{ backgroundColor: '#223764', padding: 7 }}>
            <Spin spinning={spinning}>
              <div style={{ height: 206 }}>{this.renderButton(boarCardList)}</div>
              <Divider style={{ color: '#fff' }}>
                {' '}
                {number + 1}/{totalPages} {numberOfElements}/{totalElements}{' '}
              </Divider>
              <Row style={{ marginTop: '5px', display: 'flex', justifyContent: 'space-between' }}>
                <Col span={11} className={styles.testReceivingMaterial}>
                  <ReceivingMaterial materialList={materialList} />
                </Col>
                <Col span={11} className={styles.testReceiptWaitingTime}>
                  <ReceiptWaitingTime trendList={trendList} />
                </Col>
              </Row>
              {/* <Row className={styles.testLogo}>
                <div style={{ textAlign: 'center' }}>
                  <img src={handlogo} alt="" style={{ height: '15px' }} />
                </div>
              </Row> */}
            </Spin>
          </div>
        </div>
      </Fragment>
    );
  }
}
