/**
 * @author:lly
 * @email:liyuan.liu@hand-china.com
 * @description:制造中心看板信息维护
 */
import React from 'react';
import EditTable from 'components/EditTable';
import { Form, Input, Button, Select, InputNumber } from 'hzero-ui';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';

const tenantId = getCurrentOrganizationId();
const { Option } = Select;
// 默认输出
export default class LineListTable extends React.Component {
  // 直接渲染
  render() {
    // 护球上文参数
    const {
      selectedRows,
      flagMap,
      dataSource,
      pagination,
      handleCreate,
      onSearch,
      loading,
      handleEditLine,
      handleSaveLine,
    } = this.props;

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
        // render: (val, record, index) => (
        //   <Popconfirm
        //     title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
        //     onConfirm={() => handleCleanLine(record, index)}
        //   >
        //     <Button icon="minus" shape="circle" size="small" />
        //   </Popconfirm>
        // ),
      },
      {
        title: '工序编码',
        dataIndex: 'workcellCode',
        align: 'center',
        render: (val, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`workcellId`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '工序编码',
                    }),
                  },
                ],
              })(
                <Lov
                  code="HME.FINAL_PROCESS"
                  queryParams={{
                    prodLineId: selectedRows[0].prodLineId, // 产线
                    tenantId,
                  }}
                  textValue={record.workcellCode}
                  onChange={(value, item) => {
                    record.$form.setFieldsValue({
                      workcellName: item.workcellName,
                    });
                    // this.setCode(index, 'workcellCode', item.workcellCode);
                  }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '工序名称',
        dataIndex: 'workcellName',
        align: 'center',
        render: (val, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`workcellName`, {
                initialValue: record.workcellName,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '目标直通率',
        dataIndex: 'throughRate',
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`throughRate`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '目标直通率',
                    }),
                  },
                ],
                initialValue: record.throughRate,
              })(<InputNumber max={1} step={0.01} style={{width: '200px'}} />)}
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
                      name: intl.get(`enableFlag`).d('有效性'),
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
        width: 120,
        render: (val, record, index) =>
          record._status === 'create' ? (
            <span>
              <a onClick={() => handleEditLine(record, index, false)}>取消</a>&nbsp;&nbsp;
              <a onClick={() => handleSaveLine(record, index)}>保存</a>
            </span>
          ) : record._status === 'update' ? (
            <span>
              <a onClick={() => handleEditLine(record, index, false)}>取消</a>&nbsp;&nbsp;
              <a onClick={() => handleSaveLine(record, index)}>保存</a>
            </span>
          ) : (
            <a onClick={() => handleEditLine(record, index, true)}>编辑</a>
          ),
      },
    ];

    return (
      <div>
        <EditTable
          bordered
          dataSource={dataSource}
          loading={loading}
          columns={columns}
          pagination={pagination}
          onChange={page => onSearch(page)}
          rowKey="cosFunctionId"
        />
      </div>
    );
  }
}
