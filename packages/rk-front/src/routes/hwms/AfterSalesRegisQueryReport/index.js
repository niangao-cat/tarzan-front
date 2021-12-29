/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 售后登记查询报表
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Form, Button, Col, Row, DatePicker, Table, Input, Select } from 'hzero-ui';
import moment from 'moment';
import { uniq, compact } from 'lodash';

import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';

const tenantId = getCurrentOrganizationId();
const commonModelPrompt = 'tarzan.hwms.afterSalesRegisQueryReport';

@connect(({ afterSalesRegisQueryReport, loading }) => ({
  afterSalesRegisQueryReport,
  fetchListLoading: loading.effects['afterSalesRegisQueryReport/queryDataList'],
}))
@Form.create({ fieldNameProp: null })
export default class ProcessDefectReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      snFlag: true,
      currentSnFlag: true,
      lineCodeFlag: true,
      snList: [],
      currentSnList: [],
      lineCodeList: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'afterSalesRegisQueryReport/init',
    });
  }

  @Bind()
  handleSnListOnSearch(value) {
    const { snList } = this.state;
    const flag = value ? value.every(e => snList.includes(e)) : false;
    if (!flag) {
      const list = value[value.length === 0 ? 0 : value.length - 1].split(/[ ]+/);
      const uniplist = uniq(snList.concat(compact(list)));
      this.setState({ snList: uniplist });
    }else{
      this.setState({ snList: value });
    }
  }

  @Bind()
  handleCurrentSnListOnSearch(value) {
    const { currentSnList } = this.state;
    const flag = value ? value.every(e => currentSnList.includes(e)) : false;
    if (!flag) {
      const list = value[value.length === 0 ? 0 : value.length - 1].split(/[ ]+/);
      const uniplist = uniq(currentSnList.concat(compact(list)));
      this.setState({ currentSnList: uniplist });
    }else{
      this.setState({ currentSnList: value });
    }
  }

  @Bind()
  handleLineCodeListOnSearch(value) {
    const { lineCodeList } = this.state;
    const flag = value ? value.every(e => lineCodeList.includes(e)) : false;
    if (!flag) {
      const list = value[value.length === 0 ? 0 : value.length - 1].split(/[ ]+/);
      const uniplist = uniq(lineCodeList.concat(compact(list)));
      this.setState({ lineCodeList: uniplist });
    }else{
      this.setState({ lineCodeList: value });
    }
  }

  @Bind()
  handleSearch(page = {}) {
    const { dispatch, form } = this.props;
    const fieldsValue = filterNullValueObject(form.getFieldsValue());
    dispatch({
      type: 'afterSalesRegisQueryReport/queryDataList',
      payload: {
        ...fieldsValue,
        creationDateFrom: !fieldsValue.creationDateFrom? '': moment(fieldsValue.creationDateFrom).format(DEFAULT_DATETIME_FORMAT),
        creationDateTo: !fieldsValue.creationDateTo? '': moment(fieldsValue.creationDateTo).format(DEFAULT_DATETIME_FORMAT),
        receiveDateFrom: !fieldsValue.receiveDateFrom? '': moment(fieldsValue.receiveDateFrom).format(DEFAULT_DATETIME_FORMAT),
        receiveDateTo: !fieldsValue.receiveDateTo? '': moment(fieldsValue.receiveDateTo).format(DEFAULT_DATETIME_FORMAT),
        actualEndTimeFrom: !fieldsValue.actualEndTimeFrom? '': moment(fieldsValue.actualEndTimeFrom).format(DEFAULT_DATETIME_FORMAT),
        actualEndTimeTo: !fieldsValue.actualEndTimeTo? '': moment(fieldsValue.actualEndTimeTo).format(DEFAULT_DATETIME_FORMAT),
        page,
      },
    });
  }

  // 导出
  @Bind()
  handleGetFormValue() {
    const { form } = this.props;
    const fieldsValue = filterNullValueObject(form.getFieldsValue());
    return {
      ...fieldsValue,
      creationDateFrom: !fieldsValue.creationDateFrom? '': moment(fieldsValue.creationDateFrom).format(DEFAULT_DATETIME_FORMAT),
      creationDateTo: !fieldsValue.creationDateTo? '': moment(fieldsValue.creationDateTo).format(DEFAULT_DATETIME_FORMAT),
      receiveDateFrom: !fieldsValue.receiveDateFrom? '': moment(fieldsValue.receiveDateFrom).format(DEFAULT_DATETIME_FORMAT),
      receiveDateTo: !fieldsValue.receiveDateTo? '': moment(fieldsValue.receiveDateTo).format(DEFAULT_DATETIME_FORMAT),
      actualEndTimeFrom: !fieldsValue.actualEndTimeFrom? '': moment(fieldsValue.actualEndTimeFrom).format(DEFAULT_DATETIME_FORMAT),
      actualEndTimeTo: !fieldsValue.actualEndTimeTo? '': moment(fieldsValue.actualEndTimeTo).format(DEFAULT_DATETIME_FORMAT),
    };
  }

  // 设置展开/关闭 更多查询
  @Bind()
  setExpandForm() {
    this.setState({ expandForm: !this.state.expandForm });
  }

  // 重置查询
  @Bind()
  resetSearch = () => {
    const { form } = this.props;
    form.resetFields();
  };

  // 渲染 界面布局
  render() {
    // 获取默认数据
    const {
      fetchListLoading,
      afterSalesRegisQueryReport: {
        headList = [],
        headPagination = {},
        logisticMap = [],
        statusMap = [],
      },
    } = this.props;

    // 设置显示数据
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.snNum`).d('接收SN'),
        dataIndex: 'snNum',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.currentSnNum`).d('当前SN'),
        dataIndex: 'currentSnNum',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('产品编码'),
        dataIndex: 'materialCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('产品描述'),
        dataIndex: 'materialName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.logisticsCompanyMeaning`).d('物流公司'),
        dataIndex: 'logisticsCompanyMeaning',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.logisticsNumber`).d('物流单号'),
        dataIndex: 'logisticsNumber',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.batchNumber`).d('批次号'),
        dataIndex: 'batchNumber',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.receiveStatusMeaning`).d('当前状态'),
        dataIndex: 'receiveStatusMeaning',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.creationDate`).d('返回时间'),
        dataIndex: 'creationDate',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.creationYearMonth`).d('返回年月'),
        dataIndex: 'creationYearMonth',
        align: 'center',
      },
      {
        title: '签收人',
        dataIndex: 'signedBy',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.receiveDate`).d('拆箱时间'),
        dataIndex: 'receiveDate',
        align: 'center',
      },
      {
        title: '拆箱人',
        dataIndex: 'unpackBy',
        align: 'center',
      },
      {
        title: '型号',
        dataIndex: 'model',
        align: 'center',
      },
      {
        title: '客户名称',
        dataIndex: 'customerName',
        align: 'center',
      },
      {
        title: '返回类型',
        dataIndex: 'backTypeMeaning',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.workcellCode`).d('当前工位编码'),
        dataIndex: 'workcellCode',
        align: 'center',
      },
      {
        title: '当前工位名称',
        dataIndex: 'workcellName',
        align: 'center',
      },
      {
        title: '入库时间',
        dataIndex: 'receiptDate',
        align: 'center',
      },
      {
        title: '入库年月',
        dataIndex: 'receiptYearMonth',
        align: 'center',
      },
      {
        title: '内部订单号',
        dataIndex: 'internalOrderNum',
        align: 'center',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 100,
      },
      {
        title: '生产完工时间',
        dataIndex: 'actualEndTime',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.actualData`).d('有效时长'),
        dataIndex: 'actualData',
        align: 'center',
      },
    ];

    // 获取整个表单
    const { form } = this.props;
    // 获取表单的字段属性
    const { getFieldDecorator, getFieldValue } = form;

    //  返回默认界面数据
    return (
      <div>
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('售后登记查询报表')}>
          <ExcelExport
            // exportAsync
            requestUrl={`/mes-report/v1/${getCurrentOrganizationId()}/Hme-after-sales-register/export`}
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
          />
        </Header>
        <Content>
          <Form className={SEARCH_FORM_CLASSNAME}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_4_LAYOUT}>
                {this.state.snFlag && (
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.snList`).d('SN')}
                >
                  {getFieldDecorator('snList', {
                      initialValue: this.state.snList,
                    })(
                      <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        onChange={val => {
                          if (val.length === 0) {
                            this.setState({ snList: [] });
                          } else {
                            this.handleSnListOnSearch(val);
                          }
                        }}
                        onBlur={() => {
                          this.setState({ snFlag: false }, () => {
                            this.setState({ snFlag: true });
                          });
                        }}
                        allowClear
                        dropdownMatchSelectWidth={false}
                        maxTagCount={2}
                      >
                        {this.state.snList.map(e => (
                          <Select.Option key={e} value={e}>
                            {e}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                </Form.Item>
                )}
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                {this.state.currentSnFlag && (
                  <Form.Item
                    {...SEARCH_FORM_ITEM_LAYOUT}
                    label={intl.get(`${commonModelPrompt}.currentSnList`).d('当前SN')}
                  >
                    {getFieldDecorator('currentSnList', {
                      initialValue: this.state.currentSnList,
                    })(
                      <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        onChange={val => {
                          if (val.length === 0) {
                            this.setState({ currentSnList: [] });
                          } else {
                            this.handleCurrentSnListOnSearch(val);
                          }
                        }}
                        onBlur={() => {
                          this.setState({ currentSnFlag: false }, () => {
                            this.setState({ currentSnFlag: true });
                          });
                        }}
                        allowClear
                        dropdownMatchSelectWidth={false}
                        maxTagCount={2}
                      >
                        {this.state.currentSnList.map(e => (
                          <Select.Option key={e} value={e}>
                            {e}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                )}
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                {this.state.lineCodeFlag && (
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.materialCodeList`).d('产品编码')}
                >
                  {getFieldDecorator('materialCodeList', {
                      initialValue: this.state.lineCodeList,
                    })(
                      <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        onChange={val => {
                          if (val.length === 0) {
                            this.setState({ lineCodeList: [] });
                          } else {
                            this.handleLineCodeListOnSearch(val);
                          }
                        }}
                        onBlur={() => {
                          this.setState({ lineCodeFlag: false }, () => {
                            this.setState({ lineCodeFlag: true });
                          });
                        }}
                        allowClear
                        dropdownMatchSelectWidth={false}
                        maxTagCount={2}
                      >
                        {this.state.lineCodeList.map(e => (
                          <Select.Option key={e} value={e}>
                            {e}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                </Form.Item>
                )}
              </Col>
              <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
                <Form.Item>
                  <Button onClick={this.setExpandForm}>
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
                  label={intl.get(`${commonModelPrompt}.currentWorkcellCode`).d('当前工位编码')}
                >
                  {getFieldDecorator('currentWorkcellCode')(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item label="物流公司" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('logisticsCompany')(
                    <Select allowClear>
                      {logisticMap.map(e => (
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
                  label={intl.get(`${commonModelPrompt}.batchNumber`).d('批次号')}
                >
                  {getFieldDecorator('batchNumber')(
                    <Input />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row
              {...SEARCH_FORM_ROW_LAYOUT}
              style={{ display: this.state.expandForm ? '' : 'none' }}
            >
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item label="当前状态" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('receiveStatus')(
                    <Select allowClear>
                      {statusMap.map(e => (
                        <Select.Option key={e.value} value={e.value}>
                          {e.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item label="签收人" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator(
                    'createdBy',
                    {}
                  )(
                    <Lov
                      code="HIAM.USER.ORG"
                      queryParams={{
                        tenantId: getCurrentOrganizationId(),
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.receiveBy`).d('拆箱人')}
                >
                  {getFieldDecorator('receiveBy')(
                    <Lov code="HIAM.USER.ORG" queryParams={{ tenantId }} />
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
                  label={intl.get(`${commonModelPrompt}.creationDateFrom`).d('返回时间起')}
                >
                  {getFieldDecorator('creationDateFrom', {
                  })(
                    <DatePicker
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                      placeholder=""
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD HH:mm:ss"
                      disabledDate={currentDate =>
                        getFieldValue('creationDateTo') &&
                        moment(getFieldValue('creationDateTo')).isBefore(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.creationDateTo`).d('返回时间至')}
                >
                  {getFieldDecorator('creationDateTo', {
                  })(
                    <DatePicker
                      showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                      placeholder=""
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD HH:mm:ss"
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
                  label={intl.get(`${commonModelPrompt}.receiveDateFrom`).d('拆箱时间起')}
                >
                  {getFieldDecorator('receiveDateFrom', {
                  })(
                    <DatePicker
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                      placeholder=""
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD HH:mm:ss"
                      disabledDate={currentDate =>
                        getFieldValue('receiveDateTo') &&
                        moment(getFieldValue('receiveDateTo')).isBefore(currentDate, 'second')
                      }
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
                  label={intl.get(`${commonModelPrompt}.receiveDateTo`).d('拆箱时间至')}
                >
                  {getFieldDecorator('receiveDateTo', {
                  })(
                    <DatePicker
                      showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                      placeholder=""
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD HH:mm:ss"
                      disabledDate={currentDate =>
                    getFieldValue('receiveDateFrom') &&
                    moment(getFieldValue('receiveDateFrom')).isAfter(currentDate, 'second')
                  }
                    />
              )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.actualEndTimeFrom`).d('生产完工时间起')}
                >
                  {getFieldDecorator('actualEndTimeFrom', {
                  })(
                    <DatePicker
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                      placeholder=""
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD HH:mm:ss"
                      disabledDate={currentDate =>
                    getFieldValue('actualEndTimeTo') &&
                    moment(getFieldValue('actualEndTimeTo')).isBefore(currentDate, 'second')
                  }
                    />
              )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.actualEndTimeTo`).d('生产完工时间至')}
                >
                  {getFieldDecorator('actualEndTimeTo', {
                  })(
                    <DatePicker
                      showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                      placeholder=""
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD HH:mm:ss"
                      disabledDate={currentDate =>
                    getFieldValue('actualEndTimeFrom') &&
                    moment(getFieldValue('actualEndTimeFrom')).isAfter(currentDate, 'second')
                  }
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
                  label={intl.get(`${commonModelPrompt}.logisticsNumber`).d('物流单号')}
                >
                  {getFieldDecorator('logisticsNumber')(
                    <Input />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Table
            bordered
            dataSource={headList}
            columns={columns}
            pagination={headPagination}
            onChange={page => this.handleSearch(page)}
            loading={fetchListLoading}
          />
        </Content>
      </div>
    );
  }
}
