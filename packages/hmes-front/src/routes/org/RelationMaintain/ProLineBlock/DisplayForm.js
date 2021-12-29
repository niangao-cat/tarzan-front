import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Switch, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import TLEditor from '@/components/TLEditor';

const modelPrompt = 'tarzan.org.proline.model.proline';
const { Option } = Select;
/**
 * 表单数据展示
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ relationMaintainDrawer }) => ({
  relationMaintainDrawer,
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.org.proline',
})
export default class DisplayForm extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  state = {
    proLineType: [],
  };

  componentDidMount() {
    this.fetchProLineType();
  }

  /**
   *@functionName: fetchProLineType
   *@description 获取生产线类型
   *@author: 唐加旭
   *@date: 2019-08-19 17:30:31
   *@version: V0.0.1
   * */
  @Bind()
  fetchProLineType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'relationMaintainDrawer/fetchProLineType',
      payload: {
        module: 'MODELING',
        typeGroup: 'PROD_LINE_TYPE',
      },
    }).then(res => {
      if (res && res.rows) {
        this.setState({
          proLineType: res.rows,
        });
      }
    });
  };

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      form,
      prodLineId,
      relationMaintainDrawer: { productionLine = {} },
      canEdit,
    } = this.props;
    const { prodLineCode, prodLineType, prodLineName, enableFlag, description } = productionLine;
    const { getFieldDecorator } = form;
    const { proLineType } = this.state;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ margin: 0 }}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.prodLineCode`).d('生产线编码')}
            >
              {getFieldDecorator('prodLineCode', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.prodLineCode`).d('生产线编码'),
                    }),
                  },
                ],
                initialValue: prodLineCode,
              })(
                <Input
                  typeCase="upper"
                  trim
                  inputChinese={false}
                  disabled={canEdit || prodLineCode}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.prodLineName`).d('生产线短描述')}
            >
              {getFieldDecorator('prodLineName', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.prodLineName`).d('生产线短描述'),
                    }),
                  },
                ],
                initialValue: prodLineName,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.prodLineName`).d('生产线短描述')}
                  field="prodLineName"
                  disabled={canEdit}
                  dto="tarzan.modeling.domain.entity.MtModProductionLine"
                  pkValue={{ prodLineId: prodLineId === 'create' ? null : prodLineId }}
                  inputSize={{ zh: 64, en: 64 }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.description`).d('生产线长描述')}
            >
              {getFieldDecorator('description', {
                initialValue: description,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.description`).d('生产线长描述'),
                    }),
                  },
                ],
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.description`).d('生产线长描述')}
                  field="description"
                  disabled={canEdit}
                  dto="tarzan.modeling.domain.entity.MtModProductionLine"
                  pkValue={{ prodLineId: prodLineId === 'create' ? null : prodLineId }}
                  inputSize={{ zh: 64, en: 64 }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ margin: 0 }}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.prodLineTypeDesc`).d('生产线类型')}
            >
              {getFieldDecorator('prodLineType', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.prodLineTypeDesc`).d('生产线类型'),
                    }),
                  },
                ],
                initialValue: prodLineType || undefined,
              })(
                <Select disabled={canEdit} allowClear style={{ width: '100%' }}>
                  {proLineType.map(ele => (
                    <Option value={ele.typeCode}>{ele.description}</Option>
                  ))}
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
                initialValue: enableFlag === 'Y',
              })(<Switch disabled={canEdit} />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
