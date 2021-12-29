import React from 'react';
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
import MultipleLov from '@/components/MultipleLov';
import moment from 'moment';
import { getDateTimeFormat, getCurrentOrganizationId } from 'utils/utils';
import { getSiteId } from '@/utils/utils';
import { isFunction } from 'lodash';
import ModalContainer, { registerContainer } from '../../../components/Modal/ModalContainer';

const tenantId = getCurrentOrganizationId();

const { Option } = Select;

const modelPromt = 'hwms.tarzan.production-pick-return';

@formatterCollections({
  code: 'hwms.tarzan.production-pick-return',
})
// 表单创建
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
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

  // 重置查询
  @Bind
  resetSearch = () => {
    const { form } = this.props;
    form.resetFields();
  };

  // 查询条件展开/收起
  @Bind
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({ expandForm: !expandForm });
  };

  // 渲染
  render() {
    // 获取整个表单
    const {
      form,
      siteInfo,
      statusMap,
      typeMap,
      departmentMap,
      siteMap,
    } = this.props;
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
              label={intl.get(`${modelPromt}.workOrderNumber`).d('工单号')}
            >
              {getFieldDecorator('workOrderNumber')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.materialLotCode`).d('物料编码')}
            >
              {getFieldDecorator('materialLotCode')(
                <MultipleLov
                  onChange={this.setMaterialCode}
                  queryParams={{
                    tenantId,
                    siteId: getFieldValue('siteId') || getSiteId(),
                  }}
                  code="QMS.MATERIAL"
                  textField="materialCode"
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
                // <Select allowClear className={FORM_FIELD_CLASSNAME}>
                //   {materialVersionMap
                //     .filter(item => item.value !== 'org')
                //     .map(n => (
                //       <Option key={n.value} value={n.value}>
                //         {n.meaning}
                //       </Option>
                //     ))}
                // </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.siteId`).d('工厂')}
            >
              {getFieldDecorator('siteId', {
                initialValue: siteInfo.siteId,
              })(
                <Select allowClear className={FORM_FIELD_CLASSNAME}>
                  {siteMap.map(item => (
                    <Select.Option key={item.siteId} value={item.siteId}>
                      {item.description}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.locator`).d('目标仓库')}
            >
              {getFieldDecorator('locator', {})(
                <MultipleLov
                  code="WMS.WAREHOUSE"
                  queryParams={{
                    tenantId,
                    siteId: getFieldValue('siteId') || getSiteId(),
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.createdBy`).d('创建人')}
            >
              {getFieldDecorator('createdBy')(<Input />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.lastUpdatedBy`).d('执行人')}
            >
              {getFieldDecorator('lastUpdatedBy')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.creationDate`).d('创建时间从')}
            >
              {getFieldDecorator('creationDate')(
                <DatePicker
                  showTime
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('lastUpdateDate') &&
                    moment(getFieldValue('lastUpdateDate')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.lastUpdateDate`).d('创建时间至')}
            >
              {getFieldDecorator('lastUpdateDate', {})(
                <DatePicker
                  showTime
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('creationDate') &&
                    moment(getFieldValue('creationDate')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.department`).d('部门')}
            >
              {getFieldDecorator('department')(
                <Select allowClear className={FORM_FIELD_CLASSNAME} mode="multiple">
                  {departmentMap.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
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
