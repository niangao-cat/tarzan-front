/**
 * LineTable - 行Table
 * @date: 2020-07-29
 * @author: wxy <xinyu.wang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2020, Hand
 */
import React, { /* Fragment */ } from 'react';
import { connect } from 'dva';
import { Form, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, tableScrollWidth } from 'utils/utils';
import EditTable from 'components/EditTable';

const modelPrompt = 'hwms.model.deliveryOrderQuery';
const { Option } = Select;

/**
 * 搜索栏
 * @extends {Component} - React.Component
 * @reactProps {Object} deliveryOrderQuery - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ deliveryOrderQuery}) => ({
  deliveryOrderQuery,
  tenantId: getCurrentOrganizationId(),
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'hwms.deliveryOrderQuery',
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
    const { lineList, linePagination, /* selectedLineRows */fetchLineLoading, distributionLineStatusList } = this.props;

    // const rowLineSelection = {
    //   selectedRowKeys: selectedLineRows,
    //   onChange: this.forOnLineChange,
    //   // type: 'radio', // 单选
    //   columnWidth: 20,
    //   // fixed: true,
    //   getCheckboxProps: record => ({
    //     disabled: !record.instructionId,
    //   }),
    // };

    const lineColumns = [
      {
        title: intl.get(`${modelPrompt}.instructionNum`).d('配送单行号'),
        dataIndex: 'instructionNum',
        width: 110,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.instructionStatus`).d('行状态'),
        dataIndex: 'instructionStatus',
        width: 110,
        align: 'center',
        render: (val, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator(`instructionStatus`, {
              rules: [{}],
              initialValue: record.instructionStatus,
            })(
              <Select style={{ width: '100%' }}>
                {distributionLineStatusList.map(ele => (
                  <Option value={ele.value}>{ele.meaning}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
        ) : (
          (distributionLineStatusList.filter(ele => ele.value === val)[0] || {}).meaning
        ),
      },
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料'),
        dataIndex: 'materialCode',
        width: 110,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.materialVersion`).d('物料版本'),
        dataIndex: 'materialVersion',
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
        title: intl.get(`${modelPrompt}.materialName`).d('已签收数量'),
        dataIndex: 'signedQty',
        width: 110,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('销售订单号+行号'),
        dataIndex: 'soNum',
        width: 110,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.quantity`).d('需求数量'),
        dataIndex: 'quantity',
        width: 110,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.acutalQty`).d('备料数量'),
        dataIndex: 'acutalQty',
        width: 110,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.uomCode`).d('单位'),
        dataIndex: 'uomCode',
        width: 110,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.inventoryQty`).d('仓库库存'),
        dataIndex: 'inventoryQty',
        width: 110,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.inStockQty`).d('线边库存'),
        dataIndex: 'inStockQty',
        width: 110,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.backflushFlag`).d('是否启用线边库存'),
        dataIndex: 'backflushFlag',
        width: 130,
        align: 'center',
        render: (val) => val === 'Y' ? '是' : '否',
      },
      {
        title: intl.get(`${modelPrompt}.offsetQty`).d('冲减数量'),
        dataIndex: 'offsetQty',
        width: 110,
        align: 'center',
      },
      // {
      //   title: intl.get(`${modelPrompt}.areaType`).d('工厂'),
      //   dataIndex: 'areaType',
      //   width: 110,
      //   align: 'center',
      // },
      // {
      //   title: intl.get(`${modelPrompt}.areaType`).d('产线'),
      //   dataIndex: 'areaType',
      //   width: 110,
      //   align: 'center',
      // },
      // {
      //   title: intl.get(`${modelPrompt}.areaType`).d('工段'),
      //   dataIndex: 'areaType',
      //   width: 110,
      //   align: 'center',
      // },
      // {
      //   title: intl.get(`${modelPrompt}.areaType`).d('工序'),
      //   dataIndex: 'areaType',
      //   width: 110,
      //   align: 'center',
      // },
      // {
      //   title: intl.get(`${modelPrompt}.areaType`).d('工单号'),
      //   dataIndex: 'areaType',
      //   width: 110,
      //   align: 'center',
      // },
      {
        title: intl.get(`${modelPrompt}.remark`).d('备注'),
        dataIndex: 'remark',
        width: 110,
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
