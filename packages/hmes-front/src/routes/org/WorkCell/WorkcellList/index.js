/**
 * workcellList - 工作单元维护
 * @date: 2019-8-7
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Table, Badge } from 'hzero-ui';
// import { isUndefined, isNull } from 'lodash';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import FilterForm from './FilterForm';

/**
 * 使用 Form.Item 组件
 */
const modelPrompt = 'tarzan.org.workcell.model.workcell';

/**
 * 工作单元维护
 * @extends {Component} - React.Component
 * @reactProps {Object} [location={}] - 当前路由信息
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} workcellList - 数据源
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(({ workcell, loading }) => ({
  workcell,
  currentTenantId: getCurrentOrganizationId(),
  loading: loading.effects['workcell/fetchWorkcellList'],
}))
@formatterCollections({ code: 'tarzan.org.workcell' })
// @Form.create({ fieldNameProp: null })
// @cacheComponent({ cacheKey: '/organization-modeling/work-cell/list' })
export default class WorkcellList extends React.Component {
  queryForm;

  componentDidMount() {
    const { dispatch } = this.props;
    // console.log(this.queryForm)
    dispatch({
      type: 'workcell/fetchWorkcellList',
      payload: {
        // ...this.queryForm.props.form.getFieldsValue(),
      },
    });
    dispatch({
      type: 'workcell/fetchWorkcellTypeList',
      payload: {
        module: 'MODELING',
        typeGroup: 'WORKCELL_TYPE',
      },
    });
  }

  /**
   * 页面跳转到工作单元明细维护页面
   * @param {object} record 行数据
   */
  @Bind()
  showWorkcellDist(record = {}) {
    const { history, dispatch } = this.props;
    history.push(`/organization-modeling/work-cell/dist/${record.workcellId}`);
    dispatch({
      type: 'workcell/fetchWorkcellLineList',
      payload: {
        workcellId: record.workcellId,
      },
    });
  }

  /**
   *新建工作单元页面
   * @param {object} record 行数据
   */
  @Bind()
  createWorkcell() {
    const { history } = this.props;
    history.push(`/organization-modeling/work-cell/dist/create`);
  }

  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagination) {
    this.fetchQueryList(pagination);
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
   * @param {object} ref - FilterForm子组件对象
   */
  @Bind()
  handleBindQueryRef(ref = {}) {
    this.queryForm = ref;
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      workcell: { workcellList = [], workcellPagination = {}, workcellTypeList = [] },
      loading,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.workcellCode`).d('工作单元编码'),
        width: 100,
        dataIndex: 'workcellCode',
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.showWorkcellDist(record);
              }}
            >
              {val}
            </a>
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.workcellName`).d('工作单元短描述'),
        dataIndex: 'workcellName',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('工作单元长描述'),
        dataIndex: 'description',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.workcellType`).d('工作单元类型'),
        dataIndex: 'workcellType',
        width: 100,
        align: 'center',
        render: val => (
          <Fragment>
            {workcellTypeList instanceof Array && workcellTypeList.length !== 0
              ? (workcellTypeList.filter(item => item.typeCode === val)[0] || {}).description
              : ''}
          </Fragment>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.workcellLocation`).d('工作单元位置'),
        dataIndex: 'workcellLocation',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 100,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.enableFlag === 'Y' ? 'success' : 'error'}
            text={
              record.enableFlag === 'Y'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },
    ];

    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.org.workcell.view.title.workcell').d('工作单元维护')}>
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              this.createWorkcell();
            }}
          >
            {intl.get('tarzan.org.workcell.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <FilterForm onRef={this.handleBindQueryRef} />
          <Table
            loading={loading}
            rowKey="workcellId"
            dataSource={workcellList}
            columns={columns}
            pagination={workcellPagination || {}}
            onChange={this.handleTableChange}
            bordered
          />
        </Content>
      </React.Fragment>
    );
  }
}
