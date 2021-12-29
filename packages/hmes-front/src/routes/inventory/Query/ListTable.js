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
import ReserveDetailsDrawer from './ReserveDetailsDrawer';

const modelPrompt = 'tarzan.inventory.query.model.query';

@formatterCollections({
  code: ['tarzan.inventory.query'], // code 为 [服务].[功能]的字符串数组
})
/**
 * 表格
 * @extends {Component} - React.Component
 * @reactProps {Object} query - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ query, loading }) => ({
  query,
  fetchLoading: loading.effects['query/queryBillList'],
}))
export default class ListTable extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      reserveDetailsDrawerVisible: false,
      reserveDetailDrawerInfo: {},
    };
  }

  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagination) {
    const {
      dispatch,
      query: { queryCriteria = {}, checkedNodesInfoList = [] },
    } = this.props;
    dispatch({
      type: 'query/queryBillList',
      payload: {
        ...queryCriteria,
        orgList: checkedNodesInfoList,
        page: pagination,
      },
    });
    // onSearch(pagination);
  }

  /**
   * 查看预留库存详情抽屉
   */
  @Bind()
  showReserveStockDetails(record) {
    this.setState({
      reserveDetailsDrawerVisible: true,
      reserveDetailDrawerInfo: record,
    });
    this.props.dispatch({
      type: 'query/getReserveTableList',
      payload: {
        ...record,
      },
    });
  }

  // 关闭编辑抽屉
  @Bind()
  handleDrawerCancel() {
    this.setState({ reserveDetailsDrawerVisible: false });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { reserveDetailDrawerInfo } = this.state;
    const { query, fetchLoading } = this.props;
    const { queryList = [], queryPagination = {} } = query;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.siteCode`).d('站点'),
        width: 150,
        dataIndex: 'siteCode',
      },
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
        width: 150,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.materialDesc`).d('物料描述'),
        width: 120,
        align: 'left',
        dataIndex: 'materialDesc',
      },
      {
        title: intl.get(`${modelPrompt}.locatorCode`).d('库位编码'),
        dataIndex: 'locatorCode',
        width: 160,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.locatorDesc`).d('库位描述'),
        dataIndex: 'locatorDesc',
        width: 160,
        align: 'left',
        // align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.lotCode`).d('批次'),
        dataIndex: 'lotCode',
        width: 90,
        align: 'left',
        // align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.onhandQty`).d('库存'),
        dataIndex: 'onhandQty',
        width: 120,
        align: 'left',
        // align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.availableQty`).d('可用库存'),
        dataIndex: 'availableQty',
        width: 130,
        align: 'left',
        // align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.holdQty`).d('预留库存'),
        dataIndex: 'holdQty',
        width: 130,
        align: 'left',
        // align: 'center',
        render: (val, record) =>
          val === 0 ? (
            val
          ) : (
            <span className="action-link">
              <a onClick={() => this.showReserveStockDetails(record)}>{val}</a>
            </span>
          ),
      },
      {
        title: intl.get(`${modelPrompt}.ownerTypeDesc`).d('所有者类型'),
        dataIndex: 'ownerTypeDesc',
        width: 110,
        align: 'left',
        render: val => val || '自有',
        // align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.ownerCode`).d('所有者编码'),
        dataIndex: 'ownerCode',
        width: 100,
        align: 'left',
        // align: 'center',
      },
    ];
    // 抽屉参数
    const ReserveDetailsDrawerProps = {
      visible: this.state.reserveDetailsDrawerVisible,
      onCancel: this.handleDrawerCancel,
      initData: reserveDetailDrawerInfo,
    };
    return (
      <Fragment>
        <Table
          loading={fetchLoading}
          // rowKey="userRightsDescId"
          dataSource={queryList}
          columns={columns}
          pagination={queryPagination || {}}
          onChange={this.handleTableChange}
          scroll={{ x: 1420 }}
          bordered
        />
        <ReserveDetailsDrawer {...ReserveDetailsDrawerProps} />
      </Fragment>
    );
  }
}
