import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Select, Row, Col, InputNumber } from 'hzero-ui';
import formatterCollections from 'utils/intl/formatterCollections';
// import { Bind } from 'lodash-decorators';

import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT_FORDRAWER,
  DRAWER_FORM_ITEM_LAYOUT_FORDRAWER,
} from '@/utils/constants';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';

const { Option } = Select;
const modelPrompt = 'tarzan.org.proline.model.proline';
/**
 * 计划属性
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
export default class PlanTab extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  state = {
    proLineType: [],
  };

  componentDidMount() {
    this.fetchRateType();
  }

  @Bind()
  fetchRateType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'relationMaintainDrawer/fetchProLineType',
      payload: {
        module: 'MODELING',
        typeGroup: 'RATE_TYPE',
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
      relationMaintainDrawer: { prodLineSchedule = {} },
      canEdit,
      prodLineId,
    } = this.props;
    const {
      rateType,
      rate,
      activity,
      orderTimeFence,
      releaseTimeFence,
      demandTimeFence,
      fixTimeFence,
      frozenTimeFence,
      forwardPlanningTimeFence,
    } = prodLineSchedule;
    const { getFieldDecorator } = form;
    const { proLineType } = this.state;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT_FORDRAWER}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT_FORDRAWER}
              label={intl.get(`${modelPrompt}.rateType`).d('速率类型')}
            >
              {getFieldDecorator('rateType', {
                initialValue: rateType || undefined,
              })(
                <Select allowClear disabled={canEdit}>
                  {proLineType.map(ele => (
                    <Option value={ele.typeCode}>{ele.description}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT_FORDRAWER}
              label={intl.get(`${modelPrompt}.rate`).d('默认速率')}
            >
              {getFieldDecorator('rate', {
                initialValue: rate,
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={100}
                  disabled={canEdit}
                  precision={6}
                  decimalSeparator={2}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT_FORDRAWER}
              label={intl.get(`${modelPrompt}.activity`).d('开动率')}
            >
              {getFieldDecorator('activity', {
                initialValue: prodLineId === 'create' ? 100 : activity,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.activity`).d('开动率'),
                    }),
                  },
                ],
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={100}
                  disabled={canEdit}
                  precision={2}
                  decimalSeparator={2}
                  formatter={value => `${value}%`}
                  parser={value => value.replace('%', '')}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT_FORDRAWER}
              label={intl.get(`${modelPrompt}.orderTimeFence`).d('订单时间栏')}
            >
              {getFieldDecorator('orderTimeFence', {
                initialValue: orderTimeFence,
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={100}
                  disabled={canEdit}
                  precision={2}
                  decimalSeparator={2}
                  formatter={value => `${value}${intl.get(`${modelPrompt}.days`).d('天')}`}
                  parser={value => value.replace(intl.get(`${modelPrompt}.days`).d('天'), '')}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT_FORDRAWER}
              label={intl.get(`${modelPrompt}.releaseTimeFence`).d('下达时间栏')}
            >
              {getFieldDecorator('releaseTimeFence', {
                initialValue: releaseTimeFence,
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={100}
                  disabled={canEdit}
                  precision={2}
                  decimalSeparator={2}
                  formatter={value => `${value}${intl.get(`${modelPrompt}.days`).d('天')}`}
                  parser={value => value.replace(intl.get(`${modelPrompt}.days`).d('天'), '')}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT_FORDRAWER}
              label={intl.get(`${modelPrompt}.demandTimeFence`).d('需求时间栏')}
            >
              {getFieldDecorator('demandTimeFence', {
                initialValue: demandTimeFence,
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={100}
                  disabled={canEdit}
                  precision={2}
                  decimalSeparator={2}
                  formatter={value => `${value}${intl.get(`${modelPrompt}.days`).d('天')}`}
                  parser={value => value.replace(intl.get(`${modelPrompt}.days`).d('天'), '')}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT_FORDRAWER}
              label={intl.get(`${modelPrompt}.fixTimeFence`).d('固定时间栏')}
            >
              {getFieldDecorator('fixTimeFence', {
                initialValue: fixTimeFence,
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={100}
                  disabled={canEdit}
                  precision={2}
                  decimalSeparator={2}
                  formatter={value => `${value}${intl.get(`${modelPrompt}.days`).d('天')}`}
                  parser={value => value.replace(intl.get(`${modelPrompt}.days`).d('天'), '')}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT_FORDRAWER}
              label={intl.get(`${modelPrompt}.frozenTimeFence`).d('冻结时间栏')}
            >
              {getFieldDecorator('frozenTimeFence', {
                initialValue: frozenTimeFence,
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={100}
                  disabled={canEdit}
                  precision={2}
                  decimalSeparator={2}
                  formatter={value => `${value}${intl.get(`${modelPrompt}.days`).d('天')}`}
                  parser={value => value.replace(intl.get(`${modelPrompt}.days`).d('天'), '')}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT_FORDRAWER}
              label={intl.get(`${modelPrompt}.forwardPlanningTimeFence`).d('顺排时间栏')}
            >
              {getFieldDecorator('forwardPlanningTimeFence', {
                initialValue: forwardPlanningTimeFence,
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={100}
                  precision={2}
                  disabled={canEdit}
                  decimalSeparator={2}
                  formatter={value => `${value}${intl.get(`${modelPrompt}.days`).d('天')}`}
                  parser={value => value.replace(intl.get(`${modelPrompt}.days`).d('天'), '')}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
