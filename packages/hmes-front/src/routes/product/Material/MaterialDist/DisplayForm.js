import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Switch, InputNumber, Card, Icon } from 'hzero-ui';

import {
  FORM_COL_4_LAYOUT,
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
  DETAIL_CARD_TABLE_CLASSNAME,
} from '@/utils/constants';
import { getCurrentOrganizationId } from 'utils/utils';
import { Bind } from 'lodash-decorators';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import TLEditor from '@/components/TLEditor';
// import FormItem from 'hzero-ui/lib/form/FormItem';

const modelPrompt = 'tarzan.product.materialManager.model.materialManager';
/**
 * 表单数据展示
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ materialManager, loading }) => ({
  materialManager,
  fetchListLoading: loading.effects['materialManager/fetchDataSourceList'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.product.materialManager',
})
export default class DisplayForm extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  state = {
    expandForm: true,
    expandBasic: true,
  };

  // componentDidMount() {
  //   const {
  //     form,
  //     materialManager: { materialManagerItem = {} },
  //   } = this.props;
  //   form.setFieldsValue({
  //     _tls: materialManagerItem._tls,
  //   });
  // }

  /**
   *@functionName:   toggleForm
   *@description 展开/收起维护信息
   *@author: 唐加旭
   *@date: 2019-08-21 10:18:54
   *@version: V0.8.6
   * */
  @Bind
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  @Bind
  toggleBasicForm = () => {
    const { expandBasic } = this.state;
    this.setState({ expandBasic: !expandBasic });
  };

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      form,
      materialId,
      materialManager: { materialManagerItem = {} },
      canEdit,
    } = this.props;
    const {
      materialCode,
      materialName,
      materialDesignCode,
      volume,
      materialIdentifyCode,
      primaryUomId,
      secondaryUomId,
      conversionRate,
      length,
      shelfLifeUomId,
      width,
      shelfLife,
      height,
      weightUomName,
      sizeUomId,
      weight,
      weightUomId,
      volumeUomName,
      enableFlag,
      sizeUomName,
      volumeUomId,
      secondaryUomName,
      shelfLifeUomName,
      primaryUomName,
      model,
    } = materialManagerItem;
    const { getFieldDecorator } = form;
    const { expandForm, expandBasic } = this.state;
    const tenantId = getCurrentOrganizationId();
    const title = (
      <span>
        {intl.get('tarzan.product.materialManager.title.basic').d('基础属性')}
        <a style={{ marginLeft: '16px', fontSize: '12px' }} onClick={this.toggleBasicForm}>
          {expandBasic
            ? intl.get(`tarzan.product.materialManager.button.up`).d('收起')
            : intl.get(`tarzan.product.materialManager.button.expand`).d('展开')}
          <Icon type={expandBasic ? 'up' : 'down'} />
        </a>
      </span>
    );
    const titleGG = (
      <span>
        {intl.get('tarzan.product.materialManager.title.rule').d('规格尺寸')}
        <a style={{ marginLeft: '16px', fontSize: '12px' }} onClick={this.toggleForm}>
          {expandForm
            ? intl.get(`tarzan.product.materialManager.button.up`).d('收起')
            : intl.get(`tarzan.product.materialManager.button.expand`).d('展开')}
          <Icon type={expandForm ? 'up' : 'down'} />
        </a>
      </span>
    );
    return (
      <React.Fragment>
        <Form>
          <Card
            key="code-rule-header"
            title={title}
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
            size="small"
          />
          <Row
            {...SEARCH_FORM_ROW_LAYOUT}
            style={{
              display: expandBasic ? '' : 'none',
            }}
          >
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.materialCode`).d('物料编码')}
              >
                {getFieldDecorator('materialCode', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
                      }),
                    },
                  ],
                  initialValue: materialCode,
                })(<Input disabled={!canEdit} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.materialName`).d('物料描述')}
              >
                {getFieldDecorator('materialName', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.materialName`).d('物料描述'),
                      }),
                    },
                  ],
                  initialValue: materialName,
                })(
                  <TLEditor
                    label={intl.get(`${modelPrompt}.materialName`).d('物料描述')}
                    field="materialName"
                    disabled={!canEdit}
                    dto="tarzan.material.domain.entity.MtMaterial"
                    pkValue={{ materialId: materialId !== 'create' ? materialId : null }}
                    inputSize={{ zh: 64, en: 64 }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.materialDesignCode`).d('物料图号')}
              >
                {getFieldDecorator('materialDesignCode', {
                  initialValue: materialDesignCode,
                })(<Input disabled={!canEdit} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row
            {...SEARCH_FORM_ROW_LAYOUT}
            style={{
              display: expandBasic ? '' : 'none',
            }}
          >
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.materialIdentifyCode`).d('物料简码')}
              >
                {getFieldDecorator('materialIdentifyCode', {
                  initialValue: materialIdentifyCode,
                })(<Input disabled={!canEdit} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.model`).d('材质/型号')}
              >
                {getFieldDecorator('model', {
                  initialValue: model,
                })(<Input disabled={!canEdit} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.enableFlag`).d('启用状态')}
              >
                {getFieldDecorator('enableFlag', {
                  initialValue: enableFlag !== 'N',
                })(<Switch disabled={!canEdit} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row
            {...SEARCH_FORM_ROW_LAYOUT}
            style={{
              display: expandBasic ? '' : 'none',
            }}
          >
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.primaryUomName`).d('基本计量单位')}
              >
                {getFieldDecorator('primaryUomId', {
                  initialValue: primaryUomId,
                  rules: [
                    {
                      required: true,
                      message: intl
                        .get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.primaryUomName`).d('基本计量单位'),
                        })
                        .d('不能为空'),
                    },
                  ],
                })(
                  <Lov
                    code="MT.UOM"
                    disabled={!canEdit}
                    textValue={primaryUomName}
                    queryParams={{ tenantId }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.secondaryUomName`).d('辅助单位')}
              >
                {getFieldDecorator('secondaryUomId', {
                  initialValue: secondaryUomId,
                })(
                  <Lov
                    code="MT.UOM"
                    disabled={!canEdit}
                    textValue={secondaryUomName}
                    queryParams={{ tenantId }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.conversionRate`).d('主辅助单位换算')}
              >
                {getFieldDecorator('conversionRate', {
                  initialValue: conversionRate,
                })(<InputNumber disabled={!canEdit} style={{ width: '100%' }} min={0} />)}
              </Form.Item>
            </Col>
          </Row>
          <Card
            key="code-rule-header"
            title={titleGG}
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
            size="small"
          />
          <Row
            {...SEARCH_FORM_ROW_LAYOUT}
            style={{
              display: expandForm ? '' : 'none',
            }}
          >
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.length`).d('长')}
              >
                {getFieldDecorator('length', {
                  initialValue: length,
                })(<InputNumber disabled={!canEdit} style={{ width: '100%' }} min={0} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.width`).d('宽')}
              >
                {getFieldDecorator('width', {
                  initialValue: width,
                })(<InputNumber disabled={!canEdit} style={{ width: '100%' }} min={0} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.height`).d('高')}
              >
                {getFieldDecorator('height', {
                  initialValue: height,
                })(<InputNumber disabled={!canEdit} style={{ width: '100%' }} min={0} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.sizeUomName`).d('尺寸单位')}
              >
                {getFieldDecorator('sizeUomId', {
                  initialValue: sizeUomId,
                })(
                  <Lov
                    code="MT.UOM"
                    textValue={sizeUomName}
                    disabled={!canEdit}
                    queryParams={{ tenantId, uomType: 'LENGTH' }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row
            {...SEARCH_FORM_ROW_LAYOUT}
            style={{
              display: expandForm ? '' : 'none',
            }}
          >
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.volume`).d('体积')}
              >
                {getFieldDecorator('volume', {
                  initialValue: volume,
                })(
                  //   <Lov
                  //   code="MT.SERVICE_PACKAGE"
                  //   queryParams={{ tenantId }}
                  // />
                  <InputNumber disabled={!canEdit} style={{ width: '100%' }} min={0} />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.volumeUomName`).d('体积单位')}
              >
                {getFieldDecorator('volumeUomId', {
                  initialValue: volumeUomId,
                })(
                  <Lov
                    code="MT.UOM"
                    disabled={!canEdit}
                    textValue={volumeUomName}
                    queryParams={{ tenantId, uomType: 'VOLUME' }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.weight`).d('重量')}
              >
                {getFieldDecorator('weight', {
                  initialValue: weight,
                })(<InputNumber disabled={!canEdit} style={{ width: '100%' }} min={0} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.weightUomName`).d('重量单位')}
              >
                {getFieldDecorator('weightUomId', {
                  initialValue: weightUomId,
                })(
                  <Lov
                    code="MT.UOM"
                    disabled={!canEdit}
                    textValue={weightUomName}
                    queryParams={{ tenantId, uomType: 'WEIGHT' }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row
            {...SEARCH_FORM_ROW_LAYOUT}
            style={{
              display: expandForm ? '' : 'none',
            }}
          >
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.shelfLife`).d('保质期')}
              >
                {getFieldDecorator('shelfLife', {
                  initialValue: shelfLife,
                })(<InputNumber disabled={!canEdit} style={{ width: '100%' }} min={0} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.shelfLifeUomName`).d('保质期单位')}
              >
                {getFieldDecorator('shelfLifeUomId', {
                  initialValue: shelfLifeUomId,
                })(
                  <Lov
                    code="MT.UOM"
                    disabled={!canEdit}
                    textValue={shelfLifeUomName}
                    queryParams={{ tenantId, uomType: 'TIME' }}
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
