import React from 'react';
import { Form, Button, Col, Row, Input, Select, DatePicker } from 'hzero-ui';
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
      workOrderNumList: [],
      snList: [],
      materialCodeList: [],
      tagGroupCodeList: [],
      tagCodeList: [],
      processCodeList: [],
      workcellCodeList: [],
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

  @Bind()
  handleChangeAssemblyMaterialIds() {
    const { form: { resetFields } } = this.props;
    resetFields(['bomVersion']);
  }


  // 渲染
  render() {
    const { form, siteInfo, siteList } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { expandForm, workOrderNumList, snList, materialCodeList, tagGroupCodeList, tagCodeList, processCodeList, workcellCodeList } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col span={18}>
            <Row>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.site`).d('站点')}
                >
                  {getFieldDecorator('siteId', {
                    initialValue: siteInfo.siteId,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '站点',
                        }),
                      },
                    ],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      allowClear
                    >
                      {siteList.map(e => (
                        <Select.Option key={e.siteId} value={e.siteId}>
                          {e.description}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.planStartTimeFrom`).d('采集时间起')}
                >
                  {getFieldDecorator('gatherDateFrom', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '采集时间起',
                        }),
                      },
                    ],
                  })(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      showTime
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                      getFieldValue('gatherDateTo') &&
                        moment(getFieldValue('gatherDateTo')).isBefore(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.actualReceivedDateTo`).d('采集时间至')}
                >
                  {getFieldDecorator('gatherDateTo', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '采集时间起',
                        }),
                      },
                    ],
                  })(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      showTime
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                      getFieldValue('gatherDateFrom') &&
                        moment(getFieldValue('gatherDateFrom')).isAfter(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ display: expandForm ? '' : 'none' }}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.site`).d('SN')}
                >
                  {getFieldDecorator('snList')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'snList')}
                      onChange={val => {
                        if (val.length === 0) {
                          this.setState({ snList: [] });
                        }
                      }}
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {snList.map(e => (
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
                  label={intl.get(`${modelPrompt}.site`).d('物料编码')}
                >
                  {getFieldDecorator('materialCodeList')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'materialCodeList')}
                      onChange={val => {
                        if (val.length === 0) {
                          this.setState({ materialCodeList: [] });
                        }
                      }}
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
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.docStatus`).d('机型')}
                >
                  {getFieldDecorator('model')(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.site`).d('工单号')}
                >
                  {getFieldDecorator('workOrderNumList')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'workOrderNumList')}
                      onChange={val => {
                        if (val.length === 0) {
                          this.setState({ workOrderNumList: [] });
                        }
                      }}
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {workOrderNumList.map(e => (
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
                  label={intl.get(`${modelPrompt}.site`).d('数据收集组编码')}
                >
                  {getFieldDecorator('tagGroupCodeList')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'tagGroupCodeList')}
                      onChange={val => {
                        if (val.length === 0) {
                          this.setState({ tagGroupCodeList: [] });
                        }
                      }}
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {tagGroupCodeList.map(e => (
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
                  label={intl.get(`${modelPrompt}.site`).d('数据收集项编码')}
                >
                  {getFieldDecorator('tagCodeList')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'tagCodeList')}
                      onChange={val => {
                        if (val.length === 0) {
                          this.setState({ tagCodeList: [] });
                        }
                      }}
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {tagCodeList.map(e => (
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
                  label={intl.get(`${modelPrompt}.site`).d('采集工序编码')}
                >
                  {getFieldDecorator('processCodeList')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'processCodeList')}
                      onChange={val => {
                        if (val.length === 0) {
                          this.setState({ processCodeList: [] });
                        }
                      }}
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {processCodeList.map(e => (
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
                  label={intl.get(`${modelPrompt}.site`).d('采集工位编码')}
                >
                  {getFieldDecorator('workcellCodeList')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'workcellCodeList')}
                      onChange={val => {
                        if (val.length === 0) {
                          this.setState({ workcellCodeList: [] });
                        }
                      }}
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {workcellCodeList.map(e => (
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
                  label={intl.get(`${modelPrompt}.planStartTimeFrom`).d('进站时间从')}
                >
                  {getFieldDecorator('siteInDateFrom')(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      showTime
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                      getFieldValue('siteInDateTo') &&
                        moment(getFieldValue('siteInDateTo')).isBefore(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.actualReceivedDateTo`).d('进站时间至')}
                >
                  {getFieldDecorator('siteInDateTo')(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      showTime
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                      getFieldValue('siteInDateFrom') &&
                        moment(getFieldValue('siteInDateFrom')).isAfter(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.planStartTimeFrom`).d('出站时间从')}
                >
                  {getFieldDecorator('siteOutDateFrom')(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      showTime
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                      getFieldValue('siteOutDateTo') &&
                        moment(getFieldValue('siteOutDateTo')).isBefore(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.actualReceivedDateTo`).d('出站时间至')}
                >
                  {getFieldDecorator('siteOutDateTo')(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      showTime
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                      getFieldValue('siteOutDateFrom') &&
                        moment(getFieldValue('siteOutDateFrom')).isAfter(currentDate, 'second')
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
