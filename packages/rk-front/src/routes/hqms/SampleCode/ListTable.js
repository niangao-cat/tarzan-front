/*
 * @Description: IQC免检
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-29 10:06:59
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-07-01 10:48:32
 * @Copyright: Copyright (c) 2019 Hand
 */
import React, { Component } from 'react';
import { Form, InputNumber, Select } from 'hzero-ui';
import EditTable from 'components/EditTable';
import { tableScrollWidth } from 'utils/utils';

@Form.create({ fieldNameProp: null })
class ListTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  limit = value => {
    return value.replace(/^(0+)|[^\d]+/g, '');
  };

  /**
   * 页面渲染
   * @returns {*}
   */
  render() {
    const {
      sampleCodeList,
      lovData = {},
      fetchLoading,
      pagination,
      onSearch,
      handleEditLine,
    } = this.props;
    const { codeLevel = [], standardType = [] } = lovData;
    const columns = [
      {
        title: '批次',
        width: 200,
        children: [
          {
            title: '下限',
            dataIndex: 'lotSizeFrom',
            key: 'lotSizeFrom',
            width: 200,
            align: 'center',
            render: (val, record) =>
              ['update', 'create'].includes(record._status) ? (
                <Form.Item>
                  {record.$form.getFieldDecorator(`lotSizeFrom`, {
                    rules: [
                      {
                        required: true,
                        message: '批次下限',
                      },
                    ],
                    initialValue: record.lotSizeFrom,
                  })(
                    <InputNumber
                      min={0}
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
            title: '上限',
            dataIndex: 'lotSizeTo',
            key: 'lotSizeTo',
            width: 200,
            align: 'center',
            render: (val, record) =>
              ['update', 'create'].includes(record._status) ? (
                <Form.Item>
                  {record.$form.getFieldDecorator(`lotSizeTo`, {
                    initialValue: record.lotSizeTo,
                    rules: [
                      {
                        required: true,
                        message: '批次上限',
                      },
                    ],
                  })(
                    <InputNumber
                      min={0}
                      formatter={value => `${value}`}
                      parser={value => value.replace(/\D|^-/g, '')}
                    />
                  )}
                </Form.Item>
              ) : (
                val
              ),
          },
        ],
      },
      {
        title: '特殊检验水平',
        width: 500,
        children: [
          {
            title: 'S-1',
            dataIndex: 'sizeCodeLetter1Meaning',
            key: 'sizeCodeLetter1Meaning',
            width: 200,
            align: 'center',
            render: (val, record) =>
              ['update', 'create'].includes(record._status) ? (
                <Form.Item>
                  {record.$form.getFieldDecorator(`sizeCodeLetter1`, {
                    initialValue: record.sizeCodeLetter1,
                    rules: [
                      {
                        required: true,
                        message: 'S-1',
                      },
                    ],
                  })(
                    <Select allowClear style={{ width: '100%' }}>
                      {codeLevel.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              ) : (
                val
              ),
          },
          {
            title: 'S-2',
            dataIndex: 'sizeCodeLetter2Meaning',
            key: 'sizeCodeLetter2Meaning',
            width: 200,
            align: 'center',
            render: (val, record) =>
              ['update', 'create'].includes(record._status) ? (
                <Form.Item>
                  {record.$form.getFieldDecorator(`sizeCodeLetter2`, {
                    initialValue: record.sizeCodeLetter2,
                    rules: [
                      {
                        required: true,
                        message: 'S-2',
                      },
                    ],
                  })(
                    <Select allowClear style={{ width: '100%' }}>
                      {codeLevel.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              ) : (
                val
              ),
          },
          {
            title: 'S-3',
            dataIndex: 'sizeCodeLetter3Meaning',
            key: 'sizeCodeLetter3Meaning',
            width: 200,
            align: 'center',
            render: (val, record) =>
              ['update', 'create'].includes(record._status) ? (
                <Form.Item>
                  {record.$form.getFieldDecorator(`sizeCodeLetter3`, {
                    initialValue: record.sizeCodeLetter3,
                    rules: [
                      {
                        required: true,
                        message: 'S-3',
                      },
                    ],
                  })(
                    <Select allowClear style={{ width: '100%' }}>
                      {codeLevel.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              ) : (
                val
              ),
          },
          {
            title: 'S-4',
            dataIndex: 'sizeCodeLetter4Meaning',
            key: 'sizeCodeLetter4Meaning',
            width: 200,
            align: 'center',
            render: (val, record) =>
              ['update', 'create'].includes(record._status) ? (
                <Form.Item>
                  {record.$form.getFieldDecorator(`sizeCodeLetter4`, {
                    initialValue: record.sizeCodeLetter4,
                    rules: [
                      {
                        required: true,
                        message: 'S-4',
                      },
                    ],
                  })(
                    <Select allowClear style={{ width: '100%' }}>
                      {codeLevel.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              ) : (
                val
              ),
          },
        ],
      },
      {
        title: '一般检验水平',
        width: 400,
        children: [
          {
            title: 'Ⅰ',
            dataIndex: 'sizeCodeLetter5Meaning',
            key: 'sizeCodeLetter5Meaning',
            width: 200,
            align: 'center',
            render: (val, record) =>
              ['update', 'create'].includes(record._status) ? (
                <Form.Item>
                  {record.$form.getFieldDecorator(`sizeCodeLetter5`, {
                    initialValue: record.sizeCodeLetter5,
                    rules: [
                      {
                        required: true,
                        message: '一般检验水平Ⅰ',
                      },
                    ],
                  })(
                    <Select allowClear style={{ width: '100%' }}>
                      {codeLevel.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              ) : (
                val
              ),
          },
          {
            title: 'Ⅱ',
            dataIndex: 'sizeCodeLetter6Meaning',
            key: 'sizeCodeLetter6Meaning',
            width: 200,
            align: 'center',
            render: (val, record) =>
              ['update', 'create'].includes(record._status) ? (
                <Form.Item>
                  {record.$form.getFieldDecorator(`sizeCodeLetter6`, {
                    initialValue: record.sizeCodeLetter6,
                    rules: [
                      {
                        required: true,
                        message: '一般检验水平Ⅱ',
                      },
                    ],
                  })(
                    <Select allowClear style={{ width: '100%' }}>
                      {codeLevel.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              ) : (
                val
              ),
          },
          {
            title: 'Ⅲ',
            dataIndex: 'sizeCodeLetter7Meaning',
            key: 'sizeCodeLetter7Meaning',
            width: 200,
            align: 'center',
            render: (val, record) =>
              ['update', 'create'].includes(record._status) ? (
                <Form.Item>
                  {record.$form.getFieldDecorator(`sizeCodeLetter7`, {
                    initialValue: record.sizeCodeLetter7,
                    rules: [
                      {
                        required: true,
                        message: '一般检验水平Ⅲ',
                      },
                    ],
                  })(
                    <Select allowClear style={{ width: '100%' }}>
                      {codeLevel.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              ) : (
                val
              ),
          },
        ],
      },
      {
        title: '抽样标准类型',
        dataIndex: 'sampleStandardTypeMeaning',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`sampleStandardType`, {
                rules: [
                  {
                    required: true,
                    message: '抽样标准类型',
                  },
                ],
                initialValue: record.sampleStandardType,
              })(
                <Select allowClear style={{ width: '100%' }}>
                  {standardType.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '是否有效',
        dataIndex: 'enableFlagMeaning',
        width: 90,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`enableFlag`, {
                initialValue: record.enableFlag,
                rules: [
                  {
                    required: true,
                    message: '是否有效',
                  },
                ],
              })(
                <Select style={{ width: '100%' }}>
                  <Select.Option key="Y" value="Y">
                    是
                  </Select.Option>
                  <Select.Option key="N" value="N">
                    否
                  </Select.Option>
                </Select>
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
        dataSource={sampleCodeList}
        scroll={{ x: tableScrollWidth(columns) }}
        pagination={pagination}
        onChange={page => onSearch(page)}
        onRow={record => {
          return {
            onClick: () => handleEditLine(record, true), // 点击行
          };
        }}
      />
    );
  }
}
export default ListTable;
