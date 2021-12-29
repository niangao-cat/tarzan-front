import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, DatePicker, Row, Col, InputNumber } from 'hzero-ui';
import { isUndefined } from 'lodash';
import moment from 'moment';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.org.site.model.site';
/**
 * 计划属性
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ site }) => ({
  site,
}))
@Form.create({ fieldNameProp: null })
export default class PlanTab extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, site, editFlag, siteId } = this.props;
    let { planList } = site;
    if (planList === null) {
      planList = {};
    }
    const {
      planStartTime,
      demandTimeFence,
      forwardPlanningTimeFence,
      orderTimeFence,
      releaseTimeFence,
      frozenTimeFence,
      fixTimeFence,
    } = planList;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.planStartTime`).d('计划滚动开始时间')}
            >
              {getFieldDecorator('planStartTime', {
                initialValue: !planStartTime
                  ? planStartTime
                  : moment(planStartTime, 'YYYY-MM-DD HH:mm:ss'),
              })(
                <DatePicker
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: '100%' }}
                  disabled={siteId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.forwardPlanningTimeFence`).d('顺排时间栏')}
            >
              {getFieldDecorator('forwardPlanningTimeFence', {
                initialValue: forwardPlanningTimeFence,
              })(
                <InputNumber
                  defaultValue={1}
                  style={{ width: '100%' }}
                  min={0}
                  formatter={value => `${value}${intl.get(`${modelPrompt}.day`).d('天')}`}
                  precision={2}
                  parser={value => value.replace(`${intl.get(`${modelPrompt}.day`).d('天')}`, '')}
                  disabled={siteId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.orderTimeFence`).d('订单时间栏')}
            >
              {getFieldDecorator('orderTimeFence', {
                initialValue: orderTimeFence,
              })(
                <InputNumber
                  defaultValue={1}
                  style={{ width: '100%' }}
                  min={0}
                  formatter={value => `${value}${intl.get(`${modelPrompt}.day`).d('天')}`}
                  precision={2}
                  parser={value => value.replace(`${intl.get(`${modelPrompt}.day`).d('天')}`, '')}
                  disabled={siteId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.demandTimeFence`).d('需求时间栏')}
            >
              {getFieldDecorator('demandTimeFence', {
                initialValue: demandTimeFence,
              })(
                <InputNumber
                  defaultValue={1}
                  style={{ width: '100%' }}
                  min={0}
                  formatter={value => `${value}${intl.get(`${modelPrompt}.day`).d('天')}`}
                  precision={2}
                  parser={value => value.replace(`${intl.get(`${modelPrompt}.day`).d('天')}`, '')}
                  disabled={siteId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.releaseTimeFence`).d('下达时间栏')}
            >
              {getFieldDecorator('releaseTimeFence', {
                initialValue: releaseTimeFence,
              })(
                <InputNumber
                  defaultValue={1}
                  style={{ width: '100%' }}
                  min={0}
                  formatter={value => `${value}${intl.get(`${modelPrompt}.day`).d('天')}`}
                  precision={2}
                  parser={value => value.replace(`${intl.get(`${modelPrompt}.day`).d('天')}`, '')}
                  disabled={siteId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.frozenTimeFence`).d('冻结时间栏')}
            >
              {getFieldDecorator('frozenTimeFence', {
                initialValue: frozenTimeFence,
              })(
                <InputNumber
                  defaultValue={1}
                  style={{ width: '100%' }}
                  min={0}
                  formatter={value => `${value}${intl.get(`${modelPrompt}.day`).d('天')}`}
                  precision={2}
                  parser={value => value.replace(`${intl.get(`${modelPrompt}.day`).d('天')}`, '')}
                  disabled={siteId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.fixTimeFence`).d('固定时间栏')}
            >
              {getFieldDecorator('fixTimeFence', {
                initialValue: fixTimeFence,
              })(
                <InputNumber
                  defaultValue={1}
                  style={{ width: '100%' }}
                  min={0}
                  formatter={value => `${value}${intl.get(`${modelPrompt}.day`).d('天')}`}
                  precision={2}
                  parser={value => value.replace(`${intl.get(`${modelPrompt}.day`).d('天')}`, '')}
                  disabled={siteId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
