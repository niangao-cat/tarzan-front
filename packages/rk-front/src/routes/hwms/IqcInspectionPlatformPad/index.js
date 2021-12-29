/**
 * @Description: IQC检验平台  视图层
 * @author: ywj
 * @date 2020/5/15 14:09
 * @version 1.0
 */
// 引入必要的包
import React from 'react';
import { Header, Content } from 'components/Page';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import ExcelExport from 'components/ExcelExport';
import Cookies from 'universal-cookie';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';import ListTable from './ListTable';
import FilterForm from './FilterForm';
import styles from './index.less';

const cookies = new Cookies();
// 设置通用头信息
const modelPormt = 'tarzan.hwms.IqcInspectionPlatform';
// 连接model层
@connect(({ iqcInspectionPlatform, loading }) => ({
  iqcInspectionPlatform,
  fetchDataLoading: loading.effects['iqcInspectionPlatform/queryBaseData'],
}))
// 导出页面
export default class iqcInspectionPlatform extends React.Component {
  // 构造函数
  constructor(props) {
    // 继承上文的属性
    super(props);

    // 设置状态
    this.state = {
      pagination: {}, // 分页
      search: {}, // 查询参数
      selectedRowKey: [], // 选中的主键
    };
  }

  // 加载时，调用的方法
  componentDidMount() {
    // 设置接口调用
    const { dispatch } = this.props;

    // 加载下拉数据
    dispatch({
      type: 'iqcInspectionPlatform/init',
    });

    if (cookies.get('search') !== undefined && cookies.get('search') !== null) {
      this.setState({search: cookies.get('search') });
      // 加载下拉数据
      dispatch({
        type: 'iqcInspectionPlatform/queryBaseData',
        payload: {
          ...cookies.get('search'),
        },
      });
    } else {
      // 查询信息
      dispatch({
        type: 'iqcInspectionPlatform/queryBaseData',
      });
    }

    cookies.set('search', {});
  }

  // 查询信息
  // 查询绑定
  @Bind
  onSearch(fieldValues) {
    this.setState(
      {
        search: {
          ...fieldValues,
        },
        pagination: {},
      },
      () => {
        this.queryBaseDataBySearch();
      }
    );
  }

  // 分页
  @Bind
  queryDataByPagination(pagination = {}) {
    const { dispatch } = this.props;
    const { search } = this.state;
    dispatch({
      type: 'iqcInspectionPlatform/queryBaseData',
      payload: {
        ...search,
        page: pagination,
      },
    });
  }

  // 查询数据
  queryBaseDataBySearch() {
    const { dispatch } = this.props;

    // 获取查询的参数
    const { pagination, search } = this.state;

    // 调接口
    dispatch({
      type: 'iqcInspectionPlatform/queryBaseData',
      payload: {
        ...search,
        page: pagination,
      },
    });
  }

  // 重置
  @Bind()
  resetState() {
    this.setState({
      pagination: {}, // 分页
      search: {}, // 查询参数
      selectedRowKey: [], // 选中的主键
    });
  }

  // 绑定 数据
  @Bind()
  handleSelect(selectedRowKey) {
    this.setState({ selectedRowKey });
  }

  // 打开看板校验
  @Bind()
  handleOnOpenBoard(record) {
    const { dispatch } = this.props;
    cookies.set('search', this.state.search);
    dispatch(
      routerRedux.push({
        pathname: `/hwms/iqc-inspection-platform-pad/detail/${record.iqcNumber}/${record.iqcHeaderId}`,
      })
    );
  }

  @Bind()
  handleGetFormValue() {
    return filterNullValueObject(this.state.search);
  }

  // 渲染
  render() {
    // 获取model层的状态数据
    const {
      iqcInspectionPlatform: {
        dataList = [], // 日期
        pagination = {}, // 分页
        dealStatusMap = [], // 处理状态
        isStatusMap = [], // 是否加急
        inspectTypeMap = [], // 检验类型
      },
      fetchDataLoading, // 加载事件
    } = this.props;

    // 获取当前状态
    const { selectedRowKey } = this.state;

    // 查询必要参数输入
    const searchProps = {
      dealStatusMap,
      isStatusMap,
      search: this.state.search,
      onSearch: this.onSearch,
      resetState: this.resetState,
    };

    const listProps = {
      dealStatusMap,
      inspectTypeMap,
      pagination,
      loading: fetchDataLoading,
      selectedRowKey,
      handleSelect: this.handleSelect,
      dataSource: dataList,
      onSearch: this.queryDataByPagination,
      handleOnOpenBoard: this.handleOnOpenBoard,
    };

    // 界面返回
    return (
      <React.Fragment>
        <Header title={intl.get(`${modelPormt}.title`).d('IQC检验平台(PAD)')}>
          <ExcelExport
            exportAsync
            requestUrl={`/mes/v1/${getCurrentOrganizationId()}/qms-iqc-check-platform/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue()}
          />
        </Header>
        <Content>
          <FilterForm {...searchProps} />
          <div className={styles.IqcInspectionPlatformPad}>
            <ListTable {...listProps} />
          </div>
        </Content>
      </React.Fragment>
    );
  }
}
