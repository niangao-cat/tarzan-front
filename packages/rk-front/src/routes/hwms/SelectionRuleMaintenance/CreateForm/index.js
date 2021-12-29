/**
 * @author:ywj
 * @email:wenjie.yang01@hand-china.com
 * @description: 外协管理平台 视图层（创建表）
 */
// 引入依赖
import React, {Fragment} from 'react';
import EditTable from 'components/EditTable';
import { Form, Button, Popconfirm, Select, InputNumber, Modal } from 'hzero-ui';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';

const modelPrompt = 'tarzan.selectionRuleMaintenance';
const { Option } = Select;
// 默认输出
export default class HeadListTable extends React.Component {
  // 直接渲染
  render() {
    // 护球上文参数
    const {
      dataSource,
      pagination,
      handleCreate,
      onSearch,
      handleCleanLine,
      loading,
      handleSaveData,
      handleEditData,
      cosTypeMap,
      powerMap,
      expandDrawer,
      onCancel,
    } = this.props;

    const upToData = dataSource ? dataSource[dataSource.length-1] : dataSource;

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
        title: '序号',
        dataIndex: 'orderSeq',
        render: (val, record, index) => index + 1,
      },
      {
        title: intl.get(`cosNumber`).d('芯片路数'),
        dataIndex: 'cosNumber',
        align: 'center',
        render: (val, record) => {
          const cosData = upToData.cosNumber;
          const cosNumberData = cosData + 1;
          return ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`cosNumber`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`ruleNumber`).d('cosNumber'),
                    }),
                  },
                ],
                initialValue: ['update'].includes(record._status)
                  ? record.cosNumber
                  : upToData
                    ? cosNumberData.toString()
                    : '',
              })(<InputNumber min={0} />)}
            </Form.Item>
          ) : (
            val
          );
        },
      },
      {
        title: intl.get(`${modelPrompt}.materialId`).d('芯片料号'),
        dataIndex: 'materialCode',
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialId`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.materialId`).d('芯片料号'),
                    }),
                  },
                ],
                initialValue: ['update'].includes(record._status)
                  ? record.materialId
                  : upToData
                    ? upToData.materialId
                    : '',
              })(
                <Lov
                  code="MT.MATERIAL"
                  textValue={val || (upToData ? upToData.materialCode : '')}
                  // textField="materialCode"
                  lovOptions={{ valueField: 'materialId', displayField: 'materialCode' }}
                  queryParams={{ tenantId: getCurrentOrganizationId() }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.collectionItem`).d('芯片类型'),
        dataIndex: 'cosType',
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`cosType`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.cosType`).d('芯片类型'),
                    }),
                  },
                ],
                initialValue: ['update'].includes(record._status)
                  ? record.cosType
                  : upToData
                    ? upToData.cosType
                    : '',
              })(
                <Select style={{ width: '100%' }}>
                  {cosTypeMap.map(ele => (
                    <Option value={ele.value}>{ele.meaning}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            (cosTypeMap.filter(ele => ele.value === val)[0] || {}).meaning
          ),
      },
      {
        title: intl.get(`${modelPrompt}.rangeType`).d('功率/W（单点）'),
        dataIndex: 'powerSinglePoint',
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`powerSinglePoint`, {
                initialValue: record.powerSinglePoint,
              })(
                <Select allowClear style={{ width: '100%' }}>
                  {powerMap.map(ele => (
                    <Option value={ele.value}>{ele.meaning}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            (powerMap.filter(ele => ele.value === val)[0] || {}).meaning
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 150,
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
      <Modal
        confirmLoading={false}
        width={1200}
        visible={expandDrawer}
        onCancel={onCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        footer={null}
      >
        <br />
        <EditTable bordered dataSource={dataSource} loading={loading} columns={columns} pagination={pagination} onChange={page => onSearch(page)} rowKey="cosFunctionId" />

      </Modal>
    );
  }
}
