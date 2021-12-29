/**
 * @description 条码库存现有量查询
 * @author ywj
 * @email wenjie.yang01@hand-china.com
 * @date 2020/11/13
 * @time 11:17
 * @version 0.0.1
 * @return
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Form, Button, Col, Row, Input, Table, Select } from 'hzero-ui';
import Lov from 'components/Lov';
import ExcelExport from 'components/ExcelExport';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';
import intl from 'utils/intl';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';

import { Header, Content } from 'components/Page';

import DetailIndex from './DetailIndex';

const tenantId = getCurrentOrganizationId();
const FORM_COL_5_LAYOUT = {
    span: 5,
    style: { width: '20%' },
  };

const commonModelPrompt = 'tarzan.hwms.wmsBarcodeInventoryOnHandQuery';

@connect(({ wmsBarcodeInventoryOnHandQuery, loading }) => ({
  wmsBarcodeInventoryOnHandQuery,
  fetchListLoading: loading.effects['wmsBarcodeInventoryOnHandQuery/fetchList'],
  fetchListDetailLoading: loading.effects['wmsBarcodeInventoryOnHandQuery/fetchDetailList'],
}))
@Form.create({ fieldNameProp: null })
export default class wmsBarcodeInventoryOnHandQuery extends Component {

    state = {
      detailExpand: false, // 明细弹出框
      searchDetail: {}, // 查询条件
    };

  componentDidMount() {
    const {
      tenantId,
      dispatch,
    } = this.props;
    // 查询独立值集
    dispatch({
      type: 'wmsBarcodeInventoryOnHandQuery/batchLovData',
      payload: {
        tenantId,
      },
    });
  }

  // 数据查询
  @Bind
  queryData() {
    const { dispatch } = this.props;

    const { form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        // 根据页数查询报表信息
        dispatch({
          type: 'wmsBarcodeInventoryOnHandQuery/fetchList',
          payload: {
            ...values,
          },
        });
          }
    });
  }

  // 分页查询
  @Bind
  queryDataByPanigation(page = {}) {
    const { dispatch } = this.props;

    const { form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        // 根据页数查询报表信息
        dispatch({
          type: 'wmsBarcodeInventoryOnHandQuery/fetchList',
          payload: {
            ...values,
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

  // 查询明细信息
  @Bind
  showDetail(record){
    const { dispatch } = this.props;

    // 打开明细框
    this.state.detailExpand = true;

    // 缓存明细查询条件
    this.setState({ searchDetail: record});

    // 根据页数查询报表信息
    dispatch({
      type: 'wmsBarcodeInventoryOnHandQuery/fetchDetailList',
      payload: {
        ...record,
      },
    });
  }

  // 查询明细分页信息
  @Bind
  queryDetailDataByPage(page = {}){
    const { dispatch } = this.props;

    // 打开明细框
    this.setState({detailExpand: true});

    // 根据页数查询报表信息
    dispatch({
      type: 'wmsBarcodeInventoryOnHandQuery/fetchDetailList',
      payload: {
        ...this.state.searchDetail,
        page,
      },
    });
  }

  // 关闭按钮
  @Bind()
  closeDetail(){
    this.setState({detailExpand: false});
  }

  @Bind()
  handleGetFormValue() {
    const { form } = this.props;
    const filterValue = form.getFieldsValue();
    return filterNullValueObject({ ...filterValue });
  }

  // 渲染 界面布局
  render() {

    // 获取默认数据
    const {
      fetchListLoading,
      fetchListDetailLoading,
      wmsBarcodeInventoryOnHandQuery: { headList=[], headPagination = {}, detailList = [], detailPagination = {}, enableMap = []},
    } = this.props;
    console.log(enableMap);
    // 明细数据查询
    const expandDataProps = {
      detailExpand: this.state.detailExpand,
      dataSource: detailList,
      pagination: detailPagination,
      loading: fetchListDetailLoading,
      onSearch: this.queryDetailDataByPage,
      closeDetail: this.closeDetail,
      enableMap,
    };

    // 设置显示数据
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.siteCode`).d('站点'),
        dataIndex: 'siteCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.warehouseCode`).d('仓库'),
        dataIndex: 'warehouseCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.warehouseName`).d('仓库描述'),
        dataIndex: 'warehouseName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialVersion`).d('物料版本'),
        dataIndex: 'materialVersion',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.locatorCode`).d('货位'),
        dataIndex: 'locatorCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.locatorName`).d('货位描述'),
        dataIndex: 'locatorName',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.soNum`).d('销售订单号'),
        dataIndex: 'soNum',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.soLineNum`).d('销售订单行号'),
        dataIndex: 'soLineNum',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.lot`).d('批次'),
        dataIndex: 'lot',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.uomCode`).d('单位'),
        dataIndex: 'uomCode',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.qty`).d('数量'),
        dataIndex: 'qty',
        align: 'left',
      },
      {
        title: 'SAP账务标识',
        dataIndex: 'sapAccountFlagMeaning',
        align: 'left',
      },
      {
        title: intl.get('tarzan.common.button.action').d('操作'),
        width: 80,
        align: 'center',
        fixed: 'right',
        render: (val, record) => (
          <a onClick={() => this.showDetail(record)}>
            {intl.get('tarzan.common.button.detail').d('明细')}
          </a>
        ),
      },
    ];

    // 获取整个表单
    const {form} = this.props;
    // 获取表单的字段属性
    const { getFieldDecorator} = form;

    //  返回默认界面数据
    return (
      <div>
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('条码库存现有量查询')}>
          <ExcelExport
            exportAsync
            requestUrl={`/mes/v1/${getCurrentOrganizationId()}/barcode-inventory-on-hand-query/excel-export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue()}
          />
        </Header>
        <Content>
          <Form className={SEARCH_FORM_CLASSNAME}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_5_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.site`).d('站点')}
                >
                  {getFieldDecorator('siteId', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${commonModelPrompt}.site`).d('所属站点'),
                        }),
                      },
                    ],
                  })(
                    <Lov queryParams={{ tenantId }} code="MT.SITE" />
              )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_5_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.warehouse`).d('仓库')}
                >
                  {getFieldDecorator('warehouseId', {})(
                    <Lov code="MT.WARE.HOUSE" queryParams={{ tenantId }} textField="warehouse" />
              )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_5_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.materialId`).d('物料')}
                >
                  {getFieldDecorator('materialId')(
                    <Lov queryParams={{ tenantId }} code="MT.MATERIAL" />
              )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_5_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`locatorId`).d('货位')}
                >
                  {getFieldDecorator('locatorId')(
                    <Lov code="MT.MTL_LOCATOR" queryParams={{ tenantId }} />
              )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_5_LAYOUT} className={SEARCH_COL_CLASSNAME}>
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
              <Col {...FORM_COL_5_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.soNum`).d('销售订单号')}
                >
                  {getFieldDecorator('soNum')(
                    <Input />
              )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_5_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.soLineNum`).d('行号')}
                >
                  {getFieldDecorator('soLineNum')(
                    <Input />
              )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_5_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.materialVersion`).d('版本')}
                >
                  {getFieldDecorator('materialVersion')(
                    <Input />
              )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_5_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.lot`).d('批次')}
                >
                  {getFieldDecorator('lot')(
                    <Input />
              )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col {...FORM_COL_5_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='SAP账务标识'
                >
                  {getFieldDecorator('sapAccountFlag', {})(
                    <Select allowClear>
                    {enableMap.map(item => (
                      <Select.Option key={item.value}>{item.meaning}</Select.Option>
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
        </Content>
        {this.state.detailExpand && <DetailIndex {...expandDataProps} />}
      </div>
    );
  }
}
