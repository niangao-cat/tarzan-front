/*
 * @Description: 库龄报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-11-18 09:40:08
 * @LastEditTime: 2020-11-19 16:13:01
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Button, Table } from 'hzero-ui';
import { Header, Content } from 'components/Page';
import uuid from 'uuid/v4';
import {
  getEditTableData,
  filterNullValueObject,
  tableScrollWidth,
} from 'utils/utils';
import notification from 'utils/notification';
import { isEmpty } from 'lodash';
import FilterForm from './FilterForm';
import StockAgeInterval from './StockAgeInterval';


@connect(({ stockAgeReport, loading }) => ({
  stockAgeReport,
  fetchListLoading: loading.effects['stockAgeReport/fetchStockAgeData'],
}))
export default class StockAgeQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    // 获取默认站点
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'stockAgeReport/getSiteList',
      payload: {
        tenantId,
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'stockAgeReport/updateState',
      payload: {
        interval: [],
        stockAgeData: [],
        stockAgeDataPagination: {},
      },
    });
  }

  @Bind
  fetchStockAgeData(fields = {}) {
    const {
      dispatch,
      stockAgeReport: { interval = [] },
    } = this.props;
    if (interval.length === 0) {
      return notification.error({ message: '请选择库龄区域！' });
    }
    const paramsArr = [];
    interval.forEach(ele => {
      paramsArr.push(`${ele.from}-${ele.to}`);
    });
    const fieldsValue = (this.stockAgeForm && filterNullValueObject(this.stockAgeForm.getFieldsValue())) || {};
    dispatch({
      type: 'stockAgeReport/fetchStockAgeData',
      payload: {
        ...fieldsValue,
        libraryAgeList: paramsArr,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  // 打开或关闭库龄区间modal
  @Bind
  handleStockAge(flag) {
    this.setState({ visible: flag });
  }

  // 新建库龄区间
  @Bind
  handleCreateInterval() {
    const {
      dispatch,
      stockAgeReport: { interval = [] },
    } = this.props;
    dispatch({
      type: 'stockAgeReport/updateState',
      payload: {
        interval: [
          ...interval,
          {
            rowId: uuid(),
            _status: 'create',
          },
        ],
      },
    });
  }

  // 删除库龄区间
  @Bind
  deleteIntervalData(record, index) {
    const {
      dispatch,
      stockAgeReport: { interval = [] },
    } = this.props;
    interval.splice(index, 1);
    dispatch({
      type: 'stockAgeReport/updateState',
      payload: {
        interval,
      },
    });
  }

  // 保存库龄区间
  @Bind
  handleSaveIntervalData() {
    const {
      dispatch,
      stockAgeReport: { interval = [] },
    } = this.props;
    const params = getEditTableData(interval, ['rowId']);
    if (params.length === 0) {
      return;
    }
    for (let i = 1; i < params.length; i++) {
      if (params[i - 1].to >= params[i].from || params[i - 1].from >= params[i].to) {
        return notification.error({ message: '当前存在交叉区间！' });
      }
    }
    dispatch({
      type: 'stockAgeReport/updateState',
      payload: {
        interval: params,
      },
    });
    this.handleStockAge(false);
  }

  // 渲染 界面布局
  render() {
    const {
      fetchListLoading,
      stockAgeReport: {
        stockAgeData = [],
        stockAgeDataPagination = {},
        interval = [],
        defaultSite = {},
        dynamicColumns = [],
      },
    } = this.props;
    const { visible } = this.state;
    const filterFormProps = {
      defaultSite,
      onRef: node => {
        this.stockAgeForm = node.props.form;
      },
      onSearch: this.fetchStockAgeData,
    };
    const stockAgeIntervalProps = {
      visible,
      dataSource: interval,
      handleStockAge: this.handleStockAge,
      handleCreateInterval: this.handleCreateInterval,
      deleteIntervalData: this.deleteIntervalData,
      handleSaveIntervalData: this.handleSaveIntervalData,
    };
    const columns = [
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        align: 'left',
        width: 100,
      },
      {
        title: '物料描述',
        dataIndex: 'materialName',
        align: 'left',
        width: 120,
      },
      {
        title: '批次',
        dataIndex: 'lot',
        align: 'center',
        width: 90,
      },
      {
        title: '仓库',
        dataIndex: 'parentLocatorCode',
        align: 'center',
        width: 80,
      },
      {
        title: '货位',
        dataIndex: 'locatorCode',
        align: 'center',
        width: 80,
      },
      {
        title: '单位',
        dataIndex: 'uomCode',
        align: 'center',
        width: 80,
      },
    ];
    return (
      <React.Fragment>
        <Header title='库龄查询' backPath="/hwms/stock-age-report">
          <Button
            type="primary"
            onClick={() => this.handleStockAge(true)}
          >
            库龄区间
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterFormProps} />
          <Table
            bordered
            dataSource={stockAgeData}
            columns={columns.concat(dynamicColumns)}
            scroll={{ x: tableScrollWidth(columns) }}
            pagination={stockAgeDataPagination}
            onChange={page => this.fetchStockAgeData(page)}
            loading={fetchListLoading}
          />
          {visible && <StockAgeInterval {...stockAgeIntervalProps} />}
        </Content>
      </React.Fragment>
    );
  }
}
