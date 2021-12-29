import React, { Component } from 'react';
import { Form, Input, Select, Row, Col, DatePicker, Icon, Spin } from 'hzero-ui';
import intl from 'utils/intl';
import {
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  FORM_COL_4_LAYOUT,
} from 'utils/constants';
import { connect } from 'dva';
import moment from 'moment';
import Lov from 'components/Lov';
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
    const { form, cosScrapScanMaterialLot } = this.props;
    const { getFieldValue } = form;
    if (e.keyCode === 13) {
      if (cosScrapScanMaterialLot) {
        cosScrapScanMaterialLot(getFieldValue('sourceLotCode'));
      }
    }
  }

  @Bind()
  handleSearchCosTypeList(val) {
    const { handleSearchCosTypeList } = this.props;
    handleSearchCosTypeList(val);
  }

  render() {
    const {
      containerType = [],
      cosTypeList = [],
      primaryUomQty,
      splitQty,
      surplusCosNum,
      tenantId,
      workcellInfo,
      lotList = [],
      handleSearchSurplusCosNum,
      handleSearchCosTypeListLoading,
      cosScrapScanMaterialLotLoading,
      handleSearchSurplusCosNumLoading,
      form: { getFieldDecorator, getFieldValue, setFieldsValue },
      editFlag,
    } = this.props;
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
                      name: '容器类型',
                    }),
                  },
                ],
              })(
                <Lov
                  code="HME.RETURN_WORK_ORDER"
                  queryParams={{
                    tenantId,
                    proLineId: workcellInfo.prodLineId,
                  }}
                  onChange={(_value, record) => {
                    handleSearchSurplusCosNum(record);
                    setFieldsValue({
                      materialId: record.materialId,
                    });
                  }
                  }
                  disabled={!editFlag}
                />
              )}
            </Form.Item>
            <Form.Item style={{ display: 'none' }}>
              {getFieldDecorator('materialId', {
              })(
                <Input disabled={!editFlag} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="Wafer" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('wafer', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: 'Wafer',
                    }),
                  },
                ],
              })(
                <Input disabled={!editFlag} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="容器类型" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('containerTypeCode', {
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
                  onChange={this.handleSearchCosTypeList}
                  disabled={!editFlag}
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
            <Spin indicator={<Icon type="loading" style={{ fontSize: 14 }} spin />} spinning={handleSearchCosTypeListLoading || false}>
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
                })(
                  <Select
                    style={{ width: '100%' }}
                    disabled={!getFieldValue('containerTypeCode') || cosTypeList.length === 0 || !editFlag}
                  >
                    {cosTypeList.map(item => {
                      return (
                        <Select.Option value={item.cosType} key={item.cosType}>
                          {item.cosTypeName}
                        </Select.Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Spin>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="LOTNO" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('lotNo', {
              })(
                <Input disabled={!editFlag} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="Avg λ[nm]" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('averageWavelength', {
              })(
                <Input disabled={!editFlag} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="TYPE" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('type', {
              })(
                <Input disabled={!editFlag} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="备注" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('remark', {
              })(
                <Input disabled={!editFlag} />
              )}
            </Form.Item>
          </Col>
        </Row>
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
                  disabled={!editFlag}
                  placeholder='请扫描条码'
                  suffix={<Icon type="enter" />}
                  onKeyDown={this.onEnterDownCode}
                  style={{ width: '100%' }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Spin indicator={<Icon type="loading" style={{ fontSize: 14 }} spin />} spinning={cosScrapScanMaterialLotLoading || false}>
              <Form.Item label="条码数量" {...SEARCH_FORM_ITEM_LAYOUT}>
                {getFieldDecorator('primaryUomQty', {
                  initialValue: primaryUomQty,
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </Spin>
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
            <Spin indicator={<Icon type="loading" style={{ fontSize: 14 }} spin />} spinning={handleSearchSurplusCosNumLoading || false}>
              <Form.Item label="剩余COS数量" {...SEARCH_FORM_ITEM_LAYOUT}>
                {getFieldDecorator('remainingQty', {
                  initialValue: surplusCosNum,
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </Spin>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="录入批次" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('jobBatch', {
                initialValue: moment(moment().format('YYYY-MM-DD')),
              })(
                <DatePicker
                  format="YYYY-MM-DD"
                  style={{ width: '100%' }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="热沉类型" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('hotSinkType', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '热沉类型',
                    }),
                  },
                ],
              })(
                <Input maxLength={1} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="热沉供应商批次" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('hotSinkSupplierLot', {
              })(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="金线供应商批次" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('goldSupplierLot', {
              })(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="批次" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('lot', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '批次',
                    }),
                  },
                ],
              })(
                <Select
                  style={{ width: '100%' }}
                  allowClear
                  disabled={!editFlag}
                >
                  {lotList.map(item => {
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
      </Form>
    );
  }
}
