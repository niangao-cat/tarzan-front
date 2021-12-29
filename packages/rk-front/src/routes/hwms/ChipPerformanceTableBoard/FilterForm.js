/**
 * @author:ywj
 * @email:wenjie.yang01@hand-china.com
 * @description: 报表
 */
import React from 'react';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import { isEmpty, isFunction, uniq } from 'lodash';
import { Form, Button, Col, Row, Input, Select, DatePicker, Dropdown, Menu, Icon } from 'hzero-ui';

import intl from 'utils/intl';
import { getDateTimeFormat } from 'utils/utils';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import Lov from 'components/Lov';
import MultipleLov from '@/components/MultipleLov';

const { Option } = Select;


// 表单创建
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {

  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
      workOrderNumList: [],
      waferList: [],
      materialLotCodeList: [],
      hotSinkCodeList: [],
      labCodeList: [],
      heatSinkMaterialLotList: [],
      heatSinkSupplierLotList: [],
      goldWireMaterialLotList: [],
      goldWireSupplierLotList: [],
    };
  }

  // 静态状态
  state = {
    expandForm: false, // 查询限制解除
  };

  // 查询方法
  @Bind
  handleSearch = () => {
    const { onSearch, form } = this.props;
    form.validateFields((errs) => {
      if (!errs) {
        onSearch();
      }
    });
  };

  // 重置查询
  @Bind()
  resetSearch = () => {
    const { form, onResetFields } = this.props;
    form.resetFields();
    if (onResetFields) {
      onResetFields();
    }
  };

  // 查询条件展开/收起
  @Bind
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({ expandForm: !expandForm });
  };

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
  handleMenuClick(_ref) {
    const { key } = _ref;
    const { form: { setFieldsValue } } = this.props;
    setFieldsValue({ searchType: key });
    this.handleSearch();
  }

  // 渲染
  render() {
    const { form, tenantId, preStatusList, cosTypeList, currentList, siteList, siteInfo } = this.props;
    const { getFieldDecorator, getFieldValue, resetFields } = form;
    const {
      expandForm,
      workOrderNumList = [],
      waferList = [],
      materialLotCodeList = [],
      hotSinkCodeList = [],
      labCodeList = [],
      heatSinkMaterialLotList = [],
      heatSinkSupplierLotList = [],
      goldWireMaterialLotList = [],
      goldWireSupplierLotList = [],
    } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='站点'>
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
                <Select allowClear>
                  {siteList.map(e => (
                    <Option value={e.siteId} key={e.siteId}>
                      {e.siteName}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='测试开始时间'
            >
              {getFieldDecorator('startDate', {
                rules: [
                  {
                    required: isEmpty(getFieldValue('materialLotCodeList')) && isEmpty(getFieldValue('hotSinkCodeList')) && isEmpty(getFieldValue('waferList')) && isEmpty(getFieldValue('workOrderNumList')),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '测试开始时间',
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('endDate') &&
                    moment(getFieldValue('endDate')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='测试结束时间'
            >
              {getFieldDecorator('endDate', {
                rules: [
                  {
                    required: isEmpty(getFieldValue('materialLotCodeList')) && isEmpty(getFieldValue('hotSinkCodeList')) && isEmpty(getFieldValue('waferList')) && isEmpty(getFieldValue('workOrderNumList')),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '测试结束时间',
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('startDate') &&
                    moment(getFieldValue('startDate')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={this.toggleForm}>
                {expandForm
                  ? intl.get('tarzan.org.dataItem.button.collected').d('收起查询')
                  : intl.get(`tarzan.org.dataItem.button.viewMore`).d('更多查询')}
              </Button>
              <Button onClick={this.resetSearch}>
                {intl.get(`hzero.common.button.reset`).d('重置')}
              </Button>
              <Dropdown
                overlay={
                  <Menu onClick={this.handleMenuClick}>
                    <Menu.Item key="search">查询</Menu.Item>
                    <Menu.Item key="gp-search">历史查询</Menu.Item>
                  </Menu>
                }
              >
                <Button>
                  查询
                  <Icon type="down" />
                </Button>
              </Dropdown>
            </Form.Item>
          </Col>
        </Row>

        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='测试电流'>
              {getFieldDecorator('current', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '测试电流',
                    }),
                  },
                ],
              })(
                <Select mode="multiple" allowClear>
                  {currentList.map(e => (
                    <Option value={e.value} key={e.value}>
                      {e.meaning}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='COS类型'>
              {getFieldDecorator('cosType')(
                <Select mode="multiple" allowClear>
                  {cosTypeList.map(e => (
                    <Option value={e.value} key={e.value}>
                      {e.meaning}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='WAFER'>
              {getFieldDecorator('waferList')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => this.handleOnSearch(val, 'waferList')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        this.setState({ waferList: [] });
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {waferList.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='热沉编码'>
              {getFieldDecorator('hotSinkCodeList')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => this.handleOnSearch(val, 'hotSinkCodeList')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        this.setState({ hotSinkCodeList: [] });
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {hotSinkCodeList.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='条码'>
              {getFieldDecorator('materialLotCodeList')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => this.handleOnSearch(val, 'materialLotCodeList')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        this.setState({ materialLotCodeList: [] });
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {materialLotCodeList.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='实验代码'>
              {getFieldDecorator('labCodeList')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => this.handleOnSearch(val, 'labCodeList')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        this.setState({ labCodeList: [] });
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {labCodeList.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='不良代码'>
              {getFieldDecorator('ncCode')(
                <MultipleLov code="MT.NC_CODE" />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='热沉条码'>
              {getFieldDecorator('heatSinkMaterialLotList')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => this.handleOnSearch(val, 'heatSinkMaterialLotList')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        this.setState({ heatSinkMaterialLotList: [] });
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {heatSinkMaterialLotList.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='热沉物料'>
              {getFieldDecorator('heatSinkMaterialId')(
                <Lov code="MT.MATERIAL" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='热沉供应商批次'>
              {getFieldDecorator('heatSinkSupplierLotList')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => this.handleOnSearch(val, 'heatSinkSupplierLotList')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        this.setState({ heatSinkSupplierLotList: [] });
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {heatSinkSupplierLotList.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='金线条码'>
              {getFieldDecorator('goldWireMaterialLotList')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => this.handleOnSearch(val, 'goldWireMaterialLotList')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        this.setState({ goldWireMaterialLotList: [] });
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {goldWireMaterialLotList.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='金线物料'>
              {getFieldDecorator('goldWireMaterialId')(
                <Lov code="MT.MATERIAL" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='金线供应商批次'>
              {getFieldDecorator('goldWireSupplierLotList')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => this.handleOnSearch(val, 'goldWireSupplierLotList')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        this.setState({ goldWireMaterialLotList: [] });
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {goldWireSupplierLotList.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工单号'>
              {getFieldDecorator('workOrderNumList')(
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
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='产品'>
              {getFieldDecorator('materialId')(
                <MultipleLov code="HME.SITE_MATERIAL" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='生产线'>
              {getFieldDecorator('prodLineId')(
                <MultipleLov
                  code="MT.PRODLINE"
                  queryParams={{
                    tenantId,
                  }}
                  textValue={this.state.prodlineName}
                  onChange={() => {
                    resetFields(['lineWorkcellId', 'processId', 'workcellId']);
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工段'>
              {getFieldDecorator('lineWorkcellId')(
                <MultipleLov
                  code="HME.FINAL_LINE"
                  allowClear
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'),
                    tenantId,
                    typeFlag: 'LINE',
                  }}
                  onChange={() => {
                    resetFields(['processId']);
                  }}
                />

              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工序'>
              {getFieldDecorator('processId')(
                <MultipleLov
                  code="HME.FINAL_PROCESS"
                  allowClear
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'),
                    lineWorkcellId: getFieldValue('lineWorkcellId'),
                    typeFlag: 'PROCESS',
                    tenantId,
                  }}
                  onChange={() => { resetFields(['workcellId']); }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工位'>
              {getFieldDecorator('workcellId')(
                <MultipleLov
                  code="HME.FINAL_WORKCELL"
                  allowClear
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'),
                    processId: getFieldValue('processId'),
                    typeFlag: 'PROCESS',
                    tenantId,
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='状态'>
              {getFieldDecorator('preStatus')(
                <Select mode="multiple" allowClear>
                  {preStatusList.map(e => (
                    <Option value={e.value} key={e.value}>
                      {e.meaning}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='是否不良'>
              {getFieldDecorator('ncFlag')(
                <Select allowClear>
                  <Option value="Y" key="Y">
                    是
                  </Option>
                  <Option value="N" key="N">
                    否
                  </Option>
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='冻结标识'>
              {getFieldDecorator('freezeFlag')(
                <Select allowClear>
                  <Option value="Y" key="Y">
                    是
                  </Option>
                  <Option value="N" key="N">
                    否
                  </Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='贴片设备'>
              {getFieldDecorator('patchEquipment')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='测试设备'>
              {getFieldDecorator('testEquipment')(<Input />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='测试人'>
              {getFieldDecorator('userId')(
                <Lov code="HME.USER" />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='仓库'>
              {getFieldDecorator('warehouseId')(
                <MultipleLov code="WMS.WAREHOUSE_LOV" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='货位'>
              {getFieldDecorator('locatorId')(
                <MultipleLov code="WMS.LOCATOR_BATCH" queryParams={{ tenantId }} />
              )}
            </Form.Item>
            <Form.Item style={{ display: 'none' }}>
              {getFieldDecorator('searchType')(<span />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
