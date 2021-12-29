import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Input, Select, notification } from 'hzero-ui';
import Lov from 'components/Lov';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';

import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT_FORDRAWER,
  DRAWER_FORM_ITEM_LAYOUT_FORDRAWER,
} from '@/utils/constants';
import intl from 'utils/intl';
import DispatchDrawer from './DispatchDrawer';

const modelPrompt = 'tarzan.org.proline.model.proline';
const { Option } = Select;
/**
 * 生产属性表单数据展示
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
export default class ProduceTab extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  state = {
    proLineType: [],
    strategyType: [],
    visible: false, // 指定调度工艺模态框是否可见
  };

  componentDidMount() {
    this.dispatchMethod();
  }

  @Bind()
  dispatchMethod = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'relationMaintainDrawer/fetchProLineType',
      payload: {
        module: 'MODELING',
        typeGroup: 'DISPATCH_METHOD',
      },
    }).then(res => {
      if (res && res.rows) {
        this.setState({
          proLineType: res.rows,
        });
      }
    });
    dispatch({
      type: 'relationMaintainDrawer/fetchProLineType',
      payload: {
        module: 'DISPATCH',
        typeGroup: 'DISPATCH_STRATEGY',
      },
    }).then(res => {
      if (res && res.success) {
        this.setState({
          strategyType: res.rows,
        });
      }
    });
  };

  @Bind()
  changeValue = (_, record, type) => {
    const { form } = this.props;
    form.setFieldsValue({
      [type]: record.locatorName,
    });
  };

  /**
   *@functionName:   onClick
   *@description: 打开制定调度工艺模态框
   *@author: 唐加旭
   *@date: 2019-08-19 10:19:48
   *@version: V0.0.1
   * */
  @Bind()
  onClick = () => {
    const {
      dispatch,
      prodLineId,
      relationMaintainDrawer: { productionLine = {} },
    } = this.props;
    if (prodLineId !== 'create') {
      dispatch({
        type: 'relationMaintainDrawer/featchDispatchList',
        payload: {
          prodLineId: productionLine.prodLineId,
        },
      }).then(res => {
        if (res && res.success) {
          this.setState({
            visible: true,
          });
        }
      });
    } else {
      notification.info({
        message: intl.get(`${modelPrompt}.save.first`).d('需要先保存当前数据，再维护相关工艺'),
      });
    }
  };

  /**
   *@functionName:   onCancel
   *@description: 关闭制定调度工艺模态框
   *@author: 唐加旭
   *@date: 2019-08-19 10:19:48
   *@version: V0.0.1
   * */
  @Bind()
  onCancel = () => {
    this.setState({
      visible: false,
    });
  };

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      form,
      relationMaintainDrawer: { prodLineManufacturing = {} },
      prodLineId,
      canEdit,
    } = this.props;
    const {
      issuedLocatorId,
      completionLocatorId,
      inventoryLocatorId,
      issuedLocatorCode,
      completionLocatorCode,
      inventoryLocatorCode,
      issuedLocatorName,
      completionLocatorName,
      inventoryLocatorName,
      dispatchMethod,
      dispatchStrategy,
    } = prodLineManufacturing;
    const { getFieldDecorator, getFieldValue } = form;
    const { proLineType, strategyType, visible } = this.state;
    const tenantId = getCurrentOrganizationId();
    return (
      <>
        <Form>
          <Row {...SEARCH_FORM_ROW_LAYOUT_FORDRAWER}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT_FORDRAWER}
                label={intl.get(`${modelPrompt}.issuedLocatorCode`).d('默认发料库位编码')}
              >
                {getFieldDecorator('issuedLocatorId', {
                  initialValue: issuedLocatorId,
                })(
                  <Lov
                    code="MT.LOCATOR"
                    disabled={canEdit}
                    textValue={issuedLocatorCode}
                    queryParams={{ tenantId }}
                    onChange={(value, record) =>
                      this.changeValue(value, record, 'issuedLocatorName')
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT_FORDRAWER}
                label={intl.get(`${modelPrompt}.completionLocatorCode`).d('默认完工库位编码')}
              >
                {getFieldDecorator('completionLocatorId', {
                  initialValue: completionLocatorId,
                })(
                  <Lov
                    code="MT.LOCATOR"
                    disabled={canEdit}
                    textValue={completionLocatorCode}
                    queryParams={{ tenantId }}
                    onChange={(value, record) =>
                      this.changeValue(value, record, 'completionLocatorName')
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT_FORDRAWER}
                label={intl.get(`${modelPrompt}.inventoryLocatorCode`).d('默认入库库位编码')}
              >
                {getFieldDecorator('inventoryLocatorId', {
                  initialValue: inventoryLocatorId,
                })(
                  <Lov
                    code="MT.LOCATOR"
                    disabled={canEdit}
                    textValue={inventoryLocatorCode}
                    queryParams={{ tenantId }}
                    onChange={(value, record) =>
                      this.changeValue(value, record, 'inventoryLocatorName')
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT_FORDRAWER}
                label={intl.get(`${modelPrompt}.issuedLocatorName`).d('默认发料库位描述')}
              >
                {getFieldDecorator('issuedLocatorName', {
                  initialValue: issuedLocatorName,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT_FORDRAWER}
                label={intl.get(`${modelPrompt}.completionLocatorName`).d('默认完工库位描述')}
              >
                {getFieldDecorator('completionLocatorName', {
                  initialValue: completionLocatorName,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT_FORDRAWER}
                label={intl.get(`${modelPrompt}.inventoryLocatorName`).d('默认入库库位描述')}
              >
                {getFieldDecorator('inventoryLocatorName', {
                  initialValue: inventoryLocatorName,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT_FORDRAWER}
                label={intl.get(`${modelPrompt}.dispatchStrategy`).d('调度策略')}
              >
                {getFieldDecorator('dispatchStrategy', {
                  initialValue: dispatchStrategy,
                })(
                  <Select allowClear disabled={canEdit}>
                    {strategyType.map(ele => (
                      <Option value={ele.typeCode}>{ele.description}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT_FORDRAWER}
                label={intl.get(`${modelPrompt}.dispatchMethod`).d('调度方式')}
              >
                {getFieldDecorator('dispatchMethod', {
                  initialValue: dispatchMethod || undefined,
                })(
                  <Select allowClear disabled={canEdit}>
                    {proLineType.map(ele => (
                      <Option value={ele.typeCode}>{ele.description}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            {getFieldValue('dispatchMethod') === 'SPECIAL_OPERATION' && (
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT_FORDRAWER}
                  label={intl.get(`${modelPrompt}.setDispatchOperation`).d('指定调度工艺')}
                >
                  {getFieldDecorator('forswardDescd', {})(
                    <a onClick={this.onClick} disabled={canEdit}>
                      {intl.get(`${modelPrompt}.dispatchOperation`).d('调度工艺')}
                    </a>
                  )}
                </Form.Item>
              </Col>
            )}
          </Row>
        </Form>
        <DispatchDrawer visible={visible} onCancel={this.onCancel} prodLineId={prodLineId} />
      </>
    );
  }
}
