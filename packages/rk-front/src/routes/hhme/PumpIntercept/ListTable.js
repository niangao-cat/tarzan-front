import React from 'react';
import { Form, Input, Select } from 'hzero-ui';

import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';
import notification from 'utils/notification';
import EditTable from 'components/EditTable';


const commonModelPrompt = 'tarzan.hmes.purchaseOrder';
const { Option } = Select;

const ListTable = (props) => {

  /**
   * 清除当前行
   *
   * @param {string} dataSourceName 数据源名称
   * @param {string} idName 主键id名称
   * @param {object} record 当前对象
   * @memberof FloorInfo
   */
  const handleCleanLine = (record) => {
    const { onCleanLine } = props;
    if (onCleanLine) {
      onCleanLine('list', 'pagination', 'interceptId', record);
    }
  };

  const handleSave = (record) => {
    const { onSave } = props;
    if (onSave) {
      onSave(record);
    }
  };


  const handleSearch = (page) => {
    const { dataSource, onSearch } = props;
    if (onSearch && dataSource.filter(e => ['create', 'update'].includes(e._status)).length === 0) {
      onSearch(page);
    } else {
      notification.warning({
        description: '当前存在未保存的数据，请先保存再新建盘点单据',
      });
    }
  };

  const { dimensionList, loading, dataSource, pagination, onOpenModal, onOpenDetailModal } = props;
  const columns = [
    {
      title: intl.get(`${commonModelPrompt}.stocktakeNum`).d('拦截单号'),
      width: 120,
      align: 'center',
      dataIndex: 'interceptNum',
      render: (val, record) =>
        <a onClick={() => onOpenDetailModal(record)}>{val}</a>,
    },
    {
      title: intl.get(`${commonModelPrompt}.dimension`).d('拦截维度'),
      width: 90,
      dataIndex: 'dimension',
      render: (value, record) =>
        ['create'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('dimension', {
              initialValue: value,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonModelPrompt}.dimension`).d('拦截维度'),
                  }),
                },
              ],
            })(
              <Select allowClear style={{ width: '100%' }}>
                {dimensionList.map(e => (
                  <Option value={e.value} key={e.value}>{e.meaning}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
        ) : (
          record.dimensionMeaning
        ),
    },
    {
      title: intl.get(`${commonModelPrompt}.exceptionName`).d('状态'),
      width: 80,
      dataIndex: 'statusMeaning',
    },
    {
      title: intl.get(`${commonModelPrompt}.remark`).d('拦截消息'),
      width: 120,
      dataIndex: 'remark',
      align: 'center',
      render: (value, record) =>
        ['create'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('remark', {
              initialValue: value,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonModelPrompt}.remark`).d('拦截消息'),
                  }),
                },
              ],
            })(
              <Input />
            )}
          </Form.Item>
        ) : (
          value
        ),
    },
    {
      title: intl.get(`${commonModelPrompt}.supplierName`).d('拦截人'),
      width: 120,
      align: 'center',
      dataIndex: 'interceptByName',
    },
    {
      title: intl.get(`${commonModelPrompt}.creationDate`).d('拦截时间'),
      width: 120,
      align: 'center',
      dataIndex: 'interceptDate',
    },
    {
      title: intl.get(`${commonModelPrompt}.demandTime`).d('拦截工序表'),
      width: 90,
      align: 'center',
      dataIndex: 'lastUpdatedUserName',
      render: (val, record) =>
        !record._status ?
          <a onClick={() => onOpenModal(record, 'PROCESS')}>拦截工序表</a> : null,
    },
    {
      title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('拦截对象表'),
      dataIndex: 'lastUpdateDate',
      align: 'center',
      width: 90,
      render: (val, record) =>
        !record._status ?
          <a onClick={() => onOpenModal(record, 'OBJECT')}>拦截对象表</a> : null,
    },
    {
      title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('拦截例外放行表'),
      dataIndex: 'lastUpdateDate',
      align: 'center',
      width: 90,
      render: (val, record) =>
        !record._status ?
          <a onClick={() => onOpenModal(record, 'SN')}>拦截例外放行表</a> : null,
    },
    {
      title: intl.get('hzero.common.button.action').d('操作'),
      dataIndex: '',
      width: 100,
      align: 'center',
      render: (value, record) =>
        record._status === 'create' ? (
          <div className="action-link">
            <a onClick={() => handleCleanLine(record)}>
              {intl.get('hzero.common.button.clean').d('清除')}
            </a>
            <a onClick={() => handleSave(record)}>
              {intl.get('hzero.common.button.save').d('保存')}
            </a>
          </div>
        ) : null,
    },
  ];

  return (
    <EditTable
      bordered
      dataSource={dataSource}
      columns={columns}
      pagination={pagination}
      scroll={{ x: tableScrollWidth(columns) }}
      onChange={handleSearch}
      loading={loading}
      rowKey="interceptId"
      bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
    />
  );
};

export default ListTable;