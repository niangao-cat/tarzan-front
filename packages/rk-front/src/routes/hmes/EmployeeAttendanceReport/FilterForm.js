import React, { Component } from 'react';
import { Form, Button, Row, Col, Select, DatePicker } from 'hzero-ui';
import moment from 'moment';
import { uniq } from 'lodash';
import { Bind, Throttle } from 'lodash-decorators';

import Lov from 'components/Lov';
import intl from 'utils/intl';
import { getCurrentOrganizationId, getDateTimeFormat } from 'utils/utils';
import {
  DEBOUNCE_TIME,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_CLASSNAME,
} from 'utils/constants';
import MultipleLov from '../../../components/MultipleLov/index';
import ModalContainer, { registerContainer } from '../../../components/Modal/ModalContainer';

const tenantId = getCurrentOrganizationId();
/**
 *  页面搜索框
 * @extends {Component} - React.Component
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
class FilterForm extends Component {
  constructor(props) {
    super(props);
    const { onRef } = props;
    if (onRef) onRef(this);
    this.state = {
      expandForm: false,
      workOrderNumList: [],
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
    const { form, siteInfo } = this.props;
    form.resetFields();
    form.setFieldsValue({
      siteId: siteInfo.siteId,
      startTime: moment().subtract(1, 'weeks'),
      endTime: moment(),
    });
  }

  /**
   * 表单校验
   */
  @Bind()
  handleSearch() {
    const { onSearch, form } = this.props;
    if (onSearch) {
      form.validateFields((err) => {
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

  @Bind()
  handleChangeSiteId(value) {
    const { onSelectedSite, form: { resetFields } } = this.props;
    if(onSelectedSite) {
      onSelectedSite(value);
    }
    resetFields([ 'productCodeId', 'bomVersion' ]);
  }

  @Bind()
  handleChangeAreaId(value) {
    const { onSelectedArea, form: { resetFields } } = this.props;
    if(onSelectedArea) {
      onSelectedArea(value);
    }
    resetFields([ 'workshopId', 'productionLineId', 'lineWorkcellId' ]);
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      siteInfo,
      form,
      siteMap = [],
      divisionMap = [],
      workcellMap = [],
    } = this.props;
    const { expandForm, workOrderNumList } = this.state;
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="工厂" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('siteId', {
                initialValue: siteInfo.siteId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`siteId`).d('工厂'),
                    }),
                  },
                ],
              })(
                <Select onChange={this.handleChangeSiteId} allowClear>
                  {siteMap.map(item => (
                    <Select.Option key={item.siteId} value={item.siteId}>
                      {item.description}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="事业部" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('areaId', {
                rules: [
                  {
                    required: !(getFieldValue('productionLineId') || getFieldValue('lineWorkcellId')),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '事业部',
                    }),
                  },
                ],
              })(
                <Select onChange={this.handleChangeAreaId} allowClear>
                  {divisionMap.map(item => (
                    <Select.Option key={item.departmentId} value={item.departmentId}>
                      {item.departmentName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="车间">
              {getFieldDecorator('workshopId', {
                rules: [
                  {
                    required: !(getFieldValue('productionLineId') || getFieldValue('lineWorkcellId')),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '车间',
                    }),
                  },
                ],
              })(
                <Select onChange={()=>{
                  setFieldsValue({ productionLineId: null, lineWorkcellId: null});
                }}
                >
                  {workcellMap.map(item => (
                    <Select.Option key={item.workshopId} value={item.workshopId}>
                      {item.workshopName}
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
              <Button data-code="reset" icon="reload" onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button
                data-code="search"
                type="primary"
                htmlType="submit"
                icon="search"
                onClick={this.handleSearch}
              >
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label={intl.get(`.startTime`).d('日期开始')}>
              {getFieldDecorator('startTime', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`.startTime`).d('日期开始'),
                    }),
                  },
                ],
                initialValue: moment(moment().subtract(1, 'weeks').format('YYYY-MM-DD 00:00:00')),
              })(
                <DatePicker
                  placeholder=""
                  format={getDateTimeFormat()}
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  style={{ width: '100%' }}
                  disabledDate={currentDate =>
                    getFieldValue('endTime') &&
                    moment(getFieldValue('endTime')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label={intl.get(`.endTime`).d('日期截止')}>
              {getFieldDecorator('endTime', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`.endTime`).d('日期截止'),
                    }),
                  },
                ],
                initialValue: moment(moment().format('YYYY-MM-DD 23:59:59')),
              })(
                <DatePicker
                  placeholder=""
                  style={{ width: '100%' }}
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('startTime') &&
                    moment(getFieldValue('startTime')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label='产线' {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('productionLineId')(
                <Lov
                  code="Z.PRODLINE"
                  tex
                  queryParams={{
                    tenantId,
                    workShopId: getFieldValue('workshopId'),
                  }}
                  onChange={() => {
                    setFieldsValue({ lineWorkcellId: null});
                  }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label='工段' {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('lineWorkcellId')(
                <MultipleLov
                  code="HME.WORKCELL"
                  queryParams={{
                    tenantId,
                    prodLineId: getFieldValue('productionLineId'),
                    typeFlag: 'LINE',
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`workOrderNumList`).d('工单')}
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
            <Form.Item label={intl.get(`productCodeId`).d('产品编码')} {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('productCodeId')(
                <MultipleLov
                  code="HME.SITE_MATERIAL"
                  queryParams={{
                    siteId: getFieldValue('siteId'),
                    tenantId: getCurrentOrganizationId(),
                  }}
                  onChange={() => {
                    setFieldsValue({
                      bomVersion: '',
                    });
                  }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label={intl.get(`bomVersion`).d('BOM版本')} {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('bomVersion')(
                <MultipleLov
                  code="HME.MATERIAL_VERSION"
                  disabled={
                    !getFieldValue('productCodeId') ||
                    getFieldValue('productCodeId').split(',').length > 1
                  }
                  queryParams={{
                    siteId: getFieldValue('siteId'),
                    tenantId: getCurrentOrganizationId(),
                    materialId: getFieldValue('productCodeId'),
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label={intl.get(`userId`).d('员工')} {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('userId')(<MultipleLov code="HIAM.USER.ORG" queryParams={{ tenantId }} />)}
            </Form.Item>
          </Col>
        </Row>
        <ModalContainer ref={registerContainer} />
      </Form>
    );
  }
}

export default FilterForm;
