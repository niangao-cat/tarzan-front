/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 表增量报表
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Form, Button, Col, Row, Input, Table, Card } from 'hzero-ui';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  DETAIL_CARD_TABLE_CLASSNAME,
} from 'utils/constants';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import { openTab } from 'utils/menuTab';
import queryString from 'querystring';

const tenantId = getCurrentOrganizationId();
const commonModelPrompt = 'tarzan.hwms.qualityFileAnalysisBackEnd';

@connect(({ qualityFileAnalysisBackEnd, loading }) => ({
  qualityFileAnalysisBackEnd,
  fetchHeadListLoading: loading.effects['qualityFileAnalysisBackEnd/queryHeadList'],
  fetchLineListLoading: loading.effects['qualityFileAnalysisBackEnd/queryLineList'],
}))
@Form.create({ fieldNameProp: null })
export default class qualityFileAnalysisBackEnd extends Component {

  state = {
    selectedHeadKeys: [], // 选中的主键
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'qualityFileAnalysisBackEnd/queryHeadList',
    });
  }

  /**
   * 查询头信息
   */
  @Bind
  queryData() {
    const { dispatch } = this.props;

    const { form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        // 根据页数查询报表信息
        dispatch({
          type: 'qualityFileAnalysisBackEnd/queryHeadList',
          payload: {
            ...values,
          },
        });
          }
    });

  }

  /**
   * 分页查询头信息
   */
  @Bind
  queryDataByPanigation(page = {}) {
    const { dispatch } = this.props;

    const { form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        // 根据页数查询报表信息
        dispatch({
          type: 'qualityFileAnalysisBackEnd/queryHeadList',
          payload: {
            ...values,
            page,
          },
        });
          }
    });
  }

  /**
 * 头选择操作
 */
@Bind()
handleSelectHead(selectedHeadKeys) {
  this.setState({ selectedHeadKeys }, () => {
    // 查询行信息
    this.queryLineData();
  });
}

  /**
   * 查询行信息
   */
  @Bind
  queryLineData() {
    const { dispatch } = this.props;

    dispatch({
      type: 'qualityFileAnalysisBackEnd/queryLineList',
      payload: {
        qaDocId: this.state.selectedHeadKeys[0],
      },
    });

  }

  /**
   * 分页查询行信息
   * @param {参数} page
   */
  @Bind
  queryLineDataByPanigation(page = {}) {
    const { dispatch } = this.props;
    dispatch({
      type: 'qualityFileAnalysisBackEnd/queryLineList',
      payload: {
        qaDocId: this.state.selectedHeadKeys[0],
        page,
      },
    });
  }

   // 重置查询
  @Bind
  resetSearch = () => {
    const { form } = this.props;
    form.resetFields();
  };

  /**
   * 光纤质量文件导入
   */
  @Bind()
  exObjectImportExcel() {
    openTab({
      key: `/hwms/analysis-of-quality-documents/data-import/HME.APLASER_QUALITY_DOC`,
      title: intl.get('hwms.machineBasic.view.message.import').d('光纤质量文件导入'),
      search: queryString.stringify({
        action: intl.get('hwms.machineBasic.view.message.import').d('光纤质量文件导入'),
      }),
    });
  }

  /**
   * 光栅质量文件导入
   */
  @Bind()
  exDataImportExcel() {
    openTab({
      key: `/hwms/analysis-of-quality-documents/data-import/HME.RASTER_QUALITY_DOC`,
      title: intl.get('hwms.machineBasic.view.message.import').d('光栅质量文件导入'),
      search: queryString.stringify({
        action: intl.get('hwms.machineBasic.view.message.import').d('光栅质量文件导入'),
      }),
    });
  }

  // 渲染 界面布局
  render() {

    // 获取默认数据
    const {
      fetchHeadListLoading,
      fetchLineListLoading,
      qualityFileAnalysisBackEnd: { headList=[], headPagination = {}, lineList = [], linePagination = {} },
    } = this.props;

    // 设计选中事件
    const rowsSelection = {
      selectedRowKeys: this.state.selectedHeadKeys,
      onChange: this.handleSelectHead,
      type: 'radio', // 单选
    };

    // 设置显示数据
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.workOrderNum`).d('工单号'),
        dataIndex: 'workOrderNum',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialLotCode`).d('SN条码'),
        dataIndex: 'materialLotCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.quantity`).d('数量'),
        dataIndex: 'quantity',
        align: 'center',
      },
    ];

    // 设置显示数据
    const columnsLine = [
      {
        title: '序号',
        render: (val, record, index) => index + 1,
      },
      {
        title: intl.get(`${commonModelPrompt}.tagCode`).d('检验项目'),
        dataIndex: 'tagCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.tagDescription`).d('检验项目描述'),
        dataIndex: 'tagDescription',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.result`).d('检验结果'),
        dataIndex: 'result',
        align: 'center',
      },
    ];

    // 获取整个表单
    const { form } = this.props;
    // 获取表单的字段属性
    const { getFieldDecorator } = form;

    //  返回默认界面数据
    return (
      <div>
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('质量文件解析')}>
          <Button type="primary" onClick={() => this.exDataImportExcel()}>
            {intl.get(`tarzan.acquisition.collection.button.create`).d('光栅质量文件导入')}
          </Button>
          <Button type="primary" onClick={() => this.exObjectImportExcel()}>
            {intl.get(`tarzan.acquisition.collection.button.create`).d('光纤质量文件导入')}
          </Button>
        </Header>
        <Content>
          <Form className={SEARCH_FORM_CLASSNAME}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.materialId`).d('物料编码')}
                >
                  {getFieldDecorator('materialId')(
                    <Lov onChange={(_, records) => { this.props.form.setFieldsValue({ 'materialName': records.materialName});}} queryParams={{ tenantId }} code="MT.MATERIAL" />
              )}
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.materialName`).d('物料描述')}
                >
                  {getFieldDecorator('materialName')(
                    <Input disabled />
              )}
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.materialLotCode`).d('SN条码')}
                >
                  {getFieldDecorator('materialLotCode')(
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
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.workOrderNum`).d('工单')}
                >
                  {getFieldDecorator('workOrderNum')(
                    <Input />
              )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Table
            bordered
            rowKey="qaDocId"
            dataSource={headList}
            columns={columns}
            pagination={headPagination}
            rowSelection={rowsSelection}
            onChange={page => this.queryDataByPanigation(page)}
            loading={fetchHeadListLoading}
          />
          <Card
            key="code-rule-header"
            title={intl.get(`${commonModelPrompt}.view.line`).d('检验项目')}
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
          >
            <Table
              bordered
              dataSource={lineList}
              columns={columnsLine}
              pagination={linePagination}
              onChange={page => this.queryLineDataByPanigation(page)}
              loading={fetchLineListLoading}
            />
          </Card>
        </Content>
      </div>
    );
  }
}
