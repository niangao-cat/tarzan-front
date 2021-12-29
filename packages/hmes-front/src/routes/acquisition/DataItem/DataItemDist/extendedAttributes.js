import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, InputNumber, Select } from 'hzero-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.acquisition.dataItem.model.dataItem';
/**
 * 扩展属性数据展示
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

const { Option } = Select;

@connect(({ dataItem }) => ({
  dataItem,
}))
@formatterCollections({ code: 'tarzan.acquisition.extendedAttributes' })
@Form.create({ fieldNameProp: null })
export default class ExtendedAttributes extends PureComponent {
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
    this.props.form.setFieldsValue({
      unit: records.uomId,
      uomDesc: records.uomName,
    });
  };

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, editFlag, attributeInfo={}, qmsDefectLevelList, qmsInspectionLineTypeList, qmsInspectionToolList, kid } = this.props;
    const { getFieldDecorator } = form;
    return (
      <React.Fragment>
        <Form>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.ACCURACY`).d('精度')}
              >
                {getFieldDecorator('ACCURACY', {
                  initialValue: attributeInfo.ACCURACY,
                })(
                  <InputNumber style={{ width: '100%' }} min={0} disabled={editFlag || kid === 'create'} step={1} />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.DEFECT_LEVEL`).d('缺陷等级')}
              >
                {getFieldDecorator('DEFECT_LEVEL', {
                  initialValue: attributeInfo.DEFECT_LEVEL,
                })(
                  <Select allowClear disabled={editFlag || kid === 'create'}>
                    {qmsDefectLevelList.map(ele => (
                      <Option value={ele.value}>{ele.meaning}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.INSPECTION_TOOL`).d('检验工具')}
              >
                {getFieldDecorator('INSPECTION_TOOL', {
                  initialValue: attributeInfo.INSPECTION_TOOL,
                })(
                  <Select allowClear disabled={editFlag || kid === 'create'}>
                    {qmsInspectionToolList.map(ele => (
                      <Option value={ele.value}>{ele.meaning}</Option>
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
                label={intl.get(`${modelPrompt}.INSPECTION_TYPE`).d('检验类型')}
              >
                {getFieldDecorator('INSPECTION_TYPE', {
                  initialValue: attributeInfo.INSPECTION_TYPE,
                })(
                  <Select allowClear disabled={editFlag || kid === 'create'}>
                    {qmsInspectionLineTypeList.map(ele => (
                      <Option value={ele.value}>{ele.meaning}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.STANDARD_TEXT`).d('文本规格值')}
              >
                {getFieldDecorator('STANDARD_TEXT', {
                  initialValue: attributeInfo.STANDARD_TEXT,
                })(<InputNumber style={{ width: '100%' }} min={0} disabled={editFlag || kid === 'create'} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.ORDER_KEY`).d('排序码')}
              >
                {getFieldDecorator('ORDER_KEY', {
                  initialValue: attributeInfo.ORDER_KEY,
                })(
                  <InputNumber style={{ width: '100%' }} min={0} disabled={editFlag || kid === 'create'} step={1} />
                )}
              </Form.Item>
            </Col>
            {/* <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.SAMPLE_TYPE`).d('抽样类型')}
              >
                {getFieldDecorator('SAMPLE_TYPE', {
                  initialValue: attributeList[5].attrValue,
                })(<Input disabled={editFlag} />)}
              </Form.Item>
            </Col> */}
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            {/* <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.STANDARD`).d('标准值')}
              >
                {getFieldDecorator('STANDARD', {
                  initialValue: attributeList[6].attrValue,
                })(<InputNumber style={{ width: '100%' }} min={0} disabled={editFlag} />)}
              </Form.Item>
            </Col> */}
            {/* <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.TEST`).d('测试扩展属性')}
              >
                {getFieldDecorator('TEST', {
                  initialValue: attributeList[8].attrValue,
                })(
                  <Lov
                    code="MT.API_CONVERSION"
                    queryParams={{ tenantId }}
                    textValue={apiName}
                    disabled={editFlag}
                  />
                )}
              </Form.Item>
            </Col> */}
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}
