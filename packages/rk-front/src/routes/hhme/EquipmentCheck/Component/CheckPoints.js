/**
 * OperationPlatform - 工序作业平台
 * @date: 2020/02/24 17:15:27
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component, Fragment } from 'react';
import { Button, Input, Form, Popover, Pagination, Tooltip, Icon } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isNull } from 'lodash';
import classNames from 'classnames';

import styles from '../index.less';

const iconStyle = {
  fontSize: '20px',
  color: '#FFC000',
  backgroundColor: '#ffffff',
  cursor: 'pointer',
  borderRadius: '50%',
};

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

@Form.create({ fieldNameProp: null })
export default class BaseInfo extends Component {


  @Bind()
  handleClickJustice(value, record) {
    const { onEnterClick } = this.props;
    if (onEnterClick && value) {
      onEnterClick({...record, result: value, checkValue: value });
    }
  }

  @Bind()
  handleClickEnter(value, record, formField) {
    const { onEnterClick, form } = this.props;
    if (onEnterClick && value) {
      form.validateFields([formField], (err) => {
        if(!err) {
          if(record.valueType === 'DECISION_VALUE') {
            onEnterClick({...record, result: value, checkValue: value });
          } else if(record.valueType === 'VALUE') {
            const result = (!isNull(record.minimumValue) && isNull(record.maximalValue) && value >= record.minimumValue)
              || (!isNull(record.maximalValue) && value <= record.maximalValue && isNull(record.minimumValue))
              || (!isNull(record.maximalValue) && !isNull(record.minimumValue) && value >= record.minimumValue && value <= record.maximalValue);
            onEnterClick({...record, checkValue: value, result: result ? 'OK' : 'NG'});
          } else {
            onEnterClick({...record, result: 'OK', checkValue: value });
          }

        }
      });
    }
  }

  @Bind()
  handleClickEnterRemark(value, record) {
    const { onSaveRemark } = this.props;
    if (onSaveRemark && value) {
      onSaveRemark({...record, remark: value });
    }
  }

  @Bind()
  handleSearch(current = 0, pageSize = 10) {
    const { typeCode, onFetchCheckList, onFetchMaintainList } = this.props;
    if(onFetchCheckList && typeCode === 'CHECK') {
      onFetchCheckList({ current, pageSize });
    } else if(onFetchMaintainList && typeCode === 'MAINTENANCE') {
      onFetchMaintainList({ current, pageSize });
    }
  }

  @Bind()
  handleChangeColor(i) {
    return i.result ? i.result === 'OK'
    ? styles['eqCheck_check-content-inside-ok'] : styles['eqCheck_check-content-inside-ng'] : '';
  }

  @Bind()
  handleToExceptionTab() {
    const { onToExceptionTab } = this.props;
    if(onToExceptionTab) {
      onToExceptionTab();
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
      checkList = [],
      pagination,
      typeCode,
    } = this.props;
    return (
      <Fragment>
        <div className={styles['eqCheck_check-content']}>
          {checkList.map((e, index) => {
            return (
              <div className={styles['eqCheck_check-content-outside']}>
                {e.map(i => (
                  <div className={classNames(styles['eqCheck_check-content-inside'], this.handleChangeColor(i))}>
                    <div className={styles['eqCheck_check-item']}>
                      <div className={styles['eqCheck_check-title']}>
                        <div className={styles['eqCheck_check-name']}>
                          <Tooltip title={`${i.docNum} - ${i.tagCode}`}>
                            {i.docNum} - {i.tagCode}
                          </Tooltip>
                        </div>
                        {i.result === 'NG' && (
                          <div className={styles['eqCheck_check-his']}>
                            <Icon style={iconStyle} type="exclamation-circle" onClick={this.handleToExceptionTab} />
                          </div>
                        )}
                      </div>
                      <Popover content={<div className={styles['eqCheck_check-popover']}>{i.tagDescriptions}</div>}>
                        <div className={styles['eqCheck_check-info-content']}>
                          <div className={styles['eqCheck_check-info']}>
                            {i.tagDescriptions}
                            {i.valueType === 'VALUE' && (
                              <div className={styles['eqCheck_check-judge']}>
                                { !isNull(i.standardValue) ? `【${isNull(i.minimumValue) ? '' : i.minimumValue} ~ ${i.standardValue} ~ ${isNull(i.maximalValue) ? '' : i.maximalValue}${i.uomCode}】` : `【${isNull(i.minimumValue) ? '' : i.minimumValue} ~ ${isNull(i.maximalValue) ? '' : i.maximalValue}${i.uomCode}】`}
                              </div>
                            )}
                          </div>
                        </div>
                      </Popover>
                      {i.valueType === 'DECISION_VALUE' ? (
                        <div className={styles['eqCheck_check-decision-input']}>
                          <div className={styles['eqCheck_check-button']}>
                            {i.result === 'OK' && i.docStatus === 'Y' ? (
                              <Button className={styles['eqCheck_check-button-ok']} disabled>OK</Button>
                            ) : i.result === 'NG' && i.docStatus === 'Y' ? (
                              <Button className={styles['eqCheck_check-button-ng']} disabled>NG</Button>
                            ) : (
                              <Fragment>
                                <Button className={styles['eqCheck_check-button-ok']} onClick={() => this.handleClickJustice('OK', i)}>OK</Button>
                                <Button className={styles['eqCheck_check-button-ng']} onClick={() => this.handleClickJustice('NG', i)}>NG</Button>
                              </Fragment>
                            )}
                          </div>
                          <Form>
                            <Form.Item>
                              {getFieldDecorator(`${i.tagCode}-${index}`, {
                                initialValue: i.checkValue,
                              })(
                                <Input disabled />
                              )}
                            </Form.Item>
                          </Form>
                        </div>
                      ) : i.valueType === 'VALUE' ? (
                        <div className={styles['eqCheck_check-value-input']}>
                          <Form>
                            <Form.Item>
                              {getFieldDecorator(`${i.tagCode}-${index}`, {
                                initialValue: i.checkValue,
                                rules: [
                                  {
                                    // eslint-disable-next-line no-useless-escape
                                    pattern: /(^[\-0-9][0-9]*(.[0-9]+)?)$/,
                                    message: '请输入数字',
                                  },
                                ],
                              })(
                                <Input disabled={i.docStatus === 'Y'} onPressEnter={event => this.handleClickEnter(event.target.value, i, `${i.tagCode}-${index}`)} />
                              )}
                            </Form.Item>
                          </Form>
                          <Form style={{ float: 'right', marginRight: '10px'}}>
                            <Form.Item>
                              {getFieldDecorator(`${i.tagCode}-${index}-value`, {
                                initialValue: i.result,
                              })(
                                <Input disabled />
                              )}
                            </Form.Item>
                          </Form>
                        </div>
                      ) : (
                        <div className={styles['eqCheck_check-input']}>
                          <Form>
                            <Form.Item>
                              {getFieldDecorator(`${i.tagCode}-${index}`, {
                                initialValue: i.checkValue,
                              })(
                                <Input disabled={i.docStatus === 'Y'} onPressEnter={event => this.handleClickEnter(event.target.value, i, `${i.tagCode}-${index}`)} />
                              )}
                            </Form.Item>
                          </Form>
                        </div>
                      )}
                      {typeCode === 'MAINTENANCE' && (
                        <div className={styles['eqCheck_check-input-remark']}>
                          <Form>
                            <Form.Item label="备注" {...formLayout}>
                              {getFieldDecorator(`${i.tagCode}-${index}-remark`, {
                                initialValue: i.remark,
                              })(
                                <Input onPressEnter={event => this.handleClickEnterRemark(event.target.value, i)} />
                              )}
                            </Form.Item>
                          </Form>
                        </div>
                      )}
                    </div>
                  </div>
              ))}
              </div>
            );
          })}
        </div>
        <div>
          <Pagination onShowSizeChange={this.handleSearch} onChange={this.handleSearch} {...pagination} />
        </div>
      </Fragment>
    );
  }
}
