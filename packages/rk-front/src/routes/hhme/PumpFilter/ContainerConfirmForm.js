import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { Form, Modal, Input, notification } from 'hzero-ui';

import {
  SEARCH_FORM_CLASSNAME,
} from 'utils/constants';
import intl from 'utils/intl';
import { filterNullValueObject } from 'utils/utils';
import { isEmpty } from 'lodash';

const formLayOut = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
}; // 编辑表单 表单字段的布局


const LotFilterForm = (props, ref) => {

  const formRef = useRef();

  useImperativeHandle(ref, () => ({
    formFields: props.form.getFieldsValue(),
  }));

  const handleCloseModal = () => {
    props.onSetVisible(false);
  };

  const handleConfirm = () => {
    const { form, onConfirm } = props;
    form.validateFields((err, value) => {
      if (!err) {
        const { targetContainerCode, ...barcodes } = value;
        const barcodeList = Object.values(filterNullValueObject(barcodes));
        if (isEmpty(barcodeList)) {
          notification.warning('请扫描需要筛选的条码！');
        } else {
          const { selectedRows } = props;
          const selectedBarcodeList = selectedRows.map(e => e.materialLotCode);
          const flag = barcodeList.every(e => selectedBarcodeList.includes(e));
          if (flag) {
            onConfirm(targetContainerCode, barcodeList).then(res => {
              if (res) {
                handleCloseModal(false);
              }
            });
          } else {
            notification.warning({ description: '当前扫描条码，与勾选条码不匹配，请重新扫描！' });
          }
        }
      }
    });
  };

  const handleTurnToNext = (index) => {
    const inputDom = document.getElementsByClassName(`PumpFilter_input-${index + 1}`);
    if (inputDom.length > 0) {
      inputDom[0].focus();
    }
  };

  const { form: { getFieldDecorator }, selectedRows = [], visible } = props;

  return (
    <Form className={SEARCH_FORM_CLASSNAME} ref={formRef}>
      <Modal
        destroyOnClose
        width={400}
        title='筛选确认'
        visible={visible}
        onCancel={handleCloseModal}
        onOk={handleConfirm}
      >
        <Form.Item
          {...formLayOut}
          label='目标容器'
        >
          {getFieldDecorator('targetContainerCode', {
            rules: [
              {
                required: true,
                message: intl.get('hzero.common.validation.notNull', {
                  name: '目标容器',
                }),
              },
            ],
          })(
            <Input className="PumpFilter_input-0" onPressEnter={() => handleTurnToNext(0)} />
          )}
        </Form.Item>
        {selectedRows.map((e, index) => (
          <Form.Item
            {...formLayOut}
            label={`条码${index + 1}`}
          >
            {getFieldDecorator(`barcode${index + 1}`)(
              <Input className={`PumpFilter_input-${index + 1}`} onPressEnter={() => handleTurnToNext(index + 1)} />
            )}
          </Form.Item>
        ))}
      </Modal>

    </Form>
  );
};


export default Form.create({ fieldNameProp: null })(forwardRef(LotFilterForm));
