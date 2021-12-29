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
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Row, Col, Divider, Spin } from 'hzero-ui';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Bind } from 'lodash-decorators';
// import { Scrollbars } from 'react-custom-scrollbars';
import { IEVersion, launchFullscreen, exitFullscreen, fullScreenEnabled } from './util';
import BoardCard from './BoardCard';
import styles from './index.less';
import ReceivingMaterial from './ReceivingMaterial';
import ReceiptWaitingTime from './ReceiptWaitingTime';
import Tag from './Tag';
import handlogo from '@/assets/handlogo.png';

@connect(({ acceptedTestedBoard }) => ({
  acceptedTestedBoard,
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
    this.setState({spinning: true});
    dispatch({
      type: 'acceptedTestedBoard/fetchCardData',
      payload: {
        page,
        size: 23,
      },
    }).then(res => {
      this.setState({spinning: false});
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
      type: 'acceptedTestedBoard/fetchGetMaterial',
    });
  }

  // 趋势图数据查询
  @Bind()
  fetchTrend() {
    const { dispatch } = this.props;
    // 批量查询独立值集
    dispatch({
      type: 'acceptedTestedBoard/fetchTrend',
    });
  }

  // 循环展示看板
  @Bind()
  renderButton(array) {
    const cols = [];
    let margin;
    const totalLine = Math.ceil(array.length / 6);
    for (let i = 0; i <= array.length - 1;) {
      const line = Math.ceil(i / 7 + 1); // 计算第几行
      const element = [];
      for (let j = 0; j < 6 && i <= array.length - 1; j++, i++) {
        margin = j === 6;
        element.push(
          <Col span={3} style={{ marginRight: margin ? '0px' : '6px', width: '16.1%' }}>
            <BoardCard boardCardList={array[i]} />
          </Col>
        );
      }
      const whiteBoardCard = 5 - (array.length - (totalLine - 1) * 6); // 计算应填充的空白看板
      if (totalLine === line) {
        for (let index = 0; index < whiteBoardCard; index++) {
          element.push(<Col span={3} style={{ marginRight: '6px', width: '16.1%' }} />);
        }
        element.push(
          <Col span={3} style={{ marginRight: '6px', width: '16.1%' }}>
            <Tag />
          </Col>
        );
      }
      cols.push(<Row style={{ marginTop: '5px' }}>{element}</Row>);
    }
    return cols;
  }

  @Bind()
  screenFull() {
    if (fullScreenEnabled !== undefined && !fullScreenEnabled) {
      notification.warning({
        message: intl.get('hdpm.dataModel.view.message.noSupportScreenFull').d('暂不支持全屏'),
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
      acceptedTestedBoard: {
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
        <div
          // style={{
          //   width: this.ieFlag && isFullFlag ? '100%' : `calc(100%)`,
          //   backgroundColor: isFullFlag ? 'rgba(255,255,255,0.9)' : null,
          // }}
          height="100%"
          id="acceptedTestedBoard"
          className={styles.board}
        >
          <Header title="已收待验看板">
            {/* <Button
              onClick={this.screenFull}
              style={{ marginLeft: 10 }}
              icon={isFullFlag ? 'shrink' : 'arrows-alt'}
            >
              {isFullFlag
                ? intl.get(`hdpm.dataModel.button.cancelScreenFull`).d('关闭看板')
                : intl.get(`hdpm.dataModel.button.screenFull`).d('全屏')}
            </Button> */}
          </Header>
          <Content style={{ padding: '0px', height: '100%' }}>
            <Spin spinning={spinning}>
              {this.renderButton(boarCardList)}
              <Divider>
                {' '}
                {number + 1}/{totalPages} {numberOfElements}/{totalElements}{' '}
              </Divider>
              <Row style={{ marginTop: '5px', height: '300px' }}>
                <Col span={11} className={styles.receivingMaterial}>
                  <ReceivingMaterial materialList={materialList} />
                </Col>
                <Col span={11} className={styles.receiptWaitingTime}>
                  <ReceiptWaitingTime trendList={trendList} />
                </Col>
              </Row>
              <Row className={styles.logo}>
                <div style={{ textAlign: 'center' }}>
                  <img src={handlogo} alt="" style={{ height: '15px' }} />
                </div>
              </Row>
            </Spin>
          </Content>
          {/* {isFullFlag && (
            <Scrollbars style={{ height: '90%' }}>

            </Scrollbars>
          )}
          {!isFullFlag && (
            <Content style={{ padding: '0px', height: '100%' }}>
              {this.renderButton(boarCardList)}
              <Divider>
                {' '}
                {number + 1}/{totalPages} {numberOfElements}/{totalElements}{' '}
              </Divider>
              <Row style={{ marginTop: '5px' }}>
                <Col span={11} className={styles.receivingMaterial}>
                  <ReceivingMaterial materialList={materialList} />
                </Col>
                <Col span={11} className={styles.receiptWaitingTime}>
                  <ReceiptWaitingTime trendList={trendList} />
                </Col>
              </Row>
              <Row className={styles.logo}>
                <div style={{ textAlign: 'center' }}>
                  <img src={handlogo} alt="" style={{ height: '15px' }} />
                </div>
              </Row>
            </Content>
          )} */}
        </div>
      </Fragment>
    );
  }
}
