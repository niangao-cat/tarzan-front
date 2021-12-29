/**
 * OperationPlatform - 工序作业平台
 * @date: 2020/02/24 17:15:27
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { Form, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import isUndefined from 'lodash/isUndefined';
import styles from './index.less';
@Form.create({ fieldNameProp: null })
export default class Title extends Component {
  constructor(props) {
    super(props);
    if (props.onRef) {
      props.onRef(this);
    }
  }

  @Bind()
  handleEnterClick(e) {
    const { onEnterClick, itemCode, isContainer = false, form } = this.props;
    if (onEnterClick) {
      onEnterClick(e.target.value);
    }

    if (!isContainer) {
      form.setFieldsValue({ [itemCode]: undefined });
    }
  }

  render() {
    const {
      titleValue,
      used,
      sum,
      isInput = false,
      itemCode,
      containerCode,
      form: { getFieldDecorator },
      isContainer = false,
      isContainerOut = true,
      disabled = false,
    } = this.props;
    return (
      <div className={styles['item-title']}>
        <span style={{ color: '#fff' }}>{titleValue}</span>
        {isInput &&
          (itemCode && (
            <Form.Item>
              {getFieldDecorator(itemCode, {
                initialValue: containerCode,
              })(
                <Input
                  onPressEnter={this.handleEnterClick}
                  disabled={isContainer && !isContainerOut || disabled}
                />
              )}
            </Form.Item>
          ))}
        {!(isUndefined(used) && isUndefined(sum)) && (
          <span style={{ float: 'right' }}>{`${used} / ${sum}`}</span>
        )}
      </div>
    );
  }
}
