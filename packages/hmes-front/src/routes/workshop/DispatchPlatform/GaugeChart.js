/**
 * DispatchPlatform - 调度平台
 * @date: 2019-12-3
 * @author: JRQ <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { DropTarget } from 'react-dnd';
import Echarts from '@/components/Echarts';
import notification from 'utils/notification';
import { isEqual } from 'lodash';
import moment from 'moment';
import intl from 'utils/intl';
import styles from './index.less';

const modelPrompt = 'tarzan.workshop.dispatchPlatform.model.dispatchPlatform';

const spec = {
  // 拖拽放下时触发事件
  drop(props, monitor, component) {
    component.DropConfirmOperation(monitor.getItem());
  },
  hover(props, monitor) {
    monitor.isOver({ shallow: true });
  },
};

function dropCollect(dropConnect, monitor) {
  return {
    connectDropTarget: dropConnect.dropTarget(),
    hovered: monitor.isOver(),
    canDrop: monitor.canDrop(),
    item: monitor.getItem(),
  };
}

@connect(({ dispatchPlatform }) => ({
  dispatchPlatform,
}))
@DropTarget('item', spec, dropCollect) //  *****DropTarget必须和类的定义连在一起放置，否则无法读到类信息*****
export default class GaugeChart extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      lineStyle: {},
      detail: {},
    };
  }

  //  拖拽后将表格数据，传到图表中
  DropConfirmOperation = dragRowDetail => {
    const {
      dataSource: { shiftDate },
    } = this.props;
    if (shiftDate < moment().format('YYYY-MM-DD')) {
      notification.error({
        message: intl
          .get('tarzan.workshop.dispatchPlatform.message.pastTimeForbidden')
          .d('不可调度到过去日期！'),
      });
    } else {
      this.confirm(dragRowDetail);
    }
  };

  // 在拖动后，重新获取子表格数据
  fetchSubTableList = dragRowDetail => {
    const {
      dispatch,
      dispatchPlatform: { tableList, WKCRangeList },
    } = this.props;
    dispatch({
      type: 'dispatchPlatform/fetchSubTableInfo',
      payload: {
        routerStepId: dragRowDetail.routerStepId,
        eoId: dragRowDetail.eoId,
        operationId: dragRowDetail.operationId,
        materialId: dragRowDetail.materialId,
        materialCode: dragRowDetail.materialCode,
        materialName: dragRowDetail.materialName,
        workcellIdList: WKCRangeList.map(item => item.workcellId),
      },
    }).then(res => {
      if (res && res.success) {
        const newTableList = tableList.map(item => {
          if (item.routerOperationId === dragRowDetail.routerOperationId) {
            return {
              ...item,
              dispatchableQty: 0,
              assignQty: item.assignQty + item.dispatchableQty,
              subTableList: res.rows,
            };
          } else {
            return item;
          }
        });
        dispatch({
          type: 'dispatchPlatform/updateState',
          payload: {
            tableList: newTableList,
          },
        });
      }
    });
  };

  // 根据传入值来设置图形options
  componentDidMount() {
    this.setSomething(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.dataSource, this.props.dataSource)) {
      this.setSomething(nextProps);
    }
  }

  //  用来更新图表
  setSomething = props => {
    const {
      dataSource: { unPublishedQty, publishedQty, capacityQty },
    } = props;
    let data = [];
    let lineStyle = {};
    let detail = {};
    if (capacityQty === 0 && publishedQty === 0 && unPublishedQty === 0) {
      // 三项都为0
      data = [{ value: 0 }];
      lineStyle = {
        color: [[1, '#DADADA']],
        width: 8,
      };
      detail = {
        formatter: '0%',
        fontSize: '12',
        padding: [14, 0, 0, 0],
        color: '#666666',
      };
    } else if (capacityQty === 0) {
      // 产能为0
      data = [
        {
          value: ((unPublishedQty / (unPublishedQty + publishedQty)) * 100).toFixed(0),
          name: intl.get(`${modelPrompt}.unpublishedRate`).d('未发布率'),
        },
      ];
      lineStyle = {
        color: [[unPublishedQty / (unPublishedQty + publishedQty), '#FFBF5C'], [1, '#6299FF']],
        width: 8,
      };
      detail = {
        formatter: `${((unPublishedQty / (unPublishedQty + publishedQty)) * 100).toFixed(0)}%`,
        fontSize: '12',
        padding: [14, 0, 0, 0],
        color: '#666666',
      };
    } else {
      // 正常
      data = [
        {
          value: (((unPublishedQty + publishedQty) / capacityQty) * 100).toFixed(2),
          name: intl.get(`${modelPrompt}.capacityRatio`).d('产能占比率'),
        },
      ];
      detail = {
        formatter: `${(((unPublishedQty + publishedQty) / capacityQty) * 100).toFixed(0)}%`,
        fontSize: '12',
        padding: [14, 0, 0, 0],
        color: '#666666',
      };
      if (unPublishedQty + publishedQty - capacityQty > 0) {
        //  超标
        lineStyle = {
          color: [[1, '#AA1717']],
          width: 8,
        };
      } else {
        lineStyle = {
          color: [
            [unPublishedQty / capacityQty, '#FFBF5C'],
            [(unPublishedQty + publishedQty) / capacityQty, '#6299FF'],
            [1, '#47DBA5'],
          ],
          width: 8,
        };
      }
    }
    this.setState({
      data,
      lineStyle,
      detail,
    });
  };

  //  拖拽进入后查询
  confirm = dragRowDetail => {
    const {
      dispatch,
      dataSource: { workcellId, shiftDate, shiftCode, capacityQty },
      dispatchPlatform: { defaultSiteId, selectedProLineId, selectedOperationId, selectedChartId },
    } = this.props;
    dispatch({
      type: 'dispatchPlatform/confirmOperation',
      payload: {
        assignQty: dragRowDetail.dispatchableQty,
        eoId: dragRowDetail.eoId,
        routerStepId: dragRowDetail.routerStepId,
        shiftCode,
        shiftDate,
        workcellId,
      },
    }).then(res => {
      if (res && res.success) {
        notification.success();
        this.fetchSubTableList(dragRowDetail);
        dispatch({
          type: 'dispatchPlatform/fetchOneChartInfo',
          payload: {
            defaultSiteId,
            operationId: selectedOperationId,
            prodLineId: selectedProLineId,
            shiftCode: res.rows.shiftCode,
            shiftDate: res.rows.shiftDate,
            workcellId: res.rows.workcellId,
            capacityQty,
          },
        });
        if (selectedChartId === `${workcellId}_${shiftDate}_${shiftCode}`) {
          //  如果拖拽到选中的图表上，重查已调度执行作业
          dispatch({
            type: 'dispatchPlatform/fetchScheduledSubTableList',
            payload: {
              shiftCode,
              shiftDate,
              workcellId,
            },
          });
          dispatch({
            type: 'dispatchPlatform/updateState',
            payload: {
              revokeRow: {},
              selectedRowKeys: [],
            },
          });
        }
      } else {
        notification.error({ message: res.message });
      }
    });
  };

  selectGaugeChart = () => {
    const { dispatch, dataSource } = this.props;
    const { workcellId, shiftDate, shiftCode } = dataSource;
    dispatch({
      type: 'dispatchPlatform/fetchScheduledSubTableList',
      payload: {
        shiftCode,
        shiftDate,
        workcellId,
      },
    });
    dispatch({
      type: 'dispatchPlatform/updateState',
      payload: {
        selectedChartId: `${workcellId}_${shiftDate}_${shiftCode}`,
        selectedChartDetail: dataSource,
        tabsActiveKey: 'subTableSort',
        revokeRow: {},
        selectedRowKeys: [],
      },
    });
    document.getElementsByClassName('page-content-wrap')[0].scrollTop = 0;
  };

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { data, lineStyle, detail } = this.state;
    const {
      connectDropTarget,
      hovered,
      dispatchPlatform: { selectedChartId },
      dataSource: { workcellId, shiftDate, shiftCode, unPublishedQty, publishedQty, capacityQty },
    } = this.props;
    const options = {
      tooltip: {
        formatter: '{b} : {c}%',
      },
      series: [
        {
          type: 'gauge',
          id: `${workcellId}_${shiftDate}_${shiftCode}`,
          radius: '90%',
          data,
          min: 0,
          max: 101,
          axisLine: {
            lineStyle,
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          pointer: {
            length: '70%',
            width: '4',
          },
          title: {
            show: false,
          },
          detail,
        },
      ],
    };
    return connectDropTarget(
      <div
        className={hovered ? `${styles.gaugeChart} ${styles.gaugeChartHover}` : styles.gaugeChart}
        onClick={this.selectGaugeChart}
      >
        <div
          className={
            selectedChartId === `${workcellId}_${shiftDate}_${shiftCode}`
              ? styles.selectedChart
              : styles.unSelectedChart
          }
        />
        <div className={styles.shiftCode}>{shiftCode}</div>
        <Echarts option={options} />
        <div className={styles.bottomTools}>
          <div className={styles.tool}>{unPublishedQty}</div>
          <div className={styles.tool}>{publishedQty}</div>
          <div className={styles.tool}>{capacityQty === 0 ? null : capacityQty}</div>
        </div>
      </div>
    );
  }
}
