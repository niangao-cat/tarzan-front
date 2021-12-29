/**
 * WorkCellDist - 工作单元明细编辑
 * @date: 2019-12-16
 * @author: xubitig <biting.xu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { PureComponent, Fragment } from 'react';
// import { connect } from 'dva';
import { Modal, Form, Row, Col, Input, Button, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';

import { FORM_COL_3_LAYOUT, SEARCH_COL_CLASSNAME } from 'utils/constants';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
import intl from 'utils/intl';
import notification from 'utils/notification';

import EditTable from 'components/EditTable';
import Lov from 'components/Lov';
import MultipleLov from '../../../components/MultipleLov/index';
import ModalContainer, { registerContainer } from '../../../components/Modal/ModalContainer';

import styles from './index.less';

const { Option } = Select;


/**
 * 扩展属性表格抽屉展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @param {Boolean} visible - 是否关闭抽屉
 * @param {Boolean} canEdit - 是否可以编辑
 * @param {Array} - attribute List
 * @param {Function} onSave - 保存抽屉数据
 * @param {Function} onCancle - 关闭抽屉
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
export default class ItemModal extends PureComponent {
  constructor(props) {
    super(props);
    if(props.onRef) {
      props.onRef(this);
    }
    this.state = {
      selectedRows: [],
    };
  }

  @Bind()
  handleCreate() {
    const { onCreate } = this.props;
    if(onCreate) {
      onCreate('rangeList', 'rangePagination', 'id');
    }
  }

  @Bind()
  handleEditLine(record, flag) {
    const { onEditLine } = this.props;
    if(onEditLine) {
      onEditLine('rangeList', 'id', record, flag);
    }
  }

  @Bind()
  handleCleanLine(record) {
    const { onCleanLine } = this.props;
    if(onCleanLine) {
      onCleanLine('rangeList', 'rangePagination', 'id', record);
    }
  }

  @Bind()
  handleChangeSelectRows(selectedRowKeys, selectedRows) {
    this.setState({ selectedRows });
  }

  @Bind()
  handleSearch(page) {
    const { onSearch, currentRecord, rangeObjectType, dataSource } = this.props;
    if(onSearch) {
      if(isEmpty(page) || (!isEmpty(page) && dataSource.filter(e => ['create', 'update'].includes(e._status)).length) === 0) {
        onSearch({stocktakeId: currentRecord.stocktakeId, rangeObjectType}, page);
      } else {
        notification.warning({
          description: '当前页面有未保存数据，请保存数据后再执行翻页操作',
        });
      }
    }
  }

  @Bind()
  handleDelete() {
    const { onDelete } = this.props;
    const { selectedRows } = this.state;
    if(onDelete) {
      onDelete(selectedRows);
    }
  }

  @Bind()
  handleSave() {
    const { onSave } = this.props;
    if(onSave) {
      onSave();
    }
  }

  @Bind()
  resetSearch() {
    this.props.form.resetFields();
  }

  @Bind()
  handleFetchBatchItemList(record) {
    const { onFetchBatchItemList, currentRecord } = this.props;
    if(!isEmpty(record)) {
      onFetchBatchItemList({
        itemGroupCode: record.itemGroupCode,
        siteId: currentRecord._status === 'create' ? currentRecord.$form.getFieldValue('siteId') : currentRecord.siteId,
      });
    }
  }

  @Bind()
  handleFetchBatchLocatorList(val) {
    const { onFetchBatchLocatorList } = this.props;
    if(!isEmpty(val)) {
      onFetchBatchLocatorList(val);
    }
  }

  render() {
    const {
      tenantId,
      form: { getFieldDecorator },
      visible = false,
      onCancel,
      dataSource,
      loading,
      onSave,
      rangeObjectType,
      currentRecord,
      deleteLoading,
      locatorTypeList,
      saving,
      pagination,
      recordStatus,
    } = this.props;
    const { selectedRows } = this.state;
    const rowSelection = {
      selectedRowKeys: selectedRows.map(e => e.id),
      onChange: this.handleChangeSelectRows,
    };
    const columns = rangeObjectType === 'MATERIAL' ? [
      {
        title: '物料编码',
        width: 120,
        align: 'center',
        dataIndex: 'rangeObjectCode',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Fragment>
              <Form.Item>
                {record.$form.getFieldDecorator(`rangeObjectId`, {
                  initialValue: record.rangeObjectId,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '物料编码',
                      }),
                    },
                  ],
                })(
                  <Lov
                    code="WMS.STOCKTAKE_MATERIAL"
                    queryParams={{
                      tenantId,
                      siteId: record._status === 'create' ? currentRecord.$form.getFieldValue('siteId') : currentRecord.siteId,
                      warehouseId: currentRecord._status === 'create' ? currentRecord.$form.getFieldValue('areaLocatorId') : currentRecord.areaLocatorId,
                    }}
                    lovOptions={{
                      displayField: 'materialCode',
                    }}
                    onChange={(value, data) => {
                      record.$form.setFieldsValue({ rangeObjectName: data.materialName, rangeObjectCode: data.materialCode });
                    }}
                    textValue={val}
                  />)}
              </Form.Item>
              <Form.Item style={{ display: 'none' }}>
                {record.$form.getFieldDecorator(`rangeObjectCode`, {
                  initialValue: record.rangeObjectCode,
                })(<span />)}
              </Form.Item>
            </Fragment>
          ) : (
            val
          ),
      },
      {
        title: '物料描述',
        width: 80,
        align: 'center',
        dataIndex: 'rangeObjectName',
        render: (val, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`rangeObjectName`, {
                initialValue: val,
              })(
                <Input disabled />
              )}
            </Form.Item>
          ) : (
          val
        ),
      },
      {
        title: '操作',
        dataIndex: 'operator',
        align: 'center',
        width: 120,
        render: (val, record) => {
          return (
            <span className="action-link">
              {['create'].includes(record._status) && (
                <a onClick={() => this.handleCleanLine(record)}>
                  {intl.get('hzero.common.button.clear').d('清除')}
                </a>
              )}
            </span>
          );
        },
      },
    ] : [
      {
        title: '货位编码',
        width: 120,
        align: 'center',
        dataIndex: 'rangeObjectCode',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Fragment>
              <Form.Item>
                {record.$form.getFieldDecorator(`rangeObjectId`, {
                  initialValue: record.rangeObjectId,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '货位编码',
                      }),
                    },
                  ],
                })(
                  <MultipleLov
                    code="WMS.STOCKTAKE_LOCATOR"
                    queryParams={{
                      tenantId,
                      siteId: record._status === 'create' ? currentRecord.$form.getFieldValue('siteId') : currentRecord.siteId,
                      warehouseId: currentRecord._status === 'create' ? currentRecord.$form.getFieldValue('areaLocatorId') : currentRecord.areaLocatorId,
                    }}
                    onChange={(value, data) => {
                      record.$form.setFieldsValue({ rangeObjectName: data.locatorName, rangeObjectCode: data.locatorCode });
                    }}
                    textValue={val}
                  />)}
              </Form.Item>
              <Form.Item style={{ display: 'none' }}>
                {record.$form.getFieldDecorator(`rangeObjectCode`, {
                  initialValue: record.rangeObjectCode,
                })(<span />)}
              </Form.Item>
              <ModalContainer ref={registerContainer} />
            </Fragment>
          ) : (
            val
          ),
      },
      {
        title: '货位描述',
        width: 80,
        align: 'center',
        dataIndex: 'rangeObjectName',
        render: (val, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`rangeObjectName`, {
                initialValue: val,
              })(
                <Input disabled />
              )}
            </Form.Item>
          ) : (
          val
        ),
      },
      {
        title: '操作',
        dataIndex: 'operator',
        align: 'center',
        width: 120,
        render: (val, record) => {
          return (
            <span className="action-link">
              {['create'].includes(record._status) && (
                <a onClick={() => this.handleCleanLine(record)}>
                  {intl.get('hzero.common.button.clear').d('清除')}
                </a>
              )}
            </span>
          );
        },
      },
    ];

    return (
      <Modal
        destroyOnClose
        width={1100}
        title={rangeObjectType === 'MATERIAL' ? '物料范围' : '货位范围'}
        visible={visible}
        onCancel={onCancel}
        footer={(
          <Fragment>
            <Button
              style={{ marginRight: '12px'}}
              onClick={() => onCancel()}
            >
              取消
            </Button>
            <Button
              type="primary"
              onClick={() => onSave()}
              loading={saving}
              disabled={!currentRecord._status || (currentRecord._status === 'update' && recordStatus !== '新建')}
            >
              保存
            </Button>
            <Button
              type="danger"
              onClick={() => this.handleDelete()}
              loading={deleteLoading}
              disabled={!currentRecord._status || (currentRecord._status === 'update' && recordStatus !== '新建')}
            >
              删除
            </Button>
          </Fragment>
        )}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        placement="right"
        maskClosable
      >
        <Form>
          <div className={styles['line-title']}>
            <span />
            <div>查询条件</div>
          </div>
          <Row>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={rangeObjectType === 'MATERIAL' ? '物料编码' : '货位编码'}
              >
                {getFieldDecorator('rangeObjectCode')(
                  rangeObjectType === 'MATERIAL' ? (
                    <Lov
                      code="MT.MATERIAL"
                      queryParams={{ tenantId }}
                      textField="materialCode"
                      isInput
                    />
                  ) : (
                    <MultipleLov
                      code="WMS.STOCKTAKE_LOCATOR"
                      queryParams={{ tenantId, warehouseId: currentRecord._status === 'create' ? currentRecord.$form.getFieldValue('areaLocatorId') : currentRecord.areaLocatorId }}
                      isInput
                    />
                  )
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={rangeObjectType === 'MATERIAL' ? '物料描述' : '货位描述'}
              >
                {getFieldDecorator('rangeObjectName')(<Input />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT} className={SEARCH_COL_CLASSNAME}>
              <Form.Item>
                <Button onClick={this.resetSearch}>
                  {intl.get(`hzero.common.button.reset`).d('重置')}
                </Button>
                <Button type="primary" htmlType="submit" onClick={() => this.handleSearch()}>
                  {intl.get(`hzero.common.button.search`).d('查询')}
                </Button>
              </Form.Item>
            </Col>
          </Row>
          <div className={styles['line-title']}>
            <span />
            <div>{rangeObjectType === 'MATERIAL' ? '按物料类别批量新增' : '按货位批量新增'}</div>
          </div>
          <Row>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={rangeObjectType === 'MATERIAL' ? '物料类别' : '货位类型'}
              >
                {getFieldDecorator('rangeObjectType')(
                  rangeObjectType === 'MATERIAL' ?
                    (<Lov code="WMS.ITEM_GROUP" disabled={!currentRecord._status || (currentRecord._status === 'update' && recordStatus !== '新建')} queryParams={{ tenantId }} onChange={(val, record) => this.handleFetchBatchItemList(record)} />)
                  : (
                    <Select allowClear disabled={!currentRecord._status || (currentRecord._status === 'update' && recordStatus !== '新建')} onChange={(val) => this.handleFetchBatchLocatorList(val)}>
                      {locatorTypeList.map(e => (
                        <Option key={e.typeCode} value={e.typeCode}>
                          {e.description}
                        </Option>
                      ))}
                    </Select>
                  )
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <ModalContainer ref={registerContainer} />
        <Button
          type="primary"
          onClick={() => this.handleCreate()}
          style={{ marginBottom: '10px' }}
          disabled={!currentRecord._status || (currentRecord._status === 'update' && recordStatus !== '新建')}
        >
          新建
        </Button>
        <EditTable
          bordered
          dataSource={dataSource}
          rowSelection={rowSelection}
          columns={columns}
          pagination={pagination}
          onChange={page => this.handleSearch(page)}
          loading={loading}
          rowKey="id"
        />
      </Modal>
    );
  }
}
