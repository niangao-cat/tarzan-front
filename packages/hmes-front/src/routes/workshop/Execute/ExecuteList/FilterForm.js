/**
 * FilterForm - 搜索框
 * @date: 2019-12-20
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Row, Col, Select, DatePicker, Switch } from 'hzero-ui';
// import {isUndefined} from 'lodash';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
// import notification from 'utils/notification';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import Lov from 'components/Lov';
import moment from 'moment';
import { getCurrentOrganizationId } from 'utils/utils';
import cacheComponent from 'components/CacheComponent';
import { uniq } from 'lodash';

const modelPrompt = 'tarzan.workshop.execute.model.execute';

/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 搜索框
 * @extends {Component} - React.Component
 * @reactProps {Object} siteList - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ execute }) => ({
  execute,
}))
@Form.create({ fieldNameProp: null })
@cacheComponent({ cacheKey: '/hmes/workshop/execute-operation-management/list' })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      expandForm: false,
      repairSn: [],
      workOrderNum: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'execute/fetchExecuteStatusOptions',
      payload: {
        module: 'ORDER',
        statusGroup: 'EO_STATUS',
      },
    });
    dispatch({
      type: 'execute/fetchExecuteTypeOptions',
      payload: {
        module: 'ORDER',
        typeGroup: 'EO_TYPE',
      },
    });
  }

  /**
   * 查询数据
   * @param {object} pagination 页面基本信息数据
   */
  @Bind()
  fetchQueryList(pagination = {}, bindSnFlag) {
    const { form, dispatch, clearSelectedRow } = this.props;
    form.validateFields((err, fieldsValue) => {
      // console.log('fieldsValue=', fieldsValue);
      if (!err) {
        dispatch({
          type: 'execute/fetchExecuteList',
          payload: {
            ...fieldsValue,
            repairSn: fieldsValue.repairSn
              ? fieldsValue.repairSn.toString()
              : '',
            workOrderNum: fieldsValue.workOrderNum
              ? fieldsValue.workOrderNum.toString()
              : '',
            startTimeFrom: fieldsValue.startTimeFrom
              ? moment(fieldsValue.startTimeFrom).format('YYYY-MM-DD HH:mm:ss')
              : null,
            startTimeTo: fieldsValue.startTimeTo
              ? moment(fieldsValue.startTimeTo).format('YYYY-MM-DD HH:mm:ss')
              : null,
            endTimeFrom: fieldsValue.endTimeFrom
              ? moment(fieldsValue.endTimeFrom).format('YYYY-MM-DD HH:mm:ss')
              : null,
            endTimeTo: fieldsValue.endTimeTo
              ? moment(fieldsValue.endTimeTo).format('YYYY-MM-DD HH:mm:ss')
              : null,
            bindSnFlag: bindSnFlag || fieldsValue.bindSnFlag,
            page: pagination,
          },
        });
        clearSelectedRow();
      }
    });
  }

  /**
   * 重置form表单
   */
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
  }

  // 查询条件展开/收起
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({ expandForm: !expandForm });
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

  setMaterialName = (_, record) => {
    this.props.form.setFieldsValue({
      materialName: record.materialName,
      materialCode: record.materialCode,
    });
  };

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      form,
      execute: { eoTypeOptions = [], executeStatusOptions = [] },
    } = this.props;
    const { getFieldDecorator } = form;
    const { expandForm, repairSn, workOrderNum } = this.state;
    const tenantId = getCurrentOrganizationId();
    const {
      materialCode = '',
      prodLineCode = '',
      workcellName = '',
    } = this.props.form.getFieldsValue();
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.eoNum`).d('执行作业编码')}
            >
              {getFieldDecorator('eoNum')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.status`).d('执行作业状态')}
            >
              {getFieldDecorator('status')(
                <Select style={{ width: '100%' }} allowClear mode="multiple">
                  {(executeStatusOptions || []).map(item => {
                    return (
                      <Select.Option value={item.statusCode} key={item.statusCode}>
                        {item.description}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.eoIdentification`).d('EO标识')}
            >
              {getFieldDecorator('eoIdentification')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <FormItem>
              <Button onClick={this.toggleForm}>
                {expandForm
                  ? intl.get('tarzan.workshop.execute.button.collected').d('收起查询')
                  : intl.get(`tarzan.workshop.execute.button.viewMore`).d('更多查询')}
              </Button>
              <Button onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.fetchQueryList}>
                {intl.get('tarzan.workshop.execute.button.search').d('查询')}
              </Button>
            </FormItem>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="返修SN">
              {getFieldDecorator('repairSn')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => this.handleOnSearch(val, 'repairSn')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        this.setState({ repairSn: [] });
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {repairSn.map(e => (
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
              label={intl.get(`${modelPrompt}.productionLineId`).d('生产线')}
            >
              {getFieldDecorator('productionLineId')(
                <Lov
                  code="MT.PRODLINE"
                  queryParams={{ tenantId }}
                  onChange={(value, item) => {
                    form.setFieldsValue({
                      prodLineCode: item.prodLineCode,
                    });
                  }}
                  textValue={prodLineCode}
                />
              )}
            </Form.Item>
            <Form.Item
              style={{ display: 'none' }}
            >
              {getFieldDecorator('prodLineCode')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.materialId`).d('物料')}
            >
              {getFieldDecorator('materialId')(
                <Lov
                  code="MT.MATERIAL"
                  queryParams={{ tenantId }}
                  onChange={this.setMaterialName}
                  textValue={materialCode}
                />
              )}
            </Form.Item>
            <Form.Item
              style={{ display: 'none' }}
            >
              {getFieldDecorator('materialCode')(
                <Input />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.workOrderNum`).d('工单')}
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
              label={intl.get(`${modelPrompt}.startTimeFrom`).d('开始时间从')}
            >
              {getFieldDecorator('startTimeFrom')(
                <DatePicker
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={intl.get(`${modelPrompt}.startTimeFrom`).d('开始时间从')}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.startTimeTo`).d('开始时间至')}
            >
              {getFieldDecorator('startTimeTo')(
                <DatePicker
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={intl.get(`${modelPrompt}.startTimeTo`).d('开始时间至')}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.eoType`).d('执行作业类型')}
            >
              {getFieldDecorator('eoType')(
                <Select style={{ width: '100%' }} allowClear mode="multiple">
                  {(eoTypeOptions || []).map(item => {
                    return (
                      <Select.Option value={item.typeCode} key={item.typeCode}>
                        {item.description}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.endTimeFrom`).d('结束时间从')}
            >
              {getFieldDecorator('endTimeFrom')(
                <DatePicker
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={intl.get(`${modelPrompt}.endTimeFrom`).d('结束时间从')}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.endTimeTo`).d('结束时间至')}
            >
              {getFieldDecorator('endTimeTo')(
                <DatePicker
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={intl.get(`${modelPrompt}.endTimeTo`).d('结束时间至')}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.currentProcess`).d('当前工序')}
            >
              {getFieldDecorator('processId')(
                <Lov
                  code="HME.WORK_PROCESS"
                  queryParams={{ tenantId }}
                  textValue={workcellName}
                  onChange={(value, item) => {
                    form.setFieldsValue({
                      workcellName: item.workcellName,
                    });
                  }}
                />
              )}
            </Form.Item>
            <Form.Item
              style={{ display: 'none' }}
            >
              {getFieldDecorator('workcellName')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.bindSnFlag`).d('绑定返修SN')}
            >
              {getFieldDecorator('bindSnFlag', {
                initialValue: 'N',
              })(
                <Switch onChange={bindSnFlag => this.fetchQueryList({}, bindSnFlag)} checkedValue="Y" unCheckedValue="N" />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
