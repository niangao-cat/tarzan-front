/**
 * ageningData -老化基础数据维护
* @date: 2021-03-03
 * @author:  <junfeng.chen@hand-china.com>
 * @version: 0.0.1
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
import { addItemToPagination, getCurrentOrganizationId } from 'utils/utils';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 *老化数据维护
 * @extends {Component} - React.Component
 * @reactProps {Object} ageningData - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ ageningData, loading }) => ({
  ageningData,
  tenantId: getCurrentOrganizationId(),
  fetchAgeningDataLoading: loading.effects['ageningData/fetchAgeningDataList'],
}))
@formatterCollections({ code: 'hhme.ageningData' })
@Form.create({ fieldNameProp: null })
export default class AgeningData extends React.Component {
  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'ageningData/fetchAgeningDataList',
    });
    // 批量查询独立值集
    dispatch({
      type: 'ageningData/batchLovData',
      payload: {
        tenantId,
      },
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
   * 新建
   */
  @Bind()
  handleCreateAgeningData() {
    const {
      dispatch,
      ageningData: { ageningDataList = [], ageningDataPagination = {} },
    } = this.props;
    if (
      ageningDataList.length === 0 ||
      (ageningDataList.length > 0 && ageningDataList[0]._status !== 'create')
    ) {
      dispatch({
        type: 'ageningData/updateState',
        payload: {
          ageningDataList: [
            {
              basicId: '',
              enableFlag: 'Y',
              _status: 'create',
            },
            ...ageningDataList,
          ],
          ageningDataPagination: addItemToPagination(ageningDataList.length, ageningDataPagination),
        },
      });
    }
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      ageningData,
      tenantId,
    } = this.props;
    const {
      statusMap = [],
    } = ageningData;
    const filterProps = {
      tenantId,
      statusMap,
    };
    return (
      <React.Fragment>
        <Header title={intl.get('hhme.ageningData.title.list').d('老化基础数据维护')}>
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              this.handleCreateAgeningData();
            }}
          >
            {intl.get('hhme.ageningData.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} onRef={this.filterRef} />
          <ListTable {...filterProps} filterForm={this.filterForm} />
        </Content>
      </React.Fragment>
    );
  }
}
