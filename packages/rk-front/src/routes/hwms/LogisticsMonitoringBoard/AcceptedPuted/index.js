/*
 * @Description: 已收待上架
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-24 11:38:23
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-05-08 10:00:59
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Divider } from 'hzero-ui';
import notification from 'utils/notification';
import { Bind } from 'lodash-decorators';
import { IEVersion, launchFullscreen, exitFullscreen, fullScreenEnabled } from './util';
import BoardCard from './BoardCard';
import styles from './index.less';
import ReceivingMaterial from './ReceivingMaterial';
import ReceiptWaitingTime from './ReceiptWaitingTime';
import Tag from './Tag';
// import handlogo from '@/assets/handlogo.png';

@connect(({ acceptedPutedNew }) => ({
  acceptedPutedNew,
}))
export default class AcceptedPuted extends Component {
  constructor(props) {
    super(props);
    this.fetchBoarCard(0);
    this.state = {
      isFullFlag: false,
      page: 0,
    };
  }

  filterForm;

  componentWillMount() {
    // 判断浏览器是否为ie
    this.ieFlag = IEVersion();
  }

  componentDidMount() {
    // document.addEventListener('fullscreenchange', () => {
    //   this.setState({
    //     isFullFlag: document.fullscreenElement,
    //   });
    // });
    this.interval = setInterval(() => {
      this.tick();
    }, 60000);
    this.fetchMaterial();
    this.fetchTrend();
  }

  tick() {
    const { page } = this.state;
    this.fetchBoarCard(page);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // 任务区域数据查询
  @Bind()
  fetchBoarCard(page) {
    const { dispatch } = this.props;
    dispatch({
      type: 'acceptedPutedNew/fetchBoarCard',
      payload: {
        page,
        size: 11,
      },
    }).then(res => {
      if (res.number + 1 === res.totalPages) {
        this.setState({ page: 0 });
      } else {
        this.setState({ page: res.number + 1 });
      }
    });
  }

  // 30天物料上架图
  @Bind()
  fetchMaterial() {
    const { dispatch } = this.props;
    // 批量查询独立值集
    dispatch({
      type: 'acceptedPutedNew/fetchMaterial',
    });
  }

  // 趋势图数据查询
  @Bind()
  fetchTrend() {
    const { dispatch } = this.props;
    // 批量查询独立值集
    dispatch({
      type: 'acceptedPutedNew/fetchTrend',
    });
  }

  // 循环展示看板
  @Bind()
  renderButton(array) {
    // const cols = [];
    // let margin;
    // const totalLine = Math.ceil(array.length / 6);
    // for (let i = 0; i <= array.length - 1; ) {
    //   const line = Math.ceil(i / 7 + 1); // 计算第几行
    //   const element = [];
    //   for (let j = 0; j < 6 && i <= array.length - 1; j++, i++) {
    //     element.push(
    //       <Col span={4} style={{ marginRight: margin ? '0px' : '0px' }}>
    //         <BoardCard boardCardList={array[i]} />
    //       </Col>
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
    //       </Col>
    //     );
    //   }
    //   cols.push(<Row style={{ marginTop: '2px' }}>{element}</Row>);
    // }
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
    const chartDom = document.getElementById('acceptedPuted');
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
      acceptedPutedNew: {
        boarCardList = [],
        materialList = [],
        trendList = [],
        number = 0,
        totalPages = 0,
        totalElements = 0,
        numberOfElements = 0,
      },
    } = this.props;
    const { isFullFlag } = this.state;
    return (
      <Fragment>
        <div
          style={{
            width: this.ieFlag && isFullFlag ? '100%' : `calc(100%)`,
            backgroundColor: isFullFlag ? 'rgba(255,255,255,0.9)' : null,
          }}
          id="acceptedPuted"
          className={styles.acceptedPuredBoard}
        >
          {!isFullFlag && (
            <div style={{ backgroundColor: '#223764', padding: 7 }}>
              {/* {this.renderButton(boarCardList)} */}
              <div style={{ height: 207 }}>{this.renderButton(boarCardList)}</div>
              <Divider style={{ color: '#fff' }}>
                {' '}
                {number + 1}/{totalPages} {numberOfElements}/{totalElements}{' '}
              </Divider>
              <Row style={{ marginTop: '5px', display: 'flex', justifyContent: 'space-between' }}>
                <Col span={11} className={styles.puredReceivingMaterial}>
                  <ReceivingMaterial materialList={materialList} />
                </Col>
                <Col span={11} className={styles.puredReceiptWaitingTime}>
                  <ReceiptWaitingTime trendList={trendList} />
                </Col>
              </Row>
              {/* <Row className={styles.puredLogo}>
                <div style={{ textAlign: 'center' }}>
                  <img src={handlogo} alt="" style={{ height: '15px' }} />
                </div>
              </Row> */}
            </div>
          )}
        </div>
      </Fragment>
    );
  }
}
