/**
 * pfepInventoryList - 物料存储属性维护
 * @date: 2019-8-19
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Table, Badge } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import cacheComponent from 'components/CacheComponent';
import { Header, Content } from 'components/Page';

import intl from 'utils/intl';
import { tableScrollWidth, getCurrentOrganizationId } from 'utils/utils';
// import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import FilterForm from './FilterForm';

/**
 * 使用 Form.Item 组件
 */
const modelPrompt = 'tarzan.product.inv.model.inv';
/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 物料存储属性维护
 * @extends {Component} - React.Component
 * @reactProps {Object} [location={}] - 当前路由信息
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} pfepInventoryList - 数据源
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(({ pfepInventory, loading }) => ({
  pfepInventory,
  currentTenantId: getCurrentOrganizationId(),
  loading: loading.effects['pfepInventory/fetchPfepInventoryList'],
}))
@formatterCollections({ code: 'tarzan.product.inv' })
@Form.create({ fieldNameProp: null })
@cacheComponent({ cacheKey: '/product/pfep-inventory/list' })
export default class PfepInventoryList extends React.Component {
  queryForm;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'pfepInventory/fetchPfepInventoryList',
    });
  }

  /**
   * 页面跳转到物料明细维护页面
   * @param {object} record 行数据
   */
  @Bind()
  showPfepInventoryDist(record = {}) {
    const { history } = this.props;
    history.push(`/product/pfep-inventory/dist/${record.keyType}/${record.kid}`);
  }

  /**
   *新建物料页面
   * @param {object} record 行数据
   */
  @Bind()
  createPfepInventory() {
    const { history, dispatch } = this.props;
    dispatch({
      type: 'pfepInventory/updateState',
      payload: {
        displayList: {},
        attrList: [],
      },
    });
    history.push(`/product/pfep-inventory/dist/default/create`);
  }

  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagination) {
    this.fetchQueryList(pagination);
  }

  /**
   * 查询数据
   * @param {object} page 页面基本信息数据
   */
  @Bind()
  fetchQueryList(pagination = {}) {
    this.queryForm.fetchQueryList(pagination);
  }

  /**
   *
   * @param {object} ref - FilterForm子组件对象
   */
  @Bind()
  handleBindQueryRef(ref = {}) {
    this.queryForm = ref;
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      pfepInventory: {
        pfepInventoryList = [],
        identifyTypeList = [],
        pfepInventoryPagination = {},
      },
      loading,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
        width: 150,
        dataIndex: 'materialCode',
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.showPfepInventoryDist(record);
              }}
            >
              {val}
            </a>
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.categoryCode`).d('物料类别'),
        dataIndex: 'categoryCode',
        width: 150,
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.showPfepInventoryDist(record);
              }}
            >
              {val}
            </a>
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.siteCode`).d('站点'),
        dataIndex: 'siteCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.areaCode`).d('区域'),
        dataIndex: 'areaCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.prodLineCode`).d('生产线'),
        dataIndex: 'prodLineCode',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.workcellCode`).d('工作单元'),
        dataIndex: 'workcellCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.locatorCode`).d('库位'),
        dataIndex: 'locatorCode',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 90,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.enableFlag === 'Y' ? 'success' : 'error'}
            text={
              record.enableFlag === 'Y'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.identifyType`).d('存储标识类型'),
        dataIndex: 'identifyType',
        width: 120,
        align: 'center',
        render: val => (
          <Fragment>
            {identifyTypeList instanceof Array && identifyTypeList.length !== 0
              ? (identifyTypeList.filter(item => item.typeCode === val)[0] || {}).description
              : ''}
          </Fragment>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.identifyId`).d('标识模板'),
        dataIndex: 'identifyId',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.stockLocatorCode`).d('默认存储库位'),
        dataIndex: 'stockLocatorCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.issuedLocatorCode`).d('默认发料库位'),
        dataIndex: 'issuedLocatorCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.completionLocatorCode`).d('默认完工库位'),
        dataIndex: 'completionLocatorCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.maxStockQty`).d('最大存储库存'),
        dataIndex: 'maxStockQty',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.minStockQty`).d('最小存储库存'),
        dataIndex: 'minStockQty',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.packageWeight`).d('存储包装重量'),
        dataIndex: 'packageWeight',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.weightUomCode`).d('重量单位'),
        dataIndex: 'weightUomCode',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.packageLength`).d('存储包装长度值'),
        dataIndex: 'packageLength',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.packageWidth`).d('存储包装宽度值'),
        dataIndex: 'packageWidth',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.packageHeight`).d('存储包装高度值'),
        dataIndex: 'packageHeight',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.packageSizeUomCode`).d('包装尺寸单位'),
        dataIndex: 'packageSizeUomCode',
        width: 150,
      },
    ];

    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.product.inv.title.list').d('物料存储属性维护')}>
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              this.createPfepInventory();
            }}
          >
            {intl.get('tarzan.product.inv.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <FilterForm onRef={this.handleBindQueryRef} />
          <Table
            loading={loading}
            rowKey="kid"
            dataSource={pfepInventoryList}
            columns={columns}
            scroll={{ x: tableScrollWidth(columns) }}
            pagination={pfepInventoryPagination || {}}
            onChange={this.handleTableChange}
            bordered
          />
        </Content>
      </React.Fragment>
    );
  }
}
