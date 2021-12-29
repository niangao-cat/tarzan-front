import React from 'react';
import { Modal, Form, Input, Spin } from 'hzero-ui';


import intl from 'utils/intl';
import { closeTab } from 'utils/menuTab';
import styles from './index.less';

const DRAWER_FORM_ITEM_LAYOUT_MAX = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const EnterModal = (props) => {

  const handleFetchWorkCellInfo = (e) => {
    const { onFetchWorkCellInfo } = props;
    if (onFetchWorkCellInfo) {
      onFetchWorkCellInfo(e.target.value);
    }
  };

  const handleCloseTab = () => {
    const { onChangeVisible } = props;
    onChangeVisible(false);
    closeTab(`/hhme/pump-filter`);
  };

  const { form: { getFieldDecorator }, loading, visible } = props;
  return (
    <Modal
      destroyOnClose
      width={400}
      title='工位'
      visible={visible}
      footer={null}
      onCancel={handleCloseTab}
      wrapClassName={styles['enter-modal']}
    >
      <Spin spinning={loading}>
        <Form>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT_MAX}
            label='工位编码'
          >
            {getFieldDecorator('workcellCode', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '工位编码',
                  }),
                },
              ],
            })(<Input onPressEnter={handleFetchWorkCellInfo} className="work-cell-code-input" />)}
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};


export default Form.create({ fieldNameProp: null })(EnterModal);