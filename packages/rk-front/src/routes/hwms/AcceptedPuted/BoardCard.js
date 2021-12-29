/*
 * @Description: 看板卡片
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-21 10:06:32
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-05-06 17:43:23
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Form, Divider, Row, Col } from 'hzero-ui';
import styles from './index.less';
import tece from '@/assets/tece.png';
import expedited from '@/assets/expedited.png';
import tag3 from '@/assets/tag3.png';
import tag1 from '@/assets/tag1.png';
import tag2 from '@/assets/tag2.png';

@Form.create({ fieldNameProp: null })
export default class BoardCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  /**
   * render
   * @returns React.element
   */
  render() {
    const { boardCardList = {} } = this.props;
    return (
      <div className={boardCardList.waitStoragedDays >= 3? styles['board-card-one'] : (boardCardList.waitStoragedDays >= 1 && boardCardList.waitStoragedDays < 3)? styles['board-card-two']: styles['board-card-three']}>
        <Row>
          <Col span={18}>
            <Row>
              <Col span={15} style={{ width: '90px' }}>
                <div className={styles['board-card-code']}>
                  {boardCardList.waitStoragedDays >= 3 && <img src={tag3} alt="" />}
                  {boardCardList.waitStoragedDays >= 1 && boardCardList.waitStoragedDays < 3 && (
                    <img src={tag1} alt="" />
                  )}
                  {boardCardList.waitStoragedDays < 1 && <img src={tag2} alt="" />}
                </div>
                <span style={{ fontSize: '16px' }}>{boardCardList.materialCode}</span>
              </Col>
              <Col span={8} className={styles['board-card-number']}>
                <Divider type="vertical" style={{ height: '14px' }} />
                <span style={{ fontSize: '16px' }}>{boardCardList.taskQty}</span>
                <span>{boardCardList.uomCode}</span>
              </Col>
            </Row>
            <Row style={{ padding: '2px 0px' }}>
              <Col span={24} style={{ height: '33px' }}>
                {boardCardList.materialName}
              </Col>
            </Row>
            <Row style={{ padding: '2px 0px' }}>
              <Col span={24} style={{ height: '33px' }}>
                {/* {boardCardList.supplierName} */}
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            {boardCardList.urgentFlag === 'Y' && (
              <div style={{ textAlign: 'end' }}>
                <img src={expedited} alt="" style={{ marginTop: '-2px' }} />
              </div>
            )}
            {boardCardList.uaiFlag === 'Y' && (
              <div style={{ textAlign: 'end' }}>
                <img src={tece} alt="" style={{ marginTop: '-2px' }} />
              </div>
            )}
            {/* {boardCardList.uaiFlag === 'Y' && (
              <div style={{ textAlign: 'end' }}>
                <img src={twoTest} alt="" style={{ marginTop: '-2px' }} />
              </div>
            )} */}
          </Col>
        </Row>
        <Divider />
        {/* <Row>
          <Col span={12} style={{ fontSize: '16px' }}>
            待定
          </Col>
          <Col span={12} style={{ fontSize: '16px' }}>
            待定
          </Col>
        </Row> */}
      </div>
    );
  }
}
