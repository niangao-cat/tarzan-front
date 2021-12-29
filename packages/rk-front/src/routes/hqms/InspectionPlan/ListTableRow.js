/*
 * @Description: inspectionPlan
 * @version: 0.1.0
 * @Author: wenjie.yang@hand-china.com
 * @Date: 2020-04-16 16:27:45
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-07-24 10:12:00
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

class ListTableRow extends Component {
  /**
   * render
   * @returns React.element
   */
  render() {
    const commonModelPrompt = 'hwms.deliverQuery.model.deliverQuery';
    const {
      loading,
      pagination,
      onSearch,
      selectedRowKeys,
      onSelectRow,
      lineList = [],
    } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.sequence`).d('序号'),
        width: 60,
        dataIndex: 'sequence',
        align: 'center',
        render: (val, record, index) => index + 1,
      },
      {
        title: '排序码',
        width: 90,
        dataIndex: 'orderKey',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.inspection`).d('检验项目'),
        dataIndex: 'inspection',
        width: 150,
        align: 'center',
      },
      {
        title: '检验项描述',
        dataIndex: 'inspectionDesc',
        width: 100,
        align: 'center',
      },
      {
        title: '检验项目类别',
        dataIndex: 'inspectionTypeMeaning',
        width: 100,
        align: 'center',
      },
      {
        title: '工序',
        dataIndex: 'processName',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.defectLevelMeaning`).d('检验频率'),
        width: 90,
        dataIndex: 'frequencyMeaning',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.standardTypeMeaning`).d('规格类型'),
        width: 100,
        align: 'center',
        dataIndex: 'standardTypeMeaning',
      },
      {
        title: '精度',
        dataIndex: 'accuracy',
        width: 90,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.standardFrom`).d('规格值从'),
        width: 90,
        dataIndex: 'standardFrom',
        align: 'center',
      },
      {
        title: '规格值至',
        dataIndex: 'standardTo',
        width: 90,
        align: 'center',
      },
      {
        title: '规格单位',
        dataIndex: 'standardUom',
        width: 100,
        align: 'center',
      },
      {
        title: '文本规格值',
        dataIndex: 'standardText',
        width: 140,
        align: 'center',
      },
      {
        title: '检验工具',
        dataIndex: 'inspectionToolMeaning',
        width: 90,
        align: 'center',
      },
      // {
      //   title: '检验方法',
      //   dataIndex: 'inspectionMethodMeaning',
      //   width: 90,
      //   align: 'center',
      // },
      // {
      //   title: '抽样类型',
      //   dataIndex: 'sampleType',
      //   width: 90,
      //   align: 'center',
      // },
      {
        title: '是否有效',
        dataIndex: 'enableflag',
        width: 90,
        align: 'center',
        render: (text, record) => {
          if (record.enableFlag === 'Y') {
            return <span>是</span>;
          } else {
            return <span>否</span>;
          }
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 90,
        align: 'center',
      },
    ];
    return (
      <Table
        bordered
        rowKey="instructionId"
        loading={loading}
        dataSource={lineList}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns), y: 250 }}
        onChange={page => onSearch(page)}
        rowSelection={{
          selectedRowKeys,
          type: 'radio', // 单选
          onChange: onSelectRow,
          fixed: 'left',
        }}
      />
    );
  }
}

export default ListTableRow;
