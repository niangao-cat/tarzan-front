/*
 * @Description: 查询
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-26 16:53:31
 * @LastEditTime: 2021-03-19 11:12:30
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
import { EMAIL } from 'utils/regExp';
import intl from 'utils/intl';
import Lov from 'components/Lov';
/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

const FilterForm = (props, ref) => {

  const formRef = useRef();

  useImperativeHandle(ref, () => ({
    formFields: props.form.getFieldsValue(),
  }));

  const handleSaveData = () => {
    const { handleSave, form } = props;
    form.validateFields((err, values) => {
      if (!err) {
        // 如果验证成功,则执行onSearch
        handleSave(values);
      }
    });
  };

  const {
    form,
    freezePower,
    flagYn,
    operation,
    tenantId,
    handleSaveLoading,
    headDetail,
    editFlag,
    handleEdit,
    cosFreezePower,
  } = props;
  const { getFieldDecorator } = form;
  return (
    <Form className={SEARCH_FORM_CLASSNAME} ref={formRef}>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='用户'>
            {getFieldDecorator('userId', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '用户',
                  }),
                },
              ],
              initialValue: headDetail.userId,
            })(
              <Lov
                code="HME.USER"
                queryParams={{ tenantId }}
                textValue={headDetail.userName}
                disabled={operation !== 'create'}
              />
            )}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='邮箱'>
            {form.getFieldDecorator('email', {
              rules: [
                {
                  pattern: EMAIL,
                  message: intl.get('hzero.common.validation.email').d('邮箱格式不正确'),
                },
                {
                  max: 128,
                  message: intl.get('hzero.common.validation.max', { max: 128 }),
                },
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '邮箱',
                  }),
                },
              ],
              initialValue: headDetail.email,
            })(<Input disabled={editFlag} />)}
          </Form.Item>
        </Col>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='权限'>
            {getFieldDecorator('privilegeType', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '权限',
                  }),
                },
              ],
              initialValue: headDetail.privilegeType,
            })(
              <Select
                style={{ width: '100%' }}
                allowClear
                disabled={editFlag}
              >
                {freezePower.map(item => {
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
        <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
          <FormItem>
            {!editFlag ? (
              <Button
                type="primary"
                icon="save"
                loading={handleSaveLoading}
                onClick={handleSaveData}
              >
                {intl.get('hzero.common.button.save').d('保存')}
              </Button>
            ) : (
              <Button
                type="primary"
                icon="edit"
                onClick={() => handleEdit()}
              >
                {intl.get('hzero.common.button.edit').d('编辑')}
              </Button>
            )}
          </FormItem>
        </Col>
      </Row>
      <Row {...SEARCH_FORM_ROW_LAYOUT}>
        <Col {...FORM_COL_4_LAYOUT}>
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='COS权限'>
            {getFieldDecorator('cosPrivilegeType', {
              initialValue: headDetail.cosPrivilegeType,
            })(
              <Select
                style={{ width: '100%' }}
                allowClear
                disabled={editFlag}
              >
                {cosFreezePower.map(item => {
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
          <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='有效性'>
            {form.getFieldDecorator('enableFlag', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '有效性',
                  }),
                },
              ],
              initialValue: headDetail.enableFlag,
            })(
              <Select
                style={{ width: '100%' }}
                allowClear
                disabled={editFlag}
              >
                {flagYn.map(item => {
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
      </Row>
    </Form>
  );
};

export default Form.create({ fieldNameProp: null })(forwardRef(FilterForm));
