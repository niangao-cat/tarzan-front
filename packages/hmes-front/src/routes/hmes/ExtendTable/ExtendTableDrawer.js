/**
 * ExtendTableDrawer 扩展表编辑抽屉
 * @date: 2019-7-30
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Form, Input, Modal, Spin, Switch } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import TLEditor from '@/components/TLEditor';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import Lov from 'components/Lov';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
import { getCurrentOrganizationId } from 'utils/utils';

const modelPrompt = 'tarzan.hmes.extendTable.model.extendTable';
const FormItem = Form.Item;
const tenantId = getCurrentOrganizationId();

@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.hmes.extendTable',
})
export default class ExtendTableDrawer extends React.PureComponent {
  @Bind()
  handleOK() {
    const { form, onOk = e => e, initData } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        const { extendTableDescId } = initData;
        const enableFlag = fieldsValue.enableFlag ? 'Y' : 'N';
        onOk({ ...fieldsValue, enableFlag, extendTableDescId });
      }
    });
  }

  render() {
    const { form, initData, visible, onCancel } = this.props;
    const {
      attrTable,
      attrTableDesc,
      // servicePackage,
      mainTable,
      mainTableKey,
      hisTable,
      hisAttrTable,
      hisTableKey,
      enableFlag,
      extendTableDescId,
      enabledFlag,
      initialFlag,
      roleCode,
    } = initData;
    const { getFieldDecorator } = form;
    return (
      <Modal
        destroyOnClose
        width={360}
        title={
          initData.extendTableDescId
            ? intl.get('tarzan.hmes.extendTable.title.edit').d('编辑扩展表')
            : intl.get('tarzan.hmes.extendTable.title.create').d('新建扩展表')
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
              {getFieldDecorator('attrTable', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.attrTable`).d('表名'),
                    }),
                  },
                ],
                initialValue: attrTable,
              })(<Lov code="MT.EXTEND_TABLE" textValue={attrTable} queryParams={{ tenantId }} />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.attrTableDesc`).d('表描述')}
            >
              {getFieldDecorator('attrTableDesc', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.attrTableDesc`).d('表描述'),
                    }),
                  },
                ],
                initialValue: attrTableDesc,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.attrTableDesc`).d('表描述')}
                  field="attrTableDesc"
                  dto="io.tarzan.common.domain.entity.MtExtendTableDesc"
                  pkValue={{ extendTableDescId: extendTableDescId || null }}
                />
              )}
            </FormItem>
            {/* <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.servicePackage`).d('服务包')}
            >
              {getFieldDecorator('servicePackage', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.servicePackage`).d('服务包'),
                    }),
                  },
                ],
                initialValue: servicePackage,
              })(
                <Select style={{ width: '100%' }} allowClear>
                  {servicePackageList.map(item => {
                    return (
                      <Select.Option value={item.typeCode} key={item.typeCode}>
                        {item.description}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </FormItem> */}
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.mainTable`).d('主表')}
            >
              {getFieldDecorator('mainTable', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.mainTable`).d('主表'),
                    }),
                  },
                ],
                initialValue: mainTable,
              })(<Input />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.mainTableKey`).d('主表主键')}
            >
              {getFieldDecorator('mainTableKey', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.mainTableKey`).d('主表主键'),
                    }),
                  },
                ],
                initialValue: mainTableKey,
              })(<Input />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.hisTable`).d('主表历史表')}
            >
              {getFieldDecorator('hisTable', {
                initialValue: hisTable,
              })(<Input />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.hisAttrTable`).d('历史表的扩展表')}
            >
              {getFieldDecorator('hisAttrTable', {
                initialValue: hisAttrTable,
              })(<Input />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.hisTableKey`).d('历史表的主键')}
            >
              {getFieldDecorator('hisTableKey', {
                initialValue: hisTableKey,
              })(<Input />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.enableFlag`).d('启用状态')}
            >
              {getFieldDecorator('enableFlag', {
                initialValue: enableFlag !== 'N',
              })(<Switch />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.enableFlag`).d('启用状态')}
            >
              {getFieldDecorator('enabledFlag', {
                initialValue: enabledFlag !== 'N',
              })(
                <Switch
                  disabled={
                    initData.extendTableDescId &&
                    roleCode !== 'administrator' &&
                    initialFlag === 'Y'
                  }
                />
              )}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.intialFlag`).d('初始化')}
            >
              {getFieldDecorator('initialFlag', {
                initialValue: initialFlag === 'Y',
              })(<Switch disabled />)}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
