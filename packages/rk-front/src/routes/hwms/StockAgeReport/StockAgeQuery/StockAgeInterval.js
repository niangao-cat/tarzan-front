/*
 * @Description: 库龄区间
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-11-18 11:23:36
 * @LastEditTime: 2020-11-18 22:18:02
 */

import React, { Component } from 'react';
import { Modal, Form, InputNumber, Button, Popconfirm } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { closeTab } from 'utils/menuTab';
import EditTable from 'components/EditTable';

@Form.create({ fieldNameProp: null })
export default class StockAgeInterval extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }



  // 输入工位并回车
  @Bind()
  enterSite() {
    const { enterSite, form } = this.props;
    if (enterSite) {
      form.validateFields((err, values) => {
        if (!err) {
          // 如果验证成功,则执行enterSite
          enterSite(values);
        }
      });
    }
  }

  // 关闭输入框
  @Bind()
  handleCloseTab() {
    const { closePath } = this.props;
    closeTab(closePath);
  }

  render() {
    const {
      loading,
      visible,
      handleCreateInterval,
      deleteIntervalData,
      dataSource,
      handleStockAge,
      handleSaveIntervalData,
    } = this.props;
    const columns = [
      {
        title: (
          <Button
            style={{ backgroundColor: '#548FFC', color: '#fff' }}
            icon="plus"
            shape="circle"
            size="small"
            onClick={() => handleCreateInterval()}
          />
        ),
        align: 'center',
        width: 60,
        render: (val, record, index) => (
          <Popconfirm
            title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
            onConfirm={() => deleteIntervalData(record, index)}
          >
            <Button icon="minus" shape="circle" size="small" />
          </Popconfirm>
        ),
      },
      {
        title: '区间从',
        dataIndex: 'from',
        align: 'left',
        width: 100,
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`from`, {
                initialValue: record.from,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '区间从',
                    }),
                  },
                  {
                    validator: (rule, value, callback) => {
                      if (value&&record.$form.getFieldValue('to')&&value >= record.$form.getFieldValue('to')) {
                        callback(
                          '区间从应小于区间至！'
                        );
                      }
                      callback();
                    },
                  },
                ],
              })(
                <InputNumber
                  min={1}
                  formatter={value => `${value}`}
                  parser={value => value.replace(/\D|^-/g, '')}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '区间至',
        dataIndex: 'to',
        align: 'left',
        width: 100,
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`to`, {
                initialValue: record.to,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '区间至',
                    }),
                  },
                  {
                    validator: (rule, value, callback) => {
                      if (value&&record.$form.getFieldValue('to')&&value <= record.$form.getFieldValue('from')) {
                        callback(
                          '区间至应大于区间从！'
                        );
                      }
                      callback();
                    },
                  },
                ],
              })(
                <InputNumber
                  min={1}
                  formatter={value => `${value}`}
                  parser={value => value.replace(/\D|^-/g, '')}
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
        destroyOnClose
        width={400}
        title='设置库龄区间'
        visible={visible}
        onCancel={() => handleStockAge(false)}
        onOk={() => handleSaveIntervalData()}
      >
        <EditTable
          bordered
          rowKey="rowId"
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          pagination={false}
        />
      </Modal>
    );
  }
}
