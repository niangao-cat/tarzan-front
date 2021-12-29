import React, { Fragment } from 'react';
import { Form, Input } from 'hzero-ui';
import EditTable from 'components/EditTable';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.itfObjectTransactionIface';

export default class ListTable extends React.Component {
  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      dataSource,
      pagination,
      loading,
      searchByPagination,
      editOne,
      saveOne,
    } = this.props;
    const columns = [
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 120,
        align: 'center',
        fixed: 'left',
        render: (val, record, index) => (
          <span className="action-link">
            {record._status === 'update' && (
              <Fragment>
                <a onClick={() => editOne(record, false)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => saveOne(record, index)}>
                  {intl.get('tarzan.event.requestType.button.save').d('保存')}
                </a>
              </Fragment>
            )}
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a onClick={() => editOne(record, true)}>
                {intl.get('tarzan.event.requestType.button.edit').d('编辑')}
              </a>
            )}
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.attribute1`).d('物料凭证'),
        dataIndex: 'attribute1',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.attribute2`).d('凭证时间'),
        dataIndex: 'attribute2',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.mergeId`).d('接口汇总ID'),
        dataIndex: 'mergeId',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.transactionTypeCode`).d('事务类型编码'),
        dataIndex: 'transactionTypeCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.moveType`).d('移动类型'),
        dataIndex: 'moveType',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.accountDate`).d('记账时间'),
        dataIndex: 'accountDate',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.plantCode`).d('工厂编码'),
        dataIndex: 'plantCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.workOrderNum`).d('工单号'),
        dataIndex: 'workOrderNum',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.bomReserveNum`).d('预留需求编码'),
        dataIndex: 'bomReserveNum',
        width: 150,
        render: (val, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator(`bomReserveNum`, {
              initialValue: val,
            })(
              <Input />
            )}
          </Form.Item>
        ) : val,
      },
      {
        title: intl.get(`${modelPrompt}.bomReserveLineNum`).d('预留需求行号'),
        dataIndex: 'bomReserveLineNum',
        width: 150,
        render: (val, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator(`bomReserveLineNum`, {
              initialValue: val,
            })(
              <Input />
            )}
          </Form.Item>
        ) : val,
      },
      {
        title: intl.get(`${modelPrompt}.transactionQty`).d('数量'),
        dataIndex: 'transactionQty',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.lotNumber`).d('批次'),
        dataIndex: 'lotNumber',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.transactionUom`).d('单位'),
        dataIndex: 'transactionUom',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.remark`).d('备注'),
        dataIndex: 'remark',
        width: 150,
        render: (val, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator(`remark`, {
              initialValue: val,
            })(
              <Input />
            )}
          </Form.Item>
        ) : val,
      },
      {
        title: intl.get(`${modelPrompt}.processMessage`).d('处理消息'),
        dataIndex: 'processMessage',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.processStatus`).d('处理状态'),
        dataIndex: 'processStatus',
        width: 150,
        render: (val, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator(`processStatus`, {
              initialValue: val,
            })(
              <Input />
            )}
          </Form.Item>
        ) : val,
      },
      {
        title: intl.get(`${modelPrompt}.warehouseCode`).d('来源仓库'),
        dataIndex: 'warehouseCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.locatorCode`).d('来源货位'),
        dataIndex: 'locatorCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.transferWarehouseCode`).d('目标仓库'),
        dataIndex: 'transferWarehouseCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.transferLocatorCode`).d('目标货位'),
        dataIndex: 'transferLocatorCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.costcenterCode`).d('成本中心编码'),
        dataIndex: 'costcenterCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.supplierCode`).d('供应商编码'),
        dataIndex: 'supplierCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.supplierSiteCode`).d('供应商地点编码'),
        dataIndex: 'supplierSiteCode',
        width: 150,
      },

      {
        title: intl.get(`${modelPrompt}.customerCode`).d('客户编码'),
        dataIndex: 'customerCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.customerSiteCode`).d('客户地点编码'),
        dataIndex: 'customerSiteCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.sourceDocType`).d('来源单据类型'),
        dataIndex: 'sourceDocType',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.sourceDocNum`).d('来源单据号'),
        dataIndex: 'sourceDocNum',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.sourceDocLineNum`).d('来源单据行号'),
        dataIndex: 'sourceDocLineNum',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.operationSequence`).d('工序'),
        dataIndex: 'operationSequence',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.completeFlag`).d('完成标识'),
        dataIndex: 'completeFlag',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.prodLineCode`).d('生产线编码'),
        dataIndex: 'prodLineCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.containerCode`).d('容器编码'),
        dataIndex: 'containerCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.containerTypeCode`).d('容器类型编码'),
        dataIndex: 'containerTypeCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.soNum`).d('销售订单号'),
        dataIndex: 'soNum',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.soLineNum`).d('销售订单行号'),
        dataIndex: 'soLineNum',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.snNum`).d('SN号'),
        dataIndex: 'snNum',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.processDate`).d('处理时间'),
        dataIndex: 'processDate',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.transferSoNum`).d('目标销售订单'),
        dataIndex: 'transferSoNum',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.transferSoLineNum`).d('目标销售订单行'),
        dataIndex: 'transferSoLineNum',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.transferLotNumber`).d('目标批次'),
        dataIndex: 'transferLotNumber',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.poNum`).d('采购订单'),
        dataIndex: 'poNum',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.poLineNum`).d('采购订单行'),
        dataIndex: 'poLineNum',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.gmcode`).d('SAP移动事物分配代码'),
        dataIndex: 'gmcode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.createdByName`).d('创建人'),
        dataIndex: 'createdByName',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.creationDate`).d('创建时间'),
        dataIndex: 'creationDate',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.lastUpdatedByName`).d('最后更新人'),
        dataIndex: 'lastUpdatedByName',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.lastUpdateDate`).d('更新时间'),
        dataIndex: 'lastUpdateDate',
        width: 150,
      },
    ];
    return (
      <React.Fragment>
        <EditTable
          loading={loading}
          rowKey="ifaceId"
          dataSource={dataSource}
          columns={columns}
          pagination={pagination || {}}
          onChange={page => searchByPagination(page)}
          bordered
        />
      </React.Fragment>
    );
  }
}
