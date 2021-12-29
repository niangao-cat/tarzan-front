// 打印模态框
import React, { Component, Fragment } from 'react';
import { Row, Col, Button, Modal, Form, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import notification from 'utils/notification';

import printOne from '@/assets/model-print-first.png';
import printTwo from '@/assets/model-print-second.png';
import printThree from '@/assets/model-print-fifth.png';
import printFour from '@/assets/model-print-sixth.png';
import printFive from '@/assets/model-print5.png';
import printSix from '@/assets/model-print6.png';
import printSeven from '@/assets/model-print7.png';
import printTen from '@/assets/model-print10.jpeg';
import print11 from '@/assets/model-print11.png';
import print12 from '@/assets/model-print12.png';
import print13 from '@/assets/model-print13.png';
import styles from './index.less';

@Form.create({ fieldNameProp: null })
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
    const { form: { getFieldValue } } = this.props;
    // 判断是否有选中值， 没有则报错
    if (this.state.selectedModal === "" || this.state.selectedModal === null || this.state.selectedModal === undefined) {
      return notification.error({ message: "请先选中打印模板" });
    }

    // 执行打印方法
    const { print } = this.props;
    print({ printType: this.state.selectedModal, printOptionValue: getFieldValue('printOptionValue') });
  }

  // 变色
  @Bind()
  chooseModel(id) {
    // 设置动态选中值
    this.setState({ selectedModal: id });
  }


  render() {
    const {
      visible,
      closeModal,
      loading,
      form: { getFieldDecorator },
      printComponentList = [],
    } = this.props;
    const { selectedModal } = this.state;
    return (
      <Modal
        destroyOnClose
        width={800}
        title={(
          <Fragment>
            <Row>
              <Col span={4}>
                <Button type="primary" onClick={this.printBarcode}>打印</Button>
              </Col>
              <Col span={8}>
                <div className={styles['print-lov']}>
                  {getFieldDecorator('printOptionValue', {
                    initialValue: printComponentList[0].value,
                  })(
                    <Select allowClear style={{ width: '100%' }}>
                      {printComponentList.map(e => (
                        <Select.Option key={e.value} value={e.value}>
                          {e.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </div>
              </Col>
            </Row>


          </Fragment>
        )}
        visible={visible}
        onCancel={closeModal}
        confirmLoading={loading}
        footer={null}
      >
        <Form>
          <span style={{ fontSize: 'x-large' }}>模板:</span>
          <Row>
            <Col span={12} style={{ textAlign: 'center' }}>
              <div
                onClick={() => this.chooseModel('1')}
                style={{
                  borderRadius: '5px 5px 5px 5px',
                  border: 'solid 1px #C0C0C0',
                  width: '80%',
                  height: '300px',
                  marginLeft: '10%',
                  backgroundColor: selectedModal === '1' ? '#02B3FF' : '#C0C0C0',
                }}
              >
                <img src={printOne} style={{ paddingTop: '20%', width: '90%' }} alt="" />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <span style={{ fontSize: 'large' }}>条形码标签模板(30x10/15x5)</span>
              </div>
            </Col>
            <Col span={12} style={{ textAlign: 'center' }}>
              <div
                onClick={() => this.chooseModel('2')}
                style={{
                  borderRadius: '5px 5px 5px 5px',
                  border: 'solid 1px #C0C0C0',
                  width: '80%',
                  height: '300px',
                  marginLeft: '10%',
                  backgroundColor: selectedModal === '2' ? '#02B3FF' : '#C0C0C0',
                }}
              >
                <img src={printTwo} style={{ marginTop: '10%', width: '90%', height: '70%' }} alt="" />
                <br />
                <br />
                <span style={{ fontSize: 'large' }}>二维码标签模板(40x30)</span>
              </div>
            </Col>
            <br />
            <br />
            <Col span={12} style={{ textAlign: 'center' }}>
              <br />
              <div
                onClick={() => this.chooseModel('3')}
                style={{
                  borderRadius: '5px 5px 5px 5px',
                  border: 'solid 1px #C0C0C0',
                  width: '80%',
                  height: '300px',
                  marginLeft: '10%',
                  backgroundColor: selectedModal === '3' ? '#02B3FF' : '#C0C0C0',
                }}
              >
                <img src={printThree} style={{ paddingTop: '20%', width: '90%' }} alt="" />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <span style={{ fontSize: 'large' }}>二维码标签模板(30x12)</span>
              </div>
            </Col>
            <Col span={12} style={{ textAlign: 'center' }}>
              <br />
              <div
                onClick={() => this.chooseModel('4')}
                style={{
                  borderRadius: '5px 5px 5px 5px',
                  border: 'solid 1px #C0C0C0',
                  width: '80%',
                  height: '300px',
                  marginLeft: '10%',
                  backgroundColor: selectedModal === '4' ? '#02B3FF' : '#C0C0C0',
                }}
              >
                <img src={printFour} style={{ marginTop: '10%', width: '90%', height: '70%' }} alt="" />
                <br />
                <br />
                <span style={{ fontSize: 'large' }}>二维码标签模板1(40x30)</span>
              </div>
            </Col>
            <Col span={12} style={{ textAlign: 'center' }}>
              <br />
              <div
                onClick={() => this.chooseModel('5')}
                style={{
                  borderRadius: '5px 5px 5px 5px',
                  border: 'solid 1px #C0C0C0',
                  width: '80%',
                  height: '300px',
                  marginLeft: '10%',
                  backgroundColor: selectedModal === '5' ? '#02B3FF' : '#C0C0C0',
                }}
              >
                <img src={printFive} style={{ marginTop: '10%', width: '90%', height: '70%' }} alt="" />
                <br />
                <br />
                <span style={{ fontSize: 'large' }}>SN固定标签模板(40x40)</span>
              </div>
            </Col>
            <Col span={12} style={{ textAlign: 'center' }}>
              <br />
              <div
                onClick={() => this.chooseModel('6')}
                style={{
                  borderRadius: '5px 5px 5px 5px',
                  border: 'solid 1px #C0C0C0',
                  width: '80%',
                  height: '300px',
                  marginLeft: '10%',
                  backgroundColor: selectedModal === '6' ? '#02B3FF' : '#C0C0C0',
                }}
              >
                <img src={printSix} style={{ marginTop: '10%', width: '90%', height: '70%' }} alt="" />
                <br />
                <br />
                <span style={{ fontSize: 'large' }}>SN固定标签模板(45x30)</span>
              </div>
            </Col>
            <Col span={12} style={{ textAlign: 'center' }}>
              <br />
              <div
                onClick={() => this.chooseModel('7')}
                style={{
                  borderRadius: '5px 5px 5px 5px',
                  border: 'solid 1px #C0C0C0',
                  width: '80%',
                  height: '300px',
                  marginLeft: '10%',
                  backgroundColor: selectedModal === '7' ? '#02B3FF' : '#C0C0C0',
                }}
              >
                <img src={printSeven} style={{ marginTop: '10%', width: '90%', height: '70%' }} alt="" />
                <br />
                <br />
                <span style={{ fontSize: 'large' }}>SN变动标签模板(45x30)</span>
              </div>
            </Col>
            <Col span={12} style={{ textAlign: 'center' }}>
              <br />
              <div
                onClick={() => this.chooseModel('10')}
                style={{
                  borderRadius: '5px 5px 5px 5px',
                  border: 'solid 1px #C0C0C0',
                  width: '80%',
                  height: '300px',
                  marginLeft: '10%',
                  backgroundColor: selectedModal === '10' ? '#02B3FF' : '#C0C0C0',
                }}
              >
                <img src={printTen} style={{ paddingTop: '20%', width: '90%' }} alt="" />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <span style={{ fontSize: 'large' }}>二维码标签模板(55 x 15)</span>
              </div>
            </Col>
            <Col span={12} style={{ textAlign: 'center' }}>
              <br />
              <div
                onClick={() => this.chooseModel('11')}
                style={{
                  borderRadius: '5px 5px 5px 5px',
                  border: 'solid 1px #C0C0C0',
                  width: '80%',
                  height: '300px',
                  marginLeft: '10%',
                  backgroundColor: selectedModal === '11' ? '#02B3FF' : '#C0C0C0',
                }}
              >
                <img src={print11} style={{ paddingTop: '20%', width: '90%' }} alt="" />
                <br />
                <br />
                <br />
                <br />
                <span style={{ fontSize: 'large' }}>二维码标签模板(81 x 43)</span>
              </div>
            </Col>
            <Col span={12} style={{ textAlign: 'center' }}>
              <br />
              <div
                onClick={() => this.chooseModel('12')}
                style={{
                  borderRadius: '5px 5px 5px 5px',
                  border: 'solid 1px #C0C0C0',
                  width: '80%',
                  height: '300px',
                  marginLeft: '10%',
                  backgroundColor: selectedModal === '12' ? '#02B3FF' : '#C0C0C0',
                }}
              >
                <img src={print12} style={{ paddingTop: '20%', width: '90%' }} alt="" />
                <br />
                <br />
                <br />
                <span style={{ fontSize: 'large' }}>二维码标签模板(100 x 57)</span>
              </div>
            </Col>
            <Col span={12} style={{ textAlign: 'center' }}>
              <br />
              <div
                onClick={() => this.chooseModel('13')}
                style={{
                  borderRadius: '5px 5px 5px 5px',
                  border: 'solid 1px #C0C0C0',
                  width: '80%',
                  height: '300px',
                  marginLeft: '10%',
                  backgroundColor: selectedModal === '13' ? '#02B3FF' : '#C0C0C0',
                }}
              >
                <img src={print13} style={{ paddingTop: '20%', width: '90%' }} alt="" />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <span style={{ fontSize: 'large' }}>二维码标签模板(71 x 29)</span>
              </div>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
