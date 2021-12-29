import React from 'react';
import { Form, Button, Col, Row, Select, DatePicker, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import { uniq } from 'lodash';

import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';
import { getDateTimeFormat } from 'utils/utils';


const modelPrompt = 'tarzan.hmes.purchaseOrder';

// model 层连接
@formatterCollections({ code: 'tarzan.hmes.abnormalCollection' })
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      materialCodeList: [],
      snNumList: [],
    };
    props.onRef(this);
  }

  // 查询条件展开/收起
  @Bind()
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({ expandForm: !expandForm });
  };

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

  @Bind()
  handleOnSearch(value, dataListName) {
    const { [dataListName]: dataSource } = this.state;
    const { form } = this.props;
    const flag = value ? value.every(e => dataSource.includes(e)) : false;
    if (value && value.length > 0 && !flag) {
      const newList = [].concat(...value.map(e => e.split(/[ ]+/)));
      const uniqueList = uniq(dataSource.concat(newList));
      this.setState({ [dataListName]: uniqueList });
      form.setFieldsValue({ [dataListName]: uniqueList });
    }
  }


  // 渲染
  render() {
    const { form, defaultSite = {}, siteList = [] } = this.props;
    const { getFieldDecorator, getFieldValue, resetFields } = form;
    const { expandForm, materialCodeList, snNumList } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col span={18}>
            <Row>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  label={intl.get(`${modelPrompt}.site`).d('工厂')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('siteId', {
                    initialValue: defaultSite.siteId,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '工厂',
                        }),
                      },
                    ],
                  })(
                    <Select
                      allowClear
                      onChange={() => {
                        resetFields(['warehouseId', 'locatorId']);
                      }}
                    >
                      {siteList.map(item => (
                        <Select.Option key={item.siteId}>{item.siteName}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='接收SN'
                >
                  {getFieldDecorator('snNumList')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'snNumList')}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({ snNumList: [] });
                          }
                        }
                      }
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {snNumList.map(e => (
                        <Select.Option key={e} value={e}>
                          {e}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.site`).d('产品编码')}
                >
                  {getFieldDecorator('materialCodeList')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'materialCodeList')}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({ materialCodeList: [] });
                          }
                        }
                      }
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {materialCodeList.map(e => (
                        <Select.Option key={e} value={e}>
                          {e}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ display: expandForm ? '' : 'none' }}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='登记时间起'
                >
                  {getFieldDecorator('receiveDateStart')(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                      getFieldValue('receiveDateEnd') &&
                        moment(getFieldValue('receiveDateEnd')).isBefore(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='登记时间至'
                >
                  {getFieldDecorator('receiveDateEnd')(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                      getFieldValue('receiveDateStart') &&
                        moment(getFieldValue('receiveDateStart')).isAfter(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='型号'
                >
                  {getFieldDecorator('model')(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='SAP信息返回时间起'
                >
                  {getFieldDecorator('sapReturnDateStart')(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                      getFieldValue('sapReturnDateEnd') &&
                        moment(getFieldValue('sapReturnDateEnd')).isBefore(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='SAP信息返回时间至'
                >
                  {getFieldDecorator('sapReturnDateEnd')(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                      getFieldValue('sapReturnDateStart') &&
                        moment(getFieldValue('sapReturnDateStart')).isAfter(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='维修订单号'
                >
                  {getFieldDecorator('repairWorkOrderNum')(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='SAP创建时间起'
                >
                  {getFieldDecorator('sapCreationDateStart')(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                      getFieldValue('sapCreationDateEnd') &&
                        moment(getFieldValue('sapCreationDateEnd')).isBefore(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='SAP创建时间至'
                >
                  {getFieldDecorator('sapCreationDateEnd')(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                      getFieldValue('sapCreationDateStart') &&
                        moment(getFieldValue('sapCreationDateStart')).isAfter(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={6} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={this.toggleForm}>
                {expandForm
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
      </Form>
    );
  }
}
