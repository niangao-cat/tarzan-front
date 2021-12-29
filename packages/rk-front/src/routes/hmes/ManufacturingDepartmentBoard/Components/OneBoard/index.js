/*
 * @Description: 成品检验质量看板
 * @Version: 0.0.1
 * @Autor: 张晨 <chen.zhang03@hand-china.com>
 * @Date: 2021-05-17 18:10:19
 */
import React, { PureComponent, Fragment } from 'react';
import { getCurrentOrganizationId } from 'utils/utils';
import { connect } from 'dva';
import { Col, Row, Carousel } from 'hzero-ui';
import { isEmpty } from 'lodash';
import { BorderBox12 } from '@jiaminghi/data-view-react';

import styles from './index.less';
// import BadConditionTable from './badConditionTable';
import MonthPlanChart from './MonthPlanChart';
import ProductionGroupChart from './ProductionGroupChart';
import DailyPlanTable from './DailyPlanTable';
import ProcessNcChart from './ProcessNcChart';
import PoorProcess from './PoorProcess';
import topLogo from '@/assets/top.png';

@connect(({ manufacturingDepartmentBoard }) => ({
  manufacturingDepartmentBoard,
  tenantId: getCurrentOrganizationId(),
}))
export default class ManufacturingDepartmentBoard extends PureComponent {

