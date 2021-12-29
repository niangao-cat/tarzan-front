/*
 * @Description: 样本量字码维护
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-07 09:17:19
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-09-21 22:24:25
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import { filterNullValueObject, getCurrentOrganizationId, tableScrollWidth } from 'utils/utils';
import { Button, Input, Form } from 'hzero-ui';
import EditTable from 'components/EditTable';
import notification from 'utils/notification';
import FilterForm from './FilterForm';
import DoAllEditor from './DoAllEditor';


@connect(({ salesOrderChanges, loading }) => ({
  salesOrderChanges,
  fetchLoading: loading.effects['salesOrderChanges/handleSearch'],
  saveLoading: loading.effects['salesOrderChanges/saveSampleCode'],
}))
export default class SalesOrderChanges extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      doAllVisible: false, // 显示批量操作
      doOutDisabled: true, // 释放按钮是否可用
      doSaveDisabled: true, // 保存按钮是否可用
      search: {}, // 查询数据
    };
  }

  componentDidMount() {
    // 查询值集
    const {dispatch} = this.props;
    dispatch({
      type: 'salesOrderChanges/init',
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
    this.setState({search: fieldsValue});
    this.setState({selectedRowKeys: [], selectedRows: []});
    // 制止按钮
    this.setState({ doOutDisabled: true, doSaveDisabled: true});
    dispatch({
      type: 'salesOrderChanges/handleSearch',
      payload: {
        ...fieldsValue,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   *  保存数据
   */
  @Bind()
  saveData() {
    const {
      dispatch,
      salesOrderChanges: { list = [] },
    } = this.props;
    const { selectedRows } = this.state;
    let doSaveList = [];
    for (let i = 0; i < list.length; i++) { // 总的数据
      for (let j = 0; j < selectedRows.length; j++) { // 选中的行数据
        if (list[i].materialLotCode === selectedRows[j].materialLotCode) {
          doSaveList = [...doSaveList, { materialLotId: list[i].materialLotId, soNum: list[i].soNum, soLineNum: list[i].soLineNum, transferSoNum: list[i].transferSoNum, transferSoLineNum: list[i].transferSoLineNum}];
        }
      }
    }
    // 执行保存逻辑
    dispatch({
      type: 'salesOrderChanges/saveSampleCode',
      payload: doSaveList,
    }).then(res =>{
      if(res){
        notification.success({message: '保存成功'});
        this.setState({selectedRowKeys: [], selectedRows: []});
         // 制止按钮
        this.setState({ doOutDisabled: true, doSaveDisabled: true});
        // 重新查询数据
        dispatch({
          type: 'salesOrderChanges/handleSearch',
          payload: {
            ...this.state.search,
          },
        });
      }
    });
  }

  /**
   * 编辑
   * 行数据切换编辑状态
   * @param {Object} record 操作对象
   * @param {Boolean} flag  编辑/取消标记
   */
  @Bind()
  handleEditLine(record = {}, flag) {
    const {
      dispatch,
      salesOrderChanges: { list = [] },
    } = this.props;
    const newList = list.map(item =>
      item.materialLotCode === record.materialLotCode ? {
        ...item,
        _status: flag ? 'update' : '',
        transferSoNum: flag ? item.transferSoNum : '',
        transferSoLineNum: flag ? item.transferSoLineNum : '',
      } : item
    );

    // 判断编辑的数据 是否已经选中， 有则忽略 没有则添加
    if(flag){
      if(this.state.selectedRowKeys.length>0){
        if(!this.state.selectedRowKeys.includes(record.materialLotCode)){
          this.setState({ selectedRowKeys: [...this.state.selectedRowKeys, record.materialLotCode], selectedRows: [...this.state.selectedRows, record]});
          // 更改按钮是否编辑
          this.changeButtomDisabled(newList, [...this.state.selectedRows, record]);
        }else{
           // 更改按钮是否编辑
           this.changeButtomDisabled(newList, this.state.selectedRows);
        }
      }else{
        this.setState({ selectedRowKeys: [record.materialLotCode], selectedRows: [{...record}]});
        // 更改按钮是否编辑
        this.changeButtomDisabled(newList, [{...record}]);
      }
    }

    dispatch({
      type: 'salesOrderChanges/updateState',
      payload: {
        list: newList,
      },
    });
    this.forceUpdate();
  }

  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  @Bind()
  changeButtomDisabled(list, selectedRows){
    // 更具选中的条码 判断数据
    let doOutDisabled = false;
    let doSaveDisabled = false;
    for (let i = 0; i < list.length; i++) { // 总的数据
      for (let j = 0; j < selectedRows.length; j++) { // 选中的行数据
        if (list[i].materialLotCode === selectedRows[j].materialLotCode) {
          // 判断选中的数据是否为更新状态， 是 则表面不允许 释放 否则 保存按钮不可用
          if(list[i]._status ==="update"){
            doOutDisabled = true;
          }else{
            doSaveDisabled = true;
          }

          // 判断 来源的销售订单/行号 是否为空 空就不允许 释放
          if(list[i].soNum===""||list[i].soNum===null||list[i].soNum===undefined||list[i].soLineNum===""||list[i].soLineNum===null||list[i].soLineNum===undefined){
            doOutDisabled = true;
          }

          // 判断 目标的销售订单/行号 是否为空 空就不允许 释放
          if(list[i].transferSoNum===""||list[i].transferSoNum===null||list[i].transferSoNum===undefined||list[i].transferSoLineNum===""||list[i].transferSoLineNum===null||list[i].transferSoLineNum===undefined){
            doSaveDisabled = true;
          }
        }
      }
    }
    if(selectedRows.length>0){
      this.setState({ doOutDisabled, doSaveDisabled});
    }else{
      this.setState({ doOutDisabled: true, doSaveDisabled: true});
    }
  }

  // 选中数据同时给选中的打一个标示
  @Bind()
  handleSelect(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows });
    const { salesOrderChanges: { list = [] }, dispatch } = this.props;
    for (let i = 0; i < list.length; i++) { // 总的数据
      for (let j = 0; j < selectedRows.length; j++) { // 选中的行数据
        if (list[i].materialLotCode === selectedRows[j].materialLotCode)
        {
          list[i].selectedRowFlag = true;
          list[i].updateSoNum = true;
          break; // 只要在选择的数据中得到匹配的立马跳出此次循环，进行下一次判断
        } else {
          // 如果总的数据在i位置没有匹配到选择的数据，那么该数据是不可以更新的
          list[i].selectedRowFlag = false;
          list[i].updateSoNum = false;
        }
      }
    }
    dispatch({
      type: 'salesOrderChanges/updateState',
      payload: {
        list,
      },
    });

     // 更改按钮是否编辑
     this.changeButtomDisabled(list, selectedRows);
  }

  // 批量编辑
  @Bind()
  handleBatchEdir() {
    this.setState({ doAllVisible: true});
    const { salesOrderChanges: { list = [] }, dispatch } = this.props;
    const listArr = [];
    list.forEach(item => {
      listArr.push({
        ...item,
        _status: item._status ==='update'?'update': item.selectedRowFlag ? 'update' : '',
      });
    });
    dispatch({
      type: 'salesOrderChanges/updateState',
      payload: {
        list: listArr,
      },
    });
  }

  @Bind()
  updateSoNum(transferSoNum) {
    const { salesOrderChanges: { list = [] }, dispatch } = this.props;
    const listArr = [];
    list.forEach(item => {
      listArr.push({
        ...item,
        transferSoNum: item.updateSoNum && item._status === 'update' ? transferSoNum : item.transferSoNum,
      });
    });
    dispatch({
      type: 'salesOrderChanges/updateState',
      payload: {
        list: listArr,
      },
    });

    // 更具选中的条码 判断数据
    // 更改按钮是否编辑
    this.changeButtomDisabled(listArr, this.state.selectedRows);
  }

  @Bind()
  updateSoLineNum(transferSoLineNum) {
    const { salesOrderChanges: { list = [] }, dispatch } = this.props;
    const listArr = [];
    list.forEach(item => {
      listArr.push({
        ...item,
        transferSoLineNum: item.updateSoNum && item._status === 'update' ? transferSoLineNum : item.transferSoLineNum,
      });
    });
    dispatch({
      type: 'salesOrderChanges/updateState',
      payload: {
        list: listArr,
      },
    });
    // 更改按钮是否编辑
    this.changeButtomDisabled(listArr, this.state.selectedRows);
  }


  @Bind()
  updateSoNumRecord(index, soNum) {
    const { salesOrderChanges: { list = [] }, dispatch } = this.props;
    list[index].transferSoNum = soNum.target.value;
    dispatch({
      type: 'salesOrderChanges/updateState',
      payload: {
        list,
      },
    });
   // 更改按钮是否编辑
   this.changeButtomDisabled(list, this.state.selectedRows);
  }

  @Bind()
  updateSoLineNumRecord(index, soLineNum) {
    const { salesOrderChanges: { list = [] }, dispatch } = this.props;
    list[index].transferSoLineNum = soLineNum.target.value;
    dispatch({
      type: 'salesOrderChanges/updateState',
      payload: {
        list,
      },
    });
    // 更改按钮是否编辑
   this.changeButtomDisabled(list, this.state.selectedRows);
  }

  // 批量释放
  @Bind()
  handleAddData(){
    const { selectedRows } = this.state;
    let doOutList = []; // 需要释放的数据
    for(let i=0; i<selectedRows.length; i++){
      doOutList = [...doOutList, { materialLotId: selectedRows[i].materialLotId, soNum: selectedRows[i].soNum, soLineNum: selectedRows[i].soLineNum, transferSoNum: "", transferSoLineNum: ""}];
    }

    // 执行释放逻辑
    const { dispatch } = this.props;
    dispatch({
      type: 'salesOrderChanges/saveSampleCode',
      payload: doOutList,
    }).then(res =>{
      if(res){
        notification.success({message: '执行成功'});
        this.setState({selectedRowKeys: [], selectedRows: []});
        // 制止按钮
        this.setState({ doOutDisabled: true, doSaveDisabled: true});
        // 重新查询数据
        dispatch({
          type: 'salesOrderChanges/handleSearch',
          payload: {
            ...this.state.search,
          },
        });
      }
    });
  }

  /**
   *  渲染页面
   * @returns {*}
   */
  render() {
    const {
      salesOrderChanges: { list = [], pagination = {}, siteMap = [], statusMap = [], qualityStatusMap = []},
      fetchLoading,
      saveLoading,
    } = this.props;
    const { selectedRowKeys = [] } = this.state;
    const filterProps = {
      tenantId: getCurrentOrganizationId(),
      siteMap,
      statusMap,
      qualityStatusMap,
      doAllVisible: this.state.doAllVisible,
      onRef: this.handleBindRef,
      onSearch: this.handleSearch,
      updateSoNum: this.updateSoNum,
      updateSoLineNum: this.updateSoLineNum,
    };
    const doAllEditorProps = {
      doAllVisible: this.state.doAllVisible,
      updateSoNum: this.updateSoNum,
      updateSoLineNum: this.updateSoLineNum,
    };
    const columns = [
      {
        title: '实物条码',
        dataIndex: 'materialLotCode',
        fixed: 'left',
        width: 150,
        align: 'center',
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 100,
        align: 'center',
      },
      {
        title: '物料描述',
        dataIndex: 'materialName',
        width: 100,
        align: 'center',
      },
      {
        title: '物料版本',
        dataIndex: 'materialVersion',
        width: 100,
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'statusMeaning',
        width: 80,
        align: 'center',
      },
      {
        title: '数量',
        dataIndex: 'qty',
        width: 80,
        align: 'center',
      },
      {
        title: '单位',
        dataIndex: 'uomCode',
        width: 80,
        align: 'center',
      },
      {
        title: '批次',
        dataIndex: 'lot',
        width: 120,
        align: 'center',
      },
      {
        title: '质量状态',
        dataIndex: 'qualityStatusMeaning',
        width: 100,
        align: 'center',
      },
      {
        title: '工厂',
        dataIndex: 'siteName',
        width: 100,
        align: 'center',
      },
      {
        title: '仓库',
        dataIndex: 'warehouseCode',
        width: 100,
        align: 'center',
      },
      {
        title: '货位',
        dataIndex: 'locatorCode',
        width: 100,
        align: 'center',
      },
      {
        title: '销售订单号',
        dataIndex: 'soNum',
        width: 130,
        align: 'center',
      },
      {
        title: '销售订单行号',
        dataIndex: 'soLineNum',
        width: 130,
        align: 'center',
      },
      {
        title: '目标销售订单号',
        dataIndex: 'transferSoNum',
        width: 130,
        align: 'center',
        fixed: 'right',
        render: (val, record, index) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`transferSoNum`, {
                rules: [
                  {
                    required: true,
                    message: '目标销售订单号不能为空',
                  },
                ],
                initialValue: record.transferSoNum,
              })(
                <Input onChange={e=>this.updateSoNumRecord(index, e)} />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '目标销售订单行号',
        dataIndex: 'transferSoLineNum',
        width: 130,
        align: 'center',
        fixed: 'right',
        render: (val, record, index) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`transferSoLineNum`, {
                rules: [
                  {
                    required: true,
                    message: '目标销售订单行号不能为空',
                  },
                ],
                initialValue: record.transferSoLineNum,
              })(
                <Input onChange={e=>this.updateSoLineNumRecord(index, e)} />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '操作',
        dataIndex: 'operator',
        width: 100,
        align: 'center',
        fixed: 'right',
        render: (val, record) => (
          <span className="action-link">
            {record._status === 'update' && (
              <a onClick={() => this.handleEditLine(record, false)}>
                取消
              </a>
            )}
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a onClick={() => this.handleEditLine(record, true)}>
                编辑
              </a>
            )}
          </span>
        ),
      },
    ];
    return (
      <React.Fragment>
        <Header title="销售订单变更">
          <Button type="primary" icon="save" onClick={() => this.saveData()} disabled={this.state.doSaveDisabled} loading={saveLoading}>
            保存
          </Button>
          <Button type="primary" onClick={() => this.handleBatchEdir()}>
            批量编辑
          </Button>
          <Button type="primary" disabled={this.state.doOutDisabled} onClick={() => this.handleAddData()}>
            释放库存
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <DoAllEditor {...doAllEditorProps} />
          <EditTable
            bordered
            rowKey="materialLotCode"
            columns={columns}
            loading={fetchLoading}
            dataSource={list}
            scroll={{ x: tableScrollWidth(columns) }}
            pagination={pagination}
            onChange={page => this.handleSearch(page)}
            rowSelection={{
              selectedRowKeys,
            onChange: this.handleSelect,
        }}
          />
        </Content>
      </React.Fragment>
    );
  }
}
