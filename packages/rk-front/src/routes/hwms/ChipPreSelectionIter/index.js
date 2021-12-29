/**
 * @Author:ywj
 * @email:wenjie.yang01@hand-china.com
 * @description: 设备监控看板
 */

import React, { Component, Fragment } from 'react';
import { Row, Col, Spin, Button, Input, InputNumber, Switch, Select, Form } from 'hzero-ui';
import { connect } from 'dva';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import EnterSite from '@/components/EnterSite';
import { getCurrentOrganizationId } from 'utils/utils';
import notification from 'utils/notification';
import Lov from 'components/Lov';
import styles from './index.less';
import UnusualTable from './UnusualTable';
import StopMidTable from './StopMidTable';
import EXpandDetailTable from './DetailTable';
import UpdateCodeDrawer from './UpdateCodeDrawer';
import LotDetail from './LotDetail';
import WithdrawDetail from './WithdrawDetail';
import NoPreSelection from './NoPreSelection';

@connect(({ chipPreSelection, loading }) => ({
  chipPreSelection,
  tenantId: getCurrentOrganizationId(),
  getSiteListLoading: loading.effects['chipPreSelection/getSiteList'],
  fetchLeftTopLoading: loading.effects['chipPreSelection/queryLeftTopData'],
  fetchRightTopLoading: loading.effects['chipPreSelection/queryRightTopData'],
  fetchLeftButtomLoading: loading.effects['chipPreSelection/queryLeftButtomData'],
  fetchCenterButtomLoading: loading.effects['chipPreSelection/queryCenterButtomData'],
  fetchCenterButtomDetailLoading: loading.effects['chipPreSelection/queryCenterButtomDetailData'],
  fetchRightButtomLoading: loading.effects['chipPreSelection/queryRightButtomData'],
}))
@Form.create({ fieldNameProp: null })
export default class ChipPreSelection extends Component {
  // 构造函数
  constructor(props) {
    super(props);
    this.state = {
      spinning: false,
      expandFlag: false, // 是否弹出创建框
      enterSiteVisible: true,
      enterSiteLoading: false,
      leftTopSelected: {}, // 左侧上方选中信息
      leftButtomSelected: {}, // 左下方 选中信息
      selectedKeys: [], // 选中的主键
      selectedData: [], // 选中的数据
      selectedWithdrawKeys: [], // 选中的主键
      selectedWithdrawData: [], // 选中的数据
      chooseData: {}, // 选中的下拉框
      isBinding: true,
      disabledInput: false, // 左下输入框 禁用
      uploadCodeVisible: false, // 显示 录入条码
      lotDetailVisible: false, // 显示 批次详情
      withdrawVisible: false, // 显示撤回
      noPreSelectionVisible: false, // 显示 未挑选条码
      preMaterialLot: '', //  需要显示的条码
      enableDo: false, // 允许操作数据
      page: {}, // 分页条件
    };
  }

