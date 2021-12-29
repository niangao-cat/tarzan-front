import React from 'react';
import { Form, Checkbox, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';
import notification from 'utils/notification';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';


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
  handleTurnToNextLine(e, index) {
    const dom = document.getElementsByClassName('exception-code-input');
    if (index + 1 < dom.length) {
      dom[index + 1].focus();
    }
  }

  @Bind()
  handleCleanRangeList(record) {
    const { onCleanRangeList } = this.props;
    if (onCleanRangeList) {
      onCleanRangeList(record);
    }
  }

  @Bind()
  handleSearch(page) {
    const { dataSource, onSearch } = this.props;
    if (onSearch && dataSource.filter(e => ['create', 'update'].includes(e._status)).length === 0) {
      onSearch(page);
    } else {
      notification.warning({
        description: '当前存在未保存的数据，请先保存再新建盘点单据',
      });
    }
  }

  render() {
    const { siteInfo, tenantId, userId, loading, dataSource, pagination, onOpenModal, rowSelection } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.stocktakeNum`).d('盘点单号'),
        width: 120,
        align: 'center',
        dataIndex: 'stocktakeNum',
      },
      {
        title: intl.get(`${commonModelPrompt}.stocktakeStatus`).d('单据状态'),
        width: 90,
        align: 'center',
        dataIndex: 'stocktakeStatusMeaning',
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionName`).d('是否明盘'),
        width: 80,
        align: 'center',
        dataIndex: 'openFlag',
        render: (value, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('openFlag', {
                initialValue: value !== 'N',
              })(<Checkbox />)}
            </Form.Item>
          ) : (
            record.openFlagMeaning
          ),
      },
      {
        title: intl.get(`${commonModelPrompt}.site`).d('工厂'),
        width: 120,
        dataIndex: 'siteId',
        align: 'center',
        render: (value, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('siteId', {
                initialValue: value ? siteInfo.siteId : value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonModelPrompt}.exceptionName`).d('工厂'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="WMS.SITE_PERMISSION"
                  queryParams={{ tenantId, userId }}
                  textValue={siteInfo.defaultSiteName}
                  onChange={() => {
                    this.handleCleanRangeList(record);
                    record.$form.resetFields(['areaLocatorId']);
                  }}
                />
              )}
            </Form.Item>
          ) : (
            record.siteCode
          ),
      },
      {
        title: intl.get(`${commonModelPrompt}.supplierName`).d('仓库'),
        width: 120,
        align: 'center',
        dataIndex: 'wareHouseCode',
        render: (val, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('areaLocatorId', {
                initialValue: record.areaLocatorId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonModelPrompt}.exceptionName`).d('仓库'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="WMS.PRIVILEGED_WAREHOUSE"
                  queryParams={{ tenantId, siteId: record.$form.getFieldValue('siteId'), userId, docType: 'STOCKTAKE_DOC', operationType: 'CREATE' }}
                  textValue={val}
                  disabled={!record.$form.getFieldValue('siteId')}
                  onChange={() => {
                    this.handleCleanRangeList(record);
                  }}
                />
              )}
            </Form.Item>
          ) : val,
      },
      {
        title: intl.get(`${commonModelPrompt}.creationDate`).d('货位'),
        width: 120,
        align: 'center',
        dataIndex: 'locatorCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.demandTime`).d('货位范围'),
        width: 90,
        align: 'center',
        dataIndex: 'lastUpdatedUserName',
        render: (val, record) =>
          (['create'].includes(record._status) && record.$form.getFieldValue('areaLocatorId')) || record._status !== 'create' ?
            <a onClick={() => onOpenModal(record, 'LOCATOR')}>货位范围</a> : '',
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('物料范围'),
        dataIndex: 'lastUpdateDate',
        align: 'center',
        width: 90,
        render: (val, record) =>
          (['create'].includes(record._status) && record.$form.getFieldValue('areaLocatorId')) || record._status !== 'create' ?
            <a onClick={() => onOpenModal(record, 'MATERIAL')}>物料范围</a> : '',
      },
      {
        title: intl.get(`${commonModelPrompt}.supplierName`).d('创建人'),
        width: 90,
        align: 'center',
        dataIndex: 'createdByName',
      },
      {
        title: intl.get(`${commonModelPrompt}.creationDate`).d('创建时间'),
        width: 180,
        align: 'center',
        dataIndex: 'creationDate',
      },
      {
        title: intl.get(`${commonModelPrompt}.demandTime`).d('最后更新人'),
        width: 90,
        align: 'center',
        dataIndex: 'lastUpdatedByName',
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('最后更新时间'),
        dataIndex: 'lastUpdateDate',
        align: 'center',
        width: 180,
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('备注'),
        dataIndex: 'remark',
        align: 'center',
        width: 120,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('remark', {
                initialValue: val,
              })(
                <Input />
              )}
            </Form.Item>
          ) : val,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: '',
        width: 100,
        fixed: 'right',
        align: 'center',
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
          ) : ['NEW', 'RELEASED'].includes(record.stocktakeStatus) ? (
            <a onClick={() => this.handleEditLine(record, true)}>
              {intl.get('hzero.common.button.edit').d('编辑')}
            </a>
          ) : null,
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
        onChange={page => this.handleSearch(page)}
        loading={loading}
        rowKey="stocktakeId"
        bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
      />
    );
  }
}
