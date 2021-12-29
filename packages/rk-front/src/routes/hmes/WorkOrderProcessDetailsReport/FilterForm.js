import React, { Component } from 'react';
import { Form, Button, Row, Col, Input, Select } from 'hzero-ui';
import cacheComponent from 'components/CacheComponent';
import { Bind, Throttle } from 'lodash-decorators';
import intl from 'utils/intl';
import { isFunction, uniq, isEmpty } from 'lodash';
import Lov from 'components/Lov';
import {
  DEBOUNCE_TIME,
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';
import MultipleLov from '@/components/MultipleLov';

const InputGroup = Input.Group;
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
      snList: [],
      reworkMaterialLotCode: [],
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

  @Throttle(DEBOUNCE_TIME)
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  }

  /**
   * 表单校验
   */
  @Bind()
  handleSearch() {
    const { onSearch, form } = this.props;
    if (onSearch) {
      form.validateFields({force: true}, (err) => {
        if (!err) {
          // 如果验证成功,则执行onSearch
          onSearch();
        }
      });
    }
  }

  // 输入框更改
  @Bind()
  handelInputGroup(e, type) {
    const { form } = this.props;
    const { setFieldsValue } = form;
    switch (type) {
      case 'ONE':
        setFieldsValue({ one: e.target.value });
        break;
      case 'TWO':
        setFieldsValue({ two: e.target.value });
        break;
      case 'THREE':
        setFieldsValue({ three: e.target.value });
        break;
      case 'FOUR':
        setFieldsValue({ four: e.target.value });
        break;
      default:
        break;
    }
  }

  @Bind()
  handleChangeSiteId() {

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
  handleResetProdLineId() {
    const { form: { resetFields, getFieldValue } } = this.props;
    if(!getFieldValue('prodLineId')) {
      resetFields('prodLineId');
    }
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      form,
      tenantId,
      defaultSite,
      woStatus,
      qualityStatus,
      siteList,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const {
      expandForm = false,
      snList = [],
      workOrderNum = [],
      reworkMaterialLotCode = [],
    } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="工厂">
              {getFieldDecorator('siteId', {
                initialValue: defaultSite.siteId,
              })(
                <Select onChange={this.handleChangeSiteId}>
                  {siteList.map(item => (
                    <Select.Option key={item.siteId} value={item.siteId}>
                      {item.siteName}
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
              {getFieldDecorator('prodLineId', {
                rules: [
                  {
                    required: isEmpty(getFieldValue('workOrder')) && isEmpty(getFieldValue('processList')) && isEmpty(getFieldValue('workcellList')) && isEmpty(getFieldValue('snList')) && isEmpty(getFieldValue('reworkMaterialLotCode')),
                    message: '生产线不能为空',
                  },
                ],
              })(
                <Lov
                  code="MT.PRODLINE"
                  queryParams={{ tenantId, siteId: getFieldValue('siteId') }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label='工单号'
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
              label='工单状态'
            >
              {getFieldDecorator('woStatus')(
                <Select style={{ width: '100%' }} allowClear>
                  {woStatus.map(e => (
                    <Select.Option key={e.value} value={e.value}>
                      {e.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='工序编码'
            >
              {getFieldDecorator('processList')(
                <MultipleLov
                  code="HME.FINAL_PROCESS"
                  allowClear
                  queryParams={{
                      prodLineId: getFieldValue('prodLineId'),
                      typeFlag: 'PROCESS',
                      tenantId,
                    }}
                  maxTagCount={1}
                />
                )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='工位编码'
            >
              {getFieldDecorator('workcellList')(
                <MultipleLov
                  code="HME.FINAL_WORKCELL"
                  allowClear
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'),
                    processId: getFieldValue('processList'),
                    typeFlag: 'PROCESS',
                    tenantId,
                  }}
                  maxTagCount={1}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='产品编码'
            >
              {getFieldDecorator('materialCode')(
                <MultipleLov
                  code="WMS.MATERIAL_REPORT"
                  queryParams={{ tenantId }}
                  maxTagCount={1}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='产品状态'
            >
              {getFieldDecorator('qualityStatus')(
                <Select style={{ width: '100%' }} allowClear>
                  {qualityStatus.map(e => (
                    <Select.Option key={e.value} value={e.value}>
                      {e.meaning}
                    </Select.Option>
                  ))}
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
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='是否转型'
            >
              {getFieldDecorator('transformFlag')(
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
              label='SN编码'
            >
              {getFieldDecorator('snList')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => this.handleOnSearch(val, 'snList')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        this.setState({ snList: [] });
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {snList.map(e => (
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
              label='返修SN'
            >
              {getFieldDecorator('reworkMaterialLotCode', {
                initialValue: reworkMaterialLotCode,
              })(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => this.handleOnSearch(val, 'reworkMaterialLotCode')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        this.setState({ reworkMaterialLotCode: [] });
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {reworkMaterialLotCode.map(e => (
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
              label='实验代码'
            >
              {getFieldDecorator('labCode')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='加工人员'
            >
              {getFieldDecorator('realName')(<Lov code="HME.USER" queryParams={{ tenantId }} />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='最新不良代码项'
            >
              {getFieldDecorator('latestNcTag')(<Input />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='产品类型'
            >
              {getFieldDecorator('productTypeList')(
                <InputGroup compact>
                  <Input
                    style={{ width: '25%' }}
                    maxLength={1}
                    onChange={e => this.handelInputGroup(e, 'ONE')}
                  />
                  <Input maxLength={1} style={{ width: '25%' }} onChange={e => this.handelInputGroup(e, 'TWO')} />
                  <Input maxLength={1} style={{ width: '25%' }} onChange={e => this.handelInputGroup(e, 'THREE')} />
                  <Input maxLength={1} style={{ width: '25%' }} onChange={e => this.handelInputGroup(e, 'FOUR')} />
                </InputGroup>
              )}
            </Form.Item>
            <Form.Item style={{ display: 'none' }}>
              {getFieldDecorator('one')(
                <Input />
              )}
            </Form.Item>
            <Form.Item style={{ display: 'none' }}>
              {getFieldDecorator('two')(
                <Input />
              )}
            </Form.Item>
            <Form.Item style={{ display: 'none' }}>
              {getFieldDecorator('three')(
                <Input />
              )}
            </Form.Item>
            <Form.Item style={{ display: 'none' }}>
              {getFieldDecorator('four')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='是否拆机'
            >
              {getFieldDecorator('afFlag')(
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

export default FilterForm;
