import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Switch, Select } from 'hzero-ui';
import { isUndefined } from 'lodash';
import TLEditor from '@/components/TLEditor';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.calendar.working.model.working';
/**
 * 表单数据展示
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ working }) => ({
  working,
}))
@Form.create({ fieldNameProp: null })
export default class DisplayForm extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  componentDidMount() {
    const {
      dispatch,
      working: { calendarTypeList = [] },
    } = this.props;
    if (calendarTypeList.length === 0) {
      dispatch({
        type: 'working/fetchWorkingTypeList',
        payload: {
          module: 'CALENDAR',
          typeGroup: 'CALENDAR_TYPE',
        },
      });
    }
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      form,
      working: { displayList = {}, calendarTypeList = [] },
      editFlag,
      calendarId,
    } = this.props;
    const { calendarCode, description, calendarType, enableFlag } = displayList;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.calendarCode`).d('日历编码')}
            >
              {getFieldDecorator('calendarCode', {
                initialValue: calendarCode,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.calendarCode`).d('日历编码'),
                    }),
                  },
                ],
              })(
                <Input
                  disabled={
                    calendarId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.calendarType`).d('日历类型')}
            >
              {getFieldDecorator('calendarType', {
                initialValue: calendarType,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.calendarType`).d('日历类型'),
                    }),
                  },
                ],
              })(
                <Select
                  style={{ width: '100%' }}
                  allowClear
                  disabled={
                    calendarId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                  }
                >
                  {(calendarTypeList || []).map(item => {
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
              label={intl.get(`${modelPrompt}.description`).d('日历描述')}
            >
              {getFieldDecorator('description', {
                initialValue: description,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.description`).d('日历描述')}
                  field="description"
                  dto="tarzan.calendar.domain.entity.MtCalendar"
                  pkvalue={{ calendarId: calendarId === 'create' ? null : calendarId }}
                  disabled={
                    calendarId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.enableFlag`).d('启用状态')}
            >
              {getFieldDecorator('enableFlag', {
                initialValue: enableFlag || 'Y',
              })(
                <Switch
                  checkedValue="Y"
                  unCheckedValue="N"
                  disabled={
                    calendarId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
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
