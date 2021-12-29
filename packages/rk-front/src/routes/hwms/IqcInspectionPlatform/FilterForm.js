// 导入必要工具包
import React from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { getCurrentOrganizationId, getDateTimeFormat } from 'utils/utils';
import { isUndefined } from 'lodash';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  FORM_FIELD_CLASSNAME,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
import moment from 'moment';
import { Form, Button, Col, Row, Input, Select, DatePicker } from 'hzero-ui';

const { Option } = Select;
const tenantId = getCurrentOrganizationId();
const modelPromt = 'tarzan.hwms.IqcInspectionPlatform';

// model 层连接
@formatterCollections({ code: 'tarzan.hmes.IqcInspectionPlatform' })
@connect(InventoryAllocation => ({
  InventoryAllocation,
}))
// 表单创建
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  // 初始化状态
  state = {};

  // 查询方法
  @Bind
  onSearch = () => {
    const { onSearch, form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        const fieldValue = { ...values,
          createdDateFrom: isUndefined(values.createdDateFrom)? null: moment(values.createdDateFrom).format(DEFAULT_DATETIME_FORMAT),
          createdDateTo: isUndefined(values.createdDateTo)? null: moment(values.createdDateTo).format(DEFAULT_DATETIME_FORMAT),
         };
        onSearch(fieldValue);
      }
    });
  };

  // 重置查询
  @Bind
  resetSearch = () => {
    const { form, resetState } = this.props;
    form.resetFields();
    resetState();
  };

  // 渲染
  render() {
    // 获取整个表单
    const { form, dealStatusMap, isStatusMap, search } = this.props;

    // 获取表单的字段属性
    const { getFieldDecorator, getFieldValue } = form;


    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.delieryNum`).d('送货单号')}
            >
              {getFieldDecorator('instructionDocNum', {
                initialValue: search.instructionDocNum,
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.iqcNumber`).d('检验单号')}
            >
              {getFieldDecorator('iqcNumber', {
                initialValue: search.iqcNumber,
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.materialCode`).d('物料编码')}
            >
              {getFieldDecorator('materialCode', {
                initialValue: search.materialCode,
              })(<Input />)}
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
              {/* <Button type="primary" onClick={handleOnOpenBoard}>
                {intl.get(`hzero.common.button.inspect`).d('检验')}
              </Button> */}
            </Form.Item>
          </Col>
        </Row>

        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.inspectionStatus`).d('处理状态')}
            >
              {getFieldDecorator('inspectionStatus', {
                initialValue: search.inspectionStatus,
              })(
                <Select allowClear className={FORM_FIELD_CLASSNAME}>
                  {dealStatusMap
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
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.identification`).d('是否加急')}
            >
              {getFieldDecorator('identification', {
                initialValue: search.identification,
              })(
                <Select allowClear className={FORM_FIELD_CLASSNAME}>
                  {isStatusMap
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
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.supplierId`).d('供应商')}
            >
              {getFieldDecorator('supplierId', {
                initialValue: search.supplierId,
              })(<Lov code="Z.SUPPLIER" queryParams={{ tenantId }} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.locatorCode`).d('仓库')}
            >
              {getFieldDecorator('locatorCode', {
                initialValue: search.locatorCode,
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.createdDateFrom`).d('到货日期从')}
            >
              {getFieldDecorator('createdDateFrom', {})(
                <DatePicker
                  showTime
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('createdDateTo') &&
                    moment(getFieldValue('createdDateTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.createdDateTo`).d('到货日期至')}
            >
              {getFieldDecorator('createdDateTo', {})(
                <DatePicker
                  showTime
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('createdDateFrom') &&
                    moment(getFieldValue('createdDateFrom')).isAfter(currentDate, 'second')
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
