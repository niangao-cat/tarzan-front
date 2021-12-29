import React, { Component } from 'react';
import { Modal, Form, Input } from 'hzero-ui';
import intl from 'utils/intl';

@Form.create({ fieldNameProp: null })
export default class FreezeModal extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const { flag, handleOk, handleCancel, freezeReason, onChangeFreezeReason } = this.props;

    return (
      <Modal
        destroyOnClose
        title={intl.get('22').d('冻结原因')}
        width={400}
        visible={flag}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <Input placeholder="请输入冻结原因" value={freezeReason} onChange={onChangeFreezeReason} />
      </Modal>
    );
  }
}
