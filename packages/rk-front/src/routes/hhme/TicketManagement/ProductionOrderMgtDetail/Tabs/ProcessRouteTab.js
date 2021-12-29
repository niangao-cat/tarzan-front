/**
 * containerType - 容器类型维护
 * @date 2019-12-18
 * @author 许碧婷 <biting.xu@hand-china.com>
 * @version 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component, Fragment } from 'react';
import { Table, Checkbox } from 'hzero-ui';
import { connect } from 'dva';
import notification from 'utils/notification';
import intl from 'utils/intl';
import { isArray, isEmpty } from 'lodash';

const modelPrompt = 'tarzan.workshop.productionOrderMgt.model.productionOrderMgt';

@connect(({ productionOrderMgt, loading }) => ({
  productionOrderMgt,
  loading:
    loading.effects[
      ('productionOrderMgt/fetchProcessRouteList', 'productionOrderMgt/fetchSubStepList')
    ],
}))
export default class ProcessRouteTab extends Component {
  // 表格展开或关闭
  onExpandTable = (expanded, record) => {
    const {
      dispatch,
      workOrderId,
      productionOrderMgt: { expendedRowList = [], processRouteList = [] },
    } = this.props;
    const RowList = expendedRowList;
    let rowKey = record.eventFlag ? 'event' : 'request';
    rowKey = `${rowKey}_${record.routerStepId}`;
    if (expanded) {
      RowList.push(rowKey);
    } else {
      this.arrayRemoveItem(RowList, rowKey);
    }

    if (isArray(record.children) && record.children.length === 0) {
      dispatch({
        type: 'productionOrderMgt/fetchSubStepList',
        payload: {
          workOrderId,
          routerStepId: record.routerStepId,
        },
      }).then(res => {
        if (res && res.success) {
          const list = res.rows || [];
          for (const process in processRouteList) {
            if (processRouteList[process].routerStepId === record.routerStepId) {
              processRouteList[process].children = list;
              break;
            }
          }
          dispatch({
            type: 'productionOrderMgt/updateState',
            payload: {
              processRouteList,
              expandedRowList: RowList,
            },
          });
        } else if (res && !res.success) {
          notification.error({
            message: res.message,
          });
        }
      });
    } else {
      dispatch({
        type: 'productionOrderMgt/updateState',
        payload: {
          expandedRowList: RowList,
        },
      });
    }
  };

  // 数组的删除
  arrayRemoveItem = (arr, delVal) => {
    if (arr instanceof Array) {
      const index = arr.indexOf(delVal);
      if (index > -1) {
        arr.splice(index, 1);
      }
    }
  };

  handlePagination = pagination => {
    const { dispatch, workOrderId, routerId } = this.props;

    dispatch({
      type: 'productionOrderMgt/fetchProcessRouteList',
      payload: {
        workOrderId,
        routerId,
        page: isEmpty(pagination) ? {} : pagination,
      },
    });
  };

  render() {
    const {
      loading = false,
      productionOrderMgt: {
        processRouteList = [],
        processRoutePagination = {},
        expandedRowList = [],
        StepTypeOptions = [],
      },
    } = this.props;

    const columns = [
      {
        title: intl.get(`${modelPrompt}.sequence`).d('步骤顺序'),
        width: 140,
        dataIndex: 'sequence',
        align: 'left',
        fixed: true,
      },
      {
        title: intl.get(`${modelPrompt}.step`).d('步骤识别码'),
        width: 140,
        dataIndex: 'step',
        align: 'left',
        fixed: true,
      },
      {
        title: intl.get(`${modelPrompt}.routerStepType`).d('步骤类型'),
        width: 140,
        dataIndex: 'routerStepType',
        align: 'left',
        fixed: true,
        render: val => {
          const filters = StepTypeOptions.filter(step => step.typeCode === val);
          if (isArray(filters) && filters.length > 0) {
            return <span>{filters[0].description}</span>;
          }
          return val;
        },
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('步骤描述'),
        width: 140,
        dataIndex: 'description',
        align: 'left',
        fixed: true,
      },
      {
        title: intl.get(`${modelPrompt}.completedQty`).d('完成数量'),
        width: 140,
        dataIndex: 'completedQty',
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.queueQty`).d('排队数量'),
        width: 140,
        dataIndex: 'queueQty',
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.workingQty`).d('工作中数量'),
        // width: 140,
        dataIndex: 'workingQty',
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.completePendingQty`).d('完成暂存数量'),
        width: 140,
        dataIndex: 'completePendingQty',
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.entryStepFlag`).d('入口步骤'),
        width: 140,
        dataIndex: 'entryStepFlag',
        align: 'center',
        render: val => <Checkbox checked={val === 'Y'} disabled />,
      },
      {
        title: intl.get(`${modelPrompt}.keyStepFlag`).d('关键步骤'),
        width: 140,
        dataIndex: 'keyStepFlag',
        align: 'center',
        render: val => <Checkbox checked={val === 'Y'} disabled />,
      },
      {
        title: intl.get(`${modelPrompt}.doneStepFlag`).d('完成步骤'),
        width: 140,
        dataIndex: 'doneStepFlag',
        align: 'center',
        render: val => <Checkbox checked={val === 'Y'} disabled />,
      },
      /*  {
        title: intl.get(`${modelPrompt}.queueDecisionTypeDesc`).d('步骤选择策略描述'),
        width: 140,
        dataIndex: 'queueDecisionTypeDesc',
        align: 'left',
      }, */
    ];

    return (
      <Fragment>
        <Table
          loading={loading}
          bordered
          columns={columns}
          dataSource={processRouteList}
          expandedRowKeys={expandedRowList}
          onExpand={this.onExpandTable}
          pagination={{ ...processRoutePagination, pageSizeOptions: ['10', '50', '100', '200', '500', '1000'], defaultPageSize: '1000' }}
          rowKey={record => {
            let type = record.eventFlag ? 'event' : 'request';
            type = `${type}_${record.routerStepId}`;
            return type;
          }}
          onChange={page => this.handlePagination(page)}
        />
      </Fragment>
    );
  }
}
