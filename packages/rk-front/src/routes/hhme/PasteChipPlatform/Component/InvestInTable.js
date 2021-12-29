/*
 * @Description: 投入芯片盒子列表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-06 17:42:02
 * @LastEditTime: 2021-01-26 16:19:11
 */

import React, { Component } from 'react';
import { Table, Row, Col, Button, Input, Form, Modal } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import queryString from 'querystring';
import { isEmpty, isArray } from 'lodash';

import Title from '@/components/Title';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { tableScrollWidth } from 'utils/utils';
import { openTab } from 'utils/menuTab';
import {
  SEARCH_FORM_ROW_LAYOUT,
  FORM_COL_2_LAYOUT,
} from 'utils/constants';

const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
@Form.create({ fieldNameProp: null })
@formatterCollections({ code: 'hwms.pasteChipPlatform' })
@connect(({ pasteChipPlatform, loading }) => ({
  pasteChipPlatform,
  loading: loading.effects['pasteChipPlatform/scanBox'],
  deleteLoading: loading.effects['pasteChipPlatform/deleteBox'],
  queryLoading: loading.effects['pasteChipPlatform/queryBox'],
  outLoading: loading.effects['pasteChipPlatform/setOutBox'],
  checkInSiteLoading: loading.effects['pasteChipPlatform/checkInSite'],
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

  // 获取设备列表
  @Bind()
  getSetOutData() {
    const {
      dispatch,
      pasteChipPlatform: { workcellInfo = {}, defaultSite = {} },
    } = this.props;
    // 调用接口
    dispatch({
      type: 'pasteChipPlatform/queryBox',
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
    if (
      this.state.selectedRowData.length === 0
    ) {
      return notification.error({ message: '请先选中要删除的条码' });
    } else {
      Modal.confirm({
        title: '已扫描条码将从芯片加工内删除，是否确认',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const {
            dispatch,
            pasteChipPlatform: { materialLot = {} },
          } = this.props;
          // 赋值数据
          let deleteData = [];
          for (let i = 0; i < this.state.selectedRowData.length; i++) {
            deleteData = [...deleteData, { operationRecordId: materialLot.operationRecordId, materialLotId: this.state.selectedRowData[i].materialLotId, jobId: this.state.selectedRowData[i].jobId, woJobSnId: materialLot.woJobSnId }];
          }
          // 调用接口
          dispatch({
            type: 'pasteChipPlatform/deleteBox',
            payload: deleteData,
          }).then(res => {
            if (res) {
              this.getSetOutData();
              notification.success({ message: '删除成功' });
            }
          });
        },
      });
    }
  }

  // 出站
  @Bind()
  setOut() {
    // 判断是否选中了数据 没有则提示
    if (
      this.state.selectedRowData.length === 0
    ) {
      return notification.error({ message: '请先选中要出站的条码' });
    } else {
      const {
        dispatch,
        pasteChipPlatform: { workcellInfo = {}, materialLot = {} },
      } = this.props;
      // 赋值数据
      let deleteData = [];
      for (let i = 0; i < this.state.selectedRowData.length; i++) {
        deleteData = [...deleteData, { operationIdList: workcellInfo.operationIdList, workcellId: workcellInfo.workcellId, wkcShiftId: workcellInfo.wkcShiftId, workOrderId: materialLot.workOrderId, materialLotId: this.state.selectedRowData[i].materialLotId, jobId: this.state.selectedRowData[i].jobId }];
      }
      // 调用接口
      dispatch({
        type: 'pasteChipPlatform/setOutBox',
        payload: deleteData,
      }).then(res => {
        if (res) {
          this.getSetOutData();
          // 清除勾选的数据
          this.setState({
            selectedRowData: [],
            selectedRowKeys: [],
          });
          notification.success({ message: '出站成功' });
        }
      });
    }
  }

  @Bind()
  handleCheckBarcode(e) {
    const {
      dispatch,
      pasteChipPlatform: { workcellInfo = {} },
    } = this.props;
    const materialLotCode = e.target.value;
    dispatch({
      type: 'pasteChipPlatform/checkInSite',
      payload: {
        materialLotCode,
        prodLineId: workcellInfo.prodLineId,
        workcellId: workcellInfo.workcellId,
      },
    }).then(res => {
      if (res && res.verifyFlag === 1) {
        this.handleScanCode(materialLotCode);
      } else if (res && res.verifyFlag === 0) {
        Modal.confirm({
          title: res.warnMessage,
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            this.handleScanCode(materialLotCode);
          },
        });
      }
    });
  }

  // 查询盒子信息
  @Bind
  handleScanCode(materialLotCode) {
    // 先聚焦焦点
    const inputBarcode = document.getElementById('barcode');
    inputBarcode.blur();
    // 判断是否为空 ，空则报错
    if (materialLotCode === '' || materialLotCode === undefined || materialLotCode === null) {
      inputBarcode.focus();
      inputBarcode.select();
      return notification.error({ message: '请勿扫描空盒子' });
    } else {
      const {
        dispatch,
        form,
        pasteChipPlatform: { workcellInfo = {}, defaultSite = {}, exceptionEquipmentCodes, errorEquipmentCodes, materialLot },
        getSetOutData,
      } = this.props;
      const numInput = document.getElementById('num');
      const { materialLotList = [] } = materialLot;
      const inSiteFuc = () => {
        // 调用接口
        dispatch({
          type: 'pasteChipPlatform/scanBox',
          payload: {
            ...workcellInfo,
            ...defaultSite,
            materialLotCode,
            assembleQty: Number(numInput.value ? numInput.value : 0),
            materialLotInfo: isArray(materialLotList) && !isEmpty(materialLotList) ? materialLotList[0] : null,
          },
        }).then(res => {
          inputBarcode.focus();
          inputBarcode.select();
          if (res) {
            form.setFieldsValue({
              labCode: res.labCode,
              labRemark: res.labRemark,
            });
            getSetOutData();
          }
        });
      };
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
              inSiteFuc();
            }
          },
        });
      } else {
        inSiteFuc();
      }
    }
  }

  @Bind()
  openEquipmentCheck() {
    const { pasteChipPlatform: { workcellInfo = {} } } = this.props;
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

  // 更改选中状态
  @Bind
  onChangeSelected(selectedRowKeys, selectedRowData) {
    this.setState({
      selectedRowKeys, selectedRowData,
    });
  }

  /**
   * 页面渲染
   * @returns {*}
   */
  render() {
    const {
      loading,
      deleteLoading,
      queryLoading,
      outLoading,
      checkInSiteLoading,
      pasteChipPlatform: { materialLot = {} },
    } = this.props;
    const { materialLotList = [] } = materialLot;
    const columns = [
      {
        title: '序号',
        dataIndex: 'samplePlanTypeMeaning',
        render: (val, record, index) => index + 1,
        width: 70,
      },
      {
        title: '条码',
        dataIndex: 'materialLotCode',
        width: 130,
      },
      {
        title: '数量',
        dataIndex: 'primaryUomQty',
        width: 70,
      },
      {
        title: 'wafer',
        dataIndex: 'wafer',
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'status',
        align: 'center',
        width: 70,
      },
    ];
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const rowsSelection = {
      columnWidth: 50,
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onChangeSelected,
      getCheckboxProps: record => ({
        disabled: record.statusFlag === 'Y',
      }),
    };
    return (
      <React.Fragment>
        <Row style={{ marginBottom: '8px' }}>
          <Col span={16}>
            <div style={{ float: 'left', paddingTop: '4px' }}>
              <Title titleValue="投入芯片盒子" />
            </div>
            <Input
              id="barcode"
              disabled={checkInSiteLoading}
              onPressEnter={this.handleCheckBarcode}
              style={{ width: '145px', marginLeft: '10px' }}
            />
          </Col>
          <Col span={8} style={{ textAlign: 'end' }}>
            <Button onClick={this.setOut} style={{ marginRight: '10px' }}>
              投入确认
            </Button>
            <Button onClick={this.deleteData} type="primary">
              删除
            </Button>
          </Col>
        </Row>
        <Table
          bordered
          rowKey="materialLotId"
          columns={columns}
          loading={loading || deleteLoading || queryLoading || outLoading}
          dataSource={materialLotList}
          pagination={{ pageSize: 999999999 }}
          scroll={{ x: tableScrollWidth(columns), y: 250 }}
          rowSelection={rowsSelection}
        />
        <Form>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item {...formLayout} label="工单号">
                {getFieldDecorator('workOrderNum', {
                  initialValue: materialLot.workOrderNum,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item {...formLayout} label='wafer'>
                {getFieldDecorator('wafer', {
                  initialValue: materialLot.wafer,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item {...formLayout} label="工单数量">
                {getFieldDecorator('workOrderQty', {
                  initialValue: materialLot.workOrderQty,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item {...formLayout} label="剩余芯片数">
                {getFieldDecorator('surplusCosNum', {
                  initialValue: materialLot.surplusCosNum,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item {...formLayout} label="工单成品">
                {getFieldDecorator('materialCode', {
                  initialValue: materialLot.materialCode,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item {...formLayout} label="芯片类型">
                {getFieldDecorator('cosType', {
                  initialValue: materialLot.cosType,
                })(<Input disabled id="num" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item {...formLayout} label="工单投料">
                {getFieldDecorator('assembleQty', {
                  initialValue: materialLot.assembleQty,
                })(<Input disabled id="num" />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item {...formLayout} label="可新增数量">
                {getFieldDecorator('addQty', {
                  initialValue: materialLot.addQty,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item {...formLayout} label='工单完工'>
                {getFieldDecorator('achieveQty', {
                  initialValue: materialLot.achieveQty,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item {...formLayout} label='完工数量'>
                {getFieldDecorator('completedQty', {
                  initialValue: materialLot.completedQty,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item {...formLayout} label='实验代码'>
                {getFieldDecorator('labCode', {
                  initialValue: materialLot.labCode,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item {...formLayout} label='实验代码备注'>
                {getFieldDecorator('labRemark', {
                  initialValue: materialLot.labRemark,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}
