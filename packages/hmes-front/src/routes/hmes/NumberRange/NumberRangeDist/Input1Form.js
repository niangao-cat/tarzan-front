import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Radio, Divider, Select, Checkbox, InputNumber } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';

import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
const modelPrompt = 'tarzan.mes.numR.model.numR';

/**
 * 规则框1对应的规则
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ numberRange }) => ({
  numberRange,
}))
@Form.create({ fieldNameProp: null })
export default class Input1Form extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      value: '',
      isOverAll: false,
      currentRadix: 10, // 号段进制
      isNumAlert: undefined, // 号段预警值
      haveLength: false, // 是否输入了输入值固定长度
      haveLimit: false, // 是否输入了输入值长度上限
    };
  }

  onRadioChange = e => {
    this.setState({
      value: e.target.value,
    });
    const {
      form,
      dispatch,
      setCurrentRule,
      numberRange: { inputBox1List = {} },
      changeRuleId,
    } = this.props;
    const { numrangeRuleId } = inputBox1List;
    setCurrentRule(1, e.target.value);
    changeRuleId(e.target.value, 0);
    dispatch({
      type: 'numberRange/updateState',
      payload: {
        inputBox1List: { numrangeRuleId },
      },
    });
    if (e.target.value === '1') {
      form.resetFields([
        'numLowerLimit',
        'numUpperLimit',
        'numAlert',
        'numRadix',
        'numIncrement',
        'numCurrent',
        'dateFormat',
        'timeFormat',
        'callStandardObject',
        'incomeValueLength',
        'numLevel',
        'numConnectInputBox',
        'numResetType',
        'numAlertType',
        'numResetPeriod',
      ]);
      return null;
    }
    if (e.target.value === '2') {
      form.resetFields([
        'fixInput',
        'numCurrent',
        'dateFormat',
        'timeFormat',
        'callStandardObject',
        'incomeValueLength',
      ]);
      return null;
    }
    if (e.target.value === '3') {
      form.resetFields([
        'fixInput',
        'numLowerLimit',
        'numUpperLimit',
        'numAlert',
        'numRadix',
        'numIncrement',
        'numCurrent',
        'timeFormat',
        'callStandardObject',
        'incomeValueLength',
        'numLevel',
        'numConnectInputBox',
        'numResetType',
        'numAlertType',
        'numResetPeriod',
      ]);
      return null;
    }
    if (e.target.value === '4') {
      form.resetFields([
        'fixInput',
        'numLowerLimit',
        'numUpperLimit',
        'numAlert',
        'numRadix',
        'numIncrement',
        'numCurrent',
        'dateFormat',
        'callStandardObject',
        'incomeValueLength',
        'numLevel',
        'numConnectInputBox',
        'numResetType',
        'numAlertType',
        'numResetPeriod',
      ]);
      return null;
    }
    if (e.target.value === '5') {
      form.resetFields([
        'fixInput',
        'numLowerLimit',
        'numUpperLimit',
        'numAlert',
        'numRadix',
        'numIncrement',
        'numCurrent',
        'dateFormat',
        'timeFormat',
        'incomeValueLength',
        'numLevel',
        'numConnectInputBox',
        'numResetType',
        'numAlertType',
        'numResetPeriod',
      ]);
      return null;
    }
    if (e.target.value === 6) {
      form.resetFields([
        'fixInput',
        'numLowerLimit',
        'numUpperLimit',
        'numAlert',
        'numRadix',
        'numIncrement',
        'numCurrent',
        'dateFormat',
        'timeFormat',
        'callStandardObject',
        'numLevel',
        'numConnectInputBox',
        'numResetType',
        'numAlertType',
        'numResetPeriod',
      ]);
      return null;
    }
  };

  // 输入值变化的时候
  @Bind
  onInputChange(rule, value, exampleValue, format) {
    const { setCurrentValue } = this.props;
    setCurrentValue(1, value, exampleValue, format);
    if (rule === '5') {
      this.props.form.setFieldsValue({
        callStandardObject: value,
      });
    }
    if (rule === '6') {
      this.props.form.setFieldsValue({
        incomeValueLengthLimit: '',
        callStandardObject: value,
      });
      this.setState({
        haveLength: true,
        haveLimit: false,
      });
    }
    this.setState({
      value: rule,
    });
  }

  // 输入值长度上限输入值变化的时候
  @Bind
  onInputChangeRule(rule, value, exampleValue, format) {
    const { setCurrentValue } = this.props;
    setCurrentValue(1, value, exampleValue, format);
    this.props.form.setFieldsValue({
      incomeValueLength: '',
    });
    this.setState({
      value: rule,
      haveLimit: true,
      haveLength: false,
    });
  }

  @Bind
  handleNumLevelChange(value) {
    if (value === 'OVERALL_SERIAL_NUM') {
      this.setState({
        isOverAll: true,
      });
    } else {
      this.setState({
        isOverAll: false,
      });
    }
  }

  /**
   * setRadixRule - 通用设置进制规则
   * @param {value} value - 当前规则的value值
   */
  @Bind
  setRadixRule(value) {
    switch (value) {
      case 'HEXADECIMAL':
        this.setNumAndRule(36, '');
        break;
      case 'HEX':
        this.setNumAndRule(16, /^[A-Fa-f0-9]+$/);
        break;
      case 'OCTAL':
        this.setNumAndRule(8, /^ [0-7]+$/);
        break;
      case 'BINARY':
        this.setNumAndRule(2, /^1[10]*$/);
        break;
      case 'DECIMAL':
        this.setNumAndRule(10, /^ [0-9]+$/);
        break;
      default:
        break;
    }
  }

  @Bind
  setNumAndRule(radix) {
    this.setState({
      currentRadix: radix,
    });
  }

  // 号码段下限规则
  @Bind
  lowerValidator(rule, value, callback) {
    const { form } = this.props;
    const { currentRadix } = this.state;
    const lowerValue = form.getFieldValue('numLowerLimit');
    const upperValue = form.getFieldValue('numUpperLimit');
    if (Number.parseInt(lowerValue, currentRadix) < 0) {
      callback(intl.get(`${modelPrompt}.validation.lower`).d('序列号段下限必须大于等于0，请修改!'));
    }
    if (Number.parseInt(lowerValue, currentRadix) > Number.parseInt(upperValue, currentRadix)) {
      callback(
        intl
          .get(`${modelPrompt}.validation.upperThanLower`)
          .d('序列号段下限不能大于上限值，请检查!')
      );
    }
    callback();
  }

  // 号码段上限规则
  @Bind
  upperValidator(rule, value, callback) {
    const { form } = this.props;
    const { currentRadix } = this.state;
    const lowerValue = form.getFieldValue('numLowerLimit');
    const upperValue = form.getFieldValue('numUpperLimit');
    if (Number.parseInt(lowerValue, currentRadix) >= Number.parseInt(upperValue, currentRadix)) {
      callback(
        intl.get(`${modelPrompt}.validation.upper`).d('序列号段上限不能小于等于下限值，请检查!')
      );
    }
    callback();
  }

  // 当前序列号规则
  @Bind
  upperAndLowerValidator(rule, value, callback) {
    const { form } = this.props;
    const { currentRadix } = this.state;
    const lowerValue = form.getFieldValue('numLowerLimit');
    const upperValue = form.getFieldValue('numUpperLimit');
    if (
      value < Number.parseInt(lowerValue, currentRadix) ||
      value > Number.parseInt(upperValue, currentRadix)
    ) {
      callback(
        intl
          .get(`${modelPrompt}.validation.upperAndLower`)
          .d('当前序号需大于等于序列号下限且小于等于序列号上限，请修改!')
      );
    }
    callback();
  }

  // 号段增量不能大于上限规则
  @Bind
  upperThanValidator(rule, value, callback) {
    const { form } = this.props;
    const { currentRadix } = this.state;
    const upperValue = form.getFieldValue('numUpperLimit');
    if (value > Number.parseInt(upperValue, currentRadix)) {
      callback(intl.get(`${modelPrompt}.validation.upperThan`).d('号段增量不可大于上限，请修改!'));
    }
    callback();
  }

  // 号码段预警规则
  @Bind
  alertValidator(rule, value, callback) {
    const { form } = this.props;
    const { currentRadix, isNumAlert } = this.state;
    const lowerValue = form.getFieldValue('numLowerLimit');
    const upperValue = form.getFieldValue('numUpperLimit');
    if (isNumAlert === 'NUMBER') {
      if (value < Number.parseInt(lowerValue, currentRadix)) {
        callback(
          intl
            .get(`${modelPrompt}.validation.lessThanLower`)
            .d('号段预警值不可小于序列号段下限，请修改!')
        );
      }
      if (value > Number.parseInt(upperValue, currentRadix)) {
        callback(
          intl
            .get(`${modelPrompt}.validation.moreThanUpper`)
            .d('号段预警值不可大于序列号段上限，请修改!')
        );
      }
    }
    if (isNumAlert === 'PERCENTAGE') {
      if (value <= 0) {
        callback(
          intl.get(`${modelPrompt}.validation.lessThanZero`).d('号段预警值需大于0%，请修改!')
        );
      }
      if (value > 100) {
        callback(
          intl
            .get(`${modelPrompt}.validation.moreThanHundred`)
            .d('号段预警值需小于等于100%，请修改!')
        );
      }
    }

    callback();
  }

  @Bind
  onChange = e => {
    const { form } = this.props;
    const { getFieldValue } = form;
    form.setFieldsValue({
      numAlertGroup:
        getFieldValue('numAlertType') && e.target.value
          ? getFieldValue('numAlertType') + e.target.value
          : undefined,
    });
  };

  @Bind
  onNumAlertTypeChange(values) {
    const { form } = this.props;
    const { getFieldValue } = form;
    form.setFieldsValue({
      numAlertGroup:
        getFieldValue('numAlert') && values ? values + getFieldValue('numAlert') : undefined,
    });
    this.setState({
      isNumAlert: values,
    });
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      form,
      numberRange: {
        numberLevelList = [],
        numAlertTypeList = [],
        timeFormatList = [],
        dateFormatList = [],
        numResetTypeList = [],
        numRadixList = [],
        inputBox1List = {},
      },
      editFlag,
      numrangeId,
      objectId,
      currentRule1,
      currentRule2,
      currentRule3,
      currentRule4,
      currentRule5,
      isOutside,
      initRule,
      initNumConnectInputBox,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { value, isOverAll, isNumAlert, haveLength, haveLimit } = this.state;
    const {
      fixInput,
      numLowerLimit,
      numUpperLimit,
      numAlert,
      numRadix,
      numIncrement,
      numCurrent,
      dateFormat,
      timeFormat,
      callStandardObject,
      incomeValueLength,
      incomeValueLengthLimit,
      numLevel,
      numRule,
      numResetType,
      numAlertType,
      numResetPeriod,
    } = inputBox1List;
    const isTwo =
      currentRule1 === '2' ||
      currentRule2 === '2' ||
      currentRule3 === '2' ||
      currentRule4 === '2' ||
      currentRule5 === '2';
    return (
      <React.Fragment>
        <Form>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Form.Item>
              {getFieldDecorator('numRule', {
                initialValue: value || numRule,
              })(
                <Radio.Group
                  onChange={this.onRadioChange}
                  disabled={
                    numrangeId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                  }
                  value={value || numRule}
                >
                  <Radio value="1">{intl.get(`${modelPrompt}.ono`).d('固定输入值')}</Radio>
                  <Radio value="2" disabled={isTwo || initRule}>
                    {intl.get(`${modelPrompt}.numSeg`).d('序列号段')}
                  </Radio>
                  <Radio value="3">{intl.get(`${modelPrompt}.dateFormat`).d('日期格式')}</Radio>
                  <Radio value="4">{intl.get(`${modelPrompt}.timeFormat`).d('时间格式')}</Radio>
                  <Radio value="5">
                    {intl.get(`${modelPrompt}.callObject`).d('调用标准对象编码')}
                  </Radio>
                  <Radio value="6">{intl.get(`${modelPrompt}.outInput`).d('外部输入值')}</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </Row>
          <Divider style={{ margin: '12px' }} />
          <Row
            style={{ display: (value || numRule) === '1' ? 'block' : 'none' }}
            {...SEARCH_FORM_ROW_LAYOUT}
          >
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.inputValue`).d('输入值')}
              >
                {getFieldDecorator('fixInput', {
                  initialValue: fixInput,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.inputValue`).d('输入值'),
                      }),
                    },
                  ],
                })(
                  <Input
                    onChange={e => this.onInputChange('1', e.target.value, e.target.value)}
                    disabled={
                      numrangeId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                    }
                    inputChinese={false}
                    maxLength={10}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <span style={{ display: (value || numRule) === '2' ? 'block' : 'none' }}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.numLevel`).d('序列号层级')}
                >
                  {getFieldDecorator('numLevel', {
                    initialValue: numLevel,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.numLevel`).d('序列号层级'),
                        }),
                      },
                    ],
                  })(
                    <Select
                      allowClear
                      style={{ width: '100%' }}
                      disabled={
                        numrangeId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                      }
                      onSelect={this.handleNumLevelChange}
                    >
                      {numberLevelList instanceof Array &&
                        numberLevelList.length !== 0 &&
                        numberLevelList.map(item => {
                          return (
                            <Select.Option value={item.typeCode} key={item.typeCode}>
                              {item.description}
                            </Select.Option>
                          );
                        })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.numConnectInputBox`).d('特定对象关联框')}
                >
                  {getFieldDecorator('numConnectInputBox', {
                    initialValue: initNumConnectInputBox,
                    rules: [
                      {
                        required:
                          !isOverAll &&
                          (currentRule1 === '6' ||
                            currentRule1 === '5' ||
                            currentRule2 === '6' ||
                            currentRule2 === '5' ||
                            currentRule3 === '6' ||
                            currentRule3 === '5' ||
                            currentRule4 === '6' ||
                            currentRule4 === '5' ||
                            currentRule5 === '6' ||
                            currentRule5 === '5'),
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.numConnectInputBox`).d('特定对象关联框'),
                        }),
                      },
                    ],
                  })(
                    <Checkbox.Group
                      style={{ width: '450px' }}
                      disabled={
                        isOverAll &&
                        (numrangeId !== 'create'
                          ? isUndefined(editFlag)
                            ? true
                            : editFlag
                          : false)
                      }
                    >
                      <Checkbox
                        value={1}
                        disabled={!(currentRule1 === '6' || currentRule1 === '5')}
                      >
                        {intl.get(`${modelPrompt}.rule1`).d('规则框1')}
                      </Checkbox>
                      <Checkbox
                        value={2}
                        disabled={!(currentRule2 === '6' || currentRule2 === '5')}
                      >
                        {intl.get(`${modelPrompt}.rule2`).d('规则框2')}
                      </Checkbox>
                      <Checkbox
                        value={3}
                        disabled={!(currentRule3 === '6' || currentRule3 === '5')}
                      >
                        {intl.get(`${modelPrompt}.rule3`).d('规则框3')}
                      </Checkbox>
                      <Checkbox
                        value={4}
                        disabled={!(currentRule4 === '6' || currentRule4 === '5')}
                      >
                        {intl.get(`${modelPrompt}.rule4`).d('规则框4')}
                      </Checkbox>
                      <Checkbox
                        value={5}
                        disabled={!(currentRule5 === '6' || currentRule5 === '5')}
                      >
                        {intl.get(`${modelPrompt}.rule5`).d('规则框5')}
                      </Checkbox>
                    </Checkbox.Group>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.numLowerLimit`).d('序列号下限')}
                >
                  {getFieldDecorator('numLowerLimit', {
                    initialValue: numLowerLimit,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.numLowerLimit`).d('序列号下限'),
                        }),
                      },
                      {
                        validator: this.lowerValidator,
                      },
                    ],
                  })(
                    <Input
                      min={0}
                      typeCase="upper"
                      maxLength={20}
                      onChange={e => this.onInputChange('2', e.target.value, e.target.value)}
                      disabled={
                        numrangeId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.numUpperLimit`).d('序列号上限')}
                >
                  {getFieldDecorator('numUpperLimit', {
                    initialValue: numUpperLimit,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.numUpperLimit`).d('序列号上限'),
                        }),
                      },
                      {
                        validator: this.upperValidator,
                      },
                    ],
                  })(
                    <Input
                      typeCase="upper"
                      maxLength={20}
                      disabled={
                        numrangeId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                      }
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  style={{ marginBottom: 0 }}
                  label={intl.get(`${modelPrompt}.numAlertGroup`).d('号段预警')}
                >
                  {getFieldDecorator('numAlertGroup', {
                    initialValue: numAlertType + numAlert,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.numAlertGroup`).d('号段预警'),
                        }),
                      },
                    ],
                  })(
                    <Input.Group compact>
                      <Form.Item style={{ width: '65%' }}>
                        {getFieldDecorator('numAlertType', {
                          initialValue: numAlertType,
                          rules: [
                            {
                              required: true,
                              validator: this.alertValidator,
                            },
                          ],
                        })(
                          <Select
                            allowClear
                            style={{ width: '100%' }}
                            disabled={
                              numrangeId !== 'create'
                                ? isUndefined(editFlag)
                                  ? true
                                  : editFlag
                                : false
                            }
                            onChange={this.onNumAlertTypeChange}
                          >
                            {numAlertTypeList instanceof Array &&
                              numAlertTypeList.length !== 0 &&
                              numAlertTypeList.map(item => {
                                return (
                                  <Select.Option value={item.typeCode} key={item.typeCode}>
                                    {item.description}
                                  </Select.Option>
                                );
                              })}
                          </Select>
                        )}
                      </Form.Item>
                      <Form.Item style={{ width: '35%' }}>
                        {getFieldDecorator('numAlert', {
                          initialValue: numAlert,
                          rules: [
                            {
                              required: true,
                              validator: this.alertValidator,
                            },
                          ],
                        })(
                          <Input
                            onChange={this.onChange}
                            disabled={
                              numrangeId !== 'create'
                                ? isUndefined(editFlag)
                                  ? true
                                  : editFlag || isUndefined(isNumAlert || numAlertType)
                                : isUndefined(isNumAlert || numAlertType)
                            }
                          />
                        )}
                      </Form.Item>
                    </Input.Group>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.segment`).d('号段进制')}
                >
                  {getFieldDecorator('numRadix', {
                    initialValue: numRadix || 'DECIMAL',
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.segment`).d('号段进制'),
                        }),
                      },
                    ],
                  })(
                    <Select
                      allowClear
                      defaultValue="DECIMAL"
                      style={{ width: '100%' }}
                      disabled={
                        numrangeId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                      }
                    >
                      {numRadixList instanceof Array &&
                        numRadixList.length !== 0 &&
                        numRadixList.map(item => {
                          return (
                            <Select.Option value={item.typeCode} key={item.typeCode}>
                              {item.description}
                            </Select.Option>
                          );
                        })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.numCurrent`).d('当前序列号')}
                >
                  {getFieldDecorator('numCurrent', {
                    initialValue: numCurrent,
                    rules: [
                      {
                        required: isOverAll || isOutside,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.numCurrent`).d('当前序列号'),
                        }),
                      },
                      {
                        validator: this.upperAndLowerValidator,
                      },
                    ],
                  })(
                    <Input
                      disabled={
                        numrangeId !== 'create'
                          ? isUndefined(editFlag)
                            ? true
                            : getFieldValue('numLevel') !== 'OVERALL_SERIAL_NUM' &&
                              (editFlag || !isOverAll)
                          : !isOverAll && getFieldValue('numLevel') !== 'OVERALL_SERIAL_NUM'
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.numInc`).d('号段增量')}
                >
                  {getFieldDecorator('numIncrement', {
                    initialValue: numIncrement || 1,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.numInc`).d('号段增量'),
                        }),
                      },
                      {
                        validator: this.upperThanValidator,
                      },
                    ],
                  })(
                    <InputNumber
                      min={1}
                      style={{ width: '100%' }}
                      disabled={
                        numrangeId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                      }
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  style={{ marginBottom: 0 }}
                  label={intl.get(`${modelPrompt}.numResetTypeGroup`).d('重置周期')}
                >
                  {getFieldDecorator('numResetTypeGroup', {})(
                    <Input.Group compact>
                      <Form.Item style={{ width: '65%' }}>
                        {getFieldDecorator('numResetType', {
                          initialValue: numResetType || 'NO-RESET',
                        })(
                          <Select
                            allowClear
                            style={{ width: '100%' }}
                            disabled={
                              numrangeId !== 'create'
                                ? isUndefined(editFlag)
                                  ? true
                                  : editFlag
                                : false
                            }
                          >
                            {numResetTypeList instanceof Array &&
                              numResetTypeList.length !== 0 &&
                              numResetTypeList.map(item => {
                                return (
                                  <Select.Option value={item.typeCode} key={item.typeCode}>
                                    {item.description}
                                  </Select.Option>
                                );
                              })}
                          </Select>
                        )}
                      </Form.Item>
                      <Form.Item style={{ width: '35%' }}>
                        {getFieldDecorator('numResetPeriod', {
                          initialValue: numResetPeriod,
                        })(
                          <InputNumber
                            style={{ width: '100%' }}
                            min={1}
                            disabled={
                              numrangeId !== 'create'
                                ? isUndefined(editFlag)
                                  ? true
                                  : editFlag
                                : false
                            }
                          />
                        )}
                      </Form.Item>
                    </Input.Group>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </span>
          <Row
            style={{ display: (value || numRule) === '3' ? 'block' : 'none' }}
            {...SEARCH_FORM_ROW_LAYOUT}
          >
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.dateFormat`).d('日期格式')}
              >
                {getFieldDecorator('dateFormat', {
                  initialValue: dateFormat,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.dateFormat`).d('日期格式'),
                      }),
                    },
                  ],
                })(
                  <Select
                    allowClear
                    style={{ width: '100%' }}
                    disabled={
                      numrangeId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                    }
                    onChange={values => this.onInputChange('3', values, values, '3')}
                  >
                    {dateFormatList instanceof Array &&
                      dateFormatList.length !== 0 &&
                      dateFormatList.map(item => {
                        return (
                          <Select.Option value={item.typeCode} key={item.typeCode}>
                            {item.typeCode}
                          </Select.Option>
                        );
                      })}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.dateFormatDesc`).d('日期描述')}
              >
                {getFieldDecorator('dateFormatDesc', {
                  initialValue: (
                    dateFormatList.filter(ele => ele.typeCode === getFieldValue('dateFormat'))[0] ||
                    {}
                  ).description,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row
            style={{ display: (value || numRule) === '4' ? 'block' : 'none' }}
            {...SEARCH_FORM_ROW_LAYOUT}
          >
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.timeFormat`).d('时间格式')}
              >
                {getFieldDecorator('timeFormat', {
                  initialValue: timeFormat,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.timeFormat`).d('时间格式'),
                      }),
                    },
                  ],
                })(
                  <Select
                    allowClear
                    style={{ width: '100%' }}
                    disabled={
                      numrangeId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                    }
                    onChange={values => this.onInputChange('4', values, values, '4')}
                  >
                    {timeFormatList instanceof Array &&
                      timeFormatList.length !== 0 &&
                      timeFormatList.map(item => {
                        return (
                          <Select.Option value={item.typeCode} key={item.typeCode}>
                            {item.typeCode}
                          </Select.Option>
                        );
                      })}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.timeFormatDesc`).d('时间描述')}
              >
                {getFieldDecorator('timeFormatDesc', {
                  initialValue: (
                    timeFormatList.filter(ele => ele.typeCode === getFieldValue('timeFormat'))[0] ||
                    {}
                  ).description,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row
            style={{ display: (value || numRule) === '5' ? 'block' : 'none' }}
            {...SEARCH_FORM_ROW_LAYOUT}
          >
            <Form.Item style={{ display: 'none' }}>
              {getFieldDecorator('callStandardObject', {
                initialValue: callStandardObject,
              })(<span />)}
            </Form.Item>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.objectProperty`).d('对象属性')}
              >
                {getFieldDecorator('callStandardObjectId', {
                  initialValue: callStandardObject,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.objectProperty`).d('对象属性'),
                      }),
                    },
                  ],
                })(
                  <Lov
                    code="MT.NUMRANG_OBJECT_COLUMN"
                    textValue={callStandardObject}
                    queryParams={{
                      tenantId,
                      objectId,
                    }}
                    disabled={
                      numrangeId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                    }
                    onChange={(_, record) =>
                      this.onInputChange('5', record.objectColumnCode, record.objectColumnCode, '5')
                    }
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row
            style={{ display: (value || numRule) === '6' ? 'block' : 'none' }}
            {...SEARCH_FORM_ROW_LAYOUT}
          >
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.incomeValueLength`).d('输入值固定长度')}
              >
                {getFieldDecorator('incomeValueLength', {
                  initialValue: incomeValueLength,
                  rules: [
                    {
                      required: !haveLimit,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.incomeValueLength`).d('输入值固定长度'),
                      }),
                    },
                  ],
                })(
                  <InputNumber
                    max={20}
                    min={1}
                    style={{ width: '100%' }}
                    onChange={values => this.onInputChange('6', values, values, '6')}
                    disabled={
                      numrangeId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.incomeValueLengthLimit`).d('输入值长度上限')}
              >
                {getFieldDecorator('incomeValueLengthLimit', {
                  initialValue: incomeValueLengthLimit,
                  rules: [
                    {
                      required: !haveLength,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.incomeValueLengthLimit`).d('输入值长度上限'),
                      }),
                    },
                  ],
                })(
                  <InputNumber
                    max={20}
                    min={1}
                    style={{ width: '100%' }}
                    onChange={values => this.onInputChangeRule('6', values, values, '6')}
                    disabled={
                      numrangeId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                    }
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}