  // 加载时调用
  componentDidMount() {
    // 获取默认站点
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'chipPreSelection/getSiteList',
      payload: {
        tenantId,
      },
    });

    // 查询独立值集
    dispatch({
      type: 'chipPreSelection/init',
    });
  }

  // 设置批次分页条件
  @Bind
  setPageState(page){
    this.setState({page});
  }

  // 获取左侧界面数据
  @Bind()
  getUnusualTable() {
    const workOrderNumInput = document.getElementById('workOrderNum');
    const materialCodeInput = document.getElementById('materialCode');
    const materialNameInput = document.getElementById('materialName');
    const { dispatch } = this.props;
    // 默认查询左侧界面信息
    dispatch({
      type: 'chipPreSelection/queryLeftTopData',
      payload: {
        workOrderNum: workOrderNumInput.value,
        materialCode: materialCodeInput.value,
        materialName: materialNameInput.value,
      },
    });
  }

  // 重置左侧信息
  @Bind()
  resetData() {
    const workOrderNumInput = document.getElementById('workOrderNum');
    workOrderNumInput.value = '';
    const materialCodeInput = document.getElementById('materialCode');
    materialCodeInput.value = '';
    const materialNameInput = document.getElementById('materialName');
    materialNameInput.value = '';
  }

  @Bind
  getUnusualTableByPanigation(page = {}) {
    const { dispatch } = this.props;
    // 根据页数查询报表信息
    dispatch({
      type: 'chipPreSelection/queryLeftTopData',
      payload: {
        page,
      },
    });
  }

  // 查询工位
  @Bind()
  enterSite(val) {
    this.setState({ enterSiteLoading: true });
    const {
      dispatch,
      chipPreSelection: { defaultSite = {} },
    } = this.props;
    dispatch({
      type: 'chipPreSelection/enterSite',
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
          this.getUnusualTable();
        }
      }
    });
  }

  // 打开窗口调用方法
  @Bind
  changeBackColor(record) {
    const { leftTopSelected } = this.state;
    if (record.workOrderNum === leftTopSelected.workOrderNum) {
      return styles['data-click-chip-lter'];
    } else {
      return '';
    }
  }

  // 行点击触发事件
  @Bind()
  onClickRow(record = {}) {
    // 清空缓存数据
    this.handleClearData();
    this.setState({ leftTopSelected: record });
    // 修改下拉框的数据
    const {
      dispatch,
      chipPreSelection: { defaultSite },
    } = this.props;
    // 清空数据
    const { form } = this.props;
    form.resetFields();
    const lotSpan = document.getElementById('lotNumber');
    lotSpan.value = '';
    dispatch({
      type: 'chipPreSelection/queryChoosMap',
      payload: {
        siteId: defaultSite.siteId,
        materialId: record.materialId,
        productType: record.productType,
      },
    });
  }

  @Bind()
  setChooseMapByMaterial(value) {
    const {
      dispatch,
      chipPreSelection: { defaultSite },
    } = this.props;

    const { form } = this.props;

    dispatch({
      type: 'chipPreSelection/queryChoosMap',
      payload: {
        siteId: defaultSite.siteId,
        materialId: value,
        productType: form.getFieldValue('A1'),
      },
    });
  }

  @Bind()
  setChooseMapByProductType(value) {
    const {
      dispatch,
      chipPreSelection: { defaultSite },
    } = this.props;

    const { form } = this.props;

    dispatch({
      type: 'chipPreSelection/queryChoosMap',
      payload: {
        siteId: defaultSite.siteId,
        materialId: form.getFieldValue('A2'),
        productType: value,
      },
    });
  }

  // 查询右下角数据
  @Bind
  queryRightData(value) {
    const {
      dispatch,
      chipPreSelection: { chooseMap = [] },
    } = this.props;

    // 设置选中下拉框
    const chooseData = chooseMap.filter(item => item.cosRuleId === value)[0];
    this.setState({ chooseData });

    // 查询数据
    dispatch({
      type: 'chipPreSelection/queryRightTopData',
      payload: {
        ruleId: value,
      },
    });
  }

  // 设置绑定数据
  @Bind
  isBinding(value) {
    this.setState({ isBinding: value });
  }

  // 确认生成数据
  @Bind
  confirmSet() {
    const setsNum = document.getElementById('setsNumRequired');
    this.setState({ spinning: true });
    // 调用接口 生成数据
    const {
      dispatch,
      chipPreSelection: { defaultSite = {}, workcellInfo = {}, materialLotCodeList = [], paginationMap = [], surplusChipNum },
      form,
    } = this.props;
    const { chooseData, isBinding, leftTopSelected } = this.state;
    const materialLotIdList = materialLotCodeList.length > 0 ? materialLotCodeList.map(item => item.materialLotId) : [];
    dispatch({
      type: 'chipPreSelection/confirmData',
      payload: {
        cosRuleId: chooseData.cosRuleId,
        materialId: form.getFieldValue('A2'),
        productType: form.getFieldValue('A1'),
        cosNum: chooseData.cosNum,
        setsNum: setsNum.value,
        materialLotIdList,
        siteId: defaultSite.siteId,
        prodLineId: workcellInfo.prodLineId,
        workOrderId: leftTopSelected.workOrderId,
        isBind: isBinding === true ? 'Y' : 'N',
        workcellId: workcellInfo.workcellId,
        selectLot: document.getElementById('lotNumber').value,
      },
    }).then(res => {
      if (res) {
        // 显示 批次
        const lotSpan = document.getElementById('lotNumber');
        this.props.form.setFieldsValue({
          F: res.preSelectionLot,
        });
        lotSpan.value = res.preSelectionLot;
        notification.success({ message: `一共生成套数：${res.num}` });
        this.props.form.setFieldsValue({ 'E': res.preSelectionLot });
        dispatch({
          type: 'chipPreSelection/queryDataByLot',
          payload: {
            selectLot: res.preSelectionLot,
            pageSize: paginationMap.length > 0 ? Number(paginationMap.map(item => item.value)[0]) : 10,
          },
        }).then(resData=>{
          if(resData){
            const data = resData.content;
            if(data&&data.length>0){
              // 获取第一条数据, 通过第一条获取对应虚拟号的数据
              const firstData = data[0];
              const restData = data.filter(item=>item.virtualNum === firstData.virtualNum);
              const count = Math.ceil(restData.length/8);
              // 再和7行进行向下取整
              const lineCount = Math.floor(7/count);
              let selectedRowKeys = [];
              let selectedData = [];
              for(let i=0; i<(lineCount*(restData.length)<data.length?lineCount*(restData.length):data.length); i++){
                if(data[i].status!=="LOADED"){
                  selectedRowKeys = [...selectedRowKeys, data[i].selectionDetailsId];
                  selectedData = [...selectedData, data[i]];
                }
              }
              this.setSelectedRowKey(selectedRowKeys, selectedData);
            }
          }
        });
        this.props.form.setFieldsValue({ surplusChipNum: Number(this.props.form.getFieldValue('surplusChipNum'))-Number(res.cosNum) });
        dispatch({
          type: 'chipPreSelection/updateState',
          payload: {
            surplusChipNum: this.accSub(surplusChipNum, res.cosNum),
          },
        });
        this.setState({ spinning: false, preMaterialLot: res.preSelectionLot });
      }
      this.setState({ spinning: false });
    });
  }

  @Bind()
  accSub(num1, num2) {
    let r1;
    let r2;
    try {
      r1 = num1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = num2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    // eslint-disable-next-line no-restricted-properties
    const m = Math.pow(10, Math.max(r1, r2));
    const n = (r1 >= r2) ? r1 : r2;
    return (Math.round(num1 * m - num2 * m) / m).toFixed(n);
  }

  // 查询左下角数据
  @Bind
  queryLeftButtom() {
    const outBoxInput = document.getElementById('outBox');
    if (outBoxInput.value === '' || outBoxInput.value === null || outBoxInput.value === undefined) {
      return notification.error({ message: '请输入批次' });
    }

    // 执行查询逻辑
    const { dispatch } = this.props;
    dispatch({
      type: 'chipPreSelection/queryLeftButtomData',
      payload: {
        selectLot: outBoxInput.value,
      },
    });
  }

  // 打开窗口调用方法
  @Bind
  changeBackLeftColor(record) {
    const { leftButtomSelected } = this.state;
    if (record.materialLotId === leftButtomSelected.materialLotId) {
      return styles['data-click-chip-lter'];
    } else {
      return '';
    }
  }

  // 行点击触发事件
  @Bind()
  onClickLeftRow(record = {}) {
    this.setState({ leftButtomSelected: record });
    // 带入输入框的值
    const outBoxDetailInput = document.getElementById('outBoxDetail');
    this.props.form.setFieldsValue({
      G: record.materialLotCode,
    });
    // 更改 中间底部输入的值
    outBoxDetailInput.value = record.materialLotCode;

    // 查询中底部数据
    this.queryCenterButtomData();
  }

  // 查询中底部数据
  @Bind
  queryCenterButtomData() {
    const { dispatch } = this.props;
    const outBoxInput = document.getElementById('outBox');
    const outBoxDetailInput = document.getElementById('outBoxDetail');

    // 校验数据
    if (outBoxInput.value === '' || outBoxInput.value === null || outBoxInput.value === undefined) {
      return notification.error({ message: '请输入批次' });
    }
    if (
      outBoxDetailInput.value === '' ||
      outBoxDetailInput.value === null ||
      outBoxDetailInput.value === undefined
    ) {
      return notification.error({ message: '请输入原盒子号' });
    }

    dispatch({
      type: 'chipPreSelection/queryCenterButtomData',
      payload: {
        selectLot: outBoxInput.value,
        materialLotCode: outBoxDetailInput.value,
      },
    });
  }

  // 更改选中数据
  @Bind
  onChangeSelected(selectedRowKeys, selectedRow) {
    const {
      chipPreSelection: { centerButtomList = [] },
    } = this.props;
    // 每次添加前先触发行查询， 数据更新。
    // this.handleSearchLine();
    // 先判断是否是新增的
    if (selectedRowKeys.length > this.state.selectedKeys.length) {
      // 找到新增的那条数据
      const selectKey = selectedRowKeys.filter(item => !this.state.selectedKeys.includes(item));
      // 根据找到的数据 查找对应的虚拟号 必定存在
      const selectData = selectedRow.filter(item => item.selectionDetailsId === selectKey[0]);

      // 除掉选中的对应相同的虚拟号
      let havingData = selectedRow.filter(item => selectData[0].virtualNum !== item.virtualNum);
      let havingKeys = selectedRow
        .filter(item => selectData[0].virtualNum !== item.virtualNum)
        .map(item => item.selectionDetailsId);

      // 获取表格中所以相同的虚拟号数据和主键
      const addData = centerButtomList.filter(item => selectData[0].virtualNum === item.virtualNum);
      const addKeys = centerButtomList
        .filter(item => selectData[0].virtualNum === item.virtualNum)
        .map(item => item.selectionDetailsId);

      // 合并数据
      havingData = havingData.concat(addData);
      havingKeys = havingKeys.concat(addKeys);

      // 更新状态
      this.setState({
        selectedKeys: havingKeys,
        selectedData: havingData.sort((a, b)=>{ return a.virtualNum-b.virtualNum;}),
      });
    } else {
      // 表明删除
      // 找到删除的那条数据
      const selectKey = this.state.selectedKeys.filter(item => !selectedRowKeys.includes(item));
      // 根据找到的数据 查找对应的虚拟号 必定存在
      const selectData = centerButtomList.filter(item => item.selectionDetailsId === selectKey[0]);

      // 除掉选中的对应相同的虚拟号
      const havingData = selectedRow.filter(item => selectData[0].virtualNum !== item.virtualNum);
      const havingKeys = selectedRow
        .filter(item => selectData[0].virtualNum !== item.virtualNum)
        .map(item => item.selectionDetailsId);

      // 更新状态
      this.setState({
        selectedKeys: havingKeys,
        selectedData: havingData,
      });
    }
  }

  // 更改选中数据
  @Bind
  onChangeWithdrawSelected(selectedRowKeys, selectedRow) {
    const {
      chipPreSelection: { centerWithdrawList = [] },
    } = this.props;
    // 每次添加前先触发行查询， 数据更新。
    // this.handleSearchLine();
    // 先判断是否是新增的
    if (selectedRowKeys.length > this.state.selectedWithdrawKeys.length) {
      // 找到新增的那条数据
      const selectKey = selectedRowKeys.filter(item => !this.state.selectedWithdrawKeys.includes(item));
      // 根据找到的数据 查找对应的虚拟号 必定存在
      const selectData = selectedRow.filter(item => item.selectionDetailsId === selectKey[0]);

      // 除掉选中的对应相同的虚拟号
      let havingData = selectedRow.filter(item => selectData[0].virtualNum !== item.virtualNum);
      let havingKeys = selectedRow
        .filter(item => selectData[0].virtualNum !== item.virtualNum)
        .map(item => item.selectionDetailsId);

      // 获取表格中所以相同的虚拟号数据和主键
      const addData = centerWithdrawList.filter(item => selectData[0].virtualNum === item.virtualNum);
      const addKeys = centerWithdrawList
        .filter(item => selectData[0].virtualNum === item.virtualNum)
        .map(item => item.selectionDetailsId);

      // 合并数据
      havingData = havingData.concat(addData);
      havingKeys = havingKeys.concat(addKeys);

      // 更新状态
      this.setState({
        selectedWithdrawKeys: havingKeys,
        selectedWithdrawData: havingData,
      });
    } else {
      // 表明删除
      // 找到删除的那条数据
      const selectKey = this.state.selectedWithdrawKeys.filter(item => !selectedRowKeys.includes(item));
      // 根据找到的数据 查找对应的虚拟号 必定存在
      const selectData = centerWithdrawList.filter(item => item.selectionDetailsId === selectKey[0]);

      // 除掉选中的对应相同的虚拟号
      const havingData = selectedRow.filter(item => selectData[0].virtualNum !== item.virtualNum);
      const havingKeys = selectedRow
        .filter(item => selectData[0].virtualNum !== item.virtualNum)
        .map(item => item.selectionDetailsId);

      // 更新状态
      this.setState({
        selectedWithdrawKeys: havingKeys,
        selectedWithdrawData: havingData,
      });
    }
  }

  // 装入逻辑
  @Bind
  doInBox(materialLotCode, queryCode) {
    // 判断是否选中了要装入的数据
    if (this.state.selectedData.length === 0) {
      return notification.error({ message: '请选择要装入的盒子' });
    }

    // 校验数据
    if (
      materialLotCode === '' ||
      materialLotCode === null ||
      materialLotCode === undefined
    ) {
      return notification.error({ message: '请输入装入盒子' });
    }
    // 每个进行盒子装入
    const data = [];
    for (let i = 0; i < this.state.selectedData.length; i++) {
      data.push({ newMaterialLotCode: materialLotCode, oldMaterialLotId: this.state.selectedData[i].materialLotId, selectionDetailsId: this.state.selectedData[i].selectionDetailsId, virtualNum: this.state.selectedData[i].virtualNum, ways: this.state.selectedData[i].ways });
    }
    // 调用接口
    const {
      dispatch,
      chipPreSelection: { paginationMap = [] },
    } = this.props;
    this.setState({ spinning: true });
    dispatch({
      type: 'chipPreSelection/doInBoxNew',
      payload: data,
    }).then(res => {
      if (res) {
        // // 删除对应的数据
        // let leftData = centerButtomList;
        // for (let i = 0; i < this.state.selectedData.length; i++) {
        //   leftData = leftData.filter(
        //     item => item.selectionDetailsId !== this.state.selectedData[i].selectionDetailsId
        //   );
        // }
        // // 重置选中数据
        // this.setState({
        //   selectedKeys: [],
        //   selectedData: [],
        // });
        // dispatch({
        //   type: 'chipPreSelection/updateState',
        //   payload: {
        //     centerButtomList: leftData,
        //   },
        // });

        // 默认赋值第一条数据给 输入框
        // 重新查询数据
        this.setState({ spinning: false });
        // 刷新界面
        dispatch({
          type: 'chipPreSelection/queryDataByLot',
          payload: {
            selectLot: queryCode,
            size: paginationMap.length > 0 ? Number(paginationMap.map(item => item.value)[0]) : 10,
          },
        }).then(resData=>{
          if(resData){
            const dataRest = resData.content;
            if(dataRest&&dataRest.length>0){
              // 获取第一条数据, 通过第一条获取对应虚拟号的数据
              const firstData = dataRest[0];
              const restData = dataRest.filter(item=>item.virtualNum === firstData.virtualNum);
              const count = Math.ceil(restData.length/8);
              // 再和7行进行向下取整
              const lineCount = Math.floor(7/count);
              let selectedRowKeys = [];
              let selectedData = [];
              for(let i=0; i<(lineCount*(restData.length)<dataRest.length?lineCount*(restData.length):dataRest.length); i++){
                if(dataRest[i].status!=="LOADED"){
                  selectedRowKeys = [...selectedRowKeys, dataRest[i].selectionDetailsId];
                  selectedData = [...selectedData, dataRest[i]];
                }
              }
              this.setSelectedRowKey(selectedRowKeys, selectedData);
            }
          }
        });
        return notification.success({ message: '装入成功' });
      }
      this.setState({ spinning: false });
    });
  }

  @Bind()
  expandColseData() {
    this.setState({ expandFlag: false });
  }

  @Bind()
  expandUpOpenData() {
    const locatorInput = document.getElementById('locatorCode');
    // 设置界面是否可以点击操作
    if (
      locatorInput.value === '' ||
      locatorInput.value === null ||
      locatorInput.value === undefined
    ) {
      this.setState({ enableDo: false });
      // 设置 界面显示数据
    } else {
      this.setState({ enableDo: true });
    }
    this.setState({ uploadCodeVisible: true });

    // 打开窗口自动刷新条码
    const {
      dispatch,
      chipPreSelection: { materialLotCodeList = [] },
    } = this.props;
    if(materialLotCodeList.length > 0){
      // 条码号列表
      const materialLotCode = materialLotCodeList.map(e=>e.materialLotCode).join(',');
      dispatch({
        type: 'chipPreSelection/reQueryBarcode',
        payload: {
          materialLotCode,
        },
      }).then(res => {
        if (res) {
          dispatch({
            type: 'chipPreSelection/updateState',
            payload: {
              materialLotCodeList: res,
            },
          });
        }
      });
    }
   }

  @Bind()
  expandUpColseData() {
    // 重新填数据
    const {
      chipPreSelection: { materialLotCodeList = [] },
    } = this.props;
    const setsNum = document.getElementById('setsNum');
    setsNum.value = materialLotCodeList.length;

    // 求和对应的数量
    const locatorInput = document.getElementById('locatorCode');
    // 设置界面是否可以点击操作
    if (
      locatorInput.value === '' ||
      locatorInput.value === null ||
      locatorInput.value === undefined
    ){
      let sum = 0;
      for(let i=0; i<materialLotCodeList.length; i++){
        sum+=Number(materialLotCodeList[i].cosNum);
      }

      if(this.state.uploadCodeVisible){
        this.props.form.setFieldsValue({ surplusChipNum: sum });
      }else{
        this.props.form.setFieldsValue({ surplusChipNum: sum });
      }
    }

    this.props.form.setFieldsValue({ C1: materialLotCodeList.length });
    this.setState({ uploadCodeVisible: false });
  }

  // 关闭弹框
  @Bind()
  lotColseData() {
    this.setState({ lotDetailVisible: false });
  }

  // 关闭弹框
  @Bind()
  withdrawColseData() {
    this.setState({ withdrawVisible: false });
  }

  // 打开弹框
  @Bind()
  lotOpenData() {
    const { dispatch, chipPreSelection: {paginationMap = [] } } = this.props;
    if(this.state.preMaterialLot){
      // 查询数据
      dispatch({
        type: 'chipPreSelection/queryDataByLot',
        payload: {
          selectLot: this.state.preMaterialLot,
          size: paginationMap.length > 0 ? Number(paginationMap.map(item => item.value)[0]) : 10,
        },
      }).then(resData=>{
        if(resData){
          const data = resData.content;
          if(data&&data.length>0){
            // 获取第一条数据, 通过第一条获取对应虚拟号的数据
            const firstData = data[0];
            const restData = data.filter(item=>item.virtualNum === firstData.virtualNum);
            const count = Math.ceil(restData.length/8);
            // 再和7行进行向下取整
            const lineCount = Math.floor(7/count);
            let selectedRowKeys = [];
            let selectedData = [];
            for(let i=0; i<(lineCount*(restData.length)<data.length?lineCount*(restData.length):data.length); i++){
              if(data[i].status!=="LOADED"){
                selectedRowKeys = [...selectedRowKeys, data[i].selectionDetailsId];
                selectedData = [...selectedData, data[i]];
              }
            }
            this.setSelectedRowKey(selectedRowKeys, selectedData);
          }
        }
      });
    }else{
      dispatch({
        type: 'chipPreSelection/updateState',
        payload: {
          centerButtomList: [],
          centerButtomPagination: {},
        },
      });
    }
    this.setState({ lotDetailVisible: true });
  }

  // 打开弹框
  @Bind()
  withdrawOpenData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chipPreSelection/updateState',
      payload: {
        centerWithdrawList: [],
        centerWithdrawPagination: {},
      },
    });
    this.setState({ withdrawVisible: true, selectedWithdrawKeys: [], selectedWithdrawData: [] });
  }


  // 关闭弹框
  @Bind()
  noPreSelectionCloseData() {
    this.setState({ noPreSelectionVisible: false });
  }

  // 打开弹框
  @Bind()
  noPreSelectionOpenData() {
    this.setState({ noPreSelectionVisible: true });
  }

  // 录入对应的盒子
  @Bind()
  onEnterDownCode(materialLotCode) {
    const {
      dispatch,
      chipPreSelection: { materialLotCodeList = [] },
    } = this.props;

    // 判断是否已经录入了该盒子
    const checkData =
      materialLotCodeList.length > 0
        ? materialLotCodeList.filter(item => materialLotCode === item.materialLotCode).length >
        0
        : false;
    if (checkData) {
      return notification.error({ message: '请勿重复录入' });
    }

    // 校验通过后 则新增
    dispatch({
      type: 'chipPreSelection/checkBarcode',
      payload: {
        materialLotCode,
      },
    }).then(res => {
      if (res) {
        dispatch({
          type: 'chipPreSelection/updateState',
          payload: {
            materialLotCodeList: [res, ...materialLotCodeList],
          },
        });
      }
    });
  }

  // 清空数据
  @Bind()
  handleClearData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chipPreSelection/updateState',
      payload: {
        materialLotCodeList: [],
      },
    });
  }

  @Bind()
  queryPreBarcode(e) {
    const { dispatch } = this.props;
    // 清空缓存数据
    if (e.keyCode === 13) {
      this.handleClearData();
      const locatorInput = document.getElementById('locatorCode');
      if (
        locatorInput.value === '' ||
        locatorInput.value === null ||
        locatorInput.value === undefined
      ) {
        this.expandUpColseData();
      }
      // 查询要录入的盒子号
      dispatch({
        type: 'chipPreSelection/queryPreBarcodeByContainer',
        payload: {
          containerCode: locatorInput.value,
        },
      }).then(res => {
        if (res) {
          dispatch({
            type: 'chipPreSelection/fetchSurplusChipNum',
            payload: {
              containerCode: locatorInput.value,
            },
          }).then(resnum => {
            if (resnum) {
              this.props.form.setFieldsValue({ surplusChipNum: JSON.stringify(resnum)==="{}"?0:resnum, C1: res.length });
            }
          });
          // this.expandUpColseData();
        }
      });
    }
  }

  // 打开明细信息
  @Bind()
  detailData() {
    // 校验 批次
    const outBoxInput = document.getElementById('outBox');
    // 校验数据
    if (outBoxInput.value === '' || outBoxInput.value === null || outBoxInput.value === undefined) {
      return notification.error({ message: '请输入批次' });
    }

    const { dispatch } = this.props;
    dispatch({
      type: 'chipPreSelection/queryCenterButtomDetailData',
      payload: {
        selectLot: outBoxInput.value,
      },
    });
    this.setState({ expandFlag: true });
  }

  // 查询右下角数据
  @Bind
  queryRightButtomData() {
    const materialLotCodeInput = document.getElementById('materialLotCode');
    const { dispatch } = this.props;
    dispatch({
      type: 'chipPreSelection/queryRightButtomData',
      payload: {
        materialLotCode: materialLotCodeInput.value,
      },
    }).then(res => {
      if (res) {
        // 失效输入框
        this.setState({ disabledInput: true });
      }
    });
  }

  // 清空数据
  @Bind
  clearInput() {
    const materialLotCodeInput = document.getElementById('materialLotCode');
    materialLotCodeInput.value = '';
    const { dispatch } = this.props;
    // 清空表格
    dispatch({
      type: 'chipPreSelection/updateState',
      payload: {
        rightButtomList: [],
      },
    });
    // 可以输入条码
    this.setState({ disabledInput: false });
  }

  // 设置预挑选逻辑
  @Bind()
  setPreMaterialLot(value) {
    this.setState({ preMaterialLot: value.target.value });
  }

  @Bind()
  setSelectedRowKey(selectedKeys=[], selectedData= []){
    this.setState({selectedKeys, selectedData});
  }

  @Bind()
  handleLocationMove(locatorId, toMaterialLotCode) {
    const { dispatch } = this.props;
    dispatch({
      type: 'chipPreSelection/handleLocationMove',
      payload: {
        locatorId,
        materialLotCode: toMaterialLotCode,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.lotDetailForm.resetFields(['toMaterialLotCode']);
      }
    });
  }

  // 撤回
  @Bind
  doWithdraw(param={}, size = 10){
    if(this.state.selectedWithdrawData.length===0){
      return notification.error({message: '请先选中要撤回的数据'});
    }

    // 设置传输参数
    let paramList = [];
    for(let i=0; i<this.state.selectedWithdrawData.length; i++){
      if(i===0){
        paramList = [ this.state.selectedWithdrawData[i].virtualNum];
      }else if(!paramList.includes(this.state.selectedWithdrawData[i].virtualNum)){
          paramList = [ ...paramList, this.state.selectedWithdrawData[i].virtualNum];
        }
    }

    const { dispatch } = this.props;
    dispatch({
      type: 'chipPreSelection/doWithdraw',
      payload: {
        virtualNumList: paramList,
      },
    }).then(res => {
      if (res) {
        notification.success();
        // 查询数据
        dispatch({
          type: 'chipPreSelection/queryDataByWithdraw',
          payload: {
            ...param,
            size,
          },
        });
      }
    });
  }

  // 渲染
  render() {
    // 获取整个表单
    const { form } = this.props;
    // 获取表单的字段属性
    const { getFieldDecorator } = form;
    const { spinning, selectedKeys, selectedWithdrawKeys } = this.state;
    const {
      chipPreSelection: {
        leftTopList = [],
        pagination = {},
        rightTopList = [],
        centerButtomDetailList = [],
        centerButtomList = [],
        centerWithdrawList = [],
        centerWithdrawPagination = {},
        centerButtomPagination = {},
        chooseMap = [],
        productMap = [],
        materialLotCodeList = [],
        rightButtomList = [],
        paginationMap = [],
        workcellInfo = {},
        surplusChipNum,
      },
      getSiteListLoading,
      fetchLeftTopLoading,
      fetchRightTopLoading,
      fetchCenterButtomDetailLoading,
      fetchCenterButtomLoading,
    } = this.props;

    const { enterSiteVisible, enterSiteLoading, disabledInput } = this.state;

    const enterSiteProps = {
      visible: enterSiteVisible,
      loading: getSiteListLoading || enterSiteLoading,
      closePath: '/hwms/chip-pre-selection-iteration',
      enterSite: this.enterSite,
    };
    // 查询左侧信息
    const leftTopTableProps = {
      dataSource: leftTopList,
      pagination,
      getUnusualTableByPanigation: this.getUnusualTableByPanigation,
      rowClick: this.onClickRow,
      loading: fetchLeftTopLoading,
      changeBackColor: this.changeBackColor,
    };
    // 查询右侧信息
    const rightTopTableProps = {
      dataSource: rightTopList,
      loading: fetchRightTopLoading,
    };

    // 查询中底部明细
    const detailDataProps = {
      dataSource: centerButtomDetailList,
      loading: fetchCenterButtomDetailLoading,
      expandDrawer: this.state.expandFlag,
      expandColseData: this.expandColseData,
    };

    const updateCodeDrawerProps = {
      dataSource: materialLotCodeList,
      expandDrawer: this.state.uploadCodeVisible,
      enableDo: this.state.enableDo,
      handleClearData: this.handleClearData,
      onEnterDownCode: this.onEnterDownCode,
      expandUpColseData: this.expandUpColseData,
    };

    // 中部选择框
    const rowsSelection = {
      selectedRowKeys: selectedKeys,
      onChange: this.onChangeSelected,
    };

    // 批次弹框挑选
    const lotDetailProps = {
      paginationMap,
      workcellInfo,
      expandDrawer: this.state.lotDetailVisible,
      expandUpColseData: this.lotColseData,
      handleLocationMove: this.handleLocationMove,
      rowsSelection,
      doInBox: this.doInBox,
      doSetPage: this.setPageState,
      doSetSelectedRowKey: this.setSelectedRowKey,
      onRef: node => {
        this.lotDetailForm = node.props.form;
      },
      dataSource: centerButtomList,
      pagination: centerButtomPagination,
      materialLotCode: this.state.preMaterialLot,
      loading: fetchCenterButtomLoading,
    };

    // 中部选择框
    const rowsWithdrawSelection = {
      selectedRowKeys: selectedWithdrawKeys,
      onChange: this.onChangeWithdrawSelected,
    };

    // 撤回弹框挑选
    const withdrawProps = {
      paginationMap,
      expandDrawer: this.state.withdrawVisible,
      expandUpColseData: this.withdrawColseData,
      rowsSelection: rowsWithdrawSelection,
      doWithdraw: this.doWithdraw,
      doSetPage: this.setPageState,
      onRef: node => {
        this.withdrawForm = node.props.form;
      },
      dataSource: centerWithdrawList,
      pagination: centerWithdrawPagination,
      materialLotCode: this.state.preMaterialLot,
      loading: fetchCenterButtomLoading,
    };

    const noPreSelectionProps = {
      dataSource: rightButtomList,
      expandDrawer: this.state.noPreSelectionVisible,
      expandUpColseData: this.noPreSelectionCloseData,
    };

    return (
      <Fragment>
        <Header title={intl.get(`title`).d('COS预挑选')} />
        <Content
          style={{ padding: '0px', margin: '7px 7px 0px', backgroundColor: 'rgba(244,245,247)' }}
        >
          <Spin spinning={spinning}>
            <Row style={{ backgroundColor: 'rgba(244,245,247)' }}>
              <Col span={17}>
                <div className="windowLeftChipLter">
                  <div style={{ marginTop: '0.5vw', margin: '0.5vw' }}>
                    <Row style={{ lineHeight: '2vw' }}>
                      <Col span={4}>
                        <span
                          style={{
                            marginLeft: '1vw',
                            marginTop: '0.5vw',
                            fontSize: '1vw',
                            fontWeight: 'bold',
                          }}
                        >
                          COS预挑选
                        </span>
                      </Col>
                      <Col span={5}>
                        <Input
                          disabled={disabledInput}
                          placeholder="工单号"
                          id="workOrderNum"
                          style={{
                            marginLeft: '0.5vw',
                            width: '150px',
                          }}
                        />
                      </Col>
                      <Col span={5}>
                        <Input
                          disabled={disabledInput}
                          placeholder="物料编码"
                          id="materialCode"
                          style={{
                            marginLeft: '0.5vw',
                            width: '150px',
                          }}
                        />
                      </Col>
                      <Col span={5}>
                        <Input
                          disabled={disabledInput}
                          placeholder="物料描述"
                          id="materialName"
                          style={{
                            marginLeft: '0.5vw',
                            width: '150px',
                          }}
                        />
                      </Col>
                      <Col span={5}>
                        <Button
                          onClick={this.resetData}
                          type="primary"
                          htmlType="submit"
                          style={{
                            fontSize: '18px',
                            marginLeft: '1.7vw',
                            marginTop: '0.3vw',
                            backgroundColor: 'rgba(255,255,255)',
                            color: 'black',
                          }}
                        >
                          {intl.get(`hzero.common.button.clear`).d('清空')}
                        </Button>
                        <Button
                          onClick={this.getUnusualTable}
                          type="primary"
                          htmlType="submit"
                          style={{
                            fontSize: '18px',
                            marginLeft: '1.7vw',
                            marginTop: '0.3vw',
                            backgroundColor: 'rgba(83,107,215)',
                          }}
                        >
                          {intl.get(`hzero.common.button.query`).d('查询')}
                        </Button>
                      </Col>
                    </Row>
                    <div className="stopTableChipLter" style={{ marginTop: '0.3vw' }}>
                      <UnusualTable {...leftTopTableProps} />
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={7}>
                <div className={styles.windowLeftChipLter} style={{ marginLeft: '0.8vw' }}>
                  <Row style={{ marginTop: '0.5vw', lineHeight: '2vw' }}>
                    <Col span={8}>
                      <span style={{ marginLeft: '1vw', fontSize: '1vw', fontWeight: 'bold' }}>
                        产品类型:
                      </span>
                    </Col>
                    <Col span={8}>
                      <Form.Item>
                        {getFieldDecorator(
                          'A1',
                          {
                            initialValue: this.state.leftTopSelected.productType,
                          }
                        )(
                          <Select style={{ width: '150px' }} onChange={this.setChooseMapByProductType}>
                            {productMap.map(item => (
                              <Select.Option key={item.value} value={item.value}>
                                {item.meaning}
                              </Select.Option>
                            ))}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row style={{ lineHeight: '2vw' }}>
                    <Col span={8}>
                      <span style={{ marginLeft: '1vw', fontSize: '1vw', fontWeight: 'bold' }}>
                        物料编码:
                      </span>
                    </Col>
                    <Col span={8}>
                      <Form.Item>
                        {getFieldDecorator(
                          'A2',
                          {
                            initialValue: this.state.leftTopSelected.materialId,
                          }
                        )(
                          <Lov
                            onChange={this.setChooseMapByMaterial}
                            style={{ width: '150px' }}
                            textValue={this.state.leftTopSelected.materialCode}
                            code="QMS.MATERIAL"
                            queryParams={{ tenantId: getCurrentOrganizationId() }}
                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row style={{ lineHeight: '2vw' }}>
                    <Col span={8}>
                      <span style={{ marginLeft: '1vw', fontSize: '1vw', fontWeight: 'bold' }}>
                        挑选规则:
                      </span>
                    </Col>
                    <Col span={8}>
                      <Form.Item>
                        {getFieldDecorator(
                          'A',
                          {}
                        )(
                          <Select onChange={this.queryRightData} style={{ width: '150px' }}>
                            {chooseMap.map(item => (
                              <Select.Option key={item.cosRuleId} value={item.cosRuleId}>
                                {item.cosRuleCode}
                              </Select.Option>
                            ))}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Button
                        onClick={this.confirmSet}
                        type="primary"
                        htmlType="submit"
                        disabled={materialLotCodeList.length === 0}
                        style={{
                          fontSize: '18px',
                          marginLeft: '2.3vw',
                          marginTop: '0.3vw',
                          backgroundColor: 'rgba(83,107,215)',
                        }}
                      >
                        {intl.get(`hzero.common.button.strue`).d('确定')}
                      </Button>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: '0.5vw' }}>
                    <Col span={10}>
                      <span style={{ marginLeft: '1vw', fontSize: '1vw', fontWeight: 'bold' }}>
                        是否绑定工单:
                      </span>
                    </Col>
                    <Col span={8}>
                      <div style={{ marginTop: '-0.5vw' }}>
                        <Form.Item>
                          {getFieldDecorator(
                            'B',
                            {}
                          )(
                            <span
                              style={{ marginLeft: '-0.5vw', fontSize: '1vw', fontWeight: 'bold' }}
                            >
                              <Switch onChange={this.isBinding} defaultChecked={false} />
                            </span>
                          )}
                        </Form.Item>
                      </div>
                    </Col>
                  </Row>
                  <div
                    className="stopTableChipLter"
                    style={{ paddingLeft: '0.5vw', paddingRight: '0.5vw' }}
                  >
                    <StopMidTable {...rightTopTableProps} />
                  </div>
                  <div
                    className="stopTableChipLter"
                    style={{ paddingLeft: '0.5vw', paddingRight: '0.5vw', marginTop: '0.5vw' }}
                  >
                    <Row style={{ lineHeight: '2vw' }}>
                      <Col span={7}>
                        <span style={{ marginLeft: '1vw', fontSize: '1vw', fontWeight: 'bold' }}>
                          容器:
                        </span>
                      </Col>
                      <Col span={17}>
                        <Form.Item>
                          {getFieldDecorator(
                            'C',
                            {}
                          )(<Input id="locatorCode" required onKeyDown={this.queryPreBarcode} />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row style={{ lineHeight: '2vw' }}>
                      <Col span={6}>
                        <span style={{ marginLeft: '1vw', fontSize: '1vw', fontWeight: 'bold' }}>
                          <Button
                            onClick={this.expandUpOpenData}
                            type="primary"
                            htmlType="submit"
                            style={{
                              fontSize: '18px',
                              marginTop: '0.3vw',
                              backgroundColor: 'rgba(83,107,215)',
                            }}
                          >
                            {intl.get(`hzero.common.button.strue`).d('条码')}
                          </Button>
                        </span>
                      </Col>
                      <Col span={6}>
                        <Form.Item>
                          {getFieldDecorator(
                            'C1',
                            {}
                          )(<Input id="setsNum" style={{ marginLeft: '0.8vw', width: '80px' }} disabled />)}
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <span style={{ marginLeft: '0.5vw', fontSize: '1vw', fontWeight: 'bold' }}>
                          剩余芯片数
                        </span>
                      </Col>
                      <Col span={6}>
                        <Form.Item>
                          {getFieldDecorator(
                            'surplusChipNum',
                            { initialValue: surplusChipNum }
                          )(<Input style={{ marginLeft: '0.8vw', width: '80px' }} disabled />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <div style={{ lineHeight: '2vw', marginTop: '0.5vw' }}>
                      <Row>
                        <Col span={8}>
                          <span style={{ marginLeft: '1vw', fontSize: '1vw', fontWeight: 'bold' }}>
                            套数:
                          </span>
                        </Col>
                        <Col span={8}>
                          <Form.Item>
                            {getFieldDecorator(
                              'D',
                              {}
                            )(<InputNumber id="setsNumRequired" style={{ width: '80px' }} required min="0" />)}
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                    <div style={{ lineHeight: '2vw', marginTop: '0.5vw' }}>
                      <Row>
                        <Col span={8}>
                          <span style={{ marginLeft: '1vw', fontSize: '1vw', fontWeight: 'bold' }}>
                            挑选批次:
                          </span>
                        </Col>
                        <Col span={8}>
                          <Form.Item>
                            {getFieldDecorator(
                              'E',
                              {}
                            )(
                              <Input
                                id="lotNumber"
                                onChange={value => this.setPreMaterialLot(value)}
                                style={{ fontSize: '1vw', fontWeight: 'bold' }}
                              />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                    <Row style={{ lineHeight: '2vw', marginTop: '0.5vw' }}>
                      <Col span={6}>
                        <span style={{ marginLeft: '1vw', fontSize: '1vw', fontWeight: 'bold' }}>
                          <Button
                            type="primary"
                            htmlType="submit"
                            style={{
                              fontSize: '18px',
                              marginTop: '0.3vw',
                              width: '80px',
                              backgroundColor: 'rgba(83,107,215)',
                            }}
                          >
                            {intl.get(`hzero.common.button.strue`).d('打印')}
                          </Button>
                        </span>
                      </Col>
                      <Col span={9}>
                        <span style={{ marginLeft: '1vw', fontSize: '1vw', fontWeight: 'bold' }}>
                          <Button
                            onClick={this.lotOpenData}
                            type="primary"
                            htmlType="submit"
                            style={{
                              fontSize: '18px',
                              marginTop: '0.3vw',
                              width: '120px',
                              backgroundColor: 'rgba(83,107,215)',
                            }}
                          >
                            {intl.get(`hzero.common.button.strue`).d('批次详情')}
                          </Button>
                        </span>
                      </Col>
                      <Col span={9}>
                        <span style={{ marginLeft: '1vw', fontSize: '1vw', fontWeight: 'bold' }}>
                          <Button
                            onClick={this.noPreSelectionOpenData}
                            type="primary"
                            htmlType="submit"
                            style={{
                              fontSize: '18px',
                              marginTop: '0.3vw',
                              width: '120px',
                              backgroundColor: 'rgba(83,107,215)',
                            }}
                          >
                            {intl.get(`hzero.common.button.strue`).d('未匹配信息')}
                          </Button>
                        </span>
                      </Col>
                      <Col span={9}>
                        <span style={{ marginLeft: '1vw', fontSize: '1vw', fontWeight: 'bold' }}>
                          <Button
                            onClick={this.withdrawOpenData}
                            type="primary"
                            htmlType="submit"
                            style={{
                              fontSize: '18px',
                              marginTop: '0.3vw',
                              width: '80px',
                              backgroundColor: 'rgba(83,107,215)',
                            }}
                          >
                            {intl.get(`hzero.common.button.strue`).d('撤回')}
                          </Button>
                        </span>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
          </Spin>
        </Content>
        {this.state.expandFlag && <EXpandDetailTable {...detailDataProps} />}
        {enterSiteVisible && <EnterSite {...enterSiteProps} />}
        <UpdateCodeDrawer {...updateCodeDrawerProps} />
        <LotDetail {...lotDetailProps} />
        <WithdrawDetail {...withdrawProps} />
        <NoPreSelection {...noPreSelectionProps} />
      </Fragment>
    );
  }
}
