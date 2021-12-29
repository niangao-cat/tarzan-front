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
import styles from '../index.less';

// const modelPrompt = 'tarzan.hmes.message.model.message';

export default class ProductionLines extends Component {

  @Bind()
  handleSave() {}

  @Bind()
  handleFetchInspectionList(record) {
    const { onSelectProcess } = this.props;
    if(onSelectProcess) {
      onSelectProcess(record);
    }
  }

  @Bind()
  handleClickRow(record) {
    const { processRecord } = this.props;
    if ((record.type === 'PRODLINE' && processRecord.type === 'PRODLINE' && processRecord.prodLineId === record.prodLineId) || (record.type === 'PROCESS' && processRecord.type === 'PROCESS' && processRecord.processId === record.processId)) {
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
    const { prodLineTree = [], loading, onChangeExpandedRowKeys, expandedRowKeys } = this.props;
    const columns = [
      {
        title: '',
        dataIndex: 'prodLineName',
        render: (val, record) => (
          <a
            onClick={() => this.handleFetchInspectionList(record)}
          >
            {record.type === 'PRODLINE' ? val : record.processName}
          </a>
        ),
      },
    ];
    return (
      <div className={styles.inspectionPlatform_tree}>
        <Table
          columns={columns}
          loading={loading}
          rowKey="prodLineId"
          bordered
          expandedRowKeys={expandedRowKeys}
          dataSource={prodLineTree}
          pagination={false}
          onExpand={onChangeExpandedRowKeys}
          rowClassName={this.handleClickRow}
        />
      </div>
    );
  }
}
