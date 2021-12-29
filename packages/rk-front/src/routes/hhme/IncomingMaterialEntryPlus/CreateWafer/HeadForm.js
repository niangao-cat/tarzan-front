
import React, { Component } from 'react';
import { Form, Input, Select, Row, Col, DatePicker, Icon } from 'hzero-ui';
import intl from 'utils/intl';
import {
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  FORM_COL_4_LAYOUT,
} from 'utils/constants';
import Lov from 'components/Lov';
import { connect } from 'dva';
import { filterNullValueObject } from 'utils/utils';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import styles from '../index.less';

@connect(({ incomingMaterialEntryPlus }) => ({
  incomingMaterialEntryPlus,
}))
@Form.create({ fieldNameProp: null })
export default class HeadForm extends Component {
  constructor(props) {
    super(props);
    const { onRef } = props;
    if (onRef) onRef(this);
    this.state = {
      incomingforminputNumber: 'incoming-forminput-number-red',
    };
  }

  componentDidMount() {
  }

  // 明细界面进行新建需要清楚红色底色
  @Bind
  clearIncomingforminputNumber() {
    this.setState({ incomingforminputNumber: 'incoming-forminput-number-yellow' });
  }

  @Bind()
  onEnterDownCode(e) {
    const { form, queryMateriallotQty } = this.props;
    const { getFieldsValue } = form;
    if (e.keyCode === 13) {
      this.setState({ incomingforminputNumber: 'incoming-forminput-number-yellow' });
      queryMateriallotQty(filterNullValueObject(getFieldsValue()));
    }
  }

  @Bind()
  onChange() {
    const { clearQty } = this.props;
    this.setState({ incomingforminputNumber: 'incoming-forminput-number-red' });
    clearQty();
  }

  // 更改cos类型查询
  @Bind()
  changeCosType(val) {
    const { changeCosType } = this.props;
    changeCosType(val);
  }

  render() {
    const {
      lovData = {},
      workcellInfo = {},
      form: { getFieldDecorator, getFieldValue, setFieldsValue },
      tenantId,
      selectWo,
      remainingQty,
      woWithCosType,
      primaryUomQty,
      splitQty,
      materiallotSplitData = {},
      operationRecordId,
      canEdit,
    } = this.props;
    const {
      cosType = [],
    } = lovData;
    const { incomingforminputNumber } = this.state;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="工单号" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workOrderId', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '工单号',
                    }),
                  },
                ],
                initialValue: materiallotSplitData.workOrderId,
              })(
                <Lov
                  code="HME.WO_JOB_SN"
                  queryParams={{
                    tenantId,
                    operationId: workcellInfo.operationId,
                    prodLineId: workcellInfo.prodLineId,
                  }}
                  onChange={() => {
                    setFieldsValue({
                      containerTypeCode: '',
                    });
                    const { dispatch } = this.props;
                    dispatch({
                      type: 'incomingMaterialEntryPlus/updateState',
                      payload: {
                        remainingQty: '',
                        incomingQty: '',
                      },
                    });
                  }}
                  textValue={materiallotSplitData.workOrderNum}
                  onOk={val => selectWo(val)}
                  disabled={operationRecordId !== 'create'}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="COS类型" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('cosType', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: 'COS类型',
                    }),
                  },
                ],
                initialValue: materiallotSplitData.cosType || woWithCosType,
              })(
                <Select
                  style={{ width: '100%' }}
                  // allowClear
                  disabled={!getFieldValue('containerTypeCode') || !getFieldValue('workOrderId') || operationRecordId !== 'create' && !canEdit}
                  onChange={this.changeCosType}
                >
                  {cosType.map(item => {
                    return (
                      <Select.Option value={item.value} key={item.value}>
                        {item.meaning}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="Wafer" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('wafer', {
                initialValue: materiallotSplitData.wafer,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: 'Wafer',
                    }),
                  },
                  {
                    validator: (rule, value, callback) => {
                      if (getFieldValue('wafer') && `${getFieldValue('wafer')}`.length > 15) {
                        callback(
                          'wafer长度不能大于15！'
                        );
                      } else {
                        callback();
                      }
                    },
                  },
                ],
              })(
                <Input
                  disabled={operationRecordId !== 'create' && !canEdit}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="录入批次" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('jobBatch', {
                initialValue: materiallotSplitData.jobBatch ? moment(materiallotSplitData.jobBatch, 'YYYY-MM-DD') : moment(moment().format('YYYY-MM-DD')),
              })(
                <DatePicker
                  format="YYYY-MM-DD"
                  style={{ width: '100%' }}
                  disabled={operationRecordId !== 'create' && !canEdit}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="LOTNO" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('lotNo', {
                initialValue: materiallotSplitData.lotNo,
              })(
                <Input disabled={operationRecordId !== 'create' && !canEdit} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="Avg λ[nm]" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('averageWavelength', {
                initialValue: materiallotSplitData.averageWavelength,
              })(
                <Input disabled={operationRecordId !== 'create' && !canEdit} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="TYPE" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('type', {
                initialValue: materiallotSplitData.type,
              })(
                <Input disabled={operationRecordId !== 'create' && !canEdit} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="备注" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('remark', {
                initialValue: materiallotSplitData.remark,
              })(
                <Input disabled={operationRecordId !== 'create' && !canEdit} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="来料条码" {...SEARCH_FORM_ITEM_LAYOUT} className={styles[`${incomingforminputNumber}`]}>
              {getFieldDecorator('sourceMaterialLotCode', {
                initialValue: materiallotSplitData.materialLotCode,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '来料条码',
                    }),
                  },
                ],
              })(
                <Input
                  placeholder='请扫描条码'
                  suffix={<Icon type="enter" />}
                  onKeyDown={this.onEnterDownCode}
                  onChange={this.onChange}
                  style={{ width: '100%' }}
                  disabled={!getFieldValue('workOrderId') || operationRecordId !== 'create'}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="条码数量" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('primaryUomQty', {
                initialValue: primaryUomQty,
              })(
                <Input disabled />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="拆分数量" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('splitQty', {
                initialValue: splitQty,
              })(
                <Input disabled />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="剩余芯片数量" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('remainingQty', {
                initialValue: materiallotSplitData.remainingQty || remainingQty,
              })(
                <Input disabled />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
