/*
 * @Description: 查询
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-01 15:21:44
 * @LastEditTime: 2021-03-16 10:59:02
 */

import React, { useImperativeHandle, useRef, forwardRef, useState } from 'react';
import { Form, Button, Input, Row, Col, Select, DatePicker } from 'hzero-ui';
import Lov from 'components/Lov';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import { getDateTimeFormat } from 'utils/utils';
import moment from 'moment';
import { uniq, compact } from 'lodash';
// import MultipleLovNew from '@/components/MultipleLovNew';
import MultipleLov from '../../../components/MultipleLov/index';
import ModalContainer, { registerContainer } from '../../../components/Modal/ModalContainer';


/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

const FilterForm = (props, ref) => {

  const [expandForm, setExpandForm] = useState(false);
  const [standardSnCodeList, setStandardSnCodeList] = useState([]);

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

  // 联动清空
  const resetWithFields = (type) => {
    switch (type) {
      case 'prodLineId':
        form.resetFields([
          'lineWorkcellId',
          'processIdList',
          'workcellId',
        ]);
        break;
      case 'lineWorkcellId':
        form.resetFields([
          'processIdList',
          'workcellId',
        ]);
        break;
      case 'processIdList':
        form.resetFields([
          'workcellId',
        ]);
        break;
      default:
        break;
    }
  };

  const handleListOnSearch = (value, typeList, type) => {
    const flag = value ? value.every(e => typeList.includes(e)) : false;
    // 判断扫描的时候
    if (value && value.length > 1 && (value.length === typeList.length || (value.length - typeList.length) > 1)) {
      switch (type) {
        case 'standardSnCodeList':
          setStandardSnCodeList(value);
          form.setFieldsValue({ 'standardSnCodeList': value });
          break;
        default:
          break;
      }
    } else if (value && value.length > 0 && (!flag || (value.length - typeList.length) === 1)) {
      // excel copy的情况
      const list = value[value.length === 0 ? 0 : value.length - 1].split(/[ ]+/);
      const uniplist = uniq(typeList.concat(compact(list)));
      switch (type) {
        case 'standardSnCodeList':
          setStandardSnCodeList(uniplist);
          form.setFieldsValue({ 'standardSnCodeList': uniplist });
          break;
        default:
          break;
      }
    }
  };

  const {
    form,
    tenantId,
    handleFetchList,
    workWay,
  } = props;
  const { getFieldDecorator, getFieldValue } = form;
  return (
    <Form className={SEARCH_FORM_CLASSNAME} ref={formRef}>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item
            {...SEARCH_FORM_ITEM_LAYOUT}
            label='标准件编码'
          >
            {getFieldDecorator('standardSnCodeList')(
              <Select
                mode="tags"
                style={{ width: '100%' }}
                onChange={
                  val => {
                    if (val.length === 0) {
                      setStandardSnCodeList([]);
                    }
                  }
                }
                onBlur={val => handleListOnSearch(val, standardSnCodeList, 'standardSnCodeList')}
                allowClear
                dropdownMatchSelectWidth={false}
                maxTagCount={2}
              >
                {standardSnCodeList.map(e => (
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
            {getFieldDecorator('materialIdList')(
              <MultipleLov
                queryParams={{ tenantId }}
                code="MT.MATERIAL"
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
              onClick={handleFetchList}
            >
              查询
            </Button>
          </FormItem>
        </Col>
      </Row>
      {expandForm && (
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='工作方式'
            >
              {getFieldDecorator('workWay')(
                <Select
                  style={{ width: '100%' }}
                  allowClear
                >
                  {workWay.map(item => {
                    return (
                      <Select.Option value={item.value} key={item.value}>
                        {item.meaning}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='产线'
            >
              {getFieldDecorator('prodLineId')(
                <Lov code="MT.PRODLINE" queryParams={{ tenantId }} onChange={() => resetWithFields('prodLineId')} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='工段'
            >
              {getFieldDecorator('lineWorkcellId')(
                <Lov
                  code="HME.WORKCELL"
                  onChange={() => resetWithFields('lineWorkcellId')}
                  allowClear
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'),
                    tenantId,
                    typeFlag: 'LINE',
                  }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      )}
      {expandForm && (
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='工序'
            >
              {getFieldDecorator('processIdList')(
                <MultipleLov
                  code="HME.WORKCELL"
                  onChange={() => resetWithFields('processIdList')}
                  allowClear
                  queryParams={{
                    lineId: getFieldValue('lineWorkcellId'),
                    typeFlag: 'PROCESS',
                    tenantId,
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='工位编码'
            >
              {getFieldDecorator('workcellId')(
                <Lov
                  code="HME.WORKCELL"
                  queryParams={{
                    typeFlag: 'STATION',
                    processIdList: getFieldValue('processIdList'),
                    tenantId,
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='操作人'
            >
              {getFieldDecorator('createdByList')(
                <MultipleLov
                  code="HME.USER"
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      )}
      {expandForm && (
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='检验结果'
            >
              {getFieldDecorator('result')(
                <Select
                  style={{ width: '100%' }}
                  allowClear
                >
                  <Select.Option value='OK' key='OK'>
                    OK
                  </Select.Option>
                  <Select.Option value='NG' key='NG'>
                    NG
                  </Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='检验日期从'
            >
              {getFieldDecorator('shiftDateFrom')(
                <DatePicker
                  showTime
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('shiftDateTo') &&
                    moment(getFieldValue('shiftDateTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='检验日期至'
            >
              {getFieldDecorator('shiftDateTo')(
                <DatePicker
                  showTime
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('shiftDateFrom') &&
                    moment(getFieldValue('shiftDateFrom')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      )}
      <ModalContainer ref={registerContainer} />
    </Form>
  );
};

export default Form.create({ fieldNameProp: null })(forwardRef(FilterForm));
