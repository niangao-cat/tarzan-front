import React from 'react';
import { Form, Col, Row, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import Lov from 'components/Lov';

const modelPromt = 'tarzan.hmes.purchaseOrder';

@Form.create({ fieldNameProp: null })
export default class BaseInfo extends React.Component {

  @Bind()
  handleScanBarcode(e) {
    const { onScanBarcode } = this.props;
    if(e.target.value) {
      onScanBarcode(e.target.value.trim());
    }
  }


  // 渲染
  render() {
    // 获取整个表单
    const { form, tenantId, onFetchWorkOrderInfo, baseInfo } = this.props;

    // 获取表单的字段属性
    const { getFieldDecorator } = form;

    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.exceptionType`).d('工单')}
            >
              {getFieldDecorator('workOrderId', {
                 rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '工单',
                    }),
                  },
                ],
              })(
                <Lov
                  code="HME.WORK_ORDER_NUM"
                  queryParams={{ tenantId }}
                  onChange={(val, data) => {
                    onFetchWorkOrderInfo(data);
                  }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label='站点'
            >
              {getFieldDecorator('siteName', {
                  initialValue: baseInfo.siteName,
                })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label='工单号'
            >
              {getFieldDecorator('workOrderNum', {
                  initialValue: baseInfo.workOrderNum,
                })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label='工单类型'
            >
              {getFieldDecorator('woType', {
                  initialValue: baseInfo.woType,
                })(<Input disabled />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label='工单状态'
            >
              {getFieldDecorator('woStatus', {
                  initialValue: baseInfo.woStatus,
                })(
                  <Input disabled />
                )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label='物料编码'
            >
              {getFieldDecorator('materialCode', {
                  initialValue: baseInfo.materialCode,
                })(
                  <Input disabled />
                )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label='物料描述'
            >
              {getFieldDecorator('materialName', {
                  initialValue: baseInfo.materialName,
                })(<Input disabled />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label='工单数量'
            >
              {getFieldDecorator('qty', {
                  initialValue: baseInfo.qty,
                })(
                  <Input disabled />
                )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label='单位编码'
            >
              {getFieldDecorator('uomCode', {
                  initialValue: baseInfo.uomCode,
                })(
                  <Input disabled />
                )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label='生产线编码'
            >
              {getFieldDecorator('prodLineCode', {
                  initialValue: baseInfo.prodLineCode,
                })(<Input disabled />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label='装配清单编码'
            >
              {getFieldDecorator('bomName', {
                  initialValue: baseInfo.bomName,
                })(
                  <Input disabled />
                )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label='工艺路线编码'
            >
              {getFieldDecorator('routerName', {
                  initialValue: baseInfo.routerName,
                })(
                  <Input disabled />
                )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label='完工库位'
            >
              {getFieldDecorator('locatorCode', {
                initialValue: baseInfo.locatorCode,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
