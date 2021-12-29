/**
 * OperationPlatform - 工序作业平台
 * @date: 2020/02/24 17:15:27
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component, Fragment } from 'react';
import { Row, Col, Form, Select, Tooltip, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isEmpty, isArray, isFunction } from 'lodash';

// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';

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
      record: {}, // 当前选择的步骤
    };
  }

  @Bind()
  handleFetchBaseInfo(e) {
    const { onFetchBaseInfo, modelName } = this.props;
    if (onFetchBaseInfo && modelName === 'lotOperationPlatform') {
      onFetchBaseInfo({
        snNum: e.target.value,
        batchProcessSnScanFlag: 'Y',
      });
    } else if(onFetchBaseInfo) {
      onFetchBaseInfo({
        snNum: e.target.value,
      });
    }
  }

  @Bind()
  handleOutSite(info = {}) {
    const { onOutSite } = this.props;
    if (onOutSite) {
      onOutSite(info);
    }
  }

  @Bind()
  handleClickSelectedRows(record) {
    return {
      onClick: () => {
        const { onFetchBaseInfo, selectedRecord, onChangeSelectedRecord, onInitData } = this.props;
        if(onInitData) {
          onInitData(false);
        }
        if(isEmpty(selectedRecord) || selectedRecord.snNum !== record.snNum) {
          onFetchBaseInfo({ snNum: record.snNum }, true);
          onChangeSelectedRecord(record);
        } else if(selectedRecord.snNum === record.snNum) {
          onChangeSelectedRecord({});
        }
      },
    };
  }

  @Bind()
  handleClickRow(record) {
    const { baseInfo } = this.props;
    if (baseInfo.snNum === record.snNum) {
      return styles['data-click'];
    } else {
      return '';
    }
  }

  @Bind()
  handleChangeEoStep(value, option) {
    const { onFetchBaseInfo, form } = this.props;
    if(option.props.title.reworkFlag === 'Y') {
      this.setState({ record: option.props.title });
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
    if(onFetchBaseInfo) {
      onFetchBaseInfo({
        snNum: baseInfo.snNum,
        eoStepId: record.eoStepId,
        eoStepNum: record.eoStepNum,
        operationId: record.operationId,
        queryReworkFlag: 'N',
        reworkFlag: record.reworkFlag,
        eoId: record.eoId,
      });
    }
  }

  @Bind()
  handleQuery() {
    const { onFetchBaseInfo, baseInfo } = this.props;
    const { record } = this.state;
    if(onFetchBaseInfo) {
      onFetchBaseInfo({
        snNum: baseInfo.snNum,
        eoStepId: record.eoStepId,
        eoStepNum: record.eoStepNum,
        operationId: record.operationId,
        queryReworkFlag: 'Y',
        eoId: record.eoId,
        reworkFlag: record.reworkFlag,
      });
    }
  }

  @Bind()
  handleChangeEoStepNum(value, option) {
    const { onFetchBaseInfo, form } = this.props;
    if(onFetchBaseInfo) {
      onFetchBaseInfo({
        snNum: form.getFieldValue('snNum'),
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
    form.resetFields(['snNum']);
  }

  @Bind()
  handleOpenModal() {
    const { onOpenModal } = this.props;
    if(onOpenModal) {
      onOpenModal();
    }
  }

  render() {
    const {
      baseInfo = {},
      workingCount,
      eoStepList,
      reworkNumList,
      workCellInfo = {},
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles['operationPlatform_base-info']}>
        <Row>
          <Col span={4}>
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
          <Col span={4}>
            <Form.Item label="当前工序描述" {...infoLayout}>
              {baseInfo.currentStepDescription}
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="下一道工序" {...infoLayout}>
              {baseInfo.nextStepName}
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="下一工序描述" {...infoLayout}>
              {baseInfo.nextStepDescription}
            </Form.Item>
          </Col>
          <Col span={4} className={styles['base-info-last-process']}>
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
          <Col span={4}>
            <Form.Item label="工单数量" {...infoLayout}>
              {`${baseInfo.woQuantityOut || 0} / ${baseInfo.woQuantity || 0}` }
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="生产版本" {...infoLayout}>
              {baseInfo.productionVersion}
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="SAP料号" {...infoLayout}>
              {baseInfo.snMaterialCode}
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="加工中" {...infoLayout}>
              {workingCount}
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="特殊需求" {...infoLayout}>
              <Tooltip title={baseInfo.remark}>
                <div style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'}}>
                  {baseInfo.remark}
                </div>
              </Tooltip>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="物料描述" {...infoLayout}>
              <Tooltip title={baseInfo.snMaterialName}>
                {baseInfo.snMaterialName}
              </Tooltip>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="当前工位" {...infoLayout}>
              {workCellInfo.workcellName}
            </Form.Item>
          </Col>
          {baseInfo.reworkFlag === 'Y' && (
          <Fragment>
            <Col span={4}>
              <Form.Item label="不良发起工位" {...infoLayout}>
                <Tooltip title={baseInfo.ncRecordWorkcellName}>
                  {baseInfo.ncRecordWorkcellName}
                </Tooltip>
              </Form.Item>
            </Col>
          </Fragment>
        )}
          <Col span={4}>
            <div className={styles['operationPlatform_material-info-input']}>
              <Form.Item label="实验备注" {...infoLayout}>
                <Tooltip title={baseInfo.routerStepRemark}>
                  <span style={{ paddingLeft: '8px', lineHeight: "30px", overflow: 'hidden', display: 'inline-block', width: '100%', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{baseInfo.routerStepRemark}</span>
                </Tooltip>
              </Form.Item>
            </div>
          </Col>
          <Col span={4}>
            <div className={styles['operationPlatform_material-info-input']}>
              <Form.Item label="实验代码" {...infoLayout}>
                {getFieldDecorator('labCode', {
                  initialValue: baseInfo.labCode,
                })(
                  <Input
                    disabled={!baseInfo.isLabelCodeEdit}
                  />
                )}
              </Form.Item>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
