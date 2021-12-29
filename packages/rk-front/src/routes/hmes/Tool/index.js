/*
 * @Description: 工装修改
 * @version: 0.1.0
 * @Author: li.zhang13@hand-china.com
 * @Date: 2021-01-07 17:44:12
 */

import React, { Component } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import formatterCollections from 'utils/intl/formatterCollections';
import { addItemToPagination, getCurrentOrganizationId, filterNullValueObject, delItemToPagination, getEditTableData } from 'utils/utils';
import { Button } from 'hzero-ui';
import ExcelExport from 'components/ExcelExport';
import notification from 'utils/notification';
import FilterForm from './FilterForm';
import ListTable from './ListTable';
import History from './History';


@connect(({ tool, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  tool,
  fetchLoading: loading.effects['tool/handleSearch'],
}))
@formatterCollections({ code: 'hwms.barcodeQuery' })
export default class Tool extends Component {
  form;
  constructor(props) {
    super(props);
    this.state = {
    historyDetailDrawer: false,
    historyDatas: {},
    };
  }

  componentDidMount() {
    const {
      dispatch,
      tenantId,
    } = this.props;
    this.handleSearch();
    dispatch({
      type: 'tool/handleSearch',
    });
     // 批量查询独立值集
     dispatch({
      type: 'tool/batchLovData',
      payload: {
        tenantId,
      },
    });
  }


  /**
   *  查询列表
   * @param {object} 查询参数
   */
  @Bind()
  handleSearch(fields = {}) {
    const { dispatch } = this.props;
    const fieldsValue = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'tool/handleSearch',
      payload: {
        ...fieldsValue,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  // 新增数据
  @Bind()
  handleAddData() {
    const {
      dispatch,
      tool: { dataList = [], pagination = {}},
    } = this.props;
    dispatch({
      type: 'tool/updateState',
      payload: {
        dataList: [
          {
            id: new Date().getTime(),
            enableFlag: 'Y',
            _status: 'create', // 新建标记位
          },
          ...dataList,
        ],
        pagination: addItemToPagination(dataList.length, pagination),
      },
    });
  }

  // 清除对象属性
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      tool: { dataList = [], pagination = {} },
    } = this.props;
    const newList = dataList.filter(
      item => item.id !== record.id
    );
    dispatch({
      type: 'tool/updateState',
      payload: {
        dataList: [...newList],
        pagination: delItemToPagination(dataList.length, pagination),
      },
    });
  }

  /**
   *  保存数据
   */
  @Bind()
  saveData(record = {}) {
    const {
      tool: { dataList = [] },
      dispatch,
    } = this.props;
    let params = [];
    params = getEditTableData(dataList, ['id']);
    if (Array.isArray(params) && params.length !== 0) {
      dispatch({
        type: 'tool/saveData',
        payload: {
          ...record,
          params,
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.handleSearch();
        }
      });
    }
  }

  /**
   *
   * 设置工位显示字段
   */
  @Bind
  setChangeData(record, index){
    const {
      dispatch,
      tool: { dataList = [] },
    } = this.props;

    dataList[index].workcellName = record.workcellName;

    // 更新表格数据
    dispatch({
      type: 'tool/updateState',
      payload: {
        dataList,
      },
    })
  }

  /**
   *
   * 设置单位显示字段
   */
  @Bind
  setChangeUom(record, index){
    const {
      dispatch,
      tool: { dataList = [] },
    } = this.props;

    dataList[index].uomName = record.uomName;

    // 更新表格数据
    dispatch({
      type: 'tool/updateState',
      payload: {
        dataList,
      },
    })
  }

  /**
   *
   * 修改记录查询
   */
  @Bind()
  historyClick(record) {
    this.setState({historyDatas: record, historyDetailDrawer: !this.state.historyDetailDrawer});
    const { dispatch } = this.props;
    dispatch({
      type: 'tool/handhistory',
      payload: {
        toolId: record.toolId,
      },
    });
  }

  // 修改记录查询分页变化后触发方法
  @Bind
  handleHistoryDetailChange(page = {}){
    const { dispatch } = this.props;
    // 根据页数查询修改记录信息
    dispatch({
      type: 'tool/handhistory',
      payload: {
        toolId: this.state.historyDatas.toolId,
        page,
      },
    });
  }

  @Bind
  onHistoryDetailCancel(){
    this.setState({ historyDetailDrawer: !this.state.historyDetailDrawer});
  }

  /**
   * 编辑
   * 行数据切换编辑状态
   * @param {Object} record 操作对象
   * @param {Boolean} flag  编辑/取消标记
   */
  @Bind()
  handleEditLine(record = {}, flag, index) {
    const {
      dispatch,
      tool: { dataList = [] },
    } = this.props;
    if(flag){
      dataList[index]._status = 'update';
    }else{
      dataList[index]._status = '';
    }
    dispatch({
      type: 'tool/updateState',
      payload: {
        dataList,
      },
    });
  }

  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  // 数据导出
  @Bind()
  handleGetFormValue() {
    const fieldsValue = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    return filterNullValueObject({
      ...fieldsValue,
    });
  }

  /**
   *  渲染页面
   * @returns {*}
   */
  render() {
    const {
      tool,
      tenantId,
      fetchLoading,
    } = this.props;
    const {
      historyDetailDrawer,
    } = this.state;
    const{ dataList = [], pagination = {} ,historydateList = [], historypagination = {}, applyTypeMap = []} = tool;
    const historyDetailProps ={
      historyDetailDrawer,
      dataSource: historydateList,
      pagination: historypagination,
      handleHistoryDetailChange: this.handleHistoryDetailChange,
      onHistoryDetailCancel: this.onHistoryDetailCancel,
    };
    const filterProps = {
      tenantId,
      onRef: this.handleBindRef,
      onSearch: this.handleSearch,
    };
    const listProps ={
      applyTypeMap,
    }

    return (
      <React.Fragment>
        <Header title="工装维护">
          <Button type="primary" icon="plus" onClick={() => this.handleAddData()}>
            新建
          </Button>
          <Button icon="save" onClick={() => this.saveData()}>
            保存
          </Button>
          <ExcelExport
            exportAsync
            requestUrl={`/mes/v1/${getCurrentOrganizationId()}/hme-tools/list/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue()} // 查询条件
          />
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable
            dataList={dataList}
            fetchLoading={fetchLoading}
            pagination={pagination}
            onSearch={this.handleSearch}
            handleEditLine={this.handleEditLine}
            handleCleanLine={this.handleCleanLine}
            saveData={this.saveData}
            onchange= {this.setChangeData}
            onchangeuom= {this.setChangeUom}
            historyClick= {this.historyClick}
            {...listProps}
          />
          {historyDetailDrawer && <History {...historyDetailProps} />}
        </Content>
      </React.Fragment>
    );
  }
}
