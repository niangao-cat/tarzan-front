/**
 * StatusDrawer 类型编辑抽屉
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
import formatterCollections from 'utils/intl/formatterCollections';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';

const modelPrompt = 'tarzan.hmes.status.model.status';
const FormItem = Form.Item;

@connect(({ loading }) => ({
  loading: loading.effects['generalStatus/saveStatus'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({ code: 'tarzan.hmes.status' })
export default class StatusDrawer extends React.PureComponent {
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
      initData: { genStatusId },
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        onOk({
          ...fieldsValue,
          sequence: !fieldsValue.sequence ? 0 : fieldsValue.sequence,
          initialFlag: fieldsValue.initialFlag ? 'Y' : 'N',
          defaultFlag: fieldsValue.defaultFlag ? 'Y' : 'N',
          genStatusId,
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
      statusGroup,
      statusCode,
      module: selfModule,
      moduleDesc,
      description,
      defaultFlag,
      initialFlag,
      sequence,
      genStatusId,
    } = initData;
    const { getFieldDecorator } = form;
    const tenantId = getCurrentOrganizationId();
    return (
      <Modal
        destroyOnClose
        width={360}
        title={
          initData.genStatusId
            ? intl.get('tarzan.hmes.status.title.edit').d('编辑状态')
            : intl.get('tarzan.hmes.status.title.create').d('新建状态')
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
              label={intl.get(`${modelPrompt}.statusGroup`).d('状态组')}
            >
              {getFieldDecorator('statusGroup', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.statusGroup`).d('状态组'),
                    }),
                  },
                ],
                initialValue: statusGroup,
              })(<Input disabled={canEdit} />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.statusCode`).d('状态编码')}
            >
              {getFieldDecorator('statusCode', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.statusCode`).d('状态编码'),
                    }),
                  },
                ],
                initialValue: statusCode,
              })(<Input disabled={statusCode || canEdit} />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.description`).d('描述')}
            >
              {getFieldDecorator('description', {
                initialValue: description,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.description`).d('描述')}
                  field="description"
                  disabled={canEdit}
                  dto="io.tarzan.common.domain.entity.MtGenStatus"
                  pkValue={{ genStatusId: genStatusId || null }}
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
                  disabled={canEdit}
                  textValue={moduleDesc}
                />
              )}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.sequence`).d('展示顺序')}
            >
              {getFieldDecorator('sequence', {
                initialValue: sequence,
              })(<InputNumber style={{ width: '100%' }} disabled={canEdit} />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.enableFlag`).d('启用状态')}
            >
              {getFieldDecorator('defaultFlag', {
                initialValue: defaultFlag === 'Y',
              })(<Switch disabled={canEdit} />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.initialFlag`).d('系统初始标识')}
            >
              {getFieldDecorator('initialFlag', {
                initialValue: initialFlag === 'Y',
              })(<Switch onChange={this.editStatus} />)}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
