/**
 * UserGroupManagement 复制抽屉
 * @date: 2019-8-20
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Row, Col, Divider } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isUndefined, isNull } from 'lodash';
import formatterCollections from 'utils/intl/formatterCollections';
import {
  FORM_COL_2_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';

import Lov from 'components/Lov';

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
const modelPrompt = 'tarzan.product.produce.model.produce';

@connect(({ loading }) => ({
  checkLoading: loading.effects['produce/checkProduceItem'],
}))
@formatterCollections({ code: 'tarzan.product.produce' })
@Form.create({ fieldNameProp: null })
export default class CopyDrawer extends React.PureComponent {
  state = {
    newSiteId: undefined,
  };

  @Bind()
  handleOK() {
    const { initData, form, onOk = e => e } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        const {
          areaId,
          prodLineId,
          workcellId,
          // locatorId,
          targetSiteId,
          targetMaterialId,
          targetMaterialCategoryId,
        } = fieldsValue;
        const {
          materialCategoryId,
          materialId,
          organizationType,
          organizationId,
          siteId,
        } = initData;
        let count = 0;
        let targetOrgType = '';
        if (!isUndefined(areaId) && !isNull(areaId)) {
          count++;
          targetOrgType = 'AREA';
        }
        if (!isUndefined(prodLineId) && !isNull(prodLineId)) {
          count++;
          // targetOrgType = 'PROD_LINE';
          targetOrgType = 'PRODUCTIONLINE';
        }
        if (!isUndefined(workcellId) && !isNull(workcellId)) {
          count++;
          targetOrgType = 'WORKCELL';
        }
        const targetOrgId = workcellId || prodLineId || areaId || '';
        if (count > 1) {
          Modal.warning({
            title: intl
              .get('tarzan.product.produce.message.onlyOne')
              .d('区域,生产线,工作单元只能维护一项'),
          });
          return null;
        } else if (!targetMaterialId && !targetMaterialCategoryId) {
          Modal.warning({
            title: intl
              .get('tarzan.product.produce.message.necessaryOne')
              .d('目标物料,目标类别必须选择维护一项'),
          });
          return null;
        } else if (
          targetMaterialId === initData.materialId &&
          targetMaterialCategoryId === initData.materialCategoryId &&
          targetOrgId === initData.organizationId &&
          targetOrgType === initData.organizationType
        ) {
          Modal.warning({
            title: intl
              .get('tarzan.product.produce.message.same')
              .d('复制来源和复制目标不允许完全相同'),
          });
          return null;
        }
        onOk({
          sourceSiteId: siteId,
          sourceMaterialId: materialId,
          sourceMaterialCategoryId: materialCategoryId,
          sourceOrgId: organizationId,
          sourceOrgType: organizationType,
          targetSiteId,
          targetOrgType,
          targetOrgId,
          targetMaterialId,
          targetMaterialCategoryId,
        });
      }
    });
  }

  // 站点LOV选中事件
  @Bind
  setSiteId(_, record) {
    this.setState({
      newSiteId: record.siteId,
    });
  }

  render() {
    const { form, initData, visible, onCancel, checkLoading } = this.props;
    const {
      materialCode,
      categoryCode,
      // locatorCode,
      siteCode,
      areaCode,
      prodLineCode,
      workcellCode,
      materialId,
      materialCategoryId,
      siteId,
      // locatorId,
      areaId,
      prodLineId,
      workcellId,
    } = initData;
    const { getFieldDecorator } = form;
    const { newSiteId } = this.state;
    return (
      <Modal
        destroyOnClose
        width={720}
        title={intl.get('tarzan.product.produce.title.copy').d('复制')}
        visible={visible}
        onCancel={onCancel}
        confirmLoading={checkLoading}
        onOk={this.handleOK}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Form>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.sourceMaterial`).d('来源物料')}
              >
                {getFieldDecorator('sourceMaterialId', {
                  initialValue: materialCode,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.sourceMaterialCategory`).d('来源类别')}
              >
                {getFieldDecorator('sourceMaterialCategoryId', {
                  initialValue: categoryCode,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.siteCode`).d('站点(生产)')}
              >
                {getFieldDecorator('sourceSiteId', {
                  initialValue: siteCode,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.areaCode`).d('区域(生产)')}
              >
                {getFieldDecorator('sourceAreaId', {
                  initialValue: areaCode,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.prodLineName`).d('生产线')}
              >
                {getFieldDecorator('sourceProdLineId', {
                  initialValue: prodLineCode,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.workcellName`).d('工作单元')}
              >
                {getFieldDecorator('sourceWorkcellId', {
                  initialValue: workcellCode,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Divider style={{ margin: '12px' }} />
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.targetMaterial`).d('目标物料')}
              >
                {getFieldDecorator('targetMaterialId', {
                  initialValue: materialId,
                })(
                  <Lov
                    code="MT.MATERIAL"
                    queryParams={{ tenantId }}
                    textValue={materialCode}
                    disabled={materialCategoryId}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.targetMaterialCategory`).d('目标类别')}
              >
                {getFieldDecorator('targetMaterialCategoryId', {
                  initialValue: materialCategoryId,
                })(
                  <Lov
                    code="MT.MATERIAL_CATEGORY"
                    queryParams={{ tenantId }}
                    textValue={categoryCode}
                    disabled={materialId}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.siteCode`).d('站点(生产)')}
              >
                {getFieldDecorator('targetSiteId', {
                  initialValue: siteId,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.siteCode`).d('站点(生产)'),
                      }),
                    },
                  ],
                })(
                  <Lov
                    code="MT.SITE"
                    onChange={this.setSiteId}
                    queryParams={{ tenantId, siteType: 'MANUFACTURING' }}
                    textValue={siteCode}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.areaCode`).d('区域(生产)')}
              >
                {getFieldDecorator('areaId', {
                  initialValue: areaId,
                })(
                  <Lov
                    code="MT.AREA"
                    queryParams={{ tenantId, siteId: isUndefined(newSiteId) ? siteId : newSiteId }}
                    textValue={areaCode}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.prodLineName`).d('生产线')}
              >
                {getFieldDecorator('prodLineId', {
                  initialValue: prodLineId,
                })(
                  <Lov
                    code="MT.PRODLINE"
                    queryParams={{ tenantId, siteId: isUndefined(newSiteId) ? siteId : newSiteId }}
                    textValue={prodLineCode}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.workcellName`).d('工作单元')}
              >
                {getFieldDecorator('workcellId', {
                  initialValue: workcellId,
                })(
                  <Lov
                    code="MT.WORKCELL"
                    queryParams={{ tenantId, siteId: isUndefined(newSiteId) ? siteId : newSiteId }}
                    textValue={workcellCode}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
