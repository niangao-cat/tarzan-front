/*
 * @Description: 投入芯片盒子列表
 * @Version: 0.0.1
 * @Autor: ywj
 * @Date: 2020-08-06 17:42:02
 * @LastEditTime: 2020-11-03 20:00:57
 */

import React, { Component } from 'react';
import { Table, Row, Col, Button, Input, Form, Modal } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import Title from '@/components/Title';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { tableScrollWidth } from 'utils/utils';
import { openTab } from 'utils/menuTab';
import queryString from 'querystring';

@Form.create({ fieldNameProp: null })
@formatterCollections({ code: 'hwms.goldThread' })
@connect(({ goldThread, loading }) => ({
  goldThread,
  loading: loading.effects['goldThread/scanBox'] || loading.effects['goldThread/checkMaterialCode'],
  deteleloading: loading.effects['goldThread/deleteBox'],
  queryloading: loading.effects['goldThread/queryBox'],
  outloading: loading.effects['goldThread/setOutBox'],
  deleteBoxDataloading: loading.effects['goldThread/deleteBoxData'],
}))
export default class InvestInTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowData: [],
      selectedRowKeys: [],
    };
  }

  @Bind()
  handleClickSelectedRows(record) {
    // eslint-disable-next-line react/no-unused-state
    this.setState({ selectRow: record });
  }

  @Bind()
  openEquipmentCheck() {
    const {
      goldThread: { workcellInfo = {} },
    } = this.props;
    openTab({
      key: `/hhme/equipment-check`, // 打开 tab 的 key
      path: `/hhme/equipment-check`, // 打开页面的path
      title: '设备点检&保养平台',
      search: queryString.stringify({
        workcellCode: workcellInfo.workcellCode,
      }),
      closable: true,
    });
  }

  // 获取设备列表
  @Bind()
  getSetOutData() {
    const {
      dispatch,
      goldThread: { workcellInfo = {}, defaultSite = {} },
    } = this.props;
    // 调用接口
    dispatch({
      type: 'goldThread/queryBox',
      payload: {
        ...workcellInfo,
        ...defaultSite,
        assembleQty: 0,
      },
    });
  }

  // 删除
  @Bind()
  deleteData() {
    // 判断是否选中了数据 没有则提示
    if (this.state.selectedRowData.length === 0) {
      return notification.error({ message: '请先选中要删除的条码' });
    } else {
      Modal.confirm({
        title: '已扫描条码将从芯片加工内删除，是否确认',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const {
            dispatch,
            goldThread: { materialLot = {} },
          } = this.props;
          // 赋值数据
          let deleteData = [];
          for (let i = 0; i < this.state.selectedRowData.length; i++) {
            deleteData = [
              ...deleteData,
              {
                operationRecordId: materialLot.operationRecordId,
                materialLotId: this.state.selectedRowData[i].materialLotId,
                jobId: this.state.selectedRowData[i].jobId,
                woJobSnId: materialLot.woJobSnId,
              },
            ];
          }
          // 调用接口
          dispatch({
            type: 'goldThread/deleteBox',
            payload: deleteData,
          }).then(() => {
            this.getSetOutData();
            notification.success({ message: '删除成功' });
          });
        },
      });
    }
  }

  // 出站
  @Bind()
  setOut() {
    // 判断是否选中了数据 没有则提示
    if (this.state.selectedRowData.length === 0) {
      return notification.error({ message: '请先选中要出站的条码' });
    } else {
      const {
        dispatch,
        goldThread: { workcellInfo = {}, materialLot = {}, defaultSite = {} },
      } = this.props;
      // 赋值数据
      let deleteData = [];
      for (let i = 0; i < this.state.selectedRowData.length; i++) {
        deleteData = [
          ...deleteData,
          {
            siteId: defaultSite.siteId,
            operationId: workcellInfo.operationId,
            workcellId: workcellInfo.workcellId,
            wkcShiftId: workcellInfo.wkcShiftId,
            workOrderId: materialLot.workOrderId,
            materialLotId: this.state.selectedRowData[i].materialLotId,
            jobId: this.state.selectedRowData[i].jobId,
          },
        ];
      }
      // 调用接口
      dispatch({
        type: 'goldThread/setOutBox',
        payload: deleteData,
      }).then(res => {
        if (res) {
          this.getSetOutData();
          this.getMaterialList();
          notification.success({ message: '出站成功' });
        }
      });
    }
  }

  // 获取物料信息
  @Bind()
  getMaterialList() {
    const {
      dispatch,
      goldThread: { workcellInfo = {}, defaultSite = {} },
    } = this.props;
    dispatch({
      type: 'goldThread/getMaterialList',
      payload: {
        ...workcellInfo,
        ...defaultSite,
      },
    });
  }

  // 查询盒子信息
  @Bind
  handleScanCode() {
    // 先聚焦焦点
    const inputBarcode = document.getElementById('barcodeJX');
    inputBarcode.blur();
    // 判断是否为空 ，空则报错
    if (
      inputBarcode.value === '' ||
      inputBarcode.value === undefined ||
      inputBarcode.value === null
    ) {
      inputBarcode.focus();
      inputBarcode.select();
      return notification.error({ message: '请勿扫描空盒子' });
    } else {
      const {
        dispatch,
        goldThread: {
          workcellInfo = {},
          defaultSite = {},
          errorEquipmentCodes = '',
          exceptionEquipmentCodes = '',
        },
      } = this.props;

      if (exceptionEquipmentCodes || errorEquipmentCodes) {
        Modal.confirm({
          title: `${exceptionEquipmentCodes || errorEquipmentCodes}设备需要进行点检,是否先进行点检`,
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            this.openEquipmentCheck();
          },
          onCancel: () => {
            if (exceptionEquipmentCodes) {
              // 调用接口
              // 进行数据校验
              dispatch({
                type: 'goldThread/checkMaterialCode',
                payload: {
                  materialLotCode: inputBarcode.value,
                  workcellId: workcellInfo.workcellId,
                  prodLineId: workcellInfo.prodLineId,
                },
              }).then(resVefity => {
                if (resVefity && resVefity.verifyFlag === 1) {
                  dispatch({
                    type: 'goldThread/scanBox',
                    payload: {
                      equipmentCode: workcellInfo.equipmentCode,
                      materialLotCode: inputBarcode.value,
                      operationId: workcellInfo.operationId,
                      siteId: defaultSite.siteId,
                      wkcShiftId: workcellInfo.wkcShiftId,
                      workcellId: workcellInfo.workcellId,
                    },
                  }).then(() => {
                    inputBarcode.focus();
                    inputBarcode.select();
                    this.getSetOutData();
                  });
                } else if (resVefity && resVefity.verifyFlag === 0) {
                  Modal.confirm({
                    title: resVefity ? resVefity.warnMessage : '',
                    onOk: () => {
                      dispatch({
                        type: 'goldThread/scanBox',
                        payload: {
                          equipmentCode: workcellInfo.equipmentCode,
                          materialLotCode: inputBarcode.value,
                          operationId: workcellInfo.operationId,
                          siteId: defaultSite.siteId,
                          wkcShiftId: workcellInfo.wkcShiftId,
                          workcellId: workcellInfo.workcellId,
                        },
                      }).then(() => {
                        inputBarcode.focus();
                        inputBarcode.select();
                        this.getSetOutData();
                      });
                    },
                  });
                }
              });
            }
          },
        });
      } else {
        // 调用接口
        // 进行数据校验
        dispatch({
          type: 'goldThread/checkMaterialCode',
          payload: {
            materialLotCode: inputBarcode.value,
            workcellId: workcellInfo.workcellId,
            prodLineId: workcellInfo.prodLineId,
          },
        }).then(resVefity => {
          if (resVefity && resVefity.verifyFlag === 1) {
            dispatch({
              type: 'goldThread/scanBox',
              payload: {
                equipmentCode: workcellInfo.equipmentCode,
                materialLotCode: inputBarcode.value,
                operationId: workcellInfo.operationId,
                siteId: defaultSite.siteId,
                wkcShiftId: workcellInfo.wkcShiftId,
                workcellId: workcellInfo.workcellId,
              },
            }).then(() => {
              inputBarcode.focus();
              inputBarcode.select();
              this.getSetOutData();
            });
          } else if (resVefity && resVefity.verifyFlag === 0) {
            Modal.confirm({
              title: resVefity ? resVefity.warnMessage : '',
              onOk: () => {
                dispatch({
                  type: 'goldThread/scanBox',
                  payload: {
                    equipmentCode: workcellInfo.equipmentCode,
                    materialLotCode: inputBarcode.value,
                    operationId: workcellInfo.operationId,
                    siteId: defaultSite.siteId,
                    wkcShiftId: workcellInfo.wkcShiftId,
                    workcellId: workcellInfo.workcellId,
                  },
                }).then(() => {
                  inputBarcode.focus();
                  inputBarcode.select();
                  this.getSetOutData();
                });
              },
            });
          }
        });
      }
    }
  }

  // 更改选中状态
  @Bind
  onChangeSelected(selectedRowKeys, selectedRowData) {
    this.setState({
      selectedRowKeys,
      selectedRowData,
    });
  }

  @Bind()
  deleteBoxData() {
    const { selectedRowData } = this.state;
    const arrList = [];
    selectedRowData.forEach(ele => {
      arrList.push(ele.materialLotId);
    });
    const {
      dispatch,
      goldThread: { workcellInfo = {}, defaultSite = {}, materialLot = {} },
    } = this.props;
    dispatch({
      type: 'goldThread/deleteBoxData',
      payload: {
        materialLotIdList: arrList,
        operationId: workcellInfo.operationId,
        siteId: defaultSite.siteId,
        wkcShiftId: workcellInfo.wkcShiftId,
        workcellId: workcellInfo.workcellId,
        workOrderId: materialLot.workOrderId,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.getSetOutData();
      }
    });
  }

  /**
   * 页面渲染
   * @returns {*}
   */
  render() {
    const {
      loading,
      deteleloading,
      queryloading,
      outloading,
      deleteBoxDataloading,
      goldThread: { materialLot = {} },
    } = this.props;
    const { hmeCosWireBondVOList = [] } = materialLot;
    const { selectedRowData } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'samplePlanTypeMeaning',
        render: (val, record, index) => index + 1,
        width: 100,
      },
      {
        title: '条码',
        dataIndex: 'materialLotCode',
        width: 100,
      },
      {
        title: '数量',
        dataIndex: 'primaryUomQty',
        width: 100,
      },
      {
        title: 'wafer',
        dataIndex: 'wafer',
        width: 100,
      },
      {
        title: '工单编号',
        dataIndex: 'workOrderNum',
        width: 100,
      },
      {
        title: 'COS类型',
        dataIndex: 'cosType',
        width: 100,
      },
      {
        title: 'LOTNO',
        dataIndex: 'lotNo',
        width: 100,
      },
    ];
    const rowsSelection = {
      columnWidth: 50,
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onChangeSelected,
    };
    return (
      <React.Fragment>
        <Row style={{ marginBottom: '8px' }}>
          <Col span={16}>
            <div style={{ float: 'left', paddingTop: '4px' }}>
              <Title titleValue="投入芯片盒子" />
            </div>
            <Input
              id="barcodeJX"
              onPressEnter={this.handleScanCode}
              style={{ width: '145px', marginLeft: '10px' }}
            />
          </Col>
          <Col span={8} style={{ textAlign: 'end' }}>
            <Button type="primary" onClick={this.setOut} style={{ marginRight: '10px' }}>
              出站
            </Button>
            <Button
              loading={deleteBoxDataloading}
              disabled={selectedRowData.length === 0}
              onClick={() => this.deleteBoxData()}
              style={{ marginRight: '10px' }}
            >
              删除
            </Button>
          </Col>
        </Row>
        <Table
          bordered
          rowKey="jobId"
          columns={columns}
          loading={loading || deteleloading || queryloading || outloading}
          dataSource={hmeCosWireBondVOList}
          pagination={{ pageSize: 999999999 }}
          scroll={{ x: tableScrollWidth(columns), y: 250 }}
          rowSelection={rowsSelection}
        />
        {/* <div style={{ width: '200px', height: '150px', position: 'absolute', bottom: '20px' }}>
          <div>
            <span>已投入芯片数:&nbsp;<Input style={{ width: '100px' }} disabled value={materialLot.cosNum} /></span>
          </div>
          <br />
          <div>
            <span>已完成芯片数:&nbsp;<Input style={{ width: '100px' }} disabled value={Number(materialLot.cosNum || 0) - Number(materialLot.surplusCosNum || 0)} /></span>
          </div>
          <br />
          <div>
            <span>剩余芯片数量:&nbsp;<Input style={{ width: '100px' }} disabled value={materialLot.surplusCosNum} /></span>
          </div>
        </div> */}
      </React.Fragment>
    );
  }
}
