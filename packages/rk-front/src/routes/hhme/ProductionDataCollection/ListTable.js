/*
 * @Description: 数据采集table
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-16 12:34:13
 * @LastEditTime: 2020-07-20 20:10:59
 */
import React, { Component } from 'react';
import { Form, InputNumber, Input } from 'hzero-ui';
import EditTable from 'components/EditTable';
import { Bind } from 'lodash-decorators';
import Lov from 'components/Lov';

@Form.create({ fieldNameProp: null })
class ListTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 结果回车
  @Bind()
  saveResult(e, value, record) {
    const { updateLineResult } = this.props;
    if (e.keyCode === 13) {
      updateLineResult(value, record, 'RESULT');
    }
  }

  /**
   * 页面渲染
   * @returns {*}
   */
  render() {
    const {
      fetchLoading,
      dataSource = [],
      tenantId,
      updateLineMaterial,
      headInfo = {},
    } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'enableFlagMeaning',
        width: 70,
        align: 'center',
        render: (val, record, index) => index + 1,
      },
      {
        title: '位置',
        dataIndex: 'referencePoint',
        width: 80,
        align: 'center',
      },
      {
        title: '数据项',
        dataIndex: 'tagDescription',
        width: 90,
        align: 'center',
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 90,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialId`, {
                initialValue: record.materialId,
              })(
                <Lov
                  code="MT.MATERIAL"
                  queryParams={{ tenantId }}
                  textValue={record.materialCode}
                  onChange={(value) => {
                    updateLineMaterial(value, record, 'MATERIAL');
                  }}
                  disabled={headInfo.siteOutDate}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '下限',
        dataIndex: 'minimumValue',
        width: 70,
        align: 'center',
      },
      {
        title: '标准值',
        dataIndex: 'standard',
        width: 80,
        align: 'center',
      },
      {
        title: '上限',
        dataIndex: 'maximalValue',
        width: 80,
        align: 'center',
      },
      {
        title: '结果',
        dataIndex: 'result',
        width: 70,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`result`, {
                initialValue: record.result,
              })(
                record.minimumValue && record.maximalValue ? (
                  <InputNumber
                    disabled={headInfo.siteOutDate}
                    style={{ width: '100%' }}
                    onKeyUp={e => this.saveResult(e, record.$form.getFieldValue('result'), record)}
                  />
                ) : (
                  <Input
                    disabled={headInfo.siteOutDate}
                    onKeyUp={e => this.saveResult(e, record.$form.getFieldValue('result'), record)}
                  />
                )
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="letterId"
        columns={columns}
        loading={fetchLoading}
        dataSource={dataSource}
        pagination={false}
      // onChange={page => onSearch(page)}
      // rowSelection={{
      //   type: 'radio',
      //   columnWidth: 15,
      //   selectedRowKeys,
      //   onChange: onSelectRow,
      // }}
      />
    );
  }
}
export default ListTable;
