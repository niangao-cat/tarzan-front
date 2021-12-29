/*
 * @Description: 三个时长设置卡片
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-09-12 10:52:08
 * @LastEditTime: 2020-10-10 15:29:45
 */

import React, { Component } from 'react';
import { Form, Card, Tooltip, Select } from 'hzero-ui';
import { SelectBox } from 'choerodon-ui/pro';
import { Bind } from 'lodash-decorators';
import { Scrollbars } from 'react-custom-scrollbars';
import { isFunction } from 'lodash';
import Title from '@/components/Title';
import intl from 'utils/intl';
import styles from '../index.less';

@Form.create({ fieldNameProp: null })
export default class TimeCard extends Component {
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

  @Bind()
  handleTimeChange(val) {
    const { handleTimeChange } = this.props;
    handleTimeChange(val);
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      form,
      dataSource = [],
      // initialValue,
      titleValue,
      materialsInfo = {},
      code,
      timeUom=[],
    } = this.props;
    const { getFieldDecorator } = form;
    // const arr = [];
    // initialValue.forEach(item => {
    //   arr.push(item.ncCode);
    // });
    const titleProps = {
      titleValue,
    };
    return (
      <React.Fragment>
        <Card className={styles['aging-material-packaging-first-card']}>
          <Title {...titleProps} />
          <Form>
            {code === "mtlotTime" && (
              <Form.Item className={styles['aging-material-packaging-first-card-type']} labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="时长类别">
                {form.getFieldDecorator('timeUom', {
                  rules: [
                    {
                      // required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '分装数量',
                      }),
                    },
                  ],
                })(
                  <Select
                    style={{ width: '100%' }}
                    allowClear
                    onSelect={this.handleTimeChange}
                  >
                    {timeUom.map(item => {
                      return (
                        <Select.Option value={item.value} key={item.value}>
                          {item.meaning}
                        </Select.Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            )}
            <Scrollbars style={{ height: '246px' }}>
              <Form.Item>
                {getFieldDecorator('time', {
                  // initialValue,
                })(
                  <SelectBox
                    mode="button"
                    disabled={
                      code === materialsInfo.dateTimeFrom && materialsInfo.dateTimeTo
                    }
                    onChange={this.handleTimeChange}
                  >
                    {dataSource.map(item => (
                      <SelectBox.Option
                        value={item.value}
                      >
                        <Tooltip title={item.meaning}>
                          <div
                            style={{
                              width: '45px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              textAlign: 'center',
                            }}
                          >
                            {item.meaning}
                          </div>
                        </Tooltip>
                      </SelectBox.Option>
                    ))}
                  </SelectBox>
                )}
              </Form.Item>
            </Scrollbars>
          </Form>
        </Card>
      </React.Fragment>
    );
  }
}
