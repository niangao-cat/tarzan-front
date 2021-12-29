import React, { Component } from 'react';
import { Modal, Form } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import MultipleLov from '@/components/MultipleLov';
import styles from './index.less';

const DRAWER_FORM_ITEM_LAYOUT_MAX = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

@Form.create({ fieldNameProp: null })
export default class EnterModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  @Bind()
  handleClickOk() {
    const { form, onFetchProdLineInfo } = this.props;
    form.validateFields((err, value) => {
      if (!err) {
        if (onFetchProdLineInfo) {
          onFetchProdLineInfo(value.prodLineIds);
        }
      }
    });
  }

  @Bind()
  handleCloseTab() {
    const { onCloseModal } = this.props;
    if(onCloseModal) {
      onCloseModal();
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
      visible,
      tenantId,
    } = this.props;

    return (
      <Modal
        destroyOnClose
        width={400}
        title='产线'
        visible={visible}
        onCancel={this.handleCloseTab}
        onOk={this.handleClickOk}
        wrapClassName={styles['enter-modal']}
      >
        <Form>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT_MAX}
            label='产线'
          >
            {getFieldDecorator('prodLineIds', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '工位编码',
                  }),
                },
              ],
            })(
              <MultipleLov
                code="HME.FINAL_PRODLINE"
                queryParams={{ tenantId }}
                lovOption={{ valueField: 'prodLineId' }}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
