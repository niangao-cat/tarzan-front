/*
 * @Description: 成品检验质量看板
 * @Version: 0.0.1
 * @Autor: 张晨 <chen.zhang03@hand-china.com>
 * @Date: 2021-05-17 18:10:19
 */
import React, { PureComponent, Fragment } from 'react';
import {
  getCurrentOrganizationId,
} from 'utils/utils';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import { Col, Row, Divider } from 'hzero-ui';
import {
  BorderBox12,
} from '@jiaminghi/data-view-react';

import styles from './index.less';
import IQCinspectionMission from './IQCinspectionMission';
import ReceivingMaterial from './ReceivingMaterial';
import ReceiptWaitingTime from './ReceiptWaitingTime';
import DeliveryScheduleNissanLineTable from './DeliveryScheduleNissanLineTable';
import BoardCard from './BoardCard';
import InspectorsData from './InspectorsData';
import Tag from './Tag';


@connect(({ iqcTestedBoard }) => ({
  iqcTestedBoard,
  tenantId: getCurrentOrganizationId(),
}))
export default class ManufacturingCenterBoard extends PureComponent {
  constructor(props) {
    super(props);
    this.fetchBoarCard(0);
    this.state = {
      page: 0,
      badinspectListRolling: [],
    };
  }

  filterForm;

  componentDidMount() {
    // this.timeInterval = setInterval(() => this.time(), 1000);
    this.tickInterval = setInterval(() => this.tick(), 60000);
    this.tablerInterval = setInterval(() => this.table(), 30000);
    this.rollingInterval = setInterval(() => this.rolling(), 5000);
    this.fetchMaterial();
    this.fetchTrend();
    this.fetchLocator();
    this.fetchbadInspect();
    this.fetchDayinspect();
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
    clearInterval(this.tickInterval);
    clearInterval(this.tablerInterval);
    clearInterval(this.rollingInterval);
  }

  tick() {
    const { page } = this.state;
    this.fetchBoarCard(page);
  }

  table() {
    const { page } = this.state;
    this.fetchDayinspect(page);
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
  fetchBoarCard(page) {
    const { dispatch } = this.props;
    dispatch({
      type: 'iqcTestedBoard/fetchBoarCard',
      payload: {
        page,
        size: 29,
      },
    }).then(res => {
      if (res && res.number + 1 === res.totalPages) {
        this.setState({ page: 0 });
      } else if (res) {
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
  fetchDayinspect(page) {
    const { dispatch } = this.props;
    dispatch({
      type: 'iqcTestedBoard/fetchDayinspect',
      payload: {
        page,
        size: 5,
      },
    }).then(res => {
      if (res && res.number + 1 === res.totalPages) {
        this.setState({ page: 0 });
      } else if (res) {
        this.setState({ page: res.number + 1 });
      }
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

  render() {
    const {
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
    const { badinspectListRolling } = this.state;
    return (
      <Fragment>
        <Row style={{ height: '100%' }}>
          <Col span={12}>
            <div className={styles['production-board-one']}>
              <BorderBox12 className={styles['production-board-one-BorderBox15']}>
                <div className={styles['production-board-title']}>
                  <div style={{ backgroundColor: '#bcdcff', height: '0.33rem', width: '0.05rem', float: 'left', marginTop: '0.08rem' }} />
                  <div className={styles['production-board-one-div']}>IQC检验看板</div>
                </div>
                <div className={styles['production-board-one-div-chart-yield']}>
                  {this.renderButton(boarCardList)}
                  <Divider>
                    {number + 1}/{totalPages} {numberOfElements}/{totalElements}{' '}
                  </Divider>
                </div>
              </BorderBox12>
            </div>
            <Row>
              <Col span={12}>
                <div className={styles['production-board-one']}>
                  <BorderBox12 className={styles['production-board-one-BorderBox15']}>
                    <div className={styles['production-board-one-div-table-yield']}>
                      <div className={styles.inspection}>
                        <ReceivingMaterial materialList={materialList} />
                      </div>
                    </div>
                  </BorderBox12>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles['production-board-one']}>
                  <BorderBox12 className={styles['production-board-one-BorderBox15']}>
                    <div className={styles['production-board-one-div-table-yield']}>
                      <div className={styles.inspection}>
                        <ReceiptWaitingTime trendList={trendList} />
                      </div>
                    </div>
                  </BorderBox12>
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <div className={styles['production-board-one']}>
              <BorderBox12 className={styles['production-board-one-BorderBox15']}>
                <div className={styles['production-board-title']}>
                  <div style={{ backgroundColor: '#bcdcff', height: '0.33rem', width: '0.05rem', float: 'left', marginTop: '0.08rem' }} />
                  <div className={styles['production-board-one-div']}>IQC检验任务执行统计</div>
                </div>
                <div className={styles['production-board-one-div-line']}>
                  <div className={styles['production-board-one-div-line-yield']}>
                    <IQCinspectionMission
                      dataSource={inspectList}
                      badinspectList={badinspectListRolling}
                    />
                  </div>
                </div>
                <div className={styles['production-board-one-div-line']}>
                  <div className={styles['production-board-one-div-line-yield']}>
                    <InspectorsData badinspectList={badinspectList} />
                  </div>
                </div>
              </BorderBox12>
            </div>
            <div className={styles['production-board-one']}>
              <BorderBox12 className={styles['production-board-one-BorderBox15']}>
                <div className={styles['production-board-title']}>
                  <div style={{ backgroundColor: '#bcdcff', height: '0.33rem', width: '0.05rem', float: 'left', marginTop: '0.08rem' }} />
                  <div className={styles['production-board-one-div']}>日检验不良信息</div>
                </div>
                <div className={styles['production-board-one-div-table-yield']}>
                  <div className={styles.inspection}>
                    <DeliveryScheduleNissanLineTable dataSource={deliveryScheduleNissanLineData} />
                  </div>
                </div>
              </BorderBox12>
            </div>
          </Col>
        </Row>
      </Fragment>
    );
  }
}
