/**
 *机台数据维护
 *@date：2019/9/22
 *@author：junhui.liu <junhui.liu@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Form, Button, Row, Col, Select } from 'hzero-ui';
import cacheComponent from 'components/CacheComponent';
import { Bind, Throttle } from 'lodash-decorators';
import { isFunction } from 'lodash';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { getCurrentUserId } from 'utils/utils';
import {
  DEBOUNCE_TIME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_CLASSNAME,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';

@Form.create({ fieldNameProp: null })
@cacheComponent({ cacheKey: '/hwms/machine-basic/query' })
class FilterForm extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this); // 子组件form对象传到父组件对象中
    }
    this.state = {
      expandForm: false, // 更多查询的收起与展开
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
    form.validateFields(err => {
      if (!err) {
        onSearch();
      }
    });
  }

  /**
   * 显示或隐藏更多查询条件
   */
  @Throttle(DEBOUNCE_TIME)
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  }

  render() {
    const modelPrompt = 'hwms.machineBasic.model.machineBasic';
    const modelPrompt2 = 'hwms.basicDataMaintain.model.basicDataMaintain';
    const { expandForm } = this.state;
    const { form, tenantId, enableFlagMap, machineTypeMap } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt2}.productionLine`).d('产线')}
            >
              {getFieldDecorator('prodLineId', {})(
                <Lov
                  code="Z.PRODLINE"
                  queryParams={{
                    tenantId,
                    userId: getCurrentUserId(),
                  }}
                  textField="prodLineName"
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.machineCode`).d('机器编号')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('machineCode', {})(
                <Lov code="Z.MACHINE_CODE" queryParams={{ tenantId }} textField="machineCode" />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.machinePlatformCode`).d('机台编码')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('machinePlatformCode', {})(
                <Lov
                  code="Z.MACHINE_PLATFORM_CODE"
                  queryParams={{ tenantId }}
                  textField="machinePlatformCode"
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
              label={intl.get(`${modelPrompt}.machinePlatformType`).d('机台类型')}
            >
              {getFieldDecorator('machinePlatformType', {})(
                <Select allowClear>
                  {machineTypeMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.correspondingMachineB`).d('对应的B机台')}
            >
              {getFieldDecorator('correspondingBId', {})(
                <Lov
                  code="Z.CORRESPONDING_B_ID"
                  queryParams={{ tenantId }}
                  textField="machinePlatformCode1"
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.enableFlag`).d('有效性')}
            >
              {getFieldDecorator('enableFlag', {})(
                <Select allowClear>
                  {enableFlagMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default FilterForm;
