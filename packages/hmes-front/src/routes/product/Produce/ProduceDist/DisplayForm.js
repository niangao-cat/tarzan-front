import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Switch, Select, InputNumber } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isUndefined, isNull } from 'lodash';
import formatterCollections from 'utils/intl/formatterCollections';
import {
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
const modelPrompt = 'tarzan.product.produce.model.produce';
const { Option } = Select;
/**
 * 表单数据展示
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ produce }) => ({
  produce,
}))
@formatterCollections({ code: 'tarzan.product.produce' })
@Form.create({ fieldNameProp: null })
export default class DisplayForm extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  state = {
    newSiteId: undefined,
    options: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'produce/fetchSelectOption',
      payload: {
        module: 'MATERIAL',
        typeGroup: 'CONTROL_TYPE',
      },
    }).then(res => {
      if (res && res.success) {
        this.setState({
          options: [...res.rows],
        });
      }
    });
  }

  @Bind
  setMaterialName(val, record) {
    // const {
    //   dispatch,
    //   produce: { produceItem = {} },
    // } = this.props;
    // produceItem.originMaterialName = record.materialName;
    // dispatch({
    //   type: 'produce/updateState',
    // });
    this.props.form.setFieldsValue({ materialName: record.materialName });
    this.props.form.resetFields(['materialCategoryId']);
  }

  @Bind
  resetFieldsMaterialId = () => {
    this.props.form.resetFields(['materialId']);
  };

  // 站点LOV选中事件
  @Bind
  setSiteId(_, record) {
    this.setState({
      newSiteId: record.siteId,
    });
    this.props.form.resetFields(['defaultRoutingId']);
  }

  @Bind
  changeReversion(type, _, record) {
    this.props.form.setFieldsValue({
      [type]: record.revision,
    });
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, kid, editFlag, produce } = this.props;
    let { produceItem = {} } = produce;
    if (isNull(produceItem)) {
      produceItem = {};
    }
    // const { identifyTypeList = [] } = produce;
    const {
      materialCode,
      materialId,
      materialName,
      categoryCode,
      materialCategoryId,
      siteId,
      siteCode,
      areaId,
      areaCode,
      prodLineId,
      prodLineCode,
      workcellCode,
      workcellId,
      defaultBomId,
      bomCode,
      bomVersion,
      routerName,
      defaultRoutingId,
      issueControlQty,
      issueControlType,
      completeControlType,
      completeControlQty,
      attritionControlType,
      attritionControlQty,
      operationAssembleFlag,
      enableFlag,
      routerVersion,
      // issuedLocatorId,
      // completionLocatorId,
      // packageSizeUomId,
    } = produceItem;
    const { newSiteId, options } = this.state;
    const { getFieldDecorator, getFieldValue } = form;
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
                  rules: [
                    {
                      required: !(materialCategoryId || getFieldValue('materialCategoryId')),
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
                      }),
                    },
                  ],
                })(
                  <Lov
                    code="MT.MATERIAL"
                    queryParams={{ tenantId }}
                    textValue={materialCode}
                    onChange={this.setMaterialName}
                    disabled={kid !== 'create' || getFieldValue('materialCategoryId')}
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
                  rules: [
                    {
                      required: !(materialId || getFieldValue('materialId')),
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.categoryCode`).d('物料类别'),
                      }),
                    },
                  ],
                })(
                  <Lov
                    code="MT.MATERIAL_CATEGORY"
                    textValue={categoryCode}
                    queryParams={{ tenantId }}
                    onChange={this.resetFieldsMaterialId}
                    disabled={kid !== 'create' || getFieldValue('materialId')}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.siteCode`).d('站点(生产)')}
              >
                {getFieldDecorator('siteId', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.siteCode`).d('站点(生产)'),
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
                label={intl.get(`${modelPrompt}.areaCode`).d('区域(生产)')}
              >
                {getFieldDecorator('areaId', {
                  initialValue: areaId,
                })(
                  <Lov
                    code="MT.AREA"
                    textValue={areaCode}
                    queryParams={{ tenantId, siteId: isUndefined(newSiteId) ? siteId : newSiteId }}
                    disabled={
                      kid !== 'create' || getFieldValue('workcellId') || getFieldValue('prodLineId')
                      // (kid !== 'create' && editFlag) ||
                      // (getFieldValue('workcellId') || getFieldValue('prodLineId'))
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
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
                    disabled={
                      kid !== 'create' || getFieldValue('areaId') || getFieldValue('workcellId')
                      // (kid !== 'create' && editFlag) ||
                      // (getFieldValue('areaId') || getFieldValue('workcellId'))
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
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
                    disabled={
                      kid !== 'create' || getFieldValue('areaId') || getFieldValue('prodLineId')
                      // (kid !== 'create' && editFlag) ||
                      // (getFieldValue('areaId') || getFieldValue('prodLineId'))
                    }
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.defaultBomName`).d('默认装配清单')}
              >
                {getFieldDecorator('defaultBomId', {
                  initialValue: defaultBomId,
                })(
                  <Lov
                    code="MT.BOM_BASIC"
                    queryParams={{
                      tenantId,
                      bomType: 'MATERIAL',
                    }}
                    textValue={bomCode}
                    onChange={this.changeReversion.bind(this, 'Bomversion')}
                    disabled={kid !== 'create' && editFlag}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.vision`).d('版本')}
              >
                {getFieldDecorator('Bomversion', {
                  initialValue: bomVersion,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.defaultRoutingName`).d('默认工艺路线')}
              >
                {getFieldDecorator('defaultRoutingId', {
                  initialValue: defaultRoutingId,
                })(
                  <Lov
                    code="MT.ROUTER"
                    textValue={routerName}
                    queryParams={{
                      tenantId,
                      siteId: getFieldValue('siteId'),
                      routerType: 'MATERIAL',
                      // enableFlag: 'Y',
                    }}
                    onChange={this.changeReversion.bind(this, 'defaultRoutingversion')}
                    disabled={kid !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.vision`).d('版本')}
              >
                {getFieldDecorator('defaultRoutingversion', {
                  initialValue: routerVersion,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.issueControlType`).d('投料限制类型')}
              >
                {getFieldDecorator('issueControlType', {
                  initialValue: issueControlType,
                })(
                  <Select
                    style={{ width: '100%' }}
                    disabled={kid !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                  >
                    {options.map(ele => (
                      <Option value={ele.typeCode}>{ele.description}</Option>
                    ))}
                    {/* <Option value="percent">百分比</Option>
                    <Option value="fix">固定值</Option> */}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.issueControlQty`).d('投料限制值')}
              >
                {getFieldDecorator('issueControlQty', {
                  initialValue: issueControlQty,
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    precision={6}
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
                label={intl.get(`${modelPrompt}.completeControlType`).d('完工限制类型')}
              >
                {getFieldDecorator('completeControlType', {
                  initialValue: completeControlType,
                })(
                  <Select
                    style={{ width: '100%' }}
                    disabled={kid !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                  >
                    {options.map(ele => (
                      <Option value={ele.typeCode}>{ele.description}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.completeControlQty`).d('完工限制值')}
              >
                {getFieldDecorator('completeControlQty', {
                  initialValue: completeControlQty,
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    precision={6}
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
                label={intl.get(`${modelPrompt}.attritionControlType`).d('损耗限制类型')}
              >
                {getFieldDecorator('attritionControlType', {
                  initialValue: attritionControlType,
                })(
                  <Select
                    style={{ width: '100%' }}
                    disabled={kid !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                  >
                    {options.map(ele => (
                      <Option value={ele.typeCode}>{ele.description}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.attritionControlQty`).d('损耗限制值')}
              >
                {getFieldDecorator('attritionControlQty', {
                  initialValue: attritionControlQty,
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    precision={6}
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
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.operationAssembleFlag`).d('按工序装配')}
              >
                {getFieldDecorator('operationAssembleFlag', {
                  initialValue: operationAssembleFlag !== 'N',
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
