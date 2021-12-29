/**
 * @author:ywj
 * @email:wenjie.yang01@hand-china.com
 * @description: 外协管理平台 视图层（头表）
 */
// 引入依赖
import React, { Fragment } from 'react';
import { Input, Form, InputNumber, Select } from 'hzero-ui';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.selectionRuleMaintenance';
const tenantId = getCurrentOrganizationId();
const { Option } = Select;
// 默认输出
export default class HeadListTable extends React.Component {
  // 直接渲染
  render() {
    // 护球上文参数
    const {
      loading,
      dataSource,
      pagination,
      productTypeMap,
      selectedHeadKeys,
      onSearch,
      onClickHeadRadio,
      handleCleanLine,
      handleEditData,
      handleSaveData,
      changeMaterial,
      onDetailData,
    } = this.props;

    // 列展示

    const columns = [
      {
        title: '序号',
        dataIndex: 'orderSeq',
        align: 'center',
        render: (val, record, index) => index + 1,
      },
      {
        title: intl.get(`${modelPrompt}.cosRuleCode`).d('规则编码'),

        dataIndex: 'cosRuleCode',
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`cosRuleCode`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.apiClass`).d('规则编码'),
                    }),
                  },
                ],
                initialValue: val,
              })(<Input />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.productType`).d('产品类型'),
        dataIndex: 'productType',
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`productType`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.productType`).d('产品类型'),
                    }),
                  },
                ],
                initialValue: record.productType,
              })(
                <Select style={{ width: '100%' }}>
                  {productTypeMap.map(ele => (
                    <Option value={ele.value}>{ele.meaning}</Option>
            ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            (productTypeMap.filter(ele => ele.value === val)[0] || {}).meaning
          ),
      },
      {
        title: intl.get(`${modelPrompt}.materialId`).d('SAP料号'),
        width: 200,
        dataIndex: 'materialCode',
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialId`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.materialId`).d('SAP料号'),
                    }),
                  },
                ],
                initialValue: record.materialId,
              })(
                <Lov
                  code="MT.MATERIAL"
                  textValue={val}
                  onChange={(_, records) => changeMaterial( records, index)}
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          ) : (
            record.materialCode
          ),
      },
      {
        title: intl.get(`${modelPrompt}.itemDesc`).d('物料名称'),
        width: 200,
        dataIndex: 'itemDesc',
        render: (val, record) =>
          (
            record.itemDesc
          ),
      },
      {
        title: intl.get(`${modelPrompt}.cosNum`).d('芯片个数'),
        dataIndex: 'cosNum',
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`cosNum`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.cosNum`).d('芯片个数'),
                    }),
                  },
                ],
                initialValue: record.cosNum,
              })(<InputNumber min={0} />)}
            </Form.Item>
          ) : (
            <a onClick={() => onDetailData(record.cosRuleId)}>{val}</a>
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 150,
        align: 'center',
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
        <EditTable
          bordered
          dataSource={dataSource}
          columns={columns}
          rowKey="cosRuleId"
          pagination={pagination}
          rowSelection={{
            selectedRowKeys: selectedHeadKeys,
            type: 'radio', // 单选
            onChange: onClickHeadRadio,
          }}
          onChange={page => onSearch(page)}
          loading={loading}
        />
      </div>
    );
  }
}
