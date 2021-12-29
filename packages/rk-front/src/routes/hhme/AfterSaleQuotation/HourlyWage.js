import React, { forwardRef, Fragment } from 'react';
import { Form, Input, InputNumber, Button, Popconfirm } from 'hzero-ui';

import intl from 'utils/intl';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';
import { getCurrentLanguage } from 'utils/utils';

import styles from './index.less';


const modelPrompt = 'tarzan.hmes.purchaseOrder';

const OpticsItems = (props) => {


  /**
   * 编辑当前行
   *
   * @param {string} dataSourceName 数据源名称
   * @param {string} idName 主键id名称
   * @param {object} record 当前行数据
   * @param {boolean} flag 编辑当前行 / 取消编辑
   * @memberof FloorInfo
   */
  const handleEditLine = (record, flag) => {
    const { onEditLine } = props;
    if (onEditLine) {
      onEditLine('hourFeeLineList', 'materialId', record, flag);
    }
  };

  const handleCreate = () => {
    const { onCreate } = props;
    if (onCreate) {
      onCreate('hourFeeLineList', 'materialId');
    }
  };

  const handleDelete = (record) => {
    const { onDelete } = props;
    if (onDelete) {
      onDelete(record, 'hourFeeLineList');
    }
  };

  const handleCleanLine = (record) => {
    const { onCleanLine } = props;
    if (onCleanLine) {
      onCleanLine('hourFeeLineList', 'materialId', record);
    }
  };

  const handleChangeMaterialCode = (val, data, record) => {
    record.$form.setFieldsValue({ materialName: data.materialName, materialCode: data.materialCode });
  };

  const { loading, dataSource, isEdit, tenantId, siteInfo } = props;
  let columns = [
    {
      title: isEdit && (
        <Button
          style={{ backgroundColor: '#548FFC', color: '#fff' }}
          icon="plus"
          shape="circle"
          size="small"
          onClick={() => handleCreate()}
        />
      ),
      align: 'center',
      width: 60,
      dataIndex: 'create',
      render: (val, record) =>
        isEdit && record._status !== 'create' && (
          <Popconfirm
            title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
            onConfirm={() => handleDelete(record)}
          >
            <Button icon="minus" shape="circle" size="small" />
          </Popconfirm>
        ),
    },
    {
      title: '序号',
      width: 70,
      dataIndex: 'instructionLineNum',
      render: (val, _record, index) => index + 1,
    },
    {
      title: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
      width: 100,
      dataIndex: 'materialCode',
      render: (value, record) =>
        ['create'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('materialId', {
              initialValue: value,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.date.materialCode`).d('物料编码'),
                  }),
                },
              ],
            })(
              <Lov
                code="HME.SITE_MATERIAL"
                queryParams={{ tenantId, local: getCurrentLanguage(), siteId: siteInfo.siteId }}
                textValue={record.materialCode}
                onChange={(val, data) => handleChangeMaterialCode(val, data, record)}
              />
            )}
          </Form.Item>
        ) : (
          record.materialCode
        ),
    },
    {
      title: intl.get(`${modelPrompt}.materialName`).d('物料描述'),
      width: 100,
      dataIndex: 'materialName',
      render: (value, record) =>
        ['create'].includes(record._status) ? (
          <Fragment>
            <Form.Item>
              {record.$form.getFieldDecorator('materialName', {
                initialValue: value,
              })(<Input disabled />)}
            </Form.Item>
            <Form.Item style={{ display: 'none' }}>
              {record.$form.getFieldDecorator('materialCode', {
                initialValue: record.materialCode,
              })(<Input disabled />)}
            </Form.Item>
          </Fragment>

        ) : (
          value
        ),
    },
    {
      title: intl.get(`${modelPrompt}.requsetQty`).d('数量'),
      width: 100,
      dataIndex: 'requsetQty',
      render: (value, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('requsetQty', {
              initialValue: value,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.requsetQty`).d('数量'),
                  }),
                },
              ],
            })(
              <InputNumber />
            )}
          </Form.Item>
        ) : (
          value
        ),
    },
    {
      title: intl.get(`${modelPrompt}.remark`).d('备注'),
      width: 120,
      dataIndex: 'remark',
      render: (value, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('remark', {
              initialValue: value,
            })(<Input />)}
          </Form.Item>
        ) : (
          value
        ),
    },
  ];

  if (isEdit) {
    columns = columns.concat([
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: '',
        width: 100,
        render: (value, record) =>
          record._status === 'create' ? (
            <div className="action-link">
              <a onClick={() => handleCleanLine(record)}>
                {intl.get('hzero.common.button.clean').d('清除')}
              </a>
            </div>
          ) : record._status === 'update' ? (
            <div className="action-link">
              <a onClick={() => handleEditLine(record, false)}>
                {intl.get('hzero.common.button.cancel').d('取消')}
              </a>
            </div>
          ) : (
            <a onClick={() => handleEditLine(record, true)}>
              {intl.get('hzero.common.button.edit').d('编辑')}
            </a>
          ),
      },
    ]);
  }

  return (
    <Fragment>
      <div className={styles['afterSaleQuotation_line-title']}>
        <span className={styles['afterSaleQuotation_header-box']} />
        <div className={styles['afterSaleQuotation_header-title']}>工时费</div>
      </div>
      <div className={styles['afterSaleQuotation_head-table']}>
        <EditTable
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          scroll={{ y: 180 }}
          loading={loading}
          rowKey="exceptionId"
          bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
        />
      </div>
    </Fragment>

  );
};

export default Form.create({ fieldNameProp: null })(forwardRef(OpticsItems));