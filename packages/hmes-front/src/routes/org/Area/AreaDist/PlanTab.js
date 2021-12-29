import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, DatePicker, Row, Col, InputNumber, Select } from 'hzero-ui';
import moment from 'moment';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';

const modelPrompt = 'tarzan.org.area.model.area';
const tenantId = getCurrentOrganizationId();
/**
 * 计划属性
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
    const {
      componentDisabled,
      form,
      area: {
        areaDetailedInfo: { mtModAreaScheduleDTO },
        basicAlgorithmList,
        prodLineRuleList,
        planningPhaseTimeList,
        planningBaseList,
        releaseConcurrentRuleList,
      },
    } = this.props;
    const {
      planStartTime,
      demandTimeFence,
      forwardPlanningTimeFence,
      orderTimeFence,
      releaseTimeFence,
      frozenTimeFence,
      fixTimeFence,
      phaseType,
      planningBase,
      basicAlgorithm,
      delayTimeFence,
      followAreaId,
      followAreaCode,
      releaseConcurrentRule,
      prodLineRule,
    } = mtModAreaScheduleDTO || {};
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
                initialValue: planStartTime ? moment(planStartTime, 'YYYY-MM-DD HH:mm:ss') : '',
              })(
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: '100%' }}
                  disabled={componentDisabled}
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
                  formatter={value => `${value}${intl.get(`${modelPrompt}.day`).d('天')}`}
                  precision={2}
                  min={0}
                  parser={value => value.replace(`${intl.get(`${modelPrompt}.day`).d('天')}`, '')}
                  disabled={componentDisabled}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.phaseType`).d('区间类型')}
            >
              {getFieldDecorator('phaseType', {
                initialValue: phaseType || undefined,
              })(
                <Select disabled={componentDisabled} allowClear>
                  {planningPhaseTimeList.map(item => (
                    <Select.Option key={item.typeCode} value={item.typeCode}>
                      {item.description}
                    </Select.Option>
                  ))}
                </Select>
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
                  formatter={value => `${value}${intl.get(`${modelPrompt}.day`).d('天')}`}
                  precision={2}
                  min={0}
                  parser={value => value.replace(`${intl.get(`${modelPrompt}.day`).d('天')}`, '')}
                  disabled={componentDisabled}
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
                  formatter={value => `${value}${intl.get(`${modelPrompt}.day`).d('天')}`}
                  precision={2}
                  min={0}
                  parser={value => value.replace(`${intl.get(`${modelPrompt}.day`).d('天')}`, '')}
                  disabled={componentDisabled}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.planningBase`).d('排程类型')}
            >
              {getFieldDecorator('planningBase', {
                initialValue: planningBase || undefined,
              })(
                <Select disabled={componentDisabled} allowClear>
                  {planningBaseList.map(item => (
                    <Select.Option key={item.typeCode} value={item.typeCode}>
                      {item.description}
                    </Select.Option>
                  ))}
                </Select>
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
                  formatter={value => `${value}${intl.get(`${modelPrompt}.day`).d('天')}`}
                  precision={2}
                  min={0}
                  parser={value => value.replace(`${intl.get(`${modelPrompt}.day`).d('天')}`, '')}
                  disabled={componentDisabled}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.basicAlgorithm`).d('基础排程算法')}
            >
              {getFieldDecorator('basicAlgorithm', {
                initialValue: basicAlgorithm || undefined,
              })(
                <Select disabled={componentDisabled} allowClear>
                  {basicAlgorithmList.map(item => (
                    <Select.Option key={item.typeCode} value={item.typeCode}>
                      {item.description}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.delayTimeFence`).d('实际延迟时间')}
            >
              {getFieldDecorator('delayTimeFence', {
                initialValue: delayTimeFence,
              })(
                <InputNumber
                  defaultValue={1}
                  style={{ width: '100%' }}
                  formatter={value => `${value}${intl.get(`${modelPrompt}.hour`).d('小时')}`}
                  precision={2}
                  min={0}
                  parser={value =>
                    value.replace(`${intl.get(`${modelPrompt}.hour`).d('小时')}`, '')
                  }
                  disabled={componentDisabled}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
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
                  formatter={value => `${value}${intl.get(`${modelPrompt}.day`).d('天')}`}
                  precision={2}
                  min={0}
                  parser={value => value.replace(`${intl.get(`${modelPrompt}.day`).d('天')}`, '')}
                  disabled={componentDisabled}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.followAreaCode`).d('跟随区域')}
            >
              {getFieldDecorator('followAreaId', {
                initialValue: followAreaId,
              })(
                <Lov
                  queryParams={{ tenantId, siteType: 'SCHEDULE' }}
                  textValue={followAreaCode}
                  code="MT.AREA"
                  disabled={componentDisabled}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.releaseConcurrentRule`).d('关联下达策略')}
            >
              {getFieldDecorator('releaseConcurrentRule', {
                initialValue: releaseConcurrentRule || undefined,
              })(
                <Select disabled={componentDisabled} allowClear>
                  {releaseConcurrentRuleList.map(item => (
                    <Select.Option key={item.typeCode} value={item.typeCode}>
                      {item.description}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
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
                  formatter={value => `${value}${intl.get(`${modelPrompt}.day`).d('天')}`}
                  precision={2}
                  min={0}
                  parser={value => value.replace(`${intl.get(`${modelPrompt}.day`).d('天')}`, '')}
                  disabled={componentDisabled}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.prodLineRule`).d('选线规则')}
            >
              {getFieldDecorator('prodLineRule', {
                initialValue: prodLineRule || undefined,
              })(
                <Select disabled={componentDisabled} allowClear>
                  {prodLineRuleList.map(item => (
                    <Select.Option key={item.typeCode} value={item.typeCode}>
                      {item.description}
                    </Select.Option>
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
