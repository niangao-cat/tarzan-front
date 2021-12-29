/**
 * OperationPlatform - 工序作业平台
 * @date: 2020/02/24 17:15:27
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, InputNumber, Tooltip } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isArray } from 'lodash';

import intl from 'utils/intl';
import Lov from 'components/Lov';

import scannerImageMat from '@/assets/scannerImageMat.png';
import styles from '../Component/index.less';

const formLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

const infoLayout = {
  labelCol: {
    span: 9,
  },
  wrapperCol: {
    span: 15,
  },
};

@Form.create({ fieldNameProp: null })
export default class PreInstalledInfo extends Component {

  @Bind()
  handleFetchBaseInfo(e) {
    const { onFetchBaseInfo, form } = this.props;
    if (onFetchBaseInfo) {
      onFetchBaseInfo({
        snNum: e.target.value.trim(),
        prepareQty: form.getFieldValue('prepareQty'),
      });
    }
  }

  @Bind()
  handleOutSite() {
    const { onOutSite, form, onInitData } = this.props;
    if (onOutSite) {
      onOutSite().then(res => {
        if(res) {
          onInitData(false);
          form.resetFields(['materialLotCode']);
        }
      });
    }
  }

  @Bind()
  handleClear() {
    const { onInitData, form } = this.props;
    if(onInitData) {
      onInitData(false);
      form.resetFields();
    }
  }


  render() {
    const {
      form: { getFieldDecorator, getFieldValue, resetFields },
      workOrderInfo = {},
      baseInfo = {},
      tenantId,
      siteId,
      workCellInfo,
      onFetchWorkOrderInfo,
      onCompletedMaterialInfo,
      fetchCompletedMaterialInfoLoading,
    } = this.props;
    return (
      <div className={styles['base-info-content']}>
        <div className={styles['pre-form']}>
          <Form>
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
                      code="HME.WORK_ORDER_NUM"
                      queryParams={{ tenantId }}
                      onChange={(val, data) => {
                        if(val) {
                          const { woQty, workOrderId, workOrderNum, remark} = data;
                          onFetchWorkOrderInfo({
                            woQty,
                            workOrderId,
                            workOrderNum,
                            remark,
                          });
                          resetFields(['materialId']);
                        }
                      }}
                    />)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <div className={styles['base-button']}>
                  <Button type="default" onClick={() => this.handleClear()} className={styles['base-button-clean']}>
                    清空
                  </Button>
                  <Button
                    type="primary"
                    onClick={this.handleOutSite}
                    disabled={baseInfo.siteOutDate || !baseInfo.siteInDate}
                    style={{ marginLeft: '12px'}}
                    className={styles['base-button-completed']}
                  >
                    完成
                  </Button>
                </div>
              </Col>
              <Col span={22}>
                <Form.Item label="预装物料" {...formLayout}>
                  {getFieldDecorator('materialId', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '预装物料',
                        }),
                      },
                    ],
                  })(
                    <Lov
                      code="HME.PREPARE_MATERIAL"
                      queryParams={{ workOrderId: getFieldValue('workOrderId'), siteId, operationIdListStr: isArray(workCellInfo.operationIdList) ? workCellInfo.operationIdList.join(',') : ''}}
                      // disabled={!baseInfo.siteOutDate && baseInfo.siteInDate}
                      disabled={!getFieldValue('workOrderId')}
                      onChange={(val, data) => {
                        resetFields(['prepareQty']);
                        onCompletedMaterialInfo(data);
                      }}
                    />)}
                </Form.Item>
              </Col>
              <Col span={22}>
                <Form.Item label="预装数量" {...formLayout}>
                  {getFieldDecorator('prepareQty', {
                    initialValue: workOrderInfo.materialPrepareType === 'SN' ? 1 : null,
                    rules: [
                      {
                        required: workOrderInfo.materialPrepareType !== 'SN',
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '预装数量',
                        }),
                      },
                    ],
                  })(
                    <InputNumber
                      // disabled={!baseInfo.siteOutDate && baseInfo.siteInDate}
                      style={{ width: '100%'}}
                      min={1}
                      precision={0}
                      disabled={workOrderInfo.materialPrepareType === 'SN' || fetchCompletedMaterialInfoLoading}
                    />)}
                </Form.Item>
              </Col>
              <Col span={22}>
                <Form.Item label="预装条码" className={styles['form-search-scanner']} {...formLayout}>
                  <img src={scannerImageMat} alt="" className={styles['base-scanner']} />
                  {getFieldDecorator('materialLotCode')(<Input onPressEnter={this.handleFetchBaseInfo} disabled={!workOrderInfo.siteOutDate && workOrderInfo.siteInDate} />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div className={styles['base-info']}>
            <Row>
              <Col span={12}>
                <Form.Item label="工位编码" {...infoLayout}>
                  {workCellInfo.workcellCode}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="工位名称" {...infoLayout}>
                  {workCellInfo.workcellName}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="物料名称" {...infoLayout}>
                  <Tooltip title={workOrderInfo.materialName}>
                    {workOrderInfo.materialName}
                  </Tooltip>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="物料类型" {...infoLayout}>
                  {workOrderInfo.materialType}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="工单数量" {...formLayout}>

                  {`${workOrderInfo.preparedQty || 0} / ${workOrderInfo.woQty && workOrderInfo.componentQty ? workOrderInfo.woQty * workOrderInfo.componentQty : 0}`}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="特殊要求" {...formLayout}>
                  <Tooltip title={workOrderInfo.sapCode}>
                    {workOrderInfo.sapCode}
                  </Tooltip>
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}
