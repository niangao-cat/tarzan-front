/**
 * CodingObjectDrawer 编码对象编辑抽屉
 * @date: 2019-7-30
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Spin } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
// import TLEditor from '@/components/TLEditor';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
// import { isEqual, get as chainGet } from 'lodash';

const modelPrompt = 'tarzan.product.materialManager.model.materialManager';
const FormItem = Form.Item;

@connect(({ materialManager }) => ({
  materialManager,
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.product.materialManager',
})
export default class CopyDrawer extends React.PureComponent {
  state = {
    currentMaterialId: undefined,
  };

  @Bind()
  handleOK() {
    const { form, dispatch, onOk } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'materialManager/checkMaterial',
          payload: {
            materialCode: values.materialCode,
          },
        }).then(res => {
          if (res && res.success) {
            if (res.rows && res.rows.materialId) {
              this.editOrAdd(res.rows.materialId);
            } else {
              onOk();
            }
          }
        });
        // onOk();
      }
    });
  }

  @Bind()
  editOrAdd = materialId => {
    const { currentMaterialId } = this.state;
    const {
      onOk,
      dispatch,
      materialManager: { materialManagerItem = {} },
    } = this.props;
    Modal.confirm({
      title: intl.get(`${modelPrompt}.title.remind`).d('提醒'),
      content: intl.get(`${modelPrompt}.confirm.hasAlready`).d('物料编码已经存在,是否覆盖?'),
      onOk: () => {
        materialManagerItem.materialId = materialId;
        dispatch({
          type: 'materialManager/updateState',
          payload: {
            materialManagerItem,
          },
        });
        onOk(materialId, currentMaterialId);
      },
    });
  };

  @Bind()
  getCurrentValue = () => {
    const { dispatch } = this.props;
    const { currentMaterialId } = this.state;
    dispatch({
      type: 'materialManager/fetchSingleMaterial',
      payload: {
        materialId: currentMaterialId,
      },
    });
  };

  @Bind()
  changeValue = (val, record) => {
    const { form } = this.props;
    // dispatch({
    //   type: 'materialManager/checkMaterial',
    //   payload: {
    //     materialCode: record.materialCode,
    //   },
    // }).then(res => {
    //   if (res && res.success) {

    this.setState(
      {
        currentMaterialId: record.materialId,
      },
      () => {
        this.getCurrentValue();
      }
    );
    form.setFieldsValue({
      originmaterialName: record.materialName,
    });
    //   }
    // });
  };

  @Bind()
  changeMaterialCode = e => {
    const {
      dispatch,
      materialManager: { materialManagerItem = {} },
    } = this.props;
    materialManagerItem.materialCode = e.target.value;
    dispatch({
      type: 'materialManager/updateState',
      payload: {
        materialManagerItem,
      },
    });
  };

  // @Bind()
  // changeMaterialName = e => {
  //   const {
  //     dispatch,
  //     materialManager: { materialManagerItem = {} },
  //   } = this.props;
  //   materialManagerItem.materialName = e;
  //   materialManagerItem._tls = this.props.form.getFieldValue('_tls');
  //   dispatch({
  //     type: 'materialManager/updateState',
  //     payload: {
  //       materialManagerItem,
  //     },
  //   });
  // };

  render() {
    const {
      form,
      visible,
      onCancel,
      // materialManager: { materialManagerItem = {} },
    } = this.props;
    // const { materialId } = materialManagerItem;
    const { getFieldDecorator } = form;
    const tenantId = getCurrentOrganizationId();
    return (
      <Modal
        destroyOnClose
        width={360}
        title={intl.get('product.codingObject.title.copy').d('物料复制')}
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
              label={intl.get(`${modelPrompt}.copyFrom`).d('来源物料编码')}
            >
              {getFieldDecorator('originmaterialCode', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.copyFrom`).d('来源物料编码'),
                    }),
                  },
                ],
                // initialValue: objectCode,
              })(
                <Lov
                  code="MT.MATERIAL"
                  // textValue={typeGroup}
                  onChange={this.changeValue}
                  queryParams={{ tenantId }}
                />
              )}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.originmaterialName`).d('来源物料描述')}
            >
              {getFieldDecorator('originmaterialName', {})(<Input disabled />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.copyTo`).d('目标物料编码')}
            >
              {getFieldDecorator('materialCode', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.originmaterialCode`).d('目标物料编码'),
                    }),
                  },
                ],
              })(<Input onChange={this.changeMaterialCode} />)}
            </FormItem>
            {/* <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.materialName`).d('目标物料描述')}
            >
              {getFieldDecorator('materialName', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.materialName`).d('目标物料描述'),
                    }),
                  },
                ],
                // initialValue: materialName,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.materialName`).d('目标物料描述')}
                  field="materialName"
                  dto="tarzan.material.domain.entity.MtMaterial"
                  pkValue={{ materialId: null }}
                  onChange={this.changeMaterialName}
                />
              )}
            </FormItem> */}
          </Form>
        </Spin>
      </Modal>
    );
  }
}
