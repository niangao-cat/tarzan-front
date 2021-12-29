/**
 * @Author:wxy
 * @email: xinyu.wang02@hand-china.com
 * @description： 计划达成率报表
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Form, Button, Col, Row, Table, DatePicker, Input } from 'hzero-ui';
import moment from 'moment';
import { isUndefined, isEmpty } from 'lodash';

import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
import { getCurrentOrganizationId, tableScrollWidth, filterNullValueObject } from 'utils/utils';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';
import styles from './index.less';
import ExpandDrawer from './ExpandDrawer';
import AeliveryFinishDrawer from './AeliveryFinishDrawer';

const tenantId = getCurrentOrganizationId();
const commonModelPrompt = 'tarzan.hwms.planAchievementRateReport';
@connect(({ planAchievementRateReport, loading }) => ({
  planAchievementRateReport,
  tenantId: getCurrentOrganizationId(),
  fetchListLoading: loading.effects['planAchievementRateReport/queryDataList'],
  fetchAeliveryLoading: loading.effects['planAchievementRateReport/fetchAelivery'],
  fetchFinishLoading: loading.effects['planAchievementRateReport/fetchFinish'],
  handleExportLoading: loading.effects['planAchievementRateReport/handleExport'],
}))
@Form.create({ fieldNameProp: null })
export default class PlanAchievementRateReport extends Component {
  state = {
    expandForm: false,
    modalType: '',
    record: {},
    prodLine: '',
    recordWkid: '', // 选中的workcellId
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'planAchievementRateReport/updateState',
      payload: {
        headList: [],
        headPagination: {},
        colData: [],
        expandDrawer: false, // 弹出创建层
        sumData: "",
        searchForDetail: {}, // 查询明细的数据
      },
    });
    dispatch({
      type: 'planAchievementRateReport/getSiteList',
      payload: {
        tenantId,
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
        dispatch({
          type: 'planAchievementRateReport/queryDataList',
          payload: {
            ...values,
            dateTimeFrom: isUndefined(values.dateTimeFrom)
              ? null
              : moment(values.dateTimeFrom).format("YYYY-MM-DD"),
            dateTimeTo: isUndefined(values.dateTimeTo)
              ? null
              : moment(values.dateTimeTo).format("YYYY-MM-DD"),
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
          type: 'planAchievementRateReport/queryDataList',
          payload: {
            ...values,
            dateTimeFrom: isUndefined(values.dateTimeFrom)
              ? null
              : moment(values.dateTimeFrom).format(DEFAULT_DATETIME_FORMAT),
            dateTimeTo: isUndefined(values.dateTimeTo)
              ? null
              : moment(values.dateTimeTo).format(DEFAULT_DATETIME_FORMAT),
            page,
          },
        });
      }
    });
  }

  @Bind
  onDetail(workcellId, flag, materialId) {
    this.setState({ searchForDetail: { workcellId, flag, materialId }, expandDrawer: !this.state.expandDrawer });
    const { dispatch } = this.props;
    // 根据页数查询报表明细信息
    dispatch({
      type: 'planAchievementRateReport/fetchDetailList',
      payload: {
        workcellId, flag, materialId,
      },
    });
  }

  @Bind
  onSearch(page = {}) {
    const { dispatch } = this.props;
    // 根据页数查询报表明细信息
    dispatch({
      type: 'planAchievementRateReport/fetchDetailList',
      payload: {
        ...this.state.searchForDetail,
        page,
      },
    });
  }

  @Bind
  expandColseData() {
    this.setState({ expandDrawer: !this.state.expandDrawer });
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

  // 打开实际投产/完工的抽屉
  @Bind()
  handleAeliveryFinish(type, flag, val, prodLine, workcellId) {
    const { dispatch } = this.props;
    this.setState({ aeliveryFinishVisible: flag, modalType: type, record: val, prodLine, recordWkid: workcellId }, () => {
      if (type === 'AELIVERY' && flag) {
        this.fetchAelivery();
      }
      if (type === 'FINISH' && flag) {
        this.fetchFinish();
      }
    });
    if (!flag) {
      dispatch({
        type: 'planAchievementRateReport/updateState',
        payload: {
          aeliveryFinishList: [],
          aeliveryFinishListPagination: {},
        },
      });
    }
  }

  // 查询投产
  @Bind
  fetchAelivery(fields = {}) {
    const { dispatch, planAchievementRateReport: { defaultSite = {} } } = this.props;
    const { record, recordWkid } = this.state;
    const workcells = record.workcells.filter(ele => `${moment(ele.shiftDate).format('YYYYMMDD')}${ele.recordWkid}` === `${moment(record.dataTime).format('YYYYMMDD')}${record.recordWkid}`)[0];
    dispatch({
      type: 'planAchievementRateReport/fetchAelivery',
      payload: {
        shiftDate: workcells.shiftDate,
        shiftCode: workcells.originalShiftCode,
        workcellId: recordWkid,
        siteId: defaultSite.siteId,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  // 查询完工
  @Bind
  fetchFinish(fields = {}) {
    const { dispatch, planAchievementRateReport: { defaultSite = {} } } = this.props;
    const { record, recordWkid } = this.state;
    const workcells = record.workcells.filter(ele => `${moment(ele.shiftDate).format('YYYYMMDD')}${ele.recordWkid}` === `${moment(record.dataTime).format('YYYYMMDD')}${record.recordWkid}`)[0];
    dispatch({
      type: 'planAchievementRateReport/fetchFinish',
      payload: {
        shiftDate: workcells.shiftDate,
        shiftCode: workcells.originalShiftCode,
        workcellId: recordWkid,
        siteId: defaultSite.siteId,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  @Bind()
  handleGetFormValue() {
    const { form: { getFieldsValue } } = this.props;
    const values = getFieldsValue();
    return filterNullValueObject({
      ...values,
      dateTimeFrom: isUndefined(values.dateTimeFrom)
        ? null
        : moment(values.dateTimeFrom).format("YYYY-MM-DD"),
      dateTimeTo: isUndefined(values.dateTimeTo)
        ? null
        : moment(values.dateTimeTo).format("YYYY-MM-DD"),
    });
  }

  @Bind()
  handleExport() {
    const { dispatch } = this.props;
    const fieldsValue = this.handleGetFormValue();
    dispatch({
      type: 'planAchievementRateReport/handleExport',
      payload: fieldsValue,
    }).then(res => {
      if (res) {
        const file = new Blob([res], { type: 'application/vnd.ms-excel' });
        const fileURL = URL.createObjectURL(file);
        const fileName = '计划达成率报表.xls';
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

  // 渲染 界面布局
  render() {
    // 获取默认数据
    const {
      fetchListLoading,
      handleExportLoading,
      planAchievementRateReport: {
        headList = [],
        colData = [],
        detailList = [],
        detailPagination = {},
        aeliveryFinishList = [],
        aeliveryFinishListPagination = {},
      },
      fetchAeliveryLoading,
      fetchFinishLoading,
    } = this.props;
    const { aeliveryFinishVisible, modalType, record, prodLine } = this.state;
    // 设置显示数据
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.prodLineName`).d('日期'),
        dataIndex: 'dataTime',
        align: 'center',
        width: 80,
        fixed: 'left',
        // eslint-disable-next-line no-shadow
        render: (val, record, index) => {
          const productionList = headList.map(e => e.dataTime);
          const first = productionList.indexOf(record.dataTime);
          const all = headList.filter(e => e.dataTime === record.dataTime).length;
          const obj = {
            children: val,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('班次'),
        dataIndex: 'shiftCode',
        align: 'center',
        width: 80,
        fixed: 'left',
      },
      ...colData.map((v, index) => {
        return {
          title: `${v.description}`,
          width: 830,
          children: [
            {
              title: '计划投产',
              dataIndex: `${v.description}`,
              className: index % 2 === 0 ? styles['data-one'] : styles['data-two'],
              width: 85,
              align: 'center',
              render: (val) => {
                if (val !== undefined) {
                  const data = val.split('-');
                  return (data[0]);
                } else {
                  return val;
                }
              },
            },
            {
              title: '实际投产',
              dataIndex: `${v.description}`,
              className: index % 2 === 0 ? styles['data-one'] : styles['data-two'],
              width: 85,
              align: 'center',
              render: (val, records) => {
                if (val !== undefined) {
                  const data = val.split('-');
                  return (<a disabled={data[1] <= 0} onClick={() => this.handleAeliveryFinish('AELIVERY', true, records, v.description, v.workcellId)}>{data[1]}</a>);
                } else {
                  return <a disabled={val <= 0} onClick={() => this.handleAeliveryFinish('AELIVERY', true, records, v.description, v.workcellId)}>{val}</a>;
                }
              },
            },
            {
              title: '实际投产比例',
              dataIndex: `${v.description}`,
              className: index % 2 === 0 ? styles['data-one'] : styles['data-two'],
              width: 110,
              align: 'center',
              render: (val) => {
                if (val !== undefined) {
                  const data = val.split('-');
                  return (data[2]);
                } else {
                  return val;
                }
              },
            },
            {
              title: '计划交付',
              dataIndex: `${v.description}`,
              className: index % 2 === 0 ? styles['data-one'] : styles['data-two'],
              width: 85,
              align: 'center',
              render: (val) => {
                if (val !== undefined) {
                  const data = val.split('-');
                  return (data[3]);
                } else {
                  return val;
                }
              },
            },
            {
              title: '实际交付',
              dataIndex: `${v.description}`,
              className: index % 2 === 0 ? styles['data-one'] : styles['data-two'],
              width: 85,
              align: 'center',
              render: (val, records) => {
                if (val !== undefined) {
                  const data = val.split('-');
                  return (<a disabled={data[4] <= 0} onClick={() => this.handleAeliveryFinish('FINISH', true, records, v.description, v.workcellId)}>{data[4]}</a>);
                } else {
                  return <a disabled={val <= 0} onClick={() => this.handleAeliveryFinish('FINISH', true, records, v.description, v.workcellId)}>{val}</a>;
                }
              },
            },
            {
              title: '实际交付比例',
              dataIndex: `${v.description}`,
              className: index % 2 === 0 ? styles['data-one'] : styles['data-two'],
              width: 110,
              align: 'center',
              render: (val) => {
                if (val !== undefined) {
                  const data = val.split('-');
                  return (data[5]);
                } else {
                  return val;
                }
              },
            },
            {
              title: '在制数量',
              dataIndex: `${v.description}`,
              className: index % 2 === 0 ? styles['data-one'] : styles['data-two'],
              width: 85,
              align: 'center',
              render: (val) => {
                if (val !== undefined) {
                  const data = val.split('-');
                  return (data[6]);
                } else {
                  return val;
                }
              },
            },
            {
              title: '在制标准',
              dataIndex: `${v.description}`,
              className: index % 2 === 0 ? styles['data-one'] : styles['data-two'],
              width: 85,
              align: 'center',
              render: (val) => {
                if (val !== undefined) {
                  const data = val.split('-');
                  return (data[7]);
                } else {
                  return val;
                }
              },
            },
            {
              title: '在制百分比',
              dataIndex: `${v.description}`,
              className: index % 2 === 0 ? styles['data-one'] : styles['data-two'],
              width: 100,
              align: 'center',
              render: (val) => {
                if (val !== undefined) {
                  const data = val.split('-');
                  return (data[8]);
                } else {
                  return val;
                }
              },
            },
          ],
        };
      }),
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
    const aeliveryFinishProps = {
      loading: fetchAeliveryLoading || fetchFinishLoading,
      expandDrawer: aeliveryFinishVisible,
      dataSource: aeliveryFinishList,
      pagination: aeliveryFinishListPagination,
      type: modalType,
      record,
      prodLine,
      onCancel: this.handleAeliveryFinish,
      fetchAelivery: this.fetchAelivery,
      fetchFinish: this.fetchFinish,
    };
    //  返回默认界面数据
    return (
      <React.Fragment>
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('计划达成率报表')}>
          <Button
            type="primary"
            icon="export"
            onClick={() => this.handleExport()}
            loading={handleExportLoading}
          >
            导出
          </Button>
        </Header>
        <Content>
          <Form className={SEARCH_FORM_CLASSNAME}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.prodLineId`).d('生产线')}
                >
                  {getFieldDecorator('prodLineId', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${commonModelPrompt}.prodLineId`).d('产线'),
                        }),
                      },
                    ],
                  })(
                    <Lov code="MT.PRODLINE" queryParams={{ tenantId }} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='开始时间从'
                >
                  {getFieldDecorator('dateTimeFrom', {
                    rules: [
                      {
                        required: !getFieldValue('materialLotCode'),
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '开始时间从',
                        }),
                      },
                    ],
                  })(
                    <DatePicker
                      // showTime
                      placeholder=""
                      style={{ width: '100%' }}
                      // format={getDateTimeFormat()}
                      format="YYYY-MM-DD"
                      disabledDate={currentDate =>
                        getFieldValue('dateTimeTo') &&
                        (currentDate <= moment(getFieldValue('dateTimeTo')).subtract(31, 'day') || currentDate >= moment(getFieldValue('dateTimeTo')))
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='结束时间至'
                >
                  {getFieldDecorator('dateTimeTo', {
                    rules: [
                      {
                        required: !getFieldValue('materialLotCode'),
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '结束时间至',
                        }),
                      },
                    ],
                  })(
                    <DatePicker
                      // showTime
                      placeholder=""
                      style={{ width: '100%' }}
                      // format={getDateTimeFormat()}
                      format="YYYY-MM-DD"
                      disabledDate={currentDate =>
                        getFieldValue('dateTimeFrom') &&
                        (currentDate >= moment(getFieldValue('dateTimeFrom')).add(31, 'day') || currentDate <= moment(getFieldValue('dateTimeFrom')))
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
                  label={intl.get(`${commonModelPrompt}.lineId`).d('工段')}
                >
                  {getFieldDecorator('lineId')(
                    <Lov
                      code="HME.WORKCELL"
                      allowClear
                      queryParams={{
                        prodLineId: getFieldValue('prodLineId'),
                        tenantId,
                        typeFlag: 'LINE',
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.shiftCode`).d('班次')}
                >
                  {getFieldDecorator('shiftCode', {})(
                    <Input />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div className="tableClass">
            <Table
              bordered
              dataSource={headList}
              columns={columns}
              // pagination={headPagination}
              pagination={false}
              onChange={page => this.queryDataByPanigation(page)}
              loading={fetchListLoading}
              bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
              scroll={{ x: tableScrollWidth(columns, 20), y: 630 }}
            />
            <ModalContainer ref={registerContainer} />
          </div>
          {aeliveryFinishVisible && <AeliveryFinishDrawer {...aeliveryFinishProps} />}
        </Content>
        {this.state.expandDrawer && <ExpandDrawer {...expandDataProps} />}
      </React.Fragment>
    );
  }
}
