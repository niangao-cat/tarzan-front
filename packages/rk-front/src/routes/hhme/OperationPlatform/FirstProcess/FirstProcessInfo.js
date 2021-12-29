/**
 * OperationPlatform - 工序作业平台
 * @date: 2020/02/24 17:15:27
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Select, Tooltip } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isEmpty, isFunction } from 'lodash';
import classNames from 'classnames';

import Lov from 'components/Lov';
import intl from 'utils/intl';
// import scannerImageMat from '../../../../assets/scannerImageMat.png';
import scannerImageMat from '../../../../assets/scannerImageMat.png';


import styles from '../Component/index.less';

const { Option } = Select;

const infoLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

const formLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

// const formItemLayout = {
//   labelCol: {
//     sm: { span: 8 },
//   },
//   wrapperCol: {
//     sm: { span: 14 },
//   },
// };

@Form.create({ fieldNameProp: null })
export default class FirstProcessInfo extends Component {

  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
  }

  @Bind()
  handleFetchBaseInfo() {
    const { onFetchBaseInfo, form: { validateFields } } = this.props;
    validateFields((err, value) => {
      if(!err) {
        if (onFetchBaseInfo) {
          onFetchBaseInfo({
            workOrderId: value.workOrderId,
            snNum: value.snNumber,
            materialId: value.materialId,
          });
        }
      }
    });
  }

  @Bind()
  handleOutSite(info = {}) {
    const { onOutSite } = this.props;
    if (onOutSite) {
      onOutSite(info);
    }
  }


  @Bind()
  handleChangeEoStepNum(value, option) {
    const { onFetchBaseInfo, form } = this.props;
    if(onFetchBaseInfo) {
      onFetchBaseInfo({
        snNum: form.getFieldValue('snNumber'),
        eoStepId: option.props.title.eoStepId,
        eoStepNum: value,
        operationId: option.props.title.operationId,
        reworkFlag: option.props.title.reworkFlag,
      });
    }
  }

  @Bind()
  handleInitData() {
    const { onInitData, form } = this.props;
    if(onInitData) {
      onInitData(false);
    }
    form.resetFields(['snNumber']);
  }

  @Bind()
  formReset() {
    const { form: { resetFields }} = this.props;
    resetFields(['materialCode', 'eoNum', 'materialName', 'identification']);
  }

  @Bind()
  handleChangeValue(value) {
    const { form: { setFieldsValue } } = this.props;
    setFieldsValue({snNumber: value.replace(/\s|[\r]/g, "")});
    return value.replace(/[ ]/g, "");
  }

  @Bind()
  handleAutoCreateSnNum(materialId) {
    const { onAutoCreateSnNum } = this.props;
    if(onAutoCreateSnNum) {
      onAutoCreateSnNum(materialId);
    }
  }

  @Bind()
  handleChangeSnNumber(e) {
    const val = e.target.value;
    if(!val) {
      this.handleInitData();
    }
  }

  render() {
    const {
      tenantId,
      form: { getFieldDecorator, setFieldsValue },
      baseInfo = {},
      timing,
      reworkNumList,
      workCellInfo,
    } = this.props;
    return (
      <div className={styles['base-info-content']}>
        <div className={classNames(styles['operationPlatform_base-up'], styles['base-up'])}>
          <div className={styles['pre-form']}>
            <Row>
              <Col span={14}>
                <Form.Item label="工单号" labelCol={{span: 7}} wrapperCol={{ span: 17}} style={{ marginLeft: '8px'}}>
                  {getFieldDecorator('workOrderId', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '工单号',
                        }),
                      },
                    ],
                  })(
                    <Lov
                      code="HME.FIRST_STEP_WO"
                      queryParams={{ tenantId, workcellId: workCellInfo.workcellId }}
                      onChange={(val, data = {}) => {
                        if(val) {
                          this.handleAutoCreateSnNum(data.materialId);
                        } else {
                          this.handleInitData();
                        }
                        setFieldsValue({materialId: data.materialId});
                      }}
                    />)}
                </Form.Item>
                <Form.Item style={{ display: 'none' }}>
                  {getFieldDecorator('materialId')(
                    <span />)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <div className={styles['base-button']}>
                  <Button type="default" onClick={() => this.handleInitData()} className={styles['base-button-clean']}>
                    清空
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => this.handleOutSite({outSiteAction: 'COMPLETE'})}
                    disabled={baseInfo.siteOutDate || !baseInfo.siteInDate}
                    style={{ marginLeft: '12px'}}
                    className={styles['base-button-completed']}
                  >
                    完成
                  </Button>
                </div>
              </Col>
              <Col span={22}>
                <Form.Item label="物料序列号" {...formLayout} className={styles['form-search-scanner']}>
                  <img src={scannerImageMat} alt="" className={styles['base-scanner']} />
                  {getFieldDecorator('snNumber', {
                    initialValue: baseInfo.snNumber,
                    rules: [
                      {
                        transform: (value) => this.handleChangeValue(value),
                      },
                    ],
                  })(<Input onChange={this.handleChangeSnNumber} onPressEnter={this.handleFetchBaseInfo} disabled={!baseInfo.siteOutDate && baseInfo.siteInDate} className='operation-platform-sn-num' />)}
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className={styles['base-info']}>
            <Row>
              <Col span={12}>
                <Form.Item label="当前工序" {...infoLayout}>
                  {baseInfo.currentStepName}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="当前工序描述" {...infoLayout}>
                  {baseInfo.currentStepDescription}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="下一道工序" {...infoLayout}>
                  {baseInfo.nextStepName}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="下一工序描述" {...infoLayout}>
                  {baseInfo.nextStepDescription}
                </Form.Item>
              </Col>
              <Col span={12} className={styles['base-info-last-process']}>
                <Form.Item label={baseInfo.reworkFlag === 'Y' ? '返修次数' : '加工次数'} {...infoLayout}>
                  {baseInfo.reworkFlag === 'Y' && !isEmpty(reworkNumList) && reworkNumList.length > 1 ? (
                    <Select
                      allowClear
                      style={{ width: '100%' }}
                      onSelect={(value, option) => this.handleChangeEoStepNum(value, option)}
                    >
                      {reworkNumList.map(e => (
                        <Option key={e.eoStepNum} value={e.eoStepNum} title={e}>
                          {e.eoStepNum}
                        </Option>
                      ))}
                    </Select>
                  ) : baseInfo.eoStepNum}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="工单数量" {...infoLayout}>
                  {`${baseInfo.woQuantityOut || 0} / ${baseInfo.woQuantity || 0}` }
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="SAP料号" {...infoLayout}>
                  {baseInfo.snMaterialCode}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="开始时间" {...infoLayout}>
                  {baseInfo.siteInDate}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="产品型号" {...infoLayout}>
                  {baseInfo.snMaterialCode}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="完成时间" {...infoLayout}>
                  {baseInfo.siteOutDate}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="工单号" {...infoLayout}>
                  {baseInfo.workOrderNum}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="计时" {...infoLayout}>
                  {timing}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="特殊需求" {...infoLayout}>
                  <Tooltip title={baseInfo.remark}>
                    <div style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'}}>
                      {baseInfo.remark}
                    </div>
                  </Tooltip>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="节拍" {...infoLayout}>
                  {workCellInfo.activity}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="物料描述" {...infoLayout}>
                  <Tooltip title={baseInfo.snMaterialName}>
                    {baseInfo.snMaterialName}
                  </Tooltip>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="当前工位" {...infoLayout}>
                  {workCellInfo.workcellName}
                </Form.Item>
              </Col>
              <Col span={12}>
                <div className={styles['operationPlatform_material-info-input']}>
                  <Form.Item label="实验备注" {...infoLayout}>
                    <Tooltip title={baseInfo.routerStepRemark}>
                      <span style={{ paddingLeft: '8px', lineHeight: "30px", overflow: 'hidden', display: 'inline-block', width: '100%', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{baseInfo.routerStepRemark}</span>
                    </Tooltip>
                  </Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles['operationPlatform_material-info-input']}>
                  <Form.Item label="实验代码" {...infoLayout}>
                    {getFieldDecorator('labCode', {
                      initialValue: baseInfo.labCode,
                    })(
                      <Input
                        disabled={(!(!baseInfo.siteOutDate && baseInfo.siteInDate) || !isEmpty(baseInfo.labCode))}
                      />
                    )}
                  </Form.Item>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}
