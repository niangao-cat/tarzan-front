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

class ListTableHead extends Component {
  /**
   * render
   * @returns React.element
   */
  render() {
    const commonModelPrompt = 'hwms.deliverQuery.model.deliverQuery';
    const {
      loading,
      pagination,
      selectedHeadKeys,
      onSelectHead,
      onSearch,
      headList,
      createHeadDataDrawer,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.siteName`).d('组织'),
        width: 70,
        dataIndex: 'siteName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.categoryDesc`).d('物料类别'),
        align: 'center',
        width: 100,
        dataIndex: 'categoryDesc',
        render: (text, record) => <a onClick={() => createHeadDataDrawer(record, true)}>{text}</a>,
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料编码'),
        width: 100,
        dataIndex: 'materialCode',
        align: 'center',
        render: (text, record) => <a onClick={() => createHeadDataDrawer(record, true)}>{text}</a>,
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
        width: 120,
        dataIndex: 'materialName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialVersion`).d('物料版本'),
        width: 90,
        dataIndex: 'materialVersion',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.inspectionTypeName`).d('检验类型'),
        dataIndex: 'inspectionTypeName',
        width: 90,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.status`).d('状态'),
        dataIndex: 'statusMeaning',
        width: 80,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.inspectionFile`).d('检验文件号'),
        dataIndex: 'inspectionFile',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.fileVersion`).d('版本号'),
        dataIndex: 'fileVersion',
        width: 70,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.enableFlag`).d('是否有效'),
        dataIndex: 'enableFlag',
        width: 90,
        align: 'center',
        render: (val, record) => {
          if (record.enableFlag === 'Y') {
            return <span>是</span>;
          } else {
            return <span>否</span>;
          }
        },
      },
    ];
    return (
      <Table
        bordered
        rowKey="inspectionSchemeId"
        loading={loading}
        dataSource={headList}
        columns={columns}
        pagination={pagination}
        rowSelection={{
          selectedRowKeys: selectedHeadKeys,
          type: 'radio', // 单选
          onChange: onSelectHead,
          columnWidth: 50,
        }}
        scroll={{ x: tableScrollWidth(columns), y: 250 }}
        onChange={page => onSearch(page)}
      />
    );
  }
}

export default ListTableHead;
