/*
 * @Description: 芯片位置信息输入
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-12 09:53:45
 * @LastEditTime: 2020-08-12 10:29:43
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import EditTable from 'components/EditTable';
import { Form, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

@connect(({ incomingMaterialEntry }) => ({
  incomingMaterialEntry,
}))
export default class PositionTable extends Component {
  HandoverMatterForm;

  @Bind()
  handleFetchWorkCellInfo(value, record) {
    const { saveLineData } = this.props;
    saveLineData({...record, hotSinkCode: value });
  }

  render() {
    const columns = [
      {
        title: '位置',
        dataIndex: 'worker',
      },
      {
        title: '热沉编号',
        dataIndex: 'hotSinkCode',
        width: 90,
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`hotSinkCode`, {
                initialValue: record.hotSinkCode,
              })(
                <Input className='code-input' onPressEnter={e => this.handleFetchWorkCellInfo(e.target.value, record)} style={{border: 'none'}} />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
    ];
    const { item = {} } = this.props;
    const { list = [] } = item;
    return (
      <EditTable
        bordered
        rowKey="letterId"
        pagination={{pageSize: 9999999}}
        columns={columns}
        scroll={{ y: 250 }}
        dataSource={list}
      />
    );
  }
}
