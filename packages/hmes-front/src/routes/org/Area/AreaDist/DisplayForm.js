import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Switch, Select } from 'hzero-ui';
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
 * 表单数据展示
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ area }) => ({
  area,
}))
@formatterCollections({
  code: ['tarzan.org.area'], // code 为 [服务].[功能]的字符串数组
})
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
    const {
      areaId,
      componentDisabled,
      form,
      area: { areaDetailedInfo = {} },
      areaCategoryList = [],
    } = this.props;
    const { areaCode, description, areaName, enableFlag, areaCategory } = areaDetailedInfo;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.areaCode`).d('区域编码')}
            >
              {getFieldDecorator('areaCode', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.areaCode`).d('区域编码'),
                    }),
                  },
                ],
                initialValue: areaCode,
              })(<Input typeCase="upper" trim inputChinese={false} disabled={componentDisabled} />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.areaName`).d('区域短描述')}
            >
              {getFieldDecorator('areaName', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.areaName`).d('区域短描述'),
                    }),
                  },
                ],
                initialValue: areaName,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.areaName`).d('区域短描述')}
                  field="areaName"
                  dto="tarzan.modeling.domain.entity.MtModArea"
                  pkValue={{ areaId: areaId !== 'create' ? areaId : null || null }}
                  inputSize={{ zh: 64, en: 64 }}
                  disabled={componentDisabled}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.description`).d('区域长描述')}
            >
              {getFieldDecorator('description', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.description`).d('区域长描述'),
                    }),
                  },
                ],
                initialValue: description,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.description`).d('区域长描述')}
                  field="description"
                  dto="tarzan.modeling.domain.entity.MtModArea"
                  pkValue={{ areaId: areaId !== 'create' ? areaId : null || null }}
                  inputSize={{ zh: 64, en: 64 }}
                  disabled={componentDisabled}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="区域类型">
              {getFieldDecorator('areaCategory', {
                initialValue: areaCategory,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '区域类型',
                    }),
                  },
                ],
              })(
                <Select style={{ width: '100%' }} disabled={componentDisabled}>
                  {areaCategoryList.map(item => {
                    return (
                      <Select.Option key={item.value} value={item.value}>
                        {item.meaning}
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
              label={intl.get(`${modelPrompt}.enableFlag`).d('启用状态')}
            >
              {getFieldDecorator('enableFlag', {
                initialValue: enableFlag !== 'N',
              })(<Switch disabled={componentDisabled} />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
