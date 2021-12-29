import React, { Component } from 'react';
import { Form, Button, Row, Col, Input, Modal } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { isFunction } from 'lodash';
import { openTab } from 'utils/menuTab';
import queryString from 'querystring';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  FORM_COL_2_LAYOUT,
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
    this.state = {};
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
  openEquipmentCheck() {
    const { workcellInfo = {} } = this.props;
    openTab({
      key: `/hhme/equipment-check`, // 打开 tab 的 key
      path: `/hhme/equipment-check`, // 打开页面的path
      title: '设备点检&保养平台',
      search: queryString.stringify({
        workcellCode: workcellInfo.workcellCode,
      }),
      closable: true,
    });
  }

  /**
   * 表单校验
   */
  @Bind()
  handleSearch() {
    const { scaneMaterialCode, form, errorEquipmentCodes, exceptionEquipmentCodes } = this.props;
    if (scaneMaterialCode) {
      form.validateFields((err, values) => {
        if (!err) {
          const numInput = document.getElementById("num");
          numInput.blur();

          if(exceptionEquipmentCodes || errorEquipmentCodes) {
            Modal.confirm({
              title: `${exceptionEquipmentCodes || errorEquipmentCodes}设备需要进行点检,是否先进行点检`,
              okText: '确定',
              cancelText: '取消',
              onOk: () => {
                this.openEquipmentCheck();
              },
              onCancel: () => {
                if(exceptionEquipmentCodes) {
                  // 如果验证成功,则执行onSearch
                  scaneMaterialCode(values);
                  numInput.focus();
                  numInput.select();
                }
              },
            });
          } else {
            // 如果验证成功,则执行onSearch
            scaneMaterialCode(values);
            numInput.focus();
            numInput.select();
          }
        }
      });
    }
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col span={6}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="盒子编号">
              {getFieldDecorator('materialLotCode', {})(
                <Input id='num' />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button data-code="reset" onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button
                data-code="search"
                type="primary"
                htmlType="submit"
                onClick={this.handleSearch}
              >
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default FilterForm;
