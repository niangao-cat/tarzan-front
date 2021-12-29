/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 数据查询
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Form, Button, Col, Row, Input, Select, Card } from 'hzero-ui';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  DETAIL_CARD_TABLE_CLASSNAME,
} from 'utils/constants';
import { getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import DianTableList from './DianTableList';

const commonModelPrompt = 'tarzan.hwms.qualityFileAnalAndQuery';

@connect(({ qualityFileAnalAndQuery, loading }) => ({
  qualityFileAnalAndQuery,
  fetchListLoading: loading.effects['qualityFileAnalAndQuery/queryDataList'],
}))
@Form.create({ fieldNameProp: null })
export default class ProductionFlowQueryReport extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'qualityFileAnalAndQuery/init',
    });
  }

  @Bind()
  queryData(page = {}) {
    const { dispatch } = this.props;
    const { form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        // 根据页数查询报表信息
        dispatch({
          type: 'qualityFileAnalAndQuery/queryDataList',
          payload: {
            ...values,
            page,
          },
        });
      }
    });
  }

  // 重置查询
  @Bind
  resetSearch = () => {
    const { form } = this.props;
    form.resetFields();
  };

  // 渲染 界面布局
  render() {
    // 获取默认数据
    const {
      fetchListLoading,
      qualityFileAnalAndQuery: { colMap= [], headList = [], headPagination = {}, typeMap = [] },
    } = this.props;

    // 获取整个表单
    const { form } = this.props;
    // 获取表单的字段属性
    const { getFieldDecorator, getFieldValue } = form;
    const dataProps = {
      colMap,
      loading: fetchListLoading,
      dataSource: headList,
      pagination: headPagination,
      onSearch: this.queryData,
    };

    //  返回默认界面数据
    return (
      <div>
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('质量文件解析查询')} />
        <Content>
          <Form className={SEARCH_FORM_CLASSNAME}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.workOrderNum`).d('工单')}
                >
                  {getFieldDecorator('workOrderNum')(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.materialLotCode`).d('SN号')}
                >
                  {getFieldDecorator('materialLotCode')(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.qaType`).d('类型')}
                >
                  {getFieldDecorator('qaType', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`qaType`).d('类型'),
                        }),
                      },
                    ],
                  })(
                    <Select allowClear>
                      {typeMap.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
                <Form.Item>
                  <Button onClick={this.resetSearch.bind(this)}>
                    {intl.get(`hzero.common.button.reset`).d('重置')}
                  </Button>
                  <Button type="primary" htmlType="submit" onClick={this.queryData.bind(this)}>
                    {intl.get(`hzero.common.button.search`).d('查询')}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.materialId`).d('物料')}
                >
                  {getFieldDecorator(
                    'materialId',
                    {}
                  )(
                    <Lov
                      code="Z.MATERIALCODE"
                      queryParams={{ tenantId: getCurrentOrganizationId() }}
                      onChange={(value, records) => {
                        this.props.form.setFieldsValue({
                          materialName: records.materialName,
                        });
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.materialName`).d('物料描述')}
                >
                  {getFieldDecorator('materialName')(<Input disabled />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          {getFieldValue('qaType') === 'D' && (
            <Card
              key="code-rule-header"
              title={intl.get('tarzan.product.produce.title.field').d('电学质量文件')}
              bordered={false}
              className={DETAIL_CARD_TABLE_CLASSNAME}
            />
          )}
          {getFieldValue('qaType') === 'G' && (
            <Card
              key="code-rule-header"
              title={intl.get('tarzan.product.produce.title.field').d('光学质量文件')}
              bordered={false}
              className={DETAIL_CARD_TABLE_CLASSNAME}
            />
          )}
          <DianTableList {...dataProps} />
        </Content>
      </div>
    );
  }
}
