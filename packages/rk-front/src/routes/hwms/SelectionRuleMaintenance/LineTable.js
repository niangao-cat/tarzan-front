/**
 * @author:ywj
 * @email:wenjie.yang01@hand-china.com
 * @description: 外协管理平台 视图层（创建表）
 */
// 引入依赖
import React, {Fragment} from 'react';
import EditTable from 'components/EditTable';
import { Form, Input, Button, Popconfirm, Select, InputNumber } from 'hzero-ui';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.selectionRuleMaintenance';
const { Option } = Select;
// 默认输出
export default class HeadListTable extends React.Component {
  // 直接渲染
  render() {
    // 护球上文参数
    const { dataSource, pagination, handleCreate, onSearch, handleCleanLine, loading, handleSaveData, handleEditData, collectionItemMap, countTypeMap, rangeTypeMap } = this.props;

    // 列展示

    const columns = [
      {
        title: (
          <Button
            style={{ backgroundColor: '#548FFC', color: '#fff' }}
            icon="plus"
            shape="circle"
            size="small"
            onClick={handleCreate}
          />
        ),
        align: 'center',
        fixed: 'left',
        width: 60,
        render: (val, record, index) => (
          <Popconfirm
            title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
            onConfirm={() => handleCleanLine(record, index)}
          >
            <Button icon="minus" shape="circle" size="small" />
          </Popconfirm>
        ),
      },
      {
        title: intl.get(`cosSequence`).d('规则'),
        dataIndex: 'ruleNumber',
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`ruleNumber`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`ruleNumber`).d('规则'),
                    }),
                  },
                ],
                initialValue: record.ruleNumber,
              })(<Input />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`current`).d('电流'),
        dataIndex: 'current',
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`current`, {
                initialValue: val,
              })(<Input />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.collectionItem`).d('采集项'),
        dataIndex: 'collectionItem',
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`collectionItem`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.collectionItem`).d('采集项'),
                    }),
                  },
                ],
                initialValue: record.collectionItem,
              })(
                <Select style={{ width: '100%' }}>
                  {collectionItemMap.map(ele => (
                    <Option value={ele.value}>{ele.meaning}</Option>
            ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            (collectionItemMap.filter(ele => ele.value === val)[0] || {}).meaning
          ),
      },
      {
        title: intl.get(`${modelPrompt}.collectionItem`).d('计算类型'),
        dataIndex: 'countType',
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`countType`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.countType`).d('计算类型'),
                    }),
                  },
                ],
                initialValue: record.countType,
              })(
                <Select style={{ width: '100%' }}>
                  {countTypeMap.map(ele => (
                    <Option value={ele.value}>{ele.meaning}</Option>
            ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            (countTypeMap.filter(ele => ele.value === val)[0] || {}).meaning
          ),
      },
      {
        title: intl.get(`${modelPrompt}.rangeType`).d('范围类型'),
        dataIndex: 'rangeType',
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`rangeType`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.rangeType`).d('范围类型'),
                    }),
                  },
                ],
                initialValue: record.rangeType,
              })(
                <Select style={{ width: '100%' }}>
                  {rangeTypeMap.map(ele => (
                    <Option value={ele.value}>{ele.meaning}</Option>
            ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            (rangeTypeMap.filter(ele => ele.value === val)[0] || {}).meaning
          ),
      },
      {
        title: intl.get(`current`).d('值'),
        dataIndex: 'ruleValue',
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`ruleValue`, {
                initialValue: val,
              })(<InputNumber min={0} />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 100,
        align: 'center',
        fixed: 'right',
        render: (val, record, index) => (
          <span className="action-link">
            {record._status === 'update' && (
              <Fragment>
                <a onClick={() => handleEditData(record, false)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => handleSaveData(record, index)}>
                  {intl.get('tarzan.acquisition.transformation.button.save').d('保存')}
                </a>
              </Fragment>
            )}
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a onClick={() => handleEditData(record, true)}>
                {intl.get('tarzan.acquisition.transformation.button.edit').d('编辑')}
              </a>
            )}

            {record._status === 'create' && (
              <Fragment>
                <a onClick={() => handleCleanLine(record)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => handleSaveData(record, index)}>
                  {intl.get('tarzan.acquisition.transformation.button.save').d('保存')}
                </a>
              </Fragment>
            )}
          </span>
        ),
      },
    ];

    return (
      <div className="tableClass">
        <EditTable bordered dataSource={dataSource} loading={loading} columns={columns} pagination={pagination} onChange={page => onSearch(page)} rowKey="cosFunctionId" />
      </div>
    );
  }
}
