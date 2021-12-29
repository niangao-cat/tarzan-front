import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, InputNumber, Input } from 'hzero-ui';
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
export default class DisplayForm extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  // componentDidMount() {
  //   const {
  //     form,
  //     dataItem: { tagItem = {} },
  //   } = this.props;
  //   const { unit } = tagItem;
  //   console.log(tagItem);
  //   console.log(unit);
  //   form.getFieldDecorator('unit', { initialValue: unit });
  // }

  //  切换数据类型，需要把最大值、最小值、计量单位、符合值、不符合值清空
  resetFields = valueType => {
    if (valueType === 'VALUE') {
      this.props.form.setFieldsValue({
        falseValue: '',
        trueValue: '',
      });
    } else if (valueType === 'DECISION_VALUE') {
      this.props.form.setFieldsValue({
        maximalValue: '',
        minimumValue: '',
        unit: '',
        uomCode: '',
        uomDesc: '',
      });
    } else {
      this.props.form.setFieldsValue({
        maximalValue: '',
        minimumValue: '',
        unit: '',
        uomCode: '',
        uomDesc: '',
        falseValue: '',
        trueValue: '',
      });
    }
  };

  changeUnit = (val, records) => {
    if(records) {
      this.props.form.setFieldsValue({
        unit: records.uomId,
        uomDesc: records.uomName,
      });
    } else {
      this.props.form.resetFields(['unit', 'uomDesc']);
    }

  };

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, editFlag, dataItem, attributeInfo, tagId } = this.props;
    const { tagItem = {}, valueType } = dataItem;
    const disabled = tagId === 'create';
    // const { identifyTypeList = [] } = dataItem;
    const {
      maximalValue,
      unit,
      uomDesc,
      uomCode,
      minimumValue,
      trueValue,
      falseValue,
      apiId,
      mandatoryNum,
      optionalNum,
      apiName,
    } = tagItem;
    const { getFieldDecorator } = form;
    return (
      <React.Fragment>
        <Form>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.minimumValue`).d('最小值')}
              >
                {getFieldDecorator('minimumValue', {
                  initialValue: minimumValue,
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    disabled={editFlag || !['VALUE', 'FORMULA'].includes(valueType)}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label='标准值'
              >
                {getFieldDecorator('standard', {
                  initialValue: attributeInfo.STANDARD,
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    disabled={editFlag || !['VALUE', 'FORMULA'].includes(valueType) || disabled}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.maximalValue`).d('最大值')}
              >
                {getFieldDecorator('maximalValue', {
                  initialValue: maximalValue,
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    disabled={editFlag || !['VALUE', 'FORMULA'].includes(valueType)}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.categoryCode`).d('计量单位')}
              >
                {getFieldDecorator('uomCode', {
                  initialValue: uomCode,
                })(
                  <Lov
                    code="MT.UOM"
                    isInput
                    value={uomCode}
                    // textValue={uomCode}
                    disabled={editFlag || valueType !== 'VALUE'}
                    queryParams={{ tenantId }}
                    onChange={this.changeUnit}
                  />
                )}
              </Form.Item>
            </Col>
            <Col style={{ display: 'none' }}>
              <Form.Item>{getFieldDecorator('unit', { initialValue: unit })(<Input />)}</Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.areaCode`).d('符合值')}
              >
                {getFieldDecorator('trueValue', {
                  initialValue: trueValue,
                })(
                  <Input
                    // style={{ width: '100%' }}
                    disabled={editFlag || valueType !== 'DECISION_VALUE'}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.prodLineName`).d('不符合值')}
              >
                {getFieldDecorator('falseValue', {
                  initialValue: falseValue,
                })(
                  <Input
                    // style={{ width: '100%' }}
                    disabled={editFlag || valueType !== 'DECISION_VALUE'}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.uomDesc`).d('计量单位描述')}
              >
                {getFieldDecorator('uomDesc', {
                  initialValue: uomDesc,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.defaultBomName`).d('必须的数据条数')}
              >
                {getFieldDecorator('mandatoryNum', {
                  initialValue: mandatoryNum,
                })(<InputNumber style={{ width: '100%' }} min={0} disabled={editFlag} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.vision`).d('可选的数据条数')}
              >
                {getFieldDecorator('optionalNum', {
                  initialValue: optionalNum,
                })(<InputNumber style={{ width: '100%' }} min={0} disabled={editFlag} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.workcellName`).d('转换API')}
              >
                {getFieldDecorator('apiId', {
                  initialValue: apiId,
                })(
                  <Lov
                    code="MT.API_CONVERSION"
                    queryParams={{ tenantId }}
                    textValue={apiName}
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
