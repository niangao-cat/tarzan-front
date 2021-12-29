import React from 'react';
import { Form, Button, Col, Row, Input, Select, DatePicker } from 'hzero-ui';
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
import Lov from 'components/Lov';
import MultipleLov from '@/components/MultipleLov';


// model 层连接
@formatterCollections({ code: 'tarzan.hmes.abnormalCollection' })
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      workOrderNumList: [],
      productionCodeList: [],
      materialLotCodeList: [],
      reworkSnList: [],
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
    const { onSearch, form } = this.props;
    form.validateFields((err) => {
      if(!err) {
        if(onSearch) {
          onSearch();
        }
      }
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

  @Bind()
  handleResetWorkStartDate() {
    const { form: { getFieldValue, resetFields } } = this.props;
    if(isEmpty(getFieldValue('workStartFrom'))) {
      resetFields([ 'workStartFrom' ]);
    }

    if(isEmpty(getFieldValue('workStartTo'))) {
      resetFields([ 'workStartTo' ]);
    }
  }


  // 渲染
  render() {
    const { form, tenantId, cosTypeMap = [], workOrderStatusOptions = []} = this.props;
    const { getFieldDecorator, getFieldValue, resetFields } = form;
    const { expandForm, workOrderNumList, productionCodeList, materialLotCodeList, reworkSnList } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col span={18}>
            <Row>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='产线'
                >
                  {getFieldDecorator('prodLineId')(
                    <Lov
                      code="MT.PRODLINE"
                      queryParams={{ tenantId }}
                      onChange={() => {
                        resetFields([ 'workcellLineId', 'workcellProcessId', 'workcellStationId' ]);
                        this.handleResetWorkStartDate();
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='工段编码'
                >
                  {getFieldDecorator('workcellLineId')(
                    <MultipleLov
                      code="HME.FINAL_LINE"
                      allowClear
                      queryParams={{
                        prodLineId: getFieldValue('prodLineId'),
                        tenantId,
                        typeFlag: 'LINE',
                      }}
                      onChange={() => {
                        resetFields([ 'workcellProcessId', 'workcellStationId' ]);
                        this.handleResetWorkStartDate();
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='工序编码'
                >
                  {getFieldDecorator('workcellProcessId')(
                    <MultipleLov
                      code="HME.FINAL_PROCESS"
                      allowClear
                      queryParams={{
                        prodLineId: getFieldValue('prodLineId'),
                        lineWorkcellId: getFieldValue('workcellLineId'),
                        typeFlag: 'PROCESS',
                        tenantId,
                      }}
                      onChange={() => {
                        resetFields(['workcellStationId']);
                        this.handleResetWorkStartDate();
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
                  label='工位编码'
                >
                  {getFieldDecorator('workcellStationId')(
                    <MultipleLov
                      code="HME.FINAL_WORKCELL"
                      allowClear
                      queryParams={{
                        prodLineId: getFieldValue('prodLineId'),
                        processId: getFieldValue('workcellProcessId'),
                        lineWorkcellId: getFieldValue('workcellLineId'),
                        typeFlag: 'PROCESS',
                        tenantId,
                      }}
                      onChange={() => {
                        this.handleResetWorkStartDate();
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='设备编码'
                >
                  {getFieldDecorator('equipmentId')(
                    <MultipleLov
                      code="HME.EQUIPMENT"
                      queryParams={{ tenantId }}
                      onChange={() => {
                        this.handleResetWorkStartDate();
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='工单号'
                >
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
                          this.handleResetWorkStartDate();
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
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='工单状态'
                >
                  {getFieldDecorator('workOrderStatusList')(
                    <Select mode="multiple" style={{ width: '100%' }} allowClear>
                      {workOrderStatusOptions.map(wo => {
                        return (
                          <Select.Option value={wo.statusCode} key={wo.statusCode}>
                            {wo.description}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='产品编码'
                >
                  {getFieldDecorator('productionCodeList')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'productionCodeList')}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({ productionCodeList: [] });
                          }
                          this.handleResetWorkStartDate();
                        }
                      }
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {productionCodeList.map(e => (
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
                  label='产品序列号'
                >
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
                            this.handleResetWorkStartDate();
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
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='返修SN'
                >
                  {getFieldDecorator('reworkSnList')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'reworkSnList')}
                      onChange={
                          val => {
                            if (val.length === 0) {
                              this.setState({ reworkSnList: [] });
                            }
                          }
                        }
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {reworkSnList.map(e => (
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
                  label='实验代码'
                >
                  {getFieldDecorator('identification')(
                    <Input
                      onChange={() => {
                        this.handleResetWorkStartDate();
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='是否不良'
                >
                  {getFieldDecorator('badFlag')(
                    <Select
                      allowClear
                      onChange={() => {
                        this.handleResetWorkStartDate();
                      }}
                    >
                      <Select.Option key='N' value='N'>
                        否
                      </Select.Option>
                      <Select.Option key='Y' value='Y'>
                        是
                      </Select.Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='是否返修'
                >
                  {getFieldDecorator('reFlag')(
                    <Select
                      allowClear
                      onChange={() => {
                        this.handleResetWorkStartDate();
                      }}
                    >
                      <Select.Option key='N' value='N'>
                        否
                      </Select.Option>
                      <Select.Option key='Y' value='Y'>
                        是
                      </Select.Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='班次日期'
                >
                  {getFieldDecorator('shiftDate')(
                    <DatePicker
                      showTime
                      placeholder=""
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD"
                      onChange={() => {
                        this.handleResetWorkStartDate();
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='班次'
                >
                  {getFieldDecorator('shiftCode')(
                    <Input
                      onChange={() => {
                        this.handleResetWorkStartDate();
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='进站人'
                >
                  {getFieldDecorator('userInId')(
                    <Lov
                      code="HIAM.USER.ORG"
                      queryParams={{ tenantId }}
                      onChange={() => {
                        this.handleResetWorkStartDate();
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='出站人'
                >
                  {getFieldDecorator('userOutId')(
                    <Lov
                      code="HIAM.USER.ORG"
                      queryParams={{ tenantId }}
                      onChange={() => {
                        this.handleResetWorkStartDate();
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='作业平台类型'
                >
                  {getFieldDecorator('workType')(
                    <Select
                      allowClear
                      onChange={() => {
                        this.handleResetWorkStartDate();
                      }}
                    >
                      {cosTypeMap.map(item => (
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
                  label='加工开始时间起'
                >
                  {getFieldDecorator('workStartFrom', {
                    rules: [
                      {
                        required: isEmpty(getFieldValue('materialLotCodeList')) && isEmpty(getFieldValue('reworkSnList')),
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '加工开始时间起',
                        }),
                      },
                    ],
                  })(
                    <DatePicker
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                      placeholder={null}
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                        getFieldValue('workStartTo') &&
                        moment(getFieldValue('workStartTo')).isBefore(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='加工开始时间至'
                >
                  {getFieldDecorator('workStartTo', {
                    rules: [
                      {
                        required: isEmpty(getFieldValue('materialLotCodeList')) && isEmpty(getFieldValue('reworkSnList')),
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '加工开始时间至',
                        }),
                      },
                    ],
                  })(
                    <DatePicker
                      showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                      placeholder={null}
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                        getFieldValue('workStartFrom') &&
                        moment(getFieldValue('workStartFrom')).isAfter(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='加工结束时间起'
                >
                  {getFieldDecorator('workEndFrom')(
                    <DatePicker
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                      placeholder={null}
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                        getFieldValue('workEndTo') &&
                        moment(getFieldValue('workEndTo')).isBefore(currentDate, 'second')
                      }
                      onChange={() => {
                        this.handleResetWorkStartDate();
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='加工结束时间至'
                >
                  {getFieldDecorator('workEndTo')(
                    <DatePicker
                      showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                      placeholder={null}
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                        getFieldValue('workEndFrom') &&
                        moment(getFieldValue('workEndFrom')).isAfter(currentDate, 'second')
                      }
                      onChange={() => {
                        this.handleResetWorkStartDate();
                      }}
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
