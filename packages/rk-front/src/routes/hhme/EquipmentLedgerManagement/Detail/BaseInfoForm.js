/*
 * @Description: 基础信息
 * @version: 0.0.1
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-06-02 15:45:16
 */

import React, { PureComponent } from 'react';
import { Form, Row, Col, Select } from 'hzero-ui';
import {
  EDIT_FORM_ROW_LAYOUT,
  FORM_COL_4_LAYOUT,
  EDIT_FORM_ITEM_LAYOUT,
} from 'utils/constants';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.acquisition.dataItem.model.dataItem';
const { Option } = Select;

@Form.create({ fieldNameProp: null })
export default class BaseInfoForm extends PureComponent {
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
      form,
      editFlag,
      deviceDetail = {},
      applyType = [],
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <React.Fragment>
        <Form>
          <Row {...EDIT_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.applyType`).d('应用类型')}
              >
                {getFieldDecorator('applyType', {
                  initialValue: deviceDetail.applyType,
                })(
                  <Select allowClear disabled={editFlag}>
                    {applyType.map(ele => (
                      <Option value={ele.value} key={ele.value}>{ele.meaning}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}
