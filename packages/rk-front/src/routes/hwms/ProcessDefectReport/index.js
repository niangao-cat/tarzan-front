/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 工序不良报表
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Form, Button, Col, Row, DatePicker, Table, Input, Select } from 'hzero-ui';
import moment from 'moment';
import { uniq, isArray, isUndefined } from 'lodash';

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
import { isEmpty } from 'lodash/lang';
import MultipleLov from '../../../components/MultipleLov/index';
import ModalContainer, { registerContainer } from '../../../components/Modal/ModalContainer';

const tenantId = getCurrentOrganizationId();
const commonModelPrompt = 'tarzan.hwms.processDefectReport';
const InputGroup = Input.Group;

@connect(({ processDefectReport, loading }) => ({
  processDefectReport,
  fetchListLoading: loading.effects['processDefectReport/queryDataList'],
}))
@Form.create({ fieldNameProp: null })
export default class ProcessDefectReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      materialCode: [],
      workOrderNum: [],
      sn: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'processDefectReport/init',
    });
  }

  @Bind()
  handleSearch(page = {}) {
    const { dispatch, form } = this.props;
    form.validateFields({ force: true }, (err, value) => {
      console.log('value', value);
      if (!err) {
        const fieldsValue = filterNullValueObject(value);
        const {
          // lineId,
          // processId,
          // workcellId,
          // ncCodeId,
          // stationId,
          processMethod,
          ncHandleDateFrom,
          ncHandleDateTo,
          beginTime,
          endTime,
          materialCode,
          workOrderNum,
          sn,
          one,
          two,
          three,
          four,
          ...newFields
        } = fieldsValue;
        const fields = filterNullValueObject({
          ...newFields,
          beginTime: beginTime == null
            ? ''
            : moment(beginTime).format(DEFAULT_DATETIME_FORMAT),
          endTime: endTime == null
            ? ''
            : moment(endTime).format(DEFAULT_DATETIME_FORMAT),
          ncHandleDateFrom: ncHandleDateFrom == null
            ? ''
            : moment(ncHandleDateFrom).format(DEFAULT_DATETIME_FORMAT),
          ncHandleDateTo: ncHandleDateTo == null
            ? ''
            : moment(ncHandleDateTo).format(DEFAULT_DATETIME_FORMAT),
          materialCode: isArray(materialCode) ? materialCode.join(',') : null,
          workOrderNum: isArray(workOrderNum) ? workOrderNum.join(',') : null,
          sn: isArray(sn) ? sn.join(',') : null,
          // prodLineId: isArray(prodLineId) ? prodLineId.join(',') : null,
          // processId: isArray(processId) ? processId.join(',') : null,
          // workcellId: isArray(workcellId) ? workcellId.join(',') : null,
          // stationId: isArray(stationId) ? stationId.join(',') : null,
          processMethod: isArray(processMethod) ? processMethod.join(',') : null,
          // ncCodeId: isArray(ncCodeId) ? ncCodeId.join(',') : null,
          productType: `${isUndefined(one) ? '_' : one}${isUndefined(two) ? '_' : two}${isUndefined(three) ? '_' : three}${isUndefined(four) ? '_' : four}`,
        });
        dispatch({
          type: 'processDefectReport/queryDataList',
          payload: {
            ...fields,
            page,
          },
        });
      }
    });
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

  // 数据导出
  @Bind()
  handleGetFormValue() {
    const { form } = this.props;
    const filterValue = form === undefined ? {} : form.getFieldsValue();
    const {
      processMethod,
      ncHandleDateFrom,
      ncHandleDateTo,
      beginTime,
      endTime,
      materialCode,
      workOrderNum,
      sn,
      one,
      two,
      three,
      four,
      ...newFields
    } = filterValue;
    return filterNullValueObject({
      ...newFields,
      beginTime: beginTime == null
        ? ''
        : moment(beginTime).format(DEFAULT_DATETIME_FORMAT),
      endTime: endTime == null
        ? ''
        : moment(endTime).format(DEFAULT_DATETIME_FORMAT),
      ncHandleDateFrom: ncHandleDateFrom == null
        ? ''
        : moment(ncHandleDateFrom).format(DEFAULT_DATETIME_FORMAT),
      ncHandleDateTo: ncHandleDateTo == null
        ? ''
        : moment(ncHandleDateTo).format(DEFAULT_DATETIME_FORMAT),
      processMethod: isArray(processMethod) ? processMethod.join(',') : null,
      materialCode: isArray(materialCode) ? materialCode.join(',') : null,
      workOrderNum: isArray(workOrderNum) ? workOrderNum.join(',') : null,
      sn: isArray(sn) ? sn.join(',') : null,
      productType: `${isUndefined(one) ? '_' : one}${isUndefined(two) ? '_' : two}${isUndefined(three) ? '_' : three}${isUndefined(four) ? '_' : four}`,
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

  // 输入框更改
  @Bind()
  handelInputGroup(e, type) {
    const { form } = this.props;
    const { setFieldsValue } = form;
    const value = e.target.value[0];
    switch (type) {
      case 'ONE':
        setFieldsValue({ one: value });
        break;
      case 'TWO':
        setFieldsValue({ two: value });
        break;
      case 'THREE':
        setFieldsValue({ three: value });
        break;
      case 'FOUR':
        setFieldsValue({ four: value });
        break;
      default:
        break;
    }
  }


  // 渲染 界面布局
  render() {
    // 获取默认数据
    const {
      fetchListLoading,
      processDefectReport: {
        headList = [],
        headPagination = {},
        detailMap = [],
        qualityStatusList,
        ncIncidentStatusList,
        siteList = [],
      },
    } = this.props;

    const {
      materialCode,
      workOrderNum,
      sn,
    } = this.state;

    // 设置显示数据
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.materialLotNum`).d('序列号'),
        dataIndex: 'materialLotNum',
        align: 'center',
      },
      {
        title: '实验代码',
        dataIndex: 'labCode',
        align: 'center',
      },
      {
        title: '质量状态',
        dataIndex: 'qualityStatusMeaning',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.rootCauseProcessName`).d('提交工序'),
        dataIndex: 'rootCauseProcessName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.station`).d('责任工位'),
        dataIndex: 'station',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.rootCauseWorkcellName`).d('提交工位'),
        dataIndex: 'rootCauseWorkcellName',
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
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.workOrderNum`).d('工单号'),
        dataIndex: 'workOrderNum',
        align: 'center',
      },
      {
        title: '工单版本',
        dataIndex: 'productionVersion',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.incidentNumber`).d('不良单号'),
        dataIndex: 'incidentNumber',
        align: 'center',
      },
      {
        title: '单据状态',
        dataIndex: 'ncIncidentStatusMeaning',
        align: 'center',
      },
      {
        title: '是否冻结',
        dataIndex: 'freezeFlagMeaning',
        width: 100,
      },
      {
        title: '是否转型',
        dataIndex: 'transformFlagMeaning',
        width: 100,
      },
      {
        title: intl.get(`${commonModelPrompt}.descriptionType`).d('不良代码组'),
        dataIndex: 'descriptionType',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.ncCode`).d('不良代码'),
        dataIndex: 'ncCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.ncDescription`).d('不良代码描述'),
        dataIndex: 'ncDescription',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.processMethodName`).d('处理方式'),
        dataIndex: 'processMethodName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.transMaterialCode`).d('转型物料编码'),
        dataIndex: 'transMaterialCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.transMaterialName`).d('转型物料描述'),
        dataIndex: 'transMaterialName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.submitUserName`).d('提交人'),
        dataIndex: 'submitUserName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.comments`).d('提交人备注'),
        dataIndex: 'comments',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.dateTime`).d('提交时间'),
        dataIndex: 'dateTime',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.processUserName`).d('处理人'),
        dataIndex: 'processUserName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.subComments`).d('处理人备注'),
        dataIndex: 'subComments',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.closedDateTime`).d('处理时间'),
        dataIndex: 'closedDateTime',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.workShop`).d('车间'),
        dataIndex: 'workShop',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.prodLineName`).d('生产线'),
        dataIndex: 'prodLineName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.rootCauseLineName`).d('提交工段'),
        dataIndex: 'rootCauseLineName',
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
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('工序不良明细')}>
          <ExcelExport
            exportAsync
            requestUrl={`/mes-report/v1/${getCurrentOrganizationId()}/hme-nc-detail/export`} // 路径
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
                  label={intl.get(`${commonModelPrompt}.beginTime`).d('不良发起时间起')}
                >
                  {getFieldDecorator('beginTime', {
                    rules: [
                      {
                        required: !(getFieldValue('sn') && getFieldValue('sn').length > 0
                          || getFieldValue('workOrderNum') && getFieldValue('workOrderNum').length > 0
                          || getFieldValue('ncHandleDateFrom')
                          || getFieldValue('ncHandleDateTo')
                          || getFieldValue('incidentNum')),
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${commonModelPrompt}.beginTime`).d('不良发起时间起'),
                        }),
                      },
                    ],
                    initialValue: moment(
                      moment()
                      .subtract(1, 'months')
                      .format('YYYY-MM-DD')),
                  })(
                    <DatePicker
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                      placeholder=''
                      style={{ width: '100%' }}
                      format='YYYY-MM-DD HH:mm:ss'
                      disabledDate={currentDate =>
                        getFieldValue('endTime') &&
                        moment(getFieldValue('endTime')).isBefore(currentDate, 'second')
                      }
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.endTime`).d('不良发起时间至')}
                >
                  {getFieldDecorator('endTime', {
                    rules: [
                      {
                        required: !(getFieldValue('sn') && getFieldValue('sn').length > 0
                          || getFieldValue('workOrderNum') && getFieldValue('workOrderNum').length > 0
                          || getFieldValue('ncHandleDateFrom')
                          || getFieldValue('ncHandleDateTo')
                          || getFieldValue('incidentNum')),
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${commonModelPrompt}.endTime`).d('不良发起时间至'),
                        }),
                      },
                    ],
                    initialValue: moment(
                      moment()
                      .format('YYYY-MM-DD')),
                  })(
                    <DatePicker
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                      placeholder=''
                      style={{ width: '100%' }}
                      format='YYYY-MM-DD HH:mm:ss'
                      disabledDate={currentDate =>
                        getFieldValue('beginTime') &&
                        moment(getFieldValue('beginTime')).isAfter(currentDate, 'second')
                      }
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.siteId`).d('站点')}
                >
                  {getFieldDecorator('siteId', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${commonModelPrompt}.siteId`).d('站点'),
                        }),
                      },
                    ],
                    initialValue: !isEmpty(siteList) && siteList[0].siteId,
                  })(
                    <Select
                      style={{ width: '100%' }}
                      allowClear
                    >
                      {siteList.map(item => {
                        return (
                          <Select.Option value={item.siteId} key={item.siteId}>
                            {item.siteName}
                          </Select.Option>
                        );
                      })}
                    </Select>
                    // <Lov code='MT.SITE' queryParams={{ tenantId }} textField='siteName' />,
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
                  <Button onClick={this.resetSearch}>
                    {intl.get(`hzero.common.button.reset`).d('重置')}
                  </Button>
                  <Button type='primary' htmlType='submit' onClick={this.handleSearch}>
                    {intl.get(`hzero.common.button.search`).d('查询')}
                  </Button>
                </Form.Item>
              </Col>
            </Row>

            <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: this.state.expandForm ? '' : 'none' }}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='序列号'
                >
                  {getFieldDecorator('sn')(
                    <Select
                      mode='tags'
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'sn')}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({ sn: [] });
                          }
                        }
                      }
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {sn.map(e => (
                        <Select.Option key={e} value={e}>
                          {e}
                        </Select.Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.workOrderNum`).d('工单号')}
                >
                  {getFieldDecorator('workOrderNum')(
                    <Select
                      mode='tags'
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'workOrderNum')}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({ workOrderNum: [] });
                          }
                        }
                      }
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {workOrderNum.map(e => (
                        <Select.Option key={e} value={e}>
                          {e}
                        </Select.Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.materialCode`).d('产品编码')}
                >
                  {getFieldDecorator('materialCode')(
                    <Select
                      mode='tags'
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
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: this.state.expandForm ? '' : 'none' }}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item label='车间' {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('workshopId', {})(
                    <Lov
                      code="HME.FINAL_WORKSHOP"
                      lovOptions={{ displayField: 'areaName' }}
                      queryParams={{
                        siteId: getFieldValue('siteId'),
                        tenantId,
                      }}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.prodLineId`).d('生产线')}
                >
                  {getFieldDecorator('prodLineId')(
                    <Lov
                      code="HME.FINAL_PRODLINE"
                      lovOptions={{ displayField: 'prodLineName' }}
                      queryParams={{
                        siteId: getFieldValue('siteId'),
                        workshopId: getFieldValue('workshopId'),
                        tenantId,
                      }}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='提交工段'
                >
                  {getFieldDecorator('lineId')(
                    <MultipleLov
                      code="HME.FINAL_LINE"
                      lovOptions={{ displayField: 'workcellName' }}
                      // onChange={() => resetWithFields('workcellCodeList')}
                      allowClear
                      queryParams={{
                        prodLineId: getFieldValue('prodLineId'),
                        tenantId,
                      }}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: this.state.expandForm ? '' : 'none' }}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='提交工序'
                >
                  {getFieldDecorator('processId')(
                    <MultipleLov
                      code="HME.FINAL_PROCESS"
                      lovOptions={{ displayField: 'workcellName' }}
                      // onChange={() => resetWithFields('procedureCodeList')}
                      allowClear
                      queryParams={{
                        prodLineId: getFieldValue('prodLineId'),
                        lineWorkcellId: getFieldValue('lineId'),
                        tenantId,
                      }}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.workcellId`).d('提交工位')}
                >
                  {getFieldDecorator('workcellId')(
                    <MultipleLov
                      code='HME.FINAL_WORKCELL'
                      lovOptions={{ displayField: 'workcellName' }}
                      // onChange={() => resetWithFields('lineWorkcellId')}
                      allowClear
                      queryParams={{
                        prodLineId: getFieldValue('prodLineId'),
                        lineWorkcellId: getFieldValue('lineId'),
                        processId: getFieldValue('processId'),
                        tenantId,
                      }}
                    />,
                    // <Select
                    //   mode='tags'
                    //   style={{ width: '100%' }}
                    //   onBlur={val => this.handleOnSearch(val, 'workcellCodeList')}
                    //   onChange={
                    //     val => {
                    //       if (val.length === 0) {
                    //         this.setState({ workcellCodeList: [] });
                    //       }
                    //     }
                    //   }
                    //   allowClear
                    //   dropdownMatchSelectWidth={false}
                    //   maxTagCount={2}
                    // >
                    //   {workcellCodeList.map(e => (
                    //     <Select.Option key={e} value={e}>
                    //       {e}
                    //     </Select.Option>
                    //   ))}
                    // </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.stationId`).d('责任工位')}
                >
                  {getFieldDecorator('stationId')(
                    <MultipleLov
                      code='HME.FINAL_WORKCELL'
                      lovOptions={{ displayField: 'workcellName' }}
                      allowClear
                      queryParams={{ tenantId }}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: this.state.expandForm ? '' : 'none' }}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='不良代码组'
                >
                  {getFieldDecorator('ncGroupId')(
                    <Lov
                      code='MT.NC_GROUP'
                      queryParams={{ tenantId }}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='不良代码'
                >
                  {getFieldDecorator('ncCodeId')(
                    <MultipleLov
                      code='MT.NC_CODE'
                      // onChange={() => resetWithFields('lineWorkcellId')}
                      queryParams={{
                        ncGroupId: getFieldValue('ncGroupId'),
                        tenantId,
                      }}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item label='质量状态' {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('qualityStatus')(
                    <Select allowClear>
                      {qualityStatusList.map(e => (
                        <Select.Option key={e.value} value={e.value}>
                          {e.meaning}
                        </Select.Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: this.state.expandForm ? '' : 'none' }}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.incidentNum`).d('不良单号')}
                >
                  {getFieldDecorator('incidentNum', {})(
                    <Input />,
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item label='单据状态' {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('docStatus')(
                    <Select allowClear mode='multiple'>
                      {ncIncidentStatusList.map(e => (
                        <Select.Option key={e.value} value={e.value}>
                          {e.meaning}
                        </Select.Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.processMethod`).d('处理方式')}
                >
                  {getFieldDecorator('processMethod', {})(
                    <Select mode="multiple" allowClear>
                      {detailMap.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.meaning}
                        </Select.Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: this.state.expandForm ? '' : 'none' }}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item label='提交人' {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('submitUserId')(
                    <Lov
                      code='HIAM.USER.ORG'
                      queryParams={{
                        tenantId: getCurrentOrganizationId(),
                      }}
                    />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item label='处理人' {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('processUserId')(
                    <Lov
                      code='HIAM.USER.ORG'
                      queryParams={{
                        tenantId: getCurrentOrganizationId(),
                      }}
                    />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='产品类型'
                >
                  {getFieldDecorator('productType', {})(
                    <InputGroup compact>
                      <Input
                        style={{ width: '25%' }}
                        onChange={e => this.handelInputGroup(e, 'ONE')}
                      />
                      <Input style={{ width: '25%' }} onChange={e => this.handelInputGroup(e, 'TWO')} />
                      <Input style={{ width: '25%' }} onChange={e => this.handelInputGroup(e, 'THREE')} />
                      <Input style={{ width: '25%' }} onChange={e => this.handelInputGroup(e, 'FOUR')} />
                    </InputGroup>,
                  )}
                </Form.Item>
                <Form.Item style={{ display: 'none' }}>
                  {getFieldDecorator('one', {})(
                    <Input />,
                  )}
                </Form.Item>
                <Form.Item style={{ display: 'none' }}>
                  {getFieldDecorator('two', {})(
                    <Input />,
                  )}
                </Form.Item>
                <Form.Item style={{ display: 'none' }}>
                  {getFieldDecorator('three', {})(
                    <Input />,
                  )}
                </Form.Item>
                <Form.Item style={{ display: 'none' }}>
                  {getFieldDecorator('four', {})(
                    <Input />,
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: this.state.expandForm ? '' : 'none' }}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.labCode`).d('实验代码')}
                >
                  {getFieldDecorator('labCode', {})(
                    <Input />,
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item label='是否冻结' {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('freezeFlag')(
                    <Select allowClear>
                      <Select.Option key='Y' value='Y'>
                        是
                      </Select.Option>
                      <Select.Option key='N' value='N'>
                        否
                      </Select.Option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: this.state.expandForm ? '' : 'none' }}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.ncHandleDateFrom`).d('不良处理时间从')}
                >
                  {getFieldDecorator('ncHandleDateFrom', {
                    // rules: [
                    //   {
                    //     required: !(getFieldValue('sn') && getFieldValue('sn').length > 0
                    //       || getFieldValue('workOrderNum') && getFieldValue('workOrderNum').length > 0
                    //       || getFieldValue('incidentNum')),
                    //     message: intl.get('hzero.common.validation.notNull', {
                    //       name: intl.get(`${commonModelPrompt}.ncHandleDateFrom`).d('不良发起时间起'),
                    //     }),
                    //   },
                    // ],
                    // initialValue: moment(
                    //   moment()
                    //     .subtract(1, 'months')
                    //     .format('YYYY-MM-DD')),
                  })(
                    <DatePicker
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                      placeholder=''
                      style={{ width: '100%' }}
                      format='YYYY-MM-DD HH:mm:ss'
                      disabledDate={currentDate =>
                        getFieldValue('ncHandleDateTo') &&
                        moment(getFieldValue('ncHandleDateTo')).isBefore(currentDate, 'second')
                      }
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.ncHandleDateTo`).d('不良处理时间至')}
                >
                  {getFieldDecorator('ncHandleDateTo', {
                    // rules: [
                    //   {
                    //     required: !(getFieldValue('sn') && getFieldValue('sn').length > 0
                    //       || getFieldValue('workOrderNum') && getFieldValue('workOrderNum').length > 0
                    //       || getFieldValue('incidentNum')),
                    //     message: intl.get('hzero.common.validation.notNull', {
                    //       name: intl.get(`${commonModelPrompt}.ncHandleDateTo`).d('不良发起时间至'),
                    //     }),
                    //   },
                    // ],
                    // initialValue: moment(
                    //   moment()
                    //     .format('YYYY-MM-DD')),
                  })(
                    <DatePicker
                      showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                      placeholder=''
                      style={{ width: '100%' }}
                      format='YYYY-MM-DD HH:mm:ss'
                      disabledDate={currentDate =>
                        getFieldValue('ncHandleDateFrom') &&
                        moment(getFieldValue('ncHandleDateFrom')).isAfter(currentDate, 'second')
                      }
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <ModalContainer ref={registerContainer} />
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
