/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： COS芯片作业记录
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { uniq } from 'lodash';
import moment from 'moment';
import { Form, Button, Col, Row, Select, DatePicker } from 'hzero-ui';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';
import { getDateTimeFormat } from 'utils/utils';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import MultipleLov from '../../../components/MultipleLov';

const commonModelPrompt = 'tarzan.hwms.cosChipOperationRecord';

@connect(({ cosChipOperationRecord, loading }) => ({
  cosChipOperationRecord,
  fetchListLoading: loading.effects['cosChipOperationRecord/queryDataList'],
}))
@Form.create({ fieldNameProp: null })
export default class CosChipOperationRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workNum: [],
      wafer: [],
      materialLotCode: [],
      hotSinkCode: [],
      labCode: [],
    };
    if (props.onRef) {
      props.onRef(this);
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
  handleSearch() {
    const { onSearch, form } = this.props;
    if (onSearch) {
      form.validateFields(err => {
        if (!err) {
          onSearch();
        }
      });
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

  // 联动清空
  @Bind()
  resetWithFields(type) {
    const { form } = this.props;
    switch (type) {
      case 'prodLineId':
        form.resetFields([
          'workcellLineId',
          'workcellProcessId',
          'workcellStationId',
        ]);
        break;
      case 'workcellLineId':
        form.resetFields([
          'workcellProcessId',
          'workcellStationId',
        ]);
        break;
      case 'workcellProcessId':
        form.resetFields([
          'workcellStationId',
        ]);
        break;
      default:
        break;
    }
  };

  render() {
    const { form, loadJobTypeMap = [], statusMap = [], cosTypeMap = [], tenantId } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { workNum, wafer, materialLotCode, hotSinkCode, labCode } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="创建时间从" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('creationDateFrom', {
                rules: [
                  {
                    required:
                      !(getFieldValue('materialLotCode') && getFieldValue('materialLotCode').length > 0
                        || getFieldValue('workNum') && getFieldValue('workNum').length > 0
                        || getFieldValue('hotSinkCode') && getFieldValue('hotSinkCode').length > 0
                        || getFieldValue('labCode') && getFieldValue('labCode').length > 0
                      ),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '创建时间从',
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  format={getDateTimeFormat()}
                  style={{ width: '100%' }}
                  disabledDate={currentDate =>
                    getFieldValue('creationDateTo') &&
                    moment(getFieldValue('creationDateTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="创建时间至">
              {getFieldDecorator('creationDateTo', {
                rules: [
                  {
                    required:
                      !(getFieldValue('materialLotCode') && getFieldValue('materialLotCode').length > 0
                        || getFieldValue('workNum') && getFieldValue('workNum').length > 0
                        || getFieldValue('hotSinkCode') && getFieldValue('hotSinkCode').length > 0
                        || getFieldValue('labCode') && getFieldValue('labCode').length > 0
                      ),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '创建时间至',
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  format={getDateTimeFormat()}
                  style={{ width: '100%' }}
                  disabledDate={currentDate =>
                    getFieldValue('creationDateFrom') &&
                    moment(getFieldValue('creationDateFrom')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='创建人'
            >
              {getFieldDecorator('id')(
                <Lov
                  code="HME.USER"
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={this.toggleForm}>
                {this.state.expandForm
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

        <Row
          {...SEARCH_FORM_ROW_LAYOUT}
          style={{ display: this.state.expandForm ? '' : 'none' }}
        >
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.workNum`).d('工单')}
            >
              {getFieldDecorator('workNum')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => this.handleOnSearch(val, 'workNum')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        this.setState({ workNum: [] });
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {workNum.map(e => (
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
              label={intl.get(`${commonModelPrompt}.materialCode`).d('产品编码')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('materialId')(
                <MultipleLov code="HME.SITE_MATERIAL" queryParams={{ tenantId }} textField="materialCode" />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.cosType`).d('cos类型')}
            >
              {getFieldDecorator('cosType')(
                <Select allowClear>
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
            {this.state.waferFlag && (
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label={intl.get(`${commonModelPrompt}.wafer`).d('Wafer')}
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
            )}
          </Col>
        </Row>
        <Row
          {...SEARCH_FORM_ROW_LAYOUT}
          style={{ display: this.state.expandForm ? '' : 'none' }}
        >
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.prodLineId`).d('生产线')}
            >
              {getFieldDecorator('prodLineId')(
                <MultipleLov
                  code="HME.FINAL_PRODLINE"
                  queryParams={{
                    tenantId,
                  }}
                  onChange={() => this.resetWithFields('prodLineId')}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.workcellLineId`).d('工段')}
            >
              {getFieldDecorator('workcellLineId')(
                <MultipleLov
                  code="HME.FINAL_LINE"
                  onChange={() => this.resetWithFields('workcellLineId')}
                  allowClear
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'),
                    tenantId,
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.workcellProcessId`).d('工序')}
            >
              {getFieldDecorator('workcellProcessId')(
                <MultipleLov
                  code="HME.FINAL_PROCESS"
                  onChange={() => this.resetWithFields('workcellProcessId')}
                  allowClear
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'),
                    lineWorkcellId: getFieldValue('workcellLineId'),
                    tenantId,
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.workcellStationId`).d('工位')}
            >
              {getFieldDecorator('workcellStationId')(
                <MultipleLov
                  code="HME.FINAL_WORKCELL"
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'),
                    lineWorkcellId: getFieldValue('workcellLineId'),
                    processId: getFieldValue('workcellProcessId'),
                    tenantId,
                  }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row
          {...SEARCH_FORM_ROW_LAYOUT}
          style={{ display: this.state.expandForm ? '' : 'none' }}
        >
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.materialLotCode`).d('条码')}
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
              label={intl.get(`${commonModelPrompt}.loadJobType`).d('作业类型')}
            >
              {getFieldDecorator('loadJobType')(
                <Select allowClear>
                  {loadJobTypeMap.map(item => (
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
              label={intl.get(`${commonModelPrompt}.status`).d('状态')}
            >
              {getFieldDecorator(
                'status',
                {
                  initialValue: "0",
                }
              )(
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
              label={intl.get(`${commonModelPrompt}.hotSinkCode`).d('热沉编码')}
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
        </Row>
        <Row
          {...SEARCH_FORM_ROW_LAYOUT}
          style={{ display: this.state.expandForm ? '' : 'none' }}
        >
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.labCode`).d('实验代码')}
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
            <Form.Item label='工艺编码' {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('operationId')(
                <Lov
                  code='MT.OPERATION'
                  queryParams={{ tenantId }}
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
