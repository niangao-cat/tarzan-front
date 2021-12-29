/**
 * OperationPlatform - 工序作业平台
 * @date: 2020/02/24 17:15:27
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component, Fragment } from 'react';
import { Row, Col, Form, Input, Button, Select, Modal, Tooltip, Checkbox } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isEmpty, isArray, isFunction } from 'lodash';

import styles from '../../Component/index.less';

const { Option } = Select;

const infoLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

@Form.create({ fieldNameProp: null })
export default class BaseInfo extends Component {

  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
      visible: false,
      record: {}, // 当前选择的步骤
    };
  }

  @Bind()
  handleFetchBaseInfo(e) {
    const { onFetchBaseInfo, modelName, onCheckSn } = this.props;
    if (onFetchBaseInfo && modelName === 'lotOperationPlatform') {
      onFetchBaseInfo({
        snNum: e.target.value,
        batchProcessSnScanFlag: 'Y',
      });
    } else if (onCheckSn && ['singleOperationPlatform', 'operationPlatform'].includes(modelName)) {
      onCheckSn({
        snNum: e.target.value,
      });
    } else if (onFetchBaseInfo) {
      onFetchBaseInfo({
        snNum: e.target.value,
      });
    }
  }

  @Bind()
  handleOutSite(info = {}) {
    const { onOutSite, form, baseInfo } = this.props;
    if (baseInfo.testFlag === 'Y' && baseInfo.reworkFlag === 'Y') {
      onOutSite({
        ...info,
        crossRetestFlag: form.getFieldValue('crossRetestFlag'),
      });
    } else {
      onOutSite(info);
    }
  }

  @Bind()
  handleChangeEoStep(value, option) {
    const { onFetchBaseInfo, form } = this.props;
    if (option.props.title.reworkFlag === 'Y') {
      this.setState({ record: option.props.title, visible: true });
      // Modal.confirm({
      //   title: '请选择当前eo执行查询/返修操作',
      //   okText: '返修',
      //   cancelText: '查询',
      //   onOk: () => {
      //     onFetchBaseInfo({
      //       snNum: form.getFieldValue('snNum'),
      //       eoStepId: option.props.title.eoStepId,
      //       eoStepNum: option.props.title.eoStepNum,
      //       operationId: option.props.title.operationId,
      //       queryReworkFlag: 'N',
      //       reworkFlag: option.props.title.reworkFlag,
      //       eoId: option.props.title.eoId,
      //     });
      //   },
      //   onCancel: () => {
      //     onFetchBaseInfo({
      //       snNum: form.getFieldValue('snNum'),
      //       eoStepId: option.props.title.eoStepId,
      //       eoStepNum: option.props.title.eoStepNum,
      //       operationId: option.props.title.operationId,
      //       queryReworkFlag: 'Y',
      //       eoId: option.props.title.eoId,
      //       reworkFlag: option.props.title.reworkFlag,

      //     });
      //   },
      // });
    } else if (onFetchBaseInfo) {
      onFetchBaseInfo({
        snNum: form.getFieldValue('snNum'),
        eoStepId: option.props.title.eoStepId,
        eoStepNum: option.props.title.eoStepNum,
      });
    }
  }

  @Bind()
  handleRework() {
    const { onFetchBaseInfo, baseInfo } = this.props;
    const { record } = this.state;
    if (onFetchBaseInfo) {
      onFetchBaseInfo({
        snNum: baseInfo.snNum,
        eoStepId: record.eoStepId,
        eoStepNum: record.eoStepNum,
        operationId: record.operationId,
        queryReworkFlag: 'N',
        reworkFlag: record.reworkFlag,
        eoId: record.eoId,
      });
      this.setState({ visible: false });
    }
  }

  @Bind()
  handleQuery() {
    const { onFetchBaseInfo, baseInfo } = this.props;
    const { record } = this.state;
    if (onFetchBaseInfo) {
      onFetchBaseInfo({
        snNum: baseInfo.snNum,
        eoStepId: record.eoStepId,
        eoStepNum: record.eoStepNum,
        operationId: record.operationId,
        queryReworkFlag: 'Y',
        eoId: record.eoId,
        reworkFlag: record.reworkFlag,
      });
      this.setState({ visible: false });
    }
  }

  @Bind()
  handleChangeEoStepNum(value, option) {
    const { onFetchBaseInfo, form } = this.props;
    if (onFetchBaseInfo) {
      onFetchBaseInfo({
        snNum: form.getFieldValue('snNum'),
        eoStepId: option.props.title.eoStepId,
        eoStepNum: value,
        operationId: option.props.title.operationId,
        reworkFlag: option.props.title.reworkFlag,
      });
      this.setState({ visible: false });
    }
  }

  @Bind()
  handleInitData() {
    const { onInitData, form } = this.props;
    if (onInitData) {
      onInitData(false);
    }
    form.resetFields(['snNum']);
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      baseInfo = {},
      timing,
      eoStepList,
      reworkNumList,
      disabled,
      workCellInfo,
      modelName,
    } = this.props;
    const { visible } = this.state;
    return (
      <div className={styles['base-info-content']}>
        <div className={styles['base-up']}>
          <div className={styles['base-search']}>
            <Row>
              <Col span={12} style={{ marginBottom: '8px' }}>
                <Form.Item label="SN号" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  {getFieldDecorator('snNum')(<Input className="operation-platform-sn-num" onPressEnter={this.handleFetchBaseInfo} disabled={!baseInfo.siteOutDate && baseInfo.siteInDate && ['singleOperationPlatform', 'operationPlatform'].includes(modelName) || disabled} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <div className={styles['base-button']}>
                  <Button onClick={() => this.handleInitData()} type="default" style={{ marginRight: '8px' }}>
                    清空
                  </Button>
                  {['singleOperationPlatform', 'operationPlatform'].includes(modelName)
                    && !baseInfo.siteOutDate
                    && ((baseInfo.prohibitClickContinueReworkFlag !== 'Y' && baseInfo.reworkFlag === 'Y' && baseInfo.testFlag !== 'Y')
                      || (!(baseInfo.reworkFlag !== 'Y' && baseInfo.testFlag !== 'Y') && (baseInfo.reworkFlag === 'Y' && baseInfo.testFlag === 'Y') && baseInfo.isShowCrossRetestBtn !== 'Y')) && (
                      <Button
                        type="primary"
                        onClick={() => this.handleOutSite({ outSiteAction: 'REWORK' })}
                        style={{ marginRight: '8px' }}
                      >
                        继续<br />返修
                      </Button>
                    )}
                  {['singleOperationPlatform', 'operationPlatform'].includes(modelName)
                    && !baseInfo.siteOutDate
                    && !isEmpty(baseInfo)
                    && (baseInfo.isClickProcessComplete !== 'N'
                      || (baseInfo.testFlag === 'Y' && baseInfo.reworkFlag === 'Y' && getFieldValue('crossRetestFlag') === 'Y')
                      || (baseInfo.testFlag === 'Y' && baseInfo.reworkFlag === 'Y' && baseInfo.isShowCrossRetestBtn !== 'Y')) && (
                      <Button
                        type="primary"
                        style={{ marginRight: '8px' }}
                        onClick={() => this.handleOutSite({ outSiteAction: 'COMPLETE' })}
                      >
                        加工<br />完成
                      </Button>
                    )}
                  {['singleOperationPlatform', 'operationPlatform'].includes(modelName)
                    && !baseInfo.siteOutDate
                    && (baseInfo.testFlag === 'Y' && baseInfo.reworkFlag === 'Y' && getFieldValue('crossRetestFlag') !== 'Y')
                    && (baseInfo.isShowCrossRetestBtn === 'Y') && (
                      <Button
                        type="primary"
                        onClick={() => this.handleOutSite({ outSiteAction: 'REWORK_COMPLETE' })}
                      >
                        返修<br />完成
                      </Button>
                    )}
                  {!['singleOperationPlatform', 'operationPlatform'].includes(modelName) && !baseInfo.siteOutDate && (
                    <Button
                      type="primary"
                      onClick={() => this.handleOutSite({ outSiteAction: 'COMPLETE' })}
                      className={styles['base-button-completed']}
                    >
                      完成
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          </div>
          <div className={styles['base-info']}>
            <Row>
              <Col span={12}>
                <Form.Item label="当前工序" {...infoLayout}>
                  {isArray(eoStepList) && eoStepList.length > 0 ? (
                    <Select
                      allowClear
                      style={{ width: '100%' }}
                      onSelect={(value, option) => this.handleChangeEoStep(value, option)}
                    >
                      {eoStepList.map(e => (
                        <Option key={e.eoStepId} value={e.eoStepId} title={e}>
                          {e.currentStepName}
                        </Option>
                      ))}
                    </Select>
                  ) : baseInfo.currentStepName}
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
                {/* <Form.Item label='加工次数' {...infoLayout}>
                  { baseInfo.eoStepNum}
                </Form.Item> */}
              </Col>
              <Col span={12}>
                <Form.Item label="工单数量" {...infoLayout}>
                  {`${baseInfo.woQuantityOut || 0} / ${baseInfo.woQuantity || 0}`}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="生产版本" {...infoLayout}>
                  {baseInfo.productionVersion}
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
                    <div style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
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
              {baseInfo.reworkFlag === 'Y' && (
                <Fragment>
                  <Col span={12}>
                    <Form.Item label="不良发起工位" {...infoLayout}>
                      <Tooltip title={baseInfo.ncRecordWorkcellName}>
                        {baseInfo.ncRecordWorkcellName}
                      </Tooltip>
                    </Form.Item>
                  </Col>
                </Fragment>
              )}
              {['singleOperationPlatform'].includes(modelName) && (
                <Fragment>
                  <Col span={12}>
                    <Form.Item label="实验备注" {...infoLayout}>
                      <Tooltip title={baseInfo.routerStepRemark}>
                        <span style={{ paddingLeft: '8px', lineHeight: "30px", overflow: 'hidden', display: 'inline-block', width: '100%', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{baseInfo.routerStepRemark}</span>
                      </Tooltip>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <div className={styles['operationPlatform_lab-code']}>
                      <Form.Item label="实验代码" {...infoLayout}>
                        {getFieldDecorator('labCode', {
                          initialValue: baseInfo.labCode,
                        }
                        )(
                          <Input
                            disabled={(!(!baseInfo.siteOutDate && baseInfo.siteInDate) || !isEmpty(baseInfo.labCode)) && ['singleOperationPlatform'].includes(modelName)}
                          />
                        )}
                      </Form.Item>
                    </div>
                  </Col>
                  {baseInfo.testFlag === 'Y' && baseInfo.reworkFlag === 'Y' && (
                    <Col span={12}>
                      <div className={styles['operationPlatform_cross-retest-flag']}>
                        <Form.Item label="交叉复测" {...infoLayout}>
                          {getFieldDecorator('crossRetestFlag')(
                            <Checkbox checkedValue="Y" unCheckedValue="N" />
                          )}
                        </Form.Item>
                      </div>
                    </Col>
                  )}
                </Fragment>
              )}
            </Row>
          </div>
        </div>
        <Modal
          destroyOnClose
          width={400}
          title='提示'
          visible={visible}
          footer={(
            <Fragment>
              <Button onClick={() => this.handleRework()}>返修</Button>
              <Button onClick={() => this.handleQuery()}>查询</Button>
            </Fragment>
          )}
          onCancel={this.handleCloseTab}
          onOk={this.handleSave}
          wrapClassName={styles['enter-modal']}
        >
          请选择当前eo执行查询/返修操作
        </Modal>
      </div>
    );
  }
}
