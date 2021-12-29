/**
 * MergeDrawer 合并抽屉
 * @date: 2019-12-25
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Col, Icon, Row } from 'hzero-ui';
import intl from 'utils/intl';
import { isArray } from 'lodash';
import notification from 'utils/notification';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';

const modelPrompt = 'tarzan.workshop.execute.model.execute';
const FormItem = Form.Item;
const tenantId = getCurrentOrganizationId();

@connect(({ execute }) => ({
  execute,
}))
@Form.create({ fieldNameProp: null })
export default class MergeDrawer extends React.Component {
  state = {
    secEOList: [
      {
        type: 1,
        flag: true,
      },
    ],
  };

  saveSplit = () => {
    const { form, dispatch, eoId, onOk } = this.props;
    const { secEOList } = this.state;
    form.validateFieldsAndScroll({ force: true }, (err, values) => {
      if (!err) {
        const secondaryEoIds = [];
        for (const val in values) {
          if (val.indexOf('secondaryEoIds') !== -1) {
            const secType = val.substring(14);
            const filters = secEOList.filter(sec => sec.type === parseInt(secType, 10));
            if (isArray(filters) && filters.length > 0 && filters[0].flag) {
              secondaryEoIds.push(values[val]);
            }
          }
        }

        if (secondaryEoIds.length && new Set(secondaryEoIds).size !== secondaryEoIds.length) {
          Modal.warning({
            title: intl.get(`${modelPrompt}.same`).d('副EO编码不能重复'),
          });
          return null;
        }

        dispatch({
          type: 'execute/mergeExecute',
          payload: {
            primaryEoId: eoId,
            secondaryEoIds,
          },
        }).then(res => {
          if (res && res.success) {
            // 刷新整个页面
            onOk(res.rows);
            notification.success();
          } else if (res && !res.success) {
            notification.error({
              message: res.message,
            });
          }
        });
      }
    });
  };

  componentWillUnmount = () => {
    this.setState({
      secEOList: {
        type: 1,
        flag: true,
      },
    });
  };

  onMinus = c => {
    // minus
    const { secEOList } = this.state;
    if (secEOList.filter(item => item.flag).length > 1) {
      secEOList.forEach(sec => {
        if (sec.type === c) {
          Object.assign(sec, { flag: false });
        }
      });

      this.setState({
        secEOList,
      });
    }
  };

  onPlus = () => {
    // plus
    const { secEOList } = this.state;
    const secList = secEOList;
    let last = secEOList[secEOList.length - 1].type;
    last++;
    secList.push({ type: last, flag: true });

    this.setState({
      secEOList: secList,
    });
  };

  renderEOList = value => {
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
                label={intl.get(`${modelPrompt}.secondaryEoId`).d('副EO编码')}
              >
                {getFieldDecorator(`secondaryEoIds${item.type}`, {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.secondaryEoId`).d('副EO编码'),
                      }),
                    },
                  ],
                })(<Lov code="MT.EO" queryParams={{ tenantId }} />)}
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
      form,
      visible,
      onCancel,
      loading,
      execute: { displayList = {} },
    } = this.props;
    const { eoNum } = displayList;
    const { getFieldDecorator } = form;
    const { secEOList } = this.state;
    return (
      <Modal
        destroyOnClose
        width={360}
        title={intl.get('tarzan.workshop.execute.title.merge').d('EO合并')}
        visible={visible}
        onCancel={onCancel}
        onOk={this.saveSplit}
        confirmLoading={loading}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Form>
          <Row>
            <Col span={2} />
            <Col>
              <FormItem
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.primaryEoId`).d('主EO编码')}
              >
                {getFieldDecorator('eoNum', {
                  initialValue: eoNum,
                })(<Input disabled />)}
              </FormItem>
            </Col>
          </Row>
          {this.renderEOList(secEOList)}
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
