
import React from 'react';
import { Form, Button, Input, Row, Col, DatePicker } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import moment from 'moment';
import { getDateTimeFormat } from 'utils/utils';
import { isUndefined } from 'lodash';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';

const modelPrompt = 'tarzan.itfObjectTransactionIface';

/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      expandForm: false,
    };
  }

  // 查询条件展开/收起
  @Bind
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({ expandForm: !expandForm });
  };

  /**
   * 查询数据
   * @param {object} page 页面基本信息数据
   */
  @Bind()
  fetchQueryList() {
    const { form, onSearch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = { ...fieldsValue,
          transactionDateStart: isUndefined(fieldsValue.transactionDateStart)
          ? null
          : moment(fieldsValue.transactionDateStart).format(DEFAULT_DATETIME_FORMAT),
          transactionDateEnd: isUndefined(fieldsValue.transactionDateEnd)
          ? null
          : moment(fieldsValue.transactionDateEnd).format(DEFAULT_DATETIME_FORMAT),
         };
        onSearch(values);
      }
    });
  }

  /**
   * 重置form表单
   */
  @Bind()
  handleFormReset() {
    const { form, handleFormReset } = this.props;

    // 重置form
    form.resetFields();

    // 重置数据
    handleFormReset();
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { form } = this.props;
    const { expandForm } = this.state;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.materialCode`).d('物料编码')}
            >
              {getFieldDecorator('materialCode')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.transactionDateStart`).d('事务开始时间')}
            >
              {getFieldDecorator('transactionDateStart', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.siteName`).d('事务开始时间'),
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('transactionDateEnd') &&
                    moment(getFieldValue('transactionDateEnd')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.transactionDateEnd`).d('事务结束时间')}
            >
              {getFieldDecorator('transactionDateEnd', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.siteName`).d('事务结束时间'),
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('transactionDateStart') &&
                    moment(getFieldValue('transactionDateStart')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <FormItem>
              <Button onClick={this.toggleForm}>
                {expandForm
                  ? intl.get('tarzan.calendar.working.button.collected').d('收起查询')
                  : intl.get(`tarzan.calendar.working.button.viewMore`).d('更多查询')}
              </Button>
              <Button onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.fetchQueryList}>
                {intl.get('tarzan.calendar.working.button.search').d('查询')}
              </Button>
            </FormItem>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.warehouseCode`).d('来源仓库')}
            >
              {getFieldDecorator('warehouseCode')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.locatorCode`).d('来源货位')}
            >
              {getFieldDecorator('locatorCode')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.workOrderNum`).d('工单号')}
            >
              {getFieldDecorator('workOrderNum')(<Input />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.processStatus`).d('处理状态')}
            >
              {getFieldDecorator('processStatus')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.lotNumber`).d('批次')}
            >
              {getFieldDecorator('lotNumber')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.moveType`).d('移动类型')}
            >
              {getFieldDecorator('moveType')(<Input />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.mergeId`).d('接口汇总ID')}
            >
              {getFieldDecorator('mergeId')(<Input />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
