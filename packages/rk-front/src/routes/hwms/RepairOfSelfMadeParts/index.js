/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 表增量报表
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Form, Button, Col, Row, Input, notification } from 'hzero-ui';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';

const commonModelPrompt = 'tarzan.hwms.repairOfSelfMadeParts';

@connect(({ repairOfSelfMadeParts, loading }) => ({
  repairOfSelfMadeParts,
  fetchDataLoading: loading.effects['repairOfSelfMadeParts/fetchData'],
  saveLoading: loading.effects['repairOfSelfMadeParts/saveData'],
}))
@Form.create({ fieldNameProp: null })
export default class repairOfSelfMadeParts extends Component {

  /**
   * 数据查询
   */
  @Bind
  queryData() {
    const { dispatch } = this.props;

    const { form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        // 光标失焦
        const materialLotCodeInput = document.getElementById("materialLotCode");
        materialLotCodeInput.blur();
        const materialLotCodeScan = materialLotCodeInput.value;
        // 根据页数查询报表信息
        dispatch({
          type: 'repairOfSelfMadeParts/fetchData',
          payload: {
            ...values,
            materialLotCode: materialLotCodeInput.value,
          },
        }).then(res => {
          if (res) {
            notification.success({ message: '录入成功!!' });
          }
          // 清空界面
          form.resetFields();
          form.setFieldsValue({materialLotCodeScan });
          // 光标聚焦
          materialLotCodeInput.focus();
          materialLotCodeInput.select();
        });
      }
    });
  }

  /**
   * 数据保存
   */
  @Bind()
  saveData() {
    const {
      dispatch,
      repairOfSelfMadeParts: { barcodeData = {} },
    } = this.props;
    dispatch({
      type: 'repairOfSelfMadeParts/saveData',
      payload: {
        ...barcodeData,
      },
    }).then(res => {
      if (res) {
        if(res.status === 'S'){
          notification.success({ message: '保存成功' });
          this.resetSearch();
           // 光标聚焦
          const materialLotCodeInput = document.getElementById("materialLotCode");
          materialLotCodeInput.value = "";
          materialLotCodeInput.focus();
          materialLotCodeInput.select();
          // 界面数据刷新
          this.props.form.setFieldsValue({
            ...res,
          });
        }else{
          notification.error({ message: res.message });
        }
      }
    });
  }

  // 重置查询
  @Bind
  resetSearch = () => {
    const { form } = this.props;
    form.resetFields();
  };

  // 渲染 界面布局
  render() {
    // 获取默认数据
    const {
      fetchDataLoading,
      saveLoading,
      repairOfSelfMadeParts: { barcodeData = {} },
    } = this.props;

    // 获取整个表单
    const { form } = this.props;
    // 获取表单的字段属性
    const { getFieldDecorator } = form;

    //  返回默认界面数据
    return (
      <div>
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('自制件返修')} />
        <Content>
          <Form className={SEARCH_FORM_CLASSNAME}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.materialLotCodeScan`).d('条码')}
                >
                  {getFieldDecorator('materialLotCodeScan', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${commonModelPrompt}.businessType`).d('条码'),
                        }),
                      },
                    ],
                  })(<Input id="materialLotCode" onPressEnter={this.queryData} />)}
                </Form.Item>
              </Col>
              <Col span="4" className={SEARCH_COL_CLASSNAME}>
                <Form.Item>
                  <Button
                    disabled={
                      barcodeData.materialLotCode === '' ||
                      barcodeData.materialLotCode === null ||
                      barcodeData.materialLotCode === undefined
                    }
                    loading={saveLoading || fetchDataLoading}
                    type="primary"
                    onClick={this.saveData.bind(this)}
                  >
                    {intl.get(`hzero.common.button.save`).d('保存')}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.siteCode`).d('工厂编码')}
                >
                  {getFieldDecorator('siteCode', {
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.workOrderNum`).d('生产订单号')}
                >
                  {getFieldDecorator('workOrderNum', {
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.locatorCode`).d('仓库编码')}
                >
                  {getFieldDecorator('locatorCode', {
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.materialCode`).d('物料编码')}
                >
                  {getFieldDecorator('materialCode', {
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.materialLotCode`).d('条码号')}
                >
                  {getFieldDecorator('materialLotCode', {
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.qty`).d('数量')}
                >
                  {getFieldDecorator('qty', {
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.locatorCode`).d('单位编码')}
                >
                  {getFieldDecorator('primaryUomCode', {
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.materialCode`).d('生产版本')}
                >
                  {getFieldDecorator('productionVersion', {
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.planStartTime`).d('计划时间从')}
                >
                  {getFieldDecorator('planStartTime', {
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${commonModelPrompt}.planEndTime`).d('计划时间至')}
                >
                  {getFieldDecorator('planEndTime', {
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Content>
      </div>
    );
  }
}
