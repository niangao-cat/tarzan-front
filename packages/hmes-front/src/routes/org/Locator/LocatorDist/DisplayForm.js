import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Switch, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import intl from 'utils/intl';
import TLEditor from '@/components/TLEditor';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
const modelPrompt = 'tarzan.org.locator.model.locator';
/**
 * 表单数据展示
 * @extends {Component} - React.Component
 * @return React.element
 */

@connect(({ locator }) => ({
  locator,
}))
@Form.create({ fieldNameProp: null })
export default class DisplayForm extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  @Bind
  setLocatorGroupName(_, record) {
    this.props.form.setFieldsValue({
      locatorGroupName: record.locatorGroupName,
      locatorGroupId: record.locatorGroupId,
    });
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, locatorId, editFlag, locator = {} } = this.props;
    const { locatorTypeList = [], locatorCategoryList = [], displayList = {} } = locator;
    const {
      locatorCode,
      negativeFlag,
      locatorLocation,
      locatorType,
      locatorName,
      enableFlag,
      locatorCategory,
      locatorGroupCode,
      locatorGroupName,
      locatorGroupId,
    } = displayList;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.locatorCode`).d('库位编码')}
            >
              {getFieldDecorator('locatorCode', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.locatorCode`).d('库位编码'),
                    }),
                  },
                ],
                initialValue: locatorCode,
              })(
                <Input
                  typeCase="upper"
                  trim
                  disabled={
                    locatorId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.locatorName`).d('库位描述')}
            >
              {getFieldDecorator('locatorName', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.locatorName`).d('库位描述'),
                    }),
                  },
                ],
                initialValue: locatorName,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.locatorName`).d('库位描述')}
                  field="locatorName"
                  dto="tarzan.modeling.domain.entity.MtModLocator"
                  pkValue={{ locatorId: locatorId !== 'create' ? locatorId : null || null }}
                  inputSize={{ zh: 64, en: 64 }}
                  disabled={
                    locatorId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.locatorType`).d('库位类型')}
            >
              {getFieldDecorator('locatorType', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.locatorType`).d('库位类型'),
                    }),
                  },
                ],
                initialValue: locatorType || undefined,
              })(
                <Select
                  style={{ width: '100%' }}
                  allowClear
                  disabled={
                    locatorId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                  }
                >
                  {locatorTypeList instanceof Array &&
                    locatorTypeList.length !== 0 &&
                    locatorTypeList.map(item => {
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
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.locatorCategory`).d('库位类别')}
            >
              {getFieldDecorator('locatorCategory', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.locatorCategory`).d('库位类别'),
                    }),
                  },
                ],
                initialValue: locatorCategory || undefined,
              })(
                <Select
                  style={{ width: '100%' }}
                  allowClear
                  disabled={
                    locatorId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                  }
                >
                  {locatorCategoryList instanceof Array &&
                    locatorCategoryList.length !== 0 &&
                    locatorCategoryList.map(item => {
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
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.locatorGroupCode`).d('库位组')}
            >
              {getFieldDecorator('locatorGroupCode', {
                initialValue: locatorGroupCode,
              })(
                <Lov
                  code="MT.MOD_LOCATOR_GROUP"
                  textValue={locatorGroupCode}
                  onChange={this.setLocatorGroupName}
                  queryParams={{ tenantId }}
                  disabled={
                    locatorId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.locatorGroupName`).d('库位组描述')}
            >
              {getFieldDecorator('locatorGroupName', {
                initialValue: locatorGroupName,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT} style={{ display: 'none' }}>
            <Form.Item {...DRAWER_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('locatorGroupId', { initialValue: locatorGroupId })(<Input />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.locatorLocation`).d('库位位置')}
            >
              {getFieldDecorator('locatorLocation', {
                initialValue: locatorLocation,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.locatorLocation`).d('库位位置')}
                  field="locatorLocation"
                  dto="tarzan.modeling.domain.entity.MtModLocator"
                  pkValue={{ locatorId: locatorId !== 'create' ? locatorId : null || null }}
                  inputSize={{ zh: 64, en: 64 }}
                  disabled={
                    locatorId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.enableFlag`).d('启用状态')}
            >
              {getFieldDecorator('enableFlag', {
                initialValue: enableFlag !== 'N',
              })(
                <Switch
                  disabled={
                    locatorId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.negativeFlag`).d('是否允许负库存')}
            >
              {getFieldDecorator('negativeFlag', {
                initialValue: negativeFlag === 'Y',
              })(
                <Switch
                  disabled={
                    locatorId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
