/**
 * LineTable - 头Table
 * @date: 2020-07-29
 * @author: ywj
 * @version: 0.0.1
 * @copyright Copyright (c) 2020, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, tableScrollWidth } from 'utils/utils';
import EditTable from 'components/EditTable';
import styles from './index.less';

const modelPrompt = 'hwms.model.purchaseReturnPlatform';

/**
 * 头Table
 * @extends {Component} - React.Component
 * @reactProps {Object} purchaseReturnPlatform - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ purchaseReturnPlatform }) => ({
  purchaseReturnPlatform,
  tenantId: getCurrentOrganizationId(),
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'hwms.purchaseReturnPlatform',
})
export default class HeadTable extends React.Component {

  // 点击头的某一行触发
  @Bind()
  forRowHeadClick(record){
    const { rowHeadClick } = this.props;
    rowHeadClick(record);
  }

  // 菜单lov联动赋值
  @Bind()
  forChangeMenuCode(vals, records, index){
    const { changeMenuCode } = this.props;
    changeMenuCode(vals, records, index);
  }

  // 头分页变化后触发方法
  @Bind()
  forHandleTableHeadChange(headPagination){
    const { handleTableHeadChange } = this.props;
    handleTableHeadChange(headPagination);
  }

  // 改变头的点击行背景颜色
  @Bind()
  forHandleClickRow(record){
    const { headDatas } = this.props;
    if (headDatas !== '' && headDatas.instructionDocId === record.instructionDocId) {
      return styles['data-click'];
    } else {
      return '';
    }
  }

  // 选中头事件
  @Bind()
  forOnHeadChange(selectedLineRows){
    const { onHeadChange } = this.props;
    onHeadChange(selectedLineRows);

    // 触发查询行数据
    // const headDatas = {
    //   headId: "",
    // };
    // // eslint-disable-next-line prefer-destructuring
    // headDatas.headId = selectedLineRows[0];
    // const { rowHeadClick } = this.props;
    // rowHeadClick(headDatas);
  }

  // 渲染方法
  render() {
    const { headList, headPagination, selectedHeadRows, fetchHeadLoading } = this.props;

    const rowHeadSelection = {
      selectedRowKeys: selectedHeadRows,
      onChange: this.forOnHeadChange,
      // type: 'radio', // 单选
      // columnWidth: 20,
      // fixed: true,
      getCheckboxProps: record => ({
        disabled: !record.instructionDocId,
      }),
    };

    const headColumns = [
      {
        title: intl.get(`${modelPrompt}.instructionDocNum`).d('采购订单号'),
        dataIndex: 'instructionDocNum',
        width: 170,
      },
      {
        title: intl.get(`${modelPrompt}.siteName`).d('工厂'),
        dataIndex: 'siteName',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.instructionDocStatusMeaning`).d('单据状态'),
        dataIndex: 'instructionDocStatusMeaning',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.supplierCode`).d('供应商编码'),
        dataIndex: 'supplierCode',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.supplierName`).d('供应商名称'),
        dataIndex: 'supplierName',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.creationDate`).d('创建日期'),
        dataIndex: 'creationDate',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.lastUpdatedByName`).d('操作人'),
        dataIndex: 'lastUpdatedByName',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.remark`).d('备注'),
        dataIndex: 'remark',
        width: 170,
        align: 'center',
      },
    ];
    return (
      <EditTable
        loading={fetchHeadLoading}
        rowKey="instructionDocId"
        rowSelection={rowHeadSelection}
        scroll={{ x: tableScrollWidth(headColumns, 50), y: 210 }}
        dataSource={headList}
        columns={headColumns}
        onRow={(record, index) => {
            return {
              onClick: () => {
                this.forRowHeadClick(record, index);
              },
            };
          }}
        pagination={headPagination || {}}
        onChange={this.forHandleTableHeadChange}
        rowClassName={this.forHandleClickRow}
        bordered
      />
    );
  }
}
