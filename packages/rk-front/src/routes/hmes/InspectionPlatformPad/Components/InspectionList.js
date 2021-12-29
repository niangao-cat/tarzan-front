/**
 * ProductTraceability - 产品溯源查询
 * @date: 2020/03/16 15:32:45
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { tableScrollWidth } from 'utils/utils';
import styles from '../index.less';

// const modelPrompt = 'tarzan.hmes.message.model.message';

export default class ProductionLines extends Component {

  @Bind()
  handleChangeExpandedRowKeys(isExpand, record) {
    const { expandedRowKeys } = this.state;
    const rowKeys = isExpand
      ? [...expandedRowKeys, record.id]
      : expandedRowKeys.filter(item => item !== record.id);
    this.setState({
      expandedRowKeys: rowKeys,
    });
  }

  @Bind()
  handleClickSelectedRows(record) {
    return {
      onClick: () => {
        const { onFetchPqcInfo } = this.props;
        onFetchPqcInfo(record);
      },
    };
  }

  @Bind()
  handleClickRow(record) {
    const { inspectionRecord } = this.props;
    if (inspectionRecord.pqcHeaderId === record.pqcHeaderId) {
      return styles['inspectionPlatform_data-click'];
    } else {
      return '';
    }
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { dataSource = [], pagination, loading, onSearch, processRecord } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'orderSeq',
        align: 'center',
        render: (text, data, index) => {
          const { pageSize, current } = pagination;
          return pageSize * (current - 1) + index + 1;
        },
      },
      {
        title: '检验单号',
        dataIndex: 'pqcNumber',
        align: 'center',
        width: 120,
      },
      {
        title: '产品类型',
        dataIndex: 'materialType',
        align: 'center',
        width: 120,
      },
      {
        title: '产品料号',
        dataIndex: 'materialCode',
        align: 'center',
        width: 120,
      },
      {
        title: '产品描述',
        dataIndex: 'materialName',
        align: 'center',
        width: 120,
      },
      {
        title: '工单',
        dataIndex: 'workOrderNum',
        align: 'center',
        width: 120,
      },
      {
        title: '巡检时间',
        dataIndex: 'inspectionFinishDate',
        align: 'center',
        width: 150,
      },
      {
        title: '结果',
        dataIndex: 'inspectionResultMeaning',
        align: 'center',
        width: 80,
      },
      {
        title: '状态',
        dataIndex: 'inspectionStatusMeaning',
        align: 'center',
        width: 80,
      },
    ];
    return (
      <div className={styles['list-content-pad']}>
        <div className={styles['line-title']}>
          <span />
          <div>巡检列表</div>
        </div>
        <Table
          columns={columns}
          rowKey="pqcHeaderId"
          bordered
          loading={loading}
          dataSource={dataSource}
          pagination={pagination}
          onChange={page => onSearch(processRecord, page)}
          scroll={{ x: tableScrollWidth(columns, 5), y: 100 }}
          onRow={this.handleClickSelectedRows}
          rowClassName={this.handleClickRow}
        />
      </div>
    );
  }
}
