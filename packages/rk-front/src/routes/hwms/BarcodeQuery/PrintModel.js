/*
 * @Description: 打印
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-10-10 09:12:36
 * @LastEditTime: 2020-10-10 10:15:24
 */
// 打印模态框
import React, { Component } from 'react';
import { Row, Col, Button, Modal, Form } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
// import printOne from '@/assets/model-print-first.png';
import stencil1 from '@/assets/stencil1.png';
import stencil2 from '@/assets/stencil2.png';

export default class PrintModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        selectedModal: '',
    };
  }

  componentDidMount() {
  }



  // 打印条码
  @Bind()
  printBarcode() {
      // 判断是否有选中值， 没有则报错
      if(this.state.selectedModal===""||this.state.selectedModal===null||this.state.selectedModal===undefined){
          return notification.error({message: "请先选中打印模板"});
      }

      // 执行打印方法
      const { handlePrinting } = this.props;
      handlePrinting(this.state.selectedModal);
  }

  // 变色
  @Bind()
  chooseModel(id){
      // 设置动态选中值
      this.setState({selectedModal: id});
      // 改变自己的颜色， 去别的背景色
      const firstModelId = document.getElementById("firstModelId");
      const secondModelId = document.getElementById("secondModelId");
      if(id === '1'){
        firstModelId.style.backgroundColor = '#02B3FF';
        secondModelId.style.backgroundColor = '#C0C0C0';
      }else{
        secondModelId.style.backgroundColor = '#02B3FF';
        firstModelId.style.backgroundColor = '#C0C0C0';
      }

  }


  render() {
    const {
      visible,
      closeModal,
      loading,
    } = this.props;
    return (
      <Modal
        destroyOnClose
        width={800}
        title={<Button type="primary" onClick={this.printBarcode}>打印</Button>}
        visible={visible}
        onCancel={()=>closeModal(false)}
        confirmLoading={loading}
        footer={null}
      >
        <Form>
          <span style={{fontSize: 'x-large'}}>模板:</span>
          <Row>
            <Col span={12} style={{textAlign: 'center'}}>
              <div id="firstModelId" onClick={()=>this.chooseModel('1')} style={{borderRadius: '5px 5px 5px 5px', border: 'solid 1px #C0C0C0', width: '80%', height: '300px', marginLeft: '10%', backgroundColor: '#C0C0C0'}}>
                <img src={stencil1} style={{paddingTop: '2%', width: '90%' }} alt="" />
                <br />
                <span style={{fontSize: 'large'}}>标签模板(1)</span>
              </div>
            </Col>
            <Col span={12} style={{textAlign: 'center'}}>
              <div id="secondModelId" onClick={()=>this.chooseModel('2')} style={{borderRadius: '5px 5px 5px 5px', border: 'solid 1px #C0C0C0', width: '80%', height: '300px', marginLeft: '10%', backgroundColor: '#C0C0C0'}}>
                <img src={stencil2} style={{marginTop: '10%', width: '90%', height: '70%'}} alt="" />
                <br />
                <br />
                <span style={{fontSize: 'large'}}>标签模板(2)</span>
              </div>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
