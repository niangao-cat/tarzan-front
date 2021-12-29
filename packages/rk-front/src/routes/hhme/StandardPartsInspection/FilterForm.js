/*
 * @Description: 查询
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-01 10:33:15
 * @LastEditTime: 2021-03-03 09:21:46
 */

import React, { useImperativeHandle, useRef, forwardRef } from 'react';
import { Form, Button, Input, Row, Col, Select } from 'hzero-ui';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import intl from 'utils/intl';
import MultipleLov from './MultipleLov/index';
/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

const FilterForm = (props, ref) => {

  const formRef = useRef();

  useImperativeHandle(ref, () => ({
    formFields: props.form.getFieldsValue(),
    formFieldsReset: () => {
      props.form.resetFields();
    },
  }));

  const handleSearch=()=> {
    const { handleFetchList, form } = props;
    if (handleFetchList) {
      form.validateFields((err) => {
        if (!err) {
          handleFetchList();
        }
      });
    }
  };

  const {
    form,
    tenantId,
    workcellInfo,
    workWay,
    handleFetchListLoading,
    siteId,
  } = props;

  const { getFieldDecorator } = form;

  const handleFormReset = async () => {
    form.resetFields();
  };

  return (
    <Form className={SEARCH_FORM_CLASSNAME} ref={formRef}>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item
            {...SEARCH_FORM_ITEM_LAYOUT}
            label='工位编码'
          >
            {getFieldDecorator('workcellCode')(
              <span>{workcellInfo.workcellCode}</span>
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item
            {...SEARCH_FORM_ITEM_LAYOUT}
            label='工艺'
          >
            {getFieldDecorator('operationName')(
              <span>{workcellInfo.operationName}</span>
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item
            {...SEARCH_FORM_ITEM_LAYOUT}
            label='标准件编码'
          >
            {getFieldDecorator('standardSnCode', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '标准件编码',
                  }),
                },
              ],
            })(
              <Input />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
          <FormItem>
            <Button style={{ marginLeft: 8 }} onClick={() => handleFormReset()}>
              重置
            </Button>
            <Button
              type="primary"
              onClick={()=>handleSearch()}
              loading={handleFetchListLoading}
            >
              查询
            </Button>
          </FormItem>
        </Col>
      </Row>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item
            {...SEARCH_FORM_ITEM_LAYOUT}
            label='物料编码'
          >
            {getFieldDecorator('materialId')(
              <MultipleLov
                code="HME.SITE_MATERIAL"
                queryParams={{ tenantId, siteId }}
              />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item
            {...SEARCH_FORM_ITEM_LAYOUT}
            label='芯片类型'
          >
            {getFieldDecorator('cosType')(
              <Input />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item
            {...SEARCH_FORM_ITEM_LAYOUT}
            label='工作方式'
          >
            {getFieldDecorator('workWay')(
              <Select
                allowClear
                style={{ width: '100%' }}
              >
                {workWay.map(e => (
                  <Select.Option key={e.value} value={e.value}>
                    {e.meaning}
                  </Select.Option>
                ))}
              </Select>)}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default Form.create({ fieldNameProp: null })(forwardRef(FilterForm));
