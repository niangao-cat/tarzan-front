import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col } from 'hzero-ui';
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
 * 基础属性表单数据展示
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ relationMaintainDrawer }) => ({
  relationMaintainDrawer,
}))
@Form.create({ fieldNameProp: null })
export default class BasicTab extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, editFlag, siteId, relationMaintainDrawer } = this.props;
    let { displayList } = relationMaintainDrawer;
    if (isNull(displayList)) {
      displayList = {};
    }
    const { country, province, city, county, address } = displayList;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.country`).d('国家')}
            >
              {getFieldDecorator('country', {
                initialValue: country,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.country`).d('国家')}
                  field="country"
                  dto="tarzan.modeling.domain.entity.MtModSite"
                  pkValue={{ siteId: siteId !== 'create' ? siteId : null || null }}
                  disabled={siteId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                  inputSize={{ zh: 64, en: 64 }}
                />
              )}
            </Form.Item>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.province`).d('省')}
            >
              {getFieldDecorator('province', {
                initialValue: province,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.province`).d('省')}
                  field="province"
                  dto="tarzan.modeling.domain.entity.MtModSite"
                  pkValue={{ siteId: siteId !== 'create' ? siteId : null || null }}
                  disabled={siteId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                  inputSize={{ zh: 64, en: 64 }}
                />
              )}
            </Form.Item>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.city`).d('城市')}
            >
              {getFieldDecorator('city', {
                initialValue: city,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.city`).d('城市')}
                  field="city"
                  dto="tarzan.modeling.domain.entity.MtModSite"
                  pkValue={{ siteId: siteId !== 'create' ? siteId : null || null }}
                  disabled={siteId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                  inputSize={{ zh: 64, en: 64 }}
                />
              )}
            </Form.Item>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.county`).d('县')}
            >
              {getFieldDecorator('county', {
                initialValue: county,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.county`).d('县')}
                  field="city"
                  dto="tarzan.modeling.domain.entity.MtModSite"
                  pkValue={{ siteId: siteId !== 'create' ? siteId : null || null }}
                  disabled={siteId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                  inputSize={{ zh: 64, en: 64 }}
                />
              )}
            </Form.Item>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.address`).d('详细地址')}
            >
              {getFieldDecorator('address', {
                initialValue: address,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.address`).d('详细地址')}
                  field="address"
                  dto="tarzan.modeling.domain.entity.MtModSite"
                  pkValue={{ siteId: siteId !== 'create' ? siteId : null || null }}
                  disabled={siteId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                  style={{ width: '200%' }}
                  inputSize={{ zh: 64, en: 64 }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
