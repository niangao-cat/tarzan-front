// import React, { Component } from 'react';
// import { isEmpty } from 'lodash';
// import classNames from 'classnames';

// import { PerformanceTable } from 'choerodon-ui/pro';

// import formatterCollections from 'utils/intl/formatterCollections';
// import styles from './index.less';


// @formatterCollections({
//   code: ['tarzan.event.eventQuery'], // code 为 [服务].[功能]的字符串数组
// })
// export default class List extends Component {
//   /**
//    * 渲染方法
//    * @returns
//    */
//   render() {
//     const { dataSource = [], loading, weekList = [] } = this.props;
//     const columns = [
//       {
//         title: '车间',
//         dataIndex: 'areaName',
//         width: 60,
//         align: 'center',
//         fixed: true,
//         resizable: true,
//         onCell: () => ({
//           style: {
//             whiteSpace: 'normal',
//           },
//         }),
//         // render: ({ dataIndex, rowData, rowIndex}) => {
//         //   const workShopList = dataSource.map(e => e.areaId);
//         //   const firstWorkShop = workShopList.indexOf(rowData.areaId);
//         //   const sameWorkShopNums = dataSource.filter(e => e.areaId === rowData.areaId).length;
//         //   return rowData[dataIndex];
//           // if (rowIndex === firstWorkShop) {
//           //   return {
//           //     // children: rowData[dataIndex],
//           //     // children: [],
//           //     props: {
//           //       rowSpan: sameWorkShopNums,
//           //     },
//           //   };
//           // } else {
//           //   return {
//           //     // children: rowData[dataIndex],
//           //     // children: [],
//           //     props: {
//           //       rowSpan: 0,
//           //     },
//           //   };
//           // }
//         // },
//       },
//       {
//         title: '产品',
//         dataIndex: 'productName',
//         width: 80,
//         fixed: true,
//         resizable: true,
//         align: 'center',
//         onCell: () => ({
//           style: {
//             whiteSpace: 'normal',
//           },
//         }),
//         // render: ({ rowData: record, rowIndex: index}) => {
//         //   const productionList = dataSource.map(e => e.productId);
//         //   const first = productionList.indexOf(record.productId);
//         //   const all = dataSource.filter(e => e.productId === record.productId).length;
//         //   const obj = {
//         //     children: (
//         //       <div>
//         //         <div>{record.productName}</div>
//         //         <div>{record.productNum}</div>
//         //       </div>
//         //     ),
//         //     props: {},
//         //   };
//         //   obj.props.rowSpan = index === first ? all : 0;
//         //   return obj;
//         // },
//       },
//       {
//         title: '完成/总数',
//         dataIndex: 'completeTotalQty',
//         width: 70,
//         align: 'center',
//         fixed: true,
//         resizable: true,
//         onCell: () => ({
//           style: {
//             whiteSpace: 'normal',
//           },
//         }),
//         // render: ({ dataIndex, rowData: record, rowIndex: index}) => {
//         //   const productionList = dataSource.map(e => e.productId);
//         //   const first = productionList.indexOf(record.productId);
//         //   const all = dataSource.filter(e => e.productId === record.productId).length;
//         //   const obj = {
//         //     children: record[dataIndex],
//         //     props: {},
//         //   };
//         //   obj.props.rowSpan = index === first ? all : 0;
//         //   return obj;
//         // },
//       },
//       {
//         title: '工单号',
//         dataIndex: 'workOrderNum',
//         width: 60,
//         align: 'center',
//         fixed: true,
//         resizable: true,
//         onCell: () => ({
//           style: {
//             whiteSpace: 'normal',
//           },
//         }),
//         // render: ({ dataIndex, rowData: record, rowIndex: index}) => {
//         //   const workOrderNumList = dataSource.map(e => e.workOrderNum);
//         //   const first = workOrderNumList.indexOf(record.workOrderNum);
//         //   const all = dataSource.filter(e => e.workOrderNum === record.workOrderNum).length;
//         //   const obj = {
//         //     // children: val,
//         //     children: record[dataIndex],
//         //     props: {},
//         //   };
//         //   obj.props.rowSpan = index === first ? all : 0;
//         //   return obj;
//         // },
//       },
//       {
//         title: '产品线',
//         dataIndex: 'prodLineName',
//         width: 140,
//         align: 'center',
//         resizable: true,
//         fixed: true,
//         onCell: () => ({
//           style: {
//             whiteSpace: 'normal',
//           },
//         }),
//         // render: ({ dataIndex, rowData: record, rowIndex: index}) => {

