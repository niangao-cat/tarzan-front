import React from 'react';
import { Form, Button, Col, Row, Input, Select, DatePicker } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import moment from 'moment';

import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_3_LAYOUT,
  FORM_FIELD_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';
import { getDateTimeFormat } from 'utils/utils';
import notification from 'utils/notification';
import Lov from 'components/Lov';

const { Option } = Select;

const modelPrompt = 'tarzan.hmes.purchaseOrder';

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
    const { dataSource, onSearch } = this.props;
    if(onSearch && dataSource.filter(e => ['create', 'update'].includes(e._status)).length === 0) {
      onSearch();
    } else {
      notification.warning({
        description: '当前存在未保存的数据，请先保存再新建盘点单据',
      });
    }
  }


  // 渲染
  render() {
    const { form, tenantId, docStatusList = [], userId } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { expandForm } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col span={18}>
            <Row>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.stockTackDocNum`).d('盘点单号')}
                >
                  {getFieldDecorator('stocktakeNum')(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.docStatus`).d('单据状态')}
                >
                  {getFieldDecorator('stocktakeStatus', {
                    initialValue: docStatusList.filter(item => ['NEW', 'RELEASED'].includes(item.value) ).map(e => e.value),
                  })(
                    <Select mode="multiple" allowClear className={FORM_FIELD_CLASSNAME}>
                      {docStatusList.map(e => (
                        <Option key={e.value} value={e.value}>
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
                  label={intl.get(`${modelPrompt}.instructionDocStatus`).d('是否明盘')}
                >
                  {getFieldDecorator('openFlag')(
                    <Select allowClear>
                      <Option key='Y' value='Y'>
                        是
                      </Option>
                      <Option key='N' value='N'>
                        否
                      </Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ display: expandForm ? '' : 'none' }}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.site`).d('工厂')}
                >
                  {getFieldDecorator('siteId')(
                    <Lov
                      code="WMS.SITE_PERMISSION"
                      queryParams={{ tenantId, userId }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.locatorCode`).d('仓库')}
                >
                  {getFieldDecorator('warehouseId')(
                    <Lov code="WMS.WAREHOUSE_PERMISSION" queryParams={{ tenantId, siteId: form.getFieldValue('siteId'), userId }} />
                )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.locatorCode`).d('货位')}
                >
                  {getFieldDecorator('locatorId')(
                    <Lov code="WMS.LOCATOR_LOV" queryParams={{ tenantId, parentLocatorId: getFieldValue('warehouseId') }} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.materialCode`).d('物料编码')}
                >
                  {getFieldDecorator('materialCode')(
                    <Lov
                      code="MT.MATERIAL"
                      queryParams={{ tenantId }}
                      textField="materialCode"
                      isInput
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.materialName`).d('物料描述')}
                >
                  {getFieldDecorator('materialName')(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.createdByName`).d('创建人')}
                >
                  {getFieldDecorator('createUserId')(<Lov code="HME.USER" queryParams={{ tenantId }} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.actualReceivedDateFrom`).d('创建时间从')}
                >
                  {getFieldDecorator('creationDateFrom')(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      showTime
                      format={getDateTimeFormat()}
                      disabledDate={currentDate =>
                      getFieldValue('creationDateTo') &&
                        moment(getFieldValue('creationDateTo')).isBefore(currentDate, 'second')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.actualReceivedDateTo`).d('至')}
                >
                  {getFieldDecorator('creationDateTo')(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      showTime
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
