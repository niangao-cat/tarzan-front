/**
 * OperationPlatform - 工序作业平台
 * @date: 2020/02/24 17:15:27
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { Form, Input, Row, Col, Select, Button } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { decrypt } from '@/utils/utils';
import { queryUnifyIdpValue } from 'services/api';

import scannerImage from '../../../../assets/scannerImageMat.png';
import styles from '../index.less';

const { Option } = Select;

@Form.create({ fieldNameProp: null })
export default class BaseInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      colorDto: [],
    };
  }

  @Bind()
  handleEnterClick(e) {
    this.setState({ colorDto: [] });
    const showData = decrypt(e.target.value);
    const { onFetchEquipmentInfo, form } = this.props;
    form.setFieldsValue({
      snCode: showData,
    });
    if (onFetchEquipmentInfo) {
      onFetchEquipmentInfo(showData).then(res => {
        if (res && !res.equipmentFlag) {
          form.setFieldsValue({
            typeCode: res.typeFlag === 'C' ? 'CHECK' : 'MAINTENANCE',
          });
        }
        if (res) {
          // 查询保养任务
          queryUnifyIdpValue('HME_MAINTENANCE_TASK', {
            equipmentId: res.equipmentId,
            docType: 'M',
          }).then(result => {
            if (result) {
              this.setState({
                colorDto: result.map(i => ({
                  taskCycle: i.taskCycle,
                  docStatus: i.docStatus,
                  color: i.docStatus ? (i.docStatus === "WAITING" ? "yellow" : (i.docStatus === "COMPLETED" ? "green" : (i.docStatus === "无任务" ? "grey" : "white"))) : "white",
                })),
              });
            }

          });
        }
      });
    }
  }

  @Bind()
  handleSetButtonColor(type) {
    const { colorDto } = this.state;
    const arr = colorDto.filter(e => e.taskCycle === type);
    if (arr.length > 0) {
      return arr[0].color;
    } else {
      return 'white';
    }
  }

  @Bind()
  handleChangeEqType(val) {
    const { onChangeType } = this.props;
    if (val && onChangeType) {
      onChangeType(val);
    }
  }

  render() {
    const {
      form: { getFieldDecorator, setFieldsValue },
      equipmentInfo = {},
      checkInfo = {},
      routerParam = {},
      onQueryByDate,
    } = this.props;
    return (
      <div className={styles['eqCheck_base-content']}>
        <div className={styles['eqCheck_base-up']}>
          <div className={styles['eqCheck_base-search']}>
            <Form>
              <Form.Item>
                <Row>
                  <Col span={5}>
                    <div className={styles['eqCheck_base-scanner']}>
                      <img src={scannerImage} alt="" />
                    </div>
                  </Col>
                  <Col span={19}>
                    {getFieldDecorator('snCode', {
                      initialValue: routerParam.assetEncoding,
                    })(
                      <Input
                        placeholder="请输入条码"
                        onChange={() => { setFieldsValue({ typeCode: undefined }); }}
                        onPressEnter={e => this.handleEnterClick(e)}
                      />
                    )}
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          </div>
          <div className={styles['eqCheck_base-info']}>
            <Form.Item label="类型" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className={styles['eqCheck_eq-check-type']}>
              {getFieldDecorator('typeCode', {
                initialValue: routerParam.typeCode,
              })(
                <Select style={{ width: '100%' }} disabled={!equipmentInfo.equipmentFlag} onChange={this.handleChangeEqType}>
                  <Option key="CHECK" value="CHECK">
                    点检
                  </Option>
                  <Option key="MAINTENANCE" value="MAINTENANCE">
                    保养
                  </Option>
                </Select>
              )}
            </Form.Item>
            <Row style={{ display: this.props.form.getFieldValue('typeCode') === 'MAINTENANCE' ? '' : 'none' }}>
              <Col span={8} />
              <Col span={4}>
                <Button style={{ backgroundColor: this.handleSetButtonColor('1') }} onClick={() => onQueryByDate("DAY")}>天</Button>
              </Col>
              <Col span={4}>
                <Button style={{ backgroundColor: this.handleSetButtonColor('0.5') }} onClick={() => onQueryByDate("SHIFT")}>班</Button>
              </Col>
              <Col span={4}>
                <Button style={{ backgroundColor: this.handleSetButtonColor('7') }} onClick={() => onQueryByDate("WEEK")}>周</Button>
              </Col>
              <Col span={4}>
                <Button style={{ backgroundColor: this.handleSetButtonColor('30') }} onClick={() => onQueryByDate("MONTH")}>月</Button>
              </Col>
            </Row>
            <Row style={{ display: this.props.form.getFieldValue('typeCode') === 'MAINTENANCE' ? '' : 'none' }}>
              <Col span={8} />
              <Col span={4}>
                <Button style={{ backgroundColor: this.handleSetButtonColor('90') }} onClick={() => onQueryByDate("SEASON")}>季</Button>
              </Col>
              <Col span={4}>
                <Button style={{ backgroundColor: this.handleSetButtonColor('180') }} onClick={() => onQueryByDate("HALF")}>半年</Button>
              </Col>
              <Col span={4}>
                <Button style={{ backgroundColor: this.handleSetButtonColor('365') }} onClick={() => onQueryByDate("YEAR")}>年</Button>
              </Col>
            </Row>
            <Form.Item label="设备名称" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>{equipmentInfo.assetName}</Form.Item>
            <Form.Item label="设备位置" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>{equipmentInfo.workcellName}</Form.Item>
            <Form.Item label="设备商" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>{equipmentInfo.supplier}</Form.Item>
            <Form.Item label="型号" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>{equipmentInfo.model}</Form.Item>
          </div>
        </div>
        <div className={styles['eqCheck_base-down']}>
          <div className={styles['eqCheck_base-info']}>
            <Form.Item label="状态" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>{checkInfo.status}</Form.Item>
            <Form.Item label="点检项" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>{checkInfo.completeQty} / {checkInfo.totalQty}</Form.Item>
            {/* <div className={styles['eqCheck_base-img']}>
              <img src="" alt="" />
            </div> */}
          </div>
          <div />
        </div>
      </div>
    );
  }
}
