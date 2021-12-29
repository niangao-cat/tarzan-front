/*
 * @Description: COS条码加工异常汇总搜索
 * @version: 0.1.0
 * @Author: junfeng.chen@hand-china.com
 * @Date: 2021-01-26 09:02:39
 */


import React, { Component } from 'react';
import { Form, Button, Input, DatePicker, Row, Col, Select } from 'hzero-ui';
import cacheComponent from 'components/CacheComponent';
import { Bind, Throttle } from 'lodash-decorators';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import { isFunction, uniq } from 'lodash';
import moment from 'moment';
import {
  DEBOUNCE_TIME,
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';
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
@cacheComponent({ cacheKey: '/hhme/cos-barcode-exception' })
class FilterForm extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
      expandForm: false,
      waferNum: [],
      hotSinkCodeList: [],
      workOrderNum: [],
      heatSinkSupplierLotList: [],
      heatSinkMaterialLotList: [],
      goldWireSupplierLot: [],
      goldWireMaterialLot: [],
      materialLotCode: [],
      labCode: [],
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
      form.validateFields({ force: true }, err => {
        if (!err) {
          onSearch();
        }
      });
    }
  }

  @Throttle(DEBOUNCE_TIME)
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  }

  // 必输校验
  @Bind()
  handleRequired() {
    const { form } = this.props;
    const { getFieldValue } = form;
    // console.log('工单', getFieldValue('workOrderNum'));
    // console.log('wafer', getFieldValue('waferNum'));
    // console.log('3', getFieldValue('hotSinkCodeList'));
    // console.log('4', getFieldValue('heatSinkMaterialLotList'));
    // console.log('5', getFieldValue('goldWireMaterialLot'));
    // console.log('6', getFieldValue('materialLotCode'));
    return !(getFieldValue('workOrderNum') && getFieldValue('workOrderNum').length > 0
      || getFieldValue('waferNum') && getFieldValue('waferNum').length > 0
      || getFieldValue('hotSinkCodeList') && getFieldValue('hotSinkCodeList').length > 0
      || getFieldValue('heatSinkMaterialLotList') && getFieldValue('heatSinkMaterialLotList').length > 0
      || getFieldValue('goldWireMaterialLot') && getFieldValue('goldWireMaterialLot').length > 0
      || getFieldValue('materialLotCode') && getFieldValue('materialLotCode').length > 0
      || getFieldValue('heatSinkSupplierLotList') && getFieldValue('heatSinkSupplierLotList').length > 0
      || getFieldValue('goldWireSupplierLot') && getFieldValue('goldWireSupplierLot').length > 0);
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
   * render
   * @returns React.element
   */
  render() {
    const modelPrompt = 'hhme.workcellException.model.workcellException';
    const {
      form,
      tenantId,
      docTypeMap,
    } = this.props;
    const {
      expandForm = false,
      waferNum = [],
      hotSinkCodeList = [],
      workOrderNum =[],
      heatSinkSupplierLotList = [],
      heatSinkMaterialLotList = [],
      goldWireSupplierLot = [],
      goldWireMaterialLot = [],
      materialLotCode = [],
      labCode = [],
    } = this.state;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.beginTime`).d('时间开始')}
            >
              {getFieldDecorator('beginTime', {
                rules: [
                  {
                    required: this.handleRequired(),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '时间开始',
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('endTime') &&
                    moment(getFieldValue('endTime')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.endTime`).d('时间结束')}
            >
              {getFieldDecorator('endTime', {
                rules: [
                  {
                    required: this.handleRequired(),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '时间结束',
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('beginTime') &&
                    moment(getFieldValue('beginTime')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.realName`).d('操作人')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('realName', {})(<Input trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={this.toggleForm}>
                {expandForm
                  ? intl.get('hzero.common.button.collected').d('收起查询')
                  : intl.get('hzero.common.button.viewMore').d('更多查询')}
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
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.cosType`).d('COS类型')}
            >
              {getFieldDecorator('cosType', {})(
                <Select allowClear>
                  {docTypeMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.waferNum`).d('WAFER')}
              {...SEARCH_FORM_ITEM_LAYOUT}
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
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.hotSinkCodeList`).d('热沉编号')}
            >
              {getFieldDecorator('hotSinkCodeList')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => this.handleOnSearch(val, 'hotSinkCodeList')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        this.setState({ hotSinkCodeList: [] });
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {hotSinkCodeList.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.workOrderNum`).d('工单')}
              {...SEARCH_FORM_ITEM_LAYOUT}
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
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.materialId`).d('产品编码')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('materialId', {})(
                <Lov code="HME.SITE_MATERIAL" queryParams={{ tenantId }} textField="materialCode" />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='产线'>
              {getFieldDecorator('prodLineId')(
                <MultipleLov
                  code="HME.FINAL_PRODLINE"
                  queryParams={{
                    tenantId,
                  }}
                />
                // <Input />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工段'>
              {getFieldDecorator('lineWorkcellId', {
                // initialValue: workcellCodeList,
              })(
                <MultipleLov
                  code="HME.FINAL_LINE"
                  // onChange={() => resetWithFields('lineWorkcellId')}
                  allowClear
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'), // 产线
                    tenantId,
                  }}
                />,
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工序'>
              {getFieldDecorator('processId', {
                // initialValue: procedureCodeList,
              })(
                <MultipleLov
                  code="HME.FINAL_PROCESS"
                  // onChange={() => resetWithFields('processId')}
                  allowClear
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'), // 产线
                    lineWorkcellId: getFieldValue('lineWorkcellId'), // 工段
                    tenantId,
                  }}
                />,
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.workcellId`).d('工位')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('workcellId', {})(
                <MultipleLov
                  code="HME.FINAL_WORKCELL"
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'), // 产线
                    lineWorkcellId: getFieldValue('lineWorkcellId'), // 工段
                    processId: getFieldValue('processId'), // 工序
                    tenantId,
                  }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.heatSinkSupplierLotList`).d('热沉供应商批次')}
            >
              {getFieldDecorator('heatSinkSupplierLotList')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => this.handleOnSearch(val, 'heatSinkSupplierLotList')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        this.setState({ heatSinkSupplierLotList: [] });
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {heatSinkSupplierLotList.map(e => (
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
              label={intl.get(`${modelPrompt}.heatSinkMaterialId`).d('热沉物料')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('heatSinkMaterialId', {})(
                <MultipleLov code="MT.MATERIAL" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.heatSinkMaterialLotList`).d('热沉条码')}
            >
              {getFieldDecorator('heatSinkMaterialLotList')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => this.handleOnSearch(val, 'heatSinkMaterialLotList')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        this.setState({ heatSinkMaterialLotList: [] });
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {heatSinkMaterialLotList.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.goldWireSupplierLot`).d('金线供应商批次')}
            >
              {getFieldDecorator('goldWireSupplierLot')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => this.handleOnSearch(val, 'goldWireSupplierLot')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        this.setState({ goldWireSupplierLot: [] });
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {goldWireSupplierLot.map(e => (
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
              label={intl.get(`${modelPrompt}.goldWireMaterialId`).d('金线物料')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('goldWireMaterialId', {})(
                <MultipleLov code="MT.MATERIAL" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.goldWireMaterialLot`).d('金线条码')}
            >
              {getFieldDecorator('goldWireMaterialLot')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => this.handleOnSearch(val, 'goldWireMaterialLot')}
                  onChange={
                  val => {
                    if (val.length === 0) {
                      this.setState({ goldWireMaterialLot: [] });
                    }
                  }
                }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {goldWireMaterialLot.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.ncCodeId`).d('不良代码')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('ncCodeId')(
                <MultipleLov code="MT.NC_CODE" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.assetEncoding`).d('设备台机')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('assetEncoding')(<Input trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.materialLotCode`).d('条码')}
              {...SEARCH_FORM_ITEM_LAYOUT}
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
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.labCode`).d('实验代码')}
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
        <ModalContainer ref={registerContainer} />
      </Form>
    );
  }
}

export default FilterForm;
