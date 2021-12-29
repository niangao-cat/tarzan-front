/**
 * WorkCellDist - 工作单元明细编辑
 * @date: 2019-8-9
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Form, Row, Col, Input, Switch } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import intl from 'utils/intl';
import { isUndefined } from 'lodash';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';

import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import TLEditor from '@/components/TLEditor';

const modelPrompt = 'tarzan.org.enterprise.model.enterprise';

/**
 * 工作单元明细编辑
 * @extends {Component} - React.Component
 * @reactProps {Object} relationMaintainDrawer - 数据源
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(({ relationMaintainDrawer }) => ({
  relationMaintainDrawer,
}))
@formatterCollections({ code: 'tarzan.org.enterprise' })
@Form.create({ fieldNameProp: null })
export default class WorkCellBlock extends React.Component {
  form;

  planTab;

  produceTab;

  componentDidMount() {
    this.props.onRef(this);
    const { dispatch, itemId } = this.props;
    dispatch({
      type: 'relationMaintainDrawer/fetchEnterpriseDetails',
      payload: {
        enterpriseId: itemId,
      },
    });
  }

  // 保存全部
  @Bind
  handleSaveAll() {
    const { form, dispatch, itemId } = this.props;
    form.validateFields((err, fieldsValue) => {
      const parmas = fieldsValue;
      parmas.enableFlag = parmas.enableFlag ? 'Y' : 'N';
      if (!err) {
        dispatch({
          type: 'relationMaintainDrawer/saveEnterprise',
          payload: {
            enterpriseId: itemId,
            ...parmas,
          },
        }).then(res => {
          if (res && res.success) {
            notification.success();
            this.props.saveSuccessCallBack();
          } else {
            notification.error({ message: res.message });
          }
        });
      }
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      form,
      componentDisabled,
      itemId,
      relationMaintainDrawer: { enterpriseDetailsInfo = {} },
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <React.Fragment>
        <Form>
          <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ margin: 0 }}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.enterpriseCode`).d('企业编码')}
              >
                {getFieldDecorator('enterpriseCode', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.enterpriseCode`).d('企业编码'),
                      }),
                    },
                  ],
                  initialValue: enterpriseDetailsInfo.enterpriseCode,
                })(
                  <Input
                    typeCase="upper"
                    trim
                    inputChinese={false}
                    disabled={
                      itemId !== 'create'
                        ? isUndefined(componentDisabled)
                          ? true
                          : componentDisabled
                        : false
                    }
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ margin: 0 }}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.enterpriseName`).d('企业名称')}
              >
                {getFieldDecorator('enterpriseName', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.enterpriseName`).d('企业名称'),
                      }),
                    },
                  ],
                  initialValue: enterpriseDetailsInfo.enterpriseName,
                })(
                  <TLEditor
                    label={intl.get(`${modelPrompt}.enterpriseName`).d('企业名称')}
                    field="enterpriseName"
                    dto="tarzan.modeling.domain.entity.MtModEnterprise"
                    pkValue={{ enterpriseId: itemId || null }}
                    disabled={
                      itemId !== 'create'
                        ? isUndefined(componentDisabled)
                          ? true
                          : componentDisabled
                        : false
                    }
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ margin: 0 }}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.enterpriseShortName`).d('企业简称')}
              >
                {getFieldDecorator('enterpriseShortName', {
                  initialValue: enterpriseDetailsInfo.enterpriseShortName,
                })(
                  <TLEditor
                    label={intl.get(`${modelPrompt}.enterpriseShortName`).d('企业简称')}
                    field="enterpriseShortName"
                    dto="tarzan.modeling.domain.entity.MtModEnterprise"
                    pkValue={{ enterpriseId: itemId || null }}
                    disabled={
                      itemId !== 'create'
                        ? isUndefined(componentDisabled)
                          ? true
                          : componentDisabled
                        : false
                    }
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ margin: 0 }}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.enableFlag`).d('企业状态')}
              >
                {getFieldDecorator('enableFlag', {
                  initialValue: enterpriseDetailsInfo.enableFlag !== 'N',
                })(
                  <Switch
                    disabled={
                      itemId !== 'create'
                        ? isUndefined(componentDisabled)
                          ? true
                          : componentDisabled
                        : false
                    }
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}
