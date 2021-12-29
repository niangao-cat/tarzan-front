/**
 * 计划外投料
 * @date: 2020/07/15 19:25:36
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component, Fragment } from 'react';
import { Button, Modal, Form, InputNumber, Input, Checkbox } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';
import { tableScrollWidth } from 'utils/utils';

import styles from './index.less';

const prefixModel = `scon.contractChange.model.businessCondition`;

export default class MaterialModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
    };
  }

  /**
   * 批量删除
   *
   * @memberof ElevatorInfo
   */
  @Bind()
  handleDelete() {
    const { onDelete } = this.props;
    const { selectedRows } = this.state;
    if (onDelete) {
      onDelete(selectedRows, 'outOfPlanMaterialList', 'bydMaterialId', 'deleteMaterialList');
    }
  }

  /**
   * 校验并缓存当前数据
   *
   * @memberof ElevatorInfo
   */
  @Bind()
  handleSave() {
    const { onSave } = this.props;
    if(onSave) {
      onSave();
    }
  }

  /**
   * 清除当前行
   *
   * @param {string} dataSourceName 数据源名称
   * @param {string} idName 主键名称id
   * @param {object} record 当前行数据
   * @memberof ElevatorInfo
   */
  @Bind()
  handleCleanLine(record) {
    const { onCleanLine } = this.props;
    if (onCleanLine) {
      onCleanLine('outOfPlanMaterialList', 'bydMaterialId', record);
    }
  }

  /**
   * 编辑当前行
   *
   * @param {string} dataSourceName 数据源名称
   * @param {string} idName 主键id名称
   * @param {object} record 当前行数据
   * @param {boolean} flag 编辑当前行 / 取消编辑
   * @memberof ElevatorInfo
   */
  @Bind()
  handleEditLine(record, flag) {
    const { onEditLine } = this.props;
    if (onEditLine) {
      onEditLine('outOfPlanMaterialList', 'bydMaterialId', record, flag);
    }
  }

  /**
   * 新建
   *
   * @memberof ElevatorInfo
   */
  @Bind()
  handleCreate() {
    const { onCreate } = this.props;
    if (onCreate) {
      onCreate('outOfPlanMaterialList', 'bydMaterialId');
    }
  }

  @Bind()
  handleCloseModal() {
    const { onCloseModal } = this.props;
    if(onCloseModal) {
      onCloseModal();
    }
  }

  render() {
    const { dataSource = [], visible, userId } = this.props;
    const { selectedRows } = this.state;
    const rowSelection = {
      selectedRowKeys: selectedRows.map(e => e.bydMaterialId),
      onChange: (keys, records) => {
        this.setState({ selectedRows: records });
      },
    };
    const columns = [
      {
        title: intl.get(`${prefixModel}.orderSeq`).d('序号'),
        width: 40,
        dataIndex: 'orderSeq',
        render: (text, record, index) => {
          return index + 1;
        },
      },
      {
        title: intl.get(`${prefixModel}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
        width: 120,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('materialId', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefixModel}.date.materialCode`).d('物料编码'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="WMS_PERMISSION_MATERIAL"
                  queryParams={{ userId }}
                  textValue={record.materialCode}
                  onChange={(val, data) => {
                    record.$form.setFieldsValue({
                      materialCode: data.materialCode,
                      materialName: data.materialName,
                      lotType: data.lotType,
                      availableTime: data.availableTime,
                    });
                  }}
                />
              )}
            </Form.Item>
          ) : (
            record.materialCode
          ),
      },
      {
        title: intl.get(`${prefixModel}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 120,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Fragment>
              <Form.Item>
                {record.$form.getFieldDecorator('materialName', {
                  initialValue: value,
                })(<Input disabled />)}
              </Form.Item>
              <Form.Item style={{ display: 'none'}}>
                {record.$form.getFieldDecorator('materialCode', {
                  initialValue: value,
                })(<Input disabled />)}
              </Form.Item>
              <Form.Item style={{ display: 'none'}}>
                {record.$form.getFieldDecorator('lotType', {
                  initialValue: value,
                })(<Input disabled />)}
              </Form.Item>
              <Form.Item style={{ display: 'none'}}>
                {record.$form.getFieldDecorator('availableTime', {
                  initialValue: value,
                })(<Input disabled />)}
              </Form.Item>
            </Fragment>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${prefixModel}.unitQty`).d('单位用量'),
        dataIndex: 'unitQty',
        width: 100,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('unitQty', {
                initialValue: value,
                rules: [
                  {
                    required: record.$form.getFieldValue('elevatorType') === 'FREIGHT_ELEVATOR',
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefixModel}.date.loadWeight`).d('单位用量'),
                    }),
                  },
                ],
              })(
                <InputNumber
                  min={0}
                  precision={3}
                  style={{
                    width: '100%',
                  }}
                />
              )}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${prefixModel}.assembleLocation`).d('装配位置'),
        dataIndex: 'assembleLocation',
        width: 100,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('assembleLocation', {
                initialValue: value,
              })(<Input />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${prefixModel}.isBeyond`).d('计划外投料标志'),
        dataIndex: 'isBeyond',
        width: 120,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('isBeyond', {
                initialValue: value !== 'N',
              })(
                <Checkbox />
              )}
            </Form.Item>
          ) : (
            <Checkbox checked={value === 'Y'} />
          ),
      },
      {
        title: intl.get(`${prefixModel}.remark`).d('备注'),
        dataIndex: 'remark',
        width: 80,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('remark', {
                initialValue: value,
              })(<Input />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: '',
        width: 60,
        align: 'center',
        render: (value, record) =>
          record._status === 'create' ? (
            <a onClick={() => this.handleCleanLine(record)}>
              {intl.get('hzero.common.button.clean').d('清除')}
            </a>
          ) : record._status === 'update' ? (
            <a onClick={() => this.handleEditLine(record, false)}>
              {intl.get('hzero.common.button.cancel').d('取消')}
            </a>
          ) : (
            <a onClick={() => this.handleEditLine( record, true)}>
              {intl.get('hzero.common.button.edit').d('编辑')}
            </a>
          ),
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={1000}
        title={intl.get('hhme.singleOperationPlatform.view.message.title').d('计划外投料')}
        visible={visible}
        onCancel={this.handleCloseModal}
        onOk={this.handleSave}
      >
        <Fragment>
          <Button
            type="primary"
            style={{
                marginRight: 8,
                marginBottom: 12,
              }}
            onClick={this.handleCreate}
          >
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button
            style={{
                marginRight: 8,
                marginBottom: 12,
              }}
            onClick={this.handleDelete}
          >
            {intl.get('hzero.common.button.delete').d('删除')}
          </Button>
        </Fragment>
        <div className={styles['head-table']}>
          <EditTable
            scroll={{
                x: tableScrollWidth(columns),
              }}
            bordered
            rowSelection={rowSelection}
            columns={columns}
            rowKey='bydMaterialId'
            dataSource={dataSource}
            pagination={false}
          />
        </div>
      </Modal>
    );
  }
}
