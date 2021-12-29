// 打印模态框
import React, { Component, Fragment } from 'react';
import { Row, Col, Button, Modal } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import printOne from '../../../../../assets/operation-first.png';
import printTwo from '../../../../../assets/operation-second.png';

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
      const { print } = this.props;
      print(this.state.selectedModal);
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
      }

      if(id === '2'){
        firstModelId.style.backgroundColor = '#C0C0C0';
        secondModelId.style.backgroundColor = '#02B3FF';
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
        title={(
          <Fragment>
            <Button type="primary" loading={loading} onClick={this.printBarcode}>打印</Button>
          </Fragment>
        )}
        visible={visible}
        onCancel={closeModal}
        confirmLoading={loading}
        footer={null}
      >
        <span style={{fontSize: 'x-large'}}>模板:</span>
        <Row>
          <Col span={12} style={{textAlign: 'center'}}>
            <div id="firstModelId" onClick={()=>this.chooseModel('1')} style={{borderRadius: '5px 5px 5px 5px', border: 'solid 1px #C0C0C0', width: '80%', height: '300px', marginLeft: '10%', backgroundColor: '#C0C0C0'}}>
              <img src={printOne} style={{paddingTop: '18%', width: '60%', height: '75%' }} alt="" />
              <br />
              <br />
              <br />
              <span style={{fontSize: 'large'}}>EO标识标签(40*40)</span>
            </div>
          </Col>
          <Col span={12} style={{textAlign: 'center'}}>
            <div id="secondModelId" onClick={()=>this.chooseModel('2')} style={{borderRadius: '5px 5px 5px 5px', border: 'solid 1px #C0C0C0', width: '80%', height: '300px', marginLeft: '10%', backgroundColor: '#C0C0C0'}}>
              <img src={printTwo} style={{marginTop: '10%', width: '90%', height: '70%'}} alt="" />
              <br />
              <br />
              <span style={{fontSize: 'large'}}>EO标识标签(45*30)</span>
            </div>
          </Col>
        </Row>
      </Modal>
    );
  }
}
