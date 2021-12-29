/*
 * @Description: 产品生产属性-title
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-14 10:15:44
 * @LastEditTime: 2020-07-15 15:56:07
 */

import React, { Component } from 'react';

import isUndefined from 'lodash/isUndefined';
import styles from '../index.less';

export default class Title extends Component {
  render() {
    const { titleValue, used, sum } = this.props;
    return (
      <div className={styles['item-title-product-traceability']}>
        <div className={styles['item-title-div-product-traceability']} />
        <span>{titleValue}</span>
        {!(isUndefined(used) && isUndefined(sum)) && (
          <span style={{ float: 'right' }}>{`${used} / ${sum}`}</span>
        )}
      </div>
    );
  }
}
