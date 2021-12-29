import React from 'react';
import { Form, Button, Col, Row, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { uniq } from 'lodash';

@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      snNumList: [],
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

  @Bind
  handleOnSearch(value){
    const {snNumList} = this.state;
    const {form} = this.props;
    const flag = value ? value.every(e=>snNumList.includes(e)) : false;
    if(value && value.length > 0 && (!flag || snNumList.length === 0)) {
      const newList = value[value.length === 0 ? 0 : value.length - 1].split(/[ ]+/);
      const uniqueList = uniq(snNumList.concat(newList));
      this.setState({ snNumList: uniqueList });
      form.setFieldsValue({ snNumList: uniqueList });
    } else if(value && value.length > 0 && value.length === snNumList.length) {
      form.setFieldsValue({ employeeNums: value });
    }
  }

  render() {
    const{ tenantId, statusList, departmentList, form } = this.props;
    const { getFieldDecorator } = form;
    const {expandForm, snNumList} = this.state;

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
              label='SN编码'
            >
              {getFieldDecorator('snNumList')(
                <Select
                  mode="tags"
                  style={{width: "100%"}}
                  onBlur={val => this.handleOnSearch(val)}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        this.setState({snNumList: [] });
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {snNumList.map(e => (
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
              label='物料编码'
            >
              {getFieldDecorator('materialId')(
                <Lov code="Z.MATERIALCODE" queryParams={{ tenantId }} />
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
              {/* <Button onClick={this.resetSearch}>
                {intl.get(`hzero.common.button.reset`).d('重置')}
              </Button> */}
              <Button type="primary" htmlType="submit" onClick={this.onSearch}>
                {intl.get(`hzero.common.button.search`).d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>

        {/* style={{ display: expandForm ? '' : 'none' }} */}
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='工序编码'
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

          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='状态'
            >
              {getFieldDecorator('status')(
                <Select allowClear style={{ width: '100%' }}>
                  {statusList.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
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
