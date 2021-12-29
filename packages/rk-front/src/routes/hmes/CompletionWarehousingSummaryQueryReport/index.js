/**
 * @Author:lly
 * @email: liyuan.liu@hand-china.com
 * @description： 完工及入库汇总查询报表
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Form, Button, Col, Row, DatePicker, Select, Input } from 'hzero-ui';
import { uniq } from 'lodash';
import moment from 'moment';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import TableList from './TableList';
import MultipleLov from '../../../components/MultipleLov/index';
import ModalContainer, { registerContainer } from '../../../components/Modal/ModalContainer';
import styles from './index.less';

const tenantId = getCurrentOrganizationId();
const commonModelPrompt = 'tarzan.hwms.completionWarehousingSummaryQueryReport';

const curDate = new Date();
const startDate = new Date(curDate.getTime() - 24*60*60*1000);
const endDate = new Date(curDate.getTime() - 24*60*60*1000);
startDate.setHours(0);
startDate.setMinutes(0);
startDate.setSeconds(0);
endDate.setHours(23);
endDate.setMinutes(59);
endDate.setSeconds(59);


@connect(({ completionWarehousingSummaryQueryReport, loading }) => ({
  completionWarehousingSummaryQueryReport,
  fetchListLoading: loading.effects['completionWarehousingSummaryQueryReport/queryDataList'],
  exportLoading: loading.effects['completionWarehousingSummaryQueryReport/exportExcel'],
}))
@Form.create({ fieldNameProp: null })
export default class completionWarehousingSummaryQueryReport extends Component {
  state = {
    expandForm: false,
    materialCode: [],
  };

  componentDidMount() {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'completionWarehousingSummaryQueryReport/batchLovData',
    });
    // 获取用户默认工厂
    dispatch({
      type: 'completionWarehousingSummaryQueryReport/getSite',
    }).then((res) => {
      if (res) {
        this.onSelectedSite(res.siteId);
      }
    });
    // 获取工厂列表
    dispatch({
      type: 'completionWarehousingSummaryQueryReport/fetchSiteList',
    });
  }

  // 在选择站点时候触发
  @Bind()
  onSelectedSite(value){
    const { dispatch } = this.props;
    dispatch({
      type: 'completionWarehousingSummaryQueryReport/fetchDivisionList',
      payload: {
        siteId: value,
        areaCategory: 'SYB',
      },
    });
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

  @Bind
  queryData() {
    const { dispatch } = this.props;

    const { form } = this.props;
    form.validateFields({ force: true }, (errs, values) => {
      if (!errs) {
        // 根据页数查询报表信息
        dispatch({
          type: 'completionWarehousingSummaryQueryReport/queryDataList',
          payload: {
            ...values,
            materialCode: values.materialCode && values.materialCode.toString(),
            queryDateFrom:
              values.queryDateFrom == null
                ? ''
                : moment(values.queryDateFrom).format(DEFAULT_DATETIME_FORMAT),
            queryDateTo:
              values.queryDateTo == null
                ? ''
                : moment(values.queryDateTo).format(DEFAULT_DATETIME_FORMAT),
          },
        });
      }
    });
  }

  @Bind
  queryDataByPanigation(page = {}) {
    const { dispatch } = this.props;
    const { form } = this.props;
    form.validateFields({ force: true }, (errs, values) => {
      if (!errs) {
        // 根据页数查询报表信息
        dispatch({
          type: 'completionWarehousingSummaryQueryReport/queryDataList',
          payload: {
            ...values,
            materialCode: values.materialCode && values.materialCode.toString(),
            queryDateFrom:
              values.queryDateFrom == null
                ? ''
                : moment(values.queryDateFrom).format(DEFAULT_DATETIME_FORMAT),
            queryDateTo:
              values.queryDateTo == null
                ? ''
                : moment(values.queryDateTo).format(DEFAULT_DATETIME_FORMAT),
            page,
          },
        });
      }
    });
  }

  // 导出
  @Bind()
  handleGetFormValue() {
    const { dispatch, form } = this.props;
    const fieldsValue = (form && filterNullValueObject(form.getFieldsValue())) || {};
    dispatch({
      type: 'completionWarehousingSummaryQueryReport/exportExcel',
      payload: {
        ...fieldsValue,
        materialCode: fieldsValue.materialCode && fieldsValue.materialCode.toString(),
        queryDateFrom:
          fieldsValue.queryDateFrom == null
            ? ''
            : moment(fieldsValue.queryDateFrom).format(DEFAULT_DATETIME_FORMAT),
        queryDateTo:
          fieldsValue.queryDateTo == null
            ? ''
            : moment(fieldsValue.queryDateTo).format(DEFAULT_DATETIME_FORMAT),
      },
    }).then(res => {
      if(res){
        const file = new Blob(
          [res],
          { type: 'application/vnd.ms-excel' }
        );
        const fileURL = URL.createObjectURL(file);
        const fileName = '完工及入库汇总查询报表.xls';
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = fileURL;
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      }
    });
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
      exportLoading,
      completionWarehousingSummaryQueryReport: {
        headList = [],
        headPagination = {},
        finishSumQty = '',
        warehousingSumQty = '',
        areaIdMap = [],
        materialCategoryMap = [],
        getSite = {},
        siteList = [],
      },
    } = this.props;

    // 获取整个表单
    const { form } = this.props;
    // 获取表单的字段属性
    const { getFieldDecorator, getFieldValue } = form;
    const { materialCode } = this.state;

    //  返回默认界面数据
    return (
      <div>
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('完工及入库汇总查询报表')}>
          <Row style={{ width: '100%' }} type="flex" justify="end">
            <Col span={4}>
              <div className={styles['eq-task-doc-sum-rate']}>
                <Form.Item label="完工汇总" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                  {!finishSumQty ? 0 : finishSumQty}
                </Form.Item>
              </div>
            </Col>
            <Col span={4}>
              <div className={styles['eq-task-doc-sum-rate']}>
                <Form.Item label="入库汇总" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                  {!warehousingSumQty ? 0 : warehousingSumQty}
                </Form.Item>
              </div>
            </Col>
            <Col>
              <Button
                type="primary"
                icon="download"
                htmlType="submit"
                onClick={() => this.handleGetFormValue()}
                loading={exportLoading}
              >
                导出
              </Button>
            </Col>
          </Row>
        </Header>
        <Content>
          <Form className={SEARCH_FORM_CLASSNAME}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.siteId`).d('站点')}
                >
                  {getFieldDecorator('siteId', {
                    initialValue: getSite && getSite.siteId,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${commonModelPrompt}.siteId`).d('站点'),
                        }),
                      },
                    ],
                  })(
                    <Select allowClear onChange={(value) => this.onSelectedSite(value)}>
                      {siteList.map(item => (
                        <Select.Option key={item.siteId} value={item.siteId}>
                          {item.siteName}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.queryDateFrom`).d('查询时间起')}
                >
                  {getFieldDecorator('queryDateFrom', {
                    initialValue: moment(startDate),
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${commonModelPrompt}.queryDateFrom`).d('查询时间起'),
                        }),
                      },
                    ],
                  })(
                    <DatePicker
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                      placeholder=""
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD HH:mm:ss"
                      disabledDate={currentDate =>
                        getFieldValue('queryDateTo') &&
                        moment(getFieldValue('queryDateTo')).isBefore(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.queryDateTo`).d('查询时间至')}
                >
                  {getFieldDecorator('queryDateTo', {
                    initialValue: moment(endDate),
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${commonModelPrompt}.queryDateTo`).d('查询时间至'),
                        }),
                      },
                    ],
                  })(
                    <DatePicker
                      showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                      placeholder=""
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD HH:mm:ss"
                      disabledDate={currentDate =>
                        getFieldValue('queryDateFrom') &&
                        moment(getFieldValue('queryDateFrom')).isAfter(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
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
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.areaId`).d('制造部')}
                >
                  {getFieldDecorator(
                    'areaId',
                    {}
                  )(
                    <Select allowClear>
                      {areaIdMap.map(item => (
                        <Select.Option key={item.departmentId} value={item.departmentId}>
                          {item.departmentName}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.prodLineId`).d('生产线')}
                >
                  {getFieldDecorator('prodLineId', {
                  })(
                    <MultipleLov
                      code="HME.FINAL_PRODLINE"
                      queryParams={{
                        departmentId: getFieldValue('areaId'), // 部门
                        // siteId: getFieldValue('siteId'), // 站点
                        tenantId,
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.materialCode`).d('产品编码')}
                >
                  {getFieldDecorator('materialCode', {
                  })(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'materialCode')}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({ materialCode: [] });
                          }
                        }
                      }
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {materialCode.map(e => (
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
                  label={intl.get(`${commonModelPrompt}.productionVersion`).d('版本号')}
                >
                  {getFieldDecorator('productionVersion', {
                  })(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.warehouseId`).d('库存地点')}
                >
                  {getFieldDecorator('warehouseId', {
                  })(<MultipleLov code="WMS.WAREHOUSE_LOV" queryParams={{ tenantId }} />)}
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
                  label={intl.get(`${commonModelPrompt}.itemGroup`).d('物料组')}
                >
                  {getFieldDecorator('itemGroup')(
                    <MultipleLov code="WMS.ITEM_GROUP" queryParams={{ tenantId }} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.materialCategory`).d('物料分类')}
                >
                  {getFieldDecorator(
                    'materialCategory', {
                    })(
                      <Select allowClear>
                        {materialCategoryMap.map(item => (
                          <Select.Option key={item.value} value={item.value}>
                            {item.meaning}
                          </Select.Option>
                        ))}
                      </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <ModalContainer ref={registerContainer} />
          </Form>
          <TableList
            dataSource={headList}
            pagination={headPagination}
            onSearch={page => this.queryDataByPanigation(page)}
            loading={fetchListLoading}
          />
        </Content>
      </div>
    );
  }
}
