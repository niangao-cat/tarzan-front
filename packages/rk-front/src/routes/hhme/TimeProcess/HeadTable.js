import React from 'react';
import { Form, Input, Checkbox, Button, InputNumber, notification } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';
import { tableScrollWidth } from 'utils/utils';

import { enableRender } from '../../../utils/renderer';

const commonModelPrompt = 'tarzan.hmes.purchaseOrder';


export default class HeadTable extends React.Component {

  /**
   * 清除当前行
   *
   * @param {string} dataSourceName 数据源名称
   * @param {string} idName 主键id名称
   * @param {object} record 当前对象
   * @memberof FloorInfo
   */
  @Bind()
  handleCleanLine(record) {
    const { onCleanLine } = this.props;
    if (onCleanLine) {
      onCleanLine('headList', 'pagination', 'operationTimeId', record);
    }
  }

  /**
   * 编辑当前行
   *
   * @param {string} dataSourceName 数据源名称
   * @param {string} idName 主键id名称
   * @param {object} record 当前行数据
   * @param {boolean} flag 编辑当前行 / 取消编辑
   * @memberof FloorInfo
   */
  @Bind()
  handleEditLine(record, flag) {
    const { onEditLine, dataSource } = this.props;
    const editData = dataSource.filter(e => ['create', 'update'].includes(e._status));
    if(editData.length > 0 && flag) {
      notification.warning({
        description: '保存当前编辑状态的数据，再进行编辑操作',
      });
    } else if (onEditLine) {
      onEditLine('headList', 'operationTimeId', record, flag);
    }
  }

  @Bind()
  handleCreate() {
    const { onCreate, dataSource } = this.props;
    const editData = dataSource.filter(e => ['create', 'update'].includes(e._status));
    if(editData.length > 0) {
      notification.warning({
        description: '保存当前编辑状态的数据，再进行新增操作',
      });
    } else if (onCreate) {
      onCreate('headList', 'pagination', 'operationTimeId');
    }
  }

  @Bind()
  handleSave(record) {
    const { onSave } = this.props;
    if (onSave) {
      onSave(record, 'PROCESS');
    }
  }


  render() {
    const { loading, dataSource, pagination, onSearch, rowSelection, tenantId, siteInfo } = this.props;
    const columns = [
      {
        title: (
          <Button
            style={{ backgroundColor: '#548FFC', color: '#fff' }}
            icon="plus"
            shape="circle"
            size="small"
            onClick={() => this.handleCreate()}
          />
        ),
        align: 'center',
        width: 60,
        dataIndex: 'create',
        render: (text, data, index) => {
          const { pageSize, current } = pagination;
          return pageSize * (current - 1) + index + 1;
        },
      },
      {
        title: '时效编码',
        width: 100,
        dataIndex: 'timeCode',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('timeCode', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '时效编码',
                    }),
                  },
                ],
              })(
                <Input inputChinese={false} />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '时效描述',
        width: 80,
        dataIndex: 'timeName',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('timeName', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '时效描述',
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
        title: '时效要求/min',
        width: 120,
        dataIndex: 'standardReqdTimeInProcess',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('standardReqdTimeInProcess', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '时效要求',
                    }),
                  },
                ],
              })(<InputNumber precision={0} min={1} />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: '工艺',
        width: 120,
        dataIndex: 'operationId',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('operationId', {
                initialValue: value,
                rules: [
                  {
                    required: !record.$form.getFieldValue('workcellId'),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '工艺',
                    }),
                  },
                ],
              })(
                <Lov
                  code="HME.OPERATION"
                  textValue={record.operationName}
                  queryParams={{ tenantId, siteId: siteInfo.siteId}}
                  disabled={record.$form.getFieldValue('workcellId')}
                  onChange={() => {
                    record.$form.setFieldsValue({workcellId: null});
                  }}
                />)}
            </Form.Item>
          ) : (
            record.description
          ),
      },
      {
        title: '工位',
        width: 120,
        dataIndex: 'workcellId',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('workcellId', {
                initialValue: value,
                rules: [
                  {
                    required: !record.$form.getFieldValue('operationId'),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '工位',
                    }),
                  },
                ],
              })(
                <Lov
                  code="HME.WORKCELL_TIME"
                  textValue={record.workcellName}
                  queryParams={{ tenantId }}
                  disabled={record.$form.getFieldValue('operationId')}
                  onChange={() => {
                    record.$form.setFieldsValue({operationId: null });
                  }}
                />)}
            </Form.Item>
          ) : (
            record.workcellName
          ),
      },
      {
        title: intl.get(`${commonModelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 80,
        align: 'center',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('enableFlag', {
                initialValue: value !== 'N',
              })(<Checkbox />)}
            </Form.Item>
          ) : (
            enableRender(value)
          ),
      },
      {
        title: '创建人',
        width: 80,
        dataIndex: 'createdByName',
      },
      {
        title: '创建时间',
        width: 120,
        dataIndex: 'creationDate',
      },
      {
        title: '修改人',
        dataIndex: 'lastUpdatedByName',
      },
      {
        title: '修改时间',
        width: 120,
        dataIndex: 'lastUpdateDate',
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: '',
        width: 100,
        fixed: 'right',
        render: (value, record) =>
          record._status === 'create' ? (
            <div className="action-link">
              <a onClick={() => this.handleCleanLine(record)}>
                {intl.get('hzero.common.button.clean').d('清除')}
              </a>
              <a onClick={() => this.handleSave(record)}>
                {intl.get('hzero.common.button.save').d('保存')}
              </a>
            </div>
          ) : record._status === 'update' ? (
            <div className="action-link">
              <a onClick={() => this.handleEditLine(record, false)}>
                {intl.get('hzero.common.button.cancel').d('取消')}
              </a>
              <a onClick={() => this.handleSave(record)}>
                {intl.get('hzero.common.button.save').d('保存')}
              </a>
            </div>
          ) : (
            <a onClick={() => this.handleEditLine(record, true)}>
              {intl.get('hzero.common.button.edit').d('编辑')}
            </a>
          ),
      },
    ];

    return (
      <EditTable
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        rowSelection={rowSelection}
        onChange={page => onSearch(page)}
        loading={loading}
        scroll={{ x: tableScrollWidth(columns) }}
        rowKey="operationTimeId"
      />
    );
  }
}
