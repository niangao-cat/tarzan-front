/*
 * @Description: 贴片后芯片盒子
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-06 17:42:02
 * @LastEditTime: 2021-01-22 15:48:21
 */

import React, { Component } from 'react';
import { Table, Row, Col, Button, Form } from 'hzero-ui';
import { isEmpty } from 'lodash';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';

import Title from '@/components/Title';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { tableScrollWidth } from 'utils/utils';
import AddBarCodeModal from './AddBarCodeModal';

@Form.create({ fieldNameProp: null })
@formatterCollections({ code: 'hwms.barcodeQuery' })
@connect(({ pasteChipPlatform, loading }) => ({
  pasteChipPlatform,
  createBarCodeLoading: loading.effects['pasteChipPlatform/createBarCode'],
  loading: loading.effects['pasteChipPlatform/queryBoxNo'],
  printLoading: loading.effects['pasteChipPlatform/print'],
  siteOutLoading: loading.effects['pasteChipPlatform/setOut'],
}))
export default class PasteChipArfterTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addBarCodeModalVisible: false,
      qty: "",
    };
  }

  form;

  // 创建条码
  @Bind()
  createBarCode(val) {
    const {
      dispatch,
      tenantId,
      pasteChipPlatform: { workcellInfo = {}, defaultSite = {}, materialLot = {} },
      getSetOutData,
    } = this.props;
    dispatch({
      type: 'pasteChipPlatform/createBarCode',
      payload: {
        tenantId,
        ...val,
        ...defaultSite,
        ...workcellInfo,
        workOrderId: materialLot.workOrderId,
        wafer: materialLot.wafer,
      },
    }).then(res => {
      if (res) {
        this.setState({ addBarCodeModalVisible: false });
        // 查询数据
        this.getBoxNo();
        getSetOutData();
        // 查询左侧数据
        notification.success();
      }
    });
  }

  @Bind
  queryQty(value) {
    const {
      dispatch,
      tenantId,
      pasteChipPlatform: { workcellInfo = {}, defaultSite = {}, materialLot = {}, operationRecordId = '' },
    } = this.props;
    dispatch({
      type: 'pasteChipPlatform/queryQty',
      payload: {
        tenantId,
        containerTypeId: value,
        ...defaultSite,
        ...workcellInfo,
        workOrderId: materialLot.workOrderId,
        operationRecordId,
      },
    }).then(res => {
      if (res) {
        this.setState({ qty: res.qty });
        this.form.setFieldsValue({
          qty: res.qty,
        });
      } else {
        this.form.setFieldsValue({
          containerTypeId: "",
          qty: 0,
        });
      }
    });
  }

  @Bind
  handleBindRef(ref) {
    this.form = (ref.props || {}).form;
  }

  // 获取贴片信息
  @Bind()
  getBoxNo() {
    const { dispatch, pasteChipPlatform: { workcellInfo = {}, defaultSite = {}, materialLot = {} }, setCheckedData } = this.props;
    dispatch({
      type: 'pasteChipPlatform/queryBoxNo',
      payload: {
        ...workcellInfo,
        ...defaultSite,
        wafer: materialLot.wafer,
        workOrderId: materialLot.workOrderId,
      },
    }).then(res => {
      if (res) {
        // 默认选中新建条码
        const data = res.materialLotCodeList.filter(item => item.status === "新建");
        const dataKeys = res.materialLotCodeList.filter(item => item.status === "新建").map(item => item.jobId);
        setCheckedData(dataKeys, data);
      }
    });
  }

  // 获取物料信息
  @Bind()
  getMaterialList() {
    const { dispatch, pasteChipPlatform: { workcellInfo = {}, defaultSite = {} } } = this.props;
    dispatch({
      type: 'pasteChipPlatform/getMaterialList',
      payload: {
        ...workcellInfo,
        ...defaultSite,
      },
    });
  }

  // 新增条码
  @Bind()
  addBarCode() {
    this.setState({ addBarCodeModalVisible: !this.state.addBarCodeModalVisible });
  }

  // 出站打印
  @Bind()
  siteOutPrint() {
    const { dispatch, pasteChipPlatform: { workcellInfo = {}, defaultSite = {}, materialLot = {} } } = this.props;
    dispatch({
      type: 'pasteChipPlatform/print',
      payload: {
        ...workcellInfo,
        ...defaultSite,
        wafer: materialLot.wafer,
        workOrderId: materialLot.workOrderId,
      },
    }).then(res => {
      if (res) {
        const file = new Blob(
          [res],
          { type: 'application/pdf' }
        );
        const fileURL = URL.createObjectURL(file);
        const newwindow = window.open(fileURL, 'newwindow');
        if (newwindow) {
          newwindow.print();
          this.getMaterialList();
          this.getBoxNo();
        } else {
          notification.error({ message: '当前窗口已被浏览器拦截，请手动设置浏览器！' });
        }
      } else {
        notification.error({ message: res === undefined ? "打印失败" : res.message });
      }
    });
  }

  // 出站打印
  @Bind()
  siteOutAndPrint() {
    // 判断是否有需要打印的数据
    if (this.props.selectDataKeys.length === 0) {
      return notification.error({ message: "请先选中要打印的数据" });
    }

    // 筛选 需要出站的数据
    const outData = this.props.selectData.filter(item => item.status === "新建").map(item => item.jobId);
    // 筛选 需要打印的数据
    const printData = this.props.selectData.map(item => item.materialLotId);

    // 执行出站
    const { dispatch, pasteChipPlatform: { workcellInfo = {}, defaultSite = {}, materialLot = {} }, getSetOutData } = this.props;

    if (outData.length > 0) {
      dispatch({
        type: 'pasteChipPlatform/setOut',
        payload: {
          ...workcellInfo,
          ...defaultSite,
          jobIdList: outData,
          wafer: materialLot.wafer,
          workOrderId: materialLot.workOrderId,
        },
      }).then(resSult => {
        if (resSult) {
          if (printData.length > 0) {
            // 执行打印
            dispatch({
              type: 'pasteChipPlatform/print',
              payload: {
                materialLotIdList: printData,
              },
            }).then(res => {
              if (res) {
                const file = new Blob(
                  [res],
                  { type: 'application/pdf' }
                );
                const fileURL = URL.createObjectURL(file);
                const newwindow = window.open(fileURL, 'newwindow');
                if (newwindow) {
                  newwindow.print();
                  this.getMaterialList();
                  // 刷新左侧界面数据
                  getSetOutData();

                } else {
                  notification.error({ message: '当前窗口已被浏览器拦截，请手动设置浏览器！' });
                }
              } else {
                notification.error({ message: res === undefined ? "打印失败" : res.message });
              }
            });
          }
        }
      });
    } else if (printData.length > 0) {
      // 执行打印
      dispatch({
        type: 'pasteChipPlatform/print',
        payload: {
          materialLotIdList: printData,
        },
      }).then(res => {
        if (res) {
          const file = new Blob(
            [res],
            { type: 'application/pdf' }
          );
          const fileURL = URL.createObjectURL(file);
          const newwindow = window.open(fileURL, 'newwindow');
          if (newwindow) {
            newwindow.print();
            this.getMaterialList();
            // 刷新左侧界面数据
            getSetOutData();

          } else {
            notification.error({ message: '当前窗口已被浏览器拦截，请手动设置浏览器！' });
          }
        } else {
          notification.error({ message: res === undefined ? "打印失败" : res.message });
        }
      });
    }
  }

  // 新增条码撤回
  @Bind()
  handleRecall() {
    // 判断是否有需要打印的数据
    if (this.props.selectDataKeys.length === 0) {
      return notification.error({ message: "请先选中要撤回的数据" });
    }
    const dataStatus = this.props.selectData.map(item => item.status);
    const { dispatch, getSetOutData } = this.props;
    if (!dataStatus.includes('已打印')) {
      dispatch({
        type: 'pasteChipPlatform/reCall',
        payload: {
          materialLotCodeList: this.props.selectData,
        },
      }).then(res => {
        if (res) {
          getSetOutData();
        }
      });
    } else {
      notification.error({ message: "已打印条码无法撤回" });
    }
  }

  @Bind()
  handleRecallPrint() {
    const { selectDataKeys, selectData, dispatch, pasteChipPlatform: { workcellInfo = {}, defaultSite = {}, materialLot = {} }, getSetOutData } = this.props;
    if (selectDataKeys.length === 0) {
      return notification.error({ message: "请先选中要打印的数据" });
    }
    const printData = selectData.map(item => item.materialLotId);
    const outData = selectData.map(item => item.jobId);
    if (printData.length > 0) {
      dispatch({
        type: 'pasteChipPlatform/recallPrint',
        payload: {
          ...workcellInfo,
          ...defaultSite,
          jobIdList: outData,
          wafer: materialLot.wafer,
          workOrderId: materialLot.workOrderId,
        },
      }).then(res => {
        if (res) {
          notification.success();
          getSetOutData();
        }
      });
    }
  }

  /**
   * 页面渲染
   * @returns {*}
   */
  render() {
    const {
      loading,
      createBarCodeLoading,
      printLoading,
      siteOutLoading,
      pasteChipPlatform: {
        containerType = [],
        boxNoList = {},
        materialLot = {},
        operationRecordId,
        newMaterialLot,
      },
      setCheckedData,
      selectDataKeys,
    } = this.props;
    const { materialLotCodeList = [] } = boxNoList;
    const { addBarCodeModalVisible } = this.state;
    const reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;

    const addBarCodeModal = {
      containerType,
      materialLot: newMaterialLot,
      visible: addBarCodeModalVisible,
      qty: this.state.qty,
      auSnRatio: boxNoList.auSnRatio ? (reg.test(boxNoList.auSnRatio) ? boxNoList.auSnRatio : null) : null,
      queryQty: this.queryQty,
      loading: createBarCodeLoading,
      createBarCode: this.createBarCode,
      addBarCode: this.addBarCode,
    };

    // 行选中
    const rowSelection = {
      selectedRowKeys: selectDataKeys,
      onChange: setCheckedData,
      columnWidth: 50,
    };
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
        dataIndex: 'qty',
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
      },
      {
        title: '实验代码',
        dataIndex: 'labCode',
        width: 100,
      },
    ];
    return (
      <React.Fragment>
        <Row style={{ marginBottom: '8px' }}>
          <Col span={6}><Title titleValue="贴片后芯片盒子" /></Col>
          <Col span={18} style={{ textAlign: 'end' }}>
            <Button
              disabled={(isEmpty(materialLot.materialLotList) && Number(materialLot.surplusCosNum) <= 0) || !operationRecordId}
              onClick={this.addBarCode}
              style={{ marginRight: '10px' }}
            >
              新增
            </Button>
            <Button onClick={this.handleRecall} style={{ marginRight: '10px' }}>新增撤回</Button>
            <Button
              disabled={isEmpty(materialLot.materialLotList) && Number(materialLot.surplusCosNum) <= 0}
              onClick={this.siteOutAndPrint}
              type="primary"
              loading={printLoading || siteOutLoading}
              style={{ marginRight: '10px' }}
            >
              打印
            </Button>
            <Button onClick={this.handleRecallPrint}>打印撤回</Button>
          </Col>
        </Row>
        <Table
          bordered
          rowKey="jobId"
          rowSelection={rowSelection}
          columns={columns}
          loading={loading || printLoading}
          dataSource={materialLotCodeList}
          pagination={{ pageSize: 9999999 }}
          scroll={{ x: tableScrollWidth(columns), y: 250 }}
        />
        {addBarCodeModalVisible && <AddBarCodeModal onRef={this.handleBindRef} {...addBarCodeModal} />}
      </React.Fragment>
    );
  }
}
