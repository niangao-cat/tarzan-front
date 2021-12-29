/**
 * MessageDrawer 类型编辑抽屉
 * @date: 2019-7-30
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Spin, Switch, InputNumber } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import TLEditor from '@/components/TLEditor';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import Lov from 'components/Lov';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';

const modelPrompt = 'tarzan.hmes.generalType.model.generalType';
const FormItem = Form.Item;

@connect(({ loading }) => ({
  loading: loading.effects['generalType/saveType'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.hmes.generalType',
})
export default class TypeDrawer extends React.PureComponent {
  state = {
    canEdit: false,
  };

  componentDidMount() {
    const {
      initData: { initialFlag },
    } = this.props;
    if (initialFlag === 'Y') {
      this.setState({
        canEdit: true,
      });
    }
  }

  @Bind()
  handleOK() {
    const {
      form,
      onOk = e => e,
      initData: { genTypeId },
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        onOk({
          ...fieldsValue,
          sequence: !fieldsValue.sequence ? 0 : fieldsValue.sequence,
          initialFlag: fieldsValue.initialFlag ? 'Y' : 'N',
          defaultFlag: fieldsValue.defaultFlag ? 'Y' : 'N',
          genTypeId,
        });
      }
    });
  }

  editStatus = flag => {
    const {
      initData: { initialFlag },
    } = this.props;
    if (flag && initialFlag) {
      this.setState({
        canEdit: true,
      });
    } else {
      this.setState({
        canEdit: false,
      });
    }
  };

  render() {
    const { form, initData, visible, onCancel, loading } = this.props;
    const { canEdit } = this.state;
    const {
      typeGroup,
      typeCode,
      module: selfModule,
      moduleDesc,
      description,
      defaultFlag,
      initialFlag,
      sequence,
      // _token,
      genTypeId,
    } = initData;
    const { getFieldDecorator } = form;
    const tenantId = getCurrentOrganizationId();
    return (
      <Modal
        destroyOnClose
        width={360}
        title={
          initData.genTypeId
            ? intl.get('tarzan.hmes.generalType.title.edit').d('编辑类型')
            : intl.get('tarzan.hmes.generalType.title.create').d('新建类型')
        }
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleOK}
        confirmLoading={loading}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Spin spinning={false}>
          <Form>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.typeGroup`).d('类型组')}
            >
              {getFieldDecorator('typeGroup', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.typeGroup`).d('类型组'),
                    }),
                  },
                ],
                initialValue: typeGroup,
              })(<Input disabled={canEdit} />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.typeCode`).d('类型编码')}
            >
              {getFieldDecorator('typeCode', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.typeCode`).d('类型编码'),
                    }),
                  },
                ],
                initialValue: typeCode,
              })(<Input disabled={typeCode || canEdit} />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.description`).d('类型描述')}
            >
              {getFieldDecorator('description', {
                initialValue: description,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.description`).d('类型描述')}
                  field="description"
                  dto="io.tarzan.common.domain.entity.MtGenType"
                  pkValue={{ genTypeId: genTypeId || null }}
                  disabled={canEdit}
                  // token={_token}
                />
              )}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.moduleDesc`).d('所属服务包')}
            >
              {getFieldDecorator('module', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.moduleDesc`).d('所属服务包'),
                    }),
                  },
                ],
                initialValue: selfModule,
              })(
                <Lov
                  code="MT.SERVICE_PACKAGE"
                  queryParams={{ tenantId }}
                  textValue={moduleDesc}
                  disabled={canEdit}
                />
              )}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.sequence`).d('展示顺序')}
            >
              {getFieldDecorator('sequence', {
                initialValue: sequence,
              })(<InputNumber min={0} style={{ width: '100%' }} disabled={canEdit} />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.enableFlag`).d('默认状态')}
            >
              {getFieldDecorator('defaultFlag', {
                initialValue: defaultFlag !== 'N',
              })(<Switch disabled={canEdit} />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.initialFlag`).d('系统初始标识')}
            >
              {getFieldDecorator('initialFlag', {
                initialValue: initialFlag !== 'N',
              })(<Switch onChange={this.editStatus} />)}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
