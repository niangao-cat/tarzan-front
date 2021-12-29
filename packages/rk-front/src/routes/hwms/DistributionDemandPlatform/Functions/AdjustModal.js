/**
 * @feature: VMI采购计划平台 - Components层 - 弹窗 - 调整
 * @author: iXiaoChuan <jianchuan.zhang@hand-china.com>
 * @time: 2020/4/10 1:25 上午
 * @version: 1.0.0
 * @copyright Copyright (c) 2020, Hand
 */
import React from 'react';
import { Table, Button } from 'choerodon-ui/pro';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import { handleC7nTableOnRow } from '@/utils/utils';
// eslint-disable-next-line import/no-cycle
import { showBatchAdjustModal } from './index';

@connect()
export default class AdjustModal extends React.Component {
  /**
   * 渲染抽离 - renderTableColumns: 表格列
   */
  @Bind()
  renderTableColumns() {
    return [
      {
        name: 'demandNumber',
        width: 150,
      },
      {
        label: '物料',
        name: 'itemCode',
        width: 150,
        editor: false,
      },
      {
        label: '物料描述',
        name: 'itemDesc',
        width: 150,
        tooltip: 'overflow',
      },
      {
        label: '合同号',
        name: 'contractNum',
        width: 150,
        editor: false,
      },
      {
        label: '计划项',
        name: 'planNumSeq',
        width: 150,
        editor: false,
      },
      {
        label: '最晚到货日期',
        name: 'receiveDate',
        width: 150,
        editor: false,
      },
      {
        label: '数量',
        name: 'qty',
        width: 80,
      },
      {
        label: '供应商',
        name: 'supplier',
        width: 150,
        editor: true,
      },
      {
        name: 'supplierName',
        width: 150,
      },
      {
        label: '军检',
        name: 'inspectionFlag',
        width: 80,
        editor: false,
        renderer: ({ value }) => {
          return <span>{value === 'Y' ? '是' : null}</span>;
        },
      },
      {
        label: '特殊车型指定',
        name: 'specialFlag',
        width: 130,
        editor: false,
        renderer: ({ value }) => {
          return <span>{value === 'Y' ? '是' : null}</span>;
        },
      },
      {
        label: '试制跟单',
        name: 'trialFlag',
        width: 100,
        editor: false,
        renderer: ({ value }) => {
          return <span>{value === 'Y' ? '是' : null}</span>;
        },
      },
      {
        label: '成套组合',
        name: 'suitName',
        width: 100,
        editor: false,
      },
      { name: 'editorFlag' },
      { name: 'demandApprovalStatusMeaning' },
      {
        name: 'approvalDate',
        width: 150,
      },
      {
        name: 'approvalRemark',
        tooltip: 'overflow',
      },
      {
        label: '备注',
        name: 'remark',
        width: 150,
        editor: true,
      },
    ];
  }

  get button() {
    return [
      'query',
      <Button
        key="batchAdjustSupplier"
        icon="mode_edit"
        color="primary"
        funcType="flat"
        onClick={() =>
          showBatchAdjustModal({
            dataSet: this.props.dataSet,
            onOk: this.handleBatchAdjustSupplier,
          })
        }
      >
        批量调整
      </Button>,
    ];
  }

  // 保存批量调整供应商
  @Bind()
  handleBatchAdjustSupplier(dataSet, formDs) {
    dataSet.selected.forEach((record) => {
      const supplier = formDs.get(0).get('supplier');
      record.set('supplier', supplier);
    });
  }

  render() {
    const { dataSet } = this.props;

    // 1.Table Props
    const listTableProps = {
      size: 'small',
      dataSet,
      // selectionMode: 'none',
      columns: this.renderTableColumns(),
      buttons: this.button,
      onRow: handleC7nTableOnRow,
    };

    return (
      <div className="haps-vmi-adujst-table">
        <Table {...listTableProps} />
      </div>
    );
  }
}
