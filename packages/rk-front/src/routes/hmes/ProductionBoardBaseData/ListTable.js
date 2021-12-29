/*
 * @Description: IQC免检
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-29 10:06:59
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-10-26 17:27:01
 * @Copyright: Copyright (c) 2019 Hand
 */
import React, { Component, Fragment } from 'react';
import { Form, Switch, Popconfirm, Button } from 'hzero-ui';
import EditTable from 'components/EditTable';
import UploadModal from 'components/Upload/index';
import Lov from 'components/Lov';
import { tableScrollWidth } from 'utils/utils';
import intl from 'utils/intl';

@Form.create({ fieldNameProp: null })
class ListTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  limit = value => {
    return value.replace(/^(0+)|[^\d]+/g, '');
  };

  /**
   * 页面渲染
   * @returns {*}
   */
  render() {
    const {
      dataSource,
      fetchLoading,
      pagination,
      onSearch,
      handleEdit,
      handleCreate,
      deleteData,
      tenantId,
      siteId,
      selectedRow,
      handleSave,
      handleCleanLine,
    } = this.props;
    const columns = [
      {
        title: (
          <Button
            style={{ backgroundColor: '#548FFC', color: '#fff' }}
            icon="plus"
            shape="circle"
            size="small"
            onClick={() => handleCreate()}
            disabled={selectedRow.length === 0}
          />
        ),
        align: 'center',
        width: 60,
        render: (val, record, index) => (
          <Popconfirm
            title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
            onConfirm={() => deleteData(record, index)}
          >
            <Button icon="minus" shape="circle" size="small" />
          </Popconfirm>
        ),
      },
      {
        title: '站点',
        dataIndex: 'siteName',
        width: 150,
      },
      {
        title: '组织编码',
        dataIndex: 'prodLineCode',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`prodLineId`, {
                initialValue: record.prodLineId,
              })(
                <Lov
                  code="MT.PRODLINE"
                  queryParams={{ tenantId, siteId }}
                  textValue={record.prodLineCode}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '图片上传',
        dataIndex: 'attachmentUuid',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`attachmentUuid`, {
                initialValue: record.attachmentUuid,
              })(
                <UploadModal
                  bucketName='file-mes'
                  accept="image/jpeg,image/png"
                  attachmentUUID={record.attachmentUuid}
                />

              )}
            </Form.Item>
          ) : (
            <UploadModal
              bucketName='file-mes'
              viewOnly
              attachmentUUID={record.attachmentUuid}
            />
            ),
      },
      {
        title: '计划统计工段',
        dataIndex: 'workcellCode',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`workcellId`, {
                initialValue: record.workcellId,
                rules: [
                  {
                    required: selectedRow[0].value === 'MONTHLY_OUTPUT_REPORT',
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '计划统计工段',
                    }),
                  },
                ],
              })(
                <Lov
                  code="HME.WORKCELL"
                  allowClear
                  textValue={record.workcellCode}
                  queryParams={{
                    prodLineId: record.$form.getFieldValue('prodLineId'),
                    tenantId,
                    typeFlag: 'LINE',
                  }}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '有效性',
        dataIndex: 'enableFlagMeaning',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`enableFlag`, {
                initialValue: record.enableFlag,
              })(
                <Switch
                  checkedChildren="启用"
                  unCheckedChildren="禁用"
                  checkedValue='1'
                  unCheckedValue='0'
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '操作',
        dataIndex: 'operator',
        width: 150,
        render: (val, record) => (
          <span className="action-link">
            {record._status === 'update' && (
              <Fragment>
                <a onClick={() => handleEdit(record, false)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => handleSave(record)}>
                  {intl.get('hzero.common.button.save').d('保存')}
                </a>
              </Fragment>
            )}
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a onClick={() => handleEdit(record, true)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
            )}
            {record._status === 'create' && (
              <Fragment>
                <a onClick={() => handleCleanLine(record)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => handleSave(record)}>
                  {intl.get('hzero.common.button.save').d('保存')}
                </a>
              </Fragment>
            )}
          </span>
        ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="reportSetupId"
        columns={columns}
        loading={fetchLoading}
        dataSource={dataSource}
        scroll={{ x: tableScrollWidth(columns) }}
        pagination={pagination}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default ListTable;
