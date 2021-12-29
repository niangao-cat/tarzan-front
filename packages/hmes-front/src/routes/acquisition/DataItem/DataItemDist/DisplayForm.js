import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Switch, Select } from 'hzero-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import TLEditor from '@/components/TLEditor';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.acquisition.dataItem.model.dataItem';
const { Option } = Select;
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

  // shouldComponentUpdate(nextProps) {
  //   console.log(nextProps.dataItem);
  //   console.log(this.props.dataItem);
  //   return Object.is(nextProps.dataItem, this.props.dataItem)
  // }

  changeSelectValue = val => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataItem/updateState',
      payload: {
        valueType: val,
      },
    });
    //  切换数据类型，需要把最大值、最小值、计量单位、符合值、不符合值清空
    this.props.resetFields(val);
  };

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      form,
      tagItem = {},
      dataItem: { collectionMthodList = [], valueTypeList = [] },
      editFlag,
      tagId,
      tagTypeList,
      flagList,
      attributeInfo = {},
    } = this.props;
    const {
      tagCode,
      tagDescription,
      enableFlag,
      valueAllowMissing,
      collectionMethod,
      remark,
      valueType,
    } = tagItem;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <React.Fragment>
        <Form>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.materialCode`).d('数据项编码')}
              >
                {getFieldDecorator('tagCode', {
                  initialValue: tagCode,
                  rules: [
                    {
                      required: !getFieldValue('materialCategoryId'),
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.materialCode`).d('数据项编码'),
                      }),
                    },
                  ],
                })(<Input inputChinese={false} trim disabled={editFlag} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.tagDescription`).d('数据项描述')}
              >
                {getFieldDecorator('tagDescription', {
                  initialValue: tagDescription,
                  rules: [
                    {
                      required: !getFieldValue('materialCategoryId'),
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.materialCode`).d('数据项描述'),
                      }),
                    },
                  ],
                })(
                  <TLEditor
                    label={intl.get(`${modelPrompt}.materialName`).d('目标数据项描述')}
                    field="tagDescription"
                    dto="tarzan.general.domain.entity.MtTag"
                    disabled={editFlag}
                    pkValue={{ tagId: tagId !== 'create' ? tagId : null }}
                    inputSize={{ zh: 64, en: 64 }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.areaCode`).d('数据收集方式')}
              >
                {getFieldDecorator('collectionMethod', {
                  initialValue: collectionMethod,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.materialCode`).d('数据收集方式'),
                      }),
                    },
                  ],
                })(
                  <Select allowClear disabled={editFlag}>
                    {collectionMthodList.map(ele => (
                      <Option value={ele.typeCode}>{ele.description}</Option>
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
                label={intl.get(`${modelPrompt}.defaultBomName`).d('数据类型')}
              >
                {getFieldDecorator('valueType', {
                  initialValue: valueType,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.materialCode`).d('数据类型'),
                      }),
                    },
                  ],
                })(
                  <Select allowClear disabled={editFlag} onChange={this.changeSelectValue}>
                    {valueTypeList.map(ele => (
                      <Option value={ele.typeCode}>{ele.description}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.vision`).d('是否启用')}
              >
                {getFieldDecorator('enableFlag', {
                  initialValue: enableFlag === 'Y',
                })(<Switch disabled={editFlag} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.vision`).d('允许缺失值')}
              >
                {getFieldDecorator('valueAllowMissing', {
                  initialValue: valueAllowMissing === 'Y',
                })(<Switch disabled={editFlag} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.prodLineName`).d('过程数据标识')}
              >
                {getFieldDecorator('PROCESS_FLAG', {
                  initialValue: attributeInfo.PROCESS_FLAG,
                })(
                  <Select style={{ width: '100%' }} disabled={editFlag || tagId === 'create'} allowClear>
                    {flagList.map(e => (
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
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.prodLineName`).d('数据项类型')}
              >
                {getFieldDecorator('TAG_TYPE', {
                  initialValue: attributeInfo.TAG_TYPE,
                })(
                  <Select style={{ width: '100%' }} disabled={editFlag || tagId === 'create'} allowClear>
                    {tagTypeList.map(e => (
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
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.prodLineName`).d('备注')}
              >
                {getFieldDecorator('remark', {
                  initialValue: remark,
                })(<Input disabled={editFlag} />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}
