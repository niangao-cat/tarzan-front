/**
 * ListTable - 表格
 * @date: 2019-8-6
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Table } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';

const modelPrompt = 'tarzan.inventory.journalQuery.model.journalQuery';

@formatterCollections({
  code: ['tarzan.inventory.journalQuery'], // code 为 [服务].[功能]的字符串数组
})
/**
 * 表格
 * @extends {Component} - React.Component
 * @reactProps {Object} journalQuery - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ journalQuery, loading }) => ({
  journalQuery,
  fetchLoading: loading.effects['journalQuery/queryBillList'],
}))
export default class ListTable extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagination) {
    const { onSearch } = this.props;
    onSearch(pagination);
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      journalQuery: { queryList = [], queryPagination = {} },
      fetchLoading,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
        width: 150,
        dataIndex: 'materialCode',
        align: 'left',
        fixed: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.materialDesc`).d('物料描述'),
        width: 160,
        dataIndex: 'materialDesc',
        align: 'left',
        fixed: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.eventTime`).d('库存变化时间'),
        dataIndex: 'eventTime',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.changeQuantity`).d('库存变化数量'),
        dataIndex: 'changeQuantity',
        width: 120,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.onhandQuantity`).d('库存变化后数量'),
        dataIndex: 'onhandQuantity',
        width: 130,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.warehouseCode`).d('仓库编码'),
        dataIndex: 'warehouseCode',
        width: 120,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.warehouseDesc`).d('仓库描述'),
        dataIndex: 'warehouseDesc',
        width: 160,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.locatorCode`).d('库位编码'),
        dataIndex: 'locatorCode',
        width: 120,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.locatorDesc`).d('库位描述'),
        dataIndex: 'locatorDesc',
        width: 160,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.lotCode`).d('批次号'),
        dataIndex: 'lotCode',
        width: 90,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.ownerType`).d('所有者类型'),
        dataIndex: 'ownerTypeDesc',
        width: 110,
        align: 'left',
        render: val => val || '自有',
      },
      {
        title: intl.get(`${modelPrompt}.ownerCode`).d('所有者编码'),
        dataIndex: 'ownerCode',
        width: 100,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.ownerDesc`).d('所有者描述'),
        dataIndex: 'ownerDesc',
        width: 160,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.eventType`).d('事件类型'),
        dataIndex: 'eventType',
        width: 150,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.eventTypeDesc`).d('事件类型描述'),
        dataIndex: 'eventTypeDesc',
        width: 120,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.eventId`).d('事件主键'),
        dataIndex: 'eventId',
        width: 90,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.eventByUserName`).d('操作人'),
        dataIndex: 'eventByUserName',
        width: 90,
        align: 'left',
      },
    ];
    return (
      <Fragment>
        <Table
          loading={fetchLoading}
          rowKey="userRightsDescId"
          dataSource={queryList}
          columns={columns}
          pagination={queryPagination || {}}
          onChange={this.handleTableChange}
          scroll={{ x: 1660 }}
          bordered
        />
      </Fragment>
    );
  }
}
