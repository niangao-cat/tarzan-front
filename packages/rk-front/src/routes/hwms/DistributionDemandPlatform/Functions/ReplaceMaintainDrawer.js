/*
 * @Description: 替代维护
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-31 16:03:05
 * @LastEditTime: 2020-10-19 20:39:34
 */

import React, { Component, Fragment } from 'react';
import { Form, Modal, InputNumber, Input } from 'hzero-ui';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import EditTable from 'components/EditTable';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';

@Form.create({ fieldNameProp: null })
export default class ReplaceMaintainDrawer extends Component {

  @Bind()
  handleOK() {
    const { onSave } = this.props;
    if (onSave) {
      onSave();
    }
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const {
      tenantId,
      saveLoading,
      visible,
      onCancel,
      replaceMaintain,
      handleCleanLine,
      handleEditLine,
      dataSource,
      materialInfo,
      loading,
      handleDeleteRecord,
    } = this.props;
    const columns = [
      {
        title: '行号',
        dataIndex: 'lineNum',
        width: 80,
        align: 'center',
      },
      {
        title: '工单号',
        dataIndex: 'workOrderNum',
        width: 150,
      },
      {
        title: '配送单号',
        dataIndex: 'instructionDocNum',
        width: 150,
      },
      {
        title: '配送单行号',
        dataIndex: 'instructionLineNum',
        width: 100,
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 100,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
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
                    code="WMS.MATERIAL_SUBSTITUTE"
                    queryParams={{
                      tenantId,
                      siteId: materialInfo.siteId,
                      materialId: materialInfo.materialId,
                      workOrderId: record.workOrderId,
                    }}
                    onChange={(value, data) => {
                      record.$form.setFieldsValue({ materialCode: data.materialCode });
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
        dataIndex: 'materialVersion',
        width: 100,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialVersion`, {
                initialValue: val,
              })(<Input />)}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '主键需求数',
        dataIndex: 'componentDemandQty',
        width: 100,
      },
      {
        title: '标准用量',
        dataIndex: 'usageQty',
        width: 100,
      },
      {
        title: '损耗率(%)',
        width: 100,
        dataIndex: 'attritionChance',
      },
      {
        title: '需求数量',
        dataIndex: 'requirementQty',
        width: 100,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`requirementQty`, {
                initialValue: val,
              })(
                <InputNumber min={0} style={{width: '100%'}} />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '来源行号',
        dataIndex: 'sourceLineNum',
        width: 90,
        align: 'center',
      },
      {
        title: '是否全局替代',
        dataIndex: 'operator',
        align: 'center',
        fixed: 'right',
        width: 130,
        render: (val, record, index) => {
          return (
            <span className="action-link">
              {!(record._status === 'create') && !(record._status === 'update') && record.substituteFlag === 'N' && (
                !record.instructionDocNum && (
                  <a onClick={() => replaceMaintain(record, index)}>
                    替代维护
                  </a>
                )
              )}
              {record.substituteFlag === 'Y' && isEmpty(record._status) && (
                <span>
                  {!record.instructionDocNum && (
                    <a onClick={() => handleEditLine(record, true)}>
                      {intl.get('hzero.common.button.edit').d('编辑')}
                    </a>
                  )}
                  <a onClick={() => handleDeleteRecord(record)} disabled={record.instructionDocNum}>
                    {intl.get('hzero.common.button.delete').d('删除')}
                  </a>
                </span>
              )}
              {record.substituteFlag === 'Y' && record._status === 'update' && (
                <a onClick={() => handleEditLine(record, false)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
              )}
              {['create'].includes(record._status) && (
                <Fragment>
                  <a onClick={() => handleCleanLine(record)}>
                    {intl.get('hzero.common.button.cancel').d('取消')}
                  </a>
                </Fragment>
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
        title='替代维护'
        visible={visible}
        confirmLoading={saveLoading}
        okText={intl.get('hzero.common.button.sure').d('确认')}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
        onCancel={() => onCancel(false)}
        onOk={this.handleOK}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <EditTable
          bordered
          loading={loading}
          rowKey="tagGroupAssignId"
          columns={columns}
          // scroll={{ x: tableScrollWidth(columns) }}
          dataSource={dataSource}
          pagination={false}
          onChange={this.refresh}
        />
      </Modal>
    );
  }
}
