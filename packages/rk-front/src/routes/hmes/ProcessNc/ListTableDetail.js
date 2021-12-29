/*
 * @Description: 行明细数据
 * @Version: 0.0.1
 * @Autor: li.zhang13@hand-china.com
 * @Date: 2021-01-21 09:36:44
 */
import React, { Component } from 'react';
import { Button, Popconfirm, Form, Input } from 'hzero-ui';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import EditTable from 'components/EditTable';
import { connect } from 'dva';
import formatterCollections from 'utils/intl/formatterCollections';

@connect(({ equipmentInspectionMaintenance }) => ({
  equipmentInspectionMaintenance,
}))
@formatterCollections({ code: 'hwms.barcodeQuery' })
class ListTableDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  /**
   * 页面渲染
   * @returns {*}
   */
  render() {
    const {
        tenantId,
        loading,
        dataSource,
        onSearch,
        pagination,
        canEdit,
        handleCreateDetail,
        deleteDetailData,
        handleEditDetail,
        deleteDetailDataLoading,
        selectedLine,
        handleSaveDetail,
    } = this.props;
    const columns = [
      {
        title: (
          <Button
            style={{ backgroundColor: '#548FFC', color: '#fff' }}
            icon="plus"
            shape="circle"
            size="small"
            disabled={selectedLine.length === 0}
            onClick={() => handleCreateDetail()}
          />
        ),
        align: 'center',
        width: 60,
        render: (val, record, index) =>
          !canEdit ? (
            <Button icon="minus" shape="circle" size="small" />
          ) : (
            <Popconfirm
              title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
              onConfirm={() => deleteDetailData(record, index)}
            >
              <Button loading={deleteDetailDataLoading} icon="minus" shape="circle" size="small" />
            </Popconfirm>
            ),
      },
      {
        title: '最小值',
        dataIndex: 'minValue',
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`minValue`, {
                initialValue: record.minValue,
              })(
                <Input />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '最大值',
        dataIndex: 'maxValue',
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`maxValue`, {
                initialValue: record.maxValue,
              })(
                <Input />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '不良代码',
        dataIndex: 'ncCode',
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <span>
              <Form.Item>
                {record.$form.getFieldDecorator(`ncCodeId`, {
                  initialValue: record.ncCodeId,
                })(
                  <Lov
                    code="MT.NC_CODE"
                    queryParams={{ tenantId }}
                    textValue={record.ncCode}
                  />
                )}
              </Form.Item>
            </span>
          ) : (
              val
            ),
      },
      {
        title: '标准编码',
        dataIndex: 'standardCode',
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`standardCode`, {
                initialValue: record.standardCode,
              })(
                <Input />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        align: 'center',
        render: (val, record, index) =>
          record._status === 'create' ? (
            <span>
              <a onClick={() => deleteDetailData(record, index)}>清除</a>&nbsp;&nbsp;
              <a onClick={() => handleSaveDetail(record, index)}>保存</a>
            </span>
          ) : record._status === 'update' ? (
            <span>
              <a onClick={() => handleEditDetail(record, false)}>取消</a>&nbsp;&nbsp;
              <a onClick={() => handleSaveDetail(record, index)}>保存</a>
            </span>
          ) : (
            <a onClick={() => handleEditDetail(record, true)}>编辑</a>
              ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="detailId"
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default ListTableDetail;
