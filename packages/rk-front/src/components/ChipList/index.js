/*
 * @Description: 巴条和芯片位置信息
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-05 14:01:28
 * @LastEditTime: 2020-10-14 16:13:54
 */
import React, { Component } from 'react';
import { Bind } from 'lodash-decorators';
import { Row, Button } from 'hzero-ui';
import { connect } from 'dva';
import { Scrollbars } from 'react-custom-scrollbars';
import { isFunction } from 'lodash';
import ChipInfoPosition from './ChipInfoPosition';

@connect(({ incomingMaterialEntry }) => ({
  incomingMaterialEntry,
}))
export default class BajoChipInfo extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
      barCol: [], // 芯片位置
      ncList: [],
    };
  }

  @Bind()
  renderColumn(line, docList, multiple) {
    const cols = [];
    const { barCol } = this.state;
    for (let i = 0; i < line; i++) {
      cols.push(
        <ChipInfoPosition
          i={i + 1}
          line={line}
          onClickBarCol={this.onClickBarCol}
          docList={docList || []}
          heightBack={barCol}
          multiple={multiple}
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
  onClickBarCol(val, ncList, multiple) {
    // 如果是多选模式
    const { onClickBarCol } = this.props;
    if (multiple) {
      this.setState(({ barCol }) => ({
        barCol: barCol.includes(val) ? barCol.filter(item => item !== val) : [...barCol, val],
      }), () => {
        if (onClickBarCol) {
          onClickBarCol(this.state.barCol, ncList, this.state.barCol.includes(val));
        }
      });
    } else if (onClickBarCol) {
      this.setState({ barCol: [val] }, () => { onClickBarCol(this.state.barCol[0], ncList); });
    }
  }

  // 清除数据
  @Bind()
  clearData() {
    this.setState({ barCol: [] });
  }

  render() {
    const {
      ncLoad,
      deleteNcLoad,
      deleteNcLoadLoading,
      ncLoadLoading,
      clicklocation, // 点击位置
      capacity, // 数量
      docList = [], // 不良
      ngok = false, // 是否展示ngok, 默认不展示
      info = true,
      barPositionOrPosition = true,
      totalCapacity = null,
      chipposition = true,
      multiple = false,
    } = this.props;
    const { barCol, ncList = [] } = this.state;
    return (
      <React.Fragment>
        {info && (
          <span>
            {barPositionOrPosition ? <Row style={{ lineHeight: '25px', fontWeight: '500', fontSize: '14px' }}>巴条位置：{clicklocation}</Row> : <Row style={{ lineHeight: '25px', fontWeight: '500', fontSize: '14px' }}>位置：{clicklocation}</Row>}
            {totalCapacity && <Row style={{ lineHeight: '25px', fontWeight: '500', fontSize: '14px' }}>芯片容量：{totalCapacity}</Row>}
            <Row style={{ lineHeight: '25px', fontWeight: '500', fontSize: '14px' }}>实际芯片数：{capacity}</Row>
          </span>
        )}
        <Scrollbars style={{ height: '66px' }}>
          {this.renderColumn(capacity, docList, multiple)}
        </Scrollbars>
        {ngok && (
          <span>
            <Button
              onClick={() => ncLoad(ncList)}
              style={{ marginTop: '8px', marginRight: '8px' }}
              type="primary"
              loading={ncLoadLoading}
            >
              NG
            </Button>
            <Button
              onClick={() => deleteNcLoad(ncList)}
              loading={deleteNcLoadLoading}
            >
              OK
            </Button>
          </span>
        )}
        {info && chipposition && <Row style={{ lineHeight: '25px', fontWeight: '500', fontSize: '14px' }}>芯片位置：{barCol}</Row>}
      </React.Fragment>
    );
  }
}
