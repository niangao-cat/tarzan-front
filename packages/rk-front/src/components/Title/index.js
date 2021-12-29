/*
 * @Description: 类型
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-07 18:10:19
 */

import React, { Component } from 'react';

import secondTitleImg from '@/assets/JXblue.png';
import styles from './index.less';

export default class index extends Component {
  render() {
    const { titleValue } = this.props;
    return (
      <div className={styles['public-title']}>
        <img src={secondTitleImg} alt="" style={{marginTop: '-3PX', marginRight: '5px'}} />
        <span style={{fontSize: '14px', lineHeight: '19px', color: 'rgba(51,51,51,1)'}}>{titleValue}</span>
      </div>
    );
  }
}
