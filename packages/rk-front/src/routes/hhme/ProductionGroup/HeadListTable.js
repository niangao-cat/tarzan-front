/**
 * @author:lly
 * @email:liyuan.liu@hand-china.com
 * @description产品组维护
 */
import React from 'react';
import { Input, Form, Select } from 'hzero-ui';
import EditTable from 'components/EditTable';
import intl from 'utils/intl';

const { Option } = Select;
// 默认输出
export default class HeadListTable extends React.Component {
  // 直接渲染
  render() {
    const {
      siteMap,
      siteInfo,
      flagMap,
      loading,
      dataSource,
      pagination,
      selectedHeadKeys,
      onSearch,
      onClickHeadRadio,
      handleEditHead,
      handleSaveHead,
    } = this.props;

    // 列展示
    const columns = [
      {
        title: '工厂',
        dataIndex: 'siteName',
        align: 'center',
        width: 200,
        render: (val, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`siteId`, {
                initialValue: siteInfo.siteId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`siteId`).d('站点'),
                    }),
                  },
                ],
              })(
                <Select allowClear>
                  {siteMap.map(item => (
                    <Select.Option key={item.siteId} value={item.siteId}>
                      {item.description}
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
        title: '产品组编码',
        dataIndex: 'productionGroupCode',
        align: 'center',
        render: (val, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`productionGroupCode`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`productionGroupCode`).d('产品组编码'),
                    }),
                  },
                ],
              })(<Input />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '产品组名称',
        dataIndex: 'description',
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`description`, {
                initialValue: record.description,
              })(<Input />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`enableFlag`).d('有效性'),
        dataIndex: 'enableFlag',
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`enableFlag`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`enableFlag`).d('是否启用'),
                    }),
                  },
                ],
                initialValue: val || 'Y',
              })(
                <Select style={{ width: '100%' }}>
                  {flagMap.map(ele => (
                    <Option value={ele.value}>{ele.meaning}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            (flagMap.filter(ele => ele.value === val)[0] || {}).meaning
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        align: 'center',
        width: 200,
        render: (val, record, index) =>
          record._status === 'create' ? (
            <span>
              <a onClick={() => handleEditHead(record, index, false)}>取消</a>&nbsp;&nbsp;
              <a onClick={() => handleSaveHead(record, index)}>保存</a>
            </span>
          ) : record._status === 'update' ? (
            <span>
              <a onClick={() => handleEditHead(record, index, false)}>取消</a>&nbsp;&nbsp;
              <a onClick={() => handleSaveHead(record, index)}>保存</a>
            </span>
          ) : (
            <a onClick={() => handleEditHead(record, index, true)}>编辑</a>
          ),
      },
    ];

    return (
      <div>
        <EditTable
          bordered
          dataSource={dataSource}
          columns={columns}
          rowKey="productionGroupId"
          pagination={pagination}
          rowSelection={{
            selectedRowKeys: selectedHeadKeys,
            type: 'radio', // 单选
            columnWidth: 60,
            onChange: onClickHeadRadio,
          }}
          onChange={page => onSearch(page)}
          loading={loading}
        />
      </div>
    );
  }
}
