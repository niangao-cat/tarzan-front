/*
 * @Description: 看板卡片
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-21 10:06:32
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-05-06 16:17:44
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Form, Row, Col } from 'hzero-ui';
import styles from './index.less';
import tag1 from '@/assets/tag1.png';
import tag2 from '@/assets/tag2.png';
import tag3 from '@/assets/tag3.png';
import tag4 from '@/assets/tag4.png';
import tag5 from '@/assets/tag5.png';
import tag6 from '@/assets/tag6.png';

@Form.create({ fieldNameProp: null })
export default class Tag extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    return (
      <div className={styles['test-board-tag']}>
        <div className={styles['board-tag-title']} style={{ transform: 'scale(0.85)' }}>
          图例
        </div>
        <Row style={{ marginTop: 2 }}>
          <Col span={14}>
            <img
              src={tag3}
              alt=""
              style={{ marginTop: '-2px', height: 12, transform: 'scale(0.85)' }}
            />
            <span style={{ marginLeft: '4px' }}>待检&gt;7</span>
          </Col>
          <Col span={10}>
            <img
              src={tag4}
              alt=""
              style={{ marginTop: '-2px', height: 12, transform: 'scale(0.85)' }}
            />
            <span style={{ marginLeft: '4px' }}>加急</span>
          </Col>
        </Row>
        <Row style={{ marginTop: 2 }}>
          <Col span={14}>
            <img
              src={tag1}
              alt=""
              style={{ marginTop: '-2px', height: 12, transform: 'scale(0.85)' }}
            />
            <span style={{ marginLeft: '4px' }}>待检2~7</span>
          </Col>
          <Col span={10}>
            <img
              src={tag5}
              alt=""
              style={{ marginTop: '-2px', height: 12, transform: 'scale(0.85)' }}
            />
            <span style={{ marginLeft: '4px' }}>特采</span>
          </Col>
        </Row>
        <Row style={{ marginTop: 2 }}>
          <Col span={14}>
            <img
              src={tag2}
              alt=""
              style={{ marginTop: '-2px', height: 12, transform: 'scale(0.85)' }}
            />
            <span style={{ marginLeft: '4px' }}>待检&lt;2</span>
          </Col>
          <Col span={10}>
            <img
              src={tag6}
              alt=""
              style={{ marginTop: '-2px', height: 12, transform: 'scale(0.85)' }}
            />
            <span style={{ marginLeft: '4px' }}>挑选</span>
          </Col>
        </Row>
      </div>
    );
  }
}
