import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Switch, Select } from 'hzero-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import TLEditor from '@/components/TLEditor';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
const modelPrompt = 'tarzan.acquisition.collection.model.collection';
const { Option } = Select;
/**
 * 表单数据展示
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ collection }) => ({
  collection,
}))
@formatterCollections({ code: 'tarzan.acquisition.collection' })
@Form.create({ fieldNameProp: null })
export default class DisplayForm extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, collection, canEdit, tagGroupId } = this.props;
    const {
      mtTagGroupDTO = {},
      statusList = [],
      typeList = [],
      businessList = [],
      collectionTimeControlList = [],
    } = collection;
    const {
      tagGroupCode,
      tagGroupDescription,
      tagGroupType,
      status,
      sourceGroupCode,
      sourceGroupId,
      collectionTimeControl,
      businessType,
      userVerification,
    } = mtTagGroupDTO;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <React.Fragment>
        <Form>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.tagGroupCode`).d('收集组编码')}
              >
                {getFieldDecorator('tagGroupCode', {
                  initialValue: tagGroupCode,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.tagGroupCode`).d('收集组编码'),
                      }),
                    },
                  ],
                })(<Input inputChinese={false} trim disabled={!canEdit} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.tagGroupDescription`).d('收集组描述')}
              >
                {getFieldDecorator('tagGroupDescription', {
                  initialValue: tagGroupDescription,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.tagGroupCode`).d('收集组描述'),
                      }),
                    },
                  ],
                })(
                  <TLEditor
                    label={intl.get(`${modelPrompt}.materialName`).d('目标数据项描述')}
                    field="tagGroupDescription"
                    disabled={!canEdit}
                    dto="tarzan.general.domain.entity.MtTagGroup"
                    pkValue={{ tagGroupId: tagGroupId !== 'create' ? tagGroupId : null }}
                    inputSize={{ zh: 64, en: 64 }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.status`).d('状态')}
              >
                {getFieldDecorator('status', {
                  initialValue: status,
                  rules: [
                    {
                      required: !getFieldValue('materialCategoryId'),
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.tagGroupCode`).d('状态'),
                      }),
                    },
                  ],
                })(
                  <Select allowClear disabled={!canEdit}>
                    {statusList.map(ele => (
                      <Option value={ele.statusCode} key={ele.statusCode}>
                        {ele.description}
                      </Option>
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
                label={intl.get(`${modelPrompt}.businessType`).d('业务类型')}
              >
                {getFieldDecorator('businessType', {
                  initialValue: businessType,
                  rules: [
                    {
                      required: !getFieldValue('materialCategoryId'),
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.tagGroupCode`).d('业务类型'),
                      }),
                    },
                  ],
                })(
                  <Select allowClear disabled={!canEdit}>
                    {businessList.map(ele => (
                      <Option value={ele.typeCode}>{ele.description}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.tagGroupType`).d('收集组类型')}
              >
                {getFieldDecorator('tagGroupType', {
                  initialValue: tagGroupType || 'EO',
                  rules: [
                    {
                      required: !getFieldValue('materialCategoryId'),
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.tagGroupCode`).d('收集组类型'),
                      }),
                    },
                  ],
                })(
                  <Select allowClear disabled={!canEdit}>
                    {typeList.map(ele => (
                      <Option value={ele.typeCode}>{ele.description}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.sourceGroup`).d('源数据收集组')}
              >
                {getFieldDecorator('sourceGroupId', {
                  initialValue: sourceGroupId,
                })(
                  <Lov
                    code="MT.TAG_GROUP"
                    disabled={
                      !canEdit ||
                      (getFieldValue('tagGroupType') !== 'EO' &&
                        getFieldValue('tagGroupType') !== 'WKC')
                    }
                    textValue={sourceGroupCode}
                    // onChange={(value, records) => this.changeCode(value, records, index)}
                    queryParams={{ tenantId }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.collectionTimeControl`).d('数据收集时点')}
              >
                {getFieldDecorator('collectionTimeControl', {
                  initialValue: collectionTimeControl,
                  rules: [
                    {
                      required: !getFieldValue('materialCategoryId'),
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.tagGroupCode`).d('数据收集时点'),
                      }),
                    },
                  ],
                })(
                  <Select allowClear disabled={!canEdit}>
                    {collectionTimeControlList.map(ele => (
                      <Option value={ele.typeCode}>{ele.description}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.userVerification`).d('需要用户验证')}
              >
                {getFieldDecorator('userVerification', {
                  initialValue: userVerification === 'Y',
                })(<Switch disabled={!canEdit} />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}
