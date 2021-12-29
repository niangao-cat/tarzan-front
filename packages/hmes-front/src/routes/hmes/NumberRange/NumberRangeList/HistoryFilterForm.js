/**
 * FilterForm - 历史搜索框
 * @date: 2019-8-22
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, DatePicker, Row, Col } from 'hzero-ui';
import moment from 'moment';
// import {isUndefined} from 'lodash';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
// import notification from 'utils/notification';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_3_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
// import { getCurrentOrganizationId } from 'utils/utils';

const modelPrompt = 'tarzan.mes.numR.model.numR';

/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 搜索框
 * @extends {Component} - React.Component
 * @reactProps {Object} siteList - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ numberRange, loading }) => ({
  numberRange,
  fetchMessageLoading: loading.effects['numberRange/fetchNumberRangeList'],
}))
@Form.create({ fieldNameProp: null })
export default class HistoryFilterForm extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  /**
   * 查询数据
   * @param {object} page 页面基本信息数据
   */
  @Bind()
  fetchQueryList(pagination = {}) {
    const { form, dispatch, initData } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        const startTime = fieldsValue.startTime
          ? fieldsValue.startTime.format(DEFAULT_DATETIME_FORMAT)
          : moment()
              .subtract(6, 'months')
              .format('YYYY-MM-DD HH:mm:ss');
        const endTime = fieldsValue.endTime
          ? fieldsValue.endTime.format(DEFAULT_DATETIME_FORMAT)
          : moment().format('YYYY-MM-DD HH:mm:ss');
        dispatch({
          type: 'numberRange/fetchHistoryList',
          payload: {
            startTime,
            endTime,
            objectId: initData.objectId,
            numrangeGroup: initData.numrangeGroup,
            page: pagination,
          },
        });
      }
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.startTime`).d('查询时间从')}
            >
              {getFieldDecorator('startTime', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.startTime`).d('查询时间从'),
                    }),
                  },
                ],
                initialValue: moment(
                  moment()
                    .subtract(6, 'months')
                    .format('YYYY-MM-DD HH:mm:ss')
                ),
              })(
                <DatePicker
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: '100%' }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.endTime`).d('查询时间至')}
            >
              {getFieldDecorator('endTime', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.endTime`).d('查询时间至'),
                    }),
                  },
                ],
                initialValue: moment(moment().format('YYYY-MM-DD HH:mm:ss')),
              })(
                <DatePicker
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: '100%' }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <FormItem>
              <Button type="primary" htmlType="submit" onClick={this.fetchQueryList}>
                {intl.get('tarzan.mes.numR.button.search').d('查询')}
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
