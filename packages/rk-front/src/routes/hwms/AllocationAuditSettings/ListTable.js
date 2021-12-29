import React, { Component, Fragment } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

/**
 * 库存调拨审核设置
 *@date：2019/10/18
 *@version：0.0.1
 */
class ListTable extends Component {
  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const modelPrompt = 'hwms.transactionType.model.transactionType';
    const { loading, dataSource, pagination, onSearch, onEdit, handleDelete } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.siteName`).d('工厂'),
        dataIndex: 'siteCode',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.fromLocatorCode`).d('来源仓库'),
        dataIndex: 'fromLocatorCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.fromLocatorName`).d('来源仓库描述'),
        dataIndex: 'fromLocatorName',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.toLocatorCode`).d('目标仓库'),
        dataIndex: 'toLocatorCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.toLocatorName`).d('目标仓库描述'),
        dataIndex: 'toLocatorName',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.approveSettingMeaning`).d('审核设置'),
        dataIndex: 'approveSettingMeaning',
        width: 100,
      },
      {
        title: intl.get('tarzan.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 120,
        align: 'center',
        render: (val, record, index) => (
          <span className="action-link">
            <Fragment>
              <a onClick={() => handleDelete(record)}>
                {intl.get('tarzan.common.button.cancel').d('删除')}
              </a>
              <a onClick={() => onEdit(record, index)}>
                {intl.get('tarzan.common.button.save').d('更新')}
              </a>
            </Fragment>
          </span>
        ),
      },
    ];
    return (
      <Table
        bordered
        rowKey="transactionTypeId"
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        scroll={{ x: tableScrollWidth(columns) }}
        pagination={pagination}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default ListTable;
