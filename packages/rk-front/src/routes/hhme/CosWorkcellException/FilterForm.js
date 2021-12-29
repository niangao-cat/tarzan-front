/*
 * @Description: 工位加工异常搜索
 * @version: 0.1.0
 * @Author: junfeng.chen@hand-china.com
 * @Date: 2021-01-13 09:02:39
 */


import React, { Component } from 'react';
import { Form, Button, Input, Row, Col, Select, DatePicker } from 'hzero-ui';
import cacheComponent from 'components/CacheComponent';
import { Bind, Throttle } from 'lodash-decorators';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import { getDateTimeFormat } from 'utils/utils';
import { isFunction } from 'lodash';
import {
  DEBOUNCE_TIME,
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';
import moment from 'moment';
import MultipleLov from '../../../components/MultipleLov/index';
import ModalContainer, { registerContainer } from '../../../components/Modal/ModalContainer';


/**
 *  页面搜索框
 * @extends {Component} - React.Component
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
@cacheComponent({ cacheKey: '/hhme/cos-workcell-exception' })
class FilterForm extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
      expandForm: false,
    };
  }

  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
  }

  /**
   * 表单校验
   */
  @Bind()
  handleSearch() {
    const { onSearch, form } = this.props;
    if (onSearch) {
      form.validateFields(err => {
        if (!err) {
          onSearch();
        }
      });
    }
  }

  @Throttle(DEBOUNCE_TIME)
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  }

  // 联动清空
  @Bind()
  resetWithFields(type) {
    const { form } = this.props;
    switch (type) {
      case 'prodLineId':
        form.resetFields([
          'workcellLineId',
          'workcellProcessId',
          'workcellStationId',
        ]);
        break;
      case 'workcellLineId':
        form.resetFields([
          'workcellProcessId',
          'workcellStationId',
        ]);
        break;
      case 'workcellProcessId':
        form.resetFields([
          'workcellStationId',
        ]);
        break;
      default:
        break;
    }
  };

  /**
   * render
   * @returns React.element
   */
  render() {
    const modelPrompt = 'hhme.workcellException.model.workcellException';
    const {
      form,
      tenantId,
      docTypeMap,
    } = this.props;
    const { expandForm = false } = this.state;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='开始时间'
            >
              {getFieldDecorator('startDate', {
                rules: [
                  {
                    required: !getFieldValue('workOrderNum'),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '开始时间',
                    }),
                  },
                ],
              })(
                <DatePicker
                  placeholder=""
                  style={{ width: '100%' }}
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('endDate') &&
                    moment(getFieldValue('endDate')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='结束时间'
            >
              {getFieldDecorator('endDate', {
                rules: [
                  {
                    required: !getFieldValue('workOrderNum'),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '结束时间',
                    }),
                  },
                ],
              })(
                <DatePicker
                  placeholder=""
                  style={{ width: '100%' }}
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('startDate') &&
                    moment(getFieldValue('startDate')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.id`).d('操作人')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('id', {})(
                <Lov code="HME.USER" queryParams={{ tenantId }} textField="realName" />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={this.toggleForm}>
                {expandForm
                  ? intl.get('hzero.common.button.collected').d('收起查询')
                  : intl.get('hzero.common.button.viewMore').d('更多查询')}
              </Button>
              <Button data-code="reset" onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button
                data-code="search"
                type="primary"
                htmlType="submit"
                onClick={this.handleSearch}
              >
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.workOrderNum`).d('工单')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('workOrderNum', {})(<Input trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.materialId`).d('产品编码')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('materialId', {})(
                <MultipleLov code="HME.SITE_MATERIAL" queryParams={{ tenantId }} textField="materialCode" />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.prodLineId`).d('产线')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('prodLineId', {})(
                <MultipleLov
                  code="HME.FINAL_PRODLINE"
                  queryParams={{ tenantId }}
                  onChange={() => this.resetWithFields('prodLineId')}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.workcellLineId`).d('工段')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('workcellLineId', {})(
                <MultipleLov
                  code="HME.FINAL_LINE"
                  onChange={() => this.resetWithFields('workcellLineId')}
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'),
                    tenantId,
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.workcellProcessId`).d('工序')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('workcellProcessId', {})(
                <MultipleLov
                  code="HME.FINAL_PROCESS"
                  onChange={() => this.resetWithFields('workcellProcessId')}
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'),
                    lineWorkcellId: getFieldValue('workcellLineId'),
                    tenantId,
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.workcellStationId`).d('工位')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('workcellStationId', {})(
                <MultipleLov
                  code="HME.FINAL_WORKCELL"
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'),
                    lineWorkcellId: getFieldValue('workcellLineId'),
                    processId: getFieldValue('workcellProcessId'),
                    tenantId,
                  }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.cosType`).d('COS类型')}
            >
              {getFieldDecorator('cosType', {})(
                <Select allowClear>
                  {docTypeMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.waferNum`).d('WAFER')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('waferNum', {})(<Input trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.ncCodeId`).d('不良代码')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('ncCodeId', {})(
                <MultipleLov
                  code="MT.NC_CODE"
                  queryParams={{ tenantId }}
                  textField="ncCode"
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <ModalContainer ref={registerContainer} />
      </Form>
    );
  }
}

export default FilterForm;
