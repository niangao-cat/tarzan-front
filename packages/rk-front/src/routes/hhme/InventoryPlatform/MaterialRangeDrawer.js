/**
 * WorkCellDist - 工作单元明细编辑
 * @date: 2019-12-16
 * @author: xubitig <biting.xu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { PureComponent, Fragment } from 'react';
// import { connect } from 'dva';
import { Modal, Form, Row, Col, Input, Button } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';

import { FORM_COL_3_LAYOUT, SEARCH_COL_CLASSNAME } from 'utils/constants';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
import intl from 'utils/intl';
import notification from 'utils/notification';

import EditTable from 'components/EditTable';
import Lov from 'components/Lov';

import styles from './index.less';



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
export default class MaterialRangeDrawer extends PureComponent {
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
      onCreate();
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
    const { onFetchBatchItemList } = this.props;
    if(!isEmpty(record)) {
      onFetchBatchItemList({
        ...record,
      });
    }
  }

  @Bind()
  handleFetchBatchProdLineList(record) {
    const { onFetchBatchProdLineList } = this.props;
    if(!isEmpty(record)) {
      onFetchBatchProdLineList({
        ...record,
      });
    }
  }

  @Bind()
  handleFetchBatchWorkcellList(record) {
    const { onFetchBatchWorkcellList } = this.props;
    if(!isEmpty(record)) {
      onFetchBatchWorkcellList({
        ...record,
      });
    }
  }

  @Bind()
  handleCloseModal() {
    const { onCancel } = this.props;
    if(onCancel) {
      onCancel();
    }
  }

  @Bind()
  handleGetColumn() {
    const { rangeObjectType, currentRecord, tenantId } = this.props;
    let columns = '';
    const prodLineLovParams = {
      tenantId,
      prodLineIdList: currentRecord._status === 'update'
        ? currentRecord.prodLineRangeList
        : currentRecord._status === 'create'
        ? currentRecord.prodLineRangeList.map(e => e.rangeObjectId)
        : [],
    };
    switch(rangeObjectType) {
      case 'MATERIAL':
        columns = [
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
                        code="QMS.MATERIAL"
                        queryParams={{ tenantId }}
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
        ];
        break;
      case 'PL':
        columns = [
          {
            title: '产线编码',
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
                            name: '产线编码',
                          }),
                        },
                      ],
                    })(
                      <Lov
                        code="HME.PRODLINE_DEPARTMENT"
                        queryParams={{
                          tenantId,
                          departmentId: currentRecord._status === 'create' ? currentRecord.$form.getFieldValue('areaId') : currentRecord.areaId,
                        }}
                        onChange={(value, data) => {
                          record.$form.setFieldsValue({ rangeObjectName: data.prodLineName, rangeObjectCode: data.prodLineCode });
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
            title: '产线描述',
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
        break;
      case 'WP':
        columns = [
          {
            title: '工序编码',
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
                            name: '工序编码',
                          }),
                        },
                      ],
                    })(
                      <Lov
                        code="HME.PROCESS_PRODLINE_URL"
                        queryParams={prodLineLovParams}
                        onChange={(value, data) => {
                          record.$form.setFieldsValue({ rangeObjectName: data.workcellName, rangeObjectCode: data.workcellCode });
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
            title: '工序描述',
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
        break;
      default:
        break;
    }
    return columns;
  }

  @Bind()
  handleGetSearchForm() {
    const { rangeObjectType, tenantId, form: { getFieldDecorator }, currentRecord } = this.props;
    let component = '';
    const prodLineLovParams = {
      tenantId,
      prodLineIdList: currentRecord._status === 'update'
        ? currentRecord.prodLineRangeList
        : currentRecord._status === 'create'
        ? currentRecord.prodLineRangeList.map(e => e.rangeObjectId)
        : [],
    };
    switch(rangeObjectType) {
      case 'MATERIAL':
        component = (
          <Fragment>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label='物料编码'
              >
                {getFieldDecorator('rangeObjectCode')(
                  <Lov
                    code="QMS.MATERIAL"
                    queryParams={{ tenantId }}
                    textField="materialCode"
                    isInput
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label='物料描述'
              >
                {getFieldDecorator('rangeObjectName')(<Input />)}
              </Form.Item>
            </Col>
          </Fragment>
        );
        break;
      case 'PL':
        component = (
          <Fragment>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label='产线编码'
              >
                {getFieldDecorator('rangeObjectCode')(
                  <Lov
                    code="HME.PRODLINE_DEPARTMENT"
                    queryParams={{ tenantId, departmentId: currentRecord._status === 'create' ? currentRecord.$form.getFieldValue('areaId') : currentRecord.areaId }}
                    textField="prodLineCode"
                    isInput
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label='产线描述'
              >
                {getFieldDecorator('rangeObjectName')(<Input />)}
              </Form.Item>
            </Col>
          </Fragment>
        );
        break;
      case 'WP':
        component = (
          <Fragment>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label="工序编码"
              >
                {getFieldDecorator('rangeObjectCode')(
                  <Lov
                    code="HME.PROCESS_PRODLINE_URL"
                    queryParams={prodLineLovParams}
                    textField="materialCode"
                    isInput
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label='工序描述'
              >
                {getFieldDecorator('rangeObjectName')(<Input />)}
              </Form.Item>
            </Col>
          </Fragment>
        );
        break;
      default:
        break;
    }
    return component;
  }

  @Bind()
  handleBatchForm() {
    const { rangeObjectType, currentRecord, tenantId, form: { getFieldDecorator } } = this.props;
    let component = '';
    const prodLineLovParams = {
      tenantId,
      prodLineIdList: currentRecord._status === 'update'
        ? currentRecord.prodLineRangeList
        : currentRecord._status === 'create'
        ? currentRecord.prodLineRangeList.map(e => e.rangeObjectId)
        : [],
    };
    switch(rangeObjectType) {
      case 'MATERIAL':
        component = (
          <Fragment>
            <div className={styles['line-title']}>
              <span />
              <div>按物料类别批量新增</div>
            </div>
            <Row>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label='物料类别'
                >
                  {getFieldDecorator('rangeObjectType')(
                    <Lov
                      code="WMS.ITEM_GROUP"
                      disabled={!currentRecord._status}
                      queryParams={{ tenantId }}
                      onChange={(val, record) => this.handleFetchBatchItemList(record)}
                    />
                )}
                </Form.Item>
              </Col>
            </Row>
          </Fragment>
        );
        break;
      case 'PL':
        component = (
          <Fragment>
            <div className={styles['line-title']}>
              <span />
              <div>按车间批量新增</div>
            </div>
            <Row>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label='车间'
                >
                  {getFieldDecorator('rangeObjectType')(
                    <Lov
                      code="HME.WORKSHOP__DEPARTMENT"
                      disabled={!currentRecord._status}
                      queryParams={{ tenantId, departmentId: currentRecord._status === 'create' ? currentRecord.$form.getFieldValue('areaId') : currentRecord.areaId }}
                      onChange={(val, record) => this.handleFetchBatchProdLineList(record)}
                    />
                )}
                </Form.Item>
              </Col>
            </Row>
          </Fragment>
        );
        break;
      case 'WP':
        component = (
          <Fragment>
            <div className={styles['line-title']}>
              <span />
              <div>按产线批量新增</div>
            </div>
            <Row>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label='产线'
                >
                  {getFieldDecorator('rangeObjectType')(
                    <Lov
                      code="HME.PRODLINE_PRODLINE"
                      disabled={!currentRecord._status}
                      queryParams={prodLineLovParams}
                      onChange={(val, record) => this.handleFetchBatchWorkcellList(record)}
                    />
                )}
                </Form.Item>
              </Col>
            </Row>
          </Fragment>
        );
        break;
      default:
        break;
    }
    return component;
  }

  @Bind()
  handleGetTitle() {
    const { rangeObjectType } = this.props;
    let title = '';
    switch(rangeObjectType) {
      case 'MATERIAL':
        title = "物料范围";
        break;
      case 'PL':
        title = "产线范围";
        break;
      case 'WP':
        title = "工序范围";
        break;
      default:
        break;
    }
    return title;
  }

  render() {
    const {
      visible = false,
      dataSource,
      loading,
      currentRecord,
      deleteLoading,
      saving,
      pagination,
    } = this.props;
    const { selectedRows } = this.state;
    const rowSelection = {
      selectedRowKeys: selectedRows.map(e => e.id),
      onChange: this.handleChangeSelectRows,
    };
    const columns = this.handleGetColumn();
    return (
      <Modal
        destroyOnClose
        width={1100}
        title={this.handleGetTitle()}
        visible={visible}
        onCancel={this.handleCloseModal}
        footer={(
          <Fragment>
            <Button
              style={{ marginRight: '12px'}}
              onClick={this.handleCloseModal}
            >
              取消
            </Button>
            <Button
              type="primary"
              onClick={this.handleSave}
              loading={saving}
              disabled={!currentRecord._status}
            >
              保存
            </Button>
            <Button
              type="danger"
              onClick={() => this.handleDelete()}
              loading={deleteLoading}
              disabled={!currentRecord._status}
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
            {this.handleGetSearchForm()}
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
          {this.handleBatchForm()}
        </Form>
        <Button
          type="primary"
          onClick={() => this.handleCreate()}
          style={{ marginBottom: '10px' }}
          disabled={!currentRecord._status}
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
