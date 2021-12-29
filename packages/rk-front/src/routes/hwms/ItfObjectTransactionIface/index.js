/**
 *接口监控平台
 */
import React from 'react';
import { connect } from 'dva';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ itfObjectTransactionIface, loading }) => ({
  itfObjectTransactionIface,
  fetchLoading: loading.effects['itfObjectTransactionIface/queryList'],
  saveLoading: loading.effects['itfObjectTransactionIface/saveOne'],
}))
@formatterCollections({ code: 'tarzan.itfObjectTransactionIface' })
export default class ItfObjectTransactionIface extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: {}, // 条件信息
    };
  }

  // 加载时调用
  componentDidMount() {
  }

  // 条件查询
  @Bind()
  fetchList(filedValues) {
    const { dispatch } = this.props;
    this.setState({search: filedValues});
    dispatch({
      type: "itfObjectTransactionIface/queryList",
      payload: {
        ...filedValues,
      },
    });
  }

  // 重置查询
  @Bind()
  handleFormReset(){
    this.setState({search: {}});
  }

  // 分页查询
  @Bind()
  fetchListByPagination(page= {}) {
    const { dispatch } = this.props;
    dispatch({
      type: "itfObjectTransactionIface/queryList",
      payload: {
        ...this.state.search,
        page,
      },
    });
  }

  // 修改数据
  @Bind()
  handleEditOne(record, flag) {
    const {
      dispatch,
      itfObjectTransactionIface: { listData },
    } = this.props;
    const newList = listData.map(item => {
      if (record.ifaceId === item.ifaceId) {
        return { ...item, _status: flag ? 'update' : '' };
      } else {
        return item;
      }
    });
    dispatch({
      type: 'itfObjectTransactionIface/updateState',
      payload: { listData: newList },
    });
  }

  // 保存事件请求类型
  @Bind
  handleSaveOne(record, index) {
    const {
      dispatch,
      itfObjectTransactionIface: { listData = [] },
    } = this.props;
    record.$form.validateFields((err, value) => {
      if (!err) {
        dispatch({
          type: 'itfObjectTransactionIface/saveOne',
          payload: {
            ifaceId: record.ifaceId,
            bomReserveNum: value.bomReserveNum,
            bomReserveLineNum: value.bomReserveLineNum,
            processStatus: value.processStatus,
            remark: value.remark,
          },
        }).then(res => {
          if(res){
            listData[index] = {
              ...record,
              bomReserveNum: value.bomReserveNum,
              bomReserveLineNum: value.bomReserveLineNum,
              processStatus: value.processStatus,
              remark: value.remark,
              _status: '',
            };
            dispatch({
              type: 'itfObjectTransactionIface/updateState',
              payload: {
                listData,
              },
            });
            notification.success({message: '保存成功'});
          }
        });
      }
    });
  }


  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { itfObjectTransactionIface: { listData = [], pagination = {}}, fetchLoading, saveLoading} = this.props;

    // 查询
    const filterProps = {
      onSearch: this.fetchList,
      handleFormReset: this.handleFormReset,
    };

    // 表格操作
    const tableProps = {
      dataSource: listData,
      pagination,
      loading: fetchLoading||saveLoading,
      searchByPagination: this.fetchListByPagination,
      editOne: this.handleEditOne,
      saveOne: this.handleSaveOne,
    };
    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.event.type.title.list').d('接口监控平台')} />
        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...tableProps} />
        </Content>
      </React.Fragment>
    );
  }
}
