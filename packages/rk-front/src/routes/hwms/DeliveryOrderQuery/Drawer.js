/**
 * WorkCellDist - 工作单元明细编辑
 * @date: 2019-12-16
 * @author: xubitig <biting.xu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { PureComponent, Fragment } from 'react';
// import { connect } from 'dva';
import { Modal, Form, Row, Col, Input, DatePicker, Button, InputNumber } from 'hzero-ui';
import moment from 'moment';
import { isEmpty } from 'lodash';

import { FORM_COL_3_LAYOUT } from 'utils/constants';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
import { getDateTimeFormat } from 'utils/utils';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';

import EditTable from 'components/EditTable';
import Lov from 'components/Lov';


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
export default class AttributeDrawer extends PureComponent {
  constructor(props) {
    super(props);
    if(props.onRef) {
      props.onRef(this);
    }
  }

  @Bind()
  handleSearch(page) {
    const { onFetchDetail, onFetchPoList, type, record } = this.props;
    if(type === 'INSTRUCTION') {
      onFetchDetail(page, {instructionId: record.instructionId});
    } else if(type === 'PO') {
      onFetchPoList(page, {instructionId: record.instructionId});
    }
  }

  render() {
    const {
      tenantId,
      siteInfo,
      form: { getFieldDecorator },
      replenishmentInfo,
      visible = false,
      onCancel,
      dataSource,
      loading,
      onSaveReplenishmentList,
      onEditLine,
      onReplaceMaintain,
      onSave,
      onClearLine,
    } = this.props;
    const columns = [
      {
        title: '物料号',
        width: 120,
        dataIndex: 'materialCode',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) && !record.substituteAllowedFlag ? (
            <Fragment>
              <Form.Item>
                {record.$form.getFieldDecorator(`materialId`, {
                  initialValue: record.materialId,
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
                    code="WMS.MATERIAL_SUBSTITUTE_QTY"
                    queryParams={{
                      tenantId,
                      siteId: siteInfo.siteId,
                      materialId: record.parentMaterialId,
                      workOrderId: record.workOrderId,
                      workcellId: replenishmentInfo.workCell,
                    }}
                    lovOptions={{
                      displayField: 'materialCode',
                    }}
                    onChange={(value, data) => {
                      record.$form.setFieldsValue({ materialCode: data.materialCode, inventoryQty: data.inventoryQty, inStockQty: data.workcellQty });
                    }}
                    textValue={val}
                  />)}
              </Form.Item>
              <Form.Item style={{ display: "none" }}>
                {record.$form.getFieldDecorator(`materialCode`, {
                  initialValue: record.materialCode,
                })(<span />)}
              </Form.Item>
            </Fragment>
          ) : (
              val
            ),
      },
      {
        title: '物料版本',
        width: 80,
        dataIndex: 'materialVersion',
        render: (val, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialVersion`, {
                initialValue: val,
              })(
                <Input />
              )}
            </Form.Item>
          ) : (
          val
        ),
      },
      {
        title: '销售订单-行号',
        width: 100,
        dataIndex: 'materialLotStatusMeaning',
        render: (val, record) => `${isEmpty(record.soNum) ? '' : record.soNum}-${isEmpty(record.soLineNum) ? '' : record.soLineNum}`,
      },
      {
        title: '补料单数量',
        width: 80,
        dataIndex: 'replenishQty',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`replenishQty`, {
                initialValue: val,
              })(
                <InputNumber min={0} precision={6} max={record.replenishQty} />
              )}
            </Form.Item>
          ) : (
          val
        ),
      },
      {
        title: '单位',
        width: 100,
        dataIndex: 'uomCode',
        render: (val, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`uomCode`, {
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
        title: '仓库库存',
        width: 100,
        dataIndex: 'inventoryQty',
        render: (val, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`inventoryQty`, {
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
        title: '线边库存',
        width: 100,
        dataIndex: 'inStockQty',
        render: (val, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`inStockQty`, {
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
        title: '备注',
        width: 100,
        dataIndex: 'remark',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`remark`, {
                initialValue: val,
              })(
                <Input />
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
        render: (val, record, index) => {
          return (
            <span className="action-link">
              {!['create', 'update'].includes(record._status) && (
                <a onClick={() => onEditLine(record, true)}>
                  {intl.get('hzero.common.button.edit').d('编辑')}
                </a>
              )}
              {record._status === 'update' && (
                <a onClick={() => onEditLine(record, false)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
              )}
              {record.substituteAllowedFlag && !['create', 'update'].includes(record._status) && (
                <a onClick={() => onReplaceMaintain(record, index)}>
                  替代维护
                </a>
              )}
              {['create', 'update'].includes(record._status) && (
                <a onClick={() => onSave(record, true)}>
                  {intl.get('hzero.common.button.save').d('保存')}
                </a>
              )}
              {['create'].includes(record._status) && !record.substituteAllowedFlag && (
                <a onClick={() => onClearLine(record)}>
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
        title='补料单创建'
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
              onClick={() => onSaveReplenishmentList()}
              loading={loading}
            >
              补料单创建
            </Button>
          </Fragment>
        )}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        placement="right"
        maskClosable
      >
        <Form>
          <Row>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label='产线'
              >
                {getFieldDecorator('productionLine', {
                  initialValue: replenishmentInfo.productionLine,
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label='工段'
              >
                {getFieldDecorator('workCell', {
                  initialValue: replenishmentInfo.workCell,
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label='需求时间'
              >
                {getFieldDecorator('demandTime', {
                  initialValue: moment(),
                })(
                  <DatePicker
                    placeholder=""
                    style={{ width: '100%' }}
                    showTime
                    format={getDateTimeFormat()}
                    disabledDate={currentDate =>
                      moment().isAfter(currentDate, 'second')
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label='产线描述'
              >
                {getFieldDecorator('productionLineName', {
                  initialValue: replenishmentInfo.productionLineName,
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label='工段描述'
              >
                {getFieldDecorator('workCellName', {
                  initialValue: replenishmentInfo.workCellName,
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label='备注'
              >
                {getFieldDecorator('remark', {
                  initialValue: replenishmentInfo.remark,
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <EditTable
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          onChange={page => this.handleSearch(page)}
          loading={loading}
          rowKey="keyId"
        />
      </Modal>
    );
  }
}
