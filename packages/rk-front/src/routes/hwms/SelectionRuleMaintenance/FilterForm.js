/**
 * @author:ywj
 * @email:wenjie.yang01@hand-china.com
 * @description: 外协管理平台 视图层（筛选）
 */
import React from 'react';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  // FORM_FIELD_CLASSNAME,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import { Form, Button, Col, Row, Input } from 'hzero-ui';
// import Lov from 'components/Lov';
// import moment from 'moment';
// import {  getCurrentOrganizationId } from 'utils/utils';

// const tenantId = getCurrentOrganizationId();
// const { Option } = Select;

// 表单创建
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {

  // 静态状态
  state = {
    expandForm: false, // 查询限制解除
  };

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

  // 查询条件展开/收起
  @Bind
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({ expandForm: !expandForm });
  };

  // 渲染
  render() {
    // 获取整个表单
    const { form } = this.props;

    // 获取表单的字段属性
    const { getFieldDecorator } = form;

    // 获取更多查询状态

    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`cosRuleCode`).d('规则编码')}
            >
              {getFieldDecorator('cosRuleCode')(<Input />)}
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

        {/* <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`siteId`).d('工厂')}
            >
              {getFieldDecorator('siteId')(
                <Select allowClear className={FORM_FIELD_CLASSNAME}>
                  {siteMap.filter(item => item.siteId !== 'org')
                    .map(n => (
                      <Option key={n.siteId} value={n.siteId}>
                        {n.siteCode}
                      </Option>
                    ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`materialId`).d('物料编码')}
            >
              {getFieldDecorator('materialId')(
                <Lov
                  queryParams={{ tenantId }}
                  code="MT.MATERIAL"
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`materialVersion`).d('版本')}
            >
              {getFieldDecorator('materialVersion')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`instructionDocStatus`).d('单据状态')}
            >
              {getFieldDecorator('instructionDocStatus')(
                <Select allowClear className={FORM_FIELD_CLASSNAME}>
                  {docStatusMap.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`createdBy`).d('创建人')}
            >
              {getFieldDecorator('createdBy')(
                <Lov
                  queryParams={{ tenantId }}
                  code="HME.USER"
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`creationDateStart`).d('创建时间从')}
            >
              {getFieldDecorator('creationDateStart')(
                <DatePicker
                  showTime
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('creationDateEnd') &&
                    moment(getFieldValue('creationDateEnd')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`creationDateEnd`).d('创建时间至')}
            >
              {getFieldDecorator('creationDateEnd', {})(
                <DatePicker
                  showTime
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('creationDateStart') &&
                    moment(getFieldValue('creationDateStart')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row> */}
      </Form>
    );
  }
}
