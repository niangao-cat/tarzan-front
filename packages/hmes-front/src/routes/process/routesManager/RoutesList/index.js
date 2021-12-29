/**
 * @description: 库位组维护入口页面
 * @author: 唐加旭
 * @date: 2019-08-15 14:03:18
 * @version: V0.0.1
 * */
import React from 'react';
import { connect } from 'dva';
import { Button, Badge } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { tableScrollWidth } from 'utils/utils';
import notification from 'utils/notification';
import EditTable from 'components/EditTable';
import Cookies from 'universal-cookie';
import { openTab } from 'utils/menuTab';
import queryString from 'querystring';
import FilterForm from './filterForm';

const cookies = new Cookies();
const modelPrompt = 'tarzan.process.routes.model.routes';

@connect(({ routes, loading }) => ({
  routes,
  tabLoading: loading.effects['routes/fetchRouteList'],
  deleteLoading: loading.effects['routes/removeRoutesList'],
}))
@formatterCollections({
  code: 'tarzan.process.routes',
})
export default class LocatorGroup extends React.Component {
  state = {
    search: {},
    selectedRowKeys: [],
  };

  componentDidMount() {

    if (cookies.get('search') !== undefined && cookies.get('search') !== null && cookies.get('search') !== "") {

      this.setState({search: cookies.get('search')});
      const { dispatch } = this.props;
      dispatch({
        type: 'routes/fetchRouteList',
        payload: {
          ...cookies.get('search'),
          page: {},
        },
      }).then(res => {
        if (res && !res.success) {
          notification.error({
            message: res.message,
          });
        }
      });
    } else {
      this.refresh();
    }
    this.fetchTypeOption();
    this.fetchStatusOption();
    cookies.set('search', {});
    // TODO 请求工艺路线类型
  }

  fetchTypeOption = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'routes/fetchSelectOption',
      payload: {
        typeGroup: 'ROUTER_TYPE',
        module: 'ROUTER',
      },
    });
  };

  fetchStatusOption = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'routes/fetchStatusOption',
      payload: {
        statusGroup: 'ROUTER_STATUS',
        module: 'ROUTER',
      },
    });
  };

  @Bind()
  refresh = (pagination = {}) => {
    const { dispatch } = this.props;
    const { search } = this.state;
    dispatch({
      type: 'routes/fetchRouteList',
      payload: {
        ...search,
        page: pagination,
      },
    }).then(res => {
      if (res && !res.success) {
        notification.error({
          message: res.message,
        });
      }
    });
  };

  /**
   *@functionName:   onSearch
   * @params {Object} fieldsValue 搜索条件
   *@description: 缓存搜索条件并进行查询
   *@author: 唐加旭
   *@date: 2019-08-15 14:37:31
   *@version: V0.0.1
   * */
  @Bind()
  onSearch = (fieldsValue = {}) => {
    this.setState(
      {
        search: fieldsValue,
      },
      () => {
        this.refresh();
      }
    );
  };

  /**
   *@functionName:   onResetSearch
   *@description: 清除搜索条件缓存
   *@author: 唐加旭
   *@date: 2019-08-15 14:39:09
   *@version: V0.8.6
   * */
  @Bind()
  onResetSearch = () => {
    cookies.set('search', {});
    this.setState({
      search: {},
    });
  };

  /**
   *@functionName:   createList
   *@description 创建新的工艺路线
   *@author: 唐加旭
   *@date: 2019-10-08 15:37:36
   *@version: V0.8.6
   * */
  createList = record => {
    cookies.set('search', this.state.search);
    const { history } = this.props;
    // TODO 设置id
    const id = record ? record.routerId : 'create';
    history.push(`/hmes/process/routes/dist/${id}`);
  };

  /**
   *@functionName   onChange
   *@description 选择删除项
   *@author: 唐加旭
   *@date 2019-10-08 16:05:51
   *@version: V0.8.6
   * */
  onChange = selectedRowKeys => {
    this.setState({
      selectedRowKeys,
    });
  };

  @Bind()
  exImportExcel() {
    openTab({
      key: `/hmes/process/routes/data-import/HME.ROUTER_LABCODE`,
      title: intl.get('hmes.commentImport.view.button.templateImport').d('工艺路线实验代码导入'),
      search: queryString.stringify({
        action: intl.get('hmes.commentImport.view.button.templateImport').d('工艺路线实验代码导入'),
      }),
    });
  }

  render() {
    const {
      tabLoading,
      routes: { routesList = [], routesListPagination = {}, typeList = [], statusList = [] },
    } = this.props;
    const { selectedRowKeys, search } = this.state;

    const filterProps = {
      search,
      onSearch: this.onSearch,
      onResetSearch: this.onResetSearch,
    };

    const columns = [
      {
        title: intl.get(`${modelPrompt}.routerName`).d('工艺路线编码'),
        width: 140,
        dataIndex: 'routerName',
        render: (val, record) => <a onClick={() => this.createList(record)}>{val}</a>,
      },
      {
        title: intl.get(`${modelPrompt}.routerType`).d('工艺路线类型'),
        dataIndex: 'routerType',
        width: 120,
        render: val => (typeList.filter(ele => ele.typeCode === val)[0] || {}).description,
        // TODO 类型
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('工艺路线描述'),
        dataIndex: 'description',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.routerStatus`).d('工艺路线状态'),
        dataIndex: 'routerStatus',
        width: 120,
        render: val => (statusList.filter(ele => ele.statusCode === val)[0] || {}).description,
      },
      {
        title: intl.get(`${modelPrompt}.revision`).d('版本'),
        dataIndex: 'revision',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.currentFlag`).d('当前版本'),
        dataIndex: 'currentFlag',
        width: 90,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.currentFlag !== 'N' ? 'success' : 'error'}
            text={
              record.currentFlag !== 'N'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.autoRevisionFlag`).d('自动升级版本标识'),
        dataIndex: 'autoRevisionFlag',
        width: 150,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.autoRevisionFlag !== 'N' ? 'success' : 'error'}
            text={
              record.autoRevisionFlag !== 'N'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.relaxedFlowFlag`).d('松散标识'),
        dataIndex: 'relaxedFlowFlag',
        width: 90,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.relaxedFlowFlag !== 'N' ? 'success' : 'error'}
            text={
              record.relaxedFlowFlag !== 'N'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.hasBeenReleasedFlag`).d('已下达EO'),
        dataIndex: 'hasBeenReleasedFlag',
        width: 90,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.hasBeenReleasedFlag !== 'N' ? 'success' : 'error'}
            text={
              record.hasBeenReleasedFlag !== 'N'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.dateFrom`).d('生效时间从'),
        dataIndex: 'dateFrom',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.dateTo`).d('生效时间至'),
        dataIndex: 'dateTo',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.bomName`).d('装配清单'),
        dataIndex: 'bomName',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.copiedFromRouterName`).d('来源工艺路线'),
        dataIndex: 'copiedFromRouterName',
      },
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onChange,
    };
    return (
      <>
        <Header title={intl.get('tarzan.process.routes.title.list').d('工艺路线维护')}>
          <Button icon="plus" type="primary" onClick={() => this.createList()}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button type="primary" onClick={() => this.exImportExcel()}>
            {intl.get(`tarzan.process.routes.button.create`).d('工艺路线实验代码导入')}
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <EditTable
            loading={tabLoading}
            rowKey="routerId"
            rowSelection={rowSelection}
            dataSource={routesList}
            columns={columns}
            scroll={{ x: tableScrollWidth(columns) }}
            pagination={routesListPagination || {}}
            onChange={this.refresh}
            bordered
          />
        </Content>
      </>
    );
  }
}
