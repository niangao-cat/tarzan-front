/*
 * @Description: 异常清单
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-03-20 10:32:27
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2021-03-09 09:52:58
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Divider, Form, Row, Col, Spin, Tooltip } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import styles from '../index.less';

@connect(({ exceptionHandlingPlatform, loading }) => ({
  exceptionHandlingPlatform,
  loading,
}))
@Form.create({ fieldNameProp: null })
export default class ExceptionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      borderVal: '',
      backgroundColorVal: '',
      borderBottomVal: '',
      borderRightVal: '',
      colorVal: '#4E3F32',
      recordLoading: false,
    };
  }

  componentDidMount() {
    const { data: { exceptionStatus } } = this.props;
    if (exceptionStatus === 'RESPOND') {
      this.setState({
        borderVal: '1px solid rgba(235, 202, 11, 1)',
        backgroundColorVal: '#FAEE18',
        borderBottomVal: '1px solid #FAEE18',
        borderRightVal: '1px solid #FAEE18',
        colorVal: '#333',
      });
    }
    if (exceptionStatus === 'CLOSE') {
      this.setState({
        borderVal: '1px solid #A9B6C3',
        backgroundColorVal: '#A9B6C3',
        borderBottomVal: '1px solid #A9B6C3',
        borderRightVal: '1px solid #A9B6C3',
        colorVal: '#333',
      });
    }
    if (exceptionStatus === 'NEW' || exceptionStatus === 'UPGRADE') {
      this.setState({
        borderVal: '1px solid #FF9325',
        backgroundColorVal: '#FF9325',
        borderBottomVal: '1px solid #FF9325',
        borderRightVal: '1px solid #FF9325',
        colorVal: '#fff',
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { data: { exceptionStatus } } = this.props;
    const { data } = nextProps;
    if (exceptionStatus !== data.exceptionStatus) {
      if (data.exceptionStatus === 'RESPOND') {
        this.setState({
          borderVal: '1px solid rgba(235, 202, 11, 1)',
          backgroundColorVal: '#FAEE18',
          borderBottomVal: '1px solid #FAEE18',
          borderRightVal: '1px solid #FAEE18',
          colorVal: '#333',
        });
      }
      if (data.exceptionStatus === 'CLOSE') {
        this.setState({
          borderVal: '1px solid #A9B6C3',
          backgroundColorVal: '#A9B6C3',
          borderBottomVal: '1px solid #A9B6C3',
          borderRightVal: '1px solid #A9B6C3',
          colorVal: '#333',
        });
      }
      if (data.exceptionStatus === 'NEW' || data.exceptionStatus === 'UPGRADE') {
        this.setState({
          borderVal: '1px solid #FF9325',
          backgroundColorVal: '#FF9325',
          borderBottomVal: '1px solid #FF9325',
          borderRightVal: '1px solid #FF9325',
          colorVal: '#fff',
        });
      }
    }
  }

  /**
   * @description: 打开异常清单抽屉-调用CardList.js中的showModal
   * @param {String} type
   */
  @Bind()
  showExceptionRecordModal(type, data) {
    const {
      dispatch,
    } = this.props;
    this.setState({ recordLoading: true });
    // 判断数据是否输入了工位
    if(data.workcellId){
      dispatch({
        type: 'exceptionHandlingPlatform/showExceptionRecordModal',
        payload: {
          exceptionWkcRecordId: data.exceptionWkcRecordId,
        },
      }).then(res => {
        this.setState({ recordLoading: false });
        if (res) {
          this.props.showModal(false, true, type);
          dispatch({
            type: 'exceptionHandlingPlatform/updateState',
            payload: {
              exceptionStatus: data.exceptionStatus,
            },
          });
        }
      });
    }else{
      dispatch({
        type: 'exceptionHandlingPlatform/showExceptionNoRecordModal',
        payload: {
          exceptionWkcRecordId: data.exceptionWkcRecordId,
        },
      }).then(res => {
        this.setState({ recordLoading: false });
        if (res) {
          this.props.showModal(false, true, type);
          dispatch({
            type: 'exceptionHandlingPlatform/updateState',
            payload: {
              exceptionStatus: data.exceptionStatus,
            },
          });
        }
      });
    }
  }

  render() {
    const { data = {}, type } = this.props;
    const { borderVal, backgroundColorVal, borderBottomVal, borderRightVal, colorVal } = this.state;
    return (
      <div
        className={styles['exception-list']}
        style={{ border: borderVal }}
        onClick={() => this.showExceptionRecordModal(type, data)}
      >
        <Spin spinning={this.state.recordLoading}>
          <Row
            className={styles['exception-list-first']}
            style={{ backgroundColor: backgroundColorVal, color: colorVal }}
          >
            <Col span={15}>
              <Tooltip title={data.exceptionName}>
                <div
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >{data.exceptionName}
                </div>
              </Tooltip>
            </Col>
            <Col span={1}>
              <Divider style={{ backgroundColor: '#634A34', height: '15px' }} type="vertical" />
            </Col>
            <Col span={8}>
              <Tooltip title={data.shiftCode}>
                <div
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >{data.shiftCode}
                </div>
              </Tooltip>
            </Col>
            {data.exceptionLevel && <div className={styles['exception-list-level']}>{data.exceptionLevel}</div>}
          </Row>
          <Row className={styles['exception-list-second']} style={{ borderBottom: borderBottomVal }}>
            <Tooltip title={data.exceptionRemark}>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{data.exceptionRemark}</div>
            </Tooltip>
          </Row>
          <Row className={styles['exception-list-third']}>
            <Col
              style={{ borderRight: borderRightVal }}
              className={styles['exception-list-third-time']}
              span={8}
            >
              <div>{data.creationDate ? data.creationDate : '--:--'}</div>
            </Col>
            <Col
              style={{ borderRight: borderRightVal }}
              className={styles['exception-list-third-time']}
              span={8}
            >
              <div>{data.respondTime ? data.respondTime : '--:--'}</div>
            </Col>
            <Col
              style={{ borderRight: '0px' }}
              className={styles['exception-list-third-time']}
              span={8}
            >
              <div>{data.closeTime ? data.closeTime : '--:--'}</div>
            </Col>
          </Row>
        </Spin>
      </div>
    );
  }
}
