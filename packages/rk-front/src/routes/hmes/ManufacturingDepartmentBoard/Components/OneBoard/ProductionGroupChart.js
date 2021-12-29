/* eslint-disable array-callback-return */
/*
 * @Author: your name
 * @Date: 2021-10-21 14:25:42
 * @LastEditTime: 2021-11-11 19:45:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \works\xidun\packages\hlct-front\src\routes\hwms\Dailystock\index.js
 */
import React, { Component, Fragment } from 'react';
import { isEmpty } from 'lodash';
import { Carousel } from 'hzero-ui';
import ProductProps from './productprops';
import styles from './index.less';


export default class DailyPlanTable extends Component {
  constructor(props) {
    super(props);
    // this.fetchCardData(0);
    this.state = {};
  }

  headStyle(info) {
    return `<span style="color:#20A7BE;">${info}</span>`;
  }

  render() {
    const { data = {}, second } = this.props;
    let moonList = [];
    let moonList1 = [];
    let moonList2 = [];
    let moonList3 = [];
    let moonList4 = []; // 是否更换颜色为警示颜色
    let noticeColor1;
    if (data.length !== 0) {
      if (data.yaxisList.length !== 0) {
        moonList = data.yaxisList;
      };
      if (data.xaxisList.length !== 0) {
        moonList1 = data.xaxisList[1].proportionList;
        moonList3 = data.xaxisList[1].valueList;
        moonList4 = data.xaxisList[1].noticeIndexList;
        noticeColor1 = data.xaxisList[1].noticeColor;
      };
      if (data.xaxisList.length !== 0) {
        moonList2 = data.xaxisList[0].valueList;
      };
    }
    const moonListProccess = moonList1.map((e) => {
      return e * 100;
    });
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
        <div className={styles['manufacturingDepartmentBoard_monthPlan-content']}>
          <div className={styles.monthplan}>
            <span className={styles['productProps_content-quantity']}>数量</span>
            <span className={styles['productProps_content-quantity']}>进度</span>
          </div>
        </div>
        <Carousel
          autoplay
          dots={false}
          autoplaySpeed={second * 1000}
          pauseOnDotsHover
          pauseOnHover={false}
          vertical
        >
          {isEmpty(moonList) ? (
            <div className={styles.temporaryNoData}>暂无数据</div>
          ) : (
            attrMoon.map(e => {
              return (
                <div>
                  <div style={{ height: '2.5rem' }}>
                    <div style={{ height: '0.5rem' }}>
                      <ProductProps
                        moonList={moonList[e]}
                        moonListProccess={moonListProccess[e]}
                        moonList2={moonList2[e]}
                        moonList3={moonList3[e]}
                        noticeColor1={moonList4.includes(e) ? noticeColor1 : '#2B92FD'}
                      />
                    </div>
                    <div style={{ height: '0.5rem' }}>
                      <ProductProps
                        moonList={moonList[e + 1]}
                        moonListProccess={moonListProccess[e + 1]}
                        moonList2={moonList2[e + 1]}
                        moonList3={moonList3[e + 1]}
                        noticeColor1={moonList4.includes(e + 1) ? noticeColor1 : '#2B92FD'}
                      />
                    </div>
                    <div style={{ height: '0.5rem' }}>
                      <ProductProps
                        moonList={moonList[e + 2]}
                        moonListProccess={moonListProccess[e + 2]}
                        moonList2={moonList2[e + 2]}
                        moonList3={moonList3[e + 2]}
                        noticeColor1={moonList4.includes(e + 2) ? noticeColor1 : '#2B92FD'}
                      />
                    </div>
                    <div style={{ height: '0.5rem' }}>
                      <ProductProps
                        moonList={moonList[e + 3]}
                        moonListProccess={moonListProccess[e + 3]}
                        moonList2={moonList2[e + 3]}
                        moonList3={moonList3[e + 3]}
                        noticeColor1={moonList4.includes(e + 3) ? noticeColor1 : '#2B92FD'}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {leftMoon > 0 && (
            <div>
              <div style={{ height: '2.5rem' }}>
                {leftAttrMoon.map(e => {
                  return (
                    <div style={{ height: '0.5rem' }}>
                      <ProductProps
                        moonList={moonList[e]}
                        moonListProccess={moonListProccess[e]}
                        moonList2={moonList2[e]}
                        moonList3={moonList3[e]}
                        noticeColor1={moonList4.includes(e) ? noticeColor1 : '#2B92FD'}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Carousel>
        <div className={styles.monthplan_bootm}>
          <span />
          未完成
          <span />
          已完成
          <span />
          警示
        </div>
      </Fragment>
    );
  }
}
