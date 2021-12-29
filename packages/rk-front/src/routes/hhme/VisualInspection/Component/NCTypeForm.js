/*
 * @Description: 不良form
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-06 11:03:26
 * @LastEditTime: 2020-11-16 13:58:30
 */
import React, { Component } from 'react';
import { Form, Button, Tooltip, Popconfirm } from 'hzero-ui';
import { SelectBox } from 'choerodon-ui/pro';
import { Bind } from 'lodash-decorators';
import { Scrollbars } from 'react-custom-scrollbars';
import { isFunction } from 'lodash';
import styles from '../index.less';

@Form.create({ fieldNameProp: null })
class NCTypeForm extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
    };
  }

  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
  }

  // 创建不良
  @Bind()
  handleNcCode() {
    const { form, ncRecordConfirm } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        ncRecordConfirm(fieldsValue);
      }
    });
  }

  // 创建不良
  @Bind()
  ncRecordDelete() {
    const { form, ncRecordDelete } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        ncRecordDelete(fieldsValue);
      }
    });
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, ncList, ncRecordList, ncRecordConfirmLoading, selectInfo, customizelocation } = this.props;
    const { getFieldDecorator } = form;
    const arr = [];
    ncRecordList.forEach(item => {
      arr.push(item.ncCode);
    });
    return (
      <React.Fragment>
        <Form className={styles['bar-operating-platform-nctype']}>
          <Scrollbars style={{ height: '190px' }}>
            <Form.Item>
              {getFieldDecorator('ncCodeList', {
                initialValue: arr,
              })(
                <SelectBox mode="button" multiple>
                  {ncList.map(item => (
                    <SelectBox.Option
                      value={item.ncCode}
                    >
                      <Tooltip title={item.description}>
                        <div
                          style={{
                            width: '70px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.description}
                        </div>
                      </Tooltip>
                    </SelectBox.Option>
                  ))}
                </SelectBox>
              )}
            </Form.Item>
          </Scrollbars>
        </Form>
        <div style={{ marginTop: '10px', textAlign: 'end' }}>
          <Popconfirm title={`以下位置将会被设置不良 ${customizelocation} , 请确认！`} onConfirm={this.handleNcCode}>
            <Button
              type="primary"
              style={{ marginRight: '8px' }}
              disabled={selectInfo.length === 0}
              loading={ncRecordConfirmLoading}
            >
              提交
            </Button>
          </Popconfirm>
        </div>
      </React.Fragment>
    );
  }
}

export default NCTypeForm;
