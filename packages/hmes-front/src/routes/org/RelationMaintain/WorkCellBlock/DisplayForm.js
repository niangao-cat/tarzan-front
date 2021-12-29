import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Switch, Select } from 'hzero-ui';
import { isUndefined } from 'lodash';
import formatterCollections from 'utils/intl/formatterCollections';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import intl from 'utils/intl';
import TLEditor from '@/components/TLEditor';

const modelPrompt = 'tarzan.org.workcell.model.workcell';
/**
 * 表单数据展示
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ relationMaintainDrawer }) => ({
  relationMaintainDrawer,
}))
@formatterCollections({ code: 'tarzan.org.workcell' })
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
    const { form, workcellId, editFlag, relationMaintainDrawer = {} } = this.props;
    const { workcellTypeList = [], displayList = {} } = relationMaintainDrawer;
    const {
      workcellCode,
      workcellType,
      workcellName,
      enableFlag,
      description,
      workcellLocation,
    } = displayList;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ margin: 0 }}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.workcellCode`).d('工作单元编码')}
            >
              {getFieldDecorator('workcellCode', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.workcellCode`).d('工作单元编码'),
                    }),
                  },
                ],
                initialValue: workcellCode,
              })(
                <Input
                  typeCase="upper"
                  trim
                  disabled={
                    workcellId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.workcellName`).d('工作单元短描述')}
            >
              {getFieldDecorator('workcellName', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.workcellName`).d('工作单元短描述'),
                    }),
                  },
                ],
                initialValue: workcellName,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.workcellName`).d('工作单元短描述')}
                  field="workcellName"
                  dto="tarzan.modeling.domain.entity.MtModWorkcell"
                  pkValue={{ workcellId: workcellId !== 'create' ? workcellId : null || null }}
                  inputSize={{ zh: 64, en: 64 }}
                  disabled={
                    workcellId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.description`).d('工作单元长描述')}
            >
              {getFieldDecorator('description', {
                initialValue: description,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.description`).d('工作单元长描述')}
                  field="description"
                  dto="tarzan.modeling.domain.entity.MtModWorkcell"
                  pkValue={{ workcellId: workcellId !== 'create' ? workcellId : null || null }}
                  inputSize={{ zh: 64, en: 64 }}
                  disabled={
                    workcellId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                  }
                />
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
                  disabled={
                    workcellId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.workcellType`).d('工作单元类型')}
            >
              {getFieldDecorator('workcellType', {
                initialValue: workcellType || undefined,
              })(
                <Select
                  disabled={
                    workcellId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                  }
                  allowClear
                  style={{ width: '100%' }}
                >
                  {workcellTypeList instanceof Array &&
                    workcellTypeList.length !== 0 &&
                    workcellTypeList.map(item => {
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
              label={intl.get(`${modelPrompt}.workcellLocation`).d('工作单元位置')}
            >
              {getFieldDecorator('workcellLocation', {
                initialValue: workcellLocation,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.workcellLocation`).d('工作单元位置')}
                  field="workcellLocation"
                  dto="tarzan.modeling.domain.entity.MtModWorkcell"
                  pkValue={{ workcellId: workcellId !== 'create' ? workcellId : null || null }}
                  inputSize={{ zh: 64, en: 64 }}
                  disabled={
                    workcellId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
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
