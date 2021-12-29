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
import { Header, Content } from 'components/Page';

import intl from 'utils/intl';
// import notification from 'utils/notification';
import { getCurrentOrganizationId, tableScrollWidth, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import FilterForm from './FilterForm';
// import CopyDrawer from './copyDrawer';

/**
 * 使用 Form.Item 组件
 */
const modelPrompt = 'tarzan.product.produce.model.produce';
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
@connect(({ produce, loading }) => ({
  produce,
  currentTenantId: getCurrentOrganizationId(),
  loading: loading.effects['produce/fetchProduceList'],
}))
@formatterCollections({ code: 'tarzan.product.produce' })
@Form.create({ fieldNameProp: null })
export default class MaterialList extends React.Component {

  state = {
    // selectedRows:[],
    search: {},
    options: [],
    // visible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.refresh();

    dispatch({
      type: 'produce/fetchSelectOption',
      payload: {
        module: 'MATERIAL',
        typeGroup: 'CONTROL_TYPE',
      },
    }).then(res => {
      if (res && res.success) {
        this.setState({
          options: [...res.rows],
        });
      }
    });
  }


  @Bind()
  refresh = (pagination = {}) => {
    const { dispatch } = this.props;
    const { search } = this.state;
    const fieldsValue = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'produce/fetchProduceList',
      payload: {
        ...search,
        ...fieldsValue,
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
    history.push(`/product/produce/dist/default/create`);
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
    history.push(`/product/produce/dist/${record.keyType}/${record.kid}`);
    dispatch({
      type: 'produce/updateState',
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
  // @Bind()
  // copyData = () => {
  //   this.setState({
  //     visible: true,
  //   });
  // };

  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      produce: { produceList = [], producePagination = {} },
      loading,
    } = this.props;
    const { options } = this.state;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
        width: 250,
        dataIndex: 'materialCode',
        render: (val, record) => <a onClick={this.toDistPageEdit.bind(this, record)}>{val}</a>,
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('物料描述'),
        width: 150,
        dataIndex: 'materialName',
      },
      {
        title: intl.get(`${modelPrompt}.categoryCode`).d('物料类别'),
        width: 150,
        dataIndex: 'categoryCode',
        render: (val, record) => <a onClick={this.toDistPageEdit.bind(this, record)}>{val}</a>,
      },
      {
        title: intl.get(`${modelPrompt}.siteName`).d('站点'),
        dataIndex: 'siteName',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.areaName`).d('区域'),
        dataIndex: 'areaName',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.prodLineName`).d('生产线'),
        dataIndex: 'prodLineName',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.workcellName`).d('工作单元'),
        dataIndex: 'workcellName',
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
      {
        title: intl.get(`${modelPrompt}.operationAssembleFlag`).d('按工序装配'),
        dataIndex: 'operationAssembleFlag',
        width: 100,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.operationAssembleFlag !== 'N' ? 'success' : 'error'}
            text={
              record.operationAssembleFlag !== 'N'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.defaultBomName`).d('装配清单'),
        dataIndex: 'defaultBomName',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.defaultBomRevision`).d('装配清单版本'),
        dataIndex: 'defaultBomRevision',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.defaultRoutingName`).d('默认工艺路线'),
        dataIndex: 'defaultRoutingName',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.defaultRoutingRevision`).d('默认工艺路线版本'),
        dataIndex: 'defaultRoutingRevision',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.issueControlType`).d('投料限制类型'),
        dataIndex: 'issueControlType',
        width: 150,
        render: val => (options.filter(ele => ele.typeCode === val)[0] || {}).description,
      },
      {
        title: intl.get(`${modelPrompt}.issueControlQty`).d('投料限制值'),
        dataIndex: 'issueControlQty',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.completeControlType`).d('完工限制类型'),
        dataIndex: 'completeControlType',
        width: 150,
        render: val => (options.filter(ele => ele.typeCode === val)[0] || {}).description,
      },
      {
        title: intl.get(`${modelPrompt}.completeControlQty`).d('完工限制值'),
        dataIndex: 'completeControlQty',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.attritionControlType`).d('损耗限制类型'),
        dataIndex: 'attritionControlType',
        width: 150,
        render: val => (options.filter(ele => ele.typeCode === val)[0] || {}).description,
      },
      {
        title: intl.get(`${modelPrompt}.attritionControlQty`).d('损耗限制值'),
        dataIndex: 'attritionControlQty',
        width: 150,
      },
    ];
    // const rowSelection = {
    //   selectedRows,
    //   onChange: this.onChange,
    // };
    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.product.produce.title.list').d('物料生产属性维护')}>
          <Button icon="plus" type="primary" onClick={this.toDistPageCreate}>
            {intl.get('tarzan.product.produce.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <FilterForm onSearch={this.onSearch} resetSearch={this.resetSearch} onRef={this.handleBindRef} />
          <Table
            loading={loading}
            rowKey="materialId"
            dataSource={produceList}
            scroll={{ x: tableScrollWidth(columns) }}
            columns={columns}
            pagination={producePagination}
            onChange={this.refresh}
            bordered
          />
        </Content>
      </React.Fragment>
    );
  }
}
