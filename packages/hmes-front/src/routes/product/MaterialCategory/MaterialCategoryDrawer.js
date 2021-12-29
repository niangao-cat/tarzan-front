/**
 * MaterialCategoryDrawer 物料类别编辑抽屉
 * @date: 2019-7-31
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Spin, Switch } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import intl from 'utils/intl';
import TLEditor from '@/components/TLEditor';
import Lov from 'components/Lov';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

const modelPrompt = 'tarzan.product.materialCategory.model.materialCategory';
const FormItem = Form.Item;

@connect(({ materialCategory, loading }) => ({
  materialCategory,
  fetchLoading: loading.effects['materialCategory/fetchMaterialCategoryList'],
}))
@Form.create({ fieldNameProp: null })
export default class MaterialCategoryDrawer extends React.PureComponent {
  state = {
    visible: false,
    categorySetDesc: '',
    categorySetCode: '',
    enableFlag: '',
    categoryCode: '',
    description: '',
    materialCategorySetId: '',
    isEdit: false,
    materialCategoryId: '',
  };

  componentDidMount() {
    this.props.onRef(this);
  }

  @Bind()
  showDrawer(record) {
    if (record) {
      // 编辑
      this.setState({
        visible: true,
        isEdit: true,
        materialCategoryId: record.materialCategoryId,
        categorySetDesc: record.categorySetDesc,
        categorySetCode: record.categorySetCode,
        enableFlag: record.enableFlag,
        categoryCode: record.categoryCode,
        description: record.description,
        materialCategorySetId: record.materialCategorySetId,
      });
    } else {
      // 新增
      this.setState({
        visible: true,
        isEdit: false,
        materialCategoryId: '',
        categorySetDesc: '',
        categorySetCode: '',
        enableFlag: '',
        categoryCode: '',
        description: '',
        materialCategorySetId: '',
      });
    }
  }

  @Bind()
  onCancel() {
    this.setState({
      visible: false,
    });
  }

  @Bind()
  handleOK() {
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        const requestData = fieldsValue;
        if (this.state.materialCategoryId) {
          requestData.materialCategoryId = this.state.materialCategoryId;
        }
        requestData.materialCategorySetId = this.state.materialCategorySetId;
        if (requestData.enableFlag) {
          requestData.enableFlag = 'Y';
        } else {
          requestData.enableFlag = 'N';
        }
        // 发起存储的请求
        dispatch({
          type: 'materialCategory/saveMaterialCategory',
          payload: {
            ...requestData,
          },
        }).then(res => {
          if (res.success) {
            notification.success({
              message: '操作成功',
            });
            this.setState({ visible: false });
            // 查询列表
            dispatch({
              type: 'materialCategory/fetchMaterialCategoryList',
            });
          } else {
            notification.error({
              message: res.message,
            });
          }
        });
      }
    });
  }

  @Bind()
  changeSetCode(_, record) {
    this.setState({
      categorySetDesc: record.description,
      materialCategorySetId: record.materialCategorySetId,
    });
  }

  render() {
    const { form } = this.props;
    const {
      isEdit,
      categoryCode,
      visible,
      categorySetCode,
      categorySetDesc,
      enableFlag,
      description,
      materialCategoryId,
    } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Modal
        destroyOnClose
        width={360}
        title={
          isEdit
            ? intl.get('tarzan.product.materialCategory.title.edit').d('编辑物料类别')
            : intl.get('tarzan.product.materialCategory.title.create').d('新建物料类别')
        }
        visible={visible}
        onCancel={this.onCancel}
        onOk={this.handleOK}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Spin spinning={false}>
          <Form>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.categoryCode`).d('物料类别')}
            >
              {getFieldDecorator('categoryCode', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.categoryCode`).d('物料类别'),
                    }),
                  },
                ],
                initialValue: categoryCode,
              })(<Input />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.description`).d('物料类别描述')}
            >
              {getFieldDecorator('description', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.description`).d('物料类别描述'),
                    }),
                  },
                ],
                initialValue: description,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.description`).d('物料类别描述')}
                  field="description"
                  dto="tarzan.material.domain.entity.MtMaterialCategory"
                  pkValue={{ materialCategoryId: materialCategoryId || null }}
                  inputSize={{ zh: 64, en: 64 }}
                />
              )}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.materialCategorySetId`).d('所属类别集编码')}
            >
              {getFieldDecorator('materialCategorySetId', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.materialCategorySetId`).d('所属类别集编码'),
                    }),
                  },
                ],
                initialValue: categorySetCode,
              })(
                <Lov
                  textValue={categorySetCode}
                  isInput
                  code="MT.MATERIAL_CATEGORY_SET"
                  queryParams={{ tenantId }}
                  onChange={this.changeSetCode}
                />
              )}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.categorySetDesc`).d('所属类别集描述')}
            >
              {getFieldDecorator('categorySetDesc', {
                initialValue: categorySetDesc,
              })(<Input disabled />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.enableFlag`).d('启用状态')}
            >
              {getFieldDecorator('enableFlag', {
                initialValue: enableFlag === 'Y',
              })(<Switch />)}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
