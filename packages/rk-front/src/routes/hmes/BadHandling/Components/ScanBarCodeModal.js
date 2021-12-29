/*
 * @Description: 扫描条码模态框
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-01 13:58:51
 */

import React, { PureComponent } from 'react';
import { Form, Input, Modal, Button, Popconfirm, InputNumber, Checkbox } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import EditTable from 'components/EditTable';
import { isFunction } from 'lodash';
import { tableScrollWidth } from 'utils/utils';
import { limitDecimals } from '@/utils/utils';
// import Lov from 'components/Lov';

@Form.create({ fieldNameProp: null })
export default class ScanBarCodeModal extends PureComponent {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
  }

  /**
   * 查询
   */
  @Bind()
  handleSearch(fields = {}) {
    const { onSearch, form } = this.props;
    const fieldValues = form.getFieldsValue();
    if (onSearch) {
      form.validateFields(err => {
        if (!err) {
          // 如果验证成功,则执行onSearch
          onSearch({ ...fieldValues, page: fields });
        }
      });
    }
  }

  /**
   * 重置
   */
  @Bind()
  handleFormReset() {
    this.props.form.resetFields();
  }

  @Bind()
  onCancel() {
    const { onCancel } = this.props;
    onCancel(false, { materialLotCode: false });
  }

  // 扫描条码
  @Bind()
  enterBarCode(e, scanMaterialLotCode) {
    const { enterBarCode } = this.props;
    if (e.keyCode === 13) {
      enterBarCode(scanMaterialLotCode);
    }
  }

  @Bind()
  onOk() {
    const { saveBarCode } = this.props;
    saveBarCode();
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      visible,
      // tenantId,
      badChecklist = [],
      badChecklistPagination = {},
      deleteBarcode,
      onSearch,
      form,
      // handleEdit,
      // handleCleanLine,
      scanningType,
      saveHeadBarCodeLoading,
      saveLineBarCodeLoading,
      enterBarCodeHeadLoading,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    // console.log(badChecklist)
    const columns = [
      {
        title: '操作',
        align: 'center',
        width: 60,
        render: (val, record, index) => (
          <Popconfirm
            title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
            onConfirm={() => deleteBarcode(record, index)}
          >
            <Button icon="minus" shape="circle" size="small" />
          </Popconfirm>
        ),
      },
      {
        title: '条码号',
        dataIndex: 'materialLotCode',
        width: 120,
        align: 'center',
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 100,
        align: 'center',
      },
      {
        title: '物料描述',
        dataIndex: 'materialName',
        width: 100,
        align: 'center',
      },
      {
        title: '申请数量',
        dataIndex: 'applyQty',
        width: 80,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`applyQty`, {
                initialValue: record.applyQty,
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      if (record.primaryUomQty < value || value === 0) {
                        callback(
                          value === 0 ? '不可为0' : `申请数应小于等于 ${record.primaryUomQty}`
                        );
                      } else {
                        callback();
                      }
                    },
                  },
                ],
              })(
                <InputNumber
                  formatter={value => `${value}`}
                  parser={value => limitDecimals(value, 3)}
                  min={0}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '不退料标识',
        dataIndex: 'noReturnMaterialFlag',
        width: 80,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`noReturnMaterialFlag`, {
                initialValue: record.noReturnMaterialFlag,
              })(
                <Checkbox checkedValue='Y' unCheckedValue='N' disabled={!record.$form.getFieldValue('applyQty')} />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
    ];
    return (
      <Modal
        destroyOnClose
        title='扫描条码'
        visible={visible}
        onOk={() => this.onOk()}
        onCancel={() => this.onCancel()}
        okText={intl.get('hzero.common.button.save').d('保存')}
        cancelText='关闭'
        width={800}
        confirmLoading={scanningType === 'HEAD' ? saveHeadBarCodeLoading : saveLineBarCodeLoading}
      >
        <Form layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item label='条码号'>
            {getFieldDecorator('scanMaterialLotCode', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '条码号',
                  }),
                },
              ],
            })(<Input className='scaninput' onKeyUp={e => this.enterBarCode(e, getFieldValue('scanMaterialLotCode'))} />)}
          </Form.Item>
          <Form.Item>
            <Button data-code="reset" onClick={this.handleFormReset}>
              {intl.get('hzero.common.status.reset').d('重置')}
            </Button>
          </Form.Item>
        </Form>
        <EditTable
          bordered
          rowKey="id"
          columns={columns}
          loading={enterBarCodeHeadLoading}
          dataSource={badChecklist}
          pagination={badChecklistPagination}
          onChange={page => onSearch(page)}
          scroll={{ x: tableScrollWidth(columns) }}
        />
      </Modal>
    );
  }
}
