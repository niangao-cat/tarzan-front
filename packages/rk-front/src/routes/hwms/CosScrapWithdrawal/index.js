/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 表增量报表
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Form, Button, Col, Row, Input, Table, DatePicker, Modal } from 'hzero-ui';
import Lov from 'components/Lov';
import notification from 'utils/notification';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import { getCurrentOrganizationId, getDateTimeFormat } from 'utils/utils';
import moment from 'moment';
import DoForm from './DoForm';


const tenantId = getCurrentOrganizationId();

const commonModelPrompt = 'tarzan.hwms.cosScrapWithdrawal';
@connect(({ cosScrapWithdrawal, loading }) => ({
  cosScrapWithdrawal,
  fetchListLoading: loading.effects['cosScrapWithdrawal/queryDataList'],
  saveLoading: loading.effects['cosScrapWithdrawal/saveData']||loading.effects['cosScrapWithdrawal/checkData'],
}))
@Form.create({ fieldNameProp: null })
export default class cosScrapWithdrawal extends Component {

  state={
    selectedRowsKeys: [],
    selectedRowsData: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cosScrapWithdrawal/queryDataList',
    });
  }

  @Bind
  queryData() {
    const { dispatch } = this.props;

    const { form } = this.props;
    this.setState({selectedRowsKeys: [], selectedRowsData: []});
    form.validateFields((errs, values) => {
      if (!errs) {
        // 根据页数查询报表信息
        dispatch({
          type: 'cosScrapWithdrawal/queryDataList',
          payload: {
            ...values,
            startScrapTime: (values.startScrapTime === null||values.startScrapTime === undefined||values.startScrapTime === "")? null: moment(values.startScrapTime).format(DEFAULT_DATETIME_FORMAT),
            endScrapTime: (values.endScrapTime === null||values.endScrapTime === undefined||values.endScrapTime === "")? null: moment(values.endScrapTime).format(DEFAULT_DATETIME_FORMAT),
          },
        });
          }
    });

  }

  // 数据更改
  @Bind()
  onChangeLoadPosition(inpput, index){
      const {
        dispatch,
        cosScrapWithdrawal: { headList=[] },
      } = this.props;

      headList[index].loadPosition = inpput.target.value;
      dispatch({
        type: 'cosScrapWithdrawal/updateState',
        payload: {
          headList,
        },
      });
  }

  @Bind
  queryDataByPanigation(page = {}) {
    const { dispatch } = this.props;

    const { form } = this.props;
    this.setState({selectedRowsKeys: [], selectedRowsData: []});
    form.validateFields((errs, values) => {
      if (!errs) {
        // 根据页数查询报表信息
        dispatch({
          type: 'cosScrapWithdrawal/queryDataList',
          payload: {
            ...values,
            startScrapTime: (values.startScrapTime === null||values.startScrapTime === undefined||values.startScrapTime === "")? null: moment(values.startScrapTime).format(DEFAULT_DATETIME_FORMAT),
            endScrapTime: (values.endScrapTime === null||values.endScrapTime === undefined||values.endScrapTime === "")? null: moment(values.endScrapTime).format(DEFAULT_DATETIME_FORMAT),
            page,
          },
        });
          }
    });
  }

  // 更改选中状态
