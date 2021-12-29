import React, { PureComponent } from 'react';
import { Form, Modal, Checkbox, InputNumber } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import EditTable from 'components/EditTable';
import { isFunction } from 'lodash';
import { limitDecimals } from '@/utils/utils';
import {
  tableScrollWidth,
} from 'utils/utils';
// import Lov from 'components/Lov';

@Form.create({ fieldNameProp: null })
export default class ApplicationDrawer extends PureComponent {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
  }

  @Bind()
  handleOK() {
    const { handleOK } = this.props;
    if (handleOK) {
      handleOK();
    }
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      visible,
      dataSource,
      onCancel,
    } = this.props;
    const columns = [
      {
        title: '物料料号',
        dataIndex: 'materialCode',
        width: 120,
      },
      {
        title: '物料描述',
        dataIndex: 'materialName',
        width: 100,
      },
      {
        title: '条码号',
        dataIndex: 'materialLotCode',
        width: 120,
      },
      {
        title: '批次',
        dataIndex: 'lot',
        width: 80,
      },
      {
        title: '投入',
        dataIndex: 'releaseQty',
        width: 80,
        align: 'center',
      },
      {
        title: '申请',
        dataIndex: 'applyQty',
        width: 80,
        render: (val, record) => (
          <Form.Item>
            {record.$form.getFieldDecorator(`applyQty`, {
              initialValue: record.applyQty,
              rules: [
                {
                  validator: (rule, value, callback) => {
                    if (record.releaseQty < value || value === 0) {
                      callback(
                        value === 0 ? '不可为0' : '申请数应小于等于投入数量'
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
                style={{ width: '100%' }}
              />
            )}
          </Form.Item>
        ),
      },
      {
        title: '不退料标识',
        dataIndex: 'noReturnMaterialFlag',
        width: 80,
        align: 'center',
        render: (val, record) => (
          <Form.Item>
            {record.$form.getFieldDecorator(`noReturnMaterialFlag`, {
              initialValue: record.noReturnMaterialFlag,
            })(
              <Checkbox checkedValue='Y' unCheckedValue='N' disabled={!record.$form.getFieldValue('applyQty')} />
            )}
          </Form.Item>
        ),
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={1280}
        title="物料"
        visible={visible}
        okText={intl.get('hzero.common.button.sure').d('确认')}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
        onCancel={() => onCancel(false, {}, '')}
        onOk={() => this.handleOK()}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <EditTable
          bordered
          rowKey="id"
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ x: tableScrollWidth(columns) }}
        />
      </Modal>
    );
  }
}
