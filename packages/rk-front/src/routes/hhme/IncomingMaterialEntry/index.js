/*
 * @Description: 来料录入
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-06 16:06:44
 * @LastEditTime: 2020-11-03 12:32:47
 */

import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Row, Col, Spin, Card, Button } from 'hzero-ui';
import queryString from 'querystring';
import { openTab } from 'utils/menuTab';
import { Scrollbars } from 'react-custom-scrollbars';
import {
  getCurrentOrganizationId,
  filterNullValueObject,
} from 'utils/utils';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import { isEmpty } from 'lodash';
import styles from './index.less';
import FilterForm from './FilterForm';
import BottomForm from './Component/BottomForm';
import LeftTable from './Component/LeftTable';
import MaterialBarCodeModal from './Component/MaterialBarCodeModal';
import LocationMap from './Component/LocationMap';
import BajoChipInfo from './Component/BajoChipInfo';
import StationEquipment from './Component/StationEquipment';
import CreateWOModal from './Component/CreateWOModal';
import EnterModal from './Component/EnterModal';
import MainMaterialModal from './Component/MainMaterialModal';
import gwPath from '@/assets/gw.png';

@connect(({ incomingMaterialEntry, loading }) => ({
  incomingMaterialEntry,
  tenantId: getCurrentOrganizationId(),
  getSiteListLoading: loading.effects['incomingMaterialEntry/getSiteList'],
  scaneMaterialCodeLoading: loading.effects['incomingMaterialEntry/scaneMaterialCode'],
  fetchWoIncomingRecordLoading: loading.effects['incomingMaterialEntry/fetchWoIncomingRecord'],
  deleteNcLoadLoading: loading.effects['incomingMaterialEntry/deleteNcLoad'],
  ncLoadLoading: loading.effects['incomingMaterialEntry/ncLoad'],
  bindingEqLoading: loading.effects['incomingMaterialEntry/bindingEq'],
  bindingEqConfirmLoading: loading.effects['incomingMaterialEntry/bindingEqConfirm'],
  fetchEquipmentListLoading: loading.effects['incomingMaterialEntry/getEquipmentList'],
  deleteEqLoading: loading.effects['incomingMaterialEntry/deleteEq'],
  changeEqLoading: loading.effects['incomingMaterialEntry/changeEq'],
  changeEqConfirmLoading: loading.effects['incomingMaterialEntry/changeEqConfirm'],
  fetchMainMaterialLoading: loading.effects['incomingMaterialEntry/fetchMainMaterial'],
}))
export default class IncomingMaterialEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinning: false,
      woVisible: false,
      visible: true,
      enterSiteLoading: false,
      bottomLeftLoding: false,
      materialVisible: false,
      mainVisible: false,
      woRecord: {},
      createOrEdit: '',
    };
  }

  HandoverMatterForm;

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'incomingMaterialEntry/batchLovData',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'incomingMaterialEntry/getSiteList',
      payload: {
        tenantId,
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'incomingMaterialEntry/updateState',
      payload: {
        workcellInfo: {}, // 工位信息
        containerCapacity: {}, // 容器芯片扩展属性-行数、列数、芯片数
        woIncomingRecordList: [], // 工单来料记录表
        woIncomingRecordListPagination: {},
        materialContainerInfo: {}, // 物料、容器的部分信息
        materialList: [], // 物料信息
        materialListPagination: {},
        defaultSite: {},
      },
    });
  }

  /**
   * @description: 输入工位
   * @param {Object} values 工位编码
   */
  @Bind()
  enterSite(val) {
    this.setState({ enterSiteLoading: true });
    const {
      dispatch,
      incomingMaterialEntry: {
        defaultSite = {},
      },
    } = this.props;
    dispatch({
      type: 'incomingMaterialEntry/enterSite',
      payload: {
        ...val,
        siteId: defaultSite.siteId,
      },
    }).then(res => {
      this.setState({ enterSiteLoading: false });
      if (res) {
        if (res.operationIdList.length > 1) {
          notification.error({ message: `当前${res.workcellName}存在多个工艺，请重新扫描！` });
        } else {
          this.setState({ visible: false });
          this.fetchWoIncomingRecord();
          this.getEquipmentList(val);
        }
      }
    });
  }

  // 获取设备列表
  @Bind()
  getEquipmentList(val) {
    const {
      dispatch,
      incomingMaterialEntry: {
        defaultSite = {},
      },
    } = this.props;
    dispatch({
      type: 'incomingMaterialEntry/getEquipmentList',
      payload: {
        workcellCode: val.workcellCode,
        siteId: defaultSite.siteId,
      },
    });
  }

  @Bind()
  handleCreateWOVisible(flag, type, record) {
    this.setState({ woVisible: flag, createOrEdit: type });
    const {
      dispatch,
      incomingMaterialEntry: {
        defaultSite = {},
        workcellInfo = {},
      },
    } = this.props;
    dispatch({
      type: 'incomingMaterialEntry/updateState',
      payload: {
        remainingQty: '',
        incomingQty: '',
        unitQty: '',
      },
    });
    if (type === 'EDIT') {
      dispatch({
        type: 'incomingMaterialEntry/fetchrRemainingQty',
        payload: {
          operationId: workcellInfo.operationId,
          workOrderId: record.workOrderId,
          containerTypeCode: record.containerTypeCode,
          barNum: record.barNum,
          cosType: record.cosType,
          siteId: defaultSite.siteId,
        },
      });
      dispatch({
        type: 'incomingMaterialEntry/changeCosType',
        payload: {
          operationId: workcellInfo.operationId,
          workOrderId: record.workOrderId,
          containerTypeCode: record.containerTypeCode,
          barNum: record.barNum,
          cosType: record.cosType,
        },
      });
    }
  }

  /**
   * @description: 查询工单来料信息记录
   * @param {type} params
   * @return {Object} 工单来料记录
   */
  @Bind()
  fetchWoIncomingRecord(fields = {}) {
    const {
      dispatch,
      tenantId,
      incomingMaterialEntry: { workcellInfo = {} },
    } = this.props;
    const fieldsValue = (this.filterForm && filterNullValueObject(this.filterForm.getFieldsValue())) || {};
    dispatch({
      type: 'incomingMaterialEntry/fetchWoIncomingRecord',
      payload: {
        tenantId,
        operationId: workcellInfo.operationId,
        prodLineId: workcellInfo.prodLineId,
        workcellId: workcellInfo.workcellId,
        ...fieldsValue,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   * @description: 获取工单来料芯片数、剩余芯片数量
   * @param {Object} val barNum containerTypeCode cosType operationId workOrderId
   */
  @Bind()
  fetchCosNumRemainingNum(val) {
    const {
      dispatch,
      tenantId,
      incomingMaterialEntry: { workcellInfo = {} },
    } = this.props;
    dispatch({
      type: 'incomingMaterialEntry/fetchCosNumRemainingNum',
      payload: {
        tenantId,
        operationId: workcellInfo.operationId,
        workOrderId: val.workOrderId,
        barNum: val.barNum,
        containerTypeCode: val.containerTypeCode,
        cosType: val.cosType,
      },
    });
  }

  /**
   * @description: 生成工单来料信息记录，录入完弹框中的内容调用此函数
   * @param {Object} fieldsValue form表单所有数据
   */
  @Bind()
  createWoIncomingRecord(fieldsValue) {
    const { woRecord, createOrEdit } = this.state;
    if (parseInt(fieldsValue.remainingQty, 0) >= parseInt(fieldsValue.cosNum, 0)) {
      const {
        dispatch,
        tenantId,
        incomingMaterialEntry: { workcellInfo = {} },
      } = this.props;
      let types;
      switch (createOrEdit) {
        case 'EDIT':
          types = 'incomingMaterialEntry/updateWo';
          break;
        case 'CREATE':
          types = 'incomingMaterialEntry/createWoIncomingRecord';
          break;
        default:
          break;
      }
      dispatch({
        type: types,
        payload: {
          tenantId,
          operationId: workcellInfo.operationId,
          workcellId: workcellInfo.workcellId,
          operationRecordId: createOrEdit === 'EDIT' && woRecord.operationRecordId,
          ...fieldsValue,
          jobBatch: fieldsValue.jobBatch && fieldsValue.jobBatch.format('YYYY-MM-DD'),
        },
      }).then(res => {
        if (res) {
          this.handleCreateWOVisible(false, '', {});
          this.fetchWoIncomingRecord();
        }
      });
    } else {
      notification.error({ message: '本次录入的芯片数量，已超出工单可录入的剩余芯片数量！' });
    }
  }

  /**
   * @description: 点击工单记录行调用此函数查询容器信息然后扫描物料绑定工单和物料的关系，
   * 此函数将工单行相关数据缓存到modal中的state中，然后在查询位置信息
   * @param {type} record 工单行信息
   * @return {type} 返回容器相关信息
   */
  @Bind()
  fetchMaterialContainer(record) {
    const {
      dispatch,
    } = this.props;
    this.setState({ woRecord: record });
    const materialLotCodeInputs = document.getElementById('incomingMaterialLotCode');
    materialLotCodeInputs.focus();
    dispatch({
      type: 'incomingMaterialEntry/updateState',
      payload: {
        materialContainerInfo: record,
      },
    });
    this.bottomForm.resetFields();
    this.fetchWorkDetails(record);
  }

  @Bind()
  fetchWorkDetails(record) {
    const {
      dispatch,
      incomingMaterialEntry: { workcellInfo = {}, defaultSite = {} },
    } = this.props;
    this.setState({ bottomLeftLoding: true });
    dispatch({
      type: 'incomingMaterialEntry/fetchWorkDetails',
      payload: {
        operationRecordId: record.operationRecordId,
        operationId: workcellInfo.operationId,
        workcellId: workcellInfo.workcellId,
        siteId: defaultSite.siteId,
      },
    }).then(() => {
      this.setState({ bottomLeftLoding: false });
    });
  }

  /**
   * @description: 扫描完条码点击确认绑定工单和物料
   * @param {type} params
   */
  @Bind()
  bindMaterialWo() {
    const fieldsValue = (this.bottomForm && this.bottomForm.getFieldsValue()) || {};
    const {
      dispatch,
      tenantId,
      incomingMaterialEntry: { workcellInfo = {}, equipmentList = [], materialInfo = {} },
    } = this.props;
    const eqList = equipmentList.filter((item) => {
      return item.equipmentId;
    });
    const eqStatusList = [];
    eqList.forEach(item => {
      eqStatusList.push({
        ...item,
        equipmentStatus: item.color,
      });
    });
    const { woRecord } = this.state;
    dispatch({
      type: 'incomingMaterialEntry/bindMaterialWo',
      payload: {
        tenantId,
        equipmentList: eqStatusList,
        operationId: workcellInfo.operationId,
        workcellId: workcellInfo.workcellId,
        ...fieldsValue,
        eoJobSnId: materialInfo.eoJobSnId,
        materialLotId: materialInfo.materialLotId,
        operationRecordId: woRecord.operationRecordId,
        processedNum: materialInfo.primaryUonQty,
        woJobSnId: materialInfo.woJobSnId,

      },
    }).then(res => {
      if (res) {
        notification.success();
        this.bottomForm.resetFields();
        this.fetchWorkDetails(woRecord);
        this.fetchWoIncomingRecord();
      }
    });
  }


  /**
   * @description: 扫描条码
   * @param {type} params
   */
  @Bind()
  scaneMaterialCode(vals) {
    const {
      dispatch,
      tenantId,
      incomingMaterialEntry: { workcellInfo = {}, defaultSite = {} },
    } = this.props;
    const { woRecord } = this.state;
    this.setState({ bottomLeftLoding: true });
    dispatch({
      type: 'incomingMaterialEntry/scaneMaterialCode',
      payload: {
        tenantId,
        operationRecordId: woRecord.operationRecordId,
        materialLotCode: vals.materialLotCode,
        operationId: workcellInfo.operationId,
        workcellId: workcellInfo.workcellId,
        wkcLineId: workcellInfo.wkcLineId,
        shiftId: workcellInfo.wkcShiftId,
        siteId: defaultSite.siteId,
      },
    }).then(() => {
      this.setState({ bottomLeftLoding: false });
    });
  }

  // 不良确认
  @Bind()
  ncLoad() {
    const {
      dispatch,
      incomingMaterialEntry: { barCol = '', locationMapInfo = {}, workcellInfo = {}, defaultSite, ncList = [] },
    } = this.props;
    if (ncList.length === 0) {
      const arr = [];
      arr.push({
        loadNum: barCol,
        loadSequence: locationMapInfo.loadSequence,
      });
      const { woRecord } = this.state;
      dispatch({
        type: 'incomingMaterialEntry/ncLoad',
        payload: {
          arr,
        },
      }).then(res => {
        if (res) {
          notification.success();
          // 确定不良之后根据选中的工单在查一次明细
          dispatch({
            type: 'incomingMaterialEntry/fetchWorkDetails',
            payload: {
              operationRecordId: woRecord.operationRecordId,
              operationId: workcellInfo.operationId,
              workcellId: workcellInfo.workcellId,
              siteId: defaultSite.siteId,
            },
          }).then(detailRes => {
            // 明细里面会返回最新的容器信息：包括行列信息
            if (detailRes) {
              dispatch({
                type: 'incomingMaterialEntry/updateState',
                payload: {
                  locationMapInfo: {
                    ...locationMapInfo,
                    // 每次在点击容器的小格子时会记录所选数据的数组下标，用下标取出当前芯片列
                    docList: detailRes.hmeWoJobSnReturnDTO5List[locationMapInfo.index].docList,
                  },
                  barCol: null,
                  heightBack: null, // 清除高亮
                },
              });
            }
          });
        }
      });
    } else {
      notification.warning({ message: '当前位置已有不良' });
    };
  }

  // 取消不良
  @Bind()
  deleteNcLoad() {
    const {
      dispatch,
      incomingMaterialEntry: { barCol = '', locationMapInfo = {}, workcellInfo = {}, defaultSite = {}, ncList = [] },
    } = this.props;
    if (ncList.length > 0) {
      const arr = [];
      arr.push({
        loadNum: barCol,
        loadSequence: locationMapInfo.loadSequence,
      });
      const { woRecord } = this.state;
      dispatch({
        type: 'incomingMaterialEntry/deleteNcLoad',
        payload: {
          arr,
        },
      }).then(res => {
        if (res) {
          notification.success();
          // 确定不良之后根据选中的工单在查一次明细
          dispatch({
            type: 'incomingMaterialEntry/fetchWorkDetails',
            payload: {
              operationRecordId: woRecord.operationRecordId,
              operationId: workcellInfo.operationId,
              workcellId: workcellInfo.workcellId,
              siteId: defaultSite.siteId,
            },
          }).then(detailRes => {
            // 明细里面会返回最新的容器信息：包括行列信息
            if (detailRes) {
              dispatch({
                type: 'incomingMaterialEntry/updateState',
                payload: {
                  locationMapInfo: {
                    ...locationMapInfo,
                    // 每次在点击容器的小格子时会记录所选数据的数组下标，用下标取出当前芯片列
                    docList: detailRes.hmeWoJobSnReturnDTO5List[locationMapInfo.index].docList,
                  },
                  barCol: null,
                  heightBack: null, // 清除高亮
                },
              });
            }
          });
        }
      });
    } else {
      notification.warning({ message: '当前位置暂无不良' });
    }
  }

  // 查询物料条码
  @Bind()
  fetchMaterialBarCode(flag, record) {
    if (flag) {
      this.setState({ materialVisible: flag });
      this.fetchWorkDetails(record);
    } else {
      this.setState({ materialVisible: flag });
    }
  }

  // 选中工单
  @Bind()
  selectWo(val) {
    const {
      dispatch,
      incomingMaterialEntry: { workcellInfo = {}, defaultSite = {} },
    } = this.props;
    const fieldsValue = (this.woCreateFilter && filterNullValueObject(this.woCreateFilter.getFieldsValue())) || {};
    dispatch({
      type: 'incomingMaterialEntry/fetchrRemainingQty',
      payload: {
        operationId: workcellInfo.operationId,
        workOrderId: val.workOrderId,
        containerTypeCode: fieldsValue.containerTypeCode,
        barNum: fieldsValue.barNum,
        cosType: fieldsValue.cosType,
        siteId: defaultSite.siteId,
      },
    });
  }

  // 更改costype
  @Bind()
  changeCosType(val) {
    const {
      dispatch,
      incomingMaterialEntry: { workcellInfo = {} },
    } = this.props;
    const fieldsValue = (this.woCreateFilter && filterNullValueObject(this.woCreateFilter.getFieldsValue())) || {};
    dispatch({
      type: 'incomingMaterialEntry/changeCosType',
      payload: {
        operationId: workcellInfo.operationId,
        workOrderId: fieldsValue.workOrderId,
        containerTypeCode: fieldsValue.containerTypeCode,
        barNum: fieldsValue.barNum,
        cosType: val,
      },
    });
  }

  /**
   * 批量导入
   */
  @Bind()
  handleBatchImport() {
    const { incomingMaterialEntry: { workcellInfo = {} } } = this.props;
    const param = {
      workcellId: workcellInfo.workcellId,
      operationId: workcellInfo.operationIdList[0],
      wkcShiftId: workcellInfo.wkcShiftId,
    };
    openTab({
      key: '/hhme/incoming-import/HME.COS_CHIP_NUM_IMP',
      search: queryString.stringify({
        // prefixPath: '/mes-8736',
        key: '/hhme/incoming-import/HME.COS_CHIP_NUM_IMP',
        title: '来料录入导入',
        action: '来料录入导入',
        // eslint-disable-next-line no-useless-concat
        args: JSON.stringify(param),
        // args: "{\"args\":\"cos-ll\"}",
        auto: true,
      }),
    });
  }

  /**
   * 绑定设备
   *
   * @param {*} data
   * @returns
   * @memberof OperationPlatform
   */
  @Bind()
  handleBindingEq(data) {
    const { dispatch } = this.props;
    return dispatch({
      type: `incomingMaterialEntry/bindingEq`,
      payload: data,
    });
  }

  /**
   * 绑定设备确认
   *
   * @param {*} [info={}]
   * @returns
   * @memberof OperationPlatform
   */
  @Bind()
  handleBindingEqConfirm(info = {}) {
    const { dispatch, incomingMaterialEntry: { defaultSite } } = this.props;
    return dispatch({
      type: `incomingMaterialEntry/bindingEqConfirm`,
      payload: {
        ...info,
        siteId: defaultSite.siteId,
      },
    });
  }

  /**
   * 更换设备确认
   *
   * @param {*} [info={}]
   * @returns
   * @memberof OperationPlatform
   */
  @Bind()
  handleChangeEqConfirm(info = {}) {
    const { dispatch, incomingMaterialEntry: { defaultSite } } = this.props;
    return dispatch({
      type: `incomingMaterialEntry/changeEqConfirm`,
      payload: {
        ...info,
        siteId: defaultSite.siteId,
      },
    });
  }

  /**
   * 根据工位加载设备类列表
   *
   * @param {*} workcellCode
   * @memberof OperationPlatform
   */
  @Bind()
  handleFetchEquipment(workcellCode) {
    const { dispatch, incomingMaterialEntry: { defaultSite } } = this.props;
    dispatch({
      type: `incomingMaterialEntry/getEquipmentList`,
      payload: {
        workcellCode,
        siteId: defaultSite.siteId,
        // siteId: 40226.1,
      },
    });
  }

  /**
   * 设备切换，删除设备
   *
   * @param {*} [data={}]
   * @memberof OperationPlatform
   */
  @Bind()
  handleDeleteEq(data = {}) {
    const { dispatch, incomingMaterialEntry: { workcellInfo } } = this.props;
    dispatch({
      type: `incomingMaterialEntry/deleteEq`,
      payload: data,
    }).then(res => {
      if (res) {
        notification.success();
        this.handleFetchEquipment(workcellInfo.workcellCode);
      }
    });
  }

  /**
   * 更换设备信息
   *
   * @param {*} [data={}]
   * @memberof OperationPlatform
   */
  @Bind()
  handleChangeEq(data = {}) {
    const { dispatch } = this.props;
    return dispatch({
      type: `incomingMaterialEntry/changeEq`,
      payload: data,
    });
  }

  /**
   * 查询设备信息
   *
   * @param {*} eqCode
   * @memberof OperationPlatform
   */
  @Bind()
  handleFetchEqInfo(eqCode) {
    const { dispatch } = this.props;
    return dispatch({
      type: `incomingMaterialEntry/fetchEqInfo`,
      payload: {
        eqCode,
      },
    });
  }

  // 打开组键物料
  @Bind()
  openMainMaterial(record, flag) {
    this.setState({ mainVisible: flag });
    if (flag) {
      this.fetchMainMaterial(record);
    }
  }

  // 查询组件物料
  @Bind()
  fetchMainMaterial(record) {
    const { dispatch } = this.props;
    return dispatch({
      type: `incomingMaterialEntry/fetchMainMaterial`,
      payload: {
        ...record,
      },
    });
  }

  render() {
    const {
      incomingMaterialEntry: {
        lovData = {},
        woIncomingRecordList = [],
        woIncomingRecordListPagination={},
        materialContainerInfo = {},
        materialList = [],
        workcellInfo = {},
        materialInfo = {},
        equipmentList = [],
        locationMapInfo = {},
        barCol = '',
        heightBack = '',
        remainingQty = '',
        incomingQty = '',
        unitQty = '',
        defaultSite = {},
        mainMaterialList = [],
        woWithCosType = '',
      },
      tenantId,
      getSiteListLoading,
      fetchWoIncomingRecordLoading,
      deleteNcLoadLoading,
      ncLoadLoading,
      bindingEqLoading,
      bindingEqConfirmLoading,
      fetchEquipmentListLoading,
      deleteEqLoading,
      changeEqLoading,
      changeEqConfirmLoading,
      fetchMainMaterialLoading,
    } = this.props;
    const { woVisible, visible, enterSiteLoading, bottomLeftLoding, woRecord, materialVisible, mainVisible, createOrEdit } = this.state;
    const filterFormProps = {
      lovData,
      onSearch: this.fetchWoIncomingRecord,
      onRef: node => {
        this.filterForm = node.props.form;
      },
    };
    const woCreateProps = {
      visible: woVisible,
      lovData,
      tenantId,
      workcellInfo,
      remainingQty,
      incomingQty,
      unitQty,
      woWithCosType,
      createOrEdit,
      woRecord: createOrEdit === 'EDIT' ? woRecord : {},
      onRef: node => {
        this.woCreateFilter = node.props.form;
      },
      onCancel: this.handleCreateWOVisible,
      onOk: this.createWoIncomingRecord,
      fetchCosNumRemainingNum: this.fetchCosNumRemainingNum,
      selectWo: this.selectWo,
      changeCosType: this.changeCosType,
    };
    const leftTableProps = {
      dataSource: woIncomingRecordList,
      pagination: woIncomingRecordListPagination,
      loading: fetchWoIncomingRecordLoading,
      onSearch: this.fetchWoIncomingRecord,
      fetchMaterialBarCode: this.fetchMaterialBarCode,
      fetchMaterialContainer: this.fetchMaterialContainer,
      openMainMaterial: this.openMainMaterial,
      handleCreateWOVisible: this.handleCreateWOVisible,
    };
    const bottomFormProps = {
      materialContainerInfo,
      info: materialInfo,
      bindMaterialWo: this.bindMaterialWo,
      scaneMaterialCode: this.scaneMaterialCode,
      onRef: node => {
        this.bottomForm = node.props.form;
      },
    };
    const enterModalProps = {
      visible,
      loading: getSiteListLoading || enterSiteLoading,
      enterSite: this.enterSite,
    };
    const locationMapProps = {
      materialContainerInfo,
      locationMapInfo,
      woRecord,
      info: materialInfo.hmeWoJobSnReturnDTO5List || [],
      scaneMaterialCode: this.scaneMaterialCode,
    };
    const bajoChipInfoProps = {
      locationMapInfo,
      barCol,
      heightBack,
      deleteNcLoadLoading,
      ncLoadLoading,
      ncLoad: this.ncLoad,
      deleteNcLoad: this.deleteNcLoad,
    };
    const materialBarCodeModalProps = {
      visible: materialVisible,
      dataSource: materialList,
      fetchMaterialBarCode: this.fetchMaterialBarCode,
    };
    const stationEquipmentProps = {
      siteId: defaultSite.siteId,
      workcellId: workcellInfo.workcellId,
      workcellCode: workcellInfo.workcellCode,
      deleteEqLoading,
      changeEqLoading,
      bindingEqLoading,
      bindingEqConfirmLoading,
      changeEqConfirmLoading,
      loading: fetchEquipmentListLoading,
      itemList: equipmentList,
      onDelete: this.handleDeleteEq,
      onChange: this.handleChangeEq,
      onBinding: this.handleBindingEq,
      onBindingEqConfirm: this.handleBindingEqConfirm,
      onChangeEqConfirm: this.handleChangeEqConfirm,
      onFetchEqInfo: this.handleFetchEqInfo,
      onFetchEquipment: this.handleFetchEquipment,
    };
    const mainMaterialProps = {
      dataSource: mainMaterialList,
      visible: mainVisible,
      loading: fetchMainMaterialLoading,
      onCancel: this.openMainMaterial,
    };
    return (
      <Fragment>
        <Header title="来料录入">
          {/* <Button
            icon="to-top"
            onClick={this.handleBatchImport}
          >
            批量导入
          </Button> */}
          <Button type="primary" icon="plus" onClick={() => this.handleCreateWOVisible(true, 'CREATE', {})}>
            新建
          </Button>
        </Header>
        <Content style={{ padding: '0px', backgroundColor: 'transparent' }}>
          <Spin spinning={this.state.spinning}>
            <Row gutter={16}>
              <Col span={18} className={styles['incoming-material-entry-table']}>
                <FilterForm {...filterFormProps} />
                <Row>
                  <Col span={24}>
                    <LeftTable {...leftTableProps} />
                  </Col>
                </Row>
              </Col>
              <Col span={6}>
                <Card className={styles['incoming-material-entry-site-card']}>
                  <div style={{ float: 'left' }}><img src={gwPath} alt="" /></div>
                  <div style={{ float: 'left', padding: '2px' }}>当前工位：{workcellInfo.workcellName}</div>
                </Card>
                <Card title="工位设备" className={styles['incoming-material-entry-equipment-card']}>
                  <Scrollbars style={{ height: '240px' }}>
                    <StationEquipment
                      {...stationEquipmentProps}
                    />
                  </Scrollbars>
                </Card>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: '8px' }}>
              <Col span={20} className={styles['incoming-material-bottom-position']}>
                <Spin spinning={bottomLeftLoding}>
                  <Row>
                    <Col span={8} style={{ marginRight: '8px' }}>
                      <BottomForm {...bottomFormProps} />
                    </Col>
                    <Col span={8} style={{ marginTop: '8px' }}>
                      <LocationMap {...locationMapProps} />
                    </Col>
                    <Col span={6} style={{ marginTop: '50px' }}>
                      <BajoChipInfo {...bajoChipInfoProps} />
                    </Col>
                  </Row>
                </Spin>
              </Col>
              <Col span={4}>
                <Card className={styles['incoming-material-entry-link-card']}>
                  <div className={styles['incoming-material-entry-link-button']}>
                    <div>
                      <span className={styles['incoming-material-entry-link-span']} />
                      <span>不良统计</span>
                      <span className={styles['incoming-material-entry-link-quantity']}>查看</span>
                    </div>
                    <div>
                      <span className={styles['incoming-material-entry-link-span']} />
                      <span>异常反馈</span>
                      <span className={styles['incoming-material-entry-link-quantity']}>查看</span>
                    </div>
                    <div>
                      <span className={styles['incoming-material-entry-link-span']} />
                      <span>制造履历</span>
                      <span className={styles['incoming-material-entry-link-quantity']}>查看</span>
                    </div>
                    <div>
                      <span className={styles['incoming-material-entry-link-span']} />
                      <span>E-SOP</span>
                      <span className={styles['incoming-material-entry-link-quantity']}>查看</span>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Spin>
          {woVisible && <CreateWOModal {...woCreateProps} />}
          {visible && <EnterModal {...enterModalProps} />}
          {materialVisible && <MaterialBarCodeModal {...materialBarCodeModalProps} />}
          {mainVisible && <MainMaterialModal {...mainMaterialProps} />}
        </Content>
      </Fragment>
    );
  }
}
