/**
 * @author:ywj
 * @email:wenjie.yang01@hand-china.com
 * @description: 外协管理平台 视图层（进入）
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
} from 'utils/utils';
import notification from 'utils/notification';
import Filter from './FilterForm';
import HeadTable from './HeadTable';
import LineTable from './LineTable';
import ExpandDrawer from './CreateForm/index';
// eslint-disable-next-line no-unused-vars
import styles from './index.less';

// 链接model层
@connect(({ selectionRuleMaintenance, loading }) => ({
  selectionRuleMaintenance,
  fetchHeadDataLoading: loading.effects['selectionRuleMaintenance/queryHeadData'],
  fetchLineDataLoading: loading.effects['selectionRuleMaintenance/queryLineData'],
  fetchDetailDataLoading: loading.effects['selectionRuleMaintenance/queryLineSecData'],
  saveLineSecDataLoading: loading.effects['selectionRuleMaintenance/saveLineSecData'],
  deleteLineSecDataLoading: loading.effects['selectionRuleMaintenance/deleteLineSecData'],
}))
// 默认导出 视图
export default class selectionRuleMaintenance extends React.Component {
  // 构造函数  获取上文数据
  constructor(props) {
    super(props);
    // 设置当前静态变量
    this.state = {
      search: {}, // 查询条件
      paginationHead: {}, // 翻页
      selectedHeadKeys: [], // 选中的数据主键
      paginationLine: {}, // 翻页
      paginationLineSec: {}, // 翻页
      loadingHead: false,
      loadingLine: false,
      loadingLineSec: false,
      expandDrawer: false,
      cosRuleId: "",
    };
  }

  @Bind
  expandColseData() {
    this.setState({ expandDrawer: !this.state.expandDrawer });
  }

  // 查询绑定
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
          type: 'selectionRuleMaintenance/queryHeadData',
          payload: {
            ...fieldValues,
          },
        });
      }
    );
  }

  // 分页查询
  @Bind()
  queryHeadByPagination(pagination = {}) {
    const { dispatch } = this.props;
    const { search } = this.state;
    this.setState({paginationHead: pagination });
    dispatch({
      type: 'selectionRuleMaintenance/queryHeadData',
      payload: {
        ...search,
        page: pagination,
      },
    });
  }

  // 分页查询
  @Bind()
  queryLineByPagination(pagination = {}) {
    const { dispatch } = this.props;
    const { selectedHeadKeys } = this.state;
    this.setState({paginationLine: pagination });
    dispatch({
      type: 'selectionRuleMaintenance/queryLineData',
      payload: {
        cosRuleId: selectedHeadKeys[0],
        page: pagination,
      },
    });
  }

   // 分页查询
   @Bind()
   queryLineSecByPagination(pagination = {}) {
     const { dispatch } = this.props;
     const { cosRuleId } = this.state;
     this.setState({paginationLineSec: pagination});
     dispatch({
       type: 'selectionRuleMaintenance/queryLineSecData',
       payload: {
         cosRuleId,
         page: pagination,
       },
     });
   }

  // 重置
  @Bind()
  resetSearch = () => {
    this.setState({
      search: {},
    });
  };

  // 查询行数据
  @Bind()
  onClickHeadRadio(selectedHeadKeys) {
    const { dispatch } = this.props;
    this.setState({ selectedHeadKeys });
    dispatch({
      type: 'selectionRuleMaintenance/queryLineData',
      payload: {
        cosRuleId: selectedHeadKeys[0],
      },
    });
  }

  @Bind()
  onDetailData(cosRuleId){
    this.setState({expandDrawer: true, cosRuleId});
    const { dispatch } = this.props;
    dispatch({
      type: 'selectionRuleMaintenance/queryLineSecData',
      payload: {
        cosRuleId,
      },
    });
  }

  // 加载时调用的方法
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'selectionRuleMaintenance/init',
    });
    this.onSearch();
  }

  @Bind()
  changeMaterial(record, index){
    const {
      dispatch,
      selectionRuleMaintenance: { headList = [] },
    } = this.props;
    headList[index].materialId = record.materialId;
    headList[index].materialCode = record.materialCode;
    headList[index].materialName = record.materialName;
    dispatch({
      type: 'selectionRuleMaintenance/updateState',
      payload: {
        headList,
      },
    });
  }

  /**
   * 新建头
   */
  @Bind()
  handleCreateHead() {
    const {
      dispatch,
      selectionRuleMaintenance: { headList = [], headPagination = {} },
    } = this.props;
    if (
      headList.length === 0 ||
      (headList.length > 0 && headList[0]._status !== 'create')
    ) {
      dispatch({
        type: 'selectionRuleMaintenance/updateState',
        payload: {
          headList: [
            {
              _status: 'create',
            },
            ...headList,
          ],
          headPagination: addItemToPagination(headList.length, headPagination),
        },
      });
    }
  }

  // 新增行信息
  @Bind()
  createLine() {
    const {
      dispatch,
      selectionRuleMaintenance: { lineList = [], linePagination = {} },
    } = this.props;
    const { selectedHeadKeys } = this.state;
    if(selectedHeadKeys.length<=0){
     return notification.error({message: "请先选择头信息"});
    }
    if (
      lineList.length === 0 ||
      (lineList.length > 0 && lineList[0]._status !== 'create')
    ){
      dispatch({
        type: 'selectionRuleMaintenance/updateState',
        payload: {
          lineList: [
            {
              cosRuleId: selectedHeadKeys[0],
              _status: 'create',
            },
            ...lineList,
          ],
          linePagination: addItemToPagination(10, linePagination),
        },
      });
    }
  }

  // 新增行信息
  @Bind()
  createLineSec() {
    const {
      dispatch,
      selectionRuleMaintenance: { lineSecList = [], lineSecPagination = {} },
    } = this.props;
    const { cosRuleId } = this.state;
    if(cosRuleId===""){
     return notification.error({message: "请先选择头信息"});
    }
    if (
      lineSecList.length === 0 ||
      (lineSecList.length > 0 && lineSecList[0]._status !== 'create')
    ){
      dispatch({
        type: 'selectionRuleMaintenance/updateState',
        payload: {
          lineSecList: [
            {
              cosRuleId,
              _status: 'create',
            },
            ...lineSecList,
          ],
          lineSecPagination: addItemToPagination(10, lineSecPagination),
        },
      });
    }
  }

  // 保存消息
  @Bind
  handleSaveData(record) {
    const {
      dispatch,
    } = this.props;
    record.$form.validateFields((err, fieldsValue) => {
      if (!err) {
        this.setState({loadingHead: !this.state.loadingHead});
        dispatch({
          type: 'selectionRuleMaintenance/saveHeadData',
          payload: {
            ...fieldsValue,
            cosRuleId: record.cosRuleId,
          },
        }).then(res => {
          if (res) {
            this.queryHeadByPagination(this.state.paginationHead);
          } else if(res!==undefined){
              notification.error({
                message: res.message,
              });
            }
          this.setState({loadingHead: !this.state.loadingHead});
        });
      }
    });
  }

    // 保存消息
    @Bind
    handleSaveLineData(record) {
      this.setState({loadingLine: !this.state.loadingLine});
      const {
        dispatch,
      } = this.props;
      record.$form.validateFields((err, fieldsValue) => {
        if (!err) {
          dispatch({
            type: 'selectionRuleMaintenance/saveLineData',
            payload: {
              ...record,
              ...fieldsValue,
            },
          }).then(res => {
            if (res) {
              this.queryLineByPagination(this.state.paginationLine);
            } else if(res!==undefined){
              notification.error({
                message: res.message,
              });
            }
            this.setState({loadingLine: !this.state.loadingLine});
          });
        }
      });
    }

      // 保存消息
      @Bind
      handleSaveLineSecData(record) {
        this.setState({loadingLineSec: !this.state.loadingLineSec});
        const {
          dispatch,
        } = this.props;
        record.$form.validateFields((err, fieldsValue) => {
          if (!err) {
            dispatch({
              type: 'selectionRuleMaintenance/saveLineSecData',
              payload: {
                ...record,
                ...fieldsValue,
                powerSinglePoint: (fieldsValue.powerSinglePoint===''||fieldsValue.powerSinglePoint===null||fieldsValue.powerSinglePoint===undefined)?'':fieldsValue.powerSinglePoint,
              },
            }).then(res => {
              if (res) {
                this.queryLineSecByPagination(this.state.paginationLineSec);
              } else if(res!==undefined){
                notification.error({
                  message: res.message,
                });
              }
              this.setState({loadingLineSec: !this.state.loadingLineSec});
            });
          }
        });
      }

  // 取消编辑替代组
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      selectionRuleMaintenance: { headList, headPagination = {} },
    } = this.props;
    const newList = headList.filter(item => item.cosContainerId !== record.cosContainerId);
    dispatch({
      type: 'selectionRuleMaintenance/updateState',
      payload: {
        messageList: newList,
        messagePagination: delItemToPagination(10, headPagination),
      },
    });
  }

  /**
   * 编辑消息
   */
  @Bind()
  handleEditData(record, flag) {
    const {
      dispatch,
      selectionRuleMaintenance: { headList },
    } = this.props;
    const newList = headList.map(item => {
      if (record.cosRuleId === item.cosRuleId) {
        return { ...item, _status: flag ? 'update' : '', changeModuleDesc: undefined };
      } else {
        return item;
      }
    });
    dispatch({
      type: 'selectionRuleMaintenance/updateState',
      payload: { headList: newList },
    });
  }

   /**
   * 编辑消息
   */
  @Bind()
  handleEditLineData(record, flag) {
    const {
      dispatch,
      selectionRuleMaintenance: { lineList },
    } = this.props;
    const newList = lineList.map(item => {
      if (record.cosRuleLogicId === item.cosRuleLogicId) {
        return { ...item, _status: flag ? 'update' : '', changeModuleDesc: undefined };
      } else {
        return item;
      }
    });
    dispatch({
      type: 'selectionRuleMaintenance/updateState',
      payload: { lineList: newList },
    });
  }

   /**
   * 编辑消息
   */
  @Bind()
  handleEditLineSecData(record, flag) {
    const {
      dispatch,
      selectionRuleMaintenance: { lineSecList },
    } = this.props;
    const newList = lineSecList.map(item => {
      if (record.cosRuleTypeId === item.cosRuleTypeId) {
        return { ...item, _status: flag ? 'update' : '', changeModuleDesc: undefined };
      } else {
        return item;
      }
    });
    dispatch({
      type: 'selectionRuleMaintenance/updateState',
      payload: { lineSecList: newList },
    });
  }

    // 删除行信息
    @Bind
    deleteLine(record, index) {
      const {
        dispatch,
        selectionRuleMaintenance: { lineList = []},
      } = this.props;
      if(record.cosRuleLogicId===undefined||record.cosRuleLogicId===null||record.cosRuleLogicId===""){
        const newList = lineList.filter(item => item.cosRuleLogicId !== record.cosRuleLogicId);
        dispatch({
          type: 'selectionRuleMaintenance/updateState',
          payload: { lineList: newList },
        });
      }else{
        this.setState({loadingLine: !this.state.loadingLine});
        dispatch({
          type: 'selectionRuleMaintenance/deleteLineData',
          payload: record,
        }).then(res => {
          if (res) {
            lineList.splice(index, 1);
            notification.success();
          } else if(res!==undefined){
              notification.error({
                message: res.message,
              });
            }
          this.setState({loadingLine: !this.state.loadingLine});
        });
      }
    }

    // 删除行信息
    @Bind
    deleteLineSec(record, index) {
      const {
        dispatch,
        selectionRuleMaintenance: { lineSecList = []},
      } = this.props;
      if(record.cosRuleTypeId===undefined||record.cosRuleTypeId===null||record.cosRuleTypeId===""){
        const newList = lineSecList.filter(item => item.cosRuleTypeId !== record.cosRuleTypeId);
        dispatch({
          type: 'selectionRuleMaintenance/updateState',
          payload: { lineSecList: newList },
        });
      }else{
        this.setState({loadingLineSec: !this.state.loadingLineSec});
        dispatch({
          type: 'selectionRuleMaintenance/deleteLineSecData',
          payload: record,
        }).then(res => {
          if (res) {
            lineSecList.splice(index, 1);
            notification.success();
          } else if(res!==undefined){
              notification.error({
                message: res.message,
              });
            }
          this.setState({loadingLineSec: !this.state.loadingLineSec});
        });
      }
    }

  // 渲染
  render() {

    const {
      selectionRuleMaintenance: {
        headList = [], headPagination = {}, lineList = [], linePagination = {}, lineSecList = [], lineSecPagination = {}, productTypeMap= [], collectionItemMap= [], countTypeMap= [], rangeTypeMap= [], cosTypeMap= [], powerMap= []},
      fetchHeadDataLoading,
      fetchLineDataLoading,
      fetchDetailDataLoading,
      saveLineSecDataLoading,
      deleteLineSecDataLoading,
    } = this.props;
    const { selectedHeadKeys } = this.state;
    // 设置查询参数
    const searchProps = {
      resetSearch: this.resetSearch,
      onSearch: this.onSearch,
    };

    // 设置头表参数
    const headProps = {
      dataSource: headList,
      pagination: headPagination,
      loading: fetchHeadDataLoading,
      selectedHeadKeys,
      createData: this.createData,
      productTypeMap,
      onSearch: this.queryHeadByPagination,
      onClickHeadRadio: this.onClickHeadRadio,
      handleCleanLine: this.handleCleanLine,
      handleEditData: this.handleEditData,
      handleSaveData: this.handleSaveData,
      changeMaterial: this.changeMaterial,
      onDetailData: this.onDetailData,
    };

    // 设置行表参数
    const lineProps = {
      dataSource: lineList,
      pagination: linePagination,
      loading: fetchLineDataLoading,
      collectionItemMap,
      countTypeMap,
      rangeTypeMap,
      onSearch: this.queryLineByPagination,
      handleCreate: this.createLine,
      handleCleanLine: this.deleteLine,
      handleEditData: this.handleEditLineData,
      handleSaveData: this.handleSaveLineData,
    };

    const expandDataProps = {
      powerMap,
      cosTypeMap,
      expandDrawer: this.state.expandDrawer,
      onCancel: this.expandColseData,
      dataSource: lineSecList,
      pagination: lineSecPagination,
      loading: fetchDetailDataLoading||saveLineSecDataLoading||deleteLineSecDataLoading,
      onSearch: this.queryLineSecByPagination,
      handleCreate: this.createLineSec,
      handleCleanLine: this.deleteLineSec,
      handleEditData: this.handleEditLineSecData,
      handleSaveData: this.handleSaveLineSecData,
    };

    // 返回视图解析
    return (
      <div>
        {/* 标题 */}
        <Header title={intl.get(`title`).d('挑选规则维护')}>
          <Button
            icon="plus"
            type="primary"
            onClick={this.handleCreateHead}
          >
            {intl.get('tarzan.acquisition.selectionRuleMaintenance.button.create').d('新建')}
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
        <Spin spinning={false}>
          {this.state.expandDrawer && <ExpandDrawer {...expandDataProps} />}
        </Spin>
      </div>
    );
  }
}
