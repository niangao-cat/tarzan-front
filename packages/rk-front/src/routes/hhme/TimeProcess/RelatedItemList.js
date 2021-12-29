import React, { Fragment } from 'react';
import { Form, Checkbox, Button, InputNumber, Icon, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';
import notification from 'utils/notification';
import { tableScrollWidth } from 'utils/utils';

import { enableRender } from '../../../utils/renderer';

import styles from './index.less';

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
      onCleanLine('itemList', 'itemPagination', 'operationTimeMaterialId', record);
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
      onEditLine('itemList', 'operationTimeMaterialId', record, flag);
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
      onCreate('itemList', 'itemPagination', 'operationTimeMaterialId');
    }
  }

  @Bind()
  handleSave(record) {
    const { onSave } = this.props;
    if (onSave) {
      onSave(record, 'ITEM');
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
  handleReset(dataIndex) {
    const { onSearch, form } = this.props;
    if(onSearch) {
      onSearch();
    }
    form.resetFields([dataIndex]);
  }


  getColumnSearchProps(dataIndex) {
    const { form: { getFieldDecorator, getFieldValue } } = this.props;
    return {
      filterDropdown: ({ selectedKeys }) => (
        <div
          style={{ padding: 8 }}
          className={styles.dropDown}
        >
          <Form.Item>
            {getFieldDecorator(dataIndex)(
              <Input
                ref={node => {
                  this.searchInput = node;
                }}
                value={selectedKeys[0]}
                onPressEnter={e => this.handleSearch({ [dataIndex]: e.target.value })}
                style={{ width: 188, marginBottom: 8, display: 'block' }}
              />
            )}
          </Form.Item>
          <Button
            type="primary"
            onClick={() => {
              const fieldValue = getFieldValue(dataIndex);
              this.setState({
                fields: {
                  [dataIndex]: fieldValue,
                },
              });
              this.handleSearch({ [dataIndex]: fieldValue });
            }}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            {intl.get('hzero.common.button.search').d('查询')}
          </Button>
          <Button
            onClick={() => this.handleReset(dataIndex)}
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
    const { loading, dataSource, pagination, onSearch, tenantId, siteInfo, headSelectRows } = this.props;
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
        title: '物料',
        width: 100,
        dataIndex: 'materialId',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Fragment>
              <Form.Item>
                {record.$form.getFieldDecorator('materialId', {
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
                    code="HME.MATERIAL_TIME"
                    textValue={record.materialCode}
                    queryParams={{ tenantId, siteId: siteInfo.siteId, operationTimeId: headSelectRows[0].operationTimeId}}
                    onChange={(val, data) => {
                      record.$form.setFieldsValue({
                        materialSiteId: data.materialSiteId,
                      });
                    }}
                  />
                )}
              </Form.Item>
              <Form.Item style={{ display: 'none' }}>
                {record.$form.getFieldDecorator('materialSiteId', {
                  initialValue: record.materialSiteId,
                })(<span />)}
              </Form.Item>
            </Fragment>
          ) : (
            record.materialCode
          ),
          ...this.getColumnSearchProps('materialCode'),
      },
      {
        title: '物料版本',
        width: 100,
        dataIndex: 'productionVersionId',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('productionVersionId', {
                initialValue: value,
              })(
                <Lov textValue={record.productionVersion} code="HME.PRODUCT_VERSION" queryParams={{ tenantId, materialSiteId: record.$form.getFieldValue('materialSiteId'), operationTimeId: headSelectRows[0].operationTimeId}} />
              )}
            </Form.Item>
          ) : (
            record.productionVersion
          ),
        ...this.getColumnSearchProps('productionVersionId'),
      },
      {
        title: '特定物料时效要求/min',
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
              })(<InputNumber precision={0} min={1} />)}
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
        rowKey="operationTimeMaterialId"
        bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
      />
    );
  }
}
