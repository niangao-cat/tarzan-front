import React from 'react';
import { Form, Button, Col, Row, Input, Select, DatePicker } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import moment from 'moment';

import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_3_LAYOUT,
  FORM_FIELD_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';
import { getDateTimeFormat } from 'utils/utils';
import Lov from 'components/Lov';
import MultipleLov from '../../../components/MultipleLov';

const { Option } = Select;

const modelPrompt = 'tarzan.hmes.purchaseOrder';

// model 层连接
@formatterCollections({ code: 'tarzan.hmes.abnormalCollection' })
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
    };
    props.onRef(this);
  }

  // 查询方法
  @Bind
  onSearch = () => {
    const { onSearch } = this.props;
    if (onSearch) {
      onSearch();
    }
  };

  // 查询条件展开/收起
  @Bind()
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({ expandForm: !expandForm });
  };

  // 重置查询
  @Bind()
  resetSearch = () => {
    const { form, onSearch } = this.props;
    form.resetFields();
    if (onSearch) {
      onSearch();
    }
  };

  // 设置lov主键值
  @Bind()
  setMaterialCode(val, record) {
    this.props.form.setFieldsValue({ materialId: record.materialId });
  }

  @Bind()
  setSupplierCode(val, record) {
    this.props.form.setFieldsValue({ supplierId: record.supplierId });
  }

  // 渲染
  render() {
    const { form, tenantId, deliveryNoteStatusList = [], versionList = [], siteInfo = {}, inspectionOrderStatusList = [], inspectionOrderTypeList = [] } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { expandForm } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col span={18}>
            <Row>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.instructionDocNum`).d('送货单')}
                >
                  {getFieldDecorator('instructionDocNum')(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.instructionDocStatus`).d('状态')}
                >
                  {getFieldDecorator('instructionDocStatus')(
                    <Select allowClear mode="multiple" className={FORM_FIELD_CLASSNAME}>
                      {deliveryNoteStatusList.map(e => (
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
                  label={intl.get(`${modelPrompt}.materialCode`).d('物料编码')}
                >
                  {getFieldDecorator('materialId')(
                    <MultipleLov code="QMS.MATERIAL" queryParams={{ tenantId }} />
                  )}
                </Form.Item>
              </Col>
              {/* <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.instructionStatus`).d('行状态')}
                >
                  {getFieldDecorator('instructionStatus')(
                    <Select allowClear mode="multiple" className={FORM_FIELD_CLASSNAME}>
                      {lineStatusList.map(e => (
                        <Option key={e.value} value={e.value}>
                          {e.meaning}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col> */}
            </Row>
            <Row style={{ display: expandForm ? '' : 'none' }}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.materialName`).d('物料描述')}
                >
                  {getFieldDecorator('materialName')(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.materialVersion`).d('版本')}
                >
                  {getFieldDecorator('materialVersion')(
                    <Select allowClear className={FORM_FIELD_CLASSNAME}>
                      {versionList.map(e => (
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
                  label={intl.get(`${modelPrompt}.site`).d('工厂')}
                >
                  {getFieldDecorator('siteId', {
                initialValue: siteInfo.defaultSiteId,
              })(
                <Lov
                  code="MT.MOD.SITE_MT_LOT"
                  queryParams={{ tenantId }}
                  textValue={siteInfo.defaultSiteName}
                />
              )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.supplierId`).d('供应商')}
                >
                  {getFieldDecorator('supplierId')(
                    <Lov code="WMS.SUPPLIER" queryParams={{ tenantId }} />
              )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.locatorCode`).d('接收仓库')}
                >
                  {getFieldDecorator('toLocatorId')(
                    <Lov code="WMS.WAREHOUSE" queryParams={{ tenantId }} />
              )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.iqcNumber`).d('检验单')}
                >
                  {getFieldDecorator('iqcNumber')(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.inspectionType`).d('检验单类型')}
                >
                  {getFieldDecorator('inspectionType')(
                    <Select allowClear mode="multiple" className={FORM_FIELD_CLASSNAME}>
                      {inspectionOrderTypeList.map(e => (
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
                  label={intl.get(`${modelPrompt}.inspectionStatus`).d('检验单状态')}
                >
                  {getFieldDecorator('inspectionStatus')(
                    <Select allowClear mode="multiple" className={FORM_FIELD_CLASSNAME}>
                      {inspectionOrderStatusList.map(e => (
                        <Option key={e.value} value={e.value}>
                          {e.meaning}
                        </Option>
                  ))}
                    </Select>
              )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.actualReceivedDateFrom`).d('接收完成时间')}
                >
                  {getFieldDecorator('actualReceivedDateFrom', {
                    initialValue: moment().startOf('day'),
                  })(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      showTime
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                      getFieldValue('actualReceivedDateTo') &&
                        moment(getFieldValue('actualReceivedDateTo')).isBefore(currentDate, 'second')
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
                  {getFieldDecorator('actualReceivedDateTo', {
                    initialValue: moment().endOf('day'),
                  })(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      showTime
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                      getFieldValue('actualReceivedDateFrom') &&
                        moment(getFieldValue('actualReceivedDateFrom')).isAfter(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.inspectionFinishDateFrom`).d('检验完成时间')}
                >
                  {getFieldDecorator('inspectionFinishDateFrom')(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      showTime
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                      getFieldValue('inspectionFinishDateTo') &&
                        moment(getFieldValue('inspectionFinishDateTo')).isBefore(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.inspectionFinishDateTo`).d('至')}
                >
                  {getFieldDecorator('inspectionFinishDateTo')(
                    <DatePicker
                      placeholder=""
                      showTime
                      format={getDateTimeFormat()}
                      style={{ width: '100%' }}
                      disabledDate={currentDate =>
                      getFieldValue('inspectionFinishDateFrom') &&
                        moment(getFieldValue('inspectionFinishDateFrom')).isAfter(currentDate, 'second')
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
              <Button onClick={this.resetSearch.bind(this)}>
                {intl.get(`hzero.common.button.reset`).d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.onSearch.bind(this)}>
                {intl.get(`hzero.common.button.search`).d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
