/*
 * @Description: 设备盘点单据创建
 * @Version: 0.0.1
 * @Autor: liyuan.liu@hand-china.com
 * @Date: 2021-04-01
 */

import React, { PureComponent } from 'react';
import { Button, Form, DatePicker, Modal, Row, Col, Input, Select } from 'hzero-ui';
import Lov from 'components/Lov';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId } from 'utils/utils';
import {
  EDIT_FORM_CLASSNAME,
  EDIT_FORM_ITEM_LAYOUT_COL_2,
  EDIT_FORM_ROW_LAYOUT,
} from 'utils/constants';
import { isEmpty } from 'lodash';
import intl from 'utils/intl';
// import MultipleLov from '../../../components/MultipleLov';


const { Option } = Select;
@Form.create({ fieldNameProp: null })
export default class StationChangeHistoryModal extends PureComponent {
  /**
   * 提交
   */
  @Bind()
  handleSubmit() {
    const { onSubmit, form } = this.props;
    const fieldValues = form.getFieldsValue();
    if (onSubmit) {
      form.validateFields(err => {
        if (!err) {
          // 如果验证成功,则执行onSubmit
          onSubmit({ ...fieldValues });
        }
      });
    }
  }

  @Bind()
  onCancel() {
    const { onCancel } = this.props;
    onCancel(false);
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const tenantId = getCurrentOrganizationId();
    const {
      form,
      visible,
      stocktakeTypeList,
      stocktakeStatusList,
      moreSearchCache,
      filterValue,
      ledgerType,
      loading,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

    return (
      <Modal
        destroyOnClose
        maskClosable
        title='设备盘点单据创建'
        visible={visible}
        onCancel={this.onCancel}
        footer={[
          <Button key="back" onClick={this.onCancel}>取消</Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={this.handleSubmit}
          >
            确定
          </Button>,
        ]}
        width={400}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Form className={EDIT_FORM_CLASSNAME}>
          <Row {...EDIT_FORM_ROW_LAYOUT}>
            <Col>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT_COL_2}
                label="单据号"
              >
                {getFieldDecorator('stocktakeId', {})(
                  <Lov code="HME.EQUIPMENT_STOCKTAKE_DOC" queryParams={{ tenantId }} />
                )}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT_COL_2}
                label="盘点类型"
              >
                {getFieldDecorator('stocktakeType')(
                  <Select allowClear>
                    {stocktakeTypeList.map(ele => (
                      <Option value={ele.value} key={ele.value}>{ele.meaning}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT_COL_2}
                label="盘点范围"
              >
                {getFieldDecorator('stocktakeRange', {
                  rules: [
                    {
                      required: getFieldValue('stocktakeType') === 'RANDOM',
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '盘点范围',
                      }),
                    },
                  ],
                })(
                  <Input disabled={getFieldValue('stocktakeType') !== 'RANDOM'} />
                )}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT_COL_2}
                label="台账类别"
              >
                {getFieldDecorator('ledgerType', {
                  initialValue: isEmpty(filterValue)
                    ? ''
                    : ledgerType
                      .filter(element => filterValue.ledgerTypeList && filterValue.ledgerTypeList.includes(element.value))
                      .map(item => item.meaning),
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT_COL_2}
                label="保管部门"
              >
                {getFieldDecorator('businessId', {
                  initialValue: isEmpty(moreSearchCache) ? '' : moreSearchCache.businessName,
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT_COL_2}
                label="入账日期从"
              >
                {getFieldDecorator('postingDateFrom', {
                    initialValue: isEmpty(moreSearchCache) ? '' : moreSearchCache.postingDateStart,

                  })(
                    <DatePicker
                      // disabled={isEmpty(moreSearchCache) || moreSearchCache.postingDateStart === ""}
                      disabled
                      showTime={{ format: 'HH:mm:ss' }}
                      format="YYYY-MM-DD HH:mm:ss"
                      style={{ width: '100%' }}
                    />
                )}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT_COL_2}
                label='入账日期至'
              >
                {getFieldDecorator('postingDateTo', {
                  initialValue: isEmpty(moreSearchCache) ? '' : moreSearchCache.postingDateEnd,
                })(
                  <DatePicker
                    // disabled={isEmpty(moreSearchCache) || moreSearchCache.postingDateEnd === ""}
                    disabled
                    showTime={{ format: 'HH:mm:ss' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: '100%' }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT_COL_2}
                label="单据状态"
              >
                {getFieldDecorator('stocktakeStatus', {
                  initialValue: "NEW",
                })(
                  <Select allowClear>
                    {stocktakeStatusList.map(ele => (
                      <Option value={ele.value} key={ele.value}>{ele.meaning}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT_COL_2}
                label="备注"
              >
                {getFieldDecorator('remark', {})(
                  <Input />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
