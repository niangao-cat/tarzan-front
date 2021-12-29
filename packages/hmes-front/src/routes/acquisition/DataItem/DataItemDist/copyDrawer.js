/**
 * UserGroupManagement 复制抽屉
 * @date: 2019-8-20
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
import TLEditor from '@/components/TLEditor';

const modelPrompt = 'tarzan.acquisition.dataItem.model.dataItem';

@connect(({ loading }) => ({
  checkLoading: loading.effects['dataItem/copyTag'],
}))
@formatterCollections({ code: 'tarzan.acquisition.dataItem' })
@Form.create({ fieldNameProp: null })
export default class CopyDrawer extends React.PureComponent {
  @Bind
  handleOK = () => {
    const { form, copySuccess } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        copySuccess(values);
      }
    });
  };

  render() {
    const { form, visible, onCancel, checkLoading, tagId } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        destroyOnClose
        width={360}
        title={intl.get('tarzan.acquisition.dataItem.title.copy').d('复制')}
        visible={visible}
        onCancel={onCancel}
        confirmLoading={checkLoading}
        onOk={this.handleOK}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Form>
          {' '}
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.sourceMaterial`).d('目标数据项编码')}
          >
            {getFieldDecorator('tagCode', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.materialCode`).d('目标数据项编码'),
                  }),
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.sourceMaterialCategory`).d('目标数据项描述')}
          >
            {getFieldDecorator('tagDescription', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.tagGroupCode`).d('目标数据项描述'),
                  }),
                },
              ],
            })(
              <TLEditor
                label={intl.get(`${modelPrompt}.materialName`).d('目标数据项描述')}
                field="tagDescription"
                dto="tarzan.general.domain.entity.MtTag"
                pkValue={{ tagId: tagId !== 'create' ? tagId : null }}
                inputSize={{ zh: 64, en: 64 }}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
