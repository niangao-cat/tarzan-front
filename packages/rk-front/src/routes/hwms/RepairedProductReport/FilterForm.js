import React from 'react';
import { Form, Button, Col, Row, Input, Select, DatePicker } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import moment from 'moment';

import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';
import { getDateTimeFormat } from 'utils/utils';
import MultipleLov from '@/components/MultipleLov';
import Lov from 'components/Lov';

const { Option } = Select;
const InputGroup = Input.Group;


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
  handleChangeAssemblyMaterialIds() {
    const { form: { resetFields } } = this.props;
    resetFields(['bomVersion']);
  }

  // 查询条件展开/收起
  @Bind()
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({ expandForm: !expandForm });
  };

  // 输入框更改
  @Bind()
  handelInputGroup(e, type) {
    const { form } = this.props;
    const { setFieldsValue } = form;
    const value = e.target.value[0];
    switch (type) {
      case 'ONE':
        setFieldsValue({ one: value });
        break;
      case 'TWO':
        setFieldsValue({ two: value });
        break;
      case 'THREE':
        setFieldsValue({ three: value });
        break;
      case 'FOUR':
        setFieldsValue({ four: value });
        break;
      default:
        break;
    }
  }


  // 渲染
  render() {
    const { form, tenantId, areaMap = [], defaultDepartment } = this.props;
    const { getFieldDecorator, getFieldValue, resetFields } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='站点'
            >
              {getFieldDecorator('siteId')(<Lov code="MT.SITE" queryParams={{ tenantId }} />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label={intl.get(`dateFrom`).d('开始时间')}>
              {getFieldDecorator('dateFrom')(
                <DatePicker
                  showTime
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('dateTo') &&
                    moment(getFieldValue('dateTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label={intl.get(`dateTo`).d('结束时间')}>
              {getFieldDecorator('dateTo')(
                <DatePicker
                  showTime
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('dateFrom') &&
                    moment(getFieldValue('dateFrom')).isAfter(currentDate, 'second')
                  }
                />
              )}
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
              label='部门'
            >
              {getFieldDecorator('areaId', {
                initialValue: defaultDepartment.areaId,
              })(
                <Select allowClear style={{ width: '100%' }}>
                  {areaMap.map(ele => (
                    <Option value={ele.value}>{ele.meaning}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='工单'
            >
              {getFieldDecorator('workOrderId')(<MultipleLov code="WMS.WORK_ORDER_NUM" queryParams={{ tenantId }} />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='产线'
            >
              {getFieldDecorator('prodLineId')(
                <MultipleLov
                  code="HME.FINAL_PRODLINE"
                  queryParams={{ tenantId, departmentId: getFieldValue('areaId') }}
                  onChange={() => {
                    resetFields(['lineWorkCellId', 'processId']);
                  }}
                />
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
              label='工段'
            >
              {getFieldDecorator('lineWorkCellId')(
                <MultipleLov
                  code="HME.FINAL_LINE"
                  allowClear
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'),
                    tenantId,
                    typeFlag: 'LINE',
                    departmentId: getFieldValue('areaId'),
                  }}
                  onChange={() => {
                    resetFields(['processId']);
                  }}
                />

              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='工序'
            >
              {getFieldDecorator('processId')(
                <MultipleLov
                  code="HME.FINAL_PROCESS"
                  allowClear
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'),
                    lineWorkcellId: getFieldValue('lineWorkCellId'),
                    typeFlag: 'PROCESS',
                    tenantId,
                    departmentId: getFieldValue('areaId'),
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='产品编码'
            >
              {getFieldDecorator('materialId')(<MultipleLov code="HME.SITE_MATERIAL" queryParams={{ tenantId }} />)}
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
              label='实验编码'
            >
              {getFieldDecorator('labCode')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="产品类型">
              {getFieldDecorator('productType')(
                <InputGroup compact>
                  <Input
                    id="one"
                    style={{ width: '25%' }}
                    onChange={e => this.handelInputGroup(e, 'ONE')}
                  />
                  <Input
                    id="two"
                    style={{ width: '25%' }}
                    onChange={e => this.handelInputGroup(e, 'TWO')}
                  />
                  <Input
                    id="three"
                    style={{ width: '25%' }}
                    onChange={e => this.handelInputGroup(e, 'THREE')}
                  />
                  <Input
                    id="four"
                    style={{ width: '25%' }}
                    onChange={e => this.handelInputGroup(e, 'FOUR')}
                  />
                </InputGroup>
              )}
            </Form.Item>
            <Form.Item style={{ display: 'none' }}>
              {getFieldDecorator('one')(<Input />)}
            </Form.Item>
            <Form.Item style={{ display: 'none' }}>
              {getFieldDecorator('two')(<Input />)}
            </Form.Item>
            <Form.Item style={{ display: 'none' }}>
              {getFieldDecorator('three')(<Input />)}
            </Form.Item>
            <Form.Item style={{ display: 'none' }}>
              {getFieldDecorator('four')(<Input />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
