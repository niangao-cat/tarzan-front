/**
 * 物流器具
 *@date：2019/9/21
 *@author：junhui.liu <junhui.liu@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
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
    const commonModelPrompt = 'hwms.applianceCreation.model.applianceCreation';
    const { loading, dataSource, pagination, onSearch, onSelectRow, selectedRowKeys } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.containerCode`).d('物流器具编码'),
        width: 150,
        dataIndex: 'containerCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.objectType`).d('对象类型'),
        width: 120,
        dataIndex: 'loadObjectTypeMeaning',
      },
      {
        title: intl.get(`${commonModelPrompt}.objectCode`).d('对象编码'),
        width: 180,
        dataIndex: 'loadObjectCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料编码'),
        width: 120,
        dataIndex: 'materialCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
        width: 120,
        dataIndex: 'materialName',
      },
      {
        title: intl.get(`${commonModelPrompt}.qty`).d('数量'),
        width: 120,
        dataIndex: 'loadQty',
      },
      {
        title: intl.get(`${commonModelPrompt}.uom`).d('单位'),
        dataIndex: 'uom',
        width: 100,
      },
      {
        title: intl.get(`${commonModelPrompt}.lot`).d('批次号'),
        width: 120,
        dataIndex: 'lot',
      },
      {
        title: intl.get(`${commonModelPrompt}.creater`).d('创建人'),
        dataIndex: 'createdBy',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.createDate`).d('创建时间'),
        width: 200,
        dataIndex: 'creationDate',
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdateBy`).d('最后更新人'),
        width: 120,
        dataIndex: 'lastUpdatedBy',
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdateDate`).d('最后更新时间'),
        dataIndex: 'lastUpdateDate',
        width: 200,
      },
    ];
    return (
      <Table
        bordered
        rowKey="containerLoadDetailId"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns, 50), y: 200 }}
        rowSelection={{
          // columnWidth: 50,
          selectedRowKeys,
          onChange: onSelectRow,
        }}
        onChange={page => onSearch(page)}
      />
    );
  }
}

export default ListTableRow;
