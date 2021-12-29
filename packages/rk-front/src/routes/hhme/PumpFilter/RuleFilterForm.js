import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { Form, Button, Col, Row } from 'hzero-ui';

import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';
import Lov from 'components/Lov';


const RuleFilterForm = (props, ref) => {

  const formRef = useRef();

  useImperativeHandle(ref, () => ({
    ruleFormDom: props.form,
  }));

  const resetSearch = () => {
    const { form, onResetRuleList } = props;
    form.resetFields();
    if (onResetRuleList) {
      onResetRuleList();
    }
  };

  const handleChangeMaterialCode = (val, data) => {
    const { onSearch } = props;
    resetFields(['versionNum', 'revision']);
    setFieldsValue({ materialCode: data.materialCode });
    if (val) {
      onSearch({ materialCode: data.materialCode, materialId: data.materialId });
    }
  };

  const { form: { getFieldDecorator, resetFields, setFieldsValue, getFieldValue }, tenantId, qty, siteInfo } = props;

  return (
    <Form className={SEARCH_FORM_CLASSNAME} ref={formRef}>
      <Row>
        <Col {...FORM_COL_3_LAYOUT}>
          <Form.Item
            {...SEARCH_FORM_ITEM_LAYOUT}
            label='物料编码'
          >
            {getFieldDecorator('materialId')(
              <Lov
                code="HME.SITE_MATERIAL"
                queryParams={{ tenantId }}
                onChange={handleChangeMaterialCode}
              />
            )}
          </Form.Item>
          <Form.Item style={{ display: 'none' }}>
            {getFieldDecorator('materialCode')(<span />)}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_3_LAYOUT}>
          <Form.Item
            {...SEARCH_FORM_ITEM_LAYOUT}
            label='版本号'
          >
            {getFieldDecorator('revision', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '版本号',
                  }),
                },
              ],
            })(
              <Lov
                code="HME.PUMP_SELECTION_REVISION"
                disabled={!getFieldValue('materialCode')}
                queryParams={{
                  tenantId,
                  materialCode: getFieldValue('materialCode'),
                  siteId: siteInfo.siteId,
                }}
              />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_3_LAYOUT} className={SEARCH_COL_CLASSNAME}>
          <Form.Item>
            <Button onClick={resetSearch}>
              {intl.get(`hzero.common.button.reset`).d('重置')}
            </Button>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col {...FORM_COL_3_LAYOUT}>
          <Form.Item
            {...SEARCH_FORM_ITEM_LAYOUT}
            label='泵浦源个数'
          >
            {qty}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};


export default Form.create({ fieldNameProp: null })(forwardRef(RuleFilterForm));
