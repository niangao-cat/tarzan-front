import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';
import { isEqual } from 'lodash';

import { getSiteId } from '../../../../utils/utils';

import {
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '../../../../utils/constants';

const tenantId = getCurrentOrganizationId();
const modelPrompt = 'tarzan.product.collection.model.collection';
/**
 * 表单数据展示
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ collection }) => ({
  collection,
}))
@formatterCollections({ code: 'tarzan.product.collection' })
@Form.create({ fieldNameProp: null })
export default class ConnectTab extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  state = {
    mtTagGroupObjectDTO: {},
  };

  componentDidMount() {
    const {
      collection: { mtTagGroupObjectDTO },
    } = this.props;
    this.setState({
      mtTagGroupObjectDTO,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      !isEqual(nextProps.collection.mtTagGroupObjectDTO, this.props.collection.mtTagGroupObjectDTO)
    ) {
      this.setState({
        mtTagGroupObjectDTO: nextProps.collection.mtTagGroupObjectDTO,
      });
    }
  }

  @Bind
  setDescription = (type, formType, _, record) => {
    const { mtTagGroupObjectDTO } = this.state;
    if (type === 'routerDesc') {
      this.props.form.setFieldsValue({
        routerStepId: '',
        routerStepName: '',
        routerStepDesc: '',
        routerDesc: record.description,
      });
      mtTagGroupObjectDTO.routerStepName = '';
      mtTagGroupObjectDTO.routerStepDesc = '';
    } else if (type === 'bomDesc') {
      this.props.form.setFieldsValue({
        bomComponentId: '',
        bomComponentMaterialCode: '',
        bomComponentMaterialName: '',
        bomDesc: record.description,
      });
    } else if (type === 'routerStepDesc') {
      this.props.form.setFieldsValue({
        routerStepId: record.routerStepId,
        routerStepName: record.stepName,
        routerStepDesc: record.description,
      });
    } else if (type === 'bomComponentMaterialName') {
      this.props.form.setFieldsValue({
        bomComponentId: record.bomComponentId,
        bomComponentMaterialCode: record.bomComponentMaterialCode,
        bomComponentMaterialName: record.bomComponentMaterialDesc,
      });
    } else if (type === 'workcellName') {
      this.props.form.setFieldsValue({
        workcellName: record.workcellName,
      });
    } else if (type === 'operationDesc') {
      this.props.form.setFieldsValue({
        operationDesc: record.description,
      });
    } else {
      this.props.form.setFieldsValue({
        [type]: record[formType],
      });
    }
    // 判断 值是否为空
    if(record.materialId===undefined){
      this.props.form.setFieldsValue({
        productionVersion: "",
        description: "",
      });
    }
    this.setState({
      mtTagGroupObjectDTO,
    });
  };

  @Bind
  setProductionVersion(record){
    this.props.form.setFieldsValue({
      productionVersion: record.productionVersion,
      description: record.description,
    });
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, canEdit } = this.props;
    // const { mtTagGroupObjectDTO = {} } = collection;
    const { mtTagGroupObjectDTO } = this.state;
    // const { identifyTypeList = [] } = collection;
    const {
      materialCode,
      materialId,
      materialName,
      itemType,
      productionVersion,
      description,
      operationName,
      operationDesc,
      routerName,
      routerId,
      routerDesc,
      routerStepDesc,
      routerStepId,
      routerStepName,
      workcellCode,
      workcellName,
      workcellId,
      ncCode,
      ncCodeDesc,
      ncCodeId,
      bomDesc,
      bomId,
      bomName,
      bomComponentId,
      bomComponentMaterialCode,
      bomComponentMaterialName,
      eoId,
      eoNum,
      workOrderId,
      workOrderNum,
      operationId,
    } = mtTagGroupObjectDTO;
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
                })(
                  <Lov
                    code="MT.MATERIAL"
                    queryParams={{ tenantId }}
                    textValue={materialCode}
                    onChange={this.setDescription.bind(this, 'materialName', 'materialName')}
                    disabled={!canEdit||(this.props.form.getFieldValue('itemType')!==null&&this.props.form.getFieldValue('itemType')!==""&&this.props.form.getFieldValue('itemType')!==undefined)}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.materialName`).d('物料编码描述')}
              >
                {getFieldDecorator('materialName', {
                  initialValue: materialName,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.productionVersion`).d('物料版本')}
              >
                {getFieldDecorator('productionVersion', {
                  initialValue: productionVersion,
                })(
                  <Lov
                    code="HME.MATERIAL_VERSION"
                    queryParams={{ tenantId, siteId: getSiteId(), materialId: this.props.form.getFieldValue('materialId')}}
                    textValue={productionVersion}
                    onChange={(val, record) => this.setProductionVersion(record)}
                    disabled={!canEdit||(this.props.form.getFieldValue('materialId')===null||this.props.form.getFieldValue('materialId')===""||this.props.form.getFieldValue('materialId')===undefined)}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.description`).d('版本描述')}
              >
                {getFieldDecorator('description', {
                  initialValue: description,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.operationId`).d('工艺编码')}
              >
                {getFieldDecorator('operationId', {
                  initialValue: operationId,
                })(
                  <Lov
                    code="MT.OPERATION"
                    textValue={operationName}
                    queryParams={{ tenantId }}
                    onChange={this.setDescription.bind(this, 'operationDesc', 'description')}
                    disabled={!canEdit}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.operationName`).d('工艺描述')}
              >
                {getFieldDecorator('operationDesc', {
                  initialValue: operationDesc,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.itemType`).d('物料类别')}
              >
                {getFieldDecorator('itemType', {
                  initialValue: itemType,
                })(<Input
                  disabled={!canEdit||(this.props.form.getFieldValue('materialId')!==null&&this.props.form.getFieldValue('materialId')!==""&&this.props.form.getFieldValue('materialId')!==undefined)}
                />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT} style={{display: 'none'}}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.materialCode`).d('工艺路线')}
              >
                {getFieldDecorator('routerId', {
                  initialValue: routerId,
                })(
                  <Lov
                    code="MT.ROUTER"
                    queryParams={{ tenantId }}
                    textValue={routerName}
                    onChange={this.setDescription.bind(this, 'routerDesc', 'description')}
                    disabled={!canEdit}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.routerDesc`).d('工艺路线描述')}
              >
                {getFieldDecorator('routerDesc', {
                  initialValue: routerDesc,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.categoryCode`).d('工艺路线步骤')}
              >
                {getFieldDecorator('routerStepName', {
                  initialValue: routerStepName,
                })(
                  <Lov
                    code="MT.ROUTER_STEP"
                    isInput
                    // textValue={routerStepName}
                    queryParams={{ tenantId, routerId: getFieldValue('routerId') }}
                    onChange={this.setDescription.bind(this, 'routerStepDesc', 'description')}
                    disabled={!canEdit || !getFieldValue('routerId')}
                  />
                )}
              </Form.Item>
            </Col>
            <Col style={{ display: 'none' }}>
              <Form.Item>
                {getFieldDecorator('routerStepId', { initialValue: routerStepId })(<Input />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.materialName`).d('步骤描述')}
              >
                {getFieldDecorator('routerStepDesc', {
                  initialValue: routerStepDesc,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.materialCode`).d('工作单元')}
              >
                {getFieldDecorator('workcellId', {
                  initialValue: workcellId,
                })(
                  <Lov
                    code="MT.WORKCELL"
                    queryParams={{ tenantId }}
                    textValue={workcellCode}
                    onChange={this.setDescription.bind(this, 'workcellName', 'description')}
                    disabled={!canEdit}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.workcellName`).d('工作单元短描述')}
              >
                {getFieldDecorator('workcellName', {
                  initialValue: workcellName,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.categoryCode`).d('NC代码')}
              >
                {getFieldDecorator('ncCodeId', {
                  initialValue: ncCodeId,
                })(
                  <Lov
                    code="MT.NC_CODE"
                    textValue={ncCode}
                    queryParams={{ tenantId }}
                    onChange={this.setDescription.bind(this, 'ncCodeDesc', 'description')}
                    disabled={!canEdit}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.materialName`).d('NC代码描述')}
              >
                {getFieldDecorator('ncCodeDesc', {
                  initialValue: ncCodeDesc,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT} style={{display: 'none'}}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.materialCode`).d('装配清单')}
              >
                {getFieldDecorator('bomId', {
                  initialValue: bomId,
                })(
                  <Lov
                    code="MT.BOM_BASIC"
                    queryParams={{ tenantId }}
                    textValue={bomName}
                    onChange={this.setDescription.bind(this, 'bomDesc', 'description')}
                    disabled={!canEdit}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.bomDesc`).d('装配清单描述')}
              >
                {getFieldDecorator('bomDesc', {
                  initialValue: bomDesc,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.bomComponentId`).d('装配清单组件')}
              >
                {getFieldDecorator('bomComponentMaterialCode', {
                  initialValue: bomComponentMaterialCode,
                })(
                  <Lov
                    code="MT.BOM_COMPONENT"
                    // textValue={bomComponentMaterialCode}
                    isInput
                    queryParams={{ tenantId, bomId: getFieldValue('bomId') }}
                    onChange={this.setDescription.bind(
                      this,
                      'bomComponentMaterialName',
                      'bomComponentMaterialDesc'
                    )}
                    disabled={!canEdit || !getFieldValue('bomId')}
                  />
                )}
              </Form.Item>
            </Col>
            <Col style={{ display: 'none' }}>
              <Form.Item>
                {getFieldDecorator('bomComponentId', { initialValue: bomComponentId })(<Input />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.bomComponentMaterialName`).d('组件描述')}
              >
                {getFieldDecorator('bomComponentMaterialName', {
                  initialValue: bomComponentMaterialName,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT} style={{display: 'none'}}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.materialCode`).d('WO')}
              >
                {getFieldDecorator('workOrderId', {
                  initialValue: workOrderId,
                })(
                  <Lov
                    code="MT.WORK_ORDER"
                    queryParams={{ tenantId }}
                    textValue={workOrderNum}
                    disabled={!canEdit}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <span />
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.categoryCode`).d('EO')}
              >
                {getFieldDecorator('eoId', {
                  initialValue: eoId,
                })(
                  <Lov
                    code="MT.EO"
                    textValue={eoNum}
                    queryParams={{ tenantId }}
                    disabled={!canEdit}
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
