import React from 'react';
import { Form, Checkbox, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';

import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';

const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

export default class ListTable extends React.Component {

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
      onCleanLine('list', 'pagination', 'stocktakeId', record);
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
      onEditLine('list', 'stocktakeId', record, flag);
    }
  }

  @Bind()
  handleCreate() {
    const { onCreate } = this.props;
    if (onCreate) {
      onCreate('list', 'pagination', 'stocktakeId');
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
  handleCleanRangeList(record) {
    const { onCleanRangeList } = this.props;
    if(onCleanRangeList) {
      onCleanRangeList(record);
    }
  }

  @Bind()
  handleOpenRangeModal(record, rangeObjectType) {
    const { onOpenModal, prodLineDel } = this.props;
    if(onOpenModal) {
      if (prodLineDel) {
        // eslint-disable-next-line no-param-reassign
        record.workcellRangeList = [];
        onOpenModal(record, rangeObjectType);
      } else {
        onOpenModal(record, rangeObjectType);
      }
    }
  }

  render() {
    const { loading, dataSource, pagination, onSearch, tenantId, rowSelection } = this.props;
    const columns = [
      {
        title: "盘点单号",
        width: 100,
        dataIndex: 'stocktakeNum',
      },
      {
        title: "单据状态",
        width: 100,
        dataIndex: 'stocktakeStatusMeaning',
      },
      {
        title: "是否明盘",
        width: 100,
        dataIndex: 'openFlag',
        render: (value, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('openFlag', {
                initialValue: value || true,
              })(<Checkbox />)}
            </Form.Item>
          ) : (
            record.openFlagMeaning
          ),
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionType`).d('工厂'),
        width: 100,
        dataIndex: 'siteId',
        render: (value, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('siteId', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '工厂',
                    }),
                  },
                ],
              })(
                <Lov
                  code="MT.SITE"
                  queryParams={{ tenantId }}
                  textValue={record.siteName}
                  onChange={() => {
                    this.handleCleanRangeList(record);
                    record.$form.resetFields(['areaId']);
                  }}
                />
              )}
            </Form.Item>
          ) : (
            record.siteName
          ),
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionCode`).d('部门'),
        width: 100,
        dataIndex: 'areaId',
        render: (value, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('areaId', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '部门',
                    }),
                  },
                ],
              })(
                <Lov
                  code="HME.BUSINESS_AREA"
                  queryParams={{ tenantId, siteId: record.$form.getFieldValue('siteId') }}
                  textValue={record.areaName}
                  disabled={!record.$form.getFieldValue('siteId')}
                  onChange={() => {
                    this.handleCleanRangeList(record);
                  }}
                />
              )}
            </Form.Item>
          ) : (
            record.areaName
          ),
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionName`).d('物料范围'),
        width: 100,
        dataIndex: 'exceptionName',
        render: (val, record) =>
          (['create'].includes(record._status) && record.$form.getFieldValue('areaId')) || record._status !== 'create' ?
            <a onClick={() => this.handleOpenRangeModal(record, 'MATERIAL')}>物料范围</a> : '',
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionName`).d('产线范围'),
        width: 100,
        dataIndex: 'exceptionName',
        render: (val, record) =>
          (['create'].includes(record._status) && record.$form.getFieldValue('areaId')) || record._status !== 'create' ?
            <a onClick={() => this.handleOpenRangeModal(record, 'PL')}>产线范围</a> : '',
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionName`).d('工序范围'),
        width: 100,
        dataIndex: 'exceptionName',
        render: (val, record) =>
          (['create'].includes(record._status) && record.$form.getFieldValue('areaId')) && !isEmpty(record.prodLineRangeList) || record._status !== 'create' ?
            <a onClick={() => this.handleOpenRangeModal(record, 'WP')}>工序范围</a> : '',
      },
      {
        title: intl.get(`${commonModelPrompt}.supplierName`).d('创建人'),
        width: 80,
        dataIndex: 'createdByName',
      },
      {
        title: intl.get(`${commonModelPrompt}.creationDate`).d('创建时间'),
        width: 160,
        dataIndex: 'creationDate',
      },
      {
        title: intl.get(`${commonModelPrompt}.demandTime`).d('最后更新人'),
        width: 80,
        dataIndex: 'lastUpdatedByName',
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('最后更新时间'),
        dataIndex: 'lastUpdateDate',
        width: 160,
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('备注'),
        dataIndex: 'remark',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('remark', {
                initialValue: value,
              })(
                <Input />
              )}
            </Form.Item>
          ) : (
            value
          ),
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
        scroll={{ x: tableScrollWidth(columns) }}
        rowSelection={rowSelection}
        onChange={page => onSearch(page)}
        loading={loading}
        rowKey="stocktakeId"
        bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
      />
    );
  }
}
