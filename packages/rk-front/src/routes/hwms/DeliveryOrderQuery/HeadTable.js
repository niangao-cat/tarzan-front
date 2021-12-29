/**
 * LineTable - 头Table
 * @date: 2020-07-29
 * @author: wxy <xinyu.wang02@hand-china.com>
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

const modelPrompt = 'hwms.model.deliveryOrderQuery';

/**
 * 头Table
 * @extends {Component} - React.Component
 * @reactProps {Object} deliveryOrderQuery - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ deliveryOrderQuery }) => ({
  deliveryOrderQuery,
  tenantId: getCurrentOrganizationId(),
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'hwms.deliveryOrderQuery',
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
    const { headList, headPagination, rowSelection, loading } = this.props;

    const headColumns = [
      {
        title: intl.get(`${modelPrompt}.instructionDocNum`).d('配送单号'),
        dataIndex: 'instructionDocNum',
        width: 150,
        render: (val, record) => (
          <span className="action-link">
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a>
                {record.instructionDocNum}
              </a>
            )}
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.instructionDocNum`).d('是否备齐'),
        dataIndex: 'suiteFlag',
        width: 90,
        render: (val) => val === 'Y' ? '是' : '否',
      },
      {
        title: intl.get(`${modelPrompt}.instructionDocStatus`).d('配送单状态'),
        dataIndex: 'instructionDocStatusMeaning',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.siteId`).d('工厂'),
        dataIndex: 'siteId',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.productionLine`).d('产线'),
        dataIndex: 'productionLine',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.productionLineName`).d('产线描述'),
        dataIndex: 'productionLineName',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.workCell`).d('工段'),
        dataIndex: 'workCell',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.workCellName`).d('工段描述'),
        dataIndex: 'workCellName',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.toLocatorId`).d('目标仓库'),
        dataIndex: 'toLocatorCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.toLocatorId`).d('需求时间'),
        dataIndex: 'demandTime',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.supplierCode`).d('备料开始时间'),
        dataIndex: 'menuCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.supplierCode`).d('备料完成时间'),
        dataIndex: 'menuCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.remark`).d('是否为补料单'),
        dataIndex: 'replenishmentFlag',
        render: (val) => val === 'Y' ? '是' : '否',
      },
      {
        title: intl.get(`${modelPrompt}.remark`).d('补料单号'),
        dataIndex: 'replenishmentNum',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.remark`).d('备注'),
        dataIndex: 'remark',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.supplierCode`).d('创建人'),
        dataIndex: 'lastUpdatedByName',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.supplierCode`).d('创建时间'),
        dataIndex: 'creationDate',
        width: 170,
      },
      {
        title: intl.get(`${modelPrompt}.supplierCode`).d('最后更新人'),
        dataIndex: 'createdByName',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.supplierCode`).d('最后更新时间'),
        dataIndex: 'lastUpdateDate',
        width: 170,
      },
    ];
    return (
      <EditTable
        loading={loading}
        rowKey="instructionDocId"
        rowSelection={rowSelection}
        scroll={{ x: tableScrollWidth(headColumns, 180), y: 300 }}
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
