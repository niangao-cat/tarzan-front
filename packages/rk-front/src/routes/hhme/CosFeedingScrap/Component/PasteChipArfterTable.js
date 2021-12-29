/*
 * @Description: 贴片后芯片盒子
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-06 17:42:02
 * @LastEditTime: 2020-08-07 16:22:29
 */

import React, { Component } from 'react';
import { Table, Row, Col, Button, Form, Input } from 'hzero-ui';
import Title from '@/components/Title';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import AddBarCodeModal from './AddBarCodeModal';

const formLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 11,
  },
};
@Form.create({ fieldNameProp: null })
@formatterCollections({ code: 'hwms.barcodeQuery' })
@connect(({ cosFeedingScrap, loading}) => ({
  cosFeedingScrap,
  createBarCodeLoading: loading.effects['cosFeedingScrap/createBarCode'],
  loading: loading.effects['cosFeedingScrap/queryBoxNo'],
  printLoading: loading.effects['cosFeedingScrap/print'],
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
      cosFeedingScrap: { workcellInfo = {}, defaultSite= {}, materialLot= {} },
    } = this.props;
    dispatch({
      type: 'cosFeedingScrap/createBarCode',
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
        notification.success();
      }
    });
  }

  @Bind
  queryQty(value){
    const {
      dispatch,
      tenantId,
      cosFeedingScrap: { workcellInfo = {}, defaultSite= {}, materialLot= {} },
    } = this.props;
    dispatch({
      type: 'cosFeedingScrap/queryQty',
      payload: {
        tenantId,
        containerTypeId: value,
        ...defaultSite,
        ...workcellInfo,
        workOrderId: materialLot.workOrderId,
      },
    }).then(res => {
      if (res) {
        this.setState({qty: res.qty});
        this.form.setFieldsValue({
          qty: res.qty,
        });
      }else{
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
   const { dispatch, cosFeedingScrap: { workcellInfo= {}, defaultSite= {}, materialLot= {}}, setCheckedData} = this.props;
    dispatch({
      type: 'cosFeedingScrap/queryBoxNo',
      payload: {
       ...workcellInfo,
       ...defaultSite,
       wafer: materialLot.wafer,
       workOrderId: materialLot.workOrderId,
      },
    }).then(res=>{
      if(res){
        // 默认选中新建条码
        const data = res.materialLotCodeList.filter(item=>item.status==="新建");
        const dataKeys = res.materialLotCodeList.filter(item=>item.status==="新建").map(item=>item.jobId);
        setCheckedData(dataKeys, data );
      }
    });
  }

   // 获取物料信息
   @Bind()
   getMaterialList() {
    const { dispatch, cosFeedingScrap: { workcellInfo= {}, defaultSite= {}}} = this.props;
     dispatch({
       type: 'cosFeedingScrap/getMaterialList',
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
    const { dispatch, cosFeedingScrap: { workcellInfo= {}, defaultSite= {}, materialLot= {}}} = this.props;
     dispatch({
      type: 'cosFeedingScrap/print',
      payload: {
        ...workcellInfo,
        ...defaultSite,
        wafer: materialLot.wafer,
        workOrderId: materialLot.workOrderId,
      },
    }).then(res => {
      if(res){
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
      }else{
        notification.error({ message: res===undefined?"打印失败": res.message});
      }
    });
   }

   // 出站打印
   @Bind()
   siteOutAndPrint() {
     // 判断是否有需要打印的数据
     if(this.props.selectDataKeys.length===0){
       return notification.error({ message: "请先选中要打印的数据"});
     }

     // 筛选 需要出站的数据
     const outData = this.props.selectData.filter(item => item.status ==="新建").map(item=>item.jobId);
     // 筛选 需要打印的数据
     const printData = this.props.selectData.map(item=>item.materialLotId);

     // 执行出站
     const { dispatch, cosFeedingScrap: { workcellInfo= {}, defaultSite= {}, materialLot= {}}, getSetOutData} = this.props;

     if(outData.length>0){
      dispatch({
        type: 'cosFeedingScrap/setOut',
        payload: {
          ...workcellInfo,
          ...defaultSite,
          jobIdList: outData,
          wafer: materialLot.wafer,
          workOrderId: materialLot.workOrderId,
        },
       });
     }

     if(printData.length>0){
       // 执行打印
        dispatch({
          type: 'cosFeedingScrap/print',
          payload: {
            materialLotIdList: printData,
          },
        }).then(res => {
          if(res){
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
          }else{
            notification.error({ message: res===undefined?"打印失败": res.message});
          }
        });
      }
   }

  /**
   * 页面渲染
   * @returns {*}
   */
  render() {
    const { loading, createBarCodeLoading, printLoading, cosFeedingScrap: { containerType= [], boxNoList= {}, materialLot= {}}, form, setCheckedData, selectDataKeys } = this.props;
    const { materialLotCodeList = []} = boxNoList;
    const { addBarCodeModalVisible } = this.state;
    const { getFieldDecorator } = form;
    const addBarCodeModal = {
      containerType,
      visible: addBarCodeModalVisible,
      qty: this.state.qty,
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
    ];
    return (
      <React.Fragment>
        <Row style={{ marginBottom: '8px' }}>
          <Col span={12}><Title titleValue="贴片后芯片盒子" /></Col>
          <Col span={12} style={{ textAlign: 'end' }}>
            <Button disabled={(materialLot.materialLotList===undefined||materialLot.materialLotList===null||materialLot.materialLotList.length===0)&&Number(materialLot.surplusCosNum)<=0} onClick={this.addBarCode} style={{ marginRight: '10px' }}>新增</Button>
            <Button disabled={(materialLot.materialLotList===undefined||materialLot.materialLotList===null||materialLot.materialLotList.length===0)&&Number(materialLot.surplusCosNum)<=0} onClick={this.siteOutAndPrint} type="primary">打印</Button>
          </Col>
        </Row>
        <Table
          bordered
          rowKey="jobId"
          rowSelection={rowSelection}
          columns={columns}
          loading={loading||printLoading}
          dataSource={materialLotCodeList}
          pagination={{pageSize: 9999999}}
          scroll={{ y: 250 }}
        />
        <Form>
          <Form.Item {...formLayout} label='完工数量'>
            {getFieldDecorator('completedQty', {
              initialValue: boxNoList.completedQty,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item {...formLayout} label="热沉报废批次">
            {getFieldDecorator('siteId', {})(<Input disabled />)}
          </Form.Item>
          <Form.Item {...formLayout} label="热沉报废数量">
            {getFieldDecorator('warehouseId', {})(<Input disabled />)}
          </Form.Item>
        </Form>
        {addBarCodeModalVisible && <AddBarCodeModal onRef={this.handleBindRef} {...addBarCodeModal} />}
      </React.Fragment>
    );
  }
}
