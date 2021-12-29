import React from 'react';
import { Form, Button, Col, Row, InputNumber, Select, DatePicker } from 'hzero-ui';
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
import MultipleLov from '@/components/MultipleLov';

const { Option } = Select;

const modelPrompt = 'tarzan.hhme.cosWorkOrderLossReport';

// model 层连接
@formatterCollections({ code: 'tarzan.hhme.cosWorkOrderLossReport' })
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      workOrderNumList: [],
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

  @Bind()
  handleChangeProdLineIds() {
    const { form: { resetFields } } = this.props;
    resetFields(['workcellIds']);
  }


  // 渲染
  render() {
    const { form, tenantId, statusList = [], userId, siteInfo = {} } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { expandForm, workOrderNumList } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col span={18}>
            <Row>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.site`).d('产线')}
                >
                  {getFieldDecorator('prodLineIds')(
                    <MultipleLov
                      code="MT.PRODLINE"
                      queryParams={{ tenantId, userId }}
                      onChange={this.handleChangeProdLineIds}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.site`).d('工段')}
                >
                  {getFieldDecorator('workcellIds')(
                    <MultipleLov
                      code="HME.PROD_LINE_WORKCELL"
                      queryParams={{
                        tenantId,
                        siteId: siteInfo.siteId,
                        prodLineId: getFieldValue('prodLineIds') ? getFieldValue('prodLineIds') : [],
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.site`).d('工单')}
                >
                  {getFieldDecorator('workOrderNums')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'workOrderNumList')}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({ workOrderNumList: [] });
                          }
                        }
                      }
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
            </Row>
            <Row style={{ display: expandForm ? '' : 'none' }}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.docStatus`).d('工单状态')}
                >
                  {getFieldDecorator('woStatuses')(
                    <Select allowClear mode="multiple">
                      {statusList.map(e => (
                        <Option key={e.value} value={e.value}>
                          {e.meaning}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.docStatus`).d('产品编码')}
                >
                  {getFieldDecorator('assemblyMaterialIds')(
                    <MultipleLov
                      code="HME.SITE_MATERIAL"
                      queryParams={{ tenantId, userId }}
                      onChange={this.handleChangeAssemblyMaterialIds}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.site`).d('BOM版本')}
                >
                  {getFieldDecorator('bomVersion')(
                    <MultipleLov
                      code="HME.MATERIAL_VERSION"
                      disabled={!(getFieldValue('assemblyMaterialIds') && getFieldValue('assemblyMaterialIds').split(',').length === 1)}
                      queryParams={{
                        tenantId,
                        siteId: siteInfo.siteId,
                        materialId: getFieldValue('assemblyMaterialIds') && getFieldValue('assemblyMaterialIds').split(',').length === 1 ? getFieldValue('assemblyMaterialIds') : null,
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.site`).d('物料编码')}
                >
                  {getFieldDecorator('componentMaterialIds')(
                    <MultipleLov
                      code="HME.SITE_MATERIAL"
                      queryParams={{ tenantId, userId }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.instructionDocStatus`).d('是否超工单报损')}
                >
                  {getFieldDecorator('scrappedOverFlag')(
                    <Select allowClear>
                      <Option key='Y' value='Y'>
                        是
                      </Option>
                      <Option key='N' value='N'>
                        否
                      </Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.site`).d('损耗率差值大于')}
                >
                  {getFieldDecorator('attritionRateFrom')(
                    <InputNumber />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.locatorCode`).d('损耗率差值小于')}
                >
                  {getFieldDecorator('attritionRateTo')(
                    <InputNumber />
                )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.planStartTimeFrom`).d('计划开始时间从')}
                >
                  {getFieldDecorator('planStartTimeFrom')(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      showTime
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                      getFieldValue('planStartTimeTo') &&
                        moment(getFieldValue('planStartTimeTo')).isBefore(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.actualReceivedDateTo`).d('至')}
                >
                  {getFieldDecorator('planStartTimeTo')(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      showTime
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                      getFieldValue('planStartTimeFrom') &&
                        moment(getFieldValue('planStartTimeFrom')).isAfter(currentDate, 'second')
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
