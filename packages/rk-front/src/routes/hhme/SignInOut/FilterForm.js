import React from 'react';
import { Form, Button, Col, Row, DatePicker } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import moment from 'moment';

import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';
import { getDateFormat } from 'utils/utils';
import Lov from 'components/Lov';


const modelPrompt = 'tarzan.hhme.signInOut';

@formatterCollections({ code: 'tarzan.hhme.signInOut' })
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
    const { form, tenantId } = this.props;
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
                  label={intl.get(`${modelPrompt}.dateFrom`).d('发起时间从')}
                >
                  {getFieldDecorator('dateFrom', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.dateFrom`).d('发起时间从'),
                        }),
                      },
                    ],
                  })(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      format={getDateFormat()}
                      disabledDate={currentDate =>
                    getFieldValue('dateTo') &&
                    moment(getFieldValue('dateTo')).isBefore(currentDate, 'second')
                  }
                    />
              )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.dateTo`).d('发起时间至')}
                >
                  {getFieldDecorator('dateTo', {
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
                        getFieldValue('dateFrom') &&
                        (moment(getFieldValue('dateFrom')).isAfter(currentDate, 'second') ||
                        currentDate > moment(getFieldValue('dateFrom')).endOf('month'))
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.departmentName`).d('部门')}
                >
                  {getFieldDecorator('departmentId')(
                    <Lov code="HME.STOCKTAKE_AREA" queryParams={{ tenantId }} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ display: expandForm ? '' : 'none' }}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.prodLineCode`).d('产线')}
                >
                  {getFieldDecorator('prodLineId')(
                    <Lov code="MT.PRODLINE" queryParams={{ tenantId }} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.employeeName`).d('员工')}
                >
                  {getFieldDecorator('employeeNum')(
                    <Lov code="HPFM.EMPLOYEE" queryParams={{ tenantId }} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.workcellCode`).d('工段')}
                >
                  {getFieldDecorator('workcellId')(
                    <Lov code="WMS.MDM.RPT.WORKCELL" queryParams={{ tenantId }} />
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
