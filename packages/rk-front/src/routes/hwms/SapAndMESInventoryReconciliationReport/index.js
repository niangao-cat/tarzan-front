/**
 * @description SAP与MES库存核对报表
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
import { Form, Button, Col, Row, Table } from 'hzero-ui';
import Lov from 'components/Lov';
import ExcelExport from 'components/ExcelExport';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  FORM_COL_4_LAYOUT,
} from 'utils/constants';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';

const tenantId = getCurrentOrganizationId();



const commonModelPrompt = 'tarzan.hwms.sapAndMESInventoryReconciliationReport';

@connect(({ sapAndMESInventoryReconciliationReport, loading }) => ({
  sapAndMESInventoryReconciliationReport,
  fetchListLoading: loading.effects['sapAndMESInventoryReconciliationReport/queryDataList'],
}))
@Form.create({ fieldNameProp: null })
export default class sapAndMESInventoryReconciliationReport extends Component {

  @Bind
  queryData() {
    const { dispatch } = this.props;

    const { form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        // 根据页数查询报表信息
        dispatch({
          type: 'sapAndMESInventoryReconciliationReport/queryDataList',
          payload: {
            ...values,
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
          type: 'sapAndMESInventoryReconciliationReport/queryDataList',
          payload: {
            ...values,
            page,
          },
        });
          }
    });
  }

  // 导出条件
  @Bind()
  handleGetFormValue() {
    const { form } = this.props;
    const filterValue = form.getFieldsValue();
    return filterNullValueObject({ ...filterValue });
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
      sapAndMESInventoryReconciliationReport: { headList=[] },
    } = this.props;

    // 设置显示数据
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.siteCode`).d('工厂'),
        dataIndex: 'siteCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.locatorCode`).d('仓库'),
        dataIndex: 'locatorCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料'),
        dataIndex: 'materialCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.interfaceQty`).d('MES接口库存'),
        dataIndex: 'interfaceQty',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.mesOnHandQty`).d('MES现有量'),
        dataIndex: 'mesOnHandQty',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.mesCountQty`).d('MES库存总和'),
        dataIndex: 'mesCountQty',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.sapCountQty`).d('SAP库存'),
        dataIndex: 'sapCountQty',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.difference`).d('差异'),
        dataIndex: 'difference',
        align: 'left',
      },
    ];

    // 获取整个表单
    const { form } = this.props;
    // 获取表单的字段属性
    const { getFieldDecorator } = form;

    //  返回默认界面数据
    return (
      <div>
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('SAP与MES库存核对报表')}>
          <ExcelExport
            exportAsync
            requestUrl={`/mes/v1/${getCurrentOrganizationId()}/itf-sap-on-hand/export`} // 路径
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
                  label={intl.get(`${commonModelPrompt}.siteCode`).d('站点')}
                >
                  {getFieldDecorator('siteId', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonModelPrompt}.siteCode`).d('站点'),
                    }),
                  },
                ],
              })(
                <Lov
                  onChange={(value, values) => this.props.form.setFieldsValue({siteCode: values.siteCode})}
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
                  label={intl.get(`locatorId`).d('仓库')}
                >
                  {getFieldDecorator('locatorId', {})(
                    <Lov
                      onChange={(value, values) => this.props.form.setFieldsValue({locatorCode: values.warehouse})}
                      code="MT.WARE.HOUSE"
                      queryParams={{tenantId}}
                      textField="locatorCode"
                    />
              )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.materialId`).d('物料')}
                >
                  {getFieldDecorator('materialId')(
                    <Lov
                      onChange={(value, values) => {
                        this.props.form.setFieldsValue({materialCode: values.materialCode});
                      }}
                      queryParams={{ tenantId }}
                      code="MT.MATERIAL"
                      textField="materialCode"
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
