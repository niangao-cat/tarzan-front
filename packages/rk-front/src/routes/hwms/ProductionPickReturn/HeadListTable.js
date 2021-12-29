// 引入依赖
import React from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';

const commonModelPrompt = 'hwms.tarzan.production-pick-return';

export default class HeadListTable extends React.Component {
  // 直接渲染
  render() {
    const {
      siteMap,
      loading,
      dataSource,
      pagination,
      selectedRowKeys,
      onSelectHead,
      onSearch,
    } = this.props;

    // 列展示

    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.siteCode`).d('工厂'),
        dataIndex: 'siteCode',
        width: 150,
        render: val => (siteMap.filter(ele => ele.siteCode === val)[0] || {}).description,
      },
      {
        title: intl.get(`${commonModelPrompt}.instructionDocNum`).d('单据号'),
        dataIndex: 'instructionDocNum',
        width: 200,
      },
      {
        title: intl.get(`${commonModelPrompt}.instructionDocType`).d('单据类型'),
        dataIndex: 'instructionDocTypeMeaning',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.instructionDocStatus`).d('单据状态'),
        dataIndex: 'instructionDocStatusMeaning',
        width: 100,
      },
      {
        title: intl.get(`${commonModelPrompt}.attrValue`).d('工单号'),
        dataIndex: 'attrValue',
        width: 200,
      },
      // {
      //   title: intl.get(`${commonModelPrompt}.inplanOutplan`).d('计划内外'),
      //   dataIndex: 'inplanOutplan',
      //   width: 100,
      // },
      {
        title: intl.get(`${commonModelPrompt}.remarkMeaning`).d('部门'),
        dataIndex: 'remarkMeaning',
      },
      {
        title: intl.get(`${commonModelPrompt}.createdBy`).d('创建人'),
        dataIndex: 'createdBy',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.creationDate`).d('创建时间'),
        dataIndex: 'creationDate',
        width: 200,
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('执行人'),
        dataIndex: 'lastUpdatedBy',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdateDate`).d('执行时间'),
        dataIndex: 'lastUpdateDate',
        width: 200,
      },
    ];
    return (
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        rowSelection={{
          selectedRowKeys,
          type: 'radio', // 单选
          onChange: onSelectHead,
        }}
        onChange={page => onSearch(page)}
        loading={loading}
      />
    );
  }
}
