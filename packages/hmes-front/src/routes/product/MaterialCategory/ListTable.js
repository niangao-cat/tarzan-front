/**
 * ListTable - 表格
 * @date: 2019-8-23
 * @author: dong.li <dong.li04@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Table, Badge } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import notification from 'utils/notification';
import AttributeDrawer from './AttributeDrawer';
import SiteDistribution from './SiteDistribution';

const tenantId = getCurrentOrganizationId();

const modelPrompt = 'tarzan.product.materialCategory.model.materialCategory';
/**
 * 表格
 * @extends {Component} - React.Component
 * @reactProps {Object} materialCategory - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ materialCategory, loading }) => ({
  materialCategory,
  fetchLoading: loading.effects['materialCategory/fetchMaterialCategoryList'],
}))
@Form.create({ fieldNameProp: null })
export default class ListTable extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  state = {
    attributeDrawerVisible: false,
    siteDistributionVisible: false,
    siteListData: '',
  };

  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagination) {
    const { fetchQueryList } = this.props;
    fetchQueryList(pagination);
  }

  // 打开扩展字段抽屉
  @Bind
  handleAttributeDrawerShow(record = {}) {
    const { dispatch } = this.props;
    dispatch({
      type: 'materialCategory/fetchAttributeList',
      payload: {
        kid: record.materialCategoryId,
        tableName: 'mt_material_category_attr',
        organizationId: tenantId,
      },
    });
    this.setState({ attributeDrawerVisible: true, attributeData: record });
  }

  // 关闭扩展字段抽屉
  @Bind
  handleAttributeDrawerCancel() {
    this.setState({ attributeDrawerVisible: false });
  }

  @Bind
  siteDistributionShow(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'materialCategory/inspectSiteDistribution',
      payload: {
        materialCategoryId: record.materialCategoryId,
        organizationId: tenantId,
      },
    }).then(res => {
      if (res.success) {
        this.setState({ siteDistributionVisible: true, siteListData: record });
        dispatch({
          type: 'materialCategory/querySiteDistribution',
          payload: {
            materialCategoryId: record.materialCategoryId,
            organizationId: tenantId,
          },
        });
      } else {
        notification.error({
          message: res.message,
        });
      }
    });
  }

  @Bind
  siteDistributionDrawerCancel() {
    this.setState({ siteDistributionVisible: false });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      materialCategory: { materialCategoryList = [], materialCategoryPagination = {} },
      fetchLoading,
    } = this.props;
    const {
      attributeDrawerVisible,
      siteDistributionVisible,
      attributeData,
      siteListData,
    } = this.state;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.categoryCode`).d('物料类别'),
        width: 100,
        dataIndex: 'categoryCode',
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.props.handleCreate(record);
              }}
            >
              {val}
            </a>
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('物料类别描述'),
        dataIndex: 'description',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.materialCategorySetId`).d('所属类别集编码'),
        dataIndex: 'categorySetCode',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.categorySetDesc`).d('所属类别集描述'),
        dataIndex: 'categorySetDesc',
        width: 100,
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
                ? intl.get(`${modelPrompt}.open`).d('启用')
                : intl.get(`${modelPrompt}.forbidden`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.extendField`).d('扩展字段'),
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
              {intl.get(`${modelPrompt}.extendField`).d('扩展字段')}
            </a>
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.distribution`).d('站点分配'),
        dataIndex: 'operator',
        width: 100,
        align: 'center',
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.siteDistributionShow(record);
              }}
            >
              {intl.get(`${modelPrompt}.distribution`).d('站点分配')}
            </a>
          </span>
        ),
      },
    ];

    // 扩展字段参数
    const attributeDrawerProps = {
      visible: attributeDrawerVisible,
      onCancel: this.handleAttributeDrawerCancel,
      onOk: this.handleAttributeDrawerCancel,
      initData: attributeData,
    };
    // 站点分配参数
    const siteDistributionProps = {
      visible: siteDistributionVisible,
      onCancel: this.siteDistributionDrawerCancel,
      record: siteListData,
    };
    return (
      <React.Fragment>
        <Table
          loading={fetchLoading}
          rowKey="materialCategoryId"
          dataSource={materialCategoryList}
          columns={columns}
          pagination={materialCategoryPagination || {}}
          onChange={this.handleTableChange}
          bordered
        />
        <AttributeDrawer {...attributeDrawerProps} />
        <SiteDistribution {...siteDistributionProps} />
      </React.Fragment>
    );
  }
}
