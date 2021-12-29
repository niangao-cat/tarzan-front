/*
 * @Description: 生产线table
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-26 16:55:41
 * @LastEditTime: 2021-03-02 09:46:39
 */
import React from 'react';
import { tableScrollWidth } from 'utils/utils';
import EditTable from 'components/EditTable';
import { Button, Popconfirm, Form, Input } from 'hzero-ui';
import intl from 'utils/intl';
import Lov from 'components/Lov';

const ProdLineTable = (props) => {

  const {
    dataSource,
    loading,
    handleFetchLineList,
    handleCreate,
    deleteData,
    tenantId,
    defaultSite,
    pagination,
    operation,
  } = props;
  const columns = [
    {
      title: (
        <Button
          style={{ backgroundColor: '#548FFC', color: '#fff' }}
          icon="plus"
          shape="circle"
          size="small"
          // disabled={!canEdit || !operationId === 'create'}
          onClick={() => handleCreate('prodLineList')}
        />
      ),
      align: 'center',
      width: 60,
      render: (val, record, index) => (
        <Popconfirm
          title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
          onConfirm={() => deleteData(record, index, 'prodLineList')}
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
      title: '生产线',
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
                    name: '生产线',
                  }),
                },
              ],
            })(
              <Lov
                code="MT.PRODLINE"
                queryParams={{ tenantId, siteId: defaultSite.siteId }}
                textValue={record.detailObjectCode}
                onChange={(value, item) => {
                  record.$form.setFieldsValue({
                    detailObjectName: item.prodLineName,
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
      title: '生产线描述',
      dataIndex: 'detailObjectName',
      width: 110,
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

export default ProdLineTable;