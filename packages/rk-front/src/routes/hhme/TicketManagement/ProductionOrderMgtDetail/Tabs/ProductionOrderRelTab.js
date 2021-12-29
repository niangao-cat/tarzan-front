/**
 * ProductionOrderRelList - 容器类型维护
 * @date 2019-12-23
 * @author 许碧婷 <biting.xu@hand-china.com>
 * @version 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { Component } from 'react';
import { Form, Table, Button, Input, Icon } from 'hzero-ui';
import { connect } from 'dva';
import intl from 'utils/intl';
import { isArray, get as chainGet } from 'lodash';
import styles from './index.less';

const modelPrompt = 'tarzan.workshop.productionOrderMgt.model.productionOrderMgt';

@connect(({ productionOrderMgt, loading }) => ({
  productionOrderMgt,
  loading: loading.effects['productionOrderMgt/fetchProductionRelList'],
}))
@Form.create()
export default class ProductionOrderRelTab extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  state = {
    prodRelTypeOptionsFilter: [],
    prodRelOptionsFilter: [],
    filteredInfo: {},
  };

  filterTransForm = (filters = [], type) => {
    const transFilter = [];
    filters.forEach(filter => {
      transFilter.push({
        text: filter.description,
        value: filter[type],
      });
    });

    return transFilter;
  };

  componentDidMount = () => {
    const { dispatch, workOrderId } = this.props;

    dispatch({
      type: 'productionOrderMgt/fetchProductionRelList',
      payload: {
        workOrderId,
        page: { pageSize: 1000},
      },
    });

    // wo关系 wo关系类型
    dispatch({
      type: 'productionOrderMgt/fetchTypeSelectList',
      payload: {
        module: 'ORDER',
        typeGroup: 'WO_REL_PARENT_CHILD',
        type: 'prodRelOptions',
      },
    }).then(res => {
      let prodRelOptionsFilter = [];
      const prodRelOptions = chainGet(res, 'rows', []);
      prodRelOptionsFilter = this.filterTransForm(prodRelOptions, 'typeCode');

      this.setState({
        prodRelOptionsFilter,
      });
    });

    //  wo关系类型
    dispatch({
      type: 'productionOrderMgt/fetchTypeSelectList',
      payload: {
        module: 'ORDER',
        typeGroup: 'WO_LEVEL_REL_TYPE',
        type: 'prodRelTypeOptions',
      },
    }).then(res => {
      let prodRelTypeOptionsFilter = [];
      const prodRelTypeOptions = chainGet(res, 'rows', []);
      prodRelTypeOptionsFilter = this.filterTransForm(prodRelTypeOptions, 'typeCode');

      this.setState({
        prodRelTypeOptionsFilter,
      });
    });
  };

  handleFilterSearch = (selectedKeys, confirm) => {
    confirm();
  };

  handleFilterReset = clearFilters => {
    clearFilters();
  };

  clearFilterSort = () => {
    this.setState({
      filteredInfo: {},
    });
  };

  tablePagination = (pagination, filtersArg) => {
    const { dispatch, workOrderId } = this.props;

    this.setState({
      filteredInfo: filtersArg,
    });

    const searchParams = {};
    // EO编码、物料编码、物料名称
    ['workOrderNum'].forEach(text => {
      if (filtersArg[text]) {
        searchParams[text] = isArray(filtersArg[text]) ? filtersArg[text][0] : filtersArg[text];
      }
    });

    // EO状态、EO类型
    const params = filtersArg;
    const param = Object.assign(params, searchParams);

    dispatch({
      type: 'productionOrderMgt/fetchProductionRelList',
      payload: {
        workOrderId,
        ...param,
        page: pagination,
      },
    });
  };

  getColumnSearchProps = type => {
    const { filteredInfo = {} } = this.state;

    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }} className={styles.dropDown}>
          <Input
            ref={node => {
              this.searchInput = node;
            }}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => this.handleFilterSearch(selectedKeys, confirm)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => this.handleFilterSearch(selectedKeys, confirm)}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            {intl.get('hzero.common.button.search').d('查询')}
          </Button>
          <Button
            onClick={() => this.handleFilterReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            {intl.get('hzero.common.button.reset').d('重置')}
          </Button>
        </div>
      ),
      filterIcon: filtered => (
        <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      filteredValue: filteredInfo[type] || null,
    };
  };

  render() {
    const {
      productionOrderMgt: {
        prodRelPagination = {},
        productionRelList = [],
        workOrderStatusOptions = [], // wo状态
        workOrderTypeOptions = [], // wo类型
      },
    } = this.props;

    const { prodRelOptionsFilter, prodRelTypeOptionsFilter, filteredInfo = {} } = this.state;

    const columns = [
      {
        title: intl.get(`${modelPrompt}.workOrderNum`).d('WO编码'),
        width: 130,
        dataIndex: 'workOrderNum',
        ...this.getColumnSearchProps('workOrderNum'),
      },
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
        width: 100,
        dataIndex: 'materialCode',
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('物料名称'),
        width: 130,
        dataIndex: 'materialName',
      },
      {
        title: intl.get(`${modelPrompt}.workOrderType`).d('WO类型'),
        width: 100,
        dataIndex: 'workOrderType',
        render: val => {
          const woFilter = workOrderTypeOptions.filter(eo => eo.typeCode === val);
          if (woFilter.length > 0) {
            const desc = (woFilter[0] || {}).description || '';
            return <span>{desc}</span>;
          }
          return val;
        },
      },
      {
        title: intl.get(`${modelPrompt}.status`).d('WO状态'),
        width: 100,
        dataIndex: 'status',
        render: val => {
          const woFilter = workOrderStatusOptions.filter(eo => eo.statusCode === val);
          if (woFilter.length > 0) {
            const desc = (woFilter[0] || {}).description || '';
            return <span>{desc}</span>;
          }
          return val;
        },
      },
      {
        title: intl.get(`${modelPrompt}.qty`).d('WO数量'),
        width: 100,
        dataIndex: 'qty',
      },
      {
        title: intl.get(`${modelPrompt}.rel`).d('WO关系'),
        width: 100,
        dataIndex: 'rel',
        render: val => {
          const prodRelFilter = prodRelOptionsFilter.filter(eo => eo.value === val);
          if (isArray(prodRelFilter) && prodRelFilter.length > 0) {
            const desc = (prodRelFilter[0] || {}).text || '';
            return <span>{desc}</span>;
          }
          return val;
        },
        filterIcon: filtered => (
          <Icon type="down" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        filters: prodRelOptionsFilter,
        filteredValue: filteredInfo.rel || null,
      },
      {
        title: intl.get(`${modelPrompt}.relType`).d('WO关系类型'),
        width: 200,
        dataIndex: 'relType',
        render: val => {
          const prodRelTypeFilter = prodRelTypeOptionsFilter.filter(eo => eo.value === val);
          if (isArray(prodRelTypeFilter) && prodRelTypeFilter.length > 0) {
            const desc = (prodRelTypeFilter[0] || {}).text || '';
            return <span>{desc}</span>;
          }
          return val;
        },
        filterIcon: filtered => (
          <Icon type="down" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        filters: prodRelTypeOptionsFilter,
        filteredValue: filteredInfo.relType || null,
      },
    ];

    return (
      <Table
        bordered
        rowKey="relId"
        pagination={{ ...prodRelPagination, pageSizeOptions: ['10', '50', '100', '200', '500', '1000'], defaultPageSize: '1000' }}
        columns={columns}
        dataSource={productionRelList}
        onChange={this.tablePagination}
      />
    );
  }
}
