/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 员工产量汇总报表
 */

import React, { Component } from 'react';
import { Bind } from 'lodash-decorators';
import { Form, Button, Col, Row, DatePicker } from 'hzero-ui';
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
import MultipleLov from '@/components/MultipleLov';

const tenantId = getCurrentOrganizationId();
const commonModelPrompt = 'tarzan.hwms.employeeOutputSummaryReport';

@Form.create({ fieldNameProp: null })
export default class FilterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
    //  showRequiredFlag: true,
    };
    if(props.onRef) {
      props.onRef(this);
    }
  }

  // 设置展开/关闭 更多查询
  @Bind()
  setExpandForm() {
    this.setState({ expandForm: !this.state.expandForm });
  }

  // 重置查询
  @Bind()
  resetSearch = () => {
    const { form } = this.props;
    this.handleSetProdLine('', '');
    form.resetFields();
  };

  @Bind()
  handleSetProdLine(prodLineId, prodLineName) {
    const { onSetProdLine } = this.props;
    if(onSetProdLine) {
      onSetProdLine(prodLineId, prodLineName);
    }
  }

  // 渲染 界面布局
  render() {
    const { form: { getFieldDecorator, getFieldValue, setFieldsValue }, siteId, onSearch } = this.props;

    //  返回默认界面数据
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.dateFrom`).d('时间从')}
            >
              {getFieldDecorator('dateFrom', {
                rules: [
                  {
                    required: true,
                    message: '时间从不能为空',
                  },
                ],
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('dateTo') &&
                    moment(getFieldValue('dateTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.endTime`).d('时间至')}
            >
              {getFieldDecorator('dateTo', {
                rules: [
                  {
                    required: true,
                    message: '时间至不能为空',
                  },
                ],
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}

                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('dateFrom') &&
                    moment(getFieldValue('dateFrom')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            {/* {this.state.showRequiredFlag && ( */}
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="产线">
              {getFieldDecorator('prodLineId', {
                  initialValue: this.state.prodLineId,
                })(
                  <MultipleLov
                    code="MT.PRODLINE"
                    queryParams={{
                      tenantId,
                    }}
                    textValue={this.state.prodlineName}
                    onChange={(value, values) => {
                      this.handleSetProdLine(value, values.prodLineName);
                      setFieldsValue({
                        lineWorkcellId: null,
                        processId: null,
                      });
                    }}
                  />
                )}
            </Form.Item>
            {/* )} */}
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
              <Button type="primary" htmlType="submit" onClick={onSearch}>
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
            <Form.Item label="工段" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('lineWorkcellId')(
                <MultipleLov
                  code="HME.FINAL_LINE"
                  allowClear
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'),
                    tenantId: getCurrentOrganizationId(),
                    typeFlag: 'LINE',
                  }}
                  onChange={() => {
                  //  this.setState({ showRequiredFlag: false }, () => {
                  //    this.setState({ showRequiredFlag: true });
                  //  });
                  //  debugger;
                    setFieldsValue({
                      processId: null,
                    });
                  }}
                />
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
                    prodLineId: getFieldValue('prodLineId'),
                    lineWorkcellId: getFieldValue('lineWorkcellId'),
                    typeFlag: 'PROCESS',
                    tenantId: getCurrentOrganizationId(),
                  }}
                //  onChange={() => {
                //    this.setState({ showRequiredFlag: false }, () => {
                //      this.setState({ showRequiredFlag: true });
                //    });
                //  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.userId`).d('员工')}
            >
              {getFieldDecorator('userId')(<MultipleLov code="HIAM.USER.ORG" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row
          {...SEARCH_FORM_ROW_LAYOUT}
          style={{ display: this.state.expandForm ? '' : 'none' }}
        >
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`materialId`).d('物料编码')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('materialId')(
                <MultipleLov
                  code="HME.SITE_MATERIAL"
                  queryParams={{
                    siteId,
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
              label={intl.get(`materialVersion`).d('物料版本')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('materialVersion')(
                <MultipleLov
                  code="HME.MATERIAL_VERSION"
                  disabled={
                    !getFieldValue('materialId') ||
                    getFieldValue('materialId').split(',').length > 1
                  }
                  queryParams={{
                    siteId,
                    tenantId: getCurrentOrganizationId(),
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
