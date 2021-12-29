import React from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  FORM_FIELD_CLASSNAME,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import { Form, Button, Col, Row, Input, Select, DatePicker } from 'hzero-ui';
import Lov from 'components/Lov';
import moment from 'moment';
import { isFunction } from 'lodash';
import { getDateTimeFormat, getCurrentOrganizationId } from 'utils/utils';
import { getSiteId } from '@/utils/utils';

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
  // 初始化状态
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
      expandForm: false,
    };
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

  // 查询条件展开/收起
  @Bind
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({ expandForm: !expandForm });
  };

  // 重置查询
  @Bind
  resetSearch = () => {
    const { form } = this.props;
    form.resetFields();
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


  // 渲染
  render() {
    // 获取整个表单
    const { form, statusMap, typeMap } = this.props;
    // 获取表单的字段属性
    const { getFieldDecorator, getFieldValue } = form;

    // 获取更多查询状态
    const { expandForm } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.instructionDocNum`).d('单据号')}
            >
              {getFieldDecorator('instructionDocNum')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.instructionDocType`).d('单据类型')}
            >
              {getFieldDecorator('instructionDocType')(
                <Select allowClear className={FORM_FIELD_CLASSNAME}>
                  {typeMap.map(n => (
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
              label={intl.get(`${modelPromt}.instructionDocStatus`).d('单据状态')}
            >
              {getFieldDecorator('instructionDocStatus')(
                <Select allowClear className={FORM_FIELD_CLASSNAME}>
                  {statusMap.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
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

        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.customerCode`).d('客户编码')}
            >
              {getFieldDecorator('customerCode')(
                <Lov
                  lovOptions={{valueField: 'customerCode'}}
                  queryParams={{ tenantId }}
                  code="MT.CUSTOMER"
                  isInput
                  onChange={(val, item) => {
                    form.setFieldsValue({
                      customerCode: item ? item.customerCode : val,
                    });
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.materialCode`).d('物料编码')}
            >
              {getFieldDecorator('materialCode')(
                <Lov
                  code="MT.MATERIAL"
                  isInput
                  queryParams={{ tenantId }}
                  onChange={(val, item) => {
                  form.setFieldsValue({
                    materialCode: item ? item.materialCode : val,
                  });
                }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.materialVersion`).d('版本')}
            >
              {getFieldDecorator('materialVersion')(
                <Input />
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.fromSiteId`).d('工厂')}
            >
              {getFieldDecorator('siteId')(
                <Lov
                  code="MT.SITE"
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.warehouse`).d('目标仓库')}
            >
              {getFieldDecorator('locatorId')(
                <Lov
                  code="WMS.ADJUST_WAREHOUSE"
                  queryParams={{ tenantId, siteId: getFieldValue('siteId') || getSiteId() }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.updatedBy`).d('更新人')}
            >
              {getFieldDecorator('lastUpdatedBy')(
                <Lov
                  code="HME.USER"
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.creationDateTo`).d('创建时间从')}
            >
              {getFieldDecorator('creationDateFrom', {})(
                <DatePicker
                  showTime
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('creationDateTo') &&
                    moment(getFieldValue('creationDateTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.creationDateTo`).d('至')}
            >
              {getFieldDecorator('creationDateTo', {})(
                <DatePicker
                  showTime
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('creationDateFrom') &&
                    moment(getFieldValue('creationDateFrom')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
