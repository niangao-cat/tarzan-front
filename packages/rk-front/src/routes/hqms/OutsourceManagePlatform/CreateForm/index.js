/**
 * @author:ywj
 * @email:wenjie.yang01@hand-china.com
 * @description: 外协管理平台 视图层（创建进入）
 */

// 引入必要的依赖包
import React from 'react';
import { connect } from 'dva';
import { Modal, notification, Spin } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { getEditTableData } from 'utils/utils';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import moment from 'moment';
import { isUndefined } from 'lodash';
import Filter from './FilterForm';
import HeadTable from './HeadTable';

// 链接model层
@connect(({ outsourceManagePlatform, loading }) => ({
  outsourceManagePlatform,
  fetchCreateDataLoading: loading.effects['outsourceManagePlatform/queryReturnLineData'],
}))
// 默认导出 视图
export default class CreateForm extends React.Component {

  state = {
    loadingFlag: false,
  };

  componentWillUnmount(){
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'outsourceManagePlatform/updateState',
      payload: {
        lineForCreateList: [],
      },
    });
  }

  // 新增行信息
  @Bind()
  createLine() {
    const {
      dispatch,
      outsourceManagePlatform: { lineForCreateList = [], headForCreateData = {} },
    } = this.props;
    dispatch({
      type: 'outsourceManagePlatform/updateState',
      payload: {
        lineForCreateList: [
          ...lineForCreateList,
          {
            instructionLineNum: lineForCreateList.length > 0 ? Number(lineForCreateList[lineForCreateList.length - 1].instructionLineNum) + 10 : 10,
            toLocatorId: headForCreateData.returnLocatorId,
            locatorCode: headForCreateData.locatorCode,
            _status: 'create',
          },
        ],
      },
    });
  }

  // 更改对应创建行的数据，通过物料
  @Bind()
  changeCreateDataByMaterial(index, records) {
    const {
      dispatch,
      outsourceManagePlatform: { lineForCreateList = [] },
    } = this.props;

    lineForCreateList[index].materialId = records.materialId;
    lineForCreateList[index].materialCode = records.materialCode;
    lineForCreateList[index].materialName = records.materialName;
    lineForCreateList[index].uomCode = records.uomCode;
    lineForCreateList[index].uomId = records.uomId;

    dispatch({
      type: 'outsourceManagePlatform/updateState',
      payload: {
        lineForCreateList: [
          ...lineForCreateList,
        ],
      },
    });
  }

  // 更改 对应的行数据， 通过仓库
    // 更改对应创建行的数据，通过物料
    @Bind()
    changeCreateDataByLocator(index, records) {
      const {
        dispatch,
        outsourceManagePlatform: { lineForCreateList = [] },
      } = this.props;

      lineForCreateList[index].toLocatorId = records.locatorId;
      lineForCreateList[index].locatorCode = records.locatorCode;

      dispatch({
        type: 'outsourceManagePlatform/updateState',
        payload: {
          lineForCreateList: [
            ...lineForCreateList,
          ],
        },
      });
    }

  // 删除行信息
  @Bind()
  deleteLine(index) {
    const {
      dispatch,
      outsourceManagePlatform: { lineForCreateList = [] },
    } = this.props;

    // 设置删除后的数据
    let data = [];
    for (let i = 0; i < lineForCreateList.length; i++) {
      if (i !== index) {
        data = [...data, lineForCreateList[i]];
      }
    }

    // 更新创建行
    dispatch({
      type: 'outsourceManagePlatform/updateState',
      payload: {
        lineForCreateList: data,
      },
    });
  }

  // 创建数据
  @Bind()
  changeReturnLocator(records){
    const {
      dispatch,
      outsourceManagePlatform: { headForCreateData = {} },
    } = this.props;

    headForCreateData.returnLocatorId = records.locatorId;
    headForCreateData.locatorCode = records.locatorCode;
    // 更新创建头
    dispatch({
      type: 'outsourceManagePlatform/updateState',
      payload: {
        headForCreateData,
      },
    });
  }

  @Bind()
  createOutSourceData(fieldValues = {}) {
    const {
      dispatch,
      outsourceManagePlatform: { headForCreateData = {}, lineForCreateList = [] },
      expandColseData,
    } = this.props;


    // 获取行对应的回填数据
    const params = getEditTableData(lineForCreateList);
    if (params.length !== 0) {

      if(params.length>1){
      for (let i = 0; i < params.length - 1; i++) {
          for (let j = i + 1; j < params.length; j++) {
            if ((params[i].materialVersion===undefined||params[i].materialVersion===""?null:params[i].materialVersion) === (params[j].materialVersion===undefined||params[j].materialVersion===""?null:params[j].materialVersion) && params[i].materialId === params[j].materialId) {
              return notification.error({ message: `第${params[i].instructionLineNum}行,已存在相同的物料和物料版本,请检查` });
            }
          }
        }
      }
      const headForCreateDataParam = {
        ...headForCreateData,
        ...fieldValues,
        returnArrivalTime: isUndefined(fieldValues.returnArrivalTime)
        ? null
        : moment(fieldValues.returnArrivalTime).format(DEFAULT_DATETIME_FORMAT),
        lineDataList: params,
      };
      this.setState({ loadingFlag: true });
      dispatch({
        type: 'outsourceManagePlatform/createOutSourceData',
        payload: {
          ...headForCreateDataParam,
        },
      }).then(res => {
        this.setState({ loadingFlag: false });
        // 判断消息
        if (res) {
          notification.success({ message: '保存成功！！' });
          // 关闭当前界面
          expandColseData();
        }
      });
    }else{
      notification.error({ message: "请录入行信息" });
    }
  }

  // 加载时调用的方法
  componentDidMount() {
  }

  // 渲染
  render() {

    const { expandColseData, expandDrawer, materialVersionMap, docStatusMap, siteMap, outsourceManagePlatform: { lineForCreateList = [], headForCreateData = {}, reasonMap = [] }, fetchCreateDataLoading } = this.props;
    // 设置查询参数
    const searchProps = {
      createOutSourceData: this.createOutSourceData,
      docStatusMap,
      siteMap,
      reasonMap,
      changeReturnLocator: this.changeReturnLocator,
      headData: headForCreateData,
      onRef: node=>{
        this.createForm = node.props.form;
      },
    };

    // 设置头表参数
    const headProps = {
      materialVersionMap,
      handleCreate: this.createLine,
      handleCleanLine: this.deleteLine,
      changeCreateDataByMaterial: this.changeCreateDataByMaterial,
      changeCreateDataByLocator: this.changeCreateDataByLocator,
      dataSource: lineForCreateList,
      loading: fetchCreateDataLoading,
    };

    // 返回视图解析
    return (
      <Modal
        confirmLoading={false}
        width={1600}
        onCancel={expandColseData}
        visible={expandDrawer}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        title="外协退料单创建"
        footer={null}
      >
        <Spin spinning={this.state.loadingFlag}>
          <Filter {...searchProps} />
          <HeadTable {...headProps} />
        </Spin>
      </Modal>
    );
  }
}
