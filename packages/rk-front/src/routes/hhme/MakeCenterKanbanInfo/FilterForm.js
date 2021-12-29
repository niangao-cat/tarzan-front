/**
 * @author:lly
 * @email:liyuan.liu@hand-china.com
 * @description:制造中心看板信息维护
 */
import React from 'react';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  FORM_FIELD_CLASSNAME,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import { Form, Button, Col, Row, Select } from 'hzero-ui';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
const { Option } = Select;

// 表单创建
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 查询方法
  @Bind
  onSearch = () => {
    const { onSearch, form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        onSearch(values);
      }
    });
  };

  // 重置查询
  @Bind
  resetSearch = () => {
    const { form, resetSearch } = this.props;
    form.resetFields();
    resetSearch();
  };

  // 渲染
  render() {
    // 获取整个表单
    const {
      form,
      siteInfo,
      siteMap,
      kanbanAreaMap,
    } = this.props;

    // 获取表单的字段属性
    const { getFieldDecorator, getFieldValue } = form;

    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='工厂'
            >
              {getFieldDecorator('siteId', {
                  initialValue: siteInfo.siteId,
                  rules: [
                    {
                      // required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`siteId`).d('站点'),
                      }),
                    },
                  ],
                })(
                  <Select allowClear>
                    {siteMap.map(item => (
                      <Select.Option key={item.siteId} value={item.siteId}>
                        {item.description}
                      </Select.Option>
                    ))}
                  </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='看板区域'
            >
              {getFieldDecorator('kanbanArea')(
                <Select allowClear className={FORM_FIELD_CLASSNAME}>
                  {kanbanAreaMap.map(item => (
                    <Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='产线'
            >
              {getFieldDecorator('prodLineId')(
                <Lov
                  code="HME.FINAL_PRODLINE"
                  lovOptions={{ displayField: 'prodLineName' }}
                  queryParams={{
                    siteId: getFieldValue('siteId'), // 站点、工厂
                    tenantId,
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={this.resetSearch.bind(this)}>
                {intl.get(`hzero.common.button.reset`).d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.onSearch.bind(this)}>
                {intl.get(`hzero.common.button.search`).d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='物料编码'
            >
              {getFieldDecorator('materialId')(
                <Lov
                  queryParams={{ tenantId }}
                  code="HME.SITE_MATERIAL"
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='产品组编码'
            >
              {getFieldDecorator('productionGroupId')(
                <Lov
                  queryParams={{ tenantId }}
                  code="HME.PRODUCTION_GROUP"
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='不良展示工序'
            >
              {getFieldDecorator('workcellId')(
                <Lov
                  code="HME.FINAL_PROCESS"
                  lovOptions={{ displayField: 'workcellName' }}
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'), // 产线
                    tenantId,
                  }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
