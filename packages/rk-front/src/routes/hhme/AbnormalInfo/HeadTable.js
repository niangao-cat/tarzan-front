import React from 'react';
import { Form, Input, Checkbox, Button, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import EditTable from 'components/EditTable';

import { enableRender } from '../../../utils/renderer';

const commonModelPrompt = 'tarzan.hmes.purchaseOrder';
const { Option } = Select;
export default class HeadTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectRows: [],
    };
  }

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
      onCleanLine('headList', 'pagination', 'exceptionId', record);
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
    const { onEditLine } = this.props;
    if (onEditLine) {
      onEditLine('headList', 'exceptionId', record, flag);
    }
  }

  @Bind()
  handleChangeSelectRows(selectedRowKeys, selectRows) {
    const { onFetchLineList } = this.props;
    this.setState({ selectRows });
    const record = selectRows[0];
    if (onFetchLineList && record._status !== 'create') {
      onFetchLineList({}, record);
    }
  }

  @Bind()
  handleCreate() {
    const { onCreate } = this.props;
    if (onCreate) {
      onCreate('headList', 'pagination', 'exceptionId');
    }
  }

  @Bind()
  handleSave(record) {
    const { onSave } = this.props;
    if (onSave) {
      onSave(record);
    }
  }

  @Bind()
  handleTurnToNextLine(e, index) {
    const dom = document.getElementsByClassName('exception-code-input');
    if (index + 1 < dom.length) {
      dom[index + 1].focus();
    }
  }

  render() {
    const { exceptionTypeList, loading, dataSource, pagination, onSearch } = this.props;
    const { selectRows } = this.state;
    const rowSelection = {
      selectedRowKeys: selectRows.map(e => e.exceptionId),
      type: 'radio', // 单选
      onChange: this.handleChangeSelectRows,
    };
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
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionType`).d('异常类型'),
        width: 100,
        dataIndex: 'exceptionType',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('exceptionType', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonModelPrompt}.date.exceptionType`).d('异常类型'),
                    }),
                  },
                ],
              })(
                <Select allowClear style={{ width: '100%' }}>
                  {exceptionTypeList.map(e => (
                    <Option key={e.typeCode} value={e.typeCode}>
                      {e.description}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            record.exceptionTypeName
          ),
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionCode`).d('异常编码'),
        width: 100,
        dataIndex: 'exceptionCode',
        render: (value, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('exceptionCode', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonModelPrompt}.exceptionCode`).d('异常编码'),
                    }),
                  },
                ],
              })(
                <Input
                  className='exception-code-input'
                  onPressEnter={e => {
                    this.handleTurnToNextLine(e, index);
                  }}
                />
              )}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionName`).d('异常描述'),
        width: 120,
        dataIndex: 'exceptionName',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('exceptionName', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonModelPrompt}.exceptionName`).d('异常描述'),
                    }),
                  },
                ],
              })(<Input />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${commonModelPrompt}.enableFlag`).d('启用状态'),
        width: 80,
        dataIndex: 'enableFlag',
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
        title: intl.get(`${commonModelPrompt}.supplierName`).d('创建人'),
        width: 80,
        dataIndex: 'createdUserName',
      },
      {
        title: intl.get(`${commonModelPrompt}.creationDate`).d('创建时间'),
        width: 120,
        dataIndex: 'creationDate',
      },
      {
        title: intl.get(`${commonModelPrompt}.demandTime`).d('修改人'),
        width: 80,
        dataIndex: 'lastUpdatedUserName',
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('修改时间'),
        dataIndex: 'lastUpdateDate',
        width: 120,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: '',
        width: 100,
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
        scroll={{ y: 180 }}
        rowSelection={rowSelection}
        onChange={page => onSearch(page)}
        loading={loading}
        rowKey="exceptionId"
        bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
      />
    );
  }
}
