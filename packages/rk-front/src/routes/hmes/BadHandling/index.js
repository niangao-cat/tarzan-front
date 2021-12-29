/*
 * @Description: 不良信息处理
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-07 18:10:19
 */

import React, { Component } from 'react';
import { Row, Col, Table, Card, Spin } from 'hzero-ui';
import { connect } from 'dva';
import { isUndefined, isEmpty, pull, pullAllBy, findIndex } from 'lodash';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import formatterCollections from 'utils/intl/formatterCollections';
import {
  getCurrentOrganizationId,
  filterNullValueObject,
  delItemToPagination,
  tableScrollWidth,
  getEditTableData,
} from 'utils/utils';
import qs from 'querystring';
import uuid from 'uuid/v4';
import FilterForm from './FilterForm';
import Process from './Components/Process';
import Material from './Components/Material';
import styles from './Components/index.less';
import OtherStationModal from './Components/OtherStationModal';
import MoreBadModal from './Components/MoreBadModal';
import ScanBarCodeModal from './Components/ScanBarCodeModal';
import ApplicationDrawer from './Components/ApplicationDrawer';
import CosLocationModal from './Components/CosLocationModal';
import notification from 'utils/notification';
import add from '@/assets/add.png';


/**
 * 消息维护
 * @extends {Component} - React.Component
 * @reactProps {Object} errorMessage - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ badHandling, loading }) => ({
  badHandling,
  fetchBadRecordLoading: loading.effects['badHandling/fetchBadRecord'],
  saveHeadBarCodeLoading: loading.effects['badHandling/saveHeadBarCode'],
  saveLineBarCodeLoading: loading.effects['badHandling/saveLineBarCode'],
  enterBarCodeLineLoading: loading.effects['badHandling/enterBarCodeLine'],
  enterBarCodeHeadLoading: loading.effects['badHandling/enterBarCodeHead'],
  fetchOtherStationLoading: loading.effects['badHandling/fetchOtherStation'],
  materialBadCommitLoading: loading.effects['badHandling/materialBadCommit'],
  handleSearchLoading: loading.effects['badHandling/handleSearch'],
  handleCheckBarCodeLoading: loading.effects['badHandling/handleCheckBarCode'],
  handleFetchCosInfoLoading: loading.effects['badHandling/handleFetchCosInfo'],
  scanningMaterialLotCodeLoading: loading.effects['badHandling/scanningMaterialLotCode'],
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: 'tarzan.hmes.message',
})
export default class BadHandling extends Component {
  constructor(props) {
    super(props);
    const routerParam = qs.parse(this.props.history.location.search.substr(1));
    if (routerParam.snNum) {
      this.didUpdateSearch(routerParam);
    }
    this.state = {
      otherStationVisible: false,
      moreBadModalVisible: false,
      barCodeModalVisible: false,
      mainSearchSpinning: false,
      processBadCommitSpinning: false,
      applicationDrawerVisible: false,
      cosModalVisible: false,
      type: '',
      scanningType: '',
      selectedRowKeys: [],
      selectedRows: [],
      selectedProRowKeys: [], // 工序
      selectedProRows: [], // // 工序
      selectedMatRowKeys: [], // 材料
      selectedMatRows: [], // 材料
      selectedMaRowKeys: [], // 材料行
      selectedMaRows: [],
      routerParamState: routerParam,
      materialRecordIndex: '',
      rowkeyUuid: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const routerParam = qs.parse(this.props.history.location.search.substr(1));
    if (!routerParam.snNum) {
      dispatch({
        type: 'badHandling/updateState',
        payload: {
          routerParam: {},
          initData: {},
        },
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const routerParam = qs.parse(nextProps.history.location.search.substr(1));
    const { routerParamState } = this.state;
    if (routerParam.snNum !== routerParamState.snNum) {
      this.setState(
        {
          routerParamState: routerParam,
        },
        () => this.didUpdateSearch(routerParam)
      );
    }
  }

  componentWillUnmount() {
    this.handleClearCache();
  }

  // 清除缓存数据
  @Bind()
  handleClearCache() {
    const { dispatch } = this.props;
    dispatch({
      type: 'badHandling/updateState',
      payload: {
        otherProcessData: {
          workCellId: -1,
        }, // 选中的其他工序数据
        processBadTypeData: {
          ncCodeId: -1,
        }, // 工序不良-不良类型
        materialBadTypeData: {
          ncCodeId: -1,
        }, // 材料不良-不良类型
        barCodeRecord: {}, // 条码明细
        badChecklist: [], // 材料不良-新增不良清单
        badChecklistPagination: {}, // 不良清单分页
        processTags: [], // 工序不良-不良类型
        materialList: [], // 材料不良-材料清单
        materialListPagination: {},
        badList: [], // 不良清单
        initData: {}, // 初始化数据-对应主查询必输字端
        moreBadTypeList: [], // 不良类型-更多
        moreBadTypeListPagination: {},
        otherStationList: [], // 其他工位
        otherStationListPagination: {},
        mainSearchData: {}, // 主查询数据
        prodMaterialInfo: {},
        routerParam: {}, // 路径数据
        comments: '',
        applyList: [], // 点击的物料行
      },
    });
    this.setState({
      otherStationVisible: false,
      moreBadModalVisible: false,
      barCodeModalVisible: false,
      mainSearchSpinning: false,
      processBadCommitSpinning: false,
      applicationDrawerVisible: false,
      type: '',
      scanningType: '',
      selectedRowKeys: [],
      selectedRows: [],
      selectedProRowKeys: [], // 工序
      selectedProRows: [], // // 工序
      selectedMatRowKeys: [], // 材料
      selectedMatRows: [], // 材料
      selectedMaRowKeys: [], // 材料行
      selectedMaRows: [],
      materialRecordIndex: '',
    });
  }

  @Bind
  handleResetFields() {
    this.processForm.resetFields();
    this.materialForm.resetFields();
    this.handleClearCache();
  }

  @Bind()
  didUpdateSearch(routerParam) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'badHandling/updateState',
      payload: {
        routerParam,
      },
    });
    this.setState({ mainSearchSpinning: true });
    dispatch({
      type: 'badHandling/handleSearch',
      payload: {
        tenantId,
        ...routerParam,
        materialLotCode: routerParam.snNum,
      },
    }).then(res => {
      this.setState({ mainSearchSpinning: false });
      if (res) {
        dispatch({
          type: 'badHandling/updateState',
          payload: {
            initData: {
              ...routerParam,
              materialLotCode: routerParam.snNum,
            },
          },
        });
      }
    });
  }

  // 主查询
  @Bind()
  handleSearch() {
    const { dispatch, tenantId, badHandling: {workcellId, routerParam ={}} } = this.props;
    this.setState({ mainSearchSpinning: true });
    const value = this.formDom ? this.formDom.getFieldsValue() : {};
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    dispatch({
      type: 'badHandling/updateState',
      payload: {
        materialList: [],
      },
    });
    dispatch({
      type: 'badHandling/handleSearch',
      payload: {
        tenantId,
        ...filterValue,
        workcellId: workcellId || routerParam.workcellId,
      },
    }).then(res => {
      this.setState({ mainSearchSpinning: false, selectedMaRowKeys: [], selectedMaRows: [] });
      if (res) {
        dispatch({
          type: 'badHandling/updateState',
          payload: {
            initData: {...filterValue, workcellId: workcellId || routerParam.workcellId},
          },
        });
      }
    });
  }

  /**
   * @description: 工序不良提交
   * @param {Object} values form数据
   */
  @Bind()
  processBadCommit(values) {
    const { dispatch, badHandling: { initData = {} } } = this.props;
    const arr = values.ncCodeIdList ? values.ncCodeIdList.split(",") : [];
    this.setState({ processBadCommitSpinning: true });
    dispatch({
      type: 'badHandling/processBadCommit',
      payload: {
        workcellId: initData.workcellId,
        materialLotCode: initData.materialLotCode,
        ...values,
        ncCodeIdList: arr,
      },
    }).then(res => {
      this.setState({ processBadCommitSpinning: false });
      if (res) {
        notification.success();
        this.processForm.resetFields();
        this.processForm.setFieldsValue({ uuid: null });
        this.setState({ selectedProRowKeys: [] });
        this.fetchBadRecord();
      }
    });
  }

  /**
   * @description: 材料不良提交
   * @param {Object} values form数据
   */
  @Bind()
  materialBadCommit(values) {
    const { dispatch, badHandling: { initData = {} } } = this.props;
    const { selectedMaRows } = this.state;
    const arr = values.childNcCodeIdList ? values.childNcCodeIdList.split(",") : [];
    if (selectedMaRows.length === 0) {
      return notification.error({ message: '请选择要处理的材料清单！' });
    }
    dispatch({
      type: 'badHandling/materialBadCommit',
      payload: {
        prodLineId: initData.prodLineId,
        workcellId: initData.workcellId,
        snNumber: initData.materialLotCode,
        processId: initData.processId,
        materilalList: selectedMaRows,
        ...values,
        childNcCodeIdList: arr,
      },
    }).then(res => {
      if (res) {
        dispatch({
          type: 'badHandling/updateState',
          payload: {
            selectInfo: [],
            customizelocation: [],
            cosInfo: {},
          },
        });
        notification.success();
        this.fetchMaterialList({});
        this.fetchBadRecord();
        this.materialForm.resetFields();
        this.setState({ selectedMatRowKeys: [] });
        this.setState({ selectedMaRowKeys: [], selectedMaRows: [] });
      }
    });
  }

  // 不良代码记录单独查询
  @Bind()
  fetchBadRecord() {
    const { dispatch, badHandling: { initData = {} } } = this.props;
    dispatch({
      type: 'badHandling/fetchBadRecord',
      payload: {
        workcellId: initData.workcellId,
        materialLotCode: initData.materialLotCode,
        processId: initData.processId,
      },
    });
  }

  // 其他工位查询
  @Bind()
  fetchOtherStation(fields = {}) {
    const { dispatch, badHandling: { initData = {} } } = this.props;
    const fieldsValue = (this.otherStationForm && filterNullValueObject(this.otherStationForm.getFieldsValue())) || {};
    dispatch({
      type: 'badHandling/fetchOtherStation',
      payload: {
        ...fieldsValue,
        workcellId: initData.workcellId,
        materialLotCode: initData.materialLotCode,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   * @description: 扫描条码-控制模态框展开收起
   * @param {Boolean} flag 展开收起标示
   * @param {Object} record 传递数据
   * @param {String} type 头点击的还是行点击的
   */
  @Bind()
  scanningBarCodeVisible(flag) {
    this.setState({ barCodeModalVisible: flag });
    const { dispatch } = this.props;
    dispatch({
      type: 'badHandling/updateState',
      payload: {
        badChecklist: [],
      },
    });
  }

  /**
   * @description: 工序&材料更多不良类型
   * @param {Boolean} proFlag 更多不良标示
   * @param {String} type 不良类型区分：工序不良，材料不良
   */
  @Bind()
  moreBadType(proFlag, type) {
    const { dispatch } = this.props;
    this.setState({ moreBadModalVisible: proFlag, type });
    const { badHandling: { processBadTypeData = {}, materialBadTypeData = {} } } = this.props;
    if (!proFlag) {
      if (type === 'PROCESS') {
        if (!processBadTypeData.description) {
          // 如果是点模态框的取消功能需要清除选中的数据，
          this.setState({ selectedProRowKeys: [], selectedProRows: [] });
          dispatch({
            type: 'badHandling/updateState',
            payload: {
              processBadTypeData: {
                ncCodeId: -1,
              },
            },
          });
          this.processForm.setFieldsValue({ ncCodeId: null });
          this.processForm.resetFields();
        }
      }
      if (type === 'MATERIAL') {
        if (!materialBadTypeData.description) {
          // 如果是点模态框的取消功能需要清除选中的数据，
          this.setState({ selectedMatRowKeys: [], selectedMatRows: [] });
          this.materialForm.setFieldsValue({ ncCodeId: null });
        }
      }
    }
  }

  // 点击不良类型中现有的数据需要清除更多模态框内的值
  @Bind()
  clearMoreBadType(type) {
    const { dispatch } = this.props;
    if (type === 'PROCESS') {
      dispatch({
        type: 'badHandling/updateState',
        payload: {
          processBadTypeData: {},
        },
      });
      this.setState({ selectedProRowKeys: [] });
    }
    if (type === 'MATERIAL') {
      dispatch({
        type: 'badHandling/updateState',
        payload: {
          materialBadTypeData: {},
        },
      });
      this.setState({ selectedMatRowKeys: [] });
    }
  }

  // 保存不良类型
  @Bind()
  saveBadType() {
    const { dispatch } = this.props;
    const { type, selectedProRows, selectedMatRows } = this.state;
    if (type === 'PROCESS') {
      dispatch({
        type: 'badHandling/updateState',
        payload: {
          processBadTypeData: selectedProRows[0],
        },
      });
      this.processForm.resetFields(['ncGroupId']);
      this.setState({ moreBadModalVisible: false });
    }
    if (type === 'MATERIAL') {
      dispatch({
        type: 'badHandling/updateState',
        payload: {
          materialBadTypeData: selectedMatRows[0],
        },
      });
      this.materialForm.setFieldsValue({ ncCodeId: selectedMatRows[0].ncCodeId });
      this.setState({ moreBadModalVisible: false });
    }
  }

  /**
   * @description: 保存更多不良类型-根据type区分：工序、材料
   * @param {Array} selectedRowKeys 选中数据的key
   * @param {Array} selectedRows 选中的数据
   */
  @Bind()
  onSelectBadTypeRows(selectedRowKeys, selectedRows) {
    const { type } = this.state;
    if (type === 'PROCESS') {
      this.setState({ selectedProRowKeys: selectedRowKeys, selectedProRows: selectedRows });
    }
    if (type === 'MATERIAL') {
      this.setState({ selectedMatRowKeys: selectedRowKeys, selectedMatRows: selectedRows });
    }
  }

  // 材料清单选择
  @Bind()
  onSelectRowMaterial(selectedRowKeys, selectedRows) {
    this.setState({ selectedMaRowKeys: selectedRowKeys, selectedMaRows: selectedRows });
  }

  /**
   * @description: 其他工位-选中行
   * @param {Array} selectedRowKeys 选中数据的key
   * * @param {Array} selectedRows 选中的数据
   */
  @Bind()
  onSelectRows(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows });
  }

  // 保存其他工位
  @Bind()
  saveOtherProcess() {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) {
      notification.error({ message: '请勾选一行数据' });
    } else {
      dispatch({
        type: 'badHandling/updateState',
        payload: {
          otherProcessData: selectedRows[0],
        },
      });
      const {
        workcellId,
        materialLotCode,
      } = this.formDom.getFieldsValue();
      const {
        ncGroupId,
      } = this.processForm.getFieldsValue();
      if (workcellId && materialLotCode && ncGroupId) {
        dispatch({
          type: 'badHandling/fetchComments',
          payload: {
            materialLotCode,
            ncGroupId,
            currentwWorkcellId: selectedRows[0].workcellId,
            workcellId,
            eoStepActualId: selectedRows[0].eoStepActualId,
            rootCauseOperationId: selectedRows[0].operationId,
          },
        });
      } else if (!ncGroupId) {
        notification.warning({ message: '请选择不良代码组' });
      }
      this.processForm.setFieldsValue({ currentwWorkcellId: selectedRows[0].workcellId });
      this.setState({ otherStationVisible: false });
    }
  }

  // 其他工工位-控制模态框的展示&关闭
  @Bind()
  otherProcess(flag) {
    this.setState({ otherStationVisible: flag });
    if (flag) {
      this.fetchOtherStation();
    } else {
      const { badHandling: { otherProcessData = {} } } = this.props;
      if (!otherProcessData.workcellId) {
        this.processForm.setFieldsValue({ currentwWorkcellId: null });
      }
    }
  }

  @Bind()
  handleBindProcessRef(ref = {}) {
    this.processForm = (ref.props || {}).form;
  }

  @Bind()
  handleBindMaterialRef(ref = {}) {
    this.materialForm = (ref.props || {}).form;
  }

  // 已扫条码删除
  @Bind()
  deleteBarcode(record, index) {
    const {
      dispatch,
      badHandling: { badChecklist = [], badChecklistPagination = {}, initData = {}, materialListPagination = {} },
      tenantId,
    } = this.props;
    if (record._status === 'create') {
      badChecklist.splice(index, 1);
      dispatch({
        type: 'badHandling/updateState',
        payload: {
          badChecklist,
          badChecklistPagination: delItemToPagination(1, badChecklistPagination),
        },
      });
    } else {
      dispatch({
        type: 'badHandling/deleteBarcode',
        payload: {
          record: [record],
        },
      }).then(res => {
        if (res) {
          notification.success();
          badChecklist.splice(index, 1);
          dispatch({
            type: 'badHandling/updateState',
            payload: {
              badChecklist,
              badChecklistPagination: delItemToPagination(1, badChecklistPagination),
            },
          });
          dispatch({
            type: 'badHandling/fetchMaterialList',
            payload: {
              tenantId,
              ...initData,
              page: isEmpty(materialListPagination) ? {} : materialListPagination,
            },
          });
        }
      });
    }
  }

  /**
   * @description: 扫描条码
   * @param {Object} record 行记录
   * @param {Number} index 数组下标值
   * @param {String} barCode 条码
   */
  @Bind()
  enterBarCode(scanMaterialLotCode) {
    const {
      dispatch,
      badHandling: {
        initData = {},
        badChecklist = [],
      },
    } = this.props;
    if (badChecklist.filter(item => item.materialLotCode === scanMaterialLotCode).length > 0) {
      return notification.error({ message: `当前条码${scanMaterialLotCode}已扫描` });
    }
    dispatch({
      type: 'badHandling/enterBarCodeHead',
      payload: {
        workcellId: initData.workcellId,
        snNumber: initData.materialLotCode,
        scanCode: scanMaterialLotCode,
      },
    }).then(res => {
      if (res) {
        if (res.assemblyFlag === 0) {
          notification.warning({
            message: `条码${scanMaterialLotCode}不在装配清单内！`,
          });
        }
        notification.success();
        dispatch({
          type: 'badHandling/updateState',
          payload: {
            badChecklist: [
              {
                ...res,
                rowkeyUuid: uuid(),
                _status: 'create', // 新建标记位
              },
              ...badChecklist,
            ],
          },
        });
      }
    });
  }

  // 保存扫描的条码
  @Bind()
  saveBarCode() {
    const {
      badHandling: {
        badChecklist = [],
        materialList = [],
      },
      dispatch,
    } = this.props;
    const newArr = materialList.concat(getEditTableData(badChecklist));
    dispatch({
      type: 'badHandling/updateState',
      payload: {
        materialList: newArr,
        badChecklist: [],
      },
    });
    this.setState({ barCodeModalVisible: false });
    notification.success();
  }

  // 查询物料清单缓存数据
  @Bind()
  fetchMaterialList(fields = {}) {
    const {
      dispatch,
      tenantId,
      badHandling: { initData = {} },
    } = this.props;
    this.setState({ barCodeModalVisible: false });
    dispatch({
      type: 'badHandling/updateState',
      payload: {
        materialList: [],
      },
    });
    dispatch({
      type: 'badHandling/fetchMaterialList',
      payload: {
        tenantId,
        ...initData,
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(res => {
      if (res) {
        dispatch({
          type: 'badHandling/updateState',
          payload: {
            selectInfo: [],
            customizelocation: [],
            cosInfo: {},
          },
        });
        this.materialForm.resetFields();
        this.setState({ selectedMaRowKeys: [], selectedMaRows: [] });
      }
    });
  }

  // 清除工位,查询备注
  @Bind()
  clickOtherStation(val) {
    const { dispatch } = this.props;
    dispatch({
      type: 'badHandling/updateState',
      payload: {
        otherProcessData: {},
      },
    });
    const {
      workcellId,
      materialLotCode,
    } = this.formDom.getFieldsValue();
    const {
      ncGroupId,
      // currentwWorkcellId,
    } = this.processForm.getFieldsValue();
    if (workcellId && materialLotCode && ncGroupId) {
      dispatch({
        type: 'badHandling/fetchComments',
        payload: {
          materialLotCode,
          ncGroupId,
          currentwWorkcellId: val.target.value,
          workcellId,
        },
      });
    } else if (!ncGroupId) {
      notification.warning({ message: '请选择不良代码组' });
    }
    this.setState({ selectedRowKeys: [] });
  }

  // 扫描序列号
  @Bind()
  scanningMaterialLotCode(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'badHandling/scanningMaterialLotCode',
      payload: {
        materialLotCode: value,
      },
    }).then(res => {
      if (res) {
        this.handleSearch();
      }
    });
  }

  /**
   * 编辑对象属性
   */
  @Bind()
  handleEdit(record, flag) {
    const {
      dispatch,
      badHandling: { badChecklist = [] },
    } = this.props;
    const newList = badChecklist.map(item => {
      if (record.materialLotCode === item.materialLotCode) {
        return { ...item, _status: flag ? 'update' : '' };
      } else {
        return item;
      }
    });
    dispatch({
      type: 'badHandling/updateState',
      payload: { badChecklist: newList },
    });
  }

  // 取消新建对象属性
  @Bind()
  handleCleanLine(record, index) {
    const {
      dispatch,
      badHandling: { badChecklist = [] },
    } = this.props;
    badChecklist.splice(index, 1);
    dispatch({
      type: 'badHandling/updateState',
      payload: {
        badChecklist: [...badChecklist],
      },
    });
  }

  @Bind
  changeApplyQty(value, index, record, flag) {
    const {
      dispatch,
      badHandling: { materialList = [] },
    } = this.props;
    materialList.splice(index, 1, {
      ...materialList[index],
      selected: flag,
      applyQty: value,
    });
    const { selectedMaRowKeys, selectedMaRows } = this.state;
    dispatch({
      type: 'badHandling/updateState',
      payload: {
        materialList: [...materialList],
      },
    });
    if (!value || flag) {
      this.setState({ selectedMaRowKeys: pull(selectedMaRowKeys, record.rowkeyUuid), selectedMaRows: pullAllBy(selectedMaRows, [{ rowkeyUuid: record.rowkeyUuid }], 'rowkeyUuid') });
    }
  }

  // 材料不良-打开modal输入申请数量
  @Bind
  handleApplicationDrawer(flag, record, index) {
    const {
      dispatch,
    } = this.props;
    this.setState({ applicationDrawerVisible: flag, materialRecordIndex: index, rowkeyUuid: record.rowkeyUuid });
    const { detailList } = record;
    let applyList = [];
    if (flag) {
      detailList.forEach(ele => {
        applyList.push({
          ...ele,
          _status: 'update',
        });
      });
    } else {
      applyList = [];
    }
    dispatch({
      type: 'badHandling/updateState',
      payload: {
        applyList,
      },
    });
  }

  @Bind
  handleApplySave() {
    const {
      dispatch,
      badHandling: {
        applyList = [],
        materialList = [],
      },
    } = this.props;
    const { materialRecordIndex, selectedMaRows = [], selectedMaRowKeys = [], rowkeyUuid } = this.state;
    const params = getEditTableData(applyList);
    if (params.length === 0) {
      return;
    }
    let applyQty = 0;
    params.forEach(ele => {
      if (ele.applyQty) {
        applyQty += ele.applyQty;
      }
    });
    // 当修改了申请数量或着是否退料标示时重新给selectedMaRows赋值
    const paramSelect = [];
    selectedMaRows.forEach(ele => {
      if (ele.rowkeyUuid === rowkeyUuid) {
        paramSelect.push({
          ...materialList[materialRecordIndex],
          detailList: params,
          applyQty: applyQty === 0 ? null : applyQty,
        });
      } else {
        paramSelect.push({
          ...ele,
        });
      }
    });
    materialList.splice(materialRecordIndex, 1, {
      ...materialList[materialRecordIndex],
      detailList: params,
      applyQty: applyQty === 0 ? null : applyQty,
    });
    if (applyQty === 0 || !applyQty) {
      this.setState({ selectedMaRowKeys: pull(selectedMaRowKeys, rowkeyUuid), selectedMaRows: pullAllBy(selectedMaRows, [{ rowkeyUuid }], 'rowkeyUuid') });
    } else {
      this.setState({ selectedMaRows: paramSelect });
    }
    this.setState({ applicationDrawerVisible: false });
    dispatch({
      type: 'badHandling/updateState',
      payload: {
        materialList: [...materialList],
      },
    });
  }

  // 打开cos芯片芯片装载信息记录-modal
  @Bind()
  handleCosLocationModal(flag) {
    const {
      dispatch,
      badHandling: { initData = {} },
    } = this.props;
    const { selectedMaRows } = this.state;
    if (flag) {
      dispatch({
        type: 'badHandling/handleCheckBarCode',
        payload: {
          snNumber: initData.materialLotCode,
          materilalList: selectedMaRows,
        },
      }).then(res => {
        if (res) {
          if (!selectedMaRows[0].cosInfo) {
            dispatch({
              type: 'badHandling/handleFetchCosInfo',
              payload: {
                snNumber: initData.materialLotCode,
                materilalList: selectedMaRows,
              },
            }).then(ress => {
              if (ress) {
                dispatch({
                  type: 'badHandling/updateState',
                  payload: {
                    selectInfo: [],
                    customizelocation: [],
                  },
                });
              }
            });
          } else {
            dispatch({
              type: 'badHandling/updateState',
              payload: {
                cosInfo: selectedMaRows[0].cosInfo,
                selectInfo: selectedMaRows[0].selectInfo,
                customizelocation: selectedMaRows[0].customizelocation,
              },
            });
          }
        }
        this.setState({ cosModalVisible: flag });
      });
    } else {
      dispatch({
        type: 'badHandling/updateState',
        payload: {
          cosInfo: {},
          selectInfo: [],
          customizelocation: [],
        },
      });
      this.setState({ cosModalVisible: flag });
    }
  }

  @Bind()
  clickPosition(dataSource, customizelocation) {
    const { dispatch } = this.props;
    dispatch({
      type: 'badHandling/updateState',
      payload: {
        selectInfo: dataSource,
        customizelocation,
      },
    });
  }

  // 保存
  @Bind()
  handleCosLoacationSave() {
    const {
      dispatch,
      badHandling: {
        materialList = [],
        customizelocation = [],
        selectInfo = [],
        cosInfo = {},
      },
    } = this.props;
    const { selectedMaRows } = this.state;
    const index = findIndex(materialList, { ...selectedMaRows[0] });
    materialList.splice(index, 1, {
      ...materialList[index],
      customizelocation,
      cosInfo,
      selectInfo,
      materialLotLoadIdList: selectInfo.length > 0 ? selectInfo.map(ele => ele.materialLotLoadId) : [],
    });
    const paramSelect = [];
    selectedMaRows.forEach(item => {
      paramSelect.push({
        ...item,
        cosInfo,
        customizelocation,
        selectInfo,
        materialLotLoadIdList: selectInfo.length > 0 ? selectInfo.map(ele => ele.materialLotLoadId) : [],
      });
    });
    this.setState({ selectedMaRows: paramSelect });
    dispatch({
      type: 'badHandling/updateState',
      payload: {
        materialList: [...materialList],
      },
    });
    this.handleCosLocationModal(false);
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      badHandling: {
        mainSearchData = {},
        processTags = [],
        stationTags = [],
        handlingRadio = [],
        moreBadTypeList = [],
        moreBadTypeListPagination = {},
        materialList = [],
        materialListPagination = {},
        badList = [],
        otherProcessData = {},
        processBadTypeData = {},
        materialBadTypeData = {},
        barCodeRecord = {},
        badChecklist = [],
        badChecklistPagination = {},
        initData = {},
        otherStationList = [],
        otherStationListPagination = {},
        prodMaterialInfo = {},
        routerParam = {},
        comments = '',
        applyList = [],
        cosInfo = {},
        customizelocation = [],
        selectInfo = [],
      },
      fetchBadRecordLoading,
      saveHeadBarCodeLoading,
      saveLineBarCodeLoading,
      enterBarCodeHeadLoading,
      enterBarCodeLineLoading,
      fetchOtherStationLoading,
      materialBadCommitLoading,
      handleSearchLoading,
      handleCheckBarCodeLoading,
      handleFetchCosInfoLoading,
      scanningMaterialLotCodeLoading,
      tenantId,
    } = this.props;
    const {
      type,
      otherStationVisible,
      moreBadModalVisible,
      barCodeModalVisible,
      selectedRowKeys,
      selectedProRowKeys,
      selectedMatRowKeys,
      selectedMaRowKeys,
      selectedMaRows,
      mainSearchSpinning,
      processBadCommitSpinning,
      scanningType,
      applicationDrawerVisible,
      cosModalVisible,
    } = this.state;
    const filterProps = {
      onRef: node => {
        this.formDom = node.props.form;
      },
      tenantId,
      prodMaterialInfo,
      routerParam,
      scanningMaterialLotCodeLoading,
      shiftCode: mainSearchData.shiftCode,
      onSearch: this.handleSearch,
      handleResetFields: this.handleResetFields,
      scanningMaterialLotCode: this.scanningMaterialLotCode,
    };
    const columns = [
      {
        title: '发生时间',
        dataIndex: 'dateTime',
        width: 150,
      },
      {
        title: '操作者',
        dataIndex: 'userName',
        width: 80,
      },
      {
        title: '工号',
        dataIndex: 'userCode',
        width: 70,
      },
      {
        title: '不良单号',
        dataIndex: 'ncNumber',
        width: 90,
      },
      {
        title: '产品料号',
        dataIndex: 'materialCode',
        width: 90,
      },
      {
        title: '产品描述',
        dataIndex: 'materialName',
        width: 90,
      },
      {
        title: '材料编码',
        dataIndex: 'scrapMaterialCode',
        width: 90,
      },
      {
        title: '材料名称',
        dataIndex: 'scrapMaterialName',
        width: 90,
      },
      {
        title: '报废数量',
        dataIndex: 'scrapQty',
        width: 90,
      },
      {
        title: '序列号',
        dataIndex: 'materialLotCode',
        width: 90,
      },
      {
        title: '工单号',
        dataIndex: 'workOrderNum',
        width: 90,
      },
      {
        title: '不良组代码组',
        dataIndex: 'ncGroupDesc',
        width: 110,
      },
      {
        title: '不良代码',
        dataIndex: 'ncCodeList',
        width: 90,
        render: (val, record) => {
          const ncCodeListArr = [];
          record.ncCodeList.forEach(item => {
            ncCodeListArr.push(`${item}, `);
          });
          return ncCodeListArr;
        },
      },
      {
        title: '不良原因',
        dataIndex: 'ncReasonList',
        width: 90,
        render: (val, record) => {
          const ncReasonListArr = [];
          record.ncReasonList.forEach(item => {
            ncReasonListArr.push(`${item}, `);
          });
          return ncReasonListArr;
        },
      },
      {
        title: '不良类型',
        dataIndex: 'ncTypeMeaning',
        width: 90,
      },
      {
        title: '责任工位',
        dataIndex: 'responseWorkcellName',
        width: 90,
      },
      {
        title: '责任人',
        dataIndex: 'responseUser',
        width: 90,
      },
      {
        title: '状态',
        dataIndex: 'statusMeaning',
        width: 90,
      },
      {
        title: '处理办法',
        dataIndex: 'disposeMethodMeaning',
        width: 90,
      },
    ];
    const processProps = {
      badType: mainSearchData.processNcCodeTypes,
      stationTags,
      handlingRadio,
      otherProcessData,
      processBadTypeData,
      tenantId,
      comments,
      workcellId: initData.workcellId,
      onRef: this.handleBindProcessRef,
      processBadCommit: this.processBadCommit,
      otherProcess: this.otherProcess,
      moreBadType: this.moreBadType,
      clickOtherStation: this.clickOtherStation,
      clearMoreBadType: this.clearMoreBadType,
    };
    const materialProps = {
      badType: mainSearchData.materialNcCodeTypes,
      processTags,
      handlingRadio,
      materialBadTypeData,
      selectedRowKeys: selectedMaRowKeys,
      dataSource: materialList,
      pagination: materialListPagination,
      materialBadCommitLoading,
      handleCheckBarCodeLoading,
      onRef: this.handleBindMaterialRef,
      moreBadType: this.moreBadType,
      materialBadCommit: this.materialBadCommit,
      scanningBarCodeVisible: this.scanningBarCodeVisible,
      onSelectRow: this.onSelectRowMaterial,
      clearMoreBadType: this.clearMoreBadType,
      onSearch: this.fetchMaterialList,
      changeApplyQty: this.changeApplyQty,
      handleApplicationDrawer: this.handleApplicationDrawer,
      handleCosLocationModal: this.handleCosLocationModal,
    };
    const otherStationModal = {
      visible: otherStationVisible,
      selectedRowKeys,
      dataSource: otherStationList,
      pagination: otherStationListPagination,
      loading: fetchOtherStationLoading,
      onRef: node => {
        this.otherStationForm = node.props.form;
      },
      onOk: this.saveOtherProcess,
      onCancel: this.otherProcess,
      onSelectRows: this.onSelectRows,
      onSearch: this.fetchOtherStation,
    };
    const moreBadModalProps = {
      visible: moreBadModalVisible,
      selectedProRowKeys,
      selectedMatRowKeys,
      type,
      initData,
      dataSource: moreBadTypeList,
      pagination: moreBadTypeListPagination,
      onOk: this.saveBadType,
      onCancel: this.moreBadType,
      onSelectRows: this.onSelectBadTypeRows,
    };
    const scanBarCodeProps = {
      barCodeRecord,
      tenantId,
      badChecklist,
      badChecklistPagination,
      scanningType,
      saveHeadBarCodeLoading,
      saveLineBarCodeLoading,
      enterBarCodeHeadLoading,
      enterBarCodeLineLoading,
      visible: barCodeModalVisible,
      onRef: node => {
        this.scanBarCodeFliter = node.props.form;
      },
      // handleCreate: this.handleCreateBadChecklist,
      deleteBarcode: this.deleteBarcode,
      onCancel: this.scanningBarCodeVisible,
      enterBarCode: this.enterBarCode,
      onSearch: this.fetchMaterialList,
      fetchMaterialList: this.fetchMaterialList,
      handleEdit: this.handleEdit,
      handleCleanLine: this.handleCleanLine,
      saveBarCode: this.saveBarCode,
    };
    const applicationDrawerProps = {
      dataSource: applyList,
      visible: applicationDrawerVisible,
      onCancel: this.handleApplicationDrawer,
      handleOK: this.handleApplySave,
    };
    const cosLocationModalProps = {
      handleFetchCosInfoLoading,
      customizelocationModal: customizelocation,
      customizelocation: selectedMaRows.length > 0 ? selectedMaRows[0].customizelocation : [],
      visible: cosModalVisible,
      cosInfo,
      dataSource: selectInfo,
      onCancel: this.handleCosLocationModal,
      clickPositions: this.clickPosition,
      handleCosLoacationSave: this.handleCosLoacationSave,
    };
    return (
      <React.Fragment>
        <Header title='不良处理平台' />
        <Content style={{ padding: '0px', backgroundColor: 'transparent' }}>
          <FilterForm {...filterProps} />
          <Spin spinning={mainSearchSpinning || handleSearchLoading ? handleSearchLoading : false}>
            <Row style={{ marginTop: '8px' }}>
              <Col span={6} style={{ width: '23%' }}>
                <Card title="工序不良" bordered={false} className={styles.badHandingProcess}>
                  <Spin spinning={processBadCommitSpinning}>
                    <Process {...processProps} />
                  </Spin>
                </Card>
              </Col>
              <Col span={18} style={{ width: '77%' }}>
                <Card
                  title={
                    <Row>
                      <Col span={6}>
                        <span>
                          材料不良
                          <img
                            src={add}
                            alt=""
                            onClick={() => this.scanningBarCodeVisible(true)}
                            style={{ width: '20px', height: '20px', cursor: 'pointer', margin: '-3px 0px 0px 4px' }}
                          />
                        </span>
                      </Col>
                      <Col span={18}>
                        <div style={{ textAlign: 'end' }}>* 底色为绿色为工单已投料的材料不良</div>
                      </Col>
                    </Row>
                  }
                  bordered={false}
                  className={styles['material-bad-handing']}
                >
                  <Material {...materialProps} />
                </Card>
              </Col>
            </Row>
            <Row style={{ marginTop: '8px', backgroundColor: '#fff' }}>
              <Col span={24}>
                <Table
                  columns={columns}
                  dataSource={badList}
                  rowKey="id"
                  bordered
                  loading={fetchBadRecordLoading}
                  pagination={false}
                  scroll={{ x: tableScrollWidth(columns) }}
                />
              </Col>
            </Row>
          </Spin>
          {otherStationVisible && <OtherStationModal {...otherStationModal} />}
          {moreBadModalVisible && <MoreBadModal {...moreBadModalProps} />}
          {barCodeModalVisible && <ScanBarCodeModal {...scanBarCodeProps} />}
          {applicationDrawerVisible && <ApplicationDrawer {...applicationDrawerProps} />}
          {cosModalVisible && <CosLocationModal {...cosLocationModalProps} />}
        </Content>
      </React.Fragment>
    );
  }
}
