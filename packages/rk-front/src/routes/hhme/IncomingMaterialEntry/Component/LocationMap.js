/*
 * @Description: 位置图
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-05 14:00:12
 * @LastEditTime: 2020-10-01 15:40:35
 */

import React, { Component } from 'react';
import { Form } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import ChipInfo from './ChipInfo';
import { upperCaseChars } from '@/utils/utils';

@connect(({ incomingMaterialEntry }) => ({
  incomingMaterialEntry,
}))
@Form.create({ fieldNameProp: null })
export default class LocationMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hightBack: '', // 选中格子的ID，用来判断哪个格子高亮
    };
  }

  /**
   * 组件挂载后执行方法
   */
  componentDidMount() {
  }

  @Bind()
  renderRow(line, col, info, locationMapInfo) {
    const cols = [];
    let index = 0;
    const { hightBack } = this.state;
    for (let i = 0; i < line; i++) {
      const element = [];
      for (let j = 0; j < col; j++) {
        element.push(
          <td style={{ width: '20px', marginRight: '6px' }}>
            <ChipInfo
              row={upperCaseChars()[i]}
              col={j}
              data={info[index]}
              clickDay={this.clickDay}
              hightBack={hightBack}
              locationMapInfo={locationMapInfo}
              index={index}
            />
          </td>
        );
        index += 1;
      }
      cols.push(<tr style={{ marginTop: '3px' }}><td style={{ color: '#666' }}>{upperCaseChars()[i]}</td>{element}</tr>);
    }
    return cols;
  }

  @Bind()
  renderColumn(line) {
    const cols = [];
    for (let i = 0; i <= line; i++) {
      if (i === 0) {
        cols.push(
          <td style={{ width: '20px', marginRight: '6px', color: '#666' }} />
        );
      } else {
        cols.push(
          <td style={{ width: '20px', marginRight: '6px', color: '#666' }}>
            {i}
          </td>
        );
      }
    }
    return <tr style={{ marginTop: '3px' }}>{cols}</tr>;
  }

  /**
   * @description: 点击小格子
   * @param {type} val 数据，每个小格子就是一堆芯片
   * @param {type} row 容器的行数
   * @param {type} col 容器的列数
   * @param {type} index 每个小格子在返回数据的下标值
   */
  @Bind()
  clickDay(val, row, col, index) {
    const { dispatch, woRecord } = this.props;
    this.setState({ hightBack: val.materialLotLoadId });
    dispatch({
      type: 'incomingMaterialEntry/updateState',
      payload: {
        locationMapInfo: {
          ...val,
          row,
          col,
          capacity: woRecord.capacity,
          barCol: '',
          index,
        },
      },
    });
  }

  render() {
    const {
      materialContainerInfo,
      info,
      locationMapInfo,
    } = this.props;
    return (
      <React.Fragment>
        <table className='incoming-material-table'>
          {this.renderColumn(materialContainerInfo.locationColumn)}
          {this.renderRow(materialContainerInfo.locationRow, materialContainerInfo.locationColumn, info, locationMapInfo)}
        </table>
      </React.Fragment>
    );
  }
}
