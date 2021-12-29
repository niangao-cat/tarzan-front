/*
 * @Description: 芯片位置信息-长方形
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-05 16:43:20
 * @LastEditTime: 2020-08-05 17:17:15
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
    return (
      <React.Fragment>
        <div className={styles['incoming-material-bajo-chip-position']} style={{ border: this.state.border }} />
      </React.Fragment>
    );
  }
}
