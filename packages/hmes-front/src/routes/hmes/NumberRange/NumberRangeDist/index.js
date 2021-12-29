/**
 * NumberRangeDist - 号码段明细编辑
 * @date: 2019-8-21
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Button, Form } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';

import { Header, Content } from 'components/Page';

import intl from 'utils/intl';
import { isUndefined, isNull, isNaN } from 'lodash';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import DisplayForm from './DisplayForm';

const tenantId = getCurrentOrganizationId();

const modelPrompt = 'tarzan.mes.numR.model.numR';

/**
 * 号码段明细编辑
 * @extends {Component} - React.Component
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} numberRange - 数据源
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(({ numberRange, loading }) => ({
  numberRange,
  fetchLoading: loading.effects['numberRange/fetchNumberRangeLineList'],
}))
@formatterCollections({ code: 'tarzan.mes.numR' })
@Form.create({ fieldNameProp: null })
export default class NumberRangeDist extends React.Component {
  form;

  formFlag;

  ruleList = [];

  state = {
    buttonFlag: true,
    editFlag: true,
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    const numrangeId = match.params.id;
    dispatch({
      type: 'numberRange/fetchNumLevelList',
      payload: {
        module: 'GENERAL',
        typeGroup: 'NUMRANGE_NUM_LEVEL',
      },
    });
    dispatch({
      type: 'numberRange/fetchNumRadixList',
      payload: {
        module: 'GENERAL',
        typeGroup: 'NUMRANGE_RADIX_TYPE',
      },
    });
    dispatch({
      type: 'numberRange/fetchNumAlertTypeList',
      payload: {
        module: 'GENERAL',
        typeGroup: 'NUMRANGE_ALERT_TYPE',
      },
    });
    dispatch({
      type: 'numberRange/fetchNumResetTypeList',
      payload: {
        module: 'GENERAL',
        typeGroup: 'NUMRANGE_RESET_TYPE',
      },
    });
    dispatch({
      type: 'numberRange/fetchDateFormatList',
      payload: {
        module: 'GENERAL',
        typeGroup: 'NUMRANGE_DATE_FORMAT',
      },
    });
    dispatch({
      type: 'numberRange/fetchTimeFormatList',
      payload: {
        module: 'GENERAL',
        typeGroup: ' NUMRANGE_TIME_FORMAT',
      },
    });
    if (numrangeId === 'create') {
      dispatch({
        type: 'numberRange/updateState',
        payload: {
          displayList: {},
          planList: {},
          produceList: {},
          attrList: [],
          inputBox1List: {},
          inputBox2List: {},
          inputBox3List: {},
          inputBox4List: {},
          inputBox5List: {},
        },
      });
      return;
    }
    dispatch({
      type: 'numberRange/fetchNumberRangeLineList',
      payload: {
        numrangeId,
      },
    });
  }

  // 保存/编辑
  @Bind()
  toggleEdit() {
    const { match } = this.props;
    const numrangeId = match.params.id;
    const { buttonFlag } = this.state;
    if (numrangeId === 'create') {
      this.handleSaveAll();
    } else if (buttonFlag) {
      this.handleEdit();
    } else {
      this.handleSaveAll();
    }
  }

  // 点击编辑
  @Bind
  handleEdit() {
    this.setState({
      editFlag: false,
      buttonFlag: false,
    });
  }

  @Bind
  onRef(ref = {}) {
    this.form = ref;
  }

  @Bind
  handleSaveAll() {
    this.form.props.form.validateFields((err, fieldsValue) => {
      const { outsideNumFlag } = fieldsValue;
      if (!err) {
        let isTrue1;
        let isTrue2;
        let isTrue3;
        let isTrue4;
        let isTrue5;
        if (
          isUndefined(fieldsValue.inputBox1) &&
          isUndefined(fieldsValue.inputBox2) &&
          isUndefined(fieldsValue.inputBox3) &&
          isUndefined(fieldsValue.inputBox4) &&
          isUndefined(fieldsValue.inputBox5)
        ) {
          notification.warning({
            message: intl.get(`${modelPrompt}.mustOne`).d(`必须选择一个规则`),
            duration: 5,
          });
          return false;
        }
        if (fieldsValue.inputBox1) {
          const { numRule } = this.form.input1Form.props.form.getFieldsValue();
          this.checkRule(this.form.input1Form, 1, numRule, outsideNumFlag);
          if (this.formFlag) {
            return false;
          }
          // this.form.input1Form.props.form.validateFields((_, fields) => {
          //   const { numRule } = fields;
          //   isTrue1 = this.checkRule(this.form.input1Form, 1, numRule, outsideNumFlag);
          //   if (!isTrue1) {
          //     return false;
          //   }
          // });
        } else {
          this.ruleList[0] = {};
        }
        if (fieldsValue.inputBox2) {
          const { numRule } = this.form.input2Form.props.form.getFieldsValue();
          this.checkRule(this.form.input2Form, 2, numRule, outsideNumFlag);
          if (this.formFlag) {
            return false;
          }
          // this.form.input2Form.props.form.validateFields((_, fields) => {
          //   const { numRule } = fields;
          //   isTrue2 = this.checkRule(this.form.input2Form, 2, numRule, outsideNumFlag);
          // });
        } else {
          this.ruleList[1] = {};
        }
        if (fieldsValue.inputBox3) {
          const { numRule } = this.form.input3Form.props.form.getFieldsValue();
          this.checkRule(this.form.input3Form, 3, numRule, outsideNumFlag);
          if (this.formFlag) {
            return false;
          }
          // this.form.input3Form.props.form.validateFields((_, fields) => {
          //   const { numRule } = fields;
          //   isTrue3 = this.checkRule(this.form.input3Form, 3, numRule, outsideNumFlag);
          //   if (!isTrue3) {
          //     return false;
          //   }
          // });
        } else {
          this.ruleList[2] = {};
        }
        if (fieldsValue.inputBox4) {
          const { numRule } = this.form.input4Form.props.form.getFieldsValue();
          this.checkRule(this.form.input4Form, 4, numRule, outsideNumFlag);
          if (this.formFlag) {
            return false;
          }
          // this.form.input4Form.props.form.validateFields((_, fields) => {
          //   const { numRule } = fields;
          //   isTrue4 = this.checkRule(this.form.input4Form, 4, numRule, outsideNumFlag);
          //   if (!isTrue4) {
          //     return false;
          //   }
          // });
        } else {
          this.ruleList[3] = {};
        }
        if (fieldsValue.inputBox5) {
          const { numRule } = this.form.input5Form.props.form.getFieldsValue();
          this.checkRule(this.form.input5Form, 5, numRule, outsideNumFlag);
          if (this.formFlag) {
            return false;
          }
          // this.form.input5Form.props.form.validateFields((_, fields) => {
          //   const { numRule } = fields;
          //   isTrue5 = this.checkRule(this.form.input5Form, 5, numRule, outsideNumFlag);
          //   if (!isTrue5) {
          //     return false;
          //   }
          // });
        } else {
          this.ruleList[4] = {};
        }
        const true1 = isUndefined(isTrue1) ? true : isTrue1;
        const true2 = isUndefined(isTrue2) ? true : isTrue2;
        const true3 = isUndefined(isTrue3) ? true : isTrue3;
        const true4 = isUndefined(isTrue4) ? true : isTrue4;
        const true5 = isUndefined(isTrue5) ? true : isTrue5;
        if (true1 && true2 && true3 && true4 && true5) {
          const {
            dispatch,
            history,
            numberRange: { displayList = {} },
          } = this.props;
          const { numrangeId } = displayList;
          const {
            objectId,
            enableFlag,
            numDescription,
            numExample,
            numrangeGroup,
            objectCode,
            objectName,
            _tls,
          } = fieldsValue;
          if (numExample.length > 40) {
            notification.warning({
              message: intl.get(`${modelPrompt}.short40`).d(`号段示例的长度不能超过40`),
              duration: 5,
            });
            return false;
          }

          dispatch({
            type: 'numberRange/saveNumberRange',
            payload: {
              objectId,
              enableFlag: enableFlag ? 'Y' : 'N',
              numDescription,
              numExample,
              numrangeGroup,
              objectCode,
              numrangeId,
              objectName,
              _tls: isUndefined(_tls) ? {} : _tls,
              outsideNumFlag: outsideNumFlag ? 'Y' : 'N',
              rules: this.ruleList.map(ele => {
                if (ele.numConnectInputBox) {
                  return {
                    ...ele,
                    numConnectInputBox: Number(
                      `${ele.numConnectInputBox}`
                        .split('')
                        .sort((a, b) => a - b)
                        .join('')
                    ),
                  };
                } else {
                  return ele;
                }
              }),
            },
          }).then(res => {
            if (res && res.success) {
              notification.success();
              history.push(`/hmes/mes/number-range/dist/${res.rows}`);
              dispatch({
                type: 'numberRange/fetchNumberRangeLineList',
                payload: {
                  numrangeId: res.rows,
                },
              });
              this.setState({
                editFlag: true,
                buttonFlag: true,
              });
            } else if (res) {
              notification.error({ message: res.message });
              // this.setState({
              //   editFlag: true,
              //   buttonFlag: false,
              // });
            }
          });
        }
      }
    });
  }

  /**
   * checkRule - 根据对应的规则去判断是否符合规范
   * @param {String} inputForm - 对应的是哪个规则框的实例
   * @param {int} box - 对应的是哪个规则框
   * @param {String} rule - 对应的是哪个规则
   * @param {String} outsideNumFlag - 外部输入编码
   */
  @Bind
  checkRule(inputForm, box, rule, outsideNumFlag) {
    const {
      numberRange: {
        inputBox1List = {},
        inputBox2List = {},
        inputBox3List = {},
        inputBox4List = {},
        inputBox5List = {},
      },
    } = this.props;
    this.ruleList = this.props.numberRange.ruleList;
    const { numrangeRuleId } =
      (box === 1 && inputBox1List) ||
      (box === 2 && inputBox2List) ||
      (box === 3 && inputBox3List) ||
      (box === 4 && inputBox4List) ||
      (box === 5 && inputBox5List);
    this.formFlag = false;
    const fieldsValue = inputForm.props.form.getFieldsValue();
    if (rule === '1') {
      const { fixInput } = fieldsValue;
      if (fixInput === '' || isUndefined(fixInput)) {
        notification.warning({
          message: intl.get(`${modelPrompt}.validation.fixInputNull`).d('有规则框的输入值未填写!'),
          duration: 5,
        });
        this.formFlag = true;
        return false;
      }
      this.ruleList[box - 1] = {
        numRule: '1',
        numrangeRuleId,
        fixInput,
        tenantId,
      };
      // this.formFlag = true;
    }
    if (rule === '3') {
      const { dateFormat } = fieldsValue;
      if (dateFormat === '' || isUndefined(dateFormat)) {
        notification.warning({
          message: intl.get(`${modelPrompt}.validation.dateNull`).d('有规则框的日期格式未填写!'),
          duration: 5,
        });
        this.formFlag = true;
        return false;
      }
      this.ruleList[box - 1] = {
        numRule: '3',
        dateFormat,
        tenantId,
        numrangeRuleId,
      };
      // flag = true;
    }
    if (rule === '4') {
      const { timeFormat } = fieldsValue;
      if (timeFormat === '' || isUndefined(timeFormat)) {
        notification.warning({
          message: intl.get(`${modelPrompt}.validation.timeNull`).d('有规则框的时间格式未填写!'),
          duration: 5,
        });
        this.formFlag = true;
        return false;
      }
      this.ruleList[box - 1] = {
        numRule: '4',
        timeFormat,
        tenantId,
        numrangeRuleId,
      };
      // flag = true;
    }
    if (rule === '5') {
      const { callStandardObject } = fieldsValue;
      if (callStandardObject === '' || isUndefined(callStandardObject)) {
        notification.warning({
          message: intl.get(`${modelPrompt}.validation.objectNull`).d('有规则框的对象属性未填写!'),
          duration: 5,
        });
        this.formFlag = true;
        return false;
      }
      this.ruleList[box - 1] = {
        numRule: '5',
        callStandardObject,
        tenantId,
        numrangeRuleId,
      };
      // flag = true;
    }
    if (rule === '6') {
      if (outsideNumFlag) {
        notification.warning({
          message: intl
            .get(`${modelPrompt}.validation.noOutInput`)
            .d('外部输入编码启用,不可启用外部输入值!'),
          duration: 5,
        });
        this.formFlag = true;
        return false;
      }
      const { incomeValueLength, incomeValueLengthLimit } = fieldsValue;
      if (
        (incomeValueLength === '' || isUndefined(incomeValueLength)) &&
        (incomeValueLengthLimit === '' || isUndefined(incomeValueLengthLimit))
      ) {
        notification.warning({
          message: intl
            .get(`${modelPrompt}.validation.noInputLen`)
            .d('有规则框的外部输入值未填写!'),
          duration: 5,
        });
        this.formFlag = true;
        return false;
      }
      this.ruleList[box - 1] = {
        numRule: '6',
        incomeValueLength,
        tenantId,
        numrangeRuleId,
        incomeValueLengthLimit,
      };
      // flag = true;
    }
    if (rule === '2') {
      // inputForm.props.form.validateFields((err, fields) => {
      const {
        numLevel,
        numLowerLimit,
        numUpperLimit,
        numAlertType,
        numAlert,
        numRadix,
        numCurrent,
        numIncrement,
        numResetType,
        numResetPeriod,
        numRule,
      } = inputForm.props.form.getFieldsValue();
      let { numConnectInputBox } = inputForm.props.form.getFieldsValue();
      if (
        numAlertType === '' ||
        isUndefined(numAlertType) ||
        numAlert === '' ||
        isUndefined(numAlert) ||
        numLevel === '' ||
        isUndefined(numLevel) ||
        numLowerLimit === '' ||
        isUndefined(numLowerLimit) ||
        numUpperLimit === '' ||
        isUndefined(numUpperLimit) ||
        numRadix === '' ||
        isUndefined(numRadix) ||
        numIncrement === '' ||
        isUndefined(numIncrement) ||
        (numLevel === 'OVERALL_SERIAL_NUM' && isUndefined(numCurrent))
      ) {
        notification.warning({
          message: intl.get(`${modelPrompt}.validation.segNull`).d('序列号段有必输项未填写!'),
          duration: 5,
        });
        this.formFlag = true;
        return false;
      }
      const err = inputForm.props.form.getFieldsError();
      if (err.numConnectInputBox) {
        notification.warning({
          message: intl.get(`${modelPrompt}.validation.mustOne`).d('定对象关联框必选一个规则框!'),
          duration: 5,
        });
        this.formFlag = true;
        return false;
      }
      const radix =
        (numRadix === 'HEXADECIMAL' && 36) ||
        (numRadix === 'HEX' && 16) ||
        (numRadix === 'OCTAL' && 8) ||
        (numRadix === 'BINARY' && 2) ||
        (numRadix === 'DECIMAL' && 10);
      if (
        isNaN(Number.parseInt(numLowerLimit, radix)) ||
        isNaN(Number.parseInt(numUpperLimit, radix))
      ) {
        notification.warning({
          message: intl
            .get(`${modelPrompt}.validation.correctRadix`)
            .d('序列号段上下限需满足正确的进制格式!'),
          duration: 5,
        });
        this.formFlag = true;
        return false;
      }

      if (Number.parseInt(numLowerLimit, radix) > Number.parseInt(numUpperLimit, radix)) {
        notification.warning({
          message: intl.get(`${modelPrompt}.validation.upThanLow`).d('序列号段上限必须大于下限!'),
          duration: 5,
        });
        this.formFlag = true;
        return false;
      }

      if (Number.parseInt(numIncrement, radix) > Number.parseInt(numUpperLimit, radix)) {
        notification.warning({
          message: intl.get(`${modelPrompt}.validation.incThanUp`).d('号段增量不可大于上限!'),
          duration: 5,
        });
        this.formFlag = true;
        return false;
      }
      if (
        !isUndefined(numCurrent) &&
        numCurrent !== '' &&
        !isNull(numCurrent) &&
        (Number.parseInt(numCurrent, radix) > Number.parseInt(numUpperLimit, radix) ||
          Number.parseInt(numCurrent, radix) < Number.parseInt(numLowerLimit, radix))
      ) {
        notification.warning({
          message: intl
            .get(`${modelPrompt}.validation.between`)
            .d('序列号段当前序列号需大于等于序列号下限且小于等于序列号上限!'),
          duration: 5,
        });
        this.formFlag = true;
        return false;
      }

      if (!isUndefined(numAlertType) && !isUndefined(numAlert)) {
        if (
          numAlertType === 'NUMBER' &&
          (numAlert < Number.parseInt(numLowerLimit, radix) ||
            numAlert > Number.parseInt(numUpperLimit, radix))
        ) {
          notification.warning({
            message: intl
              .get(`${modelPrompt}.validation.alertBetween`)
              .d('号段预警值不可小于序列号段下限,大于序列号段上限!'),
            duration: 5,
          });
          this.formFlag = true;
          return false;
        }
        if (numAlertType === 'PERCENTAGE' && (numAlert <= 0 || numAlert > 100)) {
          notification.warning({
            message: intl
              .get(`${modelPrompt}.validation.zeroOrHun`)
              .d('号段预警值需大于0%,小于等于100%!'),
            duration: 5,
          });
          this.formFlag = true;
          return false;
        }
      }

      if (!isUndefined(numConnectInputBox)) {
        const num = numConnectInputBox.toString().replace(/,/g, '');
        numConnectInputBox = Number(num);
      }
      this.ruleList[box - 1] = {
        numLevel,
        numLowerLimit,
        numUpperLimit,
        numAlertType,
        numAlert,
        numRadix,
        numCurrent,
        numIncrement,
        numResetType,
        numResetPeriod,
        numRule,
        numConnectInputBox,
        tenantId,
        numrangeRuleId,
      };
      // });
      // flag = true;
    }
    // return flag;
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { match } = this.props;
    const basePath = match.path.substring(0, match.path.indexOf('/dist'));
    const numrangeId = match.params.id;
    const { buttonFlag, editFlag } = this.state;
    return (
      <>
        <Header
          title={intl.get('tarzan.mes.numR.title.detail').d('号码段维护')}
          backPath={`${basePath}/list`}
        >
          {buttonFlag && numrangeId !== 'create' ? (
            <Button type="primary" icon="edit" onClick={this.toggleEdit}>
              {intl.get('tarzan.mes.numR.button.edit').d('编辑')}
            </Button>
          ) : (
            <Button type="primary" icon="save" onClick={this.toggleEdit}>
              {intl.get('tarzan.mes.numR.button.save').d('保存')}
            </Button>
          )}
        </Header>
        <Content>
          <DisplayForm onRef={this.onRef} numrangeId={numrangeId} editFlag={editFlag} />
        </Content>
      </>
    );
  }
}
