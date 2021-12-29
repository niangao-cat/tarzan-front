/**
 * WorkCellDist -撤销SN
 * @date: 2021-05-25
 * @author: liuliyuan <liyuan.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { PureComponent, Fragment } from 'react';
// import { Bind } from 'lodash-decorators';
import { Modal, Form, Input, Button } from 'hzero-ui';
import intl from 'utils/intl';

import { MODAL_FORM_ITEM_LAYOUT } from 'utils/constants';


@Form.create({ fieldNameProp: null })
export default class CancelSnDrawer extends PureComponent {
  constructor(props) {
    super(props);
    if (props.onRef) {
      props.onRef(this);
    }
    this.state = {
    };
  }

  render() {
    const { visible = false, onCancel, form: { getFieldDecorator }, onSubmit, loading } = this.props;

    return (
      <Modal
        destroyOnClose
        width={400}
        title='登记撤销'
        visible={visible}
        onCancel={onCancel}
        footer={(
          <Fragment>
            <Button
              style={{ marginRight: '12px' }}
              onClick={() => onCancel()}
            >
              取消
            </Button>
            <Button
              type="primary"
              onClick={() => onSubmit()}
              loading={loading}
            >
              确定
            </Button>
          </Fragment>
        )}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        placement="right"
        maskClosable
      >
        <Form>
          <Form.Item
            {...MODAL_FORM_ITEM_LAYOUT}
            label='撤销SN'
          >
            {getFieldDecorator('snNum', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '撤销SN',
                  }),
                },
              ],
            })(
              <Input />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
