/*
 * @Description: 新建领退料单
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-22 09:01:34
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-11-05 10:59:54
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Form, Input, Row, Col, Select } from 'hzero-ui';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import { isFunction } from 'lodash';
import { SEARCH_FORM_ROW_LAYOUT, FORM_COL_3_LAYOUT } from 'utils/constants';
import { getSiteId } from '@/utils/utils';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';

@Form.create({ fieldNameProp: null })
class DisplayForm extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      editFlag: false, // 报废部门是否可编辑
      // eslint-disable-next-line react/no-unused-state
      statusFlag: false, // 退料质量状态是否可编辑
    };
  }

  /**
   * 校验退料质量状态是否可编辑
   * @param value
   */
  @Bind()
  checkDocType(value) {
    const { docTypeMap } = this.props;
    const temp = docTypeMap.filter(item => item.value === value && item.tag === 'R');
    if (temp.length > 0) {
      // eslint-disable-next-line react/no-unused-state
      this.setState({ statusFlag: true });
    } else {
      // eslint-disable-next-line react/no-unused-state
      this.setState({ statusFlag: false });
    }
  }

  // 保存仓库ID
  @Bind()
  saveStorageId(_, record) {
    const { saveStorageId } = this.props;
    this.props.form.setFieldsValue({ toLocatorId: null });
    saveStorageId(record);
  }

  // 保存货位ID
  @Bind()
  saveLocatorId(_, record) {
    const { saveLocatorId } = this.props;
    saveLocatorId(record);
  }

  // 设置工厂ID
  @Bind()
  handleSiteIdChange(value) {
    const { handleSiteIdChange, form } = this.props;
    const { setFieldsValue } = form;
    handleSiteIdChange(value);
    setFieldsValue({
      costCenterId: null,
      costCenterType: null,
      internalOrderId: null,
      internalOrder: null,
      internalOrderType: null,
    });
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const modelPrompt = 'hwms.requisitionAndReturn.model.requisitionAndReturn';
    const {
      form,
      isNew,
      docTypeMap,
      siteMap,
      tenantId,
      returnList,
      accountsType,
      headAndLine,
      instructionDocId,
      orderTypes,
      freeTypeOne,
      freeTypeTwo,
      costcenterType,
    } = this.props;
    const { headVO = {} } = headAndLine;
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.docNum`).d('单据号')}
              {...DRAWER_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('instructionDocNum', {
                initialValue: returnList.instructionDocNum || headVO.instructionDocNum,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.siteId`).d('工厂')}
            >
              {getFieldDecorator('siteId', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.siteId`).d('工厂'),
                    }),
                  },
                ],
                initialValue: getSiteId() || headVO.siteId,
              })(
                <Select allowClear disabled={!!instructionDocId} onChange={this.handleSiteIdChange}>
                  {siteMap.map(item => (
                    <Select.Option key={item.siteId} value={item.siteId}>
                      {item.siteCode}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.instructionDocType`).d('单据类型')}
            >
              {getFieldDecorator('instructionDocType', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.instructionDocType`).d('单据类型'),
                    }),
                  },
                ],
                initialValue: headVO.instructionDocType,
              })(
                <Select
                  onChange={()=>{this.props.form.setFieldsValue({'costType': ''});}}
                  allowClear
                  disabled={!!instructionDocId}
                >
                  {docTypeMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.settleAccounts`).d('结算类型')}
            >
              {getFieldDecorator('settleAccounts', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.settleAccounts`).d('结算类型'),
                    }),
                  },
                ],
                initialValue: headVO.settleAccounts,
              })(
                <Select
                  allowClear
                  disabled={!!instructionDocId}
                  onChange={() => {
                    setFieldsValue({
                      costCenterId: null,
                      costCenterType: null,
                      internalOrderId: null,
                      internalOrder: null,
                      internalOrderType: null,
                      costType: null,
                    });
                  }}
                >
                  {accountsType.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.costCenter`).d('成本中心')}
            >
              {getFieldDecorator('costCenterId', {
                rules: [
                  {
                    required: getFieldValue('settleAccounts') === 'COST_CENTER',
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.costCenter`).d('成本中心'),
                    }),
                  },
                ],
                initialValue: headVO.costCenterId,
              })(<Lov
                code="WMS.COST_CENTER"
                disabled={!!instructionDocId || getFieldValue('settleAccounts') !== 'COST_CENTER'}
                queryParams={{
                  tenantId,
                  enableFlag: 'Y',
                  siteId: getFieldValue('siteId'),
                }}
                textValue={headVO.costcenterCode}
                onChange={(_value, records) => {
                  setFieldsValue({
                    moveType: records.moveType,
                    costCenterType: records.costCenterType,
                  });
                }}
              />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.internalOrderId`).d('内部订单')}
            >
              {getFieldDecorator('internalOrderId', {
                rules: [
                  {
                    required: getFieldValue('settleAccounts') === 'INTERNAL_ORDER',
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.internalOrderId`).d('内部订单'),
                    }),
                  },
                ],
                initialValue: headVO.internalOrderId,
              })(<Lov
                code="WMS.INTERNAL_ORDER"
                disabled={!!instructionDocId || getFieldValue('settleAccounts') !== 'INTERNAL_ORDER'}
                queryParams={{
                  tenantId,
                  enableFlag: 'Y',
                  siteId: getFieldValue('siteId'),
                }}
                textValue={headVO.internalOrder}
                onChange={(_value, records) => {
                  setFieldsValue({
                    moveType: records.moveType,
                    internalOrderType: records.internalOrderType,
                    costType: null,
                  });
                }}
              />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label='费用类型'
            >
              {getFieldDecorator('costType', {
                rules: [
                  {
                    // required: getFieldValue('internalOrderType')==='ZY01',
                    required: ['ZY01', 'WY01'].includes(getFieldValue('internalOrderType')),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.costType`).d('费用类型'),
                    }),
                  },
                ],
                initialValue: headVO.costType,
              })(
                <Select
                  allowClear
                  disabled={!!instructionDocId||!['ZY01', 'WY01'].includes(getFieldValue('internalOrderType'))}
                  onChange={() => {
                    setFieldsValue({
                      costCenterId: null,
                      internalOrder: null,
                    });
                  }}
                >
                  {getFieldValue('instructionDocType')==='CCA_REQUISITION'&&freeTypeOne.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                  {getFieldValue('instructionDocType')==='CCA_RETURN'&&freeTypeTwo.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.costCenterType`).d('成本中心类型')}
              {...DRAWER_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('costCenterType', {
                initialValue: headVO.costCenterType,
              })(
                <Select allowClear disabled>
                  {costcenterType.map(e => (
                    <Select.Option key={e.value} value={e.value}>
                      {e.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.internalOrderType`).d('内部订单类型')}
              {...DRAWER_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('internalOrderType', {
                initialValue: headVO.internalOrderType,
              })(
                <Select allowClear disabled>
                  {orderTypes.map(e => (
                    <Select.Option key={e.value} value={e.value}>
                      {e.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.scrapDepartment`).d('报废部门')}
              {...DRAWER_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('scrapDepartment', {
                initialValue: headVO.scrapDepartment,
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.profitCenter`).d('利润中心')}
            >
              {getFieldDecorator('profitCenter', {
              })(
                <Input disabled={!isNew} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.moveReason`).d('移动原因')}
            >
              {getFieldDecorator('moveReason', {
                initialValue: headVO.moveReason,
              })(<Input disabled={!isNew} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.toStorageId`).d('仓库')}
            >
              {getFieldDecorator('toStorageId', {
              })(
                <Lov
                  code="WMS.WAREHOUSE"
                  queryParams={{
                    tenantId,
                    siteId: getFieldValue('siteId') || getSiteId(),
                  }}
                  onChange={this.saveStorageId}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.toLocatorId`).d('货位')}
            >
              {getFieldDecorator('toLocatorId', {})(
                <Lov
                  code="WMS.LOCATOR"
                  queryParams={{
                    tenantId,
                    parentLocatorId: this.props.form.getFieldValue('toStorageId'),
                  }}
                  disabled={!this.props.form.getFieldValue('toStorageId')}
                  onChange={this.saveLocatorId}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.remark`).d('备注')}
            >
              {getFieldDecorator('remark', {
                initialValue: headVO.remark,
              })(<Input disabled={!isNew} />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default DisplayForm;
