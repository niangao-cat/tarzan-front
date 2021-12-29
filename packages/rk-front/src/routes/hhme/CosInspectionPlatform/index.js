/*
 * @Description: cos检验平台
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-10 11:21:26
 * @LastEditTime: 2020-10-05 11:35:06
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Spin, Card, Modal } from 'hzero-ui';
import { Scrollbars } from 'react-custom-scrollbars';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import uuid from 'uuid/v4';

import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import {
  getCurrentOrganizationId,
  getEditTableData,
} from 'utils/utils';
import ChipContainerMap from '@/components/ChipContainerMap';
import EnterSite from '@/components/EnterSite';

import styles from './index.less';
import FilterForm from './FilterForm';
import TableList from './Component/TableList';
import StationEquipment from './Component/StationEquipment';
import DataInfo from './Component/DataInfo';
import DataRecordModal from './Component/DataRecordModal';

import gwPath from '@/assets/gw.png';

@connect(({ cosInspectionPlatform, loading }) => ({
  cosInspectionPlatform,
  tenantId: getCurrentOrganizationId(),
  enterSiteLoading: loading.effects['cosInspectionPlatform/enterSite'],
  addDataRecordLoading: loading.effects['cosInspectionPlatform/addDataRecord'],
  addDataRecordBatchLoading: loading.effects['cosInspectionPlatform/addDataRecordBatch'],
  queryLoadDataLoading: loading.effects['cosInspectionPlatform/queryLoadData'],
  queryDataInspectionLoading: loading.effects['cosInspectionPlatform/queryDataInspection'],
  autoQueryInfoLoading: loading.effects['cosInspectionPlatform/autoQueryInfo'],
  scaneMaterialCodeLoading: loading.effects['cosInspectionPlatform/scaneMaterialCode'],
  bindingEqLoading: loading.effects['cosInspectionPlatform/bindingEq'],
  bindingEqConfirmLoading: loading.effects['cosInspectionPlatform/bindingEqConfirm'],
  fetchEquipmentListLoading: loading.effects['cosInspectionPlatform/getEquipmentList'],
  deleteEqLoading: loading.effects['cosInspectionPlatform/deleteEq'],
  changeEqLoading: loading.effects['cosInspectionPlatform/changeEq'],
  changeEqConfirmLoading: loading.effects['cosInspectionPlatform/changeEqConfirm'],
  checkCompleteOutSiteLoading: loading.effects['cosInspectionPlatform/checkCompleteOutSite'],
}))
export default class CosInspectionPlatform extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinning: false,
      enterSiteVisible: true,
      enterSiteLoading: false,
      woRecord: {},
      selectedBox: {},
    };
    this.initData();
  }

  HandoverMatterForm;

  @Bind()
  initData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cosInspectionPlatform/updateState',
      payload: {
        workcellInfo: {}, // 工位信息
        defaultSite: {},
        equipmentList: [], // 设备列表
        dataRecordList: [],
        addDataRecordList: [],
        woInfo: [],
        containerInfo: [],
      },
    });
    this.setState({
      enterSiteVisible: true,
      enterSiteLoading: false,
      woRecord: {},
    });
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'cosInspectionPlatform/batchLovData',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'cosInspectionPlatform/getSiteList',
      payload: {
        tenantId,
      },
    });
  }

  @Bind()
  enterSite(val) {
    this.setState({ enterSiteLoading: true });
    const {
      dispatch,
      cosInspectionPlatform: {
        defaultSite = {},
      },
    } = this.props;
    dispatch({
      type: 'cosInspectionPlatform/enterSite',
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
          this.setState({ enterSiteVisible: false });
          this.getEquipmentList(val);
          this.autoQueryInfo();
        }
      }
    });
  }

  // 查询未出站以及wo数据
  @Bind()
  autoQueryInfo() {
    const {
      dispatch,
      tenantId,
      cosInspectionPlatform: { workcellInfo = {} },
    } = this.props;
    dispatch({
      type: 'cosInspectionPlatform/autoQueryInfo',
      payload: {
        tenantId,
        operationId: workcellInfo.operationId,
        workcellId: workcellInfo.workcellId,
      },
    }).then(res => {
      if (res) {
        // this.fetchContainerInfo(res.transCosType);
      }
    });
  }

  @Bind()
  getEquipmentList(val) {
    const {
      dispatch,
      cosInspectionPlatform: {
        defaultSite = {},
      },
    } = this.props;
    dispatch({
      type: 'cosInspectionPlatform/getEquipmentList',
      payload: {
        workcellCode: val.workcellCode,
        siteId: defaultSite.siteId,
      },
    });
  }

  @Bind()
  scaneMaterialCode(vals) {
    const {
      dispatch,
      tenantId,
      cosInspectionPlatform: { woInfo = [], workcellInfo = {}, defaultSite },
    } = this.props;
    const inArr = woInfo.filter(ele => ele.materialLotCode === vals.materialLotCode);
    // 现在查现有表格中是否有已入栈数据，有的话就是查询，没有需要走入栈逻辑
    if (inArr.length > 0) {
      this.queryLoadData(inArr[0]);
    } else {
      dispatch({
        type: 'cosInspectionPlatform/scaneMaterialCode',
        payload: {
          woInfo,
          tenantId,
          materialLotCode: vals.materialLotCode,
          operationId: workcellInfo.operationId,
          workcellId: workcellInfo.workcellId,
          wkcShiftId: workcellInfo.wkcShiftId,
          siteId: defaultSite.siteId,
        },
      }).then(res => {
        if (res) {
          // 入栈成功之后查询table
          dispatch({
            type: 'cosInspectionPlatform/autoQueryInfo',
            payload: {
              tenantId,
              operationId: workcellInfo.operationId,
              workcellId: workcellInfo.workcellId,
            },
          }).then(autoRes => {
            if (autoRes) {
              // 根据table去匹配需要查的盒子
              const recordArr = autoRes.filter(ele => ele.materialLotCode === vals.materialLotCode);
              if (recordArr.length > 0) {
                this.queryLoadData(recordArr[0]);
              }
              // this.fetchContainerInfo(res.transCosType);
            }
          });
        }
      });
    }
  }


  // 点击行查询装载信息
  @Bind()
  queryLoadData(record) {
    const {
      dispatch,
      tenantId,
    } = this.props;
    dispatch({
      type: 'cosInspectionPlatform/updateState',
      payload: {
        containerInfo: {},
        dataRecordList: [],
        addDataRecordList: [],
      },
    });
    dispatch({
      type: 'cosInspectionPlatform/queryLoadData',
      payload: {
        woRecord: record,
        tenantId,
        materialLotId: record.materialLotId,
        materialLotCode: record.materialLotCode,
        operationRecordId: record.operationRecordId,
        eoJobSnId: record.eoJobSnId,
      },
    });
  }

  @Bind()
  clickPosition(dataSource) {
    const { dispatch, cosInspectionPlatform: { workcellInfo = {}, woRecord, defaultSite } } = this.props;
    dispatch({
      type: 'cosInspectionPlatform/queryDataInspection',
      payload: {
        materialId: woRecord.materialId,
        materialLotId: woRecord.materialLotId,
        cosRecord: woRecord.operationRecordId,
        wkcShiftId: workcellInfo.wkcShiftId,
        workcellId: workcellInfo.workcellId,
        operationId: workcellInfo.operationId,
        workOrderId: woRecord.workOrderId,
        eoJobSnId: woRecord.eoJobSnId,
        loadSequence: dataSource.loadSequence,
        siteId: defaultSite.siteId,
      },
    });
    this.setState({ selectedBox: dataSource });
  }

  /**
   * 数据采集 / 自检 数据输入
   *
   * @param {*} value
   * @param {*} record
   * @memberof OperationPlatform
   */
  @Bind()
  handleAddDataRecord(value, record, dataSourceName) {
    const {
      dispatch,
      cosInspectionPlatform: { [dataSourceName]: dataSource },
    } = this.props;
    const { selectedBox: { loadSequence } } = this.state;
    const { jobRecordId, _status, ...info } = record;
    const payload = record.isEdit && _status === 'create' ? {
      eqDataList: [{ ...info, loadSequence }],
      list: dataSource,
      dataSourceName,
    } : record._status === 'update' && record.isEdit ? {
      eqDataList: [{ ...record, loadSequence }],
      list: dataSource,
      dataSourceName,
    } : {
          ...record,
          loadSequence,
          result: value,
          list: dataSource,
          dataSourceName,
        };
    if (record.isEdit) {
      return dispatch({
        type: `cosInspectionPlatform/addDataRecordBatch`,
        payload,
      });
    } else {
      return dispatch({
        type: `cosInspectionPlatform/addDataRecord`,
        payload,
      });
    }
  }

  @Bind()
  handleOpenDataRecordModal() {
    this.setState({ dataRecordVisible: true });
  }

  @Bind()
  handleCloseDataRecordModal() {
    const { dispatch, cosInspectionPlatform: { addDataRecordList } } = this.props;
    this.setState({ dataRecordVisible: false });
    const newDataRecordList = addDataRecordList.filter(e => e._status !== 'create').map(e => {
      if (e.isEdit) {
        return { ...e, isEdit: false };
      }
      return e;
    });
    dispatch({
      type: `cosInspectionPlatform/updateState`,
      payload: {
        addDataRecordList: newDataRecordList,
      },
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
  handleCleanLine(dataSource, id, current) {
    const { dispatch, cosInspectionPlatform: namespace } = this.props;
    const list = namespace[dataSource];
    const newList = list.filter(item => item[id] !== current[id]);
    let payload = {};
    payload = {
      [dataSource]: newList,
    };
    dispatch({
      type: `cosInspectionPlatform/updateState`,
      payload,
    });
  }

  /**
   * 编辑当前行
   *
   * @param {string} dataSource 数据源在model里的名称
   * @param {string} id 数据源的id名称
   * @param {object} current 当前行
   * @param {boolean} flag
   * @memberof ContractBaseInfo
   */
  @Bind()
  handleEditLine(dataSource, id, current, flag) {
    const { dispatch, cosInspectionPlatform: namespace } = this.props;
    const list = namespace[dataSource];
    const { woRecord } = namespace;
    let newList = [];
    if (dataSource === 'addDataRecordList') {
      newList = list.map(e => {
        if (e[id] === current[id]) {
          return { ...e, eoJobSnId: woRecord.eoJobSnId, isEdit: !!flag, _status: 'update' };
        }
        return e;
      });
    } else {
      newList = list.map(item =>
        item[id] === current[id] ? { ...item, _status: flag ? 'update' : '' } : item
      );
    }
    dispatch({
      type: `cosInspectionPlatform/updateState`,
      payload: {
        [dataSource]: newList,
      },
    });
  }

  /**
   * 补充数据采集
   *
   * @memberof OperationPlatform
   */
  @Bind()
  handleSaveDataRecordList() {
    const { cosInspectionPlatform: { addDataRecordList }, dispatch } = this.props;
    const newData = addDataRecordList.filter(e => e.isEdit);
    const newDataRecordList = getEditTableData(newData, ['jobRecordId']).map(e => ({
      ...e,
      resultType: e.valueType,
    }));
    if (newDataRecordList.length > 0) {
      dispatch({
        type: `cosInspectionPlatform/addDataRecordBatch`,
        payload: {
          eqDataList: newDataRecordList,
          list: addDataRecordList,
          dataSourceName: 'addDataRecordList',
        },
      });
    }
  }

  /**
   * 删除操作
   *
   * @param {array} selectedRows 勾选项
   * @param {string} dataSourceName 数据源模板
   * @param {string} idName 主键id名称
   * @param {string} effects
   * @memberof ContractBaseInfo
   */
  @Bind()
  handleDelete(selectedRows, dataSourceName, idName, effects) {
    const { dispatch, cosInspectionPlatform: namespace } = this.props;
    const selectedRowKeys = selectedRows.map(e => e[idName]);
    const dataSource = namespace[dataSourceName];
    const unSelectedArr = dataSource.filter(e => {
      return selectedRowKeys.indexOf(e[idName]) < 0;
    });
    if (selectedRowKeys.length > 0) {
      Modal.confirm({
        title: '确定删除选中数据?',
        onOk: () => {
          const originDelete = selectedRows.filter(e => e._status !== 'create');
          if (isEmpty(originDelete)) {
            dispatch({
              type: `cosInspectionPlatform/updateState`,
              payload: {
                [dataSourceName]: unSelectedArr,
              },
            });
          } else {
            dispatch({
              type: `cosInspectionPlatform/${effects}`,
              payload: originDelete,
            }).then(res => {
              if (res) {
                dispatch({
                  type: `cosInspectionPlatform/updateState`,
                  payload: {
                    [dataSourceName]: unSelectedArr,
                  },
                });
                notification.success();
              }
            });
          }
        },
      });
    }
  }

  @Bind()
  handleCreate(listName, idName, options = {}) {
    const { dispatch, cosInspectionPlatform: namespace, tenantId } = this.props;
    const dataSource = namespace[listName];
    const { workcellInfo, woRecord } = namespace;
    const payload = {};
    payload[listName] = [
      {
        [idName]: uuid(),
        _status: 'create',
        isEdit: true,
        workcellId: workcellInfo.workcellId,
        tenantId,
        jobId: woRecord.eoJobSnId,
        ...options,
      },
      ...dataSource,
    ];
    dispatch({
      type: `cosInspectionPlatform/updateState`,
      payload,
    });
  }

  @Bind()
  handleCheckComplete() {
    const { dispatch, cosInspectionPlatform: { workcellInfo, containerInfo, woRecord } } = this.props;
    dispatch({
      type: 'cosInspectionPlatform/checkComplete',
      payload: {
        ...woRecord,
      },
    }).then(res => {
      if (res) {
        this.setState({ spinning: true });
        dispatch({
          type: 'cosInspectionPlatform/checkCompleteOutSite',
          payload: {
            ...woRecord,
            ...workcellInfo,
            materialLotLoadList: containerInfo.materialLotLoadList,
          },
        }).then(result => {
          if (result) {
            notification.success();
            this.setState({ spinning: false });
            this.autoQueryInfo();
            // 清空格子
            dispatch({
              type: 'cosInspectionPlatform/updateState',
              payload: {
                containerInfo: {},
              },
            });
          }
        });
      }
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
      type: `cosInspectionPlatform/bindingEq`,
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
    const { dispatch, cosInspectionPlatform: { defaultSite } } = this.props;
    return dispatch({
      type: `cosInspectionPlatform/bindingEqConfirm`,
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
    const { dispatch, cosInspectionPlatform: { defaultSite } } = this.props;
    return dispatch({
      type: `cosInspectionPlatform/changeEqConfirm`,
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
    const { dispatch, cosInspectionPlatform: { defaultSite } } = this.props;
    dispatch({
      type: `cosInspectionPlatform/getEquipmentList`,
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
    const { dispatch, cosInspectionPlatform: { workcellInfo } } = this.props;
    dispatch({
      type: `cosInspectionPlatform/deleteEq`,
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
      type: `cosInspectionPlatform/changeEq`,
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
      type: `cosInspectionPlatform/fetchEqInfo`,
      payload: {
        eqCode,
      },
    });
  }

  render() {
    const { enterSiteVisible, enterSiteLoading, dataRecordVisible, spinning, selectedBox } = this.state;
    const {
      addDataRecordLoading,
      addDataRecordBatchLoading,
      tenantId,
      queryLoadDataLoading,
      queryDataInspectionLoading,
      autoQueryInfoLoading,
      bindingEqLoading,
      bindingEqConfirmLoading,
      fetchEquipmentListLoading,
      deleteEqLoading,
      changeEqLoading,
      changeEqConfirmLoading,
      checkCompleteOutSiteLoading,
      cosInspectionPlatform: {
        workcellInfo = {},
        equipmentList = [],
        dataRecordList = [],
        addDataRecordList = [],
        containerInfo = {},
        woInfo = [],
        woRecord = {},
        defaultSite = {},
      },
    } = this.props;
    const { materialLotLoadList = [], locationColumn, locationRow } = containerInfo;
    const { hotSinkCode } = selectedBox;
    const enterSiteProps = {
      visible: enterSiteVisible,
      loading: false || enterSiteLoading,
      closePath: '/hhme/cos-inspection-platform',
      enterSite: this.enterSite,
    };
    const filterFormProps = {
      onRef: node => {
        this.filterForm = node.props.form;
      },
      scaneMaterialCode: this.scaneMaterialCode,
    };
    const dataInfoProps = {
      checkCompleteOutSiteLoading,
      loading: addDataRecordLoading || addDataRecordBatchLoading || queryDataInspectionLoading || false,
      dataSource: dataRecordList,
      onEnterClick: this.handleAddDataRecord,
      onOpenDataRecordModal: this.handleOpenDataRecordModal,
      inspectionCompleted: this.handleCheckComplete,
    };
    const dataRecordModalProps = {
      tenantId,
      loading: addDataRecordLoading || addDataRecordBatchLoading,
      dataSource: addDataRecordList,
      visible: dataRecordVisible,
      onCloseModal: this.handleCloseDataRecordModal,
      onCleanLine: this.handleCleanLine,
      onEditLine: this.handleEditLine,
      onSave: this.handleSaveDataRecordList,
      onDelete: this.handleDelete,
      onCreate: this.handleCreate,
      onEnterClick: this.handleAddDataRecord,
    };
    const tableListProps = {
      woRecord,
      loading: autoQueryInfoLoading,
      dataSource: woInfo,
      queryLoadData: this.queryLoadData,
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
    return (
      <Fragment>
        <Header title="COS检验平台" />
        <Content style={{ padding: '0px', backgroundColor: 'transparent' }}>
          <Spin spinning={queryLoadDataLoading || spinning}>
            <Row gutter={16}>
              <Col span={18} className={styles['cos-inspection-platform-table']}>
                <FilterForm {...filterFormProps} />
                <Row gutter={8}>
                  <Col>
                    <TableList {...tableListProps} />
                  </Col>
                </Row>
              </Col>
              <Col span={6}>
                <Card className={styles['cos-inspection-platform-site-card']}>
                  <div style={{ float: 'left' }}><img src={gwPath} alt="" /></div>
                  <div style={{ float: 'left', padding: '2px' }}>当前工位：{workcellInfo.workcellName}</div>
                </Card>
                <Card title="工位设备" className={styles['cos-inspection-platform-equipment-card']}>
                  <Scrollbars style={{ height: '240px' }}>
                    <StationEquipment
                      {...stationEquipmentProps}
                    />
                  </Scrollbars>
                </Card>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: '8px' }}>
              <Col span={20} className={styles['cos-inspection-platform-bottom-position']}>
                <Row>
                  <Col span={9}>
                    <Scrollbars style={{ height: '283px' }}>
                      <ChipContainerMap
                        formFlag={false}
                        clickPosition={this.clickPosition}
                        popconfirm={false}
                        dataSource={materialLotLoadList}
                        locationRow={locationRow}
                        locationColumn={locationColumn}
                      />
                    </Scrollbars>
                    <div style={{fontSize: '14px', fontWeight: '700', textAlign: 'center'}}>
                      热沉号：{hotSinkCode}
                    </div>
                  </Col>
                  <Col span={15} style={{ paddingLeft: '8px' }}>
                    <DataInfo {...dataInfoProps} />
                    <div className={styles['data-content']}>
                      <DataRecordModal {...dataRecordModalProps} />
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col span={4}>
                <Card className={styles['cos-inspection-platform-link-card']}>
                  <div className={styles['cos-inspection-platform-link-card-button']}>
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
          {enterSiteVisible && <EnterSite {...enterSiteProps} />}
        </Content>
      </Fragment>
    );
  }
}
