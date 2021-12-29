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
import styles from './index.less';
import UnusualTable from './UnusualTable';
import StopMidTable from './StopMidTable';
import StopBottomLeftTable from './StopBottomLeftTable';
import StopBottomTable from './StopBottomTable';
import StopBottomRightTable from './StopBottomRightTable';
import EXpandDetailTable from './DetailTable';
import UpdateCodeDrawer from './UpdateCodeDrawer';

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
      chooseData: {}, // 选中的下拉框
      isBinding: true,
      disabledInput: false, // 左下输入框 禁用
      uploadCodeVisible: false, // 显示 录入条码
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
      return styles['data-click-chip'];
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
    lotSpan.innerHTML = '';
    dispatch({
      type: 'chipPreSelection/queryChoosMap',
      payload: {
        siteId: defaultSite.siteId,
        materialId: record.materialId,
        productType: record.productType,
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
    // 确认必输条件
    const locatorInput = document.getElementById('locatorCode');
    const setsNum = document.getElementById('setsNum');
    if (
      locatorInput.value === '' ||
      locatorInput.value === null ||
      locatorInput.value === undefined
    ) {
      return notification.error({ message: '请输入库位' });
    }
    if (setsNum.value === '' || setsNum.value === null || setsNum.value === undefined||setsNum.value<=0) {
      return notification.error({ message: '请输入套数' });
    }
    this.setState({ spinning: true });
    // 调用接口 生成数据
    const {
      dispatch,
      chipPreSelection: { defaultSite = {}, workcellInfo = {}, materialLotCodeList = [] },
    } = this.props;
    const { chooseData, isBinding, leftTopSelected } = this.state;
    const materialLotIdList = materialLotCodeList.length>0? materialLotCodeList.map(item=>item.materialLotId): [];
    dispatch({
      type: 'chipPreSelection/confirmData',
      payload: {
        cosRuleId: chooseData.cosRuleId,
        materialId: leftTopSelected.materialId,
        productType: leftTopSelected.productType,
        cosNum: chooseData.cosNum,
        locatorCode: locatorInput.value,
        materialLotNum: setsNum.value,
        materialLotIdList,
        siteId: defaultSite.siteId,
        prodLineId: workcellInfo.prodLineId,
        workOrderId: leftTopSelected.workOrderId,
        isBind: isBinding === true ? 'Y' : 'N',
        workcellId: workcellInfo.workcellId,
      },
    }).then(res => {
      if (res) {
        // 显示 批次
        const lotSpan = document.getElementById('lotNumber');
        this.props.form.setFieldsValue({
          F: res.preSelectionLot,
        });
        lotSpan.innerHTML = res.preSelectionLot;
        notification.success({ message: `一共生成套数：${res.num}` });

        // 带入左下侧输入框 查询数据
        const outBoxInput = document.getElementById('outBox');
        outBoxInput.value = res.preSelectionLot;

        // 调用查询接口
        this.setState({ spinning: true });
        this.queryLeftButtom();
        this.setState({ spinning: false });
      }
      this.setState({ spinning: false });
    });
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
      return styles['data-click-chip'];
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

  // 改变中部底色
  @Bind
  changeBackColorButtom(record) {
    const outBoxInput = document.getElementById('outBox');
    if (record.preSelectionLot === outBoxInput.value) {
      return styles['data-click-chip'];
    } else {
      return '';
    }
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
        selectedData: havingData,
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

  // 装入逻辑
  @Bind
  doInBox() {
    // 判断是否选中了要装入的数据
    if (this.state.selectedData.length === 0) {
      return notification.error({ message: '请选择要装入的盒子' });
    }
    // 选择装入的盒子
    const materialLotCodeInput = document.getElementById('materialLotCode');

    // 校验数据
    if (
      materialLotCodeInput.value === '' ||
      materialLotCodeInput.value === null ||
      materialLotCodeInput.value === undefined
    ) {
      return notification.error({ message: '请输入装入盒子' });
    }
    // 每个进行盒子装入
    const dataForAll = this.state.selectedData;
    for (let i = 0; i < dataForAll.length; i++) {
      dataForAll[i].newMaterialLotCode = materialLotCodeInput.value;
    }
    // 调用接口
    const {
      dispatch,
      chipPreSelection: { centerButtomList = [] },
    } = this.props;
    this.setState({ spinning: true });
    dispatch({
      type: 'chipPreSelection/doInBox',
      payload: dataForAll,
    }).then(res => {
      if (res) {
        // 删除对应的数据
        let leftData = centerButtomList;
        for (let i = 0; i < this.state.selectedData.length; i++) {
          leftData = leftData.filter(
            item => item.selectionDetailsId !== this.state.selectedData[i].selectionDetailsId
          );
        }
        // 重置选中数据
        this.setState({
          selectedKeys: [],
          selectedData: [],
        });
        dispatch({
          type: 'chipPreSelection/updateState',
          payload: {
            centerButtomList: leftData,
          },
        });

        // 默认赋值第一条数据给 输入框
        // 重新查询数据
        this.queryRightButtomData();
        this.setState({ spinning: false });
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
    if (
      locatorInput.value === '' ||
      locatorInput.value === null ||
      locatorInput.value === undefined
    ) {
      return notification.error({ message: '请输入库位' });
    }
    this.setState({ uploadCodeVisible: true });
  }

  @Bind()
  expandUpColseData() {
    // 重新填数据
    const {
      chipPreSelection: { materialLotCodeList = [] },
    } = this.props;
    const setsNum = document.getElementById('setsNum');
    setsNum.value = materialLotCodeList.length;
    this.props.form.setFieldsValue({ D: materialLotCodeList.length });
    this.setState({ uploadCodeVisible: false });
  }

  // 录入对应的盒子
  @Bind()
  onEnterDownCode(materialLotCode) {
    const {
      dispatch,
      chipPreSelection: { materialLotCodeListPre = [], materialLotCodeList = [] },
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

    // 判断该盒子是否属于该单据， 不是则报错
    const checkPre =
      materialLotCodeListPre.length > 0
        ? materialLotCodeListPre.filter(item => materialLotCode === item.materialLotCode)
            .length === 0
        : true;
    if (checkPre) {
      return notification.error({ message: '扫描的盒子不存在， 请重新确认' });
    }

    const addData = materialLotCodeListPre.filter(
      item => materialLotCode === item.materialLotCode
    );
    // 校验通过后 则新增
    dispatch({
      type: 'chipPreSelection/updateState',
      payload: {
        materialLotCodeList: [...materialLotCodeList, addData[0]],
      },
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
        return notification.error({ message: '请输入库位' });
      }

      // 查询要录入的盒子号
      dispatch({
        type: 'chipPreSelection/queryPreBarcode',
        payload: {
          locatorCode: locatorInput.value,
        },
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

  // 渲染
  render() {
    // 获取整个表单
    const { form } = this.props;
    // 获取表单的字段属性
    const { getFieldDecorator } = form;
    const { spinning, selectedKeys } = this.state;
    const {
      chipPreSelection: {
        leftTopList = [],
        pagination = {},
        rightTopList = [],
        leftButtomList = [],
        centerButtomList = [],
        centerButtomDetailList = [],
        rightButtomList = [],
        chooseMap = [],
        materialLotCodeList = [],
      },
      getSiteListLoading,
      fetchLeftTopLoading,
      fetchRightTopLoading,
      fetchLeftButtomLoading,
      fetchCenterButtomLoading,
      fetchCenterButtomDetailLoading,
      fetchRightButtomLoading,
    } = this.props;

    const { enterSiteVisible, enterSiteLoading, disabledInput } = this.state;

    const enterSiteProps = {
      visible: enterSiteVisible,
      loading: getSiteListLoading || enterSiteLoading,
      closePath: '/hwms/chip-pre-selection',
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

    // 查询左下角信息
    const leftButtomProps = {
      dataSource: leftButtomList,
      rowClick: this.onClickLeftRow,
      loading: fetchLeftButtomLoading,
      changeBackColor: this.changeBackLeftColor,
    };

    // 中部选择框
    const rowsSelection = {
      selectedRowKeys: selectedKeys,
      onChange: this.onChangeSelected,
    };

    // 查询中底部数据信息
    const centerButtomProps = {
      rowsSelection,
      dataSource: centerButtomList,
      loading: fetchCenterButtomLoading,
      changeBackColor: this.changeBackColorButtom,
    };

    // 查询中底部明细
    const detailDataProps = {
      dataSource: centerButtomDetailList,
      loading: fetchCenterButtomDetailLoading,
      expandDrawer: this.state.expandFlag,
      expandColseData: this.expandColseData,
    };

    // 查询右底部数据
    const rightButtomProps = {
      dataSource: rightButtomList,
      loading: fetchRightButtomLoading,
    };

    const updateCodeDrawerProps = {
      dataSource: materialLotCodeList,
      expandDrawer: this.state.uploadCodeVisible,
      handleClearData: this.handleClearData,
      onEnterDownCode: this.onEnterDownCode,
      expandUpColseData: this.expandUpColseData,
    };

    return (
      <Fragment>
        <Header title={intl.get(`title`).d('COS预挑选')} />
        <Content
          style={{ padding: '0px', margin: '7px 7px 0px', backgroundColor: 'rgba(244,245,247)' }}
        >
          <Spin spinning={spinning}>
            <Row style={{ backgroundColor: 'rgba(244,245,247)' }}>
              <Col span={18}>
                <div className="windowLeftChip">
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
                            width: '200px',
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
                            width: '200px',
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
                            width: '200px',
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
                    <div className="stopTableChip" style={{ marginTop: '0.3vw' }}>
                      <UnusualTable {...leftTopTableProps} />
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.windowLeftChip} style={{ marginLeft: '0.8vw' }}>
                  <Row style={{ marginTop: '0.5vw', lineHeight: '2vw' }}>
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
                        style={{
                          fontSize: '18px',
                          marginLeft: '1.7vw',
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
                      <Form.Item>
                        {getFieldDecorator(
                          'B',
                          {}
                        )(
                          <span
                            style={{ marginLeft: '-0.5vw', fontSize: '1vw', fontWeight: 'bold' }}
                          >
                            <Switch onChange={this.isBinding} defaultChecked />
                          </span>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <div
                    className="stopTableChip"
                    style={{ paddingLeft: '0.5vw', paddingRight: '0.5vw' }}
                  >
                    <StopMidTable {...rightTopTableProps} />
                  </div>
                  <div
                    className="stopTableChip"
                    style={{ paddingLeft: '0.5vw', paddingRight: '0.5vw', marginTop: '0.5vw' }}
                  >
                    <Row style={{ lineHeight: '2vw' }}>
                      <Col span={6}>
                        <span style={{ marginLeft: '1vw', fontSize: '1vw', fontWeight: 'bold' }}>
                          库位:
                        </span>
                      </Col>
                      <Col span={6}>
                        <Form.Item>
                          {getFieldDecorator(
                            'C',
                            {}
                          )(<Input id="locatorCode" required onKeyDown={this.queryPreBarcode} />)}
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <span style={{ marginLeft: '1vw', fontSize: '1vw', fontWeight: 'bold' }}>
                          <Button
                            onClick={this.expandUpOpenData}
                            type="primary"
                            htmlType="submit"
                            style={{
                              backgroundColor: 'rgba(83,107,215)',
                            }}
                          >
                            {intl.get(`hzero.common.button.strue`).d('套数')}
                          </Button>
                        </span>
                      </Col>
                      <Col span={6}>
                        <Form.Item>
                          {getFieldDecorator(
                            'D',
                            {}
                          )(<InputNumber id="setsNum" required min="0" />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <div style={{ lineHeight: '2vw' }}>
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
                              <span
                                id="lotNumber"
                                style={{ fontSize: '1vw', fontWeight: 'bold' }}
                              />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Row style={{ backgroundColor: 'rgba(244,245,247)' }}>
              <Col span={6}>
                <div className="windowCenterBottomChip" style={{ marginTop: '0.5vw' }}>
                  <Row style={{ marginTop: '0.5vw', lineHeight: '2vw' }}>
                    <Col span={16} style={{ marginLeft: '0.8vw' }}>
                      <Row>
                        <Col span={12}>
                          <span
                            style={{ marginLeft: '1.7vw', fontSize: '1vw', fontWeight: 'bold' }}
                          >
                            挑选批次:
                          </span>
                        </Col>
                        <Col span={12}>
                          <Form.Item>
                            {getFieldDecorator(
                              'F',
                              {}
                            )(<Input onPressEnter={this.queryLeftButtom} id="outBox" />)}
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <div style={{ marginTop: '0.5vw', margin: '0.5vw' }}>
                    <div className="stopTableChip" style={{ marginTop: '0.3vw' }}>
                      <StopBottomLeftTable {...leftButtomProps} />
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div
                  className="windowCenterBottomChip"
                  style={{ marginLeft: '0.8vw', marginTop: '0.5vw' }}
                >
                  <Row style={{ marginTop: '0.5vw' }}>
                    <Col span={12} style={{ marginLeft: '0.8vw' }}>
                      <Row style={{ lineHeight: '2vw' }}>
                        <Col span={12}>
                          <span
                            style={{ marginLeft: '1.7vw', fontSize: '1vw', fontWeight: 'bold' }}
                          >
                            取片盒子明细:
                          </span>
                        </Col>
                        <Col span={12}>
                          <Form.Item>
                            {getFieldDecorator(
                              'G',
                              {}
                            )(
                              <Input onPressEnter={this.queryCenterButtomData} id="outBoxDetail" />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={10}>
                      <Button
                        onClick={this.detailData}
                        type="primary"
                        htmlType="submit"
                        style={{
                          fontSize: '18px',
                          marginLeft: '4vw',
                          marginTop: '0.3vw',
                          backgroundColor: 'rgba(83,107,215)',
                        }}
                      >
                        {intl.get(`hzero.common.button.strue`).d('挑选明细')}
                      </Button>
                      <Button
                        onClick={this.doInBox}
                        type="primary"
                        htmlType="submit"
                        style={{
                          fontSize: '18px',
                          marginLeft: '1.7vw',
                          marginTop: '0.3vw',
                          backgroundColor: 'rgba(83,107,215)',
                        }}
                      >
                        {intl.get(`hzero.common.button.strue`).d('装入')}
                      </Button>
                    </Col>
                  </Row>
                  <div
                    className="stopTableChip"
                    style={{ paddingLeft: '0.5vw', paddingRight: '0.5vw', marginTop: '0.3vw' }}
                  >
                    <StopBottomTable {...centerButtomProps} />
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div
                  className="windowCenterBottomChip"
                  style={{ marginTop: '0.5vw', marginLeft: '0.8vw' }}
                >
                  <br />
                  <Row style={{ lineHeight: '2vw' }}>
                    <Col span={8}>
                      <span style={{ marginLeft: '1vw', fontSize: '1vw', fontWeight: 'bold' }}>
                        装入盒子:
                      </span>
                    </Col>
                    <Col span={8}>
                      <Input
                        disabled={disabledInput}
                        onPressEnter={this.queryRightButtomData}
                        id="materialLotCode"
                      />
                    </Col>
                    <Col span={8}>
                      <Button
                        onClick={this.clearInput}
                        type="primary"
                        htmlType="submit"
                        style={{
                          fontSize: '18px',
                          marginLeft: '1.7vw',
                          backgroundColor: 'rgba(83,107,215)',
                        }}
                      >
                        {intl.get(`hzero.common.button.clear`).d('清空')}
                      </Button>
                    </Col>
                  </Row>
                  <div
                    className="stopTableChip"
                    style={{ paddingLeft: '0.5vw', paddingRight: '0.5vw' }}
                  >
                    <StopBottomRightTable {...rightButtomProps} />
                  </div>
                </div>
              </Col>
            </Row>
          </Spin>
        </Content>
        {this.state.expandFlag && <EXpandDetailTable {...detailDataProps} />}
        {enterSiteVisible && <EnterSite {...enterSiteProps} />}
        <UpdateCodeDrawer {...updateCodeDrawerProps} />
      </Fragment>
    );
  }
}
