/**
 * CopyDrawer 复制抽屉
 * @date: 2019-7-23
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Spin, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.product.bom.model.bom';
const FormItem = Form.Item;

@connect(({ assemblyList }) => ({
  assemblyList,
}))
@Form.create({ fieldNameProp: null })
export default class CopyDrawer extends React.PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'assemblyList/fetchAssemblyTypes',
      payload: {
        module: 'BOM',
        typeGroup: 'BOM_TYPE',
      },
    });
  }

  @Bind()
  handleOK() {
    const { form, onOk = e => e } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        onOk(fieldsValue);
      }
    });
  }

  render() {
    const {
      form,
      initData,
      visible,
      onCancel,
      assemblyList: { bomTypesList = [] },
    } = this.props;
    const { bomNameNew, revisionNew, bomTypeNew } = initData;
    const { getFieldDecorator } = form;
    return (
      <Modal
        destroyOnClose
        width={380}
        title={intl.get(`${modelPrompt}.bomCopy`).d('装配清单复制')}
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
              label={intl.get(`${modelPrompt}.bomNameNew`).d('目标编码')}
            >
              {getFieldDecorator('bomNameNew', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.bomNameNew`).d('目标编码'),
                    }),
                  },
                ],
                initialValue: bomNameNew,
              })(<Input />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.revisionNew`).d('目标版本')}
            >
              {getFieldDecorator('revisionNew', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.revisionNew`).d('目标版本'),
                    }),
                  },
                ],
                initialValue: revisionNew,
              })(<Input />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.bomTypeNew`).d('目标类型')}
            >
              {getFieldDecorator('bomTypeNew', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.bomTypeNew`).d('目标类型'),
                    }),
                  },
                ],
                initialValue: bomTypeNew,
              })(
                <Select allowClear style={{ width: '100%' }}>
                  {bomTypesList.map(item => (
                    <Select.Option key={item.typeCode} value={item.typeCode}>
                      {item.description}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
