/**
 * @author:lly
 * @email:liyuan.liu@hand-china.com
 * @description:制造中心看板信息维护
 */

// 引入必要的依赖包
import React from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { Button, Spin } from 'hzero-ui';
import {
  addItemToPagination,
  delItemToPagination,
  getEditTableData,
} from 'utils/utils';
import notification from 'utils/notification';
import Filter from './FilterForm';
import HeadTable from './HeadListTable';
import LineTable from './LineListTable';

// 链接model层
@connect(({ makeCenterKanbanInfo, loading }) => ({
  makeCenterKanbanInfo,
  fetchHeadDataLoading: loading.effects['makeCenterKanbanInfo/queryHeadData'],
  fetchLineDataLoading: loading.effects['makeCenterKanbanInfo/queryLineData'],
}))
// 默认导出 视图
export default class makeCenterKanbanInfo extends React.Component {
  // 构造函数  获取上文数据
  constructor(props) {
    super(props);
    // 设置当前静态变量
    this.state = {
      search: {}, // 查询条件
      selectedHeadKeys: [], // 选中的数据主键
      selectedRows: [], // 选中的数据
      loadingHead: false,
      loadingLine: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'makeCenterKanbanInfo/init',
    });
    // 查询站点下拉框
    dispatch({
      type: 'makeCenterKanbanInfo/fetchSiteList',
    });
    dispatch({
      type: 'makeCenterKanbanInfo/fetchDefaultSite',
    });

    // this.onSearch();
  }

  @Bind
  expandColseData() {
    this.setState({ expandDrawer: !this.state.expandDrawer });
  }

  // headList查询
  @Bind
  onSearch(fieldValues) {
    const { dispatch } = this.props;
    this.setState(
      {
        search: {
          ...fieldValues,
        },
        selectedHeadKeys: [],
      },
      () => {
        // 查询头信息
        dispatch({
          type: 'makeCenterKanbanInfo/queryHeadData',
          payload: {
            ...fieldValues,
          },
        });
      }
    );
  }

  // headList分页查询
  @Bind()
  queryHeadByPagination(pagination = {}) {
    const { dispatch } = this.props;
    const { search } = this.state;
    dispatch({
      type: 'makeCenterKanbanInfo/queryHeadData',
      payload: {
        ...search,
        page: pagination,
      },
    });
  }

  // headList新建行
  @Bind()
  handleCreateHead() {
    const {
      dispatch,
      makeCenterKanbanInfo: { headList = [], headPagination = {} },
    } = this.props;
    // 判断新增之前的数据是否有未填写的， 有着报错
    if (
      headList.filter(item => item._status === 'update' || item._status === 'create').length > 0
    ) {
      if (getEditTableData(headList).length === 0) {
        return notification.error({ message: '请先填写必输项' });
      }
    }

    // 进行新增数据
    dispatch({
      type: 'makeCenterKanbanInfo/updateState',
      payload: {
        headList: [
          {
            _status: 'create',
          },
          ...headList,
        ],
        pagination: addItemToPagination(headPagination.length, headPagination),
      },
    });
  }

  // headList编辑
  @Bind()
  handleEditHead(record = {}, index, flag) {
    const {
      dispatch,
      makeCenterKanbanInfo: { headList = [], headPagination = {} },
    } = this.props;

    // 取消时
    if (!flag) {
      // 判断是新增还是更新
      if (record._status === 'create') {
        dispatch({
          type: 'makeCenterKanbanInfo/updateState',
          payload: {
            headList: headList.filter(item => item._status !== 'create'),
            pagination: delItemToPagination(headPagination.length, headPagination),
          },
        });
      } else {
        headList[index]._status = '';
        dispatch({
          type: 'makeCenterKanbanInfo/updateState',
          payload: {
            headList,
          },
        });
      }
    } else {
      headList[index]._status = 'update';
      dispatch({
        type: 'makeCenterKanbanInfo/updateState',
        payload: {
          headList,
        },
      });
    }
  }

  // headList保存
  @Bind
  handleSaveHead(record, index) {
    const {
      dispatch,
      makeCenterKanbanInfo: { headList = [] },
    } = this.props;
    record.$form.validateFields(err => {
      if (!err) {
        // 调用保存接口
        dispatch({
          type: 'makeCenterKanbanInfo/saveHeadData',
          payload: {
            ...headList[index],
            ...record.$form.getFieldsValue(),
          },
        }).then(res => {
          if (res) {
            notification.success({ message: '保存成功' });
            headList[index] = { ...res };
            headList[index]._status = '';
            dispatch({
              type: 'makeCenterKanbanInfo/updateState',
              payload: {
                headList,
              },
            });
            this.queryHeadByPagination();
            this.setState({ selectedHeadKeys: [] });
          } else {
            notification.error({ message: res ? res.message : '未知错误请联系管理员' });
          }
        });
      }
    });
  }

