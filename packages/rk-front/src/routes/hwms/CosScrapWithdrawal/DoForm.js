/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 表增量报表
 */

import React, { Component } from 'react';
import { Form, Button, Col, Row, Input } from 'hzero-ui';
import notification from 'utils/notification';
import { Bind } from 'lodash-decorators';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';
import intl from 'utils/intl';
import { Content } from 'components/Page';


const commonModelPrompt = 'tarzan.hwms.cosScrapWithdrawal';

@Form.create({ fieldNameProp: null })
export default class DoForm extends Component {

  @Bind()
  doInBox(){

    // 判断装入盒子是否有值， 有则进行下一步
    if(this.props.form.getFieldValue('inMaterialLotCode')===null||this.props.form.getFieldValue('inMaterialLotCode')===undefined||this.props.form.getFieldValue('inMaterialLotCode')===""){
      return notification.error({message: '请先输入装入盒子'});
    }

    const { doInBox } = this.props;

    // 装入数据
    doInBox(this.props.form.getFieldValue('inMaterialLotCode'));
  }

  // 渲染 界面布局
  render() {

    // 获取整个表单
    const { form, saveLoading } = this.props;
    // 获取表单的字段属性
    const { getFieldDecorator } = form;

    //  返回默认界面数据
    return (
      <div>
        <Content>
          <Form className={SEARCH_FORM_CLASSNAME}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.inMaterialLotCode`).d('装入盒子')}
                >
                  {getFieldDecorator('inMaterialLotCode', {})(
                    <Input />
              )}
                </Form.Item>
              </Col>
              <Col span="6" className={SEARCH_COL_CLASSNAME}>
                <Form.Item>
                  <Button onClick={this.doInBox.bind(this)} type="primary" loading={saveLoading}>
                    {intl.get(`hzero.common.button.indox`).d('装入')}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Content>
      </div>
    );
  }
}
