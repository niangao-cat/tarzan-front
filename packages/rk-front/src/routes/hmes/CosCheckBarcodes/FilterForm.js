import React from 'react';
import { Bind } from 'lodash-decorators';
import { Form, Button, Col, Row, DatePicker, Select } from 'hzero-ui';
import { isEmpty, isFunction, uniq } from 'lodash';
import moment from 'moment';

import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  // DEFAULT_DATE_FORMAT,
} from 'utils/constants';
import Lov from 'components/Lov';
import MultipleLov from '@/components/MultipleLov';
import { getCurrentOrganizationId } from 'utils/utils';

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
      hotSinkCode: [],
      barcodeList: [],
      hotSinkSupplierLot: [],
      experimentCodeList: [],
      benchList: [],
      patchList: [],
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
    const { onSearch, form } = this.props;
    form.validateFields(errs => {
      if (!errs) {
        onSearch();
      }
    });
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

  @Bind()
  handleSiteInDateRequire() {
    const { form: { getFieldsValue } } = this.props;
    const { siteOutDateFrom, siteOutDateTo, workOrderNumList, waferList, materialLotCodeList, barcodeList, hotSinkCode, hotSinkSupplierLot, experimentCodeList } = getFieldsValue();
    return (!(siteOutDateFrom && siteOutDateTo) && (isEmpty(workOrderNumList) && isEmpty(waferList) && isEmpty(materialLotCodeList) && isEmpty(barcodeList) && isEmpty(hotSinkCode) && isEmpty(hotSinkSupplierLot) && isEmpty(experimentCodeList)));
  }

  @Bind()
  handleSiteOutDateRequire() {
    const { form: { getFieldsValue } } = this.props;
    const { siteInDateFrom, siteInDateTo, workOrderNumList, waferList, materialLotCodeList, barcodeList, hotSinkCode, hotSinkSupplierLot, experimentCodeList } = getFieldsValue();
    return (!(siteInDateFrom && siteInDateTo) && (isEmpty(workOrderNumList) && isEmpty(waferList) && isEmpty(materialLotCodeList) && isEmpty(barcodeList) && isEmpty(hotSinkCode) && isEmpty(hotSinkSupplierLot) && isEmpty(experimentCodeList)));
  }

  render() {
    const { form, cosTypeMap, orderTypeList } = this.props;
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    const {
      expandForm,
      workOrderNumList,
      waferList,
      materialLotCodeList,
      hotSinkCode,
      barcodeList,
      hotSinkSupplierLot,
      experimentCodeList,
      benchList,
      patchList,
    } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col span={18}>
            <Row>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="进站时间从">
                  {getFieldDecorator('siteInDateFrom', {
                    rules: [
                      {
                        required: this.handleSiteInDateRequire(),
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '进站时间从',
                        }),
                      },
                    ],
                  })(
                    <DatePicker
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder={null}
                      disabledDate={currentDate =>
                        getFieldValue('siteInDateTo') &&
                        moment(getFieldValue('siteInDateTo')).isBefore(currentDate, 'second')
                      }
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="进站时间至">
                  {getFieldDecorator('siteInDateTo', {
                    rules: [
                      {
                        required: this.handleSiteInDateRequire(),
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '进站时间至',
                        }),
                      },
                    ],
                  })(
                    <DatePicker
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder={null}
                      disabledDate={currentDate =>
                        getFieldValue('siteInDateFrom') &&
                        moment(getFieldValue('siteInDateFrom')).isAfter(currentDate, 'second')
                      }
                      showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="出站时间从">
                  {getFieldDecorator('siteOutDateFrom', {
                    rules: [
                      {
                        required: this.handleSiteOutDateRequire(),
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '出站时间从',
                        }),
                      },
                    ],
                  })(
                    <DatePicker
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD HH:mm:ss"
                      disabledDate={currentDate =>
                        getFieldValue('siteOutDateTo') &&
                        moment(getFieldValue('siteOutDateTo')).isBefore(currentDate, 'second')
                      }
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="出站时间至">
                  {getFieldDecorator('siteOutDateTo', {
                    rules: [
                      {
                        required: this.handleSiteOutDateRequire(),
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '出站时间至',
                        }),
                      },
                    ],
                  })(
                    <DatePicker
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD HH:mm:ss"
                      disabledDate={currentDate =>
                        getFieldValue('siteOutDateFrom') &&
                        moment(getFieldValue('siteOutDateFrom')).isAfter(currentDate, 'second')
                      }
                      showTime={{ defaultValue: moment('23：59：59', 'HH:mm:ss') }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
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
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="产品编码">
                  {getFieldDecorator('materialId')(
                    <MultipleLov code="MT.MATERIAL" queryParams={{ tenantId }} textField="materialCode" />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label={intl.get(`waferList`).d('wafer')}>
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
                <Form.Item label="COS类型" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('cosType')(
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
                          workcellId: null,
                        });
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item label="工段" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('lineWorkcellId')(
                    <MultipleLov
                      code="HME.FINAL_LINE"
                      allowClear
                      queryParams={{
                        prodLineId: getFieldValue('prodLineId'),
                        tenantId: getCurrentOrganizationId(),
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
                        tenantId: getCurrentOrganizationId(),
                      }}
                      onChange={() => {
                        setFieldsValue({workcellId: null});
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='工位编码'
                >
                  {getFieldDecorator('workcellId')(
                    <MultipleLov
                      code="HME.FINAL_WORKCELL"
                      allowClear
                      queryParams={{
                        prodLineId: getFieldValue('prodLineId'),
                        lineWorkcellId: getFieldValue('lineWorkcellId'), // 工段
                        processId: getFieldValue('processId'), // 工序
                        tenantId,
                      }}
                      maxTagCount={1}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="条码">
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
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="热沉编码">
                  {getFieldDecorator('hotSinkCode')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'hotSinkCode')}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({ hotSinkCode: [] });
                          }
                        }
                      }
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {hotSinkCode.map(e => (
                        <Select.Option key={e} value={e}>
                          {e}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="不良代码">
                  {getFieldDecorator('ncCodeId')(
                    <MultipleLov code="MT.NC_CODE" queryParams={{ tenantId }} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item label="工序状态" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('orderType')(
                    <Select allowClear>
                      {orderTypeList.map(ele => (
                        <Select.Option value={ele.value} key={ele.value}>
                          {ele.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label={intl.get(`barcodeList`).d('热沉条码')}>
                  {getFieldDecorator('barcodeList')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'barcodeList')}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({ barcodeList: [] });
                          }
                        }
                      }
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {barcodeList.map(e => (
                        <Select.Option key={e} value={e}>
                          {e}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label={intl.get(`barcodeList`).d('热沉供应商批次')}>
                  {getFieldDecorator('hotSinkSupplierLot')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'hotSinkSupplierLot')}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({ hotSinkSupplierLot: [] });
                          }
                        }
                      }
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {hotSinkSupplierLot.map(e => (
                        <Select.Option key={e} value={e}>
                          {e}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label={intl.get(`experimentCodeList`).d('实验代码')}>
                  {getFieldDecorator('experimentCodeList')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'experimentCodeList')}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({ experimentCodeList: [] });
                          }
                        }
                      }
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {experimentCodeList.map(e => (
                        <Select.Option key={e} value={e}>
                          {e}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label={intl.get(`benchList`).d('测试机台')}>
                  {getFieldDecorator('benchList')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'benchList')}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({ benchList: [] });
                          }
                        }
                      }
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {benchList.map(e => (
                        <Select.Option key={e} value={e}>
                          {e}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label={intl.get(`patchList`).d('贴片设备')}>
                  {getFieldDecorator('patchList')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'patchList')}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({ patchList: [] });
                          }
                        }
                      }
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {patchList.map(e => (
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
          </Col>

          <Col span={6} className={SEARCH_COL_CLASSNAME}>
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
      </Form>
    );
  }
}
