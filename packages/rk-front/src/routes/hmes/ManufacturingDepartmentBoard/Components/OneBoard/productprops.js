/* eslint-disable array-callback-return */
/*
 * @Author: your name
 * @Date: 2021-10-21 14:25:42
 * @LastEditTime: 2021-11-11 12:29:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \works\xidun\packages\hlct-front\src\routes\hwms\Dailystock\index.js
 */
import React, { Component, Fragment } from 'react';
import { Progress, Tooltip } from 'hzero-ui';
import { isEmpty } from 'lodash';

import styles from './index.less';

export default class productprops extends Component {
  constructor(props) {
    super(props);
    // this.fetchCardData(0);
    this.state = {
    };
  }


  render() {
    const {
      moonList,
      moonListProccess = [],
      moonList2 = [],
      moonList3 = [],
      noticeColor1 = '',
    } = this.props;
    return (
      <Fragment>
        <div className={styles.productProps_content} style={{ marginLeft: '0.25rem' }}>
          <Tooltip className={styles['productProps_content-tool-tip']} title={moonList}>
            <span className={styles['productProps_content-material']}>{!isEmpty(moonList) && moonList.length <= 5 ? moonList : `${moonList.slice(0, 5)}...`}</span>
          </Tooltip>
          <div className={styles.content_div}>
            <Progress showInfo={false} percent={moonListProccess} strokeWidth={10} strokeColor={noticeColor1} />
          </div>
          <span className={styles['productProps_content-quantity']}>{moonList3}/{moonList2}</span>
          <span className={styles['productProps_content-quantity']}>{moonListProccess.toFixed(2)}%</span>
        </div>
      </Fragment>
    );
  }
}
