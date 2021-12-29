/*
 * @Description: 工序在制查询
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-03-23 14:59:47
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2021-01-13 11:33:31
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { PureComponent } from 'react';
import { Form, Button, Row, Col, Select, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { connect } from 'dva';
import { SEARCH_FORM_ITEM_LAYOUT } from 'utils/constants';
import styles from './index.less';

const FormItem = Form.Item;

@connect(({ processInProcess }) => ({
  processInProcess,
}))
@Form.create({ fieldNameProp: null })
export default class FilterForm extends PureComponent {
  constructor(props) {
    super(props);
    const { onRef } = props;
    if (onRef) onRef(this);
    this.state = {
      expandForm: false,
    };
  }

  /**
   * 查询
   */
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

  /**
   * 重置
   */
  @Bind()
  handleFormReset() {
    this.props.form.resetFields();
  }

  /**
   * 表单展开收起
   */
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  }

  // 获取生产线
  @Bind()
  fetchProductionLine() {
    const {
      dispatch,
      form: { getFieldValue },
    } = this.props;
    dispatch({
      type: 'processInProcess/fetchProductionLine',
      payload: {
        areaId: getFieldValue('areaId'),
      },
    });
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      workShopList = [],
      defaultSite,
      processInProcess: { productionLineList = [] },
    } = this.props;
    return (
      <Form layout="inline" className={styles['more-fields-form']}>
        <Row>
          <Col span={5}>
            <FormItem {...SEARCH_FORM_ITEM_LAYOUT} style={{ width: '100%' }} label="工厂">
              {getFieldDecorator('siteName', {
                initialValue: defaultSite.siteName,
              })(<Input disabled />)}
            </FormItem>
            <FormItem {...SEARCH_FORM_ITEM_LAYOUT} style={{ width: '100%', display: 'none' }}>
              {getFieldDecorator('siteId', {
                initialValue: defaultSite.siteId,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem {...SEARCH_FORM_ITEM_LAYOUT} style={{ width: '100%' }} label="车间">
              {getFieldDecorator('areaId', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '车间',
                    }),
                  },
                ],
              })(
                <Select style={{ width: '100%' }} allowClear>
                  {workShopList.map(item => (
                    <Select.Option key={item.areaId} value={item.areaId}>
                      {item.areaName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem {...SEARCH_FORM_ITEM_LAYOUT} style={{ width: '100%' }} label="生产线">
              {getFieldDecorator('prodLineId', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '生产线',
                    }),
                  },
                ],
              })(
                <Select
                  style={{ width: '100%' }}
                  allowClear
                  disabled={!getFieldValue('areaId')}
                  onFocus={() => this.fetchProductionLine()}
                >
                  {productionLineList.map(item => (
                    <Select.Option key={item.prodLineId} value={item.prodLineId}>
                      {item.prodLineName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem {...SEARCH_FORM_ITEM_LAYOUT} style={{ width: '100%' }} label="物料编码">
              {getFieldDecorator('typeName')(<Input />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <div style={{ paddingLeft: '20px' }}>
              <FormItem>
                <Button
                  className={styles['more-fields-clear']}
                  data-code="reset"
                  onClick={this.handleFormReset}
                >
                  清空
                </Button>
                <Button
                  data-code="search"
                  type="primary"
                  htmlType="submit"
                  onClick={this.handleSearch}
                  icon="search"
                  style={{ backgroundColor: '#536BD7', marginLeft: '10px' }}
                >
                  {intl.get('hzero.common.button.search').d('查询')}
                </Button>
              </FormItem>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}
