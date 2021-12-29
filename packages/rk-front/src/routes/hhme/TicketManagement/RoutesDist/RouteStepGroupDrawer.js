/**
 * routeLinkDetails 类型设置: 步骤组
 * @date: 2019-8-20
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, InputNumber, Popconfirm, Select, Modal, Input, Row, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import EditTable from 'components/EditTable';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import uuid from 'uuid/v4';
import {
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
  FORM_COL_4_LAYOUT,
} from 'utils/constants';
import AttributeDrawer from '@/components/AttributeDrawer';
import OperationDetailDrawer from './OperationDetailDrawer';

const modelPrompt = 'tarzan.process.routes.model.routes';
const { Option } = Select;
const TABLENAME = 'mt_router_step_group_step_attr';

@connect(({ routes }) => ({
  routes,
}))
@formatterCollections({ code: 'tarzan.process.routes' })
@Form.create()
export default class RouteStepGroupDrawer extends React.PureComponent {
  state = {
    stepGroupType: '', // 步骤组类型
    tableList: [], // 表格数据
    attrVisible: false, // 表格扩展字段控制
    currentExtendData: {}, //  记录打开扩展字段行的数据
    operationDetailsVisible: false, // 工艺设置抽屉控制
    typeDetailsInfo: {}, // 工艺设置抽屉初始数据
    typeDetailsId: '', // 提供数据的工艺步骤Id
    editing: false, //  记录行数据是否在编辑状态下打开工艺设置抽屉
  };

  componentDidMount() {
    const {
      dataSource: { mtRouterStepGroupStepDTO = [], routerStepGroupType = '' },
    } = this.props;
    const tableList = mtRouterStepGroupStepDTO.map(item => {
      return {
        ...item,
        uuid: uuid(),
      };
    });
    this.setState({
      tableList,
      stepGroupType: routerStepGroupType,
    });
  }

  /**
   * 新建行
   */
  @Bind()
  handleCreate() {
    const { tableList } = this.state;
    this.setState({
      tableList: [
        {
          routerStepGroupStepId: '',
          stepName: '',
          stepDesc: '',
          queueDecisionType: '',
          sequence: tableList.length + 1,
          stepSequence: null,
          _status: 'create',
          uuid: uuid(),
        },
        ...tableList,
      ],
    });
  }

  /**
   *@functionName deleteData
   *@params {Object} record 删除的数据详情
   *@params {Number} index 删除的数据下标
   *@description 删除工艺步骤
   *@author 唐加旭
   *@date 2019-10-08 19:21:14
   *@version V0.8.6
   * */
  deleteData = index => {
    const newTableList = this.state.tableList;
    newTableList.splice(index, 1);
    this.setState({
      tableList: [...newTableList],
    });
  };

  /**
   * 编辑对象属性
   */
  @Bind()
  handleEdit(record, flag) {
    const { tableList } = this.state;
    const newList = tableList.map(item => {
      if (record.uuid === item.uuid) {
        return { ...item, _status: flag ? 'update' : '' };
      } else {
        return item;
      }
    });
    this.setState({
      tableList: newList,
    });
  }

  // 取消编辑对象属性
  @Bind()
  handleCleanLine(index) {
    const { tableList } = this.state;
    tableList.splice(index, 1);
    this.setState({
      tableList: [...tableList],
    });
  }

  // 保存编辑行
  @Bind()
  handleSaveLine(record, index) {
    const { tableList } = this.state;
    const newList = JSON.parse(JSON.stringify(tableList));
    record.$form.validateFields((err, values) => {
      if (!err) {
        newList[index] = {
          ...tableList[index],
          ...values,
          _status: '',
        };
        this.setState({
          tableList: newList,
        });
      }
    });
  }

  /**
   *@functionName   operationModalOpen
   *@description 打开工艺设置模态框
   *@author 唐加旭
   *@param editing 是否处于编辑状态  处于=true
   *@date 2019-10-09 10:41:33
   *@version V0.8.6
   * */
  operationModalOpen = (record, editing) => {
    if (editing) {
      this.setState({
        editing,
        operationDetailsVisible: true,
        typeDetailsInfo: record.$form.getFieldValue('mtRouterOperationDTO') || {},
        typeDetailsId: record.routerStepGroupStepId,
      });
    } else {
      this.setState({
        editing,
        operationDetailsVisible: true,
        typeDetailsInfo: record.mtRouterOperationDTO || {},
        typeDetailsId: record.routerStepGroupStepId,
      });
    }
  };

  /**
   *@functionName   quietNest
   *@description 退出模态框
   *@author 唐加旭
   *@date 2019-10-09 10:41:33
   *@version V0.8.6
   * */
  quietNest = visibleProps => {
    this.setState({
      [visibleProps]: false,
    });
  };

  /**
   *@functionName  routeLinkHandle
   *@params {Object} record 选择的参数
   *@description 设置好对应的类型详情
   *@author 唐加旭
   *@date 2019-10-09 10:43:14
   *@version V0.8.6
   * */
  routeLinkHandle = (values, recordId, type, visible) => {
    const { tableList } = this.state;
    tableList.map(item => {
      if (item.routerStepGroupStepId === recordId) {
        item.$form.setFieldsValue({
          [type]: { ...values },
        });
      }
      return item.routerStepGroupStepId;
    });
    this.setState({
      tableList,
      [visible]: false,
    });
  };

  /**
   *@functionName extendModalOpen
   *@params {Object} record 编辑扩展字段的数据详情
   *@description 开打扩展字段详情
   *@author 唐加旭
   *@date 2019-10-08 20:00:13
   *@version V0.8.6
   * */
  extendModalOpen = record => {
    if (!record.routerStepGroupStepId) {
      Modal.warning({
        title: intl
          .get('tarzan.process.routesManager.message.saveFirst')
          .d('请先保存已维护的工艺路线数据'),
      });
      return null;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'routes/featchTableAttrList',
      payload: {
        kid: record.routerStepGroupStepId,
        tableName: TABLENAME,
      },
    }).then(res => {
      if (res && res.success) {
        this.setState({
          attrVisible: true,
          currentExtendData: record,
        });
      }
    });
  };

  /**
   *@functionName extendModalClose
   *@description 关闭扩展字段模态框
   *@author 唐加旭
   *@date 2019-10-08 20:03:38
   *@version V0.8.6
   * */
  extendModalClose = () => {
    this.setState({
      attrVisible: false,
      currentExtendData: {},
    });
  };

  /**
   *@functionName handleOnOk
   *@description 确定编辑扩展字段
   *@author 唐加旭
   *@date 2019-10-08 20:04:49
   *@version V0.8.6
   * */
  handleOnOk = dataSource => {
    const { dispatch } = this.props;
    const { currentExtendData } = this.state;
    dispatch({
      type: 'routes/saveTableAttrList',
      payload: {
        kid: currentExtendData.routerStepGroupStepId,
        attrs: dataSource,
        tableName: TABLENAME,
      },
    }).then(res => {
      if (res && res.success) {
        notification.success();
        this.extendModalClose();
      } else if (res) {
        notification.error({
          message: res.message,
        });
      }
    });
  };

  @Bind()
  handleOK = () => {
    const { stepGroupType, tableList } = this.state;
    const { form } = this.props;
    if (tableList.length < 2) {
      notification.error({
        message: '步骤组内必须有两个或两个以上步骤',
      });
    }
    form.validateFields(err => {
      if (!err && tableList.length >= 2) {
        const { routeLinkHandle, dataSourceId } = this.props;
        const mtRouterStepGroupDTO = {
          routerStepGroupType: stepGroupType,
          mtRouterStepGroupStepDTO: tableList,
        };
        routeLinkHandle(
          mtRouterStepGroupDTO,
          dataSourceId,
          'mtRouterStepGroupDTO',
          'routeStepGroupVisible'
        );
      }
    });
  };

  @Bind()
  onCancel = () => {
    this.props.onCancel('routeStepGroupVisible');
  };

  @Bind()
  changeReturnStep = value => {
    this.setState({
      stepGroupType: value,
    });
  };

  render() {
    const {
      form,
      canEdit,
      visible,
      routes: { stepGroupTypeList = [], stepDecisionList = [], tabbleAttrList = [] },
    } = this.props;
    const { getFieldDecorator } = form;
    const {
      stepGroupType,
      tableList,
      attrVisible,
      operationDetailsVisible,
      typeDetailsInfo,
      typeDetailsId,
    } = this.state;
    const columns = [
      {
        title: (
          <Button
            style={{ backgroundColor: '#548FFC', color: '#fff' }}
            icon="plus"
            shape="circle"
            size="small"
            disabled={!canEdit}
            onClick={this.handleCreate}
          />
        ),
        align: 'center',
        width: 60,
        render: (val, record, index) =>
          !canEdit ? (
            <Button icon="minus" shape="circle" size="small" disabled />
          ) : (
            <Popconfirm
              title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
              onConfirm={this.deleteData.bind(this, index)}
            >
              <Button icon="minus" shape="circle" size="small" />
            </Popconfirm>
          ),
      },
      {
        title: intl.get(`${modelPrompt}.stepName`).d('步骤识别码'),
        dataIndex: 'stepName',
        width: 100,
        render: (val, record) => {
          if (['create', 'update'].includes(record._status)) {
            if (!record.$form.getFieldsValue().mtRouterOperationDTO) {
              record.$form.getFieldDecorator('mtRouterOperationDTO', {
                initialValue: record.mtRouterOperationDTO,
              });
            }
            return (
              <Form.Item>
                {record.$form.getFieldDecorator(`stepName`, {
                  initialValue: val,
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
            );
          } else {
            return val;
          }
        },
      },
      {
        title: intl.get(`${modelPrompt}.stepDesc`).d('步骤描述'),
        dataIndex: 'stepDesc',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`stepDesc`, {
                initialValue: record.stepDesc,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.stepDesc`).d('步骤描述'),
                    }),
                  },
                ],
              })(<Input />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.queueDecisionType`).d('路径选择策略'),
        dataIndex: 'queueDecisionType',
        width: 170,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`queueDecisionType`, {
                initialValue: record.queueDecisionType,
              })(
                <Select style={{ width: '100%' }}>
                  {stepDecisionList.map(ele => (
                    <Option value={ele.typeCode}>{ele.description}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            (stepDecisionList.filter(ele => ele.typeCode === val)[0] || {}).description
          ),
      },
      {
        title: intl.get(`${modelPrompt}.stepSequence`).d('步骤顺序'),
        dataIndex: 'stepSequence',
        width: 120,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`stepSequence`, {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.stepSequence`).d('步骤顺序'),
                    }),
                  },
                ],
              })(<InputNumber precision={0} min={0} style={{ width: '100%' }} />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.sequence`).d('步骤组步骤顺序'),
        dataIndex: 'sequence',
        width: 80,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`sequence`, {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.sequence`).d('步骤组步骤顺序'),
                    }),
                  },
                ],
              })(<InputNumber precision={0} min={0} style={{ width: '100%' }} />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.operationSetting`).d('工艺设置'),
        dataIndex: 'operationSetting',
        align: 'center',
        width: 100,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <a onClick={this.operationModalOpen.bind(this, record, true)}>工艺设置</a>
          ) : (
            <a onClick={this.operationModalOpen.bind(this, record, false)}>工艺设置</a>
          ),
      },
      {
        title: intl.get(`${modelPrompt}.siteCode`).d('扩展字段'),
        dataIndex: 'nextStep',
        align: 'center',
        width: 100,
        render: (val, record) => <a onClick={this.extendModalOpen.bind(this, record)}>扩展字段</a>,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 140,
        align: 'center',
        render: (val, record, index) => (
          <span className="action-link">
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a disabled={!canEdit} onClick={() => this.handleEdit(record, true)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
            )}
            {record._status === 'update' && (
              <>
                <a onClick={() => this.handleEdit(record, false)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSaveLine(record, index)}>
                  {intl.get('hzero.common.button.save').d('保存')}
                </a>
              </>
            )}
            {record._status === 'create' && (
              <>
                <a onClick={() => this.handleCleanLine(index)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSaveLine(record, index)}>
                  {intl.get('hzero.common.button.save').d('保存')}
                </a>
              </>
            )}
          </span>
        ),
      },
    ];
    const operationDetailsProps = {
      canEdit: !!this.state.editing,
      visible: operationDetailsVisible,
      onCancel: this.quietNest,
      routeLinkHandle: this.routeLinkHandle,
      dataSource: typeDetailsInfo || {},
      dataSourceId: typeDetailsId,
    };
    // 扩展字段参数
    const attributeDrawerProps = {
      visible: attrVisible,
      tableName: TABLENAME,
      canEdit,
      attrList: tabbleAttrList,
      onCancel: this.extendModalClose,
      onSave: this.handleOnOk,
    };
    return (
      <Modal
        destroyOnClose
        width={1080}
        title={intl.get('tarzan.process.routes.title.routerStepGroupLink').d('类型设置: 步骤组')}
        visible={visible}
        onCancel={this.onCancel}
        onOk={this.handleOK}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Form className={SEARCH_FORM_CLASSNAME}>
          <Row style={{ marginBottom: 30 }} {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                label={intl.get(`${modelPrompt}.routerStepGroupType`).d('步骤组类型')}
                {...SEARCH_FORM_ITEM_LAYOUT}
              >
                {getFieldDecorator('stepGroupType', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.routerStepGroupType`).d('步骤组类型'),
                      }),
                    },
                  ],
                  initialValue: stepGroupType,
                })(
                  <Select
                    disabled={!canEdit}
                    style={{ width: 200 }}
                    value={stepGroupType}
                    onChange={this.changeReturnStep}
                  >
                    {stepGroupTypeList.map(ele => (
                      <Option value={ele.typeCode}>{ele.description}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <EditTable
          bordered
          rowKey="uuid"
          columns={columns}
          dataSource={tableList}
          pagination={false}
        />
        {attrVisible && <AttributeDrawer {...attributeDrawerProps} />}
        {operationDetailsVisible && <OperationDetailDrawer {...operationDetailsProps} />}
      </Modal>
    );
  }
}
