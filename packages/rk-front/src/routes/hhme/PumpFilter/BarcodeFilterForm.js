import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { Form, Button, Col, Row, Input } from 'hzero-ui';

import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';
import Lov from 'components/Lov';

import RecallButton from './RecallButton';

const formLayout = {
  labelCol: {
    span: 14,
  },
  wrapperCol: {
    span: 10,
  },
};


const RuleFilterForm = (props, ref) => {

  const formRef = useRef();

  useImperativeHandle(ref, () => ({
    formFields: props.form.getFieldsValue(),
  }));

  const resetSearch = () => {
    const { form, resetBarcode } = props;
    form.resetFields();
    if (resetBarcode) {
      resetBarcode();
    }
  };

  const handleScanBarcode = e => {
    const { onScanBarcode } = props;
    if (e.target.value) {
      onScanBarcode(e.target.value);
    }
  };

  const handleFetchBarcodeByLot = (data) => {
    const { onFetchBarcodeByLot } = props;
    if (data.pumpPreSelectionId) {
      onFetchBarcodeByLot(data.pumpPreSelectionId, data.selectionLot);
    }
  };

  const { form: { getFieldDecorator }, barcodeInfo, scanType, tenantId } = props;

  return (
    <Form className={SEARCH_FORM_CLASSNAME} ref={formRef}>
      <Row>
        <Col {...FORM_COL_3_LAYOUT}>
          <Form.Item
            {...SEARCH_FORM_ITEM_LAYOUT}
            label='容器/泵浦源'
          >
            {getFieldDecorator('scanCode')(
              <Input disabled={scanType === 'lot'} id="pumpFilter_scan-code" onPressEnter={handleScanBarcode} />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_3_LAYOUT}>
          <Form.Item
            {...SEARCH_FORM_ITEM_LAYOUT}
            label='筛选批次'
          >
            {getFieldDecorator('selectionLot', {
              initialValue: barcodeInfo.selectionLot,
            })(
              <Lov
                code="HME.PUMP_SELECTION_LOT"
                queryParams={{ tenantId }}
                disabled={scanType === 'barcode'}
                onOk={handleFetchBarcodeByLot}
                textValue={barcodeInfo.selectionLot}
              />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_3_LAYOUT} className={SEARCH_COL_CLASSNAME}>
          <Form.Item>
            <Button onClick={resetSearch}>
              {intl.get(`hzero.common.button.clear`).d('清空')}
            </Button>
            <RecallButton />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item
            {...formLayout}
            label='容器个数'
          >
            {barcodeInfo.containerQty}
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item
            {...formLayout}
            label='泵浦源数'
          >
            {barcodeInfo.pumpQty}
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item
            {...formLayout}
            label='套数'
          >
            {barcodeInfo.setsNum}
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item
            {...formLayout}
            label='已挑选套数'
          >
            {barcodeInfo.alreadySetsNum}
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item
            labelCol={{ span: '16' }}
            wrapperCol={{ span: '8' }}
            label='未挑选套数'
          >
            {barcodeInfo.noSetsNum}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};


export default Form.create({ fieldNameProp: null })(forwardRef(RuleFilterForm));
