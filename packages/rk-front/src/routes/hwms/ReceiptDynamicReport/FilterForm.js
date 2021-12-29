/*
 * @Description: 查询
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-02 09:45:02
 * @LastEditTime: 2021-02-03 10:07:17
 */
import React, { useImperativeHandle, useRef, forwardRef, useState } from 'react';
import { Form, Button, Row, Col, Select, DatePicker } from 'hzero-ui';
import notification from 'utils/notification';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  FORM_FIELD_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import { getDateFormat } from 'utils/utils';
import { getSiteId } from '@/utils/utils';
// import moment from 'moment';
import MultipleLov from '../../../components/MultipleLov/index';
import ModalContainer, { registerContainer } from '../../../components/Modal/ModalContainer';
/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

const { Option } = Select;

const FilterForm = (props, ref) => {

  const [expandForm, setExpandForm] = useState(false);
  const [itemGrouplength, setItemGrouplength] = useState(0);

  const formRef = useRef();

  useImperativeHandle(ref, () => ({
    formFields: props.form.getFieldsValue(),
  }));

  // 重置
  const handleFormReset = async () => {
    form.resetFields();
  };

  // 展开
  const toggleForm = () => {
    setExpandForm(!expandForm);
  };

  const onSearch = () => {
    const { handleFetchList, form } = props;
    if (itemGrouplength > 5) {
      form.resetFields(['itemGroupId']);
      form.setFieldsValue({ itemGroupId: null });
      setItemGrouplength(0);
      return notification.error({ message: '物料组最多勾选5条!' });
    }
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        handleFetchList(fieldsValue);
      }
    });
  };

  const resetWithFields = (_, item) => {
    setItemGrouplength(item.length);
  };


  const {
    form,
    tenantId,
    siteMap,
    stockTypeList,
  } = props;
  const { getFieldDecorator, getFieldValue } = form;
  return (
    <Form className={SEARCH_FORM_CLASSNAME} ref={formRef}>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item
            {...SEARCH_FORM_ITEM_LAYOUT}
            label='工厂'
          >
            {getFieldDecorator('siteId', {
              initialValue: getSiteId(),
            })(
              <Select
                allowClear
                // onChange={value => this.setFromWarehouseMap(value)}
                className={FORM_FIELD_CLASSNAME}
              >
                {siteMap
                  .filter(item => item.siteId !== 'org')
                  .map(n => (
                    <Option key={n.siteId} value={n.siteId}>
                      {n.siteCode}
                    </Option>
                  ))}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item
            {...SEARCH_FORM_ITEM_LAYOUT}
            label='物料组'
          >
            {getFieldDecorator('itemGroupId')(
              <MultipleLov
                code="WMS.ITEM_GROUP"
                queryParams={{ tenantId }}
                onChange={(_, item) => resetWithFields(_, item)}
              />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='仓库'>
            {getFieldDecorator('warehouseId')(
              <MultipleLov code="WMS.WAREHOUSE_LOV" queryParams={{ tenantId, siteId: getFieldValue('siteId') }} />
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
      {/* {expandForm && ( */}
      <Row
        {...SEARCH_FORM_ROW_LAYOUT}
        style={{ display: expandForm ? '' : 'none' }}
      >
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item
            {...SEARCH_FORM_ITEM_LAYOUT}
            label='出入库类型'
          >
            {getFieldDecorator('stockType', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '出入库类型',
                  }),
                },
              ],
            })(
              <Select
                allowClear
                className={FORM_FIELD_CLASSNAME}
              >
                {stockTypeList
                  .map(n => (
                    <Option key={n.value} value={n.value}>
                      {n.meaning}
                    </Option>
                  ))}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='出入库时间从'>
            {getFieldDecorator('startDate', {
            })(
              <DatePicker
                // showTime
                placeholder=""
                style={{ width: '100%' }}
                format={getDateFormat()}
              />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='出入库时间至'>
            {getFieldDecorator('endDate', {
            })(
              <DatePicker
                // showTime
                placeholder=""
                style={{ width: '100%' }}
                format={getDateFormat()}
              />
            )}
          </Form.Item>
        </Col>
      </Row>
      {/* )} */}
      <ModalContainer ref={registerContainer} />
    </Form>
  );
};

export default Form.create({ fieldNameProp: null })(forwardRef(FilterForm));