@Bind
onChangeSelected(selectedRowsKeys, selectedRowsData ){
  this.setState({
    selectedRowsKeys,
    selectedRowsData,
  });
}

  /**
   *
   * @param {装入盒子} loadBarcode
   */
  @Bind
  doInBox(loadBarcode){
    const { dispatch } = this.props;

    if(this.state.selectedRowsData.length===0){
      return notification.error({message: '请先选中行信息'});
    }
    const payload = {
      loadBarcode,
      reloadScrapList: this.state.selectedRowsData,
    };
    dispatch({
      type: 'cosScrapWithdrawal/checkData',
      payload,
    }).then(res=>{
      if(res){
        if(res.flag === "0"){
          Modal.confirm({
            title: intl.get(`tarzan.badCode.defectGroup.title.remind`).d('提醒'),
            content: intl.get(`tarzan.badCode.defectGroup.message.confirm.delete`).d('勾选芯片COS的WAFER与装入盒子不一致，是否确认装入？'),
            onOk: () => {
              dispatch({
                type: 'cosScrapWithdrawal/saveData',
                payload,
              }).then(resSave=>{
                if(resSave){
                  const { form } = this.props;
                  this.setState({selectedRowsKeys: [], selectedRowsData: []});
                  form.validateFields((errs, values) => {
                    if (!errs) {
                      // 根据页数查询报表信息
                      dispatch({
                        type: 'cosScrapWithdrawal/queryDataList',
                        payload: {
                          ...values,
                          startScrapTime: (values.startScrapTime === null||values.startScrapTime === undefined||values.startScrapTime === "")? null: moment(values.startScrapTime).format(DEFAULT_DATETIME_FORMAT),
                          endScrapTime: (values.endScrapTime === null||values.endScrapTime === undefined||values.endScrapTime === "")? null: moment(values.endScrapTime).format(DEFAULT_DATETIME_FORMAT),
                        },
                      });
                        }
                  });
                }
              });
            },
          });
        }else{
          dispatch({
            type: 'cosScrapWithdrawal/saveData',
            payload,
          }).then(resSave=>{
            if(resSave){
              this.setState({selectedRowsKeys: [], selectedRowsData: []});
              const { form } = this.props;
              form.validateFields((errs, values) => {
                if (!errs) {
                  // 根据页数查询报表信息
                  dispatch({
                    type: 'cosScrapWithdrawal/queryDataList',
                    payload: {
                      ...values,
                      startScrapTime: (values.startScrapTime === null||values.startScrapTime === undefined||values.startScrapTime === "")? null: moment(values.startScrapTime).format(DEFAULT_DATETIME_FORMAT),
                      endScrapTime: (values.endScrapTime === null||values.endScrapTime === undefined||values.endScrapTime === "")? null: moment(values.endScrapTime).format(DEFAULT_DATETIME_FORMAT),
                    },
                  });
                    }
              });
            }
          });
        }
      }
    });
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
      saveLoading,
      cosScrapWithdrawal: { headList=[], headPagination = {} },
    } = this.props;

    // 设计选中事件
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowsKeys,
      onChange: this.onChangeSelected,
    };

    // 设置显示数据
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.workOrderNum`).d('工单'),
        dataIndex: 'workOrderNum',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialLotCode`).d('报废来源条码'),
        dataIndex: 'materialLotCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.scrapPosition`).d('报废位置'),
        dataIndex: 'scrapPosition',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.hotSinkCode`).d('热沉编码'),
        dataIndex: 'hotSinkCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.defectCount `).d('报废数量'),
        dataIndex: 'defectCount ',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.ncCode`).d('不良代码'),
        dataIndex: 'ncCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.ncCodeDesc`).d('不良代码描述'),
        dataIndex: 'ncCodeDesc',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.workcellCode`).d('工位'),
        dataIndex: 'workcellCode',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.loadPosition`).d('装入位置'),
        dataIndex: 'loadPosition',
        align: 'left',
        render: (val, record, index) => {
          return (<Input value={record.loadPosition} onChange={value => this.onChangeLoadPosition(value, index)} />);
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.creationDate`).d('报废时间'),
        dataIndex: 'creationDate',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.cosTypeMeaning`).d('COS类型'),
        dataIndex: 'cosTypeMeaning0',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.waferNum`).d('WAFER'),
        dataIndex: 'waferNum',
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
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('COS报废撤回')} />
        <Content>
          <Form className={SEARCH_FORM_CLASSNAME}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.workOrderNum`).d('工单')}
                >
                  {getFieldDecorator('workOrderNum', {})(
                    <Input />
              )}
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.materialLotCode`).d('条码')}
                >
                  {getFieldDecorator('materialLotCode', {})(
                    <Input />
              )}
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.hotSinkCode`).d('热沉')}
                >
                  {getFieldDecorator('hotSinkCode', {})(
                    <Input />
              )}
                </Form.Item>
              </Col>
              <Col span="6" className={SEARCH_COL_CLASSNAME}>
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
                  label={intl.get(`${commonModelPrompt}.ncCodeId`).d('不良代码')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('ncCodeId', {})(
                    <Lov code="MT.NC_CODE" queryParams={{ tenantId }} textField="ncCode" />
              )}
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.workcellId`).d('工位')}
                >
                  {getFieldDecorator('workcellId', {})(
                    <Lov code="MT.WORK_STATION" queryParams={{ tenantId }} />
              )}
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.startScrapTime`).d('创建时间从')}
                >
                  {getFieldDecorator('startScrapTime', {})(
                    <DatePicker
                      showTime
                      placeholder=""
                      style={{ width: '100%' }}
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                    getFieldValue('endScrapTime') &&
                    moment(getFieldValue('endScrapTime')).isBefore(currentDate, 'second')
                  }
                    />
              )}
                </Form.Item>
              </Col>
              <Col span="6" className={SEARCH_COL_CLASSNAME}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.endScrapTime`).d('创建时间至')}
                >
                  {getFieldDecorator('endScrapTime', {})(
                    <DatePicker
                      showTime
                      placeholder=""
                      style={{ width: '100%' }}
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                    getFieldValue('startScrapTime') &&
                    moment(getFieldValue('startScrapTime')).isAfter(currentDate, 'second')
                  }
                    />
              )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <DoForm doInBox={this.doInBox} saveLoading={saveLoading} />
          <Table
            bordered
            rowKey='cosScrapId '
            dataSource={headList}
            columns={columns}
            pagination={headPagination}
            rowSelection={rowSelection}
            onChange={page => this.queryDataByPanigation(page)}
            loading={fetchListLoading}
          />
        </Content>
      </div>
    );
  }
}
