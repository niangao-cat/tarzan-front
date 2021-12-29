import React from 'react';
import { Form, Button, Col, Row, DatePicker, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import moment from 'moment';

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
import Lov from 'components/Lov';
import MultipleLov from '@/components/MultipleLov';
import { compact, uniq } from 'lodash';


const modelPrompt = 'tarzan.hmes.purchaseOrder';

// model 层连接
@formatterCollections({ code: 'tarzan.hmes.abnormalCollection' })
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      identificationListData: [],
      materialLotCodeData: [],
      lotListData: [],
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
    const { form } = this.props;
    form.resetFields();
    // if (onSearch) {
    //   form.validateFields({ force: true }, err => {
    //     if (!err) {
    //       onSearch();
    //     }
    //   });
    // }
  };

  @Bind()
  handleSearch() {
    const { onSearch, form } = this.props;
    if (onSearch) {
      form.validateFields({ force: true }, err => {
        if (!err) {
          onSearch();
        }
      });
    }
  }

  @Bind()
  handleListOnSearch(value, typeList, type) {
    const { form } = this.props;
    const flag = value ? value.every(e => typeList.includes(e)) : false;
    if (value && value.length > 0 && (!flag || (value.length - typeList.length) === 1)) {
      // excel copy的情况
      const list = value[value.length === 0 ? 0 : value.length - 1].split(/[ ]+/);
      const uniplist = uniq(typeList.concat(compact(list)));
      switch (type) {
        case 'identificationList':
          this.setState({identificationListData: uniplist});
          form.setFieldsValue({ 'identificationList': uniplist });
          break;
        case 'materialLotCode':
          this.setState({materialLotCodeData: uniplist});
          form.setFieldsValue({ 'materialLotCode': uniplist });
          break;
        case 'lotList':
          this.setState({lotListData: uniplist});
          form.setFieldsValue({ 'lotList': uniplist });
          break;
        default:
          break;
      }
    }
  };


  // 渲染
  render() {
    const { form, tenantId } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { expandForm, identificationListData, materialLotCodeData, lotListData } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col span={18}>
            <Row>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='投料起始时间'
                >
                  {getFieldDecorator('createDateFrom', {
                    rules: [
                      {
                        required: !(getFieldValue('eoIdList')
                          || getFieldValue('workOrderNumIdList')
                          || getFieldValue('materialId')
                          || getFieldValue('materialLotCode') && getFieldValue('materialLotCode').length > 0
                          || getFieldValue('identificationList') && getFieldValue('identificationList').length > 0),
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '投料起始时间',
                        }),
                      },
                    ],
                  })(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      // showTime
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                        getFieldValue('createDateTo') &&
                        moment(getFieldValue('createDateTo')).isBefore(currentDate, 'second')
                      }
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='投料截止时间'
                >
                  {getFieldDecorator('createDateTo', {
                    rules: [
                      {
                        required: !(getFieldValue('eoIdList')
                          || getFieldValue('workOrderNumIdList')
                          || getFieldValue('materialId')
                          || getFieldValue('materialLotCode') && getFieldValue('materialLotCode').length > 0
                          || getFieldValue('identificationList') && getFieldValue('identificationList').length > 0),
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '投料截止时间',
                        }),
                      },
                    ],
                  })(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      // showTime
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                        getFieldValue('createDateFrom') &&
                        moment(getFieldValue('createDateFrom')).isAfter(currentDate, 'second')
                      }
                      showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.materialName`).d('工单')}
                >
                  {getFieldDecorator('workOrderNumIdList')(
                    <Lov code="MT.WORK_ORDER_NUM" queryParams={{ tenantId }} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ display: expandForm ? 'block' : 'none' }}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label="工序"
                >
                  {getFieldDecorator('processId')(
                    <MultipleLov
                      onChange={() => form.resetFields('workcellId')}
                      code="HME.FINAL_PROCESS"
                      allowClear
                      queryParams={{
                        tenantId,
                      }}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='工位'
                >
                  {getFieldDecorator('workcellId')(
                    <MultipleLov
                      code="HME.FINAL_WORKCELL"
                      queryParams={{
                        processId: getFieldValue('processId'),
                        tenantId,
                      }}
                      // textField=""
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='EO'
                >
                  {getFieldDecorator('eoIdList')(
                    <MultipleLov code="HME.EO_RPT" queryParams={{ tenantId }} />
                )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label="SN编码"
                >
                  {getFieldDecorator('identificationList')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({identificationListData: []});
                          }
                        }
                      }
                      onBlur={val => this.handleListOnSearch(val, identificationListData, 'identificationList')}
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {identificationListData.map(e => (
                        <Select.Option key={e} value={e}>
                          {e}
                        </Select.Option>
                      ))}
                    </Select>
                    // <MultipleLov code="HME.SN_RPT" queryParams={{ tenantId }} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='投料条码'
                >
                  {getFieldDecorator('materialLotCode')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({materialLotCodeData: []});
                          }
                        }
                      }
                      onBlur={val => this.handleListOnSearch(val, materialLotCodeData, 'materialLotCode')}
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {materialLotCodeData.map(e => (
                        <Select.Option key={e} value={e}>
                          {e}
                        </Select.Option>
                      ))}
                    </Select>
                    // <Lov
                    //   code="HME.MATERIAL_LOT_RPT"
                    //   queryParams={{ tenantId }}
                    // />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='物料编码'
                >
                  {getFieldDecorator('materialId')(
                    <MultipleLov
                      code="WMS.MDM.RPT.MATERIAL"
                      queryParams={{ tenantId }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='供应商批次'
                >
                  {getFieldDecorator('lotList')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({lotListData: []});
                          }
                        }
                      }
                      onBlur={val => this.handleListOnSearch(val, lotListData, 'lotList')}
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {lotListData.map(e => (
                        <Select.Option key={e} value={e}>
                          {e}
                        </Select.Option>
                      ))}
                    </Select>
                    // <MultipleLov
                    //   code="HME.SUPPLIER_LOT"
                    //   queryParams={{ tenantId }}
                    // />
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
