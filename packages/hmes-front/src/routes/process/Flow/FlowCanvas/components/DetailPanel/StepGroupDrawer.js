/**
 * routeLinkDetails 类型设置: 步骤组
 * @date: 2020-2-19
 * @author: dong.li <dong.li04@hand-china.com>
 * @copyright Copyright (c) 2020, Hand
 */
/* eslint-disable */
import React from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Modal, InputNumber, Select, Divider, Table } from 'hzero-ui';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import notification from 'utils/notification';

const modelPrompt = 'tarzan.process.routes.model.routes';

@connect(({ flow }) => ({
  flow,
}))
@formatterCollections({ code: 'tarzan.process.routes' })
@Form.create()
export default class StepGroupDrawer extends React.PureComponent {
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
    this.props.onCancel();
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
    const stepGroupTypes = [
      {
        typeCode: '1',
        description: '同时发生组',
      },
      {
        typeCode: '2',
        description: '任意顺序组',
      },
    ];
    const areaList = [];
    const columns = [
      {
        title: intl.get(`${modelPrompt}.areaName`).d('步骤识别码'),
        dataIndex: 'areaName',
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('步骤描述'),
        dataIndex: 'description',
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('路径选择策略'),
        dataIndex: 'enableFlag',
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('步骤顺序'),
        dataIndex: 'enableFlag',
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('步骤组步骤顺序'),
        dataIndex: 'enableFlag',
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('工艺编码'),
        dataIndex: 'enableFlag',
        align: 'center',
      },
    ];

    const tenantId = getCurrentOrganizationId();
    return (
      <Modal
        destroyOnClose
        width={1080}
        title={intl.get('tarzan.process.routes.title.routerLink').d('类型设置: 步骤组')}
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
                {getFieldDecorator('operationId15', {
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
                {getFieldDecorator('requiredTimeInProcesss5', {
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
                label={intl.get(`${modelPrompt}.revision5`).d('步骤描述')}
              >
                {getFieldDecorator('requiredTimeInProcess17', {
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
                label={intl.get(`${modelPrompt}.currentFlag5`).d('路径选择策略')}
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
                label={intl.get(`${modelPrompt}.currentFlag57`).d('步骤组类型')}
              >
                {getFieldDecorator('currentFlag', {})(
                  <Select style={{ width: '100%' }} allowClear>
                    {stepGroupTypes.map(item => (
                      <Select.Option value={item.typeCode} key={item.typeCode}>
                        {item.description}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Table dataSource={areaList} columns={columns} bordered />
        </Form>
      </Modal>
    );
  }
}
/* eslint-disable */
