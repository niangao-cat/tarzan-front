import React, { Component } from 'react';
import { Form, Button, Input, Row, Col, Select, DatePicker } from 'hzero-ui';
import cacheComponent from 'components/CacheComponent';
import { Bind, Throttle } from 'lodash-decorators';
import Lov from 'components/Lov';
import MultipleLov from '@/components/MultipleLov';
import intl from 'utils/intl';
import { isFunction } from 'lodash';
import { getCurrentLanguage, getDateTimeFormat } from 'utils/utils';
import moment from 'moment';
import {
  DEBOUNCE_TIME,
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';

/**
 *  页面搜索框
 * @extends {Component} - React.Component
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
@cacheComponent({ cacheKey: '/hwms/barcode/list' })
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
      form.validateFields((err, values) => {
        if (!err) {
          // 如果验证成功,则执行onSearch
          onSearch(values);
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

  @Bind()
  onActualLocatorChange(value, record) {
    this.props.form.setFieldsValue({
      actualLocatorId: record.locatorId,
      actualLocatorCode: record.locatorCode,
    });
  }

  @Bind()
  handleChangeSiteId() {
    this.props.form.resetFields(['wareHouseId', 'locatorId', 'actualLocatorCode']);
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const modelPrompt = 'hwms.barcodeQuery.model.barcodeQuery';
    const { form, tenantId, statusMap, enableMap, qualityStatusMap, siteList, siteInfo } = this.props;
    const { expandForm = false } = this.state;
    const { getFieldDecorator, getFieldValue, resetFields } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="工厂">
              {getFieldDecorator('siteId', {
                initialValue: siteInfo.siteId,
              })(
                <Select onChange={this.handleChangeSiteId}>
                  {siteList.map(item => (
                    <Select.Option key={item.siteId} value={item.siteId}>
                      {item.siteName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.materialLotCode`).d('条码号')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('materialLotCode')(<Input trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.materialCode`).d('物料编码')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('materialId')(
                <MultipleLov
                  code="HME.SITE_MATERIAL"
                  queryParams={{ tenantId, local: getCurrentLanguage(), siteId: getFieldValue('siteId') }}
                  lovOptions={{ displayField: 'materialCode', valueField: 'materialId'}}
                />
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
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.materialVersion`).d('物料版本')}
            >
              {getFieldDecorator('materialVersion')(<Input trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.statusMeaning`).d('状态')}
            >
              {getFieldDecorator('status')(
                <Select allowClear>
                  {statusMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.qualityStatusMeaning`).d('质量状态')}
            >
              {getFieldDecorator('qualityStatus')(
                <Select allowClear>
                  {qualityStatusMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.enableFlag`).d('是否有效')}
            >
              {getFieldDecorator('enableFlag', {
                 initialValue: 'Y',
              })(
                <Select allowClear>
                  {enableMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.lot`).d('批次')}
            >
              {getFieldDecorator('lot')(<Input trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.lot`).d('供应商批次')}
            >
              {getFieldDecorator('supplierLot')(<Input trim />)}
            </Form.Item>
          </Col>


        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.soNum`).d('销售订单号')}
            >
              {getFieldDecorator('soNum')(<Input trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.poNum`).d('采购订单号')}
            >
              {getFieldDecorator('poNum')(<Input trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="送货单号">
              {getFieldDecorator('deliveryNum')(<Input trim />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>

          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="仓库">
              {getFieldDecorator('wareHouseId')(
                <MultipleLov
                  code="WMS.WAREHOUSE_LOV"
                  queryParams={{ tenantId, siteId: getFieldValue('siteId') }}
                  onChange={() => {
                    resetFields(['locatorId', 'actualLocatorCode']);
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="货位" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('locatorId')(
                <MultipleLov
                  queryParams={{
                    tenantId,
                    siteId: getFieldValue('siteId'),
                    warehouseId: getFieldValue('wareHouseId'),
                  }}
                  code="WMS.LOCATOR_BATCH"
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="实际存储货位" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('actualLocatorCode')(
                <MultipleLov
                  queryParams={{
                    tenantId,
                    siteId: getFieldValue('siteId'),
                    warehouseId: getFieldValue('wareHouseId'),
                  }}
                  code="WMS.LOCATOR_BATCH"
                  textField="actualLocatorCode"
                  onChange={this.onActualLocatorChange}
                  lovOptions={{ valueField: 'locatorCode' }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.outMaterialLotCode`).d('外箱条码')}
            >
              {getFieldDecorator('outMaterialLotCode')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.originalCode`).d('原始条码')}
            >
              {getFieldDecorator('originalCode')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='容器'
            >
              {getFieldDecorator('containerCode')(<Input />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.eoNum`).d('EO编码')}
            >
              {getFieldDecorator('eoNum')(
                <Input trim />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='实验代码'
            >
              {getFieldDecorator('labCode')(<Input trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='工艺实验代码'
            >
              {getFieldDecorator('snLabCode')(<Input trim />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.mfFlag`).d('在制品标识')}
            >
              {getFieldDecorator('mfFlag')(
                <Select allowClear>
                  {enableMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.freezeFlag`).d('冻结标识')}
            >
              {getFieldDecorator('freezeFlag')(
                <Select allowClear>
                  {enableMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.stocktakeFlag`).d('盘点停用标识')}
            >
              {getFieldDecorator('stocktakeFlag')(
                <Select allowClear>
                  {enableMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='SAP账务标识'
            >
              {getFieldDecorator('sapAccountFlag')(
                <Select allowClear>
                  {enableMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="创建人">
              {getFieldDecorator('createBy')(
                <Lov code="HME.USER" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="更新人">
              {getFieldDecorator('updateBy')(
                <Lov code="HME.USER" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.actualReceivedDateFrom`).d('创建时间从')}
            >
              {getFieldDecorator('createDateFrom')(
                <DatePicker
                  placeholder=""
                  style={{ width: '100%' }}
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                  getFieldValue('createDateTo') &&
                    moment(getFieldValue('createDateTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.actualReceivedDateTo`).d('创建时间至')}
            >
              {getFieldDecorator('createDateTo')(
                <DatePicker
                  placeholder=""
                  style={{ width: '100%' }}
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                  getFieldValue('createDateFrom') &&
                    moment(getFieldValue('createDateFrom')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="供应商" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('supplierId')(
                <MultipleLov
                  queryParams={{ tenantId }}
                  code="Z.SUPPLIER"
                  // lovOptions={{ displayField: 'supplierName', valueField: 'supplierId'}}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default FilterForm;
