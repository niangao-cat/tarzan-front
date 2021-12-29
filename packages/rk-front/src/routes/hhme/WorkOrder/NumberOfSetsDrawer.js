/*
 * @Description: 齐套数量
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-10-14 10:49:22
 * @LastEditTime: 2020-12-08 17:14:03
 */

import React, { Component } from 'react';
import { Modal, Form, Table, Row, Col, Input, Button } from 'hzero-ui';
import { isFunction } from 'lodash';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';

import {
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';

@Form.create({ fieldNameProp: null })
export default class NumberOfSetsDrawer extends Component {

  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
    };
  }

  @Bind()
  handleFormReset() {
    this.props.form.resetFields();
  }


  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const {
      expandDrawer,
      dataSource,
      onNumberOfSetsDrawer,
      woRecord,
      pagination,
      onFetchSuiteList,
      loading,
      form: { getFieldDecorator },
    } = this.props;
    // 获取表单的字段属性
    const columns = [
      {
        title: '单位用量',
        dataIndex: 'usageQty',
        width: 100,
      },
      {
        title: '单位',
        dataIndex: 'uomCode',
        width: 90,
      },
      {
        title: '组件编码',
        dataIndex: 'materialCode',
        width: 100,
      },
      {
        title: '物料版本',
        dataIndex: 'materialVersion',
        width: 100,
      },
      {
        title: '销售订单 + 行号',
        dataIndex: 'soLineNum',
        width: 140,
        align: 'center',
        render: (val, record) => `${record.soNum ? record.soNum : ''} - ${record.val ? record.val : ''}`,
      },
      {
        title: '线边库存',
        dataIndex: 'workcellQty',
        width: 100,
      },
      {
        title: '线边套数',
        dataIndex: 'workcellSuiteQty',
        width: 100,
      },
      {
        title: '组件名称',
        dataIndex: 'materialName',
        width: 120,
      },
      {
        title: '仓库库存',
        dataIndex: 'inStockQty',
        width: 100,
      },
      {
        title: '仓库套数',
        dataIndex: 'suiteQty',
        width: 100,
      },
    ];
    // 获取表单的字段属性
    return (
      <Modal
        destroyOnClose
        width={1000}
        onCancel={() => onNumberOfSetsDrawer({}, false)}
        visible={expandDrawer}
        footer={null}
        title="齐套数量"
      >
        <Form>
          <Row>
            <Col span={8}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="组件编码">
                {getFieldDecorator('materialCode')(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="组件名称">
                {getFieldDecorator('materialName')(
                  <Input style={{ width: '100%' }} />
                )}
              </Form.Item>
            </Col>
            <Col span={8} className="search-btn-more">
              <Form.Item>
                <Button data-code="reset" onClick={this.handleFormReset}>
                  {intl.get('hzero.common.button.reset').d('重置')}
                </Button>
                <Button
                  data-code="search"
                  type="primary"
                  htmlType="submit"
                  onClick={() => onFetchSuiteList({}, woRecord)}
                >
                  {intl.get('hzero.common.button.search').d('查询')}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Table
          rowKey="materialLotId"
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          onChange={page => onFetchSuiteList(page, woRecord)}
          bordered
          loading={loading}
        />
      </Modal>
    );
  }
}