//         //   const workOrderNumList = dataSource.map(e => e.workOrderNum);
//         //   const first = workOrderNumList.indexOf(record.workOrderNum);
//         //   const all = dataSource.filter(e => e.workOrderNum === record.workOrderNum).length;
//         //   const obj = {
//         //     // children: record[dataIndex],
//         //     props: {},
//         //   };
//         //   obj.props.rowSpan = index === first ? all : 0;
//         //   return obj;
//         // },
//       },
//       {
//         title: '完成/工单数',
//         dataIndex: 'orderTotalQty',
//         width: 70,
//         align: 'center',
//         fixed: true,
//         resizable: true,
//         onCell: () => ({
//           style: {
//             whiteSpace: 'normal',
//           },
//         }),
//       },
//       {
//         title: '齐套数量',
//         dataIndex: 'setQty',
//         width: 60,
//         align: 'center',
//         fixed: true,
//         resizable: true,
//         onCell: () => ({
//           style: {
//             whiteSpace: 'normal',
//           },
//         }),
//       },
//       {
//         title: '剩余数量',
//         width: 60,
//         dataIndex: 'remainQty',
//         align: 'center',
//         fixed: true,
//         resizable: true,
//         onCell: () => ({
//           style: {
//             whiteSpace: 'normal',
//           },
//         }),
//       },
//       {
//         title: '未派数量',
//         width: 60,
//         align: 'center',
//         fixed: true,
//         resizable: true,
//         dataIndex: 'unDispatchQty',
//         onCell: () => ({
//           style: {
//             whiteSpace: 'normal',
//           },
//         }),
//       },
//       {
//         title: '路线',
//         dataIndex: 'workcellName',
//         width: 60,
//         align: 'center',
//         fixed: true,
//         resizable: true,
//         onCell: () => ({
//           style: {
//             whiteSpace: 'normal',
//           },
//         }),
//       },
//     ];
//     // if (isEmpty(dataSource)) {
//     //   columns = columns.map(e => ({
//     //     ...e,
//     //     fixed: '',
//     //   }));
//     // }
//     const weekWorkColumn = [];
//     weekList.forEach(e => {
//       const flag = weekWorkColumn.map(a => a.header).includes(e.shiftDate);
//       if (isEmpty(weekWorkColumn) || !flag) {
//         const thisDayList = weekList.filter(thisDay => thisDay.shiftDate === e.shiftDate);
//         const children = thisDayList.map(m => {
//           return {
//             title: m.shiftCode,
//             dataIndex: `${e.shiftDate}#${m.calendarShiftId}`,
//             align: 'center',
//             width: 100,
//             render: ({ rowData }) => {
//               return m.calendarShiftId ? (
//                 <input type="number" style={{ width: '100%' }} min={0} className={classNames(`${e.shiftDate}#${m.calendarShiftId}`, `${rowData.workOrderNum}#${rowData.workcellCode}`, styles.workOrder_input)} />
//               ) : "";
//             },
//           };
//         });
//         weekWorkColumn.push({
//           header: e.shiftDate,
//           width: 100,
//           type: 'ColumnGroup',
//           children,
//         });
//       }
//     });
//     const newColumns = columns.concat(weekWorkColumn);
//     return (
//       <PerformanceTable
//         height={400}
//         bordered
//         loading={loading}
//         data={dataSource}
//         columns={newColumns}
//       />
//     );
//   }
// }
