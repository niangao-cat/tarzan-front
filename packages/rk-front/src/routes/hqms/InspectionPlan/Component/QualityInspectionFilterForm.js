/*
 * @Description: inspectionPlan
 * @version: 0.1.0
 * @Author: wenjie.yang@hand-china.com
 * @Date: 2020-04-16 16:27:45
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-07-24 10:12:00
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Form, Button, Row, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import {
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';
import { connect } from 'dva';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';

/**
 *  页面搜索框
 * @extends {Component} - React.Component
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@connect(({ inspectionPlan }) => ({
  inspectionPlan,
  tenantId: getCurrentOrganizationId(),
}))
@Form.create({ fieldNameProp: null })
class QualityInspectionFilterForm extends Component {
  constructor(props) {
    super(props);
    const { onRef } = props;
    if (onRef) onRef(this);
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      expandForm: false,
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

  // 查询
  @Bind()
  handleSearch() {
    const { onSearch, form } = this.props;
    if (onSearch) {
      form.validateFields((err, values) => {
        if (!err) {
          // 如果验证成功,则执行onSearch
          onSearch(values);
        }
      });
    }
  }

  // 更多查询
  @Bind()
  handleMoreSearch() {
    const { handleMoreSearch } = this.props;
    handleMoreSearch(true);
  }

  // 新增
  @Bind()
  handleAddInspectionTeam() {
    const { addInspectionTeam } = this.props;
    addInspectionTeam();
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      form,
      handleSaveInspectionTeam,
      tenantId,
      saveHeadLoading,
      saveLineLoading,
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="检验组编码" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('inspectionSchemeId', {})(
                <Lov queryParams={{ tenantId }} code="QMS.TAG_GROUP" textField="tagGroupCode" />
              )}
            </Form.Item>
          </Col>
          <Col span={12} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button
                data-code="search"
                type="primary"
                htmlType="submit"
                icon="search"
                onClick={this.handleSearch}
              >
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
              <Button type="primary" onClick={() => this.handleAddInspectionTeam()}>
                新增
              </Button>
              <Button
                type="primary"
                loading={saveHeadLoading || saveLineLoading}
                onClick={() => handleSaveInspectionTeam()}
              >
                保存
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default QualityInspectionFilterForm;
