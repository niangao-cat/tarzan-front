/*
 * @Description: 抽样方案定义
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-30 14:06:27
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-12-17 10:50:41
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';

class ListTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    const { loading, dataSource, onSearch, pagination } = this.props;
    const columns = [
      {
        title: '生产线',
        dataIndex: 'prodLineCode',
        width: 120,
        render: (val, record, index) => {
          const productionList = dataSource.map(e => `${e.workOrderNum}${e.workcellCode}${e.shiftDate}`);
          const first = productionList.indexOf(`${record.workOrderNum}${record.workcellCode}${record.shiftDate}`);
          const all = dataSource.filter(e => `${e.workOrderNum}${e.workcellCode}${e.shiftDate}` === `${record.workOrderNum}${record.workcellCode}${record.shiftDate}`).length;
          const obj = {
            children: val,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: '生产线描述',
        dataIndex: 'prodLineName',
        width: 150,
        render: (val, record, index) => {
          const productionList = dataSource.map(e => `${e.workOrderNum}${e.workcellCode}${e.shiftDate}`);
          const first = productionList.indexOf(`${record.workOrderNum}${record.workcellCode}${record.shiftDate}`);
          const all = dataSource.filter(e => `${e.workOrderNum}${e.workcellCode}${e.shiftDate}` === `${record.workOrderNum}${record.workcellCode}${record.shiftDate}`).length;
          const obj = {
            children: val,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: '工单编码',
        dataIndex: 'workOrderNum',
        width: 100,
        render: (val, record, index) => {
          const productionList = dataSource.map(e => `${e.workOrderNum}${e.workcellCode}${e.shiftDate}`);
          const first = productionList.indexOf(`${record.workOrderNum}${record.workcellCode}${record.shiftDate}`);
          const all = dataSource.filter(e => `${e.workOrderNum}${e.workcellCode}${e.shiftDate}` === `${record.workOrderNum}${record.workcellCode}${record.shiftDate}`).length;
          const obj = {
            children: val,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: '长文本',
        dataIndex: 'attribute8',
        width: 150,
        render: (val, record, index) => {
          const productionList = dataSource.map(e => `${e.workOrderNum}${e.workcellCode}${e.shiftDate}`);
          const first = productionList.indexOf(`${record.workOrderNum}${record.workcellCode}${record.shiftDate}`);
          const all = dataSource.filter(e => `${e.workOrderNum}${e.workcellCode}${e.shiftDate}` === `${record.workOrderNum}${record.workcellCode}${record.shiftDate}`).length;
          const obj = {
            children: val,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: '工单备注',
        dataIndex: 'woRemark',
        width: 100,
        render: (val, record, index) => {
          const productionList = dataSource.map(e => `${e.workOrderNum}${e.workcellCode}${e.shiftDate}`);
          const first = productionList.indexOf(`${record.workOrderNum}${record.workcellCode}${record.shiftDate}`);
          const all = dataSource.filter(e => `${e.workOrderNum}${e.workcellCode}${e.shiftDate}` === `${record.workOrderNum}${record.workcellCode}${record.shiftDate}`).length;
          const obj = {
            children: val,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: '产品编码',
        dataIndex: 'materialCode',
        width: 100,
        render: (val, record, index) => {
          const productionList = dataSource.map(e => `${e.workOrderNum}${e.workcellCode}${e.shiftDate}`);
          const first = productionList.indexOf(`${record.workOrderNum}${record.workcellCode}${record.shiftDate}`);
          const all = dataSource.filter(e => `${e.workOrderNum}${e.workcellCode}${e.shiftDate}` === `${record.workOrderNum}${record.workcellCode}${record.shiftDate}`).length;
          const obj = {
            children: val,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: '产品描述',
        dataIndex: 'materialName',
        width: 100,
        render: (val, record, index) => {
          const productionList = dataSource.map(e => `${e.workOrderNum}${e.workcellCode}${e.shiftDate}`);
          const first = productionList.indexOf(`${record.workOrderNum}${record.workcellCode}${record.shiftDate}`);
          const all = dataSource.filter(e => `${e.workOrderNum}${e.workcellCode}${e.shiftDate}` === `${record.workOrderNum}${record.workcellCode}${record.shiftDate}`).length;
          const obj = {
            children: val,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: '版本号',
        dataIndex: 'productionVersion',
        width: 100,
        render: (val, record, index) => {
          const productionList = dataSource.map(e => `${e.workOrderNum}${e.workcellCode}${e.shiftDate}`);
          const first = productionList.indexOf(`${record.workOrderNum}${record.workcellCode}${record.shiftDate}`);
          const all = dataSource.filter(e => `${e.workOrderNum}${e.workcellCode}${e.shiftDate}` === `${record.workOrderNum}${record.workcellCode}${record.shiftDate}`).length;
          const obj = {
            children: val,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: '工单数量',
        dataIndex: 'qty',
        width: 80,
        align: 'center',
      },
      {
        title: '工单累计派工总数',
        dataIndex: 'dispatchCodeQty',
        width: 100,
        align: 'center',
      },
      {
        title: '待派工数量',
        dataIndex: 'restQty',
        width: 100,
        align: 'center',
      },
      {
        title: '工段编码',
        dataIndex: 'workcellCode',
        width: 100,
        render: (val, record, index) => {
          const productionList = dataSource.map(e => `${e.workOrderNum}${e.workcellCode}${e.shiftDate}`);
          const first = productionList.indexOf(`${record.workOrderNum}${record.workcellCode}${record.shiftDate}`);
          const all = dataSource.filter(e => `${e.workOrderNum}${e.workcellCode}${e.shiftDate}` === `${record.workOrderNum}${record.workcellCode}${record.shiftDate}`).length;
          const obj = {
            children: val,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: '工段名称',
        dataIndex: 'workcellName',
        width: 100,
        align: 'center',
        render: (val, record, index) => {
          const productionList = dataSource.map(e => `${e.workOrderNum}${e.workcellCode}${e.shiftDate}`);
          const first = productionList.indexOf(`${record.workOrderNum}${record.workcellCode}${record.shiftDate}`);
          const all = dataSource.filter(e => `${e.workOrderNum}${e.workcellCode}${e.shiftDate}` === `${record.workOrderNum}${record.workcellCode}${record.shiftDate}`).length;
          const obj = {
            children: val,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: '日期',
        dataIndex: 'shiftDate',
        width: 130,
        align: 'center',
        render: (val, record, index) => {
          const productionList = dataSource.map(e => `${e.workOrderNum}${e.workcellCode}${e.shiftDate}`);
          const first = productionList.indexOf(`${record.workOrderNum}${record.workcellCode}${record.shiftDate}`);
          const all = dataSource.filter(e => `${e.workOrderNum}${e.workcellCode}${e.shiftDate}` === `${record.workOrderNum}${record.workcellCode}${record.shiftDate}`).length;
          const obj = {
            children: val,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: '班次',
        dataIndex: 'shiftCode',
        width: 100,
        align: 'center',
      },
      {
        title: '创建人',
        dataIndex: 'createdByName',
        width: 100,
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'creationDate',
        width: 100,
        align: 'center',
      },
      {
        title: '派工人',
        dataIndex: 'realName',
        width: 100,
        align: 'center',
      },
      {
        title: '派工时间',
        dataIndex: 'lastUpdateDate',
        width: 130,
        align: 'center',
      },
      {
        title: '派工数量',
        dataIndex: 'dispatchQty',
        width: 90,
        align: 'center',
        render: (val) => {
          return parseInt(val, 0);
        },
      },
      {
        title: '合计',
        dataIndex: 'count',
        width: 80,
        align: 'center',
        render: (val, record, index) => {
          const productionList = dataSource.map(e => `${e.workOrderNum}${e.workcellCode}${e.shiftDate}`);
          const first = productionList.indexOf(`${record.workOrderNum}${record.workcellCode}${record.shiftDate}`);
          const all = dataSource.filter(e => `${e.workOrderNum}${e.workcellCode}${e.shiftDate}` === `${record.workOrderNum}${record.workcellCode}${record.shiftDate}`).length;
          let count = 0;
          dataSource.forEach(item => {
            if (`${item.workOrderNum}${item.workcellCode}${item.shiftDate}` === `${record.workOrderNum}${record.workcellCode}${record.shiftDate}`) {
              count += Number(item.dispatchQty);
            }
          });
          const obj = {
            children: parseInt(count, 0),
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
    ];
    return (
      <Table
        bordered
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default ListTable;
