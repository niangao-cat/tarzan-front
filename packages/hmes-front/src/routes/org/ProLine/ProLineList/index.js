/**
 *@description 生产线维护
 *@author: 唐加旭
 *@date: 2019-09-02 10:27:54
 *@version: V0.0.1
 *@reactProps {}  -
 *@return:</>
 * */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Table, Badge } from 'hzero-ui';
// import {isUndefined} from 'lodash';
import { Bind } from 'lodash-decorators';
import cacheComponent from 'components/CacheComponent';
import { Header, Content } from 'components/Page';

import intl from 'utils/intl';
// import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import FilterForm from './FilterForm';

/**
 * 使用 Form.Item 组件
 */
const modelPrompt = 'tarzan.org.proline.model.proline';
/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

@connect(({ proline, loading }) => ({
  proline,
  currentTenantId: getCurrentOrganizationId(),
  loading: loading.effects['proline/fetchProLineList'],
}))
@formatterCollections({ code: 'tarzan.org.proline' })
@Form.create({ fieldNameProp: null })
@cacheComponent({ cacheKey: '/organization-modeling/work-cell/list' })
export default class WorkcellList extends React.Component {
  componentDidMount() {
    this.refresh();
  }

  @Bind()
  refForm = (ref = {}) => {
    this.filterForm = (ref.props || {}).form;
  };

  @Bind()
  refresh = (pagination = {}) => {
    const { dispatch } = this.props;

    let params = {};
    if (this.filterForm) {
      this.filterForm.validateFields((err, values) => {
        if (!err) {
          params = values;
        }
      });
    }

    dispatch({
      type: 'proline/fetchProLineList',
      payload: {
        ...params,
        page: pagination,
      },
    });
  };

  @Bind()
  onSearch = () => {
    this.refresh();
  };

  @Bind()
  resetSearch = () => {
    // reset
  };

  /**
   * 页面跳转到工作单元明细维护页面
   * @param {object} record 行数据
   */
  @Bind()
  showWorkcellDist(record = {}) {
    const { history, dispatch } = this.props;
    dispatch({
      type: 'proline/updateState',
      payload: {
        proLineItem: record,
      },
    });
    history.push(`/organization-modeling/pro-line/dist/${record.prodLineId}`);
  }

  /**
   *新建工作单元页面
   * @param {object} record 行数据
   */
  @Bind()
  createWorkcell() {
    const { history, dispatch } = this.props;
    history.push(`/organization-modeling/pro-line/dist/create`);
    dispatch({
      type: 'proline/updateState',
      payload: {
        proLineItem: {},
      },
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      proline: { proLineList = [], proLinePagination = {} },
      loading,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.prodLineCode`).d('生产线编码'),
        width: 100,
        dataIndex: 'prodLineCode',
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
        title: intl.get(`${modelPrompt}.prodLineName`).d('生产线短描述'),
        dataIndex: 'prodLineName',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('生产线长描述'),
        dataIndex: 'description',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.prodLineTypeDesc`).d('生产线类型'),
        dataIndex: 'prodLineTypeDesc',
        width: 100,
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
        <Header title={intl.get('tarzan.org.proline.title.proline').d('生产线维护')}>
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              this.createWorkcell();
            }}
          >
            {intl.get('tarzan.org.proline.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <FilterForm
            onRef={this.refForm}
            onSearch={this.onSearch}
            resetSearch={this.resetSearch}
          />
          <Table
            loading={loading}
            rowKey="prodLineId"
            dataSource={proLineList}
            columns={columns}
            pagination={proLinePagination || {}}
            onChange={this.refresh}
            bordered
          />
        </Content>
      </React.Fragment>
    );
  }
}
