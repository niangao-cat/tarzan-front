import React, { Component } from 'react';
import { Form, Button, Row, Col, DatePicker, Select, Input } from 'hzero-ui';
import cacheComponent from 'components/CacheComponent';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { isFunction, uniq } from 'lodash';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';
import { getDateTimeFormat, getDateFormat } from 'utils/utils';
import Lov from 'components/Lov';
import moment from 'moment';
import MultipleLov from '../../../components/MultipleLov/index';
import ModalContainer, { registerContainer } from '../../../components/Modal/ModalContainer';

const FORM_COL_5_LAYOUT = {
  span: 5,
  style: { width: '20%' },
};

@Form.create({ fieldNameProp: null })
@cacheComponent({ cacheKey: '/hwms/barcode/list' })
export default class FilterForm extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
      workOrderNumList: [],
      materialCodeList: [],
      sn: [],
    };
  }

  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
  }

  /**
   * 表单校验
   */
  @Bind()
  handleSearch() {
    const { onSearch, form } = this.props;
    if (onSearch) {
      form.validateFields({ force: true }, (err) => {
        if (!err) {
          // 如果验证成功,则执行onSearch
          onSearch();
        }
      });
    }
  }

  /**
   * 表单展开收起
   */
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
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

  // 输入框更改
  @Bind()
  handelInputGroup(e, type) {
    const { form } = this.props;
    const { setFieldsValue } = form;
    const value = e.target.value[0];
    switch (type) {
      case 'ONE':
        setFieldsValue({ one: value });
        break;
      case 'TWO':
        setFieldsValue({ two: value });
        break;
      case 'THREE':
        setFieldsValue({ three: value });
        break;
      case 'FOUR':
        setFieldsValue({ four: value });
        break;
      default:
        break;
    }
  }


  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, tenantId } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { expandForm, materialCodeList, workOrderNumList, sn } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_5_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="进站时间从">
              {getFieldDecorator('startTime', {
                initialValue: moment(
                  moment()
                    .subtract(1, 'months')
                    .format('YYYY-MM-DD')
                ),
                rules: [
                  {
                    required: !(getFieldValue('sn') && getFieldValue('sn').length > 0
                      || getFieldValue('workOrderNumList') && getFieldValue('workOrderNumList').length > 0),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '进站时间从',
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('endTime') &&
                    (moment(getFieldValue('endTime')).isBefore(currentDate, 'second') ||
                      moment(getFieldValue('endTime')).subtract('months', 1).isAfter(currentDate, 'second'))
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_5_LAYOUT}>
            <Form.Item label="进站时间至" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('endTime', {
                initialValue: moment(
                  moment().format('YYYY-MM-DD')
                ),
                rules: [
                  {
                    required: !(getFieldValue('sn') && getFieldValue('sn').length > 0
                      || getFieldValue('workOrderNumList') && getFieldValue('workOrderNumList').length > 0),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '进站时间至',
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('startTime') &&
                    (moment(getFieldValue('startTime')).subtract('months', -1).isBefore(currentDate, 'second') ||
                      moment(getFieldValue('startTime')).isAfter(currentDate, 'second'))
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_5_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="工序">
              {getFieldDecorator('processCode', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '工序',
                    }),
                  },
                ],
              })(
                <Lov
                  code="HME.FINAL_PROCESS"
                  allowClear
                  queryParams={{
                    tenantId,
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_5_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="序列号">
              {getFieldDecorator('sn', {
              })(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => this.handleOnSearch(val, 'sn')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        this.setState({ sn: [] });
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {sn.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_5_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={this.toggleForm}>
                {expandForm
                  ? '收起'
                  : '更多'}
              </Button>
              <Button data-code="reset" onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button
                data-code="search"
                type="primary"
                htmlType="submit"
                onClick={this.handleSearch}
              >
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_5_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="工单号">
              {getFieldDecorator('workOrderNumList')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => this.handleOnSearch(val, 'workOrderNumList')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        this.setState({ workOrderNumList: [] });
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {workOrderNumList.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_5_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="SN产品编码">
              {getFieldDecorator('materialCodeList')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => this.handleOnSearch(val, 'materialCodeList')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        this.setState({ materialCodeList: [] });
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {materialCodeList.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_5_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="工位">
              {getFieldDecorator('workcellCode')(
                <MultipleLov
                  code="HME.FINAL_WORKCELL"
                  allowClear
                  queryParams={{
                    workcellId: getFieldValue('processCode'),
                    tenantId,
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_5_LAYOUT}>
            <Form.Item label="班次编码" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('shiftCode')(<Input />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_5_LAYOUT}>
            <Form.Item label="班次日期" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('shiftDate')(
                <DatePicker
                  style={{ width: '100%' }}
                  format={getDateFormat()}
                  placeholder=""
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <ModalContainer ref={registerContainer} />
      </Form>
    );
  }
}
