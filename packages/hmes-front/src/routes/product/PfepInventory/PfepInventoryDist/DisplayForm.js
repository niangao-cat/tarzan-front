import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Switch, Select, InputNumber } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isUndefined, isNull } from 'lodash';

import {
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
const modelPrompt = 'tarzan.product.inv.model.inv';
/**
 * 表单数据展示
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ pfepInventory }) => ({
  pfepInventory,
}))
@Form.create({ fieldNameProp: null })
export default class DisplayForm extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      newSiteId: undefined,
    };
  }

  @Bind
  setMaterialName(val, record) {
    this.props.form.setFieldsValue({ materialName: record.materialName });
  }

  // 站点LOV选中事件
  @Bind
  setSiteId(_, record) {
    this.setState({
      newSiteId: record.siteId,
    });
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, kid, editFlag, pfepInventory } = this.props;
    let { displayList = {} } = pfepInventory;
    if (isNull(displayList)) {
      displayList = {};
    }
    const { identifyTypeList = [] } = pfepInventory;
    const {
      materialCode,
      locatorCode,
      packageSizeUomCode,
      packageHeight,
      packageWidth,
      packageLength,
      weightUomCode,
      packageWeight,
      minStockQty,
      maxStockQty,
      completionLocatorCode,
      issuedLocatorCode,
      stockLocatorCode,
      identifyId,
      identifyType,
      categoryCode,
      materialName,
      enableFlag,
      siteCode,
      prodLineCode,
      workcellCode,
      areaCode,
      weightUomId,
      materialId,
      materialCategoryId,
      siteId,
      areaId,
      prodLineId,
      workcellId,
      locatorId,
      stockLocatorId,
      issuedLocatorId,
      completionLocatorId,
      packageSizeUomId,
    } = displayList;
    const { newSiteId } = this.state;
    const { getFieldDecorator } = form;
    return (
      <React.Fragment>
        <Form>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.materialCode`).d('物料编码')}
              >
                {getFieldDecorator('materialId', {
                  initialValue: materialId,
                })(
                  <Lov
                    code="MT.MATERIAL"
                    queryParams={{ tenantId }}
                    textValue={materialCode}
                    onChange={this.setMaterialName}
                    disabled={kid !== 'create'}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.materialName`).d('物料描述')}
              >
                {getFieldDecorator('materialName', {
                  initialValue: materialName,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.categoryCode`).d('物料类别')}
              >
                {getFieldDecorator('materialCategoryId', {
                  initialValue: materialCategoryId,
                })(
                  <Lov
                    code="MT.MATERIAL_CATEGORY"
                    textValue={categoryCode}
                    queryParams={{ tenantId }}
                    disabled={kid !== 'create'}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.siteCodeP`).d('站点(生产)')}
              >
                {getFieldDecorator('siteId', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.siteCodeP`).d('站点(生产)'),
                      }),
                    },
                  ],
                  initialValue: siteId,
                })(
                  <Lov
                    code="MT.SITE"
                    textValue={siteCode}
                    queryParams={{ tenantId, siteType: 'MANUFACTURING' }}
                    disabled={kid !== 'create'}
                    onChange={this.setSiteId}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.areaCodeP`).d('区域(生产)')}
              >
                {getFieldDecorator('areaId', {
                  initialValue: areaId,
                })(
                  <Lov
                    code="MT.AREA"
                    textValue={areaCode}
                    queryParams={{ tenantId, siteId: isUndefined(newSiteId) ? siteId : newSiteId }}
                    disabled={kid !== 'create'}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.prodLineCodeP`).d('生产线')}
              >
                {getFieldDecorator('prodLineId', {
                  initialValue: prodLineId,
                })(
                  <Lov
                    code="MT.PRODLINE"
                    queryParams={{ tenantId, siteId: isUndefined(newSiteId) ? siteId : newSiteId }}
                    textValue={prodLineCode}
                    disabled={kid !== 'create'}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.workcellCode`).d('工作单元')}
              >
                {getFieldDecorator('workcellId', {
                  initialValue: workcellId,
                })(
                  <Lov
                    code="MT.WORKCELL"
                    queryParams={{ tenantId, siteId: isUndefined(newSiteId) ? siteId : newSiteId }}
                    textValue={workcellCode}
                    disabled={kid !== 'create'}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.locatorCode`).d('库位')}
              >
                {getFieldDecorator('locatorId', {
                  initialValue: locatorId,
                })(
                  <Lov
                    code="WMS.MATERIAL_LOCATOR"
                    queryParams={{
                      tenantId,
                      siteId: isUndefined(newSiteId) ? siteId : newSiteId,
                      enableFlag: 'Y',
                    }}
                    textValue={locatorCode}
                    disabled={kid !== 'create'}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.identifyType`).d('存储标识类型')}
              >
                {getFieldDecorator('identifyType', {
                  initialValue: identifyType,
                })(
                  <Select
                    style={{ width: '100%' }}
                    allowClear
                    disabled={kid !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                  >
                    {identifyTypeList instanceof Array &&
                      identifyTypeList.length !== 0 &&
                      identifyTypeList.map(item => {
                        return (
                          <Select.Option value={item.typeCode} key={item.typeCode}>
                            {item.description}
                          </Select.Option>
                        );
                      })}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.identifyId`).d('标识模板')}
              >
                {getFieldDecorator('identifyId', {
                  initialValue: identifyId,
                })(
                  <Input
                    disabled={kid !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.stockLocatorCode`).d('默认存储库位')}
              >
                {getFieldDecorator('stockLocatorId', {
                  initialValue: stockLocatorId,
                })(
                  <Lov
                    code="WMS.MATERIAL_DEFAULT_LOCATOR"
                    textValue={stockLocatorCode}
                    queryParams={{
                      tenantId,
                      siteId: isUndefined(newSiteId) ? siteId : newSiteId,
                      enableFlag: 'Y',
                      parentLocatorId: form.getFieldValue('locatorId'),
                    }}
                    disabled={kid !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.issuedLocatorCode`).d('默认发料库位')}
              >
                {getFieldDecorator('issuedLocatorId', {
                  initialValue: issuedLocatorId,
                })(
                  <Lov
                    code="MT.LOCATOR"
                    textValue={issuedLocatorCode}
                    queryParams={{
                      tenantId,
                      siteId: isUndefined(newSiteId) ? siteId : newSiteId,
                      enableFlag: 'Y',
                    }}
                    disabled={kid !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.completionLocatorCode`).d('默认完工库位')}
              >
                {getFieldDecorator('completionLocatorId', {
                  initialValue: completionLocatorId,
                })(
                  <Lov
                    code="MT.LOCATOR"
                    textValue={completionLocatorCode}
                    queryParams={{
                      tenantId,
                      siteId: isUndefined(newSiteId) ? siteId : newSiteId,
                      enableFlag: 'Y',
                    }}
                    disabled={kid !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.maxStockQty`).d('最大存储库存')}
              >
                {getFieldDecorator('maxStockQty', {
                  initialValue: maxStockQty,
                })(
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    disabled={kid !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.minStockQty`).d('最小存储库存')}
              >
                {getFieldDecorator('minStockQty', {
                  initialValue: minStockQty,
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    disabled={kid !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.packageWeight`).d('存储包装重量')}
              >
                {getFieldDecorator('packageWeight', {
                  initialValue: packageWeight,
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    disabled={kid !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.weightUomCode`).d('重量单位')}
              >
                {getFieldDecorator('weightUomId', {
                  initialValue: weightUomId,
                })(
                  <Lov
                    code="MT.UOM"
                    queryParams={{ tenantId, uomType: 'WEIGHT' }}
                    textValue={weightUomCode}
                    disabled={kid !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.packageLength`).d('存储包装长度值')}
              >
                {getFieldDecorator('packageLength', {
                  initialValue: packageLength,
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    disabled={kid !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.packageWidth`).d('存储包装宽度值')}
              >
                {getFieldDecorator('packageWidth', {
                  initialValue: packageWidth,
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    disabled={kid !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.packageHeight`).d('存储包装高度值')}
              >
                {getFieldDecorator('packageHeight', {
                  initialValue: packageHeight,
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    disabled={kid !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.packageSizeUomCode`).d('包装尺寸单位')}
              >
                {getFieldDecorator('packageSizeUomId', {
                  initialValue: packageSizeUomId,
                })(
                  <Lov
                    code="MT.UOM"
                    queryParams={{ tenantId, uomType: 'LENGTH' }}
                    textValue={packageSizeUomCode}
                    disabled={kid !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.enableFlag`).d('启用状态')}
              >
                {getFieldDecorator('enableFlag', {
                  initialValue: enableFlag !== 'N',
                })(
                  <Switch
                    disabled={kid !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
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
