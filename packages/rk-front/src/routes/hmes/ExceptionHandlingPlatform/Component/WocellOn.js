/*
 * @Description: 工位谈框
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-19 15:37:20
 */
import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Select, notification } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import styles from '../index.less';

const { Option } = Select;

@Form.create({ fieldNameProp: null })
export default class EnterModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 输入工位并回车
  @Bind()
  enterSite() {
    const { enterWork, form, checkWocell,
      areaMap = [],
      workshopMap = [],
      prodLineMap = [] } = this.props;
    if (enterWork) {
      form.validateFields((err, values) => {
        if (!err) {
          // 如果验证成功,则执行enterSite
          if(values.area||values.workshop||values.prodLine||values.workcell){
            if(values.area){
              const data = areaMap.filter(item=>item.areaId===values.area)[0];
              enterWork({workcellId: data.areaId, workcellCode: data.areaCode, workcellName: data.areaName, initiationType: 'AREA'});
            }
            if(values.workshop){
              const data = workshopMap.filter(item=>item.areaId===values.workshop)[0];
              enterWork({workcellId: data.areaId, workcellCode: data.areaCode, workcellName: data.areaName, initiationType: 'WORKSHOP'});
            }
            if(values.prodLine){
              const data = prodLineMap.filter(item=>item.prodLineId===values.prodLine)[0];
              enterWork({workcellId: data.prodLineId, workcellCode: data.prodLineCode, workcellName: data.prodLineName, initiationType: 'PROD_LINE'});
            }
            if(values.workcell){
              // 加载数据信息
              checkWocell(values.workcell).then(res=>{
                if(res){
                  enterWork(res);
                }
              });
            }
          }else{
            notification.error({message: '请输入工位'});
          }
        }
      });
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
      visible,
      closeModal,
      areaMap = [],
      workshopMap = [],
      prodLineMap = [],
      checkWorkcellLoading,
    } = this.props;
    const DRAWER_FORM_ITEM_LAYOUT_MAX = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    return (
      <Modal
        destroyOnClose
        width={600}
        title={intl.get('hmes.operationPlatform.view.message.title').d('登录')}
        visible={visible}
        onOk={this.enterSite}
        confirmLoading={checkWorkcellLoading}
        onCancel={closeModal}
        wrapClassName={styles['enter-modal']}
      >
        <Form>
          <Row>
            <Col span={12}>
              <Form.Item {...DRAWER_FORM_ITEM_LAYOUT_MAX} label="制造部">
                {getFieldDecorator('area', {
                  })(
                    <Select allowClear disabled={this.props.form.getFieldValue('workcell')||this.props.form.getFieldValue('workshop')||this.props.form.getFieldValue('prodLine')}>
                      {areaMap.map(ele => (
                        <Option value={ele.areaId} key={ele.areaId}>
                          {ele.areaName}
                        </Option>
                    ))}
                    </Select>
                  )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...DRAWER_FORM_ITEM_LAYOUT_MAX} label="车间">
                {getFieldDecorator('workshop', {
                  })(
                    <Select allowClear disabled={this.props.form.getFieldValue('area')||this.props.form.getFieldValue('workcell')||this.props.form.getFieldValue('prodLine')}>
                      {workshopMap.map(ele => (
                        <Option value={ele.areaId} key={ele.areaId}>
                          {ele.areaName}
                        </Option>
                    ))}
                    </Select>
                  )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...DRAWER_FORM_ITEM_LAYOUT_MAX} label="生产线">
                {getFieldDecorator('prodLine', {
                  })(
                    <Select allowClear disabled={this.props.form.getFieldValue('area')||this.props.form.getFieldValue('workshop')||this.props.form.getFieldValue('workcell')}>
                      {prodLineMap.map(ele => (
                        <Option value={ele.prodLineId} key={ele.prodLineId}>
                          {ele.prodLineName}
                        </Option>
                    ))}
                    </Select>
                  )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...DRAWER_FORM_ITEM_LAYOUT_MAX} label="工位">
                {getFieldDecorator('workcell', {
                  })(
                    <Input disabled={this.props.form.getFieldValue('area')||this.props.form.getFieldValue('workshop')||this.props.form.getFieldValue('prodLine')} />
                  )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
