/*
 * @Description: headform
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-01-21 15:48:22
 * @LastEditTime: 2021-01-26 17:37:22
 */
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

@connect(({ cosReturnFactoryRetest }) => ({
  cosReturnFactoryRetest,
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
    const { form, handleSourceLotCode } = this.props;
    const { getFieldValue } = form;
    if (e.keyCode === 13) {
      if (handleSourceLotCode) {
        handleSourceLotCode(getFieldValue('sourceMaterialLotCode'));
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
      tenantId,
      workcellInfo,
      handleFetchRemainingQty,
      remainingQty,
      cosTypeList,
      woWithCosType,
      handleChangeCosType,
      primaryUomQty,
      splitQty,
      fetchRemainingQtyLoading,
      handleSourceLotCodeLoading,
      form: { getFieldDecorator, getFieldValue, setFieldsValue },
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
                  code="HME.WO_JOB_SN"
                  queryParams={{
                    tenantId,
                    operationId: workcellInfo.operationId,
                    prodLineId: workcellInfo.prodLineId,
                  }}
                  onOk={val => handleFetchRemainingQty(val)}
                  onChange={(_value, record) => {
                    setFieldsValue({
                      materialId: record.materialId,
                    });
                  }
                  }
                />
              )}
            </Form.Item>
            <Form.Item style={{ display: 'none' }}>
              {getFieldDecorator('materialId', {
              })(
                <Input />
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
                <Input />
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
                  onChange={val => {
                    const { dispatch } = this.props;
                    if (getFieldValue('cosType')) {
                      dispatch({
                        type: 'cosReturnFactoryRetest/changeCosType',
                        payload: {
                          operationId: workcellInfo.operationId,
                          workOrderId: getFieldValue('workOrderId'),
                          containerTypeCode: val,
                          barNum: getFieldValue('barNum'),
                          cosType: getFieldValue('cosType'),
                        },
                      }).then(res=>{
                        if (!res) {
                          setFieldsValue({containerTypeCode: ''});
                        }
                      });
                    }
                  }}
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
            <Spin indicator={<Icon type="loading" style={{ fontSize: 14 }} spin />} spinning={fetchRemainingQtyLoading || false}>
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
                  initialValue: woWithCosType,
                })(
                  <Select
                    style={{ width: '100%' }}
                    disabled={!getFieldValue('containerTypeCode') || cosTypeList.length === 0}
                    onChange={val => handleChangeCosType(val)}
                  >
                    {cosTypeList.map(item => {
                      return (
                        <Select.Option value={item.value} key={item.value}>
                          {item.meaning}
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
            <Form.Item label="Avg λ[nm]" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('averageWavelength', {
              })(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="TYPE" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('type', {
              })(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="备注" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('remark', {
              })(
                <Input />
              )}
            </Form.Item>
          </Col>
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
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="LOTNO" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('lotNo', {
              })(
                <Input />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="来源条码" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('sourceMaterialLotCode', {
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
            <Spin indicator={<Icon type="loading" style={{ fontSize: 14 }} spin />} spinning={handleSourceLotCodeLoading || false}>
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
            <Spin indicator={<Icon type="loading" style={{ fontSize: 14 }} spin />} spinning={fetchRemainingQtyLoading || false}>
              <Form.Item label="剩余芯片数量" {...SEARCH_FORM_ITEM_LAYOUT}>
                {getFieldDecorator('remainingQty', {
                  initialValue: remainingQty,
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </Spin>
          </Col>
        </Row>
      </Form>
    );
  }
}
