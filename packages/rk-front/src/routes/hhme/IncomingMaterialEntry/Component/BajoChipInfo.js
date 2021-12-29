/*
 * @Description: 巴条和芯片位置信息
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-05 14:01:28
 * @LastEditTime: 2020-10-01 15:40:26
 */
import React, { Component } from 'react';
import { Bind } from 'lodash-decorators';
import { Row, Button } from 'hzero-ui';
import { connect } from 'dva';
import { Scrollbars } from 'react-custom-scrollbars';
import ChipInfoPosition from './ChipInfoPosition';

@connect(({ incomingMaterialEntry }) => ({
  incomingMaterialEntry,
}))
export default class BajoChipInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  @Bind()
  renderColumn(line, docList) {
    const cols = [];
    const { heightBack } = this.props;
    for (let i = 0; i < line; i++) {
      cols.push(
        <ChipInfoPosition
          i={i + 1}
          line={line}
          barCol={this.barCol}
          docList={docList || []}
          heightBack={heightBack}
        />
      );
    }
    return <Row style={{ marginTop: '3px', width: `${line * 15}px` }}>{cols}</Row>;
  }

  /**
   * @description: 点击bar条位置
   * @param {type} ncList 不良数据
   */
  @Bind()
  barCol(val, ncList) {
    const { dispatch } = this.props;
    dispatch({
      type: 'incomingMaterialEntry/updateState',
      payload: {
        barCol: val,
        heightBack: val,
        ncList,
      },
    });
  }

  render() {
    const {
      ncLoad,
      locationMapInfo,
      barCol,
      deleteNcLoad,
      deleteNcLoadLoading,
      ncLoadLoading,
    } = this.props;
    return (
      <React.Fragment>
        <Row style={{ lineHeight: '25px', fontWeight: '500', fontSize: '14px' }}>巴条位置：{locationMapInfo.row}{locationMapInfo.col + 1}</Row>
        <Row style={{ lineHeight: '25px', fontWeight: '500', fontSize: '14px' }}>数量：{locationMapInfo.capacity}</Row>
        <Scrollbars style={{ height: '66px' }}>
          {this.renderColumn(locationMapInfo.capacity, locationMapInfo.docList)}
        </Scrollbars>
        <Button
          onClick={() => ncLoad()}
          style={{ marginTop: '8px', marginRight: '8px' }}
          type="primary"
          loading={ncLoadLoading}
        >
          NG
        </Button>
        <Button
          onClick={() => deleteNcLoad()}
          loading={deleteNcLoadLoading}
        >
          OK
        </Button>
        <Row style={{ lineHeight: '25px', fontWeight: '500', fontSize: '14px' }}>芯片位置：{barCol}</Row>
      </React.Fragment>
    );
  }
}
