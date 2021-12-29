/*
 * @Description: 看板卡片
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-21 10:06:32
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-10-08 23:43:51
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Form, Divider, Row, Col, Tooltip } from 'hzero-ui';
import twoTest from '@/assets/twoTest.png';
import tece from '@/assets/tece.png';
import expedited from '@/assets/expedited.png';
// import { dateRender } from 'utils/renderer';
import moment from 'moment';
import { isEmpty } from 'lodash';
import styles from './index.less';
// import tag3 from '@/assets/tag3.png';
// import tag1 from '@/assets/tag1.png';
// import tag2 from '@/assets/tag2.png';

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
          parseInt(boardCardList.testDay, 0) >= 7
            ? styles['test-board-card-one']
            : parseInt(boardCardList.testDay, 0) >= 2 && parseInt(boardCardList.testDay, 0) < 7
            ? styles['test-board-card-two']
            : styles['test-board-card-three']
        }
      >
        <Row>
          <Col span={18}>
            <Row>
              <Col span={24}>
                {/* <div className={styles['board-card-code']}> */}
                {/*  {parseInt(boardCardList.testDay, 0) >= 7 && <img src={tag3} alt="" />} */}
                {/*  {parseInt(boardCardList.testDay, 0) >= 2 && */}
                {/*    parseInt(boardCardList.testDay, 0) < 7 && <img src={tag1} alt="" />} */}
                {/*  {parseInt(boardCardList.testDay, 0) < 2 && <img src={tag2} alt="" />} */}
                {/* </div> */}
                <Tooltip title={boardCardList.materialCode}>
                  <div
                    style={{
                      // overflow: 'hidden',
                      // textOverflow: 'ellipsis',
                      // whiteSpace: 'nowrap',
                      fontSize: '12px',
                      // transform: 'scale(0.85)',
                    }}
                  >
                    {boardCardList.materialCode}
                  </div>
                </Tooltip>
              </Col>
              {/* <Col */}
              {/*  span={8} */}
              {/*  style={{ */}
              {/*    // overflow: 'hidden', */}
              {/*    // textOverflow: 'ellipsis', */}
              {/*    // whiteSpace: 'nowrap', */}
              {/*    fontSize: '12px', */}
              {/*    transform: 'scale(0.85)', */}
              {/*  }} */}
              {/*  className={styles['board-card-number']} */}
              {/*  title={`${boardCardList.quantity}${boardCardList.uomCode}`} */}
              {/* > */}
              {/*  <Divider type="vertical" style={{ height: '10px' }} /> */}
              {/*  <span style={{ fontSize: '12px', transform: 'scale(0.85)' }}> */}
              {/*    {boardCardList.quantity} */}
              {/*  </span> */}
              {/*  <span style={{ fontSize: '12px', transform: 'scale(0.85)' }}> */}
              {/*    {boardCardList.uomCode} */}
              {/*  </span> */}
              {/* </Col> */}
            </Row>
            <Row>
              <Col
                style={{
                  fontSize: '12px',
                  // transform: 'scale(0.85)',
                }}
                className={styles['board-card-number']}
                title={`${boardCardList.quantity}${boardCardList.uomCode}`}
              >
                {/* <Divider type="vertical" style={{ height: '10px' }} /> */}
                <span style={{ fontSize: '12px' }}>{boardCardList.quantity}</span>
                <span style={{ fontSize: '12px' }}>{boardCardList.uomCode}</span>
              </Col>
            </Row>
            <Row style={{ padding: '2px 0px' }}>
              <Col span={24}>
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
            {/*  <Col span={24} style={{ height: '0px' }}> */}
            {/*    /!* {boardCardList.supplierName} *!/ */}
            {/*  </Col> */}
            {/* </Row> */}
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
        <Row
          style={{
            display: isEmpty(boardCardList.instructionDocNum) ? 'none' : 'block',
            // transform: 'scale(0.85)',
          }}
        >
          <Col span={24}>{boardCardList.instructionDocNum}</Col>
        </Row>
        {/* <Row */}
        {/*  style={{ */}
        {/*    display: !isEmpty(boardCardList.instructionDocNum) ? 'none' : 'block', */}
        {/*    transform: 'scale(0.85)', */}
        {/*  }} */}
        {/* > */}
        {/*  <Col span={24}>&nbsp;</Col> */}
        {/* </Row> */}
        <Divider />
        <Row>
          <Col span={8} style={{ fontSize: '12px' }}>
            {moment(boardCardList.createdDate).format('MM-DD')}
          </Col>
          <Col
            span={16}
            title={boardCardList.locatorName}
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: '12px',
              cursor: 'pointer',
              // transform: 'scale(0.85)',
            }}
          >
            {boardCardList.locatorName}
          </Col>
        </Row>
      </div>
    );
  }
}
