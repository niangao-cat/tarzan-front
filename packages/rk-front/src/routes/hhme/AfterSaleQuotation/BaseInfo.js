import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import { Form, Row, Col, Input } from 'hzero-ui';
import { isEmpty } from 'lodash';

import { FORM_COL_4_LAYOUT } from 'utils/constants';
import Lov from 'components/Lov';
import intl from 'utils/intl';

import styles from './index.less';

const BaseInfo = (props = {}, ref) => {

  const formRef = useRef();

  useImperativeHandle(ref, () => ({
    formFields: props.form,
  }));

  const handleScanSnNum = (e) => {
    const { onScanSnNum } = props;
    if (onScanSnNum) {
      onScanSnNum(e.target.value);
    }
  };

  const { baseInfo = {}, form: { getFieldDecorator }, isEdit } = props;
  const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  return (
    <div className={styles['afterSaleQuotation_info-box']}>
      <Form ref={formRef}>
        <Row gutter={48}>
          <Col {...FORM_COL_4_LAYOUT} style={{ paddingLeft: 24, paddingRight: 0 }}>
            <Form.Item
              label="序列号"
              {...formLayout}
            >
              {getFieldDecorator('snNum', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '序列号',
                    }),
                  },
                ],
              })(<Input onPressEnter={handleScanSnNum} />)}
            </Form.Item>
          </Col>
          {!isEmpty(baseInfo) && (
            <Col {...FORM_COL_4_LAYOUT} style={{ paddingLeft: 24, paddingRight: 0 }}>
              <Form.Item
                label="售达方"
                {...formLayout}
              >
                {baseInfo.quotationHeaderId && !isEdit
                  ? baseInfo.soldToName
                  : getFieldDecorator('soldTo', {
                    initialValue: baseInfo.soldTo,
                  })(
                    <Lov code="MT.CUSTOMER" textValue={baseInfo.soldToName} />
                  )}
              </Form.Item>
            </Col>
          )}
        </Row>
        {!isEmpty(baseInfo) && (
          <Row gutter={48}>
            <Col {...FORM_COL_4_LAYOUT} style={{ paddingLeft: 24, paddingRight: 0 }}>
              <Form.Item
                label="产品编码"
                {...formLayout}
              >
                {baseInfo.materialCode}
              </Form.Item>
            </Col>
            <Col span={18} style={{ paddingLeft: 0, paddingRight: 0 }}>
              <Form.Item
                label="产品描述"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 21 }}
              >
                {baseInfo.materialName}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT} style={{ paddingLeft: 24, paddingRight: 0 }}>
              <Form.Item
                label="报价单号"
                {...formLayout}
              >
                {baseInfo.quotationCode}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT} style={{ paddingLeft: 24, paddingRight: 0 }}>
              <Form.Item
                label="送达方"
                {...formLayout}
              >
                {baseInfo.sendToName}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT} style={{ paddingLeft: 24, paddingRight: 0 }}>
              <Form.Item
                label="提交时间"
                {...formLayout}
              >
                {baseInfo.submissionData}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT} style={{ paddingLeft: 24, paddingRight: 0 }}>
              <Form.Item
                label="最后修改时间"
                {...formLayout}
              >
                {baseInfo.lastUpdateDate}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT} style={{ paddingLeft: 24, paddingRight: 0 }}>
              <Form.Item
                label="工单号"
                {...formLayout}
              >
                {baseInfo.workOrderNum}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT} style={{ paddingLeft: 24, paddingRight: 0 }}>
              <Form.Item
                label="返回类型"
                {...formLayout}
              >
                {baseInfo.backTypeMeaning}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT} style={{ paddingLeft: 24, paddingRight: 0 }}>
              <Form.Item
                label="机型"
                {...formLayout}
              >
                {baseInfo.model}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT} style={{ paddingLeft: 24, paddingRight: 0 }}>
              <Form.Item
                label="最后修改人"
                {...formLayout}
              >
                {baseInfo.lastUpdatedByName}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT} style={{ paddingLeft: 24, paddingRight: 0 }}>
              <Form.Item
                label="上次报价时间"
                {...formLayout}
              >
                {baseInfo.lastOfferDate}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT} style={{ paddingLeft: 24, paddingRight: 0 }}>
              <Form.Item
                label="上次发货时间"
                {...formLayout}
              >
                {baseInfo.lastSendDate}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT} style={{ paddingLeft: 24, paddingRight: 0 }}>
              <Form.Item
                label="是否质保期内"
                {...formLayout}
              >
                {baseInfo.qualityFlag}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT} style={{ paddingLeft: 24, paddingRight: 0 }}>
              <Form.Item
                label="报价单状态"
                {...formLayout}
              >
                {baseInfo.statusMeaning}
              </Form.Item>
            </Col>
          </Row>
        )}
      </Form>
    </div>
  );
};

export default Form.create({ fieldNameProp: null })(forwardRef(BaseInfo));