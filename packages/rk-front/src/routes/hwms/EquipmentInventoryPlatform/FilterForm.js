import React from 'react';
import { Form, Button, Col, Row, Input, Select, DatePicker } from 'hzero-ui';
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
import { getDateTimeFormat, getDateFormat } from 'utils/utils';
import Lov from 'components/Lov';

// model 层连接
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

  // 查询条件展开/收起
  @Bind()
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({ expandForm: !expandForm });
  };

  // 重置查询
  @Bind()
  resetSearch() {
    const { form, onSearch } = this.props;
    form.resetFields();
    if (onSearch) {
      onSearch();
    }
  };

  @Bind()
  handleSearch() {
    const { onSearch } = this.props;
    if (onSearch) {
      onSearch();
    }
  }


  // 渲染
  render() {
    const { form, tenantId, ledgerType = [], statusMap = [], typeMap = [] } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { expandForm } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col span={18}>
            <Row>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="单据号">
                  {getFieldDecorator('stocktakeNum')(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="单据状态">
                  {getFieldDecorator('stocktakeStatus', {
                    initialValue: statusMap.filter(item => item.value !== "CANCELLED").map(e => e.value),
                  })(
                    <Select mode="multiple" allowClear>
                      {statusMap.map(item => (
                        <Select.Option key={item.value}>{item.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="盘点类型">
                  {getFieldDecorator('stocktakeType')(
                    <Select allowClear>
                      {typeMap.map(item => (
                        <Select.Option key={item.value}>{item.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ display: expandForm ? '' : 'none' }}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="盘点范围">
                  {getFieldDecorator('stocktakeRange')(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="保管部门">
                  {getFieldDecorator('businessId')(<Lov code="HME.BUSINESS_AREA" queryParams={{ tenantId }} />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`postingDateFrom`).d('入账日期从')}
                >
                  {getFieldDecorator('postingDateFrom')(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      showTime
                      format={getDateFormat()}
                      disabledDate={currentDate =>
                        getFieldValue('postingDateTo') &&
                        moment(getFieldValue('postingDateTo')).isBefore(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`postingDateTo`).d('入账日期至')}
                >
                  {getFieldDecorator('postingDateTo')(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      showTime
                      format={getDateFormat()}
                      disabledDate={currentDate =>
                        getFieldValue('postingDateFrom') &&
                        moment(getFieldValue('postingDateFrom')).isAfter(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`creationDateFrom`).d('创建时间从')}
                >
                  {getFieldDecorator('creationDateFrom')(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      showTime
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                        getFieldValue('creationDateTo') &&
                        moment(getFieldValue('creationDateTo')).isBefore(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`creationDateTo`).d('创建时间至')}
                >
                  {getFieldDecorator('creationDateTo')(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      showTime
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                        getFieldValue('creationDateFrom') &&
                        moment(getFieldValue('creationDateFrom')).isAfter(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="台账类别">
                  {getFieldDecorator('ledgerType')(
                    <Select allowClear>
                      {ledgerType.map(ele => (
                        <Select.Option value={ele.value} key={ele.value}>
                          {ele.meaning}
                        </Select.Option>
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
              <Button onClick={this.resetSearch}>
                {intl.get(`hzero.common.button.reset`).d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.handleSearch}>
                {intl.get(`hzero.common.button.search`).d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
