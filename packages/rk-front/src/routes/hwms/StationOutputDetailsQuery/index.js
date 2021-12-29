/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 工序不良报表
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Form, Button, Col, Row, DatePicker, Input, Select, Table } from 'hzero-ui';
import moment from 'moment';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';
import { ReportHost } from '@/utils/config';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';
import MultipleLov from '@/components/MultipleLov';

const { Option } = Select;

const tenantId = getCurrentOrganizationId();

const commonModelPrompt = 'tarzan.hwms.stationOutputDetailsQuery';

@connect(({ stationOutputDetailsQuery, loading }) => ({
  stationOutputDetailsQuery,
  fetchListLoading: loading.effects['stationOutputDetailsQuery/queryDataList'],
}))
@Form.create({ fieldNameProp: null })
export default class StationOutputDetailsQuery extends Component {

  state= {
    expandForm: false,
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'stationOutputDetailsQuery/updateState',
      payload: {
        headList: [],
        headPagination: {},
      },
    });
  }

  @Bind
  queryData() {
    const { dispatch } = this.props;

    const { form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        // 根据页数查询报表信息
        const newValues = this.handleGetFormValue(values);
        dispatch({
          type: 'stationOutputDetailsQuery/queryDataList',
          payload: {
            ...newValues,
          },
        });
          }
    });

  }

  @Bind
  queryDataByPanigation(page = {}) {
    const { dispatch } = this.props;

    const { form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        // 根据页数查询报表信息
        const newValues = this.handleGetFormValue(values);
        dispatch({
          type: 'stationOutputDetailsQuery/queryDataList',
          payload: {
            ...newValues,
            page,
          },
        });
          }
    });
  }

  @Bind()
  handleGetFormValue(values = this.props.form.getFieldsValue()) {
    const { startTime, endTime, ...otherValue } = values;
    const value = {
      ...otherValue,
      startTime: startTime==null
      ? ""
      : moment(startTime).format(DEFAULT_DATETIME_FORMAT),
      endTime: endTime==null
      ? ""
      : moment(endTime).format(DEFAULT_DATETIME_FORMAT),
    };
    return filterNullValueObject(value);
  }

   // 设置展开/关闭 更多查询
   @Bind()
   setExpandForm() {
     this.setState({ expandForm: !this.state.expandForm });
   }

   // 重置查询
  @Bind
  resetSearch = () => {
    const { form } = this.props;
    form.resetFields();
  };

  // 渲染 界面布局
  render() {

    // 获取默认数据
    const {
      fetchListLoading,
      stationOutputDetailsQuery: { headList=[], headPagination = {} },
    } = this.props;

    // 设置显示数据
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.productionLineName`).d('生产线'),
        dataIndex: 'productionLineName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.lineWorkcellName`).d('工段'),
        dataIndex: 'lineWorkcellName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.processWorkcellName`).d('工序'),
        dataIndex: 'processWorkcellName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.stationWorkcellName`).d('工位'),
        dataIndex: 'stationWorkcellName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.snMaterialName`).d('产品料号'),
        dataIndex: 'snMaterialName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialDesc`).d('产品描述'),
        dataIndex: 'materialDesc',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.workOrderNum`).d('工单号'),
        dataIndex: 'workOrderNum',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialLotCode`).d('产品序列号'),
        dataIndex: 'materialLotCode',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.jobTypeName`).d('作业类型'),
        dataIndex: 'jobTypeName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.jobPlatform`).d('作业平台'),
        dataIndex: 'jobPlatform',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.primaryUomQty`).d('数量'),
        dataIndex: 'primaryUomQty',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.reworkFlag`).d('返修标识'),
        dataIndex: 'reworkFlag',
        align: 'center',
        render: (val) =>
         (
          ([{typeCode: 'N', description: '否'}, {typeCode: 'Y', description: '是'}].filter(ele => ele.typeCode === val)[0] || {}).description
        ),
      },
      {
        title: intl.get(`${commonModelPrompt}.workerName`).d('作业人'),
        dataIndex: 'workerName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.workerTime`).d('作业时间'),
        dataIndex: 'workerTime',
        align: 'center',
      },
    ];

    // 获取整个表单
    const { form } = this.props;
    // 获取表单的字段属性
    const { getFieldDecorator, getFieldValue} = form;

    //  返回默认界面数据
    return (
      <div>
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('工位产量明细查询')}>
          <ExcelExport
            exportAsync
            requestUrl={`${ReportHost}/v1/${tenantId}/hme-work-cell-details-report/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue()}
          />
        </Header>
        <Content>
          <Form className={SEARCH_FORM_CLASSNAME}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col span="5">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.startTime`).d('开始时间从')}
                >
                  {getFieldDecorator('startTime', {
                    // initialValue: moment(moment().subtract(1, 'months')
                    // .format('YYYY-MM-DD HH:mm:ss')),
                    initialValue: moment(moment().format('YYYY-MM-DD 00:00:00')),
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
              <Col span="5">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.endTime`).d('开始时间至')}
                >
                  {getFieldDecorator('endTime', {
                     initialValue: moment(moment()
                    .format('YYYY-MM-DD HH:mm:ss')),
                  })(
                    <DatePicker
                      showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                      placeholder=""
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD HH:mm:ss"
                      disabledDate={currentDate =>
                    getFieldValue('startTime') &&
                    moment(getFieldValue('startTime')).isAfter(currentDate, 'second')
                  }
                    />
              )}
                </Form.Item>
              </Col>
              <Col span="5">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.workcellId`).d('工位')}
                >
                  {getFieldDecorator('workcellId')(
                    // <Lov code="MT.WORK_STATION" queryParams={{ tenantId }} />
                    <MultipleLov code="MT.WORK_STATION" queryParams={{ tenantId }} />
                  )}
                </Form.Item>
              </Col>
              <Col span="5">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.siteFlag`).d('作业类型')}
                >
                  {getFieldDecorator('siteFlag', {})(
                    <Select allowClear>
                      <Option value='Y'>
                      出站
                      </Option>
                      <Option value='N'>
                      进站
                      </Option>
                    </Select>
              )}
                </Form.Item>
              </Col>
              <Col span="4" className={SEARCH_COL_CLASSNAME}>
                <Form.Item>
                  <Button onClick={this.setExpandForm}>
                    {this.state.expandForm
                  ? intl.get('hzero.common.button.collected').d('收起查询')
                  : intl.get(`hzero.common.button.viewMore`).d('更多查询')}
                  </Button>
                  <Button onClick={this.resetSearch.bind(this)}>
                    {intl.get(`hzero.common.button.reset`).d('重置')}
                  </Button>
                  <Button type="primary" htmlType="submit" onClick={this.queryData.bind(this)}>
                    {intl.get(`hzero.common.button.search`).d('查询')}
                  </Button>
                </Form.Item>
              </Col>
            </Row>

            <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: this.state.expandForm ? '' : 'none' }}>
              <Col span="5">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.siteId`).d('站点')}
                >
                  {getFieldDecorator('siteId', {})(
                    <Lov code="MT.SITE" queryParams={{ tenantId }} textField="siteName" />
              )}
                </Form.Item>
              </Col>
              <Col span="5">
                <Form.Item label="制造部" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('workshop', {})(<Lov
                    // code="HME_WORK_SHOP"
                    code="HME.SITE_WORK_SHOP"
                    queryParams={{
                        tenantId: getCurrentOrganizationId(),
                        siteId: getFieldValue('siteId'),
                      }}
                  />)}
                </Form.Item>
              </Col>
              <Col span="5">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.productionLineId`).d('产线')}
                >
                  {getFieldDecorator('productionLineId')(
                    // <Lov code="MT.PRODLINE" queryParams={{ tenantId }} />
                    <Lov
                      code="HME.MULTI.PRODLINE"
                      queryParams={{
                        tenantId,
                        siteId: getFieldValue('siteId'),
                        workshopId: getFieldValue('workshop'),
                      }}
                    />
              )}
                </Form.Item>
              </Col>
              <Col span="5">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.lineWorkcellId`).d('工段')}
                >
                  {getFieldDecorator('lineWorkcellId')(
                    // <Lov code="HME_SINGLE_WORKCELL" queryParams={{ tenantId }} />
                    <Lov
                      code="HME.FINAL_LINE"
                      queryParams={{
                        prodLineId: getFieldValue('productionLineId'),
                        tenantId,
                        typeFlag: 'LINE',
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: this.state.expandForm ? '' : 'none' }}>
              <Col span="5">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.workOrder`).d('工单')}
                >
                  {getFieldDecorator('workOrder')(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col span="5">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.snMaterialId`).d('产品料号')}
                >
                  {getFieldDecorator('snMaterialId', {})(
                    <Lov code="MT.MATERIAL" queryParams={{ tenantId }} />
              )}
                </Form.Item>
              </Col>
              <Col span="5">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.materialLotCode`).d('产品序列号')}
                >
                  {getFieldDecorator('materialLotCode')(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col span="5">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.reworkFlag`).d('返修标识')}
                >
                  {getFieldDecorator('reworkFlag', {})(
                    <Select allowClear>
                      <Option value='N'>
                      否
                      </Option>
                      <Option value='Y'>
                      是
                      </Option>
                    </Select>
              )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: this.state.expandForm ? '' : 'none' }}>
              <Col span="5">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.processId`).d('工序')}
                >
                  {getFieldDecorator('processId', {})(
                    <Lov
                      code="HME.WORK_PROCESS"
                      queryParams={{ tenantId }}
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
            onChange={page => this.queryDataByPanigation(page)}
            loading={fetchListLoading}
          />
          <ModalContainer ref={registerContainer} />
        </Content>
      </div>
    );
  }
}
