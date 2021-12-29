/*
 * @Description: 行数据
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
import { Bind } from 'lodash-decorators';
import formatterCollections from 'utils/intl/formatterCollections';

import styles from './index.less';

@connect(({ equipmentInspectionMaintenance }) => ({
  equipmentInspectionMaintenance,
}))
@formatterCollections({ code: 'hwms.barcodeQuery' })
class ListTableLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLine: {},
    };
  }

  @Bind()
  forHandleClickRow(record){
    const { selectedLine } = this.state;
    if (selectedLine !== '' && selectedLine.lineId === record.lineId) {
      return styles['data-click'];
    } else {
        return '';
    }
  }

  @Bind()
  handleDetailDate(fields = {}) {
    const { handleDetailDate } = this.props;
    this.setState({ selectedLine: fields });
    if(handleDetailDate) {
      handleDetailDate(fields);
    }
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
      handleCreate,
      deleteData,
      handleEditLine,
      deleteLineDataLoading,
      selectedHeadKeys,
      handleSaveLine,
    } = this.props;
    const columns = [
      {
        title: (
          <Button
            style={{ backgroundColor: '#548FFC', color: '#fff' }}
            icon="plus"
            shape="circle"
            size="small"
            disabled={selectedHeadKeys.length === 0}
            onClick={() => handleCreate()}
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
              onConfirm={() => deleteData(record, index)}
            >
              <Button loading={deleteLineDataLoading} icon="minus" shape="circle" size="small" />
            </Popconfirm>
            ),
      },
      {
        title: '数据项',
        dataIndex: 'tagCode',
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <span>
              <Form.Item>
                {record.$form.getFieldDecorator(`tagId`, {
                  initialValue: record.tagId,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                      name: '数据项',
                      }),
                    },
                  ],
                })(
                  <Lov
                    code="MT.TAG"
                    queryParams={{ tenantId }}
                    textValue={record.tagCode}
                    onChange={(value, vals) => {
                      record.$form.setFieldsValue({
                        tagDesc: vals.tagDescription,
                      });
                    }}
                  />
                )}
              </Form.Item>
            </span>
          ) : (
              val
            ),
      },
      {
        title: '数据项描述',
        dataIndex: 'tagDescription',
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`tagDesc`, {
                initialValue: record.tagDescription,
              })(
                <Input disabled />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '数据组编码',
        dataIndex: 'tagGroupCode',
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <span>
              <Form.Item>
                {record.$form.getFieldDecorator(`tagGroupId`, {
                  initialValue: record.tagGroupId,
                })(
                  <Lov
                    code="HME.TAG_GROUP"
                    queryParams={{
                      tenantId,
                    }}
                    allowClear
                    textValue={record.tagGroupCode}
                    onChange={(value, vals) => {
                      record.$form.setFieldsValue({
                        tagGroupDesc: vals.tagGroupDescription,
                      });
                    }}
                  />
                )}
              </Form.Item>
            </span>
          ) : (
              val
            ),
      },
      {
        title: '数据组描述',
        dataIndex: 'tagGroupDescription',
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`tagGroupDesc`, {
                initialValue: record.tagGroupDescription,
              })(
                <Input disabled />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '优先级',
        dataIndex: 'priority',
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`priority`, {
                initialValue: record.priority,
              })(
                <Input />
              )}
            </Form.Item>
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
              <a onClick={() => deleteData(record, index)}>清除</a>&nbsp;&nbsp;
              <a onClick={() => handleSaveLine(record, index)}>保存</a>
            </span>
          ) : record._status === 'update' ? (
            <span>
              <a onClick={() => handleEditLine(record, false)}>取消</a>&nbsp;&nbsp;
              <a onClick={() => handleSaveLine(record, index)}>保存</a>
            </span>
          ) : (
            <a onClick={() => handleEditLine(record, true)}>编辑</a>
              ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="lineId"
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        onChange={page => onSearch(page)}
        onRow={(record) => {
          return {
            onClick: () => {
              this.handleDetailDate(record);
            },
          };
        }}
        rowClassName={this.forHandleClickRow}
      />
    );
  }
}
export default ListTableLine;
