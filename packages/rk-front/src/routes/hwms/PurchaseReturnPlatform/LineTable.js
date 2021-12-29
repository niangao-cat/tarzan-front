/**
 * LineTable - 行Table
 * @date: 2020-07-29
 * @author: wxy <xinyu.wang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2020, Hand
 */
import React, { /* Fragment */ } from 'react';
import { connect } from 'dva';
import { Form } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, tableScrollWidth } from 'utils/utils';
import EditTable from 'components/EditTable';

const modelPrompt = 'hwms.model.purchaseReturnPlatform';

/**
 * 搜索栏
 * @extends {Component} - React.Component
 * @reactProps {Object} purchaseReturnPlatform - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ purchaseReturnPlatform}) => ({
  purchaseReturnPlatform,
  tenantId: getCurrentOrganizationId(),
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'hwms.purchaseReturnPlatform',
})
export default class LineTable extends React.Component {

  // 禁用或启用触发方法
  @Bind()
  detailClick(record, index){
    const { detailClick } = this.props;
    detailClick(record, index);
  }

  // 行分页变化后触发方法
  @Bind()
  forHandleTableLineChange(linePagination){
    const { handleTableLineChange } = this.props;
    handleTableLineChange(linePagination);
  }

  // 选中行事件
  @Bind()
  forOnLineChange(selectedLineRows){
    const { onLineChange } = this.props;
    onLineChange(selectedLineRows);
  }

  // 渲染方法
  render() {
    const { lineList, linePagination, /* selectedLineRows */fetchLineLoading } = this.props;

    const lineColumns = [
      {
        title: intl.get(`${modelPrompt}.lineNumber`).d('行号'),
        dataIndex: 'lineNumber',
        width: 110,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
        width: 110,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 110,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.instructionStatusMeaning`).d('行状态'),
        dataIndex: 'instructionStatusMeaning',
        width: 110,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.locatorCode`).d('退货仓库'),
        dataIndex: 'locatorCode',
        width: 110,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.quantity`).d('退货数量'),
        dataIndex: 'quantity',
        width: 110,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.actualQty`).d('执行数量'),
        dataIndex: 'actualQty',
        width: 110,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.uomCode`).d('单位'),
        dataIndex: 'uomCode',
        width: 80,
        align: 'center',
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 120,
        align: 'center',
        render: (val, record, index) => (
          <span className="action-link">
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a onClick={() => this.detailClick(record, index)}>
                {intl.get('tarzan.acquisition.transformation.button.edit').d("明细")}
              </a>
            )}
          </span>
        ),
      },
    ];
    return (
      <EditTable
        loading={fetchLineLoading}
        rowKey="instructionId"
          // rowSelection={rowLineSelection}
        scroll={{ x: tableScrollWidth(lineColumns, 50), y: 210 }}
        dataSource={lineList}
        columns={lineColumns}
        pagination={linePagination || {}}
        onChange={this.forHandleTableLineChange}
          // onRow={(record, index) => {
          //   return {
          //     onClick: () => {
          //       this.detailClick(record, index);
          //     },
          //   };
          // }}
        bordered
      />
    );
  }
}
