/*
 * @Description: 芯片信息-正方形
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-05 14:01:28
 * @LastEditTime: 2021-03-19 15:12:17
 */
import React, { Component } from 'react';
import { Popconfirm } from 'hzero-ui';

export default class ChipInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: '', // 位置
    };
  }

  componentDidMount() {
    const { position } = this.props;

    this.setState({ position });
  }

  render() {
    const { children, clickPosition, popconfirm, dataSource = {}, customizelocation, loadRow, loadColumn, index } = this.props;
    const { position } = this.state;
    const { materialLotLoadId = null, freezeFlag = '' } = dataSource;
    let bgcColor = '';
    if (materialLotLoadId) {
      bgcColor = '#29BECE';
    } else if (popconfirm && !materialLotLoadId) {
      bgcColor = '#fff';
    } else {
      bgcColor = '#f5f5f5';
    }
    if (freezeFlag === 'Y') {
      bgcColor = '#c55305';
    }
    if (customizelocation && customizelocation.includes(position)) {
      bgcColor = '#92d46c';
    }
    return (
      <React.Fragment>
        {popconfirm ? (
          <Popconfirm title={materialLotLoadId ? "当前位置已有芯片！" : `当前芯片位置${position}，是否转移芯片?`} onConfirm={() => !materialLotLoadId && clickPosition(dataSource, position, index, loadRow, loadColumn)}>
            <div
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: bgcColor,
                cursor: 'pointer',
                border: '1px solid #ccc',
              }}
            // onClick={()=>{
            //   return ;
            // }}
            >
              {children}
            </div>
          </Popconfirm>
        ) : (
          <div
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: bgcColor,
              cursor: 'pointer',
              border: '1px solid #ccc',
            }}
            onClick={() => materialLotLoadId ? clickPosition(dataSource, position, index, loadRow, loadColumn) : false}
          >
            {children}
          </div>
        )}

      </React.Fragment>
    );
  }
}
