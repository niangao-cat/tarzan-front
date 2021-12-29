/**
 * AchievementAttrForm - 生产属性
 * @date 2019-12-19
 * @author 许碧婷 <biting.xu@hand-china.com>
 * @version 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Row, Col, Input, DatePicker } from 'hzero-ui';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.workshop.productionOrderMgt.model.productionOrderMgt';

@connect(({ productionOrderMgt }) => ({
  productionOrderMgt,
}))
@Form.create()
export default class AchievementAttrForm extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  render() {
    const {
      form,
      productionOrderMgt: { workOrderDetail = {} },
    } = this.props;
    const { getFieldDecorator } = form;
    const {
      actualStartTime,
      actualEndDate,
      completedQty,
      releasedQty,
      scrappedQty,
      holdQty,
    } = workOrderDetail;

    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.actualStartTime`).d('实绩开始时间')}
            >
              {getFieldDecorator('actualStartTime', {
                initialValue: actualStartTime ? moment(actualStartTime) : null,
              })(
                <DatePicker
                  style={{ width: '100%' }}
                  disabled
                  placeholder={intl.get(`${modelPrompt}.actualStartTime`).d('实绩开始时间')}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.actualEndDate`).d('实绩结束时间')}
            >
              {getFieldDecorator('actualEndDate', {
                initialValue: actualEndDate ? moment(actualEndDate) : null,
              })(
                <DatePicker
                  style={{ width: '100%' }}
                  disabled
                  placeholder={intl.get(`${modelPrompt}.actualEndDate`).d('实绩结束时间')}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.releasedTotalQty`).d('累计下达数量')}
            >
              {getFieldDecorator('releasedQty', {
                initialValue: releasedQty,
              })(<Input style={{ width: '100%' }} disabled />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.completedTotalQty`).d('累计完成数量')}
            >
              {getFieldDecorator('completedQty', {
                initialValue: completedQty,
              })(<Input style={{ width: '100%' }} disabled />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.holdQty`).d('保留数量')}
            >
              {getFieldDecorator('holdQty', {
                initialValue: holdQty,
              })(<Input style={{ width: '100%' }} disabled />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.scrappedTotalQty`).d('累计报废数量')}
            >
              {getFieldDecorator('scrappedQty', {
                initialValue: scrappedQty,
              })(<Input style={{ width: '100%' }} disabled />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
