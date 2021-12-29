import React from 'react';
import { Form, Checkbox, Button, InputNumber, Input, Icon, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import EditTable from 'components/EditTable';
import notification from 'utils/notification';
import Lov from 'components/Lov';
import { tableScrollWidth } from 'utils/utils';
import styles from './index.less';

import { enableRender } from '../../../utils/renderer';

const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

@Form.create({ fieldNameProp: null })
export default class RelatedItemList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
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
      onCleanLine('objectList', 'objectPagination', 'operationTimeObjectId', record);
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
      onEditLine('objectList', 'operationTimeObjectId', record, flag);
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
      onCreate('objectList', 'objectPagination', 'operationTimeObjectId');
    }
  }

  @Bind()
  handleSave(record) {
    const { onSave } = this.props;
    if (onSave) {
      onSave(record, 'OBJECT');
    }
  }

  @Bind()
  handleSearch(fields = {}) {
    const { pagination, onSearch } = this.props;
    if(onSearch) {
      onSearch(pagination, fields);
    }
  }

  @Bind()
  handleReset() {
    const { onSearch, form } = this.props;
    if(onSearch) {
      onSearch({}, this.state.fields);
    }
    form.resetFields();
  }


  getColumnSearchProps(dataIndex, type) {
    const { form: { getFieldDecorator, getFieldValue }, objectTypeList } = this.props;
    return {
      filterDropdown: ({ selectedKeys }) => (
        <div
          style={{ padding: 8 }}
          className={styles.dropDown}
        >
          {type === 'SELECT' ? (
            <Form.Item>
              {getFieldDecorator(dataIndex)(
                <Select
                  ref={node => {
                    this.searchInput = node;
                  }}
                  value={selectedKeys[0]}
                  onSelect={e => {
                    this.setState({
                      fields: {
                        [dataIndex]: e,
                      },
                    });
                    this.handleSearch({ [dataIndex]: e });
                  }}
                  style={{ width: 188, marginBottom: 8, display: 'block' }}
                >
                  {objectTypeList.map(e => (
                    <Select.Option key={e.value} value={e.value}>
                      {e.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            <Form.Item>
              {getFieldDecorator(dataIndex)(
                <Input
                  ref={node => {
                    this.searchInput = node;
                  }}
                  value={selectedKeys[0]}
                  onPressEnter={e => {
                    this.setState({
                      fields: {
                        ...this.state.fields,
                        [dataIndex]: e.target.value,
                      },
                    });
                    this.handleSearch({ [dataIndex]: e.target.value, ...this.state.fields });
                  }}
                  style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
              )}
            </Form.Item>
          )}
          <Button
            type="primary"
            onClick={() => {
              const fieldValue = getFieldValue(dataIndex);
              if(dataIndex !== 'objectType') {
                this.setState({
                  fields: {
                    ...this.state.fields,
                    [dataIndex]: fieldValue,
                  },
                });
                this.handleSearch({ [dataIndex]: fieldValue, ...this.state.fields });
              } else {
                this.setState({
                  fields: {
                    [dataIndex]: fieldValue,
                  },
                });
                this.handleSearch({ [dataIndex]: fieldValue });
              }
            }}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            {intl.get('hzero.common.button.search').d('查询')}
          </Button>
          <Button
            onClick={() => this.handleReset()}
            size="small"
            style={{ width: 90 }}
          >
            {intl.get('hzero.common.button.reset').d('重置')}
          </Button>
        </div>
      ),
      filterIcon: filtered => (
        <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilterDropdownVisibleChange: visible => {
        if (visible) {
          setTimeout(() => this.searchInput.focus());
        }
      },
    };
  }

  render() {
    const { loading, dataSource, pagination, onSearch, objectTypeList, headSelectRows, tenantId, siteInfo } = this.props;
    const { fields } = this.state;
    const columns = [
      {
        title: (
          <Button
            style={{ backgroundColor: '#548FFC', color: '#fff' }}
            icon="plus"
            shape="circle"
            size="small"
            disabled={headSelectRows.length === 0}
            onClick={() => this.handleCreate()}
          />
        ),
        align: 'center',
        width: 60,
        dataIndex: 'create',
      },
      {
        title: '类型',
        width: 60,
        dataIndex: 'objectType',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('objectType', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '类型',
                    }),
                  },
                ],
              })(
                <Select allowClear style={{ width: '100%' }}>
                  {objectTypeList.map(e => (
                    <Select.Option key={e.value} value={e.value}>
                      {e.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            record.objectTypeMeaning
          ),
        ...this.getColumnSearchProps('objectType', 'SELECT'),
      },
      {
        title: '特定对象编码',
        width: 100,
        dataIndex: 'objectId',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('objectId', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '物料',
                    }),
                  },
                ],
              })(
                <Lov
                  code={record.$form.getFieldValue('objectType') === 'EO' ? 'HME.OBJECT_CODE_EO' : record.$form.getFieldValue('objectType') === 'WO' ? 'HME.OBJECT_CODE_WO' : ''}
                  disabled={!record.$form.getFieldValue('objectType')}
                  queryParams={{ tenantId, siteId: siteInfo.siteId, operationTimeId: headSelectRows[0].operationTimeId}}
                  textValue={record.objectCode}
                />
              )}
            </Form.Item>
          ) : (
            record.objectCode
          ),
        ...this.getColumnSearchProps('objectCode'),
      },
      {
        title: '特定对象时效要求/min',
        width: 140,
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
                      name: '特定物料时效要求',
                    }),
                  },
                ],
              })(<InputNumber precision={0} min={1} style={{ width: '100%' }} />)}
            </Form.Item>
          ) : (
            value
          ),
        ...this.getColumnSearchProps('standardReqdTimeInProcess'),
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
        title: '创建人',
        width: 60,
        dataIndex: 'createdByName',
      },
      {
        title: '创建时间',
        width: 120,
        dataIndex: 'creationDate',
      },
      {
        title: '修改人',
        width: 60,
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
        scroll={{ x: tableScrollWidth(columns) }}
        onChange={page => onSearch(page, fields)}
        loading={loading}
        rowKey="operationTimeObjectId"
        bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
      />
    );
  }
}
