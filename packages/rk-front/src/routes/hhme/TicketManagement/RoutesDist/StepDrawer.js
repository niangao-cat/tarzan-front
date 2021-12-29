/**
 * StepDrawer 组件行编辑抽屉
 * @date: 2019-7-25
 * @author: 许碧婷 <biting.xu@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, InputNumber, Row, Col, Switch, Select } from 'hzero-ui';
import {
  FORM_COL_2_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import uuid from 'uuid/v4';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';

const modelPrompt = 'tarzan.process.routes.model.routes';

const tenantId = getCurrentOrganizationId();

@connect(({ routes }) => ({
  routes,
}))
@Form.create()
export default class StepDrawer extends React.Component {
  state = {
    stateMtRouterReturnStepDTO: {}, //  记录mtRouterReturnStepDTO,保持和form里数据一样，控制select和Lov
  };

  componentDidMount = () => {
    const { dataSource = {} } = this.props;
    const {
      mtRouterReturnStepDTO = {}, //  返回步骤策略  包含了  返回步骤指定工艺
    } = dataSource;
    this.setState({
      stateMtRouterReturnStepDTO: mtRouterReturnStepDTO || {},
    });
  };

  //  保存工艺步骤
  handleOK = () => {
    const {
      dispatch,
      form,
      routes: { stepsList = [], selectedRouterType },
      dataSource = {},
      onCancel,
    } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        //  判断步骤识别码是否有重复
        const findedIndex = stepsList.findIndex(
          item => item.stepName === values.stepName && item.uuid !== dataSource.uuid
        );
        if (findedIndex > -1) {
          notification.error({
            message: intl
              .get(`${modelPrompt}.repeatedStepName`)
              .d('步骤识别码存在重复，请修改后再保存'),
          });
          return;
        }
        //  判断过意路线类型是否为特殊类型或者不良代码类型
        const pertainFlag = ['SPECIAL', 'NC'].includes(selectedRouterType);

        if (
          !pertainFlag &&
          values.mtRouterReturnStepDTO &&
          values.mtRouterReturnStepDTO.returnType
        ) {
          //  当工艺路线类型为'SPECIAL', 'NC'时，才可以选择返回步骤策略
          notification.error({
            message: intl
              .get(`${modelPrompt}.repeatedEntryFlag`)
              .d('工艺路线不为特殊类型或不良代码类型，不允许选择返回步骤策略'),
          });
          return;
        }

        if (pertainFlag && values.routerDoneStepFlag === 'Y') {
          //  当工艺路线类型为'SPECIAL', 'NC'时，不可以选择完成步骤
          notification.error({
            message: intl
              .get(`${modelPrompt}.repeatedEntryFlag`)
              .d('工艺路线为特殊类型或不良代码类型时，不允许选择完成步骤'),
          });
          return;
        }

        if (values.entryStepFlag === 'Y') {
          //  判断入口步骤是否唯一
          const findedEntryFlagIndex = stepsList.findIndex(
            item => item.entryStepFlag === 'Y' && item.uuid !== dataSource.uuid
          );
          if (findedEntryFlagIndex > -1) {
            notification.error({
              message: intl
                .get(`${modelPrompt}.repeatedEntryFlag`)
                .d('工艺路线只有且仅有一个入口步骤，请修改后再保存'),
            });
            return;
          }
        }
        let newStepList = [];
        if (dataSource.uuid) {
          newStepList = stepsList.map(item => {
            if (item.uuid === dataSource.uuid) {
              return { ...item, ...values };
            } else {
              return item;
            }
          });
        } else {
          newStepList = [{ ...values, uuid: uuid(), routerStepId: '' }, ...stepsList];
        }
        dispatch({
          type: 'routes/updateState',
          payload: {
            stepsList: newStepList,
          },
        });
        onCancel();
      }
    });
  };

  //  切换返回步骤策略
  changeReturnStep = value => {
    const { form } = this.props;
    const { setFieldsValue } = form;
    this.setState({
      stateMtRouterReturnStepDTO: {
        returnType: value,
      },
    });
    setFieldsValue({
      mtRouterReturnStepDTO: {
        returnType: value,
      },
    });
  };

  //  选择返回步骤指定工艺
  changeCode = (val, values) => {
    const { stateMtRouterReturnStepDTO } = this.state;
    const { form } = this.props;
    const { setFieldsValue } = form;
    this.setState(
      {
        stateMtRouterReturnStepDTO: {
          ...stateMtRouterReturnStepDTO,
          operationId: values ? values.operationId : '',
          operationName: values ? values.operationName : '',
        },
      },
      () => {
        setFieldsValue({
          mtRouterReturnStepDTO: {
            ...this.state.stateMtRouterReturnStepDTO,
            operationId: values ? values.operationId : '',
            operationName: values ? values.operationName : '',
          },
        });
      }
    );
  };

  render() {
    const { stateMtRouterReturnStepDTO } = this.state;
    const {
      visible,
      form,
      dataSource = {},
      routes: {
        stepTypeList = [],
        stepDecisionList = [],
        returnTypeList = [],
        // selectedRouterType = '',
      },
      onCancel,
    } = this.props;
    const { getFieldDecorator } = form;
    const {
      sequence = null, //  步骤顺序
      stepName = null, //  步骤识别码
      description = null, //  步骤描述
      routerStepType = null, //  步骤类型
      entryStepFlag = 'N', //  入口步骤
      queueDecisionType = null, //  路径选择策略
      routerDoneStepFlag = 'N', //  完成步骤
      keyStepFlag = 'N', //  关键步骤
      mtRouterReturnStepDTO = {}, //  返回步骤策略  包含了  返回步骤指定工艺
    } = dataSource;
    return (
      <Modal
        destroyOnClose
        width={720}
        title={intl.get('tarzan.process.routes.title.stepDrawer').d('工艺步骤编辑')}
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleOK}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Form>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.sequence`).d('步骤顺序')}
              >
                {getFieldDecorator(`sequence`, {
                  initialValue: sequence,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.sequence`).d('步骤顺序'),
                      }),
                    },
                  ],
                })(<InputNumber precision={0} min={0} style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.stepName`).d('步骤识别码')}
              >
                {getFieldDecorator(`stepName`, {
                  initialValue: stepName,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.stepName`).d('步骤识别码'),
                      }),
                    },
                  ],
                })(<Input style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.description`).d('步骤描述')}
              >
                {getFieldDecorator(`description`, {
                  initialValue: description,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.description`).d('步骤描述'),
                      }),
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.routerStepType`).d('步骤类型')}
              >
                {getFieldDecorator(`routerStepType`, {
                  initialValue: routerStepType,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.routerStepType`).d('步骤类型'),
                      }),
                    },
                  ],
                })(
                  <Select style={{ width: '100%' }}>
                    {stepTypeList.map(ele => (
                      <Select.Option value={ele.typeCode}>{ele.description}</Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ display: 'none' }}>
            <Col>
              <Form.Item>
                {getFieldDecorator(`mtRouterReturnStepDTO`, {
                  initialValue: mtRouterReturnStepDTO,
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.mtRouterReturnStepDTO`).d('返回步骤策略')}
              >
                <Select
                  //  当工艺路线类型为'SPECIAL', 'NC'时，不可以选择返回步骤策略
                  // disabled={['SPECIAL', 'NC'].includes(selectedRouterType)}
                  style={{ width: '100%' }}
                  value={stateMtRouterReturnStepDTO.returnType}
                  onChange={value => this.changeReturnStep(value)}
                  allowClear
                >
                  {returnTypeList.map(ele => (
                    <Select.Option value={ele.typeCode}>{ele.description}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.returnOperationId`).d('返回步骤指定工艺')}
              >
                <Lov
                  //  当返回步骤策略为DESIGNATED_OPERATION时，才可选择返回步骤指定工艺
                  code="MT.OPERATION"
                  textValue={stateMtRouterReturnStepDTO.operationName || null}
                  value={stateMtRouterReturnStepDTO.operationId || null}
                  onChange={(value, values) => this.changeCode(value, values)}
                  queryParams={{ tenantId }}
                  disabled={stateMtRouterReturnStepDTO.returnType !== 'DESIGNATED_OPERATION'}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.queueDecisionType`).d('路径选择策略')}
              >
                {getFieldDecorator(`queueDecisionType`, {
                  initialValue: queueDecisionType,
                })(
                  <Select style={{ width: '100%' }} allowClear>
                    {stepDecisionList.map(ele => (
                      <Select.Option value={ele.typeCode}>{ele.description}</Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.entryStepFlag`).d('入口步骤')}
              >
                {getFieldDecorator(`entryStepFlag`, {
                  initialValue: entryStepFlag,
                })(
                  <Switch
                    checkedValue="Y"
                    unCheckedValue="N"
                    defaultChecked={entryStepFlag === 'Y'}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.routerDoneStepFlag`).d('完成步骤')}
              >
                {getFieldDecorator(`routerDoneStepFlag`, {
                  initialValue: routerDoneStepFlag,
                })(
                  <Switch
                    //  当工艺路线类型不为'SPECIAL', 'NC'时，可以选择完成步骤
                    // disabled={['SPECIAL', 'NC'].includes(selectedRouterType)}routerDoneStepFlag
                    checkedValue="Y"
                    unCheckedValue="N"
                    defaultChecked={entryStepFlag === 'Y'}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.keyStepFlag`).d('关键步骤')}
              >
                {getFieldDecorator(`keyStepFlag`, {
                  initialValue: keyStepFlag,
                })(
                  <Switch
                    checkedValue="Y"
                    unCheckedValue="N"
                    defaultChecked={keyStepFlag === 'Y'}
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
