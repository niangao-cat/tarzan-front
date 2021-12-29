/*
 * @Description: 数据采集扩展属性
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-21 09:13:32
 * @LastEditTime: 2020-07-22 15:07:53
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Input } from 'hzero-ui';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
const modelPrompt = 'tarzan.acquisition.dataItem.model.dataItem';
/**
 * 表单数据展示
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ dataItem }) => ({
  dataItem,
}))
@formatterCollections({ code: 'tarzan.acquisition.dataItem' })
@Form.create({ fieldNameProp: null })
export default class DataCollection extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }


  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, editFlag, dataCollection } = this.props;
    const { getFieldDecorator, getFieldValue, resetFields } = form;
    return (
      <React.Fragment>
        <Form>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.equipmentCategory`).d('设备类别')}
              >
                {getFieldDecorator('equipmentCategory', {
                  initialValue: dataCollection.equipmentCategory,
                  rules: [
                    {
                      required: false,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.equipmentCategory`).d('设备类别'),
                      }),
                    },
                  ],
                })(
                  <Lov
                    queryParams={{
                      tenantId,
                    }}
                    disabled={editFlag}
                    allowClear
                    code="HME.EQUIPMENT_CATEGORY"
                    textValue={dataCollection.equipmentCategory}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.valueField`).d('取值字段')}
              >
                {getFieldDecorator('valueField', {
                  initialValue: dataCollection.valueField,
                  rules: [
                    {
                      required: false,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.valueField`).d('取值字段'),
                      }),
                    },
                  ],
                })(
                  <Lov
                    queryParams={{
                      tenantId,
                      equipmentCategory: getFieldValue('equipmentCategory'),
                    }}
                    disabled={editFlag}
                    allowClear
                    code="HME.DATA_ACQUISITION_FIELD"
                    textValue={dataCollection.valueFieldMeaning}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.limitCond1`).d('限制条件1')}
              >
                {getFieldDecorator('limitCond1', {
                  initialValue: dataCollection.limitCond1,
                })(
                  <Lov
                    queryParams={{
                      tenantId,
                      equipmentCategory: getFieldValue('equipmentCategory'),
                    }}
                    disabled={editFlag}
                    allowClear
                    code="HME.DATA_ACQUISITION_FIELD"
                    onChange={(value, item) => {
                      if (item.value === getFieldValue('limitCond2') || item.value === getFieldValue('valueField')) {
                        notification.error({
                          message: '当前限制值存在相同值',
                        });
                      }
                    }}
                    textValue={dataCollection.limitCond1Meaning}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.cond1Value`).d('条件1限制值')}
              >
                {getFieldDecorator('cond1Value', {
                  initialValue: dataCollection.cond1Value,
                  rules: [
                    {
                      required: getFieldValue('limitCond1'),
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.valueField`).d('条件1限制值'),
                      }),
                    },
                  ],
                })(
                  <Input
                    disabled={editFlag}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.limitCond2`).d('限制条件2')}
              >
                {getFieldDecorator('limitCond2', {
                  initialValue: dataCollection.limitCond2,
                })(
                  <Lov
                    queryParams={{
                      tenantId,
                      equipmentCategory: getFieldValue('equipmentCategory'),
                    }}
                    disabled={editFlag}
                    allowClear
                    code="HME.DATA_ACQUISITION_FIELD"
                    onChange={(value, item) => {
                      if (item.value === getFieldValue('limitCond1') || item.value === getFieldValue('valueField')) {
                        notification.error({
                          message: '当前限制值存在相同值',
                        });
                        resetFields(['limitCond2']);
                      }
                    }}
                    textValue={dataCollection.limitCond2Meaning}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.cond2Value`).d('条件2限制值')}
              >
                {getFieldDecorator('cond2Value', {
                  initialValue: dataCollection.cond2Value,
                  rules: [
                    {
                      required: getFieldValue('limitCond2'),
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.valueField`).d('条件1限制值'),
                      }),
                    },
                  ],
                })(
                  <Input
                    disabled={editFlag}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}
