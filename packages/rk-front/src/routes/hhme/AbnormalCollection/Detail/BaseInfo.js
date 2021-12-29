import React, { PureComponent } from 'react';
import { Form, Input, Row, Col, Switch, Select } from 'hzero-ui';

import intl from 'utils/intl';
import { FORM_COL_3_LAYOUT, EDIT_FORM_ITEM_LAYOUT } from 'utils/constants';

const { Option } = Select;

const prefixModel = `hmes.abnormal.model.baseInfo`;

@Form.create({ fieldNameProp: null })
export default class BaseInfo extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  render() {
    const {
      form: { getFieldDecorator },
      isEdit = true,
      baseInfo = {},
      exceptionCodeList = [],
    } = this.props;
    return (
      <Form>
        <Row gutter={48}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${prefixModel}.exceptionGroupCode`).d('收集组编码')}
              {...EDIT_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('exceptionGroupCode', {
                initialValue: baseInfo.exceptionGroupCode,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefixModel}.numberRequired`).d('收集组编码'),
                    }),
                  },
                ],
              })(<Input disabled={!isEdit} />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${prefixModel}.exceptionGroupName`).d('收集组描述')}
              {...EDIT_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('exceptionGroupName', {
                initialValue: baseInfo.exceptionGroupName,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefixModel}.numberRequired`).d('收集组描述'),
                    }),
                  },
                ],
              })(<Input disabled={!isEdit} />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${prefixModel}.enableFlag`).d('启用')}
              {...EDIT_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('enableFlag', {
                initialValue: baseInfo.enableFlag !== 'N',
              })(<Switch disabled={!isEdit} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={48}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${prefixModel}.endDate`).d('业务类型')}
              {...EDIT_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('exceptionGroupType', {
                initialValue: baseInfo.exceptionGroupType,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefixModel}.numberRequired`).d('业务类型'),
                    }),
                  },
                ],
              })(
                <Select disabled={!isEdit}>
                  {exceptionCodeList.map(e => (
                    <Option key={e.typeCode} value={e.typeCode}>
                      {e.description}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
