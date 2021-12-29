/**
 * FilterForm - 搜索栏
 * @date: 2020-07-29
 * @author: wxy <xinyu.wang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2020, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Row, Col, Input, Select, DatePicker } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, getDateTimeFormat } from 'utils/utils';
import Lov from 'components/Lov';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';

const modelPrompt = 'hwms.model.deliveryOrderQuery';

// 使用 Form.Item 组件
const FormItem = Form.Item;

/**
 * 搜索栏
 * @extends {Component} - React.Component
 * @reactProps {Object} deliveryOrderQuery - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ deliveryOrderQuery}) => ({
  deliveryOrderQuery,
  tenantId: getCurrentOrganizationId(),
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'hwms.deliveryOrderQuery',
})
export default class FilterForm extends React.Component {
  state = {
    expandForm: false,
    // productionLine: "",
  };

  // 查询条件展开/收起
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({ expandForm: !expandForm });
  }

  // 查询数据
  @Bind()
  fetchQueryList() {
    const { form, onSearch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        // const{productionLine} = this.state;
        // eslint-disable-next-line no-param-reassign
        // fieldsValue.productionLine = productionLine;
        onSearch(fieldsValue);
      }
    });
  }

  // 查询按钮点击
  @Bind()
  queryValue() {
    this.fetchQueryList();
  }

  // 重置form表单
  @Bind()
  handleFormReset() {
    const { form, onResetSearch } = this.props;
    form.resetFields();
    onResetSearch();
  }

  // 更新生产线的值
  refreshProdLine = (_, record) => {
    // this.setState({ productionLine: record.prodLineCode });
    this.props.form.setFieldsValue({
      productionLine: record.prodLineCode,
    });
  };

  // 渲染方法
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { tenantId, instructionDocStatusList } = this.props;
    const { expandForm } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col span={18}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.instructionDocNum`).d('配送单号')}
                >
                  {getFieldDecorator('instructionDocNum')(
                    <Input />
              )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.instructionDocStatus`).d('配送单状态')}
                >
                  {getFieldDecorator('instructionDocStatus', {})(
                    <Select mode="multiple" allowClear>
                      {instructionDocStatusList.map(item => (
                        <Select.Option key={item.value}>{item.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.siteId`).d('站点')}
                >
                  {getFieldDecorator('siteId')(
                    <Lov code="MT.SITE" queryParams={{ tenantId }} />
              )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.prodLineId`).d('产线')}
                >
                  {getFieldDecorator('prodLineId')(
                    <Lov
                      code="MT.PRODLINE"
                      queryParams={{ tenantId }}
                      onChange={this.refreshProdLine}
                    />
              )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT} style={{ display: 'none' }}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.productionLine`).d('产线')}
                >
                  {getFieldDecorator('productionLine')(
                    <Input />
              )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="工段">
                  {getFieldDecorator('workCell')(
                    <Lov
                      code="HME.WORKCELL"
                      allowClear
                      lovOptions={{
                        valueField: 'workcellCode',
                      }}
                      queryParams={{
                        prodLineId: getFieldValue('prodLineId'),
                        tenantId,
                        typeFlag: 'LINE',
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.instructionDocId`).d('组件料号')}
                >
                  {getFieldDecorator('materialId')(
                    <Lov code="MT.MATERIAL" queryParams={{ tenantId }} />
              )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.instructionDocId`).d('是否备齐')}
                >
                  {getFieldDecorator('suiteFlag')(
                    <Select allowClear>
                      <Select.Option key='N' value='N'>否</Select.Option>
                      <Select.Option key='Y' value='Y'>是</Select.Option>
                    </Select>
              )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.instructionDocId`).d('是否为补料单')}
                >
                  {getFieldDecorator('replenishmentFlag')(
                    <Select allowClear>
                      <Select.Option key='N' value='N'>否</Select.Option>
                      <Select.Option key='Y' value='Y'>是</Select.Option>
                    </Select>
              )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.instructionDocId`).d('是否生成补料单')}
                >
                  {getFieldDecorator('replenishmentCreatedFlag')(
                    <Select allowClear>
                      <Select.Option key='N' value='N'>否</Select.Option>
                      <Select.Option key='Y' value='Y'>是</Select.Option>
                    </Select>
              )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.actualReceivedDateFrom`).d('需求时间从')}
                >
                  {getFieldDecorator('demandTimeFrom')(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      showTime
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                  getFieldValue('demandTimeTo') &&
                    moment(getFieldValue('demandTimeTo')).isBefore(currentDate, 'second')
                  }
                    />
              )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.actualReceivedDateTo`).d('需求时间至')}
                >
                  {getFieldDecorator('demandTimeTo')(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      showTime
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                  getFieldValue('demandTimeFrom') &&
                    moment(getFieldValue('demandTimeFrom')).isAfter(currentDate, 'second')
                  }
                    />
              )}
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={6} className={SEARCH_COL_CLASSNAME}>
            <FormItem>
              <Button onClick={this.toggleForm}>
                {expandForm
                  ? intl.get('hzero.common.button.collected').d('收起查询')
                  : intl.get(`hzero.common.button.viewMore`).d('更多查询')}
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.queryValue}>
                {intl.get('tarzan.acquisition.transformation.button.search').d('查询')}
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
