import React from 'react';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
import { Form, Button, Col, Row, DatePicker, Select } from 'hzero-ui';
import { compact, isFunction, uniq } from 'lodash';
import Lov from 'components/Lov';
import moment from 'moment';
import { getCurrentOrganizationId } from 'utils/utils';
import MultipleLov from '../../../components/MultipleLov/index';
import ModalContainer, { registerContainer } from '../../../components/Modal/ModalContainer';

const tenantId = getCurrentOrganizationId();


// 表单创建
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
      workOrderNum: [],
      waferList: [],
    };
  }

  // 查询方法
  @Bind
  onSearch = () => {
    const { onSearch, form } = this.props;
    form.validateFields({ force: true }, (errs) => {
      if (!errs) {
        onSearch();
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
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
  };

  @Bind()
  handleWorkOrderNumOnSearch(value) {
    const { workOrderNum } = this.state;
    if (value.length > 0) {
      const list = value[value.length === 0 ? 0 : value.length - 1].split(/[ ]+/);
      const uniplist = uniq(workOrderNum.concat(compact(list)));
      this.setState({ workOrderNum: uniplist });
    }
  }

  @Bind()
  handleWaferListOnSearch(value) {
    const { waferList } = this.state;
    if (value.length > 0) {
      const list = value[value.length === 0 ? 0 : value.length - 1].split(/[ ]+/);
      const uniplist = uniq(waferList.concat(compact(list)));
      this.setState({ waferList: uniplist });
    }
  }

  // 联动清空
  @Bind()
  resetWithFields(type) {
    const { form } = this.props;
    switch (type) {
      case 'prodLineId':
        form.resetFields([
          'lineId',
          'processId',
          'stationId',
        ]);
        break;
      case 'lineId':
        form.resetFields([
          'processId',
          'stationId',
        ]);
        break;
      case 'processId':
        form.resetFields([
          'stationId',
        ]);
        break;
      default:
        break;
    }
  };

  render() {
    const { form, cosTypeMap, defaultDate } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { expandForm } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='开始时间'
            >
              {getFieldDecorator('creationDateFrom', {
                initialValue: defaultDate.creationDateFrom,
                rules: [
                  {
                    required: !(getFieldValue('workOrderNum') && getFieldValue('workOrderNum').length || getFieldValue('wafer') && getFieldValue('wafer').length),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '开始时间',
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  style={{ width: '100%' }}
                  format={DEFAULT_DATETIME_FORMAT}
                  disabledDate={currentDate =>
                    getFieldValue('creationDateTo') &&
                    moment(getFieldValue('creationDateTo')).isBefore(currentDate, 'second')
                  }
                />,
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='结束时间'
            >
              {getFieldDecorator('creationDateTo', {
                initialValue: defaultDate.creationDateTo,
                rules: [
                  {
                    required: !(getFieldValue('workOrderNum') && getFieldValue('workOrderNum').length || getFieldValue('wafer') && getFieldValue('wafer').length),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '结束时间',
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  style={{ width: '100%' }}
                  format={DEFAULT_DATETIME_FORMAT}
                  disabledDate={currentDate =>
                    getFieldValue('creationDateFrom') &&
                    moment(getFieldValue('creationDateFrom')).isAfter(currentDate, 'second')
                  }
                />,
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='操作人'
            >
              {getFieldDecorator('operatorId', {})(
                <Lov
                  code='HME.USER'
                  queryParams={{ tenantId }}
                />,
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
              <Button onClick={this.handleFormReset}>
                {intl.get(`hzero.common.button.reset`).d('重置')}
              </Button>
              <Button type='primary' htmlType='submit' onClick={this.onSearch.bind(this)}>
                {intl.get(`hzero.common.button.search`).d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='工单'
            >
              {getFieldDecorator(
                'workOrderNum',
                {
                  initialValue: this.state.workOrderNum,
                }
              )(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onChange={val => {
                    if (val.length === 0) {
                      this.setState({ workOrderNum: [] });
                    } else {
                      this.handleWorkOrderNumOnSearch(val);
                    }
                  }}
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {this.state.workOrderNum.map(e => (
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
              label='产品编码'
            >
              {getFieldDecorator('materialId', {})(
                <MultipleLov
                  code='HME.SITE_MATERIAL'
                  queryParams={{ tenantId }}
                  textField='materialCode'
                />,
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label='产线'
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('prodLineId', {})(
                <MultipleLov
                  code="HME.FINAL_PRODLINE"
                  queryParams={{ tenantId }}
                  onChange={() => this.resetWithFields('prodLineId')}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label='工段'
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('lineId', {})(
                <MultipleLov
                  code="HME.FINAL_LINE"
                  onChange={() => this.resetWithFields('lineId')}
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'),
                    tenantId,
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label='工序'
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('processId', {})(
                <MultipleLov
                  code="HME.FINAL_PROCESS"
                  onChange={() => this.resetWithFields('processId')}
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'),
                    lineWorkcellId: getFieldValue('lineId'),
                    tenantId,
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label='工位'
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('stationId', {})(
                <MultipleLov
                  code="HME.FINAL_WORKCELL"
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'),
                    lineWorkcellId: getFieldValue('lineId'),
                    processId: getFieldValue('processId'),
                    tenantId,
                  }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label='COS类型' {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('cosType', {})(
                <Select allowClear>
                  {cosTypeMap.map(ele => (
                    <Select.Option value={ele.value} key={ele.value}>{ele.meaning}</Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='WAFER'
            >
              {getFieldDecorator(
                'wafer',
                {
                  initialValue: this.state.waferList,
                }
              )(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onChange={val => {
                    if (val.length === 0) {
                      this.setState({ waferList: [] });
                    } else {
                      this.handleWaferListOnSearch(val);
                    }
                  }}
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {this.state.waferList.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <ModalContainer ref={registerContainer} />
      </Form>
    );
  }
}
