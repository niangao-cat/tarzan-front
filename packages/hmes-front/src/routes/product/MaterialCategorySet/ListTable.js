/**
 * ListTable - 表格
 * @date: 2019-7-31
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Table, Badge } from 'hzero-ui';
// import {isUndefined} from 'lodash';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import notification from 'utils/notification';
import MaterialCategorySetDrawer from './MaterialCategorySetDrawer';
import AttributeDrawer from './AttributeDrawer';

const modelPrompt = 'tarzan.product.maSet.model.maSet';

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 表格
 * @extends {Component} - React.Component
 * @reactProps {Object} materialCategorySet - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ materialCategorySet, loading }) => ({
  materialCategorySet,
  fetchLoading: loading.effects['materialCategorySet/fetchMaterialCategorySetList'],
}))
export default class ListTable extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  state = {
    initMaterialCategorySetData: {},
    materialCategorySetDrawerVisible: false,
    attributeDrawerVisible: false,
    attributeData: {},
  };

  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagination) {
    const { onSearch } = this.props;
    onSearch(pagination);
  }

  // 打开编辑抽屉
  @Bind
  handleMaterialCategorySetDrawerShow(record = {}) {
    this.setState({ materialCategorySetDrawerVisible: true, initMaterialCategorySetData: record });
  }

  // 打开扩展字段抽屉
  @Bind
  handleAttributeDrawerShow(record = {}) {
    const { dispatch } = this.props;
    dispatch({
      type: 'materialCategorySet/fetchAttributeList',
      payload: {
        kid: record.materialCategorySetId,
        tableName: 'mt_material_category_set_attr',
      },
    });
    this.setState({ attributeDrawerVisible: true, attributeData: record });
  }

  // 关闭编辑抽屉
  @Bind
  handleMaterialCategorySetDrawerCancel() {
    this.setState({ materialCategorySetDrawerVisible: false, initMaterialCategorySetData: {} });
  }

  // 关闭扩展字段抽屉
  @Bind
  handleAttributeDrawerCancel() {
    this.setState({ attributeDrawerVisible: false, attributeData: {} });
  }

  // 编辑抽屉确认
  @Bind
  handleMaterialCategorySetDrawerOk(fieldsValue) {
    const {
      dispatch,
      onSearch,
      materialCategorySet: { materialCategorySetPagination = {} },
    } = this.props;
    dispatch({
      type: 'materialCategorySet/saveMaterialCategorySet',
      payload: {
        ...fieldsValue,
      },
    }).then(res => {
      if (res && res.success) {
        onSearch(materialCategorySetPagination);
        this.setState({ materialCategorySetDrawerVisible: false, initMaterialCategorySetData: {} });
        notification.success();
      } else {
        notification.error({ message: res.message });
      }
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      materialCategorySet: { materialCategorySetList = [], materialCategorySetPagination = {} },
      fetchLoading,
    } = this.props;
    const {
      materialCategorySetDrawerVisible,
      initMaterialCategorySetData,
      attributeDrawerVisible,
      attributeData,
    } = this.state;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.categorySetCode`).d('物料类别集编码'),
        width: 100,
        dataIndex: 'categorySetCode',
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.handleMaterialCategorySetDrawerShow(record);
              }}
            >
              {val}
            </a>
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('物料类别集描述'),
        dataIndex: 'description',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.defaultScheduleFlag`).d('计划默认类别集'),
        dataIndex: 'defaultScheduleFlag',
        width: 100,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.defaultScheduleFlag === 'Y' ? 'success' : 'error'}
            text={
              record.defaultScheduleFlag === 'Y'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.defaultPurchaseFlag`).d('采购默认类别集'),
        dataIndex: 'defaultPurchaseFlag',
        width: 100,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.defaultPurchaseFlag === 'Y' ? 'success' : 'error'}
            text={
              record.defaultPurchaseFlag === 'Y'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.defaultManufacturingFlag`).d('生产默认类别集'),
        dataIndex: 'defaultManufacturingFlag',
        width: 100,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.defaultManufacturingFlag === 'Y' ? 'success' : 'error'}
            text={
              record.defaultManufacturingFlag === 'Y'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 100,
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
        title: intl.get(`${modelPrompt}.operator`).d('扩展字段'),
        dataIndex: 'operator',
        width: 100,
        align: 'center',
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.handleAttributeDrawerShow(record);
              }}
            >
              {intl.get(`${modelPrompt}.operator`).d('扩展字段')}
            </a>
          </span>
        ),
      },
    ];
    // 抽屉参数
    const materialCategorySetDrawerProps = {
      visible: materialCategorySetDrawerVisible,
      onCancel: this.handleMaterialCategorySetDrawerCancel,
      onOk: this.handleMaterialCategorySetDrawerOk,
      initData: initMaterialCategorySetData,
    };
    // 扩展字段参数
    const attributeDrawerProps = {
      visible: attributeDrawerVisible,
      onCancel: this.handleAttributeDrawerCancel,
      onOk: this.handleAttributeDrawerCancel,
      initData: attributeData,
    };
    return (
      <React.Fragment>
        <Table
          loading={fetchLoading}
          rowKey="materialCategorySetId"
          dataSource={materialCategorySetList}
          columns={columns}
          pagination={materialCategorySetPagination || {}}
          onChange={this.handleTableChange}
          bordered
        />
        <MaterialCategorySetDrawer {...materialCategorySetDrawerProps} />
        <AttributeDrawer {...attributeDrawerProps} />
      </React.Fragment>
    );
  }
}
