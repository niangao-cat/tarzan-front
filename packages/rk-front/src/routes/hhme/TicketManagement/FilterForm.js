import React, { Component } from 'react';
import { Form, Button, Input, Row, Col, Select, DatePicker } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import {
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';
import { Button as ButtonPermission } from 'components/Permission';
import Lov from 'components/Lov';
import cacheComponent from 'components/CacheComponent';
import styles from './index.less';
import formDown from '@/assets/formDown.png';
// import Assemblylist from '@/assets/Assemblylist.png';
// import Routing from '@/assets/Routing.png';
// import chanpinQD from '@/assets/chanpinQD.png';
import gongdanXD from '@/assets/gongdanXD.png';
// import gongdanZT from '@/assets/gongdanZT.png';
// import gongdanCX from '@/assets/gongdanCX.png';
// import gongdanGB from '@/assets/gongdanGB.png';
import distributionLine from '@/assets/distributionLine.png';

const { Option, OptGroup } = Select;

/**
 *  页面搜索框
 * @extends {Component} - React.Component
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
@cacheComponent({ cacheKey: '/hhme/ticket-management' })
class FilterForm extends Component {
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
    const { form, clearCacheMoreSearch } = this.props;
    clearCacheMoreSearch();
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

  // 按钮事件
  @Bind()
  buttonOnClick(type) {
    this.props.buttonOnClick(type);
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      form,
      woStatus,
      path,
      onDistributionLine,
      buttonOnClickRelease,
      checkTichetLoading,
      ticketReleaseLoading,
      departmentList = [],
      tenantId,
    } = this.props;
    const { getFieldDecorator } = form;
    const {
      prodLineCode = '',
    } = this.props.form.getFieldsValue();
    const unfinishedList = [];
    const finishedList = [];
    woStatus.forEach(e => {
      if(['NEW', 'EORELEASED', 'RELEASED', 'HOLD'].includes(e.value)) {
        unfinishedList.push(e);
      } else {
        finishedList.push(e);
      }
    });
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="工单编码" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workOrderNum', {})(
                <Input className={styles['more-fields-input']} trim />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="工单状态">
              {getFieldDecorator('status', {})(
                <Select allowClear>
                  <OptGroup label="未完成">
                    {unfinishedList.map(item => (
                      <Option key={item.value}>{item.meaning}</Option>
                    ))}
                  </OptGroup>
                  <OptGroup label="已完成">
                    {finishedList.map(item => (
                      <Option key={item.value}>{item.meaning}</Option>
                    ))}
                  </OptGroup>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="产品编码">
              {getFieldDecorator('materialCode', {})(
                <Input className={styles['more-fields-input']} trim />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
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
              <Button className={styles['more-fields-moreBut']} onClick={this.handleMoreSearch}>
                更多
                <img style={{ marginLeft: '5px' }} src={formDown} alt="" />
              </Button>
              <Button className={styles['more-fields-moreBut']} onClick={this.handleFormReset}>
                重置
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="制造部" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('departmentName', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '制造部',
                    }),
                  },
                ],
              })(
                <Select allowClear>
                  {departmentList.map(e => (
                    <Select.Option key={e.areaCode} value={e.areaCode}>
                      {e.areaCode}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="生产线">
              {getFieldDecorator('productionLineId', {
              })(
                <Lov
                  code="MT.PRODLINE"
                  allowClear
                  // textValue={record.workShopDesc}
                  queryParams={{
                    tenantId,
                  }}
                  onChange={(value, item) => {
                    form.setFieldsValue({
                      prodLineCode: item.prodLineCode,
                    });
                  }}
                  textValue={prodLineCode}
                />
              )}
            </Form.Item>
            <Form.Item
              style={{ display: 'none' }}
            >
              {getFieldDecorator('prodLineCode')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="交付时间从" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('deliveryDateFrom', {})(
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  className={styles['more-fields-date']}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="至" labelCol={{ span: 3 }} wrapperCol={{ span: 18 }}>
              {getFieldDecorator('deliveryDateTo', {})(
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  className={styles['more-fields-date']}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} className={styles['more-fields-form-but']}>
          <Form.Item>
            {/* <ButtonPermission
              className={styles['ticket-edit-ButtonRig']}
              permissionList={[
                {
                  code: `${path}.button.work.order.assembly.list`,
                  type: 'button',
                  meaning: '工单管理-装配清单',
                },
              ]}
              disabled
            >
              <img src={Assemblylist} alt="" />
              装配清单
            </ButtonPermission> */}
            {/* <ButtonPermission
              className={styles['ticket-edit-ButtonRig']}
              permissionList={[
                {
                  code: `${path}.button.work.order.process.line`,
                  type: 'button',
                  meaning: '工单管理-工艺线路',
                },
              ]}
              disabled
            >
              <img src={Routing} alt="" />
              工艺线路
            </ButtonPermission> */}
            {/* <ButtonPermission
              className={styles['ticket-edit-ButtonRig']}
              permissionList={[
                {
                  code: `${path}.button.work.order.prod.list`,
                  type: 'button',
                  meaning: '工单管理-产品清单',
                },
              ]}
              disabled
            >
              <img src={chanpinQD} alt="" />
              产品清单
            </ButtonPermission> */}
            <ButtonPermission
              className={styles['ticket-edit-ButtonRig']}
              onClick={() => buttonOnClickRelease()}
              loading={ticketReleaseLoading}
              permissionList={[
                {
                  code: `${path}.button.work.order.release`,
                  type: 'button',
                  meaning: '工单管理-工单下达',
                },
              ]}
            >
              <img src={gongdanXD} alt="" />
              工单下达
            </ButtonPermission>
            <ButtonPermission
              onClick={() => onDistributionLine(true)}
              className={styles['ticket-edit-ButtonRig']}
              permissionList={[
                {
                  code: `${path}.button.work.order.distribution.line`,
                  type: 'button',
                  meaning: '工单管理-分配产线',
                },
              ]}
              loading={checkTichetLoading}
            >
              <img src={distributionLine} alt="" style={{ width: '14px', height: '14px' }} />
              分配产线
            </ButtonPermission>
            {/* <ButtonPermission
              onClick={() => this.buttonOnClick('STOP')}
              className={styles['ticket-edit-ButtonRig']}
              permissionList={[
                {
                  code: `${path}.button.work.order.stop`,
                  type: 'button',
                  meaning: '工单管理-工单暂停',
                },
              ]}
            >
              <img src={gongdanZT} alt="" />
              工单暂停
            </ButtonPermission> */}
            {/* <ButtonPermission
              onClick={() => this.buttonOnClick('BACK')}
              className={styles['ticket-edit-ButtonRig']}
              permissionList={[
                {
                  code: `${path}.button.work.order.back`,
                  type: 'button',
                  meaning: '工单管理-工单撤销',
                },
              ]}
            >
              <img src={gongdanCX} alt="" />
              工单撤销
            </ButtonPermission> */}
            {/* <ButtonPermission
              onClick={() => this.buttonOnClick('CLOSE')}
              className={styles['ticket-edit-ButtonRig']}
              permissionList={[
                {
                  code: `${path}.button.work.order.close`,
                  type: 'button',
                  meaning: '工单管理-工单关闭',
                },
              ]}
            >
              <img src={gongdanGB} alt="" />
              工单关闭
            </ButtonPermission> */}
            {/* <ButtonPermission
              className={styles['ticket-edit-ButtonRig']}
              onClick={() => this.buttonOnClick('SEND')}
              permissionList={[
                {
                  code: `${path}.button.work.order.send`,
                  type: 'button',
                  meaning: '工单管理-SN创建',
                },
              ]}
            >
              <img src={gongdanXD} alt="" />
              SN创建
            </ButtonPermission> */}
          </Form.Item>
        </Row>
      </Form>
    );
  }
}

export default FilterForm;
