import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col } from 'hzero-ui';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import TLEditor from '@/components/TLEditor';

const modelPrompt = 'tarzan.org.area.model.area';
/**
 * 基础属性表单数据展示
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ relationMaintainDrawer }) => ({
  relationMaintainDrawer,
}))
@formatterCollections({
  code: ['tarzan.org.area'], // code 为 [服务].[功能]的字符串数组
})
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
    const {
      componentDisabled,
      areaId,
      form,
      relationMaintainDrawer: { areaDetailedInfo = {} },
    } = this.props;
    const { country, province, city, county, address } = areaDetailedInfo;
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
                  dto="tarzan.modeling.domain.entity.MtModArea"
                  pkValue={{ areaId: areaId !== 'create' ? areaId : null || null }}
                  inputSize={{ zh: 64, en: 64 }}
                  disabled={componentDisabled}
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
                  dto="tarzan.modeling.domain.entity.MtModArea"
                  pkValue={{ areaId: areaId !== 'create' ? areaId : null || null }}
                  inputSize={{ zh: 64, en: 64 }}
                  disabled={componentDisabled}
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
                  dto="tarzan.modeling.domain.entity.MtModArea"
                  pkValue={{ areaId: areaId !== 'create' ? areaId : null || null }}
                  inputSize={{ zh: 64, en: 64 }}
                  disabled={componentDisabled}
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
                  field="county"
                  dto="tarzan.modeling.domain.entity.MtModArea"
                  pkValue={{ areaId: areaId !== 'create' ? areaId : null || null }}
                  inputSize={{ zh: 64, en: 64 }}
                  disabled={componentDisabled}
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
                  dto="tarzan.modeling.domain.entity.MtModArea"
                  pkValue={{ areaId: areaId !== 'create' ? areaId : null || null }}
                  inputSize={{ zh: 64, en: 64 }}
                  style={{ width: '200%' }}
                  disabled={componentDisabled}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
