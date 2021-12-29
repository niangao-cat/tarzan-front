/**
 * ProductTraceability - 产品溯源查询
 * @date: 2020/03/16 15:32:45
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { Table ,Input} from 'hzero-ui';
import EditTable from 'components/EditTable';
import { Bind } from 'lodash-decorators';
import styles from '../index.less';

// const modelPrompt = 'tarzan.hmes.message.model.message';

export default class ProductionLines extends Component {

  @Bind()
  handleClickSelectedRows(record) {
    return {
      onClick: () => {
        const { onFetchResultList } = this.props;
        if(this.props.testRecord.pqcLineId !== record.pqcLineId) {
          onFetchResultList(record);
        } else {
          onFetchResultList({});
        }
      },
    };
  }

  @Bind()
  handleClickRow(record) {
    const { testRecord } = this.props;
    if (testRecord.pqcLineId === record.pqcLineId) {
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
    const { dataSource = [], pagination, onFetchPqcInfoPage } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'number',
        align: 'center',
      },
      {
        title: '检验项目',
        dataIndex: 'inspection',
        align: 'center',
      },
      {
        title: '下限',
        dataIndex: 'standardFrom',
        align: 'center',
      },
      {
        title: '上限',
        dataIndex: 'standardTo',
        align: 'center',
      },
      {
        title: '单位',
        dataIndex: 'uomCode',
        align: 'center',
      },
      {
        title: '文本规格值',
        dataIndex: 'standardText',
        align: 'center',
        render: (value, record) =>
          <Input.TextArea autosize={{ minRows: 1, maxRows: 6 }} disabled defaultValue = {record.standardText}/>
      },
      {
        title: '检验工具',
        dataIndex: 'inspectionToolMeaning',
        align: 'center',
      },
      {
        title: '检验数',
        dataIndex: 'inspectionNum',
        align: 'center',
      },
      {
        title: '检验结果',
        dataIndex: 'inspectionResult',
        align: 'center',
      },
    ];
    return (
      <div className={styles['test-content']}>
        <EditTable
          columns={columns}
          rowKey="pqcLineId"
          bordered
          dataSource={dataSource}
          pagination={pagination}
          onChange={page => onFetchPqcInfoPage(page)}
          onRow={this.handleClickSelectedRows}
          rowClassName={this.handleClickRow}
        />
      </div>
    );
  }
}
