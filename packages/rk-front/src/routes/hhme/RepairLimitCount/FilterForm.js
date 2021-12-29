import React from 'react';
import { Form, Button, Col, Row, Select, InputNumber } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import Lov from 'components/Lov';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import intl from 'utils/intl';

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
  resetSearch = () => {
    const { form, onSearch, departmentList } = this.props;
    form.resetFields();
    if(form) {
      form.setFieldsValue({
        departmentId: (departmentList.find(e => e.defaultOrganizationFlag === 'Y') || {}).areaId,
      });
    }
    if (onSearch) {
      onSearch();
    }
  };

  // 查询
  @Bind
  onSearch = () => {
    const { onSearch, form } = this.props;
    if (onSearch) {
      form.validateFields((err, values) => {
        if (!err) {
          // 如果验证成功,则执行onSearch
          onSearch(values);
        }
      });
    }
  };

  render() {
    const { tenantId, departmentList, form, enableFlag } = this.props;
    const { getFieldDecorator } = form;
    const { expandForm } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="事业部" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('departmentId', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '事业部',
                      }),
                    },
                  ],
                })(
                  <Select
                    allowClear
                    onChange={() => {
                    form.resetFields('workcellId');
                  }}
                  >
                    {departmentList.map(e => (
                      <Select.Option key={e.areaCode} value={e.areaId}>
                        {e.areaCode}
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
              {getFieldDecorator('materialId')(
                <Lov code="Z.MATERIALCODE" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>

          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='工序'
            >
              {getFieldDecorator('workcellId')(
                <Lov
                  code="HME.FINAL_PROCESS"
                  queryParams={{
                  departmentId: form.getFieldValue('departmentId'),
                  tenantId,
                }}
                />
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
              <Button onClick={this.resetSearch}>
                {intl.get(`hzero.common.button.reset`).d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.onSearch}>
                {intl.get(`hzero.common.button.search`).d('查询')}
              </Button>
            </Form.Item>
          </Col>

        </Row>

        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='返修限制次数'
            >
              {getFieldDecorator('limitCount')(
                <InputNumber />
              )}
            </Form.Item>
          </Col>

          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='有效性'
            >
              {getFieldDecorator('enableFlag')(
                <Select allowClear>
                  {enableFlag.map(e=>(
                    <Select.Option key={e.value} value={e.value}>
                      {e.meaning}
                    </Select.Option>
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
