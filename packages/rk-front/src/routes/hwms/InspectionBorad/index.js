/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 巡检报表
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Form, Button, Col, Row, Table, DatePicker, Select } from 'hzero-ui';
import Lov from 'components/Lov';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_COL_CLASSNAME,
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import { getCurrentOrganizationId, getDateFormat, filterNullValueObject } from 'utils/utils';
import moment from 'moment';
import ExcelExport from 'components/ExcelExport';
import { DRAWER_FORM_ITEM_LAYOUT, DEFAULT_DATE_FORMAT } from '../../../utils/constants';
import Detail from './Detail';
import LineEcharts from './FoldLineEharts';


const tenantId = getCurrentOrganizationId();

const commonModelPrompt = 'tarzan.hwms.inspectionBorad';

@connect(({ inspectionBorad, loading }) => ({
  inspectionBorad,
  fetchListLoading: loading.effects['inspectionBorad/queryDataList']||loading.effects['inspectionBorad/queryLineList'],
  fetchDetailLoading: loading.effects['inspectionBorad/queryDetailList'],
}))
@Form.create({ fieldNameProp: null })
export default class inspectionBorad extends Component {
  state = {
    detailShow: false, // 显示明细数据
    record: {}, // 单条信息
  };

  // 加载时调用
  componentDidMount() {}

