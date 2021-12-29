/**
 * query - 库存查询
 * @date: 2019-7-31
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { Row, Col } from 'hzero-ui';
import { isUndefined } from 'lodash';
import ExcelExport from 'components/ExcelExport';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import FilterForm from './FilterForm';
import SelectTree from './SelectTree';
import ListTable from './ListTable';

@formatterCollections({
  code: ['tarzan.inventory.query'], // code 为 [服务].[功能]的字符串数组
})
/**
 * 库存查询
 * @extends {Component} - React.Component
 * @reactProps {Object} query - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ query, loading }) => ({
  query,
  fetchLoading: loading.effects['query/queryBillList'],
}))
export default class Query extends React.Component {
  listTable;

  queryForm;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'query/queryInitInfo',
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'query/cleanModel',
    });
  }

  /**
   * 查询数据
   * @param {object} page 页面基本信息数据
   */
  @Bind()
  fetchQueryList(pagination = {}) {
    this.queryForm.fetchQueryList(pagination);
  }

  /**
   *
   * @param {object} ref - listTable子组件对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.listTable = ref;
  }

  /**
   *
   * @param {object} ref - FilterForm子组件对象
   */
  @Bind()
  handleBindQueryRef(ref = {}) {
    this.queryForm = ref;
  }

  // 导出；
  @Bind()
  handleGetFormValue() {
    const { form } = !isUndefined(this.queryForm) && this.queryForm.props;
    const filterValue = form === undefined ? {} : form.getFieldsValue();
    return filterNullValueObject({ ...filterValue });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.inventory.query.view.title.query').d('库存查询')}>
          <ExcelExport
            requestUrl={`/mes/v1/${getCurrentOrganizationId()}/wms-inv-onhand-quantity/quantity-export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={() => this.handleGetFormValue()}
          />
        </Header>
        <Content>
          <FilterForm onRef={this.handleBindQueryRef} />
          <Row gutter={32} style={{ paddingLeft: 28 }}>
            <Col
              span={5}
              style={{
                minHeight: 110,
                boxShadow: ' 0px 0px 1px 0px rgba(105, 105, 105, 0.28)',
                paddingLeft: 20,
              }}
            >
              <SelectTree onSearch={this.fetchQueryList} />
            </Col>
            <Col span={19}>
              <ListTable onRef={this.handleBindRef} onSearch={this.fetchQueryList} />
            </Col>
          </Row>
        </Content>
      </React.Fragment>
    );
  }
}
