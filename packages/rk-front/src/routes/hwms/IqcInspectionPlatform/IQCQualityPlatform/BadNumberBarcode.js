/*
 * @Description: 条码不良数
 * @version: 0.1.0
 * @Author: xinyu.wang02@hand-china.com
 * @Date: 2020-03-18 17:50:26
 * @LastEditorts: xinyu.wang02@hand-china.com
 * @LastEditTime: 2020-09-14 18:36:57
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Modal, Form, Spin, Input, Popconfirm, Button, InputNumber } from 'hzero-ui';
import { connect } from 'dva';
import EditTable from 'components/EditTable';
import intl from 'utils/intl';
@connect(({ iqcInspectionPlatform, loading }) => ({
  iqcInspectionPlatform,
  fetchLoading: loading.effects['iqcInspectionPlatform/queryBadNumberBarcode'],
  saveBadNumberBarcodeLoading: loading.effects['iqcInspectionPlatform/saveBadNumberBarcode'],
  deleteBadNumberBarcodeLoading: loading.effects['iqcInspectionPlatform/deleteBadNumberBarcode'],
}))
@Form.create({ fieldNameProp: null })
export default class BadNumberBarcode extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const { badNumberBarcodeFlag, onBadNumberBarcodeCancel, badNumberBarcodeChange,
      dataSource, pagination, fetchLoading, saveBadNumberBarcodeLoading, deleteBadNumberBarcodeLoading,
      handleBadNumberBarcodeDelete,
      changeBarcodeValue,
      changeNcQty,
      handleBarcodeEnter,
      onBadNumberBarcodeSave,
      handleBadNumberBarcodeCreate,
    } = this.props;

    const columns = [
      {
        title: (
          <Button
            style={{ backgroundColor: '#548FFC', color: '#fff' }}
            icon="plus"
            shape="circle"
            size="small"
            onClick={handleBadNumberBarcodeCreate}
          />
        ),
        align: 'center',
        width: 60,
        render: (val, record, index) => (
          <Popconfirm
            title="是否确认删除?"
            onConfirm={() => handleBadNumberBarcodeDelete(record, index)}
          >
            <Button icon="minus" shape="circle" size="small" />
          </Popconfirm>
        ),
      },
      {
        title: '条码',
        width: 70,
        dataIndex: 'materialLotCode',
        align: 'center',
        render: (val, record, index) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator(`materialLotCode`, {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '条码',
                  }),
                },
              ],
              initialValue: record.materialLotCode,
            })(
              <Input
                disabled={record._status === 'update'}
                defaultValue={val}
                onChange={vals => changeBarcodeValue(vals, index, record)}
                style={{ width: '100%' }}
                className='code-input'
                onPressEnter={e => {
                handleBarcodeEnter(e, index, record);
              }}
              />
            )}
          </Form.Item>
        ) : (
            val
          ),
      },
      {
        title: '不良数量',
        width: 70,
        dataIndex: 'ncQty',
        align: 'center',
        render: (val, record, index) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator(`ncQty`, {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '不良数量',
                  }),
                },
              ],
              initialValue: record.ncQty,
            })(
              <InputNumber
                defaultValue={val}
                onChange={vals => changeNcQty(vals, index, record)}
                style={{ width: '100%' }}
                min={1}
              />
            )}
          </Form.Item>
        ) : (
            val
          ),
      },
    ];

    return (
      <Modal
        title='条码不良数'
        confirmLoading={false}
        width={600}
        visible={badNumberBarcodeFlag}
        onOk={onBadNumberBarcodeSave}
        onCancel={onBadNumberBarcodeCancel}
        okText='保存'
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Spin spinning={saveBadNumberBarcodeLoading || deleteBadNumberBarcodeLoading || false}>
          <EditTable
            loading={fetchLoading}
            rowKey="actualDetailId"
            dataSource={dataSource}
            columns={columns}
            pagination={pagination}
            onChange={page => badNumberBarcodeChange(page)}
            footer={null}
            bordered
          />
        </Spin>
      </Modal>
    );
  }
}
