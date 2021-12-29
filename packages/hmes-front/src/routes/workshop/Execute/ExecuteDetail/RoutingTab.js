import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Checkbox } from 'hzero-ui';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.workshop.execute.model.execute';
/**
 * 计划属性
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ execute, loading }) => ({
  execute,
  loading: loading.effects['execute/fetchRoutingList'],
}))
export default class RoutingTab extends PureComponent {
  onTableChange = (pagination = {}) => {
    const { dispatch, eoRouterId } = this.props;
    dispatch({
      type: 'execute/fetchRoutingList',
      payload: {
        routerId: eoRouterId,
        page: {
          ...pagination,
        },
      },
    });
  };

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      execute: { routingList = [], routingPagination = {} },
      loading,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.sequence`).d('步骤顺序'),
        width: 150,
        dataIndex: 'sequence',
      },
      {
        title: intl.get(`${modelPrompt}.step`).d('步骤识别码'),
        width: 150,
        dataIndex: 'step',
      },
      {
        title: intl.get(`${modelPrompt}.routerStepTypeDesc`).d('步骤类型'),
        width: 150,
        dataIndex: 'routerStepTypeDesc',
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('步骤描述'),
        dataIndex: 'description',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.entryStepFlag`).d('入口步骤'),
        dataIndex: 'entryStepFlag',
        width: 100,
        align: 'center',
        render: val => <Checkbox checked={val === 'Y'} disabled />,
      },
      {
        title: intl.get(`${modelPrompt}.doneStepFlag`).d('完成步骤'),
        dataIndex: 'doneStepFlag',
        width: 100,
        align: 'center',
        render: val => <Checkbox checked={val === 'Y'} disabled />,
      },
      {
        title: intl.get(`${modelPrompt}.keyStepFlag`).d('关键步骤'),
        dataIndex: 'keyStepFlag',
        width: 100,
        align: 'center',
        render: val => <Checkbox checked={val === 'Y'} disabled />,
      },
      {
        title: intl.get(`${modelPrompt}.nextStepName`).d('下一步骤'),
        dataIndex: 'nextStepName',
        width: 100,
      },
    ];
    return (
      <Table
        columns={columns}
        dataSource={routingList}
        pagination={routingPagination}
        onChange={this.onTableChange}
        loading={loading}
        bordered
      />
    );
  }
}
