/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 表增量报表
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Form, Button, Col, Row, Input, Table } from 'hzero-ui';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';



const commonModelPrompt = 'tarzan.hwms.tableQuery';

@connect(({ tableQuery, loading }) => ({
  tableQuery,
  fetchListLoading: loading.effects['tableQuery/queryDataList'],
}))
@Form.create({ fieldNameProp: null })
export default class tableQuery extends Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'tableQuery/queryDataList',
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
          type: 'tableQuery/queryDataList',
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
          type: 'tableQuery/queryDataList',
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

  // 渲染 界面布局
  render() {

    // 获取默认数据
    const {
      fetchListLoading,
      tableQuery: { headList=[], headPagination = {} },
    } = this.props;

    // 设置显示数据
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.schemaName`).d('数据库名'),
        dataIndex: 'schemaName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.tableName`).d('表明'),
        dataIndex: 'tableName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.tableRows`).d('记录总数'),
        dataIndex: 'tableRows',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.dataSize`).d('数据容量(MB)'),
        dataIndex: 'dataSize',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.indexSize`).d('索引容量(MB)'),
        dataIndex: 'indexSize',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.statisticsDate`).d('统计日期'),
        dataIndex: 'statisticsDate',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.addCountCurrent`).d('当日增量'),
        dataIndex: 'addCountCurrent',
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
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('表增量查询')} />
        <Content>
          <Form className={SEARCH_FORM_CLASSNAME}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col span="5">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.tableName`).d('表名')}
                >
                  {getFieldDecorator('tableName', {})(
                    <Input />
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
      </div>
    );
  }
}
