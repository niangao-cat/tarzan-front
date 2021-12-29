import React from 'react';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DEFAULT_DATE_FORMAT,
  FORM_FIELD_CLASSNAME,
} from 'utils/constants';
import { Form, Button, Col, Row, Input, Select, DatePicker } from 'hzero-ui';
import Lov from 'components/Lov';
import moment from 'moment';
import { getDateFormat, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

const { Option } = Select;

// 表单创建
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  // 初始化状态
  state = {
    expandForm: false,
  };

  // 查询方法
  @Bind
  onSearch = () => {
    const { onSearch, form } = this.props;
    form.validateFields((errs, values) => {

      // 日期框, 初始化
      const valuesConfirm = values;
      valuesConfirm.inspectionFinishDateFromStr = (valuesConfirm.inspectionFinishDateFromStr===""||valuesConfirm.inspectionFinishDateFromStr===undefined||valuesConfirm.inspectionFinishDateFromStr===null)
      ? null
      : moment(valuesConfirm.inspectionFinishDateFromStr).format(DEFAULT_DATE_FORMAT);
      valuesConfirm.inspectionFinishDateToStr = (valuesConfirm.inspectionFinishDateToStr===""||valuesConfirm.inspectionFinishDateToStr===undefined||valuesConfirm.inspectionFinishDateToStr===null)
      ? null
      : moment(valuesConfirm.inspectionFinishDateToStr).format(DEFAULT_DATE_FORMAT);
      if (!errs) {
        onSearch(valuesConfirm);
      }
    });
  };

  // 重置查询
  @Bind
  resetSearch = () => {
    const { form, onResetForm } = this.props;
    form.resetFields();
    onResetForm();
  };

   // 查询条件展开/收起
   @Bind()
   toggleForm() {
     const { expandForm } = this.state;
     this.setState({ expandForm: !expandForm });
   }


  // 渲染
  render() {
    // 获取整个表单
    const { form, inspectStatus } = this.props;

    // 获取表单的字段属性
    const { getFieldDecorator, getFieldValue } = form;

    // 获取更多查询状态
    const { expandForm } = this.state;

    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`iqcNumber`).d('单号')}
            >
              {getFieldDecorator('iqcNumber')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`supplierId`).d('供应商')}
            >
              {getFieldDecorator('supplierId', {})(
                <Lov
                  code="Z.SUPPLIER"
                  queryParams={{ tenantId }}
                  textField="SUPPLIER_CODE"
                  onChange={(value, records) => {
                    form.setFieldsValue({
                      supplierDes: records.supplierName,
                    });
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`tagGroupId`).d('检验组')}
            >
              {getFieldDecorator('tagGroupId', {})(
                <Lov queryParams={{ tenantId: getCurrentOrganizationId() }} code="QMS.TAG_GROUP" textField="tagGroupCode" />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={this.toggleForm}>
                {expandForm
                  ? intl.get('hzero.common.button.collected').d('收起查询')
                  : intl.get(`hzero.common.button.viewMore`).d('更多查询')}
              </Button>
              <Button onClick={this.resetSearch.bind(this)}>
                {intl.get(`hzero.common.button.reset`).d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.onSearch.bind(this)}>
                {intl.get(`hzero.common.button.search`).d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>

        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`lastUpdatedBy`).d('检验员')}
            >
              {getFieldDecorator('lastUpdatedBy')(
                <Lov code="HME.USER" queryParams={{ tenantId }} />
                  )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`inspectionFinishDateFromStr`).d('检验时间从')}
            >
              {getFieldDecorator('inspectionFinishDateFromStr', {
                  })(
                    <DatePicker
                      showTime
                      placeholder=""
                      style={{ width: '100%' }}
                      format={getDateFormat()}
                      disabledDate={currentDate =>
                    getFieldValue('inspectionFinishDateToStr') &&
                    (moment(getFieldValue('inspectionFinishDateToStr')).isBefore(currentDate, 'second') ||
                    moment(getFieldValue('inspectionFinishDateToStr')).subtract('days', 30).isAfter(currentDate, 'second'))
                  }
                    />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`inspectionFinishDateToStr`).d('检验时间至')}
            >
              {getFieldDecorator('inspectionFinishDateToStr', {
                  })(
                    <DatePicker
                      showTime
                      placeholder=""
                      style={{ width: '100%' }}
                      format={getDateFormat()}
                      disabledDate={currentDate =>
                    getFieldValue('inspectionFinishDateFromStr') &&
                    (moment(getFieldValue('inspectionFinishDateFromStr')).subtract('days', -30).isBefore(currentDate, 'second')||
                    moment(getFieldValue('inspectionFinishDateFromStr')).isAfter(currentDate, 'second'))
                  }
                    />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`inspectionResult`).d('检验结果')}
            >
              {getFieldDecorator('inspectionResult')(
                <Select allowClear className={FORM_FIELD_CLASSNAME}>
                  {inspectStatus
                    .filter(item => item.value !== 'org')
                    .map(n => (
                      <Option key={n.value} value={n.value}>
                        {n.meaning}
                      </Option>
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
