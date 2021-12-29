/* eslint-disable */
import React from 'react';
import { connect } from 'dva';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
import { Form, Modal, Select } from 'hzero-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import Lov from 'components/Lov';

const modelPrompt = 'tarzan.process.routes.model.routes';

@connect(({ flow, loading }) => ({
  flow,
  loading: loading.effects['generalType/saveType'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.hmes.generalType',
})
export default class ReturnPropertyModal extends React.Component {
  state = {
    canEdit: false,
    modal1Visible: true,
  };

  onCancel = () => {
    this.props.onCancel();
  };

  onOk = () => {
    this.props.onOk();
  };

  render() {
    const { visible } = this.props;
    const { getFieldDecorator } = this.props.form;
    const requiredTimeInProcess = '';
    const stepDecisionList = [
      {
        typeCode: '1',
        description: '任何值钱工艺',
      },
      {
        typeCode: '2',
        description: '制定工艺',
      },
      {
        typeCode: '3',
        description: '来源工艺',
      },
      {
        typeCode: '4',
        description: '任何工艺',
      },
      {
        typeCode: '5',
        description: '下一工艺',
      },
      {
        typeCode: '6',
        description: '前一工艺',
      },
    ];

    return (
      <Modal
        title="返回属性设置"
        centered
        visible={visible}
        onOk={this.onOk}
        onCancel={this.onCancel}
      >
        <Form>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.currentFlag`).d('返回步骤')}
          >
            {getFieldDecorator('currentFlag494', {})(
              <Select style={{ width: '100%' }} allowClear>
                {stepDecisionList.map(item => (
                  <Select.Option value={item.typeCode}>{item.description}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.currentFlag`).d('返回步骤制定工艺')}
          >
            {getFieldDecorator('descriptioneee', {
              initialValue: requiredTimeInProcess,
            })(
              <Lov
                // disabled={!canEdit}
                code="MT.OPERATION"
                // textValue={operationName}
                // queryParams={{ tenantId }}
                onChange={value => {
                  this.getOperationDetails(value);
                }}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
/* eslint-disable */
