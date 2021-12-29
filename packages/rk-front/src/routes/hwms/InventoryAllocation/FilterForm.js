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
  state = {
    expandForm: false,
  };

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
    const { form, resetSearch } = this.props;
    form.resetFields();
    resetSearch();
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
    const { form, statusMap, typeMap, materialVersionMap, siteMap } = this.props;

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
              label={intl.get(`${modelPromt}.instructionStatus`).d('单据状态')}
            >
              {getFieldDecorator('instructionStatus')(
                <Select allowClear className={FORM_FIELD_CLASSNAME} mode="multiple">
                  {statusMap.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
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
              label={intl.get(`${modelPromt}.materialCode`).d('物料编码')}
            >
              {getFieldDecorator('materialId')(
                <Lov
                  onChange={this.setMaterialCode}
                  queryParams={{ tenantId }}
                  code="MT.MATERIAL"
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
                <Select allowClear className={FORM_FIELD_CLASSNAME}>
                  {materialVersionMap
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
              label={intl.get(`${modelPromt}.fromSiteId`).d('工厂')}
            >
              {getFieldDecorator('fromSiteId', {
                initialValue: getSiteId(),
              })(
                <Select allowClear className={FORM_FIELD_CLASSNAME}>
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
        </Row>

        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.fromWarehouseCode`).d('来源仓库')}
            >
              {getFieldDecorator('fromWarehouseId')(
                <Lov
                  code="WMS.ADJUST_WAREHOUSE"
                  queryParams={{ tenantId, siteId: getSiteId() }}
                />
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
                  code="MT.MTL_LOCATOR"
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPromt}.createdBy`).d('制单人')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('createdBy', {})(
                <Lov code="HME.USER" queryParams={{ tenantId }} textField="realName" />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.toWarehouseCode`).d('目标仓库')}
            >
              {getFieldDecorator('toWarehouseId')(
                <Lov
                  code="WMS.ADJUST_WAREHOUSE"
                  queryParams={{ tenantId, siteId: getSiteId() }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.toLocatorCode`).d('目标货位')}
            >
              {getFieldDecorator('toLocatorId')(
                <Lov code="MT.MTL_LOCATOR" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.creationDateFrom`).d('创建时间从')}
            >
              {getFieldDecorator('creationDateFrom')(
                <DatePicker
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
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
              label={intl.get(`${modelPromt}.creationDateTo`).d('创建时间至')}
            >
              {getFieldDecorator('creationDateTo', {})(
                <DatePicker
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
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
