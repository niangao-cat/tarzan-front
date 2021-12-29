import React, { Component } from 'react';
import { Form, Button, Input, Row, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import notification from 'utils/notification';
import MultipleLov from '../Component/MultipleLov/index';

@Form.create({ fieldNameProp: null })
class FilterForm extends Component {
  constructor(props) {
    super(props);
    const { onRef } = props;
    if (onRef) onRef(this);
    this.state = {
      expandForm: false,
    };
  }

  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
    form.setFieldsValue({
      materialLotCode: '',
      containerCode: '',
    });
  }

  /**
   * 表单校验
   */
  @Bind()
  handleSearch() {
    const { onSearch, form } = this.props;
    if (onSearch) {
      form.validateFields((err, val) => {
        if (!val.materialLotCode && !val.containerCode && !val.equipmentCode) {
          notification.error({
            message: '器件编码、容器编码、设备编码必输一项',
          });
        }else{
          onSearch();
        }
      });
    }
  }

  /**
   * 表单校验
   */
  @Bind()
  handleMoreSearch() {
    const { handleMoreSearch } = this.props;
    handleMoreSearch(true);
  }

  /**
   * 表单展开收起
   */
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      form,
      routerParamState,
      tenantId,
      defaultTagCode = '',
      defaultTagId = [],
    } = this.props;
    const { expandForm } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='器件编码'
            >
              {getFieldDecorator('materialLotCode', {
                initialValue: routerParamState.snType === 'MATERIAL_LOT' ? routerParamState.code : '',
                rules: [
                  {
                    required: false,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '器件编码',
                    }),
                  },
                ],
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='容器编码'
            >
              {getFieldDecorator('containerCode', {
                initialValue: routerParamState.snType === 'CONTAINER' ? routerParamState.code : '',
                rules: [
                  {
                    required: false,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '容器编码',
                    }),
                  },
                ],
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label='设备编码'
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('equipmentCode', {
                rules: [
                  {
                    required: false,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '容器编码',
                    }),
                  },
                ],
              })(
                <Input />
              )}
            </Form.Item>
          </Col>
          {/* <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='是否时效达标'
            >
              {getFieldDecorator('timeStandardFlag')(
                <Select style={{ width: '100%' }} allowClear>
                  <Select.Option value='Y' key='Y'>
                    是
                  </Select.Option>
                  <Select.Option value='N' key='N'>
                    否
                  </Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col> */}
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={() => this.toggleForm()}>
                {expandForm
                  ? intl.get('hzero.common.button.collected').d('收起查询')
                  : intl.get(`hzero.common.button.viewMore`).d('更多查询')}
              </Button>
              <Button onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.handleSearch}>
                {intl.get('tarzan.org.collection.button.search').d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='数据项'
            >
              {getFieldDecorator('tagId', {
                initialValue: defaultTagId.toString(),
              })(
                <MultipleLov
                  code="MT.TAG"
                  queryParams={{ tenantId }}
                  textValue={defaultTagCode.toString()}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default FilterForm;
