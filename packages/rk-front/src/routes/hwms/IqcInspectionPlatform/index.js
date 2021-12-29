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
import formatterCollections from 'utils/intl/formatterCollections';
import ExcelExport from 'components/ExcelExport';
import Cookies from 'universal-cookie';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { isEmpty } from 'lodash';
import ListTable from './ListTable';
import FilterForm from './FilterForm';
import Drawer from './Drawer';
import BookDrawer from './IQCQualityPlatform/BookDrawer';
import BookDetialOneDrawer from './IQCQualityPlatform/BookDetialOneDrawer';
import BookDetialTwoDrawer from './IQCQualityPlatform/BookDetialTwoDrawer';

const cookies = new Cookies();
// 设置通用头信息
const modelPormt = 'tarzan.hwms.IqcInspectionPlatform';
// 连接model层
@connect(({ iqcInspectionPlatform, loading }) => ({
  iqcInspectionPlatform,
  fetchDataLoading: loading.effects['iqcInspectionPlatform/queryBaseData'],
  fetchMaterialLotCodeSLLoading: loading.effects['iqcInspectionPlatform/fetchMaterialLotCodeSL'],
  bookLoading: loading.effects['iqcInspectionPlatform/queryBook'],
  bookDetailLoading: loading.effects['iqcInspectionPlatform/bookShowOne'],
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
      iqcRecord: {},
      drawerFlag: false,
      bookDrawer: false,
      bookDetailtwoDrawer: false,
      bookDetailOneDrawer: false,
      fileUrl: "",
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
    this.setState({ pagination: cookies.get('page') });
    if (cookies.get('search') !== undefined && cookies.get('search') !== null) {
      this.setState({ search: cookies.get('search') });
      // 加载下拉数据
      dispatch({
        type: 'iqcInspectionPlatform/queryBaseData',
        payload: {
          ...cookies.get('search'),
          page: cookies.get('page'),
        },
      });
    } else {
      // 查询信息
      dispatch({
        type: 'iqcInspectionPlatform/queryBaseData',
        payload: {
          page: cookies.get('page'),
        },
      });
    }

    cookies.set('search', {});
    cookies.set('page', {});
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
        selectedRowKey: [],
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
    this.setState({ selectedRowKey: []});
    this.setState({pagination});
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
    this.setState({ selectedRowKey: []});
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

  // 弹框文件
  @Bind
  bookShow(iqcHeaderId){
    // 界面显示
    this.setState({bookDrawer: true}, ()=>{
      const { dispatch } = this.props;
      dispatch({
        type: 'iqcInspectionPlatform/queryBook',
        payload: {
          iqcHeaderId,
        },
      });
    });
  }

  // 打开看板校验
  @Bind()
  handleOnOpenBoard(record) {
    const { dispatch } = this.props;
    cookies.set('search', this.state.search);
    cookies.set('page', this.state.pagination);
    dispatch(
      routerRedux.push({
        pathname: `/hwms/iqc-inspection-platform/detail/${record.iqcNumber}/${record.iqcHeaderId}`,
      })
    );
  }

  // 打开抽屉
  @Bind()
  handleOpenDrawerFlag(flag, record) {
    this.setState({ drawerFlag: flag, iqcRecord: record }, () => {
      if (flag) {
        this.fetchMaterialLotCodeSL();
      }
    });
  }

  // 查询物料批及供应商批次
  @Bind()
  fetchMaterialLotCodeSL(fields = {}) {
    const { dispatch } = this.props;
    const { iqcRecord } = this.state;
    dispatch({
      type: 'iqcInspectionPlatform/fetchMaterialLotCodeSL',
      payload: {
        ...iqcRecord,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  @Bind()
  handleGetFormValue() {
    return filterNullValueObject(this.state.search);
  }

  @Bind
  closeBook(){
    this.setState({bookDrawer: false});
  }

  @Bind
  closeBookDtail(){
    this.setState({bookDetailOneDrawer: false, bookDetailtwoDrawer: false });
  }

  @Bind
  showBookDetail(record)
  {
    if(record.importType === "D"){
      this.setState({bookDetailOneDrawer: true, fileUrl: record.fileUrl }, ()=>{
        const {dispatch} = this.props;
        dispatch({
          type: 'iqcInspectionPlatform/bookShowOne',
          payload: {
            fileUrl: record.fileUrl,
          },
        });
      });
    }else{
      this.setState({bookDetailtwoDrawer: true, fileUrl: record.fileUrl }, ()=>{
        const {dispatch} = this.props;
        dispatch({
          type: 'iqcInspectionPlatform/bookShowOne',
          payload: {
            fileUrl: record.fileUrl,
          },
        });
      });
    }
  }

  @Bind
  queryBookDetail(page = {}){
    const {dispatch} = this.props;
    dispatch({
      type: 'iqcInspectionPlatform/bookShowOne',
      payload: {
        fileUrl: this.state.fileUrl,
        page,
      },
    });
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
        materialLotCodeSLListPagination = {},
        materialLotCodeSLList = [],
        bookList = [],
        bookDetailList = [],
        bookDetailPagination = {},
      },
      fetchDataLoading, // 加载事件
      fetchMaterialLotCodeSLLoading,
      bookLoading,
      bookDetailLoading,
    } = this.props;

    // 获取当前状态
    const { selectedRowKey, drawerFlag,
      bookDrawer,
      bookDetailOneDrawer,
      bookDetailtwoDrawer } = this.state;

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
      handleOpenDrawerFlag: this.handleOpenDrawerFlag,
      onBookShow: this.bookShow,
    };

    const modalProps = {
      visible: drawerFlag,
      dataSource: materialLotCodeSLList,
      pagination: materialLotCodeSLListPagination,
      loading: fetchMaterialLotCodeSLLoading,
      onCancel: this.handleOpenDrawerFlag,
      handleSearch: this.fetchMaterialLotCodeSL,
    };

    // 地址
    const bookProps = {
      visible: bookDrawer,
      dataSource: bookList,
      loading: bookLoading,
      onClose: this.closeBook,
      onShowBookDetail: this.showBookDetail,
    };

    const bookDetailOneProps = {
      visible: bookDetailOneDrawer,
      dataSource: bookDetailList,
      loading: bookDetailLoading,
      onSearch: this.queryBookDetail,
      onClose: this.closeBookDtail,
      pagination: bookDetailPagination,
    };

    const bookDetailtwoProps = {
      visible: bookDetailtwoDrawer,
      dataSource: bookDetailList,
      loading: bookDetailLoading,
      onSearch: this.queryBookDetail,
      onClose: this.closeBookDtail,
      pagination: bookDetailPagination,
    };

    // 界面返回
    return (
      <React.Fragment>
        <Header title={intl.get(`${modelPormt}.title`).d('IQC检验平台')}>
          <ExcelExport
            exportAsync
            requestUrl={`/mes/v1/${getCurrentOrganizationId()}/qms-iqc-check-platform/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue()}
          />
        </Header>
        <Content>
          <FilterForm {...searchProps} />
          <ListTable {...listProps} />
          {drawerFlag && <Drawer {...modalProps} />}
          {bookDrawer && <BookDrawer {...bookProps} />}
          {bookDetailOneDrawer && <BookDetialOneDrawer {...bookDetailOneProps} />}
          {bookDetailtwoDrawer && <BookDetialTwoDrawer {...bookDetailtwoProps} />}
        </Content>
      </React.Fragment>
    );
  }
}
