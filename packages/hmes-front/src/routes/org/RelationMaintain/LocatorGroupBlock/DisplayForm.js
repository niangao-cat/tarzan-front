import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Switch } from 'hzero-ui';
import { isUndefined, isNull } from 'lodash';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import intl from 'utils/intl';
import TLEditor from '@/components/TLEditor';

const modelPrompt = 'tarzan.org.locatorGroup.model.locatorGroup';
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
    const { form, locatorGroupId, editFlag, relationMaintainDrawer } = this.props;
    let { displayList = {} } = relationMaintainDrawer;
    if (isNull(displayList)) {
      displayList = {};
    }
    const { locatorGroupName, enableFlag, locatorGroupCode } = displayList;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ margin: 0 }}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.locatorGroupCode`).d('库位组编码')}
            >
              {getFieldDecorator('locatorGroupCode', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.locatorGroupCode`).d('库位组编码'),
                    }),
                  },
                ],
                initialValue: locatorGroupCode,
              })(
                <Input
                  // typeCase="upper"
                  // trim
                  // inputChinese={false}
                  disabled={
                    locatorGroupId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
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
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.locatorGroupName`).d('库位组描述'),
                    }),
                  },
                ],
                initialValue: locatorGroupName,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.locatorGroupName`).d('库位组描述')}
                  field="locatorGroupName"
                  dto="tarzan.modeling.domain.entity.MtModLocatorGroup"
                  pkValue={{
                    locatorGroupId: locatorGroupId !== 'create' ? locatorGroupId : null || null,
                  }}
                  disabled={
                    locatorGroupId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
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
                    locatorGroupId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
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
