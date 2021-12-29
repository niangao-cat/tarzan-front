/**
 * ExtendFieldDrawer 扩展字段编辑抽屉
 * @date: 2019-7-30
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
// import TLEditor from 'components/TLEditor';
import TLEditor from '@/components/TLEditor';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
import Lov from 'components/Lov';
// import { connect } from 'dva';
import { Form, Input, InputNumber, Modal, Spin, Switch } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import React from 'react';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId } from 'utils/utils';

const modelPrompt = 'tarzan.hmes.extendField.model.extendField';
const FormItem = Form.Item;
const tenantId = getCurrentOrganizationId();

@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.hmes.extendField',
})
export default class ExtendFieldDrawer extends React.PureComponent {
  @Bind()
  handleOK() {
    const { initData, form, onOk = e => e } = this.props;
    // const { form, initData, visible, onCancel } = this.props;
    form.validateFields((err, fieldsValue) => {
      const newFieldsValue = fieldsValue;
      newFieldsValue.enableFlag = newFieldsValue.enableFlag ? 'Y' : 'N';
      newFieldsValue.tlFlag = newFieldsValue.tlFlag ? 'Y' : 'N';
      if (!err) {
        onOk({ ...initData, ...newFieldsValue });
      }
    });
  }

  @Bind()
  setTableDetails(_, value) {
    this.props.form.setFieldsValue({
      // attrTable: value.attrTable,
      attrTableDesc: value.attrTableDesc,
      servicePackageDesc: value.typeDesc,
    });
  }

  render() {
    const { form, initData, visible, onCancel } = this.props;
    const {
      attrTable,
      attrTableDesc,
      servicePackageDesc,
      attrName,
      attrMeaning,
      sequence,
      enableFlag,
      tlFlag,
      extendTableDescId,
      extendId,
    } = initData;
    const { getFieldDecorator } = form;
    return (
      <Modal
        destroyOnClose
        width={360}
        title={
          initData.extendTableDescId
            ? intl.get('tarzan.hmes.extendField.title.edit').d('编辑扩展字段')
            : intl.get('tarzan.hmes.extendField.title.create').d('新建扩展字段')
        }
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleOK}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Spin spinning={false}>
          <Form>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.attrTable`).d('表名')}
            >
              {getFieldDecorator('extendTableDescId', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.attrTable`).d('表名'),
                    }),
                  },
                ],
                initialValue: extendTableDescId,
              })(
                <Lov
                  queryParams={{ tenantId }}
                  code="MT.EXTEND_TABLE_DESC"
                  textValue={attrTable}
                  onChange={this.setTableDetails}
                />
              )}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.attrTableDesc`).d('表描述')}
            >
              {getFieldDecorator('attrTableDesc', {
                initialValue: attrTableDesc,
              })(<Input disabled />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.servicePackageDesc`).d('服务包')}
            >
              {getFieldDecorator('servicePackageDesc', {
                initialValue: servicePackageDesc,
              })(<Input disabled />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.attrName`).d('属性名')}
            >
              {getFieldDecorator('attrName', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.attrName`).d('属性名'),
                    }),
                  },
                ],
                initialValue: attrName,
              })(<Input />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.attrMeaning`).d('属性描述')}
            >
              {getFieldDecorator('attrMeaning', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.attrMeaning`).d('属性描述'),
                    }),
                  },
                ],
                initialValue: attrMeaning,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.attrMeaning`).d('属性描述')}
                  field="attrMeaning"
                  dto="io.tarzan.common.domain.entity.MtExtendSettings"
                  pkValue={{ extendId: extendId || null }}
                  inputSize={{ zh: 64, en: 64 }}
                />
              )}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.sequence`).d('顺序')}
            >
              {getFieldDecorator('sequence', {
                initialValue: sequence,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.sequence`).d('顺序'),
                    }),
                  },
                ],
              })(<InputNumber style={{ width: '100%' }} />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.tlFlag`).d('多语言标识')}
            >
              {getFieldDecorator('tlFlag', {
                initialValue: tlFlag === 'Y',
              })(<Switch disabled={initData.extendTableDescId} />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.enableFlag`).d('启用状态')}
            >
              {getFieldDecorator('enableFlag', {
                initialValue: enableFlag ? enableFlag === 'Y' : true,
              })(<Switch />)}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
