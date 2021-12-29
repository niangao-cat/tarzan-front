/*
 * @Description: 条码
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-03-16 15:49:59
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-10-10 16:00:00
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Row, Form, Col } from 'hzero-ui';
import { Scrollbars } from 'react-custom-scrollbars';
import { Bind } from 'lodash-decorators';
import styles from '../index.less';
import BarCodeList from './BarCodeList.js';

@Form.create({ fieldNameProp: null })
export default class BarCode extends Component {
  // 提交数据
  @Bind()
  handleSubmit(values, barCode, index) {
    const { onCodeSubmit } = this.props;
    onCodeSubmit(values, barCode, index);
  }

  @Bind()
  deleteBarCode(values) {
    const { deleteBarCode } = this.props;
    deleteBarCode(values);
  }

  renderCol = barCodeList => {
    const cols = [];
    for (let i = 0; i <= barCodeList.length - 1;) {
      const element = [];
      let j = 0;
      for (; j < 4 && i <= barCodeList.length - 1; j++, i++) {
        element.push(
          <BarCodeList
            onCodeSubmit={this.handleSubmit}
            deleteBarCode={this.deleteBarCode}
            barCode={barCodeList[i]}
            index={i}
          />);
      }
      cols.push(<Col span={24 / Math.ceil(barCodeList.length / 4)}>{element}</Col>);
    }
    const width = 540 * Math.ceil(barCodeList.length / 4);
    return <Row style={{ width: `${width}px` }}>{cols}</Row>;
  };

  render() {
    const { barCodeList = [] } = this.props;
    return (
      <Scrollbars style={{ height: '280px' }}>
        <div className={styles['barcode-content']}>{this.renderCol(barCodeList)}</div>
      </Scrollbars>
    );
  }
}
