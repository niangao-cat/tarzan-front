/**
 * InspectionPlatform - 巡检平台
 * @date: 2020/04/07 14:38:46
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { Row, Col, Button, Spin, Modal } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty, isNull } from 'lodash';
import uuid from 'uuid/v4';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import {
  getCurrentOrganizationId,
  filterNullValueObject,
  getEditTableData,
  addItemToPagination,
  delItemToPagination,
} from 'utils/utils';
import notification from 'utils/notification';

import styles from './index.less';
import FilterForm from './Components/FilterForm';
import ProductionLines from './Components/ProductionLines';
import InspectionList from './Components/InspectionList';
import BaseInfo from './Components/BaseInfo';
import TestItems from './Components/TestItems';
import ResultInfo from './Components/ResultInfo';

// const modelPrompt = 'tarzan.hmes.message.model.message';

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 消息维护
 * @extends {Component} - React.Component
 * @reactProps {Object} errorMessage - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ inspectionPlatform, loading }) => ({
  inspectionPlatform,
  loading,
  tenantId: getCurrentOrganizationId(),
  fetchProdLineTreeLoading: loading.effects['inspectionPlatform/fetchProdLineTree'],
  fetchProcessTreeLoading: loading.effects['inspectionPlatform/fetchProcessTree'],
  fetchInspectionListLoading: loading.effects['inspectionPlatform/fetchInspectionList'],
  fetchPqcInfoLoading: loading.effects['inspectionPlatform/fetchPqcInfo'],
  fetchResultListLoading: loading.effects['inspectionPlatform/fetchResultList'],
}))
@formatterCollections({
  code: 'tarzan.hmes.message',
})
export default class InspectionPlatform extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testRecord: {}, // 选中检验项
      processRecord: {}, // 选中的工序 / 产线
      inspectionRecord: {}, // 选中巡检单
    };
    this.initData();
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: `inspectionPlatform/fetchDefaultSite`,
    });
  }


  /**
   * 初始化界面
   *
   * @memberof InspectionPlatform
   */
  @Bind()
  initData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'inspectionPlatform/updateState',
      payload: {
        siteInfo: {},
        prodLineTree: [],
        inspectionList: [],
        inspectionPagination: {},
        pqcInfo: {},
        testItemList: [],
        testItemPagination: {},
        resultList: [],
        resultPagination: {},
        fileList: [],
      },
    });
  }

  /**
   * 查询按钮逻辑
   *
   * @memberof InspectionPlatform
   */
  @Bind()
  handleSearch() {
    const { dispatch, inspectionPlatform: { siteInfo } } = this.props;
    const value = this.formDom ? this.formDom.getFieldsValue() : {};
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    const { processId, ...info } = filterValue;
    // 清空缓存树
    dispatch({
      type: 'inspectionPlatform/updateState',
      payload: {
        prodLineTree: [],
      },
    });
    // 查询产线
    dispatch({
      type: 'inspectionPlatform/fetchProdLineTree',
      payload: {
        siteId: siteInfo.siteId,
        ...info,
      },
    });
  }


  /**
   * 点击展开按钮时，获取工序数据
   *
   * @param {*} record
   * @memberof InspectionPlatform
   */
  @Bind()
  handleFetchProcessTree(record) {
    const { dispatch, inspectionPlatform: { siteInfo, prodLineTree } } = this.props;
    dispatch({
      type: 'inspectionPlatform/fetchProcessTree',
      payload: {
        siteId: siteInfo.siteId,
        prodLineId: record.prodLineId,
        prodLineTree,
      },
    });
  }


  /**
   * 选择工序 / 产线，查询关联巡检单
   *
   * @param {object} record 选择的生产线 / 工序
   * @memberof InspectionPlatform
   */
  @Bind()
  handleSelectProcess(record) {
    const { processRecord } = this.state;
    // 选择产线 / 工序
  if((processRecord.type === 'PRODLINE' && processRecord.prodLineId !== record.prodLineId)
    || (processRecord.type === 'PROCESS' && processRecord.processId !== record.processId)
    || isEmpty(processRecord)
    || (processRecord.type === 'PRODLINE' && record.type === 'PROCESS' && processRecord.prodLineId === record.prodLineId)
  ) {
      this.setState({
        processRecord: record,
        inspectionRecord: {},
        testRecord: {},
      });
      this.handleConfirmFetchInspectionList(record);
    } else { // 取消选择
      this.setState({
        processRecord: {},
        inspectionRecord: {},
        testRecord: {},
      });
      this.handleConfirmFetchInspectionList({});
    }
  }



  /**
   * 当 切换产线或工序 / 取消选中产线或工序 / 巡检单翻页 / 生成新的巡检单
   * 当前巡检单有未保存数据时，提示是否保存
   *
   * @param {*} record
   * @param {*} [page={}]
   * @memberof InspectionPlatform
   */
  @Bind()
  handleConfirmFetchInspectionList(record, page = {}) {
    const { inspectionPlatform: { changeItemList } } = this.props;
    if(!isEmpty(changeItemList)) {
      Modal.confirm({
        title: '当前 产线 / 工序 下，巡检单有为保存的数据检验项, 是否保存？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.handleSaveInfo().then(res => {
            if(res) {
              this.handleFetchInspectionList(record, page);
            }
          });
        },
        onCancel: () => {
          this.handleFetchInspectionList(record, page);
        },
      });
    } else {
      this.handleFetchInspectionList(record, page);
    }
  }


  /**
   * 查询关联 生产线 / 工序的巡检单数据
   *
   * @param {object} record
   * @param {object} [page={}] 巡检单分页参数
   * @memberof InspectionPlatform
   */
  @Bind()
  handleFetchInspectionList(record, page = {}) {
    const { dispatch, inspectionPlatform: { siteInfo } } = this.props;
    const payload = record.type === 'PRODLINE' ? {
      prodLineId: record.prodLineId, // 产线id
    } : {
      processId: record.processId, // 工序id
      prodLineId: record.prodLineId,
    };
    if(isEmpty(record)) { // 取消选择 产线 / 工序 时， 清空 关联巡检单相关信息
      dispatch({
        type: 'inspectionPlatform/updateState',
        payload: {
          inspectionList: [],
          inspectionPagination: {},
          pqcInfo: {},
          testItemList: [],
          testItemPagination: {},
          resultList: [],
          resultPagination: {},
          resultRecord: {},
          changeItemList: [],
        },
      });
      this.setState({ testRecord: {} });
    } else {
      dispatch({
        type: 'inspectionPlatform/fetchInspectionList',
        payload: {
          ...payload,
          siteId: siteInfo.siteId,
          type: record.type,
          page,
        },
      });
    }
  }


  /**
   * 获取巡检单相关信息
   *
   * @param {*} record
   * @memberof InspectionPlatform
   */
  @Bind()
  handleFetchPqcInfo(record) {
    const { dispatch } = this.props;
    const { inspectionRecord } = this.state;
    // 清空 巡检单相关信息
    dispatch({
      type: 'inspectionPlatform/updateState',
      payload: {
        pqcInfo: {},
        testItemList: [],
        testItemPagination: {},
        resultList: [],
        resultPagination: {},
        changeItemList: [],
        resultRecord: {},
      },
    });
    this.setState({ testRecord: {} });
    // 选中巡检单时，查询巡检单相关信息
    if(inspectionRecord.pqcHeaderId !== record.pqcHeaderId) {
      dispatch({
        type: 'inspectionPlatform/fetchPqcInfo',
        payload: {
          pqcHeaderId: record.pqcHeaderId,
        },
      });
      this.setState({ inspectionRecord: record });
    } else { // 取消选中巡检单
      this.setState({ inspectionRecord: {}});
    }
  }


  /**
   * 切换巡检单时，确认是否保存当前巡检单下修改的检验项信息
   *
   * @param {*} record
   * @memberof InspectionPlatform
   */
  @Bind()
  handleConfirmFetchPqcInfo(record) {
    this.formDomTwo.resetFields();
    const { inspectionPlatform: { changeItemList } } = this.props;
    if(!isEmpty(changeItemList)) {
      Modal.confirm({
        title: '当前巡检单有为保存的数据检验项, 是否保存？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.handleSaveInfo().then(res => {
            if(res) {
              this.handleFetchPqcInfo(record);
            }
          });
        },
        onCancel: () => {
          this.handleFetchPqcInfo(record);
        },
      });
    } else {
      this.handleFetchPqcInfo(record);
    }
  }


  /**
   * 检验项的分页查询
   *
   * @param {*} [page={}]
   * @memberof InspectionPlatform
   */
  @Bind()
  handleFetchPqcInfoPage(page = {}) {
    const { dispatch, inspectionPlatform: { resultList } } = this.props;
    const { inspectionRecord } = this.state;
    const newResultList = getEditTableData(resultList, ['pqcDetailsId']).filter(e => !isUndefined(e.result) || !isUndefined(e.remark));
    if(newResultList.length > 0) {
      this.handleSaveResultToTest();
    }
    if(!isEmpty(inspectionRecord)) {
      dispatch({
        type: 'inspectionPlatform/fetchPqcInfo',
        payload: {
          page,
          pqcHeaderId: inspectionRecord.pqcHeaderId,
        },
      });
    }
  }


  /**
   * 查询检验项下的结果值列表
   *
   * @param {*} record
   * @memberof InspectionPlatform
   */
  @Bind()
  handleFetchResultList(record) {
    const { dispatch, inspectionPlatform: { resultList, changeItemList, pqcInfo } } = this.props;
    const newResultList = getEditTableData(resultList, ['pqcDetailsId']).filter(e => !isUndefined(e.result) || !isUndefined(e.remark));
    if(newResultList.length > 0) {
      this.handleSaveResultToTest();
    }
    const changePqcLineIds = changeItemList.map(e => e.lineData.pqcLineId);
    if(isEmpty(record)) { // 取消选中时，清空结果列
      dispatch({
        type: 'inspectionPlatform/updateState',
        payload: {
          resultList: [],
          resultPagination: {},
          resultRecord: {},
        },
      });
      this.setState({ testRecord: {} });
    } else if(!changePqcLineIds.includes(record.pqcLineId)) {// 选中的检验项 不存在 缓存需保存数据里时
      // 清空结果值列
      dispatch({
        type: 'inspectionPlatform/updateState',
        payload: {
          resultList: [],
          resultPagination: {},
          resultRecord: {},
        },
      });
      // 查询当前 检验项的 结果列表
      dispatch({
        type: 'inspectionPlatform/fetchResultList',
        payload: {
          pqcLineId: record.pqcLineId,
          pqcInfo,
          page: 0,
          size: 5,
        },
      });
      // 当前检验项 无有 附件uuid时 给当前检验项创建 uuid
      if(record.attachmentUuid) {
        this.setState({ testRecord: record });
      } else {
        this.setState({ testRecord: {...record, attachmentUuid: uuid()} });
      }
    } else if(changePqcLineIds.includes(record.pqcLineId) && pqcInfo.inspectionStatus === 'NEW') {
      // 当前选中的检验项 存在 需保存数据里时 / 且 巡检单为新建状态时
      // 从 当前缓存的 需保存数据中取出结果列表即可
      const obj = changeItemList.find(e => e.lineData.pqcLineId === record.pqcLineId);
      dispatch({
        type: 'inspectionPlatform/updateState',
        payload: {
          resultList: obj.detailsData,
          resultRecord: obj.detailsData[0],
        },
      });
      this.setState({ testRecord: record });
    }
  }


  /**
   * 分页查询 结果值列表
   *
   * @param {*} [page={}]
   * @memberof InspectionPlatform
   */
  @Bind()
  handleFetchResultListPage(page = {}) {
    const { dispatch, inspectionPlatform: { pqcInfo } } = this.props;
    const { testRecord } = this.state;
    dispatch({
      type: 'inspectionPlatform/fetchResultList',
      payload: {
        pqcInfo,
        pqcLineId: testRecord.pqcLineId,
        page,
      },
    });
  }


  /**
   * 新建结果值列
   *
   * @memberof InspectionPlatform
   */
  @Bind()
  handleCreate() {
    const { dispatch, inspectionPlatform: { resultList, resultPagination } } = this.props;
    const newResultRecord = {
      pqcDetailsId: uuid(),
      _status: 'create',
    };
    dispatch({
      type: 'inspectionPlatform/updateState',
      payload: {
        resultList: [
          newResultRecord,
          ...resultList,
        ],
        resultPagination: addItemToPagination(resultList.length, resultPagination),
        resultRecord: newResultRecord,
      },
    });
  }


  /**
   * 将 需保存的 结果值列 缓存进 需保存数据中
   *
   * @memberof InspectionPlatform
   */
  @Bind()
  handleSaveResultToTest() {
    const { testRecord } = this.state;
    const { dispatch, inspectionPlatform: { resultList, changeItemList, testItemList } } = this.props;
    const newResultList = getEditTableData(resultList).filter(e => !isUndefined(e.result) || !isUndefined(e.remark));
    const { standardFrom, standardTo } = testRecord;
    const max = parseFloat(standardTo);
    const min = parseFloat(standardFrom);
    // 判断当前检验项的结果为 OK / NG
    // 只有当 数据类型为 VALUE时，需根据所有结果列 是否在上下限之间，当全部在上下限之间为 OK，否则为NG
    // 除数据类型为VALUE之外的数据类型 检验项 只会有一行 结果值，且都只能填写 OK / NG
    const flag = testRecord.standardType === 'VALUE' ? newResultList.every(e =>{
      return (!isNull(standardTo) && isNull(standardFrom) && e.result >= min)
      || (!isNull(standardTo) && e.result <= max && isNull(min))
      || (isNull(standardTo) && isNull(standardFrom))
      || (!isNull(standardTo) && !isNull(standardFrom) && e.result >= min && e.result <= max);
    }) ? 'OK' : 'NG' : testRecord.standardType !== 'VALUE' ? newResultList[0].result : 'OK';
    let newChangeItemList = changeItemList;
    let newTestItemList = [];
    const changeItemPqcLineIds = newChangeItemList.map(e => e.lineData.pqcLineId);
    // 当前的检验项 已存在 需保存的数据 中，将新数据缓存
    if(changeItemPqcLineIds.includes(testRecord.pqcLineId)) {
      newChangeItemList = newChangeItemList.map(i => (testRecord.pqcLineId === i.lineData.pqcLineId ? {
        ...i,
        detailsData: newResultList,
        lineData: {
          ...testRecord,
          inspectionResult: flag,
        },
      } : i));
    } else {
      // 不存在，则将 该检验项 添加至 需保存数据中
      newChangeItemList = newChangeItemList.concat([{
        detailsData: newResultList,
        lineData: {
          ...testRecord,
          inspectionResult: flag,
        },
      }]);
    }
    newTestItemList = testItemList.map(e => {
      if(testRecord.pqcLineId === e.pqcLineId) {
        return {
          ...testRecord,
          inspectionResult: flag,
        };
      }
      return e;
    });
    dispatch({
      type: 'inspectionPlatform/updateState',
      payload: {
        changeItemList: newChangeItemList,
        testItemList: newTestItemList,
      },
    });
  }


  /**
   * 点击保存按钮时
   * 需将当前正在编辑的检验项以及缓存起的需保存的检验项保存
   *
   * @returns
   * @memberof InspectionPlatform
   */
  @Bind()
  handleSaveInfo() {
    const { dispatch, inspectionPlatform: { resultList, pqcInfo, changeItemList } } = this.props;
    const { testRecord, processRecord } = this.state;
    const newResultList = getEditTableData(resultList, ['pqcDetailsId']).filter(e => !isUndefined(e.result) || !isUndefined(e.remark));
    const { standardFrom, standardTo } = testRecord;
    const max = parseFloat(standardTo);
    const min = parseFloat(standardFrom);
    const flag = testRecord.standardType === 'VALUE' ? newResultList.every(e => {
      return (!isNull(standardTo) && isNull(standardFrom) && e.result >= min)
      || (!isNull(standardTo) && e.result <= max && isNull(min))
      || (isNull(standardTo) && isNull(standardFrom))
      || (!isNull(standardTo) && !isNull(standardFrom) && e.result >= min && e.result <= max);
    }) ? 'OK' : 'NG' : testRecord.standardType === 'DECISION_VALUE' ? newResultList[0].result : 'OK';
    let newChangeItemList = changeItemList;
    const changeItemPqcLineIds = newChangeItemList.map(e => e.lineData.pqcLineId);
    if(changeItemPqcLineIds.includes(testRecord.pqcLineId)) {
      newChangeItemList = newChangeItemList.map(i => (testRecord.pqcLineId === i.lineData.pqcLineId ? {
        ...i,
        detailsData: newResultList,
        lineData: {
          ...testRecord,
          inspectionResult: flag,
        },
      } : i));
    } else {
      newChangeItemList = newChangeItemList.concat([{
        detailsData: newResultList,
        lineData: {
          ...testRecord,
          inspectionResult: flag,
        },
      }]);
    }
    newChangeItemList = newChangeItemList.map(e => {
      const { detailsData } = e;
      const newDetailsData = detailsData.map(i => {
        const {pqcDetailsId, ...info} = i;
        if(info._status === 'create') {
          return info;
        }
        return i;
      });
      return {
        ...e,
        detailsData: newDetailsData,
      };
    });
    return dispatch({
      type: 'inspectionPlatform/saveInfo',
      payload: {
        pqcHeaderId: pqcInfo.pqcHeaderId,
        lineAndDetailsDataList: newChangeItemList,
      },
    }).then(res => {
      if(res) {
        notification.success({
          description: '保存成功！',
        });
        // 重新获取检验单下的检验项
        this.handleFetchInspectionList(processRecord);
        // 清除 结果列 以及 缓存的需保存数据
        this.setState({ testRecord: {} });
      }
      return res;
    });
  }


  /**
   * 提交
   *
   * @memberof InspectionPlatform
   */
  @Bind()
  handleSubmit() {
    const { dispatch, inspectionPlatform: { pqcInfo } } = this.props;
    const { processRecord } = this.state;
    this.handleSaveInfo().then(res => {
      if(res) {
        dispatch({
          type: 'inspectionPlatform/submitPqc',
          payload: {
            pqcHeaderId: pqcInfo.pqcHeaderId,
            remark: this.formDomTwo.getFieldValue("remark"),
          },
        }).then(result => {
          if(result) {
            this.handleFetchInspectionList(processRecord);
          }
        });
      }
    });
  }


  /**
   * 创建检验单头
   *
   * @memberof InspectionPlatform
   */
  @Bind()
  handleCreatePqcHeader() {
    const { dispatch } = this.props;
    const { processRecord } = this.state;
    // 无选中的工序时
    if(processRecord.type === 'PRODLINE' || isEmpty(processRecord)) {
      notification.warning({
        description: '请选择一道工序',
      });
    } else {
      this.formDom.validateFields((err, value) => {
        if(!err) {
          dispatch({
            type: 'inspectionPlatform/createPqc',
            payload: {
              materialLotCode: value.snNum,
              processId: processRecord.processId,
              prodLineId: processRecord.prodLineId,
            },
          }).then(res => {
            if(res) {
              notification.success();
              this.handleConfirmFetchInspectionList(processRecord);
            }
          });
        }
      });
    }
  }



  /**
   * 将uuid与检验项绑定保存
   *
   * @param {*} record
   * @memberof InspectionPlatform
   */
  @Bind()
  handleUploadFile(record) {
    const { dispatch } = this.props;
    this.handleSaveInfo().then(res => {
      if(res) {
        dispatch({
          type: 'inspectionPlatform/uploadFile',
          payload: {
            pqcLineId: record.pqcLineId,
            uuid: record.attachmentUuid,
          },
        });
      }
    });
  }

  /**
   * 清除当前行
   *
   * @param {string} dataSource
   * @param {string} id
   * @param {object} current
   * @memberof ContractBaseInfo
   */
  @Bind()
  handleCleanLine(dataSource, paginationName, id, current) {
    const { dispatch, inspectionPlatform } = this.props;
    const list = inspectionPlatform[dataSource];
    const pagination = inspectionPlatform[paginationName];
    const { changeItemList } = inspectionPlatform;
    const { testRecord } = this.state;
    const newList = list.filter(item => item[id] !== current[id]);
    let payload = {};
    if (pagination) {
      payload = {
        [dataSource]: newList,
        [paginationName]: delItemToPagination(newList.length, pagination),
        changeItemList: changeItemList.map(e => e.lineData.pqcLineId === testRecord.pqcLineId ? {
          ...e,
          detailsData: newList,
        } : e),
      };
    } else {
      payload = {
        [dataSource]: newList,
      };
    }
    dispatch({
      type: 'inspectionPlatform/updateState',
      payload,
    });
  }


  /**
   * 重置查询条件后，将产线树清空
   *
   * @memberof InspectionPlatform
   */
  @Bind()
  handleReset() {
    const { dispatch } = this.props;
    dispatch({
      type: 'inspectionPlatform/updateState',
      payload: {
        prodLineTree: [],
      },
    });
  }


  /**
   * 点击展开 / 取消展开
   *
   * @param {*} isExpand
   * @param {*} record
   * @memberof InspectionPlatform
   */
  @Bind()
  handleChangeExpandedRowKeys(isExpand, record) {
    const { dispatch, inspectionPlatform: { expandedRowKeys } } = this.props;
    const rowKeys = isExpand
      ? [...expandedRowKeys, record.prodLineId]
      : expandedRowKeys.filter(item => item !== record.prodLineId);
    dispatch({
      type: 'inspectionPlatform/updateState',
      payload: {
        expandedRowKeys: rowKeys,
      },
    });
    // 展开产线 需查询当前 产线下的工序
    if(record.type === 'PRODLINE' && isExpand) {
      this.handleFetchProcessTree(record);
    }
  }


  /**
   * 选择 结果列
   *
   * @param {*} record
   * @memberof InspectionPlatform
   */
  @Bind()
  handleChangeResultRecord(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'inspectionPlatform/updateState',
      payload: {
        resultRecord: record,
      },
    });
  }



  /**
   * 删除结果列
   * 缓存至 需保存数据
   *
   * @param {*} record
   * @memberof InspectionPlatform
   */
  @Bind()
  handleDeleteResultList(record) {
    const { testRecord } = this.state;
    const { dispatch, inspectionPlatform: { changeItemList, resultList, resultPagination } } = this.props;
    let newChangeItemList = changeItemList;
    const changeItemPqcLineIds = newChangeItemList.map(e => e.lineData.pqcLineId);
    if(changeItemPqcLineIds.includes(testRecord.pqcLineId)) {
      newChangeItemList = newChangeItemList.map(e => {
        if(e.lineData.pqcLineId === testRecord.pqcLineId) {
          const deleteDetailsData = e.deleteDetailsData ? e.deleteDetailsData.concat([record]) : [record];
          return {
            ...e,
            deleteDetailsData,
          };
        } else {
          return e;
        }
      });
    } else {
      const deleteDetailsData = [record];
      newChangeItemList = newChangeItemList.concat([{
        lineData: testRecord,
        deleteDetailsData,
      }]);
    }
    const newResultList = resultList.filter(e => e.pqcDetailsId !== record.pqcDetailsId);
    dispatch({
      type: 'inspectionPlatform/updateState',
      payload: {
        changeItemList: newChangeItemList,
        resultList: newResultList,
        resultPagination: delItemToPagination(newResultList.length, resultPagination),
      },
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      tenantId,
      fetchProdLineTreeLoading,
      fetchProcessTreeLoading,
      fetchInspectionListLoading,
      fetchPqcInfoLoading,
      fetchResultListLoading,
      inspectionPlatform: {
        inspectionList = [],
        inspectionPagination = {},
        pqcInfo = {},
        testItemList = [],
        testItemPagination = {},
        resultList = [],
        prodLineTree = [],
        resultPagination = {},
        expandedRowKeys = [],
        resultRecord = {},
      },
    } = this.props;
    const { testRecord, processRecord, inspectionRecord } = this.state;
    const filterFormProps = {
      tenantId,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.handleSearch,
      onCreate: this.handleCreatePqcHeader,
      onReset: this.handleReset,
    };
    const productionLinesProps = {
      prodLineTree,
      processRecord,
      expandedRowKeys,
      onFetchProcessTree: this.handleFetchProcessTree,
      onSelectProcess: this.handleSelectProcess,
      onChangeExpandedRowKeys: this.handleChangeExpandedRowKeys,
      loading: fetchProdLineTreeLoading || fetchProcessTreeLoading,
    };
    const inspectionListProps = {
      inspectionRecord,
      processRecord,
      loading: fetchInspectionListLoading,
      dataSource: inspectionList,
      pagination: inspectionPagination,
      onFetchPqcInfo: this.handleConfirmFetchPqcInfo,
      onSearch: this.handleConfirmFetchInspectionList,
    };
    const baseInfoProps = {
      onRef: node => {
        this.formDomTwo = node.props.form;
      },
      pqcInfo,
    };
    const testItemsProps = {
      testRecord,
      dataSource: testItemList,
      pagination: testItemPagination,
      onFetchResultList: this.handleFetchResultList,
      onFetchPqcInfoPage: this.handleFetchPqcInfoPage,
    };
    const resultInfoProps = {
      testRecord,
      pqcInfo,
      resultRecord,
      pagination: resultPagination,
      dataSource: resultList,
      loading: fetchResultListLoading,
      onCreate: this.handleCreate,
      onUploadFile: this.handleUploadFile,
      onCleanLine: this.handleCleanLine,
      onSearch: this.handleFetchResultListPage,
      onChangeResultRecord: this.handleChangeResultRecord,
      onDeleteLine: this.handleDeleteResultList,
    };
    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.hmes.message.title.list').d('巡检平台')} />
        <Content>
          <Row>
            <Col span={6} style={{ paddingRight: '10px' }}>
              <div className={styles['search-content']}>
                <FilterForm {...filterFormProps} />
                <ProductionLines {...productionLinesProps} />
              </div>
            </Col>
            <Col span={18}>
              <InspectionList {...inspectionListProps} />
              <Spin spinning={fetchPqcInfoLoading || false}>
                <div className={styles['base-content']}>
                  <BaseInfo {...baseInfoProps} />
                  <Row>
                    <Col span={15}>
                      <TestItems {...testItemsProps} />
                    </Col>
                    <Col span={9}>
                      <ResultInfo {...resultInfoProps} />
                    </Col>
                    <Col span={24}>
                      <div className={styles['btn-content']}>
                        <Button icon="save" disabled={pqcInfo.inspectionStatus !== 'NEW'} onClick={() => this.handleSaveInfo()}>保存</Button>
                        <Button type="primary" disabled={pqcInfo.inspectionStatus !== 'NEW'} style={{ marginRight: '10px' }} onClick={() => this.handleSubmit()}>
                          提交
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Spin>
            </Col>
          </Row>
        </Content>
      </React.Fragment>
    );
  }
}