  // 按条件查询数据
  @Bind
  queryData() {
    const { dispatch } = this.props;

    const { form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        // 设置字段
        const fieldValue = values;

        // 设置时间格式
        fieldValue.inspectionFinishFromDateStr =
          fieldValue.inspectionFinishFromDateStr === '' ||
          fieldValue.inspectionFinishFromDateStr === undefined ||
          fieldValue.inspectionFinishFromDateStr === null
            ? null
            : moment(fieldValue.inspectionFinishFromDateStr).format(DEFAULT_DATE_FORMAT);

        fieldValue.inspectionFinishToDateStr =
          fieldValue.inspectionFinishToDateStr === '' ||
          fieldValue.inspectionFinishToDateStr === undefined ||
          fieldValue.inspectionFinishToDateStr === null
            ? null
            : moment(fieldValue.inspectionFinishToDateStr).format(DEFAULT_DATE_FORMAT);

        // 根据页数查询报表信息
        dispatch({
          type: 'inspectionBorad/queryDataList',
          payload: {
            ...fieldValue,
          },
        });

        // 查询折线信息
        dispatch({
          type: 'inspectionBorad/queryLineList',
          payload: {
            ...fieldValue,
          },
        });
      }
    });
  }

  // 分页查询数据
  @Bind
  queryDataByPanigation(page = {}) {
    const { dispatch } = this.props;

    const { form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        // 设置字段
        const fieldValue = values;

        // 设置时间格式
        fieldValue.inspectionFinishFromDateStr =
          fieldValue.inspectionFinishFromDateStr === '' ||
          fieldValue.inspectionFinishFromDateStr === undefined ||
          fieldValue.inspectionFinishFromDateStr === null
            ? null
            : moment(fieldValue.inspectionFinishFromDateStr).format(DEFAULT_DATE_FORMAT);

        fieldValue.inspectionFinishToDateStr =
          fieldValue.inspectionFinishToDateStr === '' ||
          fieldValue.inspectionFinishToDateStr === undefined ||
          fieldValue.inspectionFinishToDateStr === null
            ? null
            : moment(fieldValue.inspectionFinishToDateStr).format(DEFAULT_DATE_FORMAT);

        // 根据页数查询报表信息
        dispatch({
          type: 'inspectionBorad/queryDataList',
          payload: {
            ...fieldValue,
            page,
          },
        });
      }
    });
  }

  // 重置查询
  @Bind
  resetSearch = () => {
    const { form } = this.props;
    form.resetFields();
  };

  // 导出接口传参
  @Bind()
  handleGetFormValue() {
    // 设置字段
    const fieldValue = this.props.form.getFieldsValue();

    // 设置时间格式
    fieldValue.inspectionFinishFromDateStr =
      fieldValue.inspectionFinishFromDateStr === '' ||
      fieldValue.inspectionFinishFromDateStr === undefined ||
      fieldValue.inspectionFinishFromDateStr === null
        ? null
        : moment(fieldValue.inspectionFinishFromDateStr).format(DEFAULT_DATE_FORMAT);

    fieldValue.inspectionFinishToDateStr =
      fieldValue.inspectionFinishToDateStr === '' ||
      fieldValue.inspectionFinishToDateStr === undefined ||
      fieldValue.inspectionFinishToDateStr === null
        ? null
        : moment(fieldValue.inspectionFinishToDateStr).format(DEFAULT_DATE_FORMAT);

    return filterNullValueObject({ ...fieldValue });
  }

  /**
   * 是否显示明细信息
   * @param {显示标识} flag
   */
  @Bind
  doDetailShowFlag(flag = false, record = {}) {
    const { dispatch } = this.props;
    if (flag) {
      this.setState({ record: {
        departmentId: this.props.form.getFieldValue('departmentId'),
        workshopId: record.areaId,
        processId: record.processId,
        inspectionFinishFromDateStr: this.props.form.getFieldValue('inspectionFinishFromDateStr') === '' ||
        this.props.form.getFieldValue('inspectionFinishFromDateStr') === undefined ||
        this.props.form.getFieldValue('inspectionFinishFromDateStr') === null
          ? null
          : moment(this.props.form.getFieldValue('inspectionFinishFromDateStr')).format(DEFAULT_DATE_FORMAT),
        inspectionFinishToDateStr: this.props.form.getFieldValue('inspectionFinishToDateStr') === '' ||
        this.props.form.getFieldValue('inspectionFinishToDateStr') === undefined ||
        this.props.form.getFieldValue('inspectionFinishToDateStr') === null
          ? null
          : moment(this.props.form.getFieldValue('inspectionFinishToDateStr')).format(DEFAULT_DATE_FORMAT),
      }, detailShow: flag });
      // 根据页数查询报表信息
      dispatch({
        type: 'inspectionBorad/queryDetailList',
        payload: {
          departmentId: this.props.form.getFieldValue('departmentId'),
          workshopId: record.areaId,
          processId: record.processId,
          inspectionFinishFromDateStr: this.props.form.getFieldValue('inspectionFinishFromDateStr') === '' ||
          this.props.form.getFieldValue('inspectionFinishFromDateStr') === undefined ||
          this.props.form.getFieldValue('inspectionFinishFromDateStr') === null
            ? null
            : moment(this.props.form.getFieldValue('inspectionFinishFromDateStr')).format(DEFAULT_DATE_FORMAT),
          inspectionFinishToDateStr: this.props.form.getFieldValue('inspectionFinishToDateStr') === '' ||
          this.props.form.getFieldValue('inspectionFinishToDateStr') === undefined ||
          this.props.form.getFieldValue('inspectionFinishToDateStr') === null
            ? null
            : moment(this.props.form.getFieldValue('inspectionFinishToDateStr')).format(DEFAULT_DATE_FORMAT),
        },
      });
    }else{
        this.setState({ detailShow: flag });
    }
  }

  /**
   * 分页展示明细信息
   * @param {分页} page
   */
  @Bind()
  showDetailByPagination(page = {}) {
    const { dispatch } = this.props;
    dispatch({
      type: 'inspectionBorad/queryDetailList',
      payload: {
        ...this.state.record,
        page,
      },
    });
  }

  // 渲染 界面布局
  render() {
    // 获取默认数据
    const {
      fetchListLoading,
      fetchDetailLoading,
      inspectionBorad: { headList = [], headPagination = {}, detailList= [], detailPaginatin= {}, dataSource= {} },
    } = this.props;

    // // 列明显示
    // const lineShow = this.props.form.getFieldValue('workshopId') ? '工序' : '车间';
    //
    // // 数据显示
    // const lineDataShow = this.props.form.getFieldValue('workshopId') ? 'processName' : 'areaName';

    // 设置显示数据
    const columns = [
      // lineShow === "车间"?
      {
        title: intl.get(`${commonModelPrompt}.areaName`).d(`车间`),
        dataIndex: `areaName`,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.areaNcNum`).d('车间不合格数'),
        dataIndex: 'areaNcNum',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.processName`).d(`工序`),
        dataIndex: `processName`,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.processNcNum`).d('工序不合格数'),
        dataIndex: 'processNcNum',
        align: 'center',
      },
      {
        title: intl.get('hzero.common.button.action').d('问题明细'),
        dataIndex: 'detail',
        width: 120,
        align: 'center',
        render: (val, record) => (
          <span className='action-link'>
            <a onClick={() => this.doDetailShowFlag(true, record)}>
              {intl.get('tarzan.acquisition.transformation.button.edit').d('明细')}
            </a>
          </span>
        ),
      },
    ];

    // 获取整个表单
    const { form } = this.props;
    // 获取表单的字段属性
    const { getFieldDecorator, getFieldValue } = form;

    // 明细参数
    const detailProps= {
        visible: this.state.detailShow,
        record: this.state.record,
        dataSource: detailList,
        pagination: detailPaginatin,
        tenantId,
        fetchLoading: fetchDetailLoading,
        onColseDetail: this.doDetailShowFlag,
        onSearch: this.showDetailByPagination,
    };

    const lineProps = {
      dataSource,
      flag: this.props.form.getFieldValue('workshopId') ? 'Y' : 'N',
    };

    //  返回默认界面数据
    return (
      <div>
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('巡检报表')}>
          {/* {!!this.props.form.getFieldValue('departmentId') && ( */}
          {/*   <ExcelExport */}
          {/*     exportAsync */}
          {/*     requestUrl={lineShow === '车间' ? `/mes/v1/${getCurrentOrganizationId()}/qms-pqc-report/head/workshop/excel-export` : `/mes/v1/${getCurrentOrganizationId()}/qms-pqc-report/head/process/excel-export`} // 路径 */}
          {/*     otherButtonProps={{ type: 'primary' }} */}
          {/*     queryParams={this.handleGetFormValue()} */}
          {/*   /> */}
          {/* )} */}
          <ExcelExport
            // exportAsync
            requestUrl={`/mes-report/v1/${getCurrentOrganizationId()}/qms-pqc-report/excel-export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue()}
          />
        </Header>
        <Content>
          <Form className={SEARCH_FORM_CLASSNAME}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.departmentId`).d('事业部')}
                >
                  {getFieldDecorator('departmentId', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${commonModelPrompt}.departmentId`).d('事业部'),
                        }),
                      },
                    ],
                  })(
                    <Lov allowClear code="HME.BUSINESS_AREA" queryParams={{ tenantId }} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.workshopId`).d('车间')}
                >
                  {getFieldDecorator(
                    'workshopId',
                    {}
                  )(
                    <Lov
                      code="HME_WORK_SHOP"
                      queryParams={{ tenantId }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT} className={SEARCH_COL_CLASSNAME}>
                <Form.Item>
                  <Button onClick={this.resetSearch.bind(this)}>
                    {intl.get(`hzero.common.button.reset`).d('重置')}
                  </Button>
                  <Button type="primary" htmlType="submit" onClick={this.queryData.bind(this)}>
                    {intl.get(`hzero.common.button.search`).d('查询')}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl
                    .get(`${commonModelPrompt}.inspectionFinishFromDateStr`)
                    .d('检验时间从')}
                >
                  {getFieldDecorator(
                    'inspectionFinishFromDateStr',
                    {
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: intl.get(`${commonModelPrompt}.inspectionFinishFromDateStr`).d('检验时间从'),
                          }),
                        },
                      ],
                    }
                  )(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      format={getDateFormat()}
                      disabledDate={currentDate =>
                        getFieldValue('inspectionFinishToDateStr') &&
                        moment(getFieldValue('inspectionFinishToDateStr')).isBefore(
                          currentDate,
                          'second'
                        )
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.inspectionFinishToDateStr`).d('检验时间至')}
                >
                  {getFieldDecorator(
                    'inspectionFinishToDateStr',
                    {
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: intl.get(`${commonModelPrompt}.inspectionFinishToDateStr`).d('检验时间至'),
                          }),
                        },
                      ],
                    }
                  )(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      format={getDateFormat()}
                      disabledDate={currentDate =>
                        getFieldValue('inspectionFinishFromDateStr') &&
                        moment(getFieldValue('inspectionFinishFromDateStr')).isAfter(
                          currentDate,
                          'second'
                        )
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.timeFlag`).d('时间设置')}
                >
                  {getFieldDecorator('timeFlag', {
                     initialValue: "WEEK",
                  })(
                    <Select>
                      {[{value: 'WEEK', meaning: '周'}, {value: 'MONTH', meaning: '月'}, {value: 'SEASON', meaning: '季'}, {value: 'YEAR', meaning: '年'}].map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.meaning}
                        </Select.Option>
        ))}
                    </Select>
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
          <Detail {...detailProps} />
          <LineEcharts {...lineProps} />
        </Content>
      </div>
    );
  }
}