// =================================================================

  // lineList查询
  @Bind()
  onClickHeadRadio(selectedHeadKeys, selectedRows) {
    const { dispatch } = this.props;
    this.setState({ selectedHeadKeys });
    this.setState({ selectedRows });
    dispatch({
      type: 'makeCenterKanbanInfo/queryLineData',
      payload: {
        centerKanbanHeaderId: selectedHeadKeys[0],
      },
    });
  }

  // lineList分页查询
  @Bind()
  queryLineByPagination(pagination = {}) {
    const { dispatch } = this.props;
    const { selectedHeadKeys } = this.state;
    dispatch({
      type: 'makeCenterKanbanInfo/queryLineData',
      payload: {
        centerKanbanHeaderId: selectedHeadKeys[0],
        page: pagination,
      },
    });
  }

  // lineList新增行
  @Bind()
  handleCreateLine() {
    const {
      dispatch,
      makeCenterKanbanInfo: { lineList = [], linePagination = {} },
    } = this.props;
    const { selectedHeadKeys } = this.state;
    if(selectedHeadKeys.length<=0){
      return notification.error({message: "请先选择头信息"});
    }
    if (
      lineList.filter(item => item._status === 'update' || item._status === 'create').length > 0
    ) {
      if (getEditTableData(lineList).length === 0) {
        return notification.error({ message: '请先填写必输项' });
      }
    }
    dispatch({
      type: 'makeCenterKanbanInfo/updateState',
      payload: {
        lineList: [
          {
            centerKanbanHeaderId: selectedHeadKeys[0],
            _status: 'create',
          },
          ...lineList,
        ],
        linePagination: addItemToPagination(linePagination.length, linePagination),
      },
    });
  }

  // lineList编辑
  @Bind()
  handleEditLine(record = {}, index, flag) {
    const {
      dispatch,
      makeCenterKanbanInfo: { lineList = [], linePagination = {} },
    } = this.props;

    // 取消时
    if (!flag) {
      // 判断是新增还是更新
      if (record._status === 'create') {
        dispatch({
          type: 'makeCenterKanbanInfo/updateState',
          payload: {
            lineList: lineList.filter(item => item._status !== 'create'),
            pagination: delItemToPagination(linePagination.length, linePagination),
          },
        });
      } else {
        lineList[index]._status = '';
        dispatch({
          type: 'makeCenterKanbanInfo/updateState',
          payload: {
            lineList,
          },
        });
      }
    } else {
      lineList[index]._status = 'update';
      dispatch({
        type: 'makeCenterKanbanInfo/updateState',
        payload: {
          lineList,
        },
      });
    }
  }

  // lineList保存
  @Bind
  handleSaveLine(record, index) {
    const {
      dispatch,
      makeCenterKanbanInfo: { lineList = [] },
    } = this.props;
    record.$form.validateFields(err => {
      if (!err) {
        // 调用保存接口
        dispatch({
          type: 'makeCenterKanbanInfo/saveLineData',
          payload: {
            ...lineList[index],
            ...record.$form.getFieldsValue(),
          },
        }).then(res => {
          if (res) {
            notification.success({ message: '保存成功' });
            lineList[index] = { ...res };
            lineList[index]._status = '';
            dispatch({
              type: 'makeCenterKanbanInfo/updateState',
              payload: {
                lineList,
              },
            });
            this.queryLineByPagination();
          } else {
            notification.error({ message: res ? res.message : '未知错误请联系管理员' });
          }
        });
      }
    });
  }

  // 重置
  @Bind()
  resetSearch = () => {
    this.setState({
      search: {},
    });
  };

  // 设置显示值
  @Bind
  setHeadCode(index, name, data) {
    const {
      dispatch,
      makeCenterKanbanInfo: { headList = [] },
    } = this.props;
    headList[index][name] = data;
    dispatch({
      type: 'makeCenterKanbanInfo/updateState',
      payload: {
        headList,
      },
    });
  }

  // 渲染
  render() {

    const {
      makeCenterKanbanInfo: {
        headList = [],
        headPagination = {},
        lineList = [],
        linePagination = {},
        siteMap = [],
        siteInfo = {},
        kanbanAreaMap = [],
        flagMap = [],
      },
      fetchHeadDataLoading,
      fetchLineDataLoading,
    } = this.props;
    const { selectedHeadKeys, selectedRows } = this.state;
    // 设置查询参数
    const searchProps = {
      siteMap,
      siteInfo,
      kanbanAreaMap,
      resetSearch: this.resetSearch,
      onSearch: this.onSearch,
    };

    // 设置头表参数
    const headProps = {
      siteMap,
      siteInfo,
      kanbanAreaMap,
      flagMap,
      dataSource: headList,
      pagination: headPagination,
      loading: fetchHeadDataLoading,
      selectedHeadKeys,
      onSearch: this.queryHeadByPagination,
      onClickHeadRadio: this.onClickHeadRadio,
      handleEditHead: this.handleEditHead,
      handleSaveHead: this.handleSaveHead,
      handleSetCode: this.setHeadCode,
    };

    // 设置行表参数
    const lineProps = {
      selectedRows,
      flagMap,
      dataSource: lineList,
      pagination: linePagination,
      loading: fetchLineDataLoading,
      onSearch: this.queryLineByPagination,
      handleCreate: this.handleCreateLine,
      handleEditLine: this.handleEditLine,
      handleSaveLine: this.handleSaveLine,
    };

    // 返回视图解析
    return (
      <div>
        <Header title={intl.get(`title`).d('制造中心看板信息维护')}>
          <Button
            icon="plus"
            type="primary"
            onClick={this.handleCreateHead}
          >
            {intl.get('tarzan.acquisition.makeCenterKanbanInfo.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <Filter {...searchProps} />
          <Spin spinning={this.state.loadingHead}>
            <HeadTable {...headProps} />
          </Spin>
          <Spin spinning={this.state.loadingLine}>
            <LineTable {...lineProps} />
          </Spin>
        </Content>
      </div>
    );
  }
}
