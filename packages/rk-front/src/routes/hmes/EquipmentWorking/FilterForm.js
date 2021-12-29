import React from 'react';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  // DEFAULT_DATE_FORMAT,
} from 'utils/constants';
import { Form, Button, Col, Row, DatePicker, Input } from 'hzero-ui';
import { isFunction } from 'lodash';
import Lov from 'components/Lov';
import moment from 'moment';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();


// 表单创建
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {};
  }

  // 查询方法
  @Bind
  onSearch = () => {
    const { onSearch, form } = this.props;
    form.validateFields((errs) => {
      if (!errs) {
        onSearch();
      }
    });
  };

  // 重置查询
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
  };

  render() {
    const { form, defaultDate} = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='资产编码'
            >
              {getFieldDecorator('equipmentId', {})(
                <Lov
                  code="HME.ASSET"
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='部门'
            >
              {getFieldDecorator('areaId', {})(
                <Lov
                  code="HME.BUSINESS_AREA"
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='车间'
            >
              {getFieldDecorator('workShopId', {})(
                <Lov
                  code="HME_WORK_SHOP"
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={this.handleFormReset}>
                {intl.get(`hzero.common.button.reset`).d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.onSearch.bind(this)}>
                {intl.get(`hzero.common.button.search`).d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='运行时间从'
            >
              {getFieldDecorator('creationDateFrom', {
                initialValue: defaultDate.creationDateFrom,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                    name: '运行时间从',
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('creationDateTo') &&
                    (moment(getFieldValue('creationDateTo')).isBefore(currentDate, 'second') ||
                    moment(getFieldValue('creationDateTo')).subtract('days', 30).isAfter(currentDate, 'second'))
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='运行时间至'
            >
              {getFieldDecorator('creationDateTo', {
                initialValue: defaultDate.creationDateTo,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                    name: '运行时间至',
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('creationDateFrom') &&
                    (moment(getFieldValue('creationDateFrom')).subtract('days', -30).isBefore(currentDate, 'second')||
                    moment(getFieldValue('creationDateFrom')).isAfter(currentDate, 'second'))
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='设备名称'
            >
              {getFieldDecorator('assetName', {
              })(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='设备类别'
            >
              {getFieldDecorator('equipmentCategory', {})(
                <Lov
                  code="HME.EQUIPMENT_CATEGORY"
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
