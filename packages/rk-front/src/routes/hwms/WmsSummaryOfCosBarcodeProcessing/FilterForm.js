import React from 'react';
import { Form, Button, Col, Row, Select, DatePicker, Input } from 'hzero-ui';
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
      workOrderNum: [],
      materialLotCode: [],
      labCode: [],
      waferNum: [],
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
    if(onSearch) {
      onSearch();
    }
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
  handleChangeAssemblyMaterialIds() {
    const { form: { resetFields } } = this.props;
    resetFields(['bomVersion']);
  }

  @Bind()
  handleChangeProdLineIds() {
    const { form: { resetFields } } = this.props;
    resetFields(['workcellIds']);
  }


  // 渲染
  render() {
    const { form, tenantId, cosTypeMap = [] } = this.props;
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    const { expandForm, workOrderNum, materialLotCode, labCode, waferNum } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col span={18}>
            <Row>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='开始时间'
                >
                  {getFieldDecorator('creationDateStart', {
                    rules: [
                      {
                        required: isEmpty(getFieldValue('workOrderNum')) && isEmpty(getFieldValue('materialLotCode'))
                                  && isEmpty(getFieldValue('waferNum')) && isEmpty(getFieldValue('sinkSupplierLot'))
                                  && isEmpty(getFieldValue('goldSupplierLot')),
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '开始时间',
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
                        getFieldValue('creationDateEnd') &&
                        moment(getFieldValue('creationDateEnd')).isBefore(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='结束时间'
                >
                  {getFieldDecorator('creationDateEnd', {
                    rules: [
                      {
                        required: isEmpty(getFieldValue('workOrderNum')) && isEmpty(getFieldValue('materialLotCode'))
                                  && isEmpty(getFieldValue('waferNum')) && isEmpty(getFieldValue('sinkSupplierLot'))
                                  && isEmpty(getFieldValue('goldSupplierLot')),
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '结束时间',
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
                        getFieldValue('creationDateStart') &&
                        moment(getFieldValue('creationDateStart')).isAfter(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='工单'
                >
                  {getFieldDecorator('workOrderNum')(
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
            </Row>
            <Row style={{ display: expandForm ? '' : 'none' }}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='产品编码'
                >
                  {getFieldDecorator('snMaterialId')(
                    <Lov code="HME.SITE_MATERIAL" queryParams={{ tenantId }} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='COS类型'
                >
                  {getFieldDecorator('cosType')(
                    <Select allowClear mode="multiple">
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
                  label='WAFER'
                >
                  {getFieldDecorator('waferNum')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'waferNum')}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({ waferNum: [] });
                          }
                        }
                      }
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {waferNum.map(e => (
                        <Select.Option key={e} value={e}>
                          {e}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="产线">
                  {getFieldDecorator('prodLineId')(
                    <MultipleLov
                      code="MT.PRODLINE"
                      queryParams={{
                        tenantId,
                      }}
                      onChange={() => {
                        setFieldsValue({
                          lineWorkcellId: null,
                          processId: null,
                        });
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item label="工段" {...SEARCH_FORM_ITEM_LAYOUT}>
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
                        setFieldsValue({
                          processId: null,
                        });
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
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
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='工位'
                >
                  {getFieldDecorator('workcellId')(
                    <MultipleLov code="MT.WORK_STATION" queryParams={{ tenantId }} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='条码'
                >
                  {getFieldDecorator('materialLotCode')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'materialLotCode')}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({ materialLotCode: [] });
                          }
                        }
                      }
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {materialLotCode.map(e => (
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
                  label='热沉条码'
                >
                  {getFieldDecorator('sinkCode')(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='热沉物料'
                >
                  {getFieldDecorator('sinkMaterialCodeId')(
                    <MultipleLov code="HME.SITE_MATERIAL" queryParams={{ tenantId }} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='热沉供应商批次'
                >
                  {getFieldDecorator('sinkSupplierLot')(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='金线条码'
                >
                  {getFieldDecorator('goldCode')(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='金线物料'
                >
                  {getFieldDecorator('goldMaterialCode')(
                    <MultipleLov code="HME.SITE_MATERIAL" queryParams={{ tenantId }} lovOptions={{ valueField: 'materialCode'}} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='金线供应商批次'
                >
                  {getFieldDecorator('goldSupplierLot')(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='操作人'
                >
                  {getFieldDecorator('createdBy')(
                    <Lov code="HME.USER" queryParams={{ tenantId }} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='实验代码'
                >
                  {getFieldDecorator('labCode')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'labCode')}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({ labCode: [] });
                          }
                        }
                      }
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {labCode.map(e => (
                        <Select.Option key={e} value={e}>
                          {e}
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
