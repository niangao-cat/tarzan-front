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
import { Header, Content } from 'components/Page';

import intl from 'utils/intl';
// import notification from 'utils/notification';
import { getCurrentOrganizationId, tableScrollWidth } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import Cookies from 'universal-cookie';
import FilterForm from './FilterForm';

const cookies = new Cookies();

/**
 * 使用 Form.Item 组件
 */
const modelPrompt = 'tarzan.process.technology.model.technology';
/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

@connect(({ technology, loading }) => ({
  technology,
  currentTenantId: getCurrentOrganizationId(),
  loading: loading.effects['technology/fetchOperationList'],
}))
@formatterCollections({ code: 'tarzan.process.technology' })
@Form.create({ fieldNameProp: null })
export default class OpeartionList extends React.Component {
  state = {
    search: {},
  };

  componentDidMount() {
    if (cookies.get('search') !== undefined && cookies.get('search') !== null && cookies.get('search') !== "") {

      this.setState({search: cookies.get('search')});
      const { dispatch } = this.props;
      dispatch({
        type: 'technology/fetchOperationList',
        payload: {
          ...cookies.get('search'),
          page: {},
        },
      });
    }else{
      this.refresh();
    }
    this.fetchSelectList('OPERATION_TYPE', 'ROUTER', 'typeList');
    this.fetchSelectList('WORKCELL_TYPE', 'MODELING', 'workCellList');
    this.fetchSiteOption();
    this.fetchStatusOption();

    cookies.set('search', {});
  }

  @Bind()
  refresh = (pagination = {}) => {
    const { dispatch } = this.props;
    const { search } = this.state;
    dispatch({
      type: 'technology/fetchOperationList',
      payload: {
        ...search,
        page: pagination,
      },
    });
  };

  @Bind()
  onSearch = fielsValue => {
    // cookies.set('search', fielsValue);
    this.setState(
      {
        search: fielsValue,
      },
      () => {
        this.refresh();
      }
    );
  };

  @Bind()
  resetSearch = () => {
    cookies.set('search', {});
    this.setState({
      search: {},
    });
  };

  /**
   *@functionName:   fetchSelectList
   *@params1 {String} type 通用type
   *@params2 {String}  module 所属模块
   *@params3 {String}  stateType 修改得props
   *@description: 获取通用得下拉，包括类型，工作单元
   *@author: 唐加旭
   *@date: 2019-09-09 17:54:02
   *@version: V0.8.6
   * */
  @Bind
  fetchSelectList = (type, module, stateType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'technology/fetchSelectList',
      payload: {
        module,
        typeGroup: type,
        stateType,
      },
    }).then(res => {
      if (res && res.success) {
        this.setState({
          [stateType]: res.rows,
        });
      }
    });
  };

  @Bind()
  fetchSiteOption = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'technology/fetchSiteOption',
      payload: {
        siteType: 'MANUFACTURING',
      },
    });
  };

  @Bind()
  fetchStatusOption = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'technology/fetchStatusOption',
      payload: {
        module: 'ROUTER',
        statusGroup: 'OPERATION_STATUS',
      },
    });
  };

  /**
   * 页面跳转到工艺明细维护页面
   * @param {object} record 行数据
   */
  @Bind()
  showWorkcellDist(record = {}) {
    const { history, dispatch } = this.props;
    cookies.set('search', this.state.search);
    dispatch({
      type: 'technology/updateState',
      payload: {
        technologyItem: record,
      },
    });
    history.push(`/hmes/process/technology/dist/${record.operationId}`);
  }

  /**
   *新建工作单元页面
   * @param {object} record 行数据
   */
  @Bind()
  createWorkcell() {
    const { history, dispatch } = this.props;
    cookies.set('search', this.state.search);
    history.push(`/hmes/process/technology/dist/create`);
    dispatch({
      type: 'technology/updateState',
      payload: {
        technologyItem: {},
      },
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      technology: {
        operationList = [],
        operationPagination = {},
        typeList = [],
        sitesList = [],
        statusList = [],
        workCellList = [],
      },
      loading,
    } = this.props;

    const {search} = this.state;
    const filterProps = {
      search,
      cookies,
      onSearch: this.onSearch,
      onResetSearch: this.onResetSearch,
    };
    const columns = [
      {
        title: intl.get(`${modelPrompt}.operationName`).d('工艺编码'),
        width: 120,
        dataIndex: 'operationName',
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
        title: intl.get(`${modelPrompt}.description`).d('工艺描述'),
        dataIndex: 'description',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.operationType`).d('工艺类型'),
        dataIndex: 'operationType',
        width: 90,
        align: 'center',
        render: val => (typeList.filter(ele => ele.typeCode === val)[0] || {}).description,
      },
      {
        title: intl.get(`${modelPrompt}.siteName`).d('所属站点'),
        dataIndex: 'siteId',
        width: 150,
        render: val => (sitesList.filter(ele => ele.siteId === val)[0] || {}).siteCode,
      },
      {
        title: intl.get(`${modelPrompt}.prodLineTypeDesc`).d('工艺状态'),
        dataIndex: 'operationStatus',
        width: 110,
        render: val => (statusList.filter(ele => ele.statusCode === val)[0] || {}).description,
      },
      {
        title: intl.get(`${modelPrompt}.revision`).d('版本'),
        dataIndex: 'revision',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.completeInconformityFlag`).d('完工不一致标识'),
        dataIndex: 'revision',
        width: 130,
        align: 'center',
        render: val => (
          <Badge
            status={val === 'Y' ? 'success' : 'error'}
            text={
              val === 'Y'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },

      {
        title: intl.get(`${modelPrompt}.currentFlag`).d('当前版本标识'),
        dataIndex: 'currentFlag',
        width: 110,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.currentFlag === 'Y' ? 'success' : 'error'}
            text={
              record.currentFlag === 'Y'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.dateFrom`).d('生效时间从'),
        dataIndex: 'dateFrom',
        width: 160,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.dateTo`).d('生效时间至'),
        dataIndex: 'dateTo',
        width: 160,
        align: 'center',
      },

      {
        title: intl.get(`${modelPrompt}.prodLineTypeDesc`).d('特殊工艺路线'),
        dataIndex: 'specialRouterName',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.workcellType`).d('工作单元类型'),
        dataIndex: 'workcellType',
        width: 110,
        align: 'center',
        render: val => (workCellList.filter(ele => ele.typeCode === val)[0] || {}).description,
      },
      {
        title: intl.get(`${modelPrompt}.prodLineTypeDesc`).d('默认工作单元'),
        dataIndex: 'workcellCode',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.standardReqdTimeInProcess`).d('工艺过程时间'),
        dataIndex: 'standardReqdTimeInProcess',
        width: 110,
      },
      {
        title: intl.get(`${modelPrompt}.standardMaxLoop`).d('最大循环次数'),
        dataIndex: 'standardMaxLoop',
        width: 110,
      },
      {
        title: intl.get(`${modelPrompt}.standardSpecialIntroduction`).d('特殊指令'),
        dataIndex: 'standardSpecialIntroduction',
        // width: 200,
      },
    ];

    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.process.technology.title.list').d('工艺维护')}>
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              this.createWorkcell();
            }}
          >
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <Table
            loading={loading}
            rowKey="operationId"
            dataSource={operationList}
            columns={columns}
            scroll={{ x: tableScrollWidth(columns) }}
            pagination={operationPagination || {}}
            onChange={this.refresh}
            bordered
          />
        </Content>
      </React.Fragment>
    );
  }
}
