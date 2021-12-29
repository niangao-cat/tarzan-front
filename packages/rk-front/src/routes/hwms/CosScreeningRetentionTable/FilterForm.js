import React from 'react';
import { Form, Button, Col, Row, Input, Select, DatePicker } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import { uniq } from 'lodash';

import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';
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
      wafer: [],
      materialLotCode: [],
      hotSinkCode: [],
      labCode: [],
      selectionSourceMaterialLotCode: [],
      virtualNum: [],
      identification: [],
      preSelectionLot: [],
      selectionRuleCode: [],
      hotSinkMaterialLotCode: [],
      hotSinkSupplierLot: [],
      goldMaterialLotCode: [],
      goldSupplierLot: [],
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
    const { onSearch, form } = this.props;
    if(onSearch) {
      form.validateFields((err) => {
        if(!err) {
          onSearch();
        }
      });
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

  // 必输校验
  @Bind()
  handleRequired() {
    const { form } = this.props;
    const { getFieldValue } = form;
    // console.log('工单', getFieldValue('workOrderNum'));
    // console.log('wafer', getFieldValue('wafer'));
    // console.log('条码', getFieldValue('materialLotCode'));
    // console.log('实验代码', getFieldValue('labCode'));
    // console.log('热沉编号', getFieldValue('hotSinkCode'));
    // console.log('虚拟号', getFieldValue('virtualNum'));
    // console.log('器件序列号', getFieldValue('identification'));
    // console.log('筛选批次', getFieldValue('preSelectionLot'));
    // console.log('热沉条码', getFieldValue('hotSinkMaterialLotCode'));
    // console.log('投料工单', getFieldValue('releaseWorkOrderNum'));
    // console.log('热沉供应商批次', getFieldValue('hotSinkSupplierLot'));
    // console.log('金线条码', getFieldValue('goldMaterialLotCode'));
    // console.log('金线供应商批次', getFieldValue('goldSupplierLot'));
    return !(getFieldValue('preSelectionDateFrom')
      || getFieldValue('preSelectionDateTo')
      || getFieldValue('loadDateFrom')
      || getFieldValue('loadDateTo')
      || getFieldValue('workOrderNum') && getFieldValue('workOrderNum').length > 0
      || getFieldValue('wafer') && getFieldValue('wafer').length > 0
      || getFieldValue('materialLotCode') && getFieldValue('materialLotCode').length > 0
      || getFieldValue('labCode') && getFieldValue('labCode').length > 0
      || getFieldValue('hotSinkCode') && getFieldValue('hotSinkCode').length > 0
      || getFieldValue('virtualNum') && getFieldValue('virtualNum').length > 0
      || getFieldValue('identification') && getFieldValue('identification').length > 0
      || getFieldValue('preSelectionLot') && getFieldValue('preSelectionLot').length > 0
      || getFieldValue('hotSinkMaterialLotCode')
      || getFieldValue('releaseWorkOrderNum')
      || getFieldValue('hotSinkSupplierLot')
      || getFieldValue('goldMaterialLotCode')
      || getFieldValue('goldSupplierLot')
      || getFieldValue('selectionSourceMaterialLotCode') && getFieldValue('selectionSourceMaterialLotCode').length > 0);
  }


  // 渲染
  render() {
    const { form, tenantId, statusMap = [], cosTypeMap, enableMap = [] } = this.props;
    const { getFieldDecorator, getFieldValue, resetFields } = form;
    const {
      expandForm,
      workOrderNum = [],
      wafer = [],
      materialLotCode = [],
      hotSinkCode = [],
      labCode = [],
      selectionSourceMaterialLotCode = [],
      virtualNum = [],
      identification = [],
      preSelectionLot = [],
      selectionRuleCode = [],
      hotSinkMaterialLotCode = [],
      hotSinkSupplierLot = [],
      goldMaterialLotCode = [],
      goldSupplierLot = [],
    } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row>
          <Col span={18}>
            <Row>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='预筛选时间从'
                >
                  {getFieldDecorator('preSelectionDateFrom', {
                    rules: [
                      {
                        required: this.handleRequired(),
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '预筛选时间从',
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
                        getFieldValue('preSelectionDateTo') &&
                        moment(getFieldValue('preSelectionDateTo')).isBefore(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='预筛选时间至'
                >
                  {getFieldDecorator('preSelectionDateTo', {
                    rules: [
                      {
                        required: this.handleRequired(),
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '预筛选时间至',
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
                        getFieldValue('preSelectionDateFrom') &&
                        moment(getFieldValue('preSelectionDateFrom')).isAfter(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='装箱时间从'
                >
                  {getFieldDecorator('loadDateFrom', {
                    rules: [
                      {
                        required: this.handleRequired(),
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '装箱时间从',
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
                        getFieldValue('loadDateTo') &&
                        moment(getFieldValue('loadDateTo')).isBefore(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='装箱时间至'
                >
                  {getFieldDecorator('loadDateTo', {
                    rules: [
                      {
                        required: this.handleRequired(),
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '装箱时间至',
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
                        getFieldValue('loadDateFrom') &&
                        moment(getFieldValue('loadDateFrom')).isAfter(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ display: expandForm ? '' : 'none' }}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='筛选状态'
                >
                  {getFieldDecorator('selectionStatus')(
                    <Select allowClear>
                      {statusMap.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='仓库'
                >
                  {getFieldDecorator('warehouseId')(
                    <MultipleLov
                      code="WMS.WAREHOUSE_LOV"
                      queryParams={{ tenantId }}
                      onChange={() => {
                        resetFields(['locatorId']);
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='货位'
                >
                  {getFieldDecorator('locatorId')(
                    <MultipleLov code="WMS.LOCATOR_BATCH" queryParams={{ tenantId, warehouseId: getFieldValue('warehouseId') }} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='工单号'
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
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='产品编码'
                >
                  {getFieldDecorator('materialId')(
                    <MultipleLov code="MT.MATERIAL" queryParams={{ tenantId, parentLocatorId: getFieldValue('toWarehouseId') }} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='WAFER'
                >
                  {getFieldDecorator('wafer')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'wafer')}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({ wafer: [] });
                          }
                        }
                      }
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {wafer.map(e => (
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
                  label='COS类型'
                >
                  {getFieldDecorator('cosType')(
                    <Select mode="multiple" allowClear>
                      {cosTypeMap.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
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
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='热沉编号'
                >
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
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='挑选来源条码'
                >
                  {getFieldDecorator('selectionSourceMaterialLotCode')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'selectionSourceMaterialLotCode')}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({ selectionSourceMaterialLotCode: [] });
                          }
                        }
                      }
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {selectionSourceMaterialLotCode.map(e => (
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
                  label='虚拟号'
                >
                  {getFieldDecorator('virtualNum')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'virtualNum')}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({ virtualNum: [] });
                          }
                        }
                      }
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {virtualNum.map(e => (
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
                  label='器件序列号'
                >
                  {getFieldDecorator('identification')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'identification')}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({ identification: [] });
                          }
                        }
                      }
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {identification.map(e => (
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
                  label='器件物料编码'
                >
                  {getFieldDecorator('deviceMaterialId')(<MultipleLov code="MT.MATERIAL" queryParams={{ tenantId }} />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='筛选批次'
                >
                  {getFieldDecorator('preSelectionLot')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'preSelectionLot')}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({ preSelectionLot: [] });
                          }
                        }
                      }
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {preSelectionLot.map(e => (
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
                  label='筛选规则编码'
                >
                  {getFieldDecorator('selectionRuleCode')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'selectionRuleCode')}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({ selectionRuleCode: [] });
                          }
                        }
                      }
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {selectionRuleCode.map(e => (
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
                  label='是否绑定工单'
                >
                  {getFieldDecorator('bindFlag')(
                    <Select allowClear>
                      {enableMap.map(item => (
                        <Select.Option key={item.value}>{item.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='投料工单号'
                >
                  {getFieldDecorator('releaseWorkOrderNum')(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='热沉条码'
                >
                  {getFieldDecorator('hotSinkMaterialLotCode')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'hotSinkMaterialLotCode')}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({ hotSinkMaterialLotCode: [] });
                          }
                        }
                      }
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {hotSinkMaterialLotCode.map(e => (
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
                  label='热沉供应商批次'
                >
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
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='金线条码'
                >
                  {getFieldDecorator('goldMaterialLotCode')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'goldMaterialLotCode')}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({ goldMaterialLotCode: [] });
                          }
                        }
                      }
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {goldMaterialLotCode.map(e => (
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
                  label='金线供应商批次'
                >
                  {getFieldDecorator('goldSupplierLot')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'goldSupplierLot')}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({ goldSupplierLot: [] });
                          }
                        }
                      }
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {goldSupplierLot.map(e => (
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
                  label='预筛选操作人'
                >
                  {getFieldDecorator('preSelectionOperatorId')(<Lov code="HME.USER" queryParams={{ tenantId }} />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='装箱操作人'
                >
                  {getFieldDecorator('loadOperatorId')(<Lov code="HME.USER" queryParams={{ tenantId }} />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='是否冻结'
                >
                  {getFieldDecorator('freezeFlag')(
                    <Select allowClear>
                      {enableMap.map(item => (
                        <Select.Option key={item.value}>{item.meaning}</Select.Option>
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
