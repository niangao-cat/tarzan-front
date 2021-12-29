import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';

class ListTableLine extends Component {
  /**
   * render
   * @returns React.element
   */
  render() {
    const commonModelPrompt = 'hwms.requisitionAndReturn.model.requisitionAndReturn';
    const modelPromp2 = 'hwms.woPlatform.model.woPlatform';
    const { loading, dataSource, pagination, onSearch } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.sequence`).d('序号'),
        width: 80,
        align: 'center',
        render: (value, record, index) => index + 1,
      },
      {
        title: intl.get(`${modelPromp2}.componentCode`).d('组件物料编码'),
        dataIndex: 'componentMaterialCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPromp2}.componentName`).d('组件物料描述'),
        dataIndex: 'componentMaterialName',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.demandQty`).d('需求数'),
        dataIndex: 'needQty',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.uom`).d('单位'),
        dataIndex: 'componentUomCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPromp2}.workSequence`).d('工序'),
        dataIndex: 'workSequence',
        width: 120,
      },
    ];
    return (
      <Table
        bordered
        rowKey="id"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ y: 200 }}
        onChange={page => onSearch(page)}
      />
    );
  }
}

export default ListTableLine;
