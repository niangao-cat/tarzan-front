
import React, { Component } from 'react';
import { Form, Input, Select, Row, Col, DatePicker, Icon } from 'hzero-ui';
import intl from 'utils/intl';
import {
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  FORM_COL_4_LAYOUT,
} from 'utils/constants';
import { connect } from 'dva';
import moment from 'moment';
import { Bind } from 'lodash-decorators';

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
    };
  }

  componentDidMount() {
  }

  @Bind()
  onEnterDownCode(e) {
    const { form, scanSourceLotCode } = this.props;
    const { getFieldValue } = form;
    if (e.keyCode === 13) {
      if (scanSourceLotCode) {
        scanSourceLotCode(getFieldValue('sourceLotCode'));
      }
    }
  }

  // 更改cos类型查询
  @Bind()
  changeContainerTypeCode(val) {
    const { changeContainerTypeCode } = this.props;
    changeContainerTypeCode(val);
  }

  render() {
    const {
      containerType = [],
      cosType = [],
      sourceInfo = {},
      unitQty,
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="来源条码" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('sourceLotCode', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '来源条码',
                    }),
                  },
                ],
              })(
                <Input
                  placeholder='请扫描条码'
                  suffix={<Icon type="enter" />}
                  onKeyDown={this.onEnterDownCode}
                  style={{ width: '100%' }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="条码数量" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('primaryUomQty', {
                initialValue: sourceInfo.primaryUomQty,
              })(
                <Input disabled />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="容器类型" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('containerTypeCode', {
                initialValue: sourceInfo.containerTypeCode,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '容器类型',
                    }),
                  },
                ],
              })(
                <Select
                  style={{ width: '100%' }}
                  allowClear
                  disabled={!sourceInfo.materialLotId}
                  onChange={this.changeContainerTypeCode}
                >
                  {containerType.map(item => {
                    return (
                      <Select.Option value={item.containerTypeCode} key={item.containerTypeCode}>
                        {item.containerTypeDescription}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="COS类型" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('cosType', {
                initialValue: sourceInfo.cosType,
              })(
                <Select
                  style={{ width: '100%' }}
                  disabled
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
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="Wafer" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('wafer', {
                initialValue: sourceInfo.waferNum,
              })(
                <Input disabled />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="录入批次" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('jobBatch', {
                initialValue: sourceInfo.workingLot ? moment(sourceInfo.workingLot, 'YYYY-MM-DD') : null,
              })(
                <DatePicker
                  format="YYYY-MM-DD"
                  style={{ width: '100%' }}
                  disabled
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="TYPE" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('type', {
                initialValue: sourceInfo.type,
              })(
                <Input disabled />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="备注" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('remark', {
                initialValue: sourceInfo.remark,
              })(
                <Input disabled />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="工单号" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workOrderNum', {
                initialValue: sourceInfo.workOrderNum,
              })(
                <Input disabled />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="LOTNO" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('lotNo', {
                initialValue: sourceInfo.lotNo,
              })(
                <Input disabled />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="Avg λ[nm]" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('averageWavelength', {
                initialValue: sourceInfo.avgWaveLength,
              })(
                <Input disabled />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="单元芯片数" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('unitQty', {
                initialValue: unitQty,
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
