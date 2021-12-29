/*
 * @Description: 查询
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-03-09 17:18:39
 * @LastEditTime: 2021-03-11 15:05:14
 */

import React, { useImperativeHandle, useRef, forwardRef, useState } from 'react';
import { Form, Button, Row, Col, Select, DatePicker } from 'hzero-ui';
import MultipleLov from '@/components/MultipleLov';
import { uniq, compact } from 'lodash';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import intl from 'utils/intl';
import moment from 'moment';
/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

const { MonthPicker } = DatePicker;

const FilterForm = (props, ref) => {

  const [expandForm, setExpandForm] = useState(false);
  const [materialCodeList, setMaterialCodeList] = useState([]);

  const formRef = useRef();

  useImperativeHandle(ref, () => ({
    formFields: props.form.getFieldsValue(),
  }));

  // 重置
  const handleFormReset = async () => {
    form.resetFields();
    setMaterialCodeList([]);
  };

  // 展开
  const toggleForm = () => {
    setExpandForm(!expandForm);
  };

  const onSearch = () => {
    const { handleFetchList, form } = props;
    form.validateFields((err) => {
      if (!err) {
        // 如果验证成功,则执行onSearch
        handleFetchList();
      }
    });
  };

  const handleListOnSearch = (value, typeList, type) => {
    const flag = value ? value.every(e => typeList.includes(e)) : false;
    if (value && value.length > 0 && (!flag || typeList.length === 0)) {
      const list = value[value.length === 0 ? 0 : value.length - 1].split(/[ ]+/);
      const uniplist = uniq(typeList.concat(compact(list)));
      switch (type) {
        case 'materialCodeList':
          setMaterialCodeList(uniplist);
          form.setFieldsValue({ 'materialCodeList': uniplist });
          break;
        default:
          break;
      }
    } else if (value && value.length > 0 && value.length === typeList.length) {
      switch (type) {
        case 'materialCodeList':
          form.setFieldsValue({ 'materialCodeList': value });
          break;
        default:
          break;
      }
    }
  };

  const handleChangeArea = () => {
    const { form } = props;
    form.resetFields(['prodLineId']);
  };


  const {
    form,
    tenantId,
    areaList,
    departmentInfo,
  } = props;
  const { getFieldDecorator, getFieldValue } = form;
  return (
    <Form className={SEARCH_FORM_CLASSNAME} ref={formRef}>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='部门'>
            {getFieldDecorator('areaId', {
              initialValue: departmentInfo.areaId,
            })(
              <Select
                style={{ width: '100%' }}
                allowClear
                onChange={handleChangeArea}
              >
                {areaList.map(e => (
                  <Select.Option key={e.areaId} value={e.areaId}>
                    {e.areaName}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='产线'>
            {getFieldDecorator('prodLineId')(
              <MultipleLov
                code="HME.FINAL_PRODLINE"
                allowClear
                queryParams={{
                  tenantId,
                  departmentId: getFieldValue('areaId'),
                }}
              />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='月份'>
            {getFieldDecorator('queryMonth', {
              initialValue: moment(),
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '月份',
                  }),
                },
              ],
            })(
              <MonthPicker
                placeholder=""
                style={{ width: '100%' }}
                format="YYYY-MM"
              />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
          <FormItem>
            <Button onClick={() => toggleForm()}>
              更多查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => handleFormReset()}>
              重置
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              onClick={onSearch}
            >
              查询
            </Button>
          </FormItem>
        </Col>
      </Row>
      {expandForm && (
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='物料编码'>
              {getFieldDecorator('materialCodeList')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        setMaterialCodeList([]);
                      }
                    }
                  }
                  onBlur={val => handleListOnSearch(val, materialCodeList, 'materialCodeList')}
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {materialCodeList.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
      )}
    </Form>
  );
};

export default Form.create({ fieldNameProp: null })(forwardRef(FilterForm));
