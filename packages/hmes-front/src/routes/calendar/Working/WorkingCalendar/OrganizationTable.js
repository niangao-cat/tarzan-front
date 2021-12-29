/**
 * OrganizationTable 分配组织抽屉右侧表格
 * @date: 2019-12-10
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.calendar.working.model.working';

@connect(({ working }) => ({
  working,
}))
export default class OrganizationTable extends React.PureComponent {
  // 站点表格行选中事件
  onSiteChange = (selectedRowKeys, selectedRows) => {
    this.props.dispatch({
      type: 'working/updateState',
      payload: {
        siteDeleteList: selectedRows,
        siteDeleteKeys: selectedRowKeys,
      },
    });
  };

  // 区域表格行选中事件
  onAreaChange = (selectedRowKeys, selectedRows) => {
    this.props.dispatch({
      type: 'working/updateState',
      payload: {
        areaDeleteList: selectedRows,
        areaDeleteKeys: selectedRowKeys,
      },
    });
  };

  // 生产线表格行选中事件
  onProlineChange = (selectedRowKeys, selectedRows) => {
    this.props.dispatch({
      type: 'working/updateState',
      payload: {
        prolineDeleteList: selectedRows,
        prolineDeleteKeys: selectedRowKeys,
      },
    });
  };

  // 工作单元表格行选中事件
  onWorkcellChange = (selectedRowKeys, selectedRows) => {
    this.props.dispatch({
      type: 'working/updateState',
      payload: {
        workcellDeleteList: selectedRows,
        workcellDeleteKeys: selectedRowKeys,
      },
    });
  };

  render() {
    const {
      working: {
        siteList = [],
        areaList = [],
        prolineList = [],
        workcellList = [],
        siteDeleteKeys = [],
        areaDeleteKeys = [],
        workcellDeleteKeys = [],
        prolineDeleteKeys = [],
      },
    } = this.props;
    const siteColumns = [
      {
        title: intl.get(`${modelPrompt}.site`).d('站点'),
        dataIndex: 'organizationCode',
      },
      {
        title: '',
        dataIndex: 'organizationTypeDesc',
      },
    ];
    const areaColumns = [
      {
        title: intl.get(`${modelPrompt}.area`).d('区域'),
        dataIndex: 'organizationCode',
      },
      {
        title: '',
        dataIndex: 'organizationTypeDesc',
      },
    ];
    const prolineColumns = [
      {
        title: intl.get(`${modelPrompt}.proline`).d('生产线'),
        dataIndex: 'organizationCode',
      },
      {
        title: '',
        dataIndex: 'organizationTypeDesc',
      },
    ];
    const workcellColumns = [
      {
        title: intl.get(`${modelPrompt}.workcell`).d('工作单元'),
        dataIndex: 'organizationCode',
      },
      {
        title: '',
        dataIndex: 'organizationTypeDesc',
      },
    ];

    const siteRowSelection = {
      onChange: this.onSiteChange,
      selectedRowKeys: siteDeleteKeys,
    };
    const areaRowSelection = {
      onChange: this.onAreaChange,
      selectedRowKeys: areaDeleteKeys,
    };
    const prolineRowSelection = {
      onChange: this.onProlineChange,
      selectedRowKeys: prolineDeleteKeys,
    };
    const workcellRowSelection = {
      onChange: this.onWorkcellChange,
      selectedRowKeys: workcellDeleteKeys,
    };

    return (
      <>
        {siteList.length > 0 && (
          <Table
            rowSelection={siteRowSelection}
            columns={siteColumns}
            dataSource={siteList}
            pagination={false}
            rowKey="calendarOrgRelId"
          />
        )}
        {areaList.length > 0 && (
          <Table
            rowSelection={areaRowSelection}
            columns={areaColumns}
            dataSource={areaList}
            pagination={false}
            rowKey="calendarOrgRelId"
          />
        )}
        {prolineList.length > 0 && (
          <Table
            rowSelection={prolineRowSelection}
            columns={prolineColumns}
            dataSource={prolineList}
            pagination={false}
            rowKey="calendarOrgRelId"
          />
        )}
        {workcellList.length > 0 && (
          <Table
            rowSelection={workcellRowSelection}
            columns={workcellColumns}
            dataSource={workcellList}
            pagination={false}
            rowKey="calendarOrgRelId"
          />
        )}
      </>
    );
  }
}
