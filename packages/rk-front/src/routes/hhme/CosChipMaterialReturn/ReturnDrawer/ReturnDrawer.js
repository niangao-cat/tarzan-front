/*
 * @Description: 退料
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-12-11 14:02:08
 * @LastEditTime: 2020-12-15 17:32:06
 */

import React, { PureComponent } from 'react';
import { Form, Input, Modal, Row, Col, Button, Table, Card } from 'hzero-ui';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import {
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DETAIL_CARD_TABLE_CLASSNAME,
} from 'utils/constants';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

@Form.create({ fieldNameProp: null })
export default class ReturnDrawer extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    const { form, handleFormReset } = this.props;
    form.resetFields();
    handleFormReset();
  }

  @Bind()
  onEnterDown(e) {
    const { form, scaneReturnBarCode } = this.props;
    if (e.keyCode === 13) {
      if (scaneReturnBarCode) {
        scaneReturnBarCode(form.getFieldsValue());
      }
    }
  }

  @Bind()
  onEnterTargetDown(e) {
    const { form, scaneTargetBarCode } = this.props;
    if (e.keyCode === 13) {
      if (scaneTargetBarCode) {
        scaneTargetBarCode(form.getFieldsValue());
      }
    }
  }

  @Bind()
  handleReturnConfirm() {
    const { handleReturnConfirm, form } = this.props;
    if (handleReturnConfirm) {
      form.validateFields((err, values) => {
        if (!err) {
          handleReturnConfirm(values);
        }
      });
    }
  }

  render() {
    const {
      form,
      saveLoading,
      visible,
      selectedRows,
      onSelectRow,
      record,
      dataSource,
      dataSourceList,
      dataSourceSinkList,
      handleDelete,
      loading,
      handleReturnConfirmLoading,
      onCancel,
      handlePrinting,
      printingBarcodeLoading,
      barCodeList,
      workcellInfo,
      tipText,
      returnDataSource,
      onSelectAllRows,
    } = this.props;
    const { getFieldDecorator } = form;
    const columns = [
      {
        title: '序号',
        width: 70,
        dataIndex: 'instructionLineNum',
        render: (val, _record, index) => index + 1,
      },
      {
        title: '条码',
        width: 120,
        dataIndex: 'materialLotCode',
      },
      {
        title: '物料编码',
        width: 100,
        dataIndex: 'materialCode',
      },
      {
        title: '物料描述',
        width: 100,
        dataIndex: 'materialName',
      },
      {
        title: '数量',
        width: 80,
        dataIndex: 'qty',
      },
      {
        title: 'Wafer',
        width: 100,
        dataIndex: 'waferNum',
      },
    ];
    const tipColumns = [
      {
        title: '序号',
        width: 70,
        dataIndex: 'instructionLineNum',
        render: (val, _record, index) => index + 1,
      },
      {
        title: '物料编码',
        width: 100,
        dataIndex: 'materialCode',
      },
      {
        title: '物料描述',
        width: 100,
        dataIndex: 'materialName',
      },
      {
        title: '单位',
        width: 60,
        dataIndex: 'uomCode',
      },
      {
        title: '单位用量',
        width: 80,
        dataIndex: 'usageQty',
      },
      {
        title: '可退料数量',
        width: 100,
        dataIndex: 'availableQty',
      },
      {
        title: '供应商',
        width: 100,
        dataIndex: 'supplierCode',
      },
      {
        title: '供应商批次',
        width: 100,
        dataIndex: 'supplierLot',
      },
      {
        title: '退料数量',
        width: 100,
        dataIndex: 'returnQty',
      },
      {
        title: '目标条码',
        width: 100,
        dataIndex: 'targetMaterialLot',
      },
    ];
    const returnColumns = [
      {
        title: '序号',
        width: 70,
        dataIndex: 'instructionLineNum',
        render: (val, _record, index) => index + 1,
      },
      {
        title: '物料编码',
        width: 100,
        dataIndex: 'materialCode',
      },
      {
        title: '物料描述',
        width: 100,
        dataIndex: 'materialName',
      },
      {
        title: '单位',
        width: 60,
        dataIndex: 'uomCode',
      },
      {
        title: '单位用量',
        width: 80,
        dataIndex: 'usageQty',
      },
      {
        title: '可退料数量',
        width: 100,
        dataIndex: 'availableQty',
      },
      {
        title: '退料数量',
        width: 100,
        dataIndex: 'returnQty',
      },
      {
        title: '目标条码',
        width: 100,
        dataIndex: 'targetMaterialLot',
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={1230}
        title='COS芯片退料'
        visible={visible}
        confirmLoading={saveLoading}
        onCancel={() => onCancel({}, false)}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        footer={null}
      >
        <Form>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='退料条码'>
                {getFieldDecorator('materialLotCode', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`fromSiteCode`).d('退料条码'),
                      }),
                    },
                  ],
                })(
                  <Input disabled={!form.getFieldValue('ncCode')} onKeyDown={this.onEnterDown} />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='物料编码'>
                {getFieldDecorator('materialCode', {
                  initialValue: record.materialCode,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='物料描述'>
                {getFieldDecorator('materialName', {
                  initialValue: record.materialName,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item>
                <Button
                  type="primary"
                  onClick={() => this.handleReturnConfirm()}
                  loading={handleReturnConfirmLoading}
                >
                  确认
                </Button>
                <Button
                  onClick={() => handleDelete()}
                  style={{ marginLeft: '8px' }}
                >
                  删除
                </Button>
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='退料数量'>
                {getFieldDecorator('returnQty1', {
                  initialValue: barCodeList.reduce((qtySum, currBarCodeList) => {
                    return qtySum + currBarCodeList.qty;
                  }, 0),
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='可退料数量'>
                {getFieldDecorator('returnQty', {
                  initialValue: record.returnQty,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='目标条码'>
                {getFieldDecorator('targetMaterialLotCode', {
                  initialValue: record.targetMaterialLotCode,
                })(<Input onKeyDown={this.onEnterTargetDown} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item>
                <Button
                  type="primary"
                  onClick={() => handlePrinting()}
                  disabled={((record ? (!record.targetMaterialLotId) : true) && (dataSource ? (dataSource.length > 0 ? (!(dataSource.filter(item => item.targetMaterialLotId).length > 0)) : true) : true) && (dataSourceList ? (dataSourceList.length > 0 ? (!(dataSourceList.filter(item => item.targetMaterialLotId).length > 0)) : true) : true) && (dataSourceSinkList ? (dataSourceSinkList.length > 0 ? (!(dataSourceSinkList.filter(item => item.targetMaterialLotId).length > 0)) : true) : true))}
                  loading={printingBarcodeLoading}
                >
                  打印
                </Button>
                <Button
                  onClick={() => this.handleFormReset()}
                  style={{ marginLeft: '8px' }}
                >
                  清空
                </Button>
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='不良代码'>
                {getFieldDecorator('ncCode', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`ncCode`).d('不良代码'),
                      }),
                    },
                  ],
                })(
                  <Lov
                    code="HME.WORKCELL_NC_CODE"
                    queryParams={{ tenantId, workcellId: workcellInfo.workcellId }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Card
          key="code-rule-header"
          title='条码'
          bordered={false}
          className={DETAIL_CARD_TABLE_CLASSNAME}
        >
          <Table
            bordered
            rowKey="materialId"
            dataSource={dataSource}
            pagination={false}
            columns={columns}
            loading={loading}
            rowSelection={{
              columnWidth: 50,
              selectedRowKeys: selectedRows.map(e => e.materialId),
              onSelect: onSelectRow,
              onSelectAll: (selected) => onSelectAllRows(selected, dataSource),
            }}
          />
        </Card>
        {['WIRE_BOND', 'HOT_SINK'].includes(tipText) && (
          <Card
            key="code-rule-header"
            title='芯片退料信息'
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
          >
            <Table
              bordered
              rowKey="materialId"
              dataSource={returnDataSource}
              pagination={false}
              columns={returnColumns}
              loading={loading}
              rowSelection={{
                columnWidth: 50,
                selectedRowKeys: selectedRows.map(e => e.materialId),
                onSelect: onSelectRow,
                onSelectAll: (selected) => onSelectAllRows(selected, returnDataSource),
              }}
            />
          </Card>
        )}
        {(tipText === "HOT_SINK" || tipText === "WIRE_BOND") && (
          <Card
            key="code-rule-header"
            title='热沉退料信息'
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
          >
            <Table
              bordered
              rowKey="materialId"
              dataSource={dataSourceList}
              pagination={false}
              columns={tipColumns}
              loading={loading}
              rowSelection={{
                columnWidth: 50,
                selectedRowKeys: selectedRows.map(e => e.materialId),
                onSelect: onSelectRow,
                onSelectAll: (selected) => onSelectAllRows(selected, dataSourceList),
              }}
            />
          </Card>
        )}
        {tipText === "WIRE_BOND" && (
          <Card
            key="code-rule-header"
            title='金线退料信息'
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
          >
            <Table
              bordered
              rowKey="materialId"
              dataSource={dataSourceSinkList}
              pagination={false}
              columns={tipColumns}
              loading={loading}
              rowSelection={{
                columnWidth: 50,
                selectedRowKeys: selectedRows.map(e => e.materialId),
                onSelect: onSelectRow,
                onSelectAll: (selected) => onSelectAllRows(selected, dataSourceSinkList),
              }}
            />
          </Card>
        )}
      </Modal>
    );
  }
}
