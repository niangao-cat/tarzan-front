/**
 * CopyDrawer 替代项抽屉
 * @date: 2019-8-5
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Form, Input, Modal, Spin, InputNumber, DatePicker } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import moment from 'moment';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

const modelPrompt = 'tarzan.product.bom.model.bom';
const FormItem = Form.Item;

@Form.create({ fieldNameProp: null })
export default class SubstituteItemDrawer extends React.PureComponent {
  state = {
    materialId: '',
    materialName: '',
    materialCode: '',
    substituteValue: '',
    substituteUsage: '',
    dateFrom: '',
    dateTo: '',
    bomSubstituteId: '',
  };

  @Bind()
  handleOK() {
    const { form, onOk = e => e } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        onOk(fieldsValue);
      }
    });
  }

  @Bind()
  setMaterialName(_, record) {
    this.setState({
      materialId: record.materialId,
      materialName: record.materialName,
      materialCode: record.materialCode,
    });
  }

  @Bind()
  onOk() {
    const { form, onOk = e => e, initData } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        const value = fieldsValue;
        value.dateFrom = moment(value.dateFrom).format('YYYY-MM-DD HH:mm:ss');
        if (value.dateTo) {
          value.dateTo = moment(value.dateTo).format('YYYY-MM-DD HH:mm:ss');
        }
        value.bomSubstituteId = initData.bomSubstituteId ? initData.bomSubstituteId : '';
        value.materialId = this.state.materialId ? this.state.materialId : initData.materialId;
        onOk(value);
      }
    });
    this.setState({
      materialId: '',
      materialName: '',
      materialCode: '',
      substituteValue: '',
      substituteUsage: '',
      dateFrom: '',
      dateTo: '',
      bomSubstituteId: '',
    });
  }

  @Bind()
  onCancel() {
    const { onCancel } = this.props;
    onCancel();
    this.setState({
      materialId: '',
      materialName: '',
      materialCode: '',
      substituteValue: '',
      substituteUsage: '',
      dateFrom: '',
      dateTo: '',
      bomSubstituteId: '',
    });
  }

  render() {
    const { form, visible, initData, currentBomId } = this.props;
    let a;
    if (initData.bomSubstituteId) {
      a = initData;
    } else {
      a = this.state;
    }

    const {
      materialCode,
      materialName,
      substituteValue,
      substituteUsage,
      dateFrom,
      dateTo,
      bomSubstituteId,
    } = a;
    const { getFieldDecorator } = form;
    return (
      <Modal
        destroyOnClose
        width={360}
        title={
          bomSubstituteId
            ? intl.get(`${modelPrompt}.edit`).d('编辑')
            : intl.get(`${modelPrompt}.create`).d('新建')
        }
        visible={visible}
        onCancel={this.onCancel}
        onOk={this.onOk}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Spin spinning={false}>
          <Form>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.materialId`).d('替代物料编码')}
            >
              {getFieldDecorator('materialId', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.materialId`).d('替代物料编码'),
                    }),
                  },
                ],
                initialValue: materialCode,
              })(
                <Lov
                  code="MT.BOM_MATERIAL"
                  textValue={materialCode}
                  queryParams={{ tenantId, bomId: currentBomId }}
                  onChange={this.setMaterialName}
                />
              )}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.materialName`).d('替代物料描述')}
            >
              {getFieldDecorator('materialName', {
                initialValue: this.state.materialName || materialName,
              })(<Input disabled />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.substituteValue`).d('替代值')}
            >
              {getFieldDecorator('substituteValue', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.substituteValue`).d('替代值'),
                    }),
                  },
                ],
                initialValue: substituteValue,
              })(<InputNumber min={0} style={{ width: '100%' }} />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.substituteUsage`).d('替代用量')}
            >
              {getFieldDecorator('substituteUsage', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.substituteUsage`).d('替代用量'),
                    }),
                  },
                ],
                initialValue: substituteUsage,
              })(<InputNumber min={0} style={{ width: '100%' }} precision={6} />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.dateFrom`).d('生效时间')}
            >
              {getFieldDecorator('dateFrom', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.dateFrom`).d('生效时间'),
                    }),
                  },
                ],
                initialValue: dateFrom && moment(dateFrom),
              })(
                <DatePicker
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.dateTo`).d('失效时间')}
            >
              {getFieldDecorator('dateTo', {
                initialValue: dateTo && moment(dateTo),
              })(
                <DatePicker
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
