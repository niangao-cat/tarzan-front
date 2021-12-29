/**
 * @author:lly
 * @email:liyuan.liu@hand-china.com
 * @description产品组维护
 */
import React from 'react';
import EditTable from 'components/EditTable';
import { Form, Input, Button, Select } from 'hzero-ui';
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
        title: '物料编码',
        dataIndex: 'materialCode',
        align: 'center',
        render: (val, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialId`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '物料编码',
                    }),
                  },
                ],
              })(
                <Lov
                  code="HME.SITE_MATERIAL"
                  queryParams={{ tenantId }}
                  textValue={record.materialCode}
                  onChange={(value, item) => {
                    record.$form.setFieldsValue({
                      materialName: item.materialName,
                    });
                    // this.setCode(index, 'materialCode', item.materialCode);
                  }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '物料名称',
        dataIndex: 'materialName',
        align: 'center',
        render: (val, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialName`, {
                initialValue: record.materialName,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '生产版本',
        dataIndex: 'productionVersion',
        align: 'center',
        render: (val, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`productionVersion`, {
                initialValue: record.productionVersion,
                rules: [
                  {
                    required: false,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '生产版本',
                    }),
                  },
                ],
              })(
                <Lov
                  code="HME.MATERIAL_VERSION"
                  queryParams={{
                    tenantId,
                    siteId: selectedRows[0].siteId,
                    materialId: record.$form.getFieldValue('materialId'),
                  }}
                  textValue={record.productionVersion}
                  // onChange={(value, item) => {
                  //   this.setCode(index, 'productionVersion', item.productionVersion);
                  // }}
                />
              )}
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
        width: 200,
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
          rowKey="productionGroupId"
        />
      </div>
    );
  }
}
