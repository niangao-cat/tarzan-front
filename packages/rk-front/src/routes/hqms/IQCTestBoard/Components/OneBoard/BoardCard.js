/*
 * @Description: 看板卡片
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-21 10:06:32
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-10-30 16:26:58
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Form, Divider, Row, Col, Tooltip } from 'hzero-ui';
import styles from './index.less';
import twoTest from '@/assets/twoTest.png';
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

  componentDidMount() { }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { boardCardList = {} } = this.props;
    return (
      <div className={styles['iqc-test-board-card']}>
        <Row>
          <Col span={18}>
            <Row>
              <Col span={15} style={{ width: '90px' }}>
                <div className={styles['board-card-code']}>
                  {boardCardList.inspTime >= 7 && <img src={tag3} alt="" />}
                  {boardCardList.inspTime >= 2 && boardCardList.inspTime < 7 && (
                    <img src={tag1} alt="" />
                  )}
                  {boardCardList.inspTime < 2 && <img src={tag2} alt="" />}
                </div>
                <Tooltip title={boardCardList.materialCode}>
                  <div
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '12px',
                    }}
                  >
                    {boardCardList.materialCode}
                  </div>
                </Tooltip>
              </Col>
              <Col span={8} className={styles['board-card-number']}>
                <Divider type="vertical" style={{ height: '14px' }} />
                <span style={{ fontSize: '16px' }}>{boardCardList.quantity}</span>
                <span>{boardCardList.uomCode}</span>
              </Col>
            </Row>
            <Row style={{ padding: '2px 0px' }}>
              <Col span={24} style={{ height: '28px' }}>
                <Tooltip title={boardCardList.materialName}>
                  <div
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      wordBreak: 'break-all',
                      WebkitLineClamp: '2',
                      WebkitBoxOrient: 'vertical',
                      display: '-webkit-box',
                    }}
                  >
                    {boardCardList.materialName}
                  </div>
                </Tooltip>
              </Col>
            </Row>
            <Row style={{ padding: '2px 0px' }}>
              <Col span={24} style={{ height: '28px' }}>
                <Tooltip title={boardCardList.supplierName}>
                  <div
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      wordBreak: 'break-all',
                      WebkitLineClamp: '2',
                      WebkitBoxOrient: 'vertical',
                      display: '-webkit-box',
                    }}
                  >
                    {boardCardList.supplierName}
                  </div>
                </Tooltip>
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            {boardCardList.identification === 'URGENT' && (
              <div style={{ textAlign: 'end' }}>
                <img src={expedited} alt="" style={{ marginTop: '-2px' }} />
              </div>
            )}
            {boardCardList.uaiFlag === 'Y' && (
              <div style={{ textAlign: 'end' }}>
                <img src={tece} alt="" style={{ marginTop: '-2px' }} />
              </div>
            )}
            {boardCardList.inspectionType === 'SECOND_INSPECTION' && (
              <div style={{ textAlign: 'end' }}>
                <img src={twoTest} alt="" style={{ marginTop: '-2px' }} />
              </div>
            )}
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={8} style={{ fontSize: '12px' }}>
            {boardCardList.qcByName}
          </Col>
          <Col span={16} style={{ fontSize: '12px', textAlign: 'end' }}>
            已检验<span style={{ color: '#27BECE' }}>{boardCardList.inspTime}</span>天
          </Col>
        </Row>
      </div>
    );
  }
}
