/*
 * @Description: 芯片位置信息-长方形
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-05 16:43:20
 * @LastEditTime: 2020-08-20 15:16:27
 */

import React, { Component } from 'react';
import styles from '../index.less';

export default class ChipInfoPosition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      border: '1px solid',
    };
  }

  render() {
    const { i, barCol, docList = [], heightBack } = this.props;
    const newArray = docList.filter((item) => {
      return item.loadNum === `${i}`;
    });
    let backcolor = '#26BFCF';
    if (newArray.length) {
      backcolor = 'rgb(197, 83, 5)';
    }
    if (heightBack && heightBack === i) {
      backcolor = '#92d46c';
    }
    return (
      <React.Fragment>
        <div
          className={styles['incoming-material-bajo-chip-position']}
          style={{
            border: this.state.border,
            cursor: 'pointer',
            backgroundColor: backcolor,
          }}
          onClick={() => barCol(i, newArray)}
        >
          {i}
        </div>
      </React.Fragment>
    );
  }
}