  render() {
    const {
      // pullList = [],
      topList = [],
      dailyList = [],
      moonList = [],
      second,
    } = this.props;

    const count = Math.floor(topList.length / 4);
    const attr = [];
    const leftAttr = [];
    for (let i = 0; i < count; i++) {
      attr.push(i);
    }
    const left = topList.length % 4;
    for (let i = left - 1; i >= 0; i--) {
      leftAttr.push(topList.length - 1 - i);
    }

    // const topList = pullList;
    const countTop = Math.floor(topList.length / 4);
    const attrTop = [];
    const leftAttrTop = [];
    for (let i = 0; i < countTop; i++) {
      attrTop.push(i);
    }
    const leftTop = topList.length % 4;
    for (let i = leftTop - 1; i >= 0; i--) {
      leftAttrTop.push(topList.length - 1 - i);
    }

    const countMoon = Math.floor(moonList.length / 4);
    const attrMoon = [];
    const leftAttrMoon = [];
    for (let i = 0; i < countMoon; i++) {
      attrMoon.push(i);
    }
    const leftMoon = moonList.length % 4;
    for (let i = leftMoon - 1; i >= 0; i--) {
      leftAttrMoon.push(moonList.length - 1 - i);
    }
    return (
      <Fragment>
        <Row style={{ height: '100%' }}>
          <Col span={6}>
            <div className={styles['production-board-one']}>
              <BorderBox12 className={styles['production-board-one-BorderBox15']}>
                <div className={styles['production-board-title']}>
                  <div className={styles['production-board-one-div']}>
                    <img src={topLogo} alt="" />
                    达成率统计汇总
                  </div>
                </div>
                <div className={styles['production-board-one-div-chart-yield']}>
                  (<MonthPlanChart data={moonList} />)
                </div>
              </BorderBox12>
            </div>
          </Col>
          <Col span={10}>
            <div className={styles['production-board-one']}>
              <BorderBox12 className={styles['production-board-one-BorderBox15']}>
                <div className={styles['production-board-title']}>
                  <div className={styles['production-board-one-div']}>
                    <img src={topLogo} alt="" />
                    月度计划
                  </div>
                </div>
                <div className={styles['production-center-board-one-div-line']}>
                  <div className={styles['production-center-board-one-div-line-yield']}>
                    <ProductionGroupChart data={moonList} second={second} />
                  </div>
                </div>
              </BorderBox12>
            </div>
          </Col>
          <Col span={8}>
            <div className={styles['production-board-one']}>
              <BorderBox12 className={styles['production-board-one-BorderBox15']} style={{ width: '99%' }}>
                <div className={styles['production-board-title']}>
                  <div className={styles['production-board-one-div']}>
                    <img src={topLogo} alt="" />
                    日计划达成率
                  </div>
                </div>
                <div className={styles['production-center-board-one-div-table-yield']}>
                  <div className={styles['center-inspection']}>
                    {isEmpty(dailyList) ? (
                      <div className={styles.temporaryNoData}>暂无数据</div>
                    ) : (
                      <DailyPlanTable dataSource={dailyList} second={second} />
                    )}
                  </div>
                </div>
              </BorderBox12>
            </div>
          </Col>
          <Col span={24}>
            <BorderBox12 className={styles['production-board-one-BorderBox15']} style={{ width: '99.7%' }}>
              <div style={{ height: '7.8rem' }}>
                <div className={styles.content_not_top_tit}>
                  <img src={topLogo} alt="" />
                  直通率
                </div>
                <div className={styles['manufacturingDepartmentBoard_carousel-content']}>
                  <Carousel
                    style={{ height: '2.8rem' }}
                    autoplay
                    dots={false}
                    autoplaySpeed={second * 1000}
                    pauseOnDotsHover
                    pauseOnHover={false}
                  >
                    {isEmpty(topList) ? (
                      <div className={styles.temporaryNoData}>暂无数据</div>
                    ) : (
                      attr.map(e => {
                        return (
                          <div>
                            <Row>
                              <Col span={6}>
                                <ProcessNcChart data={topList[e]} />
                              </Col>
                              <Col span={6}>
                                <ProcessNcChart data={topList[e + 1]} />
                              </Col>
                              <Col span={6}>
                                <ProcessNcChart data={topList[e + 2]} />
                              </Col>
                              <Col span={6}>
                                <ProcessNcChart data={topList[e + 3]} />
                              </Col>
                            </Row>
                          </div>
                        );
                      })
                    )}
                    {left > 0 && (
                      <div>
                        <Row>
                          {leftAttr.map(e => {
                            return (
                              <Col span={6}>
                                <ProcessNcChart data={topList[e]} />
                              </Col>
                            );
                          })}
                        </Row>
                      </div>
                    )}
                  </Carousel>
                </div>
                <div className={styles.content_not_top_tit}>
                  <img src={topLogo} alt="" />
                  工序不良TOP5
                </div>
                <div className={styles['manufacturingDepartmentBoard_carousel-content']}>
                  <Carousel
                    style={{ height: '3.1rem' }}
                    autoplay
                    dots={false}
                    autoplaySpeed={second * 1000}
                    pauseOnDotsHover
                    pauseOnHover={false}
                  >
                    {isEmpty(topList) ? (
                      <div className={styles.temporaryNoData}>暂无数据</div>
                    ) : (
                      attrTop.map(e => {
                        return (
                          <div>
                            <Row>
                              <Col span={6}>
                                <div style={{ height: '3.1rem' }}>
                                  <PoorProcess data={topList[e]} />
                                </div>
                              </Col>
                              <Col span={6}>
                                <div style={{ height: '3.1rem' }}>
                                  <PoorProcess data={topList[e + 1]} />
                                </div>
                              </Col>
                              <Col span={6}>
                                <div style={{ height: '3.1rem' }}>
                                  <PoorProcess data={topList[e + 2]} />
                                </div>
                              </Col>
                              <Col span={6}>
                                <div style={{ height: '3.1rem' }}>
                                  <PoorProcess data={topList[e + 3]} />
                                </div>
                              </Col>
                            </Row>
                          </div>
                        );
                      })
                    )}
                    {leftTop > 0 && (
                      <div>
                        <Row>
                          {leftAttrTop.map(e => {
                            return (
                              <Col span={6}>
                                <div style={{ height: '3.1rem' }}>
                                  <PoorProcess data={topList[e]} />
                                </div>
                              </Col>
                            );
                          })}
                        </Row>
                      </div>
                    )}
                  </Carousel>
                </div>

              </div>
            </BorderBox12>
          </Col>
        </Row>
      </Fragment>
    );
  }
}
