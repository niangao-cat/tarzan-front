/**
 * ListTable - 表格
 * @date: 2019-12-10
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Table } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

import { DragSource, DragPreviewImage } from 'react-dnd';
import styles from './index.less';

/* eslint-disable */
const modelPrompt = 'tarzan.workshop.dispatchPlatform.model.dispatchPlatform';

const itemSoure = {
  beginDrag(props) {
    document
      .getElementsByClassName('ant-table-body')[0]
      .setAttribute('style', 'overflow-x: hidden');
    return props.record;
  },
  endDrag(props, monitor) {
    document.getElementsByClassName('ant-table-body')[0].setAttribute('style', 'overflow-x: auto');
    if (!monitor.didDrop()) {
      return;
    }
  },
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  };
}

class DragRow extends React.Component {
  render() {
    const { connectDragSource, connectDragPreview, record, ...restProps } = this.props;
    const style = { ...restProps.style, cursor: 'move' };
    const className = restProps.className;
    const data =
      `${'data:image/svg+xml,' +
        "<svg xmlns='http://www.w3.org/2000/svg' width='180' height='70'>" +
        "<foreignObject width='100%' height='100%'>" +
        "<div xmlns='http://www.w3.org/1999/xhtml' style='font-size:14px;font-family:Helvetica;background:rgba(15, 45, 97);color:white;height:100%;width:170px;display:inline-flex;align-items:center;padding-left:10px;border-radius:4px'>" +
        '执行作业：'}${record.eoNum}<br />` +
      `步骤名称：${record.stepName}` +
      `</div>` +
      `</foreignObject>` +
      `</svg>`;
    return (
      <>
        <DragPreviewImage connect={connectDragPreview} src={data} />
        {/* {connectDragPreview(<div style={{ position: 'absolute', zIndex: '-1', background: '#1e3255' }}>Hello</div>)} */}
        {connectDragSource(<tr {...restProps} className={className} style={style} />)}
      </>
    );
  }
}

const DragTableRow = DragSource('item', itemSoure, collect)(DragRow);

@connect(({ dispatchPlatform, loading }) => ({
  dispatchPlatform,
  fetchLoading: loading.effects['dispatchPlatform/fetchTableInfo'],
  subTableLoading: loading.effects['dispatchPlatform/fetchSubTableInfo'],
}))
export default class ListTable extends React.Component {
  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagination) {
    const { onSearch } = this.props;
    onSearch(pagination);
  }

  //  渲染子表格
  expandedRowRender = record => {
    const { subTableLoading } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.workcellCode`).d('WKC'),
        width: 130,
        dataIndex: 'workcellCode',
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('物料描述'),
        width: 130,
        dataIndex: 'materialName',
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
        title: intl.get(`${modelPrompt}.eoDispatchStatusDesc`).d('状态'),
        dataIndex: 'eoDispatchStatusDesc',
        width: 130,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.dispatchQty`).d('数量'),
        dataIndex: 'dispatchQty',
        width: 130,
        align: 'left',
      },
    ];
    return (
      <Table
        bordered={false}
        rowKey="eoDispatchActionId"
        loading={subTableLoading}
        columns={columns}
        dataSource={record.subTableList}
        pagination={false}
      />
    );
  };

  // 获取子表格数据
  fetchSubTableList = (expanded, record) => {
    const {
      dispatch,
      dispatchPlatform: { tableList, WKCRangeList, expandedRowKeysArray },
    } = this.props;
    if (expanded) {
      dispatch({
        type: 'dispatchPlatform/fetchSubTableInfo',
        payload: {
          routerStepId: record.routerStepId,
          eoId: record.eoId,
          operationId: record.operationId,
          materialId: record.materialId,
          materialCode: record.materialCode,
          materialName: record.materialName,
          workcellIdList: WKCRangeList.map(item => item.workcellId),
        },
      }).then(res => {
        if (res && res.success) {
          const newTableList = tableList.map(item => {
            if (item.routerOperationId === record.routerOperationId) {
              return { ...item, subTableList: res.rows };
            } else {
              return item;
            }
          });
          expandedRowKeysArray.push(record.routerOperationId);
          dispatch({
            type: 'dispatchPlatform/updateState',
            payload: {
              tableList: newTableList,
              expandedRowKeysArray: expandedRowKeysArray,
            },
          });
        }
      });
    } else {
      dispatch({
        type: 'dispatchPlatform/updateState',
        payload: {
          expandedRowKeysArray: expandedRowKeysArray.filter(
            item => item !== record.routerOperationId
          ),
        },
      });
    }
  };

  //  选中行
  selectRow = record => {
    this.props.dispatch({
      type: 'dispatchPlatform/updateState',
      payload: {
        selectedRowId: record.routerOperationId,
        selectedRowRecord: record,
      },
    });
  };

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      dispatchPlatform: {
        tableList = [],
        tablePagination = {},
        selectedRowId,
        expandedRowKeysArray,
      },
      fetchLoading,
    } = this.props;
    const components = {
      body: {
        row: DragTableRow,
      },
    };
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
        title: intl.get(`${modelPrompt}.WOCode`).d('WO编码'),
        dataIndex: 'workOrderNum',
        width: 130,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
        width: 130,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 130,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.dispatchableQty`).d('未调度数'),
        dataIndex: 'dispatchableQty',
        width: 130,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.qty`).d('计划数'),
        dataIndex: 'qty',
        width: 130,
        align: 'left',
        render: val => val || '自有',
      },
      {
        title: intl.get(`${modelPrompt}.assignNum`).d('调度数'),
        dataIndex: 'assignQty',
        width: 130,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.planStartTime`).d('计划开始时间'),
        dataIndex: 'planStartTime',
        width: 160,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.planEndTime`).d('计划结束时间'),
        dataIndex: 'planEndTime',
        width: 160,
        align: 'center',
      },
    ];
    return (
      <>
        <Table
          loading={fetchLoading}
          className={styles.listTable}
          rowKey="routerOperationId"
          dataSource={tableList}
          columns={columns}
          pagination={tablePagination || {}}
          onChange={this.handleTableChange}
          scroll={{ x: tableScrollWidth(columns) }}
          bordered={false}
          onExpand={this.fetchSubTableList}
          expandedRowKeys={expandedRowKeysArray}
          expandedRowRender={this.expandedRowRender}
          components={components}
          onRow={record => {
            return {
              onClick: () => {
                this.selectRow(record);
              },
            };
          }}
          rowClassName={record => {
            let className = '';
            if (record.assignQty === 0) {
              className = 'expandHidden';
            }
            if (record.routerOperationId === selectedRowId) {
              className = `${className} listTableSelectedRow`;
              // return 'listTableSelectedRow';
            }
            return className;
          }}
        />
      </>
    );
  }
}

/* eslint-enable */
