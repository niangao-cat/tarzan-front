import React from 'react';
import { Bind } from 'lodash-decorators';
import { Form, Button, Col, Row, Select, Input, DatePicker } from 'hzero-ui';
import { isFunction, uniq, isEmpty } from 'lodash';
import moment from 'moment';

import Lov from 'components/Lov';
import MultipleLov from '@/components/MultipleLov';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DEFAULT_DATE_FORMAT,
} from 'utils/constants';

const tenantId = getCurrentOrganizationId();

// 表单创建
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
      workOrderNumList: [],
      waferList: [],
      materialLotCodeList: [],
      labCodeList: [],
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

  // 查询方法
  @Bind
  onSearch = () => {
    const { onSearch } = this.props;
    if(onSearch) {
      onSearch();
    }
  };

  // 查询条件展开/收起
  @Bind
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({ expandForm: !expandForm });
  };

  // 重置查询
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
  }

  render() {
    const { form, cosTypeMap, defaultDate, workOrderTypeList } = this.props;
    const { getFieldDecorator, getFieldValue, resetFields } = form;
    const { expandForm, workOrderNumList, waferList, materialLotCodeList, labCodeList } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label={intl.get(`workOrderNumList`).d('工单')}>
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
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="开始时间">
              {getFieldDecorator('creationDateFrom', {
                initialValue: defaultDate.creationDateFrom,
                rules: [
                  {
                    required: isEmpty(getFieldValue('workOrderNumList')) && isEmpty(getFieldValue('waferList')) && isEmpty(getFieldValue('materialLotCodeList')) && isEmpty(getFieldValue('labCodeList')),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '开始时间',
                    }),
                  },
                ],
              })(
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder={null}
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  format={DEFAULT_DATE_FORMAT}
                  disabledDate={currentDate =>
                    getFieldValue('creationDateTo') &&
                    moment(getFieldValue('creationDateTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="结束时间">
              {getFieldDecorator('creationDateTo', {
                initialValue: defaultDate.creationDateTo,
                rules: [
                  {
                    required: isEmpty(getFieldValue('workOrderNumList')) && isEmpty(getFieldValue('waferList')) && isEmpty(getFieldValue('materialLotCodeList')) && isEmpty(getFieldValue('labCodeList')),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '结束时间',
                    }),
                  },
                ],
              })(
                <DatePicker
                  style={{ width: '100%' }}
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  format={DEFAULT_DATE_FORMAT}
                  placeholder={null}
                  disabledDate={currentDate =>
                    getFieldValue('creationDateFrom') &&
                    moment(getFieldValue('creationDateFrom')).isAfter(currentDate, 'second')
                  }
                />
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
              label='工单版本'
            >
              {getFieldDecorator('productionVersion')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='工单类型'
            >
              {getFieldDecorator('workOrderType')(
                <Select style={{ width: '100%' }} allowClear>
                  {workOrderTypeList.map(e => (
                    <Select.Option key={e.value} value={e.value}>
                      {e.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label={intl.get(`materialCodeList`).d('产品编码')}>
              {getFieldDecorator('materialCodeList')(
                <MultipleLov
                  code="HME.SITE_MATERIAL"
                  queryParams={{ tenantId }}
                  lovOptions={{ valueField: 'materialCode' }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="COS类型" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('cosTypeList')(
                <Select allowClear mode="multiple">
                  {cosTypeMap.map(ele => (
                    <Select.Option value={ele.value} key={ele.value}>
                      {ele.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label={intl.get(`waferList`).d('WAFER')}>
              {getFieldDecorator('waferList')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => this.handleOnSearch(val, 'waferList')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        this.setState({ waferList: [] });
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {waferList.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='生产线'
            >
              {getFieldDecorator('prodLineId')(
                <MultipleLov
                  code="HME.FINAL_PRODLINE"
                  queryParams={{ tenantId }}
                  onChange={() => {
                    resetFields(['lineWorkcellId', 'processId']);
                  }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='工段'
            >
              {getFieldDecorator('lineWorkcellId')(
                <MultipleLov
                  code="HME.FINAL_LINE"
                  allowClear
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'),
                    tenantId,
                    typeFlag: 'LINE',
                  }}
                  onChange={() => {
                    resetFields(['processId']);
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='工序'
            >
              {getFieldDecorator('processId')(
                <MultipleLov
                  code="HME.FINAL_PROCESS"
                  allowClear
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'),
                    lineWorkcellId: getFieldValue('lineWorkcellId'),
                    typeFlag: 'PROCESS',
                    tenantId,
                  }}
                  onChange={() => {
                    resetFields(['workcellId']);
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="工位">
              {getFieldDecorator('workcellId')(
                <MultipleLov
                  code="HME.FINAL_WORKCELL"
                  allowClear
                  queryParams={{ tenantId, processId: getFieldValue('processId') }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label={intl.get(`materialLotCodeList`).d('条码')}>
              {getFieldDecorator('materialLotCodeList')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => this.handleOnSearch(val, 'materialLotCodeList')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        this.setState({ materialLotCodeList: [] });
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {materialLotCodeList.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='实验代码'
            >
              {getFieldDecorator('labCodeList')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => this.handleOnSearch(val, 'labCodeList')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        this.setState({ labCodeList: [] });
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {labCodeList.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="操作人">
              {getFieldDecorator('operatorId')(<Lov code="HME.USER" queryParams={{ tenantId }} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='呆滞标识'
            >
              {getFieldDecorator('sluggishFlag')(
                <Select style={{ width: '100%' }} allowClear>
                  <Select.Option key='Y' value='Y'>
                    是
                  </Select.Option>
                  <Select.Option key='N' value='N'>
                    否
                  </Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='是否冻结'
            >
              {getFieldDecorator('freezeFlag')(
                <Select style={{ width: '100%' }} allowClear>
                  <Select.Option key='Y' value='Y'>
                    是
                  </Select.Option>
                  <Select.Option key='N' value='N'>
                    否
                  </Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='是否不良'
            >
              {getFieldDecorator('ncFlag')(
                <Select style={{ width: '100%' }} allowClear>
                  <Select.Option key='Y' value='Y'>
                    是
                  </Select.Option>
                  <Select.Option key='N' value='N'>
                    否
                  </Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
