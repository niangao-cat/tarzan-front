/*
 * @Description: 工序在制
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-03-23 11:42:19
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-07-08 20:31:14
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import { Spin } from 'hzero-ui';
import FilterForm from './FilterForm';
import ProcessAxis from './Component/ProcessAxis';
import { getSiteId } from '@/utils/utils';

@connect(({ processInProcess }) => ({
  processInProcess,
}))
export default class ProcessInProcess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingProcessAxis: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'processInProcess/fetchWorkShop',
      payload: {
        siteId: getSiteId(),
      },
    });
    dispatch({
      type: 'processInProcess/getSiteList',
    });
  }

  // 查询工序数据
  @Bind()
  fetchProcessInProcess(params = {}) {
    const { dispatch } = this.props;
    this.setState({ loadingProcessAxis: true });
    dispatch({
      type: 'processInProcess/fetchProcessInProcess',
      payload: {
        ...params,
        siteId: getSiteId(),
      },
    }).then(() => {
      this.setState({ loadingProcessAxis: false });
    });
  }

  @Bind()
  handleSearch(values) {
    this.fetchProcessInProcess(values);
  }

  render() {
    const {
      processInProcess: {
        workShopList = [],
        productionLineList = [],
        processDataList = [],
        defaultSite = {},
      },
    } = this.props;
    return (
      <Fragment>
        <Header title="工序在制查询" />
        <Content style={{ padding: '0px' }}>
          <FilterForm
            workShopList={workShopList}
            fetchProductionLine={this.fetchProductionLine}
            productionLineList={productionLineList}
            onSearch={this.handleSearch}
            defaultSite={defaultSite}
          />
          <Spin spinning={this.state.loadingProcessAxis}>
            <ProcessAxis processDataList={processDataList} />
          </Spin>
        </Content>
      </Fragment>
    );
  }
}
