/**
 * @author:lly
 * @email:liyuan.liu@hand-china.com
 * @description产品组维护
 */
import React from 'react';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import { Form, Button, Col, Row, Select, Input } from 'hzero-ui';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

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
    } = this.props;

    // 获取表单的字段属性
    const { getFieldDecorator, getFieldValue } = form;

    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="工厂" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('siteId', {
                initialValue: siteInfo.siteId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`siteId`).d('工厂'),
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
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="产品组编码">
              {getFieldDecorator('productionGroupCode', {
                rules: [
                  {
                    required: false,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`siteId`).d('产品组编码'),
                    }),
                  },
                ],
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="产品组名称">
              {getFieldDecorator('description', {})(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button data-code="reset" onClick={() => this.resetSearch()}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button onClick={() => this.onSearch()} type="primary" htmlType="submit">
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="物料编码">
              {getFieldDecorator(
                'materialId',
                {}
              )(<Lov
                code="HME.SITE_MATERIAL"
                queryParams={{ tenantId }}
                onChange={() => {
                  form.setFieldsValue({productionVersion: null});
                }}
              />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="生产版本">
              {getFieldDecorator(
                'productionVersion',
                {}
              )(
                <Lov
                  code="HME.MATERIAL_VERSION"
                  queryParams={{
                    tenantId,
                    siteId: getFieldValue('siteId'),
                    materialId: getFieldValue('materialId'),
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
