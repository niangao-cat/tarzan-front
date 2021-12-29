/*
 * @Description: 仓库table
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-26 16:54:35
 * @LastEditTime: 2021-03-02 09:46:47
 */
import React from 'react';
import { tableScrollWidth } from 'utils/utils';
import EditTable from 'components/EditTable';
import { Button, Popconfirm, Form, Input } from 'hzero-ui';
import intl from 'utils/intl';
import Lov from 'components/Lov';

const WarehouseTable = (props) => {

  const {
    dataSource,
    loading,
    handleFetchLineList,
    operation,
    tenantId,
    handleCreate,
    deleteData,
    pagination,
  } = props;
  const columns = [
    {
      title: (
        <Button
          style={{ backgroundColor: '#548FFC', color: '#fff' }}
          icon="plus"
          shape="circle"
          size="small"
          disabled={!operation === 'create'}
          onClick={() => handleCreate('warehouseList')}
        />
      ),
      align: 'center',
      width: 60,
      render: (val, record, index) => (
        <Popconfirm
          title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
          onConfirm={() => deleteData(record, index, 'warehouseList')}
        >
          <Button icon="minus" shape="circle" size="small" />
        </Popconfirm>
      ),
    },
    {
      title: '序号',
      dataIndex: 'sequenceNum',
      width: 80,
      align: 'center',
      render: (value, record, index) => index + 1,
    },
    {
      title: '仓库',
      dataIndex: 'detailObjectCode',
      width: 100,
      align: 'center',
      render: (val, record) =>
        ['update', 'create'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator(`detailObjectId`, {
              initialValue: record.detailObjectId,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '仓库',
                  }),
                },
              ],
            })(
              <Lov
                code="MT.WARE.HOUSE"
                queryParams={{ tenantId }}
                textValue={record.detailObjectCode}
                onChange={(value, item) => {
                  record.$form.setFieldsValue({
                    detailObjectName: item.locatorName,
                  });
                }}
              />
            )}
          </Form.Item>
        ) : (
            val
          ),
    },
    {
      title: '仓库描述',
      dataIndex: 'detailObjectName',
      width: 100,
      align: 'center',
      render: (val, record) =>
        ['update', 'create'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator(`detailObjectName`, {
              initialValue: record.detailObjectName,
            })(
              <Input disabled />
            )}
          </Form.Item>
        ) : (
            val
          ),
    },
  ];
  return (
    <EditTable
      bordered
      columns={columns}
      dataSource={dataSource}
      pagination={pagination}
      loading={loading}
      onChange={page => handleFetchLineList(page, operation)}
      rowKey="privilegeId"
      scroll={{ x: tableScrollWidth(columns, 50) }}
    />
  );
};

export default WarehouseTable;
