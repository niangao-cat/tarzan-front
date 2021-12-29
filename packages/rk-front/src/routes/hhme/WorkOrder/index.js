/**
 * WorkOrder - 工单派工平台
 * @date: 2020/03/03
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Button } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty } from 'lodash';

import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
// import isEmpty from 'lodash/isEmpty';
import List from './List';
// import PerformanceList from './PerformanceList';
import FilterForm from './FilterForm';
import ProductionLines from './ProductionLines';
import styles from './index.less';
import ModalContainer, { registerContainer } from '../../../components/Modal/ModalContainer';
import NumberOfSetsDrawer from './NumberOfSetsDrawer';

// const modelPrompt = 'tarzan.hmes.message.model.message';

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 消息维护
 * @extends {Component} - React.Component
 * @reactProps {Object} errorMessage - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ workOrder, loading }) => ({
  workOrder,
  fetchBaseInfoLoading: loading.effects['workOrder/fetchBaseInfo'],
  fetchProdLinesLoading: loading.effects['workOrder/fetchProdLines'],
  deliveryDemandLoading: loading.effects['workOrder/deliveryDemand'],
  fetchNumberSetsLoading: loading.effects['workOrder/fetchNumberSets'],
  fetchSuiteDetailLoading: loading.effects['workOrder/fetchSuiteDetail'],
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: 'tarzan.hmes.message',
})
export default class WorkOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandDrawer: false,
      // eslint-disable-next-line react/no-unused-state
      woRecord: {},
    };
    this.initData();
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // this.handleSearch();
    // this.handleSearchProdLines();
    dispatch({
      type: 'workOrder/fetchLimitDate',
    });
    dispatch({
      type: 'workOrder/fetchDefaultSite',
    });
  }

  @Bind()
  initData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'workOrder/updateState',
      payload: {
        list: [],
        weekList: [],
        prodLines: [],
        prodLinesWeekList: [],
      },
    });
  }

  @Bind()
  handleSearch() {
    const { dispatch } = this.props;
    const value = this.formDom ? this.formDom.getFieldsValue() : {};
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    const { workOrderId, ...info } = filterValue;
    const workOrderIdList = !isEmpty(workOrderId) ? workOrderId.split(',') : [];
    dispatch({
      type: 'workOrder/updateState',
      payload: {
        weekList: [],
        list: [],
      },
    });
    dispatch({
      type: 'workOrder/fetchBaseInfo',
      payload: {
        ...info,
        workOrderIdList,
        // prodLineId: 40215.1,
      },
    });
  }

  @Bind()
  handleSearchProdLines() {
    const { dispatch } = this.props;
    const value = this.formDom ? this.formDom.getFieldsValue() : {};
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    dispatch({
      type: 'workOrder/fetchProdLines',
      payload: {
        ...filterValue,
      },
    });
  }

  @Bind()
  getEditTableData(list) {
    const newList = list.map(e => {
      const key = `${e.workOrderNum}#${e.workcellCode}`;
      const obj = {};
      const inputDom = document.getElementsByClassName(key);
      for (let i = 0; i < inputDom.length; i++) {
        const dateKey = inputDom[i].classList[0];
        const { value } = inputDom[i];
        obj[dateKey] = value;
      }

      return {
        ...e,
        ...obj,
      };
    });
    return newList;
  }

  @Bind()
  handleSave(info) {
    const {
      dispatch,
      workOrder: {
        searchForm,
      },
    } = this.props;
    const newInfo = info.map(e => ({
      prodLineId: searchForm.prodLineId,
      ...e,
    }));
    dispatch({
      type: 'workOrder/save',
      payload: newInfo,
    }).then(res => {
      if (res) {
        this.handleSearch();
        // this.handleSearchProdLines();
      }
    });
  }

  @Bind()
  getSum(dateName, list) {
    let sum = 0;
    list.forEach(e => {
      if (e[dateName]) {
        sum += e[dateName];
      }
    });
    return sum;
  }

  @Bind()
  handleResetData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'workOrder/updateState',
      payload: {
        weekList: [],
        list: [],
      },
    });
    this.handleSearch();
  }

  @Bind()
  handleDeliveryDemand() {
    const { dispatch } = this.props;
    dispatch({
      type: 'workOrder/deliveryDemand',
    }).then(res => {
      if (res && res.failed) {
        notification.error(res.message);
      } else {
        notification.success();
      }
    });
  }

  // 查看齐套数量
  @Bind()
  handleNumberOfSetsDrawer(record, flag) {
    if(flag) {
      this.handleFetchSuiteList({}, record);
    }
    this.setState({ woRecord: record, expandDrawer: flag });
  }

  // 查询齐套数量
  @Bind()
  fetchNumberSets() {
    const { dispatch, tenantId, workOrder: { list = [], siteInfo } } = this.props;
    const paramList = [];
    list.forEach(ele => {
      paramList.push({
        workOrderId: ele.workOrderId,
        workcellId: ele.workcellId,
      });
    });
    dispatch({
      type: 'workOrder/fetchNumberSets',
      payload: {
        paramList,
        list,
        siteId: siteInfo.siteId,
        tenantId,
      },
    });
  }

  @Bind()
  handleFetchSuiteList(page = {}, record) {
    const { dispatch, tenantId, workOrder: { siteInfo } } = this.props;
    const value = this.drawerForm ? this.drawerForm.getFieldsValue() : {};
    const filterValue = isUndefined(this.drawerForm) ? {} : filterNullValueObject(value);
    const { workOrderId, workcellId } = record;
    dispatch({
      type: 'workOrder/fetchSuiteDetail',
      payload: {
        page: isEmpty(page) ? {} : page,
        workOrderId,
        workcellId,
        siteId: siteInfo.siteId,
        tenantId,
        ...filterValue,
      },
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      fetchBaseInfoLoading,
      fetchProdLinesLoading,
      deliveryDemandLoading,
      fetchNumberSetsLoading,
      tenantId,
      fetchSuiteDetailLoading,
      workOrder: { list = [], weekList = [], prodLines = [], prodLinesWeekList = [], limitDate, suiteList, suitePagination },
    } = this.props;
    const { expandDrawer, woRecord } = this.state;
    const allProductSegmentTypeList = list.map(e => e.productSegment);
    const productSegmentTypeList = [];
    allProductSegmentTypeList.forEach((val, index) => {
      if (productSegmentTypeList.indexOf(allProductSegmentTypeList[index]) === -1) {
        productSegmentTypeList.push(allProductSegmentTypeList[index]);
      }
    });
    const filterProps = {
      tenantId,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.handleSearch,
    };
    const listProps = {
      limitDate,
      weekList,
      loading: fetchBaseInfoLoading || fetchNumberSetsLoading,
      dataSource: list,
      onSearch: this.handleSearch,
      onSave: this.handleSave,
      onNumberOfSetsDrawer: this.handleNumberOfSetsDrawer,
    };
    const numberOfSetsDrawerProps = {
      expandDrawer,
      woRecord,
      dataSource: suiteList,
      pagination: suitePagination,
      loading: fetchSuiteDetailLoading,
      onFetchSuiteList: this.handleFetchSuiteList,
      onNumberOfSetsDrawer: this.handleNumberOfSetsDrawer,
      onRef: node => {
        this.drawerForm = node.props.form;
      },
    };
    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.hmes.message.title.list').d('工单派工平台')}>
          <Button loading={deliveryDemandLoading || false} type="default" onClick={() => this.handleDeliveryDemand()}>
            汇总配送需求
          </Button>
          <Button loading={fetchProdLinesLoading || false} type="default" onClick={() => this.handleSearchProdLines()}>
            汇总产线负荷
          </Button>
          <Button
            loading={fetchNumberSetsLoading || false}
            type="default"
            onClick={() => this.fetchNumberSets()}
            disabled={list.length === 0}
          >
            汇总齐套数量
          </Button>
          {/* <Button icon="save" type="primary" onClick={() => this.handleSave()}>
            {intl.get('tarzan.hmes.message.button.save').d('保存')}
          </Button>
          <Button type="default" onClick={() => this.handleResetData()}>
            重置数据
          </Button> */}
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <div className={styles['work-table']}>
            <List {...listProps} />
            {/* <PerformanceList {...listProps} /> */}
          </div>
          <Spin spinning={fetchProdLinesLoading || false}>
            {prodLines.map(e => {
              return <ProductionLines dataSource={e} weekList={prodLinesWeekList} />;
            })}
          </Spin>
        </Content>
        <ModalContainer ref={registerContainer} />
        {expandDrawer && <NumberOfSetsDrawer {...numberOfSetsDrawerProps} />}
      </React.Fragment>
    );
  }
}
