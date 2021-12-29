/**
 * @Author:lly
 * @email: liyuan.liu@hand-china.com
 * @description： COS员工产量汇总报表
 */

import React, { Component } from 'react';
import { Bind } from 'lodash-decorators';
import { Form, Button, Col, Row, DatePicker, Select } from 'hzero-ui';
import { isFunction, uniq } from 'lodash';
import moment from 'moment';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import MultipleLov from '../../../components/MultipleLov/index';

const tenantId = getCurrentOrganizationId();
const commonModelPrompt = 'tarzan.hwms.cosEmployeeOutputSummaryReport';


@Form.create({ fieldNameProp: null })
export default class cosEmployeeOutputSummaryReport extends Component {
  constructor(props) {
    super(props);
    if(isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
      expandForm: false,
    };
  }


  @Bind()
  handleOnSearch(value, dataListName) {
    const { [dataListName]: dataSource } = this.state;
    const { form } = this.props;
    const flag = value ? value.every(e => dataSource.includes(e)) : false;
    if (value && value.length > 0 && !flag) {
      const newList = [].concat(...value.map(e => e.split(/[ ]+/)));
      const uniqueList = uniq(dataSource.concat(newList));
      this.setState({ [dataListName]: uniqueList });
      form.setFieldsValue({ [dataListName]: uniqueList });
    }
  }

  // 设置展开/关闭 更多查询
  @Bind()
  setExpandForm() {
    this.setState({ expandForm: !this.state.expandForm });
  }

  // 重置查询
  @Bind
  resetSearch = () => {
    const { form } = this.props;
    form.resetFields();
  };

  @Bind()
  handleSearch() {
    const { onSearch } = this.props;
    if(onSearch) {
      onSearch();
    }
  }

  render() {
    const { cosTypeMap = [] } = this.props;
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.createDateFrom`).d('时间从')}
            >
              {getFieldDecorator('createDateFrom', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonModelPrompt}.createDateFrom`).d('时间从'),
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('createDateTo') &&
                    moment(getFieldValue('createDateTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.createDateTo`).d('时间至')}
            >
              {getFieldDecorator('createDateTo', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonModelPrompt}.createDateTo`).d('时间至'),
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('createDateFrom') &&
                    moment(getFieldValue('createDateFrom')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.userId`).d('员工')}
            >
              {getFieldDecorator('userId')(<MultipleLov code='HME.USER' queryParams={{ tenantId }} />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={this.setExpandForm}>
                {this.state.expandForm
                  ? intl.get('hzero.common.button.collected').d('收起查询')
                  : intl.get(`hzero.common.button.viewMore`).d('更多查询')}
              </Button>
              <Button onClick={this.resetSearch}>
                {intl.get(`hzero.common.button.reset`).d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.handleSearch}>
                {intl.get(`hzero.common.button.search`).d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Row
          {...SEARCH_FORM_ROW_LAYOUT}
          style={{ display: this.state.expandForm ? '' : 'none' }}
        >
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.prodLineId`).d('产线')}
            >
              {getFieldDecorator('prodLineId')(
                <MultipleLov
                  code="HME.FINAL_PRODLINE"
                  queryParams={{
                    tenantId,
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.lineWorkcellId`).d('工段')}
            >
              {getFieldDecorator('lineWorkcellId')(
                <MultipleLov
                  code="HME.FINAL_LINE"
                  allowClear
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'), // 产线
                    tenantId,
                  }}
                />,
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.processId`).d('工序')}
            >
              {getFieldDecorator('processId')(
                <MultipleLov
                  code="HME.FINAL_PROCESS"
                  allowClear
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'), // 产线
                    lineWorkcellId: getFieldValue('lineWorkcellId'), // 工段
                    tenantId,
                  }}
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row
          {...SEARCH_FORM_ROW_LAYOUT}
          style={{ display: this.state.expandForm ? '' : 'none' }}
        >
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.materialCode`).d('物料编码')}
            >
              {getFieldDecorator('materialCode')(
                <MultipleLov
                  code="HME.SITE_MATERIAL"
                  lovOptions={{ valueField: 'materialCode' }}
                  queryParams={{
                    tenantId: getCurrentOrganizationId(),
                  }}
                  onChange={() => {
                    setFieldsValue({
                      materialVersion: '',
                    });
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.materialVersion`).d('物料版本')}
            >
              {getFieldDecorator('materialVersion')(
                <MultipleLov
                  code="HME.MATERIAL_VERSION"
                  disabled={
                    !getFieldValue('materialCode') ||
                    getFieldValue('materialCode').split(',').length > 1
                  }
                  queryParams={{
                    // siteId,
                    tenantId: getCurrentOrganizationId(),
                    materialId: getFieldValue('materialCode'),
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.cosType`).d('COS类型')}
            >
              {getFieldDecorator('cosType')(
                <Select mode="multiple" allowClear>
                  {cosTypeMap.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
