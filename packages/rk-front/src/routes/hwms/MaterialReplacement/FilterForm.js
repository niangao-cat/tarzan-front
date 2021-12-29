import React from 'react';
import { Form, Button, Col, Row, Input, Select, DatePicker } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import moment from 'moment';

import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  FORM_COL_3_4_LAYOUT,
  FORM_COL_3_LAYOUT,
} from 'utils/constants';
import Lov from 'components/Lov';
import { getDateTimeFormat } from 'utils/utils';

const { Option } = Select;
const dateFormatTime = getDateTimeFormat();

const modelPromt = 'tarzan.hmes.purchaseOrder';

// model 层连接
@formatterCollections({ code: 'tarzan.hmes.abnormalCollection' })
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      expandForm: true,
    };
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

  // 渲染
  render() {
    const {
      form,
      tenantId,
      form: { getFieldValue, setFieldsValue },
      statusList,
      versionList,
      siteInfo = {},
    } = this.props;
    const { getFieldDecorator } = form;
    const { expandForm } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_4_LAYOUT}>
            <Row>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPromt}.site`).d('工厂')}
                >
                  {getFieldDecorator('siteId', {
                    initialValue: siteInfo.siteId,
                  })(
                    <Lov
                      code="MT.MOD.SITE_MT_LOT"
                      queryParams={{ tenantId }}
                      textValue={siteInfo.siteName}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPromt}.instructionDocNum`).d('单号')}
                >
                  {getFieldDecorator('instructionDocNum')(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPromt}.instructionDocStatus`).d('单据状态')}
                >
                  {getFieldDecorator('instructionDocStatus')(
                    <Select>
                      {statusList.map(e => (
                        <Option key={e.value} value={e.value}>
                          {e.meaning}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ display: expandForm ? '' : 'none' }}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPromt}.materialCode`).d('物料编码')}
                >
                  {getFieldDecorator('materialId')(
                    <Lov
                      code="WMS.SITE_MATERIAL"
                      queryParams={{ tenantId, siteId: getFieldValue('siteId') }}
                      lovOptions={{ valueField: 'materialId', displayField: 'materialCode' }}
                      onChange={(val, record) => {
                        setFieldsValue({ materialName: record.materialName });
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPromt}.materialName`).d('物料描述')}
                >
                  {getFieldDecorator('materialName')(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPromt}.materialVersion`).d('版本')}
                >
                  {getFieldDecorator('materialVersion')(
                    <Select>
                      {versionList.map(e => (
                        <Option key={e.value} value={e.meaning}>
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
                  label={intl.get(`${modelPromt}.supplierName`).d('供应商')}
                >
                  {getFieldDecorator('supplierId')(
                    <Lov
                      code="MT.SUPPLIER"
                      queryParams={{ tenantId }}
                      lovOptions={{ valueField: 'supplierId', displayField: 'supplierName' }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPromt}.exceptionType`).d('创建时间从')}
                >
                  {getFieldDecorator('createDateFrom')(
                    <DatePicker
                      style={{ width: '100%' }}
                      showTime
                      placeholder={null}
                      format={dateFormatTime}
                      disabledDate={currentDate =>
                        getFieldValue('createDateTo') &&
                        moment(getFieldValue('createDateTo')).isBefore(currentDate, 'day')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPromt}.exceptionType`).d('创建时间从')}
                >
                  {getFieldDecorator('createDateTo')(
                    <DatePicker
                      style={{ width: '100%' }}
                      showTime
                      placeholder={null}
                      format={dateFormatTime}
                      disabledDate={currentDate =>
                        getFieldValue('createDateFrom') &&
                        moment(getFieldValue('createDateFrom')).isAfter(currentDate, 'day')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
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
      </Form>
    );
  }
}
