/**
 * StatusDrawer 号码字段分配编辑抽屉
 * @date: 2019-8-1
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Form, Input, Modal, Spin, Switch } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

const modelPrompt = 'tarzan.hmes.number.model.number';
const FormItem = Form.Item;

@Form.create({ fieldNameProp: null })
export default class StatusDrawer extends React.PureComponent {
  state = {
    visible: false,
    isEdit: false,
    numrangeGroup: null,
    numDescription: null,
    numExample: null,
    enableFlag: null,
    outsideNumFlag: null,
    objectType: null,
    description: null,
    siteDesc: null,
    siteCode: null,
    numrangeId: null,
    objectTypeId: null,
    siteId: null,
    numrangeAssignId: null,
  };

  // 通过props接收父组件传来的方法
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
        numrangeGroup: record.numrangeGroup,
        numDescription: record.numDescription,
        numExample: record.numExample,
        enableFlag: record.enableFlag,
        outsideNumFlag: record.outsideNumFlag,
        objectType: record.objectTypeCode,
        description: record.objectTypeDesc,
        siteDesc: record.siteDesc,
        siteCode: record.site,
        numrangeId: record.numrangeId,
        objectTypeId: record.objectTypeId,
        siteId: record.siteId,
        numrangeAssignId: record.numrangeAssignId,
      });
    } else {
      // 新增
      this.setState({
        visible: true,
        isEdit: false,
        numrangeGroup: null,
        numDescription: null,
        numExample: null,
        enableFlag: null,
        outsideNumFlag: null,
        objectType: null,
        description: null,
        siteDesc: null,
        siteCode: null,
        numrangeId: null,
        objectTypeId: null,
        siteId: null,
        numrangeAssignId: null,
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
    const { form, onOk = e => e, queryFromRecord } = this.props;
    const { isEdit, numrangeId, objectTypeId, siteId, numrangeAssignId } = this.state;
    form.validateFields((err, value) => {
      if (!err) {
        const requestData = {
          numrangeAssignId: isEdit ? numrangeAssignId : '',
          'numrangeId': numrangeId,
          objectId: queryFromRecord.objectId,
          objectTypeCode: value.objectType,
          'objectTypeId': objectTypeId,
          site: value.siteCode,
          'siteId': siteId,
        };
        onOk(requestData);
      }
    });
  }

  @Bind()
  numRangeGroupChange(_, record) {
    if (record) {
      this.setState({
        numrangeId: record.numrangeId,
        numRangeGroup: record.numRangeGroup,
        numDescription: record.numDescription,
        numExample: record.numExample,
        enableFlag: record.enableFlag,
        outsideNumFlag: record.outsideNumFlag,
      });
    }
  }

  @Bind()
  objectTypeChange(_, record) {
    if (record) {
      // 把lov中的参数利用起来
      this.setState({
        description: record.description,
        objectTypeId: record.genTypeId,
      });
    }
  }

  @Bind()
  siteChange(_, record) {
    if (record) {
      this.setState({
        siteCode: record.siteCode,
        siteDesc: record.siteName,
        siteId: record.siteId,
      });
    }
  }

  /**
   * 重置form表单
   */
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
  }

  render() {
    const { form, queryFromRecord } = this.props;
    const { getFieldDecorator } = form;
    const {
      visible,
      isEdit,
      numrangeGroup,
      numDescription,
      numExample,
      enableFlag,
      outsideNumFlag,
      objectType,
      description,
      siteDesc,
      siteCode,
    } = this.state;
    return (
      <Modal
        destroyOnClose
        width={560}
        title={
          isEdit
            ? intl.get('tarzan.hmes.number.title.edit').d('编辑号码段分配')
            : intl.get('tarzan.hmes.number.title.create').d('新建号码段分配')
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
              label={intl.get(`${modelPrompt}.objectCode`).d('编码对象编码')}
            >
              {getFieldDecorator('typeCode', {
                initialValue: queryFromRecord.objectCode,
              })(<Input disabled />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.objectDesc`).d('编码对象描述')}
            >
              {getFieldDecorator('description', {
                initialValue: queryFromRecord.description,
              })(<Input disabled />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.numberRange`).d('号段组号')}
            >
              {getFieldDecorator('numrangeGroup', {
                rules: [
                  {
                    required: true,
                    message: intl
                      .get(`${modelPrompt}.numberRangeNotNull`)
                      .d('号段组号不可为空'),
                  },
                ],
                initialValue: numrangeGroup,
              })(
                <Lov
                  textValue={numrangeGroup}
                  queryParams={{ tenantId, objectId: queryFromRecord.objectId }}
                  code="MT.NUMRANGE_GROUP"
                  onChange={this.numRangeGroupChange}
                />
              )}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.numberRangeDesc`).d('号段描述')}
            >
              {getFieldDecorator('numDescription', {
                initialValue: numDescription,
              })(<Input disabled />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.numExample`).d('号段示例')}
            >
              {getFieldDecorator('numExample', {
                initialValue: numExample,
              })(<Input disabled />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl
                .get(`${modelPrompt}.enableFlag`)
                .d('启用状态')}
            >
              {getFieldDecorator('enableFlag', {
                initialValue: enableFlag === 'Y',
              })(<Switch disabled />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl
                .get(`${modelPrompt}.outSideNumFlag`)
                .d('外部输入编码')}
            >
              {getFieldDecorator('outsideNumFlag', {
                initialValue: outsideNumFlag === 'Y',
              })(<Switch disabled />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.objType`).d('对象类型')}
            >
              {getFieldDecorator('objectType', {
                initialValue: objectType,
              })(
                <Lov
                  code="MT.NUMRANGE_ASSIGN_OBJECT_TYPE"
                  textValue={objectType}
                  queryParams={{ tenantId, objectId: queryFromRecord.objectId }}
                  onChange={this.objectTypeChange}
                />
              )}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.objectTypeDesc`).d('对象类型描述')}
            >
              {getFieldDecorator('description', {
                initialValue: description,
              })(<Input disabled />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.siteCode`).d('站点编码')}
            >
              {getFieldDecorator('siteCode', {
                initialValue: siteCode,
              })(
                <Lov
                  code="MT.SITE"
                  queryParams={{ tenantId }}
                  onChange={this.siteChange}
                  textValue={siteCode}
                />
              )}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.siteDesc`).d('站点描述')}
            >
              {getFieldDecorator('siteDesc', {
                initialValue: siteDesc,
              })(<Input disabled />)}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
