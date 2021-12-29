import React, { Component } from 'react';
import { Form, Button, Row, Col, DatePicker, Input, Select } from 'hzero-ui';
import cacheComponent from 'components/CacheComponent';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { isFunction, uniq } from 'lodash';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
import Lov from 'components/Lov';
import moment from 'moment';
import MultipleLov from '../../../components/MultipleLov/index';
import ModalContainer, { registerContainer } from '../../../components/Modal/ModalContainer';

/**
 *  页面搜索框
 * @extends {Component} - React.Component
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
@cacheComponent({ cacheKey: '/hwms/barcode/list' })
class FilterForm extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
      expandForm: false,
      workOrderNum: [],
      materialId: [],
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

  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    this.setState({ workOrderNum: [], materialId: [] });
    form.resetFields();
  }

  /**
   * 表单校验
   */
  @Bind()
  handleSearch() {
    const { onSearch, form } = this.props;
    if (onSearch) {
      form.validateFields((err, values) => {
        if (!err) {
          // 如果验证成功,则执行onSearch
          onSearch(values);
        }
      });
    }
  }

  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, tenantId, siteId } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { expandForm, workOrderNum, materialId } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='生产线'>
              {getFieldDecorator('prodLineIdList', {})(
                <MultipleLov
                  code='HME.FINAL_PRODLINE'
                  queryParams={{
                    tenantId,
                    siteId,
                  }}
                />,
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="工单">
              {getFieldDecorator('workOrderNum', {
              })(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => this.handleOnSearch(val, 'workOrderNum')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        this.setState({ workOrderNum: [] });
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {workOrderNum.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="产品编码">
              {getFieldDecorator('materialId', {
              })(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => this.handleOnSearch(val, 'materialId')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        this.setState({ materialId: [] });
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {materialId.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
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
              <Button onClick={this.handleFormReset}>
                {intl.get(`hzero.common.button.reset`).d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={() => this.handleSearch()}>
                {intl.get(`hzero.common.button.search`).d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="工段编码">
              {getFieldDecorator(
                'lineWorkcellIdList',
                {}
              )(
                <MultipleLov
                  allowClear
                  code="HME.FINAL_LINE"
                  queryParams={{
                    tenantId,
                    prodLineId: getFieldValue('prodLineIdList'),
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="日期">
              {getFieldDecorator('shiftDate')(
                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="班次">
              {getFieldDecorator('shiftCode', {})(<Input />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="派工时间从">
              {getFieldDecorator('startDate')(
                <DatePicker
                  style={{ width: '100%' }}
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  format={DEFAULT_DATETIME_FORMAT}
                  disabledDate={currentDate =>
                    getFieldValue('endDate') &&
                    moment(getFieldValue('endDate')).isBefore(currentDate, 'day')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="派工时间至">
              {getFieldDecorator('endDate')(
                <DatePicker
                  style={{ width: '100%' }}
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  format={DEFAULT_DATETIME_FORMAT}
                  disabledDate={currentDate =>
                    getFieldValue('startDate') &&
                    moment(getFieldValue('startDate')).isAfter(currentDate, 'day')
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="派工时段起">
              {getFieldDecorator('startWocellDate')(
                <DatePicker
                  style={{ width: '100%' }}
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  format={DEFAULT_DATETIME_FORMAT}
                  disabledDate={currentDate =>
                    getFieldValue('endWocellDate') &&
                    moment(getFieldValue('endWocellDate')).isBefore(currentDate, 'day')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="派工时段至">
              {getFieldDecorator('endWocellDate')(
                <DatePicker
                  style={{ width: '100%' }}
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  format={DEFAULT_DATETIME_FORMAT}
                  disabledDate={currentDate =>
                    getFieldValue('startWocellDate') &&
                    moment(getFieldValue('startWocellDate')).isAfter(currentDate, 'day')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="派工人">
              {getFieldDecorator('userId', {})(<Lov code="HIAM.USER.ORG" />)}
            </Form.Item>
          </Col>
        </Row>
        <ModalContainer ref={registerContainer} />
      </Form>
    );
  }
}

export default FilterForm;
