import React, { Fragment } from 'react';
import {InputNumber, Form, Spin } from 'hzero-ui';
import EditTable from 'components/EditTable';
import { tableScrollWidth } from 'utils/utils';
import intl from 'utils/intl';

const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

export default class AbnormalResponse extends React.Component {

  render() {
    const { loading, dataSource, pagination, onSearch, saveLineLoading} = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.exceptionLevel`).d('行号'),
        width: 100,
        dataIndex: 'instructionLineNum',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料'),
        width: 100,
        dataIndex: 'materialCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
        width: 100,
        dataIndex: 'materialName',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialVersion`).d('版本'),
        width: 100,
        dataIndex: 'materialVersion',
      },
      {
        title: intl.get(`${commonModelPrompt}.quantity`).d('调换数量'),
        width: 80,
        dataIndex: 'quantity',
      },
      {
        title: intl.get(`${commonModelPrompt}.addQty`).d('发出数量'),
        width: 120,
        dataIndex: 'addQty',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`addQty`, {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${commonModelPrompt}.addQty`).d('发出数量'),
                      }),
                    },
                  ],
                initialValue: record.addQty,
              })(<InputNumber min={0} max={((record.quantity === null || record.quantity === undefined || record.quantity === "")?0:record.quantity) - ((record.executeQty === null || record.quantexecuteQtyty === undefined || record.executeQty === "") === null?0:record.executeQty)} step={0.1} />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${commonModelPrompt}.executeQty`).d('已发出数量'),
        width: 80,
        dataIndex: 'executeQty',
      },
      {
        title: intl.get(`${commonModelPrompt}.actualQty`).d('执行数量'),
        width: 120,
        dataIndex: 'actualQty',
      },
      {
        title: intl.get(`${commonModelPrompt}.uomName`).d('单位'),
        width: 80,
        dataIndex: 'uomName',
      },
      {
        title: intl.get(`${commonModelPrompt}.instructionStatus`).d('状态'),
        dataIndex: 'instructionStatusMeaning',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.warehouseCode`).d('仓库'),
        dataIndex: 'warehouseCode',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.locatorCode`).d('货位'),
        dataIndex: 'locatorCode',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.remark`).d('备注'),
        dataIndex: 'remark',
        width: 120,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 100,
        align: 'center',
        render: (val, record, index) => (
          <span className="action-link">
            {record._status === 'update' && (
              <Fragment>
                <a onClick={() => this.props.handleEditLine(record, false)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.props.handleSaveLine(record, index)}>
                  {intl.get('tarzan.acquisition.transformation.button.save').d('保存')}
                </a>
              </Fragment>
            )}
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a onClick={() => this.props.handleEditLine(record, true)}>
                {intl.get('tarzan.acquisition.transformation.button.edit').d('编辑')}
              </a>
            )}

            {record._status === 'create' && (
              <Fragment>
                <a onClick={() => this.props.handleCleanLine(record)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.props.handleSaveLine(record, index)}>
                  {intl.get('tarzan.acquisition.transformation.button.save').d('保存')}
                </a>
              </Fragment>
            )}
          </span>
        ),
      },
    ];

    return (
      <Spin spinning={saveLineLoading ||false}>
        <EditTable
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
          scroll={{ x: tableScrollWidth(columns, 50), y: 180 }}
          onChange={page => onSearch(page)}
          loading={loading}
          rowKey="instructionId"
          bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
        />
      </Spin>
    );
  }
}
