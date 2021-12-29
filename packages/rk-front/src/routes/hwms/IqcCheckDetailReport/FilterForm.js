/**
 * @Author:lly
 * @email: liyuan.liu@hand-china.com
 * @description： IQC检验明细报表
 */

import React, { Component } from 'react';
import { Bind } from 'lodash-decorators';
import { Form, Button, Col, Row, DatePicker, Select, Input } from 'hzero-ui';
import { isFunction } from 'lodash';
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

const commonModelPrompt = 'tarzan.hwms.iqcCheckDetailReport';


@Form.create({ fieldNameProp: null })
export default class FilterForm extends Component {
  constructor(props) {
    super(props);
    if(isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
      expandForm: false,
    };
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
    const {
      checkStatusMap = [],
      checkResultMap = [],
      checkTypeMap = [],
      auditResultMap = [],
      siteMap = [],
      getSite = {},
    } = this.props;
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.siteId`).d('工厂')}
            >
              {getFieldDecorator('siteId', {
                initialValue: getSite.siteId,
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
              label={intl.get(`${commonModelPrompt}.iqcNumber`).d('检验单')}
            >
              {getFieldDecorator('iqcNumber')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.materialId`).d('物料编码')}
            >
              {getFieldDecorator('materialId')(
                <MultipleLov
                  code="HME.SITE_MATERIAL"
                  lovOptions={{ valueField: 'materialId' }}
                  queryParams={{
                    tenantId: getCurrentOrganizationId(),
                  }}
                  // onChange={() => {
                  //   setFieldsValue({
                  //     materialVersion: '',
                  //   });
                  // }}
                />
              )}
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
              label={intl.get(`${commonModelPrompt}.inspectionStatus`).d('检验状态')}
            >
              {getFieldDecorator('inspectionStatus')(
                <Select allowClear>
                  {checkStatusMap.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.inspectionResult`).d('检验结果')}
            >
              {getFieldDecorator('inspectionResult')(
                <Select allowClear>
                  {checkResultMap.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.supplierId`).d('供应商')}
            >
              {getFieldDecorator('supplierId')(
                <MultipleLov
                  code="Z.SUPPLIER"
                  lovOptions={{ valueField: 'supplierId' }}
                  queryParams={{
                    tenantId: getCurrentOrganizationId(),
                  }}
                />
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
              label={intl.get(`${commonModelPrompt}.inspectionType`).d('检验类型')}
            >
              {getFieldDecorator('inspectionType')(
                <Select allowClear>
                  {checkTypeMap.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.finalDecision`).d('审核结果')}
            >
              {getFieldDecorator('finalDecision')(
                <Select allowClear>
                  {auditResultMap.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.qcBy`).d('检验员')}
            >
              {getFieldDecorator('qcBy')(
                <MultipleLov
                  code="HME.USER"
                  // lovOptions={{ valueField: 'materialId' }}
                  queryParams={{
                    tenantId: getCurrentOrganizationId(),
                  }}
                />
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
              label={intl.get(`${commonModelPrompt}.creationDateFrom`).d('创建时间从')}
            >
              {getFieldDecorator('creationDateFrom', {
                // rules: [
                //   {
                //     required: true,
                //     message: intl.get('hzero.common.validation.notNull', {
                //       name: intl.get(`${commonModelPrompt}.creationDateFrom`).d('创建时间从'),
                //     }),
                //   },
                // ],
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('creationDateTo') &&
                    moment(getFieldValue('creationDateTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.creationDateTo`).d('创建时间至')}
            >
              {getFieldDecorator('creationDateTo', {
                // rules: [
                //   {
                //     required: true,
                //     message: intl.get('hzero.common.validation.notNull', {
                //       name: intl.get(`${commonModelPrompt}.creationDateTo`).d('创建时间至'),
                //     }),
                //   },
                // ],
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('creationDateFrom') &&
                    moment(getFieldValue('creationDateFrom')).isAfter(currentDate, 'second')
                  }
                />
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
              label={intl.get(`${commonModelPrompt}.inspectionFinishDateFrom`).d('检验完成时间从')}
            >
              {getFieldDecorator('inspectionFinishDateFrom', {
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('inspectionFinishDateTo') &&
                    moment(getFieldValue('inspectionFinishDateTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.inspectionFinishDateTo`).d('检验完成时间至')}
            >
              {getFieldDecorator('inspectionFinishDateTo', {
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('inspectionFinishDateFrom') &&
                    moment(getFieldValue('inspectionFinishDateFrom')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
