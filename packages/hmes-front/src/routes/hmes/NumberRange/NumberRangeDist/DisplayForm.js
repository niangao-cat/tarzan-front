import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Switch, Icon } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';

import {
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import intl from 'utils/intl';
import TLEditor from '@/components/TLEditor';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';
import Input1Form from './Input1Form';
import Input2Form from './Input2Form';
import Input3Form from './Input3Form';
import Input4Form from './Input4Form';
import Input5Form from './Input5Form';

const tenantId = getCurrentOrganizationId();
const modelPrompt = 'tarzan.mes.numR.model.numR';

/**
 * 表单数据展示
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ numberRange }) => ({
  numberRange,
}))
@Form.create({ fieldNameProp: null })
export default class DisplayForm extends Component {
  input1Form;

  input2Form;

  input3Form;

  input4Form;

  input5Form;

  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      currentInput: 1,
      currentValue1: undefined,
      currentValue2: undefined,
      currentValue3: undefined,
      currentValue4: undefined,
      currentValue5: undefined,
      exampleValue1: undefined,
      exampleValue2: undefined,
      exampleValue3: undefined,
      exampleValue4: undefined,
      exampleValue5: undefined,
      currentRule1: undefined,
      currentRule2: undefined,
      currentRule3: undefined,
      currentRule4: undefined,
      currentRule5: undefined,
      objectId: undefined,
      isOutside: undefined,
      newNumConnectInputBox1: undefined,
      newNumConnectInputBox2: undefined,
      newNumConnectInputBox3: undefined,
      newNumConnectInputBox4: undefined,
      newNumConnectInputBox5: undefined,
    };
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    this.setState({
      currentInput: 1,
      currentValue1: undefined,
      currentValue2: undefined,
      currentValue3: undefined,
      currentValue4: undefined,
      currentValue5: undefined,
      exampleValue1: undefined,
      exampleValue2: undefined,
      exampleValue3: undefined,
      exampleValue4: undefined,
      exampleValue5: undefined,
      currentRule1: undefined,
      currentRule2: undefined,
      currentRule3: undefined,
      currentRule4: undefined,
      currentRule5: undefined,
      objectId: undefined,
      isOutside: undefined,
      newNumConnectInputBox1: undefined,
      newNumConnectInputBox2: undefined,
      newNumConnectInputBox3: undefined,
      newNumConnectInputBox4: undefined,
      newNumConnectInputBox5: undefined,
    });
    dispatch({
      type: 'numberRange/updateState',
      payload: {
        inputBox1List: {},
        inputBox2List: {},
        inputBox3List: {},
        inputBox4List: {},
        inputBox5List: {},
      },
    });
  }

  // 编码对象LOV框选中事件
  @Bind
  setObJectName(_, record) {
    this.props.form.setFieldsValue({ objectName: record.description });
    this.setState({ objectId: record.objectId });
  }

  /**
   * updateList - 缓存规则框的数据
   * @param {int} input - 将要缓存的规则框
   */
  // @Bind
  // updateList(input) {
  //   const inputForm =
  //     (input === 1 && this.input1Form) ||
  //     (input === 2 && this.input2Form) ||
  //     (input === 3 && this.input3Form) ||
  //     (input === 4 && this.input4Form) ||
  //     (input === 5 && this.input5Form);
  //   // const values = inputForm.props.form.getFieldsValue();
  // }

  // 选中规则框1
  @Bind
  onFocusInput1() {
    this.setState({
      currentInput: 1,
    });
  }

  // 选中规则框2
  @Bind
  onFocusInput2() {
    this.setState({
      currentInput: 2,
    });
  }

  // 选中规则框3
  @Bind
  onFocusInput3() {
    this.setState({
      currentInput: 3,
    });
  }

  // 选中规则框4
  @Bind
  onFocusInput4() {
    this.setState({
      currentInput: 4,
    });
  }

  // 选中规则框5
  @Bind
  onFocusInput5() {
    this.setState({
      currentInput: 5,
    });
  }

  @Bind
  onOneRef(ref = {}) {
    this.input1Form = ref;
  }

  @Bind
  onTwoRef(ref = {}) {
    this.input2Form = ref;
  }

  @Bind
  onThreeRef(ref = {}) {
    this.input3Form = ref;
  }

  @Bind
  onFourRef(ref = {}) {
    this.input4Form = ref;
  }

  @Bind
  onFiveRef(ref = {}) {
    this.input5Form = ref;
  }

  @Bind
  changeRuleId = (value, num) => {
    const FIELDMAP = [
      this.input1Form,
      this.input2Form,
      this.input3Form,
      this.input4Form,
      this.input5Form,
    ];
    if (value !== '5' || value !== '6') {
      for (const key in FIELDMAP) {
        if (key !== num && FIELDMAP[key].props.form) {
          const index = num + 1;
          const targetValue = FIELDMAP[key].props.form.getFieldValue('numConnectInputBox');
          const middle = targetValue.filter(ele => `${ele}` !== `${index}`);
          FIELDMAP[key].props.form.setFieldsValue({
            numConnectInputBox: middle,
          });
        }
      }
    }
  };

  /**
   * onChangeInputValue - 更新规则框的数据及号码段示例
   * @param {int} input - 将要缓存的规则框
   * @param {String} value - 规则框的数据
   * @param {String} exampleValue - 号码段示例对应的数据
   * @param {!String} rule - 规则框对应的规则
   */
  @Bind
  onChangeInputValue(input, value, exampleValue, rule) {
    if (isUndefined(exampleValue)) {
      return null;
    }
    let example;
    if (rule === '3') {
      example = this.getDateOrTimeExample(exampleValue, 'dateFormat');
    }
    if (rule === '4') {
      example = this.getDateOrTimeExample(exampleValue, 'timeFormat');
    }
    if (rule === '6') {
      example = this.getIncomeValueLengthExample(exampleValue);
    }
    const inputBox = `currentValue${input}`;
    const exampleVal = `exampleValue${input}`;
    this.setState({
      [inputBox]: value,
      [exampleVal]: example || exampleValue,
    });
  }

  /**
   * getDateOrTimeExample - 根据日期格式或者时间格式获取对应当天的数字显示在号码段示例
   * @param {String} str - 选中的日期格式或者时间格式
   * @param {String} type - 对应的字段是日期格式还是时间格式
   */
  @Bind
  getDateOrTimeExample(str, type) {
    const dateData = new Date();
    const year = dateData.getFullYear();
    const yearSimple = `${year}`.substring(2);
    let month = dateData.getMonth() + 1;
    let date = dateData.getDate();
    let hours = dateData.getHours();
    let minutes = dateData.getMinutes();
    let seconds = dateData.getSeconds();
    let week;

    if (str === 'MMww') {
      week = this.getMonthWeek(year, month, date);
    } else {
      week = this.getYearWeek(`${year}-${month}-${date}`);
    }

    if (week < 10) {
      week = `0${week}`;
    }
    if (month < 10) {
      month = `0${month}`;
    }

    if (date < 10) {
      date = `0${date}`;
    }

    if (hours < 10) {
      hours = `0${hours}`;
    }
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }

    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    let value = str;
    if (type === 'dateFormat') {
      if (str.match(RegExp(/YYYY/))) {
        value = value.replace(/YYYY/g, year);
      }
      if (str.match(RegExp(/yyyy/))) {
        value = value.replace(/yyyy/g, year);
      }
      if (str.match(RegExp(/YY/))) {
        value = value.replace(/YY/g, yearSimple);
      }
      if (str.match(RegExp(/yy/))) {
        value = value.replace(/yy/g, yearSimple);
      }
      if (str.match(RegExp(/MM/))) {
        value = value.replace(/MM/g, month);
      }

      if (str.match(RegExp(/mm/))) {
        value = value.replace(/mm/g, month);
      }
      if (str.match(RegExp(/DD/))) {
        value = value.replace(/DD/g, date);
      }

      if (str.match(RegExp(/dd/))) {
        value = value.replace(/dd/g, date);
      }
      if (str.match(RegExp(/WW/))) {
        value = value.replace(/WW/g, week);
      }
      if (str.match(RegExp(/ww/))) {
        value = value.replace(/ww/g, week);
      }
    } else if (type === 'timeFormat') {
      if (str.match(RegExp(/HH/))) {
        value = value.replace(/HH/g, hours);
      }
      if (str.match(RegExp(/hh/))) {
        value = value.replace(/hh/g, hours);
      }
      if (str.match(RegExp(/MM/))) {
        value = value.replace(/MM/g, minutes);
      }
      if (str.match(RegExp(/mm/))) {
        value = value.replace(/mm/g, minutes);
      }
      if (str.match(RegExp(/SS/))) {
        value = value.replace(/SS/g, seconds);
      }
      if (str.match(RegExp(/ss/))) {
        value = value.replace(/ss/g, seconds);
      }
    }

    return value;
  }

  @Bind
  getMonthWeek(a, b, c) {
    /*
    a = d = 当前日期
    b = 6 - w = 当前周的还有几天过完(不算今天)
    a + b 的和在除以7 就是当天是当前月份的第几周
    */
    const date = new Date(a, parseInt(b, 10) - 1, c);
    const w = date.getDay();
    const d = date.getDate();
    return Math.ceil((d + 6 - w) / 7);
  }

  @Bind
  getYearWeek(dateString) {
    const da = dateString; // 日期格式2015-12-30
    // 当前日期
    const date1 = new Date(
      da.substring(0, 4),
      parseInt(da.substring(5, 7), 10) - 1,
      da.substring(8, 10)
    );
    // 1月1号
    const date2 = new Date(da.substring(0, 4), 0, 1);
    // 获取1月1号星期（以周一为第一天，0周一~6周日）
    let dateWeekNum = date2.getDay() - 1;
    if (dateWeekNum < 0) {
      dateWeekNum = 6;
    }
    if (dateWeekNum < 4) {
      // 前移日期
      date2.setDate(date2.getDate() - dateWeekNum);
    } else {
      // 后移日期
      date2.setDate(date2.getDate() + 7 - dateWeekNum);
    }
    const d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
    if (d < 0) {
      const date3 = `${date1.getFullYear() - 1}-12-31`;
      return this.getYearWeek(date3);
    } else {
      // 得到年数周数
      const week = Math.ceil((d + 1) / 7);
      return week;
    }
  }

  /**
   * getIncomeValueLengthExample - 根据外部输入值固定长度显示对应的X在号码段示例
   * @param {String} exampleValue - 外部输入值固定长度
   */
  @Bind
  getIncomeValueLengthExample(exampleValue) {
    const length = parseInt(exampleValue, 10);
    let value = '';
    for (let i = 0; i < length; i++) {
      value = `${value}X`;
    }
    return value;
  }

  /**
   * onChangeCurrentRule - 更新规则框对应的规则
   * @param {int} input - 将要缓存的规则框
   * @param {String} rule - 规则
   */
  @Bind
  onChangeCurrentRule(input, rule) {
    const inputBox = `currentRule${input}`;
    this.setState({
      [inputBox]: rule,
    });
  }

  @Bind
  onOutsideNumFlagChange(checked) {
    this.setState({
      isOutside: checked,
    });
  }

  @Bind
  onClearBox(box) {
    const {
      form,
      dispatch,
      numberRange: {
        inputBox1List = {},
        inputBox2List = {},
        inputBox3List = {},
        inputBox4List = {},
        inputBox5List = {},
      },
    } = this.props;
    const { currentRule1, currentRule2, currentRule3, currentRule4, currentRule5 } = this.state;
    const cuRule =
      (box === 1 && currentRule1) ||
      (box === 2 && currentRule2) ||
      (box === 3 && currentRule3) ||
      (box === 4 && currentRule4) ||
      (box === 5 && currentRule5);
    const { numrangeRuleId } =
      (box === 1 && inputBox1List) ||
      (box === 2 && inputBox2List) ||
      (box === 3 && inputBox3List) ||
      (box === 4 && inputBox4List) ||
      (box === 5 && inputBox5List);
    const inputBox = `inputBox${box}`;
    const list = `inputBox${box}List`;
    const current = `currentValue${box}`;
    const rule = `currentRule${box}`;
    const inputForm =
      (box === 1 && this.input1Form) ||
      (box === 2 && this.input2Form) ||
      (box === 3 && this.input3Form) ||
      (box === 4 && this.input4Form) ||
      (box === 5 && this.input5Form);
    form.resetFields([inputBox]);
    dispatch({
      type: 'numberRange/updateState',
      payload: {
        [list]: { numrangeRuleId },
      },
    });
    const FIELDMAP = [
      this.input1Form,
      this.input2Form,
      this.input3Form,
      this.input4Form,
      this.input5Form,
    ];
    for (const key in FIELDMAP) {
      if (key !== box - 1 && FIELDMAP[key].props.form) {
        const targetValue = FIELDMAP[key].props.form.getFieldValue('numConnectInputBox');
        const middle = targetValue.filter(ele => `${ele}` !== `${box}`);
        FIELDMAP[key].props.form.setFieldsValue({
          numConnectInputBox: middle,
        });
      }
    }
    this.setState({
      [current]: undefined,
      [rule]: undefined,
    });
    inputForm.props.form.resetFields();
    inputForm.state.value = undefined;
    if (
      (cuRule === '5' || cuRule === '6') &&
      (currentRule1 === '2' ||
        currentRule2 === '2' ||
        currentRule3 === '2' ||
        currentRule4 === '2' ||
        currentRule5 === '2')
    ) {
      const connectInputBox =
        (currentRule1 === '2' && 'newNumConnectInputBox1') ||
        (currentRule2 === '2' && 'newNumConnectInputBox2') ||
        (currentRule3 === '2' && 'newNumConnectInputBox3') ||
        (currentRule4 === '2' && 'newNumConnectInputBox4') ||
        (currentRule5 === '2' && 'newNumConnectInputBox5');
      this.setState({
        [connectInputBox]: [],
      });
    }
  }

  /**
   * remainder - 特定对象关联框把数字拆分成数组
   * @param {int} num - 当前规则的value值
   */
  @Bind
  remainder(num) {
    return [...`${num}`].map(v => +v);
  }

  // 号段组号规则
  @Bind
  lengthValidator(rule, value, callback) {
    if (value.length !== 3) {
      callback(intl.get(`${modelPrompt}.error.lengthValid`).d('号段组号必须为3位!'));
    }
    callback();
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      form,
      numberRange: {
        displayList = {},
        inputBox1List = {},
        inputBox2List = {},
        inputBox3List = {},
        inputBox4List = {},
        inputBox5List = {},
      },
      editFlag,
      numrangeId,
    } = this.props;
    const {
      objectId,
      outsideNumFlag,
      numrangeGroup,
      enableFlag,
      objectName,
      numDescription,
      numrangeGroupRule,
      objectCode,
    } = displayList;
    const { getFieldDecorator } = form;
    const {
      currentInput,
      currentValue1,
      currentValue2,
      currentValue3,
      currentValue4,
      currentValue5,
      exampleValue1,
      exampleValue2,
      exampleValue3,
      exampleValue4,
      exampleValue5,
      currentRule1,
      currentRule2,
      currentRule3,
      currentRule4,
      currentRule5,
      isOutside,
      newNumConnectInputBox1,
      newNumConnectInputBox2,
      newNumConnectInputBox3,
      newNumConnectInputBox4,
      newNumConnectInputBox5,
    } = this.state;
    const INPUT_MAP = [
      'fixInput',
      'numLowerLimit',
      'dateFormat',
      'timeFormat',
      'callStandardObject',
      'incomeValueLength',
    ];
    const value1 = inputBox1List[INPUT_MAP[Number(inputBox1List.numRule) - 1]];
    // console.log(value1,Number(inputBox1List.numRule)-1)
    // inputBox1List.fixInput ||
    // inputBox1List.numLowerLimit ||
    // inputBox1List.timeFormat ||
    // inputBox1List.dateFormat ||
    // inputBox1List.incomeValueLength ||
    // inputBox1List.callStandardObjectCode;
    const value2 = inputBox2List[INPUT_MAP[inputBox2List.numRule - 1]];
    // inputBox2List.fixInput ||
    // inputBox2List.numLowerLimit ||
    // inputBox2List.timeFormat ||
    // inputBox2List.dateFormat ||
    // inputBox2List.incomeValueLength ||
    // inputBox2List.callStandardObjectCode;
    const value3 = inputBox3List[INPUT_MAP[inputBox3List.numRule - 1]];
    // inputBox3List.fixInput ||
    // inputBox3List.numLowerLimit ||
    // inputBox3List.timeFormat ||
    // inputBox3List.dateFormat ||
    // inputBox3List.incomeValueLength ||
    // inputBox3List.callStandardObjectCode;
    const value4 = inputBox4List[INPUT_MAP[inputBox4List.numRule - 1]];
    // inputBox4List.fixInput ||
    // inputBox4List.numLowerLimit ||
    // inputBox4List.timeFormat ||
    // inputBox4List.dateFormat ||
    // inputBox4List.incomeValueLength ||
    // inputBox4List.callStandardObjectCode;
    const value5 = inputBox5List[INPUT_MAP[inputBox5List.numRule - 1]];
    // inputBox5List.fixInput ||
    // inputBox5List.numLowerLimit ||
    // inputBox5List.timeFormat ||
    // inputBox5List.dateFormat ||
    // inputBox5List.incomeValueLength ||
    // inputBox5List.callStandardObjectCode;
    const rule1 = inputBox1List.numRule;
    const rule2 = inputBox2List.numRule;
    const rule3 = inputBox3List.numRule;
    const rule4 = inputBox4List.numRule;
    const rule5 = inputBox5List.numRule;
    const numConnectInputBox1 = inputBox1List.numConnectInputBox;
    const numConnectInputBox2 = inputBox2List.numConnectInputBox;
    const numConnectInputBox3 = inputBox3List.numConnectInputBox;
    const numConnectInputBox4 = inputBox4List.numConnectInputBox;
    const numConnectInputBox5 = inputBox5List.numConnectInputBox;
    this.state.currentRule1 = isUndefined(currentRule1) ? rule1 : currentRule1;
    this.state.currentRule2 = isUndefined(currentRule2) ? rule2 : currentRule2;
    this.state.currentRule3 = isUndefined(currentRule3) ? rule3 : currentRule3;
    this.state.currentRule4 = isUndefined(currentRule4) ? rule4 : currentRule4;
    this.state.currentRule5 = isUndefined(currentRule5) ? rule5 : currentRule5;
    const val1 = isUndefined(value1)
      ? ''
      : (rule1 === '6' && this.getIncomeValueLengthExample(value1)) ||
        (rule1 === '3' && this.getDateOrTimeExample(value1, 'dateFormat')) ||
        ((rule1 === '4' && this.getDateOrTimeExample(value1, 'timeFormat')) || value1);
    const val2 = isUndefined(value2)
      ? ''
      : (rule2 === '6' && this.getIncomeValueLengthExample(value2)) ||
        (rule2 === '3' && this.getDateOrTimeExample(value2, 'dateFormat')) ||
        ((rule2 === '4' && this.getDateOrTimeExample(value2, 'timeFormat')) || value2);
    const val3 = isUndefined(value3)
      ? ''
      : (rule3 === '6' && this.getIncomeValueLengthExample(value3)) ||
        (rule3 === '3' && this.getDateOrTimeExample(value3, 'dateFormat')) ||
        ((rule2 === '4' && this.getDateOrTimeExample(value3, 'timeFormat')) || value3);
    const val4 = isUndefined(value4)
      ? ''
      : (rule4 === '6' && this.getIncomeValueLengthExample(value4)) ||
        (rule4 === '3' && this.getDateOrTimeExample(value4, 'dateFormat')) ||
        (rule3 === '4' && this.getDateOrTimeExample(value4, 'timeFormat')) ||
        value4;
    const val5 = isUndefined(value5)
      ? ''
      : (rule5 === '6' && this.getIncomeValueLengthExample(value5)) ||
        (rule5 === '3' && this.getDateOrTimeExample(value5, 'dateFormat')) ||
        (rule5 === '4' && this.getDateOrTimeExample(value5, 'timeFormat')) ||
        value5;

    const numExampleValue =
      (isUndefined(exampleValue1) ? val1 : exampleValue1) +
      (isUndefined(exampleValue2) ? val2 : exampleValue2) +
      (isUndefined(exampleValue3) ? val3 : exampleValue3) +
      (isUndefined(exampleValue4) ? val4 : exampleValue4) +
      (isUndefined(exampleValue5) ? val5 : exampleValue5);

    const input1FormProps = {
      editFlag,
      objectId: this.state.objectId || objectId,
      numrangeId,
      onRef: this.onOneRef,
      setCurrentValue: this.onChangeInputValue,
      setCurrentRule: this.onChangeCurrentRule,
      changeRuleId: this.changeRuleId,
      currentRule1,
      currentRule2,
      currentRule3,
      currentRule4,
      currentRule5,
      isOutside: isOutside || outsideNumFlag === 'Y',
      initRule: rule1 === '2' || rule2 === '2' || rule3 === '2' || rule4 === '2' || rule5 === '2',
      initNumConnectInputBox: isUndefined(newNumConnectInputBox1)
        ? isUndefined(numConnectInputBox1)
          ? []
          : this.remainder(numConnectInputBox1)
        : newNumConnectInputBox1,
    };

    const input2FormProps = {
      editFlag,
      objectId: this.state.objectId || objectId,
      numrangeId,
      onRef: this.onTwoRef,
      setCurrentValue: this.onChangeInputValue,
      setCurrentRule: this.onChangeCurrentRule,
      changeRuleId: this.changeRuleId,
      currentRule1,
      currentRule2,
      currentRule3,
      currentRule4,
      currentRule5,
      isOutside: isOutside || outsideNumFlag === 'Y',
      initRule: rule1 === '2' || rule2 === '2' || rule3 === '2' || rule4 === '2' || rule5 === '2',
      initNumConnectInputBox: isUndefined(newNumConnectInputBox2)
        ? isUndefined(numConnectInputBox2)
          ? []
          : this.remainder(numConnectInputBox2)
        : newNumConnectInputBox2,
    };

    const input3FormProps = {
      editFlag,
      objectId: this.state.objectId || objectId,
      numrangeId,
      onRef: this.onThreeRef,
      setCurrentValue: this.onChangeInputValue,
      setCurrentRule: this.onChangeCurrentRule,
      changeRuleId: this.changeRuleId,
      currentRule1,
      currentRule2,
      currentRule3,
      currentRule4,
      currentRule5,
      isOutside: isOutside || outsideNumFlag === 'Y',
      initRule: rule1 === '2' || rule2 === '2' || rule3 === '2' || rule4 === '2' || rule5 === '2',
      initNumConnectInputBox: isUndefined(newNumConnectInputBox3)
        ? isUndefined(numConnectInputBox3)
          ? []
          : this.remainder(numConnectInputBox3)
        : newNumConnectInputBox3,
    };

    const input4FormProps = {
      editFlag,
      objectId: this.state.objectId || objectId,
      numrangeId,
      onRef: this.onFourRef,
      setCurrentValue: this.onChangeInputValue,
      setCurrentRule: this.onChangeCurrentRule,
      changeRuleId: this.changeRuleId,
      currentRule1,
      currentRule2,
      currentRule3,
      currentRule4,
      currentRule5,
      isOutside: isOutside || outsideNumFlag === 'Y',
      initRule: rule1 === '2' || rule2 === '2' || rule3 === '2' || rule4 === '2' || rule5 === '2',
      initNumConnectInputBox: isUndefined(newNumConnectInputBox4)
        ? isUndefined(numConnectInputBox4)
          ? []
          : this.remainder(numConnectInputBox4)
        : newNumConnectInputBox4,
    };

    const input5FormProps = {
      editFlag,
      objectId: this.state.objectId || objectId,
      numrangeId,
      onRef: this.onFiveRef,
      setCurrentValue: this.onChangeInputValue,
      setCurrentRule: this.onChangeCurrentRule,
      changeRuleId: this.changeRuleId,
      currentRule1,
      currentRule2,
      currentRule3,
      currentRule4,
      currentRule5,
      isOutside: isOutside || outsideNumFlag === 'Y',
      initRule: rule1 === '2' || rule2 === '2' || rule3 === '2' || rule4 === '2' || rule5 === '2',
      initNumConnectInputBox: isUndefined(newNumConnectInputBox5)
        ? isUndefined(numConnectInputBox5)
          ? []
          : this.remainder(numConnectInputBox5)
        : newNumConnectInputBox5,
    };

    return (
      <Fragment>
        <Form>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.objectCode`).d('编码对象编码')}
              >
                {getFieldDecorator('objectId', {
                  rules: [
                    {
                      required: numrangeId === 'create',
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.objectCode`).d('编码对象编码'),
                      }),
                    },
                  ],
                  initialValue: objectId,
                })(
                  <Lov
                    code="MT.NUMRANGE_OBJECT"
                    queryParams={{ tenantId }}
                    textValue={objectCode}
                    disabled={
                      numrangeId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                    }
                    onChange={this.setObJectName}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.objectName`).d('编码对象描述')}
              >
                {getFieldDecorator('objectName', {
                  initialValue: objectName,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.numrangeGroup`).d('号段组号')}
              >
                {getFieldDecorator('numrangeGroup', {
                  initialValue: numrangeGroup,
                  rules: [
                    {
                      required: numrangeId === 'create',
                      len: 3,
                      pattern: /^[A-Za-z0-9]+$/,
                      validator: (rule, value, callback) => {
                        if (value.length === 3) {
                          callback();
                          return;
                        }
                        callback(
                          intl
                            .get(`${modelPrompt}.numrangeGroupRules`)
                            .d('请输入仅限字母或者数字的3位数')
                        );
                      },
                      message: intl
                        .get(`${modelPrompt}.numrangeGroupRules`)
                        .d('请输入仅限字母或者数字的3位数'),
                    },
                  ],
                })(
                  <Input
                    disabled={numrangeId !== 'create'}
                    maxLength={3}
                    trimAll
                    inputChinese={false}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.numDescription`).d('号段描述')}
              >
                {getFieldDecorator('numDescription', {
                  initialValue: numDescription,
                  rules: [
                    {
                      required: numrangeId === 'create',
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.numDescription`).d('号段描述'),
                      }),
                    },
                  ],
                })(
                  <TLEditor
                    label={intl.get(`${modelPrompt}.numDescription`).d('号段描述')}
                    field="numDescription"
                    dto="io.tarzan.common.domain.entity.MtNumrange"
                    pkValue={{
                      numrangeId: numrangeId !== 'create' ? numrangeId : null || null,
                    }}
                    disabled={
                      numrangeId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                    }
                    inputSize={{ zh: 64, en: 64 }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.enableFlag`).d('启用状态')}
              >
                {getFieldDecorator('enableFlag', {
                  initialValue: enableFlag !== 'N',
                })(
                  <Switch
                    disabled={
                      numrangeId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.outsideNumFlag`).d('外部输入编码')}
              >
                {getFieldDecorator('outsideNumFlag', {
                  initialValue: outsideNumFlag === 'Y',
                })(
                  <Switch
                    disabled={
                      numrangeId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                    }
                    onChange={this.onOutsideNumFlagChange}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                style={{ marginBottom: 10 }}
                label={intl.get(`${modelPrompt}.numrangeGroupRule`).d('号段组合规则')}
              >
                {getFieldDecorator('numrangeGroupRule', {
                  initialValue: numrangeGroupRule,
                })(
                  <Input.Group style={{ width: 'calc( 500% + 50px )', top: '5px' }} compact>
                    <Form.Item style={{ width: 'calc( 20% + 2px )', paddingRight: '12px' }}>
                      {getFieldDecorator('inputBox1', {
                        initialValue: currentValue1 || value1,
                      })(
                        <Input
                          onFocus={this.onFocusInput1}
                          maxLength={20}
                          readonly="readonly"
                          suffix={
                            !isUndefined(currentValue1 || value1) && (
                              <Icon type="close" onClick={() => this.onClearBox(1)} />
                            )
                          }
                        />
                      )}
                    </Form.Item>
                    <Form.Item style={{ width: 'calc( 20% + 2px )', paddingRight: '12px' }}>
                      {getFieldDecorator('inputBox2', {
                        initialValue: currentValue2 || value2,
                      })(
                        <Input
                          onFocus={this.onFocusInput2}
                          maxLength={20}
                          readonly="readonly"
                          suffix={
                            !isUndefined(currentValue2 || value2) && (
                              <Icon type="close" onClick={() => this.onClearBox(2)} />
                            )
                          }
                        />
                      )}
                    </Form.Item>
                    <Form.Item style={{ width: 'calc( 20% + 2px )', paddingRight: '12px' }}>
                      {getFieldDecorator('inputBox3', {
                        initialValue: currentValue3 || value3,
                      })(
                        <Input
                          onFocus={this.onFocusInput3}
                          maxLength={20}
                          readonly="readonly"
                          suffix={
                            !isUndefined(currentValue3 || value3) && (
                              <Icon type="close" onClick={() => this.onClearBox(3)} />
                            )
                          }
                        />
                      )}
                    </Form.Item>
                    <Form.Item style={{ width: 'calc( 20% + 2px )', paddingRight: '12px' }}>
                      {getFieldDecorator('inputBox4', {
                        initialValue: currentValue4 || value4,
                      })(
                        <Input
                          onFocus={this.onFocusInput4}
                          maxLength={20}
                          readonly="readonly"
                          suffix={
                            !isUndefined(currentValue4 || value4) && (
                              <Icon type="close" onClick={() => this.onClearBox(4)} />
                            )
                          }
                        />
                      )}
                    </Form.Item>
                    <Form.Item style={{ width: 'calc( 20% - 10px )' }}>
                      {getFieldDecorator('inputBox5', {
                        initialValue: currentValue5 || value5,
                      })(
                        <Input
                          onFocus={this.onFocusInput5}
                          maxLength={20}
                          readonly="readonly"
                          suffix={
                            !isUndefined(currentValue5 || value5) && (
                              <Icon type="close" onClick={() => this.onClearBox(5)} />
                            )
                          }
                        />
                      )}
                    </Form.Item>
                  </Input.Group>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.numExample`).d('号段示例')}
              >
                {getFieldDecorator('numExample', {
                  initialValue: numExampleValue,
                })(<Input disabled style={{ width: 'calc( 271.42% + 12px)' }} maxLength={40} />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div style={{ display: currentInput === 1 ? 'block' : 'none' }}>
          <Input1Form {...input1FormProps} />
        </div>
        <div style={{ display: currentInput === 2 ? 'block' : 'none' }}>
          <Input2Form {...input2FormProps} />
        </div>
        <div style={{ display: currentInput === 3 ? 'block' : 'none' }}>
          <Input3Form {...input3FormProps} />
        </div>
        <div style={{ display: currentInput === 4 ? 'block' : 'none' }}>
          <Input4Form {...input4FormProps} />
        </div>
        <div style={{ display: currentInput === 5 ? 'block' : 'none' }}>
          <Input5Form {...input5FormProps} />
        </div>
      </Fragment>
    );
  }
}
