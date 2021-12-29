/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 翻新SN生成
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Form, Button, Col, Row, Input, Table, Radio, Spin, notification } from 'hzero-ui';
import { SEARCH_FORM_CLASSNAME, SEARCH_FORM_ROW_LAYOUT } from 'utils/constants';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';

const RadioGroup = Radio.Group;
const commonModelPrompt = 'tarzan.hwms.renovationSnGeneration';

@connect(({ renovationSnGeneration, loading }) => ({
  renovationSnGeneration,
  fetchListLoading: loading.effects['renovationSnGeneration/queryDataList'],
  submitCodeLoading: loading.effects['renovationSnGeneration/submitCode'],
}))
@Form.create({ fieldNameProp: null })
export default class renovationSnGeneration extends Component {
  state={
    checkflag: false,
    value: '0',
  };

  @Bind
  onChange = (e) => {
    const { dispatch, renovationSnGeneration: { showDto = {} } } = this.props;
    this.setState({
      checkflag: true,
      value: e.target.value,
    });
    showDto.transformMode = e.target.value;
    dispatch({
      type: 'renovationSnGeneration/updateState',
      payload: {
        showDto,
      },
    });

  }

  @Bind
  handleEnterClick(event) {
    const { dispatch } = this.props;
    this.setState({
      checkflag: false,
      value: 0,
    });
    const oneButton = document.getElementById("one");
    const twoButton = document.getElementById("two");
    const threeButton = document.getElementById("three");
    const fourButton = document.getElementById("four");
    oneButton.value = "";
    twoButton.value = "";
    threeButton.value = "";
    fourButton.value = "";
    dispatch({
      type: 'renovationSnGeneration/queryDataList',
      payload: {
        materialLotCode: event.target.value,
      },
    }).then(res=>{
      if(res){
        oneButton.value = res.siteLine;
        twoButton.value = res.materialType;
        threeButton.value = res.yearMonth;
      }
    });
  }

  @Bind
  onOk(){
    const { dispatch, renovationSnGeneration: { headList = [], showDto= {} } } = this.props;
    // 判断是否有新的条码信息
    const fourButton = document.getElementById("four");
    if(fourButton.value){
      return notification.error({message: '已经生成条码, 请勿重复操作'});
    }
    // 判断是否有数据
    if(!headList||headList.length===0){
      return notification.error({message: '请先扫描条码!'});
    }
    // 判断是否勾选了数据
    if(!this.state.checkflag){
      return notification.error({message: '勾选规则!'});
    }

    // 判断勾选的规则是否有数据
    if(showDto.transformMode === 2){
      const oneButton = document.getElementById("one");
      const twoButton = document.getElementById("two");
      const threeButton = document.getElementById("three");
      if((!oneButton.value)||(!twoButton.value)||(!threeButton.value)){
        return notification.error({message: '勾选的规则， 必输项未输入'});
      }

      // 校验对应的长度信息
      if(oneButton.value.length<2){
        return notification.error({message: '勾选的规则， 第一格长度必须为2'});
      }
      if(twoButton.value.length<4){
        return notification.error({message: '勾选的规则， 第二格长度必须为4'});
      }
      if(threeButton.value.length<3){
        return notification.error({message: '勾选的规则， 第三格长度必须为3'});
      }
      showDto.siteLine = oneButton.value;
      showDto.materialType = twoButton.value;
      showDto.yearMonth = threeButton.value;
    }

    // 进行提交数据
    dispatch({
      type: 'renovationSnGeneration/submitCode',
      payload: showDto,
    }).then(res=>{
      if(res){
        fourButton.value = res.materialLotCode;
        notification.success({message: '提交成功'});
      }
    });
   }

  @Bind()
  printData(){
    // 打印数据
    const { dispatch, renovationSnGeneration: { headList = [], showDto= {} } } = this.props;

    // 判断是否录入了数据
    if(!headList||headList.length===0){
      return notification.error({message: '请先扫描条码!'});
    }

    // 判断是否有新的条码信息
    const fourButton = document.getElementById("four");
    if(!fourButton.value){
      return notification.error({message: '请先生成条码'});
    }
    showDto.eoNum = fourButton.value;

    const printData = [{
      eoNum: fourButton.value,
      materialCode: showDto.materialCode,
      materialName: showDto.materialName,
      printOptionValue: showDto.printOptionValue,
      soNum: showDto.soNum,
      version: showDto.version,
      workOrder: showDto.workOrderNum,
    }];
    // 进行打印数据
    dispatch({
      type: 'renovationSnGeneration/print',
      payload: printData,
    }).then(res => {
      if (res){
        const file = new Blob(
          [res],
          { type: 'application/pdf' }
        );
        const fileURL = URL.createObjectURL(file);
        const newwindow = window.open(fileURL, 'newwindow');
        if (newwindow) {
          newwindow.print();
        } else {
          notification.error({ message: '当前窗口已被浏览器拦截，请手动设置浏览器！' });
        }
      }
    });
  }

