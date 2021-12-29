/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description：cos 出站查询
 */

import React, { Component } from 'react';
import { Bind } from 'lodash-decorators';
import { isFunction } from 'lodash';
import { Form, Button, Col, Row, DatePicker, Input, Select } from 'hzero-ui';

import moment from 'moment';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';
import { getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';
import intl from 'utils/intl';

const tenantId = getCurrentOrganizationId();


@Form.create({ fieldNameProp: null })
export default class CosOutboundQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
    };
    if(isFunction(props.onRef)) {
      props.onRef(this);
    }
  }


  // 设置展开/关闭 更多查询
  @Bind()
  setExpandForm() {
    this.setState({ expandForm: !this.state.expandForm });
  }

  // 重置查询
  @Bind()
  resetSearch() {
    const { form, onSearch } = this.props;
    form.resetFields();
    if (onSearch) {
      onSearch();
    }
  };

  @Bind()
  handleSearch() {
    const { onSearch } = this.props;
    if(onSearch) {
      onSearch();
    }
  }

  render() {
    const { defaultSite = {}, jobMap = [], cosTypeMap = [] } = this.props;
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col span="5">
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="工厂">
              {getFieldDecorator('siteId', {
                initialValue: defaultSite.siteId,
              })(
                <Lov
                  code="MT.SITE"
                  textValue={defaultSite.siteName}
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          </Col>
          <Col span="5">
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='作业平台类型'
            >
              {getFieldDecorator('jobType', {
                initialValue: jobMap.map( item => item.value),
                rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '作业平台类型',
                      }),
                    },
                ],
              }
              )(
                <Select
                  mode="multiple"
                  allowClear
                  maxTagCount={1}
                >
                  {jobMap.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span="5">
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='产品编码'
            >
              {getFieldDecorator('productionCode')(<Input trim />)}
            </Form.Item>
          </Col>
          <Col span="5">
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='产品名称'
            >
              {getFieldDecorator('productionName')(<Input trim />)}
            </Form.Item>
          </Col>

          <Col span="4" className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={this.setExpandForm}>
                {this.state.expandForm
                  ? intl.get('hzero.common.button.collected').d('收起查询')
                  : intl.get(`hzero.common.button.viewMore`).d('更多查询')}
              </Button>
              <Button onClick={this.resetSearch}>
                {intl.get(`hzero.common.button.reset`).d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.handleSearch}>
                {intl.get(`hzero.common.button.search`).d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>

        <Row
          {...SEARCH_FORM_ROW_LAYOUT}
          style={{ display: this.state.expandForm ? '' : 'none' }}
        >
          <Col span="5">
            <Form.Item
              label={intl.get(`materialLotCode`).d('芯片盒子')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('materialLotCode')(<Input trim />)}
            </Form.Item>
          </Col>

          <Col span="5">
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="物料编码">
              {getFieldDecorator('materialCode')(<Input trim />)}
            </Form.Item>
          </Col>
          <Col span="5">
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="物料描述">
              {getFieldDecorator('materialName')(<Input trim />)}
            </Form.Item>
          </Col>
          <Col span="5">
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='工位'
            >
              {getFieldDecorator('workCellId')(<Lov code="MT.WORK_STATION" queryParams={{ tenantId }} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row
          {...SEARCH_FORM_ROW_LAYOUT}
          style={{ display: this.state.expandForm ? '' : 'none' }}
        >
          <Col span="5">
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='进站时间从'
            >
              {getFieldDecorator('siteInDateFrom')(
                <DatePicker
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('siteInDateTo') &&
                    moment(getFieldValue('siteInDateTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col span="5">
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='进站时间至'
            >
              {getFieldDecorator('siteInDateTo')(
                <DatePicker
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('siteInDateFrom') &&
                    moment(getFieldValue('siteInDateFrom')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col span="5">
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='出站时间从'
            >
              {getFieldDecorator('siteOutDateFrom')(
                <DatePicker
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('siteOutDateTo') &&
                    moment(getFieldValue('siteOutDateTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col span="5">
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='出站时间至'
            >
              {getFieldDecorator('siteOutDateTo')(
                <DatePicker
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('siteOutDateFrom') &&
                    moment(getFieldValue('siteOutDateFrom')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row
          {...SEARCH_FORM_ROW_LAYOUT}
          style={{ display: this.state.expandForm ? '' : 'none' }}
        >
          <Col span="5">
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="WAFER">
              {getFieldDecorator('waferNum')(<Input trim />)}
            </Form.Item>
          </Col>
          <Col span="5">
            <Form.Item
              label={intl.get(`workOrderNum`).d('工单号')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('workOrderNum')(<Input trim />)}
            </Form.Item>
          </Col>
          <Col span="5">
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='COS类型'
            >
              {getFieldDecorator('cosType')(
                <Select allowClear>
                  {cosTypeMap.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span="5">
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='设备'
            >
              {getFieldDecorator('equipmentId')(<Lov code="HME.EQUIPMENT" queryParams={{ tenantId }} />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
