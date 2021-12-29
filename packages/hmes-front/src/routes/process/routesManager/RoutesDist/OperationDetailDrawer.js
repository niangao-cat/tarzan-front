/**
 * routeLinkDetails 类型设置: 工艺
 * @date: 2019-8-20
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Switch, Modal, Tabs, InputNumber } from 'hzero-ui';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import { Bind } from 'lodash-decorators';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import notification from 'utils/notification';
import ComponentSettings from './OperationDetailsTabs/ComponentSettings';
import SubstepSettings from './OperationDetailsTabs/SubstepSettings';

const modelPrompt = 'tarzan.process.routes.model.routes';
const { TabPane } = Tabs;

@connect(({ routes }) => ({
  routes,
}))
@formatterCollections({ code: 'tarzan.process.routes' })
@Form.create()
export default class OperationDetailDrawer extends React.PureComponent {
  state = {
    operationName: '', // 工艺路线编码名称
  };

  componentDidMount() {
    if (this.props.dataSource.operationId) {
      this.getOperationDetails(this.props.dataSource.operationId);
    } else {
      const { form } = this.props;
      form.resetFields();
    }
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

  @Bind()
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

  @Bind()
  onCancel = () => {
    this.props.onCancel('operationDetailsVisible');
  };

  componentSettingsRef = ref => {
    this.comSetting = ref;
  };

  substepSettingsRef = ref => {
    this.subSetting = ref;
  };

  render() {
    const { form, visible, canEdit, dataSource = {} } = this.props;
    const { operationName } = this.state;
    const {
      specialInstruction = '',
      requiredTimeInProcess = '',
      mtRouterOperationComponentDTO = [],
      mtRouterSubstepDTO = [],
    } = dataSource;
    const { getFieldDecorator } = form;
    const ComponentSettingsProps = {
      componentList: mtRouterOperationComponentDTO,
      canEdit,
    };
    const SubstepSettingsProps = {
      componentList: mtRouterSubstepDTO,
      canEdit,
    };
    const tenantId = getCurrentOrganizationId();
    return (
      <Modal
        destroyOnClose
        width={1080}
        title={intl.get('tarzan.process.routes.title.routerLink').d('类型设置: 工艺')}
        //  groupType
        //  operationTyle
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
                label={intl.get(`${modelPrompt}.operationId`).d('工艺')}
              >
                {getFieldDecorator('operationId', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.operationId`).d('工艺路线编码'),
                      }),
                    },
                  ],
                })(
                  <Lov
                    disabled={!canEdit}
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
                {getFieldDecorator('requiredTimeInProcess', {
                  initialValue: requiredTimeInProcess,
                })(
                  <InputNumber
                    disabled={!canEdit}
                    precision={0}
                    min={0}
                    style={{ width: '100%' }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.specialInstruction`).d('特殊指令')}
              >
                {getFieldDecorator('specialInstruction', {
                  initialValue: specialInstruction,
                })(<Input disabled={!canEdit} />)}
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
                {getFieldDecorator('currentFlag', {})(<Switch disabled={!canEdit} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
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
          <TabPane tab={intl.get(`${modelPrompt}.subStepQuery`).d('子步骤设置')} key="field">
            <SubstepSettings {...SubstepSettingsProps} onRef={this.substepSettingsRef} />
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}
