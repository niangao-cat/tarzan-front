/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 设备故障监控
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Form, Button, Col, Row, Table, DatePicker, Input, Select } from 'hzero-ui';
import ExcelExport from 'components/ExcelExport';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
import intl from 'utils/intl';
import moment from 'moment';

import { getCurrentOrganizationId, getDateTimeFormat, filterNullValueObject } from 'utils/utils';
import Lov from 'components/Lov';
import { Header, Content } from 'components/Page';
import MultipleLov from '../../../components/MultipleLov/index';
import ModalContainer, { registerContainer } from '../../../components/Modal/ModalContainer';

const commonModelPrompt = 'tarzan.hwms.equipmentFaultMonitoring';

@connect(({ equipmentFaultMonitoring, loading }) => ({
  equipmentFaultMonitoring,
  fetchListLoading: loading.effects['equipmentFaultMonitoring/queryDataList'],
}))
@Form.create({ fieldNameProp: null })
export default class equipmentFaultMonitoring extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'equipmentFaultMonitoring/batchLovData',
    });
    dispatch({
      type: 'equipmentFaultMonitoring/queryDataList',
    });
  }

  @Bind
  queryData() {
    const { dispatch } = this.props;

    const { form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        // 根据页数查询报表信息
        dispatch({
          type: 'equipmentFaultMonitoring/queryDataList',
          payload: {
            ...values,
            creationStartTime: !values.creationStartTime
              ? null
              : moment(values.creationStartTime).format(DEFAULT_DATETIME_FORMAT),
            creationEndTime: !values.creationEndTime
              ? null
              : moment(values.creationEndTime).format(DEFAULT_DATETIME_FORMAT),
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
          type: 'equipmentFaultMonitoring/queryDataList',
          payload: {
            ...values,
            creationStartTime: !values.creationStartTime
              ? null
              : moment(values.creationStartTime).format(DEFAULT_DATETIME_FORMAT),
            creationEndTime: !values.creationEndTime
              ? null
              : moment(values.creationEndTime).format(DEFAULT_DATETIME_FORMAT),
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

  // 导出
  @Bind()
  handleGetFormValue() {
    const { form } = this.props;
    const filterValue = form.getFieldsValue();
    return filterNullValueObject({
      ...filterValue,
      creationStartTime: !filterValue.creationStartTime
        ? null
        : moment(filterValue.creationStartTime).format(DEFAULT_DATETIME_FORMAT),
      creationEndTime: !filterValue.creationEndTime
        ? null
        : moment(filterValue.creationEndTime).format(DEFAULT_DATETIME_FORMAT),
    });
  }

  // 渲染 界面布局
  render() {
    // 获取默认数据
    const {
      fetchListLoading,
      equipmentFaultMonitoring: { headList = [], headPagination = {}, abnormalStateMap = [] },
    } = this.props;

    // 设置显示数据
    const columns = [
      {
        title: '序号',
        dataIndex: 'orderSeq',
        render: (val, record, index) => index + 1,
      },
      {
        title: intl.get(`${commonModelPrompt}.assetName`).d('资产名称'),
        dataIndex: 'assetName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.assetEncoding`).d('资产编号'),
        dataIndex: 'assetEncoding',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.model`).d('型号'),
        dataIndex: 'model',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.equipmentBodyNum`).d('序列号'),
        dataIndex: 'equipmentBodyNum',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.areaName`).d('使用部门'),
        dataIndex: 'areaName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.location`).d('存放地方'),
        dataIndex: 'location',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.user`).d('使用人'),
        dataIndex: 'user',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionName`).d('异常描述'),
        dataIndex: 'exceptionName',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.creationDate`).d('异常发生时间'),
        dataIndex: 'creationDate',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.closeTime`).d('异常关闭时间'),
        dataIndex: 'closeTime',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionTime`).d('异常时间段(h)'),
        dataIndex: 'exceptionTime',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.respondRemark`).d('备注'),
        dataIndex: 'respondRemark',
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
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('设备故障监控报表')}>
          <ExcelExport
            // exportAsync
            requestUrl={`/mes-report/v1/${getCurrentOrganizationId()}/hme-equipment-fault-monitor/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue()}
          />
        </Header>
        <Content>
          <Form className={SEARCH_FORM_CLASSNAME}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.equipmentId`).d('资产编号')}
                >
                  {getFieldDecorator(
                    'equipmentId',
                    {}
                  )(
                    <MultipleLov
                      code="HME.ASSET"
                      queryParams={{
                        tenantId: getCurrentOrganizationId(),
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.equipmentCategory`).d('设备类别')}
                >
                  {getFieldDecorator(
                    'equipmentCategory',
                    {}
                  )(
                    <Lov
                      code="HME.EQUIPMENT_CATEGORY"
                      queryParams={{ tenantId: getCurrentOrganizationId() }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.areaId`).d('使用部门')}
                >
                  {getFieldDecorator(
                    'areaId',
                    {}
                  )(
                    <Lov
                      code="HME.BUSINESS_AREA"
                      queryParams={{ tenantId: getCurrentOrganizationId() }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span="4" className={SEARCH_COL_CLASSNAME}>
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
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.location`).d('存放地点')}
                >
                  {getFieldDecorator('location', {
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.creationStartTime`).d('异常发生时间起')}
                >
                  {getFieldDecorator(
                    'creationStartTime',
                    {}
                  )(
                    <DatePicker
                      // showTime
                      placeholder=""
                      style={{ width: '100%' }}
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                        getFieldValue('creationEndTime') &&
                        moment(getFieldValue('creationEndTime')).isBefore(currentDate, 'second')
                      }
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.creationEndTime`).d('异常发生时间至')}
                >
                  {getFieldDecorator(
                    'creationEndTime',
                    {}
                  )(
                    <DatePicker
                      // showTime
                      placeholder=""
                      style={{ width: '100%' }}
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                        getFieldValue('creationStartTime') &&
                        moment(getFieldValue('creationStartTime')).isAfter(currentDate, 'second')
                      }
                      showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.exceptionId`).d('异常描述')}
                >
                  {getFieldDecorator(
                    'exceptionId',
                    {}
                  )(
                    <Lov
                      code="HME.EXCEPTION_DESC"
                      queryParams={{ tenantId: getCurrentOrganizationId() }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.equipmentExceptionStatus`).d('异常状态')}
                >
                  {getFieldDecorator(
                    'equipmentExceptionStatus',
                    {}
                  )(
                    <Select allowClear>
                      {abnormalStateMap.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              {/* <Col span="6"> */}
              {/*   <Form.Item */}
              {/*     {...SEARCH_FORM_ITEM_LAYOUT} */}
              {/*     label={intl.get(`${commonModelPrompt}.closeStartTime`).d('异常关闭时间起')} */}
              {/*   > */}
              {/*     {getFieldDecorator( */}
              {/*       'closeStartTime', */}
              {/*       {} */}
              {/*     )( */}
              {/*       <DatePicker */}
              {/*         // showTime */}
              {/*         placeholder="" */}
              {/*         style={{ width: '100%' }} */}
              {/*         format={getDateTimeFormat()} */}
              {/*         disabledDate={currentDate => */}
              {/*           getFieldValue('closeEndTime') && */}
              {/*           moment(getFieldValue('closeEndTime')).isBefore(currentDate, 'second') */}
              {/*         } */}
              {/*         showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} */}
              {/*       /> */}
              {/*     )} */}
              {/*   </Form.Item> */}
              {/* </Col> */}
              {/* <Col span="6"> */}
              {/*   <Form.Item */}
              {/*     {...SEARCH_FORM_ITEM_LAYOUT} */}
              {/*     label={intl.get(`${commonModelPrompt}.closeEndTime`).d('异常关闭时间至')} */}
              {/*   > */}
              {/*     {getFieldDecorator( */}
              {/*       'closeEndTime', */}
              {/*       {} */}
              {/*     )( */}
              {/*       <DatePicker */}
              {/*         // showTime */}
              {/*         placeholder="" */}
              {/*         style={{ width: '100%' }} */}
              {/*         format={getDateTimeFormat()} */}
              {/*         disabledDate={currentDate => */}
              {/*           getFieldValue('closeStartTime') && */}
              {/*           moment(getFieldValue('closeStartTime')).isAfter(currentDate, 'second') */}
              {/*         } */}
              {/*         showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }} */}
              {/*       /> */}
              {/*     )} */}
              {/*   </Form.Item> */}
              {/* </Col> */}
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
        <ModalContainer ref={registerContainer} />
      </div>
    );
  }
}
