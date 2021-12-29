/**
 * enterprise -企业维护
 * @date: 2019-8-8
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button } from 'hzero-ui';
import formatterCollections from 'utils/intl/formatterCollections';
// import {isUndefined} from 'lodash';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
// import notification from 'utils/notification';
import { addItemToPagination } from 'utils/utils';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 *企业维护
 * @extends {Component} - React.Component
 * @reactProps {Object} enterprise - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ enterprise, loading }) => ({
  enterprise,
  fetchEnterpriseLoading: loading.effects['enterprise/fetchEnterpriseList'],
}))
@formatterCollections({ code: 'tarzan.org.enterprise' })
@Form.create({ fieldNameProp: null })
export default class Enterprise extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'enterprise/fetchEnterpriseList',
    });
  }

  /**
   * 获取filterForm
   */
  @Bind()
  filterRef(ref = {}) {
    this.filterForm = (ref.props || {}).form;
  }

  /**
   * 新建消息
   */
  @Bind()
  handleCreateEnterprise() {
    const {
      dispatch,
      enterprise: { enterpriseList = [], enterprisePagination = {} },
    } = this.props;
    if (
      enterpriseList.length === 0 ||
      (enterpriseList.length > 0 && enterpriseList[0]._status !== 'create')
    ) {
      dispatch({
        type: 'enterprise/updateState',
        payload: {
          enterpriseList: [
            {
              enterpriseId: '',
              enableFlag: 'Y',
              enterpriseCode: '',
              enterpriseName: '',
              enterpriseShortName: '',
              _status: 'create',
            },
            ...enterpriseList,
          ],
          enterprisePagination: addItemToPagination(enterpriseList.length, enterprisePagination),
        },
      });
    }
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.org.enterprise.title.list').d('企业维护')}>
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              this.handleCreateEnterprise();
            }}
          >
            {intl.get('tarzan.org.enterprise.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <FilterForm onRef={this.filterRef} />
          <ListTable filterForm={this.filterForm} />
        </Content>
      </React.Fragment>
    );
  }
}
