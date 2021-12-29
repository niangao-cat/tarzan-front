/**
 * FilterForm - 搜索框
 * @date: 2019-12-10
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

import { DragSource, DropTarget } from 'react-dnd';
import update from 'immutability-helper';
import styles from './index.less';

/* eslint-disable */
const modelPrompt = 'tarzan.workshop.dispatchPlatform.model.dispatchPlatform';

function dragDirection(
  dragIndex,
  hoverIndex,
  initialClientOffset,
  clientOffset,
  sourceClientOffset
) {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return 'downward';
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return 'upward';
  }
}

class BodyRow extends React.Component {
  render() {
    const {
      isOver,
      connectDragSource,
      connectDropTarget,
      moveRow,
      dragRow,
      clientOffset,
      sourceClientOffset,
      initialClientOffset,
      ...restProps
    } = this.props;
    const style = { ...restProps.style, cursor: 'move' };
    // eslint-disable-next-line
    let className = restProps.className;
    if (isOver && initialClientOffset) {
      const direction = dragDirection(
        dragRow.index,
        restProps.index,
        initialClientOffset,
        clientOffset,
        sourceClientOffset
      );
      if (direction === 'downward') {
        className += ' drop-over-downward';
      }
      if (direction === 'upward') {
        className += ' drop-over-upward';
      }
    }

    return connectDragSource(
      connectDropTarget(<tr {...restProps} className={className} style={style} />)
    );
  }
}
const rowSource = {
  beginDrag(props) {
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    // eslint-disable-next-line
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (selfConnect, monitor) => ({
  connectDropTarget: selfConnect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset(),
}))(
  DragSource('row', rowSource, (selfConnect, monitor) => ({
    connectDragSource: selfConnect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset(),
  }))(BodyRow)
);

@connect(({ dispatchPlatform, loading }) => ({
  dispatchPlatform,
  loading: loading.effects['dispatchPlatform/fetchScheduledSubTableList'],
}))
export default class DragSortingTable extends React.Component {
  components = {
    body: {
      row: DragableBodyRow,
    },
  };

  // 行拖动
  moveRow = (dragIndex, hoverIndex) => {
    const {
      dispatch,
      dispatchPlatform: { scheduledSubTableList },
    } = this.props;
    const dragRow = scheduledSubTableList[dragIndex];
    dispatch({
      type: 'dispatchPlatform/scheduledSubTableListReorder',
      payload: {
        scheduledSubTableList: update(this.props.dispatchPlatform, {
          scheduledSubTableList: {
            $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
          },
        }).scheduledSubTableList,
      },
    });
  };

  render() {
    const {
      dispatchPlatform: { scheduledSubTableList = [], selectedRowKeys },
      loading,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.eoNum`).d('执行作业'),
        width: 130,
        dataIndex: 'eoNum',
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.stepName`).d('步骤名称'),
        width: 130,
        dataIndex: 'stepName',
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.assignNum`).d('调度数'),
        dataIndex: 'dispatchQty',
        width: 100,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.eoDispatchStatusDesc`).d('状态'),
        dataIndex: 'eoDispatchStatusDesc',
        width: 100,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.workcellCode`).d('WKC'),
        width: 190,
        dataIndex: 'workcellCode',
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.dispatchShiftDate`).d('调度日期'),
        dataIndex: 'shiftDate',
        width: 130,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.shiftCode`).d('班次'),
        dataIndex: 'shiftCode',
        width: 130,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
        width: 130,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('物料描述'),
        width: 130,
        dataIndex: 'materialName',
        align: 'left',
      },
    ];

    const rowSelection = {
      onSelect: record => {
        this.props.dispatch({
          type: 'dispatchPlatform/updateState',
          payload: {
            revokeRow: record,
          },
        });
      },
      onChange: selectedRowKey => {
        this.props.dispatch({
          type: 'dispatchPlatform/updateState',
          payload: {
            selectedRowKeys: selectedRowKey,
          },
        });
      },
      selectedRowKeys,
      type: 'radio',
      columnWidth: 60,
    };

    return (
      <div className={styles.sortSubTable}>
        <Table
          bordered={false}
          loading={loading}
          columns={columns}
          dataSource={scheduledSubTableList}
          components={this.components}
          onRow={(record, index) => ({
            index,
            moveRow: this.moveRow,
          })}
          scroll={{ x: tableScrollWidth(columns) }}
          pagination={false}
          rowSelection={rowSelection}
        />
      </div>
    );
  }
}

/* eslint-enable */
