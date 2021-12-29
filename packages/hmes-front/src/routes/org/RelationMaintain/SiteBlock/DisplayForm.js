import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Switch, Select } from 'hzero-ui';
import { isUndefined, isNull } from 'lodash';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import intl from 'utils/intl';
import TLEditor from '@/components/TLEditor';

const modelPrompt = 'tarzan.org.site.model.site';
/**
 * 表单数据展示
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ relationMaintainDrawer }) => ({
  relationMaintainDrawer,
}))
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
    const { form, relationMaintainDrawer, editFlag, siteId } = this.props;
    const { siteTypeList = [] } = relationMaintainDrawer;
    let { displayList } = relationMaintainDrawer;
    if (isNull(displayList)) {
      displayList = {};
    }
    const { siteCode, siteType, siteName, enableFlag } = displayList;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ margin: 0 }}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.siteCode`).d('站点编码')}
            >
              {getFieldDecorator('siteCode', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.siteCode`).d('站点编码'),
                    }),
                  },
                ],
                initialValue: siteCode,
              })(
                <Input
                  trim
                  inputChinese={false}
                  disabled={siteId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.siteName`).d('站点描述')}
            >
              {getFieldDecorator('siteName', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.siteName`).d('站点描述'),
                    }),
                  },
                ],
                initialValue: siteName,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.siteName`).d('站点描述')}
                  field="siteName"
                  dto="tarzan.modeling.domain.entity.MtModSite"
                  pkValue={{ siteId: siteId !== 'create' ? siteId : null || null }}
                  disabled={siteId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                  inputSize={{ zh: 64, en: 64 }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.siteType`).d('站点类型')}
            >
              {getFieldDecorator('siteType', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.siteType`).d('站点类型'),
                    }),
                  },
                ],
                initialValue: siteType || undefined,
              })(
                <Select style={{ width: '100%' }} disabled={siteId !== 'create'} allowClear>
                  {siteTypeList instanceof Array &&
                    siteTypeList.length !== 0 &&
                    siteTypeList.map(item => {
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
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ margin: 0 }}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.enableFlag`).d('启用状态')}
            >
              {getFieldDecorator('enableFlag', {
                initialValue: enableFlag !== 'N',
              })(
                <Switch
                  disabled={siteId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
