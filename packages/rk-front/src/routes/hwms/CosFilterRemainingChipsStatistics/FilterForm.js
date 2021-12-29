import React from 'react';
import { Form, Button, Col, Row, Select, DatePicker, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import { uniq } from 'lodash';

import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';
import Lov from 'components/Lov';
import MultipleLov from '@/components/MultipleLov';


// model 层连接
@formatterCollections({ code: 'tarzan.hmes.abnormalCollection' })
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      materialLotCode: [],
      preSelectionLot: [],
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
    const { form, tenantId, cosTypeMap = [] } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { materialLotCode, preSelectionLot } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='筛选时间从'
            >
              {getFieldDecorator('preparationDateFrom', {
                rules: [
                  {
                    required: !(getFieldValue('materialLotCode') && getFieldValue('materialLotCode').length > 0
                      || getFieldValue('preSelectionLot') && getFieldValue('preSelectionLot').length > 0),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '筛选时间从',
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('preparationDateTo') &&
                    moment(getFieldValue('preparationDateTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='筛选时间至'
            >
              {getFieldDecorator('preparationDateTo', {
                rules: [
                  {
                    required: !(getFieldValue('materialLotCode') && getFieldValue('materialLotCode').length > 0
                      || getFieldValue('preSelectionLot') && getFieldValue('preSelectionLot').length > 0),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '筛选时间至',
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('preparationDateFrom') &&
                    moment(getFieldValue('preparationDateFrom')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='操作人'
            >
              {getFieldDecorator('userId')(<Lov code="HME.USER" queryParams={{ tenantId }} />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={this.toggleForm}>
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
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='条码'
            >
              {getFieldDecorator('materialLotCode')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => this.handleOnSearch(val, 'materialLotCode')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        this.setState({ materialLotCode: [] });
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {materialLotCode.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='COS类型'
            >
              {getFieldDecorator('cosType')(
                <Select mode="multiple" allowClear>
                  {cosTypeMap.map(item => (
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
              label='物料编码'
            >
              {getFieldDecorator('materialId')(<MultipleLov code="MT.MATERIAL" queryParams={{ tenantId }} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row
          {...SEARCH_FORM_ROW_LAYOUT}
          style={{ display: this.state.expandForm ? '' : 'none' }}
        >
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='器件物料编码'
            >
              {getFieldDecorator('deviceMaterialId')(<Lov code="MT.MATERIAL" queryParams={{ tenantId }} />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='仓库'
            >
              {getFieldDecorator('parentLocatorId')(
                <MultipleLov code="WMS.WAREHOUSE_LOV" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='货位'
            >
              {getFieldDecorator('locatorId')(
                <MultipleLov code="WMS.LOCATOR" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row
          {...SEARCH_FORM_ROW_LAYOUT}
          style={{ display: this.state.expandForm ? '' : 'none' }}
        >
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='筛选批次'
            >
              {getFieldDecorator('preSelectionLot')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => this.handleOnSearch(val, 'preSelectionLot')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        this.setState({ preSelectionLot: [] });
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {preSelectionLot.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='筛选规则'
            >
              {getFieldDecorator('preRuleCode')(<Input />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
