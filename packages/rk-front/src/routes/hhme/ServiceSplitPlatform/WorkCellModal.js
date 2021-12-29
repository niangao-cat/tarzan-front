import React, { Component } from 'react';
import { Modal, Form, Input, Spin } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import { closeTab } from 'utils/menuTab';

const prefixModel = `hmes.operationPlatform.model.operationPlatform`;

@Form.create({ fieldNameProp: null })
export default class WorkCellModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  @Bind()
  handleFetchWorkCellInfo(e) {
    const { onFetchWorkCellInfo, onFetchEquipment } = this.props;
    if (onFetchWorkCellInfo) {
      onFetchWorkCellInfo(e.target.value);
    }
    if(onFetchEquipment) {
      onFetchEquipment(e.target.value);
    }
  }

  @Bind()
  handleSave() {
    const { form, onFetchWorkCellInfo } = this.props;
    form.validateFields((err, value) => {
      if (!err) {
        if (onFetchWorkCellInfo) {
          onFetchWorkCellInfo(value.workcellCode);
        }
      }
    });
  }

  @Bind()
  handleCloseTab() {
    closeTab(`/hhme/service-split-platform`);

  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      visible,
      fetchWorkCellInfoLoading,
    } = this.props;
    const DRAWER_FORM_ITEM_LAYOUT_MAX = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    return (
      <Modal
        destroyOnClose
        width={400}
        title={intl.get('hmes.operationPlatform.view.message.title').d('工位')}
        visible={visible}
        footer={null}
        onCancel={this.handleCloseTab}
        onOk={this.handleSave}
      >
        <Spin spinning={fetchWorkCellInfoLoading || loading || false}>
          <Form>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT_MAX}
              label={intl.get(`${prefixModel}.stationCode`).d('工位编码')}
            >
              {getFieldDecorator('workcellCode', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${prefixModel}.stationCode`).d('工位编码'),
                  }),
                },
              ],
            })(<Input onPressEnter={this.handleFetchWorkCellInfo} className="work-cell-code-input" />)}
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
