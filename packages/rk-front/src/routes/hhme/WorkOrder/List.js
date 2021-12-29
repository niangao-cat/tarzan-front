import React, { Component } from 'react';
import { Table, Modal } from 'hzero-ui';
import { isEmpty, isNumber } from 'lodash';
import { Bind } from 'lodash-decorators';
import classNames from 'classnames';
import moment from 'moment';

import notification from 'utils/notification';
import { getDateTimeFormat } from 'utils/utils';

import formatterCollections from 'utils/intl/formatterCollections';

const dateTimeFormat = getDateTimeFormat();


@formatterCollections({
  code: ['tarzan.event.eventQuery'], // code 为 [服务].[功能]的字符串数组
})
export default class List extends Component {

  @Bind()
  handleSaveData(e, className, record) {
    const { onSave } = this.props;
    const inputDom = document.getElementsByClassName(className);
    const key = className.split(' ')[0];
    if(e.keyCode === 13 && inputDom[0].value) {
      const date = key.split('#')[0];
      const shiftCode = key.split('#')[1];
      const calendarShiftId = key
          .split('#')[2]
          .split('-')
          .join('.');
      const diffDate = moment(date).diff(moment(), 'day');
      const shiftDate = moment(date).startOf('day').format(dateTimeFormat);
      if(diffDate < 3 && record.docCreatedFlag) {
        Modal.confirm({
          title: '该派工数据为3天内仓库配送数据。是否确定修改',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            if(inputDom.length > 0) {
              onSave([{...record, calendarShiftId, dispatchQty: inputDom[0].value, shiftCode, shiftDate}]);
            }
          },
          onCancel: () => {
            inputDom[0].value = record[key].dispatchQty;
          },
        });
      } else if(inputDom.length > 0) {
          onSave([{...record, calendarShiftId, dispatchQty: inputDom[0].value, shiftCode, shiftDate}]);
      }
    } else if(e.keyCode === 13) {
      notification.warning({
        description: '请输入派工数量',
      });
    }
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { dataSource = [], loading, weekList = [], limitDate, onNumberOfSetsDrawer } = this.props;
    let columns = [
      {
        title: '产品',
        dataIndex: 'productName',
        width: 80,
        fixed: 'left',
        align: 'center',
        onCell: () => ({
          style: {
            whiteSpace: 'normal',
          },
        }),
        render: (val, record, index) => {
          // render: ({ rowData: record, rowIndex: index}) => {
          const productionList = dataSource.map(e => e.productId);
          const first = productionList.indexOf(record.productId);
          const all = dataSource.filter(e => e.productId === record.productId).length;
          const obj = {
            children: (
              <div>
                <div>{record.productName}</div>
                <div>{record.productNum}</div>
              </div>
            ),
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: '完成/总数',
        dataIndex: 'completeTotalQty',
        width: 70,
        align: 'center',
        fixed: 'left',
        onCell: () => ({
          style: {
            whiteSpace: 'normal',
          },
        }),
        render: (val, record, index) => {
        // render: ({ dataIndex, rowData: record, rowIndex: index}) => {
          const productionList = dataSource.map(e => e.productId);
          const first = productionList.indexOf(record.productId);
          const all = dataSource.filter(e => e.productId === record.productId).length;
          const obj = {
            children: val,
            // children: record[dataIndex],
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: '工单号',
        dataIndex: 'workOrderNum',
        width: 60,
        align: 'center',
        fixed: 'left',
        onCell: () => ({
          style: {
            whiteSpace: 'normal',
          },
        }),
        render: (val, record, index) => {
          const workOrderNumList = dataSource.map(e => e.workOrderNum);
          const first = workOrderNumList.indexOf(record.workOrderNum);
          const all = dataSource.filter(e => e.workOrderNum === record.workOrderNum).length;
          const obj = {
            children: val,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: '交付时间',
        dataIndex: 'deliveryDate',
        width: 60,
        align: 'center',
        fixed: 'left',
        onCell: () => ({
          style: {
            whiteSpace: 'normal',
          },
        }),
        render: (val, record, index) => {
          const workOrderNumList = dataSource.map(e => e.workOrderNum);
          const first = workOrderNumList.indexOf(record.workOrderNum);
          const all = dataSource.filter(e => e.workOrderNum === record.workOrderNum).length;
          const obj = {
            children: val,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: '齐套数量',
        dataIndex: 'suiteQty',
        width: 60,
        align: 'center',
        fixed: 'left',
        render: (val, record) => (
          <a className="action-link" onClick={() => onNumberOfSetsDrawer(record, true)}>
            {val}
          </a>
        ),
        onCell: () => ({
          style: {
            whiteSpace: 'normal',
          },
        }),
      },
      // {
      //   title: '剩余数量',
      //   width: 60,
      //   dataIndex: 'remainQty',
      //   align: 'center',
      //   fixed: 'left',
      //   onCell: () => ({
      //     style: {
      //       whiteSpace: 'normal',
      //     },
      //   }),
      // },
      {
        title: '历史完工数量',
        width: 100,
        align: 'center',
        fixed: 'left',
        dataIndex: 'workcellCompletionQty',
        onCell: () => ({
          style: {
            whiteSpace: 'normal',
          },
        }),
      },
      {
        title: '未派数量',
        width: 60,
        align: 'center',
        fixed: 'left',
        dataIndex: 'unDispatchQty',
        onCell: () => ({
          style: {
            whiteSpace: 'normal',
          },
        }),
      },
      {
        title: '路线',
        dataIndex: 'workcellName',
        width: 60,
        align: 'center',
        fixed: 'left',
        onCell: () => ({
          style: {
            whiteSpace: 'normal',
          },
        }),
      },
    ];
    if (isEmpty(dataSource)) {
      columns = columns.map(e => ({
        ...e,
        fixed: '',
      }));
    }
    const weekWorkColumn = [];
    weekList.forEach((e, index) => {
      const flag = weekWorkColumn.map(a => a.header).includes(e.shiftDate);
      if (isEmpty(weekWorkColumn) || !flag) {
        const thisDayList = weekList.filter(thisDay => thisDay.shiftDate === e.shiftDate);
        const children = thisDayList.map(m => {
          return {
            title: m.shiftCode,
            dataIndex: `${e.shiftDate}#${m.shiftCode}`,
            align: 'center',
            width: 40,
            fixed: 'left',
            render: (value, record) => {
              const key = Object.keys(record).filter(a => a.includes(`${e.shiftDate}#${m.shiftCode}`))[0];
              const thisDayCalendarShiftId = !isEmpty(key) && key.split('#')[2] !== 'null' ? key.split('#')[2]
              .split('-')
              .join('.') : null;
              let nowValue = null;
              const inputDom = document.getElementsByClassName(`${key} ${record.workOrderNum}#${record.workcellCode}`);
              if(inputDom.length > 0) {
                nowValue = inputDom[0].valueAsNumber;
              }
              const className = isNumber(nowValue) && !isNaN(nowValue) && nowValue !== record[key].dispatchQty ? 'change-data' : !isEmpty(record[key]) && record[key].docCreatedFlag ? 'doc-create-data' : '';

              return thisDayCalendarShiftId && limitDate * 3 <= index ? (
                <input
                  type="number"
                  style={{ width: '100%' }}
                  min={0}
                  defaultValue={record[key].dispatchQty}
                  className={classNames(`${key}`, `${record.workOrderNum}#${record.workcellCode}`, 'workOrder_input', className)}
                  onKeyDown={event => this.handleSaveData(event, `${key} ${record.workOrderNum}#${record.workcellCode}`, record)}
                />
              ) : thisDayCalendarShiftId ? record[key].dispatchQty : '';
            },
          };
        });
        weekWorkColumn.push({
          header: e.shiftDate,
          title: e.shiftDate,
          width: 120,
          children,
          type: 'ColumnGroup',
        });
      }
    });
    const newColumns = columns.concat(weekWorkColumn);
    // console.log(newColumns);
    return (
      <Table
        loading={loading}
        dataSource={dataSource}
        columns={newColumns}
        pagination={false}
        scroll={{ x: 1000 }}
        rowKey="id"
        bordered
      />
      // <PerformanceTable
      //   height={400}
      //   bordered
      //   loading={loading}
      //   data={dataSource}
      //   columns={newColumns}
      // />
    );
  }
}
