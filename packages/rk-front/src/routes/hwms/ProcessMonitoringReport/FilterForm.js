import React from 'react';
import { Form, Button, Col, Row, InputNumber, Select, DatePicker, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import { isEmpty, uniq } from 'lodash';

import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';
import { getDateTimeFormat } from 'utils/utils';
import MultipleLov from '@/components/MultipleLov';


// model 层连接
@formatterCollections({ code: 'tarzan.hmes.abnormalCollection' })
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      workOrderList: [],
      materialCodeList: [],
    };
    if(props.onRef) {
      props.onRef(this);
    }
  }

  // 查询条件展开/收起
  @Bind()
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({ expandForm: !expandForm });
  };

  @Bind()
  handleSearch() {
    const { onSearch } = this.props;
    if(onSearch) {
      onSearch();
    }
  }

  // 重置查询
  @Bind()
  resetSearch = () => {
    const { form } = this.props;
    form.resetFields();
  };

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

  @Bind()
  handleChangeAreaId() {
    this.props.form.resetFields([ 'prodLineId' ]);
  }


  // 渲染
  render() {
    const { form, tenantId, siteInfo = {}, statusMap, typeMap, departmentList } = this.props;
    const { getFieldDecorator, getFieldValue, resetFields } = form;
    const { expandForm, workOrderList, materialCodeList } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col span={18}>
            <Row>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='站点'
                >
                  {getFieldDecorator('siteCode', {
                    initialValue: siteInfo.siteCode,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='部门'
                >
                  {getFieldDecorator('areaId', {
                    rules: [
                      {
                        required: isEmpty(getFieldValue('workOrderList')),
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '部门',
                        }),
                      },
                    ],
                  })(
                    <Select onChange={this.handleChangeAreaId} allowClear>
                      {departmentList.map(item => (
                        <Select.Option key={item.departmentId} value={item.departmentId}>
                          {item.departmentName}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='产线'
                >
                  {getFieldDecorator('prodLineId', {
                    rules: [
                      {
                        required: isEmpty(getFieldValue('workOrderList')),
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '产线',
                        }),
                      },
                    ],
                  })(
                    <MultipleLov
                      code="HME.FINAL_PRODLINE"
                      allowClear
                      queryParams={{
                        tenantId,
                        departmentId: getFieldValue('areaId'),
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ display: expandForm ? '' : 'none' }}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='工单'
                >
                  {getFieldDecorator('workOrderList')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'workOrderList')}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({ workOrderList: [] });
                          }
                          if(!getFieldValue('areaId')) {
                            resetFields(['areaId']);
                          }
                          if(!getFieldValue('prodLineId')) {
                            resetFields(['prodLineId']);
                          }
                        }
                      }
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {workOrderList.map(e => (
                        <Select.Option key={e} value={e}>
                          {e}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='工单版本'
                >
                  {getFieldDecorator('version')(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='工单物料编码'
                >
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
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='工单类型'
                >
                  {getFieldDecorator('workoderType')(
                    <Select allowClear>
                      {typeMap.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='工单状态'
                >
                  {getFieldDecorator('workoderStatus')(
                    <Select allowClear mode="multiple">
                      {statusMap.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='是否主产品'
                >
                  {getFieldDecorator('flag')(
                    <Select allowClear>
                      <Select.Option key="N" value="N">
                        否
                      </Select.Option>
                      <Select.Option key="Y" value="Y">
                        是
                      </Select.Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='工单物料组'
                >
                  {getFieldDecorator('itemMaterialAttr')(
                    <MultipleLov
                      code="WMS.ITEM_GROUP"
                      queryParams={{
                        tenantId,
                        ncObjectId: getFieldValue('ncGroupId'),
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='完成率起(%)'
                >
                  {getFieldDecorator('completeRateFrom')(<InputNumber />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='工单入库率起(%)'
                >
                  {getFieldDecorator('inRateFrom')(<InputNumber />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='计划开始时间起'
                >
                  {getFieldDecorator('planStartTimeFrom')(
                    <DatePicker
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                      placeholder={null}
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                        getFieldValue('planStartTimeTo') &&
                        moment(getFieldValue('planStartTimeTo')).isBefore(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='计划开始时间至'
                >
                  {getFieldDecorator('planStartTimeTo')(
                    <DatePicker
                      showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                      placeholder={null}
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                        getFieldValue('planStartTimeFrom') &&
                        moment(getFieldValue('planStartTimeFrom')).isAfter(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='计划完成时间起'
                >
                  {getFieldDecorator('planCompleteTimeFrom')(
                    <DatePicker
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                      placeholder={null}
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                        getFieldValue('planCompleteTimeTo') &&
                        moment(getFieldValue('planCompleteTimeTo')).isBefore(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='计划完成时间至'
                >
                  {getFieldDecorator('planCompleteTimeTo')(
                    <DatePicker
                      showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                      placeholder={null}
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                        getFieldValue('planCompleteTimeFrom') &&
                        moment(getFieldValue('planCompleteTimeFrom')).isAfter(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='工单实际完成时间起'
                >
                  {getFieldDecorator('actualCompleteTimeFrom')(
                    <DatePicker
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                      placeholder={null}
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                        getFieldValue('actualCompleteTimeTo') &&
                        moment(getFieldValue('actualCompleteTimeTo')).isBefore(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='工单实际完成时间至'
                >
                  {getFieldDecorator('actualCompleteTimeTo')(
                    <DatePicker
                      showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                      placeholder={null}
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                        getFieldValue('actualCompleteTimeFrom') &&
                        moment(getFieldValue('actualCompleteTimeFrom')).isAfter(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='ERP创建时间起'
                >
                  {getFieldDecorator('erpCreateTimeFrom')(
                    <DatePicker
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                      placeholder={null}
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                        getFieldValue('erpCreateTimeTo') &&
                        moment(getFieldValue('erpCreateTimeTo')).isBefore(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='ERP创建时间至'
                >
                  {getFieldDecorator('erpCreateTimeTo')(
                    <DatePicker
                      showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                      placeholder={null}
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                        getFieldValue('erpCreateTimeFrom') &&
                        moment(getFieldValue('erpCreateTimeFrom')).isAfter(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='ERP下达时间起'
                >
                  {getFieldDecorator('erpRealseTimeFrom')(
                    <DatePicker
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                      placeholder={null}
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                        getFieldValue('erpRealseTimeTo') &&
                        moment(getFieldValue('erpRealseTimeTo')).isBefore(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='ERP下达时间至'
                >
                  {getFieldDecorator('erpRealseTimeTo')(
                    <DatePicker
                      showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                      placeholder={null}
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                        getFieldValue('erpRealseTimeFrom') &&
                        moment(getFieldValue('erpRealseTimeFrom')).isAfter(currentDate, 'second')
                      }
                    />
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
