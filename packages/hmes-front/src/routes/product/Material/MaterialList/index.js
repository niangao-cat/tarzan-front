/**
 * proLineList - 工作单元维护
 * @date: 2019-8-7
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Table, Badge } from 'hzero-ui';
// import {isUndefined} from 'lodash';
import { Bind } from 'lodash-decorators';
import cacheComponent from 'components/CacheComponent';
import { Header, Content } from 'components/Page';

import intl from 'utils/intl';
// import notification from 'utils/notification';
import { getCurrentOrganizationId, tableScrollWidth } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import FilterForm from './FilterForm';
import CopyDrawer from './copyDrawer';

/**
 * 使用 Form.Item 组件
 */
const modelPrompt = 'tarzan.product.materialManager.model.materialManager';
/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 工作单元维护
 * @extends {Component} - React.Component
 * @reactProps {Object} [location={}] - 当前路由信息
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} proLineList - 数据源
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(({ materialManager, loading }) => ({
  materialManager,
  currentTenantId: getCurrentOrganizationId(),
  loading: loading.effects['materialManager/fetchMaterialList'],
}))
@formatterCollections({ code: 'tarzan.product.materialManager' })
@Form.create({ fieldNameProp: null })
@cacheComponent({ cacheKey: '/organization-modeling/work-cell/list' })
export default class MaterialList extends React.Component {
  state = {
    // selectedRows:[],
    search: {},
    visible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'materialManager/fetchMaterialList',
      payload: {
        ...this.form&&this.form.getFieldsValue(),
      },
    });
    this.setState({
      search: {},
    });
  }

  @Bind()
  refresh = (pagination = {}) => {
    const { dispatch } = this.props;
    const { search } = this.state;
    dispatch({
      type: 'materialManager/fetchMaterialList',
      payload: {
        ...search,
        page: pagination,
      },
    });
  };

  @Bind()
  onSearch = fielsValue => {
    this.setState(
      {
        search: fielsValue,
      },
      () => {
        this.refresh();
      }
    );
  };

  @Bind()
  resetSearch = () => {
    this.setState({
      search: {},
    });
  };

  /**
   *@functionName:   toDistPageCreate
   *@description 跳转到当前物料详情页面新建
   *@author: 唐加旭
   *@date: 2019-08-19 15:52:49
   *@version: V0.8.6
   * */
  @Bind()
  toDistPageCreate() {
    const { history } = this.props;
    history.push(`/product/material-manager/dist/create`);
  }

  /**
   *@functionName:   toDistPageEdit
   *@params {Object} record 当前数据
   *@description 跳转到无聊详情页编辑
   *@author: 唐加旭
   *@date: 2019-08-20 16:46:23
   *@version: V0.0.1
   * */
  @Bind()
  toDistPageEdit(record = {}) {
    const { history, dispatch } = this.props;
    history.push(`/product/material-manager/dist/${record.materialId}`);
    dispatch({
      type: 'materialManager/updateState',
      payload: {
        materialManagerItem: record,
      },
    });
  }

  /**
   *@functionName:   copyData
   *@description: 打开复制模态框，进行数据得复制
   *@author: 唐加旭
   *@date: 2019-08-19 15:31:35
   *@version: V0.8.6
   * */
  @Bind()
  copyData = () => {
    this.setState({
      visible: true,
    });
  };

  /**
   *@functionName:   onCancel
   *@description: 关闭复制模态框
   *@author: 唐加旭
   *@date: 2019-08-19 15:29:56
   *@version: V0.8.6
   * */
  @Bind()
  onCancel = () => {
    this.setState({
      visible: false,
    });
  };

  /**
   *@functionName:   handleOnOk
   *@description 复制模态框确定并跳转
   *@author: 唐加旭
   *@date: 2019-08-21 09:40:25
   *@version: V0.0.1
   * */
  @Bind()
  handleOnOk = (materialId, currentMaterialId) => {
    const { history } = this.props;
    this.setState({
      visible: false,
    });
    if (!materialId) {
      history.push(`/product/material-manager/dist/create`);
    } else {
      history.push(`/product/material-manager/dist/${currentMaterialId}`);
    }
  };

  @Bind()
  handleBindQueryRef(ref = {}) {
    // this.queryForm = ref;
    this.form = (ref.props || {}).form;
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      materialManager: { materialList = [], materialPagination = {} },
      loading,
    } = this.props;
    const { visible } = this.state;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
        width: 200,
        dataIndex: 'materialCode',
        render: (val, record) => <a onClick={this.toDistPageEdit.bind(this, record)}>{val}</a>,
      },
      {
        title: intl.get(`${modelPrompt}.materialIdentifyCode`).d('物料简码'),
        width: 200,
        dataIndex: 'materialIdentifyCode',
        // render: (val, record) => <a onClick={this.toDistPageEdit.bind(this, record)}>{val}</a>,
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
      },
      {
        title: intl.get(`${modelPrompt}.model`).d('材质/型号'),
        dataIndex: 'model',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.materialDesignCode`).d('物料图号'),
        dataIndex: 'materialDesignCode',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.primaryUomName`).d('基本计量单位'),
        dataIndex: 'primaryUomName',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.secondaryUomName`).d('辅助单位'),
        dataIndex: 'secondaryUomName',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.conversionRate`).d('主辅助单位换算'),
        dataIndex: 'conversionRate',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 100,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.enableFlag !== 'N' ? 'success' : 'error'}
            text={
              record.enableFlag !== 'N'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },
    ];
    // const rowSelection = {
    //   selectedRows,
    //   onChange: this.onChange,
    // };
    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.product.materialManager.title.list').d('物料维护')}>
          <Button icon="plus" type="primary" onClick={this.toDistPageCreate}>
            {intl.get('tarzan.product.materialManager.button.create').d('新建')}
          </Button>
          <Button onClick={this.copyData}>
            {intl.get('tarzan.product.materialManager.button.copy').d('复制')}
          </Button>
        </Header>
        <Content>
          <FilterForm onSearch={this.onSearch} resetSearch={this.resetSearch} onRefs={this.handleBindQueryRef} />
          <Table
            loading={loading}
            rowKey="materialId"
            dataSource={materialList}
            // rowSelection={rowSelection}
            columns={columns}
            scroll={{ x: tableScrollWidth(columns) }}
            pagination={materialPagination}
            onChange={this.refresh}
            bordered
          />
          {visible && (
            <CopyDrawer visible={visible} onCancel={this.onCancel} onOk={this.handleOnOk} />
          )}
        </Content>
      </React.Fragment>
    );
  }
}
