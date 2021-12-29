/*
 * @Description: 芯片位置
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-18 16:32:19
 * @LastEditTime: 2021-03-19 15:05:32
 */
import React, { Component } from 'react';
import { Bind } from 'lodash-decorators';
import { Row } from 'hzero-ui';
import ChipInfoPosition from './ChipInfoPosition';

export default class BajoChipInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  @Bind()
  renderColumn(line) {
    const cols = [];
    for (let i = 0; i <= line; i++) {
      cols.push(
        <ChipInfoPosition i={i} line={line} />
      );
    }
    return <Row style={{ marginTop: '3px' }}>{cols}</Row>;
  }

  render() {
    const { position, selectSource } = this.props;
    return (
      <React.Fragment>
        <Row style={{ lineHeight: '25px', fontWeight: '500', fontSize: '14px' }}>芯片位置：{position}</Row>
        <Row style={{ lineHeight: '25px', fontWeight: '500', fontSize: '14px' }}>是否冻结：{selectSource.freezeFlagMeaning}</Row>
        <Row style={{ lineHeight: '25px', fontWeight: '500', fontSize: '14px' }}>热沉编码：{selectSource.hotSinkCode}</Row>
        <Row style={{ lineHeight: '25px', fontWeight: '500', fontSize: '14px' }}>芯片实验代码：{selectSource.chipLabCode}</Row>
        <Row style={{ lineHeight: '25px', fontWeight: '500', fontSize: '14px' }}>芯片实验备注：{selectSource.chipLabRemark}</Row>
        {/* <Row style={{ lineHeight: '25px', fontWeight: '500', fontSize: '14px' }}>不良类型：10 PSC</Row> */}
        {/* <Button
          // onClick={() => ncLoad()}
          style={{ marginTop: '8px', marginRight: '8px' }}
          type="primary"
        >
          OK
        </Button> */}
        {/* <Button>
          NG
        </Button> */}
        {/* {this.renderColumn(10)} */}
        {/* <Row style={{lineHeight: '25px', fontWeight: '500', fontSize: '14px'}}>芯片位置：{chipLocation}</Row> */}
      </React.Fragment>
    );
  }
}
