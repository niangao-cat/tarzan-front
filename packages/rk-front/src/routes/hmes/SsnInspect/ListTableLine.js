/*
 * @Description: 行数据
 * @Version: 0.0.1
 * @Autor: li.zhang13@hand-china.com
 * @Date: 2021-01-21 09:36:44
 */

import React, { Component } from 'react';
import { Button, Form, Input, InputNumber, Select, Popconfirm} from 'hzero-ui';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import EditTable from 'components/EditTable';
import { Bind } from 'lodash-decorators';

import styles from './index.less';

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
    if (selectedLine !== '' && selectedLine.ssnInspectLineId === record.ssnInspectLineId) {
      return styles['data-click'];
    } else {
        return '';
    }
  }

  @Bind()
  handleDetailDate(fields = {}) {
    const { handleDetailDate } = this.props;
    this.setState({ selectedLine: fields });
    if(fields._status !== 'create' && fields._status !== 'update'){
      if(handleDetailDate) {
        handleDetailDate(fields);
      }
    }
  }

  @Bind()
  changeCoupleFlag(value){
    if (value=== 'Y') {
      this.state.selectedLine.$form.setFieldsValue({
          coupleFlag: 'N',
      });
    }
  }

  @Bind()
  changeCosCoupleFlag(value){
    if (value=== 'Y') {
      this.state.selectedLine.$form.setFieldsValue({
          cosCoupleFlag: 'N',
      });
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
      getSelectedLine,
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
        width: 50,
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
        title: '序号',
        dataIndex: 'sequence',
        align: 'center',
        width: 70,
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`sequence`, {
                initialValue: record.sequence,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                    name: '序号',
                    }),
                  },
                ],
              })(
                <Input />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '检验项编码',
        dataIndex: 'tagCode',
        align: 'center',
        width: 150,
        render: (val, record) =>
          ['create'].includes(record._status) ? (
            <span>
              <Form.Item>
                {record.$form.getFieldDecorator(`tagId`, {
                  initialValue: record.tagId,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                      name: '检验项编码',
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
                        tagDescription: vals.tagDescription,
                        // tagCode: vals.tagCode,
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
        title: '检验项描述',
        dataIndex: 'tagDescription',
        align: 'center',
        width: 160,
        render: (val, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`tagDescription`, {
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
        title: '最小值',
        dataIndex: 'minimumValue',
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`minimumValue`, {
                initialValue: record.minimumValue,
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      if (record.$form.getFieldValue('maximalValue') < value) {
                        callback(
                          '最小值应小于最大值'
                        );
                      } else {
                        callback();
                      }
                    },
                  },
                ],
              })(
                <InputNumber />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '最大值',
        dataIndex: 'maximalValue',
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`maximalValue`, {
                initialValue: record.maximalValue,
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      if (record.$form.getFieldValue('minimumValue') > value) {
                        callback(
                          '最大值应大于最小值'
                        );
                      } else {
                        callback();
                      }
                    },
                  },
                ],
              })(
                <InputNumber />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '是否影响耦合',
        dataIndex: 'coupleFlag',
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`coupleFlag`, {
                initialValue: record.coupleFlag,
              })(
                <Select style={{ width: '100%' }} onChange={this.changeCosCoupleFlag}>
                  <Select.Option value="N">否</Select.Option>
                  <Select.Option value='Y'>是</Select.Option>
                </Select>
              )}
            </Form.Item>
          ) : (
                record.coupleFlag === 'Y'
                  ? '是'
                  : (record.coupleFlag === 'N' ? '否' : '')
            ),
      },
      {
        title: '是否单路影响耦合',
        dataIndex: 'cosCoupleFlag',
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`cosCoupleFlag`, {
                initialValue: record.cosCoupleFlag,
              })(
                <Select style={{ width: '100%' }} onChange={this.changeCoupleFlag}>
                  <Select.Option value="N" key='N'>否</Select.Option>
                  <Select.Option value='Y' key='Y'>是</Select.Option>
                </Select>
              )}
            </Form.Item>
          ) : (
              record.cosCoupleFlag === 'Y'
                ? '是'
                : (record.cosCoupleFlag === 'N' ? '否' : '')
            ),
      },
      {
        title: 'COS位置',
        dataIndex: 'cosPos',
        align: 'center',
        width: 120,
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`cosPos`, {
                initialValue: record.cosPos,
                rules: [
                  {
                    required: (record.$form.getFieldValue('cosCoupleFlag') ==='Y'),
                    message: intl.get('hzero.common.validation.notNull', {
                    name: 'COS位置',
                    }),
                  },
                ],
              })(
                <Input />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '耦合允差',
        dataIndex: 'allowDiffer',
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`allowDiffer`, {
                initialValue: record.allowDiffer,
                rules: [
                  {
                    required: ((record.$form.getFieldValue('coupleFlag') ==='Y') ||(record.$form.getFieldValue('cosCoupleFlag') ==='Y')),
                    message: intl.get('hzero.common.validation.notNull', {
                    name: '耦合允差',
                    }),
                  },
                ],
              })(
                <InputNumber />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '检验允差',
        dataIndex: 'checkAllowDiffer',
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`checkAllowDiffer`, {
                initialValue: record.checkAllowDiffer,
              })(
                <InputNumber />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '是否标准件判定项',
        dataIndex: 'judgeFlag',
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`judgeFlag`, {
                initialValue: record.judgeFlag,
              })(
                <Select style={{ width: '100%' }}>
                  <Select.Option value="N" key='N'>否</Select.Option>
                  <Select.Option value='Y' key='Y'>是</Select.Option>
                </Select>
              )}
            </Form.Item>
          ) : (
              record.judgeFlag === 'Y'
                ? '是'
                : (record.judgeFlag === 'N' ? '否' : '')
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
            </span>
          ) : record._status === 'update' ? (
            <span>
              <a onClick={() => handleEditLine(record, false)}>取消</a>&nbsp;&nbsp;
            </span>
          ) : (
            <a onClick={() => handleEditLine(record, true)}>编辑</a>
              ),
        fixed: 'right',
        width: 100,
      },
    ];
    return (
      <div className={styles['head-table']}>
        <EditTable
          bordered
          rowKey="ssnInspectLineId"
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          pagination={pagination}
          onChange={page => onSearch(page)}
          onRow={(record) => {
          return {
            onClick: () => {
              this.handleDetailDate(record);
              getSelectedLine(record);
            },
          };
        }}
          rowClassName={this.forHandleClickRow}
        />
      </div>
    );
  }
}
export default ListTableLine;
