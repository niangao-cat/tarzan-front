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

class ListTableHead extends Component {
  /**
   * render
   * @returns React.element
   */
  render() {
    const commonModelPrompt = 'hwms.applianceCreation.model.applianceCreation';
    const {
      loading,
      dataSource,
      pagination,
      selectedRowKeys,
      onSelectRow,
      onSearch,
      onSearchLine,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.containerCode`).d('物流器具编码'),
        width: 180,
        dataIndex: 'containerCode',
        render: (value, record) => <a onClick={() => onSearchLine(record, true)}>{value}</a>,
      },
      {
        title: intl.get(`${commonModelPrompt}.containerType`).d('物流器具类型'),
        width: 150,
        dataIndex: 'containerTypeDescription',
        render: (value, record) => <a onClick={() => onSearchLine(record, true)}>{value}</a>,
      },
      {
        title: intl.get(`${commonModelPrompt}.containerName`).d('物流器具名称'),
        width: 150,
        dataIndex: 'containerName',
        render: (value, record) => <a onClick={() => onSearchLine(record, true)}>{value}</a>,
      },
      {
        title: intl.get(`${commonModelPrompt}.containerDesc`).d('详细描述'),
        width: 150,
        dataIndex: 'description',
        render: (value, record) => <a onClick={() => onSearchLine(record, true)}>{value}</a>,
      },
      {
        title: intl.get(`${commonModelPrompt}.topContainerCode`).d('顶层容器'),
        width: 150,
        dataIndex: 'topContainerCode',
        render: (value, record) => <a onClick={() => onSearchLine(record, true)}>{value}</a>,
      },
      {
        title: intl.get(`${commonModelPrompt}.currentContainerCode`).d('上层容器'),
        width: 150,
        dataIndex: 'currentContainerCode',
        render: (value, record) => <a onClick={() => onSearchLine(record, true)}>{value}</a>,
      },
      {
        title: intl.get(`${commonModelPrompt}.status`).d('状态'),
        dataIndex: 'containerStatusMeaning',
        width: 120,
        render: (value, record) => <a onClick={() => onSearchLine(record, true)}>{value}</a>,
      },
      {
        title: intl.get(`${commonModelPrompt}.plant`).d('工厂'),
        width: 120,
        dataIndex: 'siteCode',
        render: (value, record) => <a onClick={() => onSearchLine(record, true)}>{value}</a>,
      },
      {
        title: intl.get(`${commonModelPrompt}.warehouse`).d('仓库'),
        width: 120,
        dataIndex: 'wareHouse',
        render: (value, record) => <a onClick={() => onSearchLine(record, true)}>{value}</a>,
      },
      {
        title: intl.get(`${commonModelPrompt}.locator`).d('货位'),
        width: 120,
        dataIndex: 'locatorCode',
        render: (value, record) => <a onClick={() => onSearchLine(record, true)}>{value}</a>,
      },
      {
        title: intl.get(`${commonModelPrompt}.ownerType`).d('所有者类型'),
        width: 120,
        dataIndex: 'ownerType',
        render: (value, record) => <a onClick={() => onSearchLine(record, true)}>{value}</a>,
      },
      {
        title: intl.get(`${commonModelPrompt}.ownerCode`).d('所有者编码'),
        dataIndex: 'ownerCode',
        width: 120,
        render: (value, record) => <a onClick={() => onSearchLine(record, true)}>{value}</a>,
      },
      {
        title: intl.get(`${commonModelPrompt}.lastLoadTime`).d('最后一次装载时间'),
        width: 200,
        dataIndex: 'lastLoadTime',
        render: (value, record) => <a onClick={() => onSearchLine(record, true)}>{value}</a>,
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUnLoadTime`).d('最后一次卸载时间'),
        width: 200,
        dataIndex: 'lastUnloadTime',
        render: (value, record) => <a onClick={() => onSearchLine(record, true)}>{value}</a>,
      },
      {
        title: intl.get(`${commonModelPrompt}.creater`).d('创建人'),
        width: 120,
        dataIndex: 'createdBy',
        render: (value, record) => <a onClick={() => onSearchLine(record, true)}>{value}</a>,
      },
      {
        title: intl.get(`${commonModelPrompt}.createDate`).d('创建时间'),
        width: 200,
        dataIndex: 'creationDate',
        render: (value, record) => <a onClick={() => onSearchLine(record, true)}>{value}</a>,
      },
      {
        title: intl.get(`${commonModelPrompt}.createReason`).d('创建原因'),
        width: 120,
        dataIndex: 'creationReason',
        render: (value, record) => <a onClick={() => onSearchLine(record, true)}>{value}</a>,
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdateBy`).d('最后更新人'),
        width: 120,
        dataIndex: 'lastUpdatedBy',
        render: (value, record) => <a onClick={() => onSearchLine(record, true)}>{value}</a>,
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdateDate`).d('最后更新时间'),
        dataIndex: 'lastUpdateDate',
        width: 200,
        render: (value, record) => <a onClick={() => onSearchLine(record, true)}>{value}</a>,
      },
    ];
    return (
      <Table
        bordered
        rowKey="containerId"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns, 50), y: 190 }}
        rowSelection={{
          // fixed: true,
          // columnWidth: 50,
          selectedRowKeys,
          onChange: onSelectRow,
        }}
        onChange={page => onSearch(page)}
      />
    );
  }
}

export default ListTableHead;
