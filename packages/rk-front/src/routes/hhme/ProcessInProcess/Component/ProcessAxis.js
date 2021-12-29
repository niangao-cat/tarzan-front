/*
 * @Description: 工序在制轴轴
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-03-23 15:04:30
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-08-19 19:17:55
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { PureComponent } from 'react';
import { Form, Divider, Row, Icon, Col, Tooltip } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from '../index.less';

@Form.create({ fieldNameProp: null })
export default class ProcessAxis extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      line: 0,
    };
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { processDataList = [] } = this.props;
    const { line } = this.state;
    return (
      // eslint-disable-next-line no-useless-concat
      <Scrollbars style={{ height: `${line * 190}` + 'px' }}>
        <div className={styles.renderProcessAxis}>{this.renderProcessAxis(processDataList)}</div>
      </Scrollbars>
    );
  }

  @Bind()
  renderProcessAxis(arr) {
    const cols = [];
    for (let i = 0; i <= arr.length - 1;) {
      const element = [];
      const line = i / 6 + 1;
      this.setState({ line });
      let float = '';
      let floatDivider = '';
      let marginTop = '0px';
      let marginDivider;
      let footHr = '';
      let footMarginLeft = '';
      let className = 'process-axis';
      if (line % 2 === 0) {
        float = 'right';
        floatDivider = 'left';
        marginDivider = '-10px';
        footHr = '-26px 0px 0px 0px';
        footMarginLeft = '-75px';
        className = 'process-axis-left';
      }
      if (line % 2 !== 0) {
        floatDivider = 'right';
        footHr = '-26px 0px 0 160px';
        className = 'process-axis';
      }
      if (line !== 1) {
        marginTop = '28px';
      }
      for (let j = 0; j < 6 && i <= arr.length - 1; j++, i++) {
        element.push(
          <div className={styles[className]} style={{ float, marginTop, width: '235px' }}>
            <div className={styles['process-axis-top']}>
              <Row className={styles['process-axis-top-row-now']}>
                <Col
                  className={styles['process-axis-top-col-now']}
                  style={{ marginLeft: '3px' }}
                  span={6}
                >
                  当前
                </Col>
                <Col span={17}>
                  <Scrollbars style={{ height: '35px', width: '104px' }}>
                    {arr[i].hmeEoJobWipVO3List.map(item => {
                      if (item.workingQtySum > 0) {
                        return (
                          <Row>
                            <Col className={styles['process-axis-top-col-name']} span={15}>
                              <Tooltip title={item.materialName}>{item.materialCode}</Tooltip>
                            </Col>
                            <Col className={styles['process-axis-top-col']} span={8}>
                              <Tooltip title={item.workingQtySum}>
                                {item.workingQtySum}
                                {/* {item.uomName} */}
                              </Tooltip>
                            </Col>
                          </Row>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </Scrollbars>
                </Col>
              </Row>
            </div>
            <div className={styles['process-axis-mid']}>
              <div
                className={styles['process-axis-mid-div']}
                style={{ width: '120px', textAlign: '-webkit-center', marginLeft: '14px' }}
              >
                <Divider
                  className={styles['process-axis-mid-derLef']}
                  style={{
                    width: '70px',
                    float: 'right',
                    margin: '5px 65px',
                    backgroundColor: '#30698E',
                  }}
                />
                <div className={styles['top-circle']} />
                <Divider
                  className={styles['process-axis-mid-derRig']}
                  style={{
                    width: '180px',
                    float: 'left',
                    margin: '-6px 65px',
                    backgroundColor: '#30698E',
                  }}
                />
                <div className={styles['top-number']}>
                  <Tooltip title={arr[i].workcellName}>
                    {arr[i].sequenceNum} {arr[i].workcellName}
                  </Tooltip>
                </div>
              </div>
            </div>
            <div className={styles['process-axis-foot']}>
              <hr className={styles['process-axis-foot-hr']} style={{ margin: footHr }} />
              <div
                style={{ marginLeft: footMarginLeft }}
                className={styles['process-axis-foot-info']}
              >
                <Row className={styles['process-axis-foot-info-row']}>
                  <Col className={styles['process-axis-foot-col-stock']} style={{ marginLeft: '3px' }} span={6}>
                    库存
                  </Col>
                  <Col span={17}>
                    <Scrollbars style={{ height: '35px', width: '104px' }}>
                      <Row>
                        {arr[i].hmeEoJobWipVO3List.map(item => {
                          if (item.completedQtySum > 0) {
                            return (
                              <span>
                                <Col className={styles['process-axis-foot-info-col-name']} span={15}>
                                  <Tooltip title={item.materialName}>{item.materialCode}</Tooltip>
                                </Col>
                                <Col className={styles['process-axis-foot-info-col']} span={8}>
                                  <Tooltip title={item.completedQtySum}>
                                    {item.completedQtySum}
                                    {/* {item.uomName} */}
                                  </Tooltip>
                                </Col>
                              </span>
                            );
                          } else {
                            return null;
                          }
                        })}
                      </Row>
                    </Scrollbars>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        );
      }
      cols.push(
        <React.Fragment>
          <Row style={{ width: '1413px' }}>{element}</Row>
          {line !== Math.ceil(arr.length / 6) && (
            <Row style={{ width: '1443px' }}>
              <div
                className={styles['process-divider']}
                style={{ float: floatDivider, marginLeft: marginDivider }}
              >
                <Divider
                  type="vertical"
                  style={{ backgroundColor: 'rgb(48, 105, 142)', height: '60px' }}
                />
                <div>
                  <Icon type="down" style={{ color: 'rgb(48, 105, 142)' }} />
                </div>
                <div>
                  <Icon type="down" style={{ color: 'rgb(48, 105, 142)' }} />
                </div>
                <div>
                  <Icon type="down" style={{ color: 'rgb(48, 105, 142)' }} />
                </div>
                <Divider
                  type="vertical"
                  style={{ backgroundColor: 'rgb(48, 105, 142)', height: '60px' }}
                />
              </div>
            </Row>
          )}
        </React.Fragment>
      );
    }
    return cols;
  }
}
