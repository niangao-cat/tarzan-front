/**
 * @description SAP与MES凭证核对报表
 * @author ywj
 * @email wenjie.yang01@hand-china.com
 * @date 2020/11/13
 * @time 11:11
 * @version 0.0.1
 * @return
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Form, Button, Col, Row, Input, Table, DatePicker } from 'hzero-ui';
import moment from 'moment';
import Lov from 'components/Lov';
import { isUndefined } from 'lodash';
import ExcelExport from 'components/ExcelExport';
import { getDateTimeFormat, getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  FORM_COL_4_LAYOUT,
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';

const tenantId = getCurrentOrganizationId();



const commonModelPrompt = 'tarzan.hwms.sapAndMESVoucherVerificationReport';

@connect(({ sapAndMESVoucherVerificationReport, loading }) => ({
  sapAndMESVoucherVerificationReport,
  fetchListLoading: loading.effects['sapAndMESVoucherVerificationReport/queryDataList'],
}))
@Form.create({ fieldNameProp: null })
export default class sapAndMESVoucherVerificationReport extends Component {

  @Bind
  queryData() {
    const { dispatch } = this.props;

    const { form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        // 根据页数查询报表信息
        dispatch({
          type: 'sapAndMESVoucherVerificationReport/queryDataList',
          payload: {
            ...values,
            startDate: isUndefined(values.startDate)? null: moment(values.startDate).format(DEFAULT_DATETIME_FORMAT),
            endDate: isUndefined(values.endDate)? null: moment(values.endDate).format(DEFAULT_DATETIME_FORMAT),
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
          type: 'sapAndMESVoucherVerificationReport/queryDataList',
          payload: {
            ...values,
            startDate: isUndefined(values.startDate)? null: moment(values.startDate).format(DEFAULT_DATETIME_FORMAT),
            endDate: isUndefined(values.endDate)? null: moment(values.endDate).format(DEFAULT_DATETIME_FORMAT),
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

  @Bind()
  handleGetFormValue() {
    const { form } = this.props;
    const filterValue = form.getFieldsValue();
    return filterNullValueObject({ ...filterValue,
       startDate: isUndefined(filterValue.startDate)? null: moment(filterValue.startDate).format(DEFAULT_DATETIME_FORMAT),
       endDate: isUndefined(filterValue.endDate)? null: moment(filterValue.endDate).format(DEFAULT_DATETIME_FORMAT) });
   }


  // 渲染 界面布局
  render() {

    // 获取默认数据
    const {
      fetchListLoading,
      sapAndMESVoucherVerificationReport: { headList=[] },
    } = this.props;

    // 设置显示数据
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.voucherNo`).d('SAP凭证号'),
        dataIndex: 'voucherNo',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.voucherLineNo`).d('SAP凭证行号'),
        dataIndex: 'voucherLineNo',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.year`).d('SAP年度'),
        dataIndex: 'year',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.moveType`).d('SAP移动类型'),
        dataIndex: 'moveType',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('SAP物料号'),
        dataIndex: 'materialCode',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialQty`).d('SAP数量'),
        dataIndex: 'materialQty',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.postingTime`).d('输入时间'),
        dataIndex: 'postingTime',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.workOrderNum`).d('SAP工单号'),
        dataIndex: 'workOrderNum',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.projectNo`).d('预留项目号'),
        dataIndex: 'projectNo',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.projectLineNo`).d('预留项目行号'),
        dataIndex: 'projectLineNo',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.voucherTitleTxt`).d('凭证抬头文本'),
        dataIndex: 'voucherTitleTxt',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.shipTo`).d('收货方'),
        dataIndex: 'shipTo',
        align: 'left',
      },
    ];

    // 获取整个表单
    const { form } = this.props;
    // 获取表单的字段属性
    const { getFieldDecorator, getFieldValue } = form;

    //  返回默认界面数据
    return (
      <div>
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('SAP与MES凭证核对报表')}>
          <ExcelExport
            exportAsync
            requestUrl={`/mes/v1/${getCurrentOrganizationId()}/itf-sap-material-voucher/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue()}
          />
        </Header>
        <Content>
          <Form className={SEARCH_FORM_CLASSNAME}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.site`).d('站点')}
                >
                  {getFieldDecorator('siteId', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${commonModelPrompt}.site`).d('站点'),
                        }),
                      },
                    ],
                  })(
                    <Lov
                      onChange={(value, values) => form.setFieldsValue({siteCode: values. siteCode})}
                      queryParams={{ tenantId }}
                      code="MT.SITE"
                      textField="siteCode"
                    />
              )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.startDate`).d('开始时间从')}
                >
                  {getFieldDecorator('startDate', {
                     initialValue: moment(moment().startOf('month')
                     .format('YYYY-MM-DD HH:mm:ss')),
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${commonModelPrompt}.startDate`).d('开始时间从'),
                        }),
                      },
                    ],
                  })(
                    <DatePicker
                      showTime
                      placeholder=""
                      style={{ width: '100%' }}
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                    getFieldValue('endDate') &&
                    (moment(getFieldValue('endDate')).isBefore(currentDate, 'second') ||
                    moment(getFieldValue('endDate')).subtract('days', 30).isAfter(currentDate, 'second'))
                  }
                    />
              )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.endDate`).d('开始时间至')}
                >
                  {getFieldDecorator('endDate', {
                    initialValue: moment(moment().endOf('month')
                    .format('YYYY-MM-DD HH:mm:ss')),
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${commonModelPrompt}.endDate`).d('开始时间至'),
                        }),
                      },
                    ],
                  })(
                    <DatePicker
                      showTime
                      placeholder=""
                      style={{ width: '100%' }}
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                    getFieldValue('startDate') &&
                    (moment(getFieldValue('startDate')).subtract('days', -30).isBefore(currentDate, 'second')||
                    moment(getFieldValue('startDate')).isAfter(currentDate, 'second'))
                  }
                    />
              )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
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
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  label={intl.get(`${commonModelPrompt}.materialCode`).d('物料编码')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('materialId', {})(
                    <Lov
                      onChange={(value, values) => form.setFieldsValue({materialCode: values. materialCode})}
                      code="MT.MATERIAL"
                      queryParams={{ tenantId }}
                      textField="materialCode"
                    />
              )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='仓库'>
                  {getFieldDecorator('warehouseId', {})(
                    <Lov
                      onChange={(value, values) => form.setFieldsValue({locatorCode: values. warehouse})}
                      code="MT.WARE.HOUSE"
                      queryParams={{ tenantId }}
                      textField="locatorCode"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.moveType`).d('移动类型')}
                >
                  {getFieldDecorator('moveType')(<Input />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Table
            bordered
            dataSource={headList}
            columns={columns}
            loading={fetchListLoading}
          />
        </Content>
      </div>
    );
  }
}
