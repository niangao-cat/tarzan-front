/**
 * 锡膏/红胶管理
 *@date：2019/10/31
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Form, Button, Input, Row, Col, Select } from 'hzero-ui';
import Lov from 'components/Lov';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { isFunction, isEmpty } from 'lodash';
import { getCurrentUserId } from 'utils/utils';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';

/**
 *  页面搜索框
 * @extends {Component} - React.Component
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
class FilterForm extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
      prodLineFlag: false, // 产线是否必输
      flag: false, // 上一个操作是否为接收
      btnMap: [
        { value: 'receive', meaning: '接收' },
        { value: 'confirm', meaning: '确认' },
        { value: 'rewarn', meaning: '回温' },
        { value: 'forRequisition', meaning: '待领用' },
        { value: 'requisition', meaning: '领用' },
        { value: 'returning', meaning: '归还' },
      ],
    };
  }

  /**
   * 扫描条码
   */
  @Bind()
  handleScanCode(e) {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err && !isEmpty(e.target.value)) {
        this.checkOptType(fieldsValue.operate, e.target.value);
      }
      const barcode = document.getElementById('codeInput');
      barcode.focus();
      barcode.select();
    });
  }

  /**
   * 条码扫描后，判断当前选中的操作类型
   * @param type
   * @param value
   */
  @Bind()
  checkOptType(type, value) {
    const { mgrList, onSearchCode } = this.props;
    switch (type) {
      case 'receive': // 接收，只能扫1条数据
        if (mgrList.length === 0) {
          onSearchCode(value);
        }
        break;
      case 'requisition': // 领用，最多输入2条数据
        if (mgrList.length <= 1) {
          onSearchCode(value);
        }
        break;
      default:
        onSearchCode(value);
        break;
    }
  }

  // 点击确认
  @Bind()
  handleConfirm() {
    const { form, mgrList, onOperate, onReceive } = this.props;
    if (mgrList.length > 0) {
      const operate = form.getFieldValue('operate');
      this.setState({ flag: operate === 'receive' });
      this.setState(
        {
          prodLineFlag:
            operate === 'requisition' &&
            mgrList.length === 1 &&
            mgrList[0].solderGlueStatus === 'FOR_REQUISTION',
        },
        () => {
          form.validateFields(err => {
            if (!err) {
              // this.handleBtn(fieldsValue.operate);
              if (operate === 'receive') {
                onReceive();
              } else {
                onOperate();
              }
            }
          });
        }
      );
      // if (operate === 'requisition') {
      //   // 领用，校验产线是否必输
      //   // this.checkRequisition();
      //   this.setState({prodLineFlag: operate === 'requisition'&&
      //       mgrList.length === 1 && mgrList[0].solderGlueStatus === 'FOR_REQUISTION'},
      //     ()=>{
      //       form.validateFields(err => {
      //         if (!err) {
      //           // this.handleBtn(fieldsValue.operate);
      //           if(operate === 'receive'){
      //             onReceive();
      //           }else {
      //             onOperate();
      //           }
      //         }
      //       });
      //     });
      // }
    }
  }

  /**
   * 点击按钮
   */
  // @Bind()
  // handleBtn(type) {
  //   const {mgrList, onOperate, onReceive} = this.props;
  //   console.log(type);
  //   let params = {};
  //   switch (type) {
  //     case 'receive': // 接收：状态为空的条码
  //       if (!this.checkValidate('')) {
  //         params = {operate: type, mgrList};
  //         onReceive(params);
  //       }
  //       break;
  //     case 'confirm': // 确认：状态为空的条码
  //       params = {operate: type};
  //       onOperate(params);
  //       break;
  //     case 'rewarn': // 回温：冷藏中状态的条码
  //       if (!this.checkValidate('rewarn')) {
  //         params = {operate: type, mgrList};
  //         onOperate(params);
  //       }
  //       break;
  //     case 'forRequisition': // 待领用：回温中状态的条码
  //       if (!this.checkValidate('forRequisition')) {
  //         params = {operate: type, mgrList};
  //         onOperate(params);
  //       }
  //       break;
  //     case 'requisition': // 领用：使用中和待领用状态的条码
  //       if (!this.checkRequisitionStatus()) {
  //         params = {operate: type, mgrList};
  //         onOperate(params);
  //       }
  //       break;
  //     case 'returning': // 归还：使用中和待领用状态的条码
  //       if (!this.checkValidate('returning')) {
  //         params = {operate: type, mgrList};
  //         onOperate(params);
  //       }
  //       break;
  //     default:
  //       break;
  //   }
  // }

  /**
   * 校验表格行状态
   * @param status
   */
  @Bind()
  checkValidate(status) {
    const { mgrList } = this.props;
    const result = mgrList.filter(item => item.solderGlueStatus !== status);
    return result > 0;
  }

  /**
   * 点击领用，校验产线是否必输
   */
  @Bind()
  checkRequisition() {
    const { mgrList } = this.props;
    if (mgrList.length === 1 && mgrList[0].solderGlueStatus === 'FOR_REQUISTION') {
      // 待领用
      this.setState({ prodLineFlag: true });
      // return true;
    }
    this.setState({ prodLineFlag: false });
    // return false;
  }

  /**
   * 点击领用，校验表格状态
   */
  // @Bind()
  // checkRequisitionStatus() {
  //   const { mgrList } = this.props;
  //   const result = mgrList.filter(
  //     item => item.solderGlueStatusMeaning !== '待领用' || item.solderGlueStatusMeaning !== '使用中'
  //   );
  //   return result > 0;
  // }

  /**
   * 切换操作类型
   * @param value
   */
  @Bind()
  handleChangeOptTye(value) {
    const { flag } = this.state;
    const { dispatch, mgrList } = this.props;
    this.setState({ prodLineFlag: false });
    if (!(flag && value === 'confirm') && mgrList.length > 0) {
      dispatch({
        type: 'solderGlueManage/updateState',
        payload: {
          mgrList: [],
          mgrPagination: false,
        },
      });
    }
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const modelPrompt = 'hwms.barcodeQuery.model.barcodeQuery';
    const modelPromp2 = 'hwms.solderGlueManage.model.solderGlueManage';
    const { tenantId, form, objectMap } = this.props;
    const { getFieldDecorator } = form;
    const { prodLineFlag, btnMap } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromp2}.objectType`).d('对象')}
            >
              {getFieldDecorator('objectType', {
                initialValue: objectMap[0].value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPromp2}.objectType`).d('对象'),
                    }),
                  },
                ],
              })(
                <Select allowClear>
                  {objectMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromp2}.optType`).d('操作类型')}
            >
              {getFieldDecorator('operate', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPromp2}.optType`).d('操作类型'),
                    }),
                  },
                ],
              })(
                <Select allowClear onChange={this.handleChangeOptTye}>
                  {btnMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.materialLotCode`).d('条码')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('materialLotCode', {})(
                <Input trim onPressEnter={this.handleScanCode} id="codeInput" />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              {/* <Button data-code="reset" onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button> */}
              <Button
                // data-code="search"
                type="primary"
                // htmlType="submit"
                onClick={this.handleConfirm}
              >
                {intl.get('hzero.common.button.confirm').d('确认')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
        {prodLineFlag && (
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                label={intl.get(`${modelPromp2}.prodLine`).d('产线')}
                {...SEARCH_FORM_ITEM_LAYOUT}
              >
                {getFieldDecorator('productLineCode', {
                  rules: [
                    {
                      required: prodLineFlag,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPromp2}.prodLine`).d('产线'),
                      }),
                    },
                  ],
                })(
                  <Lov code="Z.PRODLINE" queryParams={{ tenantId, userId: getCurrentUserId() }} />
                )}
              </Form.Item>
            </Col>
          </Row>
        )}
      </Form>
    );
  }
}

export default FilterForm;
