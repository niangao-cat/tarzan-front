/* eslint-disable */
import React from 'react';
import { connect } from 'dva';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
import { Form, Modal, Select } from 'hzero-ui';
import formatterCollections from 'utils/intl/formatterCollections';

const modelPrompt = 'tarzan.process.routes.model.routes';

@connect(({ flow, loading }) => ({
  flow,
  loading: loading.effects['generalType/saveType'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.hmes.generalType',
})
export default class StrategyModal extends React.Component {
  state = {
    canEdit: false,
    modal1Visible: true,
  };

  onCancel = () => {
    this.props.onCancel();
  };

  render() {
    const { visible } = this.props;
    const { getFieldDecorator } = this.props.form;
    const stepDecisionList = [
      {
        typeCode: '1',
        description: '联产品',
      },
      {
        typeCode: '2',
        description: '不良代码',
      },
      {
        typeCode: '3',
        description: '主策略',
      },
    ];

    return (
      <Modal
        title="策略设置"
        centered
        visible={visible}
        onOk={this.onCancel}
        onCancel={this.onCancel}
      >
        <Form>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.currentFlag`).d('路径选择策略')}
          >
            {getFieldDecorator('currentFlag444', {})(
              <Select style={{ width: '100%' }} allowClear>
                {stepDecisionList.map(item => (
                  <Select.Option value={item.typeCode}>{item.description}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.currentFlag`).d('决策值')}
          >
            {getFieldDecorator('currentFlag244', {})(
              <Select style={{ width: '100%' }} allowClear>
                {stepDecisionList.map(item => (
                  <Select.Option value={item.typeCode}>{item.description}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
/* eslint-disable */
