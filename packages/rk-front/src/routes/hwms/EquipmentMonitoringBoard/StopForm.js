/**
 * 查询条件
 */
import React from 'react';
import { Form, Col, Row } from 'hzero-ui';
import {
  SEARCH_FORM_CLASSNAME,
} from 'utils/constants';

// model 层连接
@Form.create({ fieldNameProp: null })
export default class StopForm extends React.Component {

  // 渲染
  render() {
      const data = "工位1";
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row>
          <Col className="filterStopName">
            <span style={{lineHeight: '1.8vw'}}>序&emsp;&ensp;&nbsp;&nbsp;号：<span>01</span></span>
          </Col>
          <Col className="filterStopName">
            <span style={{lineHeight: '1.8vw'}}>设备名称：<span>激光焊接机</span></span>
          </Col>
          <Col className="filterStopName">
            <span style={{lineHeight: '1.8vw'}}>设备代码：<span>671421</span></span>
          </Col>
          <Col className="filterStopName">
            <span style={{lineHeight: '1.8vw'}}>位&emsp;&ensp;&nbsp;&nbsp;置：<span>{data}</span></span>
          </Col>
          <Col className="filterStopName">
            <span style={{lineHeight: '1.8vw'}}>异常类型：<span>跳线断开</span></span>
          </Col>
          <Col className="filterStopName">
            <span style={{lineHeight: '1.8vw'}}>发现时间：<span>02-05&ensp;08：30</span></span>
          </Col>
          <Col className="filterStopName">
            <span style={{lineHeight: '1.8vw'}}>响应时间：<span>02-05&ensp;08：30</span></span>
          </Col>
          <Col className="filterStopName">
            <span style={{lineHeight: '1.8vw'}}>响应人&ensp;&nbsp;&nbsp;：<span>赵四</span></span>
          </Col>
          <Col className="filterStopName">
            <span style={{lineHeight: '1.8vw'}}>关闭时间：<span>02-05&ensp;08：30</span></span>
          </Col>
          <Col className="filterStopName">
            <span style={{lineHeight: '1.8vw'}}>关闭人&ensp;&nbsp;&nbsp;：<span>赵四</span></span>
          </Col>
        </Row>
      </Form>
    );
  }
}

