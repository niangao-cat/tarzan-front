/**
 * @author:lly
 * @email:liyuan.liu@hand-china.com
 * @description:制造中心看板信息维护
 */
import React from 'react';
import { Input, Form, Select, InputNumber } from 'hzero-ui';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';

const tenantId = getCurrentOrganizationId();
const { Option } = Select;
// 默认输出
export default class HeadListTable extends React.Component {
  // 直接渲染
  render() {
    const {
      siteMap,
      siteInfo,
      kanbanAreaMap,
      flagMap,
      loading,
      dataSource,
      pagination,
      selectedHeadKeys,
      onSearch,
      onClickHeadRadio,
      handleEditHead,
      handleSaveHead,
      handleSetCode,
    } = this.props;

    // 列展示
    const columns = [
      {
        title: '工厂',
        dataIndex: 'siteName',
        align: 'center',
        width: 120,
        render: (val, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`siteId`, {
                initialValue: siteInfo.siteId,
                rules: [
                  {
                    // required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`siteId`).d('工厂'),
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
        title: '看板区域',
        dataIndex: 'kanbanArea',
        align: 'center',
        width: 120,
        render: (val, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`kanbanArea`, {
                initialValue: val,
                rules: [
                  {
                    required: ['create'].includes(record._status),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`kanbanArea`).d('看板区域'),
                    }),
                  },
                ],
              })(
                <Select allowClear style={{ width: '100%' }}>
                  {kanbanAreaMap.map(item => (
                    <Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            (kanbanAreaMap.filter(ele => ele.value === val)[0] || {}).meaning
          ),
      },
      {
        title: '产线',
        dataIndex: 'prodLineName',
        align: 'center',
        width: 120,
        render: (val, record, index) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`prodLineId`, {
                rules: [
                  {
                    required: ['1', '2', '3'].includes(record.$form.getFieldValue('kanbanArea')),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '产线',
                    }),
                  },
                ],
              })(
                <Lov
                  disabled={['4'].includes(record.$form.getFieldValue('kanbanArea'))}
                  code="HME.FINAL_PRODLINE"
                  queryParams={{
                    // departmentId: record.$form.getFieldValue(''), // 部门
                    siteId: record.$form.getFieldValue('siteId'), // 站点、工厂
                    tenantId,
                  }}
                  lovOptions={{ displayField: 'prodLineName' }}
                  onChange={(value, item) => {
                    handleSetCode(index, 'prodLineName', item.prodLineName);
                  }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '部门',
        dataIndex: 'businessName',
        align: 'center',
        width: 100,
        render: (val, record, index) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`businessId`, {
                rules: [
                  {
                    required: record.$form.getFieldValue('kanbanArea') === '4',
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '部门',
                    }),
                  },
                ],
              })(
                <Lov
                  disabled={['1', '2', '3'].includes(record.$form.getFieldValue('kanbanArea'))}
                  code="HME.USER_DEPARTMENT"
                  lovOptions={{ displayField: 'areaName' }}
                  queryParams={{ tenantId }}
                  onChange={(value, item) => {
                    handleSetCode(index, 'businessName', item.businessName);
                  }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        align: 'center',
        width: 100,
        render: (val, record, index) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialId`, {
                rules: [
                  {
                    required: ['1', '4'].includes(record.$form.getFieldValue('kanbanArea')),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '物料编码',
                    }),
                  },
                ],
              })(
                <Lov
                  disabled={['2', '3'].includes(record.$form.getFieldValue('kanbanArea'))}
                  code="HME.SITE_MATERIAL"
                  queryParams={{ tenantId }}
                  textValue={record.materialCode}
                  onChange={(value, item) => {
                    record.$form.setFieldsValue({
                      materialName: item.materialName,
                    });
                    handleSetCode(index, 'materialCode', item.materialCode);
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
        width: 'auto',
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
        title: '产品组编码',
        dataIndex: 'productionGroupCode',
        align: 'center',
        width: 100,
        render: (val, record, index) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`productionGroupId`, {
                rules: [
                  {
                    required: record.$form.getFieldValue('kanbanArea') === '2',
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '产品组编码',
                    }),
                  },
                ],
              })(
                <Lov
                  disabled={['1', '3', '4'].includes(record.$form.getFieldValue('kanbanArea'))}
                  code="HME.PRODUCTION_GROUP"
                  queryParams={{ tenantId }}
                  onChange={(value, item) => {
                    record.$form.setFieldsValue({
                      productionGroupName: item.description,
                    });
                    handleSetCode(index, 'productionGroupCode', item.description);
                  }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '产品组名称',
        dataIndex: 'productionGroupName',
        align: 'center',
        width: 120,
        render: (val, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`productionGroupName`, {
                initialValue: record.productionGroupName,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '不良展示工序',
        dataIndex: 'workcellName',
        align: 'center',
        width: 120,
        render: (val, record, index) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`workcellId`, {
                initialValue: record.workcellName,
                rules: [
                  {
                    required: record.$form.getFieldValue('kanbanArea') === '3',
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '不良展示工序',
                    }),
                  },
                ],
              })(
                <Lov
                  disabled={['1', '2', '4'].includes(record.$form.getFieldValue('kanbanArea'))}
                  code="HME.FINAL_PROCESS"
                  lovOptions={{ displayField: 'workcellName' }}
                  queryParams={{
                    prodLineId: record.$form.getFieldValue('prodLineId'), // 产线
                    tenantId,
                  }}
                  textValue={record.productionVersion}
                  onChange={(value, item) => {
                    handleSetCode(index, 'workcellName', item.workcellName);
                  }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '目标直通率',
        dataIndex: 'throughRate',
        align: 'center',
        width: 100,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`throughRate`, {
                rules: [
                  {
                    required: ['create'].includes(record._status) ? ['2'].includes(record.$form.getFieldValue('kanbanArea')) : record.kanbanArea === '2',
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '目标直通率',
                    }),
                  },
                ],
                initialValue: record.throughRate,
              })(<InputNumber
                disabled={['create'].includes(record._status) ? ['1', '3', '4'].includes(record.$form.getFieldValue('kanbanArea')) : record.kanbanArea !== '2'}
                max={1}
                step={0.01}
                style={{width: '100%'}}
              />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`enableFlag`).d('有效性'),
        dataIndex: 'enableFlag',
        align: 'center',
        width: 100,
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
                <Select
                  // disabled={['create'].includes(record._status) ? ['1', '2', '3', '4'].includes(record.$form.getFieldValue('kanbanArea')) : false}
                  style={{ width: '100%' }}
                >
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
          rowKey="centerKanbanHeaderId"
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
