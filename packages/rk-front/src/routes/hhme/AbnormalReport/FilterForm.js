import React from 'react';
import { Form, Button, Col, Row, Input, Select, DatePicker } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import moment from 'moment';

import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_3_LAYOUT,
  FORM_FIELD_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';
import { getDateFormat } from 'utils/utils';
import Lov from 'components/Lov';

const { Option } = Select;

const modelPrompt = 'tarzan.hmes.purchaseOrder';

@formatterCollections({ code: 'tarzan.hmes.abnormalCollection' })
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
    };
    props.onRef(this);
  }

  // 查询方法
  @Bind
  onSearch = () => {
    const { onSearch } = this.props;
    if (onSearch) {
      onSearch();
    }
  };

  // 查询条件展开/收起
  @Bind()
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({ expandForm: !expandForm });
  };

  // 重置查询
  @Bind()
  resetSearch = () => {
    const { form, onSearch } = this.props;
    form.resetFields();
    if (onSearch) {
      onSearch();
    }
  };

  // 设置lov主键值
  @Bind()
  setMaterialCode(val, record) {
    this.props.form.setFieldsValue({ materialId: record.materialId });
  }

  @Bind()
  setSupplierCode(val, record) {
    this.props.form.setFieldsValue({ supplierId: record.supplierId });
  }

  // 渲染
  render() {
    const { form, tenantId, areaList = [], abnormalTypeList = [], abnormalStatusList = [] } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { expandForm } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col span={18}>
            <Row>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.startTime`).d('发起时间从')}
                >
                  {getFieldDecorator('startTime', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '发起时间从',
                        }),
                      },
                    ],
                  })(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      format={getDateFormat()}
                      disabledDate={currentDate =>
                    getFieldValue('endTime') &&
                    moment(getFieldValue('endTime')).isBefore(currentDate, 'second')
                  }
                    />
              )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.endTime`).d('发起时间至')}
                >
                  {getFieldDecorator('endTime', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '发起时间至',
                        }),
                      },
                    ],
                  })(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      format={getDateFormat()}
                      disabledDate={currentDate =>
                        getFieldValue('startTime') &&
                        moment(getFieldValue('startTime')).isAfter(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.area`).d('制造部')}
                >
                  {getFieldDecorator('areaId')(
                    <Select allowClear className={FORM_FIELD_CLASSNAME}>
                      {areaList.map(e => (
                        <Option key={e.value} value={e.value}>
                          {e.meaning}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ display: expandForm ? '' : 'none' }}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.materialCode`).d('产线')}
                >
                  {getFieldDecorator('productionLineId')(
                    <Lov code="MT.PRODLINE" queryParams={{ tenantId }} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.shiftName`).d('班组')}
                >
                  {getFieldDecorator('shiftName')(<Lov code="HPFM.PLUS.ALL.DEPARTMENT" queryParams={{ tenantId }} />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.shiftCode`).d('班次')}
                >
                  {getFieldDecorator('shiftCode')(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.workOrderNum`).d('工单')}
                >
                  {getFieldDecorator('workOrderNum')(
                    <Lov code="MT.WORK_ORDER_NUM" queryParams={{ tenantId }} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.identification`).d('异常产品序列号')}
                >
                  {getFieldDecorator('identification')(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.exceptionType`).d('异常类型')}
                >
                  {getFieldDecorator('exceptionType')(
                    <Select allowClear className={FORM_FIELD_CLASSNAME}>
                      {abnormalTypeList.map(e => (
                        <Option key={e.typeCode} value={e.typeCode}>
                          {e.description}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.exceptionId`).d('异常描述')}
                >
                  {getFieldDecorator('exceptionId')(
                    <Lov code="HME.EXCEPTION_DESC" queryParams={{ tenantId }} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.exceptionStatus`).d('异常状态')}
                >
                  {getFieldDecorator('exceptionStatus')(
                    <Select allowClear className={FORM_FIELD_CLASSNAME}>
                      {abnormalStatusList.map(e => (
                        <Option key={e.value} value={e.value}>
                          {e.meaning}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={6} className={SEARCH_COL_CLASSNAME}>
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
      </Form>
    );
  }
}
