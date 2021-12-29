/*
 * @Description: 芯片不良记录
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-06 16:06:44
 * @LastEditTime: 2021-03-09 16:55:28
 */

import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Row, Col, Spin, Card, Table, Button, Popconfirm, Modal } from 'hzero-ui';
import { Scrollbars } from 'react-custom-scrollbars';
import { Bind } from 'lodash-decorators';
import { difference, intersectionBy, isEmpty } from 'lodash';
import queryString from 'querystring';

import {
  getCurrentOrganizationId,
} from 'utils/utils';
import notification from 'utils/notification';
import { openTab } from 'utils/menuTab';

import styles from './index.less';
import BottomForm from './Component/BottomForm';
import StationEquipment from './Component/StationEquipment';
import Title from '@/components/Title';
import NCTypeForm from './Component/NCTypeForm';
import EnterModal from './Component/EnterModal';
import ChipContainerMap from '@/components/ChipContainerMap';
import ChipList from '@/components/ChipList';
import { upperCaseChars } from '@/utils/utils';
import gwPath from '@/assets/gw.png';

@connect(({ chipNCRecordPlatform, globalMes, loading }) => ({
  chipNCRecordPlatform,
  globalMes,
  tenantId: getCurrentOrganizationId(),
  getSiteListLoading: loading.effects['cosChipMove/getSiteList'],
  getEquipmentListLoading: loading.effects['cosChipMove/getEquipmentList'],
  ncRecordConfirmLoading: loading.effects['chipNCRecordPlatform/ncRecordConfirm'],
  ncRecordDeleteLoading: loading.effects['chipNCRecordPlatform/ncRecordDelete'],
  siteOutLoading: loading.effects['chipNCRecordPlatform/siteOut'],
  bindingEqLoading: loading.effects['chipNCRecordPlatform/bindingEq'],
  bindingEqConfirmLoading: loading.effects['chipNCRecordPlatform/bindingEqConfirm'],
  fetchEquipmentListLoading: loading.effects['chipNCRecordPlatform/getEquipmentList'],
  deleteEqLoading: loading.effects['chipNCRecordPlatform/deleteEq'],
  changeEqLoading: loading.effects['chipNCRecordPlatform/changeEq'],
  changeEqConfirmLoading: loading.effects['chipNCRecordPlatform/changeEqConfirm'],
  chipScrappedLoading: loading.effects['chipNCRecordPlatform/chipScrapped'],
}))
export default class ChipNCRecordPlatform extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      spinning: false,
      enterSiteLoading: false,
      selectedRowKeys: [],
    };
  }

  HandoverMatterForm;

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'chipNCRecordPlatform/batchLovData',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'chipNCRecordPlatform/getSiteList',
      payload: {
        tenantId,
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chipNCRecordPlatform/updateState',
      payload: {
        workcellInfo: {}, // 工位信息
        defaultSite: {},
        equipmentList: [], // 设备列表
        ncList: [], // 不良列表
        containerInfo: {}, // 容器信息
        selectInfo: [], // 选中单元格的信息
        selectChipInfo: {}, // 选中芯片的信息
        ncRecordList: [], // 选中芯片的不良记录
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
      chipNCRecordPlatform: {
        defaultSite = {},
      },
    } = this.props;
    dispatch({
      type: 'chipNCRecordPlatform/enterSite',
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
          this.getEquipmentList(val);
          this.fetchNcCode();
          this.fetchQueryProcessing(res);
        }
      }
    });
  }

  // 获取未出站数据
  @Bind()
  fetchQueryProcessing(val) {
    const {
      dispatch,
      tenantId,
    } = this.props;
    this.setState({ spinning: true });
    dispatch({
      type: 'chipNCRecordPlatform/fetchQueryProcessing',
      payload: {
        tenantId,
        operationId: val.operationIdList[0],
        workcellId: val.workcellId,
        wkcShiftId: val.wkcShiftId,
      },
    }).then(() => {
      this.setState({ spinning: false });
    });
  }

  // 获取设备列表
  @Bind()
  getEquipmentList(val) {
    const {
      dispatch,
      chipNCRecordPlatform: {
        defaultSite = {},
      },
    } = this.props;
    dispatch({
      type: 'chipNCRecordPlatform/getEquipmentList',
      payload: {
        workcellCode: val.workcellCode,
        siteId: defaultSite.siteId,
      },
    });
  }

  // 获取可选的nc code
  @Bind()
  fetchNcCode() {
    const {
      dispatch,
      chipNCRecordPlatform: {
        workcellInfo = {},
      },
    } = this.props;
    dispatch({
      type: 'chipNCRecordPlatform/fetchNcCode',
      payload: {
        operationId: workcellInfo.operationId,
      },
    });
  }


  @Bind
  handleCheckEquipment(vals) {
    const {
      chipNCRecordPlatform: {
        errorEquipmentCodes,
        exceptionEquipmentCodes,
      },
    } = this.props;
    if (errorEquipmentCodes || exceptionEquipmentCodes) {
      Modal.confirm({
        title: `${errorEquipmentCodes || exceptionEquipmentCodes}设备需要进行点检,是否先进行点检`,
        okText: '设备点检',
        cancelText: !errorEquipmentCodes && exceptionEquipmentCodes ? '继续操作' : '取消',
        onOk: () => {
          const { chipNCRecordPlatform: { workcellInfo = {} } } = this.props;
          openTab({
            key: `/hhme/equipment-check`, // 打开 tab 的 key
            path: `/hhme/equipment-check`, // 打开页面的path
            title: '设备点检&保养平台',
            search: queryString.stringify({
              workcellCode: workcellInfo.workcellCode,
            }),
            closable: true,
          });
        },
        onCancel: () => {
          if (!errorEquipmentCodes && exceptionEquipmentCodes) {
            this.handleCheckMaterialCode(vals);
          }
        },
      });
    } else {
      this.handleCheckMaterialCode(vals);
    }
  }

  @Bind()
  handleCheckMaterialCode(vals) {
    const {
      dispatch,
      tenantId,
      chipNCRecordPlatform: { workcellInfo = {} },
    } = this.props;
    this.setState({ spinning: true });
    dispatch({
      type: 'globalMes/handleCheckMaterialCode',
      payload: {
        tenantId,
        materialLotCode: vals.materialLotCode,
        prodLineId: workcellInfo.prodLineId,
        workcellId: workcellInfo.workcellId,
      },
    }).then(res => {
      if (res && res.verifyFlag === 0) {
        Modal.confirm({
          title: res.warnMessage,
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            this.scaneMaterialCode(vals);
          },
          onCancel: () => {
            this.ncForm.resetFields();
            this.setState({ spinning: false });
          },
        });
      } else {
        this.setState({ spinning: false });
        this.scaneMaterialCode(vals);
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
      chipNCRecordPlatform: { workcellInfo = {} },
    } = this.props;
    this.setState({ spinning: true });
    dispatch({
      type: 'chipNCRecordPlatform/scaneMaterialCode',
      payload: {
        tenantId,
        barcode: vals.materialLotCode,
        operationId: workcellInfo.operationId,
        workcellId: workcellInfo.workcellId,
        wkcShiftId: workcellInfo.wkcShiftId,
      },
    }).then(res => {
      if (res) {
        // this.fetchContainerInfo(res.transCosType);
      }
      this.setState({ spinning: false });
    });
  }

  // 点击单元格，初始化芯片列表
  @Bind()
  // eslint-disable-next-line no-unused-vars
  clickPosition(dataSource, _position, _index, selectFlag) {
    const { dispatch } = this.props;
    this.chipListchild.clearData();
    dispatch({
      type: 'chipNCRecordPlatform/updateState',
      payload: {
        selectInfo: dataSource,
        selectChipInfo: {},
        ncRecordList: [],
      },
    });
    // 清除不良表单
    this.ncForm.resetFields();
  }

  /**
   * @description: 多选列
   * @param {object} ncList 格子数据
   * @param {boolean} selectFlag 当前格子是否被选中
   */
  @Bind()
  onClickBarCol(col, ncList, selectFlag) {
    const { dispatch } = this.props;
    if (selectFlag && ncList.length > 0) {
      this.setState(({ selectedRowKeys }) => ({
        selectedRowKeys: [...selectedRowKeys, ...ncList[0].ncRecordList.map(ele => ele.ncRecordId)],
      }));
    } else if (ncList.length > 0) {
      this.setState(({ selectedRowKeys }) => ({
        selectedRowKeys: difference(selectedRowKeys, ncList[0].ncRecordList.map(ele => ele.ncRecordId)),
      }));
    }
    dispatch({
      type: 'chipNCRecordPlatform/updateState',
      payload: {
        selectChipInfo: {
          ...ncList.length === 1 ? ncList[0] : {},
          loadNum: col,
        },
      },
    });
  }

  // 选中数据
  @Bind()
  onSelectRow(selectedRowKeys) {
    this.setState({ selectedRowKeys });
  }

  // 不良提交
  @Bind()
  ncRecordConfirm(val) {
    const {
      dispatch,
      chipNCRecordPlatform: {
        selectChipInfo = {},
        selectInfo = [],
        workcellInfo = {},
      },
    } = this.props;
    const loadSequence = [];
    let loadNum = [];
    if (selectInfo.length > 1) {
      selectInfo.forEach(ele => {
        loadSequence.push(ele.loadSequence);
      });
      loadNum = [];
    }
    if (selectInfo.length === 1) {
      loadSequence.push(selectInfo[0].loadSequence);
      if (selectChipInfo.loadNum && selectChipInfo.loadNum.length > 0) {
        loadNum = [...selectChipInfo.loadNum];
      } else {
        loadNum = [];
      }
    }
    if (val.ncCodeList.length > 0) {
      dispatch({
        type: 'chipNCRecordPlatform/ncRecordConfirm',
        payload: {
          loadNum,
          operationId: workcellInfo.operationId,
          workcellId: workcellInfo.workcellId,
          loadSequenceList: loadSequence,
          ncCodeList: val.ncCodeList,
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.ncForm.resetFields();
          this.fetchQueryProcessing(workcellInfo);
          this.resetChipContainerMap();
        }
      });
    } else {
      notification.error({ message: '未选择不良类型，请检查!' });
    }
  }

  // 不良删除
  @Bind()
  ncRecordDelete() {
    const { dispatch, chipNCRecordPlatform: { containerInfo = {}, workcellInfo = {} } } = this.props;
    const { selectedRowKeys } = this.state;
    const { materialLotNcList = [] } = containerInfo;
    const arr = [];
    selectedRowKeys.forEach(ele => {
      arr.push({ ncRecordId: ele });
    });
    const newList = intersectionBy(materialLotNcList, arr, 'ncRecordId').map(e => ({
      ...e,
      operationId: workcellInfo.operationIdList[0],
      workcellId: workcellInfo.workcellId,
    }));
    dispatch({
      type: 'chipNCRecordPlatform/ncRecordDelete',
      payload: newList,
    }).then(res => {
      if (res) {
        this.ncForm.resetFields();
        this.fetchQueryProcessing(workcellInfo);
        notification.success();
        this.resetChipContainerMap();
      }
    });
  }

  // 出站
  @Bind()
  siteOut() {
    const { dispatch, chipNCRecordPlatform: { containerInfo = {}, workcellInfo = {}, equipmentList = [] } } = this.props;
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
    dispatch({
      type: 'chipNCRecordPlatform/siteOut',
      payload: {
        eoJobSnId: containerInfo.eoJobSnId,
        workcellId: workcellInfo.workcellId,
        equipmentList: eqStatusList,
      },
    }).then(res => {
      if (res) {
        this.ncForm.resetFields();
        this.bootomForm.resetFields();
        this.chipListchild.clearData();
        dispatch({
          type: 'chipNCRecordPlatform/updateState',
          payload: {
            containerInfo: {}, // 容器信息
            selectInfo: [], // 选中单元格的信息
            selectChipInfo: {}, // 选中芯片的信息
            // ncList: [], // 不良列表
          },
        });
        // this.fetchQueryProcessing(workcellInfo);
        notification.success();
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
      type: `chipNCRecordPlatform/bindingEq`,
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
    const { dispatch, chipNCRecordPlatform: { defaultSite } } = this.props;
    return dispatch({
      type: `chipNCRecordPlatform/bindingEqConfirm`,
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
    const { dispatch, chipNCRecordPlatform: { defaultSite } } = this.props;
    return dispatch({
      type: `chipNCRecordPlatform/changeEqConfirm`,
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
    const { dispatch, chipNCRecordPlatform: { defaultSite } } = this.props;
    dispatch({
      type: `chipNCRecordPlatform/getEquipmentList`,
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
    const { dispatch, chipNCRecordPlatform: { workcellInfo } } = this.props;
    dispatch({
      type: `chipNCRecordPlatform/deleteEq`,
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
      type: `chipNCRecordPlatform/changeEq`,
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
      type: `chipNCRecordPlatform/fetchEqInfo`,
      payload: {
        eqCode,
      },
    });
  }

  // 报废
  @Bind()
  chipScrapped() {
    const { dispatch,
      chipNCRecordPlatform: {
        selectInfo = [],
        workcellInfo = {},
        containerInfo = {},
      },
    } = this.props;
    if (selectInfo.length === 0) {
      return notification.error({ message: '当前暂无芯片信息！' });
    }
    dispatch({
      type: `chipNCRecordPlatform/chipScrapped`,
      payload: {
        jobId: containerInfo.eoJobSnId,
        materialLotId: containerInfo.materialLotId,
        operationId: workcellInfo.operationId,
        wkcShiftId: workcellInfo.wkcShiftId,
        workcellId: workcellInfo.workcellId,
        materialLotLoadIdList: selectInfo.map(ele => ele.materialLotLoadId),
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.fetchQueryProcessing(workcellInfo);
        dispatch({
          type: 'chipNCRecordPlatform/updateState',
          payload: {
            ncRecordList: [],
          },
        });
        this.resetChipContainerMap();
      }
    });
  }

  // 重置功能
  @Bind
  resetChipContainerMap() {
    this.chipContainerMapchild.clearCustomizelocation();
    this.chipListchild.clearData();
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'chipNCRecordPlatform/updateState',
      payload: {
        selectInfo: [],
        selectChipInfo: {
          loadNum: [],
        },
      },
    });
  }

  @Bind
  selectAll() {
    const {
      chipNCRecordPlatform: {
        containerInfo = {},
      },
      dispatch,
    } = this.props;
    const { materialLotLoadList = [] } = containerInfo;
    const arr = [];
    const selectInfo = [];
    materialLotLoadList.forEach(item => {
      if (item.docList && item.docList.length > 0) {
        arr.push(`${upperCaseChars()[item.loadRow - 1]}${item.loadColumn}`);
        selectInfo.push({ ...item });
      }
    });
    this.chipContainerMapchild.selectAll(arr, selectInfo);
    dispatch({
      type: 'chipNCRecordPlatform/updateState',
      payload: {
        selectInfo,
        selectChipInfo: {
          loadNum: [],
        },
      },
    });
  }

  @Bind()
  exImportExcel() {
    openTab({
      key: `/hhme/chip-nc-record-platform/data-import/HME_LOAD_UNTIE`,
      title: '装载信息卸载',
      search: queryString.stringify({
        action: '装载信息卸载',
      }),
    });
  }


  render() {
    const columns = [
      {
        title: '位置',
        dataIndex: 'position',
        width: 60,
      },
      {
        title: '不良代码',
        dataIndex: 'ncCode',
        width: 100,
      },
      {
        title: '不良类型',
        dataIndex: 'ncDesc',
        width: 100,
      },
    ];
    const {
      getSiteListLoading,
      chipNCRecordPlatform: {
        ncList = [],
        containerInfo = {},
        selectInfo = [],
        selectChipInfo = {},
        // materialLotNcList = [],
        workcellInfo = {},
        equipmentList = [],
        ncRecordList = [],
        defaultSite = {},
      },
      ncRecordConfirmLoading,
      ncRecordDeleteLoading,
      siteOutLoading,
      bindingEqLoading,
      bindingEqConfirmLoading,
      fetchEquipmentListLoading,
      deleteEqLoading,
      changeEqLoading,
      changeEqConfirmLoading,
      chipScrappedLoading,
    } = this.props;
    const { materialLotLoadList = [], locationRow, locationColumn, chipNum, materialLotNcList = [] } = containerInfo;
    const { loadNum } = selectChipInfo;
    const { visible, spinning, enterSiteLoading, selectedRowKeys } = this.state;
    const enterModalProps = {
      visible,
      loading: getSiteListLoading || enterSiteLoading,
      enterSite: this.enterSite,
    };
    const ncTypeFormProps = {
      ncList,
      ncRecordList,
      loadNum,
      ncRecordConfirmLoading,
      selectInfo,
      customizelocation: this.chipContainerMapchild && this.chipContainerMapchild.state.customizelocation,
      onRef: node => {
        this.ncForm = node.props.form;
      },
      ncRecordConfirm: this.ncRecordConfirm,
      ncRecordDelete: this.ncRecordDelete,
    };
    const bottomFormProps = {
      containerInfo,
      siteOutLoading,
      siteOut: this.siteOut,
      onRef: node => {
        this.bootomForm = node.props.form;
      },
      scaneMaterialCode: this.handleCheckEquipment,
    };
    const chipListProps = {
      onRef: node => {
        this.chipListchild = node;
      },
    };
    const chipContainerMapProps = {
      onRef: node => {
        this.chipContainerMapchild = node;
      },
    };
    const stationEquipmentProps = {
      siteId: defaultSite.siteId,
      workCellInfo: workcellInfo,
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
        <Header title="芯片不良记录平台">
          <Button type="primary" onClick={() => this.exImportExcel()}>
            装载信息卸载
          </Button>
        </Header>
        <Content style={{ padding: '0px', backgroundColor: 'transparent' }}>
          <Spin spinning={spinning}>
            <Row gutter={16}>
              <Col span={19} className={styles['bar-operating-platform-top-left']}>
                <Row>
                  <Col span={9}>
                    <BottomForm {...bottomFormProps} />
                  </Col>
                  <Col span={9} style={{ padding: '0px 5px' }}>
                    <ChipContainerMap
                      formFlag={false}
                      clickPosition={this.clickPosition}
                      popconfirm={false}
                      dataSource={materialLotLoadList}
                      locationRow={locationRow}
                      locationColumn={locationColumn}
                      scrollbarsHeight="330px"
                      multiple
                      {...chipContainerMapProps}
                    />
                  </Col>
                  <Col span={6}>
                    <ChipList
                      capacity={selectInfo.length > 0 ? selectInfo[selectInfo.length - 1].cosNum : 0}
                      totalCapacity={chipNum}
                      docList={selectInfo.length > 0 ? selectInfo[selectInfo.length - 1].docList : []}
                      onClickBarCol={this.onClickBarCol}
                      clicklocation={this.chipContainerMapchild && this.chipContainerMapchild.state.customizelocation}
                      barPositionOrPosition={false}
                      multiple
                      {...chipListProps}
                    />
                    <Row style={{ lineHeight: '25px', fontWeight: '500', fontSize: '14px' }}>芯片实验代码：{isEmpty(selectInfo) ? null : selectInfo[selectInfo.length - 1].labCode}</Row>
                    <Row style={{ lineHeight: '25px', fontWeight: '500', fontSize: '14px' }}>芯片实验备注：{isEmpty(selectInfo) ? null : selectInfo[selectInfo.length - 1].labRemark}</Row>
                    <div style={{ marginTop: '8px' }}>
                      <Button
                        type="primary"
                        onClick={() => this.selectAll()}
                      >
                        全选
                      </Button>
                      <Button
                        onClick={() => this.resetChipContainerMap()}
                        style={{ marginLeft: '8px' }}
                      >
                        重置
                      </Button>
                      <Popconfirm
                        title={`是否确认报废芯片 ? 芯片位置 :${this.chipContainerMapchild && this.chipContainerMapchild.state.customizelocation}`}
                        onConfirm={() => this.chipScrapped()}
                      >
                        <Button
                          type="danger"
                          loading={chipScrappedLoading}
                          style={{ marginLeft: '8px' }}
                        >
                          报废
                        </Button>
                      </Popconfirm>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col span={5}>
                <Card className={styles['bar-operating-platform-top-right-site']}>
                  <div style={{ float: 'left' }}><img src={gwPath} alt="" /></div>
                  <div style={{ float: 'left', padding: '2px' }}>当前工位：{workcellInfo.workcellName}</div>
                </Card>
                <Card title="工位设备" className={styles['chip-nc-record-equipment']}>
                  <Scrollbars style={{ height: '248px' }}>
                    <StationEquipment
                      {...stationEquipmentProps}
                    />
                  </Scrollbars>
                </Card>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: '8px' }}>
              <Col span={20} className={styles['bar-operating-platform-bottom-left']}>
                <Row>
                  <Col span={9}>
                    <Table
                      columns={columns}
                      rowKey='ncRecordId'
                      dataSource={materialLotNcList}
                      pagination={false}
                      scroll={{ y: 250 }}
                      rowSelection={{
                        // fixed: true,
                        // columnWidth: 50,
                        disabled: true,
                        selectedRowKeys,
                        onChange: this.onSelectRow,
                      }}
                    />
                    <div style={{ marginTop: '8px', textAlign: 'end' }}>
                      <Button type="danger" onClick={() => this.ncRecordDelete()} loading={ncRecordDeleteLoading}>删除</Button>
                    </div>
                  </Col>
                  <Col span={14} style={{ marginLeft: '25px' }}>
                    <div className={styles['bar-operating-platform-bottom-left-title']}>
                      <Title titleValue="不良类型选择" />
                    </div>
                    <NCTypeForm
                      {...ncTypeFormProps}
                    />
                  </Col>
                </Row>
              </Col>
              <Col span={4}>
                <Card className={styles['chip-nc-entry-link-card']}>
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
          {visible && <EnterModal {...enterModalProps} />}
        </Content>
      </Fragment>
    );
  }
}
