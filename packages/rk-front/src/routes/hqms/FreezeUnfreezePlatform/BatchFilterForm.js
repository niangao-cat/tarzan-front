/*
 * @Description: 批量输入
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-22 17:50:58
 * @LastEditTime: 2021-02-26 14:05:52
 */
import React, { useImperativeHandle, useRef, forwardRef, useState } from 'react';
import { Form, Button, Row, Col, Select } from 'hzero-ui';
import { uniq, compact } from 'lodash';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';

const FormItem = Form.Item;

const BatchFilterForm = (props, ref) => {

  const [barcodeInputList, setBarcodeInputList] = useState([]);

  const formRef = useRef();

  useImperativeHandle(ref, () => ({
    formFields: props.form.getFieldsValue(),
  }));

  const handleListOnSearch = (value, typeList, type) => {
    if (value.length > 0) {
      const list = value[value.length === 0 ? 0 : value.length - 1].split(/[ ]+/);
      const uniplist = uniq(typeList.concat(compact(list)));
      switch (type) {
        case 'barcodeInputList':
          setBarcodeInputList(uniplist);
          break;
        default:
          break;
      }
    }
  };

  const onSearch = () => {
    const { onFetchLine, form, selectedHeadRowKeys } = props;
    form.validateFields((err) => {
      if (!err) {
        // 如果验证成功,则执行onSearch
        onFetchLine(selectedHeadRowKeys);
      }
    });
  };

  const handleClickFetchList = () => {
    const { handleLineUnfreeze, form, selectedHeadRowKeys, selectedLineRows } = props;
    form.validateFields((err) => {
      if (!err) {
        // 如果验证成功,则执行onSearch
        handleLineUnfreeze(selectedHeadRowKeys, selectedLineRows);
      }
    });
  };

  const {
    form,
    loading,
    selectedHeadRowKeys,
    selectedLineRows,
  } = props;
  const { getFieldDecorator } = form;
  return (
    <Form className={SEARCH_FORM_CLASSNAME} ref={formRef}>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='条码导入'>
            {getFieldDecorator('barcodeInputList', {
              initialValue: barcodeInputList,
            })(
              <Select
                mode="tags"
                style={{ width: '100%' }}
                onChange={
                  val => {
                    if (val.length === 0) {
                      setBarcodeInputList([]);
                    } else {
                      handleListOnSearch(val, barcodeInputList, 'barcodeInputList');
                    }
                  }
                }
                onBlur={() => {
                  form.resetFields(['barcodeInputList']);
                }}
                allowClear
                dropdownMatchSelectWidth={false}
                maxTagCount={2}
              >
                {barcodeInputList.map(e => (
                  <Select.Option key={e} value={e}>
                    {e}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
          <FormItem>
            <Button
              onClick={onSearch}
              disabled={selectedHeadRowKeys.length === 0}
            >
              查询
            </Button>
            <Button
              type="primary"
              onClick={handleClickFetchList}
              loading={loading}
              disabled={selectedLineRows.length === 0}
            >
              解冻
            </Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
};

export default Form.create({ fieldNameProp: null })(forwardRef(BatchFilterForm));
