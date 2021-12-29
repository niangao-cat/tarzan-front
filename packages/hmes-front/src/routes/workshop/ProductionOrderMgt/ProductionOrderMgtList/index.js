/**
 * ProductionOrderMgt - 生产指令管理
 * @date: 2019-12-17
 * @author: 许碧婷 <biting.xu@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2019, Hand
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import { Button, Table } from 'hzero-ui';
import { isArray } from 'lodash';
import formatterCollections from 'utils/intl/formatterCollections';

import FilterForm from './FilterForm';

const modelPrompt = 'tarzan.workshop.productionOrderMgt.model.productionOrderMgt';

@connect(({ productionOrderMgt, loading }) => ({
  productionOrderMgt,
  loading: loading.effects['productionOrderMgt/fetchProductionList'],
}))
@formatterCollections({ code: 'tarzan.workshop.productionOrderMgt' })
export default class ProductionOrderMgt extends Component {
  componentDidMount = () => {
    const {
      dispatch,
      productionOrderMgt: { searchState = {} },
    } = this.props;
    // WO类型
    dispatch({
      type: 'productionOrderMgt/fetchTypeSelectList',
      payload: {
        module: 'ORDER',
        typeGroup: 'WO_TYPE',
        type: 'workOrderTypeOptions',
      },
    });
    // wo状态
    dispatch({
      type: 'productionOrderMgt/fetchStatusSelectList',
      payload: {
        module: 'ORDER',
        statusGroup: 'WO_STATUS',
        type: 'workOrderStatusOptions',
      },
    });
    // 列表
    dispatch({
      type: 'productionOrderMgt/fetchProductionList',
      payload: {
        ...searchState,
        ...this.filterForm.getFieldsValue(),
      },
    });
  };

  filterRef = (ref = {}) => {
    this.filterForm = (ref.props || {}).form;
  };

  fetchList = (pagination = {}) => {
    const { dispatch } = this.props;

    let params = {};
    if (this.filterForm) {
      this.filterForm.validateFields((err, values) => {
        if (!err) {
          params = values;
        }
      });
    }

    const paramsTrans = params;

    params = {
      ...params,
      planStartTimeFrom: paramsTrans.planStartTimeFrom
        ? moment(paramsTrans.planStartTimeFrom).format('YYYY-MM-DD HH:mm:ss')
        : null,
      planStartTimeTo: paramsTrans.planStartTimeTo
        ? moment(paramsTrans.planStartTimeTo).format('YYYY-MM-DD HH:mm:ss')
        : null,
      planEndTimeFrom: paramsTrans.planEndTimeFrom
        ? moment(paramsTrans.planEndTimeFrom).format('YYYY-MM-DD HH:mm:ss')
        : null,
      planEndTimeTo: paramsTrans.planEndTimeTo
        ? moment(paramsTrans.planEndTimeTo).format('YYYY-MM-DD HH:mm:ss')
        : null,
    };

    dispatch({
      type: 'productionOrderMgt/fetchProductionList',
      payload: {
        ...params,
        page: pagination,
      },
    });
  };

  orderDetail = record => {
    // 打开新页面
    const { history } = this.props;
    const id = record ? record.workOrderId : 'create';
    history.push(`/hmes/workshop/production-order-mgt/detail/${id}`);
  };

  render() {
    const {
      loading,
      productionOrderMgt: {
        productionList = [],
        productionPagination = {},
        workOrderTypeOptions = [],
        workOrderStatusOptions = [],
      },
    } = this.props;

    this.columns = [
      {
        title: intl.get(`${modelPrompt}.workOrderNum`).d('WO编码'),
        width: 180,
        dataIndex: 'workOrderNum',
        fixed: true,
        render: (val, record) => (
          <a className="action-link" onClick={() => this.orderDetail(record)}>
            {val}
          </a>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.siteCode`).d('站点编码'),
        width: 100,
        dataIndex: 'siteCode',
      },
      {
        title: intl.get(`${modelPrompt}.siteName`).d('站点名称'),
        width: 170,
        dataIndex: 'siteName',
      },
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
        width: 100,
        dataIndex: 'materialCode',
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('物料名称'),
        width: 170,
        dataIndex: 'materialName',
      },
      {
        title: intl.get(`${modelPrompt}.workOrderType`).d('WO类型'),
        width: 100,
        dataIndex: 'workOrderType',
        render: val => {
          const desc = workOrderTypeOptions.filter(option => option.typeCode === val);
          if (isArray(desc) && desc.length > 0) {
            return <span>{desc[0].description || ''}</span>;
          }
          return val;
        },
      },
      {
        title: intl.get(`${modelPrompt}.status`).d('WO状态'),
        width: 100,
        dataIndex: 'status',
        render: val => {
          const desc = workOrderStatusOptions.filter(option => option.statusCode === val);
          if (isArray(desc) && desc.length > 0) {
            return <span>{desc[0].description || val}</span>;
          }
          return val;
        },
      },
      {
        title: intl.get(`${modelPrompt}.productionLineCode`).d('生产线编码'),
        width: 100,
        dataIndex: 'productionLineCode',
      },
      {
        title: intl.get(`${modelPrompt}.productionLineName`).d('生产线名称'),
        width: 140,
        dataIndex: 'productionLineName',
      },
      {
        title: intl.get(`${modelPrompt}.planStartTime`).d('计划开始时间'),
        width: 170,
        dataIndex: 'planStartTime',
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.planEndTime`).d('计划结束时间'),
        width: 170,
        dataIndex: 'planEndTime',
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.qty`).d('WO数量'),
        width: 100,
        dataIndex: 'qty',
      },
      {
        title: intl.get(`${modelPrompt}.kitQty`).d('投料套数'),
        width: 100,
        dataIndex: 'kitQty',
      },
      {
        title: intl.get(`${modelPrompt}.releasedQty`).d('下达数量'),
        // width: 100,
        dataIndex: 'releasedQty',
      },
      {
        title: intl.get(`${modelPrompt}.completedQty`).d('完成数量'),
        width: 100,
        dataIndex: 'completedQty',
      },
      {
        title: intl.get(`${modelPrompt}.scrappedQty`).d('报废数量'),
        width: 100,
        dataIndex: 'scrappedQty',
      },
    ];

    return (
      <Fragment>
        <Header title={intl.get(`${modelPrompt}.productionOrderMgt`).d('生产指令管理')}>
          <Button type="primary" icon="plus" onClick={() => this.orderDetail()}>
            {intl.get(`${modelPrompt}.create`).d('新建')}
          </Button>
        </Header>
        <Content>
          <FilterForm onRef={this.filterRef} onSearch={this.fetchList} />
          <Table
            loading={loading}
            rowKey="productionOrderMgt"
            dataSource={productionList}
            pagination={productionPagination}
            columns={this.columns}
            onChange={this.fetchList}
            bordered
          />
        </Content>
      </Fragment>
    );
  }
}
