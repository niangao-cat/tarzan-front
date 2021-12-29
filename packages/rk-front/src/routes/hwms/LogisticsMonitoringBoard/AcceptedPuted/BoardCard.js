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
import { Form, Divider, Row, Col, Tooltip } from 'hzero-ui';
// import { isEmpty } from 'lodash';
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

  /**
   * render
   * @returns React.element
   */
  render() {
    const { boardCardList = {} } = this.props;
    return (
      <div
        className={
          boardCardList.waitStoragedDays >= 3
            ? styles['pured-board-card-one']
            : boardCardList.waitStoragedDays >= 1 && boardCardList.waitStoragedDays < 3
            ? styles['pured-board-card-one']
            : styles['pured-board-card-one']
        }
      >
        <Row>
          <Col span={18}>
            <Row>
              <Col>
                <div className={styles['board-card-code']}>
                  {parseInt(boardCardList.testDay, 0) >= 7 && <img src={tag3} alt="" />}
                  {parseInt(boardCardList.testDay, 0) >= 2 &&
                  parseInt(boardCardList.testDay, 0) < 7 && <img src={tag1} alt="" />}
                  {parseInt(boardCardList.testDay, 0) < 2 && <img src={tag2} alt="" />}
                </div>
                <Tooltip title={boardCardList.materialCode}>
                  <div>{boardCardList.materialCode}</div>
                </Tooltip>
              </Col>
              {/* <Divider type="vertical" style={{ height: '10px' }} /> */}
              {/* <Col */}
              {/*  span={9} */}
              {/*  className={styles['board-card-number']} */}
              {/*  style={{ */}
              {/*    transform: 'scale(0.85)', */}
              {/*    // overflow: 'hidden', */}
              {/*    // textOverflow: 'ellipsis', */}
              {/*    // whiteSpace: 'nowrap', */}
              {/*  }} */}
              {/*  title={`${boardCardList.taskQty}${boardCardList.uomCode}`} */}
              {/* > */}
              {/*  <span style={{ fontSize: '12px' }}> */}
              {/*    {boardCardList.taskQty} */}
              {/*  </span> */}
              {/*  <span style={{ fontSize: '12px' }}> */}
              {/*    {boardCardList.uomCode} */}
              {/*  </span> */}
              {/* </Col> */}
            </Row>
            <Row>
              {/* <Divider type="vertical" style={{ height: '10px' }} /> */}
              <Col
                // span={9}
                style={{
                  fontSize: '12px',
                  // transform: 'scale(0.85)',
                }}
                className={styles['board-card-number']}
                // style={{
                //   transform: 'scale(0.85)',
                //   // overflow: 'hidden',
                //   // textOverflow: 'ellipsis',
                //   // whiteSpace: 'nowrap',
                // }}
                title={`${boardCardList.taskQty}${boardCardList.uomCode}`}
              >
                <span style={{ fontSize: '12px' }}>{boardCardList.taskQty}</span>
                <span style={{ fontSize: '12px' }}>{boardCardList.uomCode}</span>
              </Col>
            </Row>
            <Row style={{ padding: '2px 0px' }}>
              <Col
                span={24}
              >
                <Tooltip title={boardCardList.materialName}>
                  <div
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      // transform: 'scale(0.85)',
                    }}
                  >
                    {boardCardList.materialName}
                  </div>
                </Tooltip>
              </Col>
            </Row>
            {/* <Row style={{ padding: '2px 0px' }}> */}
            {/*  <Col span={24} style={{ height: '33px', fontSize: '12px', transform: 'scale(0.85)' }}> */}
            {/*    /!* {boardCardList.supplierName} *!/ */}
            {/*  </Col> */}
            {/* </Row> */}
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
        <Row
          style={{
            display: 'block',
          }}
        >
          <Col span={24}>{boardCardList.instructionDocNum}</Col>
        </Row>
        <Divider style={{ position: 'absolute', top: '70%' }} />
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
