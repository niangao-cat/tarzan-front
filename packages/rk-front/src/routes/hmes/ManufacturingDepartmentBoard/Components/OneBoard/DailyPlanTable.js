/* eslint-disable array-callback-return */
/*
 * @Author: your name
 * @Date: 2021-10-21 14:25:42
 * @LastEditTime: 2021-11-08 13:53:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \works\xidun\packages\hlct-front\src\routes\hwms\Dailystock\index.js
 */
import React, { Component, Fragment } from 'react';
import { Content } from 'components/Page';
import * as datav from '@jiaminghi/data-view-react';
import './index.less';

const { ScrollBoard } = datav;


export default class DailyPlanTable extends Component {
  constructor(props) {
    super(props);
    // this.fetchCardData(0);
    this.state = {
    };
  }

  headStyle(info) {
    return `<span style="color:#00FFFF;font-size:0.2rem">${info}</span>`;
  };

  render() {
    const data = [];
    const { dataSource, second } = this.props;
    dataSource.map((list) => {
      return data.push([
        `<span title="${list.materialCode}" style='font-size:12px;display: inline-block;width: auto;'>${list.materialCode}</span>`,
        `<span title="${list.materialName}" style='font-size:12px;display: inline-block;width: auto;'>${list.materialName}</span>`,
        `<span title="${list.dispatchQty}" style='font-size:12px;display: inline-block;width: auto;'>${list.dispatchQty}</span>`,
        `<span title="${list.actualDeliverQty}" style='font-size:12px;display: inline-block;width: auto;'>${list.actualDeliverQty}</span>`,
        `<span title="${list.planReachRate}" style='font-size:12px;display: inline-block;width: auto;'>${list.planReachRate}</span>`,
      ]);
    });
    const config = {
      header: [
        this.headStyle('物料编码'),
        this.headStyle('机型'),
        this.headStyle('派工数量'),
        this.headStyle('实际交付'),
        this.headStyle('计划达成率'),
      ],
      data,
      align: ['center', 'center', 'center', 'center', 'center'],
      rowNum: 5,
      headerBGC: '#223764',
      columnWidth: [80, 95, 80, 80, 90],
      hoverPause: false,
      oddRowBGC: '#203864',
      evenRowBGC: '#374D74',
      waitTime: second * 1000,
    };
    return (
      <Fragment>
        <Content>
          <ScrollBoard
            config={config}
            style={{ width: 'calc(100%)', height: '2.4rem' }}
          />
        </Content>
      </Fragment>
    );
  }
}
