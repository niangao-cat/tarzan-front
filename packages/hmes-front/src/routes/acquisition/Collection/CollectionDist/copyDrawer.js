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
import formatterCollections from 'utils/intl/formatterCollections';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
import TLEditor from '@/components/TLEditor';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.acquisition.collection.model.collection';

@connect(({ collection, loading }) => ({
  collection,
  copyLoading: loading.effects['collection/copyTag'],
}))
@formatterCollections({ code: 'tarzan.acquisition.collection' })
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
    const { form, visible, onCancel, copyLoading, tagGroupId } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        destroyOnClose
        width={360}
        title={intl.get('tarzan.acquisition.collection.title.copy').d('复制')}
        visible={visible}
        onCancel={onCancel}
        confirmLoading={copyLoading}
        onOk={this.handleOK}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Form>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.tagGroupCode`).d('目标数据收集组编码')}
          >
            {getFieldDecorator('tagGroupCode', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.tagGroupCode`).d('目标数据收集组编码'),
                  }),
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.sourcetagGroupCode`).d('目标数据收集组描述')}
          >
            {getFieldDecorator('tagGroupDescription', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.tagGroupCode`).d('目标数据收集组描述'),
                  }),
                },
              ],
            })(
              <TLEditor
                label={intl.get(`${modelPrompt}.materialName`).d('目标数据收集组描述')}
                field="tagGroupDescription"
                dto="tarzan.general.domain.entity.MtTagGroup"
                pkValue={{ tagGroupId: tagGroupId !== 'create' ? tagGroupId : null }}
                inputSize={{ zh: 64, en: 64 }}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
