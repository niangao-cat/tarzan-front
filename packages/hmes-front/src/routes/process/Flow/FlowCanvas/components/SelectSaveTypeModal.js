/* eslint-disable */
import React from 'react';
import { connect } from 'dva';
import { Form, Modal, Icon } from 'hzero-ui';
import formatterCollections from 'utils/intl/formatterCollections';

const modelPrompt = 'tarzan.process.routes.model.routes';

@connect(({ loading }) => ({
  loading: loading.effects['generalType/saveType'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.hmes.generalType',
})
export default class SelectSaveTypeModal extends React.Component {
  onCancel = () => {
    this.props.onCancel();
  };

  render() {
    const { visible } = this.props;
    return (
      <Modal
        title="请选择保存类型"
        centered
        visible={visible}
        onOk={this.onCancel}
        okText="保存草稿"
        cancelText="保存正式"
        onCancel={this.onCancel}
      >
        <Icon type="info-circle" style={{ fontSize: 16, color: '#08c' }} />
        <span style={{ fontSize: 'initial' }}> 保存正式还是保存草稿？</span>
      </Modal>
    );
  }
}
/* eslint-disable */
