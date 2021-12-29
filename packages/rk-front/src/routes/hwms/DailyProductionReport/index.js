/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 工序不良报表
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Form, Button, Col, Row, DatePicker, Table, Input } from 'hzero-ui';
import moment from 'moment';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
import { getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';
import { isEmpty } from 'lodash';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ExpandDrawer from './ExpandDrawer';
import ExpandDrawerData from './ExpandDrawerData';

const tenantId = getCurrentOrganizationId();

const commonModelPrompt = 'tarzan.hwms.dailyProductionReport';

@connect(({ dailyProductionReport, loading }) => ({
  dailyProductionReport,
  fetchListLoading: loading.effects['dailyProductionReport/queryDataList'],
}))
@Form.create({ fieldNameProp: null })
export default class DailyProductionReport extends Component {
  state = {
    expandForm: false,
    expandFormData: false,
    searchForDetail: {},
    record: {},
  };

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'dailyProductionReport/queryDataList',
    //   payload: {
    //     startTime: moment()
    //       .subtract(1, "weeks")
    //       .format('YYYY-MM-DD HH:mm:ss'),
    //     endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    //   },
    // });
  }

  @Bind
  queryData() {
    const { dispatch } = this.props;

    const { form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        // 根据页数查询报表信息
        dispatch({
          type: 'dailyProductionReport/queryDataList',
          payload: {
            ...values,
            startTime:
              values.startTime == null
                ? ''
                : moment(values.startTime).format(DEFAULT_DATETIME_FORMAT),
            endTime:
              values.endTime == null ? '' : moment(values.endTime).format(DEFAULT_DATETIME_FORMAT),
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
        dispatch({
          type: 'dailyProductionReport/queryDataList',
          payload: {
            ...values,
            startTime:
              values.startTime == null
                ? ''
                : moment(values.startTime).format(DEFAULT_DATETIME_FORMAT),
            endTime:
              values.endTime == null ? '' : moment(values.endTime).format(DEFAULT_DATETIME_FORMAT),
            page,
          },
        });
      }
    });
  }

  @Bind
  onDetail(record) {
    const { dispatch } = this.props;
    const { form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        // 根据页数查询明细报表信息
        dispatch({
          type: 'dailyProductionReport/queryDetailDataList',
          payload: {
            ...values,
            startTime:
              values.startTime == null
                ? ''
                : moment(values.startTime).format(DEFAULT_DATETIME_FORMAT),
            endTime:
              values.endTime == null ? '' : moment(values.endTime).format(DEFAULT_DATETIME_FORMAT),
            shiftDate: record.shiftDateStr,
          },
        });
        this.setState({
          searchForDetail: {
            ...values,
            startTime:
              values.startTime == null
                ? ''
                : moment(values.startTime).format(DEFAULT_DATETIME_FORMAT),
            endTime:
              values.endTime == null ? '' : moment(values.endTime).format(DEFAULT_DATETIME_FORMAT),
            shiftDate: record.shiftDateStr,
          },
          expandDrawer: !this.state.expandDrawer,
        });
      }
    });
  }

  @Bind
  onSearch(fields = {}) {
    const { dispatch } = this.props;
    // 根据页数查询报表明细信息
    dispatch({
      type: 'dailyProductionReport/queryDetailDataList',
      payload: {
        ...this.state.searchForDetail,

        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  @Bind
  onDetailData(materialId, workOrderId, processId, record) {
    const { dispatch } = this.props;
    this.setState({ searchForDetail: { materialId, workOrderId, processId }, expandFormData: !this.state.expandFormData, record });
    // 根据页数查询明细报表信息
    dispatch({
      type: 'dailyProductionReport/queryDetailDataAllList',
      payload: {
        materialId,
        workOrderId,
        processId,
        shiftStartTime: record.shiftStartTime,
        shiftEndTime: record.shiftEndTime,
      },
    });
  }

  @Bind
  onSearchData(fields = {}) {
    const { dispatch } = this.props;
    // 根据页数查询报表明细信息
    dispatch({
      type: 'dailyProductionReport/queryDetailDataAllList',
      payload: {
        ...this.state.searchForDetail,
        shiftStartTime: this.state.record.shiftStartTime,
        shiftEndTime: this.state.record.shiftEndTime,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  @Bind
  expandColseData() {
    this.setState({ expandDrawer: !this.state.expandDrawer });
  }

  @Bind
  expandColseDataList() {
    this.setState({ expandFormData: !this.state.expandFormData });
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
      dailyProductionReport: {
        headList = [],
        headPagination = {},
        detailList = [],
        detailPagination = {},
        detailListData = [],
        detailPaginationData = {},
      },
    } = this.props;

    // 模拟动态列
    // const genIndex = [
    //   { title: '光学工段1', dataIndex: '1' },
    //   { title: '光学工段1返修', dataIndex: '1_repair' },
    //   { title: '光学工段2', dataIndex: '2' },
    //   { title: '光学工段2返修', dataIndex: '2_repair' },
    //   { title: '光学工段3', dataIndex: '3' },
    //   { title: '光学工段3返修', dataIndex: '3_repair' },
    //   { title: '光学工段4', dataIndex: '4' },
    //   { title: '光学工段4返修', dataIndex: '4_repair' },
    //   { title: '光学工段5', dataIndex: '5' },
    //   { title: '光学工段5返修', dataIndex: '5_repair' },
    //   { title: '光学工段6', dataIndex: '6' },
    //   { title: '光学工段6返修', dataIndex: '6_repair' },
    // ];

    // 设置显示数据
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.production`).d('时间'),
        dataIndex: 'shiftDate',
        align: 'center',
        render: (val, record, index) => {
          const productionList = headList.map(e => e.shiftDate);
          const first = productionList.indexOf(record.shiftDate);
          const all = headList.filter(e => e.shiftDate === record.shiftDate).length;
          const obj = {
            children: <a onClick={this.onDetail.bind(this, record)}>{val}</a>,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.production`).d('开班时间'),
        dataIndex: 'shiftStartTime',
        align: 'center',
        render: (val, record, index) => {
          const productionList = headList.filter(e => e.shiftDate === record.shiftDate).map(e => e.shiftStartTime);
          const first = headList.map(e => e.shiftStartTime + e.shiftDate).indexOf(val + record.shiftDate);
          const all = productionList.filter(e => e === record.shiftStartTime).length;
          const obj = {
            children: record.shiftStartTime,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.production`).d('结班时间'),
        dataIndex: 'shiftEndTime',
        align: 'center',
        render: (val, record, index) => {
          const productionList = headList.filter(e => e.shiftDate === record.shiftDate && e.shiftStartTime === record.shiftStartTime).map(e => e.shiftEndTime);
          const first = headList.map(e => e.shiftEndTime + e.shiftStartTime + e.shiftDate).indexOf(val + record.shiftStartTime + record.shiftDate);
          const all = productionList.filter(e => e === record.shiftEndTime).length;
          const obj = {
            children: record.shiftEndTime,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.production`).d('车间'),
        dataIndex: 'workshopName',
        align: 'center',
        render: (val, record, index) => {
          const productionList = headList.filter(e => e.shiftDate === record.shiftDate && e.shiftStartTime === record.shiftStartTime && e.shiftEndTime === record.shiftEndTime).map(e => e.workshopName);
          const first = headList.map(e => e.workshopName + e.shiftEndTime + e.shiftStartTime + e.shiftDate).indexOf(val + record.shiftEndTime + record.shiftStartTime + record.shiftDate);
          const all = productionList.filter(e => e === record.workshopName).length;
          const obj = {
            children: record.workshopName,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.production`).d('生产线'),
        dataIndex: 'production',
        align: 'center',
        render: (val, record, index) => {
          const productionList = headList.filter(e => e.shiftDate === record.shiftDate && e.shiftStartTime === record.shiftStartTime && e.shiftEndTime === record.shiftEndTime && e.workshopName === record.workshopName).map(e => e.production);
          const first = headList.map(e => e.production + e.workshopName + e.shiftEndTime + e.shiftStartTime + e.shiftDate).indexOf(val + record.workshopName + record.shiftEndTime + record.shiftStartTime + record.shiftDate);
          const all = productionList.filter(e => e === record.production).length;
          const obj = {
            children: record.production,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.production`).d('工段'),
        dataIndex: 'lineWorkcellName',
        align: 'center',
        render: (val, record, index) => {
          const productionList = headList.filter(e => e.shiftDate === record.shiftDate && e.shiftStartTime === record.shiftStartTime && e.shiftEndTime === record.shiftEndTime && e.workshopName === record.workshopName && e.production === record.production).map(e => e.lineWorkcellName);
          const first = headList.map(e => e.lineWorkcellName + e.production + e.workshopName + e.shiftEndTime + e.shiftStartTime + e.shiftDate).indexOf(val + record.production + record.workshopName + record.shiftEndTime + record.shiftStartTime + record.shiftDate);
          const all = productionList.filter(e => e === record.lineWorkcellName).length;
          const obj = {
            children: record.lineWorkcellName,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.productionNum`).d('产品料号'),
        dataIndex: 'productionNum',
        align: 'center',
        render: (val, record, index) => {
          const productionList = headList.filter(e => e.shiftDate === record.shiftDate && e.shiftStartTime === record.shiftStartTime && e.shiftEndTime === record.shiftEndTime && e.workshopName === record.workshopName && e.production === record.production && e.lineWorkcellName === record.lineWorkcellName).map(e => e.productionNum);
          const first = headList.map(e => e.productionNum + e.lineWorkcellName + e.production + e.workshopName + e.shiftEndTime + e.shiftStartTime + e.shiftDate).indexOf(val + record.lineWorkcellName + record.production + record.workshopName + record.shiftEndTime + record.shiftStartTime + record.shiftDate);
          const all = productionList.filter(e => e === record.productionNum).length;
          const obj = {
            children: record.productionNum,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.productionDes`).d('产品描述'),
        dataIndex: 'productionDes',
        align: 'left',
        render: (val, record, index) => {
          const productionList = headList.filter(e => e.shiftDate === record.shiftDate && e.shiftStartTime === record.shiftStartTime && e.shiftEndTime === record.shiftEndTime && e.workshopName === record.workshopName && e.production === record.production && e.lineWorkcellName === record.lineWorkcellName && e.productionNum === record.productionNum).map(e => e.productionDes);
          const first = headList.map(e => e.productionDes + e.productionNum + e.lineWorkcellName + e.production + e.workshopName + e.shiftEndTime + e.shiftStartTime + e.shiftDate).indexOf(val + record.productionNum + record.lineWorkcellName + record.production + record.workshopName + record.shiftEndTime + record.shiftStartTime + record.shiftDate);
          const all = productionList.filter(e => e === record.productionDes).length;
          const obj = {
            children: record.productionDes,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.workOrderNum`).d('工单号'),
        dataIndex: 'workOrderNum',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.gongXu`).d('投产（首道）'),
        dataIndex: 'putData',
        align: 'right',
        render: (val, record) => {
          return <a onClick={this.onDetailData.bind(this, record.materialId, record.workOrderId, record.firstProcessId, record)}>{val}</a>;
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.gongWei`).d('完工（末道）'),
        dataIndex: 'finishedData',
        align: 'right',
        render: (val, record) => {
          return <a onClick={this.onDetailData.bind(this, record.materialId, record.workOrderId, record.endProcessId, record)}>{val}</a>;
        },
      },
      // ...genIndex.map(v => {
      //   return {
      //     title: `${v.title}`,
      //     align: 'center',
      //     dataIndex: `opticalSection_${v.dataIndex}`,
      //   };
      // }),
    ];

    // 获取整个表单
    const { form } = this.props;
    // 获取表单的字段属性
    const { getFieldDecorator, getFieldValue } = form;

    const expandDataProps = {
      expandDrawer: this.state.expandDrawer,
      onCancel: this.expandColseData,
      onSearch: this.onSearch,
      detailList,
      detailPagination,
    };

    const expandDataListProps = {
      expandDrawer: this.state.expandFormData,
      onCancel: this.expandColseDataList,
      onSearch: this.onSearchData,
      detailList: detailListData,
      detailPagination: detailPaginationData,
    };

    //  返回默认界面数据
    return (
      <React.Fragment>
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('产量日明细报表')} />
        <Content>
          <Form className={SEARCH_FORM_CLASSNAME}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col span='5'>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.startTime`).d('时间开始')}
                >
                  {getFieldDecorator('startTime', {
                    initialValue: moment(
                      moment()
                        .subtract(1, "weeks")
                        .format('YYYY-MM-DD')
                    ),
                  })(
                    <DatePicker
                      showTime
                      placeholder=""
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD"
                      disabledDate={currentDate =>
                        getFieldValue('endTime') &&
                        moment(getFieldValue('endTime')).isBefore(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span='5'>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.endTime`).d('时间结束')}
                >
                  {getFieldDecorator('endTime', {
                    initialValue: moment(moment().format('YYYY-MM-DD')),
                  })(
                    <DatePicker
                      showTime
                      placeholder=""
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD"
                      disabledDate={currentDate =>
                        getFieldValue('startTime') &&
                        moment(getFieldValue('startTime')).isAfter(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span='5'>
                <Form.Item label="车间" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('parentOrganizationId', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`parentOrganizationId`).d('车间'),
                        }),
                      },
                    ],
                  })(
                    <Lov
                      code="HME_WORK_SHOP"
                      queryParams={{
                        tenantId: getCurrentOrganizationId(),
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span='5'>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.productionLineId`).d('生产线')}
                >
                  {getFieldDecorator('productionLineId')(
                    <Lov code="MT.PRODLINE" queryParams={{ tenantId }} />
                  )}
                </Form.Item>
              </Col>
              <Col span='4' className={SEARCH_COL_CLASSNAME}>
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

            <Row
              {...SEARCH_FORM_ROW_LAYOUT}
              style={{ display: this.state.expandForm ? '' : 'none' }}
            >
              <Col span='5'>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.siteId`).d('站点')}
                >
                  {getFieldDecorator('siteId', {})(
                    <Lov code="MT.SITE" queryParams={{ tenantId }} textField="siteName" />
                  )}
                </Form.Item>
              </Col>
              <Col span='5'>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.workOrderNum`).d('工单号')}
                >
                  {getFieldDecorator('workOrderNum')(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col span='5'>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.materialId`).d('产品')}
                >
                  {getFieldDecorator('materialId', {})(
                    <Lov code="MT.MATERIAL" queryParams={{ tenantId }} />
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
        </Content>
        {this.state.expandDrawer && <ExpandDrawer {...expandDataProps} />}
        {this.state.expandFormData && <ExpandDrawerData {...expandDataListProps} />}
      </React.Fragment>
    );
  }
}
