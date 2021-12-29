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
import { dateRender } from 'utils/renderer';
import { isEmpty } from 'lodash';
import styles from './index.less';
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
      <div className={parseInt(boardCardList.testDay, 0) >= 7? styles['board-card-one']: (parseInt(boardCardList.testDay, 0) >= 2 && parseInt(boardCardList.testDay, 0) < 7)?styles['board-card-two']:styles['board-card-three']}>
        <Row style={{ height: '80px' }}>
          <Col span={18}>
            <Row>
              <Col span={15} style={{ width: '90px' }}>
                <div className={styles['board-card-code']}>
                  {parseInt(boardCardList.testDay, 0) >= 7 && <img src={tag3} alt="" />}
                  {parseInt(boardCardList.testDay, 0) >= 2 &&
                    parseInt(boardCardList.testDay, 0) < 7 && <img src={tag1} alt="" />}
                  {parseInt(boardCardList.testDay, 0) < 2 && <img src={tag2} alt="" />}
                </div>
                <Tooltip title={boardCardList.materialCode}>
                  <div
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '16px',
                    }}
                  >
                    {boardCardList.materialCode}
                  </div>
                </Tooltip>
              </Col>
              <Col
                span={8}
                className={styles['board-card-number']}
                title={`${boardCardList.quantity}${boardCardList.uomCode}`}
              >
                <Divider type="vertical" style={{ height: '14px' }} />
                <span style={{ fontSize: '16px' }}>{boardCardList.quantity}</span>
                <span>{boardCardList.uomCode}</span>
              </Col>
            </Row>
            <Row style={{ padding: '2px 0px' }}>
              <Col span={24} style={{ height: '20px' }}>
                <Tooltip title={boardCardList.materialName}>
                  <div
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {boardCardList.materialName}
                  </div>
                </Tooltip>
              </Col>
            </Row>
            <Row style={{ padding: '2px 0px' }}>
              <Col span={24} style={{ height: '0px' }}>
                {/* {boardCardList.supplierName} */}
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
        <Row style={{display: isEmpty(boardCardList.instructionDocNum)?'none':'block'}}>
          <Col span={24}>
            送货单：{ boardCardList.instructionDocNum }
          </Col>
        </Row>
        <Row style={{display: !isEmpty(boardCardList.instructionDocNum)?'none':'block'}}>
          <Col span={24}>
            &nbsp;
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={10} style={{ fontSize: '16px' }}>
            {dateRender(boardCardList.createdDate)}
          </Col>
          <Col
            span={14}
            title={boardCardList.locatorName}
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            {boardCardList.locatorName}
          </Col>
        </Row>
      </div>
    );
  }
}
