/*
 * @Description: 芯片信息-正方形
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-05 14:01:28
 * @LastEditTime: 2020-09-20 09:55:41
 */
import React, { Component } from 'react';
import styles from '../index.less';


export default class ChipInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // @Bind
  // clickDay(data, row, col){

  // }

  render() {
    const { children, clickDay, data = {}, row, col, hightBack, index } = this.props;
    let backColor = '#fff';
    let arr = [];
    arr = data.docList || [];
    if (arr.length > 0) {
      backColor = '#c55305';
    }
    if (data.materialLotLoadId && arr.length === 0) {
      backColor = '#29BECE';
    }
    if (hightBack && hightBack === data.materialLotLoadId) {
      backColor = '#92d46c';
    }
    return (
      <React.Fragment>
        {backColor === '#fff' ? (
          <div
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: backColor,
              cursor: 'pointer',
              border: '1px solid rgb(204, 204, 204)',
            }}
            className={styles['incoming-material-chip-info']}
          >
            {children}
          </div>
        ) : (
          <div
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: backColor,
              cursor: 'pointer',
              border: '1px solid rgb(204, 204, 204)',
            }}
            className={styles['incoming-material-chip-info']}
            onClick={() => clickDay(data, row, col, index)}
          >
            {children}
          </div>
          )}

      </React.Fragment>
    );
  }
}
