import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import { isEmpty, isString } from 'lodash';
import { Bind } from 'lodash-decorators';

import formatterCollections from 'utils/intl/formatterCollections';
import styles from './index.less';

@formatterCollections({
  code: ['tarzan.event.eventQuery'], // code 为 [服务].[功能]的字符串数组
})
export default class ProductionLines extends Component {
  @Bind()
  renderTotalNum(val = '') {
    const newVal = !isString(val) ? '' : val.slice(0, val.length - 1);
    const color = newVal >= 100 ? '#FF0000' : newVal >= 80 ? '#FFD700' : '';
    return <div style={{ color }}>{val}</div>;
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { dataSource = [], loading, weekList = [] } = this.props;
    const columns = [
      {
        title: '可选产线负荷',
        dataIndex: 'prodLineWkc',
        width: 140,
        align: 'center',
        fixed: 'left',
        onCell: () => ({
          style: {
            whiteSpace: 'normal',
          },
        }),
        render: (val, record, index) => {
          const workShopList = dataSource.map(e => e.workcellId);
          const firstWorkShop = workShopList.indexOf(record.workcellId);
          const sameWorkShopNums = dataSource.filter(e => e.workcellId === record.workcellId)
            .length;
          if (index + 1 === dataSource.length) {
            return {
              children: '总计',
              props: {
                colSpan: 4,
              },
            };
          } else if (index === firstWorkShop) {
            return {
              children: record.prodLineWkc,
              props: {
                rowSpan: sameWorkShopNums,
              },
            };
          } else {
            return {
              children: record.prodLineWkc,
              props: {
                rowSpan: 0,
              },
            };
          }
        },
      },
      {
        title: '产品',
        dataIndex: 'productName',
        width: 160,
        align: 'center',
        fixed: 'left',
        onCell: () => ({
          style: {
            whiteSpace: 'normal',
          },
        }),
        render: (val, record, index) => {
          if (index + 1 === dataSource.length) {
            return {
              props: {
                colSpan: 0,
              },
            };
          } else {
            return {
              children: val,
            };
          }
        },
      },
      {
        title: 'SAP料号',
        dataIndex: 'productCode',
        width: 100,
        align: 'center',
        fixed: 'left',
        onCell: () => ({
          style: {
            whiteSpace: 'normal',
          },
        }),
        render: (val, record, index) => {
          if (index + 1 === dataSource.length) {
            return {
              props: {
                colSpan: 0,
              },
            };
          } else {
            return {
              children: val,
            };
          }
        },
      },
      {
        title: '工单号',
        dataIndex: 'workOrderNum',
        width: 150,
        align: 'center',
        fixed: 'left',
        onCell: () => ({
          style: {
            whiteSpace: 'normal',
          },
        }),
        render: (val, record, index) => {
          if (index + 1 === dataSource.length) {
            return {
              props: {
                colSpan: 0,
              },
            };
          } else {
            return {
              children: val,
            };
          }
        },
      },
    ];
    const weekWorkColumn = [];
    weekList.forEach(e => {
      const flag = weekWorkColumn.map(a => a.title).includes(e.shiftDate);
      if (isEmpty(weekWorkColumn) || !flag) {
        const thisDayList = weekList.filter(thisDay => thisDay.shiftDate === e.shiftDate);
        const children = thisDayList.map(m => {
          return {
            title: m.shiftCode,
            dataIndex: `${e.shiftDate}#${m.shiftCode}`,
            align: 'center',
            width: 40,
            fixed: 'left',
            render: (val, record, index) => {
              if (index + 1 === dataSource.length) {
                return this.renderTotalNum(val);
              } else {
                return val;
              }
            },
          };
        });
        weekWorkColumn.push({
          title: e.shiftDate,
          width: 100,
          children,
        });
      }
    });
    const newColumns = columns.concat(weekWorkColumn);
    return (
      <div className={styles['production-table']}>
        <Table
          loading={loading}
          dataSource={dataSource}
          columns={newColumns}
          pagination={false}
          scroll={{ x: 500 }}
          rowKey="id"
          bordered
        />
      </div>
    );
  }
}
