/**
 * WoSplitFormDrawer wo拆分抽屉
 * @date: 2019-12-23
 * @author: 许碧婷 <biting.xu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { Component } from 'react';
import { Input, Modal, Form, Icon, Row, Col } from 'hzero-ui';
import notification from 'utils/notification';
import { connect } from 'dva';
import { isArray } from 'lodash';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';

const modelPrompt = 'tarzan.workshop.productionOrderMgt.model.productionOrderMgt';
const tenantId = getCurrentOrganizationId();
const FormItem = Form.Item;

@connect(({ productionOrderMgt }) => ({
  productionOrderMgt,
}))
@Form.create()
export default class WoMergeFormDrawer extends Component {
  state = {
    secWorkOrderList: [
      {
        type: 1,
        flag: true,
      },
    ],
  };

  componentDidMount = () => {
    const { dispatch, workOrderId } = this.props;
    // 查找详细信息
    dispatch({
      type: 'productionOrderMgt/fetchEoCreateDetail',
      payload: {
        workOrderId,
      },
    });
  };

  componentWillUnmount = () => {
    this.setState({
      secWorkOrderList: {
        type: 1,
        flag: true,
      },
    });
  };

  saveMerge = () => {
    const { form, dispatch, type, onCancel, workOrderId } = this.props;
    const { secWorkOrderList } = this.state;
    form.validateFieldsAndScroll({ force: true }, (err, values) => {
      if (!err) {
        const params = {};
        const secondaryWorkOrderIds = [];
        for (const va in values) {
          if (va.indexOf('secondaryWorkOrderIds') !== -1) {
            const secType = va.substring(21);
            const filters = secWorkOrderList.filter(sec => sec.type === parseInt(secType, 10));
            if (isArray(filters) && filters.length > 0 && filters[0].flag) {
              secondaryWorkOrderIds.push(values[va]);
            }
          }
        }
        params.secondaryWorkOrderIds = secondaryWorkOrderIds;
        params.primaryWorkOrderId = workOrderId;

        dispatch({
          type: 'productionOrderMgt/saveWoMergeForm',
          payload: {
            ...params,
          },
        }).then(res => {
          if (res && res.success) {
            // 刷新整个页面
            notification.success();
            this.props.onRefresh(res.rows);
            onCancel(type);
          } else if (res && !res.success) {
            notification.error({
              message: res.message,
            });
          }
        });
      }
    });
  };

  onMinus = c => {
    // minus
    const { secWorkOrderList } = this.state;
    if (secWorkOrderList.filter(item => item.flag).length > 1) {
      secWorkOrderList.forEach(sec => {
        if (sec.type === c) {
          Object.assign(sec, { flag: false });
        }
      });

      this.setState({
        secWorkOrderList,
      });
    }
  };

  onPlus = () => {
    // plus
    const { secWorkOrderList } = this.state;
    const secList = secWorkOrderList;
    let last = secWorkOrderList[secWorkOrderList.length - 1].type;
    last++;
    secList.push({ type: last, flag: true });

    this.setState({
      secWorkOrderList: secList,
    });
  };

  renderSecWorkOrder = value => {
    const { getFieldDecorator } = this.props.form;
    return value.map(item => {
      if (item.flag) {
        return (
          <Row>
            <Col
              span={2}
              style={{
                top: '12px',
              }}
            >
              <Icon
                type="minus-circle-o"
                style={{
                  position: 'absolute',
                  left: '20px',
                  cursor: 'pointer',
                  zIndex: 999,
                }}
                onClick={() => this.onMinus(item.type)}
              />
            </Col>
            <Col>
              <FormItem
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.secondaryWorkOrderIds`).d('副WO编码')}
              >
                {getFieldDecorator(`secondaryWorkOrderIds${item.type}`, {
                  rules: [
                    {
                      required: true,
                      message: intl
                        .get(`${modelPrompt}.secondaryWorkOrderIdsMsg`)
                        .d('副WO编码不能为空'),
                    },
                  ],
                })(<Lov code="MT.WORK_ORDER_NUM" queryParams={{ tenantId }} disabled={false} />)}
              </FormItem>
            </Col>
          </Row>
        );
      } else {
        return null;
      }
    });
  };

  render() {
    const {
      visible,
      onCancel,
      form,
      type,
      productionOrderMgt: { eoCreateDetail = {} },
    } = this.props;
    const { getFieldDecorator } = form;
    const { workOrderNum } = eoCreateDetail;
    const { secWorkOrderList } = this.state;

    return (
      <Modal
        destroyOnClose
        width={360}
        title={intl.get(`${modelPrompt}.splitWo`).d('WO合并')}
        visible={visible}
        onCancel={() => onCancel(type)}
        onOk={() => this.saveMerge()}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Form>
          <Row>
            <Col span={2} />
            <Col>
              <FormItem
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.primaryWorkOrderId`).d('主WO编码')}
              >
                {getFieldDecorator(`primaryWorkOrderId`, {
                  initialValue: workOrderNum,
                })(<Input disabled />)}
              </FormItem>
            </Col>
          </Row>
          {this.renderSecWorkOrder(secWorkOrderList)}
          <Row>
            <Col span={2}>
              <Icon
                type="plus-circle-o"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '20px',
                  color: '#3499f1',
                  cursor: 'pointer',
                }}
                onClick={() => this.onPlus()}
              />
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
