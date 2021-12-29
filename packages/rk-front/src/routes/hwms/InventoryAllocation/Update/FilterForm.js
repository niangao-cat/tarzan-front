import React from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  FORM_FIELD_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import { Form, Col, Row, Input, Select } from 'hzero-ui';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

const { Option } = Select;

const modelPromt = 'tarzan.hmes.InventoryAllocation';

// model 层连接
@formatterCollections({ code: 'tarzan.hmes.InventoryAllocation' })
@connect(InventoryAllocation => ({
  InventoryAllocation,
}))
// 表单创建
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  // 查询方法
  @Bind
  onSearch = () => {
    const { onSearch, form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        onSearch(values);
      }
    });
  };

  // 设置lov主键值
  @Bind
  setMaterialCode(val, record) {
    this.props.form.setFieldsValue({ materialId: record.materialId });
  }

  @Bind
  setSupplierCode(val, record) {
    this.props.form.setFieldsValue({ supplierId: record.supplierId });
  }

  // 设置货位下拉数据
  @Bind
  setFromWarehouseMap() {
    this.props.form.setFieldsValue({ fromWarehouseId: "", fromWarehouseCode: "", toWarehouseId: "", toWarehouseCode: "", fromLocatorId: "", fromLocatorCode: "", toLocatorId: "", toLocatorCode: "" });
  }

  // 设置货位下拉数据
  @Bind
  setFromLocatorMap(value, records) {
    // 清空界面信息
    this.props.form.setFieldsValue({ fromLocatorId: "", fromLocatorCode: "", fromWarehouseCode: records.locatorCode});
  }

  // 设置货位下拉数据
  @Bind
  setToLocatorMap(value, records) {
    // 清空界面信息
    this.props.form.setFieldsValue({ toLocatorId: "", toLocatorCode: "", toWarehouseCode: records.locatorCode });
  }

    // 设置货位下拉数据
    @Bind
    setFromLocatorCode(value, records) {
      // 清空界面信息
      this.props.form.setFieldsValue({fromLocatorCode: records.locatorCode});
    }

    // 设置货位下拉数据
    @Bind
    setToLocatorCode(value, records) {
      // 清空界面信息
      this.props.form.setFieldsValue({ toLocatorCode: records.locatorCode });
    }

  // 渲染
  render() {
    // 获取整个表单
    const {
      form,
      siteMap,
      typeMap,
      inspectHeadSelect = {},
      inspectLineUpdate = [],
    } = this.props;
    // 获取表单的字段属性
    const { getFieldDecorator } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.instructionNum`).d('单据号')}
            >
              {getFieldDecorator('instructionNum', {
                initialValue: inspectHeadSelect.instructionDocNum,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.fromSiteCode`).d('工厂')}
            >
              {getFieldDecorator('fromSiteId', {
                initialValue: inspectHeadSelect.siteId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`fromSiteCode`).d('工厂'),
                    }),
                  },
                ],
              })(
                <Select
                  onChange={value => this.setFromWarehouseMap(value)}
                  className={FORM_FIELD_CLASSNAME}
                  disabled={inspectLineUpdate.length>0}
                >
                  {siteMap
                    .filter(item => item.siteId !== 'org')
                    .map(n => (
                      <Option key={n.siteId} value={n.siteId}>
                        {n.siteCode}
                      </Option>
                    ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.fromWarehouseCode`).d('来源仓库')}
            >
              {getFieldDecorator('fromWarehouseId', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`fromWarehouseCode`).d('来源仓库'),
                    }),
                  },
                ],
                initialValue: inspectHeadSelect.fromWarehouseId,
              })(
                <Lov
                  code="WMS.ADJUST_WAREHOUSE"
                  onChange={(value, records) => this.setFromLocatorMap(value, records)}
                  textValue={this.props.form.getFieldValue('fromWarehouseCode')}
                  queryParams={{ tenantId, siteId: this.props.form.getFieldValue('fromSiteId') }}
                  disabled={inspectLineUpdate.length>0}
                />
              )}
            </Form.Item>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              style={{display: 'none'}}
              label={intl.get(`${modelPromt}.fromWarehouseCode`).d('来源仓库')}
            >
              {getFieldDecorator('fromWarehouseCode', {
                initialValue: inspectHeadSelect.fromWarehouseCode,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`fromWarehouseCode`).d('来源仓库'),
                    }),
                  },
                ],
              })(
                <span />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.fromLocatorCode`).d('来源货位')}
            >
              {getFieldDecorator('fromLocatorId')(
                <Lov
                  code="WMS.ADJUST_LOCATOR_REL"
                  onChange={(value, records) => this.setFromLocatorCode(value, records)}
                  textValue={this.props.form.getFieldValue('fromLocatorCode')}
                  queryParams={{ tenantId, parentLocatorId: this.props.form.getFieldValue('fromWarehouseId') }}
                />
              )}
            </Form.Item>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              style={{display: 'none'}}
              label={intl.get(`${modelPromt}.fromLocatorCode`).d('来源货位')}
            >
              {getFieldDecorator('fromLocatorCode', {
              })(
                <span />
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.instructionType`).d('单据类型')}
            >
              {getFieldDecorator('instructionType', {
                 initialValue: inspectHeadSelect.instructionDocType,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`instructionDocType`).d('单据类型'),
                    }),
                  },
                ],
              })(
                <Select allowClear className={FORM_FIELD_CLASSNAME} disabled={inspectLineUpdate.length>0}>
                  {typeMap
                    .filter(item => item.value !== 'org')
                    .map(n => (
                      <Option key={n.value} value={n.value}>
                        {n.meaning}
                      </Option>
                    ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.remark`).d('备注')}
            >
              {getFieldDecorator('remark', {
                initialValue: inspectHeadSelect.remark,
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.toWarehouseCode`).d('目标仓库')}
            >
              {getFieldDecorator('toWarehouseId', {
                initialValue: inspectHeadSelect.toWarehouseId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`toWarehouseId`).d('目标仓库'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="WMS.ADJUST_WAREHOUSE"
                  onChange={(value, records) => this.setToLocatorMap(value, records)}
                  textValue={this.props.form.getFieldValue('toWarehouseCode')}
                  queryParams={{ tenantId, siteId: this.props.form.getFieldValue('fromSiteId') }}
                  disabled={inspectLineUpdate.length>0}
                />
              )}
            </Form.Item>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              style={{display: 'none'}}
              label={intl.get(`${modelPromt}.toWarehouseCode`).d('目标仓库')}
            >
              {getFieldDecorator('toWarehouseCode', {
                initialValue: inspectHeadSelect.toWarehouseCode,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`toWarehouseCode`).d('目标仓库'),
                    }),
                  },
                ],
              })(
                <span />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.toLocatorCode`).d('目标货位')}
            >
              {getFieldDecorator('toLocatorId')(
                <Lov
                  code="WMS.ADJUST_LOCATOR_REL"
                  textValue={this.props.form.getFieldValue('toLocatorCode')}
                  onChange={(value, records) => this.setToLocatorCode(value, records)}
                  queryParams={{ tenantId, parentLocatorId: this.props.form.getFieldValue('toWarehouseId') }}
                />
              )}
            </Form.Item>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              style={{display: 'none'}}
              label={intl.get(`${modelPromt}.toLocatorCode`).d('目标货位')}
            >
              {getFieldDecorator('toLocatorCode', {
              })(
                <span />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
