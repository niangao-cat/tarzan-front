/**
 * MaterialCategorySetDrawer 物料类别集编辑抽屉
 * @date: 2019-7-31
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Form, Input, Modal, Spin, Switch } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import TLEditor from '@/components/TLEditor';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
// import { isUndefined } from 'lodash';

const modelPrompt = 'tarzan.product.maSet.model.maSet';
const FormItem = Form.Item;

@Form.create({ fieldNameProp: null })
export default class MaterialCategorySetDrawer extends React.PureComponent {
  @Bind()
  handleOK() {
    const { form, initData, onOk = e => e } = this.props;
    const { materialCategorySetId } = initData;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        const defaultManufacturingFlag = fieldsValue.defaultManufacturingFlag ? 'Y' : 'N';
        const defaultScheduleFlag = fieldsValue.defaultScheduleFlag ? 'Y' : 'N';
        const defaultPurchaseFlag = fieldsValue.defaultPurchaseFlag ? 'Y' : 'N';
        const enableFlag = fieldsValue.enableFlag ? 'Y' : 'N';
        onOk({
          ...fieldsValue,
          materialCategorySetId,
          defaultManufacturingFlag,
          defaultScheduleFlag,
          defaultPurchaseFlag,
          enableFlag,
        });
      }
    });
  }

  render() {
    const { form, initData, visible, onCancel } = this.props;
    const {
      categorySetCode,
      description,
      defaultScheduleFlag,
      defaultPurchaseFlag,
      defaultManufacturingFlag,
      enableFlag,
      materialCategorySetId,
    } = initData;
    const { getFieldDecorator } = form;
    return (
      <Modal
        destroyOnClose
        width={360}
        title={
          initData.materialCategorySetId
            ? intl.get('tarzan.product.maSet.title.edit').d('编辑物料类别集')
            : intl.get('tarzan.product.maSet.title.create').d('新建物料类别集')
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
              label={intl.get(`${modelPrompt}.categorySetCode`).d('物料类别集编码')}
            >
              {getFieldDecorator('categorySetCode', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.categorySetCode`).d('物料类别集编码'),
                    }),
                  },
                ],
                initialValue: categorySetCode,
              })(<Input typeCase="upper" trim inputChinese={false} />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.description`).d('物料类别集描述')}
            >
              {getFieldDecorator('description', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.description`).d('物料类别集描述'),
                    }),
                  },
                ],
                initialValue: description,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.description`).d('物料类别集描述')}
                  field="description"
                  dto="tarzan.material.domain.entity.MtMaterialCategorySet"
                  pkValue={{ materialCategorySetId: materialCategorySetId || null }}
                  inputSize={{ zh: 64, en: 64 }}
                />
              )}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.defaultScheduleFlag`).d('计划默认类别集')}
            >
              {getFieldDecorator('defaultScheduleFlag', {
                initialValue: defaultScheduleFlag === 'Y',
              })(<Switch />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.defaultPurchaseFlag`).d('采购默认类别集')}
            >
              {getFieldDecorator('defaultPurchaseFlag', {
                initialValue: defaultPurchaseFlag === 'Y',
              })(<Switch />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.defaultManufacturingFlag`).d('生产默认类别集')}
            >
              {getFieldDecorator('defaultManufacturingFlag', {
                initialValue: defaultManufacturingFlag === 'Y',
              })(<Switch />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.enableFlag`).d('启用状态')}
            >
              {getFieldDecorator('enableFlag', {
                initialValue: enableFlag !== 'N',
              })(<Switch />)}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
