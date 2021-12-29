/**
 * @Description: IQC检验平台  视图层
 * @author: ywj
 * @date 2020/5/15 14:09
 * @version 1.0
 */
// 引入必要的包
import React from 'react';
import { Header, Content } from 'components/Page';
import { notification } from 'hzero-ui';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { isEmpty } from 'lodash';
import ListTable from './ListTable';
import FilterForm from './FilterForm';
// 设置通用头信息
const modelPormt = 'tarzan.hwms.IqcInspectionPlatform';
// 连接model层
@connect(({ iqcInspectionPlatform, loading }) => ({
  iqcInspectionPlatform,
  fetchDataLoading: loading.effects['iqcInspectionPlatform/queryBaseData'],
}))
// 用于多语言的注解使用
@formatterCollections({ code: 'tarzan-mes:InventoryAllocation' })
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
      selectedRow: [], // 选中的数据
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

    // 查询信息
    dispatch({
      type: 'iqcInspectionPlatform/queryBaseData',
    });
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
  queryDataByPagination(pagination) {
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
      selectedRow: [], // 选中的数据
    });
  }

  // 绑定 数据
  @Bind()
  handleSelect(selectedRowKey, selectedRow) {
    this.setState({ selectedRowKey, selectedRow });
  }

  // 打开看板校验
  @Bind()
  handleOnOpenBoard() {
    const { selectedRow } = this.state;
    if (isEmpty(selectedRow)) {
      notification.error({ message: '请先选中要检验的数据' });
    } else {
      const { dispatch } = this.props;

      dispatch(
        routerRedux.push({
          pathname: `/hmes/iqc-quality-platform`,
          params: {
            parentItem: selectedRow,
          },
        })
      );
    }
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
        fetchDataLoading, // 加载事件
      },
    } = this.props;

    // 获取当前状态
    const { selectedRowKey } = this.state;

    // 查询必要参数输入
    const searchProps = {
      dealStatusMap,
      isStatusMap,
      onSearch: this.onSearch,
      resetState: this.resetState,
      handleOnOpenBoard: this.handleOnOpenBoard,
    };

    const listProps = {
      pagination,
      loading: fetchDataLoading,
      selectedRowKey,
      dataSource: dataList,
      onSearch: this.onSearch,
    };

    // 界面返回
    return (
      <div>
        <Header title={intl.get(`${modelPormt}.title`).d('IQC检验平台')} />
        <Content>
          <FilterForm {...searchProps} />
          <ListTable {...listProps} />
        </Content>
      </div>
    );
  }
}