  // 渲染 界面布局
  render() {
    // 获取默认数据
    const {
      fetchListLoading,
      submitCodeLoading,
      renovationSnGeneration: { headList = [], showDto = {} },
    } = this.props;

    // 设置显示数据
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.workOrderNum`).d('工单号'),
        dataIndex: 'workOrderNum',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.eoNum`).d('EO编码'),
        dataIndex: 'eoNum',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.reworkMaterialLot`).d('当前条码'),
        dataIndex: 'reworkMaterialLot',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.afFlagMeaning`).d('是否售后'),
        dataIndex: 'afFlagMeaning',
        align: 'center',
      },
    ];

    //  返回默认界面数据
    return (
      <div>
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('翻新SN生成')} />
        <Content>
          <Spin spinning={false}>
            <Form className={SEARCH_FORM_CLASSNAME}>
              <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ fontSize: '16px', fontWeight: 'bold' }}>
                <Col span="1">
                  <span>原SN</span>
                </Col>
                <Col span="8">
                  <Input onPressEnter={e => this.handleEnterClick(e)} />
                </Col>
              </Row>
            </Form>
            <Table
              bordered
              dataSource={headList}
              columns={columns}
              pagination={false}
              loading={fetchListLoading}
            />
            <br />
            <Form className={SEARCH_FORM_CLASSNAME}>
              <Row {...SEARCH_FORM_ROW_LAYOUT}>
                <RadioGroup
                  name="radiogroup"
                  value={this.state.value}
                  onChange={this.onChange}
                  style={{ width: '100%', fontWeight: 'bold', fontSize: '15px' }}
                >
                  <Row {...SEARCH_FORM_ROW_LAYOUT}>
                    <Col span="6">
                      <Radio value={1} disabled={!showDto.suggestSnCodeList||showDto.suggestSnCodeList.length===0}>
                        &emsp;&emsp;<span style={{ fontSize: '15px' }}>建议SN</span>
                      </Radio>
                    </Col>
                    <Col span="3">
                      <span>{showDto.suggestSnCodeList?showDto.suggestSnCodeList.length>0?showDto.suggestSnCodeList[0]:"":""}</span>
                    </Col>
                    <Col span="3">
                      <span>{showDto.suggestSnCodeList?showDto.suggestSnCodeList.length>0?showDto.suggestSnCodeList[1]:"":""}</span>
                    </Col>
                    <Col span="3">
                      <span>{showDto.suggestSnCodeList?showDto.suggestSnCodeList.length>0?showDto.suggestSnCodeList[2]:"":""}</span>
                    </Col>
                    <Col span="3">
                      <span>{showDto.suggestSnCodeList?showDto.suggestSnCodeList.length>0?showDto.suggestSnCodeList[3]:"":""}</span>
                    </Col>
                  </Row>
                  <br />
                  <br />
                  <Row {...SEARCH_FORM_ROW_LAYOUT}>
                    <Col span="6">
                      <Radio value={2}>
                        &emsp;&emsp;<span style={{ fontSize: '15px' }}>自定义SN</span>
                      </Radio>
                    </Col>
                    <Col span="3">
                      <Input
                        inputChinese={false}
                        typeCase="upper"
                        required
                        id="one"
                        style={{ backgroundColor: 'yellow' }}
                        maxLength="2"
                        defaultValue={showDto.siteLine}
                      />
                    </Col>
                    <Col span="3">
                      <Input
                        inputChinese={false}
                        typeCase="upper"
                        id="two"
                        required
                        style={{ backgroundColor: 'yellow' }}
                        maxLength="4"
                        defaultValue={showDto.materialType}
                      />
                    </Col>
                    <Col span="3">
                      <Input
                        inputChinese={false}
                        typeCase="upper"
                        id="three"
                        required
                        style={{ backgroundColor: 'yellow' }}
                        maxLength="3"
                        defaultValue={showDto.yearMonth}
                      />
                    </Col>
                    <Col span="3">
                      <Input disabled value="XXXXX" />
                    </Col>
                  </Row>
                </RadioGroup>
              </Row>
            </Form>
            <br />
            <Form className={SEARCH_FORM_CLASSNAME}>
              <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ fontWeight: 'bold', fontSize: '16px' }}>
                <Col span="5">
                  <span />
                </Col>
                <Col span="13">
                  <span>编码规则：站点+产线+物料类型+年+月+位流水号</span>
                </Col>
              </Row>
            </Form>
            <br />
            <Form className={SEARCH_FORM_CLASSNAME}>
              <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ fontSize: '16px', fontWeight: 'bold' }}>
                <Col span="1">
                  <span>新SN</span>
                </Col>
                <Col span="8">
                  <Input disabled id="four" />
                </Col>
              </Row>
            </Form>
            <Form className={SEARCH_FORM_CLASSNAME}>
              <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ fontSize: '16px', fontWeight: 'bold' }}>
                <Col span="2">
                  <span />
                </Col>
                <Col span="4">
                  <Button type="primary" icon="save" loading={submitCodeLoading} onClick={() => this.onOk()}>
                    提交
                  </Button>
                </Col>
                <Col span="3">
                  <Button type="primary" icon="printer" onClick={() => this.printData()}>
                    打印
                  </Button>
                </Col>
              </Row>
            </Form>
          </Spin>
        </Content>
      </div>
    );
  }
}
