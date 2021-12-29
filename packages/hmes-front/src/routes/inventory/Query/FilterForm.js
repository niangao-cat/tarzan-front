/**
 * FilterForm - 搜索栏
 * @date: 2019-8-6
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Row, Col, Select, Switch } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';
import notification from 'utils/notification';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';

const modelPrompt = 'tarzan.inventory.query.model.query';
const tenantId = getCurrentOrganizationId();

/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

@formatterCollections({
  code: ['tarzan.inventory.query'], // code 为 [服务].[功能]的字符串数组
})
/**
 * 搜索栏
 * @extends {Component} - React.Component
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ query, loading }) => ({
  query,
  fetchMessageLoading: loading.effects['query/queryTreeData'],
}))
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      queryDetailsVisible: false, // 更多查询的收起与展开
      orgLovCode: '', // 组织对象查询lov的code
      orgTypeCode: '', // 组织对象查询lov需要传组织的typeCode
      ownerLovCode: '', // 所有者查询lov的code
      selectedSiteId: '', // 选中的站点ID
      orgCode: '', // 组织对象查询Lov显示值
    };
  }

  /**
   * 选择组织类型
   */
  @Bind()
  changeOrgType(value) {
    this.props.form.resetFields(['orgId']);
    const orgLovCode =
      value === 'LOCATOR' ? 'WMS.LOCATOR_LOV' : 'MT.ORAGANIZATION_BY_TYPE';
    this.setState({
      orgTypeCode: value,
      orgLovCode,
      orgCode: '',
    });
  }

  /**
   * 选择所有者类型
   */
  @Bind()
  changeOwnerType(value) {
    this.props.form.resetFields(['ownerId']);
    let ownerLovCode = '';
    if (value === 'CI' || value === 'IIC') {
      ownerLovCode = 'MT.CUSTOMER';
    } else if (value === 'SI' || value === 'IIS') {
      ownerLovCode = 'MT.SUPPLIER';
    }
    this.setState({
      ownerLovCode,
    });
  }

  /**
   * 显示或隐藏更多查询条件
   */
  @Bind()
  handleQueryDetails() {
    this.setState({
      queryDetailsVisible: !this.state.queryDetailsVisible,
    });
  }

  /**
   * 查询数据
   * @param {object} page 页面基本信息数据
   */
  @Bind()
  fetchQueryList(pagination = {}) {
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        const params = fieldsValue;
        params.holdFlag = params.holdFlag ? 'Y' : 'N';
        dispatch({
          type: 'query/queryTreeData',
          payload: {
            topSiteId: params.siteId,
            parentOrganizationType: params.orgType,
            parentOrganizationId: params.orgId,
          },
        }).then(res => {
          if (res && res.success) {
            const selectedTreeNodes = [];
            const ids = [];
            // 递归找所有树节点id
            const getSelectedNodes = node => {
              if (!node || !node.length) return;
              for (let i = 0, len = node.length; i < len; i++) {
                const childs = node[i].children;
                selectedTreeNodes.push({
                  orgId: node[i].id,
                  orgType: node[i].type,
                });
                ids.push(`${node[i].id}-${node[i].type}-${node[i].parentId}-${node[i].parentType}`);
                if (childs && childs.length > 0) {
                  getSelectedNodes(childs);
                }
              }
              return { selectedTreeNodes, ids };
            };
            const nodes = getSelectedNodes(res.rows ? [res.rows] : []);
            //  nodes.selectedTreeNodes     全部树节点[{id：xxx,type:xxx},{id：xxx,type:xxx}]
            //  nodes.ids                   全部树节点['id1','id2']
            dispatch({
              type: 'query/queryBillList',
              payload: {
                ...fieldsValue,
                orgList: nodes ? nodes.selectedTreeNodes : [],
              },
            });
            dispatch({
              type: 'query/updateState',
              payload: {
                checkedKeys: nodes ? nodes.ids : [],
                checkedNodesInfoList: nodes ? nodes.selectedTreeNodes : [],
              },
            });
          } else {
            notification.error({ message: res.message });
          }
        });
        dispatch({
          type: 'query/updateState',
          payload: {
            queryCriteria: params,
            page: pagination,
          },
        });
      }
    });
  }

  /**
   * 重置form表单
   */
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      orgLovCode: '', // 组织对象查询lov的code
      orgTypeCode: '', // 组织对象查询lov需要传组织的typeCode
      ownerLovCode: '', // 所有者查询lov的code
      selectedSiteId: '', // 选中的站点ID
      orgCode: '', // 组织对象查询Lov显示值
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      orgLovCode,
      orgTypeCode,
      queryDetailsVisible,
      ownerLovCode,
      selectedSiteId,
      orgCode,
    } = this.state;
    const { form, query } = this.props;
    const { orgTypeList, ownerTypeList } = query;
    const { getFieldDecorator } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.siteCode`).d('站点')}
            >
              {getFieldDecorator('siteId', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.siteCode`).d('站点'),
                    }),
                  },
                ],
              })(
                <Lov
                  onChange={val => this.setState({ selectedSiteId: val })}
                  queryParams={{ tenantId }}
                  code="MT.SITE"
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.orgType`).d('组织类型')}
            >
              {getFieldDecorator('orgType', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.orgType`).d('组织类型'),
                    }),
                  },
                ],
              })(
                <Select onChange={this.changeOrgType} allowClear>
                  {orgTypeList instanceof Array &&
                    orgTypeList.length !== 0 &&
                    orgTypeList.map(item => {
                      return (
                        <Select.Option value={item.typeCode} key={item.typeCode}>
                          {item.description}
                        </Select.Option>
                      );
                    })}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.orgId`).d('组织对象查询')}
            >
              {getFieldDecorator('orgId', {
                rules: [
                  {
                    required: orgTypeCode,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.orgId`).d('组织对象查询'),
                    }),
                  },
                ],
              })(
                <Lov
                  disabled={!(orgTypeCode && selectedSiteId)}
                  textValue={orgCode}
                  queryParams={{ tenantId, type: orgTypeCode, siteId: selectedSiteId }}
                  code={orgLovCode}
                  onChange={(_, record) => {
                    this.setState({ orgCode: record.code });
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <FormItem>
              <Button style={{ marginLeft: 8 }} onClick={this.handleQueryDetails}>
                {queryDetailsVisible
                  ? intl.get('tarzan.inventory.query.button.retractSearch').d('收起查询')
                  : intl.get('tarzan.inventory.query.button.moreSearch').d('更多查询')}
              </Button>
              <Button onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.fetchQueryList}>
                {intl.get('tarzan.inventory.query.button.search').d('查询')}
              </Button>
            </FormItem>
          </Col>
        </Row>
        <Row
          {...SEARCH_FORM_ROW_LAYOUT}
          style={{ display: queryDetailsVisible ? 'block' : 'none' }}
        >
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.materialId`).d('物料')}
            >
              {getFieldDecorator('materialId')(
                <Lov queryParams={{ tenantId }} code="MT.MATERIAL" />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.ownerType`).d('所有者类型')}
            >
              {getFieldDecorator('ownerType')(
                <Select onChange={this.changeOwnerType} allowClear>
                  {ownerTypeList instanceof Array &&
                    ownerTypeList.length !== 0 &&
                    ownerTypeList.map(item => {
                      return (
                        <Select.Option value={item.typeCode} key={item.typeCode}>
                          {item.description}
                        </Select.Option>
                      );
                    })}
                  <Select.Option value="" key="NULL">
                    自有
                  </Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.ownerId`).d('所有者查询')}
            >
              {getFieldDecorator('ownerId')(
                <Lov disabled={!ownerLovCode} queryParams={{ tenantId }} code={ownerLovCode} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row
          {...SEARCH_FORM_ROW_LAYOUT}
          style={{ display: queryDetailsVisible ? 'block' : 'none' }}
        >
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.lotCode`).d('批次')}
            >
              {getFieldDecorator('lotCode')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  tokenSeparators={[',']}
                  dropdownStyle={{ display: 'none' }}
                  allowClear
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.holdFlag`).d('预留库存')}
            >
              {getFieldDecorator('holdFlag')(<Switch allowClear />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
