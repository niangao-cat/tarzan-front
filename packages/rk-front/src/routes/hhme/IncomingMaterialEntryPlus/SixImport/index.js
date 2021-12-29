/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 表增量报表
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Form, Button, Col, Row, Input, Table, DatePicker, Select, notification } from 'hzero-ui';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import moment from 'moment';
import { openTab } from 'utils/menuTab';
import queryString from 'querystring';

const commonModelPrompt = 'tarzan.hwms.incomingMaterialEntryPlus';

@connect(({ incomingMaterialEntryPlus, loading }) => ({
  incomingMaterialEntryPlus,
  fetchHeadListLoading: loading.effects['incomingMaterialEntryPlus/queryHeadDataList'],
  fetchLineListLoading: loading.effects['incomingMaterialEntryPlus/queryLineDataList'],
  headPrintLoading: loading.effects['incomingMaterialEntryPlus/headPrint'],
}))
@Form.create({ fieldNameProp: null })
export default class incomingMaterialEntryPlus extends Component {
  state = {
    selectedRowKeys: [], // 选中
    selectedRowData: [], // 选中
    record: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'incomingMaterialEntryPlus/queryHeadDataList',
    });
  }

  /**
   * 条件查询
   */
  @Bind
  queryData() {
    const { dispatch } = this.props;

    // 重置数据
    this.setState({selectedRowKeys: [], selectedRowData: []});
    const { form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        // 根据页数查询报表信息
        dispatch({
          type: 'incomingMaterialEntryPlus/queryHeadDataList',
          payload: {
            ...values,
            creationDateFrom:
              values.creationDateFrom === null ||
              values.creationDateFrom === undefined ||
              values.creationDateFrom === ''
                ? null
                : moment(values.creationDateFrom).format(DEFAULT_DATETIME_FORMAT),
            creationDateTo:
              values.creationDateTo === null ||
              values.creationDateTo === undefined ||
              values.creationDateTo === ''
                ? null
                : moment(values.creationDateTo).format(DEFAULT_DATETIME_FORMAT),
          },
        });
      }
    });
  }

  /**
   * 分页查询
   * @param {分页} page
   */
  @Bind
  queryDataByPanigation(page = {}) {
    const { dispatch } = this.props;

    const { form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        // 根据页数查询报表信息
        dispatch({
          type: 'incomingMaterialEntryPlus/queryHeadDataList',
          payload: {
            ...values,
            creationDateFrom:
              values.creationDateFrom === null ||
              values.creationDateFrom === undefined ||
              values.creationDateFrom === ''
                ? null
                : moment(values.creationDateFrom).format(DEFAULT_DATETIME_FORMAT),
            creationDateTo:
              values.creationDateTo === null ||
              values.creationDateTo === undefined ||
              values.creationDateTo === ''
                ? null
                : moment(values.creationDateTo).format(DEFAULT_DATETIME_FORMAT),
            page,
          },
        });
      }
    });
  }

  /**
   * 查询行信息
   * @param {条件} record
   */
  @Bind()
  queryLineData(record){
    const { dispatch } = this.props;
    const { form } = this.props;
    this.setState({record});
    form.validateFields((errs, values) => {
      if (!errs) {
        // 根据页数查询报表信息
        dispatch({
          type: 'incomingMaterialEntryPlus/queryLineDataList',
          payload: {
            ...values,
            ...record,
            creationDateFrom:
              values.creationDateFrom === null ||
              values.creationDateFrom === undefined ||
              values.creationDateFrom === ''
                ? null
                : moment(values.creationDateFrom).format(DEFAULT_DATETIME_FORMAT),
            creationDateTo:
              values.creationDateTo === null ||
              values.creationDateTo === undefined ||
              values.creationDateTo === ''
                ? null
                : moment(values.creationDateTo).format(DEFAULT_DATETIME_FORMAT),
          },
        });
      }
    });
  }

  /**
   * 查询行信息
   * @param {条件} record
   */
  @Bind()
  queryLineDataByPanigation(page){
    const { dispatch } = this.props;
    const { form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        // 根据页数查询报表信息
        dispatch({
          type: 'incomingMaterialEntryPlus/queryLineDataList',
          payload: {
            ...values,
            ...this.state.record,
            creationDateFrom:
              values.creationDateFrom === null ||
              values.creationDateFrom === undefined ||
              values.creationDateFrom === ''
                ? null
                : moment(values.creationDateFrom).format(DEFAULT_DATETIME_FORMAT),
            creationDateTo:
              values.creationDateTo === null ||
              values.creationDateTo === undefined ||
              values.creationDateTo === ''
                ? null
                : moment(values.creationDateTo).format(DEFAULT_DATETIME_FORMAT),
            page,
          },
        });
      }
    });
  }

  // 选中行事件
  @Bind
  onChange(selectedRowKeys, selectedRowData) {
    this.setState({
      selectedRowKeys,
      selectedRowData,
    });
  }

  // 重置查询
  @Bind
  resetSearch = () => {
    const { form } = this.props;
    form.resetFields();
  };


  // 头打印
  @Bind()
  headPrint() {
    const {
      dispatch,
    } = this.props;
    const { form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        dispatch({
          type: 'incomingMaterialEntryPlus/headPrint',
          payload: this.state.selectedRowData.map(e => {
            return {
              materialLotCode: e.targetBarcode,
              materialLotId: e.targetBarcodeId,
              materialCode: e.materialCode,
              materialName: e.materialName,
              primaryUomQty: e.primaryUomQty,
              productDate:
                e.productDate === null ||
                e.productDate === undefined ||
                e.productDate === ''
                  ? null
                  : moment(e.productDate).format(DEFAULT_DATETIME_FORMAT),
            };
          }),
          // payload: {
          //   headDataList: this.state.selectedRowData,
          //   ...values,
          //   creationDateFrom:
          //   values.creationDateFrom === null ||
          //   values.creationDateFrom === undefined ||
          //   values.creationDateFrom === ''
          //     ? null
          //     : moment(values.creationDateFrom).format(DEFAULT_DATETIME_FORMAT),
          //   creationDateTo:
          //     values.creationDateTo === null ||
          //     values.creationDateTo === undefined ||
          //     values.creationDateTo === ''
          //       ? null
          //       : moment(values.creationDateTo).format(DEFAULT_DATETIME_FORMAT),
          // },
        }).then(res => {
          if (res) {
            if (res.failed) {
              notification.error({ message: res.exception });
            } else {
              const file = new Blob(
                [res],
                { type: 'application/pdf' }
              );
              const fileURL = URL.createObjectURL(file);
              const newwindow = window.open(fileURL, 'newwindow');
              if (newwindow) {
                newwindow.print();
              } else {
                notification.error({ message: '当前窗口已被浏览器拦截，请手动设置浏览器！' });
              }
            }
          }
        });
      }
    });
  }

  // 导入
  @Bind()
  importData() {
    openTab({
      key: `/hhme/incoming-material-entry-plus/data-import/HME.CHIP_DATA`,
      title: intl.get('hwms.incomingMaterialEntryPlus.view.message.import').d('六型芯片导入'),
      search: queryString.stringify({
        action: intl.get('hwms.incomingMaterialEntryPlus.view.message.import').d('六型芯片导入'),
      }),
    });
  }

  // 渲染 界面布局
  render() {
    // 获取默认数据
    const {
      fetchHeadListLoading,
      fetchLineListLoading,
      headPrintLoading,
      incomingMaterialEntryPlus: { headList = [], headPagination = {}, lineList = [], linePagination = {} },
    } = this.props;

    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onChange,
    };

    let columnsAdd = []; // 暂存信息
    for (let i = 1; i <= 100; i++) {
      columnsAdd = [
        ...columnsAdd,
        {
          title: intl.get(`${commonModelPrompt}.schemaName`).d(`${i}`),
          dataIndex: `a${i.toString().length>2?i:(i.toString().length>1?(`0${i}`):(`00${i}`))}`,
          align: 'center',
          width: '50',
        },
      ];
    }

    // 设置显示数据
    const columnsHead = [
      {
        title: intl.get(`${commonModelPrompt}.printFlagMeaning`).d('是否打印'),
        dataIndex: 'printFlagMeaning',
        align: 'center',
        width: '80',
      },
      {
        title: intl.get(`${commonModelPrompt}.targetBarcode`).d('目标条码'),
        dataIndex: 'targetBarcode',
        align: 'center',
        width: '120',
      },
      {
        title: intl.get(`${commonModelPrompt}.sourceBarcode`).d('来料条码'),
        dataIndex: 'sourceBarcode',
        align: 'center',
        width: '120',
      },
      {
        title: intl.get(`${commonModelPrompt}.workNum`).d('工单'),
        dataIndex: 'workNum',
        align: 'center',
        width: '120',
      },
      {
        title: intl.get(`${commonModelPrompt}.cosType`).d('COS类型'),
        dataIndex: 'cosType',
        align: 'center',
        width: '120',
      },
      {
        title: intl.get(`${commonModelPrompt}.workcell`).d('工位'),
        dataIndex: 'workcell',
        align: 'center',
        width: '120',
      },
      {
        title: intl.get(`${commonModelPrompt}.importLot`).d('导入批次'),
        dataIndex: 'importLot',
        align: 'center',
        width: '120',
      },
      {
        title: intl.get(`${commonModelPrompt}.foxNum`).d('盒号'),
        dataIndex: 'foxNum',
        align: 'left',
        width: '120',
      },
      {
        title: intl.get(`${commonModelPrompt}.wafer`).d('WAFER'),
        dataIndex: 'wafer',
        align: 'left',
        width: '120',
      },
      {
        title: intl.get(`${commonModelPrompt}.containerType`).d('容器类型'),
        dataIndex: 'containerType',
        align: 'left',
        width: '120',
      },
      {
        title: intl.get(`${commonModelPrompt}.lotno`).d('LOTNO'),
        dataIndex: 'lotno',
        align: 'left',
        width: '120',
      },
      {
        title: intl.get(`${commonModelPrompt}.avgWavelenght`).d('Avg(nm)'),
        dataIndex: 'avgWavelenght',
        align: 'left',
        width: '120',
      },
      {
        title: intl.get(`${commonModelPrompt}.type`).d('TYPE'),
        dataIndex: 'type',
        align: 'left',
        width: '120',
      },
      {
        title: intl.get(`${commonModelPrompt}.remark`).d('备注'),
        dataIndex: 'remark',
        align: 'left',
      },
    ];

    // 设置显示数据
    const columnsLine = [
      {
        title: intl.get(`${commonModelPrompt}.position`).d('位置'),
        dataIndex: 'position',
        align: 'left',
        width: '120',
      },
      {
        title: intl.get(`${commonModelPrompt}.barNum`).d('Bar条数'),
        dataIndex: 'barNum',
        align: 'left',
        width: '120',
      },
      {
        title: intl.get(`${commonModelPrompt}.qty`).d('合格芯片数'),
        dataIndex: 'qty',
        align: 'left',
        width: '120',
      },
      ...columnsAdd,
    ];

    // 获取整个表单
    const { form } = this.props;
    // 获取表单的字段属性
    const { getFieldDecorator } = form;

    //  返回默认界面数据
    return (
      <div>
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('六型芯片导入')} backPath='/hhme/incoming-material-entry-plus/list' />
        <Content>
          <Form className={SEARCH_FORM_CLASSNAME}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.workNum`).d('工单号')}
                >
                  {getFieldDecorator('workNum', {})(<Input />)}
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.creationDateFrom`).d('导入时间从')}
                >
                  {getFieldDecorator(
                    'creationDateFrom',
                    {}
                  )(
                    <DatePicker
                      showTime={{ format: 'HH:mm:ss' }}
                      format="YYYY-MM-DD HH:mm:ss"
                      style={{ width: '100%' }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.creationDateTo`).d('导入时间至')}
                >
                  {getFieldDecorator(
                    'creationDateTo',
                    {}
                  )(
                    <DatePicker
                      showTime={{ format: 'HH:mm:ss' }}
                      format="YYYY-MM-DD HH:mm:ss"
                      style={{ width: '100%' }}
                    />
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
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={this.state.selectedRowKeys.length === 0}
                    onClick={this.headPrint.bind(this)}
                    loading={headPrintLoading}
                  >
                    {intl.get(`hzero.common.button.print`).d('打印')}
                  </Button>
                  <Button type="primary" htmlType="submit" onClick={this.importData.bind(this)}>
                    {intl.get(`hzero.common.button.import`).d('数据导入')}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.printFlag`).d('是否打印')}
                >
                  {getFieldDecorator(
                    'printFlag',
                    {}
                  )(
                    <Select allowClear>
                      {[
                        { value: 'Y', meaning: '是' },
                        { value: 'N', meaning: '否' },
                      ].map(item => (
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
            rowSelection={rowSelection}
            dataSource={headList}
            columns={columnsHead}
            pagination={headPagination}
            onChange={page => this.queryDataByPanigation(page)}
            onRow={record => {
              return {
                onClick: () => {
                  this.queryLineData(record);
                },
              };
            }}
            loading={fetchHeadListLoading}
          />
          <Table
            bordered
            dataSource={lineList}
            columns={columnsLine}
            pagination={linePagination}
            onChange={page => this.queryLineDataByPanigation(page)}
            loading={fetchLineListLoading}
          />
        </Content>
      </div>
    );
  }
}
