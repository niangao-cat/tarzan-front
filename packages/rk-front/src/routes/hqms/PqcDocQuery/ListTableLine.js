/*
 * @Description: 巡检单行
 * @version: 0.1.0
 * @Author: junfeng.chen@hand-china.com
 * @Date: 2021-01-06 09:01:34
 */


import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';
import { Bind } from 'lodash-decorators';

class ListTableLine extends Component {

  @Bind()
  detailClick(record, index){
    const { detailClick } = this.props;
    detailClick(record, index);
  }

  // 行分页变化后触发方法
  @Bind()
  forHandleTableLineChange(linePagination){
    const { handleTableLineChange } = this.props;
    handleTableLineChange(linePagination);
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const commonModelPrompt = 'hqms.pqcDocQuery.model.pqcDocQuery';
    const { loading, dataSource, pagination, onSearch } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.number`).d('序号'),
        dataIndex: 'number',
        width: 70,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.workcellName`).d('工序'),
        dataIndex: 'workcellName',
        width: 70,
      },
      {
        title: intl.get(`${commonModelPrompt}.inspection`).d('检验项目'),
        dataIndex: 'inspection',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.inspectionDesc`).d('检验项目描述'),
        dataIndex: 'inspectionDesc',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.inspectionMethod`).d('检验方法'),
        dataIndex: 'inspectionMethod',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.standardText`).d('文本规格值'),
        dataIndex: 'standardText',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.standardFrom`).d('规格值从'),
        dataIndex: 'standardFrom',
        width: 90,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.standardTo`).d('规格值至'),
        dataIndex: 'standardTo',
        align: 'center',
        width: 90,
      },
      {
        title: intl.get(`${commonModelPrompt}.qcStandard`).d('检验标准'),
        dataIndex: 'qcStandard',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.standardUom`).d('检验单位'),
        dataIndex: 'standardUom',
        width: 100,
      },
      {
        title: intl.get(`${commonModelPrompt}.standardType`).d('规格类型'),
        dataIndex: 'standardTypeMeaning',
        width: 100,
      },
      {
        title: intl.get(`${commonModelPrompt}.inspectionTool`).d('检验工具'),
        dataIndex: 'inspectionTool',
        width: 100,
      },
      {
        title: intl.get(`${commonModelPrompt}.inspectionResult`).d('检验结果'),
        dataIndex: 'inspectionResult',
        width: 100,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 100,
        align: 'center',
        render: (val, record, index) => (
          <span className="action-link">
            <a onClick={() => this.detailClick(record, index)}>
              {intl.get('tarzan.acquisition.transformation.button.edit').d("明细")}
            </a>
          </span>
        ),
      },
    ];
    return (
      <Table
        bordered
        rowKey="pqcLineId"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns)}}
        onChange={page => onSearch(page)}
      />
    );
  }
}

export default ListTableLine;
