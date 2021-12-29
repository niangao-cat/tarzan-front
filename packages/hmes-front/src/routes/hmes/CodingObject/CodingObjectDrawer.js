/**
 * CodingObjectDrawer 编码对象编辑抽屉
 * @date: 2019-7-30
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Spin, Switch } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import TLEditor from '@/components/TLEditor';
import intl from 'utils/intl';
// import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
// import Lov from 'components/Lov';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
// import { isEqual, get as chainGet } from 'lodash';

const modelPrompt = 'tarzan.hmes.codingObject.model.codingObject';
const FormItem = Form.Item;
// const { Option } = Select;

@connect(({ codingObject }) => ({
  codingObject,
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.hmes.codingObject',
})
export default class CodingObjectDrawer extends React.PureComponent {
  // componentDidMount() {
  //   this.props.dispatch({
  //     type: 'codingObject/fetchComBoxList',
  //     payload: {
  //       typeGroup: record.typeGroup,
  //     },
  //   });
  // }

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
  changeTypeGroup = (val, record) => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'codingObject/fetchComBoxList',
      payload: {
        typeGroup: record.typeGroup,
      },
    }).then(() => {
      form.setFieldsValue({
        module: record.module,
      });
    });
    // form.resetFields(['typeGroup'])
  };

  @Bind()
  changeModule = value => {
    const { form, changeModule } = this.props;
    if (!value) {
      form.setFieldsValue({
        typeGroup: null,
      });
    }
    changeModule(value);
  };

  render() {
    const {
      form,
      initData,
      visible,
      onCancel,
      // codingObject: { comboxList = [] },
      // changeModule,
    } = this.props;
    const {
      objectCode,
      // typeGroup,
      // module: selfModule,
      // moduleDesc,
      objectName,
      description,
      enableFlag,
      objectId,
    } = initData;
    const { getFieldDecorator } = form;
    // const tenantId = getCurrentOrganizationId();
    return (
      <Modal
        destroyOnClose
        width={360}
        title={
          initData.objectId
            ? intl.get(`${modelPrompt}.title.edit`).d('编辑编码对象')
            : intl.get(`${modelPrompt}.title.create`).d('新建编码对象')
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
              label={intl.get(`${modelPrompt}.objectCode`).d('编码对象编码')}
            >
              {getFieldDecorator('objectCode', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.objectCode`).d('编码对象编码'),
                    }),
                  },
                ],
                initialValue: objectCode,
              })(<Input inputChinese={false} typeCase="upper" />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.objectName`).d('编码对象短描述')}
            >
              {getFieldDecorator('objectName', {
                initialValue: objectName,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.objectName`).d('编码对象短描述'),
                    }),
                  },
                ],
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.objectName`).d('编码对象短描述')}
                  field="objectName"
                  dto="io.tarzan.common.domain.entity.MtNumrangeObject"
                  pkValue={{ objectId: objectId || null }}
                />
              )}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.description`).d('编码对象长描述')}
            >
              {getFieldDecorator('description', {
                initialValue: description,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.description`).d('编码对象长描述')}
                  field="description"
                  dto="io.tarzan.common.domain.entity.MtNumrangeObject"
                  pkValue={{ objectId: objectId || null }}
                />
              )}
            </FormItem>
            {/* <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.typeGroup`).d('类型组')}
            >
              {getFieldDecorator('typeGroup', {
                initialValue: typeGroup,
                // rules:[{
                //   required:getFieldValue('module'),
                //   message: intl.get('hzero.common.validation.notNull', {
                //     name: intl.get(`${modelPrompt}.module`).d('类型组'),
                //   }),
                // }]
              })(
                <Lov
                  code="MT.GEN_TYPE_GROUP"
                  textValue={typeGroup}
                  onChange={this.changeTypeGroup}
                  queryParams={{ tenantId }}
                />
              )}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.module`).d('所属服务包')}
            >
              {getFieldDecorator('module', {
                // rules: [
                //   {
                //     required: getFieldValue('typeGroup'),
                //     message: intl.get('hzero.common.validation.notNull', {
                //       name: intl.get(`${modelPrompt}.module`).d('所属服务包'),
                //     }),
                //   },
                // ],
                initialValue: moduleDesc,
              })(
                <Select
                  disabled={!getFieldValue('typeGroup')}
                  style={{ width: '100%' }}
                  allowClear
                  onChange={this.changeModule}
                >
                  {comboxList.map(ele => (
                    <Option key={ele.module}>{ele.description}</Option>
                  ))}
                </Select>
              )}
            </FormItem> */}
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
