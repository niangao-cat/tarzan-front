import React, { Component } from 'react';
import { Form, Button, Input, Row, Col, Select, Modal, DatePicker } from 'hzero-ui';
import { Bind, Throttle } from 'lodash-decorators';
import {
  DEBOUNCE_TIME,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  FORM_COL_4_LAYOUT,
} from 'utils/constants';
import Lov from 'components/Lov';
import moment from 'moment';
import { getCurrentOrganizationId } from 'utils/utils';
import styles from './index.less';

const tenantId = getCurrentOrganizationId();



const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

@Form.create({ fieldNameProp: null })
class MoreSearchModal extends Component {
  constructor(props) {
    super(props);
    const { onRef } = props;
    if (onRef) onRef(this);
    this.state = {
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
    const { onMoreSearch, form } = this.props;
    if (onMoreSearch) {
      form.validateFields(err => {
        if (!err) {
          onMoreSearch();
        }
      });
    }
  }

  @Throttle(DEBOUNCE_TIME)
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, visible, onCancel, woStatus, woType, cacheMoreSearch } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        className={styles['more-search-modal']}
        visible={visible}
        title="更多查询"
        onCancel={onCancel}
        width={1200}
        footer={[
          <Button key="reset" onClick={this.handleFormReset}>
            清空
          </Button>,
          <Button key="submit" type="primary" onClick={this.handleSearch}>
            查询
          </Button>,
        ]}
      >
        <Form className={styles['more-search-modal-from']}>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item label="工单编码" {...formLayout}>
                {getFieldDecorator('workOrderNum', {
                  initialValue: cacheMoreSearch.workOrderNum,
                })(
                  <Input className={styles['more-fields-input']} trim />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...formLayout} label="工单类型">
                {getFieldDecorator('workOrderType', {
                  initialValue: cacheMoreSearch.workOrderType,
                })(
                  <Select allowClear>
                    {woType.map(item => (
                      <Select.Option key={item.value}>{item.meaning}</Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...formLayout} label="工单状态">
                {getFieldDecorator('status', {
                  initialValue: cacheMoreSearch.status,
                })(
                  <Select allowClear>
                    {woStatus.map(item => (
                      <Select.Option key={item.value}>{item.meaning}</Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...formLayout} label="工单数量">
                {getFieldDecorator('qty', {
                  initialValue: cacheMoreSearch.qty,
                })(<Input className={styles['more-fields-input']} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item label="产品编码" {...formLayout}>
                {getFieldDecorator('materialCode', {
                  initialValue: cacheMoreSearch.materialCode,
                })(
                  <Input className={styles['more-fields-input']} trim />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...formLayout} label="产品类型">
                {getFieldDecorator('materialCategory', {
                  initialValue: cacheMoreSearch.materialCategory,
                })(
                  <Input className={styles['more-fields-input']} trim />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item label="订单编号" {...formLayout}>
                {getFieldDecorator('makeOrderNum', {
                  initialValue: cacheMoreSearch.makeOrderNum,
                })(
                  <Input className={styles['more-fields-input']} trim />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...formLayout} label="上级备注">
                {getFieldDecorator('remark', {
                  initialValue: cacheMoreSearch.remark,
                })(
                  <Input className={styles['more-fields-input']} trim />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item label="工单备注" {...formLayout}>
                {getFieldDecorator('woRemark', {
                  initialValue: cacheMoreSearch.woRemark,
                })(
                  <Input className={styles['more-fields-input']} trim />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item label="BOM编码" {...formLayout}>
                {getFieldDecorator('bomName', {
                  initialValue: cacheMoreSearch.bomName,
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item label="工艺路线编码" {...formLayout}>
                {getFieldDecorator('routerName', {
                  initialValue: cacheMoreSearch.routerName,
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item label="组件物料" {...formLayout}>
                {getFieldDecorator('bomMaterialId', {
                  initialValue: cacheMoreSearch.bomMaterialId,
                })(
                  <Lov
                    onChange={(value, values) => {
                      form.setFieldsValue({
                        bomMaterialCode: values.materialCode,
                      });
                    }}
                    code="MT.MATERIAL"
                    queryParams={{ tenantId }}
                    textValue={cacheMoreSearch.bomMaterialCode|| null}
                  />
                )}
              </Form.Item>
              <Form.Item label="组件物料" {...formLayout} style={{display: 'none'}}>
                {getFieldDecorator('bomMaterialCode', {
                    initialValue: cacheMoreSearch.bomMaterialCode,
                })(
                  <Input className={styles['more-fields-input']} trim />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="工单下达时间从">
                {getFieldDecorator('publishDateFrom', {
                  initialValue: cacheMoreSearch.publishDateFrom ? moment(cacheMoreSearch.publishDateFrom, 'YYYY-MM-DD HH:mm:ss') : '',
                })(
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    className={styles['more-fields-date']}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 18 }} label="至">
                {getFieldDecorator('publishDateTo', {
                  initialValue: cacheMoreSearch.publishDateTo ? moment(cacheMoreSearch.publishDateTo, 'YYYY-MM-DD HH:mm:ss') : '',
                })(
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    className={styles['more-fields-date']}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item label="计划开始时间从" {...SEARCH_FORM_ITEM_LAYOUT}>
                {getFieldDecorator('planStartTimeFrom', {
                  initialValue: cacheMoreSearch.planStartTimeFrom ? moment(cacheMoreSearch.planStartTimeFrom, 'YYYY-MM-DD HH:mm:ss') : '',
                })(
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
                {getFieldDecorator('planStartTimeTo', {
                  initialValue: cacheMoreSearch.planStartTimeTo ? moment(cacheMoreSearch.planStartTimeTo, 'YYYY-MM-DD HH:mm:ss') : '',
                })(
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    className={styles['more-fields-date']}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="工单创建时间从">
                {getFieldDecorator('creationDateFrom', {
                  initialValue: cacheMoreSearch.creationDateFrom ? moment(cacheMoreSearch.creationDateFrom, 'YYYY-MM-DD HH:mm:ss') : '',
                })(
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    className={styles['more-fields-date']}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 18 }} label="至">
                {getFieldDecorator('creationDateTo', {
                  initialValue: cacheMoreSearch.creationDateTo ? moment(cacheMoreSearch.creationDateTo, 'YYYY-MM-DD HH:mm:ss') : '',
                })(
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    className={styles['more-fields-date']}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item label="计划完成时间从" {...SEARCH_FORM_ITEM_LAYOUT}>
                {getFieldDecorator('planEndTimeFrom', {
                  initialValue: cacheMoreSearch.planEndTimeFrom ? moment(cacheMoreSearch.planEndTimeFrom, 'YYYY-MM-DD HH:mm:ss') : '',
                })(
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
                {getFieldDecorator('planEndTimeTo', {
                  initialValue: cacheMoreSearch.planEndTimeTo ? moment(cacheMoreSearch.planEndTimeTo, 'YYYY-MM-DD HH:mm:ss') : '',
                })(
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    className={styles['more-fields-date']}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="工单修改时间从">
                {getFieldDecorator('lastUpdateDateFrom', {
                  initialValue: cacheMoreSearch.lastUpdateDateFrom ? moment(cacheMoreSearch.lastUpdateDateFrom, 'YYYY-MM-DD HH:mm:ss') : '',
                })(
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    className={styles['more-fields-date']}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 18 }} label="至">
                {getFieldDecorator('lastUpdateDateTo', {
                  initialValue: cacheMoreSearch.lastUpdateDateTo ? moment(cacheMoreSearch.lastUpdateDateTo, 'YYYY-MM-DD HH:mm:ss') : '',
                })(
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    className={styles['more-fields-date']}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default MoreSearchModal;
