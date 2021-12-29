/**
 * routeLinkDetails 类型设置: 工艺
 * @date: 2020-2-18
 * @author: dong.li <dong.li04@hand-china.com>
 * @copyright Copyright (c) 2020, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Switch, Modal, Tabs, InputNumber, Divider, Select } from 'hzero-ui';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import notification from 'utils/notification';
import ComponentSettings from './ComponentSettings';

const modelPrompt = 'tarzan.process.routes.model.routes';
const { TabPane } = Tabs;

@connect(({ flow }) => ({
  flow,
}))
@formatterCollections({ code: 'tarzan.process.routes' })
@Form.create()
export default class TechniqueDrawer extends React.PureComponent {
  state = {
    operationName: '', // 工艺路线编码名称
  };

  componentDidMount() {
    // if (this.props.dataSource.operationId) {
    //   this.getOperationDetails(this.props.dataSource.operationId);
    // } else {
    const { form } = this.props;
    form.resetFields();
    // }
  }

  //  根据工艺ID获取工艺基础信息
  getOperationDetails = operationId => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'routes/fetchOperationDetails',
      payload: {
        operationId,
      },
    }).then(res => {
      if (res && res.success) {
        if (res.rows) {
          this.setState({
            operationName: res.rows.operationName,
          });
          form.setFieldsValue({
            operationId: res.rows.operationId,
            revision: res.rows.revision,
            currentFlag: res.rows.currentFlag === 'Y',
            description: res.rows.description,
            routerStatus: res.rows.routerStatus,
            dateFrom: res.rows.dateFrom,
            dateTo: res.rows.dateTo,
          });
        } else {
          return true;
        }
      } else {
        notification.error({ message: res.message });
      }
    });
  };

  handleOK = () => {
    const { form, routeLinkHandle, dataSourceId, dataSource = {} } = this.props;
    const { mtRouterSubstepDTO = [] } = dataSource;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const mtRouterOperationDTO = {
          ...values,
          currentFlag: values.currentFlag ? 'Y' : 'N',
          mtRouterOperationComponentDTO: this.comSetting.state.tableList,
          mtRouterSubstepDTO: this.subSetting
            ? this.subSetting.state.tableList
            : mtRouterSubstepDTO,
        };
        routeLinkHandle(
          mtRouterOperationDTO,
          dataSourceId,
          'mtRouterOperationDTO',
          'operationDetailsVisible'
        );
      }
    });
  };

  onCancel = () => {
    this.props.onCancel('operationDetailsVisible');
  };

  componentSettingsRef = ref => {
    this.comSetting = ref;
  };

  render() {
    const { form, visible, canEdit, dataSource = {} } = this.props;
    const { operationName } = this.state;
    const {
      specialInstruction = '',
      requiredTimeInProcess = '',
      mtRouterOperationComponentDTO = [],
    } = dataSource;
    const { getFieldDecorator } = form;
    const ComponentSettingsProps = {
      componentList: mtRouterOperationComponentDTO,
      canEdit,
    };
    const stepDecisionList = [
      {
        typeCode: '1',
        description: '完工操作员',
      },
      {
        typeCode: '2',
        description: '下一步操作员',
      },
    ];

    const tenantId = getCurrentOrganizationId();
    return (
      <Modal
        destroyOnClose
        width={1080}
        title={intl.get('tarzan.process.routes.title.routerLink').d('类型设置: 工艺')}
        visible={visible}
        onCancel={this.onCancel}
        onOk={this.handleOK}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Form>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.operationId`).d('步骤识别码')}
              >
                {getFieldDecorator('operationId1', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.operationId`).d('步骤识别码'),
                      }),
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.requiredTimeInProcess`).d('步骤顺序')}
              >
                {getFieldDecorator('requiredTimeInProcesss', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.operationId`).d('步骤顺序'),
                      }),
                    },
                  ],
                  initialValue: requiredTimeInProcess,
                })(
                  <InputNumber precision={0} min={0} style={{ width: '99%', marginLeft: '1px' }} />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.revision`).d('步骤描述')}
              >
                {getFieldDecorator('requiredTimeInProcess1', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.operationId`).d('步骤描述'),
                      }),
                    },
                  ],
                  initialValue: requiredTimeInProcess,
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.currentFlag`).d('路径选择策略')}
              >
                {getFieldDecorator('currentFlag', {})(
                  <Select style={{ width: '100%' }} allowClear>
                    {stepDecisionList.map(item => (
                      <Select.Option value={item.typeCode} key={item.typeCode}>
                        {item.description}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.operationId`).d('工艺')}
              >
                {getFieldDecorator('operationId8', {})(
                  <Lov
                    code="MT.OPERATION"
                    textValue={operationName}
                    queryParams={{ tenantId }}
                    onChange={value => {
                      this.getOperationDetails(value);
                    }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.requiredTimeInProcess`).d('工艺所需时间')}
              >
                {getFieldDecorator('requiredTimeInProcess14', {
                  initialValue: requiredTimeInProcess,
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.specialInstruction`).d('特殊指令')}
              >
                {getFieldDecorator('specialInstruction', {
                  initialValue: specialInstruction,
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.revision`).d('版本号')}
              >
                {getFieldDecorator('revision', {})(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.currentFlag`).d('当前版本')}
              >
                {getFieldDecorator('currentFlag', {})(<Switch />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.description`).d('工艺描述')}
              >
                {getFieldDecorator('description', {})(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.routerStatus`).d('工艺状态')}
              >
                {getFieldDecorator('routerStatus', {})(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.dateFrom`).d('生效时间')}
              >
                {getFieldDecorator('dateFrom', {})(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.dateTo`).d('失效时间')}
              >
                {getFieldDecorator('dateTo', {})(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Tabs defaultActiveKey="sites">
          <TabPane tab={intl.get(`${modelPrompt}.componentSettings`).d('组件设置')} key="sites">
            <ComponentSettings {...ComponentSettingsProps} onRef={this.componentSettingsRef} />
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}
