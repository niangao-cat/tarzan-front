/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 售后退库检测查询报表
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Form, Button, Col, Row, DatePicker, Table, Input, Select } from 'hzero-ui';
import moment from 'moment';
import { uniq, compact } from 'lodash';
import UploadModal from 'components/Upload';
import ExcelExport from 'components/ExcelExport';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';

const commonModelPrompt = 'tarzan.hwms.afterSalesReturnInsQueryReport';

@connect(({ afterSalesReturnInsQueryReport, loading }) => ({
  afterSalesReturnInsQueryReport,
  fetchListLoading: loading.effects['afterSalesReturnInsQueryReport/queryDataList'],
}))
@Form.create({ fieldNameProp: null })
export default class ProcessDefectReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      snFlag: true,
      lineCodeFlag: true,
      projectFlag: true,
      snList: [],
      lineCodeList: [],
      projectList: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'afterSalesReturnInsQueryReport/init',
    });
    dispatch({
      type: 'afterSalesReturnInsQueryReport/fetchSiteList',
    });
    dispatch({
      type: 'afterSalesReturnInsQueryReport/fetchDefaultSite',
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
  handleProjectListOnSearch(value) {
    const { projectList } = this.state;
    const flag = value ? value.every(e => projectList.includes(e)) : false;
    if (!flag) {
      const list = value[value.length === 0 ? 0 : value.length - 1].split(/[ ]+/);
      const uniplist = uniq(projectList.concat(compact(list)));
      this.setState({ projectList: uniplist });
    }else{
      this.setState({ projectList: value });
    }
  }

  @Bind()
  handleSearch(page = {}) {
    const { dispatch, form } = this.props;
    const fieldsValue = filterNullValueObject(form.getFieldsValue());
    dispatch({
      type: 'afterSalesReturnInsQueryReport/queryDataList',
      payload: {
        ...fieldsValue,
          snNum: (fieldsValue.snNum&&fieldsValue.snNum.length>0)?fieldsValue.snNum.join(','):'',
          materialCode: (fieldsValue.materialCode&&fieldsValue.materialCode.length>0)?fieldsValue.materialCode.join(','):'',
          tagGroupCode: (fieldsValue.tagGroupCode&&fieldsValue.tagGroupCode.length>0)?fieldsValue.tagGroupCode.join(','):'',
          receiptDateFrom: !fieldsValue.receiptDateFrom
          ? ''
          : moment(fieldsValue.receiptDateFrom).format(DEFAULT_DATETIME_FORMAT),
          receiptDateTo: !fieldsValue.receiptDateTo
          ? ''
          : moment(fieldsValue.receiptDateTo).format(DEFAULT_DATETIME_FORMAT),
          splitDateFrom: !fieldsValue.splitDateFrom
          ? ''
          : moment(fieldsValue.splitDateFrom).format(DEFAULT_DATETIME_FORMAT),
          splitDateTo: !fieldsValue.splitDateTo
          ? ''
          : moment(fieldsValue.splitDateTo).format(DEFAULT_DATETIME_FORMAT),
          lastUpdateDateFrom: !fieldsValue.lastUpdateDateFrom
          ? ''
          : moment(fieldsValue.lastUpdateDateFrom).format(DEFAULT_DATETIME_FORMAT),
          lastUpdateDateTo: !fieldsValue.lastUpdateDateTo
          ? ''
          : moment(fieldsValue.lastUpdateDateTo).format(DEFAULT_DATETIME_FORMAT),
        page,
      },
    });
  }

  // 设置展开/关闭 更多查询
  @Bind()
  setExpandForm() {
    this.setState({ expandForm: !this.state.expandForm });
  }

 @Bind()
 handleGetFormValue() {
  const {form } = this.props;
  const fieldsValue = filterNullValueObject(form.getFieldsValue());
   return filterNullValueObject({ ...fieldsValue });
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
      afterSalesReturnInsQueryReport: {
        headList = [],
        headPagination = {},
        logisticMap = [],
        statusMap = [],
        siteList = [],
        siteId = '',
      },
    } = this.props;

    // 设置显示数据
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.snNum`).d('SN'),
        dataIndex: 'snNum',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('物料名称'),
        dataIndex: 'materialName',
        align: 'center',
      },
      {
        title: '机型',
        dataIndex: 'machineType',
        align: 'center',
      },
      {
        title: '收货时间',
        dataIndex: 'receiptDate',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.splitDate`).d('拆箱时间'),
        dataIndex: 'splitDate',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.logisticsMeaning`).d('物流公司'),
        dataIndex: 'logisticsMeaning',
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
        title: intl.get(`${commonModelPrompt}.tagGroupCode`).d('检验项目编码'),
        dataIndex: 'tagGroupCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.tagGroupDescription`).d('检验项目描述'),
        dataIndex: 'tagGroupDescription',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.checkResult`).d('检验结果'),
        dataIndex: 'checkResult',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.remark`).d('备注'),
        dataIndex: 'remark',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.attachmentUuid`).d('附件'),
        dataIndex: 'attachmentUuid',
        align: 'center',
        render: (val, record) => {
          if (record.attachmentUuid) {
            return (
              <UploadModal
                attachmentUUID={val}
                bucketName="file-mes"
                viewOnly
                bucketDirectory="hwfp01"
                btnText="浏览"
              />
            );
          }
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedByName`).d('最后更新人'),
        dataIndex: 'lastUpdatedByName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdateDate`).d('最后更新时间'),
        dataIndex: 'lastUpdateDate',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.stationCode`).d('工位编码'),
        dataIndex: 'stationCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.stationName`).d('工位名称'),
        dataIndex: 'stationName',
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
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('售后退库检测查询报表')}>
          <ExcelExport
            exportAsync
            requestUrl={`/mes-report/v1/${getCurrentOrganizationId()}/service-return-check/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue()}
          />
        </Header>
        <Content>
          <Form className={SEARCH_FORM_CLASSNAME}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item label="站点" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('siteId', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`siteId`).d('站点'),
                        }),
                      },
                    ],
                    initialValue: siteId,
                  })(
                    <Select>
                      {siteList.map(e => (
                        <Select.Option key={e.siteId} value={e.siteId}>
                          {e.description}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                {this.state.snFlag && (
                  <Form.Item
                    {...SEARCH_FORM_ITEM_LAYOUT}
                    label={intl.get(`${commonModelPrompt}.snNum`).d('SN')}
                  >
                    {getFieldDecorator('snNum', {
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
                {this.state.lineCodeFlag && (
                  <Form.Item
                    {...SEARCH_FORM_ITEM_LAYOUT}
                    label={intl.get(`${commonModelPrompt}.materialCodeList`).d('物料编码')}
                  >
                    {getFieldDecorator('materialCode', {
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
                  label={intl.get(`${commonModelPrompt}.machineType`).d('机型')}
                >
                  {getFieldDecorator('machineType')(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item label="物流公司" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('logistics')(
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
                  label={intl.get(`${commonModelPrompt}.logisticsNumber`).d('物流单号')}
                >
                  {getFieldDecorator('logisticsNumber')(<Input />)}
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
                  label={intl.get(`${commonModelPrompt}.batchNumber`).d('批次号')}
                >
                  {getFieldDecorator('batchNumber')(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                {this.state.projectFlag && (
                  <Form.Item
                    {...SEARCH_FORM_ITEM_LAYOUT}
                    label={intl.get(`${commonModelPrompt}.tagGroupCode`).d('检验项目编码')}
                  >
                    {getFieldDecorator('tagGroupCode', {
                      initialValue: this.state.projectList,
                    })(
                      <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        onChange={val => {
                          if (val.length === 0) {
                            this.setState({ projectList: [] });
                          } else {
                            this.handleProjectListOnSearch(val);
                          }
                        }}
                        onBlur={() => {
                          this.setState({ projectFlag: false }, () => {
                            this.setState({ projectFlag: true });
                          });
                        }}
                        allowClear
                        dropdownMatchSelectWidth={false}
                        maxTagCount={2}
                      >
                        {this.state.projectList.map(e => (
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
            </Row>
            <Row
              {...SEARCH_FORM_ROW_LAYOUT}
              style={{ display: this.state.expandForm ? '' : 'none' }}
            >
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.receiptDateFrom`).d('收货时间起')}
                >
                  {getFieldDecorator(
                    'receiptDateFrom',
                    {}
                  )(
                    <DatePicker
                      showTime
                      placeholder=""
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD HH:mm:ss"
                      disabledDate={currentDate =>
                        getFieldValue('receiptDateTo') &&
                        moment(getFieldValue('receiptDateTo')).isBefore(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.receiptDateTo`).d('收货时间至')}
                >
                  {getFieldDecorator(
                    'receiptDateTo',
                    {}
                  )(
                    <DatePicker
                      showTime
                      placeholder=""
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD HH:mm:ss"
                      disabledDate={currentDate =>
                        getFieldValue('receiptDateFrom') &&
                        moment(getFieldValue('receiptDateFrom')).isAfter(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.splitDateFrom`).d('拆箱时间起')}
                >
                  {getFieldDecorator(
                    'splitDateFrom',
                    {}
                  )(
                    <DatePicker
                      showTime
                      placeholder=""
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD HH:mm:ss"
                      disabledDate={currentDate =>
                        getFieldValue('splitDateTo') &&
                        moment(getFieldValue('splitDateTo')).isBefore(currentDate, 'second')
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
                  label={intl.get(`${commonModelPrompt}.splitDateTo`).d('拆箱时间至')}
                >
                  {getFieldDecorator(
                    'splitDateTo',
                    {}
                  )(
                    <DatePicker
                      showTime
                      placeholder=""
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD HH:mm:ss"
                      disabledDate={currentDate =>
                        getFieldValue('splitDateFrom') &&
                        moment(getFieldValue('splitDateFrom')).isAfter(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.lastUpdateDateFrom`).d('最后更新时间起')}
                >
                  {getFieldDecorator(
                    'lastUpdateDateFrom',
                    {}
                  )(
                    <DatePicker
                      showTime
                      placeholder=""
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD HH:mm:ss"
                      disabledDate={currentDate =>
                        getFieldValue('lastUpdateDateTo') &&
                        moment(getFieldValue('lastUpdateDateTo')).isBefore(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.lastUpdateDateTo`).d('最后更新时间至')}
                >
                  {getFieldDecorator(
                    'lastUpdateDateTo',
                    {}
                  )(
                    <DatePicker
                      showTime
                      placeholder=""
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD HH:mm:ss"
                      disabledDate={currentDate =>
                        getFieldValue('lastUpdateDateFrom') &&
                        moment(getFieldValue('lastUpdateDateFrom')).isAfter(currentDate, 'second')
                      }
                    />
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
